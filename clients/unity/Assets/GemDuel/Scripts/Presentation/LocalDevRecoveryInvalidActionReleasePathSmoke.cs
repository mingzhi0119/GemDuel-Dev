using System;
using System.Collections.Generic;
using GemDuel.Replay;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using UnityEngine;

namespace GemDuel.Presentation
{
    public sealed class LocalDevRecoveryInvalidActionReleasePathSmokeOptions
    {
        public string Seed { get; set; } = "unity-built-player-recovery-invalid-action-release-path";
        public int ViewportWidth { get; set; } = 1920;
        public int ViewportHeight { get; set; } = 1080;
    }

    public static class LocalDevRecoveryInvalidActionReleasePathSmoke
    {
        public static JObject Run(
            GemDuelGameController controller,
            LocalDevRecoveryInvalidActionReleasePathSmokeOptions options
        )
        {
            options = options ?? new LocalDevRecoveryInvalidActionReleasePathSmokeOptions();
            var cases = new JArray();
            var report = new JObject
            {
                ["schemaVersion"] = 1,
                ["kind"] = "unity-localdev-recovery-invalid-action-release-path-smoke",
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
                ["cases"] = cases,
            };

            GameObject recoveredRoot = null;
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
                    return Fail(report, "Fresh product start unexpectedly loaded fixture replay events.", controller, options);
                }

                if (startReplay["liveRecording"] == null || startReplay["liveRecording"].Type == JTokenType.Null)
                {
                    return Fail(report, "Fresh product start did not create live replay recording.", controller, options);
                }

                if (!ApplySingleGemTake(controller, options, out var sourceAction, out var sourceActionError))
                {
                    return Fail(report, "Source recovery setup action failed: " + sourceActionError, controller, options);
                }

                var saved = controller.BuildAutomationStateSnapshot(
                    options.ViewportWidth,
                    options.ViewportHeight
                );
                var savedRecovery = (JObject)saved["recovery"];
                var savedReplay = (JObject)saved["replay"];
                var savedLiveRecording = (JObject)savedReplay["liveRecording"];
                var savedHash = savedRecovery.Value<string>("currentStateHash");
                var savedRecordedEvents = savedLiveRecording.Value<int>("recordedEvents");
                if (savedRecovery.Value<string>("status") != "saved")
                {
                    return Fail(
                        report,
                        "Recovery save status was not saved after source action: "
                            + savedRecovery.Value<string>("status"),
                        controller,
                        options
                    );
                }

                if (savedRecovery.Value<string>("kind") != "live-rules-engine")
                {
                    return Fail(report, "Recovery save kind was not live-rules-engine.", controller, options);
                }

                if (!savedRecovery.Value<bool>("availableForCurrentState"))
                {
                    return Fail(report, "Recovery save was not available for current live state.", controller, options);
                }

                if (savedRecordedEvents != 1)
                {
                    return Fail(
                        report,
                        "Expected one recorded live event before recovery, got " + savedRecordedEvents + ".",
                        controller,
                        options
                    );
                }

                if (savedHash != savedLiveRecording.Value<string>("summaryFinalStateHash"))
                {
                    return Fail(report, "Saved recovery hash did not match live replay summary hash.", controller, options);
                }

                recoveredRoot = new GameObject("GemDuel Recovery Invalid Action Smoke Restored");
                var recovered = recoveredRoot.AddComponent<GemDuelGameController>();
                if (!recovered.LoadRecoveredGameForAutomation(out var recoveryError))
                {
                    return Fail(report, "LoadRecoveredGameForAutomation failed: " + recoveryError, recovered, options);
                }

                var restored = recovered.BuildAutomationStateSnapshot(
                    options.ViewportWidth,
                    options.ViewportHeight
                );
                var restoredRecovery = (JObject)restored["recovery"];
                var restoredReplay = (JObject)restored["replay"];
                var restoredLiveRecording = (JObject)restoredReplay["liveRecording"];
                if (restoredRecovery.Value<string>("status") != "loaded")
                {
                    return Fail(
                        report,
                        "Recovered controller status was not loaded: "
                            + restoredRecovery.Value<string>("status"),
                        recovered,
                        options
                    );
                }

