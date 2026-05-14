using System;
using System.IO;
using System.Linq;
using GemDuel.Catalog;
using Newtonsoft.Json.Linq;
using UnityEngine;

namespace GemDuel.Presentation
{
    public sealed class LocalDevSettingsReleasePathSmokeOptions
    {
        public string Seed { get; set; } = "unity-built-player-settings-release-path";
        public int ViewportWidth { get; set; } = 1920;
        public int ViewportHeight { get; set; } = 1080;
        public string ExpectedLocale { get; set; } = "en";
        public string ExpectedSurfaceTheme { get; set; } = "pearl-opaline";
        public bool ExpectedSoundEnabled { get; set; }
        public bool ExpectedLanShowOpponentPlayerZoneCards { get; set; }
        public bool ExpectedLanShowOpponentGems { get; set; }
        public string CoverageGameMode { get; set; } = "classic-local-pvp";
        public string CoverageReplaySetting { get; set; } = "review-navigation-on";
        public string CoverageRecoverySetting { get; set; } = "autosave-on";
        public string CoverageFreshLaunch { get; set; } = "restart";
        public string CoverageInput { get; set; } = "mouse-click";
    }

    public static class LocalDevSettingsReleasePathSmoke
    {
        public static JObject Run(
            GemDuelGameController controller,
            LocalDevSettingsReleasePathSmokeOptions options
        )
        {
            options = options ?? new LocalDevSettingsReleasePathSmokeOptions();
            var settingsPath = ResolveSettingsPersistencePath();
            var report = new JObject
            {
                ["schemaVersion"] = 1,
                ["kind"] = "unity-localdev-settings-release-path-smoke",
                ["startedAt"] = DateTime.UtcNow.ToString("O"),
                ["seed"] = options.Seed,
                ["settingsPath"] = settingsPath,
                ["ok"] = false,
                ["freshLaunch"] = true,
                ["usedFixtureReplayAsGameplayDriver"] = false,
                ["usedCheckpointStateReplacement"] = false,
            };

            GameObject reloadedRoot = null;
            try
            {
                DeleteSettingsPersistenceFile(settingsPath);
                controller.SetAutomationViewport(options.ViewportWidth, options.ViewportHeight);
                controller.LoadMainMenuForAutomation();
                var startAction = StartActionForGameMode(options.CoverageGameMode);
                if (
                    !controller.RunSemanticActionForAutomation(
                        startAction,
                        new JObject { ["seed"] = options.Seed },
                        out var startError
                    )
                )
                {
                    return Fail(report, startAction + " failed: " + startError, controller, options);
                }

                if (controller.LastAutomationDriver != "setup-live-rules-engine")
                {
                    return Fail(
                        report,
                        "Local PvP did not start through the live rules-engine bridge.",
                        controller,
                        options
                    );
                }

                var baseline = controller.BuildAutomationStateSnapshot(
                    options.ViewportWidth,
                    options.ViewportHeight
                );
                var baselineHash = CurrentStateHash(baseline);
                var baselineRecordedEvents = RecordedEventCount(baseline);
                if (baseline.Value<int>("totalEvents") != 0 || ((JObject)baseline["replay"]).Value<bool>("loaded"))
                {
                    report["usedFixtureReplayAsGameplayDriver"] = true;
                    return Fail(report, "Fresh Local PvP start unexpectedly loaded fixture replay events.", controller, options);
                }

                if (baselineRecordedEvents != 0)
                {
                    return Fail(
                        report,
                        "Settings smoke expected no live gameplay events before settings mutation.",
                        controller,
                        options
                    );
                }

                if (!controller.RunSemanticActionForAutomation("open_settings", null, out var openError))
                {
                    return Fail(report, "open_settings failed: " + openError, controller, options);
                }

                var opened = controller.BuildAutomationStateSnapshot(
                    options.ViewportWidth,
                    options.ViewportHeight
                );
                if (!AssertSettingsVisualContract(opened, out var visualError))
                {
                    return Fail(report, "Settings visual contract failed after open: " + visualError, controller, options);
                }

                if (!SetExpectedSettings(controller, options, out var settingsError))
                {
                    return Fail(report, settingsError, controller, options);
                }

                if (!controller.RunSemanticActionForAutomation("settings_save", null, out var saveError))
                {
                    return Fail(report, "settings_save failed: " + saveError, controller, options);
                }

                var saved = controller.BuildAutomationStateSnapshot(
                    options.ViewportWidth,
                    options.ViewportHeight
                );
                var savedHash = CurrentStateHash(saved);
                var savedRecordedEvents = RecordedEventCount(saved);
                if (savedHash != baselineHash)
                {
                    return Fail(report, "Settings mutation changed gameplay state hash.", controller, options);
                }

                if (savedRecordedEvents != baselineRecordedEvents)
                {
                    return Fail(report, "Settings mutation appended live replay events.", controller, options);
                }

                var savedSettings = (JObject)saved["settings"];
                var savedPersistence = (JObject)savedSettings["persistence"];
                if (savedPersistence.Value<string>("status") != "saved")
                {
                    return Fail(report, "Settings persistence status was not saved.", controller, options);
                }

                var persistedPath = savedPersistence.Value<string>("path");
                if (string.IsNullOrWhiteSpace(persistedPath) || !File.Exists(persistedPath))
                {
                    return Fail(report, "Settings persistence file was not written.", controller, options);
                }

                var persisted = JObject.Parse(File.ReadAllText(persistedPath));
                if (!SettingsMatchExpected(savedSettings, options, out var savedMismatch))
                {
                    return Fail(report, "Saved settings mismatch: " + savedMismatch, controller, options);
                }

                if (!PersistedSettingsMatchExpected(persisted, options, out var persistedMismatch))
                {
                    return Fail(report, "Persisted settings mismatch: " + persistedMismatch, controller, options);
                }

                reloadedRoot = new GameObject("GemDuel Built Player Settings Smoke Reloaded");
                var reloaded = reloadedRoot.AddComponent<GemDuelGameController>();
                reloaded.SetAutomationViewport(options.ViewportWidth, options.ViewportHeight);
                reloaded.LoadMainMenuForAutomation();
                if (
                    !reloaded.RunSemanticActionForAutomation(
                        startAction,
                        new JObject { ["seed"] = options.Seed + "-reload" },
                        out var reloadStartError
                    )
                )
                {
                    return Fail(report, "reload " + startAction + " failed: " + reloadStartError, reloaded, options);
                }

                var beforeReloadGame = reloaded.BuildAutomationStateSnapshot(
                    options.ViewportWidth,
                    options.ViewportHeight
                );
                var beforeReloadHash = CurrentStateHash(beforeReloadGame);
                var beforeReloadRecordedEvents = RecordedEventCount(beforeReloadGame);
                if (!reloaded.RunSemanticActionForAutomation("open_settings", null, out var reloadOpenError))
                {
                    return Fail(report, "reload open_settings failed: " + reloadOpenError, reloaded, options);
                }

                var beforeReload = reloaded.BuildAutomationStateSnapshot(
                    options.ViewportWidth,
                    options.ViewportHeight
                );
                if (!AssertSettingsVisualContract(beforeReload, out var reloadVisualError))
                {
                    return Fail(report, "Settings visual contract failed after reload open: " + reloadVisualError, reloaded, options);
                }

                if (!reloaded.RunSemanticActionForAutomation("settings_load", null, out var loadError))
                {
                    return Fail(report, "settings_load failed: " + loadError, reloaded, options);
                }

                var afterReload = reloaded.BuildAutomationStateSnapshot(
                    options.ViewportWidth,
                    options.ViewportHeight
                );
                var reloadedSettings = (JObject)afterReload["settings"];
                var reloadedPersistence = (JObject)reloadedSettings["persistence"];
                if (reloadedPersistence.Value<string>("status") != "loaded")
                {
                    return Fail(report, "Reloaded settings persistence status was not loaded.", reloaded, options);
                }

                if (!SettingsMatchExpected(reloadedSettings, options, out var reloadedMismatch))
                {
                    return Fail(report, "Reloaded settings mismatch: " + reloadedMismatch, reloaded, options);
                }

                var afterReloadHash = CurrentStateHash(afterReload);
                var afterReloadRecordedEvents = RecordedEventCount(afterReload);
                if (afterReloadHash != beforeReloadHash)
                {
                    return Fail(report, "Settings load changed reloaded gameplay state hash.", reloaded, options);
                }

                if (afterReloadRecordedEvents != beforeReloadRecordedEvents)
                {
                    return Fail(report, "Settings load appended live replay events.", reloaded, options);
                }

                report["baselineStateSummary"] = BuildStateSummary(baseline);
                report["savedStateSummary"] = BuildStateSummary(saved);
                report["reloadedStateSummary"] = BuildStateSummary(afterReload);
                report["settingsSummary"] = new JObject
                {
                    ["savedStatus"] = savedPersistence.Value<string>("status"),
                    ["reloadedStatus"] = reloadedPersistence.Value<string>("status"),
                    ["path"] = persistedPath,
                    ["gameplayHashBefore"] = baselineHash,
                    ["gameplayHashAfterSave"] = savedHash,
                    ["recordedEventsBefore"] = baselineRecordedEvents,
                    ["recordedEventsAfterSave"] = savedRecordedEvents,
                    ["reloadGameplayHashBefore"] = beforeReloadHash,
                    ["reloadGameplayHashAfterLoad"] = afterReloadHash,
                    ["reloadRecordedEventsBefore"] = beforeReloadRecordedEvents,
                    ["reloadRecordedEventsAfterLoad"] = afterReloadRecordedEvents,
                    ["freshBeforeReload"] = ExtractSettings((JObject)beforeReload["settings"]),
                    ["savedSettings"] = ExtractSettings(savedSettings),
                    ["persistedSettings"] = ExtractPersistedSettings(persisted),
                    ["reloadedSettings"] = ExtractSettings(reloadedSettings),
                    ["coverageParams"] = BuildCoverageParams(options),
                };
                report["visualContractSummary"] = BuildVisualContractSummary(opened, beforeReload);
                report["ok"] = true;
                report["completedAt"] = DateTime.UtcNow.ToString("O");
                return report;
            }
            catch (Exception ex)
            {
                return Fail(report, ex.ToString(), controller, options);
            }
            finally
            {
                DestroyObject(reloadedRoot);
            }
        }

