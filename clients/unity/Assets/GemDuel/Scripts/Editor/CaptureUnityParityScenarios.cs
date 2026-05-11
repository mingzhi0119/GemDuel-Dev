using System;
using System.Collections.Generic;
using System.IO;
using GemDuel.Catalog;
using GemDuel.Presentation;
using GemDuel.Replay;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using UnityEditor.SceneManagement;
using UnityEngine;

namespace GemDuel.Editor
{
    public static class CaptureUnityParityScenarios
    {
        private const string FixtureFileName = "local-pvp-royal-extra-turn-game-over.replay.json";

        private static readonly ParityScenario[] Scenarios =
        {
            new ParityScenario("app-launch-main-menu", null, "Unity semantic app shell entry.", true),
            new ParityScenario(
                "level-3-boon-selection",
                null,
                "Unity level-3 boon selection driven through a real visible card hit target.",
                true,
                new[]
                {
                    new ParityActionStep("start_local_game", new JObject { ["fixture"] = true }),
                    new ParityActionStep("choose_boon", new JObject { ["index"] = 1, ["buffId"] = "royal_envoy" }),
                }
            ),
            new ParityScenario(
                "draft-hover-feedback",
                null,
                "Unity level-3 boon hover driven through a real visible card hover target.",
                true,
                new[]
                {
                    new ParityActionStep("start_local_game", new JObject { ["fixture"] = true }),
                    new ParityActionStep("hover_boon", new JObject { ["index"] = 1, ["buffId"] = "royal_envoy" }),
                }
            ),
            new ParityScenario("initial-board-render", 2, "Post-draft replay board render."),
            new ParityScenario(
                "chrome-settings-open",
                2,
                "Unity top-right settings open operation.",
                false,
                new[] { new ParityActionStep("open_settings") }
            ),
            new ParityScenario(
                "chrome-rulebook-open",
                2,
                "Unity top-right rulebook open operation.",
                false,
                new[] { new ParityActionStep("click_chrome_rulebook") }
            ),
            new ParityScenario(
                "chrome-restart-main-menu",
                2,
                "Unity top-right restart operation returns to main menu.",
                false,
                new[] { new ParityActionStep("click_chrome_restart") }
            ),
            new ParityScenario(
                "market-card-preview",
                2,
                "Unity semantic market preview action.",
                false,
                new[] { new ParityActionStep("click_market_card", new JObject { ["level"] = 1, ["index"] = 0 }) }
            ),
            new ParityScenario(
                "market-deck-reserve-preview",
                2,
                "Unity semantic market deck preview action.",
                false,
                new[] { new ParityActionStep("click_market_deck", new JObject { ["level"] = 1 }) }
            ),
            new ParityScenario(
                "market-card-hover-feedback",
                2,
                "Unity market-card hover operation.",
                false,
                new[] { new ParityActionStep("hover_market_card", new JObject { ["level"] = 1, ["index"] = 0 }) }
            ),
            new ParityScenario(
                "board-cell-hover-feedback",
                2,
                "Unity board-cell hover operation.",
                false,
                new[] { new ParityActionStep("hover_board_cell", new JObject { ["row"] = 0, ["column"] = 0 }) }
            ),
            new ParityScenario(
                "take-gems-confirm",
                2,
                "Unity take-gems selection and confirm operation.",
                false,
                new[]
                {
                    new ParityActionStep("click_board_cell", new JObject { ["row"] = 0, ["column"] = 0 }),
                    new ParityActionStep("click_board_cell", new JObject { ["row"] = 0, ["column"] = 1 }),
                    new ParityActionStep("click_board_cell", new JObject { ["row"] = 0, ["column"] = 2 }),
                    new ParityActionStep("confirm_gem_selection"),
                }
            ),
            new ParityScenario(
                "bonus-gem-follow-up",
                8,
                "Unity bonus gem follow-up operation.",
                false,
                new[] { new ParityActionStep("take_bonus_gem", new JObject { ["row"] = 1, ["column"] = 4 }) }
            ),
            new ParityScenario(
                "preview-blank-dismiss",
                2,
                "Unity preview opens and closes through a blank backdrop hit target.",
                false,
                new[]
                {
                    new ParityActionStep("click_market_card", new JObject { ["level"] = 1, ["index"] = 0 }),
                    new ParityActionStep("click_preview_blank", new JObject { ["x"] = 240, ["y"] = 280 }),
                }
            ),
            new ParityScenario(
                "buy-card",
                7,
                "First committed buy_card event applied through the semantic preview action.",
                false,
                new[] { new ParityActionStep("buy_card", new JObject { ["level"] = 1, ["index"] = 0 }) }
            ),
            new ParityScenario(
                "reserve-card",
                44,
                "First committed reserve_card event applied through the semantic preview action.",
                false,
                new[] { new ParityActionStep("reserve_card", new JObject { ["level"] = 3, ["index"] = 0 }) }
            ),
            new ParityScenario(
                "reserved-card-preview",
                45,
                "Unity current-player reserved-card preview operation.",
                false,
                new[] { new ParityActionStep("click_player_reserved", new JObject { ["index"] = 0, ["player"] = "p2" }) }
            ),
            new ParityScenario(
                "discard-gem-follow-up",
                45,
                "Unity discard gem follow-up operation.",
                false,
                new[] { new ParityActionStep("discard_gem", new JObject { ["gemId"] = "black" }) }
            ),
            new ParityScenario(
                "end-turn",
                10,
                "First replenish end-turn boundary applied through the semantic action.",
                false,
                new[] { new ParityActionStep("end_turn") }
            ),
            new ParityScenario(
                "royal-featured-card-display",
                13,
                "First committed select_royal event applied through the semantic action.",
                false,
                new[] { new ParityActionStep("choose_royal", new JObject { ["index"] = 0 }) }
            ),
            new ParityScenario("player-zone-resource-score", 14, "Player zone after early resources and royal."),
            new ParityScenario(
                "steal-gem-follow-up",
                31,
                "Unity steal gem follow-up operation.",
                false,
                new[] { new ParityActionStep("steal_gem", new JObject { ["gemId"] = "red" }) }
            ),
            new ParityScenario(
                "settings-theme-equivalent",
                2,
                "Unity settings/theme shell opened and mutated through visible settings controls.",
                false,
                new[]
                {
                    new ParityActionStep("open_settings"),
                    new ParityActionStep("change_setting", new JObject { ["name"] = "locale", ["value"] = "zh" }),
                    new ParityActionStep("change_setting", new JObject { ["name"] = "soundEnabled", ["value"] = false }),
                    new ParityActionStep("change_setting", new JObject { ["name"] = "surfaceTheme", ["value"] = "dark-arcane" }),
                }
            ),
            new ParityScenario(
                "settings-surface-theme",
                2,
                "Unity settings surface-theme operation.",
                false,
                new[]
                {
                    new ParityActionStep("open_settings"),
                    new ParityActionStep("change_setting", new JObject { ["name"] = "surfaceTheme", ["value"] = "dark-arcane" }),
                }
            ),
            new ParityScenario(
                "settings-save-replay",
                2,
                "Unity settings save replay row operation.",
                false,
                new[]
                {
                    new ParityActionStep("open_settings"),
                    new ParityActionStep("settings_save"),
                }
            ),
            new ParityScenario(
                "settings-load-replay",
                2,
                "Unity settings load replay row operation.",
                false,
                new[]
                {
                    new ParityActionStep("open_settings"),
                    new ParityActionStep("settings_load"),
                }
            ),
            new ParityScenario(
                "invalid-action-state",
                2,
                "Unity invalid action is rejected without mutating shared state.",
                false,
                new[] { new ParityActionStep("invalid_action", null, true) }
            ),
        };

