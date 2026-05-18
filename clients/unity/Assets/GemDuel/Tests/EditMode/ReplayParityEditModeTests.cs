using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using GemDuel.Catalog;
using GemDuel.Core;
using GemDuel.Presentation;
using GemDuel.Replay;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using NUnit.Framework;
using TMPro;
using UnityEngine;
using Object = UnityEngine.Object;

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
            Assert.AreEqual(11, manifest.Fixtures.Count);
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
            Assert.AreEqual(11, report.Results.Count);
        }

        [Test]
        public void FullCoverageReplayCarriesParityCriticalSharedCheckpoints()
        {
            var replay = LoadReplay("local-pvp-royal-extra-turn-game-over.replay.json");

            AssertParityCheckpoint(replay, 8, "BONUS_ACTION", "p2");
            AssertParityCheckpoint(replay, 11, "IDLE", "p2");
            var discardCheckpoint = replay.Checkpoints.FirstOrDefault(candidate =>
                candidate.State.Value<string>("phase") == "DISCARD_EXCESS_GEMS"
            );
            Assert.NotNull(discardCheckpoint, "Missing parity-critical DISCARD_EXCESS_GEMS checkpoint.");
            AssertParityCheckpoint(replay, discardCheckpoint.Revision, "DISCARD_EXCESS_GEMS", "p2");
        }

        [Test]
        public void UnknownReplayEventFailsExplicitly()
        {
            var result = new ReplayParityRunner().RunUnknownEventProbe();

            Assert.IsTrue(result.Ok);
        }

        [Test]
        public void TypeScriptRulesEngineBuildsStartRequestAndCapturesBridgeState()
        {
            JObject capturedRequest = null;
            var bridgeInit = new JObject { ["cardInstances"] = new JObject(), ["royalDeck"] = new JArray() };
            var bridgeState = new JObject { ["phase"] = "IDLE", ["turn"] = "p1" };
            var engine = new TypeScriptGameRulesEngine(request =>
            {
                capturedRequest = (JObject)request.DeepClone();
                return new JObject
                {
                    ["ok"] = true,
                    ["replayRevision"] = 0,
                    ["init"] = bridgeInit,
                    ["state"] = bridgeState,
                    ["stateHash"] = "abc12345",
                    ["actionType"] = "INIT",
                };
            });

            var result = engine.StartLocalGame("unity-test-seed", true);

            Assert.IsTrue(result.Ok, result.Error);
            Assert.AreEqual("start", capturedRequest.Value<string>("kind"));
            Assert.AreEqual("LOCAL_PVP", capturedRequest.Value<string>("mode"));
            Assert.IsTrue(capturedRequest.Value<bool>("useBuffs"));
            Assert.AreEqual("unity-test-seed", capturedRequest.Value<string>("seed"));
            Assert.AreEqual("p1", capturedRequest.Value<string>("hostPlayer"));
            Assert.AreEqual("abc12345", result.StateHash);
            Assert.AreEqual("INIT", result.ActionType);
            Assert.IsTrue(JToken.DeepEquals(bridgeInit, result.Init));
            Assert.IsTrue(JToken.DeepEquals(bridgeState, result.State));
        }

        [Test]
        public void TypeScriptRulesEngineBuildsApplyRequestAndPreservesRejectedState()
        {
            var requests = new JArray();
            var bridgeInit = new JObject { ["cardInstances"] = new JObject(), ["royalDeck"] = new JArray() };
            var bridgeState = new JObject { ["phase"] = "IDLE", ["turn"] = "p1" };
            var engine = new TypeScriptGameRulesEngine(request =>
            {
                requests.Add(request.DeepClone());
                if (request.Value<string>("kind") == "start")
                {
                    return new JObject
                    {
                        ["ok"] = true,
                        ["replayRevision"] = 0,
                        ["init"] = bridgeInit,
                        ["state"] = bridgeState,
                        ["stateHash"] = "abc12345",
                        ["actionType"] = "INIT",
                    };
                }

                return new JObject
                {
                    ["ok"] = false,
                    ["replayRevision"] = 0,
                    ["state"] = bridgeState,
                    ["stateHash"] = "abc12345",
                    ["actionType"] = "TAKE_GEMS",
                    ["rejection"] = new JObject
                    {
                        ["code"] = "INVALID_ACTOR",
                        ["reason"] = "Command actor p2 does not match active player p1.",
                    },
                };
            });

            var start = engine.StartLocalGame("unity-test-seed");
            Assert.IsTrue(start.Ok, start.Error);

            var result = engine.ApplyCommand(
                new GameState(start.State, 0),
                new GameRulesCommand
                {
                    Type = "TAKE_GEMS",
                    Actor = "p2",
                    Payload = new JObject
                    {
                        ["coords"] = new JArray(new JObject { ["r"] = 0, ["c"] = 0 }),
                    },
                }
            );

            Assert.IsFalse(result.Ok);
            Assert.AreEqual("INVALID_ACTOR", result.ErrorCode);
            Assert.AreEqual("abc12345", result.StateHash);
            Assert.AreEqual("TAKE_GEMS", result.ActionType);
            Assert.IsTrue(JToken.DeepEquals(bridgeState, result.State));

            var applyRequest = (JObject)requests[1];
            Assert.AreEqual("apply", applyRequest.Value<string>("kind"));
            Assert.AreEqual("p2", applyRequest.Value<string>("actor"));
            Assert.IsTrue(JToken.DeepEquals(bridgeInit, applyRequest["init"]));
            Assert.IsTrue(JToken.DeepEquals(bridgeState, applyRequest["state"]));
            Assert.AreEqual("TAKE_GEMS", applyRequest["command"].Value<string>("type"));
            Assert.AreEqual("p2", applyRequest["command"].Value<string>("actor"));
        }

        [Test]
        public void SemanticStartLocalGameUsesLiveRulesBridgeByDefault()
        {
            var root = new GameObject("GemDuel Live Bridge Start Test");
            try
            {
                var slice = root.AddComponent<GemDuelGameController>();

                Assert.IsTrue(
                    slice.RunSemanticActionForAutomation(
                        "start_local_game",
                        new JObject { ["seed"] = "unity-editmode-live-start" },
                        out var error
                    ),
                    error
                );

                var state = slice.BuildAutomationStateSnapshot(1920, 1080);
                var snapshot = (JObject)state["snapshot"];
                Assert.AreEqual("setup-live-rules-engine", slice.LastAutomationDriver);
                Assert.AreEqual(0, state.Value<int>("totalEvents"));
                Assert.AreEqual("IDLE", snapshot.Value<string>("phase"));
                Assert.AreEqual("p1", snapshot.Value<string>("turn"));
                Assert.AreEqual("LOCAL_PVP", snapshot.Value<string>("mode"));
            }
            finally
            {
                Object.DestroyImmediate(root);
                CleanupRenderedSceneObjects();
            }
        }

        [Test]
        [Timeout(600000)]
        public void FreshLocalPvpProductSurfaceCanDriveGameOverAndReplayReview()
        {
            DriveFreshLocalPvpProductSurfaceToGameOver(
                "unity-editmode-fresh-product-game-over",
                240,
                true
            );
        }

        [TestCase("unity-editmode-fresh-product-game-over-alt-1")]
        [TestCase("unity-editmode-fresh-product-game-over-alt-2")]
        [Timeout(600000)]
        public void FreshLocalPvpProductSurfaceCanDriveAdditionalSeededGameOvers(string seed)
        {
            DriveFreshLocalPvpProductSurfaceToGameOver(seed, 240, true);
        }

        [Test]
        [Timeout(600000)]
        public void BoundedLocalPvpProductSurfaceMatrixWritesLiveReplayEvidence()
        {
            var scenarios = new[]
            {
                new LocalDevProductSurfaceSmokeOptions
                {
                    Seed = "unity-product-surface-matrix-opening",
                    MaxSteps = 18,
                    VerifyReplayReview = true,
                    IdleActionPreference = "balanced",
                },
                new LocalDevProductSurfaceSmokeOptions
                {
                    Seed = "unity-product-surface-matrix-resource",
                    MaxSteps = 30,
                    VerifyReplayReview = true,
                    IdleActionPreference = "resource-first",
                },
                new LocalDevProductSurfaceSmokeOptions
                {
                    Seed = "unity-product-surface-matrix-market-reserve",
                    MaxSteps = 10,
                    VerifyReplayReview = true,
                    IdleActionPreference = "reserve-first",
                },
                new LocalDevProductSurfaceSmokeOptions
                {
                    Seed = "unity-product-surface-matrix-followup",
                    MaxSteps = 18,
                    VerifyReplayReview = true,
                    IdleActionPreference = "balanced",
                },
                new LocalDevProductSurfaceSmokeOptions
                {
                    Seed = "unity-product-surface-matrix-review",
                    MaxSteps = 18,
                    VerifyReplayReview = true,
                    IdleActionPreference = "balanced",
                },
            };
            var runs = new JArray();
            var families = new HashSet<string>(StringComparer.Ordinal);

            foreach (var scenario in scenarios)
            {
                var root = new GameObject("GemDuel Product Surface Matrix " + scenario.Seed);
                try
                {
                    var slice = root.AddComponent<GemDuelGameController>();
                    var report = LocalDevProductSurfaceSmoke.Run(slice, scenario);

                    Assert.IsTrue(report.Value<bool>("ok"), report.ToString(Formatting.Indented));
                    Assert.IsFalse(report.Value<bool>("usedFixtureReplayAsGameplayDriver"));
                    Assert.IsFalse(report.Value<bool>("usedCheckpointStateReplacement"));
                    var layout = (JObject)report["layoutSummary"];
                    Assert.IsTrue(layout.Value<bool>("sharedPrivilegeSupplyVisible"));
                    Assert.AreEqual(
                        layout.Value<int>("replenishInitialBagCount") > 0,
                        layout.Value<bool>("replenishInitialClickable")
                    );
                    Assert.AreEqual(56d, layout.Value<double>("replenishInitialHeightPx"), 1.5d);
                    Assert.Greater(((JArray)report["actions"]).Count, 0);
                    Assert.IsTrue(report["replayReview"]?.Value<bool>("ok") ?? false);

                    foreach (var family in ((JArray)report["actionFamilies"]).Values<string>())
                    {
                        families.Add(family);
                    }

                    runs.Add(report);
                }
                finally
                {
                    Object.DestroyImmediate(root);
                    CleanupRenderedSceneObjects();
                }
            }

            Assert.GreaterOrEqual(families.Count, 3, "Expected a bounded matrix with multiple action families.");
            CollectionAssert.Contains(families, "take_gems");
            CollectionAssert.Contains(families, "buy_card");
            CollectionAssert.Contains(families, "reserve_card");
            CollectionAssert.Contains(families, "cancel_gem_selection");
            var artifactPath = RepositoryPaths.ResolveFromRoot(
                "artifacts",
                "unity",
                "product-surface-local-pvp-matrix-20260511.json"
            );
            Directory.CreateDirectory(Path.GetDirectoryName(artifactPath));
            File.WriteAllText(
                artifactPath,
                new JObject
                {
                    ["schemaVersion"] = 1,
                    ["kind"] = "unity-product-surface-local-pvp-matrix",
                    ["status"] = "incomplete-evidence",
                    ["seeds"] = new JArray(scenarios.Select(scenario => scenario.Seed)),
                    ["scenarios"] = new JArray(
                        scenarios.Select(scenario => new JObject
                        {
                            ["seed"] = scenario.Seed,
                            ["maxSteps"] = scenario.MaxSteps,
                            ["idleActionPreference"] = scenario.IdleActionPreference,
                        })
                    ),
                    ["actionFamilies"] = new JArray(families.OrderBy(value => value)),
                    ["runs"] = runs,
                }.ToString(Formatting.Indented)
            );
        }

        [Test]
        public void PrivilegeFirstProductSurfaceSmokeRoutesPrivilegeThroughLiveBridge()
        {
            var root = new GameObject("GemDuel Product Surface Privilege Smoke");
            try
            {
                var slice = root.AddComponent<GemDuelGameController>();
                var report = LocalDevProductSurfaceSmoke.Run(
                    slice,
                    new LocalDevProductSurfaceSmokeOptions
                    {
                        Seed = "unity-product-surface-privilege-20260512",
                        MaxSteps = 3,
                        VerifyReplayReview = true,
                        IdleActionPreference = "privilege-first",
                    }
                );

                Assert.IsTrue(report.Value<bool>("ok"), report.ToString(Formatting.Indented));
                Assert.IsFalse(report.Value<bool>("usedFixtureReplayAsGameplayDriver"));
                Assert.IsFalse(report.Value<bool>("usedCheckpointStateReplacement"));
                Assert.IsTrue(report["replayReview"]?.Value<bool>("ok") ?? false);

                var families = ((JArray)report["actionFamilies"]).Values<string>().ToList();
                CollectionAssert.Contains(families, "take_gems");
                CollectionAssert.Contains(families, "activate_privilege");
                CollectionAssert.Contains(families, "use_privilege");
            }
            finally
            {
                Object.DestroyImmediate(root);
                CleanupRenderedSceneObjects();
            }
        }

        [Test]
        public void RoguelikeDraftProductSurfaceSmokeRerollsSelectsAndReviewsLiveReplay()
        {
            var root = new GameObject("GemDuel Product Surface Draft Smoke");
            try
            {
                var slice = root.AddComponent<GemDuelGameController>();
                var report = LocalDevProductSurfaceSmoke.Run(
                    slice,
                    new LocalDevProductSurfaceSmokeOptions
                    {
                        Seed = "unity-product-surface-draft-release-path-20260512",
                        MaxSteps = 6,
                        StartMode = "roguelike",
                        VerifyReplayReview = true,
                        DraftActionPreference = "reroll-each-player-first",
                    }
                );

                Assert.IsTrue(report.Value<bool>("ok"), report.ToString(Formatting.Indented));
                Assert.AreEqual("roguelike", report.Value<string>("startMode"));
                Assert.IsFalse(report.Value<bool>("usedFixtureReplayAsGameplayDriver"));
                Assert.IsFalse(report.Value<bool>("usedCheckpointStateReplacement"));
                Assert.IsTrue(report["replayReview"]?.Value<bool>("ok") ?? false);

                var actions = (JArray)report["actions"];
                Assert.GreaterOrEqual(actions.Count, 4, report.ToString(Formatting.Indented));
                var families = ((JArray)report["actionFamilies"]).Values<string>().ToList();
                CollectionAssert.Contains(families, "reroll_draft_pool");
                CollectionAssert.Contains(families, "choose_boon");

                var draftActions = actions
                    .OfType<JObject>()
                    .Where(action =>
                        action.Value<string>("family") == "reroll_draft_pool"
                        || action.Value<string>("family") == "choose_boon"
                    )
                    .ToList();
                Assert.GreaterOrEqual(draftActions.Count, 4, report.ToString(Formatting.Indented));
                Assert.IsTrue(
                    draftActions.All(action => action.Value<string>("phaseBefore") == "DRAFT_PHASE"),
                    report.ToString(Formatting.Indented)
                );

                var summary = (JObject)report["productStateSummary"];
                var replaySummary = (JObject)report["replayHashSummary"];
                Assert.AreEqual(
                    summary.Value<string>("stateHash"),
                    replaySummary.Value<string>("controllerCurrentStateHash")
                );
                Assert.AreEqual(
                    summary.Value<string>("summaryFinalStateHash"),
                    replaySummary.Value<string>("exportedSummaryFinalStateHash")
                );
            }
            finally
            {
                Object.DestroyImmediate(root);
                CleanupRenderedSceneObjects();
            }
        }

        [Test]
        public void LocalDevPeekModalReleasePathSmokeOpensClosesAndReviewsReplay()
        {
            var root = new GameObject("GemDuel Peek Modal Release Path Smoke");
            try
            {
                var slice = root.AddComponent<GemDuelGameController>();
                var report = LocalDevPeekModalReleasePathSmoke.Run(
                    slice,
                    new LocalDevPeekModalReleasePathSmokeOptions
                    {
                        Seed = "unity-peek-modal-seed-17",
                    }
                );

                Assert.IsTrue(report.Value<bool>("ok"), report.ToString(Formatting.Indented));
                Assert.IsTrue(report.Value<bool>("freshLaunch"));
                Assert.IsFalse(report.Value<bool>("usedFixtureReplayAsGameplayDriver"));
                Assert.IsFalse(report.Value<bool>("usedCheckpointStateReplacement"));

                var summary = (JObject)report["peekModalSummary"];
                Assert.AreEqual("intelligence", summary.Value<string>("p1BuffId"));
                Assert.IsTrue(summary.Value<bool>("peekControlVisibleBefore"));
                Assert.IsTrue(summary.Value<bool>("modalVisibleAfterPeek"));
                Assert.IsTrue(summary.Value<bool>("closeControlVisibleAfterPeek"));
                Assert.AreEqual(9, summary.Value<int>("peekCardCount"));
                Assert.AreEqual(9, summary.Value<int>("visiblePeekCardTargets"));
                CollectionAssert.AreEquivalent(
                    new[] { 1, 2, 3 },
                    ((JArray)summary["levelRowsVisible"]).Values<int>().ToList()
                );
                Assert.IsFalse(summary.Value<bool>("modalVisibleAfterClose"));
                Assert.GreaterOrEqual(summary.Value<int>("recordedEvents"), 4);
                Assert.AreEqual(
                    summary.Value<int>("recordedEvents"),
                    summary.Value<int>("exportedEvents")
                );
                CollectionAssert.Contains(
                    ((JArray)summary["eventTypes"]).Values<string>().ToList(),
                    "select_buff"
                );
                CollectionAssert.Contains(
                    ((JArray)summary["eventTypes"]).Values<string>().ToList(),
                    "peek_deck"
                );
                CollectionAssert.Contains(
                    ((JArray)summary["eventTypes"]).Values<string>().ToList(),
                    "close_modal"
                );
                Assert.AreEqual(
                    summary.Value<string>("controllerCurrentStateHash"),
                    summary.Value<string>("exportedSummaryFinalStateHash")
                );
                Assert.AreEqual(
                    summary.Value<string>("controllerCurrentStateHash"),
                    summary.Value<string>("reviewedFinalStateHash")
                );
                Assert.IsTrue(report["replayReview"]?.Value<bool>("ok") ?? false);
            }
            finally
            {
                Object.DestroyImmediate(root);
                CleanupRenderedSceneObjects();
            }
        }

        [Test]
        public void LocalDevPrivilegeCancelReleasePathSmokeCancelsAndReviewsReplay()
        {
            var root = new GameObject("GemDuel Privilege Cancel Release Path Smoke");
            try
            {
                var slice = root.AddComponent<GemDuelGameController>();
                var report = LocalDevPrivilegeCancelReleasePathSmoke.Run(
                    slice,
                    new LocalDevPrivilegeCancelReleasePathSmokeOptions
                    {
                        Seed = "unity-built-player-privilege-family-20260512",
                    }
                );

                Assert.IsTrue(report.Value<bool>("ok"), report.ToString(Formatting.Indented));
                Assert.IsTrue(report.Value<bool>("freshLaunch"));
                Assert.IsFalse(report.Value<bool>("usedFixtureReplayAsGameplayDriver"));
                Assert.IsFalse(report.Value<bool>("usedCheckpointStateReplacement"));

                var summary = (JObject)report["privilegeCancelSummary"];
                Assert.AreEqual("PRIVILEGE_ACTION", summary.Value<string>("activatedPhase"));
                Assert.AreEqual("IDLE", summary.Value<string>("cancelledPhase"));
                Assert.GreaterOrEqual(summary.Value<int>("recordedEvents"), 2);
                Assert.AreEqual(
                    summary.Value<int>("recordedEvents"),
                    summary.Value<int>("exportedEvents")
                );
                var eventTypes = ((JArray)summary["eventTypes"]).Values<string>().ToList();
                CollectionAssert.Contains(eventTypes, "activate_privilege");
                CollectionAssert.Contains(eventTypes, "cancel_privilege");
                Assert.Greater(
                    summary.Value<int>("cancelEventIndex"),
                    summary.Value<int>("activateEventIndex")
                );
                Assert.AreEqual(
                    summary.Value<string>("controllerCurrentStateHash"),
                    summary.Value<string>("exportedSummaryFinalStateHash")
                );
                Assert.AreEqual(
                    summary.Value<string>("controllerCurrentStateHash"),
                    summary.Value<string>("reviewedFinalStateHash")
                );
                Assert.IsTrue(report["replayReview"]?.Value<bool>("ok") ?? false);
            }
            finally
            {
                Object.DestroyImmediate(root);
                CleanupRenderedSceneObjects();
            }
        }

        [Test]
        public void LocalDevReservedDiscardReleasePathSmokeDiscardsAndReviewsReplay()
        {
            var root = new GameObject("GemDuel Reserved Discard Release Path Smoke");
            try
            {
                var slice = root.AddComponent<GemDuelGameController>();
                var report = LocalDevReservedDiscardReleasePathSmoke.Run(
                    slice,
                    new LocalDevReservedDiscardReleasePathSmokeOptions
                    {
                        Seed = "unity-reserved-discard-seed-10",
                    }
                );

                Assert.IsTrue(report.Value<bool>("ok"), report.ToString(Formatting.Indented));
                Assert.IsTrue(report.Value<bool>("freshLaunch"));
                Assert.IsFalse(report.Value<bool>("usedFixtureReplayAsGameplayDriver"));
                Assert.IsFalse(report.Value<bool>("usedCheckpointStateReplacement"));

                var summary = (JObject)report["reservedDiscardSummary"];
                Assert.AreEqual("puppet_master", summary.Value<string>("p1BuffId"));
                Assert.IsTrue(summary.Value<bool>("reservedCardVisibleBeforeDiscard"));
                Assert.IsTrue(summary.Value<bool>("discardControlVisibleBeforeDiscard"));
                Assert.GreaterOrEqual(summary.Value<int>("recordedEvents"), 5);
                Assert.AreEqual(
                    summary.Value<int>("recordedEvents"),
                    summary.Value<int>("exportedEvents")
                );
                var eventTypes = ((JArray)summary["eventTypes"]).Values<string>().ToList();
                CollectionAssert.Contains(eventTypes, "select_buff");
                CollectionAssert.Contains(eventTypes, "reserve_card");
                CollectionAssert.Contains(eventTypes, "discard_reserved");
                Assert.Greater(
                    summary.Value<int>("reserveEventIndex"),
                    summary.Value<int>("selectBuffEventIndex")
                );
                Assert.Greater(
                    summary.Value<int>("discardEventIndex"),
                    summary.Value<int>("reserveEventIndex")
                );
                Assert.AreEqual(
                    summary.Value<string>("controllerCurrentStateHash"),
                    summary.Value<string>("exportedSummaryFinalStateHash")
                );
                Assert.AreEqual(
                    summary.Value<string>("controllerCurrentStateHash"),
                    summary.Value<string>("reviewedFinalStateHash")
                );
                Assert.IsTrue(report["replayReview"]?.Value<bool>("ok") ?? false);
            }
            finally
            {
                Object.DestroyImmediate(root);
                CleanupRenderedSceneObjects();
            }
        }

        [Test]
        public void LocalDevReservedBuyReleasePathSmokeBuysAndReviewsReplay()
        {
            var root = new GameObject("GemDuel Reserved Buy Release Path Smoke");
            try
            {
                var slice = root.AddComponent<GemDuelGameController>();
                var report = LocalDevReservedBuyReleasePathSmoke.Run(
                    slice,
                    new LocalDevReservedBuyReleasePathSmokeOptions
                    {
                        Seed = "unity-reserved-buy-seed-20260512",
                    }
                );

                Assert.IsTrue(report.Value<bool>("ok"), report.ToString(Formatting.Indented));
                Assert.IsTrue(report.Value<bool>("freshLaunch"));
                Assert.IsFalse(report.Value<bool>("usedFixtureReplayAsGameplayDriver"));
                Assert.IsFalse(report.Value<bool>("usedCheckpointStateReplacement"));

                var summary = (JObject)report["reservedBuySummary"];
                Assert.IsTrue(summary.Value<bool>("reservedCardVisibleBeforeBuy"));
                Assert.IsTrue(summary.Value<bool>("buyControlVisibleBeforeBuy"));
                Assert.GreaterOrEqual(summary.Value<int>("recordedEvents"), 2);
                Assert.AreEqual(
                    summary.Value<int>("recordedEvents"),
                    summary.Value<int>("exportedEvents")
                );
                var eventTypes = ((JArray)summary["eventTypes"]).Values<string>().ToList();
                CollectionAssert.Contains(eventTypes, "reserve_card");
                CollectionAssert.Contains(eventTypes, "buy_card");
                Assert.AreEqual("reserved", summary.Value<string>("buyEventSource"));
                Assert.Greater(
                    summary.Value<int>("buyEventIndex"),
                    summary.Value<int>("reserveEventIndex")
                );
                Assert.AreEqual(
                    summary.Value<string>("controllerCurrentStateHash"),
                    summary.Value<string>("exportedSummaryFinalStateHash")
                );
                Assert.AreEqual(
                    summary.Value<string>("controllerCurrentStateHash"),
                    summary.Value<string>("reviewedFinalStateHash")
                );
                Assert.IsTrue(report["replayReview"]?.Value<bool>("ok") ?? false);
            }
            finally
            {
                Object.DestroyImmediate(root);
                CleanupRenderedSceneObjects();
            }
        }

        [Test]
        public void LocalDevReserveCancelReleasePathSmokeCancelsAndReviewsReplay()
        {
            var root = new GameObject("GemDuel Reserve Cancel Release Path Smoke");
            try
            {
                var slice = root.AddComponent<GemDuelGameController>();
                var report = LocalDevReserveCancelReleasePathSmoke.Run(
                    slice,
                    new LocalDevReserveCancelReleasePathSmokeOptions
                    {
                        Seed = "unity-editmode-live-reserve-cancel",
                    }
                );

                Assert.IsTrue(report.Value<bool>("ok"), report.ToString(Formatting.Indented));
                Assert.IsTrue(report.Value<bool>("freshLaunch"));
                Assert.IsFalse(report.Value<bool>("usedFixtureReplayAsGameplayDriver"));
                Assert.IsFalse(report.Value<bool>("usedCheckpointStateReplacement"));

                var summary = (JObject)report["reserveCancelSummary"];
                Assert.IsTrue(summary.Value<bool>("marketCardVisibleBeforePreview"));
                Assert.IsTrue(summary.Value<bool>("visibleReserveControlBeforeInitiate"));
                Assert.IsTrue(summary.Value<bool>("visibleCancelControlBeforeCancel"));
                Assert.AreEqual("RESERVE_WAITING_GEM", summary.Value<string>("phaseBeforeCancel"));
                Assert.AreEqual("IDLE", summary.Value<string>("finalPhase"));
                Assert.IsFalse(summary.Value<bool>("pendingReservePresentAfterCancel"));
                Assert.IsFalse(summary.Value<bool>("reservedCardPresentAfterCancel"));
                Assert.GreaterOrEqual(summary.Value<int>("recordedEvents"), 2);
                Assert.AreEqual(
                    summary.Value<int>("recordedEvents"),
                    summary.Value<int>("exportedEvents")
                );
                Assert.AreEqual(0, summary.Value<int>("totalEventsAfterCancel"));
                var eventTypes = ((JArray)summary["eventTypes"]).Values<string>().ToList();
                CollectionAssert.Contains(eventTypes, "initiate_reserve");
                CollectionAssert.Contains(eventTypes, "cancel_reserve");
                Assert.Greater(
                    summary.Value<int>("cancelEventIndex"),
                    summary.Value<int>("initiateEventIndex")
                );
                Assert.AreEqual(
                    summary.Value<string>("initialStateHash"),
                    summary.Value<string>("controllerCurrentStateHash")
                );
                Assert.AreEqual(
                    summary.Value<string>("controllerCurrentStateHash"),
                    summary.Value<string>("exportedSummaryFinalStateHash")
                );
                Assert.AreEqual(
                    summary.Value<string>("controllerCurrentStateHash"),
                    summary.Value<string>("reviewedFinalStateHash")
                );
                Assert.IsTrue(report["replayReview"]?.Value<bool>("ok") ?? false);
            }
            finally
            {
                Object.DestroyImmediate(root);
                CleanupRenderedSceneObjects();
            }
        }

        [Test]
        public void LocalDevReserveDeckReleasePathSmokeReservesAndReviewsReplay()
        {
            var root = new GameObject("GemDuel Reserve Deck Release Path Smoke");
            try
            {
                var slice = root.AddComponent<GemDuelGameController>();
                var report = LocalDevReserveDeckReleasePathSmoke.Run(
                    slice,
                    new LocalDevReserveDeckReleasePathSmokeOptions
                    {
                        Seed = "unity-editmode-live-reserve-deck",
                    }
                );

                Assert.IsTrue(report.Value<bool>("ok"), report.ToString(Formatting.Indented));
                Assert.IsTrue(report.Value<bool>("freshLaunch"));
                Assert.IsFalse(report.Value<bool>("usedFixtureReplayAsGameplayDriver"));
                Assert.IsFalse(report.Value<bool>("usedCheckpointStateReplacement"));

                var summary = (JObject)report["reserveDeckSummary"];
                Assert.IsTrue(summary.Value<bool>("deckTargetVisibleBeforePreview"));
                Assert.IsTrue(summary.Value<bool>("goldTargetVisibleBeforeReserve"));
                Assert.IsTrue(summary.Value<bool>("visibleReserveControlBeforeInitiate"));
                Assert.AreEqual("RESERVE_WAITING_GEM", summary.Value<string>("phaseBeforeGold"));
                Assert.IsTrue(summary.Value<bool>("pendingReserveIsDeck"));
                Assert.AreEqual("IDLE", summary.Value<string>("finalPhase"));
                Assert.AreEqual("p2", summary.Value<string>("finalTurn"));
                Assert.AreEqual(
                    summary.Value<int>("startDeckCount") - 1,
                    summary.Value<int>("afterDeckCount")
                );
                Assert.AreEqual(
                    summary.Value<int>("startReservedCount") + 1,
                    summary.Value<int>("afterReservedCount")
                );
                Assert.IsTrue(summary.Value<bool>("reservedCardPresentAfterReserve"));
                Assert.AreEqual("empty", summary.Value<string>("goldCellAfterReserve"));
                Assert.GreaterOrEqual(summary.Value<int>("recordedEvents"), 2);
                Assert.AreEqual(
                    summary.Value<int>("recordedEvents"),
                    summary.Value<int>("exportedEvents")
                );
                Assert.AreEqual(0, summary.Value<int>("totalEventsAfterReserve"));
                var eventTypes = ((JArray)summary["eventTypes"]).Values<string>().ToList();
                CollectionAssert.Contains(eventTypes, "initiate_reserve_deck");
                CollectionAssert.Contains(eventTypes, "reserve_deck");
                Assert.Greater(
                    summary.Value<int>("reserveEventIndex"),
                    summary.Value<int>("initiateEventIndex")
                );
                Assert.AreEqual(
                    summary.Value<string>("controllerCurrentStateHash"),
                    summary.Value<string>("exportedSummaryFinalStateHash")
                );
                Assert.AreEqual(
                    summary.Value<string>("controllerCurrentStateHash"),
                    summary.Value<string>("reviewedFinalStateHash")
                );
                Assert.IsTrue(report["replayReview"]?.Value<bool>("ok") ?? false);
            }
            finally
            {
                Object.DestroyImmediate(root);
                CleanupRenderedSceneObjects();
            }
        }

        [Test]
        public void LocalDevReserveDeckCancelReleasePathSmokeCancelsAndReviewsReplay()
        {
            var root = new GameObject("GemDuel Reserve Deck Cancel Release Path Smoke");
            try
            {
                var slice = root.AddComponent<GemDuelGameController>();
                var report = LocalDevReserveDeckCancelReleasePathSmoke.Run(
                    slice,
                    new LocalDevReserveDeckCancelReleasePathSmokeOptions
                    {
                        Seed = "unity-editmode-live-reserve-deck-cancel",
                    }
                );

                Assert.IsTrue(report.Value<bool>("ok"), report.ToString(Formatting.Indented));
                Assert.IsTrue(report.Value<bool>("freshLaunch"));
                Assert.IsFalse(report.Value<bool>("usedFixtureReplayAsGameplayDriver"));
                Assert.IsFalse(report.Value<bool>("usedCheckpointStateReplacement"));

                var summary = (JObject)report["reserveDeckCancelSummary"];
                Assert.IsTrue(summary.Value<bool>("deckTargetVisibleBeforePreview"));
                Assert.IsTrue(summary.Value<bool>("goldTargetVisibleBeforeCancel"));
                Assert.IsTrue(summary.Value<bool>("visibleReserveControlBeforeInitiate"));
                Assert.IsTrue(summary.Value<bool>("visibleCancelControlBeforeCancel"));
                Assert.AreEqual("RESERVE_WAITING_GEM", summary.Value<string>("phaseBeforeCancel"));
                Assert.IsTrue(summary.Value<bool>("pendingReserveIsDeckBeforeCancel"));
                Assert.AreEqual("IDLE", summary.Value<string>("finalPhase"));
                Assert.AreEqual("p1", summary.Value<string>("finalTurn"));
                Assert.IsFalse(summary.Value<bool>("pendingReservePresentAfterCancel"));
                Assert.AreEqual(
                    summary.Value<int>("startDeckCount"),
                    summary.Value<int>("afterDeckCount")
                );
                Assert.AreEqual(
                    summary.Value<int>("startReservedCount"),
                    summary.Value<int>("afterReservedCount")
                );
                Assert.IsFalse(summary.Value<bool>("reservedCardPresentAfterCancel"));
                Assert.AreEqual("gold", summary.Value<string>("goldCellAfterCancel"));
                Assert.GreaterOrEqual(summary.Value<int>("recordedEvents"), 2);
                Assert.AreEqual(
                    summary.Value<int>("recordedEvents"),
                    summary.Value<int>("exportedEvents")
                );
                Assert.AreEqual(0, summary.Value<int>("totalEventsAfterCancel"));
                var eventTypes = ((JArray)summary["eventTypes"]).Values<string>().ToList();
                CollectionAssert.Contains(eventTypes, "initiate_reserve_deck");
                CollectionAssert.Contains(eventTypes, "cancel_reserve");
                Assert.Greater(
                    summary.Value<int>("cancelEventIndex"),
                    summary.Value<int>("initiateEventIndex")
                );
                Assert.AreEqual(
                    summary.Value<string>("initialStateHash"),
                    summary.Value<string>("controllerCurrentStateHash")
                );
                Assert.AreEqual(
                    summary.Value<string>("controllerCurrentStateHash"),
                    summary.Value<string>("exportedSummaryFinalStateHash")
                );
                Assert.AreEqual(
                    summary.Value<string>("controllerCurrentStateHash"),
                    summary.Value<string>("reviewedFinalStateHash")
                );
                Assert.IsTrue(report["replayReview"]?.Value<bool>("ok") ?? false);
            }
            finally
            {
                Object.DestroyImmediate(root);
                CleanupRenderedSceneObjects();
            }
        }

        [Test]
        public void LocalDevJokerReleasePathSmokeBuysAndReviewsReplay()
        {
            var root = new GameObject("GemDuel Joker Release Path Smoke");
            try
            {
                var slice = root.AddComponent<GemDuelGameController>();
                var report = LocalDevJokerReleasePathSmoke.Run(
                    slice,
                    new LocalDevJokerReleasePathSmokeOptions
                    {
                        Seed = "unity-built-player-replay-release-path-20260511",
                    }
                );

                Assert.IsTrue(report.Value<bool>("ok"), report.ToString(Formatting.Indented));
                Assert.IsTrue(report.Value<bool>("freshLaunch"));
                Assert.IsFalse(report.Value<bool>("usedFixtureReplayAsGameplayDriver"));
                Assert.IsFalse(report.Value<bool>("usedCheckpointStateReplacement"));

                var summary = (JObject)report["jokerSummary"];
                Assert.IsTrue(summary.Value<bool>("marketCardVisibleBeforePreview"));
                Assert.IsTrue(summary.Value<bool>("buyControlVisibleBeforeBuy"));
                Assert.IsTrue(summary.Value<bool>("colorTargetVisibleBeforeSelection"));
                Assert.AreEqual("SELECT_CARD_COLOR", summary.Value<string>("phaseBeforeColor"));
                Assert.AreEqual("IDLE", summary.Value<string>("finalPhase"));
                Assert.IsTrue(summary.Value<bool>("tableauContainsJokerAfterBuy"));
                Assert.IsTrue(summary.Value<bool>("pendingBuyClearedAfterBuy"));
                Assert.GreaterOrEqual(
                    summary.Value<int>("recordedEvents"),
                    summary.Value<int>("setupActionCount") + 2
                );
                Assert.AreEqual(
                    summary.Value<int>("recordedEvents"),
                    summary.Value<int>("exportedEvents")
                );
                Assert.AreEqual(0, summary.Value<int>("totalEventsAfterBuy"));
                var eventTypes = ((JArray)summary["eventTypes"]).Values<string>().ToList();
                CollectionAssert.Contains(eventTypes, "initiate_buy_joker");
                CollectionAssert.Contains(eventTypes, "buy_card");
                Assert.Greater(
                    summary.Value<int>("buyEventIndex"),
                    summary.Value<int>("initiateEventIndex")
                );
                Assert.AreEqual(
                    summary.Value<string>("controllerCurrentStateHash"),
                    summary.Value<string>("exportedSummaryFinalStateHash")
                );
                Assert.AreEqual(
                    summary.Value<string>("controllerCurrentStateHash"),
                    summary.Value<string>("reviewedFinalStateHash")
                );
                Assert.IsTrue(report["replayReview"]?.Value<bool>("ok") ?? false);
            }
            finally
            {
                Object.DestroyImmediate(root);
                CleanupRenderedSceneObjects();
            }
        }

        [Test]
        public void LocalDevInvalidActionReleasePathSmokeRejectsWithoutMutatingOrRecording()
        {
            var root = new GameObject("GemDuel Invalid Action Release Path Smoke");
            try
            {
                var slice = root.AddComponent<GemDuelGameController>();
                var report = LocalDevInvalidActionReleasePathSmoke.Run(
                    slice,
                    new LocalDevInvalidActionReleasePathSmokeOptions
                    {
                        Seed = "unity-invalid-action-release-path-20260512",
                    }
                );

                Assert.IsTrue(report.Value<bool>("ok"), report.ToString(Formatting.Indented));
                Assert.IsFalse(report.Value<bool>("usedFixtureReplayAsGameplayDriver"));
                Assert.IsFalse(report.Value<bool>("usedCheckpointStateReplacement"));

                var cases = ((JArray)report["cases"]).OfType<JObject>().ToList();
                Assert.GreaterOrEqual(cases.Count, 6, report.ToString(Formatting.Indented));
                foreach (var rejectionCase in cases)
                {
                    Assert.IsTrue(rejectionCase.Value<bool>("ok"), rejectionCase.ToString(Formatting.Indented));
                    Assert.IsFalse(rejectionCase.Value<bool>("accepted"), rejectionCase.ToString(Formatting.Indented));
                    Assert.AreEqual(
                        rejectionCase.Value<string>("stateHashBefore"),
                        rejectionCase.Value<string>("stateHashAfter"),
                        rejectionCase.ToString(Formatting.Indented)
                    );
                    Assert.AreEqual(
                        rejectionCase.Value<int>("recordedEventsBefore"),
                        rejectionCase.Value<int>("recordedEventsAfter"),
                        rejectionCase.ToString(Formatting.Indented)
                    );
                    Assert.AreEqual(
                        "live-rules-engine-command-rejected",
                        rejectionCase.Value<string>("driver"),
                        rejectionCase.ToString(Formatting.Indented)
                    );
                }

                var summary = (JObject)report["productStateSummary"];
                var replaySummary = (JObject)report["replayHashSummary"];
                Assert.AreEqual(0, summary.Value<int>("recordedEvents"));
                Assert.AreEqual(
                    summary.Value<string>("stateHash"),
                    replaySummary.Value<string>("controllerCurrentStateHash")
                );
                Assert.AreEqual(
                    summary.Value<string>("stateHash"),
                    replaySummary.Value<string>("exportedSummaryFinalStateHash")
                );
                Assert.IsTrue(report["replayReview"]?.Value<bool>("ok") ?? false);
                Assert.AreEqual(
                    summary.Value<string>("stateHash"),
                    report["replayReview"]?.Value<string>("reviewedFinalStateHash")
                );
            }
            finally
            {
                Object.DestroyImmediate(root);
                CleanupRenderedSceneObjects();
            }
        }

        [Test]
        public void ReplayReleasePathErrorsRecoverWithoutMutatingGameplayState()
        {
            var root = new GameObject("GemDuel Replay Release Path Error Test");
            try
            {
                var slice = root.AddComponent<GemDuelGameController>();
                var smoke = LocalDevProductSurfaceSmoke.Run(
                    slice,
                    new LocalDevProductSurfaceSmokeOptions
                    {
                        Seed = "unity-replay-release-path-errors",
                        MaxSteps = 8,
                        VerifyReplayReview = true,
                    }
                );
                Assert.IsTrue(smoke.Value<bool>("ok"), smoke.ToString(Formatting.Indented));

                var before = slice.BuildAutomationStateSnapshot(1920, 1080);
                var beforeReplay = (JObject)before["replay"];
                var beforeHash = beforeReplay.Value<string>("currentStateHash");
                var beforeRecordedEvents = ((JObject)beforeReplay["liveRecording"]).Value<int>("recordedEvents");
                var outputDirectory = RepositoryPaths.ResolveFromRoot("artifacts", "unity", "replay-release-path");
                Directory.CreateDirectory(outputDirectory);
                var validPath = Path.Combine(outputDirectory, "release-path-valid.replay.json");

                Assert.IsTrue(slice.ExportReplayToPathForAutomation(validPath, out var exportError), exportError);
                var validJson = File.ReadAllText(validPath);

                var invalidJsonPath = Path.Combine(outputDirectory, "invalid-json.replay.json");
                File.WriteAllText(invalidJsonPath, "{ invalid replay json");
                Assert.IsFalse(slice.ImportReplayFromPathForAutomation(invalidJsonPath, out var invalidJsonError));
                StringAssert.Contains("Invalid", invalidJsonError);
                AssertLiveReplayStateUnchanged(slice, beforeHash, beforeRecordedEvents, "invalid JSON");

                var missingPath = Path.Combine(outputDirectory, "missing.replay.json");
                if (File.Exists(missingPath))
                {
                    File.Delete(missingPath);
                }

                Assert.IsFalse(slice.ImportReplayFromPathForAutomation(missingPath, out var missingError));
                StringAssert.Contains("Could not find", missingError);
                AssertLiveReplayStateUnchanged(slice, beforeHash, beforeRecordedEvents, "missing file");

                var unsupported = JObject.Parse(validJson);
                unsupported["schemaVersion"] = "999.0";
                var unsupportedPath = Path.Combine(outputDirectory, "unsupported-schema.replay.json");
                File.WriteAllText(unsupportedPath, unsupported.ToString(Formatting.Indented));
                Assert.IsFalse(slice.ImportReplayFromPathForAutomation(unsupportedPath, out var unsupportedError));
                StringAssert.Contains("Unsupported replay schema version", unsupportedError);
                AssertLiveReplayStateUnchanged(slice, beforeHash, beforeRecordedEvents, "unsupported schema");

                var malformedBootstrap = JObject.Parse(validJson);
                malformedBootstrap["init"]["board"] = new JArray(new JArray("red"));
                var malformedBootstrapPath = Path.Combine(outputDirectory, "malformed-bootstrap.replay.json");
                File.WriteAllText(malformedBootstrapPath, malformedBootstrap.ToString(Formatting.Indented));
                Assert.IsFalse(
                    slice.ImportReplayFromPathForAutomation(malformedBootstrapPath, out var malformedBootstrapError)
                );
                StringAssert.Contains("Replay init board must contain 5 rows", malformedBootstrapError);
                AssertLiveReplayStateUnchanged(slice, beforeHash, beforeRecordedEvents, "malformed bootstrap");

                var malformedDraftBootstrap = JObject.Parse(validJson);
                malformedDraftBootstrap["init"]["actionType"] = "INIT_DRAFT";
                malformedDraftBootstrap["init"]["draftPool"] = new JArray();
                var malformedDraftBootstrapPath = Path.Combine(
                    outputDirectory,
                    "malformed-draft-bootstrap.replay.json"
                );
                File.WriteAllText(malformedDraftBootstrapPath, malformedDraftBootstrap.ToString(Formatting.Indented));
                Assert.IsFalse(
                    slice.ImportReplayFromPathForAutomation(
                        malformedDraftBootstrapPath,
                        out var malformedDraftBootstrapError
                    )
                );
                StringAssert.Contains(
                    "Replay init draftPool must not be empty for INIT_DRAFT",
                    malformedDraftBootstrapError
                );
                AssertLiveReplayStateUnchanged(
                    slice,
                    beforeHash,
                    beforeRecordedEvents,
                    "malformed draft bootstrap"
                );

                var corruptedSummary = JObject.Parse(validJson);
                corruptedSummary["summary"]["totalEvents"] = 999;
                var corruptedSummaryPath = Path.Combine(outputDirectory, "corrupted-summary.replay.json");
                File.WriteAllText(corruptedSummaryPath, corruptedSummary.ToString(Formatting.Indented));
                Assert.IsFalse(slice.ImportReplayFromPathForAutomation(corruptedSummaryPath, out var corruptedError));
                StringAssert.Contains("Replay summary totalEvents mismatch", corruptedError);
                AssertLiveReplayStateUnchanged(slice, beforeHash, beforeRecordedEvents, "corrupted summary");

                var hashMismatch = JObject.Parse(validJson);
                hashMismatch["summary"]["finalStateHash"] = "deadbeef";
                var hashMismatchPath = Path.Combine(outputDirectory, "hash-mismatch.replay.json");
                File.WriteAllText(hashMismatchPath, hashMismatch.ToString(Formatting.Indented));
                Assert.IsFalse(slice.ImportReplayFromPathForAutomation(hashMismatchPath, out var hashError));
                StringAssert.Contains("Replay summary finalStateHash mismatch", hashError);
                AssertLiveReplayStateUnchanged(slice, beforeHash, beforeRecordedEvents, "hash mismatch");

                File.WriteAllText(validPath, "{ overwritten invalid replay json");
                Assert.IsFalse(slice.ImportReplayFromPathForAutomation(validPath, out _));
                AssertLiveReplayStateUnchanged(slice, beforeHash, beforeRecordedEvents, "failed overwrite load");

                Assert.IsTrue(slice.ExportReplayToPathForAutomation(validPath, out var overwriteError), overwriteError);
                Assert.IsTrue(slice.ImportReplayFromPathForAutomation(validPath, out var reloadError), reloadError);
                Assert.IsTrue(slice.PlayReplayToEndForAutomation(out var reviewError), reviewError);
                var reviewed = slice.BuildAutomationStateSnapshot(1920, 1080);
                var reloadedSummary = (JObject)JObject.Parse(File.ReadAllText(validPath))["summary"];
                Assert.AreEqual(
                    reloadedSummary.Value<string>("finalStateHash"),
                    ((JObject)reviewed["replay"]).Value<string>("currentStateHash")
                );
            }
            finally
            {
                Object.DestroyImmediate(root);
                CleanupRenderedSceneObjects();
            }
        }

        [Test]
        public void TypeScriptBridgeAvailabilityAndRepositoryRootChecksAreStructured()
        {
            var builtPlayerDataPath = Path.Combine(
                RepositoryPaths.Root,
                "artifacts",
                "unity",
                "build",
                "windows",
                "GemDuelUnity_Data"
            );
            Directory.CreateDirectory(builtPlayerDataPath);
            Assert.AreEqual(RepositoryPaths.Root, RepositoryPaths.ResolveRootFrom(builtPlayerDataPath));

            var missingRoot = Path.Combine(Path.GetTempPath(), "gemduel-missing-" + Guid.NewGuid());
            var missingClient = new TypeScriptRulesBridgeProcessClient(missingRoot, 10);
            Assert.IsFalse(missingClient.IsAvailable(out var missingRootError));
            StringAssert.Contains("repository root does not exist", missingRootError);

            var previousPnpmPath = Environment.GetEnvironmentVariable("GEMDUEL_PNPM_PATH");
            try
            {
                Environment.SetEnvironmentVariable(
                    "GEMDUEL_PNPM_PATH",
                    Path.Combine(RepositoryPaths.Root, "missing-pnpm.cmd")
                );
                var missingPnpmClient = new TypeScriptRulesBridgeProcessClient(RepositoryPaths.Root, 10);
                Assert.IsFalse(missingPnpmClient.IsAvailable(out var missingPnpmError));
                StringAssert.Contains("GEMDUEL_PNPM_PATH", missingPnpmError);
            }
            finally
            {
                Environment.SetEnvironmentVariable("GEMDUEL_PNPM_PATH", previousPnpmPath);
            }

            var missingToolsRoot = Path.Combine(
                Path.GetTempPath(),
                "gemduel-bridge-missing-tools-" + Guid.NewGuid()
            );
            try
            {
                Directory.CreateDirectory(missingToolsRoot);
                File.WriteAllText(
                    Path.Combine(missingToolsRoot, "pnpm-lock.yaml"),
                    "lockfileVersion: '9.0'\n"
                );

                var client = new TypeScriptRulesBridgeProcessClient(missingToolsRoot, 10);
                Assert.IsFalse(client.IsAvailable(out var toolsError));
                StringAssert.Contains("missing tools/scripts", toolsError);
                StringAssert.Contains(Path.Combine(missingToolsRoot, "tools", "scripts"), toolsError);
            }
            finally
            {
                if (Directory.Exists(missingToolsRoot))
                {
                    Directory.Delete(missingToolsRoot, true);
                }
            }

            var missingScriptRoot = Path.Combine(
                Path.GetTempPath(),
                "gemduel-bridge-missing-script-" + Guid.NewGuid()
            );
            try
            {
                Directory.CreateDirectory(Path.Combine(missingScriptRoot, "tools", "scripts"));
                File.WriteAllText(
                    Path.Combine(missingScriptRoot, "pnpm-lock.yaml"),
                    "lockfileVersion: '9.0'\n"
                );

                var client = new TypeScriptRulesBridgeProcessClient(missingScriptRoot, 10);
                Assert.IsFalse(client.IsAvailable(out var scriptError));
                StringAssert.Contains("bridge script is missing", scriptError);
                StringAssert.Contains(
                    Path.Combine(
                        missingScriptRoot,
                        "tools",
                        "migration",
                        "unity-rules-engine-bridge.ts"
                    ),
                    scriptError
                );
            }
            finally
            {
                if (Directory.Exists(missingScriptRoot))
                {
                    Directory.Delete(missingScriptRoot, true);
                }
            }

            var tempRoot = Path.Combine(Path.GetTempPath(), "gemduel-bridge-" + Guid.NewGuid());
            try
            {
                Directory.CreateDirectory(Path.Combine(tempRoot, "tools", "scripts"));
                Directory.CreateDirectory(Path.Combine(tempRoot, "tools", "migration"));
                File.WriteAllText(Path.Combine(tempRoot, "pnpm-lock.yaml"), "lockfileVersion: '9.0'\n");
                File.WriteAllText(
                    Path.Combine(tempRoot, "tools", "migration", "unity-rules-engine-bridge.ts"),
                    "export {};\n"
                );
                var client = new TypeScriptRulesBridgeProcessClient(tempRoot, 10);
                Assert.IsFalse(client.IsAvailable(out var dependencyError));
                StringAssert.Contains("vite-node", dependencyError);
            }
            finally
            {
                if (Directory.Exists(tempRoot))
                {
                    Directory.Delete(tempRoot, true);
                }
            }
        }

        [Test]
        public void TypeScriptRulesEngineMapsBridgeExceptionsToStructuredResults()
        {
            var timeoutEngine = new TypeScriptGameRulesEngine(_ =>
                throw new TimeoutException("bridge timed out for test")
            );

            var timeoutStart = timeoutEngine.StartLocalGame("unity-bridge-timeout-test");
            Assert.IsFalse(timeoutStart.Ok);
            Assert.AreEqual("BRIDGE_TIMEOUT", timeoutStart.ErrorCode);
            StringAssert.Contains("bridge timed out for test", timeoutStart.Error);

            timeoutEngine.RestoreSession(new JObject { ["cardInstances"] = new JObject() });
            var timeoutApply = timeoutEngine.ApplyCommand(
                new GameState(new JObject { ["phase"] = "IDLE", ["turn"] = "p1" }, 0),
                new GameRulesCommand
                {
                    Type = "TAKE_GEMS",
                    Actor = "p1",
                    Payload = new JObject
                    {
                        ["coords"] = new JArray(new JObject { ["r"] = 0, ["c"] = 0 }),
                    },
                }
            );
            Assert.IsFalse(timeoutApply.Ok);
            Assert.AreEqual("BRIDGE_TIMEOUT", timeoutApply.ErrorCode);
            StringAssert.Contains("bridge timed out for test", timeoutApply.Error);

            var failureEngine = new TypeScriptGameRulesEngine(_ =>
                throw new InvalidOperationException("vite-node missing for test")
            );

            var failureStart = failureEngine.StartLocalGame("unity-bridge-failure-test");
            Assert.IsFalse(failureStart.Ok);
            Assert.AreEqual("BRIDGE_EXECUTION_FAILED", failureStart.ErrorCode);
            StringAssert.Contains("vite-node missing for test", failureStart.Error);
        }

        [Test]
        public void TypeScriptBridgeMailboxFailuresAreStructuredAndCleanTempFiles()
        {
            var missingMailbox = Path.Combine(
                Path.GetTempPath(),
                "gemduel-missing-mailbox-" + Guid.NewGuid()
            );
            var missingClient = new TypeScriptRulesBridgeMailboxClient(missingMailbox, 10);
            var unavailable = Assert.Throws<InvalidOperationException>(() =>
                missingClient.Execute(new JObject { ["kind"] = "start" })
            );
            StringAssert.Contains("mailbox is unavailable", unavailable.Message);
            StringAssert.Contains(missingMailbox, unavailable.Message);

            var mailboxRoot = Path.Combine(
                Path.GetTempPath(),
                "gemduel-timeout-mailbox-" + Guid.NewGuid()
            );
            var requestDirectory = Path.Combine(mailboxRoot, "requests");
            var responseDirectory = Path.Combine(mailboxRoot, "responses");
            try
            {
                Directory.CreateDirectory(requestDirectory);
                Directory.CreateDirectory(responseDirectory);

                var timeoutClient = new TypeScriptRulesBridgeMailboxClient(mailboxRoot, 75);
                var timeout = Assert.Throws<TimeoutException>(() =>
                    timeoutClient.Execute(new JObject { ["kind"] = "start" })
                );
                StringAssert.Contains("mailbox timed out", timeout.Message);

                Assert.AreEqual(
                    0,
                    Directory.GetFiles(requestDirectory).Length,
                    "Timed-out mailbox requests must be cleaned up."
                );
                Assert.AreEqual(
                    0,
                    Directory.GetFiles(responseDirectory).Length,
                    "Timed-out mailbox responses must be cleaned up."
                );

                Exception responderError = null;
                var corruptResponder = System.Threading.Tasks.Task.Run(() =>
                {
                    try
                    {
                        var deadline = DateTime.UtcNow.AddMilliseconds(8000);
                        while (DateTime.UtcNow < deadline)
                        {
                            var requestPath = Directory.GetFiles(requestDirectory, "*.json").FirstOrDefault();
                            if (!string.IsNullOrEmpty(requestPath))
                            {
                                File.WriteAllText(
                                    Path.Combine(responseDirectory, Path.GetFileName(requestPath)),
                                    "{not-json"
                                );
                                return;
                            }

                            System.Threading.Thread.Sleep(5);
                        }

                        throw new TimeoutException("Corrupt mailbox responder did not observe a request file.");
                    }
                    catch (Exception ex)
                    {
                        responderError = ex;
                    }
                });

                var corruptClient = new TypeScriptRulesBridgeMailboxClient(mailboxRoot, 10000);
                var corruptResponse = Assert.Throws<JsonReaderException>(() =>
                    corruptClient.Execute(new JObject { ["kind"] = "start" })
                );
                Assert.IsNotNull(corruptResponse);
                Assert.IsTrue(corruptResponder.Wait(10000), "Corrupt mailbox responder did not finish.");
                if (responderError != null)
                {
                    throw responderError;
                }

                Assert.AreEqual(
                    0,
                    Directory.GetFiles(requestDirectory).Length,
                    "Corrupt mailbox requests must be cleaned up."
                );
                Assert.AreEqual(
                    0,
                    Directory.GetFiles(responseDirectory).Length,
                    "Corrupt mailbox responses must be cleaned up after parse failure."
                );
            }
            finally
            {
                if (Directory.Exists(mailboxRoot))
                {
                    Directory.Delete(mailboxRoot, true);
                }
            }
        }

        private static void DriveFreshLocalPvpProductSurfaceToGameOver(
            string seed,
            int maxSteps,
            bool verifyReplayReview
        )
        {
            DeleteLocalDevRecoverySave();
            var root = new GameObject("GemDuel Fresh Product Game Over Test " + seed);
            GameObject reviewRoot = null;
            try
            {
                var slice = root.AddComponent<GemDuelGameController>();
                Assert.IsTrue(
                    slice.RunSemanticActionForAutomation(
                        "start_local_game",
                        new JObject { ["seed"] = seed },
                        out var startError
                    ),
                    startError
                );

                var catalog = new CatalogLoader().LoadDefault();
                JObject final = null;
                var appliedActions = new List<string>();

                for (var step = 0; step < maxSteps; step += 1)
                {
                    var before = slice.BuildAutomationStateSnapshot(1920, 1080);
                    if (!string.IsNullOrEmpty(before.Value<string>("winner")))
                    {
                        final = before;
                        break;
                    }

                    var liveRecording = (JObject)((JObject)before["replay"])["liveRecording"];
                    var beforeRecordedEvents = liveRecording.Value<int>("recordedEvents");
                    Assert.IsTrue(
                        DriveOneFreshLocalPvpProductAction(slice, before, catalog, out var actionDetail),
                        seed + " step " + step + " could not apply a product action from phase "
                            + before.Value<string>("phase")
                            + ": "
                            + actionDetail
                    );
                    appliedActions.Add(actionDetail);

                    var after = slice.BuildAutomationStateSnapshot(1920, 1080);
                    var afterLiveRecording = (JObject)((JObject)after["replay"])["liveRecording"];
                    Assert.Greater(
                        afterLiveRecording.Value<int>("recordedEvents"),
                        beforeRecordedEvents,
                        seed + " step " + step + " did not append a live replay event after " + actionDetail
                    );
                    Assert.AreEqual(
                        ((JObject)after["replay"]).Value<string>("currentStateHash"),
                        afterLiveRecording.Value<string>("summaryFinalStateHash")
                    );
                }

                if (final == null)
                {
                    final = slice.BuildAutomationStateSnapshot(1920, 1080);
                }

                Assert.IsNotEmpty(appliedActions);
                Assert.IsNotNull(
                    final.Value<string>("winner"),
                    seed + " did not reach game over: " + string.Join(" -> ", appliedActions)
                );
                var finalReplay = (JObject)final["replay"];
                var finalLiveRecording = (JObject)finalReplay["liveRecording"];
                Assert.AreEqual(final.Value<string>("winner"), finalLiveRecording.Value<string>("winner"));
                Assert.AreEqual(
                    finalReplay.Value<string>("currentStateHash"),
                    finalLiveRecording.Value<string>("summaryFinalStateHash")
                );
                Assert.Greater(finalLiveRecording.Value<int>("recordedEvents"), 0);

                Assert.IsTrue(slice.ExportReplayJsonForAutomation(out var exportedJson, out var exportError), exportError);
                var exportedReplay = JsonConvert.DeserializeObject<ReplayVNext>(exportedJson);
                Assert.NotNull(exportedReplay);
                Assert.AreEqual(final.Value<string>("winner"), exportedReplay.Summary.Winner);
                Assert.AreEqual(
                    finalReplay.Value<string>("currentStateHash"),
                    exportedReplay.Summary.FinalStateHash
                );
                Assert.AreEqual(finalLiveRecording.Value<int>("recordedEvents"), exportedReplay.Events.Count);

                if (verifyReplayReview)
                {
                    reviewRoot = new GameObject("GemDuel Fresh Product Replay Review Test " + seed);
                    var review = reviewRoot.AddComponent<GemDuelGameController>();
                    Assert.IsTrue(review.ImportReplayJsonForAutomation(exportedJson, out var importError), importError);
                    Assert.IsTrue(review.PlayReplayToEndForAutomation(out var reviewError), reviewError);
                    var reviewed = review.BuildAutomationStateSnapshot(1920, 1080);
                    Assert.AreEqual(final.Value<string>("winner"), reviewed.Value<string>("winner"));
                    Assert.AreEqual(
                        exportedReplay.Summary.FinalStateHash,
                        ((JObject)reviewed["replay"]).Value<string>("currentStateHash")
                    );
                }

            }
            finally
            {
                if (root != null)
                {
                    Object.DestroyImmediate(root);
                }

                if (reviewRoot != null)
                {
                    Object.DestroyImmediate(reviewRoot);
                }

                DeleteLocalDevRecoverySave();
                CleanupRenderedSceneObjects();
            }
        }

        [Test]
        [Timeout(360000)]
        public void UnityBridgeRejectsRejectionManifestWithoutMutatingOrRecording()
        {
            var manifest = LoadRejectionManifest();
            Assert.AreEqual(65, manifest.Cases.Count);
            var replayByFileName = new Dictionary<string, ReplayVNext>();

            foreach (var testCase in manifest.Cases)
            {
                var root = new GameObject("GemDuel Rejection Manifest " + testCase.Id);
                try
                {
                    if (!replayByFileName.TryGetValue(testCase.FileName, out var replay))
                    {
                        replay = LoadReplay(testCase.FileName);
                        replayByFileName[testCase.FileName] = replay;
                    }

                    var slice = root.AddComponent<GemDuelGameController>();
                    var state = BuildReplayStateAtRevision(
                        testCase.FileName,
                        testCase.Revision
                    );
                    ApplyRejectionStateSetup(state.Snapshot, testCase.StateSetupId);
                    var beforeHash = new ReplayStateHasher().Hash(state);
                    Assert.AreEqual(
                        testCase.ExpectedBeforeStateHash,
                        beforeHash,
                        testCase.Id + " before replay-state hash"
                    );

                    PrimeLiveControllerAtReplayState(slice, testCase.FileName, replay, state, beforeHash);
                    var before = slice.BuildAutomationStateSnapshot(1920, 1080);
                    var beforeReplay = (JObject)before["replay"];
                    var beforeLiveRecording = (JObject)beforeReplay["liveRecording"];
                    var beforeRecordedEvents = beforeLiveRecording.Value<int>("recordedEvents");
                    var command = BuildUnityBridgeCommandFromRejectionCase(testCase);

                    Assert.IsFalse(
                        ApplyLiveRulesCommandForAutomation(slice, command.Type, command.Payload),
                        testCase.Id + " unexpectedly accepted " + command.Type
                    );

                    var after = slice.BuildAutomationStateSnapshot(1920, 1080);
                    var afterReplay = (JObject)after["replay"];
                    var afterLiveRecording = (JObject)afterReplay["liveRecording"];
                    Assert.AreEqual(
                        testCase.ExpectedRejectionReason,
                        after.Value<string>("statusText"),
                        testCase.Id + " rejection reason"
                    );
                    Assert.AreEqual(
                        testCase.ExpectedRejectionReason,
                        after.Value<string>("errorBanner"),
                        testCase.Id + " error banner"
                    );
                    Assert.AreEqual(
                        testCase.ExpectedAfterStateHash,
                        afterReplay.Value<string>("currentStateHash"),
                        testCase.Id + " after replay-state hash"
                    );
                    Assert.AreEqual(
                        beforeRecordedEvents,
                        afterLiveRecording.Value<int>("recordedEvents"),
                        testCase.Id + " must not append a live replay event"
                    );
                }
                finally
                {
                    Object.DestroyImmediate(root);
                    CleanupRenderedSceneObjects();
                }
            }
        }

        [Test]
        public void LiveTakeGemsRejectionsDoNotMutateStateOrReplayRecording()
        {
            var root = new GameObject("GemDuel Live Take Gems Rejection Test");
            try
            {
                var slice = root.AddComponent<GemDuelGameController>();
                Assert.IsTrue(
                    slice.RunSemanticActionForAutomation(
                        "start_local_game",
                        new JObject { ["seed"] = "unity-editmode-live-take-gems-rejections" },
                        out var startError
                    ),
                    startError
                );

                var beforeEmpty = slice.BuildAutomationStateSnapshot(1920, 1080);
                var beforeEmptyReplay = (JObject)beforeEmpty["replay"];
                var beforeEmptyHash = beforeEmptyReplay.Value<string>("currentStateHash");
                Assert.AreEqual(0, ((JObject)beforeEmptyReplay["liveRecording"]).Value<int>("recordedEvents"));

                Assert.IsFalse(
                    ApplyLiveRulesCommandForAutomation(
                        slice,
                        "TAKE_GEMS",
                        new JObject { ["coords"] = new JArray() }
                    )
                );

                var afterEmpty = slice.BuildAutomationStateSnapshot(1920, 1080);
                Assert.AreEqual(
                    "Gem selection must contain between one and three coordinates.",
                    afterEmpty.Value<string>("statusText")
                );
                Assert.AreEqual(
                    "Gem selection must contain between one and three coordinates.",
                    afterEmpty.Value<string>("errorBanner")
                );
                Assert.AreEqual(beforeEmptyHash, ((JObject)afterEmpty["replay"]).Value<string>("currentStateHash"));
                Assert.AreEqual(
                    0,
                    ((JObject)((JObject)afterEmpty["replay"])["liveRecording"]).Value<int>("recordedEvents")
                );

                var gold = FindFirstBoardGem((JObject)afterEmpty["snapshot"], "gold");
                Assert.IsFalse(
                    ApplyLiveRulesCommandForAutomation(
                        slice,
                        "TAKE_GEMS",
                        new JObject
                        {
                            ["coords"] = new JArray(
                                new JObject { ["r"] = gold.x, ["c"] = gold.y }
                            ),
                        }
                    )
                );

                var afterGold = slice.BuildAutomationStateSnapshot(1920, 1080);
                Assert.AreEqual("Gem selection includes an empty or gold cell.", afterGold.Value<string>("statusText"));
                Assert.AreEqual("Gem selection includes an empty or gold cell.", afterGold.Value<string>("errorBanner"));
                Assert.AreEqual(beforeEmptyHash, ((JObject)afterGold["replay"]).Value<string>("currentStateHash"));
                Assert.AreEqual(
                    0,
                    ((JObject)((JObject)afterGold["replay"])["liveRecording"]).Value<int>("recordedEvents")
                );

                Assert.IsFalse(
                    ApplyLiveRulesCommandForAutomation(
                        slice,
                        "TAKE_GEMS",
                        new JObject
                        {
                            ["coords"] = new JArray(
                                new JObject { ["r"] = 0, ["c"] = 0 },
                                new JObject { ["r"] = 0, ["c"] = 2 }
                            ),
                        }
                    )
                );

                var afterGap = slice.BuildAutomationStateSnapshot(1920, 1080);
                Assert.AreEqual("Gap detected.", afterGap.Value<string>("statusText"));
                Assert.AreEqual("Gap detected.", afterGap.Value<string>("errorBanner"));
                Assert.AreEqual(beforeEmptyHash, ((JObject)afterGap["replay"]).Value<string>("currentStateHash"));
                Assert.AreEqual(
                    0,
                    ((JObject)((JObject)afterGap["replay"])["liveRecording"]).Value<int>("recordedEvents")
                );

                var snapshot = GetMutableCurrentSnapshot(slice);
                snapshot["phase"] = "DRAFT_PHASE";
                RenderCurrentState(slice);

                var beforeWrongPhase = slice.BuildAutomationStateSnapshot(1920, 1080);
                var beforeWrongPhaseReplay = (JObject)beforeWrongPhase["replay"];
                var beforeWrongPhaseHash = beforeWrongPhaseReplay.Value<string>("currentStateHash");
                var gem = FindFirstCollectibleBoardGem((JObject)beforeWrongPhase["snapshot"], out _);
                Assert.AreEqual("DRAFT_PHASE", ((JObject)beforeWrongPhase["snapshot"]).Value<string>("phase"));
                Assert.IsFalse(
                    ApplyLiveRulesCommandForAutomation(
                        slice,
                        "TAKE_GEMS",
                        new JObject
                        {
                            ["coords"] = new JArray(
                                new JObject { ["r"] = gem.x, ["c"] = gem.y }
                            ),
                        }
                    )
                );

                var afterWrongPhase = slice.BuildAutomationStateSnapshot(1920, 1080);
                Assert.AreEqual(
                    "TAKE_GEMS is only allowed during the IDLE phase.",
                    afterWrongPhase.Value<string>("statusText")
                );
                Assert.AreEqual(
                    "TAKE_GEMS is only allowed during the IDLE phase.",
                    afterWrongPhase.Value<string>("errorBanner")
                );
                Assert.AreEqual(
                    beforeWrongPhaseHash,
                    ((JObject)afterWrongPhase["replay"]).Value<string>("currentStateHash")
                );
                Assert.AreEqual("DRAFT_PHASE", ((JObject)afterWrongPhase["snapshot"]).Value<string>("phase"));
                Assert.AreEqual(
                    0,
                    ((JObject)((JObject)afterWrongPhase["replay"])["liveRecording"]).Value<int>("recordedEvents")
                );
            }
            finally
            {
                Object.DestroyImmediate(root);
                CleanupRenderedSceneObjects();
            }
        }

        [Test]
        public void LiveReplenishRejectionsDoNotMutateStateOrReplayRecording()
        {
            var root = new GameObject("GemDuel Live Replenish Rejection Test");
            try
            {
                var slice = root.AddComponent<GemDuelGameController>();
                Assert.IsTrue(
                    slice.RunSemanticActionForAutomation(
                        "start_local_game",
                        new JObject { ["seed"] = "unity-editmode-live-replenish-rejections" },
                        out var startError
                    ),
                    startError
                );

                var snapshot = GetMutableCurrentSnapshot(slice);
                snapshot["bag"] = new JArray();
                RenderCurrentState(slice);

                var beforeEmptyBag = slice.BuildAutomationStateSnapshot(1920, 1080);
                var beforeEmptyBagReplay = (JObject)beforeEmptyBag["replay"];
                var beforeEmptyBagHash = beforeEmptyBagReplay.Value<string>("currentStateHash");
                Assert.AreEqual(0, ((JObject)beforeEmptyBagReplay["liveRecording"]).Value<int>("recordedEvents"));
                Assert.AreEqual(0, ((JArray)((JObject)beforeEmptyBag["snapshot"])["bag"]).Count);
                var emptyReplenishTarget = FindVisibleTarget(beforeEmptyBag, "turn.end");
                Assert.IsFalse(emptyReplenishTarget.Value<bool>("clickable"));
                Assert.AreEqual(
                    56d,
                    ((JObject)emptyReplenishTarget["rect"]).Value<double>("height"),
                    1.5d
                );

                Assert.IsFalse(ApplyLiveRulesCommandForAutomation(slice, "REPLENISH", new JObject()));

                var afterEmptyBag = slice.BuildAutomationStateSnapshot(1920, 1080);
                Assert.AreEqual("The bag is empty.", afterEmptyBag.Value<string>("statusText"));
                Assert.AreEqual("The bag is empty.", afterEmptyBag.Value<string>("errorBanner"));
                Assert.AreEqual(
                    beforeEmptyBagHash,
                    ((JObject)afterEmptyBag["replay"]).Value<string>("currentStateHash")
                );
                Assert.AreEqual(0, ((JArray)((JObject)afterEmptyBag["snapshot"])["bag"]).Count);
                Assert.AreEqual(
                    0,
                    ((JObject)((JObject)afterEmptyBag["replay"])["liveRecording"]).Value<int>("recordedEvents")
                );

                snapshot = GetMutableCurrentSnapshot(slice);
                snapshot["phase"] = "DRAFT_PHASE";
                snapshot["bag"] = new JArray("red");
                RenderCurrentState(slice);

                var beforeWrongPhase = slice.BuildAutomationStateSnapshot(1920, 1080);
                var beforeWrongPhaseReplay = (JObject)beforeWrongPhase["replay"];
                var beforeWrongPhaseHash = beforeWrongPhaseReplay.Value<string>("currentStateHash");
                Assert.AreEqual("DRAFT_PHASE", ((JObject)beforeWrongPhase["snapshot"]).Value<string>("phase"));
                Assert.AreEqual(1, ((JArray)((JObject)beforeWrongPhase["snapshot"])["bag"]).Count);

                Assert.IsFalse(ApplyLiveRulesCommandForAutomation(slice, "REPLENISH", new JObject()));

                var afterWrongPhase = slice.BuildAutomationStateSnapshot(1920, 1080);
                Assert.AreEqual(
                    "REPLENISH is only allowed during the IDLE phase.",
                    afterWrongPhase.Value<string>("statusText")
                );
                Assert.AreEqual(
                    "REPLENISH is only allowed during the IDLE phase.",
                    afterWrongPhase.Value<string>("errorBanner")
                );
                Assert.AreEqual(
                    beforeWrongPhaseHash,
                    ((JObject)afterWrongPhase["replay"]).Value<string>("currentStateHash")
                );
                Assert.AreEqual("DRAFT_PHASE", ((JObject)afterWrongPhase["snapshot"]).Value<string>("phase"));
                Assert.AreEqual(1, ((JArray)((JObject)afterWrongPhase["snapshot"])["bag"]).Count);
                Assert.AreEqual(
                    0,
                    ((JObject)((JObject)afterWrongPhase["replay"])["liveRecording"]).Value<int>("recordedEvents")
                );
            }
            finally
            {
                Object.DestroyImmediate(root);
                CleanupRenderedSceneObjects();
            }
        }

        [Test]
        public void LiveFollowUpRejectionsDoNotMutateStateOrReplayRecording()
        {
            var root = new GameObject("GemDuel Live Follow-Up Rejection Test");
            try
            {
                var slice = root.AddComponent<GemDuelGameController>();
                Assert.IsTrue(
                    slice.RunSemanticActionForAutomation(
                        "start_local_game",
                        new JObject { ["seed"] = "unity-editmode-live-follow-up-rejections" },
                        out var startError
                    ),
                    startError
                );

                var snapshot = GetMutableCurrentSnapshot(slice);
                var bonusGem = FindFirstCollectibleBoardGem(snapshot, out var bonusGemId);
                snapshot["phase"] = "BONUS_ACTION";
                snapshot["bonusGemTarget"] = GetDifferentGemColor(bonusGemId);
                RenderCurrentState(slice);

                var beforeWrongBonusColor = slice.BuildAutomationStateSnapshot(1920, 1080);
                var beforeWrongBonusColorReplay = (JObject)beforeWrongBonusColor["replay"];
                var beforeWrongBonusColorHash = beforeWrongBonusColorReplay.Value<string>("currentStateHash");
                Assert.AreEqual("BONUS_ACTION", ((JObject)beforeWrongBonusColor["snapshot"]).Value<string>("phase"));
                Assert.AreEqual(
                    0,
                    ((JObject)beforeWrongBonusColorReplay["liveRecording"]).Value<int>("recordedEvents")
                );

                Assert.IsFalse(
                    ApplyLiveRulesCommandForAutomation(
                        slice,
                        "TAKE_BONUS_GEM",
                        new JObject { ["r"] = bonusGem.x, ["c"] = bonusGem.y }
                    )
                );

                var afterWrongBonusColor = slice.BuildAutomationStateSnapshot(1920, 1080);
                Assert.AreEqual(
                    "Selected bonus gem does not match the required color.",
                    afterWrongBonusColor.Value<string>("statusText")
                );
                Assert.AreEqual(
                    "Selected bonus gem does not match the required color.",
                    afterWrongBonusColor.Value<string>("errorBanner")
                );
                Assert.AreEqual(
                    beforeWrongBonusColorHash,
                    ((JObject)afterWrongBonusColor["replay"]).Value<string>("currentStateHash")
                );
                Assert.AreEqual("BONUS_ACTION", ((JObject)afterWrongBonusColor["snapshot"]).Value<string>("phase"));
                Assert.AreEqual(
                    0,
                    ((JObject)((JObject)afterWrongBonusColor["replay"])["liveRecording"]).Value<int>("recordedEvents")
                );

                snapshot = GetMutableCurrentSnapshot(slice);
                snapshot["phase"] = "BONUS_ACTION";
                snapshot["bonusGemTarget"] = "red";
                ((JArray)((JArray)snapshot["board"])[0])[0] = "empty";
                RenderCurrentState(slice);

                var beforeEmptyBonus = slice.BuildAutomationStateSnapshot(1920, 1080);
                var beforeEmptyBonusReplay = (JObject)beforeEmptyBonus["replay"];
                var beforeEmptyBonusHash = beforeEmptyBonusReplay.Value<string>("currentStateHash");
                Assert.IsFalse(
                    ApplyLiveRulesCommandForAutomation(
                        slice,
                        "TAKE_BONUS_GEM",
                        new JObject { ["r"] = 0, ["c"] = 0 }
                    )
                );

                var afterEmptyBonus = slice.BuildAutomationStateSnapshot(1920, 1080);
                Assert.AreEqual("Selected bonus gem is not available.", afterEmptyBonus.Value<string>("statusText"));
                Assert.AreEqual("Selected bonus gem is not available.", afterEmptyBonus.Value<string>("errorBanner"));
                Assert.AreEqual(beforeEmptyBonusHash, ((JObject)afterEmptyBonus["replay"]).Value<string>("currentStateHash"));
                Assert.AreEqual("BONUS_ACTION", ((JObject)afterEmptyBonus["snapshot"]).Value<string>("phase"));
                Assert.AreEqual(
                    0,
                    ((JObject)((JObject)afterEmptyBonus["replay"])["liveRecording"]).Value<int>("recordedEvents")
                );

                snapshot = GetMutableCurrentSnapshot(slice);
                bonusGem = FindFirstCollectibleBoardGem(snapshot, out bonusGemId);
                snapshot["phase"] = "IDLE";
                snapshot["bonusGemTarget"] = bonusGemId;
                RenderCurrentState(slice);

                var beforeWrongBonusPhase = slice.BuildAutomationStateSnapshot(1920, 1080);
                var beforeWrongBonusPhaseReplay = (JObject)beforeWrongBonusPhase["replay"];
                var beforeWrongBonusPhaseHash = beforeWrongBonusPhaseReplay.Value<string>("currentStateHash");
                Assert.IsFalse(
                    ApplyLiveRulesCommandForAutomation(
                        slice,
                        "TAKE_BONUS_GEM",
                        new JObject { ["r"] = bonusGem.x, ["c"] = bonusGem.y }
                    )
                );

                var afterWrongBonusPhase = slice.BuildAutomationStateSnapshot(1920, 1080);
                Assert.AreEqual(
                    "TAKE_BONUS_GEM is only allowed during the BONUS_ACTION phase.",
                    afterWrongBonusPhase.Value<string>("statusText")
                );
                Assert.AreEqual(
                    "TAKE_BONUS_GEM is only allowed during the BONUS_ACTION phase.",
                    afterWrongBonusPhase.Value<string>("errorBanner")
                );
                Assert.AreEqual(
                    beforeWrongBonusPhaseHash,
                    ((JObject)afterWrongBonusPhase["replay"]).Value<string>("currentStateHash")
                );
                Assert.AreEqual("IDLE", ((JObject)afterWrongBonusPhase["snapshot"]).Value<string>("phase"));
                Assert.AreEqual(
                    0,
                    ((JObject)((JObject)afterWrongBonusPhase["replay"])["liveRecording"]).Value<int>("recordedEvents")
                );

                snapshot = GetMutableCurrentSnapshot(slice);
                snapshot["phase"] = "DISCARD_EXCESS_GEMS";
                ((JObject)((JObject)snapshot["inventories"])["p1"])["red"] = 0;
                RenderCurrentState(slice);

                var beforeNotOwnedDiscard = slice.BuildAutomationStateSnapshot(1920, 1080);
                var beforeNotOwnedDiscardReplay = (JObject)beforeNotOwnedDiscard["replay"];
                var beforeNotOwnedDiscardHash = beforeNotOwnedDiscardReplay.Value<string>("currentStateHash");
                Assert.IsFalse(
                    ApplyLiveRulesCommandForAutomation(
                        slice,
                        "DISCARD_GEM",
                        new JObject { ["gemId"] = "red" }
                    )
                );

                var afterNotOwnedDiscard = slice.BuildAutomationStateSnapshot(1920, 1080);
                Assert.AreEqual("The active player does not own that gem.", afterNotOwnedDiscard.Value<string>("statusText"));
                Assert.AreEqual("The active player does not own that gem.", afterNotOwnedDiscard.Value<string>("errorBanner"));
                Assert.AreEqual(
                    beforeNotOwnedDiscardHash,
                    ((JObject)afterNotOwnedDiscard["replay"]).Value<string>("currentStateHash")
                );
                Assert.AreEqual(
                    0,
                    ((JObject)((JObject)afterNotOwnedDiscard["replay"])["liveRecording"]).Value<int>("recordedEvents")
                );

                snapshot = GetMutableCurrentSnapshot(slice);
                snapshot["phase"] = "IDLE";
                ((JObject)((JObject)snapshot["inventories"])["p1"])["red"] = 1;
                RenderCurrentState(slice);

                var beforeWrongDiscardPhase = slice.BuildAutomationStateSnapshot(1920, 1080);
                var beforeWrongDiscardPhaseReplay = (JObject)beforeWrongDiscardPhase["replay"];
                var beforeWrongDiscardPhaseHash = beforeWrongDiscardPhaseReplay.Value<string>("currentStateHash");
                Assert.IsFalse(
                    ApplyLiveRulesCommandForAutomation(
                        slice,
                        "DISCARD_GEM",
                        new JObject { ["gemId"] = "red" }
                    )
                );

                var afterWrongDiscardPhase = slice.BuildAutomationStateSnapshot(1920, 1080);
                Assert.AreEqual(
                    "DISCARD_GEM is only allowed during the DISCARD_EXCESS_GEMS phase.",
                    afterWrongDiscardPhase.Value<string>("statusText")
                );
                Assert.AreEqual(
                    "DISCARD_GEM is only allowed during the DISCARD_EXCESS_GEMS phase.",
                    afterWrongDiscardPhase.Value<string>("errorBanner")
                );
                Assert.AreEqual(
                    beforeWrongDiscardPhaseHash,
                    ((JObject)afterWrongDiscardPhase["replay"]).Value<string>("currentStateHash")
                );
                Assert.AreEqual(
                    0,
                    ((JObject)((JObject)afterWrongDiscardPhase["replay"])["liveRecording"]).Value<int>("recordedEvents")
                );

                snapshot = GetMutableCurrentSnapshot(slice);
                snapshot["phase"] = "STEAL_ACTION";
                ((JObject)((JObject)snapshot["inventories"])["p2"])["red"] = 0;
                RenderCurrentState(slice);

                var beforeGoldSteal = slice.BuildAutomationStateSnapshot(1920, 1080);
                var beforeGoldStealReplay = (JObject)beforeGoldSteal["replay"];
                var beforeGoldStealHash = beforeGoldStealReplay.Value<string>("currentStateHash");
                Assert.IsFalse(
                    ApplyLiveRulesCommandForAutomation(
                        slice,
                        "STEAL_GEM",
                        new JObject { ["gemId"] = "gold" }
                    )
                );

                var afterGoldSteal = slice.BuildAutomationStateSnapshot(1920, 1080);
                Assert.AreEqual("Gold cannot be stolen.", afterGoldSteal.Value<string>("statusText"));
                Assert.AreEqual("Gold cannot be stolen.", afterGoldSteal.Value<string>("errorBanner"));
                Assert.AreEqual(beforeGoldStealHash, ((JObject)afterGoldSteal["replay"]).Value<string>("currentStateHash"));
                Assert.AreEqual(
                    0,
                    ((JObject)((JObject)afterGoldSteal["replay"])["liveRecording"]).Value<int>("recordedEvents")
                );

                var beforeNotOwnedSteal = slice.BuildAutomationStateSnapshot(1920, 1080);
                var beforeNotOwnedStealReplay = (JObject)beforeNotOwnedSteal["replay"];
                var beforeNotOwnedStealHash = beforeNotOwnedStealReplay.Value<string>("currentStateHash");
                Assert.IsFalse(
                    ApplyLiveRulesCommandForAutomation(
                        slice,
                        "STEAL_GEM",
                        new JObject { ["gemId"] = "red" }
                    )
                );

                var afterNotOwnedSteal = slice.BuildAutomationStateSnapshot(1920, 1080);
                Assert.AreEqual(
                    "The opponent does not own the requested gem.",
                    afterNotOwnedSteal.Value<string>("statusText")
                );
                Assert.AreEqual(
                    "The opponent does not own the requested gem.",
                    afterNotOwnedSteal.Value<string>("errorBanner")
                );
                Assert.AreEqual(
                    beforeNotOwnedStealHash,
                    ((JObject)afterNotOwnedSteal["replay"]).Value<string>("currentStateHash")
                );
                Assert.AreEqual(
                    0,
                    ((JObject)((JObject)afterNotOwnedSteal["replay"])["liveRecording"]).Value<int>("recordedEvents")
                );

                snapshot = GetMutableCurrentSnapshot(slice);
                snapshot["phase"] = "IDLE";
                ((JObject)((JObject)snapshot["inventories"])["p2"])["red"] = 1;
                RenderCurrentState(slice);

                var beforeWrongStealPhase = slice.BuildAutomationStateSnapshot(1920, 1080);
                var beforeWrongStealPhaseReplay = (JObject)beforeWrongStealPhase["replay"];
                var beforeWrongStealPhaseHash = beforeWrongStealPhaseReplay.Value<string>("currentStateHash");
                Assert.IsFalse(
                    ApplyLiveRulesCommandForAutomation(
                        slice,
                        "STEAL_GEM",
                        new JObject { ["gemId"] = "red" }
                    )
                );

                var afterWrongStealPhase = slice.BuildAutomationStateSnapshot(1920, 1080);
                Assert.AreEqual(
                    "STEAL_GEM is only allowed during the STEAL_ACTION phase.",
                    afterWrongStealPhase.Value<string>("statusText")
                );
                Assert.AreEqual(
                    "STEAL_GEM is only allowed during the STEAL_ACTION phase.",
                    afterWrongStealPhase.Value<string>("errorBanner")
                );
                Assert.AreEqual(
                    beforeWrongStealPhaseHash,
                    ((JObject)afterWrongStealPhase["replay"]).Value<string>("currentStateHash")
                );
                Assert.AreEqual(
                    0,
                    ((JObject)((JObject)afterWrongStealPhase["replay"])["liveRecording"]).Value<int>("recordedEvents")
                );
            }
            finally
            {
                Object.DestroyImmediate(root);
                CleanupRenderedSceneObjects();
            }
        }

        [Test]
        public void LiveDiscardSequenceContinuesUntilPhaseResolves()
        {
            var root = new GameObject("GemDuel Live Discard Phase Resolution Test");
            try
            {
                var slice = root.AddComponent<GemDuelGameController>();
                Assert.IsTrue(
                    slice.RunSemanticActionForAutomation(
                        "start_local_game",
                        new JObject { ["seed"] = "unity-editmode-live-discard-phase-resolution" },
                        out var startError
                    ),
                    startError
                );

                var snapshot = GetMutableCurrentSnapshot(slice);
                snapshot["phase"] = "DISCARD_EXCESS_GEMS";
                ((JObject)snapshot["inventories"])["p1"] = new JObject
                {
                    ["red"] = 12,
                    ["green"] = 0,
                    ["blue"] = 0,
                    ["white"] = 0,
                    ["black"] = 0,
                    ["pearl"] = 0,
                    ["gold"] = 0,
                };
                RenderCurrentState(slice);

                var before = slice.BuildAutomationStateSnapshot(1920, 1080);
                var beforeSnapshot = (JObject)before["snapshot"];
                var beforeReplay = (JObject)before["replay"];
                var beforeHash = beforeReplay.Value<string>("currentStateHash");
                Assert.AreEqual("DISCARD_EXCESS_GEMS", beforeSnapshot.Value<string>("phase"));
                Assert.AreEqual("p1", beforeSnapshot.Value<string>("turn"));
                Assert.AreEqual(12, ((JObject)((JObject)beforeSnapshot["inventories"])["p1"]).Value<int>("red"));
                Assert.AreEqual(0, ((JObject)beforeReplay["liveRecording"]).Value<int>("recordedEvents"));

                Assert.IsTrue(
                    ApplyLiveRulesCommandForAutomation(
                        slice,
                        "DISCARD_GEM",
                        new JObject { ["gemId"] = "red" }
                    )
                );

                var afterFirst = slice.BuildAutomationStateSnapshot(1920, 1080);
                var afterFirstSnapshot = (JObject)afterFirst["snapshot"];
                var afterFirstReplay = (JObject)afterFirst["replay"];
                var afterFirstHash = afterFirstReplay.Value<string>("currentStateHash");
                Assert.AreEqual("Applied live action | DISCARD_GEM", afterFirst.Value<string>("statusText"));
                Assert.IsTrue(string.IsNullOrEmpty(afterFirst.Value<string>("errorBanner")));
                Assert.AreNotEqual(beforeHash, afterFirstHash);
                Assert.AreEqual("DISCARD_EXCESS_GEMS", afterFirstSnapshot.Value<string>("phase"));
                Assert.AreEqual("p1", afterFirstSnapshot.Value<string>("turn"));
                Assert.AreEqual(
                    11,
                    ((JObject)((JObject)afterFirstSnapshot["inventories"])["p1"]).Value<int>("red")
                );
                Assert.AreEqual(1, ((JObject)afterFirstReplay["liveRecording"]).Value<int>("recordedEvents"));

                Assert.IsTrue(
                    ApplyLiveRulesCommandForAutomation(
                        slice,
                        "DISCARD_GEM",
                        new JObject { ["gemId"] = "red" }
                    )
                );

                var afterSecond = slice.BuildAutomationStateSnapshot(1920, 1080);
                var afterSecondSnapshot = (JObject)afterSecond["snapshot"];
                var afterSecondReplay = (JObject)afterSecond["replay"];
                Assert.AreEqual("Applied live action | DISCARD_GEM", afterSecond.Value<string>("statusText"));
                Assert.IsTrue(string.IsNullOrEmpty(afterSecond.Value<string>("errorBanner")));
                Assert.AreNotEqual(afterFirstHash, afterSecondReplay.Value<string>("currentStateHash"));
                Assert.AreEqual("IDLE", afterSecondSnapshot.Value<string>("phase"));
                Assert.AreEqual("p2", afterSecondSnapshot.Value<string>("turn"));
                Assert.AreEqual(
                    10,
                    ((JObject)((JObject)afterSecondSnapshot["inventories"])["p1"]).Value<int>("red")
                );
                Assert.AreEqual(2, ((JObject)afterSecondReplay["liveRecording"]).Value<int>("recordedEvents"));
                Assert.IsTrue(((JObject)afterSecondReplay["liveRecording"]).Value<bool>("canExport"));
                Assert.AreEqual(
                    afterSecondReplay.Value<string>("currentStateHash"),
                    ((JObject)afterSecondReplay["liveRecording"]).Value<string>("summaryFinalStateHash")
                );
            }
            finally
            {
                Object.DestroyImmediate(root);
                CleanupRenderedSceneObjects();
            }
        }

        [Test]
        public void LiveBonusAndStealFollowUpsResolveThroughLiveBridge()
        {
            var bonusRoot = new GameObject("GemDuel Live Bonus Phase Resolution Test");
            var stealRoot = new GameObject("GemDuel Live Steal Phase Resolution Test");
            try
            {
                var bonusSlice = bonusRoot.AddComponent<GemDuelGameController>();
                Assert.IsTrue(
                    bonusSlice.RunSemanticActionForAutomation(
                        "start_local_game",
                        new JObject { ["seed"] = "unity-editmode-live-bonus-phase-resolution" },
                        out var bonusStartError
                    ),
                    bonusStartError
                );

                var bonusSetup = GetMutableCurrentSnapshot(bonusSlice);
                var bonusGem = FindFirstCollectibleBoardGem(bonusSetup, out var bonusGemId);
                bonusSetup["phase"] = "BONUS_ACTION";
                bonusSetup["bonusGemTarget"] = bonusGemId;
                RenderCurrentState(bonusSlice);

                var beforeBonus = bonusSlice.BuildAutomationStateSnapshot(1920, 1080);
                var beforeBonusSnapshot = (JObject)beforeBonus["snapshot"];
                var beforeBonusReplay = (JObject)beforeBonus["replay"];
                var beforeBonusHash = beforeBonusReplay.Value<string>("currentStateHash");
                var beforeBonusInventory = ((JObject)((JObject)beforeBonusSnapshot["inventories"])["p1"])
                    .Value<int>(bonusGemId);
                Assert.AreEqual("BONUS_ACTION", beforeBonusSnapshot.Value<string>("phase"));
                Assert.AreEqual("p1", beforeBonusSnapshot.Value<string>("turn"));
                Assert.AreEqual(0, ((JObject)beforeBonusReplay["liveRecording"]).Value<int>("recordedEvents"));

                Assert.IsTrue(
                    ApplyLiveRulesCommandForAutomation(
                        bonusSlice,
                        "TAKE_BONUS_GEM",
                        new JObject { ["r"] = bonusGem.x, ["c"] = bonusGem.y }
                    )
                );

                var afterBonus = bonusSlice.BuildAutomationStateSnapshot(1920, 1080);
                var afterBonusSnapshot = (JObject)afterBonus["snapshot"];
                var afterBonusReplay = (JObject)afterBonus["replay"];
                Assert.AreEqual("Applied live action | TAKE_BONUS_GEM", afterBonus.Value<string>("statusText"));
                Assert.IsTrue(string.IsNullOrEmpty(afterBonus.Value<string>("errorBanner")));
                Assert.AreNotEqual(beforeBonusHash, afterBonusReplay.Value<string>("currentStateHash"));
                Assert.AreEqual("IDLE", afterBonusSnapshot.Value<string>("phase"));
                Assert.AreEqual("p2", afterBonusSnapshot.Value<string>("turn"));
                Assert.AreEqual(
                    "empty",
                    ((JArray)((JArray)afterBonusSnapshot["board"])[bonusGem.x])[bonusGem.y].Value<string>()
                );
                Assert.AreEqual(
                    beforeBonusInventory + 1,
                    ((JObject)((JObject)afterBonusSnapshot["inventories"])["p1"]).Value<int>(bonusGemId)
                );
                Assert.AreEqual(1, ((JObject)afterBonusReplay["liveRecording"]).Value<int>("recordedEvents"));
                Assert.AreEqual(
                    afterBonusReplay.Value<string>("currentStateHash"),
                    ((JObject)afterBonusReplay["liveRecording"]).Value<string>("summaryFinalStateHash")
                );
                Assert.IsTrue(bonusSlice.ExportReplayJsonForAutomation(out var bonusReplayJson, out var bonusExportError), bonusExportError);
                var bonusReplay = JsonConvert.DeserializeObject<ReplayVNext>(bonusReplayJson);
                Assert.NotNull(bonusReplay);
                Assert.AreEqual(1, bonusReplay.Events.Count);
                Assert.AreEqual("take_bonus_gem", bonusReplay.Events[0].Value<string>("type"));
                Assert.AreEqual(afterBonusReplay.Value<string>("currentStateHash"), bonusReplay.Summary.FinalStateHash);

                var stealSlice = stealRoot.AddComponent<GemDuelGameController>();
                Assert.IsTrue(
                    stealSlice.RunSemanticActionForAutomation(
                        "start_local_game",
                        new JObject { ["seed"] = "unity-editmode-live-steal-phase-resolution" },
                        out var stealStartError
                    ),
                    stealStartError
                );

                var stealSetup = GetMutableCurrentSnapshot(stealSlice);
                stealSetup["phase"] = "STEAL_ACTION";
                ((JObject)((JObject)stealSetup["inventories"])["p1"])["red"] = 0;
                ((JObject)((JObject)stealSetup["inventories"])["p2"])["red"] = 1;
                RenderCurrentState(stealSlice);

                var beforeSteal = stealSlice.BuildAutomationStateSnapshot(1920, 1080);
                var beforeStealSnapshot = (JObject)beforeSteal["snapshot"];
                var beforeStealReplay = (JObject)beforeSteal["replay"];
                var beforeStealHash = beforeStealReplay.Value<string>("currentStateHash");
                Assert.AreEqual("STEAL_ACTION", beforeStealSnapshot.Value<string>("phase"));
                Assert.AreEqual("p1", beforeStealSnapshot.Value<string>("turn"));
                Assert.AreEqual(0, ((JObject)beforeStealReplay["liveRecording"]).Value<int>("recordedEvents"));

                Assert.IsTrue(
                    ApplyLiveRulesCommandForAutomation(
                        stealSlice,
                        "STEAL_GEM",
                        new JObject { ["gemId"] = "red" }
                    )
                );

                var afterSteal = stealSlice.BuildAutomationStateSnapshot(1920, 1080);
                var afterStealSnapshot = (JObject)afterSteal["snapshot"];
                var afterStealReplay = (JObject)afterSteal["replay"];
                Assert.AreEqual("Applied live action | STEAL_GEM", afterSteal.Value<string>("statusText"));
                Assert.IsTrue(string.IsNullOrEmpty(afterSteal.Value<string>("errorBanner")));
                Assert.AreNotEqual(beforeStealHash, afterStealReplay.Value<string>("currentStateHash"));
                Assert.AreEqual("IDLE", afterStealSnapshot.Value<string>("phase"));
                Assert.AreEqual("p2", afterStealSnapshot.Value<string>("turn"));
                Assert.AreEqual(1, ((JObject)((JObject)afterStealSnapshot["inventories"])["p1"]).Value<int>("red"));
                Assert.AreEqual(0, ((JObject)((JObject)afterStealSnapshot["inventories"])["p2"]).Value<int>("red"));
                Assert.AreEqual(1, ((JObject)afterStealReplay["liveRecording"]).Value<int>("recordedEvents"));
                Assert.AreEqual(
                    afterStealReplay.Value<string>("currentStateHash"),
                    ((JObject)afterStealReplay["liveRecording"]).Value<string>("summaryFinalStateHash")
                );
                Assert.IsTrue(stealSlice.ExportReplayJsonForAutomation(out var stealReplayJson, out var stealExportError), stealExportError);
                var stealReplay = JsonConvert.DeserializeObject<ReplayVNext>(stealReplayJson);
                Assert.NotNull(stealReplay);
                Assert.AreEqual(1, stealReplay.Events.Count);
                Assert.AreEqual("steal_gem", stealReplay.Events[0].Value<string>("type"));
                Assert.AreEqual(afterStealReplay.Value<string>("currentStateHash"), stealReplay.Summary.FinalStateHash);
            }
            finally
            {
                Object.DestroyImmediate(bonusRoot);
                Object.DestroyImmediate(stealRoot);
                CleanupRenderedSceneObjects();
            }
        }

        [Test]
        public void LiveFollowUpWrongActorDoesNotMutateStateOrReplayRecording()
        {
            var root = new GameObject("GemDuel Live Follow-Up Wrong Actor Test");
            try
            {
                var slice = root.AddComponent<GemDuelGameController>();
                Assert.IsTrue(
                    slice.RunSemanticActionForAutomation(
                        "start_local_game",
                        new JObject { ["seed"] = "unity-editmode-live-follow-up-wrong-actor" },
                        out var startError
                    ),
                    startError
                );

                var snapshot = GetMutableCurrentSnapshot(slice);
                var bonusGem = FindFirstCollectibleBoardGem(snapshot, out var bonusGemId);
                snapshot["phase"] = "BONUS_ACTION";
                snapshot["bonusGemTarget"] = bonusGemId;
                RenderCurrentState(slice);

                var beforeBonus = slice.BuildAutomationStateSnapshot(1920, 1080);
                var beforeBonusSnapshot = (JObject)beforeBonus["snapshot"];
                var beforeBonusReplay = (JObject)beforeBonus["replay"];
                var beforeBonusHash = beforeBonusReplay.Value<string>("currentStateHash");
                var beforeBonusInventory = ((JObject)((JObject)beforeBonusSnapshot["inventories"])["p1"])
                    .Value<int>(bonusGemId);
                Assert.AreEqual("BONUS_ACTION", beforeBonusSnapshot.Value<string>("phase"));
                Assert.AreEqual("p1", beforeBonusSnapshot.Value<string>("turn"));
                Assert.AreEqual(
                    0,
                    ((JObject)beforeBonusReplay["liveRecording"]).Value<int>("recordedEvents")
                );

                Assert.IsFalse(
                    ApplyLiveRulesCommandForAutomation(
                        slice,
                        "TAKE_BONUS_GEM",
                        new JObject { ["r"] = bonusGem.x, ["c"] = bonusGem.y },
                        "p2"
                    )
                );

                var afterBonus = slice.BuildAutomationStateSnapshot(1920, 1080);
                var afterBonusSnapshot = (JObject)afterBonus["snapshot"];
                Assert.AreEqual(
                    "Command actor p2 does not match active player p1.",
                    afterBonus.Value<string>("statusText")
                );
                Assert.AreEqual(
                    "Command actor p2 does not match active player p1.",
                    afterBonus.Value<string>("errorBanner")
                );
                Assert.AreEqual(beforeBonusHash, ((JObject)afterBonus["replay"]).Value<string>("currentStateHash"));
                Assert.AreEqual("BONUS_ACTION", afterBonusSnapshot.Value<string>("phase"));
                Assert.AreEqual("p1", afterBonusSnapshot.Value<string>("turn"));
                Assert.AreEqual(
                    bonusGemId,
                    ((JArray)((JArray)afterBonusSnapshot["board"])[bonusGem.x])[bonusGem.y].Value<string>()
                );
                Assert.AreEqual(
                    beforeBonusInventory,
                    ((JObject)((JObject)afterBonusSnapshot["inventories"])["p1"]).Value<int>(bonusGemId)
                );
                Assert.AreEqual(
                    0,
                    ((JObject)((JObject)afterBonus["replay"])["liveRecording"]).Value<int>("recordedEvents")
                );

                snapshot = GetMutableCurrentSnapshot(slice);
                snapshot["phase"] = "DISCARD_EXCESS_GEMS";
                ((JObject)((JObject)snapshot["inventories"])["p1"])["red"] = 1;
                RenderCurrentState(slice);

                var beforeDiscard = slice.BuildAutomationStateSnapshot(1920, 1080);
                var beforeDiscardSnapshot = (JObject)beforeDiscard["snapshot"];
                var beforeDiscardReplay = (JObject)beforeDiscard["replay"];
                var beforeDiscardHash = beforeDiscardReplay.Value<string>("currentStateHash");
                var beforeDiscardRed = ((JObject)((JObject)beforeDiscardSnapshot["inventories"])["p1"])
                    .Value<int>("red");
                Assert.AreEqual("DISCARD_EXCESS_GEMS", beforeDiscardSnapshot.Value<string>("phase"));
                Assert.AreEqual("p1", beforeDiscardSnapshot.Value<string>("turn"));

                Assert.IsFalse(
                    ApplyLiveRulesCommandForAutomation(
                        slice,
                        "DISCARD_GEM",
                        new JObject { ["gemId"] = "red" },
                        "p2"
                    )
                );

                var afterDiscard = slice.BuildAutomationStateSnapshot(1920, 1080);
                var afterDiscardSnapshot = (JObject)afterDiscard["snapshot"];
                Assert.AreEqual(
                    "Command actor p2 does not match active player p1.",
                    afterDiscard.Value<string>("statusText")
                );
                Assert.AreEqual(
                    "Command actor p2 does not match active player p1.",
                    afterDiscard.Value<string>("errorBanner")
                );
                Assert.AreEqual(
                    beforeDiscardHash,
                    ((JObject)afterDiscard["replay"]).Value<string>("currentStateHash")
                );
                Assert.AreEqual("DISCARD_EXCESS_GEMS", afterDiscardSnapshot.Value<string>("phase"));
                Assert.AreEqual("p1", afterDiscardSnapshot.Value<string>("turn"));
                Assert.AreEqual(
                    beforeDiscardRed,
                    ((JObject)((JObject)afterDiscardSnapshot["inventories"])["p1"]).Value<int>("red")
                );
                Assert.AreEqual(
                    0,
                    ((JObject)((JObject)afterDiscard["replay"])["liveRecording"]).Value<int>("recordedEvents")
                );

                snapshot = GetMutableCurrentSnapshot(slice);
                snapshot["phase"] = "STEAL_ACTION";
                ((JObject)((JObject)snapshot["inventories"])["p2"])["red"] = 1;
                RenderCurrentState(slice);

                var beforeSteal = slice.BuildAutomationStateSnapshot(1920, 1080);
                var beforeStealSnapshot = (JObject)beforeSteal["snapshot"];
                var beforeStealReplay = (JObject)beforeSteal["replay"];
                var beforeStealHash = beforeStealReplay.Value<string>("currentStateHash");
                var beforeStealP1Red = ((JObject)((JObject)beforeStealSnapshot["inventories"])["p1"])
                    .Value<int>("red");
                var beforeStealP2Red = ((JObject)((JObject)beforeStealSnapshot["inventories"])["p2"])
                    .Value<int>("red");
                Assert.AreEqual("STEAL_ACTION", beforeStealSnapshot.Value<string>("phase"));
                Assert.AreEqual("p1", beforeStealSnapshot.Value<string>("turn"));

                Assert.IsFalse(
                    ApplyLiveRulesCommandForAutomation(
                        slice,
                        "STEAL_GEM",
                        new JObject { ["gemId"] = "red" },
                        "p2"
                    )
                );

                var afterSteal = slice.BuildAutomationStateSnapshot(1920, 1080);
                var afterStealSnapshot = (JObject)afterSteal["snapshot"];
                Assert.AreEqual(
                    "Command actor p2 does not match active player p1.",
                    afterSteal.Value<string>("statusText")
                );
                Assert.AreEqual(
                    "Command actor p2 does not match active player p1.",
                    afterSteal.Value<string>("errorBanner")
                );
                Assert.AreEqual(beforeStealHash, ((JObject)afterSteal["replay"]).Value<string>("currentStateHash"));
                Assert.AreEqual("STEAL_ACTION", afterStealSnapshot.Value<string>("phase"));
                Assert.AreEqual("p1", afterStealSnapshot.Value<string>("turn"));
                Assert.AreEqual(
                    beforeStealP1Red,
                    ((JObject)((JObject)afterStealSnapshot["inventories"])["p1"]).Value<int>("red")
                );
                Assert.AreEqual(
                    beforeStealP2Red,
                    ((JObject)((JObject)afterStealSnapshot["inventories"])["p2"]).Value<int>("red")
                );
                Assert.AreEqual(
                    0,
                    ((JObject)((JObject)afterSteal["replay"])["liveRecording"]).Value<int>("recordedEvents")
                );
            }
            finally
            {
                Object.DestroyImmediate(root);
                CleanupRenderedSceneObjects();
            }
        }

        [Test]
        public void LocalDevRecoveryRestoresLiveRulesBridgeStateAndContinuesCommands()
        {
            DeleteLocalDevRecoverySave();
            var root = new GameObject("GemDuel LocalDev Recovery Source Test");
            GameObject recoveredRoot = null;
            try
            {
                var slice = root.AddComponent<GemDuelGameController>();
                Assert.IsTrue(
                    slice.RunSemanticActionForAutomation(
                        "start_local_game",
                        new JObject { ["seed"] = "unity-editmode-live-recovery" },
                        out var startError
                    ),
                    startError
                );

                var start = slice.BuildAutomationStateSnapshot(1920, 1080);
                var startSnapshot = (JObject)start["snapshot"];
                var p1Gem = FindFirstCollectibleBoardGem(startSnapshot, out _);
                Assert.IsTrue(
                    slice.RunSemanticActionForAutomation(
                        "click_board_cell",
                        new JObject { ["row"] = p1Gem.x, ["column"] = p1Gem.y },
                        out var selectError
                    ),
                    selectError
                );
                Assert.IsTrue(
                    slice.RunSemanticActionForAutomation("confirm_gem_selection", null, out var confirmError),
                    confirmError
                );

                var saved = slice.BuildAutomationStateSnapshot(1920, 1080);
                var savedSnapshot = (JObject)saved["snapshot"];
                var savedRecovery = (JObject)saved["recovery"];
                var savedLiveRecording = (JObject)((JObject)saved["replay"])["liveRecording"];
                var savedHash = savedRecovery.Value<string>("currentStateHash");
                Assert.AreEqual("IDLE", savedSnapshot.Value<string>("phase"));
                Assert.AreEqual("p2", savedSnapshot.Value<string>("turn"));
                Assert.AreEqual("saved", savedRecovery.Value<string>("status"));
                Assert.AreEqual("live-rules-engine", savedRecovery.Value<string>("kind"));
                Assert.IsTrue(savedRecovery.Value<bool>("availableForCurrentState"));
                Assert.NotNull(savedLiveRecording);
                Assert.AreEqual(1, savedLiveRecording.Value<int>("recordedEvents"));
                Assert.AreEqual(savedHash, savedLiveRecording.Value<string>("summaryFinalStateHash"));
                Assert.IsTrue(File.Exists(ResolveLocalDevRecoveryPath()));

                Object.DestroyImmediate(root);
                CleanupRenderedSceneObjects();

                recoveredRoot = new GameObject("GemDuel LocalDev Recovery Restored Test");
                var recovered = recoveredRoot.AddComponent<GemDuelGameController>();
                Assert.IsTrue(recovered.LoadRecoveredGameForAutomation(out var recoveryError), recoveryError);

                var restored = recovered.BuildAutomationStateSnapshot(1920, 1080);
                var restoredSnapshot = (JObject)restored["snapshot"];
                var restoredRecovery = (JObject)restored["recovery"];
                var restoredLiveRecording = (JObject)((JObject)restored["replay"])["liveRecording"];
                Assert.AreEqual(saved.Value<int>("revision"), restored.Value<int>("revision"));
                Assert.AreEqual(savedSnapshot.Value<string>("phase"), restoredSnapshot.Value<string>("phase"));
                Assert.AreEqual(savedSnapshot.Value<string>("turn"), restoredSnapshot.Value<string>("turn"));
                Assert.AreEqual("loaded", restoredRecovery.Value<string>("status"));
                Assert.AreEqual(savedHash, restoredRecovery.Value<string>("currentStateHash"));
                Assert.NotNull(restoredLiveRecording);
                Assert.AreEqual(1, restoredLiveRecording.Value<int>("recordedEvents"));
                Assert.AreEqual(savedHash, restoredLiveRecording.Value<string>("summaryFinalStateHash"));

                var p2Gem = FindFirstCollectibleBoardGem(restoredSnapshot, out _);
                Assert.IsTrue(
                    recovered.RunSemanticActionForAutomation(
                        "click_board_cell",
                        new JObject { ["row"] = p2Gem.x, ["column"] = p2Gem.y },
                        out var p2SelectError
                    ),
                    p2SelectError
                );
                Assert.IsTrue(
                    recovered.RunSemanticActionForAutomation("confirm_gem_selection", null, out var p2ConfirmError),
                    p2ConfirmError
                );

                var continued = recovered.BuildAutomationStateSnapshot(1920, 1080);
                var continuedSnapshot = (JObject)continued["snapshot"];
                var continuedRecovery = (JObject)continued["recovery"];
                var continuedLiveRecording = (JObject)((JObject)continued["replay"])["liveRecording"];
                Assert.AreEqual("IDLE", continuedSnapshot.Value<string>("phase"));
                Assert.AreEqual("p1", continuedSnapshot.Value<string>("turn"));
                Assert.AreEqual("Applied live action | TAKE_GEMS", continued.Value<string>("statusText"));
                Assert.AreEqual("saved", continuedRecovery.Value<string>("status"));
                Assert.AreNotEqual(savedHash, continuedRecovery.Value<string>("currentStateHash"));
                Assert.NotNull(continuedLiveRecording);
                Assert.AreEqual(2, continuedLiveRecording.Value<int>("recordedEvents"));
                Assert.AreEqual(
                    continuedRecovery.Value<string>("currentStateHash"),
                    continuedLiveRecording.Value<string>("summaryFinalStateHash")
                );
                Assert.IsTrue(recovered.ExportReplayJsonForAutomation(out var exportedJson, out var exportError), exportError);
                var exportedReplay = JsonConvert.DeserializeObject<ReplayVNext>(exportedJson);
                Assert.NotNull(exportedReplay);
                Assert.AreEqual(2, exportedReplay.Events.Count);
                Assert.AreEqual(3, exportedReplay.Checkpoints.Count);
            }
            finally
            {
                if (root != null)
                {
                    Object.DestroyImmediate(root);
                }

                if (recoveredRoot != null)
                {
                    Object.DestroyImmediate(recoveredRoot);
                }

                DeleteLocalDevRecoverySave();
                CleanupRenderedSceneObjects();
            }
        }

        [Test]
        public void LocalDevRecoveryReleasePathSmokeReloadsAndContinuesLiveReplay()
        {
            DeleteLocalDevRecoverySave();
            var root = new GameObject("GemDuel LocalDev Recovery Release Path Smoke Test");
            try
            {
                var slice = root.AddComponent<GemDuelGameController>();
                var report = LocalDevRecoveryReleasePathSmoke.Run(
                    slice,
                    new LocalDevRecoveryReleasePathSmokeOptions
                    {
                        Seed = "unity-editmode-recovery-release-path-smoke",
                    }
                );

                Assert.IsTrue(report.Value<bool>("ok"), report.ToString(Formatting.Indented));
                Assert.IsFalse(report.Value<bool>("usedFixtureReplayAsGameplayDriver"));
                Assert.IsFalse(report.Value<bool>("usedCheckpointStateReplacement"));
                var recovery = (JObject)report["recoverySummary"];
                Assert.AreEqual("saved", recovery.Value<string>("savedStatus"));
                Assert.AreEqual("loaded", recovery.Value<string>("restoredStatus"));
                Assert.AreEqual("saved", recovery.Value<string>("continuedStatus"));
                Assert.AreEqual(
                    recovery.Value<string>("savedStateHash"),
                    recovery.Value<string>("restoredStateHash")
                );
                Assert.AreNotEqual(
                    recovery.Value<string>("savedStateHash"),
                    recovery.Value<string>("continuedStateHash")
                );
                Assert.AreEqual(1, recovery.Value<int>("savedRecordedEvents"));
                Assert.AreEqual(1, recovery.Value<int>("restoredRecordedEvents"));
                Assert.AreEqual(2, recovery.Value<int>("continuedRecordedEvents"));

                var replayHashes = (JObject)report["replayHashSummary"];
                Assert.AreEqual(2, replayHashes.Value<int>("exportedEvents"));
                Assert.AreEqual(
                    recovery.Value<string>("continuedStateHash"),
                    replayHashes.Value<string>("exportedSummaryFinalStateHash")
                );
                Assert.AreEqual(
                    recovery.Value<string>("continuedStateHash"),
                    replayHashes.Value<string>("reviewedFinalStateHash")
                );
            }
            finally
            {
                if (root != null)
                {
                    Object.DestroyImmediate(root);
                }

                DeleteLocalDevRecoverySave();
                CleanupRenderedSceneObjects();
            }
        }

        [Test]
        public void LocalDevRecoveryInvalidActionReleasePathSmokeRejectsAfterRestoreThenContinues()
        {
            DeleteLocalDevRecoverySave();
            var root = new GameObject("GemDuel LocalDev Recovery Invalid Action Smoke Test");
            try
            {
                var slice = root.AddComponent<GemDuelGameController>();
                var report = LocalDevRecoveryInvalidActionReleasePathSmoke.Run(
                    slice,
                    new LocalDevRecoveryInvalidActionReleasePathSmokeOptions
                    {
                        Seed = "unity-editmode-recovery-invalid-action-release-path-smoke",
                    }
                );

                Assert.IsTrue(report.Value<bool>("ok"), report.ToString(Formatting.Indented));
                Assert.IsFalse(report.Value<bool>("usedFixtureReplayAsGameplayDriver"));
                Assert.IsFalse(report.Value<bool>("usedCheckpointStateReplacement"));

                var cases = ((JArray)report["cases"]).OfType<JObject>().ToList();
                Assert.GreaterOrEqual(cases.Count, 3, report.ToString(Formatting.Indented));
                foreach (var rejectionCase in cases)
                {
                    Assert.IsTrue(rejectionCase.Value<bool>("ok"), rejectionCase.ToString(Formatting.Indented));
                    Assert.IsFalse(rejectionCase.Value<bool>("accepted"), rejectionCase.ToString(Formatting.Indented));
                    Assert.AreEqual(
                        rejectionCase.Value<string>("recoveryStateHashBefore"),
                        rejectionCase.Value<string>("recoveryStateHashAfter"),
                        rejectionCase.ToString(Formatting.Indented)
                    );
                    Assert.AreEqual(
                        rejectionCase.Value<string>("replayStateHashBefore"),
                        rejectionCase.Value<string>("replayStateHashAfter"),
                        rejectionCase.ToString(Formatting.Indented)
                    );
                    Assert.AreEqual(
                        rejectionCase.Value<int>("recordedEventsBefore"),
                        rejectionCase.Value<int>("recordedEventsAfter"),
                        rejectionCase.ToString(Formatting.Indented)
                    );
                    Assert.AreEqual(
                        "live-rules-engine-command-rejected",
                        rejectionCase.Value<string>("driver"),
                        rejectionCase.ToString(Formatting.Indented)
                    );
                }

                var recovery = (JObject)report["recoverySummary"];
                Assert.AreEqual("saved", recovery.Value<string>("savedStatus"));
                Assert.AreEqual("loaded", recovery.Value<string>("restoredStatus"));
                Assert.AreEqual("saved", recovery.Value<string>("continuedStatus"));
                Assert.AreEqual(
                    recovery.Value<string>("savedStateHash"),
                    recovery.Value<string>("restoredStateHash")
                );
                Assert.AreEqual(
                    recovery.Value<string>("savedStateHash"),
                    recovery.Value<string>("afterInvalidStateHash")
                );
                Assert.AreNotEqual(
                    recovery.Value<string>("savedStateHash"),
                    recovery.Value<string>("continuedStateHash")
                );
                Assert.AreEqual(1, recovery.Value<int>("savedRecordedEvents"));
                Assert.AreEqual(1, recovery.Value<int>("restoredRecordedEvents"));
                Assert.AreEqual(1, recovery.Value<int>("afterInvalidRecordedEvents"));
                Assert.AreEqual(2, recovery.Value<int>("continuedRecordedEvents"));

                var invalid = (JObject)report["invalidActionSummary"];
                Assert.AreEqual(cases.Count, invalid.Value<int>("caseCount"));
                Assert.AreEqual(
                    invalid.Value<string>("stateHashBefore"),
                    invalid.Value<string>("stateHashAfter")
                );
                Assert.AreEqual(
                    invalid.Value<int>("recordedEventsBefore"),
                    invalid.Value<int>("recordedEventsAfter")
                );

                var replayHashes = (JObject)report["replayHashSummary"];
                Assert.AreEqual(2, replayHashes.Value<int>("exportedEvents"));
                Assert.AreEqual(
                    recovery.Value<string>("continuedStateHash"),
                    replayHashes.Value<string>("exportedSummaryFinalStateHash")
                );
                Assert.AreEqual(
                    recovery.Value<string>("continuedStateHash"),
                    replayHashes.Value<string>("controllerCurrentStateHash")
                );
                Assert.AreEqual(
                    recovery.Value<string>("continuedStateHash"),
                    replayHashes.Value<string>("reviewedFinalStateHash")
                );
                Assert.IsTrue(report["replayReview"]?.Value<bool>("ok") ?? false);
            }
            finally
            {
                if (root != null)
                {
                    Object.DestroyImmediate(root);
                }

                DeleteLocalDevRecoverySave();
                CleanupRenderedSceneObjects();
            }
        }

        [Test]
        public void LocalDevRecoveryRestoresPendingJokerBuyAndContinuesColorSelection()
        {
            DeleteLocalDevRecoverySave();
            var root = new GameObject("GemDuel Joker Recovery Source Test");
            GameObject recoveredRoot = null;
            try
            {
                var slice = root.AddComponent<GemDuelGameController>();
                StartLocalGameWithVisibleJoker(
                    slice,
                    "unity-editmode-live-joker-recovery",
                    out var jokerRef,
                    out var jokerCard
                );

                var mutableSnapshot = GetMutableCurrentSnapshot(slice);
                ((JObject)mutableSnapshot["inventories"])["p1"] = new JObject
                {
                    ["red"] = 20,
                    ["green"] = 20,
                    ["blue"] = 20,
                    ["white"] = 20,
                    ["black"] = 20,
                    ["pearl"] = 20,
                    ["gold"] = 20,
                };
                RenderCurrentState(slice);

                Assert.IsTrue(
                    slice.RunSemanticActionForAutomation(
                        "buy_card",
                        new JObject { ["level"] = jokerRef.x, ["index"] = jokerRef.y },
                        out var buyError
                    ),
                    buyError
                );

                var saved = slice.BuildAutomationStateSnapshot(1920, 1080);
                var savedSnapshot = (JObject)saved["snapshot"];
                var savedRecovery = (JObject)saved["recovery"];
                var savedReplay = (JObject)saved["replay"];
                var savedLiveRecording = (JObject)savedReplay["liveRecording"];
                var savedHash = savedRecovery.Value<string>("currentStateHash");
                Assert.AreEqual("SELECT_CARD_COLOR", savedSnapshot.Value<string>("phase"));
                Assert.AreEqual(jokerCard, ((JObject)savedSnapshot["pendingBuy"]).Value<string>("instanceId"));
                Assert.AreEqual("saved", savedRecovery.Value<string>("status"));
                Assert.AreEqual("live-rules-engine", savedRecovery.Value<string>("kind"));
                Assert.AreEqual(1, savedLiveRecording.Value<int>("recordedEvents"));
                Assert.AreEqual(savedHash, savedLiveRecording.Value<string>("summaryFinalStateHash"));
                Assert.IsTrue(File.Exists(ResolveLocalDevRecoveryPath()));

                Object.DestroyImmediate(root);
                CleanupRenderedSceneObjects();

                recoveredRoot = new GameObject("GemDuel Joker Recovery Restored Test");
                var recovered = recoveredRoot.AddComponent<GemDuelGameController>();
                Assert.IsTrue(recovered.LoadRecoveredGameForAutomation(out var recoveryError), recoveryError);

                var restored = recovered.BuildAutomationStateSnapshot(1920, 1080);
                var restoredSnapshot = (JObject)restored["snapshot"];
                var restoredRecovery = (JObject)restored["recovery"];
                var restoredLiveRecording = (JObject)((JObject)restored["replay"])["liveRecording"];
                Assert.AreEqual("SELECT_CARD_COLOR", restoredSnapshot.Value<string>("phase"));
                Assert.AreEqual(jokerCard, ((JObject)restoredSnapshot["pendingBuy"]).Value<string>("instanceId"));
                Assert.AreEqual("loaded", restoredRecovery.Value<string>("status"));
                Assert.AreEqual(savedHash, restoredRecovery.Value<string>("currentStateHash"));
                Assert.AreEqual(1, restoredLiveRecording.Value<int>("recordedEvents"));

                Assert.IsTrue(
                    recovered.RunSemanticActionForAutomation(
                        "select_joker_color",
                        new JObject { ["color"] = "blue" },
                        out var colorError
                    ),
                    colorError
                );

                var continued = recovered.BuildAutomationStateSnapshot(1920, 1080);
                var continuedSnapshot = (JObject)continued["snapshot"];
                var continuedRecovery = (JObject)continued["recovery"];
                var continuedLiveRecording = (JObject)((JObject)continued["replay"])["liveRecording"];
                Assert.AreNotEqual("SELECT_CARD_COLOR", continuedSnapshot.Value<string>("phase"));
                Assert.IsTrue(
                    continuedSnapshot["pendingBuy"] == null ||
                    continuedSnapshot["pendingBuy"].Type == JTokenType.Null
                );
                Assert.IsTrue(
                    ((JArray)((JObject)continuedSnapshot["playerTableau"])["p1"])
                        .OfType<JObject>()
                        .Any(card => card.Value<string>("instanceId") == jokerCard)
                );
                Assert.AreEqual("saved", continuedRecovery.Value<string>("status"));
                Assert.AreEqual(2, continuedLiveRecording.Value<int>("recordedEvents"));
                Assert.AreEqual(
                    continuedRecovery.Value<string>("currentStateHash"),
                    continuedLiveRecording.Value<string>("summaryFinalStateHash")
                );
                Assert.IsTrue(recovered.ExportReplayJsonForAutomation(out var exportedJson, out var exportError), exportError);
                var exportedReplay = JsonConvert.DeserializeObject<ReplayVNext>(exportedJson);
                Assert.NotNull(exportedReplay);
                Assert.AreEqual(2, exportedReplay.Events.Count);
                Assert.AreEqual("initiate_buy_joker", exportedReplay.Events[0].Value<string>("type"));
                Assert.AreEqual("buy_card", exportedReplay.Events[1].Value<string>("type"));
                Assert.AreEqual(jokerCard, exportedReplay.Events[1].Value<string>("instanceId"));
            }
            finally
            {
                if (root != null)
                {
                    Object.DestroyImmediate(root);
                }

                if (recoveredRoot != null)
                {
                    Object.DestroyImmediate(recoveredRoot);
                }

                DeleteLocalDevRecoverySave();
                CleanupRenderedSceneObjects();
            }
        }

        [Test]
        public void SemanticRoguelikeDraftRerollUsesLiveRulesBridge()
        {
            var root = new GameObject("GemDuel Live Bridge Draft Reroll Test");
            try
            {
                var slice = root.AddComponent<GemDuelGameController>();

                Assert.IsTrue(
                    slice.RunSemanticActionForAutomation(
                        "start_roguelike_game",
                        new JObject { ["seed"] = "unity-editmode-live-draft-reroll" },
                        out var startError
                    ),
                    startError
                );

                var before = slice.BuildAutomationStateSnapshot(1920, 1080);
                var beforeSnapshot = (JObject)before["snapshot"];
                var beforePool = (JArray)beforeSnapshot["draftPool"].DeepClone();
                Assert.AreEqual("setup-live-rules-engine", slice.LastAutomationDriver);
                Assert.AreEqual(0, before.Value<int>("totalEvents"));
                Assert.AreEqual("DRAFT_PHASE", beforeSnapshot.Value<string>("phase"));
                Assert.AreEqual("p1", beforeSnapshot.Value<string>("turn"));
                var beforeLevel = beforeSnapshot.Value<int>("buffLevel");
                Assert.IsTrue(beforeLevel >= 1 && beforeLevel <= 3);
                Assert.Greater(beforePool.Count, 0);
                Assert.AreEqual("ActionButton", FindVisibleTarget(before, "draft.refresh").Value<string>("kind"));
                Assert.AreEqual(1, FindVisibleTarget(before, "draft.level.1").Value<int>("level"));
                Assert.AreEqual(2, FindVisibleTarget(before, "draft.level.2").Value<int>("level"));
                Assert.AreEqual(3, FindVisibleTarget(before, "draft.level.3").Value<int>("level"));
                var requestedLevel = beforeLevel == 1 ? 2 : 1;

                Assert.IsTrue(
                    slice.RunSemanticActionForAutomation(
                        "reroll_draft_pool",
                        new JObject { ["level"] = requestedLevel },
                        out var rerollError
                    ),
                    rerollError
                );

                var after = slice.BuildAutomationStateSnapshot(1920, 1080);
                var afterSnapshot = (JObject)after["snapshot"];
                var afterPool = (JArray)afterSnapshot["draftPool"];
                Assert.AreEqual(0, after.Value<int>("totalEvents"));
                Assert.AreEqual("DRAFT_PHASE", afterSnapshot.Value<string>("phase"));
                Assert.AreEqual("p1", afterSnapshot.Value<string>("turn"));
                Assert.AreEqual(requestedLevel, afterSnapshot.Value<int>("buffLevel"));
                Assert.Greater(afterPool.Count, 0);
                Assert.IsFalse(JToken.DeepEquals(beforePool, afterPool));
                Assert.AreEqual("Applied live action | REROLL_DRAFT_POOL", after.Value<string>("statusText"));
                Assert.AreEqual("unity-hit-target", slice.LastAutomationDriver);
            }
            finally
            {
                Object.DestroyImmediate(root);
                CleanupRenderedSceneObjects();
            }
        }

        [Test]
        public void LiveDraftBuffSelectionRejectionsDoNotMutateStateOrReplayRecording()
        {
            var draftRoot = new GameObject("GemDuel Live Draft Buff Selection Rejection Test");
            GameObject localRoot = null;
            try
            {
                var draft = draftRoot.AddComponent<GemDuelGameController>();
                Assert.IsTrue(
                    draft.RunSemanticActionForAutomation(
                        "start_roguelike_game",
                        new JObject { ["seed"] = "unity-editmode-live-draft-select-rejection" },
                        out var draftStartError
                    ),
                    draftStartError
                );

                var beforeDraft = draft.BuildAutomationStateSnapshot(1920, 1080);
                var beforeDraftReplay = (JObject)beforeDraft["replay"];
                var beforeDraftHash = beforeDraftReplay.Value<string>("currentStateHash");
                Assert.AreEqual("DRAFT_PHASE", ((JObject)beforeDraft["snapshot"]).Value<string>("phase"));
                Assert.AreEqual(
                    0,
                    ((JObject)beforeDraftReplay["liveRecording"]).Value<int>("recordedEvents")
                );

                Assert.IsFalse(
                    ApplyLiveRulesCommandForAutomation(
                        draft,
                        "SELECT_BUFF",
                        new JObject { ["buffId"] = "__missing_buff__" }
                    )
                );

                var afterDraft = draft.BuildAutomationStateSnapshot(1920, 1080);
                Assert.AreEqual(
                    "Selected buff is not available to the active player.",
                    afterDraft.Value<string>("statusText")
                );
                Assert.AreEqual(
                    "Selected buff is not available to the active player.",
                    afterDraft.Value<string>("errorBanner")
                );
                Assert.AreEqual(beforeDraftHash, ((JObject)afterDraft["replay"]).Value<string>("currentStateHash"));
                Assert.AreEqual("DRAFT_PHASE", ((JObject)afterDraft["snapshot"]).Value<string>("phase"));
                Assert.AreEqual("p1", ((JObject)afterDraft["snapshot"]).Value<string>("turn"));
                Assert.AreEqual(
                    0,
                    ((JObject)((JObject)afterDraft["replay"])["liveRecording"]).Value<int>("recordedEvents")
                );

                localRoot = new GameObject("GemDuel Live Wrong Phase Draft Buff Selection Rejection Test");
                var local = localRoot.AddComponent<GemDuelGameController>();
                Assert.IsTrue(
                    local.RunSemanticActionForAutomation(
                        "start_local_game",
                        new JObject { ["seed"] = "unity-editmode-live-draft-select-wrong-phase" },
                        out var localStartError
                    ),
                    localStartError
                );

                var beforeLocal = local.BuildAutomationStateSnapshot(1920, 1080);
                var beforeLocalReplay = (JObject)beforeLocal["replay"];
                var beforeLocalHash = beforeLocalReplay.Value<string>("currentStateHash");
                Assert.AreEqual("IDLE", ((JObject)beforeLocal["snapshot"]).Value<string>("phase"));
                Assert.AreEqual(
                    0,
                    ((JObject)beforeLocalReplay["liveRecording"]).Value<int>("recordedEvents")
                );

                Assert.IsFalse(
                    ApplyLiveRulesCommandForAutomation(
                        local,
                        "SELECT_BUFF",
                        new JObject { ["buffId"] = "royal_envoy" }
                    )
                );

                var afterLocal = local.BuildAutomationStateSnapshot(1920, 1080);
                Assert.AreEqual(
                    "SELECT_BUFF is only allowed during the DRAFT_PHASE phase.",
                    afterLocal.Value<string>("statusText")
                );
                Assert.AreEqual(
                    "SELECT_BUFF is only allowed during the DRAFT_PHASE phase.",
                    afterLocal.Value<string>("errorBanner")
                );
                Assert.AreEqual(beforeLocalHash, ((JObject)afterLocal["replay"]).Value<string>("currentStateHash"));
                Assert.AreEqual("IDLE", ((JObject)afterLocal["snapshot"]).Value<string>("phase"));
                Assert.AreEqual(
                    0,
                    ((JObject)((JObject)afterLocal["replay"])["liveRecording"]).Value<int>("recordedEvents")
                );
            }
            finally
            {
                Object.DestroyImmediate(draftRoot);
                if (localRoot != null)
                {
                    Object.DestroyImmediate(localRoot);
                }

                CleanupRenderedSceneObjects();
            }
        }

        [Test]
        public void LiveRoyalSelectionRejectionsDoNotMutateStateOrReplayRecording()
        {
            var root = new GameObject("GemDuel Live Royal Selection Rejection Test");
            try
            {
                var slice = root.AddComponent<GemDuelGameController>();
                Assert.IsTrue(
                    slice.RunSemanticActionForAutomation(
                        "start_local_game",
                        new JObject { ["seed"] = "unity-editmode-live-royal-selection-rejections" },
                        out var startError
                    ),
                    startError
                );

                var beforeWrongPhase = slice.BuildAutomationStateSnapshot(1920, 1080);
                var beforeWrongPhaseSnapshot = (JObject)beforeWrongPhase["snapshot"];
                var validRoyalId = ((JArray)beforeWrongPhaseSnapshot["royalDeck"])[0].Value<string>();
                var beforeWrongPhaseReplay = (JObject)beforeWrongPhase["replay"];
                var beforeWrongPhaseHash = beforeWrongPhaseReplay.Value<string>("currentStateHash");
                Assert.AreEqual("IDLE", beforeWrongPhaseSnapshot.Value<string>("phase"));
                Assert.AreEqual(
                    0,
                    ((JObject)beforeWrongPhaseReplay["liveRecording"]).Value<int>("recordedEvents")
                );

                Assert.IsFalse(
                    ApplyLiveRulesCommandForAutomation(
                        slice,
                        "SELECT_ROYAL_CARD",
                        new JObject { ["royalId"] = validRoyalId }
                    )
                );

                var afterWrongPhase = slice.BuildAutomationStateSnapshot(1920, 1080);
                Assert.AreEqual(
                    "SELECT_ROYAL_CARD is only allowed during the SELECT_ROYAL phase.",
                    afterWrongPhase.Value<string>("statusText")
                );
                Assert.AreEqual(
                    "SELECT_ROYAL_CARD is only allowed during the SELECT_ROYAL phase.",
                    afterWrongPhase.Value<string>("errorBanner")
                );
                Assert.AreEqual(
                    beforeWrongPhaseHash,
                    ((JObject)afterWrongPhase["replay"]).Value<string>("currentStateHash")
                );
                Assert.AreEqual("IDLE", ((JObject)afterWrongPhase["snapshot"]).Value<string>("phase"));
                Assert.AreEqual(
                    0,
                    ((JObject)((JObject)afterWrongPhase["replay"])["liveRecording"]).Value<int>("recordedEvents")
                );

                var snapshot = GetMutableCurrentSnapshot(slice);
                snapshot["phase"] = "SELECT_ROYAL";
                RenderCurrentState(slice);

                var beforeUnavailable = slice.BuildAutomationStateSnapshot(1920, 1080);
                var beforeUnavailableReplay = (JObject)beforeUnavailable["replay"];
                var beforeUnavailableHash = beforeUnavailableReplay.Value<string>("currentStateHash");
                Assert.AreEqual("SELECT_ROYAL", ((JObject)beforeUnavailable["snapshot"]).Value<string>("phase"));

                Assert.IsFalse(
                    ApplyLiveRulesCommandForAutomation(
                        slice,
                        "SELECT_ROYAL_CARD",
                        new JObject { ["royalId"] = validRoyalId },
                        "p2"
                    )
                );

                var afterWrongActor = slice.BuildAutomationStateSnapshot(1920, 1080);
                Assert.AreEqual(
                    "Command actor p2 does not match active player p1.",
                    afterWrongActor.Value<string>("statusText")
                );
                Assert.AreEqual(
                    "Command actor p2 does not match active player p1.",
                    afterWrongActor.Value<string>("errorBanner")
                );
                Assert.AreEqual(
                    beforeUnavailableHash,
                    ((JObject)afterWrongActor["replay"]).Value<string>("currentStateHash")
                );
                Assert.AreEqual("SELECT_ROYAL", ((JObject)afterWrongActor["snapshot"]).Value<string>("phase"));
                Assert.AreEqual(
                    0,
                    ((JObject)((JObject)afterWrongActor["replay"])["liveRecording"]).Value<int>("recordedEvents")
                );

                Assert.IsFalse(
                    ApplyLiveRulesCommandForAutomation(
                        slice,
                        "SELECT_ROYAL_CARD",
                        new JObject { ["royalId"] = "__missing_royal__" }
                    )
                );

                var afterUnavailable = slice.BuildAutomationStateSnapshot(1920, 1080);
                Assert.AreEqual(
                    "Selected royal card is no longer available.",
                    afterUnavailable.Value<string>("statusText")
                );
                Assert.AreEqual(
                    "Selected royal card is no longer available.",
                    afterUnavailable.Value<string>("errorBanner")
                );
                Assert.AreEqual(
                    beforeUnavailableHash,
                    ((JObject)afterUnavailable["replay"]).Value<string>("currentStateHash")
                );
                Assert.AreEqual("SELECT_ROYAL", ((JObject)afterUnavailable["snapshot"]).Value<string>("phase"));
                Assert.AreEqual(
                    0,
                    ((JObject)((JObject)afterUnavailable["replay"])["liveRecording"]).Value<int>("recordedEvents")
                );
            }
            finally
            {
                Object.DestroyImmediate(root);
                CleanupRenderedSceneObjects();
            }
        }

        [Test]
        public void LiveRoyalSelectionResolvesThroughLiveBridge()
        {
            var root = new GameObject("GemDuel Live Royal Selection Phase Resolution Test");
            try
            {
                var slice = root.AddComponent<GemDuelGameController>();
                Assert.IsTrue(
                    slice.RunSemanticActionForAutomation(
                        "start_local_game",
                        new JObject { ["seed"] = "unity-editmode-live-royal-phase-resolution" },
                        out var startError
                    ),
                    startError
                );

                var snapshot = GetMutableCurrentSnapshot(slice);
                snapshot["phase"] = "SELECT_ROYAL";
                snapshot["royalDeck"] = new JArray("r91-ro", "r92-ro", "r93-ro", "r94-ro");
                RenderCurrentState(slice);

                var before = slice.BuildAutomationStateSnapshot(1920, 1080);
                var beforeSnapshot = (JObject)before["snapshot"];
                var beforeReplay = (JObject)before["replay"];
                var beforeHash = beforeReplay.Value<string>("currentStateHash");
                Assert.AreEqual("SELECT_ROYAL", beforeSnapshot.Value<string>("phase"));
                Assert.AreEqual("p1", beforeSnapshot.Value<string>("turn"));
                CollectionAssert.Contains(((JArray)beforeSnapshot["royalDeck"]).Values<string>().ToList(), "r91-ro");
                Assert.IsFalse(
                    ((JArray)((JObject)beforeSnapshot["playerRoyals"])["p1"]).Values<string>().Contains("r91-ro")
                );
                Assert.AreEqual(0, ((JObject)beforeReplay["liveRecording"]).Value<int>("recordedEvents"));

                Assert.IsTrue(
                    ApplyLiveRulesCommandForAutomation(
                        slice,
                        "SELECT_ROYAL_CARD",
                        new JObject { ["royalId"] = "r91-ro" }
                    )
                );

                var after = slice.BuildAutomationStateSnapshot(1920, 1080);
                var afterSnapshot = (JObject)after["snapshot"];
                var afterReplay = (JObject)after["replay"];
                Assert.AreEqual("Applied live action | SELECT_ROYAL_CARD", after.Value<string>("statusText"));
                Assert.IsTrue(string.IsNullOrEmpty(after.Value<string>("errorBanner")));
                Assert.AreNotEqual(beforeHash, afterReplay.Value<string>("currentStateHash"));
                Assert.AreEqual("IDLE", afterSnapshot.Value<string>("phase"));
                Assert.AreEqual("p2", afterSnapshot.Value<string>("turn"));
                CollectionAssert.DoesNotContain(((JArray)afterSnapshot["royalDeck"]).Values<string>().ToList(), "r91-ro");
                CollectionAssert.Contains(((JArray)((JObject)afterSnapshot["playerRoyals"])["p1"]).Values<string>().ToList(), "r91-ro");
                Assert.AreEqual(1, ((JObject)afterReplay["liveRecording"]).Value<int>("recordedEvents"));
                Assert.AreEqual(
                    afterReplay.Value<string>("currentStateHash"),
                    ((JObject)afterReplay["liveRecording"]).Value<string>("summaryFinalStateHash")
                );
                Assert.IsTrue(slice.ExportReplayJsonForAutomation(out var replayJson, out var exportError), exportError);
                var replay = JsonConvert.DeserializeObject<ReplayVNext>(replayJson);
                Assert.NotNull(replay);
                Assert.AreEqual(1, replay.Events.Count);
                Assert.AreEqual("select_royal", replay.Events[0].Value<string>("type"));
                Assert.AreEqual(afterReplay.Value<string>("currentStateHash"), replay.Summary.FinalStateHash);
            }
            finally
            {
                Object.DestroyImmediate(root);
                CleanupRenderedSceneObjects();
            }
        }

        [Test]
        public void LiveMarketReserveCompletesThroughRulesBridgeGoldFollowUp()
        {
            var root = new GameObject("GemDuel Live Bridge Reserve Test");
            try
            {
                var slice = root.AddComponent<GemDuelGameController>();
                Assert.IsTrue(
                    slice.RunSemanticActionForAutomation(
                        "start_local_game",
                        new JObject { ["seed"] = "unity-editmode-live-market" },
                        out var startError
                    ),
                    startError
                );

                var start = slice.BuildAutomationStateSnapshot(1920, 1080);
                var startSnapshot = (JObject)start["snapshot"];
                var firstCard = ((JArray)((JObject)startSnapshot["market"])["1"])[0].Value<string>();
                var gold = FindFirstBoardGem(startSnapshot, "gold");

                Assert.IsTrue(
                    slice.RunSemanticActionForAutomation(
                        "reserve_card",
                        new JObject { ["level"] = 1, ["index"] = 0 },
                        out var reserveError
                    ),
                    reserveError
                );

                var waiting = slice.BuildAutomationStateSnapshot(1920, 1080);
                Assert.AreEqual(
                    "RESERVE_WAITING_GEM",
                    ((JObject)waiting["snapshot"]).Value<string>("phase")
                );

                Assert.IsTrue(
                    slice.RunSemanticActionForAutomation(
                        "click_board_cell",
                        new JObject { ["row"] = gold.x, ["column"] = gold.y },
                        out var goldError
                    ),
                    goldError
                );

                var after = slice.BuildAutomationStateSnapshot(1920, 1080);
                var afterSnapshot = (JObject)after["snapshot"];
                var reserved = (JArray)((JObject)afterSnapshot["playerReserved"])["p1"];
                CollectionAssert.Contains(reserved.Values<string>().ToList(), firstCard);
                Assert.AreEqual("empty", ((JArray)afterSnapshot["board"])[gold.x][gold.y].Value<string>());
                Assert.AreEqual("IDLE", afterSnapshot.Value<string>("phase"));
                Assert.AreEqual("p2", afterSnapshot.Value<string>("turn"));
                Assert.AreEqual(0, after.Value<int>("totalEvents"));
            }
            finally
            {
                Object.DestroyImmediate(root);
                CleanupRenderedSceneObjects();
            }
        }

        [Test]
        public void LiveReserveCancelRoutesThroughRulesBridge()
        {
            var root = new GameObject("GemDuel Live Bridge Reserve Cancel Test");
            try
            {
                var slice = root.AddComponent<GemDuelGameController>();
                Assert.IsTrue(
                    slice.RunSemanticActionForAutomation(
                        "start_local_game",
                        new JObject { ["seed"] = "unity-editmode-live-reserve-cancel" },
                        out var startError
                    ),
                    startError
                );

                var start = slice.BuildAutomationStateSnapshot(1920, 1080);
                var startSnapshot = (JObject)start["snapshot"];
                var firstCard = ((JArray)((JObject)startSnapshot["market"])["1"])[0].Value<string>();
                FindFirstBoardGem(startSnapshot, "gold");

                Assert.IsTrue(
                    slice.RunSemanticActionForAutomation(
                        "reserve_card",
                        new JObject { ["level"] = 1, ["index"] = 0 },
                        out var reserveError
                    ),
                    reserveError
                );

                var waiting = slice.BuildAutomationStateSnapshot(1920, 1080);
                var waitingSnapshot = (JObject)waiting["snapshot"];
                Assert.AreEqual("RESERVE_WAITING_GEM", waitingSnapshot.Value<string>("phase"));
                Assert.AreEqual("p1", waitingSnapshot.Value<string>("turn"));
                var cancelTarget = FindVisibleTarget(waiting, "board.selection.cancel");
                Assert.AreEqual("ActionButton", cancelTarget.Value<string>("kind"));
                Assert.AreEqual("cancel-gems", cancelTarget.Value<string>("eventType"));

                Assert.IsTrue(
                    slice.RunSemanticActionForAutomation("cancel_gem_selection", null, out var cancelError),
                    cancelError
                );

                var after = slice.BuildAutomationStateSnapshot(1920, 1080);
                var afterSnapshot = (JObject)after["snapshot"];
                Assert.AreEqual("IDLE", afterSnapshot.Value<string>("phase"));
                Assert.AreEqual("p1", afterSnapshot.Value<string>("turn"));
                Assert.IsTrue(afterSnapshot["pendingReserve"] == null || afterSnapshot["pendingReserve"].Type == JTokenType.Null);
                CollectionAssert.DoesNotContain(
                    ((JArray)((JObject)afterSnapshot["playerReserved"])["p1"]).Values<string>().ToList(),
                    firstCard
                );
                Assert.AreEqual("Applied live action | CANCEL_RESERVE", after.Value<string>("statusText"));
                Assert.AreEqual(0, after.Value<int>("totalEvents"));
            }
            finally
            {
                Object.DestroyImmediate(root);
                CleanupRenderedSceneObjects();
            }
        }

        [Test]
        public void LiveReserveCancelWrongActorDoesNotMutateStateOrReplayRecording()
        {
            var root = new GameObject("GemDuel Live Bridge Reserve Cancel Wrong Actor Test");
            try
            {
                var slice = root.AddComponent<GemDuelGameController>();
                Assert.IsTrue(
                    slice.RunSemanticActionForAutomation(
                        "start_local_game",
                        new JObject { ["seed"] = "unity-editmode-live-reserve-cancel-wrong-actor" },
                        out var startError
                    ),
                    startError
                );

                var start = slice.BuildAutomationStateSnapshot(1920, 1080);
                var startSnapshot = (JObject)start["snapshot"];
                var firstCard = ((JArray)((JObject)startSnapshot["market"])["1"])[0].Value<string>();

                Assert.IsTrue(
                    ApplyLiveRulesCommandForAutomation(
                        slice,
                        "INITIATE_RESERVE",
                        new JObject { ["level"] = 1, ["idx"] = 0 }
                    )
                );

                var before = slice.BuildAutomationStateSnapshot(1920, 1080);
                var beforeSnapshot = (JObject)before["snapshot"];
                var beforeReplay = (JObject)before["replay"];
                var beforeHash = beforeReplay.Value<string>("currentStateHash");
                var beforePending = (JObject)beforeSnapshot["pendingReserve"];
                var beforeReservedCount = ((JArray)((JObject)beforeSnapshot["playerReserved"])["p1"]).Count;
                Assert.AreEqual("RESERVE_WAITING_GEM", beforeSnapshot.Value<string>("phase"));
                Assert.AreEqual("p1", beforeSnapshot.Value<string>("turn"));
                Assert.AreEqual(1, ((JObject)beforeReplay["liveRecording"]).Value<int>("recordedEvents"));
                Assert.NotNull(beforePending);
                Assert.AreEqual(1, beforePending.Value<int>("level"));
                Assert.AreEqual(0, beforePending.Value<int>("idx"));
                Assert.IsFalse(beforePending.Value<bool>("isDeck"));

                Assert.IsFalse(ApplyLiveRulesCommandForAutomation(slice, "CANCEL_RESERVE", new JObject(), "p2"));

                var after = slice.BuildAutomationStateSnapshot(1920, 1080);
                var afterSnapshot = (JObject)after["snapshot"];
                var afterPending = (JObject)afterSnapshot["pendingReserve"];
                Assert.AreEqual(
                    "Command actor p2 does not match active player p1.",
                    after.Value<string>("statusText")
                );
                Assert.AreEqual(
                    "Command actor p2 does not match active player p1.",
                    after.Value<string>("errorBanner")
                );
                Assert.AreEqual(beforeHash, ((JObject)after["replay"]).Value<string>("currentStateHash"));
                Assert.AreEqual("RESERVE_WAITING_GEM", afterSnapshot.Value<string>("phase"));
                Assert.AreEqual("p1", afterSnapshot.Value<string>("turn"));
                Assert.NotNull(afterPending);
                Assert.AreEqual(beforePending.Value<int>("level"), afterPending.Value<int>("level"));
                Assert.AreEqual(beforePending.Value<int>("idx"), afterPending.Value<int>("idx"));
                Assert.AreEqual(beforePending.Value<bool>("isDeck"), afterPending.Value<bool>("isDeck"));
                Assert.AreEqual(firstCard, ((JArray)((JObject)afterSnapshot["market"])["1"])[0].Value<string>());
                Assert.AreEqual(
                    beforeReservedCount,
                    ((JArray)((JObject)afterSnapshot["playerReserved"])["p1"]).Count
                );
                Assert.AreEqual(
                    1,
                    ((JObject)((JObject)after["replay"])["liveRecording"]).Value<int>("recordedEvents")
                );
            }
            finally
            {
                Object.DestroyImmediate(root);
                CleanupRenderedSceneObjects();
            }
        }

        [Test]
        public void LiveWrongPhaseCancelAndDraftRerollRejectionsDoNotMutateStateOrReplayRecording()
        {
            var root = new GameObject("GemDuel Live Wrong-Phase Cancel And Reroll Rejection Test");
            try
            {
                var slice = root.AddComponent<GemDuelGameController>();
                Assert.IsTrue(
                    slice.RunSemanticActionForAutomation(
                        "start_local_game",
                        new JObject { ["seed"] = "unity-editmode-live-wrong-phase-cancel-reroll-rejections" },
                        out var startError
                    ),
                    startError
                );

                var before = slice.BuildAutomationStateSnapshot(1920, 1080);
                var beforeSnapshot = (JObject)before["snapshot"];
                var beforeReplay = (JObject)before["replay"];
                var beforeHash = beforeReplay.Value<string>("currentStateHash");
                Assert.AreEqual("IDLE", beforeSnapshot.Value<string>("phase"));
                Assert.AreEqual("p1", beforeSnapshot.Value<string>("turn"));
                Assert.AreEqual(
                    0,
                    ((JObject)beforeReplay["liveRecording"]).Value<int>("recordedEvents")
                );

                Assert.IsFalse(ApplyLiveRulesCommandForAutomation(slice, "CANCEL_RESERVE", new JObject()));
                var afterReserveCancel = slice.BuildAutomationStateSnapshot(1920, 1080);
                Assert.AreEqual(
                    "CANCEL_RESERVE is only allowed during the RESERVE_WAITING_GEM phase.",
                    afterReserveCancel.Value<string>("statusText")
                );
                Assert.AreEqual(
                    "CANCEL_RESERVE is only allowed during the RESERVE_WAITING_GEM phase.",
                    afterReserveCancel.Value<string>("errorBanner")
                );
                Assert.AreEqual(
                    beforeHash,
                    ((JObject)afterReserveCancel["replay"]).Value<string>("currentStateHash")
                );
                Assert.AreEqual("IDLE", ((JObject)afterReserveCancel["snapshot"]).Value<string>("phase"));
                Assert.AreEqual(
                    0,
                    ((JObject)((JObject)afterReserveCancel["replay"])["liveRecording"]).Value<int>(
                        "recordedEvents"
                    )
                );

                Assert.IsFalse(ApplyLiveRulesCommandForAutomation(slice, "CANCEL_PRIVILEGE", new JObject()));
                var afterPrivilegeCancel = slice.BuildAutomationStateSnapshot(1920, 1080);
                Assert.AreEqual(
                    "CANCEL_PRIVILEGE is only allowed during the PRIVILEGE_ACTION phase.",
                    afterPrivilegeCancel.Value<string>("statusText")
                );
                Assert.AreEqual(
                    "CANCEL_PRIVILEGE is only allowed during the PRIVILEGE_ACTION phase.",
                    afterPrivilegeCancel.Value<string>("errorBanner")
                );
                Assert.AreEqual(
                    beforeHash,
                    ((JObject)afterPrivilegeCancel["replay"]).Value<string>("currentStateHash")
                );
                Assert.AreEqual("IDLE", ((JObject)afterPrivilegeCancel["snapshot"]).Value<string>("phase"));
                Assert.AreEqual(
                    0,
                    ((JObject)((JObject)afterPrivilegeCancel["replay"])["liveRecording"]).Value<int>(
                        "recordedEvents"
                    )
                );

                Assert.IsFalse(
                    ApplyLiveRulesCommandForAutomation(
                        slice,
                        "REROLL_DRAFT_POOL",
                        new JObject { ["level"] = 1 }
                    )
                );
                var afterDraftReroll = slice.BuildAutomationStateSnapshot(1920, 1080);
                Assert.AreEqual(
                    "REROLL_DRAFT_POOL is only allowed during the DRAFT_PHASE phase.",
                    afterDraftReroll.Value<string>("statusText")
                );
                Assert.AreEqual(
                    "REROLL_DRAFT_POOL is only allowed during the DRAFT_PHASE phase.",
                    afterDraftReroll.Value<string>("errorBanner")
                );
                Assert.AreEqual(
                    beforeHash,
                    ((JObject)afterDraftReroll["replay"]).Value<string>("currentStateHash")
                );
                Assert.AreEqual("IDLE", ((JObject)afterDraftReroll["snapshot"]).Value<string>("phase"));
                Assert.AreEqual(
                    0,
                    ((JObject)((JObject)afterDraftReroll["replay"])["liveRecording"]).Value<int>(
                        "recordedEvents"
                    )
                );
            }
            finally
            {
                Object.DestroyImmediate(root);
                CleanupRenderedSceneObjects();
            }
        }

        [Test]
        public void LiveMarketReserveRejectionsDoNotMutateStateOrReplayRecording()
        {
            var root = new GameObject("GemDuel Live Bridge Reserve Rejection Test");
            try
            {
                var slice = root.AddComponent<GemDuelGameController>();
                Assert.IsTrue(
                    slice.RunSemanticActionForAutomation(
                        "start_local_game",
                        new JObject { ["seed"] = "unity-editmode-live-reserve-card-rejections" },
                        out var startError
                    ),
                    startError
                );

                var beforeWrongActorInitiate = slice.BuildAutomationStateSnapshot(1920, 1080);
                var beforeWrongActorInitiateReplay = (JObject)beforeWrongActorInitiate["replay"];
                var beforeWrongActorInitiateHash = beforeWrongActorInitiateReplay.Value<string>("currentStateHash");
                Assert.AreEqual("IDLE", ((JObject)beforeWrongActorInitiate["snapshot"]).Value<string>("phase"));
                Assert.AreEqual(
                    0,
                    ((JObject)beforeWrongActorInitiateReplay["liveRecording"]).Value<int>("recordedEvents")
                );

                Assert.IsFalse(
                    ApplyLiveRulesCommandForAutomation(
                        slice,
                        "INITIATE_RESERVE",
                        new JObject { ["level"] = 1, ["idx"] = 0 },
                        "p2"
                    )
                );

                var afterWrongActorInitiate = slice.BuildAutomationStateSnapshot(1920, 1080);
                Assert.AreEqual(
                    "Command actor p2 does not match active player p1.",
                    afterWrongActorInitiate.Value<string>("statusText")
                );
                Assert.AreEqual(
                    "Command actor p2 does not match active player p1.",
                    afterWrongActorInitiate.Value<string>("errorBanner")
                );
                Assert.AreEqual(
                    beforeWrongActorInitiateHash,
                    ((JObject)afterWrongActorInitiate["replay"]).Value<string>("currentStateHash")
                );
                Assert.AreEqual("IDLE", ((JObject)afterWrongActorInitiate["snapshot"]).Value<string>("phase"));
                Assert.AreEqual(
                    0,
                    ((JObject)((JObject)afterWrongActorInitiate["replay"])["liveRecording"]).Value<int>(
                        "recordedEvents"
                    )
                );

                Assert.IsTrue(
                    ApplyLiveRulesCommandForAutomation(
                        slice,
                        "INITIATE_RESERVE",
                        new JObject { ["level"] = 1, ["idx"] = 0 }
                    )
                );

                var beforeWrongActorResolve = slice.BuildAutomationStateSnapshot(1920, 1080);
                var beforeWrongActorResolveReplay = (JObject)beforeWrongActorResolve["replay"];
                var beforeWrongActorResolveHash = beforeWrongActorResolveReplay.Value<string>("currentStateHash");
                var beforeWrongActorResolveEvents =
                    ((JObject)beforeWrongActorResolveReplay["liveRecording"]).Value<int>("recordedEvents");
                var wrongActorGold = FindFirstBoardGem((JObject)beforeWrongActorResolve["snapshot"], "gold");
                Assert.AreEqual("RESERVE_WAITING_GEM", ((JObject)beforeWrongActorResolve["snapshot"]).Value<string>("phase"));
                Assert.AreEqual(1, beforeWrongActorResolveEvents);

                Assert.IsFalse(
                    ApplyLiveRulesCommandForAutomation(
                        slice,
                        "RESERVE_CARD",
                        new JObject
                        {
                            ["level"] = 1,
                            ["idx"] = 0,
                            ["goldCoords"] = new JObject { ["r"] = wrongActorGold.x, ["c"] = wrongActorGold.y },
                        },
                        "p2"
                    )
                );

                var afterWrongActorResolve = slice.BuildAutomationStateSnapshot(1920, 1080);
                Assert.AreEqual(
                    "Command actor p2 does not match active player p1.",
                    afterWrongActorResolve.Value<string>("statusText")
                );
                Assert.AreEqual(
                    "Command actor p2 does not match active player p1.",
                    afterWrongActorResolve.Value<string>("errorBanner")
                );
                Assert.AreEqual(
                    beforeWrongActorResolveHash,
                    ((JObject)afterWrongActorResolve["replay"]).Value<string>("currentStateHash")
                );
                Assert.AreEqual(
                    "RESERVE_WAITING_GEM",
                    ((JObject)afterWrongActorResolve["snapshot"]).Value<string>("phase")
                );
                Assert.IsTrue(
                    ((JObject)afterWrongActorResolve["snapshot"])["pendingReserve"] != null &&
                    ((JObject)afterWrongActorResolve["snapshot"])["pendingReserve"].Type != JTokenType.Null
                );
                Assert.AreEqual(
                    beforeWrongActorResolveEvents,
                    ((JObject)((JObject)afterWrongActorResolve["replay"])["liveRecording"]).Value<int>(
                        "recordedEvents"
                    )
                );

                var beforeMissingGold = slice.BuildAutomationStateSnapshot(1920, 1080);
                var beforeMissingGoldReplay = (JObject)beforeMissingGold["replay"];
                var beforeMissingGoldHash = beforeMissingGoldReplay.Value<string>("currentStateHash");
                var beforeMissingGoldEvents =
                    ((JObject)beforeMissingGoldReplay["liveRecording"]).Value<int>("recordedEvents");
                Assert.AreEqual("RESERVE_WAITING_GEM", ((JObject)beforeMissingGold["snapshot"]).Value<string>("phase"));
                Assert.AreEqual(1, beforeMissingGoldEvents);

                Assert.IsFalse(
                    ApplyLiveRulesCommandForAutomation(
                        slice,
                        "RESERVE_CARD",
                        new JObject { ["level"] = 1, ["idx"] = 0 }
                    )
                );

                var afterMissingGold = slice.BuildAutomationStateSnapshot(1920, 1080);
                Assert.AreEqual(
                    "A gold coordinate is required for this action.",
                    afterMissingGold.Value<string>("statusText")
                );
                Assert.AreEqual(
                    "A gold coordinate is required for this action.",
                    afterMissingGold.Value<string>("errorBanner")
                );
                Assert.AreEqual(
                    beforeMissingGoldHash,
                    ((JObject)afterMissingGold["replay"]).Value<string>("currentStateHash")
                );
                Assert.AreEqual(
                    beforeMissingGoldEvents,
                    ((JObject)((JObject)afterMissingGold["replay"])["liveRecording"]).Value<int>("recordedEvents")
                );

                var nonGold = FindFirstCollectibleBoardGem((JObject)afterMissingGold["snapshot"], out _);
                Assert.IsFalse(
                    ApplyLiveRulesCommandForAutomation(
                        slice,
                        "RESERVE_CARD",
                        new JObject
                        {
                            ["level"] = 1,
                            ["idx"] = 0,
                            ["goldCoords"] = new JObject { ["r"] = nonGold.x, ["c"] = nonGold.y },
                        }
                    )
                );

                var afterInvalidGold = slice.BuildAutomationStateSnapshot(1920, 1080);
                Assert.AreEqual(
                    "Selected coordinate does not contain a gold gem.",
                    afterInvalidGold.Value<string>("statusText")
                );
                Assert.AreEqual(
                    "Selected coordinate does not contain a gold gem.",
                    afterInvalidGold.Value<string>("errorBanner")
                );
                Assert.AreEqual(
                    beforeMissingGoldHash,
                    ((JObject)afterInvalidGold["replay"]).Value<string>("currentStateHash")
                );
                Assert.AreEqual(
                    beforeMissingGoldEvents,
                    ((JObject)((JObject)afterInvalidGold["replay"])["liveRecording"]).Value<int>("recordedEvents")
                );

                var snapshot = GetMutableCurrentSnapshot(slice);
                var marketRow = (JArray)((JObject)snapshot["market"])["1"];
                var gold = FindFirstBoardGem(snapshot, "gold");
                marketRow[0] = marketRow[1].Value<string>();
                RenderCurrentState(slice);

                var beforePendingMismatch = slice.BuildAutomationStateSnapshot(1920, 1080);
                var beforePendingMismatchReplay = (JObject)beforePendingMismatch["replay"];
                var beforePendingMismatchHash = beforePendingMismatchReplay.Value<string>("currentStateHash");
                var beforePendingMismatchEvents =
                    ((JObject)beforePendingMismatchReplay["liveRecording"]).Value<int>("recordedEvents");
                Assert.IsFalse(
                    ApplyLiveRulesCommandForAutomation(
                        slice,
                        "RESERVE_CARD",
                        new JObject
                        {
                            ["level"] = 1,
                            ["idx"] = 0,
                            ["goldCoords"] = new JObject { ["r"] = gold.x, ["c"] = gold.y },
                        }
                    )
                );

                var afterPendingMismatch = slice.BuildAutomationStateSnapshot(1920, 1080);
                Assert.AreEqual(
                    "Reserve resolution does not match the pending reserve action.",
                    afterPendingMismatch.Value<string>("statusText")
                );
                Assert.AreEqual(
                    "Reserve resolution does not match the pending reserve action.",
                    afterPendingMismatch.Value<string>("errorBanner")
                );
                Assert.AreEqual(
                    beforePendingMismatchHash,
                    ((JObject)afterPendingMismatch["replay"]).Value<string>("currentStateHash")
                );
                Assert.AreEqual(
                    beforePendingMismatchEvents,
                    ((JObject)((JObject)afterPendingMismatch["replay"])["liveRecording"]).Value<int>("recordedEvents")
                );

                Assert.IsTrue(
                    slice.RunSemanticActionForAutomation(
                        "start_local_game",
                        new JObject { ["seed"] = "unity-editmode-live-reserve-card-rejections-full-row" },
                        out var fullRowStartError
                    ),
                    fullRowStartError
                );
                Assert.IsTrue(
                    ApplyLiveRulesCommandForAutomation(
                        slice,
                        "INITIATE_RESERVE",
                        new JObject { ["level"] = 1, ["idx"] = 0 }
                    )
                );

                snapshot = GetMutableCurrentSnapshot(slice);
                marketRow = (JArray)((JObject)snapshot["market"])["1"];
                gold = FindFirstBoardGem(snapshot, "gold");
                ((JObject)snapshot["playerReserved"])["p1"] = new JArray(
                    marketRow[0].Value<string>(),
                    marketRow[1].Value<string>(),
                    marketRow[2].Value<string>()
                );
                RenderCurrentState(slice);

                var beforeFullReserve = slice.BuildAutomationStateSnapshot(1920, 1080);
                var beforeFullReserveReplay = (JObject)beforeFullReserve["replay"];
                var beforeFullReserveHash = beforeFullReserveReplay.Value<string>("currentStateHash");
                var beforeFullReserveEvents =
                    ((JObject)beforeFullReserveReplay["liveRecording"]).Value<int>("recordedEvents");
                Assert.IsFalse(
                    ApplyLiveRulesCommandForAutomation(
                        slice,
                        "RESERVE_CARD",
                        new JObject
                        {
                            ["level"] = 1,
                            ["idx"] = 0,
                            ["goldCoords"] = new JObject { ["r"] = gold.x, ["c"] = gold.y },
                        }
                    )
                );

                var afterFullReserve = slice.BuildAutomationStateSnapshot(1920, 1080);
                Assert.AreEqual(
                    "The reserve limit has already been reached.",
                    afterFullReserve.Value<string>("statusText")
                );
                Assert.AreEqual(
                    "The reserve limit has already been reached.",
                    afterFullReserve.Value<string>("errorBanner")
                );
                Assert.AreEqual(
                    beforeFullReserveHash,
                    ((JObject)afterFullReserve["replay"]).Value<string>("currentStateHash")
                );
                Assert.AreEqual(
                    beforeFullReserveEvents,
                    ((JObject)((JObject)afterFullReserve["replay"])["liveRecording"]).Value<int>("recordedEvents")
                );
            }
            finally
            {
                Object.DestroyImmediate(root);
                CleanupRenderedSceneObjects();
            }
        }

        [Test]
        public void LiveMarketDeckReserveCompletesThroughRulesBridgeGoldFollowUp()
        {
            var root = new GameObject("GemDuel Live Bridge Deck Reserve Test");
            try
            {
                var slice = root.AddComponent<GemDuelGameController>();
                Assert.IsTrue(
                    slice.RunSemanticActionForAutomation(
                        "start_local_game",
                        new JObject { ["seed"] = "unity-editmode-live-reserve-deck" },
                        out var startError
                    ),
                    startError
                );

                var start = slice.BuildAutomationStateSnapshot(1920, 1080);
                var startSnapshot = (JObject)start["snapshot"];
                var startDeck = (JArray)((JObject)startSnapshot["decks"])["1"];
                var startReserved = (JArray)((JObject)startSnapshot["playerReserved"])["p1"];
                var topDeckCard = startDeck.Last.Value<string>();
                var gold = FindFirstBoardGem(startSnapshot, "gold");

                Assert.IsTrue(
                    slice.RunSemanticActionForAutomation(
                        "click_market_deck",
                        new JObject { ["level"] = 1 },
                        out var previewError
                    ),
                    previewError
                );

                var preview = slice.BuildAutomationStateSnapshot(1920, 1080);
                Assert.AreEqual("deck", ((JObject)preview["preview"]).Value<string>("source"));
                var reserveTarget = FindVisibleTarget(preview, "card.preview.action.reserve");
                Assert.AreEqual("ActionButton", reserveTarget.Value<string>("kind"));
                Assert.AreEqual("preview-reserve", reserveTarget.Value<string>("eventType"));

                Assert.IsTrue(
                    ClickVisibleTargetCenterForAutomation(
                        slice,
                        preview,
                        "card.preview.action.reserve",
                        out var reserveError
                    ),
                    reserveError
                );

                var waiting = slice.BuildAutomationStateSnapshot(1920, 1080);
                var waitingSnapshot = (JObject)waiting["snapshot"];
                var pendingReserve = (JObject)waitingSnapshot["pendingReserve"];
                Assert.AreEqual("RESERVE_WAITING_GEM", waitingSnapshot.Value<string>("phase"));
                Assert.AreEqual("p1", waitingSnapshot.Value<string>("turn"));
                Assert.IsTrue(pendingReserve.Value<bool>("isDeck"));
                Assert.AreEqual(1, pendingReserve.Value<int>("level"));

                Assert.IsTrue(
                    slice.RunSemanticActionForAutomation(
                        "click_board_cell",
                        new JObject { ["row"] = gold.x, ["column"] = gold.y },
                        out var goldError
                    ),
                    goldError
                );

                var after = slice.BuildAutomationStateSnapshot(1920, 1080);
                var afterSnapshot = (JObject)after["snapshot"];
                var afterDeck = (JArray)((JObject)afterSnapshot["decks"])["1"];
                var afterReserved = (JArray)((JObject)afterSnapshot["playerReserved"])["p1"];
                Assert.AreEqual("IDLE", afterSnapshot.Value<string>("phase"));
                Assert.AreEqual("p2", afterSnapshot.Value<string>("turn"));
                Assert.AreEqual(startDeck.Count - 1, afterDeck.Count);
                Assert.AreEqual(startReserved.Count + 1, afterReserved.Count);
                CollectionAssert.Contains(afterReserved.Values<string>().ToList(), topDeckCard);
                Assert.AreEqual("empty", ((JArray)afterSnapshot["board"])[gold.x][gold.y].Value<string>());
                Assert.AreEqual("Applied live action | RESERVE_DECK", after.Value<string>("statusText"));
                Assert.AreEqual(0, after.Value<int>("totalEvents"));
            }
            finally
            {
                Object.DestroyImmediate(root);
                CleanupRenderedSceneObjects();
            }
        }

        [Test]
        public void LiveMarketDeckReserveRejectionsDoNotMutateStateOrReplayRecording()
        {
            var root = new GameObject("GemDuel Live Bridge Deck Reserve Rejection Test");
            try
            {
                var slice = root.AddComponent<GemDuelGameController>();
                Assert.IsTrue(
                    slice.RunSemanticActionForAutomation(
                        "start_local_game",
                        new JObject { ["seed"] = "unity-editmode-live-reserve-deck-rejections-empty-init" },
                        out var emptyStartError
                    ),
                    emptyStartError
                );

                var snapshot = GetMutableCurrentSnapshot(slice);
                ((JArray)((JObject)snapshot["decks"])["1"]).Clear();
                RenderCurrentState(slice);

                var beforeEmptyInitiate = slice.BuildAutomationStateSnapshot(1920, 1080);
                var beforeEmptyInitiateReplay = (JObject)beforeEmptyInitiate["replay"];
                var beforeEmptyInitiateHash = beforeEmptyInitiateReplay.Value<string>("currentStateHash");
                Assert.AreEqual(0, ((JObject)beforeEmptyInitiateReplay["liveRecording"]).Value<int>("recordedEvents"));

                Assert.IsFalse(
                    ApplyLiveRulesCommandForAutomation(
                        slice,
                        "INITIATE_RESERVE_DECK",
                        new JObject { ["level"] = 1 }
                    )
                );

                var afterEmptyInitiate = slice.BuildAutomationStateSnapshot(1920, 1080);
                Assert.AreEqual("Selected deck is empty.", afterEmptyInitiate.Value<string>("statusText"));
                Assert.AreEqual("Selected deck is empty.", afterEmptyInitiate.Value<string>("errorBanner"));
                Assert.AreEqual(
                    beforeEmptyInitiateHash,
                    ((JObject)afterEmptyInitiate["replay"]).Value<string>("currentStateHash")
                );
                Assert.AreEqual("IDLE", ((JObject)afterEmptyInitiate["snapshot"]).Value<string>("phase"));
                Assert.AreEqual(
                    0,
                    ((JObject)((JObject)afterEmptyInitiate["replay"])["liveRecording"]).Value<int>("recordedEvents")
                );

                Assert.IsTrue(
                    slice.RunSemanticActionForAutomation(
                        "start_local_game",
                        new JObject { ["seed"] = "unity-editmode-live-reserve-deck-rejections-completion" },
                        out var completionStartError
                    ),
                    completionStartError
                );

                var beforeWrongActorInitiate = slice.BuildAutomationStateSnapshot(1920, 1080);
                var beforeWrongActorInitiateReplay = (JObject)beforeWrongActorInitiate["replay"];
                var beforeWrongActorInitiateHash = beforeWrongActorInitiateReplay.Value<string>("currentStateHash");
                Assert.AreEqual("IDLE", ((JObject)beforeWrongActorInitiate["snapshot"]).Value<string>("phase"));
                Assert.AreEqual(
                    0,
                    ((JObject)beforeWrongActorInitiateReplay["liveRecording"]).Value<int>("recordedEvents")
                );

                Assert.IsFalse(
                    ApplyLiveRulesCommandForAutomation(
                        slice,
                        "INITIATE_RESERVE_DECK",
                        new JObject { ["level"] = 1 },
                        "p2"
                    )
                );

                var afterWrongActorInitiate = slice.BuildAutomationStateSnapshot(1920, 1080);
                Assert.AreEqual(
                    "Command actor p2 does not match active player p1.",
                    afterWrongActorInitiate.Value<string>("statusText")
                );
                Assert.AreEqual(
                    "Command actor p2 does not match active player p1.",
                    afterWrongActorInitiate.Value<string>("errorBanner")
                );
                Assert.AreEqual(
                    beforeWrongActorInitiateHash,
                    ((JObject)afterWrongActorInitiate["replay"]).Value<string>("currentStateHash")
                );
                Assert.AreEqual("IDLE", ((JObject)afterWrongActorInitiate["snapshot"]).Value<string>("phase"));
                Assert.AreEqual(
                    0,
                    ((JObject)((JObject)afterWrongActorInitiate["replay"])["liveRecording"]).Value<int>(
                        "recordedEvents"
                    )
                );

                Assert.IsTrue(
                    ApplyLiveRulesCommandForAutomation(
                        slice,
                        "INITIATE_RESERVE_DECK",
                        new JObject { ["level"] = 1 }
                    )
                );

                var beforeWrongActorResolve = slice.BuildAutomationStateSnapshot(1920, 1080);
                var beforeWrongActorResolveReplay = (JObject)beforeWrongActorResolve["replay"];
                var beforeWrongActorResolveHash = beforeWrongActorResolveReplay.Value<string>("currentStateHash");
                var beforeWrongActorResolveEvents =
                    ((JObject)beforeWrongActorResolveReplay["liveRecording"]).Value<int>("recordedEvents");
                var wrongActorGold = FindFirstBoardGem((JObject)beforeWrongActorResolve["snapshot"], "gold");
                Assert.AreEqual(
                    "RESERVE_WAITING_GEM",
                    ((JObject)beforeWrongActorResolve["snapshot"]).Value<string>("phase")
                );
                Assert.AreEqual(1, beforeWrongActorResolveEvents);

                Assert.IsFalse(
                    ApplyLiveRulesCommandForAutomation(
                        slice,
                        "RESERVE_DECK",
                        new JObject
                        {
                            ["level"] = 1,
                            ["goldCoords"] = new JObject { ["r"] = wrongActorGold.x, ["c"] = wrongActorGold.y },
                        },
                        "p2"
                    )
                );

                var afterWrongActorResolve = slice.BuildAutomationStateSnapshot(1920, 1080);
                Assert.AreEqual(
                    "Command actor p2 does not match active player p1.",
                    afterWrongActorResolve.Value<string>("statusText")
                );
                Assert.AreEqual(
                    "Command actor p2 does not match active player p1.",
                    afterWrongActorResolve.Value<string>("errorBanner")
                );
                Assert.AreEqual(
                    beforeWrongActorResolveHash,
                    ((JObject)afterWrongActorResolve["replay"]).Value<string>("currentStateHash")
                );
                Assert.AreEqual(
                    "RESERVE_WAITING_GEM",
                    ((JObject)afterWrongActorResolve["snapshot"]).Value<string>("phase")
                );
                var pendingDeckReserve = (JObject)((JObject)afterWrongActorResolve["snapshot"])["pendingReserve"];
                Assert.NotNull(pendingDeckReserve);
                Assert.IsTrue(pendingDeckReserve.Value<bool>("isDeck"));
                Assert.AreEqual(
                    beforeWrongActorResolveEvents,
                    ((JObject)((JObject)afterWrongActorResolve["replay"])["liveRecording"]).Value<int>(
                        "recordedEvents"
                    )
                );

                var beforeMissingGold = slice.BuildAutomationStateSnapshot(1920, 1080);
                var beforeMissingGoldReplay = (JObject)beforeMissingGold["replay"];
                var beforeMissingGoldHash = beforeMissingGoldReplay.Value<string>("currentStateHash");
                var beforeMissingGoldEvents =
                    ((JObject)beforeMissingGoldReplay["liveRecording"]).Value<int>("recordedEvents");
                Assert.AreEqual("RESERVE_WAITING_GEM", ((JObject)beforeMissingGold["snapshot"]).Value<string>("phase"));

                Assert.IsFalse(
                    ApplyLiveRulesCommandForAutomation(slice, "RESERVE_DECK", new JObject { ["level"] = 1 })
                );

                var afterMissingGold = slice.BuildAutomationStateSnapshot(1920, 1080);
                Assert.AreEqual(
                    "A gold coordinate is required for this action.",
                    afterMissingGold.Value<string>("statusText")
                );
                Assert.AreEqual(
                    "A gold coordinate is required for this action.",
                    afterMissingGold.Value<string>("errorBanner")
                );
                Assert.AreEqual(
                    beforeMissingGoldHash,
                    ((JObject)afterMissingGold["replay"]).Value<string>("currentStateHash")
                );
                Assert.AreEqual(
                    beforeMissingGoldEvents,
                    ((JObject)((JObject)afterMissingGold["replay"])["liveRecording"]).Value<int>("recordedEvents")
                );

                snapshot = GetMutableCurrentSnapshot(slice);
                var deck = (JArray)((JObject)snapshot["decks"])["1"];
                var gold = FindFirstBoardGem(snapshot, "gold");
                ((JObject)snapshot["playerReserved"])["p1"] = new JArray(
                    deck[deck.Count - 1].Value<string>(),
                    deck[deck.Count - 2].Value<string>(),
                    deck[deck.Count - 3].Value<string>()
                );
                RenderCurrentState(slice);

                var beforeFullReserve = slice.BuildAutomationStateSnapshot(1920, 1080);
                var beforeFullReserveReplay = (JObject)beforeFullReserve["replay"];
                var beforeFullReserveHash = beforeFullReserveReplay.Value<string>("currentStateHash");
                var beforeFullReserveEvents =
                    ((JObject)beforeFullReserveReplay["liveRecording"]).Value<int>("recordedEvents");

                Assert.IsFalse(
                    ApplyLiveRulesCommandForAutomation(
                        slice,
                        "RESERVE_DECK",
                        new JObject { ["level"] = 1, ["goldCoords"] = new JObject { ["r"] = gold.x, ["c"] = gold.y } }
                    )
                );

                var afterFullReserve = slice.BuildAutomationStateSnapshot(1920, 1080);
                Assert.AreEqual(
                    "The reserve limit has already been reached.",
                    afterFullReserve.Value<string>("statusText")
                );
                Assert.AreEqual(
                    "The reserve limit has already been reached.",
                    afterFullReserve.Value<string>("errorBanner")
                );
                Assert.AreEqual(
                    beforeFullReserveHash,
                    ((JObject)afterFullReserve["replay"]).Value<string>("currentStateHash")
                );
                Assert.AreEqual(
                    beforeFullReserveEvents,
                    ((JObject)((JObject)afterFullReserve["replay"])["liveRecording"]).Value<int>("recordedEvents")
                );

                snapshot = GetMutableCurrentSnapshot(slice);
                ((JObject)snapshot["playerReserved"])["p1"] = new JArray();
                ((JArray)((JObject)snapshot["decks"])["1"]).Clear();
                RenderCurrentState(slice);

                var beforeEmptyCompletion = slice.BuildAutomationStateSnapshot(1920, 1080);
                var beforeEmptyCompletionReplay = (JObject)beforeEmptyCompletion["replay"];
                var beforeEmptyCompletionHash = beforeEmptyCompletionReplay.Value<string>("currentStateHash");
                var beforeEmptyCompletionEvents =
                    ((JObject)beforeEmptyCompletionReplay["liveRecording"]).Value<int>("recordedEvents");

                Assert.IsFalse(
                    ApplyLiveRulesCommandForAutomation(
                        slice,
                        "RESERVE_DECK",
                        new JObject { ["level"] = 1, ["goldCoords"] = new JObject { ["r"] = gold.x, ["c"] = gold.y } }
                    )
                );

                var afterEmptyCompletion = slice.BuildAutomationStateSnapshot(1920, 1080);
                Assert.AreEqual("Selected deck is empty.", afterEmptyCompletion.Value<string>("statusText"));
                Assert.AreEqual("Selected deck is empty.", afterEmptyCompletion.Value<string>("errorBanner"));
                Assert.AreEqual(
                    beforeEmptyCompletionHash,
                    ((JObject)afterEmptyCompletion["replay"]).Value<string>("currentStateHash")
                );
                Assert.AreEqual(
                    beforeEmptyCompletionEvents,
                    ((JObject)((JObject)afterEmptyCompletion["replay"])["liveRecording"]).Value<int>("recordedEvents")
                );
            }
            finally
            {
                Object.DestroyImmediate(root);
                CleanupRenderedSceneObjects();
            }
        }

        [Test]
        public void LiveJokerBuyRequiresExplicitColorSelectionThroughRulesBridge()
        {
            var root = new GameObject("GemDuel Live Bridge Joker Buy Test");
            try
            {
                var slice = root.AddComponent<GemDuelGameController>();
                var foundJoker = false;
                var jokerRef = new Vector2Int(-1, -1);
                var jokerCard = string.Empty;

                for (var seedIndex = 0; seedIndex < 100 && !foundJoker; seedIndex += 1)
                {
                    Assert.IsTrue(
                        slice.RunSemanticActionForAutomation(
                            "start_local_game",
                            new JObject { ["seed"] = "unity-editmode-live-joker-" + seedIndex },
                            out var startError
                        ),
                        startError
                    );

                    var start = slice.BuildAutomationStateSnapshot(1920, 1080);
                    foundJoker = TryFindFirstJokerMarketCard(
                        (JObject)start["snapshot"],
                        out jokerRef,
                        out jokerCard
                    );
                }

                Assert.IsTrue(foundJoker, "Expected a deterministic local start with a visible Joker.");
                Assert.IsTrue(
                    slice.RunSemanticActionForAutomation(
                        "buy_card",
                        new JObject { ["level"] = jokerRef.x, ["index"] = jokerRef.y },
                        out var buyError
                    ),
                    buyError
                );

                var colorSelection = slice.BuildAutomationStateSnapshot(1920, 1080);
                var colorSelectionSnapshot = (JObject)colorSelection["snapshot"];
                Assert.AreEqual("SELECT_CARD_COLOR", colorSelectionSnapshot.Value<string>("phase"));
                Assert.AreEqual(jokerCard, ((JObject)colorSelectionSnapshot["pendingBuy"]).Value<string>("instanceId"));

                var blueTarget = FindVisibleTarget(colorSelection, "card.color.blue");
                Assert.AreEqual("BonusColor", blueTarget.Value<string>("kind"));
                Assert.AreEqual("select-card-color", blueTarget.Value<string>("eventType"));
                Assert.AreEqual("blue", blueTarget.Value<string>("gemId"));

                Assert.IsTrue(
                    slice.RunSemanticActionForAutomation(
                        "select_joker_color",
                        new JObject { ["color"] = "blue" },
                        out var colorError
                    ),
                    colorError
                );

                var afterColor = slice.BuildAutomationStateSnapshot(1920, 1080);
                var afterColorSnapshot = (JObject)afterColor["snapshot"];
                Assert.AreEqual("SELECT_CARD_COLOR", afterColorSnapshot.Value<string>("phase"));
                Assert.AreEqual(jokerCard, ((JObject)afterColorSnapshot["pendingBuy"]).Value<string>("instanceId"));
                Assert.IsFalse(string.IsNullOrEmpty(afterColor.Value<string>("errorBanner")));
                Assert.AreEqual(0, afterColor.Value<int>("totalEvents"));
            }
            finally
            {
                Object.DestroyImmediate(root);
                CleanupRenderedSceneObjects();
            }
        }

        [Test]
        public void LiveJokerColorWrongActorDoesNotMutateStateOrReplayRecording()
        {
            var root = new GameObject("GemDuel Live Joker Color Wrong Actor Rejection Test");
            try
            {
                var slice = root.AddComponent<GemDuelGameController>();
                StartLocalGameWithVisibleJoker(
                    slice,
                    "unity-editmode-live-joker-color-wrong-actor",
                    out var jokerRef,
                    out var jokerCard
                );

                Assert.IsTrue(
                    slice.RunSemanticActionForAutomation(
                        "buy_card",
                        new JObject { ["level"] = jokerRef.x, ["index"] = jokerRef.y },
                        out var buyError
                    ),
                    buyError
                );

                var before = slice.BuildAutomationStateSnapshot(1920, 1080);
                var beforeSnapshot = (JObject)before["snapshot"];
                var beforeReplay = (JObject)before["replay"];
                var beforeHash = beforeReplay.Value<string>("currentStateHash");
                var beforeEvents = ((JObject)beforeReplay["liveRecording"]).Value<int>("recordedEvents");
                Assert.AreEqual("SELECT_CARD_COLOR", beforeSnapshot.Value<string>("phase"));
                Assert.AreEqual("p1", beforeSnapshot.Value<string>("turn"));
                Assert.AreEqual(jokerCard, ((JObject)beforeSnapshot["pendingBuy"]).Value<string>("instanceId"));
                Assert.AreEqual(1, beforeEvents);

                Assert.IsFalse(
                    ApplyLiveRulesCommandForAutomation(
                        slice,
                        "BUY_CARD",
                        new JObject
                        {
                            ["level"] = jokerRef.x,
                            ["idx"] = jokerRef.y,
                            ["bonusColor"] = "blue",
                        },
                        "p2"
                    )
                );

                var after = slice.BuildAutomationStateSnapshot(1920, 1080);
                var afterSnapshot = (JObject)after["snapshot"];
                Assert.AreEqual(
                    "Command actor p2 does not match active player p1.",
                    after.Value<string>("statusText")
                );
                Assert.AreEqual(
                    "Command actor p2 does not match active player p1.",
                    after.Value<string>("errorBanner")
                );
                Assert.AreEqual(beforeHash, ((JObject)after["replay"]).Value<string>("currentStateHash"));
                Assert.AreEqual("SELECT_CARD_COLOR", afterSnapshot.Value<string>("phase"));
                Assert.AreEqual("p1", afterSnapshot.Value<string>("turn"));
                Assert.IsTrue(JToken.DeepEquals(beforeSnapshot["pendingBuy"], afterSnapshot["pendingBuy"]));
                Assert.IsTrue(JToken.DeepEquals(beforeSnapshot["market"], afterSnapshot["market"]));
                Assert.IsTrue(JToken.DeepEquals(beforeSnapshot["playerTableau"], afterSnapshot["playerTableau"]));
                Assert.AreEqual(
                    beforeEvents,
                    ((JObject)((JObject)after["replay"])["liveRecording"]).Value<int>("recordedEvents")
                );
            }
            finally
            {
                Object.DestroyImmediate(root);
                CleanupRenderedSceneObjects();
            }
        }

        [Test]
        public void LiveAffordableJokerBuyCompletesThroughColorSelectionAndReplayReview()
        {
            var root = new GameObject("GemDuel Live Affordable Joker Buy Test");
            GameObject reviewRoot = null;
            string localDevReplayPath = null;
            try
            {
                var slice = root.AddComponent<GemDuelGameController>();
                localDevReplayPath = slice.ResolveLocalDevReplayPathForAutomation();
                if (File.Exists(localDevReplayPath))
                {
                    File.Delete(localDevReplayPath);
                }

                StartLocalGameWithVisibleJoker(
                    slice,
                    "unity-editmode-live-affordable-joker",
                    out var jokerRef,
                    out var jokerCard
                );

                var mutableSnapshot = GetMutableCurrentSnapshot(slice);
                ((JObject)mutableSnapshot["inventories"])["p1"] = new JObject
                {
                    ["red"] = 20,
                    ["green"] = 20,
                    ["blue"] = 20,
                    ["white"] = 20,
                    ["black"] = 20,
                    ["pearl"] = 20,
                    ["gold"] = 20,
                };
                RenderCurrentState(slice);

                var before = slice.BuildAutomationStateSnapshot(1920, 1080);
                var beforeReplay = (JObject)before["replay"];
                var beforeHash = beforeReplay.Value<string>("currentStateHash");
                Assert.AreEqual(
                    0,
                    ((JObject)beforeReplay["liveRecording"]).Value<int>("recordedEvents")
                );

                Assert.IsTrue(
                    slice.RunSemanticActionForAutomation(
                        "buy_card",
                        new JObject { ["level"] = jokerRef.x, ["index"] = jokerRef.y },
                        out var buyError
                    ),
                    buyError
                );

                var colorSelection = slice.BuildAutomationStateSnapshot(1920, 1080);
                var colorSelectionSnapshot = (JObject)colorSelection["snapshot"];
                var colorSelectionReplay = (JObject)colorSelection["replay"];
                Assert.AreEqual("SELECT_CARD_COLOR", colorSelectionSnapshot.Value<string>("phase"));
                Assert.AreEqual(jokerCard, ((JObject)colorSelectionSnapshot["pendingBuy"]).Value<string>("instanceId"));
                Assert.AreNotEqual(beforeHash, colorSelectionReplay.Value<string>("currentStateHash"));
                Assert.AreEqual(
                    1,
                    ((JObject)colorSelectionReplay["liveRecording"]).Value<int>("recordedEvents")
                );

                Assert.IsTrue(
                    slice.RunSemanticActionForAutomation(
                        "select_joker_color",
                        new JObject { ["color"] = "blue" },
                        out var colorError
                    ),
                    colorError
                );

                var after = slice.BuildAutomationStateSnapshot(1920, 1080);
                var afterSnapshot = (JObject)after["snapshot"];
                var afterReplay = (JObject)after["replay"];
                var liveRecording = (JObject)afterReplay["liveRecording"];
                Assert.AreNotEqual("SELECT_CARD_COLOR", afterSnapshot.Value<string>("phase"));
                Assert.IsTrue(
                    afterSnapshot["pendingBuy"] == null ||
                    afterSnapshot["pendingBuy"].Type == JTokenType.Null
                );
                Assert.IsTrue(
                    ((JArray)((JObject)afterSnapshot["playerTableau"])["p1"])
                        .OfType<JObject>()
                        .Any(card => card.Value<string>("instanceId") == jokerCard)
                );
                Assert.AreEqual(2, liveRecording.Value<int>("recordedEvents"));
                Assert.IsTrue(liveRecording.Value<bool>("canExport"));
                Assert.AreEqual(afterReplay.Value<string>("currentStateHash"), liveRecording.Value<string>("summaryFinalStateHash"));
                Assert.AreEqual("Applied live action | BUY_CARD", after.Value<string>("statusText"));
                Assert.IsTrue(string.IsNullOrEmpty(after.Value<string>("errorBanner")));

                Assert.IsTrue(
                    slice.RunSemanticActionForAutomation("open_settings", new JObject(), out var openSettingsError),
                    openSettingsError
                );
                Assert.IsTrue(
                    slice.RunSemanticActionForAutomation("settings_save", new JObject(), out var saveReplayError),
                    saveReplayError
                );
                Assert.IsTrue(File.Exists(localDevReplayPath));
                var exportedReplay = JsonConvert.DeserializeObject<ReplayVNext>(
                    File.ReadAllText(localDevReplayPath)
                );
                Assert.NotNull(exportedReplay);
                Assert.AreEqual(2, exportedReplay.Events.Count);
                Assert.AreEqual(3, exportedReplay.Checkpoints.Count);
                Assert.AreEqual("initiate_buy_joker", exportedReplay.Events[0].Value<string>("type"));
                Assert.AreEqual("buy_card", exportedReplay.Events[1].Value<string>("type"));
                Assert.AreEqual(jokerCard, exportedReplay.Events[1].Value<string>("instanceId"));
                Assert.AreEqual(afterReplay.Value<string>("currentStateHash"), exportedReplay.Summary.FinalStateHash);

                reviewRoot = new GameObject("GemDuel Live Affordable Joker Review Test");
                var review = reviewRoot.AddComponent<GemDuelGameController>();
                Assert.IsTrue(review.ImportReplayFromPathForAutomation(localDevReplayPath, out var importError), importError);
                Assert.IsTrue(review.SetReplayReviewRevisionForAutomation(2, out var reviewError), reviewError);
                var reviewed = review.BuildAutomationStateSnapshot(1920, 1080);
                var reviewedReplay = (JObject)reviewed["replay"];
                Assert.AreEqual(2, reviewedReplay.Value<int>("revision"));
                Assert.AreEqual(2, reviewedReplay.Value<int>("totalEvents"));
                Assert.AreEqual(afterReplay.Value<string>("currentStateHash"), reviewedReplay.Value<string>("currentStateHash"));
            }
            finally
            {
                if (!string.IsNullOrEmpty(localDevReplayPath) && File.Exists(localDevReplayPath))
                {
                    File.Delete(localDevReplayPath);
                }

                if (reviewRoot != null)
                {
                    Object.DestroyImmediate(reviewRoot);
                }

                Object.DestroyImmediate(root);
                CleanupRenderedSceneObjects();
            }
        }

        [Test]
        public void LiveMarketBuyWrongActorDoesNotMutateStateOrReplayRecording()
        {
            var root = new GameObject("GemDuel Live Market Buy Wrong Actor Rejection Test");
            try
            {
                var slice = root.AddComponent<GemDuelGameController>();
                Assert.IsTrue(
                    slice.RunSemanticActionForAutomation(
                        "start_local_game",
                        new JObject { ["seed"] = "unity-editmode-live-market-buy-wrong-actor" },
                        out var startError
                    ),
                    startError
                );

                var before = slice.BuildAutomationStateSnapshot(1920, 1080);
                var beforeSnapshot = (JObject)before["snapshot"];
                var marketRef = FindFirstNonJokerMarketCard(beforeSnapshot, out var marketCard);
                var beforeReplay = (JObject)before["replay"];
                var beforeHash = beforeReplay.Value<string>("currentStateHash");
                Assert.AreEqual("IDLE", beforeSnapshot.Value<string>("phase"));
                Assert.AreEqual("p1", beforeSnapshot.Value<string>("turn"));
                Assert.AreEqual(
                    0,
                    ((JObject)beforeReplay["liveRecording"]).Value<int>("recordedEvents")
                );

                Assert.IsFalse(
                    ApplyLiveRulesCommandForAutomation(
                        slice,
                        "BUY_CARD",
                        new JObject
                        {
                            ["level"] = marketRef.x,
                            ["idx"] = marketRef.y,
                            ["bonusColor"] = "red",
                        },
                        "p2"
                    )
                );

                var after = slice.BuildAutomationStateSnapshot(1920, 1080);
                var afterSnapshot = (JObject)after["snapshot"];
                Assert.AreEqual(
                    "Command actor p2 does not match active player p1.",
                    after.Value<string>("statusText")
                );
                Assert.AreEqual(
                    "Command actor p2 does not match active player p1.",
                    after.Value<string>("errorBanner")
                );
                Assert.AreEqual(beforeHash, ((JObject)after["replay"]).Value<string>("currentStateHash"));
                Assert.AreEqual("IDLE", afterSnapshot.Value<string>("phase"));
                Assert.AreEqual("p1", afterSnapshot.Value<string>("turn"));
                CollectionAssert.Contains(
                    ((JArray)((JObject)afterSnapshot["market"])[marketRef.x.ToString()]).Values<string>().ToList(),
                    marketCard
                );
                Assert.IsFalse(
                    ((JArray)((JObject)afterSnapshot["playerTableau"])["p1"])
                        .OfType<JObject>()
                        .Any(card => card.Value<string>("instanceId") == marketCard)
                );
                Assert.IsFalse(
                    ((JArray)((JObject)afterSnapshot["playerTableau"])["p2"])
                        .OfType<JObject>()
                        .Any(card => card.Value<string>("instanceId") == marketCard)
                );
                Assert.AreEqual(
                    0,
                    ((JObject)((JObject)after["replay"])["liveRecording"]).Value<int>("recordedEvents")
                );
            }
            finally
            {
                Object.DestroyImmediate(root);
                CleanupRenderedSceneObjects();
            }
        }

        [Test]
        public void LiveDirectJokerBuyBypassDoesNotMutateStateOrReplayRecording()
        {
            var root = new GameObject("GemDuel Live Direct Joker Buy Rejection Test");
            try
            {
                var slice = root.AddComponent<GemDuelGameController>();
                var foundJoker = false;
                var jokerRef = new Vector2Int(-1, -1);

                for (var seedIndex = 0; seedIndex < 100 && !foundJoker; seedIndex += 1)
                {
                    Assert.IsTrue(
                        slice.RunSemanticActionForAutomation(
                            "start_local_game",
                            new JObject { ["seed"] = "unity-editmode-live-direct-joker-buy-" + seedIndex },
                            out var startError
                        ),
                        startError
                    );

                    var start = slice.BuildAutomationStateSnapshot(1920, 1080);
                    foundJoker = TryFindFirstJokerMarketCard(
                        (JObject)start["snapshot"],
                        out jokerRef,
                        out _
                    );
                }

                Assert.IsTrue(foundJoker, "Expected a deterministic local start with a visible Joker.");
                var before = slice.BuildAutomationStateSnapshot(1920, 1080);
                var beforeReplay = (JObject)before["replay"];
                var beforeHash = beforeReplay.Value<string>("currentStateHash");
                Assert.AreEqual("IDLE", ((JObject)before["snapshot"]).Value<string>("phase"));
                Assert.AreEqual(
                    0,
                    ((JObject)beforeReplay["liveRecording"]).Value<int>("recordedEvents")
                );

                Assert.IsFalse(
                    ApplyLiveRulesCommandForAutomation(
                        slice,
                        "INITIATE_BUY_JOKER",
                        new JObject
                        {
                            ["level"] = jokerRef.x,
                            ["idx"] = jokerRef.y,
                        },
                        "p2"
                    )
                );

                var afterWrongActor = slice.BuildAutomationStateSnapshot(1920, 1080);
                Assert.AreEqual(
                    "Command actor p2 does not match active player p1.",
                    afterWrongActor.Value<string>("statusText")
                );
                Assert.AreEqual(
                    "Command actor p2 does not match active player p1.",
                    afterWrongActor.Value<string>("errorBanner")
                );
                Assert.AreEqual(
                    beforeHash,
                    ((JObject)afterWrongActor["replay"]).Value<string>("currentStateHash")
                );
                Assert.AreEqual("IDLE", ((JObject)afterWrongActor["snapshot"]).Value<string>("phase"));
                Assert.IsTrue(
                    ((JObject)afterWrongActor["snapshot"])["pendingBuy"] == null ||
                    ((JObject)afterWrongActor["snapshot"])["pendingBuy"].Type == JTokenType.Null
                );
                Assert.AreEqual(
                    0,
                    ((JObject)((JObject)afterWrongActor["replay"])["liveRecording"]).Value<int>("recordedEvents")
                );

                Assert.IsFalse(
                    ApplyLiveRulesCommandForAutomation(
                        slice,
                        "BUY_CARD",
                        new JObject
                        {
                            ["level"] = jokerRef.x,
                            ["idx"] = jokerRef.y,
                            ["bonusColor"] = "blue",
                        }
                    )
                );

                var after = slice.BuildAutomationStateSnapshot(1920, 1080);
                Assert.AreEqual(
                    "Joker cards must be routed through the bonus-color selection flow.",
                    after.Value<string>("statusText")
                );
                Assert.AreEqual(
                    "Joker cards must be routed through the bonus-color selection flow.",
                    after.Value<string>("errorBanner")
                );
                Assert.AreEqual(beforeHash, ((JObject)after["replay"]).Value<string>("currentStateHash"));
                Assert.AreEqual("IDLE", ((JObject)after["snapshot"]).Value<string>("phase"));
                Assert.IsTrue(
                    ((JObject)after["snapshot"])["pendingBuy"] == null ||
                    ((JObject)after["snapshot"])["pendingBuy"].Type == JTokenType.Null
                );
                Assert.AreEqual(
                    0,
                    ((JObject)((JObject)after["replay"])["liveRecording"]).Value<int>("recordedEvents")
                );
            }
            finally
            {
                Object.DestroyImmediate(root);
                CleanupRenderedSceneObjects();
            }
        }

        [Test]
        public void LiveJokerColorSelectionPendingRejectionsDoNotMutateStateOrReplayRecording()
        {
            var root = new GameObject("GemDuel Live Joker Pending Rejection Test");
            try
            {
                var slice = root.AddComponent<GemDuelGameController>();
                StartLocalGameWithVisibleJoker(
                    slice,
                    "unity-editmode-live-joker-missing-pending",
                    out var jokerRef,
                    out _
                );

                Assert.IsTrue(
                    slice.RunSemanticActionForAutomation(
                        "buy_card",
                        new JObject { ["level"] = jokerRef.x, ["index"] = jokerRef.y },
                        out var buyError
                    ),
                    buyError
                );

                var snapshot = GetMutableCurrentSnapshot(slice);
                snapshot["pendingBuy"] = null;
                RenderCurrentState(slice);

                var beforeMissingPending = slice.BuildAutomationStateSnapshot(1920, 1080);
                var beforeMissingPendingReplay = (JObject)beforeMissingPending["replay"];
                var beforeMissingPendingHash = beforeMissingPendingReplay.Value<string>("currentStateHash");
                var beforeMissingPendingEvents = ((JObject)beforeMissingPendingReplay["liveRecording"]).Value<int>(
                    "recordedEvents"
                );
                Assert.AreEqual(
                    "SELECT_CARD_COLOR",
                    ((JObject)beforeMissingPending["snapshot"]).Value<string>("phase")
                );
                Assert.IsTrue(
                    ((JObject)beforeMissingPending["snapshot"])["pendingBuy"] == null ||
                    ((JObject)beforeMissingPending["snapshot"])["pendingBuy"].Type == JTokenType.Null
                );

                Assert.IsFalse(
                    ApplyLiveRulesCommandForAutomation(
                        slice,
                        "BUY_CARD",
                        new JObject
                        {
                            ["level"] = jokerRef.x,
                            ["idx"] = jokerRef.y,
                            ["bonusColor"] = "blue",
                        }
                    )
                );

                var afterMissingPending = slice.BuildAutomationStateSnapshot(1920, 1080);
                Assert.AreEqual(
                    "No pending card is waiting for a bonus-color selection.",
                    afterMissingPending.Value<string>("statusText")
                );
                Assert.AreEqual(
                    "No pending card is waiting for a bonus-color selection.",
                    afterMissingPending.Value<string>("errorBanner")
                );
                Assert.AreEqual(
                    beforeMissingPendingHash,
                    ((JObject)afterMissingPending["replay"]).Value<string>("currentStateHash")
                );
                Assert.AreEqual(
                    beforeMissingPendingEvents,
                    ((JObject)((JObject)afterMissingPending["replay"])["liveRecording"]).Value<int>(
                        "recordedEvents"
                    )
                );

                StartLocalGameWithVisibleJoker(
                    slice,
                    "unity-editmode-live-joker-pending-mismatch",
                    out jokerRef,
                    out _
                );
                Assert.IsTrue(
                    slice.RunSemanticActionForAutomation(
                        "buy_card",
                        new JObject { ["level"] = jokerRef.x, ["index"] = jokerRef.y },
                        out var secondBuyError
                    ),
                    secondBuyError
                );

                var colorSelection = slice.BuildAutomationStateSnapshot(1920, 1080);
                var colorSelectionSnapshot = (JObject)colorSelection["snapshot"];
                var nonJokerRef = FindFirstNonJokerMarketCard(colorSelectionSnapshot, out _);
                var beforeMismatchReplay = (JObject)colorSelection["replay"];
                var beforeMismatchHash = beforeMismatchReplay.Value<string>("currentStateHash");
                var beforeMismatchEvents = ((JObject)beforeMismatchReplay["liveRecording"]).Value<int>(
                    "recordedEvents"
                );
                Assert.AreEqual("SELECT_CARD_COLOR", colorSelectionSnapshot.Value<string>("phase"));
                Assert.IsNotNull(colorSelectionSnapshot["pendingBuy"] as JObject);

                Assert.IsFalse(
                    ApplyLiveRulesCommandForAutomation(
                        slice,
                        "BUY_CARD",
                        new JObject
                        {
                            ["level"] = nonJokerRef.x,
                            ["idx"] = nonJokerRef.y,
                            ["bonusColor"] = "red",
                        }
                    )
                );

                var afterMismatch = slice.BuildAutomationStateSnapshot(1920, 1080);
                Assert.AreEqual(
                    "Selected card does not match the pending bonus-color choice.",
                    afterMismatch.Value<string>("statusText")
                );
                Assert.AreEqual(
                    "Selected card does not match the pending bonus-color choice.",
                    afterMismatch.Value<string>("errorBanner")
                );
                Assert.AreEqual(
                    beforeMismatchHash,
                    ((JObject)afterMismatch["replay"]).Value<string>("currentStateHash")
                );
                Assert.AreEqual("SELECT_CARD_COLOR", ((JObject)afterMismatch["snapshot"]).Value<string>("phase"));
                Assert.IsNotNull(((JObject)afterMismatch["snapshot"])["pendingBuy"] as JObject);
                Assert.AreEqual(
                    beforeMismatchEvents,
                    ((JObject)((JObject)afterMismatch["replay"])["liveRecording"]).Value<int>(
                        "recordedEvents"
                    )
                );
            }
            finally
            {
                Object.DestroyImmediate(root);
                CleanupRenderedSceneObjects();
            }
        }

        [Test]
        public void LiveReservedPreviewBuyRoutesThroughRulesBridge()
        {
            var root = new GameObject("GemDuel Live Bridge Reserved Buy Test");
            try
            {
                var slice = root.AddComponent<GemDuelGameController>();
                Assert.IsTrue(
                    slice.RunSemanticActionForAutomation(
                        "start_local_game",
                        new JObject { ["seed"] = "unity-editmode-live-reserved-buy" },
                        out var startError
                    ),
                    startError
                );

                var start = slice.BuildAutomationStateSnapshot(1920, 1080);
                var startSnapshot = (JObject)start["snapshot"];
                var reservedCardRef = FindFirstNonJokerMarketCard(startSnapshot, out var reservedCard);
                var gold = FindFirstBoardGem(startSnapshot, "gold");

                Assert.IsTrue(
                    slice.RunSemanticActionForAutomation(
                        "reserve_card",
                        new JObject { ["level"] = reservedCardRef.x, ["index"] = reservedCardRef.y },
                        out var reserveError
                    ),
                    reserveError
                );
                Assert.IsTrue(
                    slice.RunSemanticActionForAutomation(
                        "click_board_cell",
                        new JObject { ["row"] = gold.x, ["column"] = gold.y },
                        out var goldError
                    ),
                    goldError
                );

                var afterReserve = slice.BuildAutomationStateSnapshot(1920, 1080);
                var afterReserveSnapshot = (JObject)afterReserve["snapshot"];
                CollectionAssert.Contains(
                    ((JArray)((JObject)afterReserveSnapshot["playerReserved"])["p1"]).Values<string>().ToList(),
                    reservedCard
                );
                Assert.AreEqual("p2", afterReserveSnapshot.Value<string>("turn"));

                var p2Gem = FindFirstCollectibleBoardGem(afterReserveSnapshot, out _);
                Assert.IsTrue(
                    slice.RunSemanticActionForAutomation(
                        "click_board_cell",
                        new JObject { ["row"] = p2Gem.x, ["column"] = p2Gem.y },
                        out var p2SelectError
                    ),
                    p2SelectError
                );
                Assert.IsTrue(
                    slice.RunSemanticActionForAutomation("confirm_gem_selection", null, out var p2ConfirmError),
                    p2ConfirmError
                );

                var ready = slice.BuildAutomationStateSnapshot(1920, 1080);
                var readySnapshot = (JObject)ready["snapshot"];
                Assert.AreEqual("IDLE", readySnapshot.Value<string>("phase"));
                Assert.AreEqual("p1", readySnapshot.Value<string>("turn"));
                CollectionAssert.Contains(
                    ((JArray)((JObject)readySnapshot["playerReserved"])["p1"]).Values<string>().ToList(),
                    reservedCard
                );

                Assert.IsTrue(
                    slice.RunSemanticActionForAutomation(
                        "click_player_reserved",
                        new JObject { ["index"] = 0 },
                        out var previewError
                    ),
                    previewError
                );

                var preview = slice.BuildAutomationStateSnapshot(1920, 1080);
                Assert.AreEqual("reserved", ((JObject)preview["preview"]).Value<string>("source"));
                Assert.AreEqual(reservedCard, ((JObject)preview["preview"]).Value<string>("instanceId"));
                var buyTarget = FindVisibleTarget(preview, "card.preview.primaryAction");
                Assert.AreEqual("ActionButton", buyTarget.Value<string>("kind"));
                Assert.AreEqual("preview-buy", buyTarget.Value<string>("eventType"));

                Assert.IsTrue(
                    slice.RunSemanticActionForAutomation(
                        "confirm_preview_action",
                        new JObject { ["actionId"] = "buy" },
                        out var buyError
                    ),
                    buyError
                );

                var afterBuyAttempt = slice.BuildAutomationStateSnapshot(1920, 1080);
                var afterBuySnapshot = (JObject)afterBuyAttempt["snapshot"];
                var status = afterBuyAttempt.Value<string>("statusText");
                Assert.AreNotEqual("Preview action buy is not legal for this card.", status);
                Assert.AreEqual(0, afterBuyAttempt.Value<int>("totalEvents"));
                Assert.AreEqual("p1", afterBuySnapshot.Value<string>("turn"));

                var reservedAfterBuyAttempt = ((JArray)((JObject)afterBuySnapshot["playerReserved"])["p1"])
                    .Values<string>()
                    .ToList();
                if (!reservedAfterBuyAttempt.Contains(reservedCard))
                {
                    Assert.IsTrue(
                        ((JArray)((JObject)afterBuySnapshot["playerTableau"])["p1"])
                            .OfType<JObject>()
                            .Any(card => card.Value<string>("instanceId") == reservedCard)
                    );
                }
                else
                {
                    Assert.AreNotEqual("Applied live action | BUY_CARD", status);
                    Assert.IsTrue(
                        !string.IsNullOrEmpty(afterBuyAttempt.Value<string>("errorBanner"))
                    );
                }
            }
            finally
            {
                Object.DestroyImmediate(root);
                CleanupRenderedSceneObjects();
            }
        }

        [Test]
        public void LiveMarketPreviewPrimaryActionFirstViewportClickBuysCardOnce()
        {
            var root = new GameObject("GemDuel Live Market Preview First Click Buy Test");
            try
            {
                var slice = root.AddComponent<GemDuelGameController>();
                Assert.IsTrue(
                    slice.RunSemanticActionForAutomation(
                        "start_local_game",
                        new JObject { ["seed"] = "unity-editmode-live-market-preview-first-click-buy" },
                        out var startError
                    ),
                    startError
                );

                var start = slice.BuildAutomationStateSnapshot(1920, 1080);
                var marketRef = FindFirstNonJokerMarketCard((JObject)start["snapshot"], out var marketCard);
                var mutableSnapshot = GetMutableCurrentSnapshot(slice);
                ((JObject)mutableSnapshot["inventories"])["p1"] = new JObject
                {
                    ["red"] = 20,
                    ["green"] = 20,
                    ["blue"] = 20,
                    ["white"] = 20,
                    ["black"] = 20,
                    ["pearl"] = 20,
                    ["gold"] = 20,
                };
                RenderCurrentState(slice);

                Assert.IsTrue(
                    slice.RunSemanticActionForAutomation(
                        "click_market_card",
                        new JObject { ["level"] = marketRef.x, ["index"] = marketRef.y },
                        out var previewError
                    ),
                    previewError
                );

                var preview = slice.BuildAutomationStateSnapshot(1920, 1080);
                var primaryAction = FindVisibleTarget(preview, "card.preview.primaryAction");
                Assert.AreEqual("ActionButton", primaryAction.Value<string>("kind"));
                Assert.AreEqual("preview-buy", primaryAction.Value<string>("eventType"));
                Assert.AreEqual("LexiconTerm", FindVisibleTarget(preview, "lexicon.card.buyCard").Value<string>("kind"));

                Assert.IsTrue(
                    slice.RunSemanticActionForAutomation(
                        "click_preview_keyword",
                        new JObject { ["termId"] = "buyCard" },
                        out var keywordError
                    ),
                    keywordError
                );

                var previewKeyword = slice.BuildAutomationStateSnapshot(1920, 1080);
                Assert.AreEqual("market", ((JObject)previewKeyword["preview"]).Value<string>("source"));
                var activePreviewLexicon = (JObject)previewKeyword["lexicon"];
                Assert.AreEqual("buyCard", activePreviewLexicon.Value<string>("termId"));
                Assert.That(activePreviewLexicon.Value<string>("description"), Does.Contain("市场"));
                Assert.IsTrue(
                    slice.RunSemanticActionForAutomation("close_lexicon_popover", null, out var closeLexiconError),
                    closeLexiconError
                );
                preview = slice.BuildAutomationStateSnapshot(1920, 1080);

                Assert.IsTrue(
                    ClickVisibleTargetCenterForAutomation(
                        slice,
                        preview,
                        "card.preview.primaryAction",
                        out var clickError
                    ),
                    clickError
                );

                var after = slice.BuildAutomationStateSnapshot(1920, 1080);
                var afterSnapshot = (JObject)after["snapshot"];
                var afterReplay = (JObject)after["replay"];
                Assert.IsTrue(
                    ((JArray)((JObject)afterSnapshot["playerTableau"])["p1"])
                        .OfType<JObject>()
                        .Any(card => card.Value<string>("instanceId") == marketCard)
                );
                Assert.IsFalse(
                    ((JArray)((JObject)afterSnapshot["market"])[marketRef.x.ToString()])
                        .Values<string>()
                        .Contains(marketCard)
                );
                Assert.AreEqual(1, ((JObject)afterReplay["liveRecording"]).Value<int>("recordedEvents"));
                Assert.AreEqual("Applied live action | BUY_CARD", after.Value<string>("statusText"));
                Assert.IsTrue(string.IsNullOrEmpty(after.Value<string>("errorBanner")));
            }
            finally
            {
                Object.DestroyImmediate(root);
                CleanupRenderedSceneObjects();
            }
        }

        [Test]
        public void LiveAffordableReservedBuyCompletesThroughPreviewAndReplayReview()
        {
            var root = new GameObject("GemDuel Live Affordable Reserved Buy Test");
            GameObject reviewRoot = null;
            string localDevReplayPath = null;
            try
            {
                var slice = root.AddComponent<GemDuelGameController>();
                localDevReplayPath = slice.ResolveLocalDevReplayPathForAutomation();
                if (File.Exists(localDevReplayPath))
                {
                    File.Delete(localDevReplayPath);
                }

                Assert.IsTrue(
                    slice.RunSemanticActionForAutomation(
                        "start_local_game",
                        new JObject { ["seed"] = "unity-editmode-live-affordable-reserved-buy" },
                        out var startError
                    ),
                    startError
                );

                var start = slice.BuildAutomationStateSnapshot(1920, 1080);
                var startSnapshot = (JObject)start["snapshot"];
                FindFirstNonJokerMarketCard(startSnapshot, out var reservedCard);

                var mutableSnapshot = GetMutableCurrentSnapshot(slice);
                ((JObject)mutableSnapshot["playerReserved"])["p1"] = new JArray(reservedCard);
                ((JObject)mutableSnapshot["inventories"])["p1"] = new JObject
                {
                    ["red"] = 20,
                    ["green"] = 20,
                    ["blue"] = 20,
                    ["white"] = 20,
                    ["black"] = 20,
                    ["pearl"] = 20,
                    ["gold"] = 20,
                };
                RenderCurrentState(slice);

                Assert.IsTrue(
                    slice.RunSemanticActionForAutomation(
                        "click_player_reserved",
                        new JObject { ["index"] = 0 },
                        out var previewError
                    ),
                    previewError
                );

                var preview = slice.BuildAutomationStateSnapshot(1920, 1080);
                Assert.AreEqual("reserved", ((JObject)preview["preview"]).Value<string>("source"));
                Assert.AreEqual(reservedCard, ((JObject)preview["preview"]).Value<string>("instanceId"));
                var buyTarget = FindVisibleTarget(preview, "card.preview.primaryAction");
                Assert.AreEqual("ActionButton", buyTarget.Value<string>("kind"));
                Assert.AreEqual("preview-buy", buyTarget.Value<string>("eventType"));

                Assert.IsTrue(
                    ClickVisibleTargetCenterForAutomation(
                        slice,
                        preview,
                        "card.preview.primaryAction",
                        out var buyError
                    ),
                    buyError
                );

                var after = slice.BuildAutomationStateSnapshot(1920, 1080);
                var afterSnapshot = (JObject)after["snapshot"];
                var afterReplay = (JObject)after["replay"];
                var liveRecording = (JObject)afterReplay["liveRecording"];
                Assert.IsFalse(
                    ((JArray)((JObject)afterSnapshot["playerReserved"])["p1"])
                        .Values<string>()
                        .Contains(reservedCard)
                );
                Assert.IsTrue(
                    ((JArray)((JObject)afterSnapshot["playerTableau"])["p1"])
                        .OfType<JObject>()
                        .Any(card => card.Value<string>("instanceId") == reservedCard)
                );
                Assert.AreEqual(1, liveRecording.Value<int>("recordedEvents"));
                Assert.IsTrue(liveRecording.Value<bool>("canExport"));
                Assert.AreEqual(afterReplay.Value<string>("currentStateHash"), liveRecording.Value<string>("summaryFinalStateHash"));
                Assert.AreEqual("Applied live action | BUY_CARD", after.Value<string>("statusText"));
                Assert.IsTrue(string.IsNullOrEmpty(after.Value<string>("errorBanner")));

                Assert.IsTrue(
                    slice.RunSemanticActionForAutomation("open_settings", new JObject(), out var openSettingsError),
                    openSettingsError
                );
                Assert.IsTrue(
                    slice.RunSemanticActionForAutomation("settings_save", new JObject(), out var saveReplayError),
                    saveReplayError
                );
                Assert.IsTrue(File.Exists(localDevReplayPath));
                var exportedReplay = JsonConvert.DeserializeObject<ReplayVNext>(
                    File.ReadAllText(localDevReplayPath)
                );
                Assert.NotNull(exportedReplay);
                Assert.AreEqual(1, exportedReplay.Events.Count);
                Assert.AreEqual(2, exportedReplay.Checkpoints.Count);
                Assert.AreEqual("buy_card", exportedReplay.Events[0].Value<string>("type"));
                Assert.AreEqual("reserved", exportedReplay.Events[0].Value<string>("source"));
                Assert.AreEqual(reservedCard, exportedReplay.Events[0].Value<string>("instanceId"));
                Assert.AreEqual(afterReplay.Value<string>("currentStateHash"), exportedReplay.Summary.FinalStateHash);

                reviewRoot = new GameObject("GemDuel Live Affordable Reserved Review Test");
                var review = reviewRoot.AddComponent<GemDuelGameController>();
                Assert.IsTrue(review.ImportReplayFromPathForAutomation(localDevReplayPath, out var importError), importError);
                Assert.IsTrue(review.SetReplayReviewRevisionForAutomation(1, out var reviewError), reviewError);
                var reviewed = review.BuildAutomationStateSnapshot(1920, 1080);
                var reviewedReplay = (JObject)reviewed["replay"];
                Assert.AreEqual(1, reviewedReplay.Value<int>("revision"));
                Assert.AreEqual(1, reviewedReplay.Value<int>("totalEvents"));
                Assert.AreEqual(afterReplay.Value<string>("currentStateHash"), reviewedReplay.Value<string>("currentStateHash"));
            }
            finally
            {
                if (!string.IsNullOrEmpty(localDevReplayPath) && File.Exists(localDevReplayPath))
                {
                    File.Delete(localDevReplayPath);
                }

                if (reviewRoot != null)
                {
                    Object.DestroyImmediate(reviewRoot);
                }

                Object.DestroyImmediate(root);
                CleanupRenderedSceneObjects();
            }
        }

        [Test]
        public void LiveUnaffordableReservedBuyDoesNotMutateStateOrReplayRecording()
        {
            var root = new GameObject("GemDuel Live Reserved Buy Rejection Test");
            try
            {
                var slice = root.AddComponent<GemDuelGameController>();
                Assert.IsTrue(
                    slice.RunSemanticActionForAutomation(
                        "start_local_game",
                        new JObject { ["seed"] = "unity-editmode-live-reserved-buy-rejection" },
                        out var startError
                    ),
                    startError
                );

                var start = slice.BuildAutomationStateSnapshot(1920, 1080);
                var startSnapshot = (JObject)start["snapshot"];
                var reservedCard = ((JArray)((JObject)startSnapshot["market"])["3"])
                    .Values<string>()
                    .First(instanceId => !string.IsNullOrEmpty(instanceId));

                var snapshot = GetMutableCurrentSnapshot(slice);
                ((JObject)snapshot["playerReserved"])["p1"] = new JArray(reservedCard);
                ((JObject)snapshot["inventories"])["p1"] = new JObject
                {
                    ["red"] = 0,
                    ["green"] = 0,
                    ["blue"] = 0,
                    ["white"] = 0,
                    ["black"] = 0,
                    ["pearl"] = 0,
                    ["gold"] = 0,
                };
                RenderCurrentState(slice);

                var before = slice.BuildAutomationStateSnapshot(1920, 1080);
                var beforeReplay = (JObject)before["replay"];
                var beforeHash = beforeReplay.Value<string>("currentStateHash");
                Assert.AreEqual("IDLE", ((JObject)before["snapshot"]).Value<string>("phase"));
                Assert.AreEqual(
                    0,
                    ((JObject)beforeReplay["liveRecording"]).Value<int>("recordedEvents")
                );

                Assert.IsFalse(
                    ApplyLiveRulesCommandForAutomation(
                        slice,
                        "BUY_RESERVED_CARD",
                        new JObject { ["instanceId"] = reservedCard, ["bonusColor"] = "red" },
                        "p2"
                    )
                );

                var afterWrongActor = slice.BuildAutomationStateSnapshot(1920, 1080);
                var afterWrongActorSnapshot = (JObject)afterWrongActor["snapshot"];
                Assert.AreEqual(
                    "Selected reserved card does not belong to the active player.",
                    afterWrongActor.Value<string>("statusText")
                );
                Assert.AreEqual(
                    "Selected reserved card does not belong to the active player.",
                    afterWrongActor.Value<string>("errorBanner")
                );
                Assert.AreEqual(beforeHash, ((JObject)afterWrongActor["replay"]).Value<string>("currentStateHash"));
                Assert.AreEqual("IDLE", afterWrongActorSnapshot.Value<string>("phase"));
                CollectionAssert.Contains(
                    ((JArray)((JObject)afterWrongActorSnapshot["playerReserved"])["p1"]).Values<string>().ToList(),
                    reservedCard
                );
                Assert.IsFalse(
                    ((JArray)((JObject)afterWrongActorSnapshot["playerTableau"])["p1"])
                        .OfType<JObject>()
                        .Any(card => card.Value<string>("instanceId") == reservedCard)
                );
                Assert.AreEqual(
                    0,
                    ((JObject)((JObject)afterWrongActor["replay"])["liveRecording"]).Value<int>("recordedEvents")
                );

                Assert.IsFalse(
                    ApplyLiveRulesCommandForAutomation(
                        slice,
                        "BUY_RESERVED_CARD",
                        new JObject { ["instanceId"] = reservedCard, ["bonusColor"] = "red" }
                    )
                );

                var after = slice.BuildAutomationStateSnapshot(1920, 1080);
                var afterSnapshot = (JObject)after["snapshot"];
                Assert.AreEqual("Action BUY_CARD did not change replay state.", after.Value<string>("statusText"));
                Assert.AreEqual("Action BUY_CARD did not change replay state.", after.Value<string>("errorBanner"));
                Assert.AreEqual(beforeHash, ((JObject)after["replay"]).Value<string>("currentStateHash"));
                Assert.AreEqual("IDLE", afterSnapshot.Value<string>("phase"));
                CollectionAssert.Contains(
                    ((JArray)((JObject)afterSnapshot["playerReserved"])["p1"]).Values<string>().ToList(),
                    reservedCard
                );
                Assert.IsFalse(
                    ((JArray)((JObject)afterSnapshot["playerTableau"])["p1"])
                        .OfType<JObject>()
                        .Any(card => card.Value<string>("instanceId") == reservedCard)
                );
                Assert.AreEqual(
                    0,
                    ((JObject)((JObject)after["replay"])["liveRecording"]).Value<int>("recordedEvents")
                );
            }
            finally
            {
                Object.DestroyImmediate(root);
                CleanupRenderedSceneObjects();
            }
        }

        [Test]
        public void LiveReservedDiscardRoutesThroughRulesBridgeWhenBuffAllows()
        {
            var root = new GameObject("GemDuel Live Bridge Reserved Discard Test");
            try
            {
                var slice = root.AddComponent<GemDuelGameController>();
                Assert.IsTrue(
                    slice.RunSemanticActionForAutomation(
                        "start_local_game",
                        new JObject { ["seed"] = "unity-editmode-live-discard-reserved" },
                        out var startError
                    ),
                    startError
                );

                var snapshot = GetMutableCurrentSnapshot(slice);
                FindFirstNonJokerMarketCard(snapshot, out var reservedCard);
                ((JArray)((JObject)snapshot["playerReserved"])["p1"]).Add(reservedCard);
                ((JObject)snapshot["playerBuffs"])["p1"] = new JObject
                {
                    ["buff"] = new JObject
                    {
                        ["id"] = "puppet_master",
                        ["level"] = 3,
                    },
                };
                RenderCurrentState(slice);

                var ready = slice.BuildAutomationStateSnapshot(1920, 1080);
                var reservedTarget = FindVisibleTarget(ready, "player.reserved.0");
                Assert.AreEqual("ReservedCard", reservedTarget.Value<string>("kind"));
                Assert.AreEqual(reservedCard, reservedTarget.Value<string>("instanceId"));

                Assert.IsTrue(
                    slice.RunSemanticActionForAutomation(
                        "click_player_reserved",
                        new JObject { ["index"] = 0 },
                        out var previewError
                    ),
                    previewError
                );

                var preview = slice.BuildAutomationStateSnapshot(1920, 1080);
                Assert.AreEqual("reserved", ((JObject)preview["preview"]).Value<string>("source"));
                var discardTarget = FindVisibleTarget(preview, "card.preview.action.discard");
                Assert.AreEqual("ActionButton", discardTarget.Value<string>("kind"));
                Assert.AreEqual("preview-discard", discardTarget.Value<string>("eventType"));

                Assert.IsTrue(
                    ClickVisibleTargetCenterForAutomation(
                        slice,
                        preview,
                        "card.preview.action.discard",
                        out var discardError
                    ),
                    discardError
                );

                var after = slice.BuildAutomationStateSnapshot(1920, 1080);
                var afterSnapshot = (JObject)after["snapshot"];
                CollectionAssert.DoesNotContain(
                    ((JArray)((JObject)afterSnapshot["playerReserved"])["p1"]).Values<string>().ToList(),
                    reservedCard
                );
                Assert.AreEqual("Applied live action | DISCARD_RESERVED", after.Value<string>("statusText"));
                Assert.AreEqual(0, after.Value<int>("totalEvents"));
            }
            finally
            {
                Object.DestroyImmediate(root);
                CleanupRenderedSceneObjects();
            }
        }

        [Test]
        public void LiveReservedDiscardRejectionsDoNotMutateStateOrReplayRecording()
        {
            var root = new GameObject("GemDuel Live Reserved Discard Rejection Test");
            try
            {
                var slice = root.AddComponent<GemDuelGameController>();
                Assert.IsTrue(
                    slice.RunSemanticActionForAutomation(
                        "start_local_game",
                        new JObject { ["seed"] = "unity-editmode-live-discard-reserved-rejections" },
                        out var startError
                    ),
                    startError
                );

                var snapshot = GetMutableCurrentSnapshot(slice);
                var marketCards = ((JObject)snapshot["market"])
                    .Properties()
                    .SelectMany(property => ((JArray)property.Value).Values<string>())
                    .Where(instanceId => !string.IsNullOrEmpty(instanceId) && !instanceId.Contains("-jo#"))
                    .Take(2)
                    .ToList();
                Assert.GreaterOrEqual(marketCards.Count, 2);
                var p1ReservedCard = marketCards[0];
                var p2ReservedCard = marketCards[1];
                ((JArray)((JObject)snapshot["playerReserved"])["p1"]).Add(p1ReservedCard);
                ((JArray)((JObject)snapshot["playerReserved"])["p2"]).Add(p2ReservedCard);
                ((JObject)snapshot["playerBuffs"])["p1"] = new JObject
                {
                    ["buff"] = new JObject
                    {
                        ["id"] = "puppet_master",
                        ["level"] = 3,
                    },
                };
                RenderCurrentState(slice);

                var beforeNotOwned = slice.BuildAutomationStateSnapshot(1920, 1080);
                var beforeNotOwnedReplay = (JObject)beforeNotOwned["replay"];
                var beforeNotOwnedHash = beforeNotOwnedReplay.Value<string>("currentStateHash");
                var beforeNotOwnedRecordedEvents = ((JObject)beforeNotOwnedReplay["liveRecording"]).Value<int>(
                    "recordedEvents"
                );

                Assert.IsFalse(
                    ApplyLiveRulesCommandForAutomation(
                        slice,
                        "DISCARD_RESERVED",
                        new JObject { ["cardId"] = p1ReservedCard },
                        "p2"
                    )
                );

                var afterWrongActor = slice.BuildAutomationStateSnapshot(1920, 1080);
                Assert.AreEqual(
                    "Command actor p2 does not match active player p1.",
                    afterWrongActor.Value<string>("statusText")
                );
                Assert.AreEqual(
                    "Command actor p2 does not match active player p1.",
                    afterWrongActor.Value<string>("errorBanner")
                );
                Assert.AreEqual(beforeNotOwnedHash, ((JObject)afterWrongActor["replay"]).Value<string>("currentStateHash"));
                CollectionAssert.Contains(
                    ((JArray)((JObject)((JObject)afterWrongActor["snapshot"])["playerReserved"])["p1"])
                        .Values<string>()
                        .ToList(),
                    p1ReservedCard
                );
                CollectionAssert.Contains(
                    ((JArray)((JObject)((JObject)afterWrongActor["snapshot"])["playerReserved"])["p2"])
                        .Values<string>()
                        .ToList(),
                    p2ReservedCard
                );
                Assert.AreEqual(
                    beforeNotOwnedRecordedEvents,
                    ((JObject)((JObject)afterWrongActor["replay"])["liveRecording"]).Value<int>("recordedEvents")
                );

                Assert.IsFalse(
                    ApplyLiveRulesCommandForAutomation(
                        slice,
                        "DISCARD_RESERVED",
                        new JObject { ["cardId"] = p2ReservedCard }
                    )
                );

                var afterNotOwned = slice.BuildAutomationStateSnapshot(1920, 1080);
                Assert.AreEqual("Selected reserved card does not exist.", afterNotOwned.Value<string>("statusText"));
                Assert.AreEqual("Selected reserved card does not exist.", afterNotOwned.Value<string>("errorBanner"));
                Assert.AreEqual(beforeNotOwnedHash, ((JObject)afterNotOwned["replay"]).Value<string>("currentStateHash"));
                CollectionAssert.Contains(
                    ((JArray)((JObject)((JObject)afterNotOwned["snapshot"])["playerReserved"])["p1"])
                        .Values<string>()
                        .ToList(),
                    p1ReservedCard
                );
                CollectionAssert.Contains(
                    ((JArray)((JObject)((JObject)afterNotOwned["snapshot"])["playerReserved"])["p2"])
                        .Values<string>()
                        .ToList(),
                    p2ReservedCard
                );
                Assert.AreEqual(
                    beforeNotOwnedRecordedEvents,
                    ((JObject)((JObject)afterNotOwned["replay"])["liveRecording"]).Value<int>("recordedEvents")
                );

                snapshot = GetMutableCurrentSnapshot(slice);
                snapshot["phase"] = "DRAFT_PHASE";
                RenderCurrentState(slice);

                var beforeWrongPhase = slice.BuildAutomationStateSnapshot(1920, 1080);
                var beforeWrongPhaseReplay = (JObject)beforeWrongPhase["replay"];
                var beforeWrongPhaseHash = beforeWrongPhaseReplay.Value<string>("currentStateHash");
                var beforeWrongPhaseRecordedEvents = ((JObject)beforeWrongPhaseReplay["liveRecording"]).Value<int>(
                    "recordedEvents"
                );
                Assert.AreEqual("DRAFT_PHASE", ((JObject)beforeWrongPhase["snapshot"]).Value<string>("phase"));

                Assert.IsFalse(
                    ApplyLiveRulesCommandForAutomation(
                        slice,
                        "DISCARD_RESERVED",
                        new JObject { ["cardId"] = p1ReservedCard }
                    )
                );

                var afterWrongPhase = slice.BuildAutomationStateSnapshot(1920, 1080);
                Assert.AreEqual(
                    "DISCARD_RESERVED is only allowed during the IDLE phase.",
                    afterWrongPhase.Value<string>("statusText")
                );
                Assert.AreEqual(
                    "DISCARD_RESERVED is only allowed during the IDLE phase.",
                    afterWrongPhase.Value<string>("errorBanner")
                );
                Assert.AreEqual(
                    beforeWrongPhaseHash,
                    ((JObject)afterWrongPhase["replay"]).Value<string>("currentStateHash")
                );
                Assert.AreEqual("DRAFT_PHASE", ((JObject)afterWrongPhase["snapshot"]).Value<string>("phase"));
                Assert.AreEqual(
                    beforeWrongPhaseRecordedEvents,
                    ((JObject)((JObject)afterWrongPhase["replay"])["liveRecording"]).Value<int>("recordedEvents")
                );
            }
            finally
            {
                Object.DestroyImmediate(root);
                CleanupRenderedSceneObjects();
            }
        }

        [Test]
        public void LivePrivilegeActivationAndUseAdvanceThroughRulesBridge()
        {
            var root = new GameObject("GemDuel Live Bridge Privilege Test");
            try
            {
                var slice = root.AddComponent<GemDuelGameController>();
                Assert.IsTrue(
                    slice.RunSemanticActionForAutomation(
                        "start_local_game",
                        new JObject { ["seed"] = "unity-editmode-live-privilege" },
                        out var startError
                    ),
                    startError
                );

                var start = slice.BuildAutomationStateSnapshot(1920, 1080);
                var startSnapshot = (JObject)start["snapshot"];
                var p1Gem = FindFirstCollectibleBoardGem(startSnapshot, out _);
                Assert.IsTrue(
                    slice.RunSemanticActionForAutomation(
                        "click_board_cell",
                        new JObject { ["row"] = p1Gem.x, ["column"] = p1Gem.y },
                        out var selectError
                    ),
                    selectError
                );
                Assert.IsTrue(
                    slice.RunSemanticActionForAutomation("confirm_gem_selection", null, out var confirmError),
                    confirmError
                );

                var p2Ready = slice.BuildAutomationStateSnapshot(1920, 1080);
                var p2ReadySnapshot = (JObject)p2Ready["snapshot"];
                Assert.AreEqual("IDLE", p2ReadySnapshot.Value<string>("phase"));
                Assert.AreEqual("p2", p2ReadySnapshot.Value<string>("turn"));
                Assert.AreEqual(1, ((JObject)p2ReadySnapshot["privileges"]).Value<int>("p2"));

                var privilegeTarget = FindVisibleTarget(p2Ready, "privilege.scroll.placeholder");
                Assert.AreEqual("ActionButton", privilegeTarget.Value<string>("kind"));
                Assert.AreEqual("activate-privilege", privilegeTarget.Value<string>("eventType"));
                Assert.IsTrue(privilegeTarget.Value<bool>("clickable"));

                Assert.IsTrue(
                    slice.RunSemanticActionForAutomation("activate_privilege", null, out var activateError),
                    activateError
                );

                var activated = slice.BuildAutomationStateSnapshot(1920, 1080);
                var activatedSnapshot = (JObject)activated["snapshot"];
                Assert.AreEqual("PRIVILEGE_ACTION", activatedSnapshot.Value<string>("phase"));
                Assert.AreEqual("p2", activatedSnapshot.Value<string>("turn"));

                var privilegeGem = FindFirstCollectibleBoardGem(activatedSnapshot, out var privilegeGemId);
                var beforeInventory = ((JObject)((JObject)activatedSnapshot["inventories"])["p2"]).Value<int>(privilegeGemId);
                Assert.IsTrue(
                    slice.RunSemanticActionForAutomation(
                        "click_board_cell",
                        new JObject { ["row"] = privilegeGem.x, ["column"] = privilegeGem.y },
                        out var useError
                    ),
                    useError
                );

                var after = slice.BuildAutomationStateSnapshot(1920, 1080);
                var afterSnapshot = (JObject)after["snapshot"];
                Assert.AreEqual("IDLE", afterSnapshot.Value<string>("phase"));
                Assert.AreEqual("p2", afterSnapshot.Value<string>("turn"));
                Assert.AreEqual(0, ((JObject)afterSnapshot["privileges"]).Value<int>("p2"));
                Assert.AreEqual("empty", ((JArray)afterSnapshot["board"])[privilegeGem.x][privilegeGem.y].Value<string>());
                Assert.AreEqual(
                    beforeInventory + 1,
                    ((JObject)((JObject)afterSnapshot["inventories"])["p2"]).Value<int>(privilegeGemId)
                );
                Assert.AreEqual("Applied live action | USE_PRIVILEGE", after.Value<string>("statusText"));
                Assert.AreEqual(0, after.Value<int>("totalEvents"));
            }
            finally
            {
                Object.DestroyImmediate(root);
                CleanupRenderedSceneObjects();
            }
        }

        [Test]
        public void LivePrivilegeActivationRejectionsDoNotMutateStateOrReplayRecording()
        {
            var root = new GameObject("GemDuel Live Privilege Activation Rejection Test");
            try
            {
                var slice = root.AddComponent<GemDuelGameController>();
                Assert.IsTrue(
                    slice.RunSemanticActionForAutomation(
                        "start_local_game",
                        new JObject { ["seed"] = "unity-editmode-live-privilege-activation-rejections" },
                        out var startError
                    ),
                    startError
                );

                var beforeNoCharge = slice.BuildAutomationStateSnapshot(1920, 1080);
                var beforeNoChargeReplay = (JObject)beforeNoCharge["replay"];
                var beforeNoChargeHash = beforeNoChargeReplay.Value<string>("currentStateHash");
                Assert.AreEqual("IDLE", ((JObject)beforeNoCharge["snapshot"]).Value<string>("phase"));
                Assert.AreEqual(
                    0,
                    ((JObject)beforeNoChargeReplay["liveRecording"]).Value<int>("recordedEvents")
                );

                Assert.IsFalse(ApplyLiveRulesCommandForAutomation(slice, "ACTIVATE_PRIVILEGE", new JObject()));

                var afterNoCharge = slice.BuildAutomationStateSnapshot(1920, 1080);
                Assert.AreEqual("The active player has no privilege to spend.", afterNoCharge.Value<string>("statusText"));
                Assert.AreEqual("The active player has no privilege to spend.", afterNoCharge.Value<string>("errorBanner"));
                Assert.AreEqual(beforeNoChargeHash, ((JObject)afterNoCharge["replay"]).Value<string>("currentStateHash"));
                Assert.AreEqual(
                    0,
                    ((JObject)((JObject)afterNoCharge["replay"])["liveRecording"]).Value<int>("recordedEvents")
                );

                var snapshot = GetMutableCurrentSnapshot(slice);
                ((JObject)snapshot["privileges"])["p1"] = 1;
                RenderCurrentState(slice);

                var beforeWrongActor = slice.BuildAutomationStateSnapshot(1920, 1080);
                var beforeWrongActorSnapshot = (JObject)beforeWrongActor["snapshot"];
                var beforeWrongActorReplay = (JObject)beforeWrongActor["replay"];
                var beforeWrongActorHash = beforeWrongActorReplay.Value<string>("currentStateHash");
                var wrongActorTarget = FindFirstCollectibleBoardGem(beforeWrongActorSnapshot, out var wrongActorGemId);
                Assert.AreEqual("IDLE", beforeWrongActorSnapshot.Value<string>("phase"));
                Assert.AreEqual("p1", beforeWrongActorSnapshot.Value<string>("turn"));
                Assert.AreEqual(1, ((JObject)beforeWrongActorSnapshot["privileges"]).Value<int>("p1"));
                Assert.AreEqual(
                    0,
                    ((JObject)beforeWrongActorReplay["liveRecording"]).Value<int>("recordedEvents")
                );

                Assert.IsFalse(ApplyLiveRulesCommandForAutomation(slice, "ACTIVATE_PRIVILEGE", new JObject(), "p2"));

                var afterWrongActor = slice.BuildAutomationStateSnapshot(1920, 1080);
                var afterWrongActorSnapshot = (JObject)afterWrongActor["snapshot"];
                Assert.AreEqual(
                    "Command actor p2 does not match active player p1.",
                    afterWrongActor.Value<string>("statusText")
                );
                Assert.AreEqual(
                    "Command actor p2 does not match active player p1.",
                    afterWrongActor.Value<string>("errorBanner")
                );
                Assert.AreEqual(
                    beforeWrongActorHash,
                    ((JObject)afterWrongActor["replay"]).Value<string>("currentStateHash")
                );
                Assert.AreEqual("IDLE", afterWrongActorSnapshot.Value<string>("phase"));
                Assert.AreEqual("p1", afterWrongActorSnapshot.Value<string>("turn"));
                Assert.AreEqual(1, ((JObject)afterWrongActorSnapshot["privileges"]).Value<int>("p1"));
                Assert.AreEqual(
                    wrongActorGemId,
                    ((JArray)((JArray)afterWrongActorSnapshot["board"])[wrongActorTarget.x])[
                        wrongActorTarget.y
                    ].Value<string>()
                );
                Assert.AreEqual(
                    0,
                    ((JObject)((JObject)afterWrongActor["replay"])["liveRecording"]).Value<int>("recordedEvents")
                );

                snapshot = GetMutableCurrentSnapshot(slice);
                ((JObject)snapshot["privileges"])["p1"] = 1;
                foreach (var row in ((JArray)snapshot["board"]).OfType<JArray>())
                {
                    for (var column = 0; column < row.Count; column += 1)
                    {
                        row[column] = "empty";
                    }
                }
                RenderCurrentState(slice);

                var beforeNoTargets = slice.BuildAutomationStateSnapshot(1920, 1080);
                var beforeNoTargetsReplay = (JObject)beforeNoTargets["replay"];
                var beforeNoTargetsHash = beforeNoTargetsReplay.Value<string>("currentStateHash");
                Assert.AreEqual(1, ((JObject)((JObject)beforeNoTargets["snapshot"])["privileges"]).Value<int>("p1"));

                Assert.IsFalse(ApplyLiveRulesCommandForAutomation(slice, "ACTIVATE_PRIVILEGE", new JObject()));

                var afterNoTargets = slice.BuildAutomationStateSnapshot(1920, 1080);
                Assert.AreEqual(
                    "There are no valid gems available for a privilege action.",
                    afterNoTargets.Value<string>("statusText")
                );
                Assert.AreEqual(
                    "There are no valid gems available for a privilege action.",
                    afterNoTargets.Value<string>("errorBanner")
                );
                Assert.AreEqual(beforeNoTargetsHash, ((JObject)afterNoTargets["replay"]).Value<string>("currentStateHash"));
                Assert.AreEqual("IDLE", ((JObject)afterNoTargets["snapshot"]).Value<string>("phase"));
                Assert.AreEqual(
                    0,
                    ((JObject)((JObject)afterNoTargets["replay"])["liveRecording"]).Value<int>("recordedEvents")
                );
            }
            finally
            {
                Object.DestroyImmediate(root);
                CleanupRenderedSceneObjects();
            }
        }

        [Test]
        public void LivePrivilegeUseRejectionsDoNotMutateStateOrReplayRecording()
        {
            var root = new GameObject("GemDuel Live Privilege Use Rejection Test");
            try
            {
                var slice = root.AddComponent<GemDuelGameController>();
                Assert.IsTrue(
                    slice.RunSemanticActionForAutomation(
                        "start_local_game",
                        new JObject { ["seed"] = "unity-editmode-live-privilege-use-rejections" },
                        out var startError
                    ),
                    startError
                );

                var snapshot = GetMutableCurrentSnapshot(slice);
                snapshot["phase"] = "PRIVILEGE_ACTION";
                ((JObject)snapshot["privileges"])["p1"] = 1;
                if (snapshot["extraPrivileges"] is JObject extraPrivileges)
                {
                    extraPrivileges["p1"] = 0;
                }
                RenderCurrentState(slice);

                var beforeWrongActor = slice.BuildAutomationStateSnapshot(1920, 1080);
                var beforeWrongActorSnapshot = (JObject)beforeWrongActor["snapshot"];
                var beforeWrongActorReplay = (JObject)beforeWrongActor["replay"];
                var beforeWrongActorHash = beforeWrongActorReplay.Value<string>("currentStateHash");
                var wrongActorTarget = FindFirstCollectibleBoardGem(
                    beforeWrongActorSnapshot,
                    out var wrongActorGemId
                );
                var beforeWrongActorInventory = ((JObject)((JObject)beforeWrongActorSnapshot["inventories"])["p1"])
                    .Value<int>(wrongActorGemId);
                Assert.AreEqual("PRIVILEGE_ACTION", beforeWrongActorSnapshot.Value<string>("phase"));
                Assert.AreEqual("p1", beforeWrongActorSnapshot.Value<string>("turn"));
                Assert.AreEqual(1, ((JObject)beforeWrongActorSnapshot["privileges"]).Value<int>("p1"));
                Assert.AreEqual(
                    0,
                    ((JObject)beforeWrongActorReplay["liveRecording"]).Value<int>("recordedEvents")
                );

                Assert.IsFalse(
                    ApplyLiveRulesCommandForAutomation(
                        slice,
                        "USE_PRIVILEGE",
                        new JObject { ["r"] = wrongActorTarget.x, ["c"] = wrongActorTarget.y },
                        "p2"
                    )
                );

                var afterWrongActor = slice.BuildAutomationStateSnapshot(1920, 1080);
                var afterWrongActorSnapshot = (JObject)afterWrongActor["snapshot"];
                Assert.AreEqual(
                    "Command actor p2 does not match active player p1.",
                    afterWrongActor.Value<string>("statusText")
                );
                Assert.AreEqual(
                    "Command actor p2 does not match active player p1.",
                    afterWrongActor.Value<string>("errorBanner")
                );
                Assert.AreEqual(
                    beforeWrongActorHash,
                    ((JObject)afterWrongActor["replay"]).Value<string>("currentStateHash")
                );
                Assert.AreEqual("PRIVILEGE_ACTION", afterWrongActorSnapshot.Value<string>("phase"));
                Assert.AreEqual("p1", afterWrongActorSnapshot.Value<string>("turn"));
                Assert.AreEqual(1, ((JObject)afterWrongActorSnapshot["privileges"]).Value<int>("p1"));
                Assert.AreEqual(
                    wrongActorGemId,
                    ((JArray)((JArray)afterWrongActorSnapshot["board"])[wrongActorTarget.x])[
                        wrongActorTarget.y
                    ].Value<string>()
                );
                Assert.AreEqual(
                    beforeWrongActorInventory,
                    ((JObject)((JObject)afterWrongActorSnapshot["inventories"])["p1"]).Value<int>(wrongActorGemId)
                );
                Assert.AreEqual(
                    0,
                    ((JObject)((JObject)afterWrongActor["replay"])["liveRecording"]).Value<int>("recordedEvents")
                );

                snapshot = GetMutableCurrentSnapshot(slice);
                snapshot["phase"] = "PRIVILEGE_ACTION";
                ((JObject)snapshot["privileges"])["p1"] = 0;
                if (snapshot["extraPrivileges"] is JObject noChargeExtraPrivileges)
                {
                    noChargeExtraPrivileges["p1"] = 0;
                }
                RenderCurrentState(slice);

                var beforeNoCharge = slice.BuildAutomationStateSnapshot(1920, 1080);
                var beforeNoChargeSnapshot = (JObject)beforeNoCharge["snapshot"];
                var beforeNoChargeReplay = (JObject)beforeNoCharge["replay"];
                var beforeNoChargeHash = beforeNoChargeReplay.Value<string>("currentStateHash");
                var validTarget = FindFirstCollectibleBoardGem(beforeNoChargeSnapshot, out _);
                Assert.AreEqual("PRIVILEGE_ACTION", beforeNoChargeSnapshot.Value<string>("phase"));
                Assert.AreEqual(
                    0,
                    ((JObject)beforeNoChargeReplay["liveRecording"]).Value<int>("recordedEvents")
                );

                Assert.IsFalse(
                    ApplyLiveRulesCommandForAutomation(
                        slice,
                        "USE_PRIVILEGE",
                        new JObject { ["r"] = validTarget.x, ["c"] = validTarget.y }
                    )
                );

                var afterNoCharge = slice.BuildAutomationStateSnapshot(1920, 1080);
                Assert.AreEqual(
                    "The active player has no privilege charge available.",
                    afterNoCharge.Value<string>("statusText")
                );
                Assert.AreEqual(
                    "The active player has no privilege charge available.",
                    afterNoCharge.Value<string>("errorBanner")
                );
                Assert.AreEqual(beforeNoChargeHash, ((JObject)afterNoCharge["replay"]).Value<string>("currentStateHash"));
                Assert.AreEqual("PRIVILEGE_ACTION", ((JObject)afterNoCharge["snapshot"]).Value<string>("phase"));
                Assert.AreEqual(
                    0,
                    ((JObject)((JObject)afterNoCharge["replay"])["liveRecording"]).Value<int>("recordedEvents")
                );

                snapshot = GetMutableCurrentSnapshot(slice);
                snapshot["phase"] = "PRIVILEGE_ACTION";
                ((JObject)snapshot["privileges"])["p1"] = 1;
                if (snapshot["extraPrivileges"] is JObject invalidTargetExtraPrivileges)
                {
                    invalidTargetExtraPrivileges["p1"] = 0;
                }
                ((JArray)((JArray)snapshot["board"])[0])[0] = "empty";
                RenderCurrentState(slice);

                var beforeInvalidTarget = slice.BuildAutomationStateSnapshot(1920, 1080);
                var beforeInvalidTargetReplay = (JObject)beforeInvalidTarget["replay"];
                var beforeInvalidTargetHash = beforeInvalidTargetReplay.Value<string>("currentStateHash");
                Assert.AreEqual(1, ((JObject)((JObject)beforeInvalidTarget["snapshot"])["privileges"]).Value<int>("p1"));

                Assert.IsFalse(
                    ApplyLiveRulesCommandForAutomation(
                        slice,
                        "USE_PRIVILEGE",
                        new JObject { ["r"] = 0, ["c"] = 0 }
                    )
                );

                var afterInvalidTarget = slice.BuildAutomationStateSnapshot(1920, 1080);
                Assert.AreEqual("Selected privilege gem is not available.", afterInvalidTarget.Value<string>("statusText"));
                Assert.AreEqual("Selected privilege gem is not available.", afterInvalidTarget.Value<string>("errorBanner"));
                Assert.AreEqual(
                    beforeInvalidTargetHash,
                    ((JObject)afterInvalidTarget["replay"]).Value<string>("currentStateHash")
                );
                Assert.AreEqual("PRIVILEGE_ACTION", ((JObject)afterInvalidTarget["snapshot"]).Value<string>("phase"));
                Assert.AreEqual(
                    0,
                    ((JObject)((JObject)afterInvalidTarget["replay"])["liveRecording"]).Value<int>("recordedEvents")
                );
            }
            finally
            {
                Object.DestroyImmediate(root);
                CleanupRenderedSceneObjects();
            }
        }

        [Test]
        public void LivePrivilegeCancelWrongActorDoesNotMutateStateOrReplayRecording()
        {
            var root = new GameObject("GemDuel Live Privilege Cancel Wrong Actor Test");
            try
            {
                var slice = root.AddComponent<GemDuelGameController>();
                Assert.IsTrue(
                    slice.RunSemanticActionForAutomation(
                        "start_local_game",
                        new JObject { ["seed"] = "unity-editmode-live-privilege-cancel-wrong-actor" },
                        out var startError
                    ),
                    startError
                );

                var snapshot = GetMutableCurrentSnapshot(slice);
                snapshot["phase"] = "PRIVILEGE_ACTION";
                ((JObject)snapshot["privileges"])["p1"] = 1;
                if (snapshot["extraPrivileges"] is JObject extraPrivileges)
                {
                    extraPrivileges["p1"] = 0;
                }
                RenderCurrentState(slice);

                var before = slice.BuildAutomationStateSnapshot(1920, 1080);
                var beforeSnapshot = (JObject)before["snapshot"];
                var beforeReplay = (JObject)before["replay"];
                var beforeHash = beforeReplay.Value<string>("currentStateHash");
                var trackedGem = FindFirstCollectibleBoardGem(beforeSnapshot, out var trackedGemId);
                var beforeInventory = ((JObject)((JObject)beforeSnapshot["inventories"])["p1"])
                    .Value<int>(trackedGemId);
                Assert.AreEqual("PRIVILEGE_ACTION", beforeSnapshot.Value<string>("phase"));
                Assert.AreEqual("p1", beforeSnapshot.Value<string>("turn"));
                Assert.AreEqual(1, ((JObject)beforeSnapshot["privileges"]).Value<int>("p1"));
                Assert.AreEqual(
                    0,
                    ((JObject)beforeReplay["liveRecording"]).Value<int>("recordedEvents")
                );

                Assert.IsFalse(ApplyLiveRulesCommandForAutomation(slice, "CANCEL_PRIVILEGE", new JObject(), "p2"));

                var after = slice.BuildAutomationStateSnapshot(1920, 1080);
                var afterSnapshot = (JObject)after["snapshot"];
                var afterBoard = (JArray)afterSnapshot["board"];
                Assert.AreEqual("Command actor p2 does not match active player p1.", after.Value<string>("statusText"));
                Assert.AreEqual("Command actor p2 does not match active player p1.", after.Value<string>("errorBanner"));
                Assert.AreEqual(beforeHash, ((JObject)after["replay"]).Value<string>("currentStateHash"));
                Assert.AreEqual("PRIVILEGE_ACTION", afterSnapshot.Value<string>("phase"));
                Assert.AreEqual("p1", afterSnapshot.Value<string>("turn"));
                Assert.AreEqual(1, ((JObject)afterSnapshot["privileges"]).Value<int>("p1"));
                Assert.AreEqual(trackedGemId, ((JArray)afterBoard[trackedGem.x])[trackedGem.y].Value<string>());
                Assert.AreEqual(
                    beforeInventory,
                    ((JObject)((JObject)afterSnapshot["inventories"])["p1"]).Value<int>(trackedGemId)
                );
                Assert.AreEqual(
                    0,
                    ((JObject)((JObject)after["replay"])["liveRecording"]).Value<int>("recordedEvents")
                );
            }
            finally
            {
                Object.DestroyImmediate(root);
                CleanupRenderedSceneObjects();
            }
        }

        [Test]
        public void LivePrivilegeCancelRoutesThroughRulesBridge()
        {
            var root = new GameObject("GemDuel Live Bridge Privilege Cancel Test");
            try
            {
                var slice = root.AddComponent<GemDuelGameController>();
                Assert.IsTrue(
                    slice.RunSemanticActionForAutomation(
                        "start_local_game",
                        new JObject { ["seed"] = "unity-editmode-live-privilege-cancel" },
                        out var startError
                    ),
                    startError
                );

                var start = slice.BuildAutomationStateSnapshot(1920, 1080);
                var startSnapshot = (JObject)start["snapshot"];
                var p1Gem = FindFirstCollectibleBoardGem(startSnapshot, out _);
                Assert.IsTrue(
                    slice.RunSemanticActionForAutomation(
                        "click_board_cell",
                        new JObject { ["row"] = p1Gem.x, ["column"] = p1Gem.y },
                        out var selectError
                    ),
                    selectError
                );
                Assert.IsTrue(
                    slice.RunSemanticActionForAutomation("confirm_gem_selection", null, out var confirmError),
                    confirmError
                );

                var p2Ready = slice.BuildAutomationStateSnapshot(1920, 1080);
                var p2ReadySnapshot = (JObject)p2Ready["snapshot"];
                Assert.AreEqual("IDLE", p2ReadySnapshot.Value<string>("phase"));
                Assert.AreEqual("p2", p2ReadySnapshot.Value<string>("turn"));
                Assert.AreEqual(1, ((JObject)p2ReadySnapshot["privileges"]).Value<int>("p2"));

                Assert.IsTrue(
                    slice.RunSemanticActionForAutomation("activate_privilege", null, out var activateError),
                    activateError
                );

                var activated = slice.BuildAutomationStateSnapshot(1920, 1080);
                var activatedSnapshot = (JObject)activated["snapshot"];
                Assert.AreEqual("PRIVILEGE_ACTION", activatedSnapshot.Value<string>("phase"));
                Assert.AreEqual("p2", activatedSnapshot.Value<string>("turn"));
                var cancelTarget = FindVisibleTarget(activated, "board.selection.cancel");
                Assert.AreEqual("ActionButton", cancelTarget.Value<string>("kind"));
                Assert.AreEqual("cancel-gems", cancelTarget.Value<string>("eventType"));

                Assert.IsTrue(
                    slice.RunSemanticActionForAutomation("cancel_gem_selection", null, out var cancelError),
                    cancelError
                );

                var after = slice.BuildAutomationStateSnapshot(1920, 1080);
                var afterSnapshot = (JObject)after["snapshot"];
                Assert.AreEqual("IDLE", afterSnapshot.Value<string>("phase"));
                Assert.AreEqual("p2", afterSnapshot.Value<string>("turn"));
                Assert.AreEqual(1, ((JObject)afterSnapshot["privileges"]).Value<int>("p2"));
                Assert.AreEqual("Applied live action | CANCEL_PRIVILEGE", after.Value<string>("statusText"));
                Assert.AreEqual(0, after.Value<int>("totalEvents"));
            }
            finally
            {
                Object.DestroyImmediate(root);
                CleanupRenderedSceneObjects();
            }
        }

        [Test]
        public void ReplayPlaybackCompletesFullFixture()
        {
            var root = new GameObject("GemDuel Replay Playback Test");
            try
            {
                var slice = root.AddComponent<GemDuelGameController>();
                const string fileName = "local-pvp-royal-extra-turn-game-over.replay.json";
                var replay = LoadReplay(fileName);
                slice.LoadFixtureForRuntime(fileName);

                Assert.AreEqual(0, slice.ReplayEventsCompleted);
                Assert.AreEqual(replay.Events.Count, slice.ReplayEventsTotal);
                Assert.IsTrue(slice.PlayReplayToEndForAutomation(out var error), error);
                Assert.AreEqual(replay.Events.Count, slice.ReplayEventsCompleted);
                Assert.AreEqual(replay.Summary.Winner, slice.Winner);
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
        public void ReplayImportExportRoundTripPreservesHashAndReviewNavigation()
        {
            var root = new GameObject("GemDuel Replay Import Export Round Trip Test");
            var exportPath = Path.Combine(
                Path.GetTempPath(),
                Path.GetRandomFileName() + ".gemduel.replay.json"
            );
            try
            {
                var replayPath = RepositoryPaths.ResolveFromRoot(
                    "fixtures",
                    "replay-golden",
                    "local-pvp-royal-extra-turn-game-over.replay.json"
                );
                var replayJson = File.ReadAllText(replayPath);
                var expectedReplay = JsonConvert.DeserializeObject<ReplayVNext>(replayJson);
                Assert.NotNull(expectedReplay);
                var slice = root.AddComponent<GemDuelGameController>();

                Assert.IsTrue(slice.ImportReplayJsonForAutomation(replayJson, out var importError), importError);
                var imported = slice.BuildAutomationStateSnapshot(1920, 1080);
                var importedReplay = (JObject)imported["replay"];
                Assert.IsTrue(importedReplay.Value<bool>("loaded"));
                Assert.AreEqual(0, importedReplay.Value<int>("revision"));
                Assert.AreEqual(expectedReplay.Events.Count, importedReplay.Value<int>("totalEvents"));
                Assert.IsFalse(importedReplay.Value<bool>("canUndo"));
                Assert.IsTrue(importedReplay.Value<bool>("canRedo"));

                Assert.IsTrue(slice.ExportReplayJsonForAutomation(out var exportedJson, out var exportError), exportError);
                var exportedReplay = JsonConvert.DeserializeObject<ReplayVNext>(exportedJson);
                Assert.NotNull(exportedReplay);
                Assert.AreEqual(expectedReplay.Events.Count, exportedReplay.Events.Count);
                Assert.AreEqual(
                    expectedReplay.Summary.FinalStateHash,
                    exportedReplay.Summary.FinalStateHash
                );

                Assert.IsTrue(
                    slice.ExportReplayToPathForAutomation(exportPath, out var fileExportError),
                    fileExportError
                );
                Assert.IsTrue(File.Exists(exportPath));
                Assert.IsTrue(
                    slice.ImportReplayFromPathForAutomation(exportPath, out var pathImportError),
                    pathImportError
                );

                Assert.IsTrue(slice.SetReplayReviewRevisionForAutomation(3, out var reviewError), reviewError);
                var atThree = slice.BuildAutomationStateSnapshot(1920, 1080);
                var replayAtThree = (JObject)atThree["replay"];
                var hashAtThree = replayAtThree.Value<string>("currentStateHash");
                Assert.AreEqual(3, replayAtThree.Value<int>("revision"));
                Assert.IsTrue(replayAtThree.Value<bool>("canUndo"));
                Assert.IsTrue(replayAtThree.Value<bool>("canRedo"));

                var undoTarget = Object
                    .FindObjectsByType<GemDuelViewTarget>(FindObjectsSortMode.None)
                    .First(target =>
                        target.Kind == "ActionButton"
                        && target.EventType == "replay_undo"
                        && target.Clickable
                    );
                slice.HandleVisibleTarget(undoTarget);
                var atTwo = slice.BuildAutomationStateSnapshot(1920, 1080);
                var replayAtTwo = (JObject)atTwo["replay"];
                Assert.AreEqual(2, replayAtTwo.Value<int>("revision"));
                Assert.AreNotEqual(hashAtThree, replayAtTwo.Value<string>("currentStateHash"));

                var redoTarget = Object
                    .FindObjectsByType<GemDuelViewTarget>(FindObjectsSortMode.None)
                    .First(target =>
                        target.Kind == "ActionButton"
                        && target.EventType == "replay_redo"
                        && target.Clickable
                    );
                slice.HandleVisibleTarget(redoTarget);
                var atThreeAgain = slice.BuildAutomationStateSnapshot(1920, 1080);
                var replayAtThreeAgain = (JObject)atThreeAgain["replay"];
                Assert.AreEqual(3, replayAtThreeAgain.Value<int>("revision"));
                Assert.AreEqual(hashAtThree, replayAtThreeAgain.Value<string>("currentStateHash"));

                Assert.IsTrue(slice.PlayReplayToEndForAutomation(out var playError), playError);
                var final = slice.BuildAutomationStateSnapshot(1920, 1080);
                var finalReplay = (JObject)final["replay"];
                Assert.AreEqual(expectedReplay.Events.Count, finalReplay.Value<int>("revision"));
                Assert.AreEqual(
                    expectedReplay.Summary.FinalStateHash,
                    finalReplay.Value<string>("currentStateHash")
                );
                Assert.IsFalse(finalReplay.Value<bool>("canRedo"));
                Assert.AreEqual(expectedReplay.Summary.Winner, slice.Winner);
            }
            finally
            {
                if (File.Exists(exportPath))
                {
                    File.Delete(exportPath);
                }

                Object.DestroyImmediate(root);
                CleanupRenderedSceneObjects();
            }
        }

        [Test]
        public void VisibleLocalDevReplayControlsImportAndExportReviewFile()
        {
            var root = new GameObject("GemDuel Visible Replay IO Test");
            string localDevReplayPath = null;
            try
            {
                var replayPath = RepositoryPaths.ResolveFromRoot(
                    "fixtures",
                    "replay-golden",
                    "local-pvp-royal-extra-turn-game-over.replay.json"
                );
                var expectedReplay = JsonConvert.DeserializeObject<ReplayVNext>(
                    File.ReadAllText(replayPath)
                );
                Assert.NotNull(expectedReplay);
                var slice = root.AddComponent<GemDuelGameController>();
                localDevReplayPath = slice.ResolveLocalDevReplayPathForAutomation();
                Directory.CreateDirectory(Path.GetDirectoryName(localDevReplayPath));
                File.Copy(replayPath, localDevReplayPath, true);

                slice.LoadMainMenuForAutomation();
                var importTarget = FindViewTargetBySemanticKey("replay.import.localdev");
                slice.HandleVisibleTarget(importTarget);

                var imported = slice.BuildAutomationStateSnapshot(1920, 1080);
                var importedReplay = (JObject)imported["replay"];
                var importedPersistence = (JObject)importedReplay["persistence"];
                Assert.IsTrue(importedReplay.Value<bool>("loaded"));
                Assert.AreEqual("loaded", importedPersistence.Value<string>("status"));
                Assert.AreEqual(localDevReplayPath, importedPersistence.Value<string>("path"));
                Assert.AreEqual(expectedReplay.Events.Count, importedReplay.Value<int>("totalEvents"));

                File.Delete(localDevReplayPath);
                var exportTarget = FindViewTargetBySemanticKey("replay.export.localdev");
                slice.HandleVisibleTarget(exportTarget);

                var exported = slice.BuildAutomationStateSnapshot(1920, 1080);
                var exportedReplay = (JObject)exported["replay"];
                var exportedPersistence = (JObject)exportedReplay["persistence"];
                Assert.AreEqual("saved", exportedPersistence.Value<string>("status"));
                Assert.AreEqual(localDevReplayPath, exportedPersistence.Value<string>("path"));
                Assert.IsTrue(File.Exists(localDevReplayPath));

                var roundTrippedReplay = JsonConvert.DeserializeObject<ReplayVNext>(
                    File.ReadAllText(localDevReplayPath)
                );
                Assert.NotNull(roundTrippedReplay);
                Assert.AreEqual(
                    expectedReplay.Summary.FinalStateHash,
                    roundTrippedReplay.Summary.FinalStateHash
                );
                Assert.AreEqual("Replay exported for review.", exported.Value<string>("statusText"));
            }
            finally
            {
                if (!string.IsNullOrEmpty(localDevReplayPath) && File.Exists(localDevReplayPath))
                {
                    File.Delete(localDevReplayPath);
                }

                Object.DestroyImmediate(root);
                CleanupRenderedSceneObjects();
            }
        }

        [Test]
        public void LiveGameplayRecordingExportsAndReimportsReplayReview()
        {
            var root = new GameObject("GemDuel Live Replay Recording Test");
            GameObject reviewRoot = null;
            string localDevReplayPath = null;
            try
            {
                var slice = root.AddComponent<GemDuelGameController>();
                localDevReplayPath = slice.ResolveLocalDevReplayPathForAutomation();
                if (File.Exists(localDevReplayPath))
                {
                    File.Delete(localDevReplayPath);
                }

                Assert.IsTrue(
                    slice.RunSemanticActionForAutomation(
                        "start_local_game",
                        new JObject { ["seed"] = "unity-editmode-live-recording" },
                        out var startError
                    ),
                    startError
                );

                var start = slice.BuildAutomationStateSnapshot(1920, 1080);
                var startSnapshot = (JObject)start["snapshot"];
                var gem = FindFirstCollectibleBoardGem(startSnapshot, out _);
                Assert.IsTrue(
                    slice.RunSemanticActionForAutomation(
                        "click_board_cell",
                        new JObject { ["row"] = gem.x, ["column"] = gem.y },
                        out var selectError
                    ),
                    selectError
                );
                Assert.IsTrue(
                    slice.RunSemanticActionForAutomation("confirm_gem_selection", null, out var confirmError),
                    confirmError
                );

                var recorded = slice.BuildAutomationStateSnapshot(1920, 1080);
                var liveRecording = (JObject)((JObject)recorded["replay"])["liveRecording"];
                Assert.NotNull(liveRecording);
                Assert.AreEqual(1, liveRecording.Value<int>("recordedEvents"));
                Assert.IsTrue(liveRecording.Value<bool>("canExport"));
                var recordedHash = liveRecording.Value<string>("summaryFinalStateHash");

                slice.HandleVisibleTarget(FindViewTargetBySemanticKey("replay.export.localdev"));
                Assert.IsTrue(File.Exists(localDevReplayPath));

                var replay = JsonConvert.DeserializeObject<ReplayVNext>(
                    File.ReadAllText(localDevReplayPath)
                );
                Assert.NotNull(replay);
                Assert.AreEqual(1, replay.Events.Count);
                Assert.AreEqual(2, replay.Checkpoints.Count);
                Assert.AreEqual("take_gems", replay.Events[0].Value<string>("type"));
                Assert.AreEqual(recordedHash, replay.Summary.FinalStateHash);

                reviewRoot = new GameObject("GemDuel Live Replay Recording Review Test");
                var review = reviewRoot.AddComponent<GemDuelGameController>();
                Assert.IsTrue(review.ImportReplayFromPathForAutomation(localDevReplayPath, out var importError), importError);
                Assert.IsTrue(review.SetReplayReviewRevisionForAutomation(1, out var reviewError), reviewError);
                var reviewed = review.BuildAutomationStateSnapshot(1920, 1080);
                var reviewedReplay = (JObject)reviewed["replay"];
                Assert.AreEqual(1, reviewedReplay.Value<int>("revision"));
                Assert.AreEqual(1, reviewedReplay.Value<int>("totalEvents"));
                Assert.AreEqual(recordedHash, reviewedReplay.Value<string>("currentStateHash"));
            }
            finally
            {
                if (!string.IsNullOrEmpty(localDevReplayPath) && File.Exists(localDevReplayPath))
                {
                    File.Delete(localDevReplayPath);
                }

                if (reviewRoot != null)
                {
                    Object.DestroyImmediate(reviewRoot);
                }

                Object.DestroyImmediate(root);
                CleanupRenderedSceneObjects();
            }
        }

        [Test]
        public void LivePeekDeckModalRoutesThroughRulesBridgeAndReplayReview()
        {
            var root = new GameObject("GemDuel Live Peek Deck Modal Test");
            GameObject reviewRoot = null;
            try
            {
                var slice = root.AddComponent<GemDuelGameController>();
                Assert.IsTrue(
                    slice.RunSemanticActionForAutomation(
                        "start_local_game",
                        new JObject { ["seed"] = "unity-editmode-live-peek-modal" },
                        out var startError
                    ),
                    startError
                );

                var snapshot = GetMutableCurrentSnapshot(slice);
                ((JObject)snapshot["playerBuffs"])["p1"] = new JObject
                {
                    ["buff"] = new JObject
                    {
                        ["id"] = "intelligence",
                        ["level"] = 1,
                        ["effects"] = new JObject { ["active"] = "peek_deck" },
                    },
                };
                RenderCurrentState(slice);

                var ready = slice.BuildAutomationStateSnapshot(1920, 1080);
                var peekTarget = FindVisibleTarget(ready, "buff.peek");
                Assert.AreEqual("ActionButton", peekTarget.Value<string>("kind"));
                Assert.AreEqual("peek-deck", peekTarget.Value<string>("eventType"));

                Assert.IsTrue(
                    slice.RunSemanticActionForAutomation("peek_deck", null, out var peekError),
                    peekError
                );

                var peeked = slice.BuildAutomationStateSnapshot(1920, 1080);
                var peekedSnapshot = (JObject)peeked["snapshot"];
                var activeModal = (JObject)peekedSnapshot["activeModal"];
                Assert.NotNull(activeModal);
                Assert.AreEqual("PEEK", activeModal.Value<string>("type"));
                Assert.Greater(((JArray)((JObject)activeModal["data"])["cards"]).Count, 0);
                var closeTarget = FindVisibleTarget(peeked, "modal.peek.close");
                Assert.AreEqual("ActionButton", closeTarget.Value<string>("kind"));
                Assert.AreEqual("close-modal", closeTarget.Value<string>("eventType"));
                Assert.AreEqual(
                    1,
                    ((JObject)((JObject)peeked["replay"])["liveRecording"]).Value<int>("recordedEvents")
                );

                Assert.IsTrue(
                    slice.RunSemanticActionForAutomation("close_modal", null, out var closeError),
                    closeError
                );

                var closed = slice.BuildAutomationStateSnapshot(1920, 1080);
                var closedSnapshot = (JObject)closed["snapshot"];
                Assert.IsTrue(
                    closedSnapshot["activeModal"] == null ||
                    closedSnapshot["activeModal"].Type == JTokenType.Null
                );
                Assert.AreEqual(
                    2,
                    ((JObject)((JObject)closed["replay"])["liveRecording"]).Value<int>("recordedEvents")
                );

                Assert.IsTrue(slice.ExportReplayJsonForAutomation(out var exportedJson, out var exportError), exportError);
                var replay = JsonConvert.DeserializeObject<ReplayVNext>(exportedJson);
                Assert.NotNull(replay);
                Assert.AreEqual(2, replay.Events.Count);
                Assert.AreEqual("peek_deck", replay.Events[0].Value<string>("type"));
                Assert.AreEqual("close_modal", replay.Events[1].Value<string>("type"));
                Assert.AreEqual("PEEK", replay.Checkpoints[1].State["activeModal"].Value<string>("type"));
                Assert.IsTrue(
                    replay.Checkpoints[2].State["activeModal"] == null ||
                    replay.Checkpoints[2].State["activeModal"].Type == JTokenType.Null
                );

                reviewRoot = new GameObject("GemDuel Live Peek Replay Review Test");
                var review = reviewRoot.AddComponent<GemDuelGameController>();
                Assert.IsTrue(review.ImportReplayJsonForAutomation(exportedJson, out var importError), importError);
                Assert.IsTrue(review.SetReplayReviewRevisionForAutomation(1, out var reviewPeekError), reviewPeekError);
                var reviewedPeek = review.BuildAutomationStateSnapshot(1920, 1080);
                Assert.AreEqual(
                    "PEEK",
                    ((JObject)((JObject)reviewedPeek["snapshot"])["activeModal"]).Value<string>("type")
                );
                FindVisibleTarget(reviewedPeek, "modal.peek.close");
                Assert.IsTrue(review.SetReplayReviewRevisionForAutomation(2, out var reviewCloseError), reviewCloseError);
                var reviewedClosed = review.BuildAutomationStateSnapshot(1920, 1080);
                var reviewedClosedSnapshot = (JObject)reviewedClosed["snapshot"];
                Assert.IsTrue(
                    reviewedClosedSnapshot["activeModal"] == null ||
                    reviewedClosedSnapshot["activeModal"].Type == JTokenType.Null
                );
            }
            finally
            {
                if (reviewRoot != null)
                {
                    Object.DestroyImmediate(reviewRoot);
                }

                Object.DestroyImmediate(root);
                CleanupRenderedSceneObjects();
            }
        }

        [Test]
        public void LivePeekDeckModalRejectionsDoNotMutateStateOrReplayRecording()
        {
            var root = new GameObject("GemDuel Live Peek Deck Modal Rejection Test");
            try
            {
                var slice = root.AddComponent<GemDuelGameController>();
                Assert.IsTrue(
                    slice.RunSemanticActionForAutomation(
                        "start_local_game",
                        new JObject { ["seed"] = "unity-editmode-live-peek-modal-rejections" },
                        out var startError
                    ),
                    startError
                );

                var before = slice.BuildAutomationStateSnapshot(1920, 1080);
                var beforeReplay = (JObject)before["replay"];
                var beforeLiveRecording = (JObject)beforeReplay["liveRecording"];
                var beforeHash = beforeReplay.Value<string>("currentStateHash");
                Assert.NotNull(beforeLiveRecording);
                Assert.AreEqual(0, beforeLiveRecording.Value<int>("recordedEvents"));

                Assert.IsFalse(
                    ApplyLiveRulesCommandForAutomation(
                        slice,
                        "PEEK_DECK",
                        new JObject { ["levels"] = new JArray(3, 2, 1) }
                    )
                );
                var afterPeek = slice.BuildAutomationStateSnapshot(1920, 1080);
                Assert.AreEqual("The active player does not have a deck-peek ability.", afterPeek.Value<string>("statusText"));
                Assert.AreEqual("The active player does not have a deck-peek ability.", afterPeek.Value<string>("errorBanner"));
                Assert.AreEqual(beforeHash, ((JObject)afterPeek["replay"]).Value<string>("currentStateHash"));
                Assert.AreEqual(
                    0,
                    ((JObject)((JObject)afterPeek["replay"])["liveRecording"]).Value<int>("recordedEvents")
                );
                var afterPeekSnapshot = (JObject)afterPeek["snapshot"];
                Assert.IsTrue(
                    afterPeekSnapshot["activeModal"] == null ||
                    afterPeekSnapshot["activeModal"].Type == JTokenType.Null
                );

                Assert.IsFalse(ApplyLiveRulesCommandForAutomation(slice, "CLOSE_MODAL", new JObject()));
                var afterClose = slice.BuildAutomationStateSnapshot(1920, 1080);
                Assert.AreEqual("There is no active modal to close.", afterClose.Value<string>("statusText"));
                Assert.AreEqual("There is no active modal to close.", afterClose.Value<string>("errorBanner"));
                Assert.AreEqual(beforeHash, ((JObject)afterClose["replay"]).Value<string>("currentStateHash"));
                Assert.AreEqual(
                    0,
                    ((JObject)((JObject)afterClose["replay"])["liveRecording"]).Value<int>("recordedEvents")
                );
                var afterCloseSnapshot = (JObject)afterClose["snapshot"];
                Assert.IsTrue(
                    afterCloseSnapshot["activeModal"] == null ||
                    afterCloseSnapshot["activeModal"].Type == JTokenType.Null
                );
            }
            finally
            {
                Object.DestroyImmediate(root);
                CleanupRenderedSceneObjects();
            }
        }

        [Test]
        public void LiveBlockedPeekModalCloseDoesNotMutateStateOrReplayRecording()
        {
            var root = new GameObject("GemDuel Live Blocked Peek Modal Close Test");
            try
            {
                var slice = root.AddComponent<GemDuelGameController>();
                Assert.IsTrue(
                    slice.RunSemanticActionForAutomation(
                        "start_local_game",
                        new JObject { ["seed"] = "unity-editmode-live-peek-modal-owner-rejection" },
                        out var startError
                    ),
                    startError
                );

                var snapshot = GetMutableCurrentSnapshot(slice);
                var deckCard = ((JArray)((JObject)snapshot["decks"])["1"]).Last.Value<string>();
                snapshot["activeModal"] = new JObject
                {
                    ["type"] = "PEEK",
                    ["data"] = new JObject
                    {
                        ["cards"] = new JArray(deckCard),
                        ["initiator"] = "p2",
                    },
                };
                RenderCurrentState(slice);

                var before = slice.BuildAutomationStateSnapshot(1920, 1080);
                FindVisibleTarget(before, "modal.peek.close");
                var beforeReplay = (JObject)before["replay"];
                var beforeHash = beforeReplay.Value<string>("currentStateHash");
                var beforeSnapshot = (JObject)before["snapshot"];
                Assert.AreEqual(
                    "p2",
                    ((JObject)((JObject)beforeSnapshot["activeModal"])["data"]).Value<string>("initiator")
                );
                Assert.AreEqual(
                    0,
                    ((JObject)beforeReplay["liveRecording"]).Value<int>("recordedEvents")
                );

                Assert.IsFalse(ApplyLiveRulesCommandForAutomation(slice, "CLOSE_MODAL", new JObject()));

                var after = slice.BuildAutomationStateSnapshot(1920, 1080);
                Assert.AreEqual("The active player cannot close this modal.", after.Value<string>("statusText"));
                Assert.AreEqual("The active player cannot close this modal.", after.Value<string>("errorBanner"));
                Assert.AreEqual(beforeHash, ((JObject)after["replay"]).Value<string>("currentStateHash"));
                Assert.AreEqual(
                    0,
                    ((JObject)((JObject)after["replay"])["liveRecording"]).Value<int>("recordedEvents")
                );
                var afterModal = (JObject)((JObject)after["snapshot"])["activeModal"];
                Assert.NotNull(afterModal);
                Assert.AreEqual("PEEK", afterModal.Value<string>("type"));
                Assert.AreEqual("p2", ((JObject)afterModal["data"]).Value<string>("initiator"));
            }
            finally
            {
                Object.DestroyImmediate(root);
                CleanupRenderedSceneObjects();
            }
        }

        [Test]
        public void LiveWrongPhasePeekDeckDoesNotMutateStateOrReplayRecording()
        {
            var root = new GameObject("GemDuel Live Wrong Phase Peek Deck Rejection Test");
            try
            {
                var slice = root.AddComponent<GemDuelGameController>();
                Assert.IsTrue(
                    slice.RunSemanticActionForAutomation(
                        "start_local_game",
                        new JObject { ["seed"] = "unity-editmode-live-peek-wrong-phase-rejection" },
                        out var startError
                    ),
                    startError
                );

                var snapshot = GetMutableCurrentSnapshot(slice);
                snapshot["phase"] = "DRAFT_PHASE";
                ((JObject)snapshot["playerBuffs"])["p1"] = new JObject
                {
                    ["buff"] = new JObject
                    {
                        ["id"] = "intelligence",
                        ["level"] = 1,
                        ["effects"] = new JObject { ["active"] = "peek_deck" },
                    },
                };
                RenderCurrentState(slice);

                var before = slice.BuildAutomationStateSnapshot(1920, 1080);
                var beforeReplay = (JObject)before["replay"];
                var beforeHash = beforeReplay.Value<string>("currentStateHash");
                Assert.AreEqual("DRAFT_PHASE", ((JObject)before["snapshot"]).Value<string>("phase"));
                Assert.AreEqual(
                    0,
                    ((JObject)beforeReplay["liveRecording"]).Value<int>("recordedEvents")
                );

                Assert.IsFalse(
                    ApplyLiveRulesCommandForAutomation(
                        slice,
                        "PEEK_DECK",
                        new JObject { ["levels"] = new JArray(3, 2, 1) }
                    )
                );

                var after = slice.BuildAutomationStateSnapshot(1920, 1080);
                Assert.AreEqual("PEEK_DECK is only allowed during the IDLE phase.", after.Value<string>("statusText"));
                Assert.AreEqual("PEEK_DECK is only allowed during the IDLE phase.", after.Value<string>("errorBanner"));
                Assert.AreEqual(beforeHash, ((JObject)after["replay"]).Value<string>("currentStateHash"));
                Assert.AreEqual("DRAFT_PHASE", ((JObject)after["snapshot"]).Value<string>("phase"));
                Assert.AreEqual(
                    0,
                    ((JObject)((JObject)after["replay"])["liveRecording"]).Value<int>("recordedEvents")
                );
                var afterSnapshot = (JObject)after["snapshot"];
                Assert.IsTrue(
                    afterSnapshot["activeModal"] == null ||
                    afterSnapshot["activeModal"].Type == JTokenType.Null
                );
            }
            finally
            {
                Object.DestroyImmediate(root);
                CleanupRenderedSceneObjects();
            }
        }

        [Test]
        public void DraftBoonCardsAreClickTargetsAndSelectThroughViewportClick()
        {
            var root = new GameObject("GemDuel Draft Boon Click Test");
            try
            {
                var slice = root.AddComponent<GemDuelGameController>();
                slice.LoadFixtureForRuntime("local-pvp-royal-extra-turn-game-over.replay.json");

                var before = slice.BuildAutomationStateSnapshot(1920, 1080);
                var visibleTargets = (JArray)before["visibleTargets"];
                var buffTargets = visibleTargets
                    .Where(
                        target =>
                            target.Value<string>("kind") == "Buff"
                            && target.Value<bool?>("clickable") == true
                    )
                    .ToList();
                Assert.AreEqual(3, buffTargets.Count);
                Assert.IsTrue(
                    buffTargets.Any(
                        target =>
                            target.Value<string>("semanticKey") == "draft.buff.1"
                            && target.Value<string>("buffId") == "royal_envoy"
                        )
                );

                var controller = root.AddComponent<GemDuelInputController>();
                var royalEnvoyTarget = Object
                    .FindObjectsByType<GemDuelViewTarget>()
                    .First(target =>
                        target.Kind == "Buff" && target.BuffId == "royal_envoy" && target.Clickable
                    );
                var screenPoint = Camera.main.WorldToScreenPoint(royalEnvoyTarget.transform.position);
                Assert.IsTrue(
                    controller.TryDispatchScreenPointForEvidence(screenPoint, out var error),
                    error
                );
                Assert.AreEqual(1, slice.ReplayEventsCompleted);

                var after = slice.BuildAutomationStateSnapshot(1920, 1080);
                var snapshot = (JObject)after["snapshot"];
                Assert.AreEqual("DRAFT_PHASE", snapshot.Value<string>("phase"));
                Assert.AreEqual("p2", snapshot.Value<string>("turn"));
                Assert.AreEqual("royal_envoy", snapshot.Value<string>("p1SelectedBuffId"));
                var p2DraftPool = (JArray)snapshot["p2DraftPool"];
                Assert.NotNull(p2DraftPool);
                Assert.AreEqual(4, p2DraftPool.Count);
                CollectionAssert.Contains(p2DraftPool.Values<string>().ToList(), "echo_reservoir");
                var afterBuffTargets = ((JArray)after["visibleTargets"])
                    .Where(
                        target =>
                            target.Value<string>("kind") == "Buff"
                            && target.Value<bool?>("clickable") == true
                    )
                    .ToList();
                Assert.AreEqual(4, afterBuffTargets.Count);
                Assert.IsTrue(
                    afterBuffTargets.Any(
                        target =>
                            target.Value<string>("semanticKey") == "draft.buff.1"
                            && target.Value<string>("buffId") == "echo_reservoir"
                    )
                );
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

                    if (
                        obj.name == "GemDuel Rendered State"
                        || obj.name == "Status Topbar"
                        || obj.name == "GemDuel Camera"
                    )
                    {
                        Object.DestroyImmediate(obj);
                    }
                }
            }
        }

        [Test]
        public void DraftBoonCardsExposeHoverStateThroughInputController()
        {
            var root = new GameObject("GemDuel Draft Boon Hover Test");
            try
            {
                var slice = root.AddComponent<GemDuelGameController>();
                slice.LoadFixtureForRuntime("local-pvp-royal-extra-turn-game-over.replay.json");
                var controller = root.AddComponent<GemDuelInputController>();
                var royalEnvoyTarget = Object
                    .FindObjectsByType<GemDuelViewTarget>()
                    .First(target =>
                        target.Kind == "Buff" && target.BuffId == "royal_envoy" && target.Clickable
                    );
                var screenPoint = Camera.main.WorldToScreenPoint(royalEnvoyTarget.transform.position);

                Assert.IsTrue(
                    controller.TryHoverScreenPointForEvidence(screenPoint, out var error),
                    error
                );

                var after = slice.BuildAutomationStateSnapshot(1920, 1080);
                var hover = (JObject)after["hover"];
                Assert.NotNull(hover);
                Assert.AreEqual("draft.buff.1", hover.Value<string>("semanticKey"));
                Assert.AreEqual("royal_envoy", hover.Value<string>("buffId"));
                Assert.AreEqual("pointer", hover.Value<string>("cursor"));
                var draftRoot = FindVisibleTarget(after, "draft.root");
                var draftRootRect = (JObject)draftRoot["rect"];
                Assert.AreEqual(138d, draftRootRect.Value<double>("x"), 0.02d);
                Assert.AreEqual(1644d, draftRootRect.Value<double>("width"), 0.02d);
                Assert.NotNull(FindTextMesh("Draft Title 皇家特使"));
                var descriptionText = FindTextMesh("Draft Description 皇家特使");
                Assert.NotNull(descriptionText);
                StringAssert.Contains("Left", descriptionText.alignment.ToString());
                Assert.IsTrue(
                    Object.FindObjectsByType<GameObject>(FindObjectsSortMode.None)
                        .Any(obj => obj != null && obj.name == "Draft Hover 皇家特使")
                );

                controller.TryHoverScreenPointForEvidence(new Vector3(-1000f, -1000f, 0f), out _);
                var cleared = slice.BuildAutomationStateSnapshot(1920, 1080);
                Assert.IsTrue(cleared["hover"] == null || cleared["hover"].Type == JTokenType.Null);
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

                    if (
                        obj.name == "GemDuel Rendered State"
                        || obj.name == "Status Topbar"
                        || obj.name == "GemDuel Camera"
                    )
                    {
                        Object.DestroyImmediate(obj);
                    }
                }
            }
        }

        [Test]
        public void MarketDeckClickOpensReservePreviewThroughViewportHitTarget()
        {
            var root = new GameObject("GemDuel Market Deck Preview Test");
            try
            {
                var slice = root.AddComponent<GemDuelGameController>();
                slice.LoadFixtureForRuntime("local-pvp-royal-extra-turn-game-over.replay.json");
                Assert.IsTrue(slice.ApplyFixtureEventsForAutomation(2, out var prepareError), prepareError);

                var before = slice.BuildAutomationStateSnapshot(1920, 1080);
                var deckTarget = FindVisibleTarget(before, "market.level.1");
                Assert.AreEqual("MarketDeck", deckTarget.Value<string>("kind"));
                Assert.IsTrue(deckTarget.Value<bool?>("clickable") == true);
                Assert.AreEqual(2, before.Value<int>("revision"));
                var beforeSnapshot = (JObject)before["snapshot"];

                Assert.IsTrue(
                    slice.RunSemanticActionForAutomation(
                        "click_market_deck",
                        new JObject { ["level"] = 1 },
                        out var previewError
                    ),
                    previewError
                );
                Assert.AreEqual("unity-hit-target", slice.LastAutomationDriver);

                var after = slice.BuildAutomationStateSnapshot(1920, 1080);
                var preview = (JObject)after["preview"];
                Assert.NotNull(preview);
                Assert.AreEqual("deck", preview.Value<string>("source"));
                Assert.AreEqual(1, preview.Value<int>("level"));
                Assert.AreEqual(-1, preview.Value<int>("index"));
                Assert.AreEqual(2, after.Value<int>("revision"));
                Assert.AreEqual(
                    beforeSnapshot.Value<string>("phase"),
                    ((JObject)after["snapshot"]).Value<string>("phase")
                );
                Assert.NotNull(FindVisibleTarget(after, "card.preview.card"));
                Assert.NotNull(FindVisibleTarget(after, "card.preview.action.reserve"));
            }
            finally
            {
                Object.DestroyImmediate(root);
                CleanupRenderedSceneObjects();
            }
        }

        [Test]
        public void TableauStackClickOpensAllCardsPreviewThroughViewportHitTarget()
        {
            var root = new GameObject("GemDuel Tableau Stack Preview Test");
            try
            {
                var slice = root.AddComponent<GemDuelGameController>();
                Assert.IsTrue(
                    slice.RunSemanticActionForAutomation(
                        "start_local_game",
                        new JObject { ["seed"] = "unity-tableau-stack-preview-20260514" },
                        out var startError
                    ),
                    startError
                );

                var mutable = GetMutableCurrentSnapshot(slice);
                mutable["phase"] = "IDLE";
                mutable["turn"] = "p1";
                ((JObject)mutable["playerTableau"])["p1"] = new JArray
                {
                    new JObject { ["instanceId"] = "111-re" },
                    new JObject { ["instanceId"] = "113-re" },
                    new JObject { ["instanceId"] = "114-re" },
                };
                RenderCurrentState(slice);

                var before = slice.BuildAutomationStateSnapshot(1920, 1080);
                var beforeHash = ((JObject)before["replay"]).Value<string>("currentStateHash");
                var stackTarget = FindVisibleTarget(before, "player.current.tableau.red");
                Assert.AreEqual("TableauStack", stackTarget.Value<string>("kind"));
                Assert.IsTrue(stackTarget.Value<bool>("clickable"));

                var rect = (JObject)stackTarget["rect"];
                Assert.IsTrue(
                    slice.ClickViewportPointForAutomation(
                        (float)(rect.Value<double>("x") + rect.Value<double>("width") * 0.5d),
                        (float)(rect.Value<double>("y") + rect.Value<double>("height") * 0.5d),
                        1920,
                        1080,
                        out var clickError
                    ),
                    clickError
                );

                var after = slice.BuildAutomationStateSnapshot(1920, 1080);
                var preview = (JObject)after["preview"];
                Assert.NotNull(preview);
                Assert.AreEqual("tableau", preview.Value<string>("source"));
                Assert.AreEqual("p1", preview.Value<string>("player"));
                Assert.AreEqual("red", preview.Value<string>("color"));
                Assert.AreEqual(3, preview.Value<int>("cardCount"));
                CollectionAssert.AreEqual(
                    new[] { "111-re", "113-re", "114-re" },
                    ((JArray)preview["instanceIds"]).Values<string>().ToList()
                );
                Assert.AreEqual(
                    3,
                    ((JArray)after["visibleTargets"])
                        .OfType<JObject>()
                        .Count(target =>
                            (target.Value<string>("semanticKey") ?? string.Empty)
                                .StartsWith("card.preview.collection.", StringComparison.Ordinal)
                        )
                );
                Assert.AreEqual(beforeHash, ((JObject)after["replay"]).Value<string>("currentStateHash"));
            }
            finally
            {
                Object.DestroyImmediate(root);
                CleanupRenderedSceneObjects();
            }
        }

        [Test]
        public void PreviewBackdropBlankClickDismissesThroughViewportHitTarget()
        {
            var root = new GameObject("GemDuel Preview Blank Dismiss Test");
            try
            {
                var slice = root.AddComponent<GemDuelGameController>();
                slice.LoadFixtureForRuntime("local-pvp-royal-extra-turn-game-over.replay.json");
                Assert.IsTrue(slice.ApplyFixtureEventsForAutomation(2, out var prepareError), prepareError);
                Assert.IsTrue(
                    slice.RunSemanticActionForAutomation(
                        "click_market_card",
                        new JObject { ["level"] = 1, ["index"] = 0 },
                        out var previewError
                    ),
                    previewError
                );

                var beforeDismiss = slice.BuildAutomationStateSnapshot(1920, 1080);
                Assert.NotNull(beforeDismiss["preview"]);
                Assert.AreEqual("market", ((JObject)beforeDismiss["preview"]).Value<string>("source"));
                Assert.AreEqual("ActionButton", FindVisibleTarget(beforeDismiss, "card.preview.primaryAction").Value<string>("kind"));
                Assert.AreEqual("ActionButton", FindVisibleTarget(beforeDismiss, "card.preview.action.reserve").Value<string>("kind"));
                Assert.IsTrue(
                    ((JArray)beforeDismiss["visibleTargets"]).Any(target =>
                        target.Value<string>("semanticKey") == "card.preview.backdrop"
                        && target.Value<bool?>("clickable") == true
                    )
                );
                var controller = root.AddComponent<GemDuelInputController>();
                var backdropTarget = Object
                    .FindObjectsByType<GemDuelViewTarget>()
                    .First(target => target.SemanticKey == "card.preview.backdrop" && target.Clickable);
                var backdropScreenPoint = Camera.main.WorldToScreenPoint(backdropTarget.transform.position);
                Assert.IsFalse(controller.TryHoverScreenPointForEvidence(backdropScreenPoint, out _));
                var hoverStable = slice.BuildAutomationStateSnapshot(1920, 1080);
                Assert.IsTrue(hoverStable["hover"] == null || hoverStable["hover"].Type == JTokenType.Null);
                Assert.IsTrue(
                    slice.RunSemanticActionForAutomation(
                        "click_preview_blank",
                        new JObject { ["x"] = 240, ["y"] = 280 },
                        out var dismissError
                    ),
                    dismissError
                );

                var afterDismiss = slice.BuildAutomationStateSnapshot(1920, 1080);
                Assert.IsTrue(afterDismiss["preview"] == null || afterDismiss["preview"].Type == JTokenType.Null);
                Assert.AreEqual("Preview closed.", afterDismiss.Value<string>("statusText"));
                var turnEnd = FindVisibleTarget(afterDismiss, "turn.end");
                var turnEndRect = (JObject)turnEnd["rect"];
                Assert.AreEqual(136.51d, turnEndRect.Value<double>("width"), 0.02d);
                var royalFeatured = FindVisibleTarget(afterDismiss, "royal.featured");
                var royalFeaturedRect = (JObject)royalFeatured["rect"];
                Assert.AreEqual(255.85d, royalFeaturedRect.Value<double>("y"), 0.02d);
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

                    if (
                        obj.name == "GemDuel Rendered State"
                        || obj.name == "Status Topbar"
                        || obj.name == "GemDuel Camera"
                    )
                    {
                        Object.DestroyImmediate(obj);
                    }
                }
            }
        }

        [Test]
        public void SettingsMutationsUseVisibleHitTargetsAndPersistFeedback()
        {
            var root = new GameObject("GemDuel Settings Contract Test");
            try
            {
                var slice = root.AddComponent<GemDuelGameController>();
                slice.LoadFixtureForRuntime("local-pvp-royal-extra-turn-game-over.replay.json");
                Assert.IsTrue(slice.ApplyFixtureEventsForAutomation(2, out var prepareError), prepareError);
                Assert.IsTrue(slice.RunSemanticActionForAutomation("open_settings", null, out var openError), openError);
                Assert.AreEqual("unity-hit-target", slice.LastAutomationDriver);

                var opened = slice.BuildAutomationStateSnapshot(1920, 1080);
                var soundTarget = FindVisibleTarget(opened, "settings.sound");
                Assert.AreEqual("SettingsControl", soundTarget.Value<string>("kind"));
                Assert.IsTrue(soundTarget.Value<bool?>("clickable") == true);
                Assert.AreEqual("SettingsControl", FindVisibleTarget(opened, "settings.lan.playerZone").Value<string>("kind"));
                Assert.AreEqual("SettingsControl", FindVisibleTarget(opened, "settings.lan.gems").Value<string>("kind"));

                Assert.IsTrue(
                    slice.RunSemanticActionForAutomation(
                        "change_setting",
                        new JObject { ["name"] = "locale", ["value"] = "zh" },
                        out var localeError
                    ),
                    localeError
                );
                Assert.AreEqual("unity-hit-target", slice.LastAutomationDriver);

                Assert.IsTrue(
                    slice.RunSemanticActionForAutomation(
                        "change_setting",
                        new JObject { ["name"] = "soundEnabled", ["value"] = false },
                        out var soundError
                    ),
                    soundError
                );
                Assert.AreEqual("unity-hit-target", slice.LastAutomationDriver);

                Assert.IsTrue(
                    slice.RunSemanticActionForAutomation(
                        "change_setting",
                        new JObject { ["name"] = "lanShowOpponentPlayerZoneCards", ["value"] = false },
                        out var lanCardsError
                    ),
                    lanCardsError
                );
                Assert.AreEqual("unity-hit-target", slice.LastAutomationDriver);

                Assert.IsTrue(
                    slice.RunSemanticActionForAutomation(
                        "change_setting",
                        new JObject { ["name"] = "lanShowOpponentGems", ["value"] = false },
                        out var lanGemsError
                    ),
                    lanGemsError
                );
                Assert.AreEqual("unity-hit-target", slice.LastAutomationDriver);

                var after = slice.BuildAutomationStateSnapshot(1920, 1080);
                var settings = (JObject)after["settings"];
                Assert.AreEqual("zh", settings.Value<string>("locale"));
                Assert.AreEqual("dark", settings.Value<string>("theme"));
                Assert.AreEqual("royal-luxury", settings.Value<string>("surfaceTheme"));
                Assert.IsFalse(settings.Value<bool>("soundEnabled"));
                Assert.IsFalse(settings.Value<bool>("lanShowOpponentPlayerZoneCards"));
                Assert.IsFalse(settings.Value<bool>("lanShowOpponentGems"));
                Assert.IsTrue(settings.Value<bool>("panelOpen"));
                Assert.AreEqual("LAN opponent gem visibility disabled.", after.Value<string>("statusText"));

                var persistence = (JObject)settings["persistence"];
                Assert.AreEqual("saved", persistence.Value<string>("status"));
                var persistencePath = persistence.Value<string>("path");
                Assert.IsFalse(string.IsNullOrWhiteSpace(persistencePath));
                Assert.IsTrue(File.Exists(persistencePath), persistencePath);
                var persisted = JObject.Parse(File.ReadAllText(persistencePath));
                Assert.AreEqual("zh", persisted.Value<string>("locale"));
                Assert.AreEqual("dark", persisted.Value<string>("theme"));
                Assert.AreEqual("royal-luxury", persisted.Value<string>("surfaceTheme"));
                Assert.IsFalse(persisted.Value<bool>("soundEnabled"));
                Assert.IsFalse(persisted.Value<bool>("lanShowOpponentPlayerZoneCards"));
                Assert.IsFalse(persisted.Value<bool>("lanShowOpponentGems"));

                var reopenedRoot = new GameObject("GemDuel Settings Reopen Test");
                try
                {
                    var reopened = reopenedRoot.AddComponent<GemDuelGameController>();
                    Assert.IsTrue(LoadPersistedSettings(reopened), persistencePath);

                    var reopenedState = reopened.BuildAutomationStateSnapshot(1920, 1080);
                    var reopenedSettings = (JObject)reopenedState["settings"];
                    Assert.AreEqual("zh", reopenedSettings.Value<string>("locale"));
                    Assert.AreEqual("dark", reopenedSettings.Value<string>("theme"));
                    Assert.AreEqual("royal-luxury", reopenedSettings.Value<string>("surfaceTheme"));
                    Assert.IsFalse(reopenedSettings.Value<bool>("soundEnabled"));
                    Assert.IsFalse(reopenedSettings.Value<bool>("lanShowOpponentPlayerZoneCards"));
                    Assert.IsFalse(reopenedSettings.Value<bool>("lanShowOpponentGems"));
                    Assert.AreEqual(
                        "loaded",
                        ((JObject)reopenedSettings["persistence"]).Value<string>("status")
                    );
                }
                finally
                {
                    Object.DestroyImmediate(reopenedRoot);
                    CleanupRenderedSceneObjects();
                }
            }
            finally
            {
                Object.DestroyImmediate(root);
                CleanupRenderedSceneObjects();
            }
        }

        [Test]
        public void LocalDevSettingsReleasePathSmokeSavesAndReloadsVisibleSettings()
        {
            var root = new GameObject("GemDuel LocalDev Settings Release Path Smoke Test");
            try
            {
                var slice = root.AddComponent<GemDuelGameController>();
                var report = LocalDevSettingsReleasePathSmoke.Run(
                    slice,
                    new LocalDevSettingsReleasePathSmokeOptions
                    {
                        Seed = "unity-editmode-settings-release-path-smoke",
                    }
                );

                Assert.IsTrue(report.Value<bool>("ok"), report.ToString(Formatting.Indented));
                Assert.IsFalse(report.Value<bool>("usedFixtureReplayAsGameplayDriver"));
                Assert.IsFalse(report.Value<bool>("usedCheckpointStateReplacement"));

                var settings = (JObject)report["settingsSummary"];
                Assert.AreEqual("saved", settings.Value<string>("savedStatus"));
                Assert.AreEqual("loaded", settings.Value<string>("reloadedStatus"));
                Assert.AreEqual(
                    settings.Value<string>("gameplayHashBefore"),
                    settings.Value<string>("gameplayHashAfterSave")
                );
                Assert.AreEqual(0, settings.Value<int>("recordedEventsBefore"));
                Assert.AreEqual(0, settings.Value<int>("recordedEventsAfterSave"));

                var saved = (JObject)settings["savedSettings"];
                var persisted = (JObject)settings["persistedSettings"];
                var reloaded = (JObject)settings["reloadedSettings"];
                Assert.AreEqual("en", saved.Value<string>("locale"));
                Assert.AreEqual("pearl-opaline", saved.Value<string>("surfaceTheme"));
                Assert.IsFalse(saved.Value<bool>("soundEnabled"));
                Assert.IsFalse(saved.Value<bool>("lanShowOpponentPlayerZoneCards"));
                Assert.IsFalse(saved.Value<bool>("lanShowOpponentGems"));
                Assert.AreEqual(saved.Value<string>("locale"), reloaded.Value<string>("locale"));
                Assert.AreEqual(saved.Value<string>("surfaceTheme"), reloaded.Value<string>("surfaceTheme"));
                Assert.AreEqual(saved.Value<bool>("soundEnabled"), reloaded.Value<bool>("soundEnabled"));
                Assert.AreEqual(
                    saved.Value<bool>("lanShowOpponentPlayerZoneCards"),
                    reloaded.Value<bool>("lanShowOpponentPlayerZoneCards")
                );
                Assert.AreEqual(saved.Value<bool>("lanShowOpponentGems"), reloaded.Value<bool>("lanShowOpponentGems"));
                Assert.AreEqual(saved.Value<string>("locale"), persisted.Value<string>("locale"));
                Assert.AreEqual(saved.Value<string>("surfaceTheme"), persisted.Value<string>("surfaceTheme"));
                Assert.AreEqual(saved.Value<bool>("soundEnabled"), persisted.Value<bool>("soundEnabled"));
                Assert.AreEqual(
                    saved.Value<bool>("lanShowOpponentPlayerZoneCards"),
                    persisted.Value<bool>("lanShowOpponentPlayerZoneCards")
                );
                Assert.AreEqual(saved.Value<bool>("lanShowOpponentGems"), persisted.Value<bool>("lanShowOpponentGems"));
            }
            finally
            {
                Object.DestroyImmediate(root);
                CleanupRenderedSceneObjects();
            }
        }

        [Test]
        public void LocalDevChromeReleasePathSmokeOpensRulebookRestartsAndRestartsLiveGame()
        {
            var root = new GameObject("GemDuel LocalDev Chrome Release Path Smoke Test");
            try
            {
                var slice = root.AddComponent<GemDuelGameController>();
                var report = LocalDevChromeReleasePathSmoke.Run(
                    slice,
                    new LocalDevChromeReleasePathSmokeOptions
                    {
                        Seed = "unity-editmode-chrome-release-path-smoke",
                    }
                );

                Assert.IsTrue(report.Value<bool>("ok"), report.ToString(Formatting.Indented));
                Assert.IsTrue(report.Value<bool>("freshLaunch"));
                Assert.IsFalse(report.Value<bool>("usedFixtureReplayAsGameplayDriver"));
                Assert.IsFalse(report.Value<bool>("usedCheckpointStateReplacement"));

                var chrome = (JObject)report["chromeSummary"];
                Assert.IsTrue(chrome.Value<bool>("rulebookOverlayVisibleAfterOpen"));
                Assert.IsTrue(chrome.Value<bool>("rulebookPanelVisibleAfterOpen"));
                Assert.IsTrue(chrome.Value<bool>("rulebookCloseVisibleAfterOpen"));
                Assert.IsTrue(chrome.Value<bool>("rulebookNextVisibleAfterOpen"));
                Assert.IsTrue(chrome.Value<bool>("rulebookLexiconTargetVisibleAfterOpen"));
                Assert.AreEqual("prestigePoints", chrome.Value<string>("rulebookLexiconTermAfterClick"));
                Assert.AreEqual(0, chrome.Value<int>("rulebookPageAfterKeywordClick"));
                Assert.AreEqual(1, chrome.Value<int>("rulebookPageAfterNext"));
                var rulebookOpen = (JObject)report["rulebookOpenSnapshot"];
                var rulebookKeyword = (JObject)report["rulebookKeywordSnapshot"];
                var rulebookNext = (JObject)report["rulebookNextSnapshot"];
                Assert.AreEqual("packages/ui/src/components/RulebookContent.ts", rulebookOpen.Value<string>("sourceOfTruth"));
                Assert.AreEqual("packages/shared/src/lexicon/index.ts", rulebookOpen.Value<string>("lexiconSourceOfTruth"));
                Assert.AreEqual(9, rulebookOpen.Value<int>("pageCount"));
                Assert.AreEqual("快速上手", rulebookOpen.Value<string>("title"));
                Assert.That(rulebookOpen.Value<string>("summary"), Does.Contain("《Gem Duel》"));
                Assert.AreEqual("默认胜利目标", ((JObject)((JArray)rulebookOpen["sections"])[0]).Value<string>("title"));
                CollectionAssert.AreEqual(
                    new[]
                    {
                        "快速上手",
                        "卡牌结构与能力",
                        "玩家区",
                        "主战区",
                        "战况栏",
                        "回合流程",
                        "购买卡牌",
                        "代币与限制",
                        "肉鸽与增益手册",
                    },
                    ((JArray)rulebookOpen["pageTitlesZh"]).Values<string>().ToArray()
                );
                Assert.AreEqual("卡牌结构与能力", rulebookNext.Value<string>("title"));
                Assert.That(
                    ((JObject)((JArray)rulebookNext["sections"])[0])["items"].Values<string>().First(),
                    Does.Contain("声望值")
                );
                var activeLexicon = (JObject)rulebookKeyword["activeLexicon"];
                Assert.AreEqual("prestigePoints", activeLexicon.Value<string>("termId"));
                Assert.AreEqual("声望值", activeLexicon.Value<string>("label"));
                Assert.That(activeLexicon.Value<string>("description"), Does.Contain("分数"));
                Assert.IsFalse(chrome.Value<bool>("rulebookOverlayVisibleAfterClose"));
                Assert.AreEqual(
                    chrome.Value<string>("gameplayHashBeforeRulebook"),
                    chrome.Value<string>("gameplayHashAfterRulebookOpen")
                );
                Assert.AreEqual(
                    chrome.Value<string>("gameplayHashBeforeRulebook"),
                    chrome.Value<string>("gameplayHashAfterRulebookKeyword")
                );
                Assert.AreEqual(
                    chrome.Value<string>("gameplayHashBeforeRulebook"),
                    chrome.Value<string>("gameplayHashAfterRulebookNext")
                );
                Assert.AreEqual(
                    chrome.Value<string>("gameplayHashBeforeRulebook"),
                    chrome.Value<string>("gameplayHashAfterRulebookClose")
                );
                Assert.AreEqual(
                    chrome.Value<int>("recordedEventsBeforeRulebook"),
                    chrome.Value<int>("recordedEventsAfterRulebookOpen")
                );
                Assert.AreEqual(
                    chrome.Value<int>("recordedEventsBeforeRulebook"),
                    chrome.Value<int>("recordedEventsAfterRulebookKeyword")
                );
                Assert.AreEqual(
                    chrome.Value<int>("recordedEventsBeforeRulebook"),
                    chrome.Value<int>("recordedEventsAfterRulebookNext")
                );
                Assert.AreEqual(
                    chrome.Value<int>("recordedEventsBeforeRulebook"),
                    chrome.Value<int>("recordedEventsAfterRulebookClose")
                );
                Assert.IsTrue(chrome.Value<bool>("shellAfterRestart"));
                Assert.IsTrue(chrome.Value<bool>("localStartVisibleAfterRestart"));
                Assert.AreNotEqual(
                    chrome.Value<string>("restartedStartHash"),
                    chrome.Value<string>("restartedCommandHash")
                );
                Assert.AreEqual(1, chrome.Value<int>("restartedCommandRecordedEvents"));
            }
            finally
            {
                Object.DestroyImmediate(root);
                CleanupRenderedSceneObjects();
            }
        }

        [Test]
        public void LocalDevReplayReviewReleasePathSmokeNavigatesImportedReplayWithoutMutatingLiveState()
        {
            var root = new GameObject("GemDuel LocalDev Replay Review Release Path Smoke Test");
            try
            {
                var slice = root.AddComponent<GemDuelGameController>();
                var report = LocalDevReplayReviewReleasePathSmoke.Run(
                    slice,
                    new LocalDevReplayReviewReleasePathSmokeOptions
                    {
                        Seed = "unity-editmode-replay-review-release-path-smoke",
                        MaxSteps = 4,
                        OutputDirectory = RepositoryPaths.ResolveFromRoot(
                            "artifacts",
                            "unity",
                            "replay-review-release-path"
                        ),
                    }
                );

                Assert.IsTrue(report.Value<bool>("ok"), report.ToString(Formatting.Indented));
                Assert.IsTrue(report.Value<bool>("freshLaunch"));
                Assert.IsFalse(report.Value<bool>("usedFixtureReplayAsGameplayDriver"));
                Assert.IsFalse(report.Value<bool>("usedCheckpointStateReplacement"));

                var navigation = (JObject)report["reviewNavigationSummary"];
                Assert.GreaterOrEqual(navigation.Value<int>("exportedEvents"), 2);
                Assert.AreEqual(0, navigation.Value<int>("importedRevision"));
                Assert.AreEqual(1, navigation.Value<int>("firstForwardRevision"));
                Assert.AreEqual(2, navigation.Value<int>("secondForwardRevision"));
                Assert.AreEqual(1, navigation.Value<int>("backToFirstRevision"));
                Assert.AreEqual(
                    navigation.Value<int>("exportedEvents"),
                    navigation.Value<int>("finalRevision")
                );
                Assert.AreEqual(
                    navigation.Value<int>("exportedEvents") - 1,
                    navigation.Value<int>("beforeReturnedFinalRevision")
                );
                Assert.AreEqual(
                    navigation.Value<int>("exportedEvents"),
                    navigation.Value<int>("returnedFinalRevision")
                );
                Assert.AreEqual(
                    navigation.Value<string>("firstForwardHash"),
                    navigation.Value<string>("backToFirstHash")
                );
                Assert.AreEqual(
                    navigation.Value<string>("exportedSummaryFinalStateHash"),
                    navigation.Value<string>("finalReviewHash")
                );
                Assert.AreEqual(
                    navigation.Value<string>("exportedSummaryFinalStateHash"),
                    navigation.Value<string>("returnedFinalHash")
                );
                Assert.AreEqual(
                    navigation.Value<string>("sourceHashBeforeReview"),
                    navigation.Value<string>("sourceHashAfterReview")
                );
                Assert.AreEqual(
                    navigation.Value<int>("sourceRecordedEventsBeforeReview"),
                    navigation.Value<int>("sourceRecordedEventsAfterReview")
                );
                Assert.IsTrue(navigation.Value<bool>("usedVisibleRedoControl"));
                Assert.IsTrue(navigation.Value<bool>("usedVisibleUndoControl"));
                Assert.IsTrue(navigation.Value<bool>("sourceLiveStateUnchanged"));
                Assert.IsTrue(navigation.Value<bool>("sourceLiveReplayStreamUnchanged"));
            }
            finally
            {
                Object.DestroyImmediate(root);
                CleanupRenderedSceneObjects();
            }
        }

        [Test]
        public void InvalidActionExposesElectronEquivalentErrorBanner()
        {
            var root = new GameObject("GemDuel Invalid Action Contract Test");
            try
            {
                var slice = root.AddComponent<GemDuelGameController>();
                slice.LoadFixtureForRuntime("local-pvp-royal-extra-turn-game-over.replay.json");
                Assert.IsTrue(slice.ApplyFixtureEventsForAutomation(2, out var prepareError), prepareError);

                Assert.IsTrue(
                    slice.RunSemanticActionForAutomation("invalid_action", null, out var actionError),
                    actionError
                );

                var after = slice.BuildAutomationStateSnapshot(1920, 1080);
                Assert.AreEqual("Invalid semantic action", after.Value<string>("errorBanner"));
                Assert.AreEqual("Invalid semantic action rejected.", after.Value<string>("statusText"));
                var errorTarget = FindVisibleTarget(after, "error.banner");
                Assert.AreEqual("ErrorBanner", errorTarget.Value<string>("kind"));
            }
            finally
            {
                Object.DestroyImmediate(root);
                CleanupRenderedSceneObjects();
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
        public void VisibleGemSelectionShowsConfirmCancelAndRequiresExplicitCommit()
        {
            var root = new GameObject("GemDuel Free Gem Selection Test");
            try
            {
                var slice = CreateSliceAtTakeGems(root);

                slice.HandleVisibleTarget(CreateGemTarget(root, 3, 0, "green"));
                slice.HandleVisibleTarget(CreateGemTarget(root, 3, 1, "red"));
                slice.HandleVisibleTarget(CreateGemTarget(root, 3, 2, "red"));

                Assert.AreEqual("green", slice.GetBoardGemForAutomation(3, 0));
                Assert.AreEqual("red", slice.GetBoardGemForAutomation(3, 1));
                Assert.AreEqual("red", slice.GetBoardGemForAutomation(3, 2));
                Assert.AreEqual(0, slice.GetInventoryCountForAutomation("p1", "green"));
                Assert.AreEqual(0, slice.GetInventoryCountForAutomation("p1", "red"));

                var automationState = slice.BuildAutomationStateSnapshot(1920, 1080);
                var selection = (JObject)automationState["gemSelection"];
                Assert.AreEqual(3, selection.Value<int>("count"));
                Assert.IsTrue(selection.Value<bool>("canConfirm"));
                Assert.NotNull(FindVisibleTarget(automationState, "board.selection.confirm"));
                Assert.NotNull(FindVisibleTarget(automationState, "board.selection.cancel"));
                Assert.IsTrue(
                    Object.FindObjectsByType<GameObject>(FindObjectsSortMode.None)
                        .Any(obj => obj != null && obj.name == "Gem Selected Highlight 3,0")
                );
                Assert.IsTrue(
                    Object.FindObjectsByType<GameObject>(FindObjectsSortMode.None)
                        .Any(obj => obj != null && obj.name == "Gem Selected Badge 3,0")
                );

                slice.HandleVisibleTarget(FindViewTarget("ActionButton", "confirm-gems"));

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
        public void VisibleGemSelectionDragAutoFillsSkippedMidpoint()
        {
            var root = new GameObject("GemDuel Drag Gem Selection Gap Test");
            try
            {
                var slice = CreateSliceAtTakeGems(root);

                slice.HandleVisibleTarget(CreateGemTarget(root, 3, 0, "green"));
                Assert.IsTrue(
                    slice.TryHandleTakeGemsDragTarget(
                        CreateGemTarget(root, 3, 2, "red"),
                        out var dragDetail
                    ),
                    dragDetail
                );

                var automationState = slice.BuildAutomationStateSnapshot(1920, 1080);
                var selection = (JObject)automationState["gemSelection"];
                Assert.AreEqual(3, selection.Value<int>("count"));
                Assert.IsTrue(selection.Value<bool>("canConfirm"));

                slice.HandleVisibleTarget(FindViewTarget("ActionButton", "confirm-gems"));

                Assert.AreEqual("empty", slice.GetBoardGemForAutomation(3, 0));
                Assert.AreEqual("empty", slice.GetBoardGemForAutomation(3, 1));
                Assert.AreEqual("empty", slice.GetBoardGemForAutomation(3, 2));
                Assert.AreEqual(1, slice.GetInventoryCountForAutomation("p1", "green"));
                Assert.AreEqual(2, slice.GetInventoryCountForAutomation("p1", "red"));
            }
            finally
            {
                Object.DestroyImmediate(root);
                CleanupRenderedSceneObjects();
            }
        }

        [TestCase(1)]
        [TestCase(2)]
        public void VisibleGemSelectionCanConfirmPartialSelection(int count)
        {
            var root = new GameObject("GemDuel Partial Gem Selection Test");
            try
            {
                var slice = CreateSliceAtTakeGems(root);

                slice.HandleVisibleTarget(CreateGemTarget(root, 3, 0, "green"));
                if (count == 2)
                {
                    slice.HandleVisibleTarget(CreateGemTarget(root, 3, 1, "red"));
                }

                slice.HandleVisibleTarget(FindViewTarget("ActionButton", "confirm-gems"));

                Assert.AreEqual("empty", slice.GetBoardGemForAutomation(3, 0));
                Assert.AreEqual(1, slice.GetInventoryCountForAutomation("p1", "green"));
                if (count == 2)
                {
                    Assert.AreEqual("empty", slice.GetBoardGemForAutomation(3, 1));
                    Assert.AreEqual(1, slice.GetInventoryCountForAutomation("p1", "red"));
                }
                else
                {
                    Assert.AreEqual("red", slice.GetBoardGemForAutomation(3, 1));
                    Assert.AreEqual(0, slice.GetInventoryCountForAutomation("p1", "red"));
                }
            }
            finally
            {
                Object.DestroyImmediate(root);
                CleanupRenderedSceneObjects();
            }
        }

        [Test]
        public void VisibleGemSelectionCancelClearsSelectionWithoutMutatingBoard()
        {
            var root = new GameObject("GemDuel Cancel Gem Selection Test");
            try
            {
                var slice = CreateSliceAtTakeGems(root);

                slice.HandleVisibleTarget(CreateGemTarget(root, 3, 0, "green"));
                slice.HandleVisibleTarget(CreateGemTarget(root, 3, 1, "red"));

                Assert.NotNull(FindViewTarget("ActionButton", "cancel-gems"));
                slice.HandleVisibleTarget(FindViewTarget("ActionButton", "cancel-gems"));

                Assert.AreEqual("green", slice.GetBoardGemForAutomation(3, 0));
                Assert.AreEqual("red", slice.GetBoardGemForAutomation(3, 1));
                Assert.AreEqual(0, slice.GetInventoryCountForAutomation("p1", "green"));
                Assert.AreEqual(0, slice.GetInventoryCountForAutomation("p1", "red"));
                var automationState = slice.BuildAutomationStateSnapshot(1920, 1080);
                Assert.AreEqual(0, ((JObject)automationState["gemSelection"]).Value<int>("count"));
                Assert.IsNull(FindOptionalViewTarget("ActionButton", "confirm-gems"));
            }
            finally
            {
                Object.DestroyImmediate(root);
                CleanupRenderedSceneObjects();
            }
        }

        [Test]
        public void RoyalCardClickPreviewsOutsideSelectRoyalAndDirectlySelectsDuringSelectRoyal()
        {
            var root = new GameObject("GemDuel Royal Preview Direct Selection Test");
            try
            {
                var slice = root.AddComponent<GemDuelGameController>();
                slice.LoadFixtureForRuntime("local-pvp-royal-extra-turn-game-over.replay.json");

                Assert.IsTrue(slice.ApplyFixtureEventsForAutomation(2, out var outsidePrepareError), outsidePrepareError);
                var outsideSelectionRoyal = Object
                    .FindObjectsByType<GemDuelViewTarget>(FindObjectsSortMode.None)
                    .First(target => target.Kind == "Royal" && target.RoyalId == "r91-ro" && target.Clickable);
                slice.HandleVisibleTarget(outsideSelectionRoyal);

                var outsidePreview = slice.BuildAutomationStateSnapshot(1920, 1080);
                Assert.AreEqual(2, outsidePreview.Value<int>("revision"));
                Assert.AreEqual("royal", ((JObject)outsidePreview["preview"]).Value<string>("source"));
                Assert.AreEqual("r91-ro", ((JObject)outsidePreview["preview"]).Value<string>("instanceId"));

                Assert.IsTrue(slice.ApplyFixtureEventsForAutomation(13, out var prepareError), prepareError);

                var before = slice.BuildAutomationStateSnapshot(1920, 1080);
                var royalTargetSnapshot = FindVisibleTarget(before, "royal.card.0");
                Assert.AreEqual("Royal", royalTargetSnapshot.Value<string>("kind"));
                Assert.AreEqual("r91-ro", royalTargetSnapshot.Value<string>("royalId"));

                var royalTarget = Object
                    .FindObjectsByType<GemDuelViewTarget>(FindObjectsSortMode.None)
                    .First(target => target.Kind == "Royal" && target.RoyalId == "r91-ro" && target.Clickable);
                slice.HandleVisibleTarget(royalTarget);

                var after = slice.BuildAutomationStateSnapshot(1920, 1080);
                Assert.AreEqual(14, after.Value<int>("revision"));
                Assert.IsTrue(after["preview"] == null || after["preview"].Type == JTokenType.Null);
                CollectionAssert.Contains(
                    ((JArray)((JObject)after["snapshot"])["playerRoyals"]["p1"]).Values<string>().ToList(),
                    "r91-ro"
                );
            }
            finally
            {
                Object.DestroyImmediate(root);
                CleanupRenderedSceneObjects();
            }
        }

        [Test]
        public void LocalPvpTypographyUsesStrongerLabelsAndPrivilegeScrollPlaceholder()
        {
            var root = new GameObject("GemDuel Typography Test");
            try
            {
                CreateSliceAtTakeGems(root);

                Assert.IsNull(FindTextMesh("Board Label"));
                var scrollGlyph = FindTextMesh("Privilege Scroll Placeholder Glyph");
                var marketLabel = FindTextMesh("Market Label");
                var royalLabel = FindTextMesh("Royals Label");
                var resourceCount = FindTextMesh("p1 Resource Count red");
                var deckLabel = FindTextMesh("Deck Label L1");

                Assert.NotNull(scrollGlyph);
                Assert.NotNull(marketLabel);
                Assert.NotNull(royalLabel);
                Assert.NotNull(resourceCount);
                Assert.NotNull(deckLabel);
                AssertBold(scrollGlyph);
                AssertBold(marketLabel);
                AssertBold(royalLabel);
                AssertBold(resourceCount);
                AssertBold(deckLabel);
                Assert.Greater(resourceCount.transform.localScale.x, 0.007f);
                Assert.Greater(marketLabel.transform.localScale.x, royalLabel.transform.localScale.x);
            }
            finally
            {
                Object.DestroyImmediate(root);
                CleanupRenderedSceneObjects();
            }
        }

        [Test]
        public void TopbarPointCounterUsesScoreInsteadOfPrivilegeBank()
        {
            var root = new GameObject("GemDuel Topbar Score Test");
            try
            {
                var slice = root.AddComponent<GemDuelGameController>();
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

        private static GemDuelGameController CreateSliceAtTakeGems(GameObject root)
        {
            var slice = root.AddComponent<GemDuelGameController>();
            slice.LoadFixtureForRuntime("local-pvp-royal-extra-turn-game-over.replay.json");
            slice.ApplyNextFixtureEvent();
            slice.ApplyNextFixtureEvent();
            return slice;
        }

        private sealed class ProductMarketCandidate
        {
            public int Level;
            public int Index;
            public string InstanceId = string.Empty;
            public CardDef Card;
            public int MissingCost;
        }

        private static bool DriveOneFreshLocalPvpProductAction(
            GemDuelGameController slice,
            JObject automationState,
            UnityCatalog catalog,
            out string detail
        )
        {
            var snapshot = (JObject)automationState["snapshot"];
            var phase = snapshot.Value<string>("phase");
            switch (phase)
            {
                case "IDLE":
                    if (TryBuyAffordableMarketCard(slice, snapshot, catalog, out detail))
                    {
                        return true;
                    }

                    if (ShouldPreferReplenish(snapshot) && RunSemantic(slice, "replenish", null, out detail))
                    {
                        return true;
                    }

                    if (TryTakeUsefulGemLine(slice, snapshot, catalog, out detail))
                    {
                        return true;
                    }

                    return RunSemantic(slice, "replenish", null, out detail);
                case "SELECT_CARD_COLOR":
                    return RunSemantic(
                        slice,
                        "select_joker_color",
                        new JObject { ["color"] = "red" },
                        out detail
                    );
                case "SELECT_ROYAL":
                    return RunSemantic(slice, "choose_royal", new JObject { ["index"] = 0 }, out detail);
                case "BONUS_ACTION":
                    return TryTakeBonusGem(slice, snapshot, out detail);
                case "STEAL_ACTION":
                    return TryUseInventoryAction(slice, snapshot, "steal_gem", CurrentOpponent(snapshot), out detail);
                case "DISCARD_EXCESS_GEMS":
                    return TryUseInventoryAction(slice, snapshot, "discard_gem", snapshot.Value<string>("turn"), out detail);
                case "PRIVILEGE_ACTION":
                case "RESERVE_WAITING_GEM":
                    return RunSemantic(slice, "cancel_gem_selection", null, out detail);
                case "DRAFT_PHASE":
                    return TryChooseDraftBuff(slice, automationState, out detail);
                default:
                    detail = "Unsupported live phase " + phase + ".";
                    return false;
            }
        }

        private static bool RunSemantic(
            GemDuelGameController slice,
            string action,
            JObject payload,
            out string detail
        )
        {
            if (slice.RunSemanticActionForAutomation(action, payload, out var error))
            {
                detail = action;
                return true;
            }

            detail = action + " rejected: " + error;
            return false;
        }

        private static bool TryBuyAffordableMarketCard(
            GemDuelGameController slice,
            JObject snapshot,
            UnityCatalog catalog,
            out string detail
        )
        {
            var candidates = FindMarketCandidates(snapshot, catalog)
                .Where(candidate => IsAffordable(snapshot, candidate.Card, catalog, candidate.Card.BonusColor == "gold"))
                .OrderByDescending(candidate => candidate.Card.Points)
                .ThenByDescending(candidate => candidate.Card.Crowns)
                .ThenByDescending(candidate => candidate.Card.Level)
                .ThenBy(candidate => candidate.MissingCost)
                .ToList();

            foreach (var candidate in candidates)
            {
                var payload = new JObject { ["level"] = candidate.Level, ["index"] = candidate.Index };
                if (slice.RunSemanticActionForAutomation("buy_card", payload, out var error))
                {
                    detail = "buy_card " + candidate.InstanceId;
                    return true;
                }

                detail = "buy_card " + candidate.InstanceId + " rejected: " + error;
                return false;
            }

            detail = "No affordable market card.";
            return false;
        }

        private static bool TryTakeUsefulGemLine(
            GemDuelGameController slice,
            JObject snapshot,
            UnityCatalog catalog,
            out string detail
        )
        {
            var needs = BuildNeedVector(snapshot, catalog);
            var lines = FindCandidateGemLines(snapshot)
                .Select(line => new { Line = line, Score = ScoreGemLine(snapshot, line, needs) })
                .OrderByDescending(candidate => candidate.Score)
                .ThenByDescending(candidate => candidate.Line.Count)
                .ToList();

            foreach (var candidate in lines)
            {
                foreach (var coord in candidate.Line)
                {
                    if (
                        !RunSemantic(
                            slice,
                            "click_board_cell",
                            new JObject { ["row"] = coord.x, ["column"] = coord.y },
                            out detail
                        )
                    )
                    {
                        return false;
                    }
                }

                return RunSemantic(slice, "confirm_gem_selection", null, out detail);
            }

            detail = "No collectible gem line.";
            return false;
        }

        private static bool TryTakeBonusGem(
            GemDuelGameController slice,
            JObject snapshot,
            out string detail
        )
        {
            var targetGem = snapshot["bonusGemTarget"];
            var targetGemId = targetGem?.Type == JTokenType.String
                ? targetGem.Value<string>()
                : (targetGem as JObject)?.Value<string>("id");
            if (string.IsNullOrEmpty(targetGemId))
            {
                detail = "No bonusGemTarget in BONUS_ACTION.";
                return false;
            }

            var coord = FindFirstBoardGemOrNull(snapshot, targetGemId);
            if (!coord.HasValue)
            {
                detail = "No board gem for bonus target " + targetGemId + ".";
                return false;
            }

            return RunSemantic(
                slice,
                "click_board_cell",
                new JObject { ["row"] = coord.Value.x, ["column"] = coord.Value.y },
                out detail
            );
        }

        private static bool TryUseInventoryAction(
            GemDuelGameController slice,
            JObject snapshot,
            string action,
            string player,
            out string detail
        )
        {
            foreach (var gemId in new[] { "red", "green", "blue", "white", "black", "pearl", "gold" })
            {
                if (GetInventoryValue(snapshot, player, gemId) <= 0)
                {
                    continue;
                }

                return RunSemantic(slice, action, new JObject { ["gemId"] = gemId }, out detail);
            }

            detail = "No inventory gem for " + action + ".";
            return false;
        }

        private static bool TryChooseDraftBuff(
            GemDuelGameController slice,
            JObject automationState,
            out string detail
        )
        {
            var buffTarget = ((JArray)automationState["visibleTargets"])
                .OfType<JObject>()
                .FirstOrDefault(target => target.Value<string>("kind") == "Buff");
            if (buffTarget == null)
            {
                detail = "No visible draft buff.";
                return false;
            }

            return RunSemantic(
                slice,
                "choose_boon",
                new JObject { ["buffId"] = buffTarget.Value<string>("buffId") },
                out detail
            );
        }

        private static bool ShouldPreferReplenish(JObject snapshot)
        {
            if (((JArray)snapshot["bag"]).Count == 0)
            {
                return false;
            }

            var emptyCount = ((JArray)snapshot["board"])
                .OfType<JArray>()
                .SelectMany(row => row.Values<string>())
                .Count(gemId => gemId == "empty");
            return emptyCount > 15;
        }

        private static List<ProductMarketCandidate> FindMarketCandidates(JObject snapshot, UnityCatalog catalog)
        {
            var candidates = new List<ProductMarketCandidate>();
            var market = (JObject)snapshot["market"];
            for (var level = 1; level <= 3; level += 1)
            {
                var row = (JArray)market[level.ToString()];
                for (var index = 0; index < row.Count; index += 1)
                {
                    var instanceId = row[index].Value<string>();
                    var cardId = ParseRuntimeCardId(instanceId);
                    if (string.IsNullOrEmpty(cardId) || !catalog.Cards.TryGetValue(cardId, out var card))
                    {
                        continue;
                    }

                    candidates.Add(
                        new ProductMarketCandidate
                        {
                            Level = level,
                            Index = index,
                            InstanceId = instanceId,
                            Card = card,
                            MissingCost = MissingCost(snapshot, card, catalog),
                        }
                    );
                }
            }

            return candidates;
        }

        private static Dictionary<string, int> BuildNeedVector(JObject snapshot, UnityCatalog catalog)
        {
            var needs = new Dictionary<string, int>
            {
                ["red"] = 0,
                ["green"] = 0,
                ["blue"] = 0,
                ["white"] = 0,
                ["black"] = 0,
                ["pearl"] = 0,
            };
            var target = FindMarketCandidates(snapshot, catalog)
                .Where(candidate => !IsAffordable(snapshot, candidate.Card, catalog, candidate.Card.BonusColor == "gold"))
                .OrderByDescending(candidate => candidate.Card.Points)
                .ThenByDescending(candidate => candidate.Card.Crowns)
                .ThenByDescending(candidate => candidate.Card.Level)
                .ThenBy(candidate => candidate.MissingCost)
                .FirstOrDefault();
            if (target == null)
            {
                return needs;
            }

            foreach (var gemId in needs.Keys.ToList())
            {
                var need = System.Math.Max(0, DiscountedCost(snapshot, target.Card, catalog, gemId)
                    - GetInventoryValue(snapshot, snapshot.Value<string>("turn"), gemId));
                needs[gemId] = need;
            }

            return needs;
        }

        private static bool IsAffordable(JObject snapshot, CardDef card, UnityCatalog catalog, bool isReserved)
        {
            _ = isReserved;
            var actor = snapshot.Value<string>("turn");
            var goldNeeded = 0;
            foreach (var gemId in new[] { "red", "green", "blue", "white", "black", "pearl" })
            {
                var needed = DiscountedCost(snapshot, card, catalog, gemId);
                var paid = System.Math.Min(needed, GetInventoryValue(snapshot, actor, gemId));
                goldNeeded += needed - paid;
            }

            return GetInventoryValue(snapshot, actor, "gold") >= goldNeeded;
        }

        private static int MissingCost(JObject snapshot, CardDef card, UnityCatalog catalog)
        {
            var actor = snapshot.Value<string>("turn");
            var missing = 0;
            foreach (var gemId in new[] { "red", "green", "blue", "white", "black", "pearl" })
            {
                missing += System.Math.Max(0, DiscountedCost(snapshot, card, catalog, gemId)
                    - GetInventoryValue(snapshot, actor, gemId));
            }

            return missing;
        }

        private static int DiscountedCost(JObject snapshot, CardDef card, UnityCatalog catalog, string gemId)
        {
            var cost = GetCostValue(card.Cost, gemId);
            if (gemId == "pearl" || gemId == "gold")
            {
                return cost;
            }

            return System.Math.Max(0, cost - GetTableauBonus(snapshot, snapshot.Value<string>("turn"), gemId, catalog));
        }

        private static int GetTableauBonus(JObject snapshot, string player, string gemId, UnityCatalog catalog)
        {
            var total = 0;
            var tableau = (JArray)((JObject)snapshot["playerTableau"])[player];
            foreach (var entry in tableau)
            {
                var instanceId = entry.Type == JTokenType.String
                    ? entry.Value<string>()
                    : ((JObject)entry).Value<string>("instanceId");
                var cardId = ParseRuntimeCardId(instanceId);
                if (string.IsNullOrEmpty(cardId))
                {
                    continue;
                }

                if (catalog.Cards.TryGetValue(cardId, out var card) && card.BonusColor == gemId)
                {
                    total += System.Math.Max(1, card.BonusCount);
                }
            }

            return total;
        }

        private static List<List<Vector2Int>> FindCandidateGemLines(JObject snapshot)
        {
            var lines = new List<List<Vector2Int>>();
            var directions = new[] { new Vector2Int(0, 1), new Vector2Int(1, 0), new Vector2Int(1, 1), new Vector2Int(1, -1) };
            for (var row = 0; row < 5; row += 1)
            {
                for (var column = 0; column < 5; column += 1)
                {
                    foreach (var direction in directions)
                    {
                        for (var length = 3; length >= 1; length -= 1)
                        {
                            var line = new List<Vector2Int>();
                            var valid = true;
                            for (var step = 0; step < length; step += 1)
                            {
                                var r = row + direction.x * step;
                                var c = column + direction.y * step;
                                if (r < 0 || r >= 5 || c < 0 || c >= 5)
                                {
                                    valid = false;
                                    break;
                                }

                                var gemId = GetBoardGem(snapshot, r, c);
                                if (gemId == "empty" || gemId == "gold")
                                {
                                    valid = false;
                                    break;
                                }

                                line.Add(new Vector2Int(r, c));
                            }

                            if (valid)
                            {
                                lines.Add(line);
                            }
                        }
                    }
                }
            }

            return lines;
        }

        private static int ScoreGemLine(
            JObject snapshot,
            List<Vector2Int> line,
            IReadOnlyDictionary<string, int> needs
        )
        {
            var score = line.Count * 10;
            var actor = snapshot.Value<string>("turn");
            foreach (var coord in line)
            {
                var gemId = GetBoardGem(snapshot, coord.x, coord.y);
                if (needs.TryGetValue(gemId, out var need) && need > 0)
                {
                    score += 80 + need * 8;
                    continue;
                }

                if (GetInventoryValue(snapshot, actor, gemId) < 2)
                {
                    score += 12;
                }
            }

            return score;
        }

        private static Vector2Int? FindFirstBoardGemOrNull(JObject snapshot, string gemId)
        {
            var board = (JArray)snapshot["board"];
            for (var row = 0; row < board.Count; row += 1)
            {
                var cells = (JArray)board[row];
                for (var column = 0; column < cells.Count; column += 1)
                {
                    if (cells[column].Value<string>() == gemId)
                    {
                        return new Vector2Int(row, column);
                    }
                }
            }

            return null;
        }

        private static string CurrentOpponent(JObject snapshot)
        {
            return snapshot.Value<string>("turn") == "p1" ? "p2" : "p1";
        }

        private static string GetBoardGem(JObject snapshot, int row, int column)
        {
            return ((JArray)((JArray)snapshot["board"])[row])[column].Value<string>();
        }

        private static int GetInventoryValue(JObject snapshot, string player, string gemId)
        {
            return ((JObject)((JObject)snapshot["inventories"])[player]).Value<int>(gemId);
        }

        private static int GetCostValue(GemInventory inventory, string gemId)
        {
            switch (gemId)
            {
                case "red":
                    return inventory.Red;
                case "green":
                    return inventory.Green;
                case "blue":
                    return inventory.Blue;
                case "white":
                    return inventory.White;
                case "black":
                    return inventory.Black;
                case "pearl":
                    return inventory.Pearl;
                case "gold":
                    return inventory.Gold;
                default:
                    return 0;
            }
        }

        private static string ParseRuntimeCardId(string instanceId)
        {
            if (string.IsNullOrEmpty(instanceId))
            {
                return string.Empty;
            }

            var withoutPrefix = instanceId.StartsWith("c:") ? instanceId.Substring(2) : instanceId;
            var hashIndex = withoutPrefix.IndexOf('#');
            return hashIndex >= 0 ? withoutPrefix.Substring(0, hashIndex) : withoutPrefix;
        }

        private static string ResolveLocalDevRecoveryPath()
        {
            return RepositoryPaths.ResolveFromRoot(
                "artifacts",
                "unity",
                "localdev-saves",
                "gemduel.recovery.v1.json"
            );
        }

        private static void DeleteLocalDevRecoverySave()
        {
            var path = ResolveLocalDevRecoveryPath();
            if (File.Exists(path))
            {
                File.Delete(path);
            }
        }

        private static RejectionManifest LoadRejectionManifest()
        {
            var path = RepositoryPaths.ResolveFromRoot(
                "fixtures",
                "replay-golden",
                "rejection-manifest.json"
            );
            return JsonConvert.DeserializeObject<RejectionManifest>(File.ReadAllText(path));
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

        private static readonly Dictionary<string, JObject> ReplayStateAtRevisionCache =
            new Dictionary<string, JObject>();

        private static GameState BuildReplayStateAtRevision(
            string fileName,
            int revision
        )
        {
            var cacheKey = fileName + "#" + revision;
            if (!ReplayStateAtRevisionCache.TryGetValue(cacheKey, out var cachedResponse))
            {
                var replayPath = RepositoryPaths.ResolveFromRoot(
                    "fixtures",
                    "replay-golden",
                    fileName
                );
                var response = new TypeScriptRulesBridgeProcessClient().Execute(
                    new JObject
                    {
                        ["kind"] = "replay-state",
                        ["replay"] = JObject.Parse(File.ReadAllText(replayPath)),
                        ["revision"] = revision,
                    }
                );
                Assert.IsTrue(response.Value<bool>("ok"), "TypeScript replay-state bridge failed.");
                Assert.AreEqual(revision, response.Value<int>("replayRevision"));
                cachedResponse = (JObject)response.DeepClone();
                ReplayStateAtRevisionCache[cacheKey] = cachedResponse;
            }

            var snapshot = cachedResponse["state"] as JObject;
            Assert.NotNull(snapshot, cacheKey + " did not return a replay state.");
            return new GameState(GameReducer.NormalizeReplayAuditSnapshot(snapshot), revision);
        }

        private static GameState BuildReplayStateAtRevision(ReplayVNext replay, int revision)
        {
            var state = ReplayBootstrapper.Bootstrap(replay);
            var reducer = new GameReducer();
            for (var index = 0; index < revision; index += 1)
            {
                var result = reducer.ApplyReplayEvent(state, replay.Events[index], replay.Checkpoints);
                Assert.IsTrue(result.Ok, result.Error);
                var checkpoint = replay.Checkpoints.Find(candidate => candidate.Revision == state.Revision);
                if (checkpoint != null)
                {
                    state.LoadReplayAuditSnapshot(
                        GameReducer.NormalizeReplayAuditSnapshot(checkpoint.State),
                        checkpoint.Revision
                    );
                }
            }

            return state;
        }

        private static void ApplyRejectionStateSetup(JObject snapshot, string setupId)
        {
            if (string.IsNullOrEmpty(setupId))
            {
                return;
            }

            switch (setupId)
            {
                case "empty-bag":
                    snapshot["bag"] = new JArray();
                    return;
                case "empty-deck":
                    ((JObject)snapshot["decks"])["1"] = new JArray();
                    return;
                case "full-reserve-row":
                    ((JObject)snapshot["playerReserved"])[snapshot.Value<string>("turn")] =
                        CollectReserveFillInstanceIds(snapshot);
                    return;
                case "missing-pending-reserve":
                    snapshot["pendingReserve"] = null;
                    return;
                case "empty-board-with-privilege":
                    snapshot["board"] = BuildEmptyReplayBoard();
                    ((JObject)snapshot["privileges"])[snapshot.Value<string>("turn")] = 1;
                    ((JObject)snapshot["extraPrivileges"])[snapshot.Value<string>("turn")] = 0;
                    return;
                case "privilege-action-no-charge":
                    snapshot["phase"] = "PRIVILEGE_ACTION";
                    ((JObject)snapshot["privileges"])[snapshot.Value<string>("turn")] = 0;
                    ((JObject)snapshot["extraPrivileges"])[snapshot.Value<string>("turn")] = 0;
                    snapshot["privilegeGemCount"] = 0;
                    return;
                case "blocked-peek-modal":
                    var activeModal = (JObject)snapshot["activeModal"];
                    var initiator = ((JObject)activeModal?["data"])?.Value<string>("initiator") ?? "p1";
                    snapshot["turn"] = initiator == "p1" ? "p2" : "p1";
                    return;
                case "online-draft":
                    snapshot["mode"] = "ONLINE_MULTIPLAYER";
                    return;
                case "p2-draft-before-p1-selection":
                    snapshot["turn"] = "p2";
                    snapshot["p1SelectedBuffId"] = null;
                    snapshot["p2DraftPool"] = new JArray(((JArray)snapshot["draftPool"]).Values<string>());
                    return;
                case "no-take-3-buff":
                    ((JObject)snapshot["playerBuffs"])[snapshot.Value<string>("turn")] = new JObject
                    {
                        ["buff"] = new JObject
                        {
                            ["id"] = "desperate_gamble",
                            ["level"] = 3,
                        },
                    };
                    return;
                default:
                    Assert.Fail("Unsupported rejection manifest setup " + setupId + ".");
                    return;
            }
        }

        private static JArray CollectReserveFillInstanceIds(JObject snapshot)
        {
            var ids = new JArray();
            var market = (JObject)snapshot["market"];
            for (var level = 1; level <= 3 && ids.Count < 3; level += 1)
            {
                foreach (var item in (JArray)market[level.ToString()])
                {
                    var instanceId = item.Value<string>();
                    if (!string.IsNullOrEmpty(instanceId))
                    {
                        ids.Add(instanceId);
                    }

                    if (ids.Count >= 3)
                    {
                        return ids;
                    }
                }
            }

            var decks = (JObject)snapshot["decks"];
            for (var level = 1; level <= 3 && ids.Count < 3; level += 1)
            {
                foreach (var item in (JArray)decks[level.ToString()])
                {
                    var instanceId = item.Value<string>();
                    if (!string.IsNullOrEmpty(instanceId))
                    {
                        ids.Add(instanceId);
                    }

                    if (ids.Count >= 3)
                    {
                        return ids;
                    }
                }
            }

            Assert.Fail("Rejection manifest setup could not find enough cards to fill reserve row.");
            return ids;
        }

        private static JArray BuildEmptyReplayBoard()
        {
            var board = new JArray();
            for (var row = 0; row < 5; row += 1)
            {
                var cells = new JArray();
                for (var column = 0; column < 5; column += 1)
                {
                    cells.Add("empty");
                }

                board.Add(cells);
            }

            return board;
        }

        private static void PrimeLiveControllerAtReplayState(
            GemDuelGameController slice,
            string fileName,
            ReplayVNext replay,
            GameState state,
            string stateHash
        )
        {
            slice.LoadFixtureForRuntime(fileName);
            var init = JObject.FromObject(replay.Init);
            var rulesEngine = GetPrivateField<IGameRulesEngine>(slice, "rulesEngine");
            rulesEngine.RestoreSession(init);
            SetPrivateField(slice, "activeReplay", null);
            SetPrivateField(slice, "activeRulesInit", (JObject)init.DeepClone());
            SetPrivateField(slice, "currentState", state);
            SetPrivateField(slice, "nextFixtureEventIndex", state.Revision);
            SetPrivateField(slice, "automationInteractiveReplayMode", true);
            InvokePrivate(
                slice,
                "StartLiveReplayRecording",
                GameRulesResult.Pass(
                    (JObject)state.Snapshot.DeepClone(),
                    (JObject)init.DeepClone(),
                    stateHash,
                    state.Revision,
                    "REJECTION_MANIFEST_SETUP"
                ),
                "unity-rejection-manifest",
                false
            );
            RenderCurrentState(slice);
        }

        private static UnityBridgeCommand BuildUnityBridgeCommandFromRejectionCase(
            RejectionManifestCase testCase
        )
        {
            var action = testCase.Action;
            var type = action.Value<string>("type");
            var payload = BuildUnityBridgePayload(type, action["payload"]);
            return new UnityBridgeCommand
            {
                Type = type,
                Payload = payload,
            };
        }

        private static JObject BuildUnityBridgePayload(string actionType, JToken payloadToken)
        {
            JObject payload;
            if (payloadToken == null || payloadToken.Type == JTokenType.Null)
            {
                payload = new JObject();
            }
            else if (payloadToken.Type == JTokenType.String)
            {
                payload = actionType == "DISCARD_GEM"
                    ? new JObject { ["gemId"] = payloadToken.Value<string>() }
                    : new JObject { ["value"] = payloadToken.DeepClone() };
            }
            else if (payloadToken.Type == JTokenType.Object)
            {
                payload = (JObject)payloadToken.DeepClone();
            }
            else
            {
                payload = new JObject { ["value"] = payloadToken.DeepClone() };
            }

            if (payload["marketInfo"] is JObject marketInfo)
            {
                payload["level"] = marketInfo.Value<int?>("level") ?? payload.Value<int?>("level") ?? 1;
                payload["idx"] = marketInfo.Value<int?>("idx") ?? payload.Value<int?>("idx") ?? 0;
                if (marketInfo.Value<bool?>("isExtra") == true)
                {
                    payload["isExtra"] = true;
                    payload["extraIdx"] = marketInfo.Value<int?>("extraIdx") ?? 0;
                }
            }

            if (payload["card"] is JObject card && payload["instanceId"] == null)
            {
                payload["instanceId"] = card.Value<string>("id") ?? string.Empty;
            }

            return payload;
        }

        private static void AssertLiveReplayStateUnchanged(
            GemDuelGameController slice,
            string expectedHash,
            int expectedRecordedEvents,
            string label
        )
        {
            var state = slice.BuildAutomationStateSnapshot(1920, 1080);
            var replay = (JObject)state["replay"];
            Assert.AreEqual(expectedHash, replay.Value<string>("currentStateHash"), label + " state hash");
            Assert.AreEqual(
                expectedRecordedEvents,
                ((JObject)replay["liveRecording"]).Value<int>("recordedEvents"),
                label + " live recording count"
            );
        }

        private static T GetPrivateField<T>(object instance, string fieldName)
        {
            var field = instance.GetType().GetField(
                fieldName,
                BindingFlags.Instance | BindingFlags.NonPublic
            );
            Assert.NotNull(field, "Expected private field " + fieldName + ".");
            return (T)field.GetValue(instance);
        }

        private static void SetPrivateField(object instance, string fieldName, object value)
        {
            var field = instance.GetType().GetField(
                fieldName,
                BindingFlags.Instance | BindingFlags.NonPublic
            );
            Assert.NotNull(field, "Expected private field " + fieldName + ".");
            field.SetValue(instance, value);
        }

        private static object InvokePrivate(object instance, string methodName, params object[] args)
        {
            var method = instance.GetType().GetMethod(
                methodName,
                BindingFlags.Instance | BindingFlags.NonPublic
            );
            Assert.NotNull(method, "Expected private method " + methodName + ".");
            return method.Invoke(instance, args);
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
                var eventCheckpoint = replay.Checkpoints.Find(candidate => candidate.Revision == state.Revision);
                if (eventCheckpoint != null)
                {
                    state.LoadReplayAuditSnapshot(
                        GameReducer.NormalizeReplayAuditSnapshot(eventCheckpoint.State),
                        eventCheckpoint.Revision
                    );
                }
            }

            var expected = ReplayStateHasher.SortToken(
                ReplayStateHasher.NormalizeHashToken(checkpoint.State)
            );
            var actual = ReplayStateHasher.SortToken(
                ReplayStateHasher.NormalizeHashToken(state.Snapshot)
            );
            Assert.IsTrue(JToken.DeepEquals(expected, actual));
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
            target.Clickable = true;
            return target;
        }

        private static Vector2Int FindFirstBoardGem(JObject snapshot, string gemId)
        {
            var board = (JArray)snapshot["board"];
            for (var row = 0; row < board.Count; row += 1)
            {
                var cells = (JArray)board[row];
                for (var column = 0; column < cells.Count; column += 1)
                {
                    if (cells[column].Value<string>() == gemId)
                    {
                        return new Vector2Int(row, column);
                    }
                }
            }

            Assert.Fail("Missing board gem " + gemId + ".");
            return new Vector2Int(-1, -1);
        }

        private static Vector2Int FindFirstCollectibleBoardGem(JObject snapshot, out string gemId)
        {
            var board = (JArray)snapshot["board"];
            for (var row = 0; row < board.Count; row += 1)
            {
                var cells = (JArray)board[row];
                for (var column = 0; column < cells.Count; column += 1)
                {
                    gemId = cells[column].Value<string>();
                    if (gemId != "empty" && gemId != "gold")
                    {
                        return new Vector2Int(row, column);
                    }
                }
            }

            Assert.Fail("Missing collectible board gem.");
            gemId = string.Empty;
            return new Vector2Int(-1, -1);
        }

        private static string GetDifferentGemColor(string gemId)
        {
            foreach (var candidate in new[] { "red", "green", "blue", "white", "black", "pearl" })
            {
                if (candidate != gemId)
                {
                    return candidate;
                }
            }

            return "red";
        }

        private static Vector2Int FindFirstNonJokerMarketCard(JObject snapshot, out string instanceId)
        {
            var market = (JObject)snapshot["market"];
            for (var level = 1; level <= 3; level += 1)
            {
                var row = (JArray)market[level.ToString()];
                for (var index = 0; index < row.Count; index += 1)
                {
                    instanceId = row[index].Value<string>();
                    if (!string.IsNullOrEmpty(instanceId) && !instanceId.Contains("-jo#"))
                    {
                        return new Vector2Int(level, index);
                    }
                }
            }

            Assert.Fail("Missing non-Joker market card.");
            instanceId = string.Empty;
            return new Vector2Int(-1, -1);
        }

        private static void StartLocalGameWithVisibleJoker(
            GemDuelGameController slice,
            string seedPrefix,
            out Vector2Int marketRef,
            out string instanceId
        )
        {
            for (var seedIndex = 0; seedIndex < 100; seedIndex += 1)
            {
                Assert.IsTrue(
                    slice.RunSemanticActionForAutomation(
                        "start_local_game",
                        new JObject { ["seed"] = seedPrefix + "-" + seedIndex },
                        out var startError
                    ),
                    startError
                );

                var start = slice.BuildAutomationStateSnapshot(1920, 1080);
                if (TryFindFirstJokerMarketCard((JObject)start["snapshot"], out marketRef, out instanceId))
                {
                    return;
                }
            }

            Assert.Fail("Expected a deterministic local start with a visible Joker.");
            marketRef = new Vector2Int(-1, -1);
            instanceId = string.Empty;
        }

        private static bool TryFindFirstJokerMarketCard(
            JObject snapshot,
            out Vector2Int marketRef,
            out string instanceId
        )
        {
            var market = (JObject)snapshot["market"];
            for (var level = 1; level <= 3; level += 1)
            {
                var row = (JArray)market[level.ToString()];
                for (var index = 0; index < row.Count; index += 1)
                {
                    instanceId = row[index].Value<string>();
                    if (!string.IsNullOrEmpty(instanceId) && instanceId.Contains("-jo#"))
                    {
                        marketRef = new Vector2Int(level, index);
                        return true;
                    }
                }
            }

            marketRef = new Vector2Int(-1, -1);
            instanceId = string.Empty;
            return false;
        }

        private static JObject GetMutableCurrentSnapshot(GemDuelGameController slice)
        {
            var currentStateField = typeof(GemDuelGameController).GetField(
                "currentState",
                BindingFlags.Instance | BindingFlags.NonPublic
            );
            var state = currentStateField?.GetValue(slice) as GameState;
            Assert.NotNull(state, "Expected a current live Unity game state.");
            return state.Snapshot;
        }

        private static void RenderCurrentState(GemDuelGameController slice)
        {
            var renderStateMethod = typeof(GemDuelGameController).GetMethod(
                "RenderState",
                BindingFlags.Instance | BindingFlags.NonPublic
            );
            Assert.NotNull(renderStateMethod, "Expected GemDuelGameController.RenderState.");
            renderStateMethod.Invoke(slice, null);
        }

        private static bool ApplyLiveRulesCommandForAutomation(
            GemDuelGameController slice,
            string commandType,
            JObject payload,
            string actorOverride = null
        )
        {
            var applyLiveRulesCommandMethod = typeof(GemDuelGameController).GetMethod(
                "ApplyLiveRulesCommand",
                BindingFlags.Instance | BindingFlags.NonPublic
            );
            Assert.NotNull(
                applyLiveRulesCommandMethod,
                "Expected GemDuelGameController.ApplyLiveRulesCommand."
            );
            return (bool)applyLiveRulesCommandMethod.Invoke(
                slice,
                new object[] { commandType, payload ?? new JObject(), actorOverride }
            );
        }

        private static bool LoadPersistedSettings(GemDuelGameController slice)
        {
            var loadSettingsMethod = typeof(GemDuelGameController).GetMethod(
                "LoadSettings",
                BindingFlags.Instance | BindingFlags.NonPublic
            );
            Assert.NotNull(loadSettingsMethod, "Expected GemDuelGameController.LoadSettings.");
            return (bool)loadSettingsMethod.Invoke(slice, null);
        }

        private static TMP_Text FindTextMesh(string name)
        {
            foreach (var mesh in Object.FindObjectsByType<TMP_Text>(FindObjectsSortMode.None))
            {
                if (mesh != null && mesh.name == name)
                {
                    return mesh;
                }
            }

            return null;
        }

        private static void AssertBold(TMP_Text mesh)
        {
            Assert.IsTrue((mesh.fontStyle & FontStyles.Bold) == FontStyles.Bold, mesh.name + " should be bold");
        }

        private static GemDuelViewTarget FindViewTarget(string kind, string eventType)
        {
            var target = FindOptionalViewTarget(kind, eventType);
            Assert.NotNull(target, "Missing visible target " + kind + " " + eventType);
            return target;
        }

        private static GemDuelViewTarget FindViewTargetBySemanticKey(string semanticKey)
        {
            var target = Object
                .FindObjectsByType<GemDuelViewTarget>(FindObjectsSortMode.None)
                .FirstOrDefault(candidate =>
                    candidate != null && candidate.Clickable && candidate.SemanticKey == semanticKey
                );
            Assert.NotNull(target, "Missing visible target " + semanticKey);
            return target;
        }

        private static GemDuelViewTarget FindOptionalViewTarget(string kind, string eventType)
        {
            return Object
                .FindObjectsByType<GemDuelViewTarget>(FindObjectsSortMode.None)
                .FirstOrDefault(target =>
                    target != null &&
                    target.Clickable &&
                    target.Kind == kind &&
                    target.EventType == eventType
                );
        }

        private static JObject FindVisibleTarget(JObject automationState, string semanticKey)
        {
            var target = ((JArray)automationState["visibleTargets"])
                .OfType<JObject>()
                .FirstOrDefault(candidate => candidate.Value<string>("semanticKey") == semanticKey);
            Assert.NotNull(target, "Missing visible target " + semanticKey);
            return target;
        }

        private static bool ClickVisibleTargetCenterForAutomation(
            GemDuelGameController controller,
            JObject automationState,
            string semanticKey,
            out string error
        )
        {
            var target = FindVisibleTarget(automationState, semanticKey);
            var rect = (JObject)target["rect"];
            var viewport = (JObject)automationState["viewport"];
            return controller.ClickViewportPointForAutomation(
                (float)(rect.Value<double>("x") + rect.Value<double>("width") * 0.5d),
                (float)(rect.Value<double>("y") + rect.Value<double>("height") * 0.5d),
                viewport.Value<int>("width"),
                viewport.Value<int>("height"),
                out error
            );
        }

        private static void CleanupRenderedSceneObjects()
        {
            foreach (var obj in Object.FindObjectsByType<GameObject>())
            {
                if (obj == null)
                {
                    continue;
                }

                if (
                    obj.name == "GemDuel Rendered State"
                    || obj.name == "Status Topbar"
                    || obj.name == "GemDuel Camera"
                )
                {
                    Object.DestroyImmediate(obj);
                }
            }
        }

        private sealed class UnityBridgeCommand
        {
            public string Type { get; set; } = string.Empty;

            public JObject Payload { get; set; } = new JObject();
        }

        private sealed class RejectionManifest
        {
            [JsonProperty("cases")]
            public List<RejectionManifestCase> Cases { get; set; } = new List<RejectionManifestCase>();
        }

        private sealed class RejectionManifestCase
        {
            [JsonProperty("id")]
            public string Id { get; set; } = string.Empty;

            [JsonProperty("fileName")]
            public string FileName { get; set; } = string.Empty;

            [JsonProperty("revision")]
            public int Revision { get; set; }

            [JsonProperty("stateSetupId")]
            public string StateSetupId { get; set; }

            [JsonProperty("actionType")]
            public string ActionType { get; set; } = string.Empty;

            [JsonProperty("action")]
            public JObject Action { get; set; } = new JObject();

            [JsonProperty("expectedRejectionCode")]
            public string ExpectedRejectionCode { get; set; } = string.Empty;

            [JsonProperty("expectedRejectionReason")]
            public string ExpectedRejectionReason { get; set; } = string.Empty;

            [JsonProperty("expectedBeforeStateHash")]
            public string ExpectedBeforeStateHash { get; set; } = string.Empty;

            [JsonProperty("expectedAfterStateHash")]
            public string ExpectedAfterStateHash { get; set; } = string.Empty;
        }
    }
}