                if (restoredRecovery.Value<string>("currentStateHash") != savedHash)
                {
                    return Fail(report, "Recovered state hash did not match saved recovery hash.", recovered, options);
                }

                if (restoredLiveRecording.Value<int>("recordedEvents") != savedRecordedEvents)
                {
                    return Fail(report, "Recovered live replay event count did not match saved event count.", recovered, options);
                }

                if (restoredLiveRecording.Value<string>("summaryFinalStateHash") != savedHash)
                {
                    return Fail(report, "Recovered live replay hash did not match saved recovery hash.", recovered, options);
                }

                foreach (var invalidCase in BuildInvalidCases(restored))
                {
                    var caseReport = RunInvalidCase(recovered, invalidCase, options);
                    cases.Add(caseReport);
                    if (!caseReport.Value<bool>("ok"))
                    {
                        return Fail(
                            report,
                            "Recovered invalid-action case failed: " + invalidCase.Id,
                            recovered,
                            options
                        );
                    }
                }

                var afterInvalid = recovered.BuildAutomationStateSnapshot(
                    options.ViewportWidth,
                    options.ViewportHeight
                );
                var afterInvalidHash = CurrentRecoveryHash(afterInvalid);
                var afterInvalidEvents = RecordedEventCount(afterInvalid);
                var afterInvalidSummaryHash = LiveSummaryHash(afterInvalid);
                if (afterInvalidHash != savedHash)
                {
                    return Fail(report, "Recovered invalid actions changed the restored state hash.", recovered, options);
                }

                if (afterInvalidEvents != savedRecordedEvents)
                {
                    return Fail(report, "Recovered invalid actions appended live replay events.", recovered, options);
                }

                if (afterInvalidSummaryHash != savedHash)
                {
                    return Fail(report, "Recovered invalid actions changed the live replay summary hash.", recovered, options);
                }

                if (!ApplySingleGemTake(recovered, options, out var continuedAction, out var continuedActionError))
                {
                    return Fail(report, "Recovered continuation action failed: " + continuedActionError, recovered, options);
                }

                var continued = recovered.BuildAutomationStateSnapshot(
                    options.ViewportWidth,
                    options.ViewportHeight
                );
                var continuedRecovery = (JObject)continued["recovery"];
                var continuedReplay = (JObject)continued["replay"];
                var continuedLiveRecording = (JObject)continuedReplay["liveRecording"];
                var continuedHash = continuedRecovery.Value<string>("currentStateHash");
                var continuedEvents = continuedLiveRecording.Value<int>("recordedEvents");
                if (continuedRecovery.Value<string>("status") != "saved")
                {
                    return Fail(
                        report,
                        "Recovered continuation did not persist recovery save: "
                            + continuedRecovery.Value<string>("status"),
                        recovered,
                        options
                    );
                }

                if (continuedEvents != savedRecordedEvents + 1)
                {
                    return Fail(
                        report,
                        "Recovered continuation did not append exactly one live replay event: "
                            + continuedEvents
                            + " != "
                            + (savedRecordedEvents + 1)
                            + ".",
                        recovered,
                        options
                    );
                }

                if (continuedHash == savedHash)
                {
                    return Fail(report, "Recovered continuation did not change the state hash.", recovered, options);
                }

                if (continuedHash != continuedLiveRecording.Value<string>("summaryFinalStateHash"))
                {
                    return Fail(report, "Recovered continuation hash did not match live replay summary hash.", recovered, options);
                }

                if (!recovered.ExportReplayJsonForAutomation(out var exportedJson, out var exportError))
                {
                    return Fail(report, "Recovered replay export failed: " + exportError, recovered, options);
                }

                var exportedReplay = JsonConvert.DeserializeObject<ReplayVNext>(exportedJson);
                if (exportedReplay == null)
                {
                    return Fail(report, "Recovered replay export could not be parsed.", recovered, options);
                }

