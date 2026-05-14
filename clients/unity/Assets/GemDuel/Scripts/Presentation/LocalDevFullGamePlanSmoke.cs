using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using GemDuel.Replay;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using UnityEngine;

namespace GemDuel.Presentation
{
    public sealed class LocalDevFullGamePlanSmokeOptions
    {
        public string PlanPath { get; set; } = string.Empty;
        public string PlanDirectory { get; set; } = string.Empty;
        public int Limit { get; set; } = 100;
        public int ViewportWidth { get; set; } = 1920;
        public int ViewportHeight { get; set; } = 1080;
        public bool StopOnFirstFailure { get; set; } = true;
    }

    public static class LocalDevFullGamePlanSmoke
    {
        public static JObject RunBatch(
            GemDuelGameController controller,
            LocalDevFullGamePlanSmokeOptions options
        )
        {
            options = options ?? new LocalDevFullGamePlanSmokeOptions();
            var planPaths = ResolvePlanPaths(options);
            var matches = new JArray();
            var allDurations = new List<long>();
            var coveredFamilies = new HashSet<string>(StringComparer.Ordinal);
            var coveredPhaseEdges = new HashSet<string>(StringComparer.Ordinal);
            var startedAt = DateTime.UtcNow.ToString("O");
            var report = new JObject
            {
                ["schemaVersion"] = 1,
                ["kind"] = "unity-localdev-full-game-plan-suite",
                ["startedAt"] = startedAt,
                ["ok"] = false,
                ["verdict"] = "Blocked",
                ["requestedMatches"] = Math.Max(1, options.Limit),
                ["plannedMatches"] = planPaths.Count,
                ["executedMatches"] = 0,
                ["passed"] = 0,
                ["failed"] = 0,
                ["scope"] = new JObject
                {
                    ["included"] = new JArray("Local PVP"),
                    ["exempt"] = new JArray("LAN", "Online", "Visual Lab"),
                },
                ["controls"] = new JObject
                {
                    ["driver"] = "built Windows Unity Player",
                    ["rulesEngine"] = "TypeScript IGameRulesEngine bridge",
                    ["uiDriver"] = "GemDuelGameController semantic target hit testing",
                    ["stopOnFirstFailure"] = options.StopOnFirstFailure,
                },
                ["matches"] = matches,
            };

            if (planPaths.Count == 0)
            {
                return FailSuite(report, "No Local PVP full-game plan files were found.");
            }

            for (var index = 0; index < planPaths.Count; index += 1)
            {
                var path = planPaths[index];
                JObject match;
                try
                {
                    var plan = JObject.Parse(File.ReadAllText(path));
                    match = RunOnePlan(controller, plan, path, index, options, allDurations);
                }
                catch (Exception ex)
                {
                    match = new JObject
                    {
                        ["ok"] = false,
                        ["matchIndex"] = index,
                        ["planPath"] = path,
                        ["failureReason"] = ex.ToString(),
                    };
                }

                matches.Add(match);
                report["executedMatches"] = matches.Count;
                if (match.Value<bool>("ok"))
                {
                    report["passed"] = report.Value<int>("passed") + 1;
                }
                else
                {
                    report["failed"] = report.Value<int>("failed") + 1;
                }

                foreach (var family in match["coveredActionFamilies"]?.Values<string>() ?? Enumerable.Empty<string>())
                {
                    coveredFamilies.Add(family);
                }

                foreach (var edge in match["coveredPhaseEdges"]?.Values<string>() ?? Enumerable.Empty<string>())
                {
                    coveredPhaseEdges.Add(edge);
                }

                if (!match.Value<bool>("ok") && options.StopOnFirstFailure)
                {
                    break;
                }
            }

            var allPassed = report.Value<int>("passed") == planPaths.Count && report.Value<int>("failed") == 0;
            report["ok"] = allPassed;
            report["verdict"] = allPassed ? "Complete" : "Incomplete";
            report["completedAt"] = DateTime.UtcNow.ToString("O");
            report["coveredActionFamilies"] = new JArray(coveredFamilies.OrderBy(value => value));
            report["coveredPhaseEdges"] = new JArray(coveredPhaseEdges.OrderBy(value => value));
            report["performanceSummary"] = BuildPerformanceSummary(allDurations);
            report["suiteTraceHash"] = Sha256(
                JsonConvert.SerializeObject(
                    matches
                        .OfType<JObject>()
                        .Select(match => new
                        {
                            matchIndex = match.Value<int>("matchIndex"),
                            ok = match.Value<bool>("ok"),
                            finalHash = match["finalChecks"]?["finalStateHash"]?["actual"]?.Value<string>(),
                            replayHash = match["replayReview"]?["reviewedFinalStateHash"]?.Value<string>(),
                        })
                )
            );

            if (!allPassed)
            {
                var firstFailure = matches
                    .OfType<JObject>()
                    .FirstOrDefault(match => !match.Value<bool>("ok"));
                report["firstFailure"] = firstFailure?.DeepClone() ?? JValue.CreateNull();
            }

            return report;
        }

