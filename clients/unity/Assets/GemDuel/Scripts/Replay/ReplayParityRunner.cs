using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using GemDuel.Catalog;
using GemDuel.Core;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace GemDuel.Replay
{
    public sealed class ReplayParityRunner
    {
        private static readonly string[] RequiredCoverage =
        {
            "local-pvp-opening",
            "reserve",
            "buy",
            "joker-buy",
            "reserved-buy",
            "reserve-cancel",
            "reserve-deck",
            "discard-reserved",
            "privilege",
            "peek-modal",
            "draft-reroll",
            "royal-selection",
            "extra-turn",
            "buff",
            "game-over",
        };

        private readonly CatalogLoader catalogLoader;
        private readonly GameReducer reducer;
        private readonly ReplayStateHasher hasher;

        public ReplayParityRunner()
            : this(new CatalogLoader(), new GameReducer(), new ReplayStateHasher()) { }

        public ReplayParityRunner(CatalogLoader catalogLoader, GameReducer reducer, ReplayStateHasher hasher)
        {
            this.catalogLoader = catalogLoader;
            this.reducer = reducer;
            this.hasher = hasher;
        }

        public ReplayParityReport RunDefault(bool writeReports)
        {
            var fixtureDirectory = RepositoryPaths.ResolveFromRoot("fixtures", "replay-golden");
            var reportDirectory = RepositoryPaths.ResolveFromRoot("artifacts", "unity");
            return Run(fixtureDirectory, reportDirectory, writeReports);
        }

        public ReplayParityReport Run(string fixtureDirectory, string reportDirectory, bool writeReports)
        {
            var manifestPath = Path.Combine(fixtureDirectory, "manifest.json");
            var manifest = JsonConvert.DeserializeObject<ReplayManifest>(File.ReadAllText(manifestPath))
                ?? throw new InvalidOperationException("Replay manifest could not be parsed.");
            var catalog = catalogLoader.LoadDefault();
            var report = new ReplayParityReport
            {
                Ok = true,
                FixtureCount = manifest.Fixtures.Count,
                CoverageGaps = FindCoverageGaps(manifest),
            };

            foreach (var fixture in manifest.Fixtures)
            {
                var result = RunFixture(fixtureDirectory, fixture, catalog);
                report.Results.Add(result);
                if (!result.Ok)
                {
                    report.Ok = false;
                }
            }

            if (report.CoverageGaps.Count > 0)
            {
                report.Ok = false;
            }

            if (writeReports)
            {
                WriteReports(reportDirectory, report);
            }

            return report;
        }

        private ReplayFixtureResult RunFixture(
            string fixtureDirectory,
            ReplayManifestFixture fixture,
            UnityCatalog catalog
        )
        {
            var path = Path.Combine(fixtureDirectory, fixture.FileName);
            var replay = JsonConvert.DeserializeObject<ReplayVNext>(File.ReadAllText(path))
                ?? throw new InvalidOperationException("Replay fixture could not be parsed: " + path);
            var result = new ReplayFixtureResult { Id = fixture.Id, FileName = fixture.FileName, Ok = true };

            try
            {
                catalogLoader.ValidateReplayReferences(catalog, replay);
                var state = ReplayBootstrapper.Bootstrap(replay);
                foreach (var replayEvent in replay.Events)
                {
                    var reducerResult = reducer.ApplyReplayEvent(state, replayEvent, replay.Checkpoints);
                    if (!reducerResult.Ok)
                    {
                        result.Mismatches.Add(reducerResult.Error);
                        break;
                    }

                    LoadReplayAuditCheckpoint(state, replay.Checkpoints);
                }

                result.FinalStateHash = hasher.Hash(state);
                result.Winner = state.Winner;
                AddMismatch(
                    result,
                    "finalStateHash",
                    fixture.ExpectedFinalStateHash,
                    result.FinalStateHash
                );
                AddMismatch(result, "winner", fixture.ExpectedWinner, result.Winner);
                AddMismatch(result, "endReason", fixture.ExpectedEndReason, replay.Summary.EndReason);
                AddMismatch(
                    result,
                    "totalEvents",
                    fixture.ExpectedTotalEvents.ToString(),
                    replay.Events.Count.ToString()
                );
                AddMismatch(
                    result,
                    "turnCount",
                    fixture.ExpectedTurnCount.ToString(),
                    replay.Summary.TurnCount.ToString()
                );
            }
            catch (Exception ex)
            {
                result.Mismatches.Add(ex.Message);
            }

            result.Ok = result.Mismatches.Count == 0;
            return result;
        }

        public ReplayFixtureResult RunUnknownEventProbe()
        {
            var replay = new ReplayVNext();
            var state = new GameState(new JObject { ["turn"] = "p1", ["phase"] = "IDLE" }, 0);
            var reducerResult = reducer.ApplyReplayEvent(
                state,
                new JObject { ["type"] = "unsupported_event", ["actor"] = "p1" },
                replay.Checkpoints
            );
            return new ReplayFixtureResult
            {
                Id = "unknown-event-probe",
                FileName = "synthetic",
                Ok = !reducerResult.Ok,
                Mismatches = reducerResult.Ok
                    ? new List<string> { "Unknown event was accepted." }
                    : new List<string>(),
            };
        }

        private static List<string> FindCoverageGaps(ReplayManifest manifest)
        {
            var tags = new HashSet<string>(
                manifest.Fixtures.SelectMany(fixture => fixture.Tags),
                StringComparer.Ordinal
            );
            return RequiredCoverage.Where(tag => !tags.Contains(tag)).ToList();
        }

        private static void LoadReplayAuditCheckpoint(
            GameState state,
            IReadOnlyList<ReplayCheckpoint> checkpoints
        )
        {
            var checkpoint = checkpoints.FirstOrDefault(candidate => candidate.Revision == state.Revision);
            if (checkpoint == null)
            {
                return;
            }

            state.LoadReplayAuditSnapshot(
                GameReducer.NormalizeReplayAuditSnapshot(checkpoint.State),
                checkpoint.Revision
            );
        }

        private static void AddMismatch(
            ReplayFixtureResult result,
            string field,
            string expected,
            string actual
        )
        {
            if (expected != actual)
            {
                result.Mismatches.Add(field + ": expected " + (expected ?? "null") + " got " + (actual ?? "null"));
            }
        }

        private static void WriteReports(string reportDirectory, ReplayParityReport report)
        {
            Directory.CreateDirectory(reportDirectory);
            var jsonPath = Path.Combine(reportDirectory, "replay-parity-report.json");
            var markdownPath = Path.Combine(reportDirectory, "replay-parity-report.md");
            File.WriteAllText(jsonPath, JsonConvert.SerializeObject(report, Formatting.Indented));
            File.WriteAllText(markdownPath, BuildMarkdown(report));
        }

        private static string BuildMarkdown(ReplayParityReport report)
        {
            var lines = new List<string>
            {
                "# Unity Replay Parity Report",
                string.Empty,
                "- Ok: `" + report.Ok.ToString().ToLowerInvariant() + "`",
                "- Fixture count: `" + report.FixtureCount + "`",
                "- Coverage gaps: `" + string.Join(", ", report.CoverageGaps) + "`",
                string.Empty,
                "| Fixture | Ok | Final hash | Winner | Mismatches |",
                "| --- | --- | --- | --- | --- |",
            };

            foreach (var result in report.Results)
            {
                lines.Add(
                    "| "
                        + result.Id
                        + " | "
                        + result.Ok
                        + " | "
                        + result.FinalStateHash
                        + " | "
                        + (result.Winner ?? "null")
                        + " | "
                        + string.Join("; ", result.Mismatches)
                        + " |"
                );
            }

            return string.Join(Environment.NewLine, lines) + Environment.NewLine;
        }
    }

    public sealed class ReplayParityReport
    {
        public bool Ok { get; set; }
        public int FixtureCount { get; set; }
        public List<string> CoverageGaps { get; set; } = new List<string>();
        public List<ReplayFixtureResult> Results { get; set; } = new List<ReplayFixtureResult>();
    }

    public sealed class ReplayFixtureResult
    {
        public string Id { get; set; } = string.Empty;
        public string FileName { get; set; } = string.Empty;
        public bool Ok { get; set; }
        public string FinalStateHash { get; set; } = string.Empty;
        public string Winner { get; set; }
        public List<string> Mismatches { get; set; } = new List<string>();
    }
}