        private static bool SetExpectedSettings(
            GemDuelGameController controller,
            LocalDevSettingsReleasePathSmokeOptions options,
            out string error
        )
        {
            if (
                !controller.RunSemanticActionForAutomation(
                    "change_setting",
                    new JObject { ["name"] = "locale", ["value"] = NormalizeLocale(options.ExpectedLocale) },
                    out error
                )
            )
            {
                error = "locale setting failed: " + error;
                return false;
            }

            if (
                !controller.RunSemanticActionForAutomation(
                    "change_setting",
                    new JObject { ["name"] = "surfaceTheme", ["value"] = NormalizeSurfaceTheme(options.ExpectedSurfaceTheme) },
                    out error
                )
            )
            {
                error = "surfaceTheme setting failed: " + error;
                return false;
            }

            if (
                !controller.RunSemanticActionForAutomation(
                    "change_setting",
                    new JObject { ["name"] = "soundEnabled", ["value"] = options.ExpectedSoundEnabled },
                    out error
                )
            )
            {
                error = "soundEnabled setting failed: " + error;
                return false;
            }

            if (
                !controller.RunSemanticActionForAutomation(
                    "change_setting",
                    new JObject { ["name"] = "lanShowOpponentPlayerZoneCards", ["value"] = options.ExpectedLanShowOpponentPlayerZoneCards },
                    out error
                )
            )
            {
                error = "lanShowOpponentPlayerZoneCards setting failed: " + error;
                return false;
            }

            if (
                !controller.RunSemanticActionForAutomation(
                    "change_setting",
                    new JObject { ["name"] = "lanShowOpponentGems", ["value"] = options.ExpectedLanShowOpponentGems },
                    out error
                )
            )
            {
                error = "lanShowOpponentGems setting failed: " + error;
                return false;
            }

            return true;
        }