        private static JObject RunOnePlan(
            GemDuelGameController controller,
            JObject plan,
            string planPath,
            int matchIndex,
            LocalDevFullGamePlanSmokeOptions options,
            List<long> allDurations
        )
        {
            var uiSteps = plan["uiSteps"] as JArray ?? new JArray();
            var logicalActions = plan["logicalActions"] as JArray ?? new JArray();
            var records = new JArray();
            var failures = new JArray();
            var coveredFamilies = new HashSet<string>(StringComparer.Ordinal);
            var coveredPhaseEdges = new HashSet<string>(StringComparer.Ordinal);
            var planSeed = plan["oracle"]?.Value<string>("seed") ?? string.Empty;
            var report = new JObject
            {
                ["schemaVersion"] = 1,
                ["kind"] = "unity-localdev-full-game-plan-match",
                ["matchIndex"] = matchIndex,
                ["planPath"] = planPath,
                ["seed"] = planSeed,
                ["uiSteps"] = uiSteps.Count,
                ["executedUiSteps"] = 0,
                ["ok"] = false,
                ["records"] = records,
                ["failures"] = failures,
            };

            controller.SetAutomationViewport(options.ViewportWidth, options.ViewportHeight);
            controller.LoadMainMenuForAutomation();

            for (var index = 0; index < uiSteps.Count; index += 1)
            {
                var step = uiSteps[index] as JObject;
                if (step == null)
                {
                    failures.Add(new JObject { ["stepIndex"] = index, ["reason"] = "Invalid plan step." });
                    break;
                }

                var record = ExecuteStep(
                    controller,
                    step,
                    logicalActions,
                    planSeed,
                    options.ViewportWidth,
                    options.ViewportHeight
                );
                records.Add(record);
                allDurations.Add(record.Value<long>("durationMs"));
                report["executedUiSteps"] = records.Count;

                if (record.Value<bool>("covered"))
                {
                    var family = record.Value<string>("actionFamily");
                    if (!string.IsNullOrEmpty(family))
                    {
                        coveredFamilies.Add(family);
                    }

                    var edge = record.Value<string>("phaseEdge");
                    if (!string.IsNullOrEmpty(edge))
                    {
                        coveredPhaseEdges.Add(edge);
                    }
                }

                if (!record.Value<bool>("ok"))
                {
                    failures.Add(record.DeepClone());
                    break;
                }
            }

            var final = controller.BuildAutomationStateSnapshot(options.ViewportWidth, options.ViewportHeight);
            var finalReplay = final["replay"] as JObject ?? new JObject();
            report["finalState"] = BuildStateSummary(final);
            report["coveredActionFamilies"] = new JArray(coveredFamilies.OrderBy(value => value));
            report["coveredPhaseEdges"] = new JArray(coveredPhaseEdges.OrderBy(value => value));
            report["finalChecks"] = BuildFinalChecks(plan, final);

            if (failures.Count == 0)
            {
                var finalMismatches = FindFailedChecks(report["finalChecks"] as JObject);
                foreach (var mismatch in finalMismatches)
                {
                    failures.Add(mismatch);
                }
            }

            if (failures.Count == 0)
            {
                if (!controller.ExportReplayJsonForAutomation(out var exportedJson, out var exportError))
                {
                    failures.Add(
                        new JObject
                        {
                            ["reason"] = "Replay export failed.",
                            ["failureReason"] = exportError,
                        }
                    );
                }
                else
                {
                    report["replayExport"] = BuildReplayExportSummary(exportedJson, finalReplay);
                    report["replayReview"] = ReviewExportedReplay(
                        exportedJson,
                        plan,
                        options.ViewportWidth,
                        options.ViewportHeight
                    );
                    if (report["replayReview"]?.Value<bool>("ok") != true)
                    {
                        failures.Add(report["replayReview"].DeepClone());
                    }
                }
            }

            var ok = failures.Count == 0 && records.Count == uiSteps.Count;
            report["ok"] = ok;
            report["verdict"] = ok ? "Complete" : "Incomplete";
            var firstFailure = failures.FirstOrDefault() as JObject;
            report["failureReason"] = ok
                ? JValue.CreateNull()
                : firstFailure?["failureReason"]?.DeepClone()
                    ?? firstFailure?["reason"]?.DeepClone()
                    ?? JToken.FromObject("Unknown full-game plan failure.");
            report["completedAt"] = DateTime.UtcNow.ToString("O");
            return report;
        }