                if (exportedReplay.Events.Count != continuedEvents)
                {
                    return Fail(report, "Recovered replay export event count did not match live recording.", recovered, options);
                }

                if (exportedReplay.Summary.FinalStateHash != continuedHash)
                {
                    return Fail(report, "Recovered replay export hash did not match continued state hash.", recovered, options);
                }

                reviewRoot = new GameObject("GemDuel Recovery Invalid Action Smoke Review");
                var review = reviewRoot.AddComponent<GemDuelGameController>();
                if (!review.ImportReplayJsonForAutomation(exportedJson, out var importError))
                {
                    return Fail(report, "Recovered replay review import failed: " + importError, review, options);
                }

                if (!review.PlayReplayToEndForAutomation(out var reviewError))
                {
                    return Fail(report, "Recovered replay review playback failed: " + reviewError, review, options);
                }

                var reviewed = review.BuildAutomationStateSnapshot(
                    options.ViewportWidth,
                    options.ViewportHeight
                );
                var reviewedHash = ((JObject)reviewed["replay"]).Value<string>("currentStateHash");
                if (reviewedHash != continuedHash)
                {
                    return Fail(report, "Recovered replay review hash mismatch.", review, options);
                }

                report["sourceAction"] = sourceAction;
                report["continuedAction"] = continuedAction;
                report["sourceStateSummary"] = BuildStateSummary(saved);
                report["restoredStateSummary"] = BuildStateSummary(restored);
                report["afterInvalidStateSummary"] = BuildStateSummary(afterInvalid);
                report["continuedStateSummary"] = BuildStateSummary(continued);
                report["recoverySummary"] = new JObject
                {
                    ["savedStatus"] = savedRecovery.Value<string>("status"),
                    ["restoredStatus"] = restoredRecovery.Value<string>("status"),
                    ["continuedStatus"] = continuedRecovery.Value<string>("status"),
                    ["savedStateHash"] = savedHash,
                    ["restoredStateHash"] = restoredRecovery.Value<string>("currentStateHash"),
                    ["afterInvalidStateHash"] = afterInvalidHash,
                    ["continuedStateHash"] = continuedHash,
                    ["savedRecordedEvents"] = savedRecordedEvents,
                    ["restoredRecordedEvents"] = restoredLiveRecording.Value<int>("recordedEvents"),
                    ["afterInvalidRecordedEvents"] = afterInvalidEvents,
                    ["continuedRecordedEvents"] = continuedEvents,
                };
                report["invalidActionSummary"] = new JObject
                {
                    ["caseCount"] = cases.Count,
                    ["stateHashBefore"] = savedHash,
                    ["stateHashAfter"] = afterInvalidHash,
                    ["recordedEventsBefore"] = savedRecordedEvents,
                    ["recordedEventsAfter"] = afterInvalidEvents,
                };
                report["replayHashSummary"] = new JObject
                {
                    ["exportedEvents"] = exportedReplay.Events.Count,
                    ["exportedSummaryFinalStateHash"] = exportedReplay.Summary.FinalStateHash,
                    ["controllerCurrentStateHash"] = continuedHash,
                    ["reviewedFinalStateHash"] = reviewedHash,
                };
                report["replayReview"] = new JObject
                {
                    ["ok"] = true,
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
                DestroyObject(recoveredRoot);
            }
        }

