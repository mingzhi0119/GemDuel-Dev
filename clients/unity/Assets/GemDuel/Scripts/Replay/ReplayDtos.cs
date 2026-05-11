using System.Collections.Generic;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace GemDuel.Replay
{
    public sealed class ReplayManifest
    {
        [JsonProperty("schemaVersion")]
        public int SchemaVersion { get; set; }

        [JsonProperty("rulesVersion")]
        public string RulesVersion { get; set; } = string.Empty;

        [JsonProperty("replaySchemaVersion")]
        public string ReplaySchemaVersion { get; set; } = string.Empty;

        [JsonProperty("requiredCoverage")]
        public List<string> RequiredCoverage { get; set; } = new List<string>();

        [JsonProperty("fixtures")]
        public List<ReplayManifestFixture> Fixtures { get; set; } = new List<ReplayManifestFixture>();
    }

    public sealed class ReplayManifestFixture
    {
        [JsonProperty("id")]
        public string Id { get; set; } = string.Empty;

        [JsonProperty("fileName")]
        public string FileName { get; set; } = string.Empty;

        [JsonProperty("tags")]
        public List<string> Tags { get; set; } = new List<string>();

        [JsonProperty("expectedFinalStateHash")]
        public string ExpectedFinalStateHash { get; set; } = string.Empty;

        [JsonProperty("expectedWinner")]
        public string ExpectedWinner { get; set; }

        [JsonProperty("expectedEndReason")]
        public string ExpectedEndReason { get; set; }

        [JsonProperty("expectedTotalEvents")]
        public int ExpectedTotalEvents { get; set; }

        [JsonProperty("expectedTurnCount")]
        public int ExpectedTurnCount { get; set; }
    }

    public sealed class ReplayVNext
    {
        [JsonProperty("schemaVersion")]
        public string SchemaVersion { get; set; } = string.Empty;

        [JsonProperty("replayRevision")]
        public int ReplayRevision { get; set; }

        [JsonProperty("gameVersion")]
        public string GameVersion { get; set; } = string.Empty;

        [JsonProperty("createdAt")]
        public string CreatedAt { get; set; } = string.Empty;

        [JsonProperty("match")]
        public ReplayMatchInfo Match { get; set; } = new ReplayMatchInfo();

        [JsonProperty("players")]
        public Dictionary<string, ReplayPlayer> Players { get; set; } =
            new Dictionary<string, ReplayPlayer>();

        [JsonProperty("init")]
        public ReplayInitSnapshot Init { get; set; } = new ReplayInitSnapshot();

        [JsonProperty("events")]
        public List<JObject> Events { get; set; } = new List<JObject>();

        [JsonProperty("checkpoints")]
        public List<ReplayCheckpoint> Checkpoints { get; set; } = new List<ReplayCheckpoint>();

        [JsonProperty("summary")]
        public ReplaySummary Summary { get; set; } = new ReplaySummary();
    }

    public sealed class ReplayMatchInfo
    {
        [JsonProperty("mode")]
        public string Mode { get; set; } = "LOCAL_PVP";

        [JsonProperty("seed")]
        public string Seed { get; set; }

        [JsonProperty("started")]
        public bool Started { get; set; }

        [JsonProperty("ended")]
        public bool Ended { get; set; }

        [JsonProperty("winner")]
        public string Winner { get; set; }

        [JsonProperty("endReason")]
        public string EndReason { get; set; }
    }

    public sealed class ReplayPlayer
    {
        [JsonProperty("buff")]
        public ReplayBuffRef Buff { get; set; } = new ReplayBuffRef();
    }

    public sealed class ReplayBuffRef
    {
        [JsonProperty("id")]
        public string Id { get; set; } = "none";

        [JsonProperty("level")]
        public int Level { get; set; }

        [JsonProperty("state")]
        public JObject State { get; set; }
    }

    public sealed class ReplayInitSnapshot
    {
        [JsonProperty("actionType")]
        public string ActionType { get; set; } = "INIT";

        [JsonProperty("mode")]
        public string Mode { get; set; } = "LOCAL_PVP";

        [JsonProperty("hostPlayer")]
        public string HostPlayer { get; set; } = "p1";

        [JsonProperty("board")]
        public JArray Board { get; set; } = new JArray();

        [JsonProperty("bag")]
        public JArray Bag { get; set; } = new JArray();

        [JsonProperty("market")]
        public JObject Market { get; set; } = new JObject();

        [JsonProperty("decks")]
        public JObject Decks { get; set; } = new JObject();

        [JsonProperty("cardInstances")]
        public Dictionary<string, string> CardInstances { get; set; } =
            new Dictionary<string, string>();

        [JsonProperty("initRandoms")]
        public JObject InitRandoms { get; set; } = new JObject();

        [JsonProperty("buffLevel")]
        public int? BuffLevel { get; set; }

        [JsonProperty("draftPool")]
        public List<string> DraftPool { get; set; } = new List<string>();

        [JsonProperty("royalDeck")]
        public List<string> RoyalDeck { get; set; } = new List<string>();
    }

    public sealed class ReplayCheckpoint
    {
        [JsonProperty("revision")]
        public int Revision { get; set; }

        [JsonProperty("state")]
        public JObject State { get; set; } = new JObject();
    }

    public sealed class ReplaySummary
    {
        [JsonProperty("turnCount")]
        public int TurnCount { get; set; }

        [JsonProperty("totalEvents")]
        public int TotalEvents { get; set; }

        [JsonProperty("winner")]
        public string Winner { get; set; }

        [JsonProperty("endReason")]
        public string EndReason { get; set; }

        [JsonProperty("finalStateHash")]
        public string FinalStateHash { get; set; } = string.Empty;
    }
}
