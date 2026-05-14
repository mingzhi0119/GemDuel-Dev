using System;
using System.Collections.Generic;
using System.Linq;
using GemDuel.Catalog;
using GemDuel.Core;
using Newtonsoft.Json.Linq;
using UnityEngine;

namespace GemDuel.Presentation
{
    public sealed class LocalDevJokerReleasePathSmokeOptions
    {
        public string Seed { get; set; } = "unity-built-player-replay-release-path-20260511";
        public int ViewportWidth { get; set; } = 1920;
        public int ViewportHeight { get; set; } = 1080;
        public int MaxSetupActions { get; set; } = 6;
        public string SelectedColor { get; set; } = "red";
    }

    public static class LocalDevJokerReleasePathSmoke
    {
        private static readonly string[] CostColors =
        {
            "red",
            "green",
            "blue",
            "white",
            "black",
            "pearl",
        };

        public static JObject Run(
            GemDuelGameController controller,
            LocalDevJokerReleasePathSmokeOptions options
        )
        {
            options = options ?? new LocalDevJokerReleasePathSmokeOptions();
            var actions = new JArray();
            var report = new JObject
            {
                ["schemaVersion"] = 1,
                ["kind"] = "unity-localdev-joker-release-path-smoke",
                ["startedAt"] = DateTime.UtcNow.ToString("O"),
                ["seed"] = options.Seed,
                ["maxSetupActions"] = options.MaxSetupActions,
                ["selectedColor"] = options.SelectedColor,
                ["viewport"] = new JObject
                {
                    ["width"] = options.ViewportWidth,
                    ["height"] = options.ViewportHeight,
                },
                ["ok"] = false,
                ["freshLaunch"] = true,
                ["usedFixtureReplayAsGameplayDriver"] = false,
                ["usedCheckpointStateReplacement"] = false,
                ["actions"] = actions,
            };

            GameObject reviewRoot = null;
            try
            {
                controller.SetAutomationViewport(options.ViewportWidth, options.ViewportHeight);
                var setup = LocalDevProductSurfaceSmoke.Run(
                    controller,
                    new LocalDevProductSurfaceSmokeOptions
                    {
                        Seed = options.Seed,
                        MaxSteps = Math.Max(1, options.MaxSetupActions),
                        StartMode = "classic",
                        VerifyReplayReview = true,
                        IdleActionPreference = "balanced",
                    }
                );
                report["setupSmoke"] = setup.DeepClone();
                if (setup.Value<bool>("ok") != true)
                {
                    return Fail(report, "Joker setup product-surface smoke failed.", controller, options);
                }

                if (
                    setup.Value<bool>("freshLaunch") != true
                    || setup.Value<bool>("usedFixtureReplayAsGameplayDriver") != false
                    || setup.Value<bool>("usedCheckpointStateReplacement") != false
                )
                {
                    return Fail(report, "Joker setup smoke did not preserve required fresh/live evidence flags.", controller, options);
                }

                foreach (var item in (setup["actions"] as JArray)?.OfType<JObject>() ?? Enumerable.Empty<JObject>())
                {
                    actions.Add(item.DeepClone());
                }

                var beforePreview = controller.BuildAutomationStateSnapshot(
                    options.ViewportWidth,
                    options.ViewportHeight
                );
                var beforeSnapshot = (JObject)beforePreview["snapshot"];
                var beforeReplay = (JObject)beforePreview["replay"];
                if (beforeReplay["liveRecording"] == null || beforeReplay["liveRecording"].Type == JTokenType.Null)
                {
                    return Fail(report, "Joker setup did not leave an active live replay recording.", controller, options);
                }

                if (!FindAffordableVisibleJoker(beforePreview, new CatalogLoader().LoadDefault(), out var joker))
                {
                    return Fail(report, "No affordable visible Joker market card was available after live setup.", controller, options);
                }

                if (
                    !controller.RunSemanticActionForAutomation(
                        "click_market_card",
                        new JObject { ["level"] = joker.Level, ["index"] = joker.Index },
                        out var previewError
                    )
                )
                {
                    return Fail(report, "click_market_card failed for Joker: " + previewError, controller, options);
                }

                var preview = controller.BuildAutomationStateSnapshot(
                    options.ViewportWidth,
                    options.ViewportHeight
                );
                var previewContext = preview["preview"] as JObject;
                if (
                    previewContext == null
                    || previewContext.Value<string>("source") != "market"
                    || previewContext.Value<int>("level") != joker.Level
                    || previewContext.Value<int>("index") != joker.Index
                    || previewContext.Value<string>("instanceId") != joker.InstanceId
                )
                {
                    return Fail(report, "Market Joker preview did not open for " + joker.InstanceId + ".", controller, options);
                }

                if (!HasVisibleTarget(preview, "card.preview.primaryAction"))
                {
                    return Fail(report, "Market Joker preview buy control was not visible.", controller, options);
                }

                if (
                    !controller.RunSemanticActionForAutomation(
                        "confirm_preview_action",
                        new JObject { ["actionId"] = "buy" },
                        out var buyError
                    )
                )
                {
                    return Fail(report, "confirm_preview_action buy failed for Joker: " + buyError, controller, options);
                }

                var colorSelection = controller.BuildAutomationStateSnapshot(
                    options.ViewportWidth,
                    options.ViewportHeight
                );
                AppendAction(actions, "initiate_buy_joker " + joker.InstanceId, "initiate_buy_joker", beforePreview, colorSelection);
                var colorSelectionSnapshot = (JObject)colorSelection["snapshot"];
                if (colorSelection.Value<string>("phase") != "SELECT_CARD_COLOR")
                {
                    return Fail(report, "Joker preview buy did not enter SELECT_CARD_COLOR.", controller, options);
                }

                var pendingBuy = colorSelectionSnapshot["pendingBuy"] as JObject;
                if (pendingBuy == null || pendingBuy.Value<string>("instanceId") != joker.InstanceId)
                {
                    return Fail(report, "Joker color-selection state did not expose the pending Joker buy.", controller, options);
                }

                if (!HasVisibleTarget(colorSelection, "card.color." + options.SelectedColor))
                {
                    return Fail(report, "Joker color target was not visible: " + options.SelectedColor + ".", controller, options);
                }

                if (
                    !controller.RunSemanticActionForAutomation(
                        "select_joker_color",
                        new JObject { ["color"] = options.SelectedColor },
                        out var colorError
                    )
                )
                {
                    return Fail(report, "select_joker_color failed: " + colorError, controller, options);
                }

                var afterBuy = controller.BuildAutomationStateSnapshot(
                    options.ViewportWidth,
                    options.ViewportHeight
                );
                AppendAction(actions, "select_joker_color " + options.SelectedColor, "select_joker_color", colorSelection, afterBuy);
                var afterSnapshot = (JObject)afterBuy["snapshot"];
                if (afterBuy.Value<string>("phase") == "SELECT_CARD_COLOR")
                {
                    return Fail(report, "Joker color selection left the game in SELECT_CARD_COLOR.", controller, options);
                }

                if (afterSnapshot["pendingBuy"] != null && afterSnapshot["pendingBuy"].Type != JTokenType.Null)
                {
                    return Fail(report, "Joker color selection left pendingBuy populated.", controller, options);
                }

                if (!TableauContains(afterBuy, joker.Actor, joker.InstanceId))
                {
                    return Fail(report, "Active player tableau did not contain bought Joker " + joker.InstanceId + ".", controller, options);
                }

                if (afterBuy.Value<string>("statusText") != "Applied live action | BUY_CARD")
                {
                    return Fail(report, "BUY_CARD status was not surfaced after Joker color selection.", controller, options);
                }

                var finalStateHash = CurrentStateHash(afterBuy);
                var finalRecordedEvents = RecordedEventCount(afterBuy);
                if (finalRecordedEvents != actions.Count || afterBuy.Value<int>("totalEvents") != 0)
                {
                    return Fail(report, "Joker release path did not preserve live recording counts.", controller, options);
                }

                if (!controller.ExportReplayJsonForAutomation(out var exportedJson, out var exportError))
                {
                    return Fail(report, "Replay export failed after Joker buy: " + exportError, controller, options);
                }

                var exported = JObject.Parse(exportedJson);
                var events = (JArray)exported["events"];
                if (events.Count != finalRecordedEvents)
                {
                    return Fail(
                        report,
                        "Exported replay event count changed after Joker buy: "
                            + events.Count
                            + " != "
                            + finalRecordedEvents
                            + ".",
                        controller,
                        options
                    );
                }

                var eventTypes = new JArray(events.Select(item => item.Value<string>("type")));
                var initiateIndex = FindEventIndex(events, "initiate_buy_joker", joker.InstanceId);
                var buyIndex = FindEventIndex(events, "buy_card", joker.InstanceId);
                if (initiateIndex < 0 || buyIndex < 0 || buyIndex <= initiateIndex)
                {
                    return Fail(
                        report,
                        "Exported replay did not contain ordered initiate_buy_joker and buy_card events.",
                        controller,
                        options
                    );
                }

                var exportedHash = ((JObject)exported["summary"]).Value<string>("finalStateHash");
                if (exportedHash != finalStateHash)
                {
                    return Fail(
                        report,
                        "Exported replay final hash mismatch after Joker buy: "
                            + exportedHash
                            + " != "
                            + finalStateHash,
                        controller,
                        options
                    );
                }

                reviewRoot = new GameObject("GemDuel Joker Release Path Replay Review");
                var review = reviewRoot.AddComponent<GemDuelGameController>();
                if (!review.ImportReplayJsonForAutomation(exportedJson, out var importError))
                {
                    return Fail(report, "Replay review import failed after Joker buy: " + importError, controller, options);
                }

                if (!review.PlayReplayToEndForAutomation(out var reviewError))
                {
                    return Fail(report, "Replay review playback failed after Joker buy: " + reviewError, controller, options);
                }

                var reviewed = review.BuildAutomationStateSnapshot(options.ViewportWidth, options.ViewportHeight);
                var reviewedHash = CurrentStateHash(reviewed);
                if (reviewedHash != exportedHash)
                {
                    return Fail(
                        report,
                        "Replay review hash mismatch after Joker buy: "
                            + reviewedHash
                            + " != "
                            + exportedHash,
                        controller,
                        options
                    );
                }

                report["beforePreviewStateSummary"] = BuildStateSummary(beforePreview);
                report["colorSelectionStateSummary"] = BuildStateSummary(colorSelection);
                report["afterBuyStateSummary"] = BuildStateSummary(afterBuy);
                report["jokerSummary"] = new JObject
                {
                    ["actor"] = joker.Actor,
                    ["jokerCard"] = joker.InstanceId,
                    ["jokerCardBaseId"] = joker.Card.Id,
                    ["jokerLevel"] = joker.Level,
                    ["jokerMarketIndex"] = joker.Index,
                    ["selectedColor"] = options.SelectedColor,
                    ["setupActionCount"] = (setup["actions"] as JArray)?.Count ?? 0,
                    ["marketCardVisibleBeforePreview"] = true,
                    ["buyControlVisibleBeforeBuy"] = true,
                    ["colorTargetVisibleBeforeSelection"] = true,
                    ["phaseBeforeColor"] = colorSelection.Value<string>("phase"),
                    ["finalPhase"] = afterBuy.Value<string>("phase"),
                    ["finalTurn"] = afterBuy.Value<string>("turn"),
                    ["statusAfterBuy"] = afterBuy.Value<string>("statusText"),
                    ["tableauContainsJokerAfterBuy"] = true,
                    ["pendingBuyClearedAfterBuy"] = true,
                    ["recordedEvents"] = finalRecordedEvents,
                    ["totalEventsAfterBuy"] = afterBuy.Value<int>("totalEvents"),
                    ["eventTypes"] = eventTypes,
                    ["initiateEventIndex"] = initiateIndex,
                    ["buyEventIndex"] = buyIndex,
                    ["exportedEvents"] = events.Count,
                    ["exportedSummaryFinalStateHash"] = exportedHash,
                    ["controllerCurrentStateHash"] = finalStateHash,
                    ["reviewedFinalStateHash"] = reviewedHash,
                };
                report["replayReview"] = new JObject
                {
                    ["ok"] = reviewedHash == exportedHash,
                    ["reviewedFinalStateHash"] = reviewedHash,
                };
                report["ok"] = true;
                report["completedAt"] = DateTime.UtcNow.ToString("O");
                return report;
            }
            catch (Exception ex)
            {
                return Fail(report, ex.ToString(), controller, options);
            }
            finally
            {
                DestroyObject(reviewRoot);
            }
        }

