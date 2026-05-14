using System;
using System.IO;
using GemDuel.Core;
using GemDuel.Replay;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using UnityEngine;

namespace GemDuel.Presentation
{
    public sealed class LocalDevRecoveryReleasePathSmokeOptions
    {
        public string Seed { get; set; } = "unity-built-player-recovery-release-path";
        public int ViewportWidth { get; set; } = 1920;
        public int ViewportHeight { get; set; } = 1080;
    }

    public static class LocalDevRecoveryReleasePathSmoke
    {
        public static JObject Run(
            GemDuelGameController controller,
            LocalDevRecoveryReleasePathSmokeOptions options
        )
        {
            options = options ?? new LocalDevRecoveryReleasePathSmokeOptions();
            var report = new JObject
            {
                ["schemaVersion"] = 1,
                ["kind"] = "unity-localdev-recovery-release-path-smoke",
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
                ["coverage"] = new JArray(),
            };
            var coverage = (JArray)report["coverage"];

            GameObject recoveredRoot = null;
            GameObject reviewRoot = null;
            GameObject postExportRoot = null;
            GameObject postSettingsRoot = null;
            GameObject pendingRoot = null;
            GameObject pendingRestartRoot = null;
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
                    return Fail(report, "start_local_game failed: " + startError, controller);
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
                        controller
                    );
                }

                var startReplay = (JObject)afterStart["replay"];
                if (afterStart.Value<int>("totalEvents") != 0 || startReplay.Value<bool>("loaded"))
                {
                    report["usedFixtureReplayAsGameplayDriver"] = true;
                    return Fail(report, "Fresh product start unexpectedly loaded fixture replay events.", controller);
                }

                if (startReplay["liveRecording"] == null || startReplay["liveRecording"].Type == JTokenType.Null)
                {
                    return Fail(report, "Fresh product start did not create live replay recording.", controller);
                }

