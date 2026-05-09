using System.IO;
using GemDuel.Catalog;
using GemDuel.Core;
using GemDuel.Platform;
using GemDuel.Replay;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using UnityEngine;

namespace GemDuel.Presentation
{
    public sealed class GemDuelVerticalSlice : MonoBehaviour
    {
        private readonly LocalDevPlatformServices platformServices = new LocalDevPlatformServices();
        private readonly GameReducer reducer = new GameReducer();
        private ReplayVNext activeReplay;
        private GameState currentState;
        private TextMesh statusText;
        private int nextFixtureEventIndex;

        [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.AfterSceneLoad)]
        public static void EnsureSceneController()
        {
            if (FindObjectOfType<GemDuelVerticalSlice>() != null)
            {
                return;
            }

            var root = new GameObject("GemDuel Vertical Slice");
            root.AddComponent<GemDuelVerticalSlice>();
            root.AddComponent<GemDuelInputController>();
        }

        private async void Start()
        {
            await platformServices.Init();
            BuildCamera();
            BuildStatusText();
            LoadInitialReplayState();
            RenderState();
        }

        public void ApplyNextFixtureEvent()
        {
            if (activeReplay == null || currentState == null)
            {
                SetStatus("No local PvP fixture is loaded.");
                return;
            }

            if (nextFixtureEventIndex >= activeReplay.Events.Count)
            {
                SetStatus("Fixture complete | winner " + (currentState.Winner ?? "none"));
                return;
            }

            var replayEvent = activeReplay.Events[nextFixtureEventIndex];
            var result = reducer.ApplyReplayEvent(currentState, replayEvent, activeReplay.Checkpoints);
            if (!result.Ok)
            {
                SetStatus(result.Error);
                return;
            }

            nextFixtureEventIndex += 1;
            RenderState();
            SetStatus(
                "Event "
                    + nextFixtureEventIndex
                    + "/"
                    + activeReplay.Events.Count
                    + " | "
                    + replayEvent.Value<string>("type")
                    + " | "
                    + currentState.Phase
                    + " | turn "
                    + currentState.Turn
                    + (currentState.Winner == null ? string.Empty : " | winner " + currentState.Winner)
            );
        }

        public void EmitTakeGems(JArray coords)
        {
            EmitLocalEvent(new JObject { ["type"] = "take_gems", ["actor"] = currentState.Turn, ["coords"] = coords });
        }

        public void EmitReserveMarketCard(string instanceId, int level, int index)
        {
            EmitLocalEvent(
                new JObject
                {
                    ["type"] = "reserve_card",
                    ["actor"] = currentState.Turn,
                    ["instanceId"] = instanceId,
                    ["level"] = level,
                    ["marketRef"] = new JObject { ["level"] = level, ["idx"] = index },
                }
            );
        }

        public void EmitBuyMarketCard(string instanceId, int level, int index)
        {
            EmitLocalEvent(
                new JObject
                {
                    ["type"] = "buy_card",
                    ["actor"] = currentState.Turn,
                    ["instanceId"] = instanceId,
                    ["source"] = "market",
                    ["marketRef"] = new JObject { ["level"] = level, ["idx"] = index },
                    ["bonusColor"] = "null",
                }
            );
        }

        public void EmitSelectRoyal(string royalId)
        {
            EmitLocalEvent(
                new JObject
                {
                    ["type"] = "select_royal",
                    ["actor"] = currentState.Turn,
                    ["royalId"] = royalId,
                }
            );
        }

        public void EmitSingleGemStateAction(string eventType, string gemId)
        {
            EmitLocalEvent(
                new JObject
                {
                    ["type"] = eventType,
                    ["actor"] = currentState.Turn,
                    ["gemId"] = gemId,
                }
            );
        }

        private void EmitLocalEvent(JObject replayEvent)
        {
            if (currentState == null)
            {
                return;
            }

            var result = reducer.ApplyReplayEvent(currentState, replayEvent, activeReplay.Checkpoints);
            SetStatus(result.Ok ? "Applied " + replayEvent.Value<string>("type") : result.Error);
            RenderState();
        }

