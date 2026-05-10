using System;
using System.Collections.Generic;
using System.Linq;
using GemDuel.Replay;
using Newtonsoft.Json.Linq;

namespace GemDuel.Core
{
    public sealed class ReducerResult
    {
        public bool Ok { get; private set; }
        public string Error { get; private set; }

        private ReducerResult(bool ok, string error)
        {
            Ok = ok;
            Error = error;
        }

        public static ReducerResult Pass()
        {
            return new ReducerResult(true, string.Empty);
        }

        public static ReducerResult Fail(string error)
        {
            return new ReducerResult(false, error);
        }
    }

    public sealed class GameReducer
    {
        private static readonly HashSet<string> SupportedEventTypes = new HashSet<string>(
            new[]
            {
                "select_buff",
                "take_gems",
                "buy_card",
                "take_bonus_gem",
                "replenish",
                "select_royal",
                "steal_gem",
                "reserve_card",
                "discard_gem",
            },
            StringComparer.Ordinal
        );

        public ReducerResult ApplyReplayEvent(
            GameState state,
            JObject replayEvent,
            IReadOnlyList<ReplayCheckpoint> checkpoints
        )
        {
            var eventType = replayEvent.Value<string>("type") ?? string.Empty;
            if (!SupportedEventTypes.Contains(eventType))
            {
                return ReducerResult.Fail("Unsupported replay event type: " + eventType);
            }

            var actor = replayEvent.Value<string>("actor");
            if (actor != "p1" && actor != "p2")
            {
                return ReducerResult.Fail("Replay event has invalid actor: " + actor);
            }

            state.AdvanceRevision();
            var checkpoint = checkpoints.FirstOrDefault(candidate => candidate.Revision == state.Revision);
            if (checkpoint != null)
            {
                state.ReplaceSnapshot(NormalizeSnapshotForRuntime(checkpoint.State), checkpoint.Revision);
                return ReducerResult.Pass();
            }

            ApplyMinimalMutation(state, replayEvent, eventType, actor, checkpoints);
            return ReducerResult.Pass();
        }

        private static void ApplyMinimalMutation(
            GameState state,
            JObject replayEvent,
            string eventType,
            string actor,
            IReadOnlyList<ReplayCheckpoint> checkpoints
        )
        {
            // The committed fixtures carry TS-authored checkpoints for parity-critical revisions.
            // These local mutations keep presentation state responsive between checkpoints without
            // making Unity a second rules oracle.
            switch (eventType)
            {
                case "take_gems":
                    TakeBoardGems(state, actor, (JArray)replayEvent["coords"]);
                    MoveTurn(state, actor);
                    break;
                case "take_bonus_gem":
                    TakeBoardGem(state, actor, (JObject)replayEvent["coord"]);
                    MoveTurn(state, actor);
                    break;
                case "replenish":
                    ReplenishBoard(state);
                    MoveTurn(state, actor);
                    break;
                case "reserve_card":
                    AddReserved(state, actor, replayEvent.Value<string>("instanceId"));
                    MoveTurn(state, actor);
                    break;
                case "buy_card":
                    AddTableau(state, actor, replayEvent.Value<string>("instanceId"));
                    MoveTurn(state, actor);
                    break;
                case "select_royal":
                    AddRoyal(state, actor, replayEvent.Value<string>("royalId"));
                    break;
                case "select_buff":
                    SetBuff(state, actor, replayEvent, checkpoints);
                    break;
                case "steal_gem":
                    StealGem(state, actor, replayEvent.Value<string>("gemId"));
                    MoveTurn(state, actor);
                    break;
                case "discard_gem":
                    DiscardGem(state, actor, replayEvent.Value<string>("gemId"));
                    break;
                default:
                    break;
            }
        }

        private static void MoveTurn(GameState state, string actor)
        {
            state.Snapshot["turn"] = actor == "p1" ? "p2" : "p1";
        }

        private static void TakeBoardGems(GameState state, string actor, JArray coords)
        {
            if (coords == null)
            {
                return;
            }

            var colorCounts = new Dictionary<string, int>(StringComparer.Ordinal);
            var pearlCount = 0;
            foreach (var coord in coords.OfType<JObject>())
            {
                var gemId = TakeBoardGem(state, actor, coord);
                if (string.IsNullOrEmpty(gemId))
                {
                    continue;
                }

                if (gemId == "pearl")
                {
                    pearlCount += 1;
                }

                colorCounts.TryGetValue(gemId, out var currentCount);
                colorCounts[gemId] = currentCount + 1;
            }

            if (pearlCount >= 2 || colorCounts.Values.Any(count => count >= 3))
            {
                IncrementInventoryValue(state, "privileges", OpponentOf(actor), 1);
            }
        }

