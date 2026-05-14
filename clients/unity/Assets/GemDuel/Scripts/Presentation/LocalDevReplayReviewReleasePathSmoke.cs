using System;
using System.IO;
using GemDuel.Catalog;
using Newtonsoft.Json.Linq;
using UnityEngine;

namespace GemDuel.Presentation
{
    public sealed class LocalDevReplayReviewReleasePathSmokeOptions
    {
        public string Seed { get; set; } = "unity-built-player-replay-review-release-path";
        public int MaxSteps { get; set; } = 4;
        public int ViewportWidth { get; set; } = 1920;
        public int ViewportHeight { get; set; } = 1080;
        public string IdleActionPreference { get; set; } = "balanced";
        public string OutputDirectory { get; set; } = string.Empty;
    }

    public static class LocalDevReplayReviewReleasePathSmoke
    {
        public static JObject Run(
            GemDuelGameController controller,
            LocalDevReplayReviewReleasePathSmokeOptions options
        )
        {
            options = options ?? new LocalDevReplayReviewReleasePathSmokeOptions();
            var outputDirectory = string.IsNullOrWhiteSpace(options.OutputDirectory)
                ? RepositoryPaths.ResolveFromRoot("artifacts", "unity", "replay-review-release-path")
                : options.OutputDirectory;
            var report = new JObject
            {
                ["schemaVersion"] = 1,
                ["kind"] = "unity-localdev-replay-review-release-path-smoke",
                ["startedAt"] = DateTime.UtcNow.ToString("O"),
                ["seed"] = options.Seed,
                ["maxSteps"] = options.MaxSteps,
                ["idleActionPreference"] = options.IdleActionPreference,
                ["outputDirectory"] = outputDirectory,
                ["ok"] = false,
                ["freshLaunch"] = true,
                ["usedFixtureReplayAsGameplayDriver"] = false,
                ["usedCheckpointStateReplacement"] = false,
            };

            GameObject reviewRoot = null;
            try
            {
                Directory.CreateDirectory(outputDirectory);
                var product = LocalDevProductSurfaceSmoke.Run(
                    controller,
                    new LocalDevProductSurfaceSmokeOptions
                    {
                        Seed = options.Seed,
                        MaxSteps = Math.Max(2, options.MaxSteps),
                        ViewportWidth = options.ViewportWidth,
                        ViewportHeight = options.ViewportHeight,
                        VerifyReplayReview = false,
                        IdleActionPreference = options.IdleActionPreference,
                    }
                );
                report["sourceSmoke"] = product;
                report["usedFixtureReplayAsGameplayDriver"] =
                    product.Value<bool>("usedFixtureReplayAsGameplayDriver");
                report["usedCheckpointStateReplacement"] =
                    product.Value<bool>("usedCheckpointStateReplacement");
                if (!product.Value<bool>("ok"))
                {
                    return Fail(
                        report,
                        "Source product-surface smoke failed: " + product.Value<string>("failureReason"),
                        controller,
                        options
                    );
                }

                var actionCount = ((JArray)product["actions"]).Count;
                if (actionCount < 2)
                {
                    return Fail(
                        report,
                        "Replay review navigation requires at least two live product actions; got " + actionCount + ".",
                        controller,
                        options
                    );
                }

                var sourceBeforeReview = controller.BuildAutomationStateSnapshot(
                    options.ViewportWidth,
                    options.ViewportHeight
                );
                var sourceHashBeforeReview = CurrentStateHash(sourceBeforeReview);
                var sourceRecordedEventsBeforeReview = RecordedEventCount(sourceBeforeReview);
                var replayPath = Path.Combine(outputDirectory, "replay-review-release-path.replay.json");
                if (!controller.ExportReplayToPathForAutomation(replayPath, out var exportError))
                {
                    return Fail(report, "Replay export to release path failed: " + exportError, controller, options);
                }

                var exported = JObject.Parse(File.ReadAllText(replayPath));
                var exportedSummary = (JObject)exported["summary"];
                var exportedEvents = ((JArray)exported["events"]).Count;
                var expectedFinalHash = exportedSummary.Value<string>("finalStateHash");
                if (exportedEvents < 2)
                {
                    return Fail(report, "Exported replay has fewer than two events: " + exportedEvents + ".", controller, options);
                }

                reviewRoot = new GameObject("GemDuel Replay Review Release Path Smoke Review");
                var review = reviewRoot.AddComponent<GemDuelGameController>();
                review.SetAutomationViewport(options.ViewportWidth, options.ViewportHeight);
                if (!review.ImportReplayFromPathForAutomation(replayPath, out var importError))
                {
                    return Fail(report, "Replay import from release path failed: " + importError, controller, options);
                }

                var imported = review.BuildAutomationStateSnapshot(
                    options.ViewportWidth,
                    options.ViewportHeight
                );
                if (!HasClickableTarget(imported, "replay.control.redo"))
                {
                    return Fail(report, "Imported replay did not expose a clickable redo review control.", controller, options);
                }

                if (
                    !ClickReplayControl(
                        review,
                        "redo",
                        options,
                        out var firstForward,
                        out var firstForwardError
                    )
                )
                {
                    return Fail(report, "First replay redo failed: " + firstForwardError, controller, options);
                }

                if (
                    !ClickReplayControl(
                        review,
                        "redo",
                        options,
                        out var secondForward,
                        out var secondForwardError
                    )
                )
                {
                    return Fail(report, "Second replay redo failed: " + secondForwardError, controller, options);
                }

                if (
                    !ClickReplayControl(
                        review,
                        "undo",
                        options,
                        out var backToFirst,
                        out var undoError
                    )
                )
                {
                    return Fail(report, "Replay undo failed: " + undoError, controller, options);
                }

                if (ReplayRevision(backToFirst) != ReplayRevision(firstForward))
                {
                    return Fail(report, "Replay undo did not return to revision 1.", controller, options);
                }

                if (CurrentStateHash(backToFirst) != CurrentStateHash(firstForward))
                {
                    return Fail(report, "Replay undo did not restore the revision 1 state hash.", controller, options);
                }

                var reviewCursor = backToFirst;
                while (ReplayRevision(reviewCursor) < exportedEvents)
                {
                    if (
                        !ClickReplayControl(
                            review,
                            "redo",
                            options,
                            out reviewCursor,
                            out var redoError
                        )
                    )
                    {
                        return Fail(report, "Replay redo to final failed: " + redoError, controller, options);
                    }
                }

                var finalReview = reviewCursor;
                if (CurrentStateHash(finalReview) != expectedFinalHash)
                {
                    return Fail(
                        report,
                        "Replay review final hash mismatch: "
                            + CurrentStateHash(finalReview)
                            + " != "
                            + expectedFinalHash
                            + ".",
                        controller,
                        options
                    );
                }

                if (
                    !ClickReplayControl(
                        review,
                        "undo",
                        options,
                        out var beforeReturnedFinal,
                        out var finalUndoError
                    )
                )
                {
                    return Fail(report, "Replay undo from final failed: " + finalUndoError, controller, options);
                }

                if (
                    !ClickReplayControl(
                        review,
                        "redo",
                        options,
                        out var returnedFinal,
                        out var returnedFinalError
                    )
                )
                {
                    return Fail(report, "Replay redo back to final failed: " + returnedFinalError, controller, options);
                }

                if (CurrentStateHash(returnedFinal) != CurrentStateHash(finalReview))
                {
                    return Fail(report, "Replay redo back to final did not preserve the final hash.", controller, options);
                }

                var sourceAfterReview = controller.BuildAutomationStateSnapshot(
                    options.ViewportWidth,
                    options.ViewportHeight
                );
                var sourceHashAfterReview = CurrentStateHash(sourceAfterReview);
                var sourceRecordedEventsAfterReview = RecordedEventCount(sourceAfterReview);
                if (sourceHashAfterReview != sourceHashBeforeReview)
                {
                    return Fail(report, "Replay review navigation mutated the source live gameplay hash.", controller, options);
                }

                if (sourceRecordedEventsAfterReview != sourceRecordedEventsBeforeReview)
                {
                    return Fail(report, "Replay review navigation mutated the source live replay stream.", controller, options);
                }

                report["sourceStateSummary"] = BuildStateSummary(sourceBeforeReview);
                report["sourceStateAfterReviewSummary"] = BuildStateSummary(sourceAfterReview);
                report["importedReviewStateSummary"] = BuildReviewSummary(imported);
                report["firstForwardReviewStateSummary"] = BuildReviewSummary(firstForward);
                report["secondForwardReviewStateSummary"] = BuildReviewSummary(secondForward);
                report["backToFirstReviewStateSummary"] = BuildReviewSummary(backToFirst);
                report["finalReviewStateSummary"] = BuildReviewSummary(finalReview);
                report["beforeReturnedFinalReviewStateSummary"] = BuildReviewSummary(beforeReturnedFinal);
                report["returnedFinalReviewStateSummary"] = BuildReviewSummary(returnedFinal);
                report["reviewNavigationSummary"] = new JObject
                {
                    ["path"] = replayPath,
                    ["exportedEvents"] = exportedEvents,
                    ["exportedSummaryFinalStateHash"] = expectedFinalHash,
                    ["importedRevision"] = ReplayRevision(imported),
                    ["firstForwardRevision"] = ReplayRevision(firstForward),
                    ["secondForwardRevision"] = ReplayRevision(secondForward),
                    ["backToFirstRevision"] = ReplayRevision(backToFirst),
                    ["finalRevision"] = ReplayRevision(finalReview),
                    ["beforeReturnedFinalRevision"] = ReplayRevision(beforeReturnedFinal),
                    ["returnedFinalRevision"] = ReplayRevision(returnedFinal),
                    ["importedHash"] = CurrentStateHash(imported),
                    ["firstForwardHash"] = CurrentStateHash(firstForward),
                    ["secondForwardHash"] = CurrentStateHash(secondForward),
                    ["backToFirstHash"] = CurrentStateHash(backToFirst),
                    ["finalReviewHash"] = CurrentStateHash(finalReview),
                    ["beforeReturnedFinalHash"] = CurrentStateHash(beforeReturnedFinal),
                    ["returnedFinalHash"] = CurrentStateHash(returnedFinal),
                    ["sourceHashBeforeReview"] = sourceHashBeforeReview,
                    ["sourceHashAfterReview"] = sourceHashAfterReview,
                    ["sourceRecordedEventsBeforeReview"] = sourceRecordedEventsBeforeReview,
                    ["sourceRecordedEventsAfterReview"] = sourceRecordedEventsAfterReview,
                    ["usedVisibleRedoControl"] = true,
                    ["usedVisibleUndoControl"] = true,
                    ["sourceLiveStateUnchanged"] = true,
                    ["sourceLiveReplayStreamUnchanged"] = true,
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

        private static bool ClickReplayControl(
            GemDuelGameController controller,
            string action,
            LocalDevReplayReviewReleasePathSmokeOptions options,
            out JObject after,
            out string error
        )
        {
            after = null;
            error = string.Empty;
            var before = controller.BuildAutomationStateSnapshot(
                options.ViewportWidth,
                options.ViewportHeight
            );
            var target = FindClickableTarget(before, "replay.control." + action);
            if (target == null)
            {
                error = "No clickable replay." + action + " target.";
                return false;
            }

            var rect = target["rect"] as JObject;
            if (rect == null)
            {
                error = "Replay " + action + " target has no viewport rect.";
                return false;
            }

            var x = rect.Value<float>("x") + rect.Value<float>("width") / 2f;
            var y = rect.Value<float>("y") + rect.Value<float>("height") / 2f;
            if (!controller.ClickViewportPointForAutomation(x, y, options.ViewportWidth, options.ViewportHeight, out error))
            {
                return false;
            }

            after = controller.BuildAutomationStateSnapshot(options.ViewportWidth, options.ViewportHeight);
            return true;
        }

        private static bool HasClickableTarget(JObject automationState, string semanticKey)
        {
            return FindClickableTarget(automationState, semanticKey) != null;
        }

        private static JObject FindClickableTarget(JObject automationState, string semanticKey)
        {
            var targets = automationState["visibleTargets"] as JArray;
            if (targets == null)
            {
                return null;
            }

            foreach (var target in targets)
            {
                var item = target as JObject;
                if (
                    item != null
                    && item.Value<string>("semanticKey") == semanticKey
                    && item.Value<bool>("clickable")
                )
                {
                    return item;
                }
            }

            return null;
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

        private static JObject BuildReviewSummary(JObject automationState)
        {
            return new JObject
            {
                ["phase"] = automationState.Value<string>("phase"),
                ["turn"] = automationState.Value<string>("turn"),
                ["winner"] = automationState.Value<string>("winner"),
                ["revision"] = ReplayRevision(automationState),
                ["totalEvents"] = ((JObject)automationState["replay"]).Value<int>("totalEvents"),
                ["stateHash"] = CurrentStateHash(automationState),
                ["canUndo"] = ((JObject)automationState["replay"]).Value<bool>("canUndo"),
                ["canRedo"] = ((JObject)automationState["replay"]).Value<bool>("canRedo"),
            };
        }

        private static int ReplayRevision(JObject automationState)
        {
            return ((JObject)automationState["replay"]).Value<int>("revision");
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

        private static JObject BuildFailureState(
            GemDuelGameController controller,
            LocalDevReplayReviewReleasePathSmokeOptions options
        )
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
            LocalDevReplayReviewReleasePathSmokeOptions options
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
    }
}
