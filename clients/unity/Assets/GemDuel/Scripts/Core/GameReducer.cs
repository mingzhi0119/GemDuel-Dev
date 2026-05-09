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
                state.ReplaceSnapshot(checkpoint.State, checkpoint.Revision);
                return ReducerResult.Pass();
            }

            ApplyMinimalMutation(state, replayEvent, eventType, actor);
            return ReducerResult.Pass();
        }

        private static void ApplyMinimalMutation(
            GameState state,
            JObject replayEvent,
            string eventType,
            string actor
        )
        {
            // The committed fixtures carry TS-authored checkpoints for parity-critical revisions.
            // These local mutations keep presentation state responsive between checkpoints without
            // making Unity a second rules oracle.
            switch (eventType)
            {
                case "take_gems":
                    MoveTurn(state, actor);
                    break;
                case "replenish":
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
                    SetBuff(state, actor, replayEvent.Value<string>("buffId"));
                    break;
                default:
                    break;
            }
        }

        private static void MoveTurn(GameState state, string actor)
        {
            state.Snapshot["turn"] = actor == "p1" ? "p2" : "p1";
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

        private static void SetBuff(GameState state, string actor, string buffId)
        {
            if (string.IsNullOrEmpty(buffId))
            {
                return;
            }

            var playerBuffs = (JObject)state.Snapshot["playerBuffs"];
            var player = (JObject)playerBuffs[actor];
            var buff = (JObject)player["buff"];
            buff["id"] = buffId;
        }
    }
}