        private static bool SettingsMatchExpected(
            JObject settings,
            LocalDevSettingsReleasePathSmokeOptions options,
            out string mismatch
        )
        {
            mismatch = string.Empty;
            if (settings.Value<string>("locale") != NormalizeLocale(options.ExpectedLocale))
            {
                mismatch = "locale";
                return false;
            }

            if (settings.Value<string>("surfaceTheme") != NormalizeSurfaceTheme(options.ExpectedSurfaceTheme))
            {
                mismatch = "surfaceTheme";
                return false;
            }

            if (settings.Value<bool>("soundEnabled") != options.ExpectedSoundEnabled)
            {
                mismatch = "soundEnabled";
                return false;
            }

            if (settings.Value<bool>("lanShowOpponentPlayerZoneCards") != options.ExpectedLanShowOpponentPlayerZoneCards)
            {
                mismatch = "lanShowOpponentPlayerZoneCards";
                return false;
            }

            if (settings.Value<bool>("lanShowOpponentGems") != options.ExpectedLanShowOpponentGems)
            {
                mismatch = "lanShowOpponentGems";
                return false;
            }

            return true;
        }

        private static bool PersistedSettingsMatchExpected(
            JObject persisted,
            LocalDevSettingsReleasePathSmokeOptions options,
            out string mismatch
        )
        {
            mismatch = string.Empty;
            if (persisted.Value<string>("locale") != NormalizeLocale(options.ExpectedLocale))
            {
                mismatch = "locale";
                return false;
            }

            if (persisted.Value<string>("surfaceTheme") != NormalizeSurfaceTheme(options.ExpectedSurfaceTheme))
            {
                mismatch = "surfaceTheme";
                return false;
            }

            if (persisted.Value<bool>("soundEnabled") != options.ExpectedSoundEnabled)
            {
                mismatch = "soundEnabled";
                return false;
            }

            if (persisted.Value<bool>("lanShowOpponentPlayerZoneCards") != options.ExpectedLanShowOpponentPlayerZoneCards)
            {
                mismatch = "lanShowOpponentPlayerZoneCards";
                return false;
            }

            if (persisted.Value<bool>("lanShowOpponentGems") != options.ExpectedLanShowOpponentGems)
            {
                mismatch = "lanShowOpponentGems";
                return false;
            }

            return true;
        }