        private sealed class JokerCandidate
        {
            public string Actor = string.Empty;
            public int Level;
            public int Index;
            public string InstanceId = string.Empty;
            public CardDef Card;
        }

        private static bool FindAffordableVisibleJoker(
            JObject automationState,
            UnityCatalog catalog,
            out JokerCandidate candidate
        )
        {
            candidate = null;
            var snapshot = (JObject)automationState["snapshot"];
            var actor = snapshot.Value<string>("turn") ?? "p1";
            candidate = VisibleTargets(automationState)
                .Where(target =>
                    target.Value<string>("kind") == "MarketCard"
                    && target.Value<bool>("clickable")
                    && IsJokerRuntimeCardId(target.Value<string>("instanceId"))
                )
                .Select(target =>
                {
                    var instanceId = target.Value<string>("instanceId");
                    var cardId = ParseRuntimeCardId(instanceId);
                    if (string.IsNullOrEmpty(cardId) || !catalog.Cards.TryGetValue(cardId, out var card))
                    {
                        return null;
                    }

                    return new JokerCandidate
                    {
                        Actor = actor,
                        Level = target.Value<int>("level"),
                        Index = target.Value<int>("index"),
                        InstanceId = instanceId,
                        Card = card,
                    };
                })
                .Where(item => item != null && IsAffordableForPlayer(snapshot, actor, item.Card, catalog))
                .OrderBy(item => item.Level)
                .ThenBy(item => item.Index)
                .FirstOrDefault();
            return candidate != null;
        }

