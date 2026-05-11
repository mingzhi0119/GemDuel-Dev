using System.Collections.Generic;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace GemDuel.Core
{
    public enum PlayerKey
    {
        p1,
        p2
    }

    public enum GamePhase
    {
        IDLE,
        DRAFT_PHASE,
        SELECT_ROYAL,
        DISCARD_EXCESS_GEMS,
        BONUS_ACTION,
        STEAL_ACTION,
        PRIVILEGE_ACTION,
        RESERVE_WAITING_GEM,
        SELECT_CARD_COLOR
    }

    public enum GemColor
    {
        blue,
        white,
        green,
        black,
        red,
        pearl,
        gold,
        empty
    }

    public sealed class GemInventory
    {
        [JsonProperty("blue")]
        public int Blue { get; set; }

        [JsonProperty("white")]
        public int White { get; set; }

        [JsonProperty("green")]
        public int Green { get; set; }

        [JsonProperty("black")]
        public int Black { get; set; }

        [JsonProperty("red")]
        public int Red { get; set; }

        [JsonProperty("pearl")]
        public int Pearl { get; set; }

        [JsonProperty("gold")]
        public int Gold { get; set; }

        public static GemInventory Empty()
        {
            return new GemInventory();
        }
    }

    public sealed class BoardCell
    {
        [JsonProperty("r")]
        public int Row { get; set; }

        [JsonProperty("c")]
        public int Column { get; set; }

        [JsonProperty("gemId")]
        public string GemId { get; set; } = "empty";
    }

    public sealed class CardDef
    {
        [JsonProperty("id")]
        public string Id { get; set; } = string.Empty;

        [JsonProperty("level")]
        public int Level { get; set; }

        [JsonProperty("points")]
        public int Points { get; set; }

        [JsonProperty("cost")]
        public GemInventory Cost { get; set; } = GemInventory.Empty();

        [JsonProperty("bonusColor")]
        public string BonusColor { get; set; } = "null";

        [JsonProperty("bonusCount")]
        public int BonusCount { get; set; }

        [JsonProperty("crowns")]
        public int Crowns { get; set; }

        [JsonProperty("ability")]
        public List<string> Ability { get; set; } = new List<string>();

        [JsonProperty("prestige")]
        public int Prestige { get; set; }

        [JsonProperty("isBuff")]
        public bool IsBuff { get; set; }
    }

    public sealed class RoyalDef
    {
        [JsonProperty("id")]
        public string Id { get; set; } = string.Empty;

        [JsonProperty("points")]
        public int Points { get; set; }

        [JsonProperty("bonusColor")]
        public string BonusColor { get; set; } = "gold";

        [JsonProperty("crowns")]
        public int Crowns { get; set; }

        [JsonProperty("ability")]
        public List<string> Ability { get; set; } = new List<string>();

        [JsonProperty("label")]
        public string Label { get; set; } = string.Empty;
    }

    public sealed class BuffDef
    {
        [JsonProperty("id")]
        public string Id { get; set; } = string.Empty;

        [JsonProperty("level")]
        public int Level { get; set; }

        [JsonProperty("category")]
        public string Category { get; set; } = "none";

        [JsonProperty("label")]
        public string Label { get; set; } = string.Empty;

        [JsonProperty("desc")]
        public string Description { get; set; } = string.Empty;

        [JsonProperty("effects")]
        public JObject Effects { get; set; } = new JObject();
    }

    public sealed class GameState
    {
        public int Revision { get; private set; }

        public JObject Snapshot { get; private set; }

        public string Turn
        {
            get { return Snapshot.Value<string>("turn") ?? "p1"; }
        }

        public string Phase
        {
            get { return Snapshot.Value<string>("phase") ?? "IDLE"; }
        }

        public string Winner
        {
            get { return Snapshot.Value<string>("winner"); }
        }

        public GameState(JObject snapshot, int revision)
        {
            Snapshot = (JObject)snapshot.DeepClone();
            Revision = revision;
        }

        public void LoadReplayAuditSnapshot(JObject snapshot, int revision)
        {
            Snapshot = (JObject)snapshot.DeepClone();
            Revision = revision;
        }

        public void AdvanceRevision()
        {
            Revision += 1;
        }
    }
}