        private static string StartActionForGameMode(string gameMode)
        {
            return NormalizeGameMode(gameMode) == "roguelike-local-pvp"
                ? "start_roguelike_game"
                : "start_local_game";
        }

        private static JObject BuildCoverageParams(LocalDevSettingsReleasePathSmokeOptions options)
        {
            return new JObject
            {
                ["audio"] = options.ExpectedSoundEnabled ? "sound-on" : "sound-off",
                ["fresh_launch"] = NormalizeChoice(
                    options.CoverageFreshLaunch,
                    "restart",
                    "fresh",
                    "restart"
                ),
                ["game_mode"] = NormalizeGameMode(options.CoverageGameMode),
                ["input"] = NormalizeChoice(
                    options.CoverageInput,
                    "mouse-click",
                    "mouse-click",
                    "drag-select"
                ),
                ["locale"] = NormalizeLocale(options.ExpectedLocale),
                ["recovery_setting"] = NormalizeChoice(
                    options.CoverageRecoverySetting,
                    "autosave-on",
                    "autosave-on",
                    "autosave-off"
                ),
                ["replay_setting"] = NormalizeChoice(
                    options.CoverageReplaySetting,
                    "review-navigation-on",
                    "review-navigation-on",
                    "review-navigation-off"
                ),
                ["surface_theme"] = NormalizeSurfaceTheme(options.ExpectedSurfaceTheme),
                ["visibility"] = VisibilityValue(options),
            };
        }

        private static string VisibilityValue(LocalDevSettingsReleasePathSmokeOptions options)
        {
            if (options.ExpectedLanShowOpponentPlayerZoneCards)
            {
                return "lan-cards-visible";
            }

            return options.ExpectedLanShowOpponentGems ? "lan-gems-visible" : "lan-hidden";
        }

        private static string NormalizeLocale(string value)
        {
            return value == "zh" ? "zh" : "en";
        }

        private static string NormalizeSurfaceTheme(string value)
        {
            if (value == "royal-luxury" || value == "clean-boardgame" || value == "pearl-opaline")
            {
                return value;
            }

            return "pearl-opaline";
        }

        private static string NormalizeGameMode(string value)
        {
            return value == "roguelike-local-pvp" ? "roguelike-local-pvp" : "classic-local-pvp";
        }

        private static string NormalizeChoice(string value, string fallback, params string[] allowed)
        {
            foreach (var candidate in allowed)
            {
                if (value == candidate)
                {
                    return value;
                }
            }

            return fallback;
        }

        private static JObject BuildStateSummary(JObject automationState)
        {
            return new JObject
            {
                ["phase"] = automationState.Value<string>("phase"),
                ["turn"] = automationState.Value<string>("turn"),
                ["winner"] = automationState.Value<string>("winner"),
                ["stateHash"] = CurrentStateHash(automationState),
                ["recordedEvents"] = RecordedEventCount(automationState),
            };
        }