                if (!ApplySingleGemTake(controller, options, out var sourceAction, out var sourceActionError))
                {
                    return Fail(report, "Source recovery setup action failed: " + sourceActionError, controller);
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
                        controller
                    );
                }

                if (savedRecovery.Value<string>("kind") != "live-rules-engine")
                {
                    return Fail(report, "Recovery save kind was not live-rules-engine.", controller);
                }

                if (!savedRecovery.Value<bool>("availableForCurrentState"))
                {
                    return Fail(report, "Recovery save was not available for current live state.", controller);
                }

                if (savedRecordedEvents != 1)
                {
                    return Fail(
                        report,
                        "Expected one recorded live event before recovery, got " + savedRecordedEvents + ".",
                        controller
                    );
                }

                if (savedHash != savedLiveRecording.Value<string>("summaryFinalStateHash"))
                {
                    return Fail(report, "Saved recovery hash did not match live replay summary hash.", controller);
                }

                recoveredRoot = new GameObject("GemDuel Built Player Recovery Smoke Restored");
                var recovered = recoveredRoot.AddComponent<GemDuelGameController>();
                if (!recovered.LoadRecoveredGameForAutomation(out var recoveryError))
                {
                    return Fail(report, "LoadRecoveredGameForAutomation failed: " + recoveryError, recovered);
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
                        recovered
                    );
                }

                if (restoredRecovery.Value<string>("currentStateHash") != savedHash)
                {
                    return Fail(report, "Recovered state hash did not match saved recovery hash.", recovered);
                }

                if (restoredLiveRecording.Value<int>("recordedEvents") != savedRecordedEvents)
                {
                    return Fail(report, "Recovered live replay event count did not match saved event count.", recovered);
                }

                if (restoredLiveRecording.Value<string>("summaryFinalStateHash") != savedHash)
                {
                    return Fail(report, "Recovered live replay hash did not match saved recovery hash.", recovered);
                }

                if (!ApplySingleGemTake(recovered, options, out var continuedAction, out var continuedActionError))
                {
                    return Fail(report, "Recovered continuation action failed: " + continuedActionError, recovered);
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
                        recovered
                    );
                }

                if (continuedEvents != savedRecordedEvents + 1)
                {
                    return Fail(
                        report,
                        "Recovered continuation did not append one live replay event: "
                            + continuedEvents
                            + " != "
                            + (savedRecordedEvents + 1)
                            + ".",
                        recovered
                    );
                }

                if (continuedHash == savedHash)
                {
                    return Fail(report, "Recovered continuation did not change the state hash.", recovered);
                }

                if (continuedHash != continuedLiveRecording.Value<string>("summaryFinalStateHash"))
                {
                    return Fail(report, "Recovered continuation hash did not match live replay summary hash.", recovered);
                }

                if (!recovered.ExportReplayJsonForAutomation(out var exportedJson, out var exportError))
                {
                    return Fail(report, "Recovered replay export failed: " + exportError, recovered);
                }

                var exportedReplay = JsonConvert.DeserializeObject<ReplayVNext>(exportedJson);
                if (exportedReplay == null)
                {
                    return Fail(report, "Recovered replay export could not be parsed.", recovered);
                }

                if (exportedReplay.Events.Count != continuedEvents)
                {
                    return Fail(report, "Recovered replay export event count did not match live recording.", recovered);
                }

                if (exportedReplay.Summary.FinalStateHash != continuedHash)
                {
                    return Fail(report, "Recovered replay export hash did not match continued state hash.", recovered);
                }

                reviewRoot = new GameObject("GemDuel Built Player Recovery Smoke Review");
                var review = reviewRoot.AddComponent<GemDuelGameController>();
                if (!review.ImportReplayJsonForAutomation(exportedJson, out var importError))
                {
                    return Fail(report, "Recovered replay review import failed: " + importError, review);
                }

                if (!review.PlayReplayToEndForAutomation(out var reviewError))
                {
                    return Fail(report, "Recovered replay review playback failed: " + reviewError, review);
                }

                var reviewed = review.BuildAutomationStateSnapshot(
                    options.ViewportWidth,
                    options.ViewportHeight
                );
                var reviewedHash = ((JObject)reviewed["replay"]).Value<string>("currentStateHash");
                if (reviewedHash != continuedHash)
                {
                    return Fail(report, "Recovered replay review hash mismatch.", review);
                }

                AddCoverage(coverage, "restart_after_recovery_save");

                if (
                    !LoadRecoveredAndAssert(
                        "restart_after_replay_export",
                        continuedHash,
                        continuedEvents,
                        options,
                        out postExportRoot,
                        out var postExport,
                        out var postExportError
                    )
                )
                {
                    return Fail(report, postExportError, recovered);
                }

                if (!ApplySingleGemTake(postExport, options, out _, out var postExportActionError))
                {
                    return Fail(
                        report,
                        "restart_after_replay_export continuation failed: " + postExportActionError,
                        postExport
                    );
                }

                var postExportContinued = postExport.BuildAutomationStateSnapshot(
                    options.ViewportWidth,
                    options.ViewportHeight
                );
                var postExportHash = ((JObject)postExportContinued["recovery"]).Value<string>("currentStateHash");
                var postExportEvents = RecordedEventCount(postExportContinued);
                AddCoverage(coverage, "restart_after_replay_export");

                if (
                    !ChangeSettingsWithoutGameplayMutation(
                        postExport,
                        postExportHash,
                        postExportEvents,
                        options,
                        out var settingsChangeError
                    )
                )
                {
                    return Fail(
                        report,
                        "restart_after_settings_change setup failed: " + settingsChangeError,
                        postExport
                    );
                }

                if (
                    !LoadRecoveredAndAssert(
                        "restart_after_settings_change",
                        postExportHash,
                        postExportEvents,
                        options,
                        out postSettingsRoot,
                        out var postSettings,
                        out var postSettingsError
                    )
                )
                {
                    return Fail(report, postSettingsError, postExport);
                }

                if (!ApplySingleGemTake(postSettings, options, out _, out var postSettingsActionError))
                {
                    return Fail(
                        report,
                        "restart_after_settings_change continuation failed: " + postSettingsActionError,
                        postSettings
                    );
                }

                AddCoverage(coverage, "restart_after_settings_change");

                if (
                    !RunRestartDuringPendingPhaseProof(
                        options,
                        out pendingRoot,
                        out pendingRestartRoot,
                        out var pendingProof,
                        out var pendingError
                    )
                )
                {
                    return Fail(report, pendingError, controller);
                }

                report["restartDuringPendingPhaseProof"] = pendingProof;
                AddCoverage(coverage, "restart_during_pending_phase");

                if (!RunBridgeFailureProofs(report, coverage, out var bridgeFailureError))
                {
                    return Fail(report, bridgeFailureError, controller);
                }

                report["sourceAction"] = sourceAction;
                report["continuedAction"] = continuedAction;
                report["sourceStateSummary"] = BuildStateSummary(saved);
                report["restoredStateSummary"] = BuildStateSummary(restored);
                report["continuedStateSummary"] = BuildStateSummary(continued);
                report["recoverySummary"] = new JObject
                {
                    ["savedStatus"] = savedRecovery.Value<string>("status"),
                    ["restoredStatus"] = restoredRecovery.Value<string>("status"),
                    ["continuedStatus"] = continuedRecovery.Value<string>("status"),
                    ["savedStateHash"] = savedHash,
                    ["restoredStateHash"] = restoredRecovery.Value<string>("currentStateHash"),
                    ["continuedStateHash"] = continuedHash,
                    ["savedRecordedEvents"] = savedRecordedEvents,
                    ["restoredRecordedEvents"] = restoredLiveRecording.Value<int>("recordedEvents"),
                    ["continuedRecordedEvents"] = continuedEvents,
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
                return Fail(report, ex.ToString(), controller);
            }
            finally
            {
                DestroyObject(pendingRestartRoot);
                DestroyObject(pendingRoot);
                DestroyObject(postSettingsRoot);
                DestroyObject(postExportRoot);
                DestroyObject(reviewRoot);
                DestroyObject(recoveredRoot);
            }
        }

        private static bool ApplySingleGemTake(
            GemDuelGameController controller,
            LocalDevRecoveryReleasePathSmokeOptions options,
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

        private static bool LoadRecoveredAndAssert(
            string caseId,
            string expectedHash,
            int expectedRecordedEvents,
            LocalDevRecoveryReleasePathSmokeOptions options,
            out GameObject root,
            out GemDuelGameController recovered,
            out string error
        )
        {
            root = new GameObject("GemDuel Recovery Proof " + caseId);
            recovered = root.AddComponent<GemDuelGameController>();
            recovered.SetAutomationViewport(options.ViewportWidth, options.ViewportHeight);
            if (!recovered.LoadRecoveredGameForAutomation(out var recoveryError))
            {
                error = caseId + " failed to load recovered game: " + recoveryError;
                return false;
            }

            var state = recovered.BuildAutomationStateSnapshot(options.ViewportWidth, options.ViewportHeight);
            var recovery = (JObject)state["recovery"];
            var replay = (JObject)state["replay"];
            var liveRecording = replay["liveRecording"] as JObject;
            var actualHash = recovery.Value<string>("currentStateHash");
            var actualEvents = liveRecording?.Value<int>("recordedEvents") ?? -1;
            if (actualHash != expectedHash)
            {
                error = caseId + " recovered hash mismatch: " + actualHash + " != " + expectedHash + ".";
                return false;
            }

            if (actualEvents != expectedRecordedEvents)
            {
                error =
                    caseId
                    + " recovered event count mismatch: "
                    + actualEvents
                    + " != "
                    + expectedRecordedEvents
                    + ".";
                return false;
            }

            error = string.Empty;
            return true;
        }

        private static bool ChangeSettingsWithoutGameplayMutation(
            GemDuelGameController controller,
            string expectedHash,
            int expectedRecordedEvents,
            LocalDevRecoveryReleasePathSmokeOptions options,
            out string error
        )
        {
            if (!controller.RunSemanticActionForAutomation("open_settings", null, out var openError))
            {
                error = "open_settings failed: " + openError;
                return false;
            }

            if (
                !controller.RunSemanticActionForAutomation(
                    "change_setting",
                    new JObject { ["name"] = "soundEnabled", ["value"] = false },
                    out var changeError
                )
            )
            {
                error = "change_setting soundEnabled failed: " + changeError;
                return false;
            }

            if (!controller.RunSemanticActionForAutomation("settings_save", null, out var saveError))
            {
                error = "settings_save failed: " + saveError;
                return false;
            }

            var state = controller.BuildAutomationStateSnapshot(options.ViewportWidth, options.ViewportHeight);
            var recovery = (JObject)state["recovery"];
            var replay = (JObject)state["replay"];
            var liveRecording = replay["liveRecording"] as JObject;
            var actualHash = recovery.Value<string>("currentStateHash");
            var actualEvents = liveRecording?.Value<int>("recordedEvents") ?? -1;
            if (actualHash != expectedHash)
            {
                error = "settings change mutated gameplay hash: " + actualHash + " != " + expectedHash + ".";
                return false;
            }

            if (actualEvents != expectedRecordedEvents)
            {
                error =
                    "settings change mutated replay event count: "
                    + actualEvents
                    + " != "
                    + expectedRecordedEvents
                    + ".";
                return false;
            }

            error = string.Empty;
            return true;
        }

        private static bool RunRestartDuringPendingPhaseProof(
            LocalDevRecoveryReleasePathSmokeOptions options,
            out GameObject pendingRoot,
            out GameObject pendingRestartRoot,
            out JObject proof,
            out string error
        )
        {
            pendingRoot = new GameObject("GemDuel Recovery Pending Phase Source");
            pendingRestartRoot = null;
            proof = new JObject();
            var controller = pendingRoot.AddComponent<GemDuelGameController>();
            controller.SetAutomationViewport(options.ViewportWidth, options.ViewportHeight);
            controller.LoadMainMenuForAutomation();
            if (
                !controller.RunSemanticActionForAutomation(
                    "start_local_game",
                    new JObject { ["seed"] = options.Seed + "-pending" },
                    out var startError
                )
            )
            {
                error = "pending proof start_local_game failed: " + startError;
                return false;
            }

            if (
                !controller.RunSemanticActionForAutomation(
                    "click_market_card",
                    new JObject { ["level"] = 1, ["index"] = 0 },
                    out var previewError
                )
            )
            {
                error = "pending proof click_market_card failed: " + previewError;
                return false;
            }

            if (
                !controller.RunSemanticActionForAutomation(
                    "confirm_preview_action",
                    new JObject { ["actionId"] = "reserve" },
                    out var reserveError
                )
            )
            {
                error = "pending proof reserve action failed: " + reserveError;
                return false;
            }

            var pending = controller.BuildAutomationStateSnapshot(
                options.ViewportWidth,
                options.ViewportHeight
            );
            if (pending.Value<string>("phase") != "RESERVE_WAITING_GEM")
            {
                error = "pending proof expected RESERVE_WAITING_GEM, got " + pending.Value<string>("phase") + ".";
                return false;
            }

            var pendingHash = ((JObject)pending["recovery"]).Value<string>("currentStateHash");
            var pendingEvents = RecordedEventCount(pending);
            if (
                !LoadRecoveredAndAssert(
                    "restart_during_pending_phase",
                    pendingHash,
                    pendingEvents,
                    options,
                    out pendingRestartRoot,
                    out var recovered,
                    out error
                )
            )
            {
                return false;
            }

            var recoveredState = recovered.BuildAutomationStateSnapshot(
                options.ViewportWidth,
                options.ViewportHeight
            );
            if (recoveredState.Value<string>("phase") != "RESERVE_WAITING_GEM")
            {
                error =
                    "pending proof recovered phase mismatch: "
                    + recoveredState.Value<string>("phase")
                    + ".";
                return false;
            }

            if (!recovered.RunSemanticActionForAutomation("cancel_gem_selection", null, out var cancelError))
            {
                error = "pending proof cancel after recovery failed: " + cancelError;
                return false;
            }

            var continued = recovered.BuildAutomationStateSnapshot(
                options.ViewportWidth,
                options.ViewportHeight
            );
            proof = new JObject
            {
                ["pendingStateHash"] = pendingHash,
                ["pendingRecordedEvents"] = pendingEvents,
                ["recoveredPhase"] = recoveredState.Value<string>("phase"),
                ["continuedPhase"] = continued.Value<string>("phase"),
                ["continuedStateHash"] = ((JObject)continued["recovery"]).Value<string>("currentStateHash"),
                ["continuedRecordedEvents"] = RecordedEventCount(continued),
            };
            error = string.Empty;
            return true;
        }

        private static bool RunBridgeFailureProofs(JObject report, JArray coverage, out string error)
        {
            var bridgeProofs = new JObject();
            if (!ProveMalformedBridgeResponse(out var malformedProof, out error))
            {
                return false;
            }

            bridgeProofs["malformedBridgeResponse"] = malformedProof;
            AddCoverage(coverage, "malformed_bridge_response");

            if (!ProveMailboxTimeout(out var timeoutProof, out error))
            {
                return false;
            }

            bridgeProofs["mailboxTimeout"] = timeoutProof;
            AddCoverage(coverage, "mailbox_timeout");

            if (!ProveCorruptMailboxResponse(out var corruptProof, out error))
            {
                return false;
            }

            bridgeProofs["corruptMailbox"] = corruptProof;
            AddCoverage(coverage, "corrupt_mailbox");
            report["bridgeFailureProofs"] = bridgeProofs;
            error = string.Empty;
            return true;
        }

        private static bool ProveMalformedBridgeResponse(out JObject proof, out string error)
        {
            var engine = new TypeScriptGameRulesEngine(_ => null);
            var result = engine.StartLocalGame("unity-malformed-bridge-response-proof");
            if (result.Ok || result.ErrorCode != "BRIDGE_EMPTY_RESPONSE")
            {
                proof = null;
                error = "Malformed bridge response was not mapped to BRIDGE_EMPTY_RESPONSE.";
                return false;
            }

            proof = new JObject
            {
                ["ok"] = true,
                ["errorCode"] = result.ErrorCode,
                ["error"] = result.Error,
            };
            error = string.Empty;
            return true;
        }

        private static bool ProveMailboxTimeout(out JObject proof, out string error)
        {
            var mailboxRoot = Path.Combine(Path.GetTempPath(), "gemduel-timeout-mailbox-" + Guid.NewGuid());
            var requestDirectory = Path.Combine(mailboxRoot, "requests");
            var responseDirectory = Path.Combine(mailboxRoot, "responses");
            try
            {
                Directory.CreateDirectory(requestDirectory);
                Directory.CreateDirectory(responseDirectory);
                var client = new TypeScriptRulesBridgeMailboxClient(mailboxRoot, 75);
                try
                {
                    client.Execute(new JObject { ["kind"] = "start" });
                    proof = null;
                    error = "Mailbox timeout proof unexpectedly received a response.";
                    return false;
                }
                catch (TimeoutException ex)
                {
                    if (Directory.GetFiles(requestDirectory).Length != 0)
                    {
                        proof = null;
                        error = "Mailbox timeout proof left request files behind.";
                        return false;
                    }

                    if (Directory.GetFiles(responseDirectory).Length != 0)
                    {
                        proof = null;
                        error = "Mailbox timeout proof left response files behind.";
                        return false;
                    }

                    proof = new JObject
                    {
                        ["ok"] = true,
                        ["errorType"] = "TimeoutException",
                        ["message"] = ex.Message,
                    };
                    error = string.Empty;
                    return true;
                }
            }
            finally
            {
                if (Directory.Exists(mailboxRoot))
                {
                    Directory.Delete(mailboxRoot, true);
                }
            }
        }

        private static bool ProveCorruptMailboxResponse(out JObject proof, out string error)
        {
            var mailboxRoot = Path.Combine(Path.GetTempPath(), "gemduel-corrupt-mailbox-" + Guid.NewGuid());
            var requestDirectory = Path.Combine(mailboxRoot, "requests");
            var responseDirectory = Path.Combine(mailboxRoot, "responses");
            try
            {
                Directory.CreateDirectory(requestDirectory);
                Directory.CreateDirectory(responseDirectory);
                Exception responderError = null;
                var responder = System.Threading.Tasks.Task.Run(() =>
                {
                    try
                    {
                        var deadline = DateTime.UtcNow.AddMilliseconds(8000);
                        while (DateTime.UtcNow < deadline)
                        {
                            var requests = Directory.GetFiles(requestDirectory, "*.json");
                            if (requests.Length > 0)
                            {
                                File.WriteAllText(
                                    Path.Combine(responseDirectory, Path.GetFileName(requests[0])),
                                    "{not-json"
                                );
                                return;
                            }

                            System.Threading.Thread.Sleep(5);
                        }

                        throw new TimeoutException("Corrupt mailbox responder did not observe a request file.");
                    }
                    catch (Exception ex)
                    {
                        responderError = ex;
                    }
                });

                var client = new TypeScriptRulesBridgeMailboxClient(mailboxRoot, 10000);
                try
                {
                    client.Execute(new JObject { ["kind"] = "start" });
                    proof = null;
                    error = "Corrupt mailbox proof unexpectedly parsed a response.";
                    return false;
                }
                catch (JsonReaderException ex)
                {
                    if (!responder.Wait(10000))
                    {
                        proof = null;
                        error = "Corrupt mailbox responder did not finish.";
                        return false;
                    }

                    if (responderError != null)
                    {
                        proof = null;
                        error = "Corrupt mailbox responder failed: " + responderError.Message;
                        return false;
                    }

                    if (Directory.GetFiles(requestDirectory).Length != 0)
                    {
                        proof = null;
                        error = "Corrupt mailbox proof left request files behind.";
                        return false;
                    }

                    if (Directory.GetFiles(responseDirectory).Length != 0)
                    {
                        proof = null;
                        error = "Corrupt mailbox proof left response files behind.";
                        return false;
                    }

                    proof = new JObject
                    {
                        ["ok"] = true,
                        ["errorType"] = "JsonReaderException",
                        ["message"] = ex.Message,
                    };
                    error = string.Empty;
                    return true;
                }
            }
            finally
            {
                if (Directory.Exists(mailboxRoot))
                {
                    Directory.Delete(mailboxRoot, true);
                }
            }
        }

        private static int RecordedEventCount(JObject automationState)
        {
            var replay = (JObject)automationState["replay"];
            var liveRecording = replay["liveRecording"] as JObject;
            return liveRecording?.Value<int>("recordedEvents") ?? -1;
        }

        private static void AddCoverage(JArray coverage, string caseId)
        {
            foreach (var item in coverage)
            {
                if (item.Value<string>() == caseId)
                {
                    return;
                }
            }

            if (!string.IsNullOrWhiteSpace(caseId))
            {
                coverage.Add(caseId);
            }
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
                ["recordedEvents"] = liveRecording?.Value<int>("recordedEvents") ?? 0,
                ["summaryFinalStateHash"] = liveRecording?.Value<string>("summaryFinalStateHash"),
                ["recoveryStatus"] = recovery.Value<string>("status"),
            };
        }

        private static JObject BuildFailureState(GemDuelGameController controller)
        {
            try
            {
                var state = controller.BuildAutomationStateSnapshot(1920, 1080);
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

        private static JObject Fail(JObject report, string reason, GemDuelGameController controller)
        {
            report["ok"] = false;
            report["failureReason"] = reason;
            report["failureState"] = controller == null ? null : BuildFailureState(controller);
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
    }
}