        private static bool IsAffordableForPlayer(
            JObject snapshot,
            string player,
            CardDef card,
            UnityCatalog catalog
        )
        {
            var goldNeeded = 0;
            foreach (var gemId in CostColors)
            {
                var needed = DiscountedCostForPlayer(snapshot, player, card, catalog, gemId);
                var paid = Math.Min(needed, GetInventoryValue(snapshot, player, gemId));
                goldNeeded += needed - paid;
            }

            return GetInventoryValue(snapshot, player, "gold") >= goldNeeded;
        }

        private static int DiscountedCostForPlayer(
            JObject snapshot,
            string player,
            CardDef card,
            UnityCatalog catalog,
            string gemId
        )
        {
            var cost = GetCostValue(card.Cost, gemId);
            if (gemId == "pearl" || gemId == "gold")
            {
                return cost;
            }

            return Math.Max(0, cost - GetTableauBonus(snapshot, player, gemId, catalog));
        }

        private static int GetTableauBonus(JObject snapshot, string player, string gemId, UnityCatalog catalog)
        {
            var total = 0;
            var tableau = (JArray)((JObject)snapshot["playerTableau"])[player];
            foreach (var entry in tableau)
            {
                var instanceId = entry.Type == JTokenType.String
                    ? entry.Value<string>()
                    : ((JObject)entry).Value<string>("instanceId");
                var cardId = ParseRuntimeCardId(instanceId);
                if (string.IsNullOrEmpty(cardId))
                {
                    continue;
                }

                if (catalog.Cards.TryGetValue(cardId, out var card) && card.BonusColor == gemId)
                {
                    total += Math.Max(1, card.BonusCount);
                }
            }

            return total;
        }

