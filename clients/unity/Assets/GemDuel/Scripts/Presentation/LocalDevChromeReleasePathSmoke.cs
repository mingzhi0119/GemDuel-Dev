using System;
using Newtonsoft.Json.Linq;
using UnityEngine;

namespace GemDuel.Presentation
{
    public sealed class LocalDevChromeReleasePathSmokeOptions
    {
        public string Seed { get; set; } = "unity-built-player-chrome-release-path";
        public int ViewportWidth { get; set; } = 1920;
        public int ViewportHeight { get; set; } = 1080;
    }

    public static class LocalDevChromeReleasePathSmoke
    {
        public static JObject Run(
            GemDuelGameController controller,
            LocalDevChromeReleasePathSmokeOptions options
        )
        {
            options = options ?? new LocalDevChromeReleasePathSmokeOptions();
            var report = new JObject
            {
                ["schemaVersion"] = 1,
                ["kind"] = "unity-localdev-chrome-release-path-smoke",
                ["startedAt"] = DateTime.UtcNow.ToString("O"),
                ["seed"] = options.Seed,
                ["ok"] = false,
                ["freshLaunch"] = true,
                ["usedFixtureReplayAsGameplayDriver"] = false,
                ["usedCheckpointStateReplacement"] = false,
            };

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

                if (controller.LastAutomationDriver != "setup-live-rules-engine")
                {
                    return Fail(
                        report,
                        "Local PvP did not start through the live rules-engine bridge.",
                        controller,
                        options
                    );
                }

                var baseline = controller.BuildAutomationStateSnapshot(
                    options.ViewportWidth,
                    options.ViewportHeight
                );
                var baselineReplay = (JObject)baseline["replay"];
                var baselineHash = CurrentStateHash(baseline);
                var baselineRecordedEvents = RecordedEventCount(baseline);
                if (baseline.Value<int>("totalEvents") != 0 || baselineReplay.Value<bool>("loaded"))
                {
                    report["usedFixtureReplayAsGameplayDriver"] = true;
                    return Fail(report, "Fresh Local PvP start unexpectedly loaded fixture replay events.", controller, options);
                }

                if (baselineReplay["liveRecording"] == null || baselineReplay["liveRecording"].Type == JTokenType.Null)
                {
                    return Fail(report, "Fresh Local PvP start did not create live replay recording.", controller, options);
                }

                if (!HasVisibleTarget(baseline, "chrome.rulebook"))
                {
                    return Fail(report, "Rulebook chrome control was not visible before opening.", controller, options);
                }

                if (!controller.RunSemanticActionForAutomation("click_chrome_rulebook", null, out var openError))
                {
                    return Fail(report, "click_chrome_rulebook failed: " + openError, controller, options);
                }

                var rulebookOpen = controller.BuildAutomationStateSnapshot(
                    options.ViewportWidth,
                    options.ViewportHeight
                );
                if (!HasVisibleTarget(rulebookOpen, "rulebook.overlay"))
                {
                    return Fail(report, "Rulebook overlay target was not visible after opening.", controller, options);
                }

                if (!HasVisibleTarget(rulebookOpen, "rulebook.panel") || !HasVisibleTarget(rulebookOpen, "rulebook.close"))
                {
                    return Fail(report, "Rulebook panel and close button targets were not visible after opening.", controller, options);
                }

                if (!HasVisibleTarget(rulebookOpen, "rulebook.next"))
                {
                    return Fail(report, "Rulebook next-page button target was not visible after opening.", controller, options);
                }

                if (CurrentStateHash(rulebookOpen) != baselineHash)
                {
                    return Fail(report, "Rulebook open changed gameplay state hash.", controller, options);
                }

                if (RecordedEventCount(rulebookOpen) != baselineRecordedEvents)
                {
                    return Fail(report, "Rulebook open appended live replay events.", controller, options);
                }

                if (!controller.RunSemanticActionForAutomation("rulebook_next", null, out var nextError))
                {
                    return Fail(report, "rulebook_next failed: " + nextError, controller, options);
                }

                var rulebookNext = controller.BuildAutomationStateSnapshot(
                    options.ViewportWidth,
                    options.ViewportHeight
                );
                var rulebookSnapshot = rulebookNext["rulebook"] as JObject;
                if (rulebookSnapshot == null || rulebookSnapshot.Value<int>("page") != 1)
                {
                    return Fail(report, "Rulebook next did not advance to page 2.", controller, options);
                }

                if (CurrentStateHash(rulebookNext) != baselineHash)
                {
                    return Fail(report, "Rulebook next changed gameplay state hash.", controller, options);
                }

                if (RecordedEventCount(rulebookNext) != baselineRecordedEvents)
                {
                    return Fail(report, "Rulebook next appended live replay events.", controller, options);
                }

                if (!controller.RunSemanticActionForAutomation("close_rulebook", null, out var closeError))
                {
                    return Fail(report, "close_rulebook failed: " + closeError, controller, options);
                }

                var rulebookClosed = controller.BuildAutomationStateSnapshot(
                    options.ViewportWidth,
                    options.ViewportHeight
                );
                if (HasVisibleTarget(rulebookClosed, "rulebook.overlay"))
                {
                    return Fail(report, "Rulebook overlay target remained visible after closing.", controller, options);
                }

                if (CurrentStateHash(rulebookClosed) != baselineHash)
                {
                    return Fail(report, "Rulebook close changed gameplay state hash.", controller, options);
                }

                if (RecordedEventCount(rulebookClosed) != baselineRecordedEvents)
                {
                    return Fail(report, "Rulebook close appended live replay events.", controller, options);
                }

                if (!controller.RunSemanticActionForAutomation("click_chrome_restart", null, out var restartError))
                {
                    return Fail(report, "click_chrome_restart failed: " + restartError, controller, options);
                }

                var shell = controller.BuildAutomationStateSnapshot(
                    options.ViewportWidth,
                    options.ViewportHeight
                );
                if (!IsShellState(shell))
                {
                    return Fail(report, "Restart did not return to the main menu shell.", controller, options);
                }

                if (!HasVisibleTarget(shell, "mode.local"))
                {
                    return Fail(report, "Restarted shell did not expose the Local PvP start target.", controller, options);
                }

                if (
                    !controller.RunSemanticActionForAutomation(
                        "start_local_game",
                        new JObject { ["seed"] = options.Seed + "-after-restart" },
                        out var restartStartError
                    )
                )
                {
                    return Fail(report, "restart start_local_game failed: " + restartStartError, controller, options);
                }

                if (controller.LastAutomationDriver != "setup-live-rules-engine")
                {
                    return Fail(
                        report,
                        "Restarted Local PvP did not start through the live rules-engine bridge.",
                        controller,
                        options
                    );
                }

                var restartedStart = controller.BuildAutomationStateSnapshot(
                    options.ViewportWidth,
                    options.ViewportHeight
                );
                if (restartedStart.Value<int>("totalEvents") != 0 || ((JObject)restartedStart["replay"]).Value<bool>("loaded"))
                {
                    report["usedFixtureReplayAsGameplayDriver"] = true;
                    return Fail(report, "Restarted Local PvP unexpectedly loaded fixture replay events.", controller, options);
                }

                var restartedStartHash = CurrentStateHash(restartedStart);
                if (!ApplySingleGemTake(controller, options, out var commandDetail, out var commandError))
                {
                    return Fail(report, "Restarted live command failed: " + commandError, controller, options);
                }

                var afterCommand = controller.BuildAutomationStateSnapshot(
                    options.ViewportWidth,
                    options.ViewportHeight
                );
                var afterCommandHash = CurrentStateHash(afterCommand);
                var afterCommandEvents = RecordedEventCount(afterCommand);
                if (afterCommandHash == restartedStartHash)
                {
                    return Fail(report, "Restarted live command did not change gameplay state hash.", controller, options);
                }

                if (afterCommandEvents != 1)
                {
                    return Fail(
                        report,
                        "Restarted live command did not record exactly one replay event: " + afterCommandEvents + ".",
                        controller,
                        options
                    );
                }

                report["baselineStateSummary"] = BuildStateSummary(baseline);
                report["rulebookOpenStateSummary"] = BuildStateSummary(rulebookOpen);
                report["rulebookNextStateSummary"] = BuildStateSummary(rulebookNext);
                report["rulebookClosedStateSummary"] = BuildStateSummary(rulebookClosed);
                report["rulebookOpenSnapshot"] = rulebookOpen["rulebook"]?.DeepClone();
                report["rulebookNextSnapshot"] = rulebookNext["rulebook"]?.DeepClone();
                report["shellStateSummary"] = BuildStateSummary(shell);
                report["restartedStartStateSummary"] = BuildStateSummary(restartedStart);
                report["afterRestartCommandStateSummary"] = BuildStateSummary(afterCommand);
                report["chromeSummary"] = new JObject
                {
                    ["rulebookOverlayVisibleAfterOpen"] = true,
                    ["rulebookPanelVisibleAfterOpen"] = true,
                    ["rulebookCloseVisibleAfterOpen"] = true,
                    ["rulebookNextVisibleAfterOpen"] = true,
                    ["rulebookPageAfterNext"] = 1,
                    ["rulebookOverlayVisibleAfterClose"] = false,
                    ["gameplayHashBeforeRulebook"] = baselineHash,
                    ["gameplayHashAfterRulebookOpen"] = CurrentStateHash(rulebookOpen),
                    ["gameplayHashAfterRulebookNext"] = CurrentStateHash(rulebookNext),
                    ["gameplayHashAfterRulebookClose"] = CurrentStateHash(rulebookClosed),
                    ["recordedEventsBeforeRulebook"] = baselineRecordedEvents,
                    ["recordedEventsAfterRulebookOpen"] = RecordedEventCount(rulebookOpen),
                    ["recordedEventsAfterRulebookNext"] = RecordedEventCount(rulebookNext),
                    ["recordedEventsAfterRulebookClose"] = RecordedEventCount(rulebookClosed),
                    ["shellAfterRestart"] = true,
                    ["localStartVisibleAfterRestart"] = true,
                    ["restartedStartHash"] = restartedStartHash,
                    ["restartedCommandDetail"] = commandDetail,
                    ["restartedCommandHash"] = afterCommandHash,
                    ["restartedCommandRecordedEvents"] = afterCommandEvents,
                };
                report["ok"] = true;
                report["completedAt"] = DateTime.UtcNow.ToString("O");
                return report;
            }
            catch (Exception ex)
            {
                return Fail(report, ex.ToString(), controller, options);
            }
        }

