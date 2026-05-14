using System;
using System.IO;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace GemDuel.Presentation
{
    public sealed class LocalDevReplayReleasePathSmokeOptions
    {
        public string OutputDirectory { get; set; } = string.Empty;
        public int ViewportWidth { get; set; } = 1920;
        public int ViewportHeight { get; set; } = 1080;
    }

    public static class LocalDevReplayReleasePathSmoke
    {
        public static JObject Run(
            GemDuelGameController controller,
            LocalDevReplayReleasePathSmokeOptions options
        )
        {
            options = options ?? new LocalDevReplayReleasePathSmokeOptions();
            var cases = new JArray();
            var report = new JObject
            {
                ["schemaVersion"] = 1,
                ["kind"] = "unity-localdev-replay-release-path-smoke",
                ["startedAt"] = DateTime.UtcNow.ToString("O"),
                ["ok"] = false,
                ["outputDirectory"] = options.OutputDirectory,
                ["cases"] = cases,
            };

            try
            {
                if (string.IsNullOrWhiteSpace(options.OutputDirectory))
                {
                    return Fail(report, "Replay release-path smoke output directory is empty.", controller, options);
                }

                Directory.CreateDirectory(options.OutputDirectory);
                var before = controller.BuildAutomationStateSnapshot(
                    options.ViewportWidth,
                    options.ViewportHeight
                );
                var beforeReplay = (JObject)before["replay"];
                var liveRecording = (JObject)beforeReplay["liveRecording"];
                var beforeHash = beforeReplay.Value<string>("currentStateHash");
                var beforeRecordedEvents = liveRecording.Value<int>("recordedEvents");
                if (beforeRecordedEvents <= 0)
                {
                    return Fail(
                        report,
                        "Replay release-path smoke requires live replay recording before file tests.",
                        controller,
                        options
                    );
                }

                report["baseline"] = new JObject
                {
                    ["stateHash"] = beforeHash,
                    ["recordedEvents"] = beforeRecordedEvents,
                    ["summaryFinalStateHash"] = liveRecording.Value<string>("summaryFinalStateHash"),
                };

                var validPath = Path.Combine(options.OutputDirectory, "release-path-valid.replay.json");
                if (!controller.ExportReplayToPathForAutomation(validPath, out var exportError))
                {
                    return Fail(report, "Valid replay export failed: " + exportError, controller, options);
                }

                var validJson = File.ReadAllText(validPath);
                AddCase(cases, "valid_export", true, validPath, string.Empty);

                var invalidJsonPath = Path.Combine(options.OutputDirectory, "invalid-json.replay.json");
                File.WriteAllText(invalidJsonPath, "{ invalid replay json");
                if (
                    !ExpectRejectedImport(
                        controller,
                        cases,
                        invalidJsonPath,
                        "invalid_json",
                        "Invalid",
                        beforeHash,
                        beforeRecordedEvents,
                        options,
                        out var invalidJsonFailure
                    )
                )
                {
                    return Fail(report, invalidJsonFailure, controller, options);
                }

                var missingPath = Path.Combine(options.OutputDirectory, "missing.replay.json");
                if (File.Exists(missingPath))
                {
                    File.Delete(missingPath);
                }

                if (
                    !ExpectRejectedImport(
                        controller,
                        cases,
                        missingPath,
                        "missing_file",
                        "Could not find",
                        beforeHash,
                        beforeRecordedEvents,
                        options,
                        out var missingFailure
                    )
                )
                {
                    return Fail(report, missingFailure, controller, options);
                }

                var unsupported = JObject.Parse(validJson);
                unsupported["schemaVersion"] = "999.0";
                var unsupportedPath = Path.Combine(options.OutputDirectory, "unsupported-schema.replay.json");
                File.WriteAllText(unsupportedPath, unsupported.ToString(Formatting.Indented));
                if (
                    !ExpectRejectedImport(
                        controller,
                        cases,
                        unsupportedPath,
                        "unsupported_schema",
                        "Unsupported replay schema version",
                        beforeHash,
                        beforeRecordedEvents,
                        options,
                        out var unsupportedFailure
                    )
                )
                {
                    return Fail(report, unsupportedFailure, controller, options);
                }

                var malformedBootstrap = JObject.Parse(validJson);
                malformedBootstrap["init"]["board"] = new JArray(new JArray("red"));
                var malformedBootstrapPath = Path.Combine(
                    options.OutputDirectory,
                    "malformed-bootstrap.replay.json"
                );
                File.WriteAllText(malformedBootstrapPath, malformedBootstrap.ToString(Formatting.Indented));
                if (
                    !ExpectRejectedImport(
                        controller,
                        cases,
                        malformedBootstrapPath,
                        "malformed_bootstrap",
                        "Replay init board must contain 5 rows",
                        beforeHash,
                        beforeRecordedEvents,
                        options,
                        out var malformedBootstrapFailure
                    )
                )
                {
                    return Fail(report, malformedBootstrapFailure, controller, options);
                }

                var malformedDraftBootstrap = JObject.Parse(validJson);
                malformedDraftBootstrap["init"]["actionType"] = "INIT_DRAFT";
                malformedDraftBootstrap["init"]["draftPool"] = new JArray();
                var malformedDraftBootstrapPath = Path.Combine(
                    options.OutputDirectory,
                    "malformed-draft-bootstrap.replay.json"
                );
                File.WriteAllText(
                    malformedDraftBootstrapPath,
                    malformedDraftBootstrap.ToString(Formatting.Indented)
                );
                if (
                    !ExpectRejectedImport(
                        controller,
                        cases,
                        malformedDraftBootstrapPath,
                        "malformed_draft_bootstrap",
                        "Replay init draftPool must not be empty for INIT_DRAFT",
                        beforeHash,
                        beforeRecordedEvents,
                        options,
                        out var malformedDraftBootstrapFailure
                    )
                )
                {
                    return Fail(report, malformedDraftBootstrapFailure, controller, options);
                }

                var corruptedSummary = JObject.Parse(validJson);
                corruptedSummary["summary"]["totalEvents"] = 999;
                var corruptedSummaryPath = Path.Combine(
                    options.OutputDirectory,
                    "corrupted-summary.replay.json"
                );
                File.WriteAllText(corruptedSummaryPath, corruptedSummary.ToString(Formatting.Indented));
                if (
                    !ExpectRejectedImport(
                        controller,
                        cases,
                        corruptedSummaryPath,
                        "corrupted_summary",
                        "Replay summary totalEvents mismatch",
                        beforeHash,
                        beforeRecordedEvents,
                        options,
                        out var corruptedFailure
                    )
                )
                {
                    return Fail(report, corruptedFailure, controller, options);
                }

                var hashMismatch = JObject.Parse(validJson);
                hashMismatch["summary"]["finalStateHash"] = "deadbeef";
                var hashMismatchPath = Path.Combine(options.OutputDirectory, "hash-mismatch.replay.json");
                File.WriteAllText(hashMismatchPath, hashMismatch.ToString(Formatting.Indented));
                if (
                    !ExpectRejectedImport(
                        controller,
                        cases,
                        hashMismatchPath,
                        "hash_mismatch",
                        "Replay summary finalStateHash mismatch",
                        beforeHash,
                        beforeRecordedEvents,
                        options,
                        out var hashFailure
                    )
                )
                {
                    return Fail(report, hashFailure, controller, options);
                }

                File.WriteAllText(validPath, "{ overwritten invalid replay json");
                if (
                    !ExpectRejectedImport(
                        controller,
                        cases,
                        validPath,
                        "failed_overwrite_load",
                        "Invalid",
                        beforeHash,
                        beforeRecordedEvents,
                        options,
                        out var overwriteFailure
                    )
                )
                {
                    return Fail(report, overwriteFailure, controller, options);
                }

                if (!controller.ExportReplayToPathForAutomation(validPath, out var overwriteExportError))
                {
                    return Fail(
                        report,
                        "Valid replay overwrite export failed: " + overwriteExportError,
                        controller,
                        options
                    );
                }

                if (!controller.ImportReplayFromPathForAutomation(validPath, out var reloadError))
                {
                    return Fail(report, "Valid replay reload failed: " + reloadError, controller, options);
                }

                if (!controller.PlayReplayToEndForAutomation(out var reviewError))
                {
                    return Fail(report, "Valid replay review playback failed: " + reviewError, controller, options);
                }

                var reloadedSummary = (JObject)JObject.Parse(File.ReadAllText(validPath))["summary"];
                var reviewed = controller.BuildAutomationStateSnapshot(
                    options.ViewportWidth,
                    options.ViewportHeight
                );
                var reviewedHash = ((JObject)reviewed["replay"]).Value<string>("currentStateHash");
                var expectedHash = reloadedSummary.Value<string>("finalStateHash");
                var reloadOk = reviewedHash == expectedHash;
                cases.Add(
                    new JObject
                    {
                        ["name"] = "valid_overwrite_reload_review",
                        ["ok"] = reloadOk,
                        ["path"] = validPath,
                        ["expectedHash"] = expectedHash,
                        ["reviewedHash"] = reviewedHash,
                    }
                );
                if (!reloadOk)
                {
                    return Fail(
                        report,
                        "Reloaded replay review hash mismatch: " + reviewedHash + " != " + expectedHash,
                        controller,
                        options
                    );
                }

                report["coverage"] = new JArray
                {
                    "invalid_json",
                    "missing_file",
                    "unsupported_schema",
                    "malformed_bootstrap",
                    "malformed_draft_bootstrap",
                    "corrupted_summary",
                    "hash_mismatch",
                    "failed_overwrite_load",
                    "valid_overwrite_reload_review",
                };
                report["reviewedFinalStateHash"] = reviewedHash;
                report["ok"] = true;
                report["completedAt"] = DateTime.UtcNow.ToString("O");
                return report;
            }
            catch (Exception ex)
            {
                return Fail(report, ex.ToString(), controller, options);
            }
        }

        private static bool ExpectRejectedImport(
            GemDuelGameController controller,
            JArray cases,
            string path,
            string name,
            string expectedErrorFragment,
            string expectedHash,
            int expectedRecordedEvents,
            LocalDevReplayReleasePathSmokeOptions options,
            out string failure
        )
        {
            failure = string.Empty;
            if (controller.ImportReplayFromPathForAutomation(path, out var error))
            {
                failure = name + " unexpectedly imported successfully.";
                AddCase(cases, name, false, path, failure);
                return false;
            }

            if (
                !string.IsNullOrEmpty(expectedErrorFragment)
                && (error == null || !error.Contains(expectedErrorFragment))
            )
            {
                failure = name + " error did not contain '" + expectedErrorFragment + "': " + error;
                AddCase(cases, name, false, path, failure);
                return false;
            }

            if (
                !TryReadLiveReplayState(
                    controller,
                    options,
                    out var stateHashAfter,
                    out var recordedEventsAfter,
                    out var stateFailure
                )
            )
            {
                failure = name + " could not read live replay state: " + stateFailure;
                AddCase(cases, name, false, path, failure);
                return false;
            }

            if (stateHashAfter != expectedHash)
            {
                failure =
                    name + " mutated live replay state: state hash " + stateHashAfter + " != " + expectedHash;
                AddRejectedImportCase(
                    cases,
                    name,
                    false,
                    path,
                    error ?? string.Empty,
                    expectedErrorFragment,
                    expectedHash,
                    stateHashAfter,
                    expectedRecordedEvents,
                    recordedEventsAfter
                );
                return false;
            }

            if (recordedEventsAfter != expectedRecordedEvents)
            {
                failure =
                    name
                    + " mutated live replay state: recorded events "
                    + recordedEventsAfter
                    + " != "
                    + expectedRecordedEvents;
                AddRejectedImportCase(
                    cases,
                    name,
                    false,
                    path,
                    error ?? string.Empty,
                    expectedErrorFragment,
                    expectedHash,
                    stateHashAfter,
                    expectedRecordedEvents,
                    recordedEventsAfter
                );
                return false;
            }

            AddRejectedImportCase(
                cases,
                name,
                true,
                path,
                error ?? string.Empty,
                expectedErrorFragment,
                expectedHash,
                stateHashAfter,
                expectedRecordedEvents,
                recordedEventsAfter
            );
            return true;
        }

        private static bool TryReadLiveReplayState(
            GemDuelGameController controller,
            LocalDevReplayReleasePathSmokeOptions options,
            out string stateHash,
            out int recordedEvents,
            out string failure
        )
        {
            stateHash = string.Empty;
            recordedEvents = -1;
            try
            {
                var state = controller.BuildAutomationStateSnapshot(
                    options.ViewportWidth,
                    options.ViewportHeight
                );
                var replay = (JObject)state["replay"];
                stateHash = replay.Value<string>("currentStateHash");
                recordedEvents = ((JObject)replay["liveRecording"]).Value<int>("recordedEvents");

                failure = string.Empty;
                return true;
            }
            catch (Exception ex)
            {
                failure = ex.Message;
                return false;
            }
        }

        private static void AddCase(
            JArray cases,
            string name,
            bool ok,
            string path,
            string detail
        )
        {
            cases.Add(
                new JObject
                {
                    ["name"] = name,
                    ["ok"] = ok,
                    ["path"] = path,
                    ["detail"] = detail,
                }
            );
        }

        private static void AddRejectedImportCase(
            JArray cases,
            string name,
            bool ok,
            string path,
            string detail,
            string expectedErrorFragment,
            string stateHashBefore,
            string stateHashAfter,
            int recordedEventsBefore,
            int recordedEventsAfter
        )
        {
            cases.Add(
                new JObject
                {
                    ["name"] = name,
                    ["ok"] = ok,
                    ["path"] = path,
                    ["detail"] = detail,
                    ["accepted"] = false,
                    ["expectedErrorFragment"] = expectedErrorFragment,
                    ["stateHashBefore"] = stateHashBefore,
                    ["stateHashAfter"] = stateHashAfter,
                    ["recordedEventsBefore"] = recordedEventsBefore,
                    ["recordedEventsAfter"] = recordedEventsAfter,
                    ["liveReplayStateUnchanged"] =
                        stateHashBefore == stateHashAfter
                        && recordedEventsBefore == recordedEventsAfter,
                }
            );
        }

        private static JObject Fail(
            JObject report,
            string reason,
            GemDuelGameController controller,
            LocalDevReplayReleasePathSmokeOptions options
        )
        {
            report["ok"] = false;
            report["failureReason"] = reason;
            report["completedAt"] = DateTime.UtcNow.ToString("O");
            try
            {
                var state = controller.BuildAutomationStateSnapshot(
                    options.ViewportWidth,
                    options.ViewportHeight
                );
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
    }
}
