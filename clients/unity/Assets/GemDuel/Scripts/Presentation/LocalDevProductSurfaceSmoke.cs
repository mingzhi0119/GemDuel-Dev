using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using GemDuel.Catalog;
using GemDuel.Core;
using GemDuel.Replay;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using UnityEngine;

namespace GemDuel.Presentation
{
    public sealed class LocalDevProductSurfaceSmokeOptions
    {
        public string Seed { get; set; } = "unity-built-player-smoke";
        public int MaxSteps { get; set; } = 12;
        public string StartMode { get; set; } = "classic";
        public int ViewportWidth { get; set; } = 1920;
        public int ViewportHeight { get; set; } = 1080;
        public bool VerifyReplayReview { get; set; } = true;
        public string IdleActionPreference { get; set; } = "balanced";
        public string DraftActionPreference { get; set; } = "select-first";
    }

    public static class LocalDevProductSurfaceSmoke
    {
        private const long FirstProductActionLatencyBudgetMs = 500;
        private const long ReplenishActionLatencyBudgetMs = 350;

        public static JObject Run(
            GemDuelGameController controller,
            LocalDevProductSurfaceSmokeOptions options
        )
        {
            options = options ?? new LocalDevProductSurfaceSmokeOptions();
            var actions = new JArray();
            var actionFamilies = new HashSet<string>(StringComparer.Ordinal);
            var report = new JObject
            {
                ["schemaVersion"] = 1,
                ["kind"] = "unity-localdev-product-surface-smoke",
                ["startedAt"] = DateTime.UtcNow.ToString("O"),
                ["seed"] = options.Seed,
                ["maxSteps"] = options.MaxSteps,
                ["startMode"] = NormalizeStartMode(options.StartMode),
                ["idleActionPreference"] = options.IdleActionPreference,
                ["draftActionPreference"] = options.DraftActionPreference,
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

            try
            {
                var draftRerolledPlayers = new HashSet<string>(StringComparer.Ordinal);
                controller.SetAutomationViewport(options.ViewportWidth, options.ViewportHeight);
                controller.LoadMainMenuForAutomation();
                var startAction = NormalizeStartMode(options.StartMode) == "roguelike"
                    ? "start_roguelike_game"
                    : "start_local_game";
                if (
                    !controller.RunSemanticActionForAutomation(
                        startAction,
                        new JObject { ["seed"] = options.Seed },
                        out var startError
                    )
                )
                {
                    return Fail(report, startAction + " failed: " + startError, controller);
                }

                var afterStart = controller.BuildAutomationStateSnapshot(
                    options.ViewportWidth,
                    options.ViewportHeight
                );
                var startReplay = (JObject)afterStart["replay"];
                if (controller.LastAutomationDriver != "setup-live-rules-engine")
                {
                    return Fail(
                        report,
                        "Local PvP did not start through the live rules-engine bridge.",
                        controller
                    );
                }

                if (afterStart.Value<int>("totalEvents") != 0 || startReplay.Value<bool>("loaded"))
                {
                    report["usedFixtureReplayAsGameplayDriver"] = true;
                    return Fail(report, "Fresh product start unexpectedly loaded fixture replay events.", controller);
                }

                if (startReplay["liveRecording"] == null || startReplay["liveRecording"].Type == JTokenType.Null)
                {
                    return Fail(report, "Fresh product start did not create live replay recording.", controller);
                }

                var startReplenishTarget = FindVisibleTarget(afterStart, "turn.end");
                if (startReplenishTarget == null)
                {
                    return Fail(report, "Fresh product start did not expose a Replenish action.", controller);
                }

                var startBagCount = (((JObject)afterStart["snapshot"])["bag"] as JArray)?.Count ?? 0;
                var startReplenishClickable = startReplenishTarget.Value<bool>("clickable");
                if (startBagCount > 0 && !startReplenishClickable)
                {
                    return Fail(report, "Fresh product start did not expose a clickable Replenish action with non-empty bag.", controller);
                }

                if (startBagCount == 0 && startReplenishClickable)
                {
                    return Fail(report, "Fresh product start exposed a clickable Replenish action with an empty bag.", controller);
                }

                var replenishRect = startReplenishTarget["rect"] as JObject;
                var replenishHeight = replenishRect?.Value<double?>("height") ?? 0d;
                if (Math.Abs(replenishHeight - 56d) > 1.5d)
                {
                    return Fail(report, "Replenish action height was not stable 56px: " + replenishHeight + ".", controller);
                }

                if (FindVisibleTarget(afterStart, "privilege.supply") == null)
                {
                    return Fail(report, "Shared privilege supply target was not visible above the board.", controller);
                }

                var catalog = new CatalogLoader().LoadDefault();
                for (var step = 0; step < Math.Max(1, options.MaxSteps); step += 1)
                {
                    var before = controller.BuildAutomationStateSnapshot(
                        options.ViewportWidth,
                        options.ViewportHeight
                    );
                    if (!string.IsNullOrEmpty(before.Value<string>("winner")))
                    {
                        break;
                    }

                    var beforeReplay = (JObject)before["replay"];
                    var beforeLiveRecording = (JObject)beforeReplay["liveRecording"];
                    var beforeRecordedEvents = beforeLiveRecording.Value<int>("recordedEvents");
                    var actionWatch = Stopwatch.StartNew();
                    var actionOk = DriveOneProductAction(
                        controller,
                        before,
                        catalog,
                        options.IdleActionPreference,
                        options.DraftActionPreference,
                        draftRerolledPlayers,
                        out var detail
                    );
                    actionWatch.Stop();
                    var actionDurationMs = actionWatch.ElapsedMilliseconds;
                    if (!actionOk)
                    {
                        return Fail(report, "No product action available at step " + step + ": " + detail, controller);
                    }

                    if (step == 0 && actionDurationMs > FirstProductActionLatencyBudgetMs)
                    {
                        return Fail(
                            report,
                            "First product UI action exceeded latency budget: "
                                + actionDurationMs
                                + "ms > "
                                + FirstProductActionLatencyBudgetMs
                                + "ms (" + detail + ")",
                            controller
                        );
                    }

                    if (
                        detail.IndexOf("replenish", StringComparison.OrdinalIgnoreCase) >= 0
                        && actionDurationMs > ReplenishActionLatencyBudgetMs
                    )
                    {
                        return Fail(
                            report,
                            "Replenish UI action exceeded latency budget: "
                                + actionDurationMs
                                + "ms > "
                                + ReplenishActionLatencyBudgetMs
                                + "ms",
                            controller
                        );
                    }

                    var after = controller.BuildAutomationStateSnapshot(
                        options.ViewportWidth,
                        options.ViewportHeight
                    );
                    var afterReplay = (JObject)after["replay"];
                    var afterLiveRecording = (JObject)afterReplay["liveRecording"];
                    var afterRecordedEvents = afterLiveRecording.Value<int>("recordedEvents");
                    if (afterRecordedEvents <= beforeRecordedEvents)
                    {
                        return Fail(report, "Product action did not append a live replay event: " + detail, controller);
                    }

                    var currentHash = afterReplay.Value<string>("currentStateHash");
                    var summaryHash = afterLiveRecording.Value<string>("summaryFinalStateHash");
                    if (currentHash != summaryHash)
                    {
                        return Fail(
                            report,
                            "Live replay hash mismatch after " + detail + ": " + currentHash + " != " + summaryHash,
                            controller
                        );
                    }

                    var family = ResolveActionFamily(detail);
                    actionFamilies.Add(family);
                    actions.Add(
                        new JObject
                        {
                            ["step"] = step,
                            ["detail"] = detail,
                            ["family"] = family,
                            ["phaseBefore"] = before.Value<string>("phase"),
                            ["phaseAfter"] = after.Value<string>("phase"),
                            ["stateHash"] = currentHash,
                            ["recordedEvents"] = afterRecordedEvents,
                            ["durationMs"] = actionDurationMs,
                        }
                    );
                }

                if (actions.Count == 0)
                {
                    return Fail(report, "Smoke did not apply any product-surface actions.", controller);
                }

                if (!controller.ExportReplayJsonForAutomation(out var exportedJson, out var exportError))
                {
                    return Fail(report, "Replay export failed: " + exportError, controller);
                }

                var exportedReplay = JsonConvert.DeserializeObject<ReplayVNext>(exportedJson);
                if (exportedReplay == null)
                {
                    return Fail(report, "Exported replay could not be parsed.", controller);
                }

                var final = controller.BuildAutomationStateSnapshot(
                    options.ViewportWidth,
                    options.ViewportHeight
                );
                var finalReplay = (JObject)final["replay"];
                var finalHash = finalReplay.Value<string>("currentStateHash");
                var finalLiveRecording = (JObject)finalReplay["liveRecording"];
                report["productStateSummary"] = new JObject
                {
                    ["phase"] = final.Value<string>("phase"),
                    ["turn"] = final.Value<string>("turn"),
                    ["winner"] = final.Value<string>("winner"),
                    ["stateHash"] = finalHash,
                    ["recordedEvents"] = finalLiveRecording.Value<int>("recordedEvents"),
                    ["summaryFinalStateHash"] = finalLiveRecording.Value<string>("summaryFinalStateHash"),
                };
                report["replayHashSummary"] = new JObject
                {
                    ["exportedEvents"] = exportedReplay.Events.Count,
                    ["exportedSummaryFinalStateHash"] = exportedReplay.Summary.FinalStateHash,
                    ["controllerCurrentStateHash"] = finalHash,
                };
                report["actionFamilies"] = new JArray(actionFamilies.OrderBy(value => value));
                report["performanceSummary"] = BuildPerformanceSummary(actions);
                report["layoutSummary"] = new JObject
                {
                    ["sharedPrivilegeSupplyVisible"] = true,
                    ["replenishInitialClickable"] = startReplenishClickable,
                    ["replenishInitialBagCount"] = startBagCount,
                    ["replenishInitialHeightPx"] = replenishHeight,
                };

                if (options.VerifyReplayReview)
                {
                    var reviewRoot = new GameObject("GemDuel Built Player Smoke Replay Review");
                    try
                    {
                        var review = reviewRoot.AddComponent<GemDuelGameController>();
                        if (!review.ImportReplayJsonForAutomation(exportedJson, out var importError))
                        {
                            return Fail(report, "Replay review import failed: " + importError, controller);
                        }

                        if (!review.PlayReplayToEndForAutomation(out var reviewError))
                        {
                            return Fail(report, "Replay review playback failed: " + reviewError, controller);
                        }

                        var reviewed = review.BuildAutomationStateSnapshot(
                            options.ViewportWidth,
                            options.ViewportHeight
                        );
                        var reviewedHash = ((JObject)reviewed["replay"]).Value<string>("currentStateHash");
                        report["replayReview"] = new JObject
                        {
                            ["ok"] = reviewedHash == exportedReplay.Summary.FinalStateHash,
                            ["reviewedFinalStateHash"] = reviewedHash,
                        };
                        if (reviewedHash != exportedReplay.Summary.FinalStateHash)
                        {
                            return Fail(
                                report,
                                "Replay review hash mismatch: "
                                    + reviewedHash
                                    + " != "
                                    + exportedReplay.Summary.FinalStateHash,
                                controller
                            );
                        }
                    }
                    finally
                    {
                        DestroyObject(reviewRoot);
                    }
                }

                report["ok"] = true;
                report["completedAt"] = DateTime.UtcNow.ToString("O");
                return report;
            }
            catch (Exception ex)
            {
                return Fail(report, ex.ToString(), controller);
            }
        }

        private static JObject BuildPerformanceSummary(JArray actions)
        {
            var actionObjects = actions.OfType<JObject>().ToList();
            var durations = actionObjects.Select(action => action.Value<long>("durationMs")).ToList();
            var firstDuration = durations.Count == 0 ? 0L : durations[0];
            var replenishDurations = actionObjects
                .Where(action => (action.Value<string>("detail") ?? string.Empty).IndexOf("replenish", StringComparison.OrdinalIgnoreCase) >= 0)
                .Select(action => action.Value<long>("durationMs"))
                .ToList();
            return new JObject
            {
                ["firstActionDurationMs"] = firstDuration,
                ["firstActionBudgetMs"] = FirstProductActionLatencyBudgetMs,
                ["maxActionDurationMs"] = durations.Count == 0 ? 0L : durations.Max(),
                ["replenishMaxDurationMs"] = replenishDurations.Count == 0 ? null : JToken.FromObject(replenishDurations.Max()),
                ["replenishBudgetMs"] = ReplenishActionLatencyBudgetMs,
                ["ok"] =
                    firstDuration <= FirstProductActionLatencyBudgetMs
                    && replenishDurations.All(duration => duration <= ReplenishActionLatencyBudgetMs),
            };
        }

        private static JObject FindVisibleTarget(JObject automationState, string semanticKey)
        {
            var targets = automationState["visibleTargets"] as JArray;
            return targets?
                .OfType<JObject>()
                .FirstOrDefault(target => target.Value<string>("semanticKey") == semanticKey);
        }

        private static JObject Fail(JObject report, string reason, GemDuelGameController controller)
        {
            report["ok"] = false;
            report["failureReason"] = reason;
            report["completedAt"] = DateTime.UtcNow.ToString("O");
            try
            {
                var state = controller.BuildAutomationStateSnapshot(1920, 1080);
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

        private static bool DriveOneProductAction(
            GemDuelGameController controller,
            JObject automationState,
            UnityCatalog catalog,
            string idleActionPreference,
            string draftActionPreference,
            HashSet<string> draftRerolledPlayers,
            out string detail
        )
        {
            var snapshot = (JObject)automationState["snapshot"];
            var phase = snapshot.Value<string>("phase");
            switch (phase)
            {
                case "IDLE":
                    return DriveIdleProductAction(controller, snapshot, catalog, idleActionPreference, out detail);
                case "SELECT_CARD_COLOR":
                    return RunSemantic(controller, "select_joker_color", new JObject { ["color"] = "red" }, out detail);
                case "SELECT_ROYAL":
                    return RunSemantic(controller, "choose_royal", new JObject { ["index"] = 0 }, out detail);
                case "BONUS_ACTION":
                    return TryTakeBonusGem(controller, snapshot, out detail);
                case "STEAL_ACTION":
                    return TryUseInventoryAction(controller, snapshot, "steal_gem", CurrentOpponent(snapshot), out detail);
                case "DISCARD_EXCESS_GEMS":
                    return TryUseInventoryAction(controller, snapshot, "discard_gem", snapshot.Value<string>("turn"), out detail);
                case "DRAFT_PHASE":
                    if (
                        ShouldRerollDraftForPlayer(
                            snapshot,
                            draftActionPreference,
                            draftRerolledPlayers
                        )
                        && RunSemantic(controller, "reroll_draft_pool", null, out detail)
                    )
                    {
                        draftRerolledPlayers.Add(snapshot.Value<string>("turn") ?? string.Empty);
                        return true;
                    }

                    return TryChooseDraftBuff(controller, automationState, out detail);
                case "PRIVILEGE_ACTION":
                    if (IsPreference(idleActionPreference, "privilege-first") && TryUsePrivilege(controller, snapshot, out detail))
                    {
                        return true;
                    }

                    return RunSemantic(controller, "cancel_gem_selection", null, out detail);
                case "RESERVE_WAITING_GEM":
                    return RunSemantic(controller, "cancel_gem_selection", null, out detail);
                default:
                    detail = "Unsupported phase " + phase + ".";
                    return false;
            }
        }

        private sealed class ProductMarketCandidate
        {
            public int Level;
            public int Index;
            public string InstanceId = string.Empty;
            public CardDef Card;
            public int MissingCost;
        }

        private static bool DriveIdleProductAction(
            GemDuelGameController controller,
            JObject snapshot,
            UnityCatalog catalog,
            string idleActionPreference,
            out string detail
        )
        {
            var preference = string.IsNullOrWhiteSpace(idleActionPreference)
                ? "balanced"
                : idleActionPreference.Trim().ToLowerInvariant();

            if (preference == "privilege-first" && TryActivatePrivilege(controller, snapshot, out detail))
            {
                return true;
            }

            if (preference == "privilege-first" && TryTakeSingleGemForPrivilege(controller, snapshot, out detail))
            {
                return true;
            }

            if (preference == "reserve-first" && TryReserveMarketCard(controller, snapshot, out detail))
            {
                return true;
            }

            if (preference != "resource-first" && TryBuyAffordableMarketCard(controller, snapshot, catalog, out detail))
            {
                return true;
            }

            if (ShouldPreferReplenish(snapshot) && RunSemantic(controller, "replenish", null, out detail))
            {
                return true;
            }

            if (TryTakeUsefulGemLine(controller, snapshot, catalog, out detail))
            {
                return true;
            }

            if (preference != "reserve-first" && TryReserveMarketCard(controller, snapshot, out detail))
            {
                return true;
            }

            if (((JArray)snapshot["bag"]).Count > 0)
            {
                return RunSemantic(controller, "replenish", null, out detail);
            }

            detail = "No idle product action available with an empty bag.";
            return false;
        }

        private static bool TryReserveMarketCard(
            GemDuelGameController controller,
            JObject snapshot,
            out string detail
        )
        {
            if (!HasReserveRoom(snapshot))
            {
                detail = "No reserve room.";
                return false;
            }

            foreach (var candidate in FindMarketCards(snapshot))
            {
                var payload = new JObject { ["level"] = candidate.level, ["index"] = candidate.index };
                if (controller.RunSemanticActionForAutomation("reserve_card", payload, out var error))
                {
                    detail = "reserve_card " + candidate.instanceId;
                    return true;
                }

                detail = "reserve_card " + candidate.instanceId + " rejected: " + error;
                return false;
            }

            detail = "No market card to reserve.";
            return false;
        }

        private static bool TryActivatePrivilege(
            GemDuelGameController controller,
            JObject snapshot,
            out string detail
        )
        {
            var actor = snapshot.Value<string>("turn");
            var privileges = snapshot["privileges"] as JObject;
            if (privileges == null || privileges.Value<int>(actor) <= 0)
            {
                detail = "No privilege charge for " + actor + ".";
                return false;
            }

            if (!FindFirstCollectibleBoardGem(snapshot).HasValue)
            {
                detail = "No collectible board gem for privilege.";
                return false;
            }

            return RunSemantic(controller, "activate_privilege", null, out detail);
        }

        private static bool TryUsePrivilege(
            GemDuelGameController controller,
            JObject snapshot,
            out string detail
        )
        {
            var coord = FindFirstCollectibleBoardGem(snapshot);
            if (!coord.HasValue)
            {
                detail = "No collectible board gem for privilege use.";
                return false;
            }

            if (
                RunSemantic(
                    controller,
                    "click_board_cell",
                    new JObject { ["row"] = coord.Value.x, ["column"] = coord.Value.y },
                    out detail
                )
            )
            {
                detail = "use_privilege";
                return true;
            }

            return false;
        }

        private static bool TryTakeSingleGemForPrivilege(
            GemDuelGameController controller,
            JObject snapshot,
            out string detail
        )
        {
            var coord = FindFirstCollectibleBoardGem(snapshot);
            if (!coord.HasValue)
            {
                detail = "No collectible board gem for single-gem take.";
                return false;
            }

            if (
                !RunSemantic(
                    controller,
                    "click_board_cell",
                    new JObject { ["row"] = coord.Value.x, ["column"] = coord.Value.y },
                    out detail
                )
            )
            {
                return false;
            }

            if (RunSemantic(controller, "confirm_gem_selection", null, out detail))
            {
                detail = "take_gems";
                return true;
            }

            return false;
        }

        private static bool TryBuyAffordableMarketCard(
            GemDuelGameController controller,
            JObject snapshot,
            UnityCatalog catalog,
            out string detail
        )
        {
            var candidates = FindMarketCandidates(snapshot, catalog)
                .Where(candidate => IsAffordable(snapshot, candidate.Card, catalog))
                .OrderByDescending(candidate => candidate.Card.Points)
                .ThenByDescending(candidate => candidate.Card.Crowns)
                .ThenByDescending(candidate => candidate.Card.Level)
                .ThenBy(candidate => candidate.MissingCost)
                .ToList();

            foreach (var candidate in candidates)
            {
                var payload = new JObject { ["level"] = candidate.Level, ["index"] = candidate.Index };
                if (controller.RunSemanticActionForAutomation("buy_card", payload, out var error))
                {
                    detail = "buy_card " + candidate.InstanceId;
                    return true;
                }

                detail = "buy_card " + candidate.InstanceId + " rejected: " + error;
                return false;
            }

            detail = "No affordable market card.";
            return false;
        }

        private static bool TryTakeUsefulGemLine(
            GemDuelGameController controller,
            JObject snapshot,
            UnityCatalog catalog,
            out string detail
        )
        {
            var needs = BuildNeedVector(snapshot, catalog);
            var blocksTakeThree = ActiveBuffBlocksTakeThree(snapshot, catalog);
            var lines = FindCandidateGemLines(snapshot)
                .Where(line => !blocksTakeThree || line.Count < 3)
                .Select(line => new { Line = line, Score = ScoreGemLine(snapshot, line, needs) })
                .OrderByDescending(candidate => candidate.Score)
                .ThenByDescending(candidate => candidate.Line.Count)
                .ToList();

            foreach (var candidate in lines)
            {
                foreach (var coord in candidate.Line)
                {
                    if (
                        !RunSemantic(
                            controller,
                            "click_board_cell",
                            new JObject { ["row"] = coord.x, ["column"] = coord.y },
                            out detail
                        )
                    )
                    {
                        return false;
                    }
                }

                if (RunSemantic(controller, "confirm_gem_selection", null, out detail))
                {
                    detail = "take_gems";
                    return true;
                }

                return false;
            }

            detail = "No collectible gem line.";
            return false;
        }

        private static bool ActiveBuffBlocksTakeThree(JObject snapshot, UnityCatalog catalog)
        {
            var actor = snapshot.Value<string>("turn");
            var playerBuffs = snapshot["playerBuffs"] as JObject;
            var buffToken = string.IsNullOrEmpty(actor) ? null : playerBuffs?[actor];
            var buff = (buffToken as JObject)?["buff"] as JObject ?? buffToken as JObject;
            if (PassiveBlocksTakeThree(buff?["effects"] as JObject))
            {
                return true;
            }

            var buffId = ResolveBuffId(buffToken);
            return !string.IsNullOrEmpty(buffId)
                && catalog.Buffs.TryGetValue(buffId, out var buffDef)
                && PassiveBlocksTakeThree(buffDef.Effects);
        }

        private static bool PassiveBlocksTakeThree(JObject effects)
        {
            var passive = effects?["passive"] as JObject;
            return passive?.Value<bool?>("noTake3") == true;
        }

        private static string ResolveBuffId(JToken buffToken)
        {
            if (buffToken == null || buffToken.Type == JTokenType.Null)
            {
                return string.Empty;
            }

            if (buffToken.Type == JTokenType.String)
            {
                return buffToken.Value<string>();
            }

            var buffObject = buffToken as JObject;
            if (buffObject == null)
            {
                return string.Empty;
            }

            var nestedBuff = buffObject["buff"];
            if (nestedBuff?.Type == JTokenType.String)
            {
                return nestedBuff.Value<string>();
            }

            if (nestedBuff is JObject nestedBuffObject)
            {
                return nestedBuffObject.Value<string>("id") ?? string.Empty;
            }

            return buffObject.Value<string>("id")
                ?? buffObject.Value<string>("buffId")
                ?? string.Empty;
        }

        private static bool ShouldPreferReplenish(JObject snapshot)
        {
            if (((JArray)snapshot["bag"]).Count == 0)
            {
                return false;
            }

            var emptyCount = ((JArray)snapshot["board"])
                .OfType<JArray>()
                .SelectMany(row => row.Values<string>())
                .Count(gemId => gemId == "empty");
            return emptyCount > 15;
        }

        private static List<ProductMarketCandidate> FindMarketCandidates(JObject snapshot, UnityCatalog catalog)
        {
            var candidates = new List<ProductMarketCandidate>();
            foreach (var marketCard in FindMarketCards(snapshot))
            {
                var cardId = ParseRuntimeCardId(marketCard.instanceId);
                if (string.IsNullOrEmpty(cardId) || !catalog.Cards.TryGetValue(cardId, out var card))
                {
                    continue;
                }

                candidates.Add(
                    new ProductMarketCandidate
                    {
                        Level = marketCard.level,
                        Index = marketCard.index,
                        InstanceId = marketCard.instanceId,
                        Card = card,
                        MissingCost = MissingCost(snapshot, card, catalog),
                    }
                );
            }

            return candidates;
        }

        private static IEnumerable<(int level, int index, string instanceId)> FindMarketCards(JObject snapshot)
        {
            var market = (JObject)snapshot["market"];
            for (var level = 1; level <= 3; level += 1)
            {
                var row = market[level.ToString()] as JArray;
                if (row == null)
                {
                    continue;
                }

                for (var index = 0; index < row.Count; index += 1)
                {
                    var instanceId = row[index].Value<string>();
                    if (!string.IsNullOrWhiteSpace(instanceId))
                    {
                        yield return (level, index, instanceId);
                    }
                }
            }
        }

        private static Dictionary<string, int> BuildNeedVector(JObject snapshot, UnityCatalog catalog)
        {
            var needs = new Dictionary<string, int>
            {
                ["red"] = 0,
                ["green"] = 0,
                ["blue"] = 0,
                ["white"] = 0,
                ["black"] = 0,
                ["pearl"] = 0,
            };
            var target = FindMarketCandidates(snapshot, catalog)
                .Where(candidate => !IsAffordable(snapshot, candidate.Card, catalog))
                .OrderByDescending(candidate => candidate.Card.Points)
                .ThenByDescending(candidate => candidate.Card.Crowns)
                .ThenByDescending(candidate => candidate.Card.Level)
                .ThenBy(candidate => candidate.MissingCost)
                .FirstOrDefault();
            if (target == null)
            {
                return needs;
            }

            foreach (var gemId in needs.Keys.ToList())
            {
                var need = Math.Max(0, DiscountedCost(snapshot, target.Card, catalog, gemId)
                    - GetInventoryValue(snapshot, snapshot.Value<string>("turn"), gemId));
                needs[gemId] = need;
            }

            return needs;
        }

        private static bool IsAffordable(JObject snapshot, CardDef card, UnityCatalog catalog)
        {
            var actor = snapshot.Value<string>("turn");
            var goldNeeded = 0;
            foreach (var gemId in new[] { "red", "green", "blue", "white", "black", "pearl" })
            {
                var needed = DiscountedCost(snapshot, card, catalog, gemId);
                var paid = Math.Min(needed, GetInventoryValue(snapshot, actor, gemId));
                goldNeeded += needed - paid;
            }

            return GetInventoryValue(snapshot, actor, "gold") >= goldNeeded;
        }

        private static int MissingCost(JObject snapshot, CardDef card, UnityCatalog catalog)
        {
            var actor = snapshot.Value<string>("turn");
            var missing = 0;
            foreach (var gemId in new[] { "red", "green", "blue", "white", "black", "pearl" })
            {
                missing += Math.Max(0, DiscountedCost(snapshot, card, catalog, gemId)
                    - GetInventoryValue(snapshot, actor, gemId));
            }

            return missing;
        }

        private static int DiscountedCost(JObject snapshot, CardDef card, UnityCatalog catalog, string gemId)
        {
            var cost = GetCostValue(card.Cost, gemId);
            if (gemId == "pearl" || gemId == "gold")
            {
                return cost;
            }

            return Math.Max(0, cost - GetTableauBonus(snapshot, snapshot.Value<string>("turn"), gemId, catalog));
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

        private static List<List<Vector2Int>> FindCandidateGemLines(JObject snapshot)
        {
            var lines = new List<List<Vector2Int>>();
            var directions = new[]
            {
                new Vector2Int(0, 1),
                new Vector2Int(1, 0),
                new Vector2Int(1, 1),
                new Vector2Int(1, -1),
            };
            var board = (JArray)snapshot["board"];
            for (var row = 0; row < board.Count; row += 1)
            {
                for (var column = 0; column < 5; column += 1)
                {
                    foreach (var direction in directions)
                    {
                        for (var length = 3; length >= 1; length -= 1)
                        {
                            var line = new List<Vector2Int>();
                            var valid = true;
                            for (var step = 0; step < length; step += 1)
                            {
                                var r = row + direction.x * step;
                                var c = column + direction.y * step;
                                if (r < 0 || r >= 5 || c < 0 || c >= 5)
                                {
                                    valid = false;
                                    break;
                                }

                                var gemId = GetBoardGem(snapshot, r, c);
                                if (gemId == "empty" || gemId == "gold")
                                {
                                    valid = false;
                                    break;
                                }

                                line.Add(new Vector2Int(r, c));
                            }

                            if (valid)
                            {
                                lines.Add(line);
                            }
                        }
                    }
                }
            }

            return lines;
        }

        private static int ScoreGemLine(
            JObject snapshot,
            List<Vector2Int> line,
            IReadOnlyDictionary<string, int> needs
        )
        {
            var score = line.Count * 10;
            var actor = snapshot.Value<string>("turn");
            foreach (var coord in line)
            {
                var gemId = GetBoardGem(snapshot, coord.x, coord.y);
                if (needs.TryGetValue(gemId, out var need) && need > 0)
                {
                    score += 80 + need * 8;
                    continue;
                }

                if (GetInventoryValue(snapshot, actor, gemId) < 2)
                {
                    score += 12;
                }
            }

            return score;
        }

        private static bool TryTakeBonusGem(
            GemDuelGameController controller,
            JObject snapshot,
            out string detail
        )
        {
            var targetGem = snapshot["bonusGemTarget"];
            var targetGemId = targetGem?.Type == JTokenType.String
                ? targetGem.Value<string>()
                : (targetGem as JObject)?.Value<string>("id");
            if (string.IsNullOrEmpty(targetGemId))
            {
                detail = "No bonusGemTarget.";
                return false;
            }

            var coord = FindFirstBoardGem(snapshot, targetGemId);
            if (!coord.HasValue)
            {
                detail = "No board gem for bonus target " + targetGemId + ".";
                return false;
            }

            if (RunSemantic(
                controller,
                "click_board_cell",
                new JObject { ["row"] = coord.Value.x, ["column"] = coord.Value.y },
                out detail
            ))
            {
                detail = "take_bonus_gem";
                return true;
            }

            return false;
        }

        private static bool TryUseInventoryAction(
            GemDuelGameController controller,
            JObject snapshot,
            string action,
            string player,
            out string detail
        )
        {
            foreach (var gemId in new[] { "red", "green", "blue", "white", "black", "pearl", "gold" })
            {
                if (GetInventoryValue(snapshot, player, gemId) <= 0)
                {
                    continue;
                }

                return RunSemantic(controller, action, new JObject { ["gemId"] = gemId }, out detail);
            }

            detail = "No inventory gem for " + action + ".";
            return false;
        }

        private static bool TryChooseDraftBuff(
            GemDuelGameController controller,
            JObject automationState,
            out string detail
        )
        {
            var buff = ((JArray)automationState["visibleTargets"])
                .OfType<JObject>()
                .FirstOrDefault(target => target.Value<string>("kind") == "Buff");
            if (buff == null)
            {
                detail = "No visible draft buff.";
                return false;
            }

            return RunSemantic(
                controller,
                "choose_boon",
                new JObject { ["buffId"] = buff.Value<string>("buffId") },
                out detail
            );
        }

        private static bool RunSemantic(
            GemDuelGameController controller,
            string action,
            JObject payload,
            out string detail
        )
        {
            if (controller.RunSemanticActionForAutomation(action, payload, out var error))
            {
                detail = action;
                return true;
            }

            detail = action + " rejected: " + error;
            return false;
        }

        private static Vector2Int? FindFirstBoardGem(JObject snapshot, string gemId)
        {
            var board = (JArray)snapshot["board"];
            for (var row = 0; row < board.Count; row += 1)
            {
                var cells = (JArray)board[row];
                for (var column = 0; column < cells.Count; column += 1)
                {
                    if (cells[column].Value<string>() == gemId)
                    {
                        return new Vector2Int(row, column);
                    }
                }
            }

            return null;
        }

        private static Vector2Int? FindFirstCollectibleBoardGem(JObject snapshot)
        {
            var board = (JArray)snapshot["board"];
            for (var row = 0; row < board.Count; row += 1)
            {
                var cells = (JArray)board[row];
                for (var column = 0; column < cells.Count; column += 1)
                {
                    var gemId = cells[column].Value<string>();
                    if (gemId != "empty" && gemId != "gold")
                    {
                        return new Vector2Int(row, column);
                    }
                }
            }

            return null;
        }

        private static int GetInventoryValue(JObject snapshot, string player, string gemId)
        {
            return ((JObject)((JObject)snapshot["inventories"])[player]).Value<int>(gemId);
        }

        private static string GetBoardGem(JObject snapshot, int row, int column)
        {
            return ((JArray)((JArray)snapshot["board"])[row])[column].Value<string>();
        }

        private static bool HasReserveRoom(JObject snapshot)
        {
            var player = snapshot.Value<string>("turn");
            var reservedByPlayer = (JObject)snapshot["playerReserved"];
            var reserved = reservedByPlayer?[player] as JArray;
            return reserved == null || reserved.Count < 3;
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

        private static string CurrentOpponent(JObject snapshot)
        {
            return snapshot.Value<string>("turn") == "p1" ? "p2" : "p1";
        }

        private static string ResolveActionFamily(string detail)
        {
            if (string.IsNullOrWhiteSpace(detail))
            {
                return "unknown";
            }

            var separator = detail.IndexOf(' ');
            return separator < 0 ? detail : detail.Substring(0, separator);
        }

        private static bool ShouldRerollDraftForPlayer(
            JObject snapshot,
            string draftActionPreference,
            HashSet<string> draftRerolledPlayers
        )
        {
            if (!IsPreference(draftActionPreference, "reroll-each-player-first"))
            {
                return false;
            }

            var player = snapshot.Value<string>("turn") ?? string.Empty;
            return !string.IsNullOrEmpty(player) && !draftRerolledPlayers.Contains(player);
        }

        private static string NormalizeStartMode(string startMode)
        {
            return IsPreference(startMode, "roguelike") ? "roguelike" : "classic";
        }

        private static bool IsPreference(string value, string expected)
        {
            return string.Equals(
                string.IsNullOrWhiteSpace(value) ? "balanced" : value.Trim(),
                expected,
                StringComparison.OrdinalIgnoreCase
            );
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
