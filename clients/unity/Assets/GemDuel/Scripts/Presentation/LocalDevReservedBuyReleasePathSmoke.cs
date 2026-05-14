using System;
using System.Collections.Generic;
using System.Linq;
using GemDuel.Catalog;
using GemDuel.Core;
using Newtonsoft.Json.Linq;
using UnityEngine;

namespace GemDuel.Presentation
{
    public sealed class LocalDevReservedBuyReleasePathSmokeOptions
    {
        public string Seed { get; set; } = "unity-reserved-buy-seed-20260512";
        public int ViewportWidth { get; set; } = 1920;
        public int ViewportHeight { get; set; } = 1080;
        public int MaxSetupActions { get; set; } = 16;
    }

    public static class LocalDevReservedBuyReleasePathSmoke
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
            LocalDevReservedBuyReleasePathSmokeOptions options
        )
        {
            options = options ?? new LocalDevReservedBuyReleasePathSmokeOptions();
            var actions = new JArray();
            var report = new JObject
            {
                ["schemaVersion"] = 1,
                ["kind"] = "unity-localdev-reserved-buy-release-path-smoke",
                ["startedAt"] = DateTime.UtcNow.ToString("O"),
                ["seed"] = options.Seed,
                ["maxSetupActions"] = options.MaxSetupActions,
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
                controller.LoadMainMenuForAutomation();
                if (
                    !controller.RunSemanticActionForAutomation(
                        "start_local_game",
                        new JObject { ["seed"] = options.Seed },
                        out var startError
                    )
                )
                {
                    return Fail(report, "start_local_game failed: " + startError, controller, options);
                }

                var afterStart = controller.BuildAutomationStateSnapshot(
                    options.ViewportWidth,
                    options.ViewportHeight
                );
                if (controller.LastAutomationDriver != "setup-live-rules-engine")
                {
                    return Fail(
                        report,
                        "Local PvP did not start through the live rules-engine bridge.",
                        controller,
                        options
                    );
                }

                var startReplay = (JObject)afterStart["replay"];
                if (afterStart.Value<int>("totalEvents") != 0 || startReplay.Value<bool>("loaded"))
                {
                    report["usedFixtureReplayAsGameplayDriver"] = true;
                    return Fail(report, "Fresh Local PvP start unexpectedly loaded fixture replay events.", controller, options);
                }

                if (startReplay["liveRecording"] == null || startReplay["liveRecording"].Type == JTokenType.Null)
                {
                    return Fail(report, "Fresh Local PvP start did not create live replay recording.", controller, options);
                }

                var catalog = new CatalogLoader().LoadDefault();
                var beforeReserve = afterStart;
                if (beforeReserve.Value<string>("turn") != "p1")
                {
                    if (!TakeSingleGem(controller, beforeReserve, out var preReserveDetail, out beforeReserve, options))
                    {
                        return Fail(report, "Could not return turn to P1 before reserve: " + preReserveDetail, controller, options);
                    }

                    AppendAction(actions, preReserveDetail, "take_gems", afterStart, beforeReserve);
                }

                if (beforeReserve.Value<string>("turn") != "p1")
                {
                    return Fail(report, "Reserved-buy setup could not reach P1 turn.", controller, options);
                }

                if (!FindReservedBuyCandidate((JObject)beforeReserve["snapshot"], catalog, out var candidate))
                {
                    return Fail(report, "No non-Joker market card candidate was available for reserved buy.", controller, options);
                }

                if (
                    !controller.RunSemanticActionForAutomation(
                        "reserve_card",
                        new JObject { ["level"] = candidate.Level, ["index"] = candidate.Index },
                        out var reserveError
                    )
                )
                {
                    return Fail(report, "reserve_card failed: " + reserveError, controller, options);
                }

                var afterReserveInitial = controller.BuildAutomationStateSnapshot(
                    options.ViewportWidth,
                    options.ViewportHeight
                );
                if (
                    !CompleteReserveGoldIfNeeded(
                        controller,
                        afterReserveInitial,
                        out var reserveDetail,
                        out var afterReserve,
                        options
                    )
                )
                {
                    return Fail(report, "reserve_card follow-up failed: " + reserveDetail, controller, options);
                }

                AppendAction(actions, "reserve_card " + candidate.InstanceId, "reserve_card", beforeReserve, afterReserve);
                if (!ReservedContains(afterReserve, "p1", candidate.InstanceId))
                {
                    return Fail(report, "P1 reserved row did not contain the reserved market card.", controller, options);
                }

                var afterReserveVisualTarget = FindVisibleTarget(afterReserve, "player.p1.reserved.0.visual");
                if (!AssertReservedCardMiniStackTarget(afterReserveVisualTarget, out var afterReserveVisualError))
                {
                    return Fail(report, "Reserved card visual contract failed immediately after reserve: " + afterReserveVisualError, controller, options);
                }

                var beforeBuy = afterReserve;
                var setupActions = 0;
                while (!IsAffordableForPlayer((JObject)beforeBuy["snapshot"], "p1", candidate.Card, catalog))
                {
                    if (setupActions >= Math.Max(1, options.MaxSetupActions))
                    {
                        return Fail(
                            report,
                            "Reserved card did not become affordable within setup action limit.",
                            controller,
                            options
                        );
                    }

                    if (beforeBuy.Value<string>("phase") != "IDLE")
                    {
                        return Fail(report, "Unexpected setup phase before reserved buy: " + beforeBuy.Value<string>("phase"), controller, options);
                    }

                    var setupBefore = beforeBuy;
                    if (setupBefore.Value<string>("turn") == "p1")
                    {
                        if (
                            !TakeNeededGem(
                                controller,
                                setupBefore,
                                "p1",
                                candidate.Card,
                                catalog,
                                out var takeNeededDetail,
                                out beforeBuy,
                                options
                            )
                        )
                        {
                            return Fail(report, "Could not take needed P1 gem: " + takeNeededDetail, controller, options);
                        }

                        AppendAction(actions, takeNeededDetail, "take_gems", setupBefore, beforeBuy);
                    }
                    else
                    {
                        if (!TakeSingleGem(controller, setupBefore, out var passDetail, out beforeBuy, options, candidate.Card, catalog))
                        {
                            return Fail(report, "Could not pass non-P1 setup turn: " + passDetail, controller, options);
                        }

                        AppendAction(actions, passDetail, "take_gems", setupBefore, beforeBuy);
                    }

                    setupActions += 1;
                }

                if (beforeBuy.Value<string>("turn") != "p1")
                {
                    if (setupActions >= Math.Max(1, options.MaxSetupActions))
                    {
                        return Fail(
                            report,
                            "Reserved card was affordable, but setup action limit was reached before returning to P1.",
                            controller,
                            options
                        );
                    }

                    var passBefore = beforeBuy;
                    if (!TakeSingleGem(controller, passBefore, out var returnDetail, out beforeBuy, options, candidate.Card, catalog))
                    {
                        return Fail(report, "Could not return turn to P1 before reserved buy: " + returnDetail, controller, options);
                    }

                    AppendAction(actions, returnDetail, "take_gems", passBefore, beforeBuy);
                    setupActions += 1;
                }

                if (
                    beforeBuy.Value<string>("turn") != "p1"
                    || beforeBuy.Value<string>("phase") != "IDLE"
                    || !IsAffordableForPlayer((JObject)beforeBuy["snapshot"], "p1", candidate.Card, catalog)
                )
                {
                    return Fail(report, "Reserved-buy setup did not reach an affordable P1 IDLE turn.", controller, options);
                }

                var reservedTarget = FindVisibleTarget(beforeBuy, "player.reserved.0");
                if (
                    reservedTarget == null
                    || reservedTarget.Value<string>("kind") != "ReservedCard"
                    || reservedTarget.Value<string>("instanceId") != candidate.InstanceId
                )
                {
                    return Fail(report, "P1 reserved-card visible target was not exposed for " + candidate.InstanceId + ".", controller, options);
                }

                var reservedVisualTarget = FindVisibleTarget(beforeBuy, "player.p1.reserved.0.visual");
                if (!AssertReservedCardMiniStackTarget(reservedVisualTarget, out var reservedVisualError))
                {
                    return Fail(report, "Reserved card visual contract failed before reserved buy: " + reservedVisualError, controller, options);
                }

                if (
                    !controller.RunSemanticActionForAutomation(
                        "click_player_reserved",
                        new JObject { ["index"] = 0 },
                        out var previewError
                    )
                )
                {
                    return Fail(report, "click_player_reserved failed: " + previewError, controller, options);
                }

                var preview = controller.BuildAutomationStateSnapshot(
                    options.ViewportWidth,
                    options.ViewportHeight
                );
                if (
                    ((JObject)preview["preview"]).Value<string>("source") != "reserved"
                    || ((JObject)preview["preview"]).Value<string>("instanceId") != candidate.InstanceId
                )
                {
                    return Fail(report, "Reserved-card preview did not open for " + candidate.InstanceId + ".", controller, options);
                }

                if (!HasVisibleTarget(preview, "card.preview.primaryAction"))
                {
                    return Fail(report, "Reserved-card preview buy control was not visible.", controller, options);
                }

                if (
                    !controller.RunSemanticActionForAutomation(
                        "confirm_preview_action",
                        new JObject { ["actionId"] = "buy" },
                        out var buyError
                    )
                )
                {
                    return Fail(report, "confirm_preview_action buy failed: " + buyError, controller, options);
                }

                var afterBuy = controller.BuildAutomationStateSnapshot(
                    options.ViewportWidth,
                    options.ViewportHeight
                );
                AppendAction(actions, "buy_card reserved " + candidate.InstanceId, "buy_card", beforeBuy, afterBuy);
                if (ReservedContains(afterBuy, "p1", candidate.InstanceId))
                {
                    return Fail(report, "P1 reserved row still contained bought reserved card.", controller, options);
                }

                if (!TableauContains(afterBuy, "p1", candidate.InstanceId))
                {
                    return Fail(report, "P1 tableau did not contain bought reserved card.", controller, options);
                }

                if (afterBuy.Value<string>("statusText") != "Applied live action | BUY_CARD")
                {
                    return Fail(report, "BUY_CARD status was not surfaced after reserved buy.", controller, options);
                }

                if (!controller.ExportReplayJsonForAutomation(out var exportedJson, out var exportError))
                {
                    return Fail(report, "Replay export failed after reserved buy: " + exportError, controller, options);
                }

                var exported = JObject.Parse(exportedJson);
                var events = (JArray)exported["events"];
                var eventTypes = new JArray(events.Select(item => item.Value<string>("type")));
                var reserveIndex = FindEventIndex(events, "reserve_card", candidate.InstanceId, null);
                var buyIndex = FindEventIndex(events, "buy_card", candidate.InstanceId, "reserved");
                if (reserveIndex < 0 || buyIndex < 0 || buyIndex <= reserveIndex)
                {
                    return Fail(
                        report,
                        "Exported replay did not contain ordered reserve_card and reserved-source buy_card.",
                        controller,
                        options
                    );
                }

                var finalHash = CurrentStateHash(afterBuy);
                var exportedHash = ((JObject)exported["summary"]).Value<string>("finalStateHash");
                if (exportedHash != finalHash)
                {
                    return Fail(
                        report,
                        "Exported replay final hash mismatch after reserved buy: "
                            + exportedHash
                            + " != "
                            + finalHash,
                        controller,
                        options
                    );
                }

                reviewRoot = new GameObject("GemDuel Reserved Buy Release Path Replay Review");
                var review = reviewRoot.AddComponent<GemDuelGameController>();
                if (!review.ImportReplayJsonForAutomation(exportedJson, out var importError))
                {
                    return Fail(report, "Replay review import failed after reserved buy: " + importError, controller, options);
                }

                if (!review.PlayReplayToEndForAutomation(out var reviewError))
                {
                    return Fail(report, "Replay review playback failed after reserved buy: " + reviewError, controller, options);
                }

                var reviewed = review.BuildAutomationStateSnapshot(options.ViewportWidth, options.ViewportHeight);
                var reviewedHash = CurrentStateHash(reviewed);
                if (reviewedHash != exportedHash)
                {
                    return Fail(
                        report,
                        "Replay review hash mismatch after reserved buy: "
                            + reviewedHash
                            + " != "
                            + exportedHash,
                        controller,
                        options
                    );
                }

                report["afterStartStateSummary"] = BuildStateSummary(afterStart);
                report["afterReserveStateSummary"] = BuildStateSummary(afterReserve);
                report["beforeBuyStateSummary"] = BuildStateSummary(beforeBuy);
                report["afterBuyStateSummary"] = BuildStateSummary(afterBuy);
                report["reservedBuySummary"] = new JObject
                {
                    ["reservedCard"] = candidate.InstanceId,
                    ["reservedCardBaseId"] = candidate.Card.Id,
                    ["reservedCardLevel"] = candidate.Level,
                    ["reservedCardMarketIndex"] = candidate.Index,
                    ["reservedCardMissingCostAtStart"] = candidate.MissingCost,
                    ["setupActionCount"] = setupActions,
                    ["reservedCardVisibleBeforeBuy"] = true,
                    ["reservedCardVisualRectAfterReserve"] = afterReserveVisualTarget?["rect"]?.DeepClone(),
                    ["reservedCardVisualRectBeforeBuy"] = reservedVisualTarget?["rect"]?.DeepClone(),
                    ["reservedCardMiniStackMaxWidthPx"] = 120,
                    ["reservedCardMiniStackMaxHeightPx"] = 160,
                    ["buyControlVisibleBeforeBuy"] = true,
                    ["finalPhase"] = afterBuy.Value<string>("phase"),
                    ["finalTurn"] = afterBuy.Value<string>("turn"),
                    ["recordedEvents"] = RecordedEventCount(afterBuy),
                    ["eventTypes"] = eventTypes,
                    ["reserveEventIndex"] = reserveIndex,
                    ["buyEventIndex"] = buyIndex,
                    ["buyEventSource"] = ((JObject)events[buyIndex]).Value<string>("source"),
                    ["exportedEvents"] = events.Count,
                    ["exportedSummaryFinalStateHash"] = exportedHash,
                    ["controllerCurrentStateHash"] = finalHash,
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

        private sealed class ReservedBuyCandidate
        {
            public int Level;
            public int Index;
            public string InstanceId = string.Empty;
            public CardDef Card;
            public int MissingCost;
            public int UnavailableCost;
        }

        private static bool FindReservedBuyCandidate(
            JObject snapshot,
            UnityCatalog catalog,
            out ReservedBuyCandidate candidate
        )
        {
            candidate = FindMarketCards(snapshot)
                .Select(marketCard => BuildCandidate(snapshot, catalog, marketCard.level, marketCard.index, marketCard.instanceId))
                .Where(item => item != null)
                .OrderBy(item => item.UnavailableCost)
                .ThenBy(item => item.MissingCost)
                .ThenBy(item => item.Level)
                .ThenBy(item => item.Index)
                .FirstOrDefault();
            return candidate != null;
        }

        private static ReservedBuyCandidate BuildCandidate(
            JObject snapshot,
            UnityCatalog catalog,
            int level,
            int index,
            string instanceId
        )
        {
            if (IsJokerRuntimeCardId(instanceId))
            {
                return null;
            }

            var cardId = ParseRuntimeCardId(instanceId);
            if (string.IsNullOrEmpty(cardId) || !catalog.Cards.TryGetValue(cardId, out var card))
            {
                return null;
            }

            var missingCost = MissingCostForPlayer(snapshot, snapshot.Value<string>("turn"), card, catalog);
            return new ReservedBuyCandidate
            {
                Level = level,
                Index = index,
                InstanceId = instanceId,
                Card = card,
                MissingCost = missingCost,
                UnavailableCost = UnavailableMissingCost(snapshot, card, catalog),
            };
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

        private static bool CompleteReserveGoldIfNeeded(
            GemDuelGameController controller,
            JObject state,
            out string detail,
            out JObject after,
            LocalDevReservedBuyReleasePathSmokeOptions options
        )
        {
            after = state;
            detail = "reserve_card";
            var phase = state.Value<string>("phase");
            if (phase == "IDLE")
            {
                return true;
            }

            if (phase != "RESERVE_WAITING_GEM")
            {
                detail = "Unexpected reserve phase " + phase + ".";
                return false;
            }

            var promptTargets = VisibleTargets(state)
                .Where(target =>
                    target.Value<string>("kind") == "ReserveGoldPrompt"
                    && target.Value<string>("gemId") == "gold"
                )
                .ToArray();
            if (promptTargets.Length == 0)
            {
                detail = "Reserve was waiting for Gold, but the Gold prompt visual target was not exposed.";
                return false;
            }

            var attempts = new List<string>();
            foreach (var promptTarget in promptTargets)
            {
                var coord = new Vector2Int(promptTarget.Value<int>("row"), promptTarget.Value<int>("column"));

                if (
                    !controller.RunSemanticActionForAutomation(
                        "click_board_cell",
                        new JObject { ["row"] = coord.x, ["column"] = coord.y },
                        out var goldError
                    )
                )
                {
                    attempts.Add(coord.x + "," + coord.y + ": rejected " + goldError);
                    continue;
                }

                after = controller.BuildAutomationStateSnapshot(options.ViewportWidth, options.ViewportHeight);
                if (after.Value<string>("phase") == "IDLE")
                {
                    detail = "reserve_card_with_gold";
                    return true;
                }

                attempts.Add(
                    coord.x
                    + ","
                    + coord.y
                    + ": phase "
                    + after.Value<string>("phase")
                    + ", status "
                    + after.Value<string>("statusText")
                );
            }

            detail = "reserve_card_with_gold failed for prompt targets [" + string.Join("; ", attempts) + "]";
            return false;
        }

        private static bool AssertReservedCardMiniStackTarget(JObject target, out string error)
        {
            error = string.Empty;
            if (target == null)
            {
                error = "player reserved visual target missing";
                return false;
            }

            if (target.Value<string>("kind") != "ReservedCardVisual")
            {
                error = "target kind " + target.Value<string>("kind") + " is not ReservedCardVisual";
                return false;
            }

            var rect = target["rect"] as JObject;
            if (rect == null)
            {
                error = "target rect missing";
                return false;
            }

            var width = rect.Value<double>("width");
            var height = rect.Value<double>("height");
            if (width > 120d || height > 160d)
            {
                error = "reserved visual rect " + width.ToString("0.##") + "x" + height.ToString("0.##") + " exceeds mini-stack budget 120x160";
                return false;
            }

            return true;
        }

        private static bool TakeNeededGem(
            GemDuelGameController controller,
            JObject before,
            string player,
            CardDef targetCard,
            UnityCatalog catalog,
            out string detail,
            out JObject after,
            LocalDevReservedBuyReleasePathSmokeOptions options
        )
        {
            after = before;
            if (before.Value<string>("phase") != "IDLE")
            {
                detail = "Cannot take a needed gem during phase " + before.Value<string>("phase") + ".";
                return false;
            }

            var snapshot = (JObject)before["snapshot"];
            var missing = BuildMissingVector(snapshot, player, targetCard, catalog);
            var coord = missing
                .Where(entry => entry.Value > 0)
                .OrderByDescending(entry => entry.Value)
                .Select(entry => new { GemId = entry.Key, Coord = FindFirstBoardGem(snapshot, entry.Key) })
                .FirstOrDefault(entry => entry.Coord.HasValue);
            if (coord == null)
            {
                detail = "No board gem matched reserved-card missing cost.";
                return false;
            }

            return TakeGemAt(controller, before, coord.Coord.Value, out detail, out after, options);
        }

        private static bool TakeSingleGem(
            GemDuelGameController controller,
            JObject before,
            out string detail,
            out JObject after,
            LocalDevReservedBuyReleasePathSmokeOptions options,
            CardDef reservedCard = null,
            UnityCatalog catalog = null
        )
        {
            after = before;
            if (before.Value<string>("phase") != "IDLE")
            {
                detail = "Cannot take a setup gem during phase " + before.Value<string>("phase") + ".";
                return false;
            }

            var avoidColors = reservedCard == null || catalog == null
                ? new HashSet<string>(StringComparer.Ordinal)
                : new HashSet<string>(
                    BuildMissingVector((JObject)before["snapshot"], "p1", reservedCard, catalog)
                        .Where(entry => entry.Value > 0)
                        .Select(entry => entry.Key),
                    StringComparer.Ordinal
                );
            var coord = FindFirstCollectibleBoardGem((JObject)before["snapshot"], avoidColors);
            if (!coord.HasValue)
            {
                detail = "No collectible board gem for setup turn.";
                return false;
            }

            return TakeGemAt(controller, before, coord.Value, out detail, out after, options);
        }

        private static bool TakeGemAt(
            GemDuelGameController controller,
            JObject before,
            Vector2Int coord,
            out string detail,
            out JObject after,
            LocalDevReservedBuyReleasePathSmokeOptions options
        )
        {
            after = before;
            if (
                !controller.RunSemanticActionForAutomation(
                    "click_board_cell",
                    new JObject { ["row"] = coord.x, ["column"] = coord.y },
                    out var clickError
                )
            )
            {
                detail = "click_board_cell rejected during setup turn: " + clickError;
                return false;
            }

            var afterClick = controller.BuildAutomationStateSnapshot(options.ViewportWidth, options.ViewportHeight);
            if (
                RecordedEventCount(afterClick) > RecordedEventCount(before)
                && CurrentStateHash(afterClick) != CurrentStateHash(before)
                && afterClick.Value<string>("phase") == "IDLE"
            )
            {
                after = afterClick;
                detail = "take_gems";
                return true;
            }

            if (!HasVisibleTarget(afterClick, "board.selection.confirm"))
            {
                detail = "confirm_gem_selection unavailable after setup click; phase="
                    + afterClick.Value<string>("phase")
                    + ", selected="
                    + (afterClick["gemSelection"]?.Value<int?>("count") ?? -1)
                    + ", recordedEventsBefore="
                    + RecordedEventCount(before)
                    + ", recordedEventsAfter="
                    + RecordedEventCount(afterClick);
                return false;
            }

            if (!controller.RunSemanticActionForAutomation("confirm_gem_selection", null, out var confirmError))
            {
                detail = "confirm_gem_selection rejected during setup turn: " + confirmError;
                return false;
            }

            after = controller.BuildAutomationStateSnapshot(options.ViewportWidth, options.ViewportHeight);
            detail = "take_gems";
            return true;
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

        private static Dictionary<string, int> BuildMissingVector(
            JObject snapshot,
            string player,
            CardDef card,
            UnityCatalog catalog
        )
        {
            var missing = new Dictionary<string, int>(StringComparer.Ordinal);
            foreach (var gemId in CostColors)
            {
                missing[gemId] = Math.Max(
                    0,
                    DiscountedCostForPlayer(snapshot, player, card, catalog, gemId)
                        - GetInventoryValue(snapshot, player, gemId)
                );
            }

            var gold = GetInventoryValue(snapshot, player, "gold");
            foreach (var gemId in CostColors)
            {
                if (gold <= 0 || missing[gemId] <= 0)
                {
                    continue;
                }

                var paidByGold = Math.Min(gold, missing[gemId]);
                missing[gemId] -= paidByGold;
                gold -= paidByGold;
            }

            return missing;
        }

        private static int MissingCostForPlayer(
            JObject snapshot,
            string player,
            CardDef card,
            UnityCatalog catalog
        )
        {
            return BuildMissingVector(snapshot, player, card, catalog).Values.Sum();
        }

        private static int UnavailableMissingCost(JObject snapshot, CardDef card, UnityCatalog catalog)
        {
            var unavailable = 0;
            foreach (var gemId in CostColors)
            {
                var needed = DiscountedCostForPlayer(snapshot, snapshot.Value<string>("turn"), card, catalog, gemId);
                unavailable += Math.Max(0, needed - CountBoardGem(snapshot, gemId));
            }

            return unavailable;
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

        private static Vector2Int? FindFirstCollectibleBoardGem(
            JObject snapshot,
            ISet<string> avoidColors = null
        )
        {
            var fallback = (Vector2Int?)null;
            var board = (JArray)snapshot["board"];
            for (var row = 0; row < board.Count; row += 1)
            {
                var cells = (JArray)board[row];
                for (var column = 0; column < cells.Count; column += 1)
                {
                    var gemId = cells[column].Value<string>();
                    if (gemId == "empty" || gemId == "gold")
                    {
                        continue;
                    }

                    var coord = new Vector2Int(row, column);
                    if (fallback == null)
                    {
                        fallback = coord;
                    }

                    if (avoidColors == null || !avoidColors.Contains(gemId))
                    {
                        return coord;
                    }
                }
            }

            return fallback;
        }

        private static Vector2Int? FindFirstGoldBoardGem(JObject snapshot)
        {
            var board = (JArray)snapshot["board"];
            for (var row = 0; row < board.Count; row += 1)
            {
                var cells = (JArray)board[row];
                for (var column = 0; column < cells.Count; column += 1)
                {
                    if (cells[column].Value<string>() == "gold")
                    {
                        return new Vector2Int(row, column);
                    }
                }
            }

            return null;
        }

        private static int CountBoardGem(JObject snapshot, string gemId)
        {
            return ((JArray)snapshot["board"])
                .OfType<JArray>()
                .SelectMany(row => row.Values<string>())
                .Count(value => value == gemId);
        }

        private static bool ReservedContains(JObject automationState, string player, string instanceId)
        {
            var snapshot = (JObject)automationState["snapshot"];
            var reserved = (JArray)((JObject)snapshot["playerReserved"])[player];
            return reserved.Values<string>().Contains(instanceId);
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

        private static int FindEventIndex(JArray events, string eventType, string id, string source)
        {
            for (var index = 0; index < events.Count; index += 1)
            {
                var item = events[index] as JObject;
                if (item == null || item.Value<string>("type") != eventType)
                {
                    continue;
                }

                if (!string.IsNullOrEmpty(source) && item.Value<string>("source") != source)
                {
                    continue;
                }

                if (
                    item.Value<string>("instanceId") == id
                    || item.Value<string>("card") == id
                    || string.IsNullOrEmpty(id)
                )
                {
                    return index;
                }
            }

            return -1;
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

        private static JObject FindVisibleTarget(JObject automationState, string semanticKey)
        {
            return VisibleTargets(automationState)
                .FirstOrDefault(target => target.Value<string>("semanticKey") == semanticKey);
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
            LocalDevReservedBuyReleasePathSmokeOptions options
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