        private static IEnumerable<InvalidActionCase> BuildInvalidCases(JObject restoredState)
        {
            var activePlayer = restoredState.Value<string>("turn") ?? "p1";
            var inactivePlayer = activePlayer == "p1" ? "p2" : "p1";
            yield return new InvalidActionCase
            {
                Id = "reject-recovered-cancel-reserve-idle",
                CommandType = "CANCEL_RESERVE",
                Payload = new JObject(),
                Tags = new[] { "recovery", "wrong-phase", "CANCEL_RESERVE" },
            };
            yield return new InvalidActionCase
            {
                Id = "reject-recovered-close-modal-without-modal",
                CommandType = "CLOSE_MODAL",
                Payload = new JObject(),
                Tags = new[] { "recovery", "no-modal", "CLOSE_MODAL" },
            };
            yield return new InvalidActionCase
            {
                Id = "reject-recovered-inactive-player-take-gems",
                CommandType = "TAKE_GEMS",
                ActorOverride = inactivePlayer,
                Payload = new JObject
                {
                    ["coords"] = new JArray(FindFirstNormalGemCoord(restoredState)),
                },
                Tags = new[] { "recovery", "invalid-actor", "TAKE_GEMS" },
            };
        }

        private static JObject RunInvalidCase(
            GemDuelGameController controller,
            InvalidActionCase invalidCase,
            LocalDevRecoveryInvalidActionReleasePathSmokeOptions options
        )
        {
            var before = controller.BuildAutomationStateSnapshot(options.ViewportWidth, options.ViewportHeight);
            var beforeHash = CurrentRecoveryHash(before);
            var beforeReplayHash = CurrentReplayHash(before);
            var beforeRecordedEvents = RecordedEventCount(before);
            var beforeSummaryHash = LiveSummaryHash(before);
            var accepted = controller.RunLiveRulesCommandForAutomation(
                invalidCase.CommandType,
                invalidCase.Payload,
                invalidCase.ActorOverride,
                out var error
            );
            var after = controller.BuildAutomationStateSnapshot(options.ViewportWidth, options.ViewportHeight);
            var afterHash = CurrentRecoveryHash(after);
            var afterReplayHash = CurrentReplayHash(after);
            var afterRecordedEvents = RecordedEventCount(after);
            var afterSummaryHash = LiveSummaryHash(after);
            var ok = !accepted
                && beforeHash == afterHash
                && beforeReplayHash == afterReplayHash
                && beforeRecordedEvents == afterRecordedEvents
                && beforeSummaryHash == afterSummaryHash
                && controller.LastAutomationDriver == "live-rules-engine-command-rejected";

            return new JObject
            {
                ["id"] = invalidCase.Id,
                ["ok"] = ok,
                ["accepted"] = accepted,
                ["commandType"] = invalidCase.CommandType,
                ["actorOverride"] = invalidCase.ActorOverride,
                ["tags"] = new JArray(invalidCase.Tags),
                ["payload"] = invalidCase.Payload.DeepClone(),
                ["error"] = string.IsNullOrEmpty(error) ? null : error,
                ["statusText"] = after.Value<string>("statusText"),
                ["errorBanner"] = after.Value<string>("errorBanner"),
                ["recoveryStateHashBefore"] = beforeHash,
                ["recoveryStateHashAfter"] = afterHash,
                ["replayStateHashBefore"] = beforeReplayHash,
                ["replayStateHashAfter"] = afterReplayHash,
                ["summaryHashBefore"] = beforeSummaryHash,
                ["summaryHashAfter"] = afterSummaryHash,
                ["recordedEventsBefore"] = beforeRecordedEvents,
                ["recordedEventsAfter"] = afterRecordedEvents,
                ["driver"] = controller.LastAutomationDriver,
            };
        }