        private static bool AssertSettingsVisualContract(JObject automationState, out string error)
        {
            error = string.Empty;
            var settings = automationState["settings"] as JObject;
            if (settings?.Value<bool>("panelOpen") != true)
            {
                error = "settings panel is not open";
                return false;
            }

            var contract = automationState["visualContracts"]?["settingsMenu"] as JObject;
            if (contract == null)
            {
                error = "settingsMenu visual contract missing";
                return false;
            }

            if (contract.Value<bool>("ok") != true)
            {
                error = "settingsMenu visual contract reported ok=false";
                return false;
            }

            var panel = FindVisibleTarget(automationState, "settings.panel");
            if (panel == null)
            {
                error = "settings.panel target missing";
                return false;
            }

            if (!RectMatches(panel["rect"] as JObject, 1722d, 60d, 186d, 229d, 2d, out error))
            {
                error = "settings.panel " + error;
                return false;
            }

            foreach (var semanticKey in new[]
            {
                "settings.locale.en",
                "settings.locale.zh",
                "settings.sound",
                "settings.save",
                "settings.load",
                "settings.surface.control",
            })
            {
                var target = FindVisibleTarget(automationState, semanticKey);
                if (target == null)
                {
                    error = semanticKey + " target missing";
                    return false;
                }

                if (target.Value<bool>("clickable") != true)
                {
                    error = semanticKey + " target is not clickable";
                    return false;
                }
            }

            var sound = FindVisibleTarget(automationState, "settings.sound");
            if (!RectMatches(sound?["rect"] as JObject, 1730.25d, 140.66d, 169.5d, 31.61d, 2d, out error))
            {
                error = "settings.sound " + error;
                return false;
            }

            var unity = contract["unityContract"] as JObject;
            if (unity == null)
            {
                error = "settingsMenu unityContract missing";
                return false;
            }

            var rowFontPx = unity.Value<double>("rowFontPx");
            var rowHeightPx = unity.Value<double>("rowHeightPx");
            var ratio = unity.Value<double>("rowFontToHeightRatio");
            if (Math.Abs(rowFontPx - 9.75d) > 1d)
            {
                error = "row font " + rowFontPx.ToString("0.##") + "px does not match Electron final-screen 9.75px";
                return false;
            }

            if (Math.Abs(rowHeightPx - 31.61d) > 1d)
            {
                error = "row height " + rowHeightPx.ToString("0.##") + "px does not match Electron final-screen 31.61px";
                return false;
            }

            if (Math.Abs(ratio - 0.3084d) > 0.02d)
            {
                error = "row font/height ratio " + ratio.ToString("0.####") + " does not match Electron 0.3084";
                return false;
            }

            return true;
        }

        private static JObject BuildVisualContractSummary(JObject opened, JObject reloadedOpened)
        {
            return new JObject
            {
                ["settingsMenu"] = opened["visualContracts"]?["settingsMenu"]?.DeepClone(),
                ["reloadedSettingsMenu"] = reloadedOpened["visualContracts"]?["settingsMenu"]?.DeepClone(),
                ["panelRect"] = FindVisibleTarget(opened, "settings.panel")?["rect"]?.DeepClone(),
                ["soundRowRect"] = FindVisibleTarget(opened, "settings.sound")?["rect"]?.DeepClone(),
                ["sourceOfTruth"] = "apps/desktop/src/app/chrome/AppChrome.tsx",
                ["checks"] = new JArray(
                    "panel width follows Electron final screen pixels: w-[248px] * lg:scale-[1.5] * shell scale 0.5 = 186px",
                    "row height follows Electron final screen pixels: 42.14px * lg:scale-[1.5] * shell scale 0.5 = 31.61px",
                    "row font/height ratio follows 9.75/31.61 = 0.3084",
                    "settings controls remain visible clickable hit targets"
                ),
            };
        }

        private static JObject FindVisibleTarget(JObject automationState, string semanticKey)
        {
            var targets = automationState["visibleTargets"] as JArray;
            return targets == null
                ? null
                : targets.OfType<JObject>().FirstOrDefault(target => target.Value<string>("semanticKey") == semanticKey);
        }

