using System;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json.Linq;
using UnityEngine;

namespace GemDuel.Presentation
{
    public sealed class LocalDevReserveCancelReleasePathSmokeOptions
    {
        public string Seed { get; set; } = "unity-editmode-live-reserve-cancel";
        public int ViewportWidth { get; set; } = 1920;
        public int ViewportHeight { get; set; } = 1080;
    }

    public static class LocalDevReserveCancelReleasePathSmoke
    {
        public static JObject Run(
            GemDuelGameController controller,
            LocalDevReserveCancelReleasePathSmokeOptions options
        )
        {
            options = options ?? new LocalDevReserveCancelReleasePathSmokeOptions();
            var actions = new JArray();
            var report = new JObject
            {
                ["schemaVersion"] = 1,
                ["kind"] = "unity-localdev-reserve-cancel-release-path-smoke",
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

                var initialStateHash = CurrentStateHash(afterStart);
                var initialRecordedEvents = RecordedEventCount(afterStart);
                var snapshot = (JObject)afterStart["snapshot"];
                var marketRow = ((JObject)snapshot["market"])["1"] as JArray;
                if (marketRow == null || marketRow.Count == 0)
                {
                    return Fail(report, "Fresh Local PvP start did not expose a level-1 market row.", controller, options);
                }

                var marketCard = marketRow[0].Value<string>();
                if (string.IsNullOrWhiteSpace(marketCard))
                {
                    return Fail(report, "Fresh Local PvP start did not expose a level-1 market card.", controller, options);
                }

                var marketTarget = FindVisibleTarget(afterStart, "market.card.1.0");
                if (
                    marketTarget == null
                    || marketTarget.Value<string>("kind") != "MarketCard"
                    || marketTarget.Value<string>("instanceId") != marketCard
                    || !marketTarget.Value<bool>("clickable")
                )
                {
                    return Fail(report, "Visible level-1 market-card target was not exposed for reserve cancel.", controller, options);
                }

                if (
                    !controller.RunSemanticActionForAutomation(
                        "click_market_card",
                        new JObject { ["level"] = 1, ["index"] = 0 },
                        out var previewError
                    )
                )
                {
                    return Fail(report, "click_market_card failed: " + previewError, controller, options);
                }

                var preview = controller.BuildAutomationStateSnapshot(
                    options.ViewportWidth,
                    options.ViewportHeight
                );
                var previewContext = preview["preview"] as JObject;
                if (
                    previewContext == null
                    || previewContext.Value<string>("source") != "market"
                    || previewContext.Value<int>("level") != 1
                    || previewContext.Value<int>("index") != 0
                    || previewContext.Value<string>("instanceId") != marketCard
                )
                {
                    return Fail(report, "Market card preview did not open for reserve cancel.", controller, options);
                }

                if (!HasVisibleTarget(preview, "card.preview.action.reserve"))
                {
                    return Fail(report, "Market card preview reserve control was not visible.", controller, options);
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
                AppendAction(actions, "initiate_reserve " + marketCard, "reserve_card", preview, beforeCancel);
                if (beforeCancel.Value<string>("phase") != "RESERVE_WAITING_GEM")
                {
                    return Fail(
                        report,
                        "Reserve preview action did not enter RESERVE_WAITING_GEM; phase was "
                            + beforeCancel.Value<string>("phase")
                            + ".",
                        controller,
                        options
                    );
                }

                if (beforeCancel.Value<string>("turn") != "p1")
                {
                    return Fail(report, "Reserve cancel smoke expected P1 to remain active while waiting for Gold.", controller, options);
                }

                var pendingReserve = ((JObject)beforeCancel["snapshot"])["pendingReserve"] as JObject;
                var pendingReserveCard = PendingReserveCardLabel(pendingReserve);
                if (
                    pendingReserve == null
                    || pendingReserve.Value<int>("level") != 1
                    || (pendingReserve.Value<int?>("idx") ?? pendingReserve.Value<int?>("index") ?? -1) != 0
                    || string.IsNullOrWhiteSpace(pendingReserveCard)
                )
                {
                    return Fail(report, "Reserve waiting state did not expose the expected pending reserve.", controller, options);
                }

                var goldPromptTargets = VisibleTargets(beforeCancel)
                    .Where(target => target.Value<string>("kind") == "ReserveGoldPrompt")
                    .ToList();
                if (goldPromptTargets.Count == 0)
                {
                    return Fail(report, "Reserve waiting state did not expose any visible Gold prompt target.", controller, options);
                }

                var cancelTarget = FindVisibleTarget(beforeCancel, "board.selection.cancel");
                if (
                    cancelTarget == null
                    || cancelTarget.Value<string>("kind") != "ActionButton"
                    || cancelTarget.Value<string>("eventType") != "cancel-gems"
                    || !cancelTarget.Value<bool>("clickable")
                )
                {
                    return Fail(report, "Visible reserve cancel control was not exposed.", controller, options);
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
                AppendAction(actions, "cancel_reserve " + marketCard, "cancel_reserve", beforeCancel, afterCancel);
                if (afterCancel.Value<string>("phase") != "IDLE")
                {
                    return Fail(report, "Reserve cancel did not return to IDLE.", controller, options);
                }

                var pendingReserveAfterCancel = ((JObject)afterCancel["snapshot"])["pendingReserve"];
                if (pendingReserveAfterCancel != null && pendingReserveAfterCancel.Type != JTokenType.Null)
                {
                    return Fail(report, "Reserve cancel left pendingReserve populated.", controller, options);
                }

                if (ReservedContains(afterCancel, "p1", marketCard))
                {
                    return Fail(report, "Reserve cancel added the market card to P1 reserved cards.", controller, options);
                }

                if (afterCancel.Value<string>("statusText") != "Applied live action | CANCEL_RESERVE")
                {
                    return Fail(report, "CANCEL_RESERVE status was not surfaced after reserve cancel.", controller, options);
                }

                var finalStateHash = CurrentStateHash(afterCancel);
                var finalRecordedEvents = RecordedEventCount(afterCancel);
                if (finalStateHash != initialStateHash)
                {
                    return Fail(
                        report,
                        "Reserve cancel changed the fresh-start state hash: "
                            + finalStateHash
                            + " != "
                            + initialStateHash,
                        controller,
                        options
                    );
                }

                if (finalRecordedEvents <= initialRecordedEvents || afterCancel.Value<int>("totalEvents") != 0)
                {
                    return Fail(report, "Reserve cancel did not record live replay events through the bridge.", controller, options);
                }

                if (!controller.ExportReplayJsonForAutomation(out var exportedJson, out var exportError))
                {
                    return Fail(report, "Replay export failed after reserve cancel: " + exportError, controller, options);
                }

                var exported = JObject.Parse(exportedJson);
                var events = (JArray)exported["events"];
                if (events.Count != finalRecordedEvents)
                {
                    return Fail(
                        report,
                        "Exported replay event count changed after reserve cancel: "
                            + events.Count
                            + " != "
                            + finalRecordedEvents
                            + ".",
                        controller,
                        options
                    );
                }

                var eventTypes = new JArray(events.Select(item => item.Value<string>("type")));
                var initiateIndex = FindEventIndex(events, "initiate_reserve");
                var cancelIndex = FindEventIndex(events, "cancel_reserve");
                if (initiateIndex < 0 || cancelIndex < 0 || cancelIndex <= initiateIndex)
                {
                    return Fail(
                        report,
                        "Exported replay did not contain ordered initiate_reserve and cancel_reserve events.",
                        controller,
                        options
                    );
                }

                var exportedHash = ((JObject)exported["summary"]).Value<string>("finalStateHash");
                if (exportedHash != finalStateHash)
                {
                    return Fail(
                        report,
                        "Exported replay final hash mismatch after reserve cancel: "
                            + exportedHash
                            + " != "
                            + finalStateHash,
                        controller,
                        options
                    );
                }

                reviewRoot = new GameObject("GemDuel Reserve Cancel Release Path Replay Review");
                var review = reviewRoot.AddComponent<GemDuelGameController>();
                if (!review.ImportReplayJsonForAutomation(exportedJson, out var importError))
                {
                    return Fail(report, "Replay review import failed after reserve cancel: " + importError, controller, options);
                }

                if (!review.PlayReplayToEndForAutomation(out var reviewError))
                {
                    return Fail(report, "Replay review playback failed after reserve cancel: " + reviewError, controller, options);
                }

                var reviewed = review.BuildAutomationStateSnapshot(options.ViewportWidth, options.ViewportHeight);
                var reviewedHash = CurrentStateHash(reviewed);
                if (reviewedHash != exportedHash)
                {
                    return Fail(
                        report,
                        "Replay review hash mismatch after reserve cancel: "
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
                report["reserveCancelSummary"] = new JObject
                {
                    ["marketCard"] = marketCard,
                    ["marketLevel"] = 1,
                    ["marketIndex"] = 0,
                    ["marketCardVisibleBeforePreview"] = true,
                    ["previewSource"] = previewContext.Value<string>("source"),
                    ["previewInstanceId"] = previewContext.Value<string>("instanceId"),
                    ["visibleReserveControlBeforeInitiate"] = true,
                    ["phaseBeforeCancel"] = beforeCancel.Value<string>("phase"),
                    ["turnBeforeCancel"] = beforeCancel.Value<string>("turn"),
                    ["pendingReserveCardBeforeCancel"] = pendingReserveCard,
                    ["goldPromptVisibleBeforeCancel"] = true,
                    ["goldPromptCountBeforeCancel"] = goldPromptTargets.Count,
                    ["visibleCancelControlBeforeCancel"] = true,
                    ["cancelStatusText"] = afterCancel.Value<string>("statusText"),
                    ["finalPhase"] = afterCancel.Value<string>("phase"),
                    ["finalTurn"] = afterCancel.Value<string>("turn"),
                    ["pendingReservePresentAfterCancel"] = false,
                    ["reservedCardPresentAfterCancel"] = false,
                    ["initialStateHash"] = initialStateHash,
                    ["beforeCancelStateHash"] = CurrentStateHash(beforeCancel),
                    ["controllerCurrentStateHash"] = finalStateHash,
                    ["initialRecordedEvents"] = initialRecordedEvents,
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

        private static bool ReservedContains(JObject automationState, string player, string instanceId)
        {
            var snapshot = (JObject)automationState["snapshot"];
            var reserved = (JArray)((JObject)snapshot["playerReserved"])[player];
            return reserved.Values<string>().Contains(instanceId);
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

        private static string PendingReserveCardLabel(JObject pendingReserve)
        {
            if (pendingReserve == null)
            {
                return null;
            }

            var card = pendingReserve["card"];
            if (card == null || card.Type == JTokenType.Null)
            {
                return pendingReserve.Value<string>("instanceId");
            }

            if (card.Type == JTokenType.String)
            {
                return card.Value<string>();
            }

            var cardObject = card as JObject;
            return cardObject == null
                ? card.ToString()
                : cardObject.Value<string>("id") ?? cardObject.Value<string>("name") ?? cardObject.ToString();
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
            LocalDevReserveCancelReleasePathSmokeOptions options
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
