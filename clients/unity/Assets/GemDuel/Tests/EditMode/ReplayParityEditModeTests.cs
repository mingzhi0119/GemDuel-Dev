using System.IO;
using GemDuel.Catalog;
using GemDuel.Core;
using GemDuel.Presentation;
using GemDuel.Replay;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using NUnit.Framework;
using UnityEngine;

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
        public void FullCoverageReplayCarriesParityCriticalSharedCheckpoints()
        {
            var replay = LoadReplay("local-pvp-royal-extra-turn-game-over.replay.json");

            AssertParityCheckpoint(replay, 8, "BONUS_ACTION", "p2");
            AssertParityCheckpoint(replay, 11, "IDLE", "p2");
            AssertParityCheckpoint(replay, 44, "DISCARD_EXCESS_GEMS", "p2");
        }

        [Test]
        public void UnknownReplayEventFailsExplicitly()
        {
            var result = new ReplayParityRunner().RunUnknownEventProbe();

            Assert.IsTrue(result.Ok);
        }

        [Test]
        public void GuidedLocalPvpPlaybackCompletesFullFixture()
        {
            var root = new GameObject("GemDuel Guided Playback Test");
            try
            {
                var slice = root.AddComponent<GemDuelVerticalSlice>();
                slice.LoadFixtureForRuntime("local-pvp-royal-extra-turn-game-over.replay.json");

                Assert.AreEqual(0, slice.GuidedEventsCompleted);
                Assert.AreEqual(93, slice.GuidedEventsTotal);
                Assert.IsTrue(slice.PlayGuidedFixtureToEndForAutomation(out var error), error);
                Assert.AreEqual(93, slice.GuidedEventsCompleted);
                Assert.AreEqual("p1", slice.Winner);
            }
            finally
            {
                Object.DestroyImmediate(root);
                foreach (var obj in Object.FindObjectsByType<GameObject>())
                {
                    if (obj == null)
                    {
                        continue;
                    }

                    if (obj.name == "GemDuel Rendered State" || obj.name == "Status Topbar")
                    {
                        Object.DestroyImmediate(obj);
                    }
                }
            }
        }

        [Test]
        public void MinimalTakeGemsMutationUpdatesBoardAndInventoryBetweenCheckpoints()
        {
            var replay = LoadReplay("local-pvp-royal-extra-turn-game-over.replay.json");
            var state = ReplayBootstrapper.Bootstrap(replay);
            var reducer = new GameReducer();

            Assert.IsTrue(reducer.ApplyReplayEvent(state, replay.Events[0], replay.Checkpoints).Ok);
            Assert.IsTrue(reducer.ApplyReplayEvent(state, replay.Events[1], replay.Checkpoints).Ok);

            var result = reducer.ApplyReplayEvent(state, replay.Events[2], replay.Checkpoints);

            Assert.IsTrue(result.Ok, result.Error);
            var board = (JArray)state.Snapshot["board"];
            var p1Inventory = (JObject)((JObject)state.Snapshot["inventories"])["p1"];
            Assert.AreEqual("empty", board[0][0].Value<string>());
            Assert.AreEqual("empty", board[0][1].Value<string>());
            Assert.AreEqual("empty", board[0][2].Value<string>());
            Assert.AreEqual(2, p1Inventory.Value<int>("white"));
            Assert.AreEqual(1, p1Inventory.Value<int>("blue"));
        }

        [Test]
        public void VisibleGemSelectionAcceptsLegalNonFixtureLineAndUpdatesState()
        {
            var root = new GameObject("GemDuel Free Gem Selection Test");
            try
            {
                var slice = root.AddComponent<GemDuelVerticalSlice>();
                slice.LoadFixtureForRuntime("local-pvp-royal-extra-turn-game-over.replay.json");
                slice.ApplyNextFixtureEvent();
                slice.ApplyNextFixtureEvent();

                slice.HandleVisibleTarget(CreateGemTarget(root, 3, 0, "green"));
                slice.HandleVisibleTarget(CreateGemTarget(root, 3, 1, "red"));
                slice.HandleVisibleTarget(CreateGemTarget(root, 3, 2, "red"));

                Assert.AreEqual("empty", slice.GetBoardGemForAutomation(3, 0));
                Assert.AreEqual("empty", slice.GetBoardGemForAutomation(3, 1));
                Assert.AreEqual("empty", slice.GetBoardGemForAutomation(3, 2));
                Assert.AreEqual(1, slice.GetInventoryCountForAutomation("p1", "green"));
                Assert.AreEqual(2, slice.GetInventoryCountForAutomation("p1", "red"));
            }
            finally
            {
                Object.DestroyImmediate(root);
                foreach (var obj in Object.FindObjectsByType<GameObject>())
                {
                    if (obj == null)
                    {
                        continue;
                    }

                    if (obj.name == "GemDuel Rendered State" || obj.name == "Status Topbar")
                    {
                        Object.DestroyImmediate(obj);
                    }
                }
            }
        }

        [Test]
        public void TopbarPointCounterUsesScoreInsteadOfPrivilegeBank()
        {
            var root = new GameObject("GemDuel Topbar Score Test");
            try
            {
                var slice = root.AddComponent<GemDuelVerticalSlice>();
                slice.LoadFixtureForRuntime("local-pvp-royal-extra-turn-game-over.replay.json");
                slice.ApplyNextFixtureEvent();
                slice.ApplyNextFixtureEvent();

                var automationState = slice.BuildAutomationStateSnapshot(1920, 1080);
                var snapshot = (JObject)automationState["snapshot"];
                Assert.AreEqual(1, ((JObject)snapshot["privileges"]).Value<int>("p2"));
                Assert.AreEqual(0, ((JObject)snapshot["extraPoints"]).Value<int>("p2"));
                Assert.AreEqual(0, ((JArray)((JObject)snapshot["playerTableau"])["p2"]).Count);

                var topbarPointValue = FindTextMesh("p2 Point Value");
                Assert.NotNull(topbarPointValue);
                Assert.AreEqual("0", topbarPointValue.text);
            }
            finally
            {
                Object.DestroyImmediate(root);
                foreach (var obj in Object.FindObjectsByType<GameObject>())
                {
                    if (obj == null)
                    {
                        continue;
                    }

                    if (obj.name == "GemDuel Rendered State" || obj.name == "Status Topbar")
                    {
                        Object.DestroyImmediate(obj);
                    }
                }
            }
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

        private static void AssertParityCheckpoint(
            ReplayVNext replay,
            int revision,
            string expectedPhase,
            string expectedTurn
        )
        {
            var checkpoint = replay.Checkpoints.Find(candidate => candidate.Revision == revision);
            Assert.NotNull(checkpoint, "Missing parity-critical checkpoint " + revision);
            Assert.AreEqual(expectedPhase, checkpoint.State.Value<string>("phase"));
            Assert.AreEqual(expectedTurn, checkpoint.State.Value<string>("turn"));

            var state = ReplayBootstrapper.Bootstrap(replay);
            var reducer = new GameReducer();
            for (var index = 0; index < revision; index += 1)
            {
                var result = reducer.ApplyReplayEvent(state, replay.Events[index], replay.Checkpoints);
                Assert.IsTrue(result.Ok, result.Error);
            }

            Assert.IsTrue(JToken.DeepEquals(checkpoint.State, state.Snapshot));
        }

        private static GemDuelViewTarget CreateGemTarget(GameObject root, int row, int column, string gemId)
        {
            var targetObject = new GameObject("Gem Target " + row + "," + column);
            targetObject.transform.SetParent(root.transform, false);
            var target = targetObject.AddComponent<GemDuelViewTarget>();
            target.Kind = "Gem";
            target.Row = row;
            target.Column = column;
            target.GemId = gemId;
            return target;
        }

        private static TextMesh FindTextMesh(string name)
        {
            foreach (var mesh in Object.FindObjectsByType<TextMesh>(FindObjectsSortMode.None))
            {
                if (mesh != null && mesh.name == name)
                {
                    return mesh;
                }
            }

            return null;
        }
    }
}