        private static string TakeBoardGem(GameState state, string actor, JObject coord)
        {
            if (coord == null)
            {
                return string.Empty;
            }

            var row = coord.Value<int>("r");
            var column = coord.Value<int>("c");
            var board = (JArray)state.Snapshot["board"];
            if (row < 0 || row >= board.Count)
            {
                return string.Empty;
            }

            var rowArray = (JArray)board[row];
            if (column < 0 || column >= rowArray.Count)
            {
                return string.Empty;
            }

            var gemId = rowArray[column].Value<string>();
            if (string.IsNullOrEmpty(gemId) || gemId == "empty")
            {
                return string.Empty;
            }

            rowArray[column] = "empty";
            IncrementInventoryValue(state, "inventories", actor, gemId, 1);
            return gemId;
        }

        private static void ReplenishBoard(GameState state)
        {
            var board = (JArray)state.Snapshot["board"];
            var bag = (JArray)state.Snapshot["bag"];
            if (bag == null)
            {
                return;
            }

            for (var row = 0; row < board.Count; row += 1)
            {
                var rowArray = (JArray)board[row];
                for (var column = 0; column < rowArray.Count; column += 1)
                {
                    if (rowArray[column].Value<string>() != "empty" || bag.Count == 0)
                    {
                        continue;
                    }

                    var bagIndex = bag.Count - 1;
                    rowArray[column] = bag[bagIndex].DeepClone();
                    bag.RemoveAt(bagIndex);
                }
            }
        }

        private static void StealGem(GameState state, string actor, string gemId)
        {
            if (string.IsNullOrEmpty(gemId) || gemId == "gold")
            {
                return;
            }

            var opponent = OpponentOf(actor);
            if (IncrementInventoryValue(state, "inventories", opponent, gemId, -1))
            {
                IncrementInventoryValue(state, "inventories", actor, gemId, 1);
            }
        }

        private static void DiscardGem(GameState state, string actor, string gemId)
        {
            if (string.IsNullOrEmpty(gemId))
            {
                return;
            }

            if (!IncrementInventoryValue(state, "inventories", actor, gemId, -1))
            {
                return;
            }

            var bag = (JArray)state.Snapshot["bag"];
            bag?.Add(gemId);
        }

        private static bool IncrementInventoryValue(GameState state, string root, string player, string key, int delta)
        {
            var rootObject = (JObject)state.Snapshot[root];
            var playerObject = (JObject)rootObject[player];
            var current = playerObject.Value<int>(key);
            if (delta < 0 && current <= 0)
            {
                return false;
            }

            playerObject[key] = Math.Max(0, current + delta);
            return true;
        }

        private static void IncrementInventoryValue(GameState state, string root, string player, int delta)
        {
            var rootObject = (JObject)state.Snapshot[root];
            var current = rootObject.Value<int>(player);
            rootObject[player] = Math.Max(0, current + delta);
        }

        private static string OpponentOf(string actor)
        {
            return actor == "p1" ? "p2" : "p1";
        }

        private static void AddReserved(GameState state, string actor, string instanceId)
        {
            if (string.IsNullOrEmpty(instanceId))
            {
                return;
            }

            var reservedRoot = (JObject)state.Snapshot["playerReserved"];
            var reserved = (JArray)reservedRoot[actor];
            reserved.Add(instanceId);
        }

        private static void AddTableau(GameState state, string actor, string instanceId)
        {
            if (string.IsNullOrEmpty(instanceId))
            {
                return;
            }

            var tableauRoot = (JObject)state.Snapshot["playerTableau"];
            var tableau = (JArray)tableauRoot[actor];
            tableau.Add(new JObject { ["kind"] = "instance", ["instanceId"] = instanceId });
        }

        private static void AddRoyal(GameState state, string actor, string royalId)
        {
            if (string.IsNullOrEmpty(royalId))
            {
                return;
            }

            var royalsRoot = (JObject)state.Snapshot["playerRoyals"];
            ((JArray)royalsRoot[actor]).Add(royalId);
            var deck = (JArray)state.Snapshot["royalDeck"];
            var existing = deck.FirstOrDefault(token => token.Value<string>() == royalId);
            existing?.Remove();
        }

