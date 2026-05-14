using System;
using System.Collections.Generic;
using GemDuel.Replay;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using UnityEngine;

namespace GemDuel.Presentation
{
    public sealed class LocalDevInvalidActionReleasePathSmokeOptions
    {
        public string Seed { get; set; } = "unity-built-player-invalid-action-release-path";
        public int ViewportWidth { get; set; } = 1920;
        public int ViewportHeight { get; set; } = 1080;
    }

    public static class LocalDevInvalidActionReleasePathSmoke
    {
        public static JObject Run(
            GemDuelGameController controller,
            LocalDevInvalidActionReleasePathSmokeOptions options
        )
        {
            options = options ?? new LocalDevInvalidActionReleasePathSmokeOptions();
            var cases = new JArray();
            var report = new JObject
            {
                ["schemaVersion"] = 1,
                ["kind"] = "unity-localdev-invalid-action-release-path-smoke",
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

                var startHash = CurrentStateHash(afterStart);
                var startRecordedEvents = RecordedEventCount(afterStart);
                foreach (var invalidCase in BuildInvalidCases(afterStart))
                {
                    var caseReport = RunInvalidCase(controller, invalidCase, options);
                    cases.Add(caseReport);
                    if (!caseReport.Value<bool>("ok"))
                    {
                        return Fail(
                            report,
                            "Invalid-action case failed: " + invalidCase.Id,
                            controller,
                            options
                        );
                    }
                }

                var final = controller.BuildAutomationStateSnapshot(options.ViewportWidth, options.ViewportHeight);
                var finalHash = CurrentStateHash(final);
                var finalRecordedEvents = RecordedEventCount(final);
                if (finalHash != startHash)
                {
                    return Fail(report, "Invalid-action smoke changed the fresh-start state hash.", controller, options);
                }

                if (finalRecordedEvents != startRecordedEvents)
                {
                    return Fail(report, "Invalid-action smoke appended live replay events.", controller, options);
                }

                if (!controller.ExportReplayJsonForAutomation(out var exportedJson, out var exportError))
                {
                    return Fail(report, "Replay export after invalid-action smoke failed: " + exportError, controller, options);
                }

                var exportedReplay = JsonConvert.DeserializeObject<ReplayVNext>(exportedJson);
                if (exportedReplay == null)
                {
                    return Fail(report, "Exported replay after invalid-action smoke could not be parsed.", controller, options);
                }

                if (exportedReplay.Events.Count != startRecordedEvents)
                {
                    return Fail(
                        report,
                        "Exported replay event count changed after invalid actions: "
                            + exportedReplay.Events.Count
                            + " != "
                            + startRecordedEvents
                            + ".",
                        controller,
                        options
                    );
                }

                reviewRoot = new GameObject("GemDuel Invalid Action Release Path Replay Review");
                var review = reviewRoot.AddComponent<GemDuelGameController>();
                if (!review.ImportReplayJsonForAutomation(exportedJson, out var importError))
                {
                    return Fail(report, "Replay review import failed after invalid actions: " + importError, controller, options);
                }

                if (!review.PlayReplayToEndForAutomation(out var reviewError))
                {
                    return Fail(report, "Replay review playback failed after invalid actions: " + reviewError, controller, options);
                }

                var reviewed = review.BuildAutomationStateSnapshot(options.ViewportWidth, options.ViewportHeight);
                var reviewedHash = CurrentStateHash(reviewed);
                var exportedHash = exportedReplay.Summary.FinalStateHash;
                report["productStateSummary"] = new JObject
                {
                    ["phase"] = final.Value<string>("phase"),
                    ["turn"] = final.Value<string>("turn"),
                    ["winner"] = final.Value<string>("winner"),
                    ["stateHash"] = finalHash,
                    ["recordedEvents"] = finalRecordedEvents,
                    ["summaryFinalStateHash"] = LiveSummaryHash(final),
                };
                report["replayHashSummary"] = new JObject
                {
                    ["exportedEvents"] = exportedReplay.Events.Count,
                    ["exportedSummaryFinalStateHash"] = exportedHash,
                    ["controllerCurrentStateHash"] = finalHash,
                };
                report["replayReview"] = new JObject
                {
                    ["ok"] = reviewedHash == exportedHash,
                    ["reviewedFinalStateHash"] = reviewedHash,
                };
                if (reviewedHash != exportedHash)
                {
                    return Fail(
                        report,
                        "Replay review hash mismatch after invalid actions: "
                            + reviewedHash
                            + " != "
                            + exportedHash,
                        controller,
                        options
                    );
                }

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

        private static IEnumerable<InvalidActionCase> BuildInvalidCases(JObject startState)
        {
            var activePlayer = startState.Value<string>("turn") ?? "p1";
            var inactivePlayer = activePlayer == "p1" ? "p2" : "p1";
            yield return new InvalidActionCase
            {
                Id = "reject-select-buff-idle",
                CommandType = "SELECT_BUFF",
                Payload = new JObject { ["buffId"] = "invalid-release-path-buff" },
                Tags = new[] { "wrong-phase", "SELECT_BUFF" },
            };
            yield return new InvalidActionCase
            {
                Id = "reject-reroll-draft-pool-idle",
                CommandType = "REROLL_DRAFT_POOL",
                Payload = new JObject(),
                Tags = new[] { "wrong-phase", "REROLL_DRAFT_POOL" },
            };
            yield return new InvalidActionCase
            {
                Id = "reject-take-gems-empty-selection",
                CommandType = "TAKE_GEMS",
                Payload = new JObject { ["coords"] = new JArray() },
                Tags = new[] { "empty-selection", "TAKE_GEMS" },
            };
            yield return new InvalidActionCase
            {
                Id = "reject-buy-card-market-mismatch",
                CommandType = "BUY_CARD",
                Payload = new JObject
                {
                    ["level"] = 1,
                    ["idx"] = 0,
                    ["source"] = "market",
                    ["card"] = BuildFakeCard("invalid-buy-card", 1, "red"),
                },
                Tags = new[] { "market-mismatch", "BUY_CARD" },
            };
            yield return new InvalidActionCase
            {
                Id = "reject-reserve-card-idle",
                CommandType = "RESERVE_CARD",
                Payload = new JObject
                {
                    ["level"] = 1,
                    ["idx"] = 0,
                    ["card"] = BuildFakeCard("invalid-reserve-card", 1, "red"),
                },
                Tags = new[] { "wrong-phase", "RESERVE_CARD" },
            };
            yield return new InvalidActionCase
            {
                Id = "reject-reserve-deck-invalid-level",
                CommandType = "INITIATE_RESERVE_DECK",
                Payload = new JObject { ["level"] = 9 },
                Tags = new[] { "invalid-level", "INITIATE_RESERVE_DECK" },
            };
            yield return new InvalidActionCase
            {
                Id = "reject-joker-color-without-pending-buy",
                CommandType = "BUY_CARD",
                Payload = new JObject
                {
                    ["level"] = 1,
                    ["idx"] = 0,
                    ["source"] = "market",
                    ["bonusColor"] = "red",
                    ["card"] = BuildFakeCard("invalid-joker-card", 1, "gold"),
                },
                Tags = new[] { "wrong-phase", "joker-color", "BUY_CARD" },
            };
            yield return new InvalidActionCase
            {
                Id = "reject-royal-card-idle",
                CommandType = "SELECT_ROYAL_CARD",
                Payload = new JObject { ["card"] = BuildFakeRoyal("invalid-royal-card") },
                Tags = new[] { "wrong-phase", "SELECT_ROYAL_CARD" },
            };
            yield return new InvalidActionCase
            {
                Id = "reject-activate-privilege-without-privilege",
                CommandType = "ACTIVATE_PRIVILEGE",
                Payload = new JObject(),
                Tags = new[] { "no-privilege", "ACTIVATE_PRIVILEGE" },
            };
            yield return new InvalidActionCase
            {
                Id = "reject-steal-gem-idle",
                CommandType = "STEAL_GEM",
                Payload = new JObject { ["gemId"] = "red" },
                Tags = new[] { "wrong-phase", "STEAL_GEM" },
            };
            yield return new InvalidActionCase
            {
                Id = "reject-bonus-gem-idle",
                CommandType = "TAKE_BONUS_GEM",
                Payload = new JObject { ["r"] = 0, ["c"] = 0 },
                Tags = new[] { "wrong-phase", "TAKE_BONUS_GEM" },
            };
            yield return new InvalidActionCase
            {
                Id = "reject-discard-gem-idle",
                CommandType = "DISCARD_GEM",
                Payload = new JObject { ["gemId"] = "red" },
                Tags = new[] { "wrong-phase", "DISCARD_GEM" },
            };
            yield return new InvalidActionCase
            {
                Id = "reject-replay-undo-live-game",
                CommandType = "UNDO",
                Payload = new JObject(),
                Tags = new[] { "live-game", "UNDO" },
            };
            yield return new InvalidActionCase
            {
                Id = "reject-cancel-reserve-idle",
                CommandType = "CANCEL_RESERVE",
                Payload = new JObject(),
                Tags = new[] { "wrong-phase", "CANCEL_RESERVE" },
            };
            yield return new InvalidActionCase
            {
                Id = "reject-close-modal-without-modal",
                CommandType = "CLOSE_MODAL",
                Payload = new JObject(),
                Tags = new[] { "no-modal", "CLOSE_MODAL" },
            };
            yield return new InvalidActionCase
            {
                Id = "reject-inactive-player-take-gems",
                CommandType = "TAKE_GEMS",
                ActorOverride = inactivePlayer,
                Payload = new JObject
                {
                    ["coords"] = new JArray(FindFirstNormalGemCoord(startState)),
                },
                Tags = new[] { "invalid-actor", "TAKE_GEMS" },
            };
        }

        private static JObject BuildFakeCard(string id, int level, string bonusColor)
        {
            return new JObject
            {
                ["id"] = id,
                ["level"] = level,
                ["points"] = 0,
                ["cost"] = new JObject(),
                ["bonusColor"] = bonusColor,
            };
        }

        private static JObject BuildFakeRoyal(string id)
        {
            return new JObject
            {
                ["id"] = id,
                ["points"] = 0,
                ["bonusColor"] = "red",
                ["label"] = "Invalid Royal",
                ["ability"] = "invalid",
            };
        }

        private static JObject RunInvalidCase(
            GemDuelGameController controller,
            InvalidActionCase invalidCase,
            LocalDevInvalidActionReleasePathSmokeOptions options
        )
        {
            var before = controller.BuildAutomationStateSnapshot(options.ViewportWidth, options.ViewportHeight);
            var beforeHash = CurrentStateHash(before);
            var beforeRecordedEvents = RecordedEventCount(before);
            var beforeSummaryHash = LiveSummaryHash(before);
            var accepted = controller.RunLiveRulesCommandForAutomation(
                invalidCase.CommandType,
                invalidCase.Payload,
                invalidCase.ActorOverride,
                out var error
            );
            var after = controller.BuildAutomationStateSnapshot(options.ViewportWidth, options.ViewportHeight);
            var afterHash = CurrentStateHash(after);
            var afterRecordedEvents = RecordedEventCount(after);
            var afterSummaryHash = LiveSummaryHash(after);
            var ok = !accepted
                && beforeHash == afterHash
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
                ["stateHashBefore"] = beforeHash,
                ["stateHashAfter"] = afterHash,
                ["summaryHashBefore"] = beforeSummaryHash,
                ["summaryHashAfter"] = afterSummaryHash,
                ["recordedEventsBefore"] = beforeRecordedEvents,
                ["recordedEventsAfter"] = afterRecordedEvents,
                ["driver"] = controller.LastAutomationDriver,
            };
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

            throw new InvalidOperationException("Invalid-action smoke could not find a normal board gem.");
        }

        private static JObject Fail(
            JObject report,
            string reason,
            GemDuelGameController controller,
            LocalDevInvalidActionReleasePathSmokeOptions options
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
