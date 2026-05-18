using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Net;
using System.Net.Sockets;
using System.Threading;
using GemDuel.Catalog;
using GemDuel.Core;
using GemDuel.Lan;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using NUnit.Framework;

namespace GemDuel.Tests.EditMode.Lan
{
    public sealed class LanProtocolEditModeTests
    {
        [Test]
        public void TypeScriptRulesEngineBuildsNetworkStartRequestWithoutChangingSharedContract()
        {
            JObject capturedRequest = null;
            var engine = new TypeScriptGameRulesEngine(request =>
            {
                capturedRequest = (JObject)request.DeepClone();
                return new JObject
                {
                    ["ok"] = true,
                    ["replayRevision"] = 0,
                    ["init"] = new JObject { ["seed"] = request.Value<string>("seed") },
                    ["state"] = BuildSnapshot("p2", request.Value<string>("hostPlayer") ?? "p1"),
                    ["stateHash"] = "hash-0",
                    ["actionType"] = "INIT",
                };
            });

            var result = engine.StartNetworkGame("unity-lan-seed", "p1");

            Assert.IsTrue(result.Ok, result.Error);
            Assert.AreEqual("start", capturedRequest.Value<string>("kind"));
            Assert.AreEqual("ONLINE_MULTIPLAYER", capturedRequest.Value<string>("mode"));
            Assert.AreEqual("unity-lan-seed", capturedRequest.Value<string>("seed"));
            Assert.AreEqual("p1", capturedRequest.Value<string>("hostPlayer"));
            Assert.AreEqual("hash-0", result.StateHash);
        }

        [Test]
        public void HostSnapshotCarriesRevisionHashAndRedactsOpponentReserved()
        {
            var harness = CreateHarness("p2");

            var snapshot = harness.ClientSnapshots[harness.ClientSnapshots.Count - 1];

            Assert.AreEqual("p2", snapshot.ViewerPlayer);
            Assert.AreEqual(0, snapshot.ReplayRevision);
            Assert.AreEqual("hash-0", snapshot.StateHash);
            Assert.AreEqual("p2", snapshot.Snapshot.Value<string>("localPlayer"));
            Assert.IsFalse(snapshot.Snapshot.Value<bool>("isHost"));
            var reserved = (JObject)snapshot.Snapshot["playerReserved"];
            Assert.IsTrue(LanVisibilityFilter.IsHiddenReservedCard(((JArray)reserved["p1"])[0]));
            Assert.AreEqual("p2-reserved-1", ((JArray)reserved["p2"])[0].Value<string>("id"));
        }

        [Test]
        public void UnityVisibilityFilterWritesSharedParityFixture()
        {
            var authoritative = BuildSnapshot("p2", "p1");
            var unityView = LanVisibilityFilter.CreateViewForPlayer(authoritative, "p2");
            var fixture = new JObject
            {
                ["schemaVersion"] = 1,
                ["kind"] = "unity-lan-visibility-parity-fixture",
                ["viewerPlayer"] = "p2",
                ["authoritative"] = authoritative,
                ["unityView"] = unityView,
            };
            var artifactPath = RepositoryPaths.ResolveFromRoot(
                "artifacts",
                "unity",
                "lan-visibility",
                "unity-lan-visibility-fixture.json"
            );
            var directory = Path.GetDirectoryName(artifactPath);
            if (!string.IsNullOrWhiteSpace(directory))
            {
                Directory.CreateDirectory(directory);
            }

            File.WriteAllText(artifactPath, fixture.ToString(Formatting.Indented));

            var reserved = (JObject)unityView["playerReserved"];
            var opponentReserved = (JArray)reserved["p1"];
            var viewerReserved = (JArray)reserved["p2"];
            Assert.IsTrue(LanVisibilityFilter.IsHiddenReservedCard(opponentReserved[0]));
            Assert.IsNull(opponentReserved[0]["id"]);
            Assert.AreEqual("p2-reserved-1", viewerReserved[0].Value<string>("id"));
            Assert.AreEqual("p2", unityView.Value<string>("localPlayer"));
            Assert.IsFalse(unityView.Value<bool>("isHost"));
        }