        public static void CaptureAll()
        {
            var outputRoot = GetArgumentValue("-gemduelParityOut")
                ?? RepositoryPaths.ResolveFromRoot(
                    "artifacts",
                    "electron-unity-parity",
                    DateTime.UtcNow.ToString("yyyyMMdd-HHmmss") + "-unity"
                );
            var viewports = ParseViewports(GetArgumentValue("-gemduelParityViewports"));
            Directory.CreateDirectory(outputRoot);

            var summary = new JObject
            {
                ["source"] = "unity",
                ["fixture"] = FixtureFileName,
                ["generatedAt"] = DateTime.UtcNow.ToString("O"),
                ["scenarios"] = new JArray(),
            };
            var summaryScenarios = (JArray)summary["scenarios"];

            foreach (var scenario in Scenarios)
            {
                foreach (var viewport in viewports)
                {
                    var capture = CaptureScenario(outputRoot, scenario, viewport);
                    summaryScenarios.Add(capture);
                }
            }

            var summaryPath = Path.Combine(outputRoot, "unity-summary.json");
            File.WriteAllText(summaryPath, summary.ToString(Formatting.Indented));
            Debug.Log("GemDuel Unity parity summary written: " + summaryPath);
        }

        private static JObject CaptureScenario(
            string outputRoot,
            ParityScenario scenario,
            CaptureViewport viewport
        )
        {
            EditorSceneManager.NewScene(NewSceneSetup.EmptyScene, NewSceneMode.Single);
            var root = new GameObject("GemDuel Unity Parity Harness");
            var slice = root.AddComponent<GemDuelGameController>();
            slice.SetAutomationViewport(viewport.Width, viewport.Height);
            slice.SetPreviewBackdropCaptureForAutomation(true);

            if (scenario.StartsInShell)
            {
                slice.LoadMainMenuForAutomation();
            }
            else
            {
                slice.LoadFixtureForRuntime(FixtureFileName);
            }

            if (scenario.Revision.HasValue && !slice.ApplyFixtureEventsForAutomation(scenario.Revision.Value, out var error))
            {
                throw new InvalidOperationException(
                    "Could not prepare Unity parity scenario " + scenario.Id + ": " + error
                );
            }

            var beforeActionState = slice.BuildAutomationStateSnapshot(viewport.Width, viewport.Height);
            var actionResults = new JArray();
            foreach (var action in scenario.Actions)
            {
                var ok = slice.RunSemanticActionForAutomation(action.Action, action.Payload, out var actionError);
                actionResults.Add(
                    new JObject
                    {
                        ["action"] = action.Action,
                        ["ok"] = ok,
                        ["detail"] = string.IsNullOrEmpty(actionError) ? null : actionError,
                        ["driver"] = slice.LastAutomationDriver,
                        ["inputEvidence"] = slice.LastAutomationDetail,
                        ["state"] = slice.BuildAutomationStateSnapshot(viewport.Width, viewport.Height),
                    }
                );
                if (!ok && !action.AllowFailure)
                {
                    throw new InvalidOperationException(
                        "Could not run Unity semantic action " + action.Action + " for " + scenario.Id + ": " + actionError
                    );
                }
            }

            var scenarioDirectory = Path.Combine(outputRoot, "unity", scenario.Id);
            Directory.CreateDirectory(scenarioDirectory);
            var viewportId = viewport.Width + "x" + viewport.Height;
            var screenshotPath = Path.Combine(scenarioDirectory, viewportId + ".png");
            var statePath = Path.Combine(scenarioDirectory, viewportId + "-state.json");

            try
            {
                CaptureScreenshot(screenshotPath, viewport.Width, viewport.Height);
                var state = slice.BuildAutomationStateSnapshot(viewport.Width, viewport.Height);
                state["scenario"] = scenario.Id;
                state["entry"] = "GemDuel.Editor.CaptureUnityParityScenarios";
                state["inputScript"] = scenario.InputScript;
                state["knownGap"] = scenario.KnownGap;
                state["fixture"] = FixtureFileName;
                state["beforeActionState"] = beforeActionState;
                state["semanticActionResults"] = actionResults;

                if (scenario.Id == "invalid-action-state")
                {
                    state["unknownEventProbe"] = JObject.FromObject(
                        new ReplayParityRunner().RunUnknownEventProbe()
                    );
                }

                File.WriteAllText(statePath, state.ToString(Formatting.Indented));
                Debug.Log("GemDuel Unity parity screenshot written: " + screenshotPath);

                return new JObject
                {
                    ["scenario"] = scenario.Id,
                    ["revision"] = scenario.Revision.HasValue
                        ? new JValue(scenario.Revision.Value)
                        : JValue.CreateNull(),
                    ["viewport"] = viewportId,
                    ["screenshotPath"] = screenshotPath,
                    ["statePath"] = statePath,
                    ["knownGap"] = scenario.KnownGap,
                };
            }
            finally
            {
                UnityEngine.Object.DestroyImmediate(root);
            }
        }