        private static JObject ExecuteStep(
            GemDuelGameController controller,
            JObject step,
            JArray logicalActions,
            string planSeed,
            int viewportWidth,
            int viewportHeight
        )
        {
            var before = controller.BuildAutomationStateSnapshot(viewportWidth, viewportHeight);
            var semanticKey = step.Value<string>("semanticKey") ?? string.Empty;
            var target = FindSemanticTarget(before, semanticKey);
            var expectedTargetVisible = step.Value<string>("action") != "start_local_game"
                || !string.IsNullOrEmpty(semanticKey);
            var targetVisible = target != null;
            var action = step.Value<string>("action") ?? string.Empty;
            var actionFamily = step.Value<string>("actionType") ?? string.Empty;
            var logicalActionIndex = step.Value<int?>("logicalActionIndex") ?? -1;
            var logical = logicalActionIndex >= 0 && logicalActionIndex < logicalActions.Count
                ? logicalActions[logicalActionIndex] as JObject
                : null;
            var actor = step.Value<string>("actor") ?? logical?.Value<string>("actorBefore") ?? string.Empty;
            var payload = step["payload"] is JObject stepPayload ? (JObject)stepPayload.DeepClone() : new JObject();
            if (action == "start_local_game" && !string.IsNullOrEmpty(planSeed))
            {
                payload["seed"] = planSeed;
            }

            var stopwatch = Stopwatch.StartNew();
            var legal = controller.RunSemanticActionForAutomation(action, payload, out var error);
            stopwatch.Stop();

            var after = controller.BuildAutomationStateSnapshot(viewportWidth, viewportHeight);
            var record = new JObject
            {
                ["id"] = step.Value<string>("id") ?? string.Empty,
                ["logicalActionIndex"] = logicalActionIndex,
                ["action"] = action,
                ["actionFamily"] = actionFamily,
                ["actor"] = actor,
                ["semanticKey"] = semanticKey,
                ["intent"] = step.Value<string>("intent") ?? string.Empty,
                ["durationMs"] = stopwatch.ElapsedMilliseconds,
                ["visibleStateBefore"] = BuildVisibleState(before),
                ["visibleStateAfter"] = BuildVisibleState(after),
                ["targetGeometry"] = target == null ? JValue.CreateNull() : BuildTargetGeometry(target, viewportWidth, viewportHeight),
                ["input"] = BuildInput(target, action, viewportWidth, viewportHeight),
                ["phase"] = new JObject
                {
                    ["before"] = before.Value<string>("phase"),
                    ["after"] = after.Value<string>("phase"),
                },
                ["turn"] = new JObject
                {
                    ["before"] = before.Value<string>("turn"),
                    ["after"] = after.Value<string>("turn"),
                },
                ["winner"] = new JObject
                {
                    ["before"] = before.Value<string>("winner"),
                    ["after"] = after.Value<string>("winner"),
                },
                ["stateHashBefore"] = CurrentStateHash(before),
                ["stateHashAfter"] = CurrentStateHash(after),
                ["replayEventCountBefore"] = RecordedEventCount(before),
                ["replayEventCountAfter"] = RecordedEventCount(after),
                ["replayHashBefore"] = ReplayHash(before),
                ["replayHashAfter"] = ReplayHash(after),
                ["legality"] = new JObject
                {
                    ["expectedLegal"] = true,
                    ["actualLegal"] = legal,
                },
                ["failureReason"] = legal ? JValue.CreateNull() : error,
                ["expected"] = new JObject
                {
                    ["phaseAfter"] = step.Value<string>("expectedPhaseAfter"),
                    ["turnAfter"] = step.Value<string>("expectedTurnAfter"),
                    ["winnerAfter"] = step["expectedWinnerAfter"]?.DeepClone() ?? JValue.CreateNull(),
                    ["stateHashAfter"] = step.Value<string>("expectedStateHashAfter"),
                    ["replayEventCountAfter"] = step.Value<int?>("expectedReplayRevisionAfter"),
                    ["commitsReplayEvent"] = step.Value<bool>("commitsReplayEvent"),
                },
            };

            if (!targetVisible && expectedTargetVisible)
            {
                record["ok"] = false;
                record["failureReason"] = "No visible Unity target for semantic key " + semanticKey + ".";
                record["mismatches"] = new JArray(
                    new JObject
                    {
                        ["field"] = "targetGeometry",
                        ["actual"] = JValue.CreateNull(),
                        ["expected"] = semanticKey,
                    }
                );
                return record;
            }

            var mismatches = BuildStepMismatches(step, before, after, legal);
            record["mismatches"] = mismatches;
            record["ok"] = legal && mismatches.Count == 0;
            record["covered"] =
                record.Value<bool>("ok")
                && (step.Value<bool>("commitsReplayEvent") || action == "start_local_game");
            record["phaseEdge"] = record.Value<bool>("covered")
                ? before.Value<string>("phase") + " -> " + after.Value<string>("phase")
                : string.Empty;
            return record;
        }

