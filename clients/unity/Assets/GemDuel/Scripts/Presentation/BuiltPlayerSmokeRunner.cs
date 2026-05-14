using System;
using System.IO;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using UnityEngine;

namespace GemDuel.Presentation
{
    public sealed class BuiltPlayerSmokeRunner : MonoBehaviour
    {
        private const string SmokeFlag = "--gemduel-built-player-smoke";
        private bool started;

        [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.AfterSceneLoad)]
        public static void MaybeInstall()
        {
            if (!HasArg(SmokeFlag))
            {
                return;
            }

            var root = new GameObject("GemDuel Built Player Smoke Runner");
            UnityEngine.Object.DontDestroyOnLoad(root);
            root.AddComponent<BuiltPlayerSmokeRunner>();
        }

        private void Update()
        {
            if (started)
            {
                return;
            }

            started = true;
            RunSmoke();
        }

        private void RunSmoke()
        {
            var reportPath = GetArgValue("--gemduel-smoke-report");
            var seed = GetArgValue("--gemduel-smoke-seed") ?? "unity-built-player-smoke";
            var maxSteps = ParseInt(GetArgValue("--gemduel-smoke-max-steps"), 12);
            var startMode = GetArgValue("--gemduel-smoke-start-mode") ?? "classic";
            var idleActionPreference =
                GetArgValue("--gemduel-smoke-idle-action-preference") ?? "balanced";
            var draftActionPreference =
                GetArgValue("--gemduel-smoke-draft-action-preference") ?? "select-first";
            var includeReplayReleasePath = HasArg("--gemduel-smoke-include-replay-release-path");
            var includeRecoveryReleasePath = HasArg("--gemduel-smoke-include-recovery-release-path");
            var includeSettingsReleasePath = HasArg("--gemduel-smoke-include-settings-release-path");
            var includeChromeReleasePath = HasArg("--gemduel-smoke-include-chrome-release-path");
            var includeReplayReviewReleasePath = HasArg("--gemduel-smoke-include-replay-review-release-path");
            var includeInvalidActionReleasePath = HasArg("--gemduel-smoke-include-invalid-action-release-path");
            var includePeekModalReleasePath = HasArg("--gemduel-smoke-include-peek-modal-release-path");
            var includeRecoveryInvalidActionReleasePath =
                HasArg("--gemduel-smoke-include-recovery-invalid-action-release-path");
            var includePrivilegeCancelReleasePath =
                HasArg("--gemduel-smoke-include-privilege-cancel-release-path");
            var includeReservedDiscardReleasePath =
                HasArg("--gemduel-smoke-include-reserved-discard-release-path");
            var includeReservedBuyReleasePath =
                HasArg("--gemduel-smoke-include-reserved-buy-release-path");
            var includeReserveCancelReleasePath =
                HasArg("--gemduel-smoke-include-reserve-cancel-release-path");
            var includeReserveDeckReleasePath =
                HasArg("--gemduel-smoke-include-reserve-deck-release-path");
            var includeReserveDeckCancelReleasePath =
                HasArg("--gemduel-smoke-include-reserve-deck-cancel-release-path");
            var includeJokerReleasePath =
                HasArg("--gemduel-smoke-include-joker-release-path");
            var fullGamePlanPath = GetArgValue("--gemduel-smoke-full-game-plan");
            var fullGamePlanDirectory = GetArgValue("--gemduel-smoke-full-game-plan-dir");
            var fullGamePlanLimit = ParseInt(GetArgValue("--gemduel-smoke-full-game-plan-limit"), 100);
            var includeFullGamePlanSuite =
                !string.IsNullOrWhiteSpace(fullGamePlanPath)
                || !string.IsNullOrWhiteSpace(fullGamePlanDirectory);
            var replayReleasePathDirectory =
                GetArgValue("--gemduel-smoke-replay-release-dir")
                ?? ResolveReplayReleasePathDirectory(reportPath);
            var replayReviewReleasePathDirectory =
                GetArgValue("--gemduel-smoke-replay-review-release-dir")
                ?? ResolveReplayReviewReleasePathDirectory(reportPath);
            var settingsLocale = GetArgValue("--gemduel-smoke-settings-locale") ?? "en";
            var settingsSurfaceTheme =
                GetArgValue("--gemduel-smoke-settings-surface-theme") ?? "pearl-opaline";
            var settingsSoundEnabled = ParseBoolArg(
                GetArgValue("--gemduel-smoke-settings-sound-enabled"),
                false
            );
            var settingsVisibility =
                NormalizeSettingsVisibility(GetArgValue("--gemduel-smoke-settings-visibility"));
            var settingsGameMode =
                GetArgValue("--gemduel-smoke-settings-game-mode") ?? "classic-local-pvp";
            var settingsReplaySetting =
                GetArgValue("--gemduel-smoke-settings-replay") ?? "review-navigation-on";
            var settingsRecoverySetting =
                GetArgValue("--gemduel-smoke-settings-recovery") ?? "autosave-on";
            var settingsFreshLaunch =
                GetArgValue("--gemduel-smoke-settings-fresh-launch") ?? "restart";
            var settingsInput =
                GetArgValue("--gemduel-smoke-settings-input") ?? "mouse-click";
            var settingsLanCardsVisible = settingsVisibility == "lan-cards-visible";
            var settingsLanGemsVisible = settingsVisibility == "lan-gems-visible";
            var report = new JObject
            {
                ["schemaVersion"] = 1,
                ["kind"] = "unity-built-player-smoke-wrapper",
                ["startedAt"] = DateTime.UtcNow.ToString("O"),
                ["seed"] = seed,
                ["maxSteps"] = maxSteps,
                ["startMode"] = startMode,
                ["idleActionPreference"] = idleActionPreference,
                ["draftActionPreference"] = draftActionPreference,
                ["includeReplayReleasePath"] = includeReplayReleasePath,
                ["includeRecoveryReleasePath"] = includeRecoveryReleasePath,
                ["includeSettingsReleasePath"] = includeSettingsReleasePath,
                ["includeChromeReleasePath"] = includeChromeReleasePath,
                ["includeReplayReviewReleasePath"] = includeReplayReviewReleasePath,
                ["includeInvalidActionReleasePath"] = includeInvalidActionReleasePath,
                ["includePeekModalReleasePath"] = includePeekModalReleasePath,
                ["includeRecoveryInvalidActionReleasePath"] = includeRecoveryInvalidActionReleasePath,
                ["includePrivilegeCancelReleasePath"] = includePrivilegeCancelReleasePath,
                ["includeReservedDiscardReleasePath"] = includeReservedDiscardReleasePath,
                ["includeReservedBuyReleasePath"] = includeReservedBuyReleasePath,
                ["includeReserveCancelReleasePath"] = includeReserveCancelReleasePath,
                ["includeReserveDeckReleasePath"] = includeReserveDeckReleasePath,
                ["includeReserveDeckCancelReleasePath"] = includeReserveDeckCancelReleasePath,
                ["includeJokerReleasePath"] = includeJokerReleasePath,
                ["includeFullGamePlanSuite"] = includeFullGamePlanSuite,
                ["fullGamePlanPath"] = fullGamePlanPath,
                ["fullGamePlanDirectory"] = fullGamePlanDirectory,
                ["fullGamePlanLimit"] = fullGamePlanLimit,
                ["settingsCoverageRequest"] = new JObject
                {
                    ["locale"] = settingsLocale,
                    ["surfaceTheme"] = settingsSurfaceTheme,
                    ["soundEnabled"] = settingsSoundEnabled,
                    ["visibility"] = settingsVisibility,
                    ["gameMode"] = settingsGameMode,
                    ["replaySetting"] = settingsReplaySetting,
                    ["recoverySetting"] = settingsRecoverySetting,
                    ["freshLaunch"] = settingsFreshLaunch,
                    ["input"] = settingsInput,
                },
                ["ok"] = false,
                ["player"] = new JObject
                {
                    ["platform"] = Application.platform.ToString(),
                    ["unityVersion"] = Application.unityVersion,
                    ["dataPath"] = Application.dataPath,
                },
            };

            try
            {
                var controller = FindAnyObjectByType<GemDuelGameController>();
                if (controller == null)
                {
                    var controllerRoot = new GameObject("GemDuel Game");
                    controller = controllerRoot.AddComponent<GemDuelGameController>();
                    controllerRoot.AddComponent<GemDuelInputController>();
                }

                var ok = false;
                if (includeFullGamePlanSuite)
                {
                    var fullGamePlanSuite = LocalDevFullGamePlanSmoke.RunBatch(
                        controller,
                        new LocalDevFullGamePlanSmokeOptions
                        {
                            PlanPath = fullGamePlanPath ?? string.Empty,
                            PlanDirectory = fullGamePlanDirectory ?? string.Empty,
                            Limit = fullGamePlanLimit,
                            ViewportWidth = 1920,
                            ViewportHeight = 1080,
                            StopOnFirstFailure = true,
                        }
                    );
                    report["fullGamePlanSuite"] = fullGamePlanSuite;
                    ok = fullGamePlanSuite.Value<bool>("ok");
                }
                else
                {
                    var smoke = LocalDevProductSurfaceSmoke.Run(
                        controller,
                        new LocalDevProductSurfaceSmokeOptions
                        {
                            Seed = seed,
                            MaxSteps = maxSteps,
                            StartMode = startMode,
                            VerifyReplayReview = true,
                            IdleActionPreference = idleActionPreference,
                            DraftActionPreference = draftActionPreference,
                        }
                    );
                    report["smoke"] = smoke;
                    ok = smoke.Value<bool>("ok");
                }
                if (ok && includeReplayReleasePath)
                {
                    var releasePath = LocalDevReplayReleasePathSmoke.Run(
                        controller,
                        new LocalDevReplayReleasePathSmokeOptions
                        {
                            OutputDirectory = replayReleasePathDirectory,
                            ViewportWidth = 1920,
                            ViewportHeight = 1080,
                        }
                    );
                    report["replayReleasePath"] = releasePath;
                    ok = releasePath.Value<bool>("ok");
                }

                if (ok && includeRecoveryReleasePath)
                {
                    var recoveryPath = LocalDevRecoveryReleasePathSmoke.Run(
                        controller,
                        new LocalDevRecoveryReleasePathSmokeOptions
                        {
                            Seed = seed + "-recovery",
                            ViewportWidth = 1920,
                            ViewportHeight = 1080,
                        }
                    );
                    report["recoveryReleasePath"] = recoveryPath;
                    ok = recoveryPath.Value<bool>("ok");
                }

                if (ok && includeSettingsReleasePath)
                {
                    var settingsPath = LocalDevSettingsReleasePathSmoke.Run(
                        controller,
                        new LocalDevSettingsReleasePathSmokeOptions
                        {
                            Seed = seed + "-settings",
                            ViewportWidth = 1920,
                            ViewportHeight = 1080,
                            ExpectedLocale = settingsLocale,
                            ExpectedSurfaceTheme = settingsSurfaceTheme,
                            ExpectedSoundEnabled = settingsSoundEnabled,
                            ExpectedLanShowOpponentPlayerZoneCards = settingsLanCardsVisible,
                            ExpectedLanShowOpponentGems = settingsLanGemsVisible,
                            CoverageGameMode = settingsGameMode,
                            CoverageReplaySetting = settingsReplaySetting,
                            CoverageRecoverySetting = settingsRecoverySetting,
                            CoverageFreshLaunch = settingsFreshLaunch,
                            CoverageInput = settingsInput,
                        }
                    );
                    report["settingsReleasePath"] = settingsPath;
                    ok = settingsPath.Value<bool>("ok");
                }

                if (ok && includeChromeReleasePath)
                {
                    var chromePath = LocalDevChromeReleasePathSmoke.Run(
                        controller,
                        new LocalDevChromeReleasePathSmokeOptions
                        {
                            Seed = seed + "-chrome",
                            ViewportWidth = 1920,
                            ViewportHeight = 1080,
                        }
                    );
                    report["chromeReleasePath"] = chromePath;
                    ok = chromePath.Value<bool>("ok");
                }

                if (ok && includeReplayReviewReleasePath)
                {
                    var replayReviewPath = LocalDevReplayReviewReleasePathSmoke.Run(
                        controller,
                        new LocalDevReplayReviewReleasePathSmokeOptions
                        {
                            Seed = seed + "-replay-review",
                            MaxSteps = Math.Max(2, maxSteps),
                            OutputDirectory = replayReviewReleasePathDirectory,
                            ViewportWidth = 1920,
                            ViewportHeight = 1080,
                            IdleActionPreference = idleActionPreference,
                        }
                    );
                    report["replayReviewReleasePath"] = replayReviewPath;
                    ok = replayReviewPath.Value<bool>("ok");
                }

                if (ok && includeInvalidActionReleasePath)
                {
                    var invalidActionPath = LocalDevInvalidActionReleasePathSmoke.Run(
                        controller,
                        new LocalDevInvalidActionReleasePathSmokeOptions
                        {
                            Seed = seed + "-invalid-action",
                            ViewportWidth = 1920,
                            ViewportHeight = 1080,
                        }
                    );
                    report["invalidActionReleasePath"] = invalidActionPath;
                    ok = invalidActionPath.Value<bool>("ok");
                }

                if (ok && includePeekModalReleasePath)
                {
                    var peekModalPath = LocalDevPeekModalReleasePathSmoke.Run(
                        controller,
                        new LocalDevPeekModalReleasePathSmokeOptions
                        {
                            Seed = seed,
                            ViewportWidth = 1920,
                            ViewportHeight = 1080,
                        }
                    );
                    report["peekModalReleasePath"] = peekModalPath;
                    ok = peekModalPath.Value<bool>("ok");
                }

                if (ok && includeRecoveryInvalidActionReleasePath)
                {
                    var recoveryInvalidActionPath = LocalDevRecoveryInvalidActionReleasePathSmoke.Run(
                        controller,
                        new LocalDevRecoveryInvalidActionReleasePathSmokeOptions
                        {
                            Seed = seed + "-recovery-invalid-action",
                            ViewportWidth = 1920,
                            ViewportHeight = 1080,
                        }
                    );
                    report["recoveryInvalidActionReleasePath"] = recoveryInvalidActionPath;
                    ok = recoveryInvalidActionPath.Value<bool>("ok");
                }

                if (ok && includePrivilegeCancelReleasePath)
                {
                    var privilegeCancelPath = LocalDevPrivilegeCancelReleasePathSmoke.Run(
                        controller,
                        new LocalDevPrivilegeCancelReleasePathSmokeOptions
                        {
                            Seed = seed,
                            ViewportWidth = 1920,
                            ViewportHeight = 1080,
                        }
                    );
                    report["privilegeCancelReleasePath"] = privilegeCancelPath;
                    ok = privilegeCancelPath.Value<bool>("ok");
                }

                if (ok && includeReservedDiscardReleasePath)
                {
                    var reservedDiscardPath = LocalDevReservedDiscardReleasePathSmoke.Run(
                        controller,
                        new LocalDevReservedDiscardReleasePathSmokeOptions
                        {
                            Seed = seed,
                            ViewportWidth = 1920,
                            ViewportHeight = 1080,
                        }
                    );
                    report["reservedDiscardReleasePath"] = reservedDiscardPath;
                    ok = reservedDiscardPath.Value<bool>("ok");
                }

                if (ok && includeReservedBuyReleasePath)
                {
                    var reservedBuyPath = LocalDevReservedBuyReleasePathSmoke.Run(
                        controller,
                        new LocalDevReservedBuyReleasePathSmokeOptions
                        {
                            Seed = seed,
                            ViewportWidth = 1920,
                            ViewportHeight = 1080,
                        }
                    );
                    report["reservedBuyReleasePath"] = reservedBuyPath;
                    ok = reservedBuyPath.Value<bool>("ok");
                }

                if (ok && includeReserveCancelReleasePath)
                {
                    var reserveCancelPath = LocalDevReserveCancelReleasePathSmoke.Run(
                        controller,
                        new LocalDevReserveCancelReleasePathSmokeOptions
                        {
                            Seed = seed,
                            ViewportWidth = 1920,
                            ViewportHeight = 1080,
                        }
                    );
                    report["reserveCancelReleasePath"] = reserveCancelPath;
                    ok = reserveCancelPath.Value<bool>("ok");
                }

                if (ok && includeReserveDeckReleasePath)
                {
                    var reserveDeckPath = LocalDevReserveDeckReleasePathSmoke.Run(
                        controller,
                        new LocalDevReserveDeckReleasePathSmokeOptions
                        {
                            Seed = seed,
                            ViewportWidth = 1920,
                            ViewportHeight = 1080,
                        }
                    );
                    report["reserveDeckReleasePath"] = reserveDeckPath;
                    ok = reserveDeckPath.Value<bool>("ok");
                }

                if (ok && includeReserveDeckCancelReleasePath)
                {
                    var reserveDeckCancelPath = LocalDevReserveDeckCancelReleasePathSmoke.Run(
                        controller,
                        new LocalDevReserveDeckCancelReleasePathSmokeOptions
                        {
                            Seed = seed,
                            ViewportWidth = 1920,
                            ViewportHeight = 1080,
                        }
                    );
                    report["reserveDeckCancelReleasePath"] = reserveDeckCancelPath;
                    ok = reserveDeckCancelPath.Value<bool>("ok");
                }

                if (ok && includeJokerReleasePath)
                {
                    var jokerPath = LocalDevJokerReleasePathSmoke.Run(
                        controller,
                        new LocalDevJokerReleasePathSmokeOptions
                        {
                            Seed = seed,
                            ViewportWidth = 1920,
                            ViewportHeight = 1080,
                        }
                    );
                    report["jokerReleasePath"] = jokerPath;
                    ok = jokerPath.Value<bool>("ok");
                }

                report["ok"] = ok;
                report["completedAt"] = DateTime.UtcNow.ToString("O");
            }
            catch (Exception ex)
            {
                report["ok"] = false;
                report["failureReason"] = ex.ToString();
                report["completedAt"] = DateTime.UtcNow.ToString("O");
            }

            if (!string.IsNullOrWhiteSpace(reportPath))
            {
                try
                {
                    var directory = Path.GetDirectoryName(reportPath);
                    if (!string.IsNullOrEmpty(directory))
                    {
                        Directory.CreateDirectory(directory);
                    }

                    File.WriteAllText(reportPath, report.ToString(Formatting.Indented));
                }
                catch (Exception ex)
                {
                    Debug.LogError("Failed to write built-player smoke report: " + ex);
                }
            }

            Debug.Log("GemDuel built-player smoke report: " + report.ToString(Formatting.None));
            Application.Quit(report.Value<bool>("ok") ? 0 : 1);
        }