        [Test]
        public void ClientCommandIsIntentOnlyAndAcceptedResultCarriesRevisionHash()
        {
            var harness = CreateHarness("p2");

            Assert.IsTrue(
                harness.Client.SendCommand(
                    "TAKE_GEMS",
                    new JObject { ["coords"] = new JArray(new JObject { ["r"] = 0, ["c"] = 0 }) },
                    out var error
                ),
                error
            );

            Assert.AreEqual(1, harness.Engine.ApplyCommandCalls);
            var result = harness.ClientResults[harness.ClientResults.Count - 1];
            Assert.IsTrue(result.Accepted, result.Reason);
            Assert.AreEqual(1, result.ReplayRevision);
            Assert.AreEqual("hash-1", result.StateHash);
            Assert.AreEqual(1, harness.Client.ReplayRevision);
            Assert.AreEqual("hash-1", harness.Client.StateHash);
            Assert.AreEqual("p1", harness.Client.CurrentSnapshot.Value<string>("turn"));
            Assert.AreEqual(1, harness.Host.ReplayRevision);
            Assert.AreEqual("hash-1", harness.Host.StateHash);
            Assert.AreEqual("p1", harness.Host.CurrentSnapshot.Value<string>("turn"));
            var hostSnapshot = harness.HostSnapshots[harness.HostSnapshots.Count - 1];
            Assert.AreEqual("p1", hostSnapshot.ViewerPlayer);
            Assert.AreEqual(1, hostSnapshot.ReplayRevision);
            Assert.AreEqual("hash-1", hostSnapshot.StateHash);
            Assert.AreEqual("p1", hostSnapshot.Snapshot.Value<string>("turn"));
        }

        [Test]
        public void InvalidActorIsRejectedWithoutRulesBridgeApply()
        {
            var harness = CreateHarness("p1");

            harness.ClientTransport.Send(
                LanMessage.Create(
                    "lan-test",
                    "test-client",
                    "p1",
                    LanRole.Client,
                    LanMessageTypes.ClientCommand,
                    0,
                    "hash-0",
                    new JObject
                    {
                        ["requestId"] = "invalid-actor",
                        ["actor"] = "p1",
                        ["command"] = new JObject
                        {
                            ["type"] = "TAKE_GEMS",
                            ["payload"] = new JObject { ["coords"] = new JArray() },
                        },
                        ["baseReplayRevision"] = 0,
                        ["baseStateHash"] = "hash-0",
                    },
                    100
                )
            );

            Assert.AreEqual(0, harness.Engine.ApplyCommandCalls);
            var result = harness.ClientResults[harness.ClientResults.Count - 1];
            Assert.IsFalse(result.Accepted);
            Assert.AreEqual("INVALID_ACTOR", result.ReasonCode);
            Assert.AreEqual(0, result.ReplayRevision);
            Assert.AreEqual("hash-0", result.StateHash);
        }

        [Test]
        public void TcpLoopbackTransportCarriesHostSnapshotAndClientCommand()
        {
            var port = PickFreePort();
            var hostTransport = new TcpLanTransport();
            var clientTransport = new TcpLanTransport();
            var engine = new ScriptedRulesEngine("p2");
            var host = new LanHostSession(hostTransport, engine, "lan-tcp-test", "unity-lan-seed", "p1");
            var client = new LanClientSession(clientTransport, "lan-tcp-test", "p2", "p1");
            var gate = new object();
            var clientSnapshots = new List<LanSnapshotEventArgs>();
            var clientResults = new List<LanCommandResultEventArgs>();
            client.SnapshotReceived += (_, args) =>
            {
                lock (gate)
                {
                    clientSnapshots.Add(args);
                }
            };
            client.CommandResultReceived += (_, args) =>
            {
                lock (gate)
                {
                    clientResults.Add(args);
                }
            };

            try
            {
                host.StartHost(port);
                Assert.IsTrue(host.StartGame(out var error), error);
                client.Join("127.0.0.1", port);

                WaitUntil(
                    () =>
                    {
                        lock (gate)
                        {
                            return clientSnapshots.Count > 0;
                        }
                    },
                    "TCP initial host snapshot"
                );

                LanSnapshotEventArgs snapshot;
                lock (gate)
                {
                    snapshot = clientSnapshots[clientSnapshots.Count - 1];
                }

                Assert.AreEqual("p2", snapshot.ViewerPlayer);
                Assert.AreEqual(0, snapshot.ReplayRevision);
                Assert.AreEqual("hash-0", snapshot.StateHash);

                Assert.IsTrue(
                    client.SendCommand(
                        "TAKE_GEMS",
                        new JObject { ["coords"] = new JArray(new JObject { ["r"] = 0, ["c"] = 0 }) },
                        out error
                    ),
                    error
                );

                WaitUntil(
                    () =>
                    {
                        lock (gate)
                        {
                            return clientResults.Count > 0 && clientResults[clientResults.Count - 1].Accepted;
                        }
                    },
                    "TCP accepted command result"
                );

                LanCommandResultEventArgs result;
                lock (gate)
                {
                    result = clientResults[clientResults.Count - 1];
                }

                Assert.AreEqual(1, engine.ApplyCommandCalls);
                Assert.AreEqual(1, result.ReplayRevision);
                Assert.AreEqual("hash-1", result.StateHash);
                Assert.AreEqual(1, client.ReplayRevision);
                Assert.AreEqual("hash-1", client.StateHash);
            }
            finally
            {
                client.Dispose();
                host.Dispose();
            }
        }