        private static JArray BuildStepMismatches(JObject step, JObject before, JObject after, bool legal)
        {
            var mismatches = new JArray();
            if (!legal)
            {
                mismatches.Add(
                    new JObject
                    {
                        ["field"] = "legality",
                        ["actual"] = false,
                        ["expected"] = true,
                    }
                );
                return mismatches;
            }

            var action = step.Value<string>("action") ?? string.Empty;
            var commitsReplayEvent = step.Value<bool>("commitsReplayEvent");
            var shouldMatchOracle = commitsReplayEvent || action == "start_local_game";
            if (!shouldMatchOracle)
            {
                AddMismatchIfDifferent(
                    mismatches,
                    "stateHashAfter",
                    CurrentStateHash(after),
                    CurrentStateHash(before)
                );
                AddMismatchIfDifferent(
                    mismatches,
                    "replayEventCountAfter",
                    RecordedEventCount(after),
                    RecordedEventCount(before)
                );
                return mismatches;
            }

            AddMismatchIfDifferent(
                mismatches,
                "phaseAfter",
                after.Value<string>("phase"),
                step.Value<string>("expectedPhaseAfter")
            );
            AddMismatchIfDifferent(
                mismatches,
                "turnAfter",
                after.Value<string>("turn"),
                step.Value<string>("expectedTurnAfter")
            );
            AddMismatchIfDifferent(
                mismatches,
                "winnerAfter",
                after.Value<string>("winner"),
                step["expectedWinnerAfter"]?.Type == JTokenType.Null
                    ? null
                    : step.Value<string>("expectedWinnerAfter")
            );
            AddMismatchIfDifferent(
                mismatches,
                "stateHashAfter",
                CurrentStateHash(after),
                step.Value<string>("expectedStateHashAfter")
            );
            AddMismatchIfDifferent(
                mismatches,
                "replayEventCountAfter",
                RecordedEventCount(after),
                step.Value<int?>("expectedReplayRevisionAfter") ?? -1
            );
            return mismatches;
        }