        private static int GetInventoryValue(JObject snapshot, string player, string gemId)
        {
            return ((JObject)((JObject)snapshot["inventories"])[player]).Value<int>(gemId);
        }

        private static int GetCostValue(GemInventory inventory, string gemId)
        {
            switch (gemId)
            {
                case "red":
                    return inventory.Red;
                case "green":
                    return inventory.Green;
                case "blue":
                    return inventory.Blue;
                case "white":
                    return inventory.White;
                case "black":
                    return inventory.Black;
                case "pearl":
                    return inventory.Pearl;
                case "gold":
                    return inventory.Gold;
                default:
                    return 0;
            }
        }

        private static int FindEventIndex(JArray events, string eventType, string instanceId)
        {
            for (var index = 0; index < events.Count; index += 1)
            {
                var item = events[index] as JObject;
                if (item == null || item.Value<string>("type") != eventType)
                {
                    continue;
                }

                if (
                    string.IsNullOrEmpty(instanceId)
                    || item.Value<string>("instanceId") == instanceId
                    || item.Value<string>("card") == instanceId
                )
                {
                    return index;
                }
            }

            return -1;
        }

        private static bool TableauContains(JObject automationState, string player, string instanceId)
        {
            var snapshot = (JObject)automationState["snapshot"];
            var tableau = (JArray)((JObject)snapshot["playerTableau"])[player];
            return tableau.Any(entry =>
                entry.Type == JTokenType.String
                    ? entry.Value<string>() == instanceId
                    : ((JObject)entry).Value<string>("instanceId") == instanceId
            );
        }

