using System;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json.Linq;
using UnityEngine;

namespace GemDuel.Presentation
{
    public sealed class LocalDevReservedDiscardReleasePathSmokeOptions
    {
        public string Seed { get; set; } = "unity-reserved-discard-seed-10";
        public int ViewportWidth { get; set; } = 1920;
        public int ViewportHeight { get; set; } = 1080;
    }

    public static class LocalDevReservedDiscardReleasePathSmoke
    {
        private const string RequiredDiscardBuffId = "puppet_master";

        public static JObject Run(
            GemDuelGameController controller,
            LocalDevReservedDiscardReleasePathSmokeOptions options
        )
        {
            options = options ?? new LocalDevReservedDiscardReleasePathSmokeOptions();
            var actions = new JArray();
            var report = new JObject
            {
                ["schemaVersion"] = 1,
                ["kind"] = "unity-localdev-reserved-discard-release-path-smoke",
                ["startedAt"] = DateTime.UtcNow.ToString("O"),
                ["seed"] = options.Seed,
                ["requiredBuffId"] = RequiredDiscardBuffId,
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
                        "start_roguelike_game",
                        new JObject { ["seed"] = options.Seed },
                        out var startError
                    )
                )
                {
                    return Fail(report, "start_roguelike_game failed: " + startError, controller, options);
                }

                var afterStart = controller.BuildAutomationStateSnapshot(
                    options.ViewportWidth,
                    options.ViewportHeight
                );
                if (controller.LastAutomationDriver != "setup-live-rules-engine")
                {
                    return Fail(
                        report,
                        "Roguelike Local PvP did not start through the live rules-engine bridge.",
                        controller,
                        options
                    );
                }

                var startReplay = (JObject)afterStart["replay"];
                if (afterStart.Value<int>("totalEvents") != 0 || startReplay.Value<bool>("loaded"))
                {
                    report["usedFixtureReplayAsGameplayDriver"] = true;
                    return Fail(report, "Fresh roguelike start unexpectedly loaded fixture replay events.", controller, options);
                }

                if (startReplay["liveRecording"] == null || startReplay["liveRecording"].Type == JTokenType.Null)
                {
                    return Fail(report, "Fresh roguelike start did not create live replay recording.", controller, options);
                }

                if (!HasVisibleBuff(afterStart, RequiredDiscardBuffId))
                {
                    return Fail(
                        report,
                        "Initial draft pool did not expose required discard buff " + RequiredDiscardBuffId + ".",
                        controller,
                        options
                    );
                }

                if (
                    !controller.RunSemanticActionForAutomation(
                        "choose_boon",
                        new JObject { ["buffId"] = RequiredDiscardBuffId },
                        out var p1BuffError
                    )
                )
                {
                    return Fail(report, "P1 choose_boon failed: " + p1BuffError, controller, options);
                }

                var afterP1Buff = controller.BuildAutomationStateSnapshot(
                    options.ViewportWidth,
                    options.ViewportHeight
                );
                AppendAction(actions, "choose_boon", "choose_boon", afterStart, afterP1Buff);

                var p2BuffId = FirstVisibleBuffId(afterP1Buff);
                if (string.IsNullOrEmpty(p2BuffId))
                {
                    return Fail(report, "No P2 draft buff target was visible after P1 selected puppet_master.", controller, options);
                }

                if (
                    !controller.RunSemanticActionForAutomation(
                        "choose_boon",
                        new JObject { ["buffId"] = p2BuffId },
                        out var p2BuffError
                    )
                )
                {
                    return Fail(report, "P2 choose_boon failed: " + p2BuffError, controller, options);
                }

                var afterDraft = controller.BuildAutomationStateSnapshot(
                    options.ViewportWidth,
                    options.ViewportHeight
                );
                AppendAction(actions, "choose_boon", "choose_boon", afterP1Buff, afterDraft);
                if (afterDraft.Value<string>("phase") != "IDLE")
                {
                    return Fail(report, "Draft did not resolve to IDLE before reserved-discard path.", controller, options);
                }

                var beforeReserve = afterDraft;
                if (beforeReserve.Value<string>("turn") != "p1")
                {
                    if (!TakeSingleGem(controller, beforeReserve, out var preReserveDetail, out beforeReserve, options))
                    {
                        return Fail(report, "Could not return turn to P1 before reserve: " + preReserveDetail, controller, options);
                    }

                    AppendAction(actions, preReserveDetail, "take_gems", afterDraft, beforeReserve);
                }

                if (beforeReserve.Value<string>("turn") != "p1")
                {
                    return Fail(report, "Reserved-discard setup could not reach P1 turn.", controller, options);
                }

                if (!FindFirstMarketCard((JObject)beforeReserve["snapshot"], out var level, out var index, out var reservedCard))
                {
                    return Fail(report, "No market card was available to reserve.", controller, options);
                }