        [Test]
        public void HashMismatchTriggersRejectedResultAndAuthoritativeResync()
        {
            var harness = CreateHarness("p2");

            harness.ClientTransport.Send(
                LanMessage.Create(
                    "lan-test",
                    "test-client",
                    "p2",
                    LanRole.Client,
                    LanMessageTypes.ClientCommand,
                    0,
                    "bad-hash",
                    new JObject
                    {
                        ["requestId"] = "bad-hash",
                        ["actor"] = "p2",
                        ["command"] = new JObject
                        {
                            ["type"] = "TAKE_GEMS",
                            ["payload"] = new JObject { ["coords"] = new JArray() },
                        },
                        ["baseReplayRevision"] = 0,
                        ["baseStateHash"] = "bad-hash",
                    },
                    101
                )
            );

            Assert.AreEqual(0, harness.Engine.ApplyCommandCalls);
            var result = harness.ClientResults[harness.ClientResults.Count - 1];
            Assert.IsFalse(result.Accepted);
            Assert.AreEqual("STATE_HASH_MISMATCH", result.ReasonCode);
            var resync = harness.ClientSnapshots[harness.ClientSnapshots.Count - 1];
            Assert.AreEqual("STATE_HASH_MISMATCH", resync.Reason);
            Assert.AreEqual("hash-0", resync.StateHash);
        }

        [Test]
        public void ReconnectRequestsAuthoritativeResyncBeforeClientActs()
        {
            var harness = CreateHarness("p2");

            harness.Client.RequestResync("RECONNECT");

            var resync = harness.ClientSnapshots[harness.ClientSnapshots.Count - 1];
            Assert.AreEqual("RECONNECT", resync.Reason);
            Assert.AreEqual(0, resync.ReplayRevision);
            Assert.AreEqual("hash-0", resync.StateHash);
        }

        [Test]
        public void ClientRejectsOutOfTurnCommandLocally()
        {
            var harness = CreateHarness("p1");

            Assert.IsFalse(
                harness.Client.SendCommand("TAKE_GEMS", new JObject { ["coords"] = new JArray() }, out var error)
            );
            Assert.AreEqual("LAN client cannot act outside its turn.", error);
            Assert.AreEqual(0, harness.Engine.ApplyCommandCalls);
        }

        private static Harness CreateHarness(string initialTurn)
        {
            LoopbackLanTransport.CreatePair(out var hostTransport, out var clientTransport);
            var engine = new ScriptedRulesEngine(initialTurn);
            var host = new LanHostSession(hostTransport, engine, "lan-test", "unity-lan-seed", "p1");
            var client = new LanClientSession(clientTransport, "lan-test", "p2", "p1");
            var clientSnapshots = new List<LanSnapshotEventArgs>();
            var clientResults = new List<LanCommandResultEventArgs>();
            var hostSnapshots = new List<LanSnapshotEventArgs>();
            host.SnapshotReceived += (_, args) => hostSnapshots.Add(args);
            client.SnapshotReceived += (_, args) => clientSnapshots.Add(args);
            client.CommandResultReceived += (_, args) => clientResults.Add(args);

            hostTransport.StartHost(9777);
            clientTransport.Join("127.0.0.1", 9777);
            Assert.IsTrue(host.StartGame(out var error), error);
            Assert.Greater(clientSnapshots.Count, 0);

            return new Harness(
                hostTransport,
                clientTransport,
                host,
                client,
                engine,
                hostSnapshots,
                clientSnapshots,
                clientResults
            );
        }

        private static JObject BuildSnapshot(string turn, string hostPlayer)
        {
            return new JObject
            {
                ["mode"] = "ONLINE_MULTIPLAYER",
                ["phase"] = "IDLE",
                ["turn"] = turn,
                ["winner"] = null,
                ["hostPlayer"] = hostPlayer,
                ["localPlayer"] = hostPlayer,
                ["isHost"] = true,
                ["playerReserved"] = new JObject
                {
                    ["p1"] = new JArray(
                        BuildReservedCard("p1-reserved-1", "red"),
                        BuildReservedCard("p1-reserved-2", "green")
                    ),
                    ["p2"] = new JArray(BuildReservedCard("p2-reserved-1", "blue")),
                },
                ["inventories"] = new JObject
                {
                    ["p1"] = new JObject { ["red"] = 0, ["green"] = 0, ["blue"] = 0, ["white"] = 0, ["black"] = 0, ["pearl"] = 0, ["gold"] = 0 },
                    ["p2"] = new JObject { ["red"] = 0, ["green"] = 0, ["blue"] = 0, ["white"] = 0, ["black"] = 0, ["pearl"] = 0, ["gold"] = 0 },
                },
            };
        }