        private static bool HasVisibleTarget(
            JObject automationState,
            string semanticKey,
            bool requireClickable = true
        )
        {
            return VisibleTargets(automationState)
                .Any(target =>
                    target.Value<string>("semanticKey") == semanticKey
                    && (!requireClickable || target.Value<bool>("clickable"))
                );
        }

        private static IEnumerable<JObject> VisibleTargets(JObject automationState)
        {
            var targets = automationState["visibleTargets"] as JArray;
            return targets == null ? Enumerable.Empty<JObject>() : targets.OfType<JObject>();
        }

        private static void AppendAction(
            JArray actions,
            string detail,
            string family,
            JObject before,
            JObject after
        )
        {
            actions.Add(
                new JObject
                {
                    ["step"] = actions.Count,
                    ["detail"] = detail,
                    ["family"] = family,
                    ["phaseBefore"] = before.Value<string>("phase"),
                    ["phaseAfter"] = after.Value<string>("phase"),
                    ["stateHash"] = CurrentStateHash(after),
                    ["recordedEvents"] = RecordedEventCount(after),
                }
            );
        }

        private static JObject BuildStateSummary(JObject automationState)
        {
            return new JObject
            {
                ["phase"] = automationState.Value<string>("phase"),
                ["turn"] = automationState.Value<string>("turn"),
                ["winner"] = automationState.Value<string>("winner"),
                ["stateHash"] = CurrentStateHash(automationState),
                ["recordedEvents"] = RecordedEventCount(automationState),
            };
        }

        private static JObject Fail(
            JObject report,
            string reason,
            GemDuelGameController controller,
            LocalDevJokerReleasePathSmokeOptions options
        )
        {
            report["ok"] = false;
            report["failureReason"] = reason;
            report["completedAt"] = DateTime.UtcNow.ToString("O");
            try
            {
                var state = controller.BuildAutomationStateSnapshot(options.ViewportWidth, options.ViewportHeight);
                report["failureState"] = new JObject
                {
                    ["phase"] = state.Value<string>("phase"),
                    ["turn"] = state.Value<string>("turn"),
                    ["winner"] = state.Value<string>("winner"),
                    ["statusText"] = state.Value<string>("statusText"),
                    ["errorBanner"] = state.Value<string>("errorBanner"),
                    ["replay"] = state["replay"]?.DeepClone(),
                };
            }
            catch
            {
                report["failureState"] = null;
            }

            return report;
        }

        private static string CurrentStateHash(JObject state)
        {
            return ((JObject)state["replay"]).Value<string>("currentStateHash");
        }

        private static int RecordedEventCount(JObject state)
        {
            var liveRecording = ((JObject)state["replay"])["liveRecording"] as JObject;
            return liveRecording == null ? -1 : liveRecording.Value<int>("recordedEvents");
        }

        private static bool IsJokerRuntimeCardId(string instanceId)
        {
            return !string.IsNullOrEmpty(instanceId) && instanceId.Contains("-jo#");
        }

        private static string ParseRuntimeCardId(string instanceId)
        {
            if (string.IsNullOrEmpty(instanceId))
            {
                return string.Empty;
            }

            var withoutPrefix = instanceId.StartsWith("c:") ? instanceId.Substring(2) : instanceId;
            var hashIndex = withoutPrefix.IndexOf('#');
            return hashIndex >= 0 ? withoutPrefix.Substring(0, hashIndex) : withoutPrefix;
        }

        private static void DestroyObject(GameObject root)
        {
            if (root == null)
            {
                return;
            }

            if (Application.isPlaying)
            {
                UnityEngine.Object.Destroy(root);
            }
            else
            {
                UnityEngine.Object.DestroyImmediate(root);
            }
        }
    }
}