                if (
                    !controller.RunSemanticActionForAutomation(
                        "reserve_card",
                        new JObject { ["level"] = level, ["index"] = index },
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

                AppendAction(actions, "reserve_card " + reservedCard, "reserve_card", beforeReserve, afterReserve);
                if (!ReservedContains(afterReserve, "p1", reservedCard))
                {
                    return Fail(report, "P1 reserved row did not contain the reserved market card.", controller, options);
                }

                var beforeDiscard = afterReserve;
                if (beforeDiscard.Value<string>("turn") != "p1")
                {
                    if (!TakeSingleGem(controller, beforeDiscard, out var returnDetail, out beforeDiscard, options))
                    {
                        return Fail(report, "Could not return turn to P1 before discard: " + returnDetail, controller, options);
                    }

                    AppendAction(actions, returnDetail, "take_gems", afterReserve, beforeDiscard);
                }

                if (beforeDiscard.Value<string>("turn") != "p1")
                {
                    return Fail(report, "Reserved-discard setup did not return to P1.", controller, options);
                }

                var reservedTarget = FindVisibleTarget(beforeDiscard, "player.reserved.0");
                if (
                    reservedTarget == null
                    || reservedTarget.Value<string>("kind") != "ReservedCard"
                    || reservedTarget.Value<string>("instanceId") != reservedCard
                )
                {
                    return Fail(report, "P1 reserved card visible target was not exposed for " + reservedCard + ".", controller, options);
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
                if (((JObject)preview["preview"]).Value<string>("source") != "reserved")
                {
                    return Fail(report, "Reserved-card preview did not open.", controller, options);
                }

                if (!HasVisibleTarget(preview, "card.preview.action.discard"))
                {
                    return Fail(report, "Reserved-card preview discard control was not visible.", controller, options);
                }

                if (
                    !controller.RunSemanticActionForAutomation(
                        "confirm_preview_action",
                        new JObject { ["actionId"] = "discard" },
                        out var discardError
                    )
                )
                {
                    return Fail(report, "confirm_preview_action discard failed: " + discardError, controller, options);
                }

                var afterDiscard = controller.BuildAutomationStateSnapshot(
                    options.ViewportWidth,
                    options.ViewportHeight
                );
                AppendAction(actions, "discard_reserved " + reservedCard, "discard_reserved", beforeDiscard, afterDiscard);
                if (ReservedContains(afterDiscard, "p1", reservedCard))
                {
                    return Fail(report, "P1 reserved row still contained discarded card.", controller, options);
                }

                if (afterDiscard.Value<string>("statusText") != "Applied live action | DISCARD_RESERVED")
                {
                    return Fail(report, "DISCARD_RESERVED status was not surfaced after discard.", controller, options);
                }

                if (!controller.ExportReplayJsonForAutomation(out var exportedJson, out var exportError))
                {
                    return Fail(report, "Replay export failed after reserved discard: " + exportError, controller, options);
                }

                var exported = JObject.Parse(exportedJson);
                var events = (JArray)exported["events"];
                var eventTypes = new JArray(events.Select(item => item.Value<string>("type")));
                var selectBuffIndex = FindEventIndex(events, "select_buff", RequiredDiscardBuffId);
                var reserveIndex = FindEventIndex(events, "reserve_card", reservedCard);
                var discardIndex = FindEventIndex(events, "discard_reserved", reservedCard);
                if (selectBuffIndex < 0 || reserveIndex < 0 || discardIndex < 0 || discardIndex <= reserveIndex)
                {
                    return Fail(
                        report,
                        "Exported replay did not contain ordered puppet_master select, reserve_card, and discard_reserved.",
                        controller,
                        options
                    );
                }

                var finalHash = CurrentStateHash(afterDiscard);
                var exportedHash = ((JObject)exported["summary"]).Value<string>("finalStateHash");
                if (exportedHash != finalHash)
                {
                    return Fail(
                        report,
                        "Exported replay final hash mismatch after reserved discard: "
                            + exportedHash
                            + " != "
                            + finalHash,
                        controller,
                        options
                    );
                }

                reviewRoot = new GameObject("GemDuel Reserved Discard Release Path Replay Review");
                var review = reviewRoot.AddComponent<GemDuelGameController>();
                if (!review.ImportReplayJsonForAutomation(exportedJson, out var importError))
                {
                    return Fail(report, "Replay review import failed after reserved discard: " + importError, controller, options);
                }

                if (!review.PlayReplayToEndForAutomation(out var reviewError))
                {
                    return Fail(report, "Replay review playback failed after reserved discard: " + reviewError, controller, options);
                }

                var reviewed = review.BuildAutomationStateSnapshot(options.ViewportWidth, options.ViewportHeight);
                var reviewedHash = CurrentStateHash(reviewed);
                if (reviewedHash != exportedHash)
                {
                    return Fail(
                        report,
                        "Replay review hash mismatch after reserved discard: "
                            + reviewedHash
                            + " != "
                            + exportedHash,
                        controller,
                        options
                    );
                }

                report["draftStartStateSummary"] = BuildStateSummary(afterStart);
                report["afterDraftStateSummary"] = BuildStateSummary(afterDraft);
                report["afterReserveStateSummary"] = BuildStateSummary(afterReserve);
                report["afterDiscardStateSummary"] = BuildStateSummary(afterDiscard);
                report["reservedDiscardSummary"] = new JObject
                {
                    ["p1BuffId"] = RequiredDiscardBuffId,
                    ["p2BuffId"] = p2BuffId,
                    ["reservedCard"] = reservedCard,
                    ["reservedCardVisibleBeforeDiscard"] = true,
                    ["discardControlVisibleBeforeDiscard"] = true,
                    ["finalPhase"] = afterDiscard.Value<string>("phase"),
                    ["finalTurn"] = afterDiscard.Value<string>("turn"),
                    ["recordedEvents"] = RecordedEventCount(afterDiscard),
                    ["eventTypes"] = eventTypes,
                    ["selectBuffEventIndex"] = selectBuffIndex,
                    ["reserveEventIndex"] = reserveIndex,
                    ["discardEventIndex"] = discardIndex,
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

        private static bool CompleteReserveGoldIfNeeded(
            GemDuelGameController controller,
            JObject state,
            out string detail,
            out JObject after,
            LocalDevReservedDiscardReleasePathSmokeOptions options
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

            var coord = FindFirstGoldBoardGem((JObject)state["snapshot"]);
            if (!coord.HasValue)
            {
                detail = "Reserve was waiting for Gold, but no Gold board target was available.";
                return false;
            }

            if (
                !controller.RunSemanticActionForAutomation(
                    "click_board_cell",
                    new JObject { ["row"] = coord.Value.x, ["column"] = coord.Value.y },
                    out var goldError
                )
            )
            {
                detail = "reserve gold click rejected: " + goldError;
                return false;
            }

            after = controller.BuildAutomationStateSnapshot(options.ViewportWidth, options.ViewportHeight);
            detail = "reserve_card_with_gold";
            return after.Value<string>("phase") == "IDLE";
        }

        private static bool TakeSingleGem(
            GemDuelGameController controller,
            JObject before,
            out string detail,
            out JObject after,
            LocalDevReservedDiscardReleasePathSmokeOptions options
        )
        {
            after = before;
            if (before.Value<string>("phase") != "IDLE")
            {
                detail = "Cannot take a setup gem during phase " + before.Value<string>("phase") + ".";
                return false;
            }

            var coord = FindFirstCollectibleBoardGem((JObject)before["snapshot"]);
            if (!coord.HasValue)
            {
                detail = "No collectible board gem for setup turn.";
                return false;
            }

            if (
                !controller.RunSemanticActionForAutomation(
                    "click_board_cell",
                    new JObject { ["row"] = coord.Value.x, ["column"] = coord.Value.y },
                    out var clickError
                )
            )
            {
                detail = "click_board_cell rejected during setup turn: " + clickError;
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

        private static bool FindFirstMarketCard(
            JObject snapshot,
            out int level,
            out int index,
            out string instanceId
        )
        {
            var market = (JObject)snapshot["market"];
            for (var candidateLevel = 1; candidateLevel <= 3; candidateLevel += 1)
            {
                var row = market[candidateLevel.ToString()] as JArray;
                if (row == null)
                {
                    continue;
                }

                for (var candidateIndex = 0; candidateIndex < row.Count; candidateIndex += 1)
                {
                    var candidateId = row[candidateIndex].Value<string>();
                    if (!string.IsNullOrEmpty(candidateId))
                    {
                        level = candidateLevel;
                        index = candidateIndex;
                        instanceId = candidateId;
                        return true;
                    }
                }
            }

            level = 0;
            index = -1;
            instanceId = string.Empty;
            return false;
        }

        private static bool ReservedContains(JObject automationState, string player, string instanceId)
        {
            var snapshot = (JObject)automationState["snapshot"];
            var reserved = (JArray)((JObject)snapshot["playerReserved"])[player];
            return reserved.Values<string>().Contains(instanceId);
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

        private static int FindEventIndex(JArray events, string eventType, string id)
        {
            for (var index = 0; index < events.Count; index += 1)
            {
                var item = events[index] as JObject;
                if (item == null || item.Value<string>("type") != eventType)
                {
                    continue;
                }

                if (
                    item.Value<string>("instanceId") == id
                    || item.Value<string>("buffId") == id
                    || string.IsNullOrEmpty(id)
                )
                {
                    return index;
                }
            }

            return -1;
        }

        private static bool HasVisibleBuff(JObject automationState, string buffId)
        {
            return VisibleTargets(automationState)
                .Any(target =>
                    target.Value<string>("kind") == "Buff"
                    && target.Value<string>("buffId") == buffId
                    && target.Value<bool>("clickable")
                );
        }

        private static string FirstVisibleBuffId(JObject automationState)
        {
            return VisibleTargets(automationState)
                .Where(target => target.Value<string>("kind") == "Buff" && target.Value<bool>("clickable"))
                .OrderBy(target => target.Value<int?>("index") ?? int.MaxValue)
                .Select(target => target.Value<string>("buffId"))
                .FirstOrDefault(value => !string.IsNullOrEmpty(value));
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
            LocalDevReservedDiscardReleasePathSmokeOptions options
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
