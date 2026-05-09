using System.IO;
using GemDuel.Catalog;
using GemDuel.Replay;
using Newtonsoft.Json;
using NUnit.Framework;

namespace GemDuel.Tests.EditMode
{
    public sealed class ReplayParityEditModeTests
    {
        [Test]
        public void CatalogLoaderLoadsCommittedCatalogs()
        {
            var catalog = new CatalogLoader().LoadDefault();

            Assert.Greater(catalog.Cards.Count, 0);
            Assert.Greater(catalog.Royals.Count, 0);
            Assert.Greater(catalog.Buffs.Count, 0);
            Assert.Greater(catalog.Gems.Count, 0);
        }

        [Test]
        public void ReplayManifestLoadsCommittedFixtures()
        {
            var manifest = LoadManifest();

            Assert.AreEqual(1, manifest.SchemaVersion);
            Assert.AreEqual(3, manifest.Fixtures.Count);
        }

        [Test]
        public void OpeningBootstrapHashMatchesManifest()
        {
            var manifest = LoadManifest();
            var fixture = manifest.Fixtures.Find(candidate => candidate.Id == "local-pvp-opening");
            Assert.NotNull(fixture);

            var replay = LoadReplay(fixture.FileName);
            var state = ReplayBootstrapper.Bootstrap(replay);
            var hash = new ReplayStateHasher().Hash(state);

            Assert.AreEqual(fixture.ExpectedFinalStateHash, hash);
        }

        [Test]
        public void FullFixtureParityMatchesManifest()
        {
            var report = new ReplayParityRunner().RunDefault(false);

            Assert.IsTrue(report.Ok, JsonConvert.SerializeObject(report, Formatting.Indented));
            Assert.AreEqual(3, report.Results.Count);
        }

        [Test]
        public void UnknownReplayEventFailsExplicitly()
        {
            var result = new ReplayParityRunner().RunUnknownEventProbe();

            Assert.IsTrue(result.Ok);
        }

        private static ReplayManifest LoadManifest()
        {
            var path = RepositoryPaths.ResolveFromRoot("fixtures", "replay-golden", "manifest.json");
            return JsonConvert.DeserializeObject<ReplayManifest>(File.ReadAllText(path));
        }

        private static ReplayVNext LoadReplay(string fileName)
        {
            var path = RepositoryPaths.ResolveFromRoot("fixtures", "replay-golden", fileName);
            return JsonConvert.DeserializeObject<ReplayVNext>(File.ReadAllText(path));
        }
    }
}