        private static bool RectMatches(
            JObject rect,
            double expectedX,
            double expectedY,
            double expectedWidth,
            double expectedHeight,
            double tolerance,
            out string error
        )
        {
            error = string.Empty;
            if (rect == null)
            {
                error = "rect missing";
                return false;
            }

            var checks = new[]
            {
                Tuple.Create("x", rect.Value<double>("x"), expectedX),
                Tuple.Create("y", rect.Value<double>("y"), expectedY),
                Tuple.Create("width", rect.Value<double>("width"), expectedWidth),
                Tuple.Create("height", rect.Value<double>("height"), expectedHeight),
            };
            foreach (var check in checks)
            {
                if (Math.Abs(check.Item2 - check.Item3) > tolerance)
                {
                    error = check.Item1 + "=" + check.Item2.ToString("0.##") + " expected " + check.Item3.ToString("0.##");
                    return false;
                }
            }

            return true;
        }

        private static JObject ExtractSettings(JObject settings)
        {
            return new JObject
            {
                ["locale"] = settings.Value<string>("locale"),
                ["theme"] = settings.Value<string>("theme"),
                ["surfaceTheme"] = settings.Value<string>("surfaceTheme"),
                ["soundEnabled"] = settings.Value<bool>("soundEnabled"),
                ["lanShowOpponentPlayerZoneCards"] = settings.Value<bool>("lanShowOpponentPlayerZoneCards"),
                ["lanShowOpponentGems"] = settings.Value<bool>("lanShowOpponentGems"),
                ["persistenceStatus"] = ((JObject)settings["persistence"]).Value<string>("status"),
            };
        }

        private static JObject ExtractPersistedSettings(JObject persisted)
        {
            return new JObject
            {
                ["locale"] = persisted.Value<string>("locale"),
                ["theme"] = persisted.Value<string>("theme"),
                ["surfaceTheme"] = persisted.Value<string>("surfaceTheme"),
                ["soundEnabled"] = persisted.Value<bool>("soundEnabled"),
                ["lanShowOpponentPlayerZoneCards"] = persisted.Value<bool>("lanShowOpponentPlayerZoneCards"),
                ["lanShowOpponentGems"] = persisted.Value<bool>("lanShowOpponentGems"),
                ["source"] = persisted.Value<string>("source"),
            };
        }

        private static string CurrentStateHash(JObject automationState)
        {
            return ((JObject)automationState["replay"]).Value<string>("currentStateHash");
        }

        private static int RecordedEventCount(JObject automationState)
        {
            var liveRecording = ((JObject)automationState["replay"])["liveRecording"] as JObject;
            return liveRecording?.Value<int>("recordedEvents") ?? -1;
        }

        private static string ResolveSettingsPersistencePath()
        {
            return RepositoryPaths.ResolveFromRoot(
                "artifacts",
                "unity",
                "settings",
                "gemduel.preferences.v1.json"
            );
        }

        private static void DeleteSettingsPersistenceFile(string path)
        {
            var directory = Path.GetDirectoryName(path);
            if (!string.IsNullOrEmpty(directory))
            {
                Directory.CreateDirectory(directory);
            }

            if (File.Exists(path))
            {
                File.Delete(path);
            }
        }

        private static JObject BuildFailureState(GemDuelGameController controller, LocalDevSettingsReleasePathSmokeOptions options)
        {
            try
            {
                var state = controller.BuildAutomationStateSnapshot(
                    options.ViewportWidth,
                    options.ViewportHeight
                );
                return new JObject
                {
                    ["phase"] = state.Value<string>("phase"),
                    ["turn"] = state.Value<string>("turn"),
                    ["winner"] = state.Value<string>("winner"),
                    ["statusText"] = state.Value<string>("statusText"),
                    ["errorBanner"] = state.Value<string>("errorBanner"),
                    ["settings"] = state["settings"]?.DeepClone(),
                    ["visualContracts"] = state["visualContracts"]?.DeepClone(),
                    ["replay"] = state["replay"]?.DeepClone(),
                };
            }
            catch
            {
                return null;
            }
        }

        private static JObject Fail(
            JObject report,
            string reason,
            GemDuelGameController controller,
            LocalDevSettingsReleasePathSmokeOptions options
        )
        {
            report["ok"] = false;
            report["failureReason"] = reason;
            report["failureState"] = controller == null ? null : BuildFailureState(controller, options);
            report["completedAt"] = DateTime.UtcNow.ToString("O");
            return report;
        }

        private static void DestroyObject(GameObject root)
        {
            if (root == null)
            {
                return;
            }

            if (Application.isPlaying)
            {
                UnityEngine.Object.Destroy(root);
            }
            else
            {
                UnityEngine.Object.DestroyImmediate(root);
            }
        }
    }
}