        private static bool ApplySingleGemTake(
            GemDuelGameController controller,
            LocalDevRecoveryInvalidActionReleasePathSmokeOptions options,
            out string detail,
            out string error
        )
        {
            detail = string.Empty;
            error = string.Empty;
            var state = controller.BuildAutomationStateSnapshot(
                options.ViewportWidth,
                options.ViewportHeight
            );
            var snapshot = (JObject)state["snapshot"];
            if (snapshot.Value<string>("phase") != "IDLE")
            {
                error = "Expected IDLE phase, got " + snapshot.Value<string>("phase") + ".";
                return false;
            }

            var coord = FindFirstCollectibleBoardGem(snapshot);
            if (!coord.HasValue)
            {
                error = "No collectible board gem was available.";
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
                error = "click_board_cell rejected: " + clickError;
                return false;
            }

            if (!controller.RunSemanticActionForAutomation("confirm_gem_selection", null, out var confirmError))
            {
                error = "confirm_gem_selection rejected: " + confirmError;
                return false;
            }

            detail = "take_gems " + coord.Value.x + "," + coord.Value.y;
            return true;
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

        private static JObject FindFirstNormalGemCoord(JObject automationState)
        {
            var board = (JArray)((JObject)automationState["snapshot"])["board"];
            for (var row = 0; row < board.Count; row += 1)
            {
                var cells = (JArray)board[row];
                for (var column = 0; column < cells.Count; column += 1)
                {
                    var gemId = cells[column].Value<string>();
                    if (gemId != "empty" && gemId != "gold")
                    {
                        return new JObject { ["r"] = row, ["c"] = column };
                    }
                }
            }

            throw new InvalidOperationException("Recovery invalid-action smoke could not find a normal board gem.");
        }

        private static JObject BuildStateSummary(JObject automationState)
        {
            var replay = (JObject)automationState["replay"];
            var liveRecording = replay["liveRecording"] as JObject;
            var recovery = (JObject)automationState["recovery"];
            return new JObject
            {
                ["phase"] = automationState.Value<string>("phase"),
                ["turn"] = automationState.Value<string>("turn"),
                ["winner"] = automationState.Value<string>("winner"),
                ["stateHash"] = recovery.Value<string>("currentStateHash"),
                ["replayStateHash"] = replay.Value<string>("currentStateHash"),
                ["recordedEvents"] = liveRecording?.Value<int>("recordedEvents") ?? 0,
                ["summaryFinalStateHash"] = liveRecording?.Value<string>("summaryFinalStateHash"),
                ["recoveryStatus"] = recovery.Value<string>("status"),
            };
        }

        private static string CurrentRecoveryHash(JObject state)
        {
            return ((JObject)state["recovery"]).Value<string>("currentStateHash");
        }

        private static string CurrentReplayHash(JObject state)
        {
            return ((JObject)state["replay"]).Value<string>("currentStateHash");
        }

        private static string LiveSummaryHash(JObject state)
        {
            var liveRecording = ((JObject)state["replay"])["liveRecording"] as JObject;
            return liveRecording == null ? null : liveRecording.Value<string>("summaryFinalStateHash");
        }

        private static int RecordedEventCount(JObject state)
        {
            var liveRecording = ((JObject)state["replay"])["liveRecording"] as JObject;
            return liveRecording == null ? -1 : liveRecording.Value<int>("recordedEvents");
        }

        private static JObject BuildFailureState(
            GemDuelGameController controller,
            LocalDevRecoveryInvalidActionReleasePathSmokeOptions options
        )
        {
            try
            {
                var state = controller.BuildAutomationStateSnapshot(options.ViewportWidth, options.ViewportHeight);
                return new JObject
                {
                    ["phase"] = state.Value<string>("phase"),
                    ["turn"] = state.Value<string>("turn"),
                    ["winner"] = state.Value<string>("winner"),
                    ["statusText"] = state.Value<string>("statusText"),
                    ["errorBanner"] = state.Value<string>("errorBanner"),
                    ["replay"] = state["replay"]?.DeepClone(),
                    ["recovery"] = state["recovery"]?.DeepClone(),
                };
            }
            catch
            {
                return null;
            }
        }

        private static JObject Fail(
            JObject report,
            string reason,
            GemDuelGameController controller,
            LocalDevRecoveryInvalidActionReleasePathSmokeOptions options
        )
        {
            report["ok"] = false;
            report["failureReason"] = reason;
            report["failureState"] = controller == null ? null : BuildFailureState(controller, options);
            report["completedAt"] = DateTime.UtcNow.ToString("O");
            return report;
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

        private sealed class InvalidActionCase
        {
            public string Id = string.Empty;
            public string CommandType = string.Empty;
            public JObject Payload = new JObject();
            public string ActorOverride;
            public string[] Tags = Array.Empty<string>();
        }
    }
}