        private static void CaptureScreenshot(string outputPath, int width, int height)
        {
            var camera = Camera.main;
            if (camera == null)
            {
                throw new InvalidOperationException("Unity parity capture has no camera.");
            }

            var renderTexture = new RenderTexture(width, height, 24);
            var texture = new Texture2D(width, height, TextureFormat.RGB24, false);
            var previousTarget = camera.targetTexture;
            var previousActive = RenderTexture.active;
            var previousAspect = camera.aspect;

            try
            {
                camera.aspect = (float)width / height;
                camera.targetTexture = renderTexture;
                RenderTexture.active = renderTexture;
                camera.Render();
                texture.ReadPixels(new Rect(0, 0, width, height), 0, 0);
                texture.Apply();
                File.WriteAllBytes(outputPath, texture.EncodeToPNG());
            }
            finally
            {
                camera.targetTexture = previousTarget;
                camera.aspect = previousAspect;
                RenderTexture.active = previousActive;
                UnityEngine.Object.DestroyImmediate(renderTexture);
                UnityEngine.Object.DestroyImmediate(texture);
            }
        }

        private static CaptureViewport[] ParseViewports(string raw)
        {
            var value = string.IsNullOrWhiteSpace(raw) ? "1920x1080,1366x768" : raw;
            var result = new List<CaptureViewport>();
            foreach (var part in value.Split(','))
            {
                var pieces = part.Trim().Split('x');
                if (
                    pieces.Length != 2
                    || !int.TryParse(pieces[0], out var width)
                    || !int.TryParse(pieces[1], out var height)
                )
                {
                    continue;
                }

                result.Add(new CaptureViewport(width, height));
            }

            return result.Count == 0
                ? new[] { new CaptureViewport(1920, 1080), new CaptureViewport(1366, 768) }
                : result.ToArray();
        }