        private static JObject BuildFinalChecks(JObject plan, JObject final)
        {
            var oracle = plan["oracle"] as JObject ?? new JObject();
            return new JObject
            {
                ["winner"] = BuildCheck(final.Value<string>("winner"), oracle.Value<string>("winner")),
                ["replayEventCount"] = BuildCheck(
                    RecordedEventCount(final),
                    oracle.Value<int?>("replayRevision") ?? -1
                ),
                ["finalStateHash"] = BuildCheck(
                    CurrentStateHash(final),
                    oracle.Value<string>("finalStateHash") ?? string.Empty
                ),
            };
        }

        private static IEnumerable<JObject> FindFailedChecks(JObject checks)
        {
            if (checks == null)
            {
                yield break;
            }

            foreach (var property in checks.Properties())
            {
                var check = property.Value as JObject;
                if (check?.Value<bool>("ok") == false)
                {
                    yield return new JObject
                    {
                        ["reason"] = "Final check mismatch.",
                        ["field"] = property.Name,
                        ["actual"] = check["actual"]?.DeepClone() ?? JValue.CreateNull(),
                        ["expected"] = check["expected"]?.DeepClone() ?? JValue.CreateNull(),
                    };
                }
            }
        }

        private static JObject ReviewExportedReplay(
            string exportedJson,
            JObject plan,
            int viewportWidth,
            int viewportHeight
        )
        {
            var reviewRoot = new GameObject("GemDuel Full Game Plan Replay Review");
            try
            {
                var review = reviewRoot.AddComponent<GemDuelGameController>();
                if (!review.ImportReplayJsonForAutomation(exportedJson, out var importError))
                {
                    return new JObject
                    {
                        ["ok"] = false,
                        ["failureReason"] = "Replay import failed: " + importError,
                    };
                }

                if (!review.PlayReplayToEndForAutomation(out var reviewError))
                {
                    return new JObject
                    {
                        ["ok"] = false,
                        ["failureReason"] = "Replay review playback failed: " + reviewError,
                    };
                }

                var reviewed = review.BuildAutomationStateSnapshot(viewportWidth, viewportHeight);
                var reviewedHash = CurrentStateHash(reviewed);
                var expectedHash = plan["oracle"]?.Value<string>("finalStateHash") ?? string.Empty;
                return new JObject
                {
                    ["ok"] = reviewedHash == expectedHash,
                    ["reviewedFinalStateHash"] = reviewedHash,
                    ["expectedFinalStateHash"] = expectedHash,
                    ["failureReason"] = reviewedHash == expectedHash
                        ? JValue.CreateNull()
                        : JToken.FromObject("Replay review hash mismatch."),
                };
            }
            finally
            {
                DestroyObject(reviewRoot);
            }
        }

        private static JObject BuildReplayExportSummary(string exportedJson, JObject finalReplay)
        {
            var replay = JsonConvert.DeserializeObject<ReplayVNext>(exportedJson);
            return new JObject
            {
                ["ok"] = replay != null,
                ["exportedEvents"] = replay?.Events?.Count ?? 0,
                ["exportedSummaryFinalStateHash"] = replay?.Summary?.FinalStateHash ?? string.Empty,
                ["controllerCurrentStateHash"] = finalReplay.Value<string>("currentStateHash") ?? string.Empty,
                ["jsonSha256"] = Sha256(exportedJson),
            };
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
                ["replayHash"] = ReplayHash(automationState),
            };
        }