        private static JObject BuildReservedCard(string id, string bonusColor)
        {
            return new JObject
            {
                ["id"] = id,
                ["uid"] = id + "-uid",
                ["level"] = 1,
                ["cost"] = new JObject
                {
                    ["red"] = 0,
                    ["green"] = 0,
                    ["blue"] = 0,
                    ["white"] = 0,
                    ["black"] = 0,
                    ["pearl"] = 0,
                    ["gold"] = 0,
                },
                ["points"] = 1,
                ["bonusColor"] = bonusColor,
                ["ability"] = null,
                ["crowns"] = 0,
                ["prestige"] = 1,
                ["image"] = id + ".png",
            };
        }

        private static int PickFreePort()
        {
            var listener = new TcpListener(IPAddress.Loopback, 0);
            listener.Start();
            try
            {
                return ((IPEndPoint)listener.LocalEndpoint).Port;
            }
            finally
            {
                listener.Stop();
            }
        }

        private static void WaitUntil(Func<bool> condition, string description)
        {
            var timeout = TimeSpan.FromSeconds(3);
            var stopwatch = Stopwatch.StartNew();
            while (stopwatch.Elapsed < timeout)
            {
                if (condition())
                {
                    return;
                }

                Thread.Sleep(10);
            }

            Assert.Fail("Timed out waiting for " + description + ".");
        }

        private sealed class ScriptedRulesEngine : IGameRulesEngine
        {
            private readonly string initialTurn;
            private JObject init = new JObject { ["source"] = "lan-test" };

            public ScriptedRulesEngine(string initialTurn)
            {
                this.initialTurn = initialTurn;
            }

            public int StartNetworkGameCalls { get; private set; }
            public int ApplyCommandCalls { get; private set; }

            public GameRulesResult StartLocalGame(string seed, bool useBuffs = false)
            {
                return StartNetworkGame(seed, "p1", useBuffs);
            }

            public GameRulesResult StartNetworkGame(string seed, string hostPlayer = "p1", bool useBuffs = false)
            {
                StartNetworkGameCalls += 1;
                return GameRulesResult.Pass(
                    BuildSnapshot(initialTurn, hostPlayer),
                    init,
                    "hash-0",
                    0,
                    "INIT"
                );
            }

            public void RestoreSession(JObject init)
            {
                this.init = init == null ? new JObject() : (JObject)init.DeepClone();
            }

            public GameRulesResult ApplyCommand(GameState state, GameRulesCommand command)
            {
                ApplyCommandCalls += 1;
                if (command.Actor != state.Turn)
                {
                    return GameRulesResult.Fail(
                        "WRONG_TURN",
                        "Command actor does not match active player.",
                        state.Snapshot,
                        init,
                        "hash-" + state.Revision,
                        state.Revision,
                        command.Type
                    );
                }

                var nextRevision = state.Revision + 1;
                var next = (JObject)state.Snapshot.DeepClone();
                next["turn"] = command.Actor == "p1" ? "p2" : "p1";
                return GameRulesResult.Pass(next, init, "hash-" + nextRevision, nextRevision, command.Type);
            }
        }

        private sealed class Harness
        {
            public Harness(
                LoopbackLanTransport hostTransport,
                LoopbackLanTransport clientTransport,
                LanHostSession host,
                LanClientSession client,
                ScriptedRulesEngine engine,
                List<LanSnapshotEventArgs> hostSnapshots,
                List<LanSnapshotEventArgs> clientSnapshots,
                List<LanCommandResultEventArgs> clientResults
            )
            {
                HostTransport = hostTransport;
                ClientTransport = clientTransport;
                Host = host;
                Client = client;
                Engine = engine;
                HostSnapshots = hostSnapshots;
                ClientSnapshots = clientSnapshots;
                ClientResults = clientResults;
            }

            public LoopbackLanTransport HostTransport { get; private set; }
            public LoopbackLanTransport ClientTransport { get; private set; }
            public LanHostSession Host { get; private set; }
            public LanClientSession Client { get; private set; }
            public ScriptedRulesEngine Engine { get; private set; }
            public List<LanSnapshotEventArgs> HostSnapshots { get; private set; }
            public List<LanSnapshotEventArgs> ClientSnapshots { get; private set; }
            public List<LanCommandResultEventArgs> ClientResults { get; private set; }
        }
    }
}