        private static bool ApplySingleGemTake(
            GemDuelGameController controller,
            LocalDevChromeReleasePathSmokeOptions options,
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

        private static bool HasVisibleTarget(JObject automationState, string semanticKey)
        {
            var targets = automationState["visibleTargets"] as JArray;
            if (targets == null)
            {
                return false;
            }

            foreach (var item in targets)
            {
                if (item.Value<string>("semanticKey") == semanticKey)
                {
                    return true;
                }
            }

            return false;
        }

        private static bool IsShellState(JObject automationState)
        {
            var replay = (JObject)automationState["replay"];
            var liveRecording = replay["liveRecording"];
            return replay.Value<string>("currentStateHash") == null
                && (liveRecording == null || liveRecording.Type == JTokenType.Null)
                && replay.Value<bool>("loaded") == false
                && automationState.Value<int>("totalEvents") == 0;
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

        private static string CurrentStateHash(JObject automationState)
        {
            return ((JObject)automationState["replay"]).Value<string>("currentStateHash");
        }

        private static int RecordedEventCount(JObject automationState)
        {
            var liveRecording = ((JObject)automationState["replay"])["liveRecording"] as JObject;
            return liveRecording?.Value<int>("recordedEvents") ?? 0;
        }

        private static JObject BuildFailureState(GemDuelGameController controller, LocalDevChromeReleasePathSmokeOptions options)
        {
            try
            {
                var state = controller.BuildAutomationStateSnapshot(
                    options.ViewportWidth,
                    options.ViewportHeight
                );
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
            LocalDevChromeReleasePathSmokeOptions options
        )
        {
            report["ok"] = false;
            report["failureReason"] = reason;
            report["failureState"] = controller == null ? null : BuildFailureState(controller, options);
            report["completedAt"] = DateTime.UtcNow.ToString("O");
            return report;
        }
    }
}
