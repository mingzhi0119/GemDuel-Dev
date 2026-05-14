using System;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json.Linq;
using UnityEngine;

namespace GemDuel.Presentation
{
    public sealed class LocalDevReserveDeckReleasePathSmokeOptions
    {
        public string Seed { get; set; } = "unity-editmode-live-reserve-deck";
        public int ViewportWidth { get; set; } = 1920;
        public int ViewportHeight { get; set; } = 1080;
    }

    public static class LocalDevReserveDeckReleasePathSmoke
    {
        public static JObject Run(
            GemDuelGameController controller,
            LocalDevReserveDeckReleasePathSmokeOptions options
        )
        {
            options = options ?? new LocalDevReserveDeckReleasePathSmokeOptions();
            var actions = new JArray();
            var report = new JObject
            {
                ["schemaVersion"] = 1,
                ["kind"] = "unity-localdev-reserve-deck-release-path-smoke",
                ["startedAt"] = DateTime.UtcNow.ToString("O"),
                ["seed"] = options.Seed,
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

                var startSnapshot = (JObject)afterStart["snapshot"];
                var startDeck = ((JObject)startSnapshot["decks"])["1"] as JArray;
                if (startDeck == null || startDeck.Count == 0)
                {
                    return Fail(report, "Fresh Local PvP start did not expose a level-1 deck.", controller, options);
                }

                var topDeckCard = startDeck.Last.Value<string>();
                if (string.IsNullOrWhiteSpace(topDeckCard))
                {
                    return Fail(report, "Fresh Local PvP start did not expose a top level-1 deck card.", controller, options);
                }

                var startReserved = (JArray)((JObject)startSnapshot["playerReserved"])["p1"];
                var gold = FindFirstBoardGem(startSnapshot, "gold");
                if (!gold.HasValue)
                {
                    return Fail(report, "Reserve-deck smoke requires a visible Gold board gem.", controller, options);
                }

                var deckTarget = FindVisibleTarget(afterStart, "market.level.1");
                if (
                    deckTarget == null
                    || deckTarget.Value<string>("kind") != "MarketDeck"
                    || deckTarget.Value<int>("level") != 1
                    || !deckTarget.Value<bool>("clickable")
                )
                {
                    return Fail(report, "Visible level-1 market deck target was not exposed.", controller, options);
                }

                var goldTarget = FindVisibleTarget(afterStart, "board.cell." + gold.Value.x + "." + gold.Value.y);
                if (
                    goldTarget == null
                    || goldTarget.Value<string>("kind") != "Gem"
                    || goldTarget.Value<string>("gemId") != "gold"
                    || !goldTarget.Value<bool>("clickable")
                )
                {
                    return Fail(report, "Visible Gold board target was not exposed for reserve deck.", controller, options);
                }

                if (
                    !controller.RunSemanticActionForAutomation(
                        "click_market_deck",
                        new JObject { ["level"] = 1 },
                        out var previewError
                    )
                )
                {
                    return Fail(report, "click_market_deck failed: " + previewError, controller, options);
                }

                var preview = controller.BuildAutomationStateSnapshot(
                    options.ViewportWidth,
                    options.ViewportHeight
                );
                var previewContext = preview["preview"] as JObject;
                if (
                    previewContext == null
                    || previewContext.Value<string>("source") != "deck"
                    || previewContext.Value<int>("level") != 1
                )
                {
                    return Fail(report, "Market deck preview did not open for reserve deck.", controller, options);
                }

                if (!HasVisibleTarget(preview, "card.preview.action.reserve"))
                {
                    return Fail(report, "Market deck preview reserve control was not visible.", controller, options);
                }

                if (
                    !controller.RunSemanticActionForAutomation(
                        "confirm_preview_action",
                        new JObject { ["actionId"] = "reserve" },
                        out var reserveError
                    )
                )
                {
                    return Fail(report, "confirm_preview_action reserve failed: " + reserveError, controller, options);
                }

                var waiting = controller.BuildAutomationStateSnapshot(
                    options.ViewportWidth,
                    options.ViewportHeight
                );
                AppendAction(actions, "initiate_reserve_deck L1", "initiate_reserve_deck", preview, waiting);
                var waitingSnapshot = (JObject)waiting["snapshot"];
                var pendingReserve = waitingSnapshot["pendingReserve"] as JObject;
                if (waiting.Value<string>("phase") != "RESERVE_WAITING_GEM")
                {
                    return Fail(
                        report,
                        "Deck reserve preview action did not enter RESERVE_WAITING_GEM; phase was "
                            + waiting.Value<string>("phase")
                            + ".",
                        controller,
                        options
                    );
                }

                if (
                    pendingReserve == null
                    || pendingReserve.Value<bool?>("isDeck") != true
                    || pendingReserve.Value<int>("level") != 1
                )
                {
                    return Fail(report, "Deck reserve waiting state did not expose an isDeck pending reserve.", controller, options);
                }

                var goldPromptTarget = FindVisibleTarget(waiting, "board.reserveGoldPrompt." + gold.Value.x + "." + gold.Value.y);
                if (
                    goldPromptTarget == null
                    || goldPromptTarget.Value<string>("kind") != "ReserveGoldPrompt"
                    || goldPromptTarget.Value<string>("gemId") != "gold"
                )
                {
                    return Fail(report, "Deck reserve waiting state did not expose a visible Gold prompt target.", controller, options);
                }

                if (
                    !controller.RunSemanticActionForAutomation(
                        "click_board_cell",
                        new JObject { ["row"] = gold.Value.x, ["column"] = gold.Value.y },
                        out var goldError
                    )
                )
                {
                    return Fail(report, "reserve deck Gold click failed: " + goldError, controller, options);
                }

                var afterReserve = controller.BuildAutomationStateSnapshot(
                    options.ViewportWidth,
                    options.ViewportHeight
                );
                AppendAction(actions, "reserve_deck " + topDeckCard, "reserve_deck", waiting, afterReserve);
                var afterSnapshot = (JObject)afterReserve["snapshot"];
                var afterDeck = (JArray)((JObject)afterSnapshot["decks"])["1"];
                var afterReserved = (JArray)((JObject)afterSnapshot["playerReserved"])["p1"];
                if (afterReserve.Value<string>("phase") != "IDLE")
                {
                    return Fail(report, "Reserve deck did not return to IDLE.", controller, options);
                }

                if (afterReserve.Value<string>("turn") != "p2")
                {
                    return Fail(report, "Reserve deck did not advance the turn to P2.", controller, options);
                }

                if (afterDeck.Count != startDeck.Count - 1)
                {
                    return Fail(report, "Reserve deck did not remove exactly one card from the level-1 deck.", controller, options);
                }

                if (afterReserved.Count != startReserved.Count + 1 || !afterReserved.Values<string>().Contains(topDeckCard))
                {
                    return Fail(report, "Reserve deck did not add the top deck card to P1 reserved cards.", controller, options);
                }

                var reservedVisualTarget = FindVisibleTarget(afterReserve, "player.p1.reserved.0.visual");
                if (!AssertReservedCardMiniStackTarget(reservedVisualTarget, out var reservedVisualError))
                {
                    return Fail(report, "Reserved card visual contract failed after reserve deck: " + reservedVisualError, controller, options);
                }

                if (((JArray)((JArray)afterSnapshot["board"])[gold.Value.x])[gold.Value.y].Value<string>() != "empty")
                {
                    return Fail(report, "Reserve deck did not consume the selected Gold board gem.", controller, options);
                }

                if (afterReserve.Value<string>("statusText") != "Applied live action | RESERVE_DECK")
                {
                    return Fail(report, "RESERVE_DECK status was not surfaced after deck reserve.", controller, options);
                }

                var finalStateHash = CurrentStateHash(afterReserve);
                var finalRecordedEvents = RecordedEventCount(afterReserve);
                if (finalRecordedEvents < 2 || afterReserve.Value<int>("totalEvents") != 0)
                {
                    return Fail(report, "Reserve deck did not record live replay events through the bridge.", controller, options);
                }

                if (!controller.ExportReplayJsonForAutomation(out var exportedJson, out var exportError))
                {
                    return Fail(report, "Replay export failed after reserve deck: " + exportError, controller, options);
                }

                var exported = JObject.Parse(exportedJson);
                var events = (JArray)exported["events"];
                if (events.Count != finalRecordedEvents)
                {
                    return Fail(
                        report,
                        "Exported replay event count changed after reserve deck: "
                            + events.Count
                            + " != "
                            + finalRecordedEvents
                            + ".",
                        controller,
                        options
                    );
                }

                var eventTypes = new JArray(events.Select(item => item.Value<string>("type")));
                var initiateIndex = FindEventIndex(events, "initiate_reserve_deck", topDeckCard);
                var reserveIndex = FindEventIndex(events, "reserve_deck", topDeckCard);
                if (initiateIndex < 0 || reserveIndex < 0 || reserveIndex <= initiateIndex)
                {
                    return Fail(
                        report,
                        "Exported replay did not contain ordered initiate_reserve_deck and reserve_deck events.",
                        controller,
                        options
                    );
                }

                var exportedHash = ((JObject)exported["summary"]).Value<string>("finalStateHash");
                if (exportedHash != finalStateHash)
                {
                    return Fail(
                        report,
                        "Exported replay final hash mismatch after reserve deck: "
                            + exportedHash
                            + " != "
                            + finalStateHash,
                        controller,
                        options
                    );
                }

                reviewRoot = new GameObject("GemDuel Reserve Deck Release Path Replay Review");
                var review = reviewRoot.AddComponent<GemDuelGameController>();
                if (!review.ImportReplayJsonForAutomation(exportedJson, out var importError))
                {
                    return Fail(report, "Replay review import failed after reserve deck: " + importError, controller, options);
                }

                if (!review.PlayReplayToEndForAutomation(out var reviewError))
                {
                    return Fail(report, "Replay review playback failed after reserve deck: " + reviewError, controller, options);
                }

                var reviewed = review.BuildAutomationStateSnapshot(options.ViewportWidth, options.ViewportHeight);
                var reviewedHash = CurrentStateHash(reviewed);
                if (reviewedHash != exportedHash)
                {
                    return Fail(
                        report,
                        "Replay review hash mismatch after reserve deck: "
                            + reviewedHash
                            + " != "
                            + exportedHash,
                        controller,
                        options
                    );
                }

                report["afterStartStateSummary"] = BuildStateSummary(afterStart);
                report["previewStateSummary"] = BuildStateSummary(preview);
                report["waitingStateSummary"] = BuildStateSummary(waiting);
                report["afterReserveStateSummary"] = BuildStateSummary(afterReserve);
                report["reserveDeckSummary"] = new JObject
                {
                    ["deckLevel"] = 1,
                    ["topDeckCard"] = topDeckCard,
                    ["deckTargetVisibleBeforePreview"] = true,
                    ["goldTargetVisibleBeforeReserve"] = true,
                    ["goldPromptVisibleBeforeReserve"] = true,
                    ["goldCoord"] = new JObject { ["r"] = gold.Value.x, ["c"] = gold.Value.y },
                    ["previewSource"] = previewContext.Value<string>("source"),
                    ["visibleReserveControlBeforeInitiate"] = true,
                    ["phaseBeforeGold"] = waiting.Value<string>("phase"),
                    ["turnBeforeGold"] = waiting.Value<string>("turn"),
                    ["pendingReserveIsDeck"] = true,
                    ["statusAfterReserve"] = afterReserve.Value<string>("statusText"),
                    ["finalPhase"] = afterReserve.Value<string>("phase"),
                    ["finalTurn"] = afterReserve.Value<string>("turn"),
                    ["startDeckCount"] = startDeck.Count,
                    ["afterDeckCount"] = afterDeck.Count,
                    ["startReservedCount"] = startReserved.Count,
                    ["afterReservedCount"] = afterReserved.Count,
                    ["reservedCardPresentAfterReserve"] = true,
                    ["reservedCardVisualRect"] = reservedVisualTarget?["rect"]?.DeepClone(),
                    ["reservedCardMiniStackMaxWidthPx"] = 120,
                    ["reservedCardMiniStackMaxHeightPx"] = 160,
                    ["goldCellAfterReserve"] = ((JArray)((JArray)afterSnapshot["board"])[gold.Value.x])[gold.Value.y].Value<string>(),
                    ["initialStateHash"] = CurrentStateHash(afterStart),
                    ["waitingStateHash"] = CurrentStateHash(waiting),
                    ["controllerCurrentStateHash"] = finalStateHash,
                    ["recordedEvents"] = finalRecordedEvents,
                    ["totalEventsAfterReserve"] = afterReserve.Value<int>("totalEvents"),
                    ["eventTypes"] = eventTypes,
                    ["initiateEventIndex"] = initiateIndex,
                    ["reserveEventIndex"] = reserveIndex,
                    ["exportedEvents"] = events.Count,
                    ["exportedSummaryFinalStateHash"] = exportedHash,
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
            LocalDevReserveDeckReleasePathSmokeOptions options
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