        private void LoadInitialReplayState()
        {
            var fixturePath = RepositoryPaths.ResolveFromRoot(
                "fixtures",
                "replay-golden",
                "local-pvp-royal-extra-turn-game-over.replay.json"
            );
            activeReplay = JsonConvert.DeserializeObject<ReplayVNext>(File.ReadAllText(fixturePath));
            currentState = ReplayBootstrapper.Bootstrap(activeReplay);
            nextFixtureEventIndex = 0;
        }

        private void RenderState()
        {
            if (currentState == null)
            {
                statusText.text = "No replay state loaded.";
                return;
            }

            ClearRenderedState();
            var board = currentState.Snapshot["board"];
            for (var row = 0; row < 5; row += 1)
            {
                for (var column = 0; column < 5; column += 1)
                {
                    var gemId = board[row][column].Value<string>();
                    CreateGem(row, column, gemId);
                }
            }

            CreateZoneLabel("P1", new Vector3(-5.8f, -2.8f, 0f));
            CreateZoneLabel("P2", new Vector3(4.8f, 2.8f, 0f));
            CreateZoneLabel("Market", new Vector3(4.6f, 0f, 0f));
            CreateZoneLabel("Royals", new Vector3(-5.8f, 2.8f, 0f));
            statusText.text = "LocalDev | " + currentState.Phase + " | turn " + currentState.Turn;
        }

        private static void ClearRenderedState()
        {
            foreach (var obj in FindObjectsOfType<GameObject>())
            {
                if (obj.name.StartsWith("Gem ") || obj.name.EndsWith(" Label"))
                {
                    Destroy(obj);
                }
            }
        }

        private static void BuildCamera()
        {
            var existing = Camera.main;
            if (existing != null)
            {
                existing.orthographic = true;
                existing.orthographicSize = 5.5f;
                existing.transform.position = new Vector3(0f, 0f, -10f);
                return;
            }

            var cameraObject = new GameObject("Main Camera");
            var camera = cameraObject.AddComponent<Camera>();
            camera.tag = "MainCamera";
            camera.orthographic = true;
            camera.orthographicSize = 5.5f;
            cameraObject.transform.position = new Vector3(0f, 0f, -10f);
        }

        private void BuildStatusText()
        {
            var status = new GameObject("Status Topbar");
            status.transform.position = new Vector3(-4.8f, 4.2f, 0f);
            statusText = status.AddComponent<TextMesh>();
            statusText.characterSize = 0.22f;
            statusText.anchor = TextAnchor.MiddleLeft;
            statusText.text = "Loading GemDuel sidecar...";
        }

        private void SetStatus(string message)
        {
            if (statusText != null)
            {
                statusText.text = message;
            }
        }

        private static void CreateGem(int row, int column, string gemId)
        {
            var gem = GameObject.CreatePrimitive(PrimitiveType.Quad);
            gem.name = "Gem " + row + "," + column + " " + gemId;
            gem.transform.position = new Vector3(column - 2f, 2f - row, 0f);
            gem.transform.localScale = new Vector3(0.82f, 0.82f, 1f);
            var renderer = gem.GetComponent<MeshRenderer>();
            renderer.material = new Material(Shader.Find("Sprites/Default"));
            renderer.material.color = ColorForGem(gemId);
        }

        private static void CreateZoneLabel(string text, Vector3 position)
        {
            var label = new GameObject(text + " Label");
            label.transform.position = position;
            var mesh = label.AddComponent<TextMesh>();
            mesh.text = text;
            mesh.characterSize = 0.25f;
            mesh.anchor = TextAnchor.MiddleCenter;
        }

        private static Color ColorForGem(string gemId)
        {
            switch (gemId)
            {
                case "blue":
                    return new Color(0.1f, 0.35f, 0.95f);
                case "white":
                    return new Color(0.86f, 0.88f, 0.9f);
                case "green":
                    return new Color(0.15f, 0.7f, 0.35f);
                case "black":
                    return new Color(0.08f, 0.08f, 0.1f);
                case "red":
                    return new Color(0.9f, 0.2f, 0.16f);
                case "pearl":
                    return new Color(0.95f, 0.55f, 0.78f);
                case "gold":
                    return new Color(1f, 0.72f, 0.12f);
                default:
                    return new Color(0.2f, 0.2f, 0.22f);
            }
        }
    }
}