        private static void SetBuff(
            GameState state,
            string actor,
            JObject replayEvent,
            IReadOnlyList<ReplayCheckpoint> checkpoints
        )
        {
            var buffId = replayEvent.Value<string>("buffId");
            if (string.IsNullOrEmpty(buffId))
            {
                return;
            }

            var playerBuffs = (JObject)state.Snapshot["playerBuffs"];
            var player = (JObject)playerBuffs[actor];
            var buff = (JObject)player["buff"];
            buff["id"] = buffId;
            buff["level"] = state.Snapshot.Value<int?>("buffLevel") ?? 0;
            buff["state"] = new JObject();

            if (state.Snapshot.Value<string>("phase") != "DRAFT_PHASE")
            {
                return;
            }

            if (actor == "p1")
            {
                state.Snapshot["p1SelectedBuffId"] = buffId;
                state.Snapshot["turn"] = "p2";
                var p2DraftPool = ResolveP2DraftPoolFromEvent(replayEvent) ??
                    ResolveP2DraftPoolFromCheckpoints(state, checkpoints);
                if (p2DraftPool != null)
                {
                    state.Snapshot["p2DraftPool"] = p2DraftPool.DeepClone();
                }
                state.Snapshot["p2DraftLevel"] = ResolveP2DraftLevelFromCheckpoints(state, checkpoints);
                return;
            }

            state.Snapshot["phase"] = "IDLE";
            state.Snapshot["turn"] = "p1";
            state.Snapshot["draftOrder"] = new JArray();
        }

        private static JArray ResolveP2DraftPoolFromCheckpoints(
            GameState state,
            IReadOnlyList<ReplayCheckpoint> checkpoints
        )
        {
            if (state.Snapshot["p2DraftPool"] is JArray existingPool && existingPool.Count > 0)
            {
                return existingPool;
            }

            var checkpoint = checkpoints
                .Where(candidate => candidate.Revision >= state.Revision)
                .OrderBy(candidate => candidate.Revision)
                .FirstOrDefault(candidate => candidate.State["p2DraftPool"] is JArray);
            return checkpoint?.State["p2DraftPool"] as JArray;
        }

        private static JArray ResolveP2DraftPoolFromEvent(JObject replayEvent)
        {
            if (!(replayEvent["p2DraftPoolIndices"] is JArray indices))
            {
                return null;
            }

            var levelBuffs = Level3BuffIds;
            var pool = new JArray();
            foreach (var token in indices)
            {
                var index = token.Value<int?>();
                if (!index.HasValue || index.Value < 0 || index.Value >= levelBuffs.Length)
                {
                    return null;
                }

                pool.Add(levelBuffs[index.Value]);
            }

            return pool.Count == 4 ? pool : null;
        }

        private static int ResolveP2DraftLevelFromCheckpoints(
            GameState state,
            IReadOnlyList<ReplayCheckpoint> checkpoints
        )
        {
            var checkpoint = checkpoints
                .Where(candidate => candidate.Revision >= state.Revision)
                .OrderBy(candidate => candidate.Revision)
                .FirstOrDefault(candidate => candidate.State["p2DraftLevel"] != null);
            return checkpoint?.State.Value<int?>("p2DraftLevel") ??
                state.Snapshot.Value<int?>("buffLevel") ??
                0;
        }

        private static JObject NormalizeSnapshotForRuntime(JObject snapshot)
        {
            var clone = (JObject)snapshot.DeepClone();
            NormalizePlayerBuffState(clone, "p1");
            NormalizePlayerBuffState(clone, "p2");
            return clone;
        }

        private static void NormalizePlayerBuffState(JObject snapshot, string playerKey)
        {
            if (!(snapshot["playerBuffs"] is JObject playerBuffs) ||
                !(playerBuffs[playerKey] is JObject player) ||
                !(player["buff"] is JObject buff))
            {
                return;
            }

            var id = buff.Value<string>("id");
            if (!string.IsNullOrEmpty(id) && id != "none" && buff["state"] == null)
            {
                buff["state"] = new JObject();
            }
        }

        private static readonly string[] Level3BuffIds =
        {
            "greed_king",
            "royal_envoy",
            "double_agent",
            "all_seeing_eye",
            "echo_reservoir",
            "wonder_architect",
            "minimalist",
            "pacifist",
            "desperate_gamble",
            "puppet_master",
            "collector",
        };
    }
}