        private static JObject BuildVisibleState(JObject automationState)
        {
            var visibleTargets = automationState["visibleTargets"] as JArray ?? new JArray();
            var digestSource = new JObject
            {
                ["phase"] = automationState.Value<string>("phase"),
                ["turn"] = automationState.Value<string>("turn"),
                ["winner"] = automationState.Value<string>("winner"),
                ["statusText"] = automationState.Value<string>("statusText"),
                ["errorBanner"] = automationState.Value<string>("errorBanner"),
                ["visibleTargets"] = new JArray(
                    visibleTargets
                        .OfType<JObject>()
                        .Select(target => new JObject
                        {
                            ["kind"] = target.Value<string>("kind"),
                            ["semanticKey"] = target.Value<string>("semanticKey"),
                            ["eventType"] = target.Value<string>("eventType"),
                            ["rect"] = target["rect"]?.DeepClone() ?? JValue.CreateNull(),
                            ["clickable"] = target.Value<bool>("clickable"),
                        })
                ),
            };
            return new JObject
            {
                ["phase"] = automationState.Value<string>("phase"),
                ["turn"] = automationState.Value<string>("turn"),
                ["winner"] = automationState.Value<string>("winner"),
                ["statusText"] = automationState.Value<string>("statusText"),
                ["errorBanner"] = automationState.Value<string>("errorBanner"),
                ["visibleTargetCount"] = visibleTargets.Count,
                ["digest"] = Sha256(digestSource.ToString(Formatting.None)),
            };
        }

        private static JObject BuildTargetGeometry(JObject target, int viewportWidth, int viewportHeight)
        {
            var rect = target["rect"] as JObject;
            var normalized = BuildNormalizedCenter(rect, viewportWidth, viewportHeight);
            return new JObject
            {
                ["kind"] = target.Value<string>("kind"),
                ["semanticKey"] = target.Value<string>("semanticKey"),
                ["eventType"] = target.Value<string>("eventType"),
                ["row"] = target.Value<int?>("row"),
                ["column"] = target.Value<int?>("column"),
                ["level"] = target.Value<int?>("level"),
                ["index"] = target.Value<int?>("index"),
                ["instanceId"] = target.Value<string>("instanceId"),
                ["royalId"] = target.Value<string>("royalId"),
                ["gemId"] = target.Value<string>("gemId"),
                ["buffId"] = target.Value<string>("buffId"),
                ["clickable"] = target.Value<bool>("clickable"),
                ["rect"] = rect?.DeepClone() ?? JValue.CreateNull(),
                ["normalizedCenter"] = normalized,
                ["world"] = target["world"]?.DeepClone() ?? JValue.CreateNull(),
            };
        }

        private static JObject BuildInput(
            JObject target,
            string action,
            int viewportWidth,
            int viewportHeight
        )
        {
            var rect = target?["rect"] as JObject;
            return new JObject
            {
                ["kind"] = action != null && action.IndexOf("drag", StringComparison.OrdinalIgnoreCase) >= 0
                    ? "drag"
                    : "click",
                ["normalizedPoint"] = BuildNormalizedCenter(rect, viewportWidth, viewportHeight),
                ["normalizedDrag"] = JValue.CreateNull(),
            };
        }

        private static JObject BuildNormalizedCenter(JObject rect, int viewportWidth, int viewportHeight)
        {
            if (rect == null || viewportWidth <= 0 || viewportHeight <= 0)
            {
                return new JObject
                {
                    ["x"] = JValue.CreateNull(),
                    ["y"] = JValue.CreateNull(),
                };
            }

            var x = rect.Value<double>("x") + rect.Value<double>("width") * 0.5d;
            var y = rect.Value<double>("y") + rect.Value<double>("height") * 0.5d;
            return new JObject
            {
                ["x"] = Math.Round(x / viewportWidth, 6),
                ["y"] = Math.Round(y / viewportHeight, 6),
            };
        }