        private static bool HasArg(string name)
        {
            return Array.IndexOf(Environment.GetCommandLineArgs(), name) >= 0;
        }

        private static string GetArgValue(string name)
        {
            var args = Environment.GetCommandLineArgs();
            for (var index = 0; index < args.Length - 1; index += 1)
            {
                if (args[index] == name)
                {
                    return args[index + 1];
                }
            }

            return null;
        }

        private static int ParseInt(string value, int fallback)
        {
            return int.TryParse(value, out var parsed) && parsed > 0 ? parsed : fallback;
        }

        private static bool ParseBoolArg(string value, bool fallback)
        {
            if (string.IsNullOrWhiteSpace(value))
            {
                return fallback;
            }

            if (value == "true" || value == "1" || value == "yes" || value == "sound-on")
            {
                return true;
            }

            if (value == "false" || value == "0" || value == "no" || value == "sound-off")
            {
                return false;
            }

            return fallback;
        }

        private static string NormalizeSettingsVisibility(string value)
        {
            if (value == "lan-cards-visible" || value == "lan-gems-visible")
            {
                return value;
            }

            return "lan-hidden";
        }

        private static string ResolveReplayReleasePathDirectory(string reportPath)
        {
            if (!string.IsNullOrWhiteSpace(reportPath))
            {
                var directory = Path.GetDirectoryName(reportPath);
                var reportName = Path.GetFileNameWithoutExtension(reportPath);
                if (!string.IsNullOrEmpty(directory) && !string.IsNullOrEmpty(reportName))
                {
                    return Path.Combine(directory, reportName + "-replay-release-path");
                }
            }

            return Path.Combine(Application.persistentDataPath, "gemduel-replay-release-path-smoke");
        }

        private static string ResolveReplayReviewReleasePathDirectory(string reportPath)
        {
            if (!string.IsNullOrWhiteSpace(reportPath))
            {
                var directory = Path.GetDirectoryName(reportPath);
                var reportName = Path.GetFileNameWithoutExtension(reportPath);
                if (!string.IsNullOrEmpty(directory) && !string.IsNullOrEmpty(reportName))
                {
                    return Path.Combine(directory, reportName + "-replay-review-release-path");
                }
            }

            return Path.Combine(Application.persistentDataPath, "gemduel-replay-review-release-path-smoke");
        }
    }
}
