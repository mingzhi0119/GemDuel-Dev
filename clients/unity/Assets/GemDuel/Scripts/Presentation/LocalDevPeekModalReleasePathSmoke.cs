using System;
using System.Linq;
using Newtonsoft.Json.Linq;
using UnityEngine;

namespace GemDuel.Presentation
{
    public sealed class LocalDevPeekModalReleasePathSmokeOptions
    {
        public string Seed { get; set; } = "unity-peek-modal-seed-17";
        public int ViewportWidth { get; set; } = 1920;
        public int ViewportHeight { get; set; } = 1080;
    }

    public static class LocalDevPeekModalReleasePathSmoke
    {
        private const string RequiredPeekBuffId = "intelligence";

        public static JObject Run(
            GemDuelGameController controller,
            LocalDevPeekModalReleasePathSmokeOptions options
        )
        {
            options = options ?? new LocalDevPeekModalReleasePathSmokeOptions();
            var report = new JObject
            {
                ["schemaVersion"] = 1,
                ["kind"] = "unity-localdev-peek-modal-release-path-smoke",
                ["startedAt"] = DateTime.UtcNow.ToString("O"),
                ["seed"] = options.Seed,
                ["requiredBuffId"] = RequiredPeekBuffId,
                ["ok"] = false,
                ["freshLaunch"] = true,
                ["usedFixtureReplayAsGameplayDriver"] = false,
                ["usedCheckpointStateReplacement"] = false,
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

                if (!HasVisibleBuff(afterStart, RequiredPeekBuffId))
                {
                    return Fail(
                        report,
                        "Initial draft pool did not expose required peek buff " + RequiredPeekBuffId + ".",
                        controller,
                        options
                    );
                }

                if (
                    !controller.RunSemanticActionForAutomation(
                        "choose_boon",
                        new JObject { ["buffId"] = RequiredPeekBuffId },
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
                var p2BuffId = FirstVisibleBuffId(afterP1Buff);
                if (string.IsNullOrEmpty(p2BuffId))
                {
                    return Fail(report, "No P2 draft buff target was visible after P1 selected intelligence.", controller, options);
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
                if (afterDraft.Value<string>("phase") != "IDLE")
                {
                    return Fail(report, "Draft did not resolve to IDLE before peek path.", controller, options);
                }

                if (!HasVisibleTarget(afterDraft, "buff.peek"))
                {
                    return Fail(report, "Peek-deck visible control was not exposed after selecting intelligence.", controller, options);
                }

                if (!controller.RunSemanticActionForAutomation("peek_deck", null, out var peekError))
                {
                    return Fail(report, "peek_deck failed: " + peekError, controller, options);
                }

                var afterPeek = controller.BuildAutomationStateSnapshot(
                    options.ViewportWidth,
                    options.ViewportHeight
                );
                if (
                    !HasVisibleTarget(afterPeek, "modal.peek", false)
                    || !HasVisibleTarget(afterPeek, "modal.peek.close")
                )
                {
                    return Fail(report, "Peek modal and close control were not visible after peek_deck.", controller, options);
                }

                var peekCardCount = ActivePeekCardCount(afterPeek);
                if (peekCardCount != 9)
                {
                    return Fail(report, "Peek modal state did not expose all 9 top cards: " + peekCardCount + ".", controller, options);
                }

                var visiblePeekCards = CountVisibleTargetsWithPrefix(afterPeek, "modal.peek.card.");
                if (visiblePeekCards != peekCardCount)
                {
                    return Fail(
                        report,
                        "Peek modal did not render every peek card target: "
                            + visiblePeekCards
                            + " != "
                            + peekCardCount
                            + ".",
                        controller,
                        options
                    );
                }

                foreach (var level in new[] { 3, 2, 1 })
                {
                    if (!HasVisibleTarget(afterPeek, "modal.peek.level." + level, false))
                    {
                        return Fail(report, "Peek modal did not render deck row L" + level + ".", controller, options);
                    }
                }

                if (!controller.RunSemanticActionForAutomation("close_modal", null, out var closeError))
                {
                    return Fail(report, "close_modal failed: " + closeError, controller, options);
                }

                var afterClose = controller.BuildAutomationStateSnapshot(
                    options.ViewportWidth,
                    options.ViewportHeight
                );
                if (
                    HasVisibleTarget(afterClose, "modal.peek", false)
                    || HasVisibleTarget(afterClose, "modal.peek.close")
                )
                {
                    return Fail(report, "Peek modal remained visible after close_modal.", controller, options);
                }

                if (!controller.ExportReplayJsonForAutomation(out var exportedJson, out var exportError))
                {
                    return Fail(report, "Replay export failed after peek modal path: " + exportError, controller, options);
                }

                var exported = JObject.Parse(exportedJson);
                var events = (JArray)exported["events"];
                var eventTypes = new JArray(events.Select(item => item.Value<string>("type")));
                if (!ContainsEvent(events, "select_buff", RequiredPeekBuffId))
                {
                    return Fail(report, "Exported replay did not contain P1 select_buff for intelligence.", controller, options);
                }

                if (!eventTypes.Values<string>().Contains("peek_deck"))
                {
                    return Fail(report, "Exported replay did not contain peek_deck.", controller, options);
                }

                if (!eventTypes.Values<string>().Contains("close_modal"))
                {
                    return Fail(report, "Exported replay did not contain close_modal.", controller, options);
                }

                var finalHash = CurrentStateHash(afterClose);
                var exportedHash = ((JObject)exported["summary"]).Value<string>("finalStateHash");
                if (exportedHash != finalHash)
                {
                    return Fail(
                        report,
                        "Exported replay final hash mismatch after peek modal path: "
                            + exportedHash
                            + " != "
                            + finalHash,
                        controller,
                        options
                    );
                }

                reviewRoot = new GameObject("GemDuel Peek Modal Release Path Replay Review");
                var review = reviewRoot.AddComponent<GemDuelGameController>();
                if (!review.ImportReplayJsonForAutomation(exportedJson, out var importError))
                {
                    return Fail(report, "Replay review import failed after peek modal path: " + importError, controller, options);
                }

                if (!review.PlayReplayToEndForAutomation(out var reviewError))
                {
                    return Fail(report, "Replay review playback failed after peek modal path: " + reviewError, controller, options);
                }

                var reviewed = review.BuildAutomationStateSnapshot(options.ViewportWidth, options.ViewportHeight);
                var reviewedHash = CurrentStateHash(reviewed);
                if (reviewedHash != exportedHash)
                {
                    return Fail(
                        report,
                        "Replay review hash mismatch after peek modal path: "
                            + reviewedHash
                            + " != "
                            + exportedHash,
                        controller,
                        options
                    );
                }

                report["draftStartStateSummary"] = BuildStateSummary(afterStart);
                report["afterP1BuffStateSummary"] = BuildStateSummary(afterP1Buff);
                report["afterDraftStateSummary"] = BuildStateSummary(afterDraft);
                report["afterPeekStateSummary"] = BuildStateSummary(afterPeek);
                report["afterCloseStateSummary"] = BuildStateSummary(afterClose);
                report["peekModalSummary"] = new JObject
                {
                    ["p1BuffId"] = RequiredPeekBuffId,
                    ["p2BuffId"] = p2BuffId,
                    ["peekControlVisibleBefore"] = true,
                    ["modalVisibleAfterPeek"] = true,
                    ["closeControlVisibleAfterPeek"] = true,
                    ["peekCardCount"] = peekCardCount,
                    ["visiblePeekCardTargets"] = visiblePeekCards,
                    ["levelRowsVisible"] = new JArray(3, 2, 1),
                    ["modalVisibleAfterClose"] = false,
                    ["recordedEvents"] = RecordedEventCount(afterClose),
                    ["eventTypes"] = eventTypes,
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

        private static bool ContainsEvent(JArray events, string eventType, string buffId = null)
        {
            return events
                .OfType<JObject>()
                .Any(item =>
                    item.Value<string>("type") == eventType
                    && (buffId == null || item.Value<string>("buffId") == buffId)
                );
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

        private static int CountVisibleTargetsWithPrefix(JObject automationState, string semanticKeyPrefix)
        {
            return VisibleTargets(automationState)
                .Count(target =>
                {
                    var semanticKey = target.Value<string>("semanticKey") ?? string.Empty;
                    return semanticKey.StartsWith(semanticKeyPrefix, StringComparison.Ordinal);
                });
        }

        private static int ActivePeekCardCount(JObject automationState)
        {
            var snapshot = automationState["snapshot"] as JObject;
            var activeModal = snapshot?["activeModal"] as JObject;
            var data = activeModal?["data"] as JObject;
            var cards = data?["cards"] as JArray;
            return cards == null ? 0 : cards.Count;
        }

        private static System.Collections.Generic.IEnumerable<JObject> VisibleTargets(JObject automationState)
        {
            var targets = automationState["visibleTargets"] as JArray;
            return targets == null ? Enumerable.Empty<JObject>() : targets.OfType<JObject>();
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
            LocalDevPeekModalReleasePathSmokeOptions options
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
