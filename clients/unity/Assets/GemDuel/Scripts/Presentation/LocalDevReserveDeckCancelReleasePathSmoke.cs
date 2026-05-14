using System;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json.Linq;
using UnityEngine;

namespace GemDuel.Presentation
{
    public sealed class LocalDevReserveDeckCancelReleasePathSmokeOptions
    {
        public string Seed { get; set; } = "unity-editmode-live-reserve-deck-cancel";
        public int ViewportWidth { get; set; } = 1920;
        public int ViewportHeight { get; set; } = 1080;
    }

    public static class LocalDevReserveDeckCancelReleasePathSmoke
    {
        public static JObject Run(
            GemDuelGameController controller,
            LocalDevReserveDeckCancelReleasePathSmokeOptions options
        )
        {
            options = options ?? new LocalDevReserveDeckCancelReleasePathSmokeOptions();
            var actions = new JArray();
            var report = new JObject
            {
                ["schemaVersion"] = 1,
                ["kind"] = "unity-localdev-reserve-deck-cancel-release-path-smoke",
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
                    return Fail(report, "Deck-reserve cancel smoke requires a visible Gold board gem.", controller, options);
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
                    return Fail(report, "Visible Gold board target was not exposed before deck-reserve cancel.", controller, options);
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
                    return Fail(report, "Market deck preview did not open for deck-reserve cancel.", controller, options);
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

                var beforeCancel = controller.BuildAutomationStateSnapshot(
                    options.ViewportWidth,
                    options.ViewportHeight
                );
                AppendAction(actions, "initiate_reserve_deck L1", "initiate_reserve_deck", preview, beforeCancel);
                var beforeCancelSnapshot = (JObject)beforeCancel["snapshot"];
                var pendingReserve = beforeCancelSnapshot["pendingReserve"] as JObject;
                if (beforeCancel.Value<string>("phase") != "RESERVE_WAITING_GEM")
                {
                    return Fail(
                        report,
                        "Deck reserve preview action did not enter RESERVE_WAITING_GEM; phase was "
                            + beforeCancel.Value<string>("phase")
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
                    return Fail(report, "Deck-reserve cancel waiting state did not expose an isDeck pending reserve.", controller, options);
                }

                var goldPromptTarget = FindVisibleTarget(beforeCancel, "board.reserveGoldPrompt." + gold.Value.x + "." + gold.Value.y);
                if (
                    goldPromptTarget == null
                    || goldPromptTarget.Value<string>("kind") != "ReserveGoldPrompt"
                    || goldPromptTarget.Value<string>("gemId") != "gold"
                )
                {
                    return Fail(report, "Deck-reserve cancel waiting state did not expose a visible Gold prompt target.", controller, options);
                }

                var cancelTarget = FindVisibleTarget(beforeCancel, "board.selection.cancel");
                if (
                    cancelTarget == null
                    || cancelTarget.Value<string>("kind") != "ActionButton"
                    || cancelTarget.Value<string>("eventType") != "cancel-gems"
                    || !cancelTarget.Value<bool>("clickable")
                )
                {
                    return Fail(report, "Visible deck-reserve cancel control was not exposed.", controller, options);
                }

                if (
                    !controller.RunSemanticActionForAutomation(
                        "cancel_gem_selection",
                        null,
                        out var cancelError
                    )
                )
                {
                    return Fail(report, "cancel_gem_selection failed: " + cancelError, controller, options);
                }

                var afterCancel = controller.BuildAutomationStateSnapshot(
                    options.ViewportWidth,
                    options.ViewportHeight
                );
                AppendAction(actions, "cancel_reserve deck L1", "cancel_reserve", beforeCancel, afterCancel);
                var afterSnapshot = (JObject)afterCancel["snapshot"];
                var afterDeck = (JArray)((JObject)afterSnapshot["decks"])["1"];
                var afterReserved = (JArray)((JObject)afterSnapshot["playerReserved"])["p1"];
                if (afterCancel.Value<string>("phase") != "IDLE")
                {
                    return Fail(report, "Deck-reserve cancel did not return to IDLE.", controller, options);
                }

                if (afterCancel.Value<string>("turn") != "p1")
                {
                    return Fail(report, "Deck-reserve cancel should keep the active turn on P1.", controller, options);
                }

                var pendingReserveAfterCancel = afterSnapshot["pendingReserve"];
                if (pendingReserveAfterCancel != null && pendingReserveAfterCancel.Type != JTokenType.Null)
                {
                    return Fail(report, "Deck-reserve cancel left pendingReserve populated.", controller, options);
                }

                if (afterDeck.Count != startDeck.Count)
                {
                    return Fail(report, "Deck-reserve cancel changed the level-1 deck count.", controller, options);
                }

                if (afterReserved.Count != startReserved.Count || afterReserved.Values<string>().Contains(topDeckCard))
                {
                    return Fail(report, "Deck-reserve cancel changed P1 reserved cards.", controller, options);
                }

                if (((JArray)((JArray)afterSnapshot["board"])[gold.Value.x])[gold.Value.y].Value<string>() != "gold")
                {
                    return Fail(report, "Deck-reserve cancel consumed the visible Gold board gem.", controller, options);
                }

                if (afterCancel.Value<string>("statusText") != "Applied live action | CANCEL_RESERVE")
                {
                    return Fail(report, "CANCEL_RESERVE status was not surfaced after deck-reserve cancel.", controller, options);
                }

                var initialStateHash = CurrentStateHash(afterStart);
                var finalStateHash = CurrentStateHash(afterCancel);
                var finalRecordedEvents = RecordedEventCount(afterCancel);
                if (finalStateHash != initialStateHash)
                {
                    return Fail(
                        report,
                        "Deck-reserve cancel changed the fresh-start state hash: "
                            + finalStateHash
                            + " != "
                            + initialStateHash,
                        controller,
                        options
                    );
                }

                if (finalRecordedEvents < 2 || afterCancel.Value<int>("totalEvents") != 0)
                {
                    return Fail(report, "Deck-reserve cancel did not record live replay events through the bridge.", controller, options);
                }

                if (!controller.ExportReplayJsonForAutomation(out var exportedJson, out var exportError))
                {
                    return Fail(report, "Replay export failed after deck-reserve cancel: " + exportError, controller, options);
                }

                var exported = JObject.Parse(exportedJson);
                var events = (JArray)exported["events"];
                if (events.Count != finalRecordedEvents)
                {
                    return Fail(
                        report,
                        "Exported replay event count changed after deck-reserve cancel: "
                            + events.Count
                            + " != "
                            + finalRecordedEvents
                            + ".",
                        controller,
                        options
                    );
                }

                var eventTypes = new JArray(events.Select(item => item.Value<string>("type")));
                var initiateIndex = FindEventIndex(events, "initiate_reserve_deck");
                var cancelIndex = FindEventIndex(events, "cancel_reserve");
                if (initiateIndex < 0 || cancelIndex < 0 || cancelIndex <= initiateIndex)
                {
                    return Fail(
                        report,
                        "Exported replay did not contain ordered initiate_reserve_deck and cancel_reserve events.",
                        controller,
                        options
                    );
                }

                var exportedHash = ((JObject)exported["summary"]).Value<string>("finalStateHash");
                if (exportedHash != finalStateHash)
                {
                    return Fail(
                        report,
                        "Exported replay final hash mismatch after deck-reserve cancel: "
                            + exportedHash
                            + " != "
                            + finalStateHash,
                        controller,
                        options
                    );
                }

                reviewRoot = new GameObject("GemDuel Deck Reserve Cancel Release Path Replay Review");
                var review = reviewRoot.AddComponent<GemDuelGameController>();
                if (!review.ImportReplayJsonForAutomation(exportedJson, out var importError))
                {
                    return Fail(report, "Replay review import failed after deck-reserve cancel: " + importError, controller, options);
                }

                if (!review.PlayReplayToEndForAutomation(out var reviewError))
                {
                    return Fail(report, "Replay review playback failed after deck-reserve cancel: " + reviewError, controller, options);
                }

                var reviewed = review.BuildAutomationStateSnapshot(options.ViewportWidth, options.ViewportHeight);
                var reviewedHash = CurrentStateHash(reviewed);
                if (reviewedHash != exportedHash)
                {
                    return Fail(
                        report,
                        "Replay review hash mismatch after deck-reserve cancel: "
                            + reviewedHash
                            + " != "
                            + exportedHash,
                        controller,
                        options
                    );
                }

                report["afterStartStateSummary"] = BuildStateSummary(afterStart);
                report["previewStateSummary"] = BuildStateSummary(preview);
                report["beforeCancelStateSummary"] = BuildStateSummary(beforeCancel);
                report["afterCancelStateSummary"] = BuildStateSummary(afterCancel);
                report["reserveDeckCancelSummary"] = new JObject
                {
                    ["deckLevel"] = 1,
                    ["topDeckCard"] = topDeckCard,
                    ["deckTargetVisibleBeforePreview"] = true,
                    ["goldTargetVisibleBeforeCancel"] = true,
                    ["goldPromptVisibleBeforeCancel"] = true,
                    ["previewSource"] = previewContext.Value<string>("source"),
                    ["visibleReserveControlBeforeInitiate"] = true,
                    ["phaseBeforeCancel"] = beforeCancel.Value<string>("phase"),
                    ["turnBeforeCancel"] = beforeCancel.Value<string>("turn"),
                    ["pendingReserveIsDeckBeforeCancel"] = true,
                    ["visibleCancelControlBeforeCancel"] = true,
                    ["cancelStatusText"] = afterCancel.Value<string>("statusText"),
                    ["finalPhase"] = afterCancel.Value<string>("phase"),
                    ["finalTurn"] = afterCancel.Value<string>("turn"),
                    ["pendingReservePresentAfterCancel"] = false,
                    ["startDeckCount"] = startDeck.Count,
                    ["afterDeckCount"] = afterDeck.Count,
                    ["startReservedCount"] = startReserved.Count,
                    ["afterReservedCount"] = afterReserved.Count,
                    ["reservedCardPresentAfterCancel"] = false,
                    ["goldCellAfterCancel"] = ((JArray)((JArray)afterSnapshot["board"])[gold.Value.x])[gold.Value.y].Value<string>(),
                    ["initialStateHash"] = initialStateHash,
                    ["beforeCancelStateHash"] = CurrentStateHash(beforeCancel),
                    ["controllerCurrentStateHash"] = finalStateHash,
                    ["recordedEvents"] = finalRecordedEvents,
                    ["totalEventsAfterCancel"] = afterCancel.Value<int>("totalEvents"),
                    ["eventTypes"] = eventTypes,
                    ["initiateEventIndex"] = initiateIndex,
                    ["cancelEventIndex"] = cancelIndex,
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

        private static int FindEventIndex(JArray events, string eventType)
        {
            for (var index = 0; index < events.Count; index += 1)
            {
                if ((events[index] as JObject)?.Value<string>("type") == eventType)
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
            LocalDevReserveDeckCancelReleasePathSmokeOptions options
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
                    ["stateHash"] = CurrentStateHash(state),
                    ["recordedEvents"] = RecordedEventCount(state),
                    ["statusText"] = state.Value<string>("statusText"),
                    ["errorBanner"] = state.Value<string>("errorBanner"),
                };
            }
            catch { }

            return report;
        }

        private static string CurrentStateHash(JObject automationState)
        {
            return ((JObject)automationState["replay"])?.Value<string>("currentStateHash") ?? string.Empty;
        }

        private static int RecordedEventCount(JObject automationState)
        {
            return ((JObject)((JObject)automationState["replay"])["liveRecording"])?.Value<int>("recordedEvents") ?? 0;
        }

        private static void DestroyObject(UnityEngine.Object target)
        {
            if (target != null)
            {
                UnityEngine.Object.DestroyImmediate(target);
            }
        }
    }
}
