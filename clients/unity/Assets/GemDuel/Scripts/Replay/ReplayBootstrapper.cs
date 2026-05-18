using System.Linq;
using GemDuel.Core;
using Newtonsoft.Json.Linq;

namespace GemDuel.Replay
{
    public static class ReplayBootstrapper
    {
        public static GameState Bootstrap(ReplayVNext replay)
        {
            var checkpoint = replay.Checkpoints.FirstOrDefault(candidate => candidate.Revision == 0);
            if (checkpoint != null)
            {
                return new GameState(NormalizeSnapshotForRuntime(checkpoint.State), checkpoint.Revision);
            }

            return new GameState(BuildSnapshotFromInit(replay), 0);
        }

        private static JObject BuildSnapshotFromInit(ReplayVNext replay)
        {
            var init = replay.Init;
            var emptyInventory = new JObject
            {
                ["blue"] = 0,
                ["white"] = 0,
                ["green"] = 0,
                ["black"] = 0,
                ["red"] = 0,
                ["gold"] = 0,
                ["pearl"] = 0,
            };
            var inventories = new JObject
            {
                ["p1"] = emptyInventory.DeepClone(),
                ["p2"] = emptyInventory.DeepClone(),
            };
            var phase = init.ActionType == "INIT_DRAFT" ? "DRAFT_PHASE" : "IDLE";

            var snapshot = new JObject
            {
                ["board"] = init.Board.DeepClone(),
                ["bag"] = init.Bag.DeepClone(),
                ["turn"] = "p1",
                ["phase"] = phase,
                ["mode"] = init.Mode,
                ["winner"] = null,
                ["market"] = init.Market.DeepClone(),
                ["decks"] = init.Decks.DeepClone(),
                ["playerTableau"] = new JObject { ["p1"] = new JArray(), ["p2"] = new JArray() },
                ["playerReserved"] = new JObject { ["p1"] = new JArray(), ["p2"] = new JArray() },
                ["playerRoyals"] = new JObject { ["p1"] = new JArray(), ["p2"] = new JArray() },
                ["inventories"] = inventories,
                ["privileges"] = new JObject { ["p1"] = 0, ["p2"] = 1 },
                ["royalDeck"] = JArray.FromObject(init.RoyalDeck),
                ["royalMilestones"] = new JObject
                {
                    ["p1"] = new JObject { ["3"] = false, ["6"] = false },
                    ["p2"] = new JObject { ["3"] = false, ["6"] = false },
                },
                ["extraPoints"] = new JObject { ["p1"] = 0, ["p2"] = 0 },
                ["extraCrowns"] = new JObject { ["p1"] = 0, ["p2"] = 0 },
                ["extraAllocation"] = new JObject
                {
                    ["p1"] = emptyInventory.DeepClone(),
                    ["p2"] = emptyInventory.DeepClone(),
                },
                ["extraPrivileges"] = new JObject { ["p1"] = 0, ["p2"] = 0 },
                ["playerBuffs"] = BuildInitialPlayerBuffs(),
                ["draftPool"] = JArray.FromObject(init.DraftPool),
                ["p1SelectedBuffId"] = null,
                ["draftOrder"] = phase == "DRAFT_PHASE" ? new JArray("p1", "p2") : new JArray(),
                ["buffLevel"] = init.BuffLevel ?? 0,
                ["p2DraftLevel"] = phase == "DRAFT_PHASE" ? init.BuffLevel ?? 0 : 0,
                ["privilegeGemCount"] = 0,
                ["pendingReserve"] = null,
                ["pendingBuy"] = null,
                ["bonusGemTarget"] = null,
                ["nextPlayerAfterRoyal"] = null,
                ["pendingExtraTurn"] = false,
                ["playerTurnCounts"] = new JObject { ["p1"] = 0, ["p2"] = 0 },
                ["abilityResolution"] = null,
            };

            return snapshot;
        }

        private static JObject BuildInitialPlayerBuffs()
        {
            JObject BuildPlayer()
            {
                return new JObject
                {
                    ["buff"] = new JObject
                    {
                        ["id"] = "none",
                        ["level"] = 0,
                        ["state"] = new JObject(),
                    },
                };
            }

            return new JObject
            {
                ["p1"] = BuildPlayer(),
                ["p2"] = BuildPlayer(),
            };
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

            if (buff["state"] == null || buff["state"].Type == JTokenType.Null)
            {
                buff["state"] = new JObject();
            }
        }
    }
}