        private static JObject FindSemanticTarget(JObject automationState, string semanticKey)
        {
            if (string.IsNullOrEmpty(semanticKey))
            {
                return null;
            }

            return (automationState["visibleTargets"] as JArray)
                ?.OfType<JObject>()
                .FirstOrDefault(target => target.Value<string>("semanticKey") == semanticKey);
        }

        private static string CurrentStateHash(JObject automationState)
        {
            return ((JObject)automationState["replay"])?.Value<string>("currentStateHash")
                ?? string.Empty;
        }

        private static string ReplayHash(JObject automationState)
        {
            var replay = automationState["replay"] as JObject;
            var liveRecording = replay?["liveRecording"] as JObject;
            return liveRecording?.Value<string>("summaryFinalStateHash")
                ?? replay?.Value<string>("currentStateHash")
                ?? string.Empty;
        }

        private static int RecordedEventCount(JObject automationState)
        {
            var replay = automationState["replay"] as JObject;
            var liveRecording = replay?["liveRecording"] as JObject;
            return liveRecording?.Value<int?>("recordedEvents")
                ?? replay?.Value<int?>("revision")
                ?? replay?.Value<int?>("totalEvents")
                ?? 0;
        }

        private static JObject BuildCheck<T>(T actual, T expected)
        {
            return new JObject
            {
                ["actual"] = actual == null ? JValue.CreateNull() : JToken.FromObject(actual),
                ["expected"] = expected == null ? JValue.CreateNull() : JToken.FromObject(expected),
                ["ok"] = EqualityComparer<T>.Default.Equals(actual, expected),
            };
        }

        private static void AddMismatchIfDifferent<T>(
            JArray mismatches,
            string field,
            T actual,
            T expected
        )
        {
            if (EqualityComparer<T>.Default.Equals(actual, expected))
            {
                return;
            }

            mismatches.Add(
                new JObject
                {
                    ["field"] = field,
                    ["actual"] = actual == null ? JValue.CreateNull() : JToken.FromObject(actual),
                    ["expected"] = expected == null ? JValue.CreateNull() : JToken.FromObject(expected),
                }
            );
        }

        private static JObject BuildPerformanceSummary(IReadOnlyList<long> durations)
        {
            var sorted = durations.OrderBy(value => value).ToList();
            return new JObject
            {
                ["count"] = sorted.Count,
                ["p50Ms"] = Percentile(sorted, 0.5d),
                ["p95Ms"] = Percentile(sorted, 0.95d),
                ["maxMs"] = sorted.Count == 0 ? 0 : sorted[sorted.Count - 1],
            };
        }

        private static long Percentile(IReadOnlyList<long> sorted, double percentile)
        {
            if (sorted.Count == 0)
            {
                return 0;
            }

            var index = (int)Math.Ceiling(sorted.Count * percentile) - 1;
            index = Math.Max(0, Math.Min(sorted.Count - 1, index));
            return sorted[index];
        }

        private static List<string> ResolvePlanPaths(LocalDevFullGamePlanSmokeOptions options)
        {
            var limit = Math.Max(1, options.Limit);
            if (!string.IsNullOrWhiteSpace(options.PlanPath))
            {
                return new List<string> { options.PlanPath };
            }

            if (string.IsNullOrWhiteSpace(options.PlanDirectory) || !Directory.Exists(options.PlanDirectory))
            {
                return new List<string>();
            }

            return Directory.GetFiles(options.PlanDirectory, "*.json")
                .OrderBy(value => value, StringComparer.Ordinal)
                .Take(limit)
                .ToList();
        }

        private static JObject FailSuite(JObject report, string reason)
        {
            report["ok"] = false;
            report["verdict"] = "Blocked";
            report["failureReason"] = reason;
            report["completedAt"] = DateTime.UtcNow.ToString("O");
            return report;
        }

        private static string Sha256(string value)
        {
            using (var sha = SHA256.Create())
            {
                var bytes = Encoding.UTF8.GetBytes(value ?? string.Empty);
                return BitConverter.ToString(sha.ComputeHash(bytes)).Replace("-", string.Empty).ToLowerInvariant();
            }
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
