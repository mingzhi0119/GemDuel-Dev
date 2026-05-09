using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
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
        private const string DefaultFixtureFileName = "local-pvp-royal-extra-turn-game-over.replay.json";
        private static readonly string[] GemOrder = { "blue", "white", "green", "black", "red", "pearl", "gold" };
        private static readonly string[] PlayerZoneResourceOrder = { "red", "green", "blue", "white", "black", "pearl", "gold" };
        private static readonly string[] PlayerZoneTableauOrder = { "red", "green", "blue", "white", "black", "pure-royal" };

        private readonly LocalDevPlatformServices platformServices = new LocalDevPlatformServices();
        private readonly GameReducer reducer = new GameReducer();
        private readonly List<Vector2Int> selectedGemCoords = new List<Vector2Int>();
        private ReplayVNext activeReplay;
        private UnityCatalog catalog;
        private GameState currentState;
        private GameObject renderRoot;
        private TextMesh statusText;
        private TextMesh guideText;
        private int nextFixtureEventIndex;
        private bool isMainMenu;
        private bool settingsOpen;
        private string errorBanner = string.Empty;
        private PreviewContext previewContext;
        private int automationViewportWidth = 1920;
        private int automationViewportHeight = 1080;
        private readonly Dictionary<string, Texture2D> textureCache = new Dictionary<string, Texture2D>(StringComparer.OrdinalIgnoreCase);
        private readonly Dictionary<string, Texture2D> roundedTextureCache = new Dictionary<string, Texture2D>(StringComparer.OrdinalIgnoreCase);
        private Font uiFont;
        private float renderOpacity = 1f;
        private bool compensateTextWeight;

        public int GuidedEventsCompleted
        {
            get { return nextFixtureEventIndex; }
        }

        public int GuidedEventsTotal
        {
            get { return activeReplay == null ? 0 : activeReplay.Events.Count; }
        }

        public string Winner
        {
            get { return currentState == null ? null : currentState.Winner; }
        }

        public string GetBoardGemForAutomation(int row, int column)
        {
            if (currentState == null)
            {
                return string.Empty;
            }

            return ((JArray)currentState.Snapshot["board"])[row][column].Value<string>();
        }

        public int GetInventoryCountForAutomation(string player, string gemId)
        {
            if (currentState == null)
            {
                return 0;
            }

            return ((JObject)((JObject)currentState.Snapshot["inventories"])[player]).Value<int>(gemId);
        }

        public bool ApplyFixtureEventsForAutomation(int targetRevision, out string error)
        {
            error = string.Empty;
            if (activeReplay == null || currentState == null)
            {
                error = "No replay fixture is loaded.";
                return false;
            }

            var clampedRevision = Math.Max(0, Math.Min(targetRevision, activeReplay.Events.Count));
            while (nextFixtureEventIndex < clampedRevision)
            {
                var result = ApplyReplayEvent(activeReplay.Events[nextFixtureEventIndex]);
                if (!result.Ok)
                {
                    error = result.Error;
                    return false;
                }
            }

            previewContext = null;
            settingsOpen = false;
            errorBanner = string.Empty;
            RenderState();
            return true;
        }

        public void SetAutomationViewport(int width, int height)
        {
            automationViewportWidth = Math.Max(1, width);
            automationViewportHeight = Math.Max(1, height);
            BuildCamera();
            var camera = Camera.main;
            if (camera != null)
            {
                camera.aspect = AutomationAspect;
            }
        }

        public void LoadMainMenuForAutomation()
        {
            BuildCamera();
            BuildStatusText();
            catalog = new CatalogLoader().LoadDefault();
            activeReplay = null;
            currentState = null;
            nextFixtureEventIndex = 0;
            selectedGemCoords.Clear();
            previewContext = null;
            settingsOpen = false;
            errorBanner = string.Empty;
            isMainMenu = true;
            RenderState();
            SetStatus("Unity app shell ready.");
        }

        public bool RunSemanticActionForAutomation(string action, JObject payload, out string error)
        {
            error = string.Empty;
            payload = payload ?? new JObject();

            switch (action)
            {
                case "start_local_game":
                    LoadFixtureForRuntime(DefaultFixtureFileName);
                    return true;
                case "choose_mode":
                    isMainMenu = true;
                    settingsOpen = false;
                    previewContext = null;
                    errorBanner = string.Empty;
                    RenderState();
                    SetStatus("Mode selected: " + (payload.Value<string>("mode") ?? "classic"));
                    return true;
                case "click_market_card":
                    return PreviewMarketCard(
                        payload.Value<int?>("level") ?? 1,
                        payload.Value<int?>("index") ?? 0,
                        out error
                    );
                case "buy_card":
                    return RunPreviewAction("buy_card", payload, out error);
                case "reserve_card":
                    return RunPreviewAction("reserve_card", payload, out error);
                case "click_player_reserved":
                    return PreviewReservedCard(payload.Value<int?>("index") ?? 0, out error);
                case "confirm_preview_action":
                    return ConfirmPreviewAction(payload.Value<string>("actionId"), out error);
                case "end_turn":
                    return RunEndTurnAction(out error);
                case "force_royal_selection":
                    SetStatus("Royal selection requested.");
                    return true;
                case "choose_royal":
                    return ChooseRoyal(payload.Value<int?>("index") ?? 0, out error);
                case "open_settings":
                    settingsOpen = true;
                    isMainMenu = false;
                    RenderState();
                    SetStatus("Settings opened.");
                    return true;
                case "change_setting":
                    SetStatus("Setting changed: " + (payload.Value<string>("name") ?? "unknown"));
                    return true;
                case "invalid_action":
                    errorBanner = "Invalid action";
                    RenderState();
                    SetStatus("Invalid action rejected.");
                    return true;
                default:
                    error = "Unsupported semantic action: " + action;
                    errorBanner = error;
                    RenderState();
                    SetStatus(error);
                    return false;
            }
        }

        public JObject BuildAutomationStateSnapshot(int viewportWidth, int viewportHeight)
        {
            var snapshot = currentState == null ? BuildShellSnapshot() : (JObject)currentState.Snapshot.DeepClone();
            var state = new JObject
            {
                ["source"] = "unity",
                ["revision"] = nextFixtureEventIndex,
                ["totalEvents"] = GuidedEventsTotal,
                ["winner"] = Winner,
                ["statusText"] = statusText == null ? string.Empty : statusText.text,
                ["guideText"] = guideText == null ? string.Empty : guideText.text,
                ["viewport"] = new JObject
                {
                    ["width"] = viewportWidth,
                    ["height"] = viewportHeight,
                },
                ["snapshot"] = snapshot,
                ["visibleTargets"] = BuildVisibleTargetSnapshot(viewportWidth, viewportHeight),
                ["settings"] = new JObject
                {
                    ["locale"] = "zh",
                    ["theme"] = "dark",
                    ["soundEnabled"] = true,
                    ["panelOpen"] = settingsOpen,
                },
                ["preview"] = previewContext == null
                    ? null
                    : new JObject
                    {
                        ["source"] = previewContext.Source,
                        ["level"] = previewContext.Level,
                        ["index"] = previewContext.Index,
                        ["instanceId"] = previewContext.InstanceId,
                    },
                ["errorBanner"] = string.IsNullOrEmpty(errorBanner) ? null : errorBanner,
            };

            state["phase"] = snapshot.Value<string>("phase");
            state["turn"] = snapshot.Value<string>("turn");
            state["mode"] = snapshot.Value<string>("mode");

            return state;
        }

        public string DumpAutomationStateJson(int viewportWidth, int viewportHeight)
        {
            return BuildAutomationStateSnapshot(viewportWidth, viewportHeight).ToString(Formatting.Indented);
        }

        [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.AfterSceneLoad)]
        public static void EnsureSceneController()
        {
            if (FindAnyObjectByType<GemDuelVerticalSlice>() != null)
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
            LoadFixtureForRuntime(DefaultFixtureFileName);
        }

        public void LoadFixtureForRuntime(string fixtureFileName)
        {
            BuildCamera();
            BuildStatusText();
            isMainMenu = false;
            settingsOpen = false;
            previewContext = null;
            errorBanner = string.Empty;
            LoadFixture(fixtureFileName);
            RenderState();
            SetStatus("Unity scoped parity view ready. Use visible highlighted actions for guided local PvP.");
        }

        public bool PlayGuidedFixtureToEndForAutomation(out string error)
        {
            error = string.Empty;
            while (activeReplay != null && nextFixtureEventIndex < activeReplay.Events.Count)
            {
                var result = ApplyReplayEvent(activeReplay.Events[nextFixtureEventIndex]);
                if (!result.Ok)
                {
                    error = result.Error;
                    return false;
                }
            }

            var complete = currentState != null && currentState.Winner == activeReplay.Summary.Winner;
            if (complete)
            {
                SetStatus("Guided local PvP complete | winner " + currentState.Winner);
            }

            return complete;
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
                SetStatus("Guided PvP complete | winner " + (currentState.Winner ?? "none"));
                return;
            }

            var replayEvent = activeReplay.Events[nextFixtureEventIndex];
            var result = ApplyReplayEvent(replayEvent);
            if (!result.Ok)
            {
                SetStatus(result.Error);
                return;
            }

            SetStatus("Debug step applied | " + DescribeEvent(replayEvent));
        }

        public void HandleVisibleTarget(GemDuelViewTarget target)
        {
            if (activeReplay == null || currentState == null)
            {
                return;
            }

            var nextEvent = GetNextEvent();
            if (nextEvent == null)
            {
                SetStatus("Match complete | winner " + (currentState.Winner ?? "none"));
                return;
            }

            var eventType = nextEvent.Value<string>("type") ?? string.Empty;
            if (eventType == "take_gems")
            {
                HandleTakeGemsTarget(target, nextEvent);
                return;
            }

            if (eventType == "take_bonus_gem")
            {
                if (target.Kind == "Gem" && MatchesCoord((JObject)nextEvent["coord"], target.Row, target.Column))
                {
                    ApplyVisibleEvent(nextEvent);
                    return;
                }

                SetStatus("Select the highlighted bonus gem.");
                return;
            }

            if (eventType == "buy_card" || eventType == "reserve_card")
            {
                if (target.Kind == "MarketCard" && MatchesMarketRef(nextEvent, target))
                {
                    ApplyVisibleEvent(nextEvent);
                    return;
                }

                SetStatus("Select the highlighted market card.");
                return;
            }

            if (eventType == "select_royal")
            {
                if (target.Kind == "Royal" && target.RoyalId == nextEvent.Value<string>("royalId"))
                {
                    ApplyVisibleEvent(nextEvent);
                    return;
                }

                SetStatus("Select the highlighted royal card.");
                return;
            }

            if (eventType == "select_buff")
            {
                if (target.Kind == "Buff" && target.BuffId == nextEvent.Value<string>("buffId"))
                {
                    ApplyVisibleEvent(nextEvent);
                    return;
                }

                SetStatus("Select the highlighted buff.");
                return;
            }

            if (eventType == "replenish")
            {
                if (target.Kind == "ActionButton" && target.EventType == "replenish")
                {
                    ApplyVisibleEvent(nextEvent);
                    return;
                }

                SetStatus("Use the visible Replenish action.");
                return;
            }

            if ((eventType == "steal_gem" || eventType == "discard_gem") && target.Kind == "InventoryGem")
            {
                if (target.EventType == eventType && target.GemId == nextEvent.Value<string>("gemId"))
                {
                    ApplyVisibleEvent(nextEvent);
                    return;
                }
            }

            SetStatus("Next action: " + DescribeEvent(nextEvent));
        }

        private void ApplyVisibleEvent(JObject replayEvent)
        {
            var result = ApplyReplayEvent(replayEvent);
            if (!result.Ok)
            {
                SetStatus(result.Error);
                return;
            }

            if (nextFixtureEventIndex >= activeReplay.Events.Count)
            {
                SetStatus("Guided PvP complete | winner " + (currentState.Winner ?? "none"));
                return;
            }

            SetStatus("Applied visible action | " + DescribeEvent(replayEvent));
        }

        private ReducerResult ApplyReplayEvent(JObject replayEvent)
        {
            var result = reducer.ApplyReplayEvent(currentState, replayEvent, activeReplay.Checkpoints);
            if (!result.Ok)
            {
                return result;
            }

            var eventType = replayEvent.Value<string>("type") ?? string.Empty;
            var completedPreview = previewContext;
            nextFixtureEventIndex += 1;
            selectedGemCoords.Clear();
            previewContext = null;
            if ((eventType == "buy_card" || eventType == "reserve_card") && completedPreview != null)
            {
                previewContext = completedPreview;
            }
            else if (eventType == "select_royal")
            {
                previewContext = new PreviewContext
                {
                    Source = "royal",
                    Level = -1,
                    Index = -1,
                    InstanceId = replayEvent.Value<string>("royalId"),
                };
            }

            settingsOpen = false;
            errorBanner = string.Empty;
            isMainMenu = false;
            RenderState();
            return result;
        }

        private void HandleTakeGemsTarget(GemDuelViewTarget target, JObject nextEvent)
        {
            if (target.Kind != "Gem")
            {
                SetStatus("Select board gems. The highlight is the fixture path; any legal non-gold line works.");
                return;
            }

            if (target.GemId == "empty")
            {
                SetStatus("That board space is empty.");
                return;
            }

            if (target.GemId == "gold")
            {
                SetStatus("Gold cannot be taken as a normal board gem.");
                return;
            }

            var limit = GetTakeGemsSelectionLimit(nextEvent);
            var selected = new Vector2Int(target.Row, target.Column);
            if (selectedGemCoords.Contains(selected))
            {
                selectedGemCoords.Remove(selected);
                RenderState();
                SetStatus("Selected " + selectedGemCoords.Count + "/" + limit + " board gems.");
                return;
            }

            if (selectedGemCoords.Count >= limit)
            {
                SetStatus("Take-gems selection is full.");
                return;
            }

            var candidate = new List<Vector2Int>(selectedGemCoords) { selected };
            var isFinalSelection = candidate.Count >= limit;
            if (!ValidateGemSelection(candidate, isFinalSelection, out var validationError))
            {
                SetStatus(validationError);
                return;
            }

            selectedGemCoords.Add(selected);
            RenderState();
            if (selectedGemCoords.Count < limit)
            {
                SetStatus("Selected " + selectedGemCoords.Count + "/" + limit + " board gems.");
                return;
            }

            ApplyVisibleEvent(BuildTakeGemsEvent(nextEvent));
        }

        private bool PreviewMarketCard(int level, int index, out string error)
        {
            error = string.Empty;
            if (currentState == null)
            {
                error = "No game is active.";
                return RejectSemanticAction(error);
            }

            var market = (JObject)currentState.Snapshot["market"];
            var row = (JArray)market[level.ToString()];
            if (row == null || index < 0 || index >= row.Count)
            {
                error = "No market card at " + level + "-" + index + ".";
                return RejectSemanticAction(error);
            }

            previewContext = new PreviewContext
            {
                Source = "market",
                Level = level,
                Index = index,
                InstanceId = row[index].Value<string>(),
            };
            isMainMenu = false;
            settingsOpen = false;
            errorBanner = string.Empty;
            RenderState();
            SetStatus("Previewing market card " + previewContext.InstanceId + ".");
            return true;
        }

        private bool PreviewReservedCard(int index, out string error)
        {
            error = string.Empty;
            if (currentState == null)
            {
                error = "No game is active.";
                return RejectSemanticAction(error);
            }

            var player = currentState.Turn;
            var reserved = (JArray)((JObject)currentState.Snapshot["playerReserved"])[player];
            if (reserved == null || index < 0 || index >= reserved.Count)
            {
                error = "No reserved card at " + index + ".";
                return RejectSemanticAction(error);
            }

            previewContext = new PreviewContext
            {
                Source = "reserved",
                Level = -1,
                Index = index,
                InstanceId = reserved[index].Value<string>(),
            };
            settingsOpen = false;
            errorBanner = string.Empty;
            RenderState();
            SetStatus("Previewing reserved card " + previewContext.InstanceId + ".");
            return true;
        }

        private bool RunPreviewAction(string eventType, JObject payload, out string error)
        {
            var level = payload.Value<int?>("level") ?? 1;
            var index = payload.Value<int?>("index") ?? 0;
            if (
                previewContext == null
                || previewContext.Source != "market"
                || previewContext.Level != level
                || previewContext.Index != index
            )
            {
                if (!PreviewMarketCard(level, index, out error))
                {
                    return false;
                }
            }

            return ConfirmPreviewAction(eventType == "buy_card" ? "buy" : "reserve", out error);
        }

        private bool ConfirmPreviewAction(string actionId, out string error)
        {
            error = string.Empty;
            if (previewContext == null)
            {
                error = "No active preview.";
                return RejectSemanticAction(error);
            }

            var expectedEventType = actionId == "reserve" ? "reserve_card" : "buy_card";
            var next = GetNextEvent();
            if (
                next != null
                && next.Value<string>("type") == expectedEventType
                && MatchesMarketRef(next, previewContext.Level, previewContext.Index)
            )
            {
                ApplyVisibleEvent(next);
                return true;
            }

            error = "Preview action " + actionId + " is not legal now.";
            return RejectSemanticAction(error);
        }

        private bool RunEndTurnAction(out string error)
        {
            error = string.Empty;
            var next = GetNextEvent();
            if (next != null && next.Value<string>("type") == "replenish")
            {
                ApplyVisibleEvent(next);
                return true;
            }

            error = "No visible end-turn action is available.";
            return RejectSemanticAction(error);
        }

        private bool ChooseRoyal(int index, out string error)
        {
            error = string.Empty;
            if (currentState == null)
            {
                error = "No game is active.";
                return RejectSemanticAction(error);
            }

            var royalDeck = (JArray)currentState.Snapshot["royalDeck"];
            if (royalDeck == null || index < 0 || index >= royalDeck.Count)
            {
                error = "No royal at index " + index + ".";
                return RejectSemanticAction(error);
            }

            var next = GetNextEvent();
            var royalId = royalDeck[index].Value<string>();
            if (next != null && next.Value<string>("type") == "select_royal" && next.Value<string>("royalId") == royalId)
            {
                ApplyVisibleEvent(next);
                return true;
            }

            error = "Royal " + royalId + " is not legal now.";
            return RejectSemanticAction(error);
        }

        private bool RejectSemanticAction(string message)
        {
            errorBanner = message;
            RenderState();
            SetStatus(message);
            return false;
        }

        private void LoadFixture(string fixtureFileName)
        {
            catalog = new CatalogLoader().LoadDefault();
            var fixturePath = RepositoryPaths.ResolveFromRoot("fixtures", "replay-golden", fixtureFileName);
            activeReplay = JsonConvert.DeserializeObject<ReplayVNext>(File.ReadAllText(fixturePath));
            new CatalogLoader().ValidateReplayReferences(catalog, activeReplay);
            currentState = ReplayBootstrapper.Bootstrap(activeReplay);
            nextFixtureEventIndex = 0;
            selectedGemCoords.Clear();
        }

        private float AutomationAspect
        {
            get { return (float)automationViewportWidth / automationViewportHeight; }
        }

        private Vector2 AutomationViewportWorldSize()
        {
            const float worldHeight = 10f;
            return new Vector2(worldHeight * AutomationAspect, worldHeight);
        }

        private void RenderState()
        {
            if (isMainMenu || currentState == null)
            {
                ClearRenderedState();
                renderRoot = new GameObject("GemDuel Rendered State");
                RenderMainMenu();
                if (settingsOpen)
                {
                    RenderSettingsOverlay();
                }

                if (!string.IsNullOrEmpty(errorBanner))
                {
                    RenderErrorBanner();
                }

                return;
            }

            if (currentState == null)
            {
                SetStatus("No replay state loaded.");
                return;
            }

            if (currentState.Phase == "DRAFT_PHASE")
            {
                RenderDraftPhase();
                return;
            }

            ClearRenderedState();
            renderRoot = new GameObject("GemDuel Rendered State");

            CreatePanel("Shell Semantic Bounds", new Vector3(0f, 0f, 0.45f), AutomationViewportWorldSize(), new Color(0f, 0f, 0f, 0f), false, null, "app.shell");
            CreateImagePanelPx(
                "Shell Background Artwork",
                new Rect(0f, 0f, 1920f, 820f),
                0.43f,
                "surfaces",
                "anime-themes",
                "royal-luxury",
                "dark",
                "shell-background.png"
            );
            CreatePanelPx("Shell Bottom Fill", 0f, 820f, 1920f, 260f, 0.42f, new Color(0.02f, 0.04f, 0.08f));

            RenderTopbar();
            RenderMarket();
            RenderBoard();
            RenderRoyals();
            RenderPlayerZone("p1", new Vector3(-4.4f, -3.85f, 0f));
            RenderPlayerZone("p2", new Vector3(4.4f, -3.85f, 0f));
            RenderGuidedActionSurface();
            if (previewContext != null)
            {
                RenderPreviewOverlay();
            }

            if (settingsOpen)
            {
                RenderSettingsOverlay();
            }

            if (!string.IsNullOrEmpty(errorBanner))
            {
                RenderErrorBanner();
            }
        }

        private void RenderMainMenu()
        {
            CreatePanel("Shell Background", new Vector3(0f, 0f, 0.45f), AutomationViewportWorldSize(), new Color(0.0f, 0.015f, 0.055f), false, null, "app.shell");
            CreatePanel("Main Menu Surface", new Vector3(0f, 0f, 0.34f), AutomationViewportWorldSize(), new Color(0f, 0f, 0f, 0f), false, null, "main.menu");

            WithTextWeightCompensation(() =>
            {
                CreateRoundedPanelPx("Visual Lab", 1775f, 17f, 128f, 32f, 8f, 1f, new Color(0.23f, 0.55f, 0.72f), new Color(0.01f, 0.04f, 0.09f));
                CreateFlaskIconPx(1789f, 32f, new Color(0.65f, 0.95f, 0.99f));
                CreateText("Visual Lab Title", ViewportPoint(1844f, 30f, -0.02f), "VISUAL LAB", 0.034f, Color.white, TextAnchor.MiddleCenter, FontStyle.Bold);
                CreateText("Visual Lab Subtitle", ViewportPoint(1844f, 39f, -0.02f), "SURFACES / MOTION / READABILITY", 0.018f, new Color(0.66f, 0.73f, 0.82f), TextAnchor.MiddleCenter, FontStyle.Bold);

                CreateText("Menu Title", ViewportPoint(960f, 190f, 0f), "宝石：对决", 0.55f, new Color(0.96f, 0.62f, 0.04f), TextAnchor.MiddleCenter, FontStyle.Bold);
                CreateText("Menu Subtitle", ViewportPoint(960f, 268f, 0f), "战术焕新对决", 0.16f, new Color(0.48f, 0.52f, 0.61f), TextAnchor.MiddleCenter, FontStyle.Normal);

                CreateRoundedPanelPx("Locale Toggle", 858f, 301f, 204f, 57f, 28f, 1f, new Color(0.2f, 0.25f, 0.35f), new Color(0.04f, 0.07f, 0.12f));
                CreateRoundedPanelPx("Locale Toggle Active", 979f, 309f, 75f, 42f, 21f, 0f, new Color(0f, 0f, 0f, 0f), new Color(0.06f, 0.73f, 0.51f), -0.01f);
                CreateText("Locale English", ViewportPoint(922f, 330f, -0.02f), "English", 0.095f, new Color(0.78f, 0.83f, 0.91f), TextAnchor.MiddleCenter, FontStyle.Bold);
                CreateText("Locale Chinese", ViewportPoint(1017f, 330f, -0.02f), "中文", 0.105f, Color.white, TextAnchor.MiddleCenter, FontStyle.Bold);

                CreateRoundedPanelPx("Mode Local Card", 558f, 455f, 384f, 239f, 24f, 3f, new Color(0.73f, 0.77f, 0.85f), new Color(0.07f, 0.08f, 0.13f));
                CreateRoundedPanelPx("Mode Rogue Card", 978f, 455f, 384f, 239f, 24f, 3f, new Color(0.73f, 0.77f, 0.85f), new Color(0.07f, 0.08f, 0.13f));
                CreateText("Mode Local Text", ViewportPoint(750f, 552f, -0.02f), "经典模式", 0.19f, Color.white, TextAnchor.MiddleCenter, FontStyle.Bold);
                CreateText("Mode Local Body", ViewportPoint(750f, 612f, -0.02f), "标准规则，纯粹策略。", 0.086f, new Color(0.67f, 0.69f, 0.77f), TextAnchor.MiddleCenter, FontStyle.Bold);
                CreateText("Mode Roguelike Text", ViewportPoint(1142f, 552f, -0.02f), "肉鸽模式", 0.18f, Color.white, TextAnchor.MiddleCenter, FontStyle.Bold);
                CreateRoundedPanelPx("Mode Rogue Badge", 1233f, 535f, 32f, 32f, 16f, 0f, new Color(0f, 0f, 0f, 0f), new Color(0.61f, 0.28f, 0.94f), -0.01f);
                CreateText("Mode Rogue Badge Text", ViewportPoint(1249f, 551f, -0.02f), "新", 0.065f, Color.white, TextAnchor.MiddleCenter, FontStyle.Bold);
                CreateText("Mode Roguelike Body", ViewportPoint(1142f, 612f, -0.02f), "随机起始增益与不同流派展开。", 0.08f, new Color(0.67f, 0.69f, 0.77f), TextAnchor.MiddleCenter, FontStyle.Bold);
            });

            var localModeRect = new Rect(729.6f, 518.4f, 460.8f, 75.6f);
            CreatePanelPx("Mode Local Semantic Target", localModeRect.x, localModeRect.y, localModeRect.width, localModeRect.height, -0.08f, new Color(0f, 0f, 0f, 0f), true, target =>
            {
                target.Kind = "Mode";
                target.EventType = "start_local_game";
            }, "mode.local");

            CreatePanelPx("Menu Divider", 800f, 792f, 320f, 1f, new Color(0.08f, 0.11f, 0.18f));
            CreateRoundedPanelPx("Mode Online", 672f, 817f, 263f, 118f, 24f, 3f, new Color(0.06f, 0.21f, 0.43f), new Color(0.015f, 0.045f, 0.1f));
            CreateRoundedPanelPx("Mode LAN", 960f, 817f, 288f, 118f, 24f, 3f, new Color(0.02f, 0.35f, 0.29f), new Color(0.01f, 0.09f, 0.08f));
            WithTextWeightCompensation(() =>
            {
                CreateGlobeIconPx(738f, 876f, new Color(0.38f, 0.65f, 0.98f));
                CreateText("Mode Online Text", ViewportPoint(829f, 864f, -0.02f), "在线对决", 0.14f, Color.white, TextAnchor.MiddleCenter, FontStyle.Bold);
                CreateText("Mode Online Body", ViewportPoint(829f, 896f, -0.02f), "远程多人联机", 0.073f, new Color(0.58f, 0.63f, 0.73f), TextAnchor.MiddleCenter, FontStyle.Bold);
                CreateRadioIconPx(1026f, 876f, new Color(0.2f, 0.83f, 0.6f));
                CreateText("Mode LAN Text", ViewportPoint(1149f, 864f, -0.02f), "局域网对决", 0.14f, Color.white, TextAnchor.MiddleCenter, FontStyle.Bold);
                CreateText("Mode LAN Body", ViewportPoint(1149f, 896f, -0.02f), "自动匹配附近玩家", 0.073f, new Color(0.58f, 0.63f, 0.73f), TextAnchor.MiddleCenter, FontStyle.Bold);
            });
            CreateText("Menu Footer", ViewportPoint(960f, 1059f, -0.02f), "选择一个模式开始", 0.024f, new Color(0.43f, 0.46f, 0.55f), TextAnchor.MiddleCenter);
        }

        private void RenderDraftPhase()
        {
            ClearRenderedState();
            renderRoot = new GameObject("GemDuel Rendered State");
            CreatePanel("Draft Background", new Vector3(0f, 0f, 0.45f), AutomationViewportWorldSize(), new Color(0f, 0.01f, 0.055f), false, null, "app.shell");
            CreateText("Draft Shell Label", ViewportPoint(1815f, 28f, 0f), "草稿自定义", 0.09f, new Color(0.9f, 0.73f, 0.2f), TextAnchor.MiddleCenter);
            CreateText("Draft Header", ViewportPoint(960f, 168f, 0f), "✧ 肉鸽选增益 ✧", 0.36f, Color.white, TextAnchor.MiddleCenter);
            CreateText("Draft Mode", ViewportPoint(960f, 225f, 0f), "三级规则改变选秀", 0.19f, new Color(0.62f, 0.62f, 0.72f), TextAnchor.MiddleCenter);
            CreatePanelPx("Draft Player Pill", 822f, 311f, 276f, 80f, new Color(0.0f, 0.18f, 0.17f));
            CreateText("Draft Player", ViewportPoint(960f, 353f, -0.02f), "P1：3 选 1", 0.19f, new Color(0.04f, 0.78f, 0.58f), TextAnchor.MiddleCenter);

            RenderDraftCard(
                348f,
                "⚡",
                "控制",
                "收藏狂人",
                "你可以从对手的保留区直接保留卡牌。",
                "声望值:",
                "22"
            );
            RenderDraftCard(
                769f,
                "🏆",
                "胜利",
                "皇家特使",
                "在你的第 5 个回合完整结算后，拿取 1 张剩余皇家卡。",
                "单色分数获胜:",
                "关闭"
            );
            RenderDraftCard(
                1189f,
                "◎",
                "经济",
                "极简主义",
                "你购买的前 2 张卡提供双倍奖励。宝石持有上限：8。",
                string.Empty,
                string.Empty
            );
        }

        private void RenderDraftCard(
            float x,
            string icon,
            string category,
            string title,
            string description,
            string footerLabel,
            string footerValue
        )
        {
            CreatePanelPx("Draft Card Border " + title, x, 440f, 384f, 480f, 0f, new Color(0.95f, 0.68f, 0.04f));
            CreatePanelPx("Draft Card Body " + title, x + 4f, 444f, 376f, 472f, -0.02f, new Color(0.18f, 0.055f, 0.06f));
            CreatePanelPx("Draft Icon " + title, x + 32f, 472f, 56f, 56f, -0.04f, new Color(0.32f, 0.21f, 0.22f));
            CreatePanelPx("Draft Level " + title, x + 279f, 472f, 68f, 40f, -0.04f, new Color(0.23f, 0.11f, 0.12f));
            CreateText("Draft Icon Text " + title, ViewportPoint(x + 60f, 502f, -0.02f), icon, 0.16f, new Color(1f, 0.71f, 0.08f), TextAnchor.MiddleCenter);
            CreateText("Draft Level Text " + title, ViewportPoint(x + 313f, 493f, -0.02f), "LVL 3", 0.1f, new Color(0.75f, 0.65f, 0.35f), TextAnchor.MiddleCenter);
            CreateText("Draft Category " + title, ViewportPoint(x + 331f, 528f, -0.02f), category, 0.07f, new Color(0.7f, 0.58f, 0.34f), TextAnchor.MiddleRight);
            CreateText("Draft Title " + title, ViewportPoint(x + 33f, 576f, -0.02f), title, 0.18f, new Color(1f, 0.93f, 0.54f), TextAnchor.MiddleLeft);
            CreateText("Draft Description " + title, ViewportPoint(x + 33f, 642f, -0.02f), description, 0.095f, new Color(0.86f, 0.74f, 0.33f), TextAnchor.MiddleLeft);
            CreatePanelPx("Draft Divider " + title, x + 32f, 814f, 318f, 2f, -0.04f, new Color(0.34f, 0.22f, 0.2f));
            if (!string.IsNullOrEmpty(footerLabel))
            {
                CreateText("Draft Footer Label " + title, ViewportPoint(x + 33f, 848f, -0.02f), footerLabel, 0.08f, new Color(0.74f, 0.62f, 0.3f), TextAnchor.MiddleLeft);
                CreateText("Draft Footer Value " + title, ViewportPoint(x + 350f, 878f, -0.02f), footerValue, 0.08f, new Color(1f, 0.84f, 0.22f), TextAnchor.MiddleRight);
            }
        }

        private void RenderPreviewOverlay()
        {
            var cardLabel = previewContext == null ? "Card Preview" : previewContext.InstanceId;
            CreatePanelPx("Preview Overlay", 0f, 0f, 1920f, 1080f, -0.28f, new Color(0.02f, 0.03f, 0.06f, 0.54f), false, null, "card.preview.overlay");
            CreateText("Preview Title", ViewportPoint(960f, 133f, -0.3f), "CARD PREVIEW", 0.18f, new Color(1f, 0.94f, 0.65f), TextAnchor.MiddleCenter);
            CreatePanelPx("Preview Close", 1848f, 24f, 48f, 48f, -0.3f, new Color(0.03f, 0.04f, 0.08f, 0.82f));
            CreateText("Preview Close Text", ViewportPoint(1872f, 48f, -0.32f), "×", 0.15f, Color.white, TextAnchor.MiddleCenter);
            var previewRect = new Rect(754f, 264f, 412f, 552f);
            if (!string.IsNullOrEmpty(cardLabel))
            {
                CreateCardArtwork("Preview Card", cardLabel, previewRect, -0.34f);
            }
            else
            {
                CreatePanelPx("Preview Card", previewRect.x, previewRect.y, previewRect.width, previewRect.height, -0.34f, new Color(0.86f, 0.83f, 0.74f));
            }
            if (CanConfirmPreviewAction("buy_card"))
            {
                CreateActionButton("Buy", "preview-buy", new Vector3(1.28f, 0.72f, -0.32f), new Vector2(1.2f, 0.42f), new Color(0.24f, 0.5f, 0.32f), "card.preview.primaryAction");
            }

            if (CanConfirmPreviewAction("reserve_card"))
            {
                CreateActionButton("Reserve", "preview-reserve", new Vector3(1.28f, 0.1f, -0.32f), new Vector2(1.2f, 0.42f), new Color(0.24f, 0.32f, 0.5f), "card.preview.primaryAction");
            }
        }

        private void RenderSettingsOverlay()
        {
            var rect = new Rect(1722f, 60f, 186f, 228.83f);
            CreatePanelPx("Settings Panel", rect.x, rect.y, rect.width, rect.height, -0.3f, new Color(0.1f, 0.12f, 0.16f), false, null, "settings.panel");
            CreateText("Settings Title", ViewportPoint(1815f, 92f, -0.32f), "设置", 0.16f, Color.white, TextAnchor.MiddleCenter);
            CreateText("Settings Body", ViewportPoint(1815f, 172f, -0.32f), "English   中文\nTheme: dark\nSound: on", 0.09f, new Color(0.86f, 0.89f, 0.95f), TextAnchor.MiddleCenter);
        }

        private void RenderErrorBanner()
        {
            CreatePanel("Error Banner", new Vector3(0f, 3.72f, -0.35f), new Vector2(5.6f, 0.48f), new Color(0.5f, 0.12f, 0.12f), false, null, "error.banner");
            CreateText("Error Banner Text", new Vector3(0f, 3.72f, -0.38f), errorBanner, 0.13f, Color.white, TextAnchor.MiddleCenter);
        }

        private void RenderTopbar()
        {
            var p1Crowns = GetCrowns("p1");
            var p2Crowns = GetCrowns("p2");
            var p1Privileges = GetIntAt("privileges", "p1");
            var p2Privileges = GetIntAt("privileges", "p2");
            var p1Turns = GetPlayerTurnCount("p1");
            var p2Turns = GetPlayerTurnCount("p2");

            CreateText("P1 Crown Counter", ViewportPoint(452f, 31f, 0f), p1Crowns + "/10", 0.26f, new Color(1f, 0.87f, 0.26f), TextAnchor.MiddleCenter);
            CreateText("P1 Privilege Counter", ViewportPoint(582f, 31f, 0f), p1Privileges + "/20", 0.26f, Color.white, TextAnchor.MiddleCenter);
            CreateText("P2 Crown Counter", ViewportPoint(1408f, 31f, 0f), p2Crowns + "/10", 0.26f, new Color(1f, 0.87f, 0.26f), TextAnchor.MiddleCenter);
            CreateText("P2 Privilege Counter", ViewportPoint(1538f, 31f, 0f), p2Privileges + "/20", 0.26f, Color.white, TextAnchor.MiddleCenter);
            CreateText("Turn P1", ViewportPoint(872f, 31f, 0f), "P1 " + p1Turns, 0.2f, new Color(0.2f, 0.95f, 0.72f), TextAnchor.MiddleCenter);
            CreateText("Turn Center", ViewportPoint(960f, 31f, 0f), "回合", 0.13f, Color.white, TextAnchor.MiddleCenter);
            CreateText("Turn P2", ViewportPoint(1048f, 31f, 0f), p2Turns + " P2", 0.2f, new Color(0.3f, 0.58f, 1f), TextAnchor.MiddleCenter);
        }

        private void RenderBoard()
        {
            CreateText("Board Label", ViewportPoint(1208.9f, 205f, 0f), "宝石板", 0.14f, new Color(0.95f, 0.97f, 1f), TextAnchor.MiddleCenter);
            var frameRect = BoardFrameRect();
            CreateImagePanelPx(
                "Board Frame",
                frameRect,
                0f,
                false,
                null,
                "board.root",
                "surfaces",
                "anime-themes",
                "royal-luxury",
                "dark",
                "gem-panel.png"
            );

            var board = (JArray)currentState.Snapshot["board"];
            for (var row = 0; row < 5; row += 1)
            {
                for (var column = 0; column < 5; column += 1)
                {
                    var gemId = board[row][column].Value<string>();
                    CreateGem(row, column, gemId);
                }
            }
        }

        private void RenderMarket()
        {
            WithRenderOpacity(0.8f, () =>
            {
                CreateText("Market Label", ViewportPoint(520f, 126f, 0f), "市场", 0.2f, new Color(0.95f, 0.97f, 1f), TextAnchor.MiddleCenter);
                var market = (JObject)currentState.Snapshot["market"];
                var decks = (JObject)currentState.Snapshot["decks"];
                for (var level = 3; level >= 1; level -= 1)
                {
                    var deckRect = MarketDeckRect(level);
                    CreateDeckBack(level, ((JArray)decks[level.ToString()]).Count, deckRect);
                    var row = (JArray)market[level.ToString()];
                    for (var index = 0; index < row.Count; index += 1)
                    {
                        var instanceId = row[index].Value<string>();
                        var cardRect = MarketCardRect(level, index);
                        CreateMarketCard(instanceId, level, index, cardRect);
                    }
                }
            });
        }

        private void RenderRoyals()
        {
            CreateText("Royals Label", ViewportPoint(1644f, 164f, 0f), "♕ 皇室区", 0.16f, new Color(1f, 0.88f, 0.45f), TextAnchor.MiddleCenter);
            var featuredRect = RoyalFeaturedRect();
            CreatePanelPx("Royals Frame", featuredRect.x, featuredRect.y, featuredRect.width, featuredRect.height, new Color(0.06f, 0.09f, 0.16f, 0.42f), false, null, "royal.featured");
            var royalDeck = (JArray)currentState.Snapshot["royalDeck"];
            if (royalDeck.Count == 0)
            {
                CreateText("Royals Empty", new Vector3(6.25f, 0.65f, 0f), "Royal deck claimed", 0.16f, new Color(0.86f, 0.8f, 0.62f), TextAnchor.MiddleCenter);
            }

            for (var index = 0; index < Math.Min(4, royalDeck.Count); index += 1)
            {
                CreateRoyalCard(royalDeck[index].Value<string>(), RoyalCardRect(index));
            }
        }

        private void RenderPlayerZone(string player, Vector3 center)
        {
            var isActive = currentState.Turn == player && currentState.Winner == null;
            var zoneRect = PlayerZoneRect(player);
            CreateImagePanelPx(
                player + " Zone Frame",
                zoneRect,
                0f,
                false,
                null,
                isActive ? "player.current.zone" : "player.opponent.zone",
                "surfaces",
                "anime-themes",
                "royal-luxury",
                "dark",
                player == "p1" ? "player-zone-p1.png" : "player-zone-p2.png"
            );
            if (isActive)
            {
                var resourcesRect = PlayerResourcesRect(player);
                var scoreRect = PlayerScoreRect(player);
                CreatePanelPx(player + " Resources Target", resourcesRect.x, resourcesRect.y, resourcesRect.width, resourcesRect.height, new Color(0f, 0f, 0f, 0f), false, null, "player.resources");
                CreatePanelPx(player + " Score Target", scoreRect.x, scoreRect.y, scoreRect.width, scoreRect.height, new Color(0f, 0f, 0f, 0f), false, null, "player.score");
            }
            RenderPlayerZoneContent(player, zoneRect, isActive);

            if (isActive)
            {
                var reserved = (JArray)((JObject)currentState.Snapshot["playerReserved"])[player];
                for (var index = 0; index < reserved.Count; index += 1)
                {
                    var reservedRect = PlayerReservedRect(player, index);
                    CreatePanelPx(
                        player + " Reserved Target " + index,
                        reservedRect.x,
                        reservedRect.y,
                        reservedRect.width,
                        reservedRect.height,
                        new Color(0f, 0f, 0f, 0f),
                        false,
                        null,
                        "player.reserved." + index
                    );
                }
            }
        }

        private void RenderPlayerZoneContent(string player, Rect zoneRect, bool isActive)
        {
            var inner = new Rect(zoneRect.x + 16f, zoneRect.y + 16f, zoneRect.width - 32f, zoneRect.height - 32f);
            const float gap = 16f;
            const float identityWidth = 128f;
            var flexibleWidth = Math.Max(1f, inner.width - identityWidth - gap * 2f);
            var reservedWidth = flexibleWidth * 0.22f;
            var resourcesWidth = flexibleWidth - reservedWidth;

            Rect reservedRect;
            Rect resourcesRect;
            Rect identityRect;
            if (player == "p1")
            {
                reservedRect = new Rect(inner.x, inner.y, reservedWidth, inner.height);
                resourcesRect = new Rect(reservedRect.xMax + gap, inner.y, resourcesWidth, inner.height);
                identityRect = new Rect(resourcesRect.xMax + gap, inner.y, identityWidth, inner.height);
            }
            else
            {
                identityRect = new Rect(inner.x, inner.y, identityWidth, inner.height);
                resourcesRect = new Rect(identityRect.xMax + gap, inner.y, resourcesWidth, inner.height);
                reservedRect = new Rect(resourcesRect.xMax + gap, inner.y, reservedWidth, inner.height);
            }

            RenderPlayerReservedColumn(player, reservedRect);
            RenderPlayerResourcesColumn(player, resourcesRect);
            RenderPlayerIdentityColumn(player, identityRect, isActive);
        }

        private void RenderPlayerIdentityColumn(string player, Rect rect, bool isActive)
        {
            var dividerX = player == "p1" ? rect.x : rect.xMax - 1f;
            CreatePanelPx(player + " Identity Divider", dividerX, rect.y + 6f, 1f, rect.height - 12f, -0.07f, new Color(0.32f, 0.39f, 0.5f, 0.55f));

            var accent = player == "p1" ? new Color(0.06f, 0.78f, 0.58f) : new Color(0.18f, 0.45f, 0.95f);
            var muted = new Color(0.63f, 0.69f, 0.78f);
            CreateRoundedPanelPx(player + " Avatar", rect.x + rect.width * 0.5f - 26f, rect.y + 38f, 52f, 52f, 26f, 1f, new Color(0.85f, 0.72f, 0.22f, 0.2f), isActive ? accent : new Color(0.18f, 0.22f, 0.3f), -0.08f);
            CreateText(player + " Avatar Icon", ViewportPoint(rect.x + rect.width * 0.5f, rect.y + 64f, -0.1f), player == "p1" ? "♜" : "⚔", 0.13f, Color.white, TextAnchor.MiddleCenter, FontStyle.Bold);
            CreateText(player + " Zone Label", ViewportPoint(rect.x + rect.width * 0.5f, rect.y + 122f, -0.1f), player.ToUpperInvariant(), 0.18f, isActive ? accent : muted, TextAnchor.MiddleCenter, FontStyle.Bold);
            CreateText(player + " Zone Score", ViewportPoint(rect.x + rect.width * 0.5f, rect.y + 151f, -0.1f), GetScore(player).ToString(), 0.075f, new Color(0.86f, 0.89f, 0.95f), TextAnchor.MiddleCenter);

            var privileges = GetIntAt("privileges", player);
            var extraPrivileges = GetIntAt("extraPrivileges", player);
            var totalPrivileges = Math.Max(0, privileges + extraPrivileges);
            if (totalPrivileges == 0)
            {
                CreateText(player + " Empty Privilege", ViewportPoint(rect.x + rect.width * 0.5f, rect.y + 188f, -0.1f), "◷", 0.11f, new Color(0.43f, 0.5f, 0.6f), TextAnchor.MiddleCenter);
                return;
            }

            for (var index = 0; index < Math.Min(totalPrivileges, 4); index += 1)
            {
                var column = index % 2;
                var row = index / 2;
                var x = rect.x + rect.width * 0.5f - 18f + column * 36f;
                var y = rect.y + 176f + row * 34f;
                CreateText(player + " Privilege " + index, ViewportPoint(x, y, -0.1f), "◉", 0.11f, index < privileges ? new Color(1f, 0.82f, 0.22f) : new Color(1f, 0.63f, 0.1f), TextAnchor.MiddleCenter, FontStyle.Bold);
            }
        }

        private void RenderPlayerResourcesColumn(string player, Rect rect)
        {
            var inventory = (JObject)((JObject)currentState.Snapshot["inventories"])[player];
            const float gemSize = 32f;
            const float gemGap = 14f;
            var totalGemWidth = PlayerZoneResourceOrder.Length * gemSize + (PlayerZoneResourceOrder.Length - 1) * gemGap;
            var gemX = rect.x + (rect.width - totalGemWidth) * 0.5f;
            var gemY = rect.y + 20f;
            for (var index = 0; index < PlayerZoneResourceOrder.Length; index += 1)
            {
                var gemId = PlayerZoneResourceOrder[index];
                var count = inventory.Value<int>(gemId);
                var gemRect = new Rect(gemX + index * (gemSize + gemGap), gemY, gemSize, gemSize);
                if (count == 0)
                {
                    WithRenderOpacity(0.5f, () => CreateGemArtwork(player + " Resource Gem " + gemId, gemId, gemRect, -0.09f));
                }
                else
                {
                    CreateGemArtwork(player + " Resource Gem " + gemId, gemId, gemRect, -0.09f);
                }

                CreateText(player + " Resource Count " + gemId, ViewportPoint(gemRect.center.x, gemRect.yMax + 14f, -0.1f), count.ToString(), 0.045f, count > 0 ? Color.white : new Color(0.55f, 0.6f, 0.68f), TextAnchor.MiddleCenter, FontStyle.Bold);
            }

            const int stackCount = 6;
            const float stackGap = 6f;
            var stackScale = Mathf.Clamp((rect.width - stackGap * (stackCount - 1)) / (120f * stackCount), 0.46f, 0.86f);
            var stackWidth = 120f * stackScale;
            var stackHeight = 160f * stackScale;
            var stackX = rect.x + (rect.width - (stackWidth * stackCount + stackGap * (stackCount - 1))) * 0.5f;
            var stackY = rect.y + 82f;
            for (var index = 0; index < PlayerZoneTableauOrder.Length; index += 1)
            {
                var color = PlayerZoneTableauOrder[index];
                var stackRect = new Rect(stackX + index * (stackWidth + stackGap), stackY, stackWidth, stackHeight);
                var cardIds = GetPlayerTableauCardIds(player, color);
                if (cardIds.Count == 0)
                {
                    RenderEmptyTableauSlot(player, color, stackRect);
                }
                else
                {
                    RenderTableauStack(player, color, stackRect, cardIds, stackScale);
                }
            }
        }

        private void RenderPlayerReservedColumn(string player, Rect rect)
        {
            var reserved = (JArray)((JObject)currentState.Snapshot["playerReserved"])[player];
            if (reserved.Count == 0)
            {
                return;
            }

            var slotCount = Math.Min(reserved.Count, 3);
            var scale = Mathf.Clamp(rect.width / (150f + Math.Max(slotCount - 1, 0) * 34f), 0.42f, 0.88f);
            var cardWidth = 150f * scale;
            var cardHeight = 200f * scale;
            var offsetX = 34f * scale;
            var offsetY = 44f * scale;
            var totalWidth = cardWidth + Math.Max(slotCount - 1, 0) * offsetX;
            var totalHeight = cardHeight + Math.Max(slotCount - 1, 0) * offsetY;
            var startX = rect.x + (rect.width - totalWidth) * 0.5f;
            var startY = rect.y + (rect.height - totalHeight) * 0.5f;

            for (var index = 0; index < slotCount; index += 1)
            {
                var item = reserved[index];
                var instanceId = item.Type == JTokenType.String ? item.Value<string>() : ((JObject)item).Value<string>("instanceId");
                var cardRect = new Rect(startX + index * offsetX, startY + index * offsetY, cardWidth, cardHeight);
                CreateCardArtwork(player + " Reserved Card " + index, instanceId, cardRect, -0.09f);
            }
        }

        private void RenderEmptyTableauSlot(string player, string color, Rect rect)
        {
            CreateRoundedPanelPx(player + " Empty Tableau " + color, rect.x, rect.y, rect.width, rect.height, 4f, 1f, new Color(0.75f, 0.64f, 0.35f, 0.28f), new Color(0.02f, 0.04f, 0.07f, 0.24f), -0.08f);
            if (color != "pure-royal")
            {
                var dotSize = Math.Max(8f, rect.width * 0.16f);
                CreateRoundedPanelPx(player + " Empty Tableau Dot " + color, rect.center.x - dotSize * 0.5f, rect.center.y - dotSize * 0.5f, dotSize, dotSize, dotSize * 0.5f, 0f, new Color(0f, 0f, 0f, 0f), ColorForGem(color), -0.1f);
            }
        }

        private void RenderTableauStack(string player, string color, Rect rect, IReadOnlyList<string> cardIds, float stackScale)
        {
            for (var index = 0; index < cardIds.Count; index += 1)
            {
                var isTop = index == cardIds.Count - 1;
                var cardRect = new Rect(
                    rect.x + index * (2f * stackScale),
                    rect.y - index * (3f * stackScale),
                    rect.width,
                    rect.height
                );
                if (isTop)
                {
                    CreateCardArtwork(player + " Tableau " + color + " " + index, cardIds[index], cardRect, -0.1f);
                }
                else
                {
                    CreateRoundedPanelPx(player + " Tableau Back " + color + " " + index, cardRect.x, cardRect.y, cardRect.width, cardRect.height, 4f, 1f, new Color(0.65f, 0.58f, 0.4f, 0.32f), new Color(0.04f, 0.06f, 0.1f, 0.82f), -0.09f);
                }
            }

            var stats = GetPlayerTableauStats(player, color);
            if (stats.points > 0)
            {
                CreateRoundedPanelPx(player + " Tableau Points " + color, rect.center.x - 15f, rect.center.y - 18f, 30f, 36f, 5f, 1f, new Color(1f, 0.76f, 0.18f), new Color(0.12f, 0.08f, 0.04f, 0.92f), -0.12f);
                CreateText(player + " Tableau Points Text " + color, ViewportPoint(rect.center.x, rect.center.y, -0.13f), stats.points.ToString(), 0.06f, new Color(1f, 0.9f, 0.32f), TextAnchor.MiddleCenter, FontStyle.Bold);
            }

            if (stats.bonus > 0 && color != "pure-royal")
            {
                var badgeSize = 24f;
                CreateRoundedPanelPx(player + " Tableau Bonus " + color, rect.xMax - badgeSize + 4f, rect.yMax - badgeSize + 4f, badgeSize, badgeSize, badgeSize * 0.5f, 1f, new Color(0.08f, 0.1f, 0.14f), ColorForGem(color), -0.12f);
                CreateText(player + " Tableau Bonus Text " + color, ViewportPoint(rect.xMax + 4f - badgeSize * 0.5f, rect.yMax + 4f - badgeSize * 0.5f, -0.13f), stats.bonus.ToString(), 0.045f, TextColorForGem(color), TextAnchor.MiddleCenter, FontStyle.Bold);
            }
        }

        private void RenderGuidedActionSurface()
        {
            var nextEvent = GetNextEvent();
            if (nextEvent == null)
            {
                return;
            }

            var eventType = nextEvent.Value<string>("type") ?? string.Empty;
            if (eventType == "replenish")
            {
                CreateActionButton("Replenish", "replenish", new Vector3(0f, -1.72f, 0f), new Vector2(1.3f, 0.35f), new Color(0.18f, 0.55f, 0.86f), "turn.end");
            }
            else if (eventType == "select_buff")
            {
                RenderBuffChoice(nextEvent);
            }
            else if (eventType == "steal_gem" || eventType == "discard_gem")
            {
                CreateText("State Action Label", new Vector3(0f, -1.52f, 0f), eventType == "steal_gem" ? "Steal Gem" : "Discard Gem", 0.13f, Color.white, TextAnchor.MiddleCenter);
                CreateInventoryGemButton(nextEvent.Value<string>("gemId"), eventType, new Vector3(0f, -1.86f, 0f), 0.38f);
            }
        }

        private void RenderBuffChoice(JObject nextEvent)
        {
            var buffId = nextEvent.Value<string>("buffId");
            var player = nextEvent.Value<string>("actor");
            CreateText("Buff Prompt", new Vector3(0f, -1.52f, 0f), player.ToUpperInvariant() + " buff draft", 0.13f, Color.white, TextAnchor.MiddleCenter);
            CreatePanel("Buff Card " + buffId, new Vector3(0f, -1.9f, 0f), new Vector2(1.7f, 0.55f), new Color(0.18f, 0.26f, 0.48f), true, target =>
            {
                target.Kind = "Buff";
                target.BuffId = buffId;
            });
            CreateText("Buff Text " + buffId, new Vector3(0f, -1.9f, -0.02f), LabelForBuff(buffId), 0.11f, Color.white, TextAnchor.MiddleCenter);
        }

        private void CreateGem(int row, int column, string gemId)
        {
            var rect = BoardCellRect(row, column);
            var pos = ViewportRectCenter(rect, 0f);
            var isExpected = IsNextCoord(row, column);
            var isSelected = selectedGemCoords.Contains(new Vector2Int(row, column));
            if (isExpected || isSelected)
            {
                CreatePanelPx(
                    "Gem Highlight " + row + "," + column,
                    rect.x - 2f,
                    rect.y - 2f,
                    rect.width + 4f,
                    rect.height + 4f,
                    isSelected ? new Color(0.35f, 0.9f, 0.55f) : new Color(1f, 0.82f, 0.22f)
                );
            }

            if (gemId == "empty")
            {
                CreatePanelPx("Gem " + row + "," + column + " empty", rect.x, rect.y, rect.width, rect.height, new Color(0f, 0f, 0f, 0f), false, null, "board.cell." + row + "." + column);
                return;
            }

            CreateGemArtwork("Gem " + row + "," + column + " " + gemId, gemId, rect, -0.05f, true, target =>
            {
                target.Kind = "Gem";
                target.Row = row;
                target.Column = column;
                target.GemId = gemId;
            }, "board.cell." + row + "." + column);
        }

        private Rect MarketDeckRect(int level)
        {
            return new Rect(
                43.1f + (level - 1) * 79.8f,
                579.13f - (level - 1) * 214.835f,
                153.46f,
                204.61f
            );
        }

        private Rect MarketCardRect(int level, int index)
        {
            var deck = MarketDeckRect(level);
            return new Rect(deck.x + 159.59f + index * 159.595f, deck.y, 153.46f, 204.61f);
        }

        private Rect BoardFrameRect()
        {
            return new Rect(1002.47f, BoardOffsetY(), 412.87f, 412.87f);
        }

        private Rect BoardCellRect(int row, int column)
        {
            return new Rect(1047.36f + column * 66.905f, BoardOffsetY() + 44.8f + row * 66.705f, 54.81f, 54.81f);
        }

        private float BoardOffsetY()
        {
            if (currentState == null)
            {
                return 227.17f;
            }

            var reserved = (JObject)currentState.Snapshot["playerReserved"];
            var activeReserved = reserved?[currentState.Turn] as JArray;
            return activeReserved != null && activeReserved.Count > 0 ? 224.43f : 227.17f;
        }

        private static Rect RoyalFeaturedRect()
        {
            return new Rect(1488.45f, 206.4f, 323.28f, 425.58f);
        }

        private static Rect PlayerZoneRect(string player)
        {
            return new Rect(player == "p1" ? 1.5f : 961.5f, 822f, 957f, 256.5f);
        }

        private static Rect PlayerScoreRect(string player)
        {
            return new Rect(player == "p1" ? 886f : 969.5f, 830f, 64.5f, 240.5f);
        }

        private static Rect PlayerResourcesRect(string player)
        {
            return new Rect(player == "p1" ? 211.88f : 1042f, 830f, 666.12f, 240.5f);
        }

        private static Rect PlayerReservedRect(string player, int index)
        {
            var anchorX = player == "p1" ? 807.05f : 1767.05f;
            return new Rect(anchorX - index * 108f, 884.25f, 99f, 132f);
        }

        private static Rect RoyalCardRect(int index)
        {
            return new Rect(1490f + (index % 2) * 169f, 207f + (index / 2) * 221f, 153f, 204f);
        }

        private bool CanConfirmPreviewAction(string eventType)
        {
            if (previewContext == null || previewContext.Source != "market")
            {
                return false;
            }

            var next = GetNextEvent();
            return next != null &&
                next.Value<string>("type") == eventType &&
                MatchesMarketRef(next, previewContext.Level, previewContext.Index);
        }

        private void CreateDeckBack(int level, int count, Rect rect)
        {
            var pos = ViewportRectCenter(rect, 0f);
            CreateImagePanelPx(
                "Deck L" + level,
                rect,
                0f,
                false,
                null,
                "market.level." + level,
                "surfaces",
                "anime-themes",
                "royal-luxury",
                "dark",
                "market-card-back-l" + level + ".png"
            );
            CreateText("Deck Label L" + level, pos + new Vector3(0f, -0.46f, -0.02f), count.ToString(), 0.08f, Color.white, TextAnchor.MiddleCenter);
        }

        private void CreateMarketCard(string instanceId, int level, int index, Rect rect)
        {
            var isTarget = IsNextMarketCard(instanceId, level, index);
            if (isTarget)
            {
                CreatePanelPx("Market Highlight " + instanceId, rect.x - 2f, rect.y - 2f, rect.width + 4f, rect.height + 4f, new Color(1f, 0.82f, 0.22f));
            }

            CreateCardArtwork("Market Card " + instanceId, instanceId, rect, -0.05f, true, target =>
            {
                target.Kind = "MarketCard";
                target.Level = level;
                target.Index = index;
                target.InstanceId = instanceId;
            }, "market.card." + level + "." + index);
        }

        private void CreateRoyalCard(string royalId, Rect rect)
        {
            var isTarget = GetNextEvent()?.Value<string>("type") == "select_royal" && GetNextEvent()?.Value<string>("royalId") == royalId;
            if (isTarget)
            {
                CreatePanelPx("Royal Highlight " + royalId, rect.x - 2f, rect.y - 2f, rect.width + 4f, rect.height + 4f, new Color(1f, 0.82f, 0.22f));
            }

            CreateCardArtwork("Royal Card " + royalId, royalId, rect, -0.05f, true, target =>
            {
                target.Kind = "Royal";
                target.RoyalId = royalId;
            });
        }

        private void CreateInventoryGem(string player, string gemId, int count, Vector3 pos)
        {
            var next = GetNextEvent();
            var eventType = next?.Value<string>("type") ?? string.Empty;
            var isStateActionTarget =
                (eventType == "discard_gem" && next.Value<string>("actor") == player && next.Value<string>("gemId") == gemId) ||
                (eventType == "steal_gem" && next.Value<string>("actor") != player && next.Value<string>("gemId") == gemId);

            if (isStateActionTarget)
            {
                CreatePanel("Inventory Highlight " + player + gemId, pos + new Vector3(0f, 0f, 0.08f), new Vector2(0.32f, 0.32f), new Color(1f, 0.82f, 0.22f));
            }

            var inventoryRect = new Rect(
                0f,
                0f,
                34f,
                34f
            );
            var center = WorldToReferenceViewport(pos);
            inventoryRect.x = center.x - inventoryRect.width * 0.5f;
            inventoryRect.y = center.y - inventoryRect.height * 0.5f;
            CreateGemArtwork("Inventory Gem " + player + gemId, gemId, inventoryRect, -0.05f, isStateActionTarget, target =>
            {
                target.Kind = "InventoryGem";
                target.EventType = eventType;
                target.GemId = gemId;
            });
            CreateText("Inventory Gem Text " + player + gemId, pos + new Vector3(0f, -0.27f, -0.02f), count.ToString(), 0.08f, Color.white, TextAnchor.MiddleCenter);
        }

        private void CreateInventoryGemButton(string gemId, string eventType, Vector3 pos, float size)
        {
            CreatePanel("Action Gem " + gemId, pos, new Vector2(size, size), ColorForGem(gemId), true, target =>
            {
                target.Kind = "InventoryGem";
                target.EventType = eventType;
                target.GemId = gemId;
            });
            CreateText("Action Gem Text " + gemId, pos + new Vector3(0f, -0.35f, -0.02f), ShortGem(gemId), 0.08f, Color.white, TextAnchor.MiddleCenter);
        }

        private void CreateActionButton(string text, string eventType, Vector3 pos, Vector2 size, Color color, string semanticKey = null)
        {
            CreatePanel("Action " + eventType, pos, size, color, true, target =>
            {
                target.Kind = "ActionButton";
                target.EventType = eventType;
            }, semanticKey);
            CreateText("Action Text " + eventType, pos + new Vector3(0f, 0f, -0.02f), text, 0.12f, Color.white, TextAnchor.MiddleCenter);
        }

        private Vector3 ViewportPoint(float x, float y, float z = 0f)
        {
            var size = AutomationViewportWorldSize();
            return new Vector3((x / 1920f - 0.5f) * size.x, (0.5f - y / 1080f) * size.y, z);
        }

        private Vector3 ViewportRectCenter(Rect rect, float z = 0f)
        {
            return ViewportPoint(rect.x + rect.width * 0.5f, rect.y + rect.height * 0.5f, z);
        }

        private Vector2 ViewportSize(float width, float height)
        {
            var size = AutomationViewportWorldSize();
            return new Vector2(width / 1920f * size.x, height / 1080f * size.y);
        }

        private Vector2 WorldToReferenceViewport(Vector3 worldPosition)
        {
            var size = AutomationViewportWorldSize();
            return new Vector2(
                (worldPosition.x / size.x + 0.5f) * 1920f,
                (0.5f - worldPosition.y / size.y) * 1080f
            );
        }

        private GameObject CreateImagePanelPx(string name, Rect rect, float z, params string[] assetSegments)
        {
            return CreateImagePanelPx(name, rect, z, false, null, null, assetSegments);
        }

        private GameObject CreateImagePanelPx(
            string name,
            Rect rect,
            float z,
            bool clickable,
            Action<GemDuelViewTarget> configureTarget,
            string semanticKey,
            params string[] assetSegments
        )
        {
            var texture = LoadPublicTexture(assetSegments);
            if (texture == null)
            {
                return CreatePanelPx(
                    name,
                    rect.x,
                    rect.y,
                    rect.width,
                    rect.height,
                    new Color(0f, 0f, 0f, 0f),
                    clickable,
                    configureTarget,
                    semanticKey
                );
            }

            return CreateImagePanel(
                name,
                ViewportRectCenter(rect, z),
                ViewportSize(rect.width, rect.height),
                texture,
                clickable,
                configureTarget,
                semanticKey
            );
        }

        private GameObject CreateCardArtwork(
            string name,
            string instanceIdOrCardId,
            Rect rect,
            float z,
            bool clickable = false,
            Action<GemDuelViewTarget> configureTarget = null,
            string semanticKey = null
        )
        {
            var cardId = ResolveCardId(instanceIdOrCardId);
            if (string.IsNullOrEmpty(cardId))
            {
                return CreatePanelPx(
                    name,
                    rect.x,
                    rect.y,
                    rect.width,
                    rect.height,
                    new Color(0.16f, 0.18f, 0.22f),
                    clickable,
                    configureTarget,
                    semanticKey
                );
            }

            return CreateImagePanelPx(
                name,
                rect,
                z,
                clickable,
                configureTarget,
                semanticKey,
                "cards",
                cardId + ".png"
            );
        }

        private GameObject CreateGemArtwork(
            string name,
            string gemId,
            Rect rect,
            float z,
            bool clickable = false,
            Action<GemDuelViewTarget> configureTarget = null,
            string semanticKey = null
        )
        {
            var fileName = GemArtworkFileName(gemId);
            if (string.IsNullOrEmpty(fileName))
            {
                return CreatePanelPx(
                    name,
                    rect.x,
                    rect.y,
                    rect.width,
                    rect.height,
                    ColorForGem(gemId),
                    clickable,
                    configureTarget,
                    semanticKey
                );
            }

            return CreateImagePanelPx(
                name,
                rect,
                z,
                clickable,
                configureTarget,
                semanticKey,
                "gems",
                fileName
            );
        }

        private GameObject CreateImagePanel(
            string name,
            Vector3 position,
            Vector2 size,
            Texture2D texture,
            bool clickable = false,
            Action<GemDuelViewTarget> configureTarget = null,
            string semanticKey = null
        )
        {
            var panel = GameObject.CreatePrimitive(PrimitiveType.Quad);
            panel.name = name;
            panel.transform.SetParent(renderRoot == null ? transform : renderRoot.transform, false);
            panel.transform.position = position;
            panel.transform.localScale = new Vector3(size.x, size.y, 1f);
            var renderer = panel.GetComponent<MeshRenderer>();
            var material = new Material(Shader.Find("Sprites/Default"));
            material.mainTexture = texture;
            material.color = ApplyRenderOpacity(Color.white);
            renderer.sharedMaterial = material;

            if (clickable || !string.IsNullOrEmpty(semanticKey))
            {
                var target = panel.AddComponent<GemDuelViewTarget>();
                target.Size = size;
                target.SemanticKey = semanticKey ?? string.Empty;
                configureTarget?.Invoke(target);
            }

            if (!clickable)
            {
                var collider = panel.GetComponent("MeshCollider");
                if (collider != null)
                {
                    DestroyUnityObject(collider);
                }
            }

            return panel;
        }

        private GameObject CreatePanelPx(
            string name,
            float x,
            float y,
            float width,
            float height,
            Color color,
            bool clickable = false,
            Action<GemDuelViewTarget> configureTarget = null,
            string semanticKey = null
        )
        {
            return CreatePanel(
                name,
                ViewportRectCenter(new Rect(x, y, width, height), 0f),
                ViewportSize(width, height),
                color,
                clickable,
                configureTarget,
                semanticKey
            );
        }

        private GameObject CreatePanelPx(
            string name,
            float x,
            float y,
            float width,
            float height,
            float z,
            Color color,
            bool clickable = false,
            Action<GemDuelViewTarget> configureTarget = null,
            string semanticKey = null
        )
        {
            return CreatePanel(
                name,
                ViewportRectCenter(new Rect(x, y, width, height), z),
                ViewportSize(width, height),
                color,
                clickable,
                configureTarget,
                semanticKey
            );
        }

        private void CreateOutlinedPanelPx(
            string name,
            float x,
            float y,
            float width,
            float height,
            float borderPx,
            Color borderColor,
            Color fillColor
        )
        {
            CreatePanelPx(name + " Border", x, y, width, height, 0f, borderColor);
            CreatePanelPx(
                name + " Fill",
                x + borderPx,
                y + borderPx,
                width - borderPx * 2f,
                height - borderPx * 2f,
                -0.01f,
                fillColor
            );
        }

        private GameObject CreateRoundedPanelPx(
            string name,
            float x,
            float y,
            float width,
            float height,
            float radiusPx,
            float borderPx,
            Color borderColor,
            Color fillColor,
            float z = 0f
        )
        {
            var texture = GetRoundedRectTexture(width, height, radiusPx, borderPx, borderColor, fillColor);
            return CreateImagePanel(
                name,
                ViewportRectCenter(new Rect(x, y, width, height), z),
                ViewportSize(width, height),
                texture
            );
        }

        private Texture2D GetRoundedRectTexture(
            float width,
            float height,
            float radiusPx,
            float borderPx,
            Color borderColor,
            Color fillColor
        )
        {
            var pixelWidth = Math.Max(1, Mathf.RoundToInt(width));
            var pixelHeight = Math.Max(1, Mathf.RoundToInt(height));
            var radius = Mathf.Max(0f, radiusPx);
            var border = Mathf.Max(0f, borderPx);
            var key = string.Join(
                "|",
                pixelWidth.ToString(),
                pixelHeight.ToString(),
                radius.ToString("0.##"),
                border.ToString("0.##"),
                ColorUtility.ToHtmlStringRGBA(borderColor),
                ColorUtility.ToHtmlStringRGBA(fillColor)
            );
            if (roundedTextureCache.TryGetValue(key, out var cached))
            {
                return cached;
            }

            var texture = new Texture2D(pixelWidth, pixelHeight, TextureFormat.RGBA32, false);
            texture.wrapMode = TextureWrapMode.Clamp;
            texture.filterMode = FilterMode.Bilinear;
            var pixels = new Color32[pixelWidth * pixelHeight];
            var transparent = new Color32(0, 0, 0, 0);
            var fill32 = (Color32)fillColor;
            var border32 = (Color32)borderColor;

            for (var y = 0; y < pixelHeight; y += 1)
            {
                for (var x = 0; x < pixelWidth; x += 1)
                {
                    var alphaOuter = RoundedRectAlpha(x + 0.5f, y + 0.5f, pixelWidth, pixelHeight, radius);
                    if (alphaOuter <= 0f)
                    {
                        pixels[y * pixelWidth + x] = transparent;
                        continue;
                    }

                    var alphaInner = border <= 0f
                        ? alphaOuter
                        : RoundedRectAlpha(
                            x + 0.5f - border,
                            y + 0.5f - border,
                            pixelWidth - border * 2f,
                            pixelHeight - border * 2f,
                            Mathf.Max(0f, radius - border)
                        );
                    var color = alphaInner > 0.5f ? fill32 : border32;
                    color.a = (byte)Mathf.RoundToInt(color.a * alphaOuter);
                    pixels[y * pixelWidth + x] = color;
                }
            }

            texture.SetPixels32(pixels);
            texture.Apply(false, true);
            roundedTextureCache[key] = texture;
            return texture;
        }

        private static float RoundedRectAlpha(float x, float y, float width, float height, float radius)
        {
            if (width <= 0f || height <= 0f)
            {
                return 0f;
            }

            radius = Mathf.Min(radius, width * 0.5f, height * 0.5f);
            var dx = Mathf.Max(radius - x, 0f, x - (width - radius));
            var dy = Mathf.Max(radius - y, 0f, y - (height - radius));
            var distance = Mathf.Sqrt(dx * dx + dy * dy) - radius;
            return Mathf.Clamp01(0.5f - distance);
        }

        private GameObject CreatePanel(
            string name,
            Vector3 position,
            Vector2 size,
            Color color,
            bool clickable = false,
            Action<GemDuelViewTarget> configureTarget = null,
            string semanticKey = null
        )
        {
            var panel = GameObject.CreatePrimitive(PrimitiveType.Quad);
            panel.name = name;
            panel.transform.SetParent(renderRoot == null ? transform : renderRoot.transform, false);
            panel.transform.position = position;
            panel.transform.localScale = new Vector3(size.x, size.y, 1f);
            var renderer = panel.GetComponent<MeshRenderer>();
            var material = new Material(Shader.Find("Sprites/Default"));
            material.color = ApplyRenderOpacity(color);
            renderer.sharedMaterial = material;

            if (clickable || !string.IsNullOrEmpty(semanticKey))
            {
                var target = panel.AddComponent<GemDuelViewTarget>();
                target.Size = size;
                target.SemanticKey = semanticKey ?? string.Empty;
                configureTarget?.Invoke(target);
            }

            if (!clickable)
            {
                var collider = panel.GetComponent("MeshCollider");
                if (collider != null)
                {
                    DestroyUnityObject(collider);
                }
            }

            return panel;
        }

        private TextMesh CreateText(string name, Vector3 position, string text, float size, Color color, TextAnchor anchor, FontStyle style = FontStyle.Normal)
        {
            var mesh = CreateTextMesh(name, position, text, size, color, anchor, style);
            if (compensateTextWeight && style == FontStyle.Bold)
            {
                var offsets = size >= 0.12f
                    ? new[]
                    {
                        TextPixelOffset(0.55f, 0f),
                        TextPixelOffset(-0.35f, 0f),
                        TextPixelOffset(0f, 0.4f),
                    }
                    : new[] { TextPixelOffset(0.45f, 0f) };
                for (var index = 0; index < offsets.Length; index += 1)
                {
                    CreateTextMesh(
                        name + " Weight " + index,
                        position + offsets[index] + new Vector3(0f, 0f, -0.001f * (index + 1)),
                        text,
                        size,
                        color,
                        anchor,
                        style
                    );
                }
            }

            return mesh;
        }

        private TextMesh CreateTextMesh(string name, Vector3 position, string text, float size, Color color, TextAnchor anchor, FontStyle style)
        {
            var label = new GameObject(name);
            label.transform.SetParent(renderRoot == null ? transform : renderRoot.transform, false);
            label.transform.position = position;
            var mesh = label.AddComponent<TextMesh>();
            mesh.text = text;
            mesh.font = ResolveUiFont();
            mesh.fontSize = 128;
            mesh.characterSize = size * (14f / mesh.fontSize);
            mesh.fontStyle = style;
            mesh.anchor = anchor;
            mesh.alignment = TextAlignment.Center;
            mesh.color = ApplyRenderOpacity(color);
            var meshRenderer = label.GetComponent<MeshRenderer>();
            if (meshRenderer != null && mesh.font != null)
            {
                meshRenderer.sharedMaterial = mesh.font.material;
            }
            return mesh;
        }

        private void CreateGlobeIconPx(float centerX, float centerY, Color color)
        {
            CreateRoundedPanelPx("Mode Online Icon Outer", centerX - 12f, centerY - 12f, 24f, 24f, 12f, 2f, color, new Color(0f, 0f, 0f, 0f), -0.02f);
            CreateRoundedPanelPx("Mode Online Icon Meridian", centerX - 5f, centerY - 12f, 10f, 24f, 5f, 1.5f, color, new Color(0f, 0f, 0f, 0f), -0.021f);
            CreatePanelPx("Mode Online Icon Equator", centerX - 11f, centerY - 1f, 22f, 2f, -0.022f, color);
        }

        private void CreateRadioIconPx(float centerX, float centerY, Color color)
        {
            CreateRoundedPanelPx("Mode LAN Icon Outer", centerX - 12f, centerY - 12f, 24f, 24f, 12f, 2f, color, new Color(0f, 0f, 0f, 0f), -0.02f);
            CreateRoundedPanelPx("Mode LAN Icon Middle", centerX - 7f, centerY - 7f, 14f, 14f, 7f, 1.5f, color, new Color(0f, 0f, 0f, 0f), -0.021f);
            CreateRoundedPanelPx("Mode LAN Icon Dot", centerX - 2.5f, centerY - 2.5f, 5f, 5f, 2.5f, 0f, new Color(0f, 0f, 0f, 0f), color, -0.022f);
        }

        private void CreateFlaskIconPx(float centerX, float centerY, Color color)
        {
            CreatePanelPx("Visual Lab Icon Neck", centerX - 2f, centerY - 8f, 4f, 8f, -0.02f, color);
            CreatePanelPx("Visual Lab Icon Lip", centerX - 5f, centerY - 9f, 10f, 2f, -0.021f, color);
            CreatePanelPx("Visual Lab Icon Base", centerX - 7f, centerY + 6f, 14f, 2f, -0.021f, color);
            CreatePanelPx("Visual Lab Icon Left", centerX - 7f, centerY + 1f, 2f, 7f, -0.021f, color);
            CreatePanelPx("Visual Lab Icon Right", centerX + 5f, centerY + 1f, 2f, 7f, -0.021f, color);
            CreatePanelPx("Visual Lab Icon Liquid", centerX - 5f, centerY + 3f, 10f, 2f, -0.022f, color);
        }

        private Vector3 TextPixelOffset(float x, float y)
        {
            var size = AutomationViewportWorldSize();
            return new Vector3((x / 1920f) * size.x, (-y / 1080f) * size.y, 0f);
        }

        private void WithRenderOpacity(float opacity, Action render)
        {
            var previousOpacity = renderOpacity;
            renderOpacity *= Mathf.Clamp01(opacity);
            try
            {
                render();
            }
            finally
            {
                renderOpacity = previousOpacity;
            }
        }

        private Color ApplyRenderOpacity(Color color)
        {
            color.a *= renderOpacity;
            return color;
        }

        private void WithTextWeightCompensation(Action render)
        {
            var previous = compensateTextWeight;
            compensateTextWeight = true;
            try
            {
                render();
            }
            finally
            {
                compensateTextWeight = previous;
            }
        }

        private Font ResolveUiFont()
        {
            if (uiFont != null)
            {
                return uiFont;
            }

            uiFont = Font.CreateDynamicFontFromOSFont(
                new[]
                {
                    "Noto Sans CJK SC",
                    "Noto Sans SC",
                    "Source Han Sans SC",
                    "Microsoft YaHei",
                    "Microsoft YaHei UI",
                    "Segoe UI",
                    "Arial",
                },
                128
            );
            return uiFont;
        }

        private Texture2D LoadPublicTexture(params string[] assetSegments)
        {
            var resourcePath = PublicResourcePath(assetSegments);
            if (textureCache.TryGetValue(resourcePath, out var cachedTexture))
            {
                return cachedTexture;
            }

            var texture = Resources.Load<Texture2D>(resourcePath);
            if (texture == null)
            {
                return null;
            }

            texture.wrapMode = TextureWrapMode.Clamp;
            texture.filterMode = FilterMode.Bilinear;
            textureCache[resourcePath] = texture;
            return texture;
        }

        private static string PublicResourcePath(params string[] assetSegments)
        {
            var joined = string.Join("/", assetSegments).Replace("\\", "/");
            if (joined.EndsWith(".png", StringComparison.OrdinalIgnoreCase))
            {
                joined = joined.Substring(0, joined.Length - ".png".Length);
            }

            return "GemDuelPublicAssets/" + joined;
        }

        private void BuildStatusText()
        {
            var status = GameObject.Find("Status Topbar") ?? new GameObject("Status Topbar");
            status.transform.position = new Vector3(100f, 100f, 0f);
            statusText = status.GetComponent<TextMesh>();
            if (statusText == null)
            {
                statusText = status.AddComponent<TextMesh>();
            }
            statusText.characterSize = 0.12f;
            statusText.anchor = TextAnchor.MiddleLeft;
            statusText.color = new Color(0.78f, 0.84f, 0.92f, 0f);
            statusText.text = "Loading GemDuel sidecar...";
        }

        private void SetStatus(string message)
        {
            if (statusText != null)
            {
                statusText.text = message;
            }
        }

        private void ClearRenderedState()
        {
            if (renderRoot != null)
            {
                DestroyUnityObject(renderRoot);
            }

            foreach (var obj in FindObjectsByType<GameObject>())
            {
                if (obj == null)
                {
                    continue;
                }

                if (obj.name == "GemDuel Rendered State")
                {
                    DestroyUnityObject(obj);
                }
            }
        }

        private static void BuildCamera()
        {
            var existing = Camera.main;
            if (existing != null)
            {
                existing.orthographic = true;
                existing.orthographicSize = 5f;
                existing.transform.position = new Vector3(0f, 0f, -10f);
                existing.backgroundColor = new Color(0.05f, 0.06f, 0.08f);
                return;
            }

            var cameraObject = new GameObject("Main Camera");
            var camera = cameraObject.AddComponent<Camera>();
            camera.tag = "MainCamera";
            camera.orthographic = true;
            camera.orthographicSize = 5f;
            camera.backgroundColor = new Color(0.05f, 0.06f, 0.08f);
            cameraObject.transform.position = new Vector3(0f, 0f, -10f);
        }

        private JObject GetNextEvent()
        {
            if (activeReplay == null || nextFixtureEventIndex >= activeReplay.Events.Count)
            {
                return null;
            }

            return activeReplay.Events[nextFixtureEventIndex];
        }

        private bool IsNextCoord(int row, int column)
        {
            var next = GetNextEvent();
            var eventType = next?.Value<string>("type");
            if (eventType == "take_gems")
            {
                return ContainsCoord((JArray)next["coords"], row, column);
            }

            if (eventType == "take_bonus_gem")
            {
                return MatchesCoord((JObject)next["coord"], row, column);
            }

            return false;
        }

        private bool IsNextMarketCard(string instanceId, int level, int index)
        {
            var next = GetNextEvent();
            var eventType = next?.Value<string>("type");
            return (eventType == "buy_card" || eventType == "reserve_card") &&
                next.Value<string>("instanceId") == instanceId &&
                MatchesMarketRef(next, level, index);
        }

        private static bool ContainsCoord(JArray coords, int row, int column)
        {
            return coords.Any(coord => MatchesCoord((JObject)coord, row, column));
        }

        private static bool MatchesCoord(JObject coord, int row, int column)
        {
            return coord != null && coord.Value<int>("r") == row && coord.Value<int>("c") == column;
        }

        private static bool MatchesMarketRef(JObject replayEvent, GemDuelViewTarget target)
        {
            return replayEvent.Value<string>("instanceId") == target.InstanceId && MatchesMarketRef(replayEvent, target.Level, target.Index);
        }

        private static bool MatchesMarketRef(JObject replayEvent, int level, int index)
        {
            var marketRef = (JObject)replayEvent["marketRef"];
            return marketRef != null && marketRef.Value<int>("level") == level && marketRef.Value<int>("idx") == index;
        }

        private JObject BuildTakeGemsEvent(JObject template)
        {
            var replayEvent = (JObject)template.DeepClone();
            var coords = new JArray();
            foreach (var selected in selectedGemCoords)
            {
                coords.Add(new JObject { ["r"] = selected.x, ["c"] = selected.y });
            }

            replayEvent["coords"] = coords;
            return replayEvent;
        }

        private static int GetTakeGemsSelectionLimit(JObject replayEvent)
        {
            var coords = replayEvent["coords"] as JArray;
            return Math.Max(1, Math.Min(3, coords == null ? 3 : coords.Count));
        }

        private JArray BuildVisibleTargetSnapshot(int viewportWidth, int viewportHeight)
        {
            var targets = new JArray();
            var camera = Camera.main;
            if (camera != null && viewportHeight > 0)
            {
                camera.aspect = (float)viewportWidth / viewportHeight;
            }

            foreach (var target in FindObjectsByType<GemDuelViewTarget>(FindObjectsSortMode.None))
            {
                if (target == null)
                {
                    continue;
                }

                var item = new JObject
                {
                    ["kind"] = target.Kind,
                    ["semanticKey"] = target.SemanticKey,
                    ["eventType"] = target.EventType,
                    ["row"] = target.Row,
                    ["column"] = target.Column,
                    ["level"] = target.Level,
                    ["index"] = target.Index,
                    ["instanceId"] = target.InstanceId,
                    ["royalId"] = target.RoyalId,
                    ["gemId"] = target.GemId,
                    ["buffId"] = target.BuffId,
                    ["world"] = new JObject
                    {
                        ["x"] = Math.Round(target.transform.position.x, 3),
                        ["y"] = Math.Round(target.transform.position.y, 3),
                        ["width"] = Math.Round(target.Size.x, 3),
                        ["height"] = Math.Round(target.Size.y, 3),
                    },
                };

                if (camera != null && target.Size != Vector2.zero)
                {
                    var half = target.Size * 0.5f;
                    var min = camera.WorldToViewportPoint(
                        target.transform.position - new Vector3(half.x, half.y, 0f)
                    );
                    var max = camera.WorldToViewportPoint(
                        target.transform.position + new Vector3(half.x, half.y, 0f)
                    );
                    item["rect"] = new JObject
                    {
                        ["x"] = Math.Round(min.x * viewportWidth, 2),
                        ["y"] = Math.Round((1f - max.y) * viewportHeight, 2),
                        ["width"] = Math.Round((max.x - min.x) * viewportWidth, 2),
                        ["height"] = Math.Round((max.y - min.y) * viewportHeight, 2),
                    };
                }

                targets.Add(item);
            }

            return targets;
        }

        private static bool ValidateGemSelection(IReadOnlyList<Vector2Int> coords, bool isFinalSelection, out string error)
        {
            error = string.Empty;
            if (coords.Count <= 1)
            {
                return true;
            }

            var sorted = coords.OrderBy(coord => coord.x).ThenBy(coord => coord.y).ToList();
            for (var i = 0; i < sorted.Count - 1; i += 1)
            {
                if (sorted[i] == sorted[i + 1])
                {
                    error = "Select unique gems.";
                    return false;
                }
            }

            var first = sorted[0];
            var last = sorted[sorted.Count - 1];
            var dr = last.x - first.x;
            var dc = last.y - first.y;
            var isRow = dr == 0;
            var isColumn = dc == 0;
            var isDiagonal = Math.Abs(dr) == Math.Abs(dc);
            if (!isRow && !isColumn && !isDiagonal)
            {
                error = "Gems must form a straight row, column, or diagonal.";
                return false;
            }

            var span = Math.Max(Math.Abs(dr), Math.Abs(dc));
            if (span > 2)
            {
                error = "Take-gems selection can span at most three adjacent cells.";
                return false;
            }

            if (coords.Count == 2 && span > 1)
            {
                if (isFinalSelection)
                {
                    error = "Two-gem selections cannot have a gap.";
                    return false;
                }

                return true;
            }

            for (var i = 1; i < sorted.Count - 1; i += 1)
            {
                var gem = sorted[i];
                var crossProduct = (gem.x - first.x) * dc - (gem.y - first.y) * dr;
                if (crossProduct != 0)
                {
                    error = "Gems must form a straight row, column, or diagonal.";
                    return false;
                }
            }

            if (coords.Count == 3)
            {
                var middle = sorted[1];
                var expectedMiddle = new Vector2Int(
                    first.x + (dr == 0 ? 0 : dr > 0 ? 1 : -1),
                    first.y + (dc == 0 ? 0 : dc > 0 ? 1 : -1)
                );
                if (middle != expectedMiddle)
                {
                    error = "Three selected gems must be contiguous.";
                    return false;
                }
            }

            return true;
        }

        private string DescribeEvent(JObject replayEvent)
        {
            if (replayEvent == null)
            {
                return "complete";
            }

            var type = replayEvent.Value<string>("type") ?? "unknown";
            var actor = replayEvent.Value<string>("actor") ?? "?";
            switch (type)
            {
                case "take_gems":
                    return actor + " take " + ((JArray)replayEvent["coords"]).Count + " board gem(s)";
                case "take_bonus_gem":
                    return actor + " take bonus board gem";
                case "buy_card":
                    return actor + " buy " + replayEvent.Value<string>("instanceId");
                case "reserve_card":
                    return actor + " reserve " + replayEvent.Value<string>("instanceId");
                case "select_royal":
                    return actor + " select royal " + replayEvent.Value<string>("royalId");
                case "select_buff":
                    return actor + " select buff " + replayEvent.Value<string>("buffId");
                case "steal_gem":
                    return actor + " steal " + replayEvent.Value<string>("gemId");
                case "discard_gem":
                    return actor + " discard " + replayEvent.Value<string>("gemId");
                case "replenish":
                    return actor + " replenish board";
                default:
                    return actor + " " + type;
            }
        }

        private CardDef ResolveCard(string instanceId)
        {
            if (activeReplay == null || string.IsNullOrEmpty(instanceId))
            {
                return null;
            }

            if (!activeReplay.Init.CardInstances.TryGetValue(instanceId, out var cardId))
            {
                return null;
            }

            catalog.Cards.TryGetValue(cardId, out var card);
            return card;
        }

        private string ResolveCardId(string instanceIdOrCardId)
        {
            if (string.IsNullOrEmpty(instanceIdOrCardId))
            {
                return null;
            }

            if (activeReplay != null && activeReplay.Init.CardInstances.TryGetValue(instanceIdOrCardId, out var cardId))
            {
                return cardId;
            }

            return instanceIdOrCardId;
        }

        private static string GemArtworkFileName(string gemId)
        {
            switch (gemId)
            {
                case "blue":
                    return "blue.png";
                case "white":
                    return "white.png";
                case "green":
                    return "green.png";
                case "black":
                    return "black.png";
                case "red":
                    return "red.png";
                case "pearl":
                    return "pearl.png";
                case "gold":
                    return "gold.png";
                default:
                    return null;
            }
        }

        private static string GuessBonusColorFromInstanceId(string instanceId)
        {
            if (string.IsNullOrEmpty(instanceId))
            {
                return "null";
            }

            if (instanceId.Contains("-bl"))
            {
                return "blue";
            }

            if (instanceId.Contains("-wh"))
            {
                return "white";
            }

            if (instanceId.Contains("-gr"))
            {
                return "green";
            }

            if (instanceId.Contains("-bk"))
            {
                return "black";
            }

            if (instanceId.Contains("-re"))
            {
                return "red";
            }

            if (instanceId.Contains("-pe"))
            {
                return "pearl";
            }

            if (instanceId.Contains("-jo") || instanceId.Contains("-go"))
            {
                return "gold";
            }

            return "null";
        }

        private string BuildTableauSummary(string player)
        {
            var counts = new Dictionary<string, int>(StringComparer.Ordinal);
            foreach (var color in GemOrder)
            {
                counts[color] = 0;
            }

            var tableau = (JArray)((JObject)currentState.Snapshot["playerTableau"])[player];
            foreach (var entry in tableau)
            {
                var instanceId = entry.Value<string>("instanceId");
                var card = ResolveCard(instanceId);
                if (card != null && counts.ContainsKey(card.BonusColor))
                {
                    counts[card.BonusColor] += Math.Max(1, card.BonusCount);
                }
            }

            return "tableau " + string.Join(" ", GemOrder.Select(color => ShortGem(color) + ":" + counts[color]));
        }

        private List<string> GetPlayerTableauCardIds(string player, string color)
        {
            var ids = new List<string>();
            var tableau = (JArray)((JObject)currentState.Snapshot["playerTableau"])[player];
            foreach (var entry in tableau)
            {
                var instanceId = entry.Value<string>("instanceId");
                var card = ResolveCard(instanceId);
                var bonusColor = card?.BonusColor ?? GuessBonusColorFromInstanceId(instanceId);
                var isSpecial = bonusColor == "null" || bonusColor == "pearl";
                if ((color == "pure-royal" && isSpecial) || bonusColor == color)
                {
                    ids.Add(instanceId);
                }
            }

            if (color == "pure-royal")
            {
                var royals = (JArray)((JObject)currentState.Snapshot["playerRoyals"])[player];
                foreach (var royalToken in royals)
                {
                    ids.Add(royalToken.Value<string>());
                }
            }

            return ids;
        }

        private (int points, int bonus) GetPlayerTableauStats(string player, string color)
        {
            var points = 0;
            var bonus = 0;
            var tableau = (JArray)((JObject)currentState.Snapshot["playerTableau"])[player];
            foreach (var entry in tableau)
            {
                var instanceId = entry.Value<string>("instanceId");
                var card = ResolveCard(instanceId);
                if (card == null)
                {
                    continue;
                }

                var isSpecial = card.BonusColor == "null" || card.BonusColor == "pearl";
                if ((color == "pure-royal" && isSpecial) || card.BonusColor == color)
                {
                    points += card.Points;
                    bonus += Math.Max(0, card.BonusCount);
                }
            }

            if (color == "pure-royal")
            {
                var royals = (JArray)((JObject)currentState.Snapshot["playerRoyals"])[player];
                foreach (var royalToken in royals)
                {
                    if (catalog.Royals.TryGetValue(royalToken.Value<string>(), out var royal))
                    {
                        points += royal.Points;
                    }
                }
            }

            return (points, bonus);
        }

        private int GetScore(string player)
        {
            var score = GetIntAt("extraPoints", player);
            var tableau = (JArray)((JObject)currentState.Snapshot["playerTableau"])[player];
            foreach (var entry in tableau)
            {
                score += ResolveCard(entry.Value<string>("instanceId"))?.Points ?? 0;
            }

            var royals = (JArray)((JObject)currentState.Snapshot["playerRoyals"])[player];
            foreach (var royalToken in royals)
            {
                if (catalog.Royals.TryGetValue(royalToken.Value<string>(), out var royal))
                {
                    score += royal.Points;
                }
            }

            return score;
        }

        private int GetCrowns(string player)
        {
            var crowns = GetIntAt("extraCrowns", player);
            var tableau = (JArray)((JObject)currentState.Snapshot["playerTableau"])[player];
            foreach (var entry in tableau)
            {
                crowns += ResolveCard(entry.Value<string>("instanceId"))?.Crowns ?? 0;
            }

            var royals = (JArray)((JObject)currentState.Snapshot["playerRoyals"])[player];
            foreach (var royalToken in royals)
            {
                if (catalog.Royals.TryGetValue(royalToken.Value<string>(), out var royal))
                {
                    crowns += royal.Crowns;
                }
            }

            return crowns;
        }

        private int GetPlayerTurnCount(string player)
        {
            var counts = (JObject)currentState.Snapshot["playerTurnCounts"];
            return counts == null ? 0 : counts.Value<int>(player);
        }

        private int GetArrayCount(string root, string player)
        {
            var value = (JObject)currentState.Snapshot[root];
            return value == null ? 0 : ((JArray)value[player]).Count;
        }

        private int GetIntAt(string root, string player)
        {
            var value = (JObject)currentState.Snapshot[root];
            return value == null ? 0 : value.Value<int>(player);
        }

        private string LabelForBuff(string buffId)
        {
            if (catalog != null && catalog.Buffs.TryGetValue(buffId, out var buff) && !string.IsNullOrEmpty(buff.Label))
            {
                return ShortLabel(buff.Label, 18);
            }

            return buffId;
        }

        private static string ShortLabel(string value, int maxLength)
        {
            if (string.IsNullOrEmpty(value) || value.Length <= maxLength)
            {
                return value;
            }

            return value.Substring(0, maxLength - 1) + ".";
        }

        private static string ShortGem(string gemId)
        {
            switch (gemId)
            {
                case "blue":
                    return "BL";
                case "white":
                    return "WH";
                case "green":
                    return "GR";
                case "black":
                    return "BK";
                case "red":
                    return "RE";
                case "pearl":
                    return "PE";
                case "gold":
                    return "GO";
                case "null":
                    return "PO";
                default:
                    return "--";
            }
        }

        private static Color TextColorForGem(string gemId)
        {
            return gemId == "white" || gemId == "gold" || gemId == "pearl" || gemId == "green"
                ? Color.black
                : Color.white;
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
                case "null":
                    return new Color(0.62f, 0.64f, 0.68f);
                default:
                    return new Color(0.2f, 0.2f, 0.22f);
            }
        }

        private static JObject BuildShellSnapshot()
        {
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

            var emptyPlayerArrays = new JObject
            {
                ["p1"] = new JArray(),
                ["p2"] = new JArray(),
            };

            return new JObject
            {
                ["mode"] = "LOCAL_PVP",
                ["phase"] = "IDLE",
                ["turn"] = "p1",
                ["winner"] = null,
                ["board"] = new JArray(
                    Enumerable.Range(0, 5).Select(_ =>
                        new JArray("empty", "empty", "empty", "empty", "empty")
                    )
                ),
                ["bag"] = new JArray(),
                ["market"] = new JObject
                {
                    ["1"] = new JArray(),
                    ["2"] = new JArray(),
                    ["3"] = new JArray(),
                },
                ["decks"] = new JObject
                {
                    ["1"] = new JArray(),
                    ["2"] = new JArray(),
                    ["3"] = new JArray(),
                },
                ["royalDeck"] = new JArray("r91-ro", "r92-ro", "r93-ro", "r94-ro"),
                ["playerTableau"] = emptyPlayerArrays.DeepClone(),
                ["playerReserved"] = emptyPlayerArrays.DeepClone(),
                ["playerRoyals"] = emptyPlayerArrays.DeepClone(),
                ["inventories"] = new JObject
                {
                    ["p1"] = emptyInventory.DeepClone(),
                    ["p2"] = emptyInventory.DeepClone(),
                },
                ["privileges"] = new JObject
                {
                    ["p1"] = 0,
                    ["p2"] = 1,
                },
                ["extraPoints"] = new JObject
                {
                    ["p1"] = 0,
                    ["p2"] = 0,
                },
                ["extraCrowns"] = new JObject
                {
                    ["p1"] = 0,
                    ["p2"] = 0,
                },
                ["pendingReserve"] = null,
                ["pendingBuy"] = null,
            };
        }

        private sealed class PreviewContext
        {
            public string Source;
            public int Level;
            public int Index;
            public string InstanceId;
        }

        private static void DestroyUnityObject(UnityEngine.Object target)
        {
            if (target == null)
            {
                return;
            }

            if (Application.isPlaying)
            {
                Destroy(target);
            }
            else
            {
                DestroyImmediate(target);
            }
        }
    }
}
