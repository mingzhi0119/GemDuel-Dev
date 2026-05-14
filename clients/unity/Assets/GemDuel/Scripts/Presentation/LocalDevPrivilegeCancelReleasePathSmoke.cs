using System;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json.Linq;
using UnityEngine;

namespace GemDuel.Presentation
{
    public sealed class LocalDevPrivilegeCancelReleasePathSmokeOptions
    {
        public string Seed { get; set; } = "unity-built-player-privilege-family-20260512";
        public int MaxSetupSteps { get; set; } = 4;
        public int ViewportWidth { get; set; } = 1920;
        public int ViewportHeight { get; set; } = 1080;
    }

    public static class LocalDevPrivilegeCancelReleasePathSmoke
    {
        public static JObject Run(
            GemDuelGameController controller,
            LocalDevPrivilegeCancelReleasePathSmokeOptions options
        )
        {
            options = options ?? new LocalDevPrivilegeCancelReleasePathSmokeOptions();
            var actions = new JArray();
            var report = new JObject
            {
                ["schemaVersion"] = 1,
                ["kind"] = "unity-localdev-privilege-cancel-release-path-smoke",
                ["startedAt"] = DateTime.UtcNow.ToString("O"),
                ["seed"] = options.Seed,
                ["maxSetupSteps"] = options.MaxSetupSteps,
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
                    return Fail(report, "Fresh product start unexpectedly loaded fixture replay events.", controller, options);
                }

                if (startReplay["liveRecording"] == null || startReplay["liveRecording"].Type == JTokenType.Null)
                {
                    return Fail(report, "Fresh product start did not create live replay recording.", controller, options);
                }

                var setupSteps = 0;
                var beforeActivate = afterStart;
                while (!CanActivatePrivilege(beforeActivate) && setupSteps < Math.Max(0, options.MaxSetupSteps))
                {
                    if (beforeActivate.Value<string>("phase") != "IDLE")
                    {
                        return Fail(
                            report,
                            "Privilege setup reached unsupported phase " + beforeActivate.Value<string>("phase") + ".",
                            controller,
                            options
                        );
                    }

                    var setupBefore = beforeActivate;
                    if (!TakeSingleGem(controller, setupBefore, out var setupDetail, out var setupAfter, options))
                    {
                        return Fail(report, "Privilege setup failed: " + setupDetail, controller, options);
                    }

                    AppendAction(actions, setupDetail, setupBefore, setupAfter);
                    setupSteps += 1;
                    beforeActivate = setupAfter;
                }

                if (!CanActivatePrivilege(beforeActivate))
                {
                    return Fail(report, "Privilege activation target was not available after setup.", controller, options);
                }

                if (!controller.RunSemanticActionForAutomation("activate_privilege", null, out var activateError))
                {
                    return Fail(report, "activate_privilege failed: " + activateError, controller, options);
                }

                var afterActivate = controller.BuildAutomationStateSnapshot(
                    options.ViewportWidth,
                    options.ViewportHeight
                );
                AppendAction(actions, "activate_privilege", beforeActivate, afterActivate);
                if (afterActivate.Value<string>("phase") != "PRIVILEGE_ACTION")
                {
                    return Fail(report, "activate_privilege did not enter PRIVILEGE_ACTION.", controller, options);
                }

                if (!HasVisibleEventTarget(afterActivate, "ActionButton", "cancel-gems"))
                {
                    return Fail(report, "Privilege cancel visible control was not exposed.", controller, options);
                }

                if (!controller.RunSemanticActionForAutomation("cancel_gem_selection", null, out var cancelError))
                {
                    return Fail(report, "cancel_gem_selection failed during privilege phase: " + cancelError, controller, options);
                }

                var afterCancel = controller.BuildAutomationStateSnapshot(
                    options.ViewportWidth,
                    options.ViewportHeight
                );
                AppendAction(actions, "cancel_privilege", afterActivate, afterCancel);
                if (afterCancel.Value<string>("phase") != "IDLE")
                {
                    return Fail(report, "CANCEL_PRIVILEGE did not return to IDLE.", controller, options);
                }

                if (afterCancel.Value<string>("statusText") != "Applied live action | CANCEL_PRIVILEGE")
                {
                    return Fail(report, "CANCEL_PRIVILEGE status was not surfaced after cancel.", controller, options);
                }

                if (!controller.ExportReplayJsonForAutomation(out var exportedJson, out var exportError))
                {
                    return Fail(report, "Replay export failed after privilege cancel: " + exportError, controller, options);
                }

                var exported = JObject.Parse(exportedJson);
                var events = (JArray)exported["events"];
                var eventTypes = events.Select(item => item.Value<string>("type")).ToList();
                var activateIndex = eventTypes.FindIndex(type => type == "activate_privilege");
                var cancelIndex = eventTypes.FindLastIndex(type => type == "cancel_privilege");
                if (activateIndex < 0 || cancelIndex < 0 || cancelIndex <= activateIndex)
                {
                    return Fail(report, "Exported replay did not contain ordered activate_privilege then cancel_privilege.", controller, options);
                }

                var finalHash = CurrentStateHash(afterCancel);
                var exportedHash = ((JObject)exported["summary"]).Value<string>("finalStateHash");
                if (exportedHash != finalHash)
                {
                    return Fail(
                        report,
                        "Exported replay final hash mismatch after privilege cancel: "
                            + exportedHash
                            + " != "
                            + finalHash,
                        controller,
                        options
                    );
                }

                reviewRoot = new GameObject("GemDuel Privilege Cancel Release Path Replay Review");
                var review = reviewRoot.AddComponent<GemDuelGameController>();
                if (!review.ImportReplayJsonForAutomation(exportedJson, out var importError))
                {
                    return Fail(report, "Replay review import failed after privilege cancel: " + importError, controller, options);
                }

                if (!review.PlayReplayToEndForAutomation(out var reviewError))
                {
                    return Fail(report, "Replay review playback failed after privilege cancel: " + reviewError, controller, options);
                }

                var reviewed = review.BuildAutomationStateSnapshot(options.ViewportWidth, options.ViewportHeight);
                var reviewedHash = CurrentStateHash(reviewed);
                if (reviewedHash != exportedHash)
                {
                    return Fail(
                        report,
                        "Replay review hash mismatch after privilege cancel: "
                            + reviewedHash
                            + " != "
                            + exportedHash,
                        controller,
                        options
                    );
                }

                report["startStateSummary"] = BuildStateSummary(afterStart);
                report["beforeActivateStateSummary"] = BuildStateSummary(beforeActivate);
                report["afterActivateStateSummary"] = BuildStateSummary(afterActivate);
                report["afterCancelStateSummary"] = BuildStateSummary(afterCancel);
                report["privilegeCancelSummary"] = new JObject
                {
                    ["setupStepCount"] = setupSteps,
                    ["activatedPhase"] = afterActivate.Value<string>("phase"),
                    ["cancelledPhase"] = afterCancel.Value<string>("phase"),
                    ["recordedEvents"] = RecordedEventCount(afterCancel),
                    ["eventTypes"] = new JArray(eventTypes),
                    ["activateEventIndex"] = activateIndex,
                    ["cancelEventIndex"] = cancelIndex,
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

        private static bool TakeSingleGem(
            GemDuelGameController controller,
            JObject before,
            out string detail,
            out JObject after,
            LocalDevPrivilegeCancelReleasePathSmokeOptions options
        )
        {
            after = before;
            var coord = FindFirstCollectibleBoardGem((JObject)before["snapshot"]);
            if (!coord.HasValue)
            {
                detail = "No collectible board gem for privilege setup.";
                return false;
            }

            var payload = new JObject { ["row"] = coord.Value.x, ["column"] = coord.Value.y };
            if (!controller.RunSemanticActionForAutomation("click_board_cell", payload, out var clickError))
            {
                detail = "click_board_cell rejected during privilege setup: " + clickError;
                return false;
            }

            if (!controller.RunSemanticActionForAutomation("confirm_gem_selection", null, out var confirmError))
            {
                detail = "confirm_gem_selection rejected during privilege setup: " + confirmError;
                return false;
            }

            after = controller.BuildAutomationStateSnapshot(options.ViewportWidth, options.ViewportHeight);
            detail = "take_gems";
            return true;
        }

        private static bool CanActivatePrivilege(JObject automationState)
        {
            if (automationState.Value<string>("phase") != "IDLE")
            {
                return false;
            }

            var snapshot = (JObject)automationState["snapshot"];
            return HasActivePlayerPrivilege(snapshot)
                && FindFirstCollectibleBoardGem(snapshot).HasValue
                && HasVisibleEventTarget(automationState, "ActionButton", "activate-privilege");
        }

        private static bool HasActivePlayerPrivilege(JObject snapshot)
        {
            var player = snapshot.Value<string>("turn");
            var privileges = snapshot["privileges"] as JObject;
            var extraPrivileges = snapshot["extraPrivileges"] as JObject;
            return Math.Max(0, privileges?.Value<int?>(player) ?? 0)
                + Math.Max(0, extraPrivileges?.Value<int?>(player) ?? 0)
                > 0;
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

        private static bool HasVisibleEventTarget(JObject automationState, string kind, string eventType)
        {
            return VisibleTargets(automationState)
                .Any(target =>
                    target.Value<string>("kind") == kind
                    && target.Value<string>("eventType") == eventType
                    && target.Value<bool>("clickable")
                );
        }

        private static IEnumerable<JObject> VisibleTargets(JObject automationState)
        {
            var targets = automationState["visibleTargets"] as JArray;
            return targets == null ? Enumerable.Empty<JObject>() : targets.OfType<JObject>();
        }

        private static void AppendAction(JArray actions, string detail, JObject before, JObject after)
        {
            actions.Add(
                new JObject
                {
                    ["step"] = actions.Count,
                    ["detail"] = detail,
                    ["family"] = detail,
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
            LocalDevPrivilegeCancelReleasePathSmokeOptions options
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