        private static string GetArgumentValue(string name)
        {
            var args = Environment.GetCommandLineArgs();
            for (var i = 0; i < args.Length - 1; i += 1)
            {
                if (args[i] == name)
                {
                    return args[i + 1];
                }
            }

            return null;
        }

        private sealed class ParityScenario
        {
            public ParityScenario(
                string id,
                int? revision,
                string knownGap,
                bool startsInShell = false,
                ParityActionStep[] actions = null
            )
            {
                Id = id;
                Revision = revision;
                KnownGap = knownGap;
                StartsInShell = startsInShell;
                Actions = actions ?? Array.Empty<ParityActionStep>();
                InputScript = BuildInputScript();
            }

            public string Id { get; private set; }
            public int? Revision { get; private set; }
            public string KnownGap { get; private set; }
            public string InputScript { get; private set; }
            public bool StartsInShell { get; private set; }
            public ParityActionStep[] Actions { get; private set; }

            private string BuildInputScript()
            {
                var prefix = StartsInShell
                    ? "load_main_menu()"
                    : "load_replay_fixture(revision=" + Revision.GetValueOrDefault(0) + ")";
                if (Actions.Length == 0)
                {
                    return prefix;
                }

                return prefix + ", " + string.Join(", ", Array.ConvertAll(Actions, action => action.Action));
            }
        }

        private sealed class ParityActionStep
        {
            public ParityActionStep(string action, JObject payload = null, bool allowFailure = false)
            {
                Action = action;
                Payload = payload ?? new JObject();
                AllowFailure = allowFailure;
            }

            public string Action { get; private set; }
            public JObject Payload { get; private set; }
            public bool AllowFailure { get; private set; }
        }

        private readonly struct CaptureViewport
        {
            public CaptureViewport(int width, int height)
            {
                Width = width;
                Height = height;
            }

            public int Width { get; }
            public int Height { get; }
        }
    }
}
