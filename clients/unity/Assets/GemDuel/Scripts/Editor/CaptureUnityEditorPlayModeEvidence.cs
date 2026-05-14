using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using GemDuel.Catalog;
using GemDuel.Presentation;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;

namespace GemDuel.Editor
{
    [InitializeOnLoad]
    public static class CaptureUnityEditorPlayModeEvidence
    {
        private const string PendingKey = "GemDuel.EditorPlayModeEvidence.Pending";
        private const string OutputKey = "GemDuel.EditorPlayModeEvidence.Output";
        private const string ModeKey = "GemDuel.EditorPlayModeEvidence.Mode";
        private const string DirectMode = "direct-dispatch";
        private const string VisibleOsClickMode = "visible-os-click";
        private const string VisibleHoverProbeMode = "visible-hover-probe";
        private const string VisiblePreviewBlankDismissMode = "visible-preview-blank-dismiss";
        private const string SettingsSoundToggleMode = "settings-sound-toggle";
        private const string FixtureFileName = "local-pvp-royal-extra-turn-game-over.replay.json";
        private const string ScenePath = "Assets/GemDuel/Scenes/GemDuelGame.unity";
        private const int EvidenceWidth = 1920;
        private const int EvidenceHeight = 1080;
        private const int VisibleClickTimeoutTicks = 1800;
        private static int playModeTicks;
        private static bool evidenceRunning;
        private static bool visibleClickArmed;

        static CaptureUnityEditorPlayModeEvidence()
        {
            EditorApplication.update -= Tick;
            EditorApplication.update += Tick;
        }

        public static void CaptureBoonClick()
        {
            var outputRoot = GetArgumentValue("-gemduelPlayModeEvidenceOut")
                ?? RepositoryPaths.ResolveFromRoot(
                    "artifacts",
                    "unity",
                    "editor-playmode-evidence",
                    DateTime.UtcNow.ToString("yyyyMMdd-HHmmss")
                );
            Directory.CreateDirectory(outputRoot);

            EditorPrefs.SetBool(PendingKey, true);
            EditorPrefs.SetString(OutputKey, outputRoot);
            EditorPrefs.SetString(ModeKey, DirectMode);
            playModeTicks = 0;
            evidenceRunning = false;
            visibleClickArmed = false;
            EditorSceneManager.OpenScene(ScenePath, OpenSceneMode.Single);
            EditorApplication.EnterPlaymode();
        }

        public static void PrepareVisibleBoonClick()
        {
            var outputRoot = GetArgumentValue("-gemduelPlayModeEvidenceOut")
                ?? RepositoryPaths.ResolveFromRoot(
                    "artifacts",
                    "unity",
                    "editor-playmode-visible-click",
                    DateTime.UtcNow.ToString("yyyyMMdd-HHmmss")
                );
            Directory.CreateDirectory(outputRoot);

            EditorPrefs.SetBool(PendingKey, true);
            EditorPrefs.SetString(OutputKey, outputRoot);
            EditorPrefs.SetString(ModeKey, VisibleOsClickMode);
            playModeTicks = 0;
            evidenceRunning = false;
            visibleClickArmed = false;
            EditorSceneManager.OpenScene(ScenePath, OpenSceneMode.Single);
            EditorApplication.EnterPlaymode();
        }

        public static void PrepareVisibleHoverProbe()
        {
            var outputRoot = GetArgumentValue("-gemduelPlayModeEvidenceOut")
                ?? RepositoryPaths.ResolveFromRoot(
                    "artifacts",
                    "unity",
                    "editor-playmode-visible-hover",
                    DateTime.UtcNow.ToString("yyyyMMdd-HHmmss")
                );
            Directory.CreateDirectory(outputRoot);

            EditorPrefs.SetBool(PendingKey, true);
            EditorPrefs.SetString(OutputKey, outputRoot);
            EditorPrefs.SetString(ModeKey, VisibleHoverProbeMode);
            playModeTicks = 0;
            evidenceRunning = false;
            visibleClickArmed = false;
            EditorSceneManager.OpenScene(ScenePath, OpenSceneMode.Single);
            EditorApplication.EnterPlaymode();
        }

        public static void PrepareVisiblePreviewBlankDismiss()
        {
            var outputRoot = GetArgumentValue("-gemduelPlayModeEvidenceOut")
                ?? RepositoryPaths.ResolveFromRoot(
                    "artifacts",
                    "unity",
                    "editor-playmode-preview-blank-dismiss",
                    DateTime.UtcNow.ToString("yyyyMMdd-HHmmss")
                );
            Directory.CreateDirectory(outputRoot);

            EditorPrefs.SetBool(PendingKey, true);
            EditorPrefs.SetString(OutputKey, outputRoot);
            EditorPrefs.SetString(ModeKey, VisiblePreviewBlankDismissMode);
            playModeTicks = 0;
            evidenceRunning = false;
            visibleClickArmed = false;
            EditorSceneManager.OpenScene(ScenePath, OpenSceneMode.Single);
            EditorApplication.EnterPlaymode();
        }

        public static void CaptureSettingsSoundToggle()
        {
            var outputRoot = GetArgumentValue("-gemduelPlayModeEvidenceOut")
                ?? RepositoryPaths.ResolveFromRoot(
                    "artifacts",
                    "unity",
                    "editor-playmode-settings-sound",
                    DateTime.UtcNow.ToString("yyyyMMdd-HHmmss")
                );
            Directory.CreateDirectory(outputRoot);

            EditorPrefs.SetBool(PendingKey, true);
            EditorPrefs.SetString(OutputKey, outputRoot);
            EditorPrefs.SetString(ModeKey, SettingsSoundToggleMode);
            playModeTicks = 0;
            evidenceRunning = false;
            visibleClickArmed = false;
            EditorSceneManager.OpenScene(ScenePath, OpenSceneMode.Single);
            EditorApplication.EnterPlaymode();
        }

        private static void Tick()
        {
            if (!EditorPrefs.GetBool(PendingKey, false) || evidenceRunning)
            {
                return;
            }

            if (!EditorApplication.isPlaying || EditorApplication.isCompiling)
            {
                return;
            }

            playModeTicks += 1;
            if (playModeTicks < 20)
            {
                return;
            }

            try
            {
                evidenceRunning = true;
                var mode = EditorPrefs.GetString(ModeKey, DirectMode);
                if (mode == VisibleOsClickMode)
                {
                    TickVisibleOsClickEvidence();
                }
                else if (mode == VisibleHoverProbeMode)
                {
                    TickVisibleHoverProbeEvidence();
                }
                else if (mode == VisiblePreviewBlankDismissMode)
                {
                    TickVisiblePreviewBlankDismissEvidence();
                }
                else if (mode == SettingsSoundToggleMode)
                {
                    RunSettingsSoundToggleEvidence();
                    ClearPending();
                    if (Application.isBatchMode)
                    {
                        EditorApplication.Exit(0);
                    }
                }
                else
                {
                    RunEvidence();
                    ClearPending();
                    if (Application.isBatchMode)
                    {
                        EditorApplication.Exit(0);
                    }
                }
            }
            catch (Exception ex)
            {
                WriteFailure(ex);
                var mode = EditorPrefs.GetString(ModeKey, DirectMode);
                ClearPending();
                if (Application.isBatchMode || mode == VisibleOsClickMode)
                {
                    EditorApplication.Exit(1);
                }
                else
                {
                    Debug.LogException(ex);
                }
            }
            finally
            {
                evidenceRunning = false;
            }
        }

        private static void RunEvidence()
        {
            var outputRoot = EditorPrefs.GetString(
                OutputKey,
                RepositoryPaths.ResolveFromRoot("artifacts", "unity", "editor-playmode-evidence")
            );
            Directory.CreateDirectory(outputRoot);

            var slice = UnityEngine.Object.FindAnyObjectByType<GemDuelGameController>();
            var controller = UnityEngine.Object.FindAnyObjectByType<GemDuelInputController>();
            var camera = Camera.main;
            if (slice == null || controller == null || camera == null)
            {
                throw new InvalidOperationException("Unity Editor Play Mode did not create the GemDuel runtime input scene.");
            }

            slice.SetAutomationViewport(EvidenceWidth, EvidenceHeight);
            var beforeState = WaitForDraftTargets(slice);
            var beforeTargets = ClickableBuffTargets(beforeState);
            var beforeTargetError = ValidateDraftTargets(
                beforeTargets,
                "before click",
                new[] { "collector", "royal_envoy", "minimalist" }
            );
            if (!string.IsNullOrEmpty(beforeTargetError))
            {
                throw new InvalidOperationException(beforeTargetError);
            }

            var beforeStatePath = Path.Combine(outputRoot, "before-boon-click-state.json");
            var beforeScreenshotPath = Path.Combine(outputRoot, "before-boon-click.png");
            File.WriteAllText(beforeStatePath, beforeState.ToString(Formatting.Indented));
            CaptureScreenshot(beforeScreenshotPath, EvidenceWidth, EvidenceHeight);

            var target = UnityEngine.Object
                .FindObjectsByType<GemDuelViewTarget>()
                .Where(candidate =>
                    candidate.Clickable
                    && candidate.Kind == "Buff"
                    && candidate.BuffId == "royal_envoy"
                )
                .OrderBy(candidate => candidate.Index)
                .FirstOrDefault();
            if (target == null)
            {
                throw new InvalidOperationException("No clickable royal_envoy draft boon target was visible in Play Mode.");
            }

            var screenPoint = camera.WorldToScreenPoint(target.transform.position);
            var dispatchOk = controller.TryDispatchScreenPointForEvidence(screenPoint, out var dispatchDetail);
            var afterState = slice.BuildAutomationStateSnapshot(EvidenceWidth, EvidenceHeight);
            var afterStatePath = Path.Combine(outputRoot, "after-boon-click-state.json");
            var afterScreenshotPath = Path.Combine(outputRoot, "after-boon-click.png");
            File.WriteAllText(afterStatePath, afterState.ToString(Formatting.Indented));
            CaptureScreenshot(afterScreenshotPath, EvidenceWidth, EvidenceHeight);

            var afterSnapshot = (JObject)afterState["snapshot"];
            var afterTargets = ClickableBuffTargets(afterState);
            var afterTargetError = ValidateDraftTargets(
                afterTargets,
                "after click",
                new[] { "royal_envoy", "echo_reservoir", "collector", "minimalist" }
            );
            var actionOk =
                dispatchOk
                && afterSnapshot.Value<string>("phase") == "DRAFT_PHASE"
                && afterSnapshot.Value<string>("turn") == "p2"
                && afterSnapshot.Value<string>("p1SelectedBuffId") == "royal_envoy"
                && string.IsNullOrEmpty(afterTargetError);
            var evidence = new JObject
            {
                ["source"] = "unity-editor-play-mode",
                ["scene"] = ScenePath,
                ["isPlaying"] = EditorApplication.isPlaying,
                ["viewport"] = new JObject
                {
                    ["width"] = EvidenceWidth,
                    ["height"] = EvidenceHeight,
                },
                ["beforeStatePath"] = beforeStatePath,
                ["beforeScreenshotPath"] = beforeScreenshotPath,
                ["afterStatePath"] = afterStatePath,
                ["afterScreenshotPath"] = afterScreenshotPath,
                ["visibleTargetCheck"] = new JObject
                {
                    ["beforeClickableBuffTargetCount"] = beforeTargets.Count,
                    ["beforeTargets"] = SummarizeTargets(beforeTargets),
                    ["afterClickableBuffTargetCount"] = afterTargets.Count,
                    ["afterTargets"] = SummarizeTargets(afterTargets),
                    ["afterError"] = afterTargetError,
                },
                ["action"] = new JObject
                {
                    ["intent"] = "click visible level-3 royal_envoy boon card",
                    ["driver"] = "GemDuelInputController.TryDispatchScreenPointForEvidence",
                    ["sharesManualPath"] =
                        "GemDuelInputController.Update calls this same screen-point dispatch after Input.GetMouseButtonDown(0).",
                    ["screenPoint"] = new JObject
                    {
                        ["x"] = screenPoint.x,
                        ["y"] = screenPoint.y,
                        ["z"] = screenPoint.z,
                    },
                    ["target"] = new JObject
                    {
                        ["kind"] = target.Kind,
                        ["eventType"] = target.EventType,
                        ["index"] = target.Index,
                        ["buffId"] = target.BuffId,
                        ["clickable"] = target.Clickable,
                    },
                    ["dispatchOk"] = dispatchOk,
                    ["dispatchDetail"] = dispatchDetail,
                },
                ["result"] = new JObject
                {
                    ["ok"] = actionOk,
                    ["afterPhase"] = afterSnapshot.Value<string>("phase"),
                    ["afterTurn"] = afterSnapshot.Value<string>("turn"),
                    ["p1SelectedBuffId"] = afterSnapshot.Value<string>("p1SelectedBuffId"),
                },
            };

            var evidencePath = Path.Combine(outputRoot, "editor-playmode-boon-click-evidence.json");
            File.WriteAllText(evidencePath, evidence.ToString(Formatting.Indented));
            if (!actionOk)
            {
                throw new InvalidOperationException("Unity Editor Play Mode boon click evidence failed: " + evidence);
            }

            Debug.Log("GemDuel Unity Editor Play Mode evidence written: " + evidencePath);
        }

        private static void RunSettingsSoundToggleEvidence()
        {
            var outputRoot = EditorPrefs.GetString(
                OutputKey,
                RepositoryPaths.ResolveFromRoot("artifacts", "unity", "editor-playmode-settings-sound")
            );
            Directory.CreateDirectory(outputRoot);

            var slice = UnityEngine.Object.FindAnyObjectByType<GemDuelGameController>();
            var controller = UnityEngine.Object.FindAnyObjectByType<GemDuelInputController>();
            var camera = Camera.main;
            if (slice == null || controller == null || camera == null)
            {
                throw new InvalidOperationException("Unity Editor Play Mode did not create the GemDuel runtime input scene.");
            }

            slice.SetAutomationViewport(EvidenceWidth, EvidenceHeight);
            slice.LoadFixtureForRuntime(FixtureFileName);
            if (!slice.ApplyFixtureEventsForAutomation(2, out var prepareError))
            {
                throw new InvalidOperationException("Could not prepare settings evidence fixture state: " + prepareError);
            }

            var beforeState = slice.BuildAutomationStateSnapshot(EvidenceWidth, EvidenceHeight);
            var beforeStatePath = Path.Combine(outputRoot, "before-settings-open-state.json");
            var beforeScreenshotPath = Path.Combine(outputRoot, "before-settings-open.png");
            File.WriteAllText(beforeStatePath, beforeState.ToString(Formatting.Indented));
            CaptureScreenshot(beforeScreenshotPath, EvidenceWidth, EvidenceHeight);

            var settingsTarget = FindClickableRuntimeTarget(
                target => target.Kind == "ActionButton" && target.EventType == "open_settings",
                "settings topbar button"
            );
            var settingsScreenPoint = camera.WorldToScreenPoint(settingsTarget.transform.position);
            var settingsDispatchOk = controller.TryDispatchScreenPointForEvidence(
                settingsScreenPoint,
                out var settingsDispatchDetail
            );
            var openedState = slice.BuildAutomationStateSnapshot(EvidenceWidth, EvidenceHeight);
            var openedStatePath = Path.Combine(outputRoot, "after-settings-open-state.json");
            var openedScreenshotPath = Path.Combine(outputRoot, "after-settings-open.png");
            File.WriteAllText(openedStatePath, openedState.ToString(Formatting.Indented));
            CaptureScreenshot(openedScreenshotPath, EvidenceWidth, EvidenceHeight);
            var openedSettings = (JObject)openedState["settings"];
            var openedSoundEnabled = openedSettings.Value<bool>("soundEnabled");

            var soundTarget = FindClickableRuntimeTarget(
                target => target.Kind == "SettingsControl" && target.EventType == "settings-sound-toggle",
                "settings sound toggle"
            );
            var soundScreenPoint = camera.WorldToScreenPoint(soundTarget.transform.position);
            var soundDispatchOk = controller.TryDispatchScreenPointForEvidence(
                soundScreenPoint,
                out var soundDispatchDetail
            );
            var afterState = slice.BuildAutomationStateSnapshot(EvidenceWidth, EvidenceHeight);
            var afterStatePath = Path.Combine(outputRoot, "after-settings-sound-toggle-state.json");
            var afterScreenshotPath = Path.Combine(outputRoot, "after-settings-sound-toggle.png");
            File.WriteAllText(afterStatePath, afterState.ToString(Formatting.Indented));
            CaptureScreenshot(afterScreenshotPath, EvidenceWidth, EvidenceHeight);

            var settings = (JObject)afterState["settings"];
            var persistence = (JObject)settings["persistence"];
            var actionOk =
                settingsDispatchOk
                && soundDispatchOk
                && settings.Value<bool>("panelOpen")
                && settings.Value<bool>("soundEnabled") != openedSoundEnabled
                && persistence.Value<string>("status") == "saved";
            var evidence = new JObject
            {
                ["source"] = "unity-editor-play-mode-settings-sound",
                ["scene"] = ScenePath,
                ["isPlaying"] = EditorApplication.isPlaying,
                ["viewport"] = new JObject
                {
                    ["width"] = EvidenceWidth,
                    ["height"] = EvidenceHeight,
                },
                ["beforeStatePath"] = beforeStatePath,
                ["beforeScreenshotPath"] = beforeScreenshotPath,
                ["openedStatePath"] = openedStatePath,
                ["openedScreenshotPath"] = openedScreenshotPath,
                ["afterStatePath"] = afterStatePath,
                ["afterScreenshotPath"] = afterScreenshotPath,
                ["action"] = new JObject
                {
                    ["intent"] = "open settings and toggle sound through Unity runtime input targets",
                    ["driver"] = "GemDuelInputController.TryDispatchScreenPointForEvidence",
                    ["settingsOpenDispatchOk"] = settingsDispatchOk,
                    ["settingsOpenDispatchDetail"] = settingsDispatchDetail,
                    ["settingsScreenPoint"] = new JObject
                    {
                        ["x"] = settingsScreenPoint.x,
                        ["y"] = settingsScreenPoint.y,
                        ["z"] = settingsScreenPoint.z,
                    },
                    ["soundDispatchOk"] = soundDispatchOk,
                    ["soundDispatchDetail"] = soundDispatchDetail,
                    ["soundScreenPoint"] = new JObject
                    {
                        ["x"] = soundScreenPoint.x,
                        ["y"] = soundScreenPoint.y,
                        ["z"] = soundScreenPoint.z,
                    },
                    ["soundTarget"] = DescribeRuntimeTarget(soundTarget),
                },
                ["result"] = new JObject
                {
                    ["ok"] = actionOk,
                    ["soundEnabledBeforeClick"] = openedSoundEnabled,
                    ["soundEnabledAfterClick"] = settings.Value<bool>("soundEnabled"),
                    ["settings"] = settings,
                },
            };

            var evidencePath = Path.Combine(outputRoot, "editor-playmode-settings-sound-evidence.json");
            File.WriteAllText(evidencePath, evidence.ToString(Formatting.Indented));
            if (!actionOk)
            {
                throw new InvalidOperationException("Unity Editor Play Mode settings evidence failed: " + evidence);
            }

            Debug.Log("GemDuel Unity Editor settings evidence written: " + evidencePath);
        }

        private static void TickVisibleOsClickEvidence()
        {
            var outputRoot = EditorPrefs.GetString(
                OutputKey,
                RepositoryPaths.ResolveFromRoot("artifacts", "unity", "editor-playmode-visible-click")
            );
            Directory.CreateDirectory(outputRoot);

            if (!visibleClickArmed)
            {
                ArmVisibleOsClickEvidence(outputRoot);
                visibleClickArmed = true;
                return;
            }

            if (playModeTicks > VisibleClickTimeoutTicks)
            {
                throw new TimeoutException(
                    "Unity Editor Play Mode did not receive the external OS boon click before timeout."
                );
            }

            var slice = UnityEngine.Object.FindAnyObjectByType<GemDuelGameController>();
            var controller = UnityEngine.Object.FindAnyObjectByType<GemDuelInputController>();
            if (slice == null || controller == null)
            {
                throw new InvalidOperationException("Unity Editor Play Mode lost the GemDuel runtime scene.");
            }

            var afterState = slice.BuildAutomationStateSnapshot(EvidenceWidth, EvidenceHeight);
            var afterSnapshot = (JObject)afterState["snapshot"];
            var selectionAdvanced =
                afterSnapshot.Value<string>("phase") == "DRAFT_PHASE"
                && afterSnapshot.Value<string>("turn") == "p2"
                && afterSnapshot.Value<string>("p1SelectedBuffId") == "royal_envoy";
            if (!selectionAdvanced)
            {
                return;
            }

            var afterTargets = ClickableBuffTargets(afterState);
            var afterTargetError = ValidateDraftTargets(
                afterTargets,
                "after visible OS click",
                new[] { "royal_envoy", "echo_reservoir", "collector", "minimalist" }
            );
            var actionOk = controller.LastMouseDispatchOk && string.IsNullOrEmpty(afterTargetError);
            var afterStatePath = Path.Combine(outputRoot, "after-visible-os-click-state.json");
            var afterScreenshotPath = Path.Combine(outputRoot, "after-visible-os-click.png");
            File.WriteAllText(afterStatePath, afterState.ToString(Formatting.Indented));
            CaptureScreenshot(afterScreenshotPath, EvidenceWidth, EvidenceHeight);

            var evidence = new JObject
            {
                ["source"] = "unity-editor-play-mode-visible-os-click",
                ["scene"] = ScenePath,
                ["isPlaying"] = EditorApplication.isPlaying,
                ["pendingClickPath"] = Path.Combine(outputRoot, "pending-visible-os-click.json"),
                ["afterStatePath"] = afterStatePath,
                ["afterScreenshotPath"] = afterScreenshotPath,
                ["visibleTargetCheck"] = new JObject
                {
                    ["afterClickableBuffTargetCount"] = afterTargets.Count,
                    ["afterTargets"] = SummarizeTargets(afterTargets),
                    ["afterError"] = afterTargetError,
                },
                ["action"] = new JObject
                {
                    ["intent"] = "external OS mouse click on visible level-3 royal_envoy boon card",
                    ["driver"] = "Input.GetMouseButtonDown(0) -> GemDuelInputController.Update -> TryDispatchScreenPointForEvidence",
                    ["lastMouseDispatchOk"] = controller.LastMouseDispatchOk,
                    ["lastMouseDispatchDetail"] = controller.LastMouseDispatchDetail,
                    ["lastMouseDispatchScreenPosition"] = new JObject
                    {
                        ["x"] = controller.LastMouseDispatchScreenPosition.x,
                        ["y"] = controller.LastMouseDispatchScreenPosition.y,
                        ["z"] = controller.LastMouseDispatchScreenPosition.z,
                    },
                },
                ["result"] = new JObject
                {
                    ["ok"] = actionOk,
                    ["afterPhase"] = afterSnapshot.Value<string>("phase"),
                    ["afterTurn"] = afterSnapshot.Value<string>("turn"),
                    ["p1SelectedBuffId"] = afterSnapshot.Value<string>("p1SelectedBuffId"),
                },
            };

            var evidencePath = Path.Combine(outputRoot, "visible-os-click-evidence.json");
            File.WriteAllText(evidencePath, evidence.ToString(Formatting.Indented));
            if (!actionOk)
            {
                throw new InvalidOperationException("Unity visible OS click evidence failed: " + evidence);
            }

            Debug.Log("GemDuel Unity Editor visible OS click evidence written: " + evidencePath);
            ClearPending();
            EditorApplication.Exit(0);
        }

        private static void TickVisibleHoverProbeEvidence()
        {
            var outputRoot = EditorPrefs.GetString(
                OutputKey,
                RepositoryPaths.ResolveFromRoot("artifacts", "unity", "editor-playmode-visible-hover")
            );
            Directory.CreateDirectory(outputRoot);

            if (!visibleClickArmed)
            {
                ArmVisibleHoverProbeEvidence(outputRoot);
                visibleClickArmed = true;
                return;
            }

            if (playModeTicks > VisibleClickTimeoutTicks)
            {
                throw new TimeoutException(
                    "Unity Editor Play Mode did not receive the external OS hover before timeout."
                );
            }

            var slice = UnityEngine.Object.FindAnyObjectByType<GemDuelGameController>();
            var controller = UnityEngine.Object.FindAnyObjectByType<GemDuelInputController>();
            var camera = Camera.main;
            if (slice == null || controller == null || camera == null)
            {
                throw new InvalidOperationException("Unity Editor Play Mode lost the GemDuel runtime scene.");
            }

            var mousePosition = Input.mousePosition;
            var hitTarget = GemDuelInputController.FindVisibleTargetAtWorld(camera.ScreenToWorldPoint(mousePosition));
            if (hitTarget == null || hitTarget.Kind != "Buff" || hitTarget.BuffId != "royal_envoy")
            {
                return;
            }

            var hitTargetDescription = DescribeRuntimeTarget(hitTarget);
            var hoverDispatch = TryInvokeHoverDispatch(controller, mousePosition);
            var afterState = slice.BuildAutomationStateSnapshot(EvidenceWidth, EvidenceHeight);
            var afterStatePath = Path.Combine(outputRoot, "after-visible-hover-state.json");
            var afterScreenshotPath = Path.Combine(outputRoot, "after-visible-hover.png");
            File.WriteAllText(afterStatePath, afterState.ToString(Formatting.Indented));
            CaptureScreenshot(afterScreenshotPath, EvidenceWidth, EvidenceHeight);

            var hoverState = afterState["hover"] as JObject;
            var actionOk =
                hoverDispatch.MethodAvailable
                && hoverDispatch.DispatchOk
                && hoverState != null
                && hoverState.Value<string>("semanticKey") == "draft.buff.1"
                && hoverState.Value<string>("buffId") == "royal_envoy";
            var evidence = new JObject
            {
                ["source"] = "unity-editor-play-mode-visible-hover",
                ["scene"] = ScenePath,
                ["isPlaying"] = EditorApplication.isPlaying,
                ["pendingHoverPath"] = Path.Combine(outputRoot, "pending-visible-hover.json"),
                ["afterStatePath"] = afterStatePath,
                ["afterScreenshotPath"] = afterScreenshotPath,
                ["action"] = new JObject
                {
                    ["intent"] = "external OS mouse hover over visible level-3 royal_envoy boon card",
                    ["driver"] = "Input.mousePosition -> GemDuelInputController hover dispatch",
                    ["mousePosition"] = new JObject
                    {
                        ["x"] = mousePosition.x,
                        ["y"] = mousePosition.y,
                        ["z"] = mousePosition.z,
                    },
                    ["hitTarget"] = hitTargetDescription,
                    ["hoverDispatchMethodAvailable"] = hoverDispatch.MethodAvailable,
                    ["hoverDispatchOk"] = hoverDispatch.DispatchOk,
                    ["hoverDispatchDetail"] = hoverDispatch.Detail,
                },
                ["result"] = new JObject
                {
                    ["ok"] = actionOk,
                    ["hover"] = hoverState,
                },
            };

            var evidencePath = Path.Combine(outputRoot, "visible-hover-evidence.json");
            File.WriteAllText(evidencePath, evidence.ToString(Formatting.Indented));
            ClearPending();
            EditorApplication.Exit(actionOk ? 0 : 1);
        }

        private static void TickVisiblePreviewBlankDismissEvidence()
        {
            var outputRoot = EditorPrefs.GetString(
                OutputKey,
                RepositoryPaths.ResolveFromRoot("artifacts", "unity", "editor-playmode-preview-blank-dismiss")
            );
            Directory.CreateDirectory(outputRoot);

            if (!visibleClickArmed)
            {
                ArmVisiblePreviewBlankDismissEvidence(outputRoot);
                visibleClickArmed = true;
                return;
            }

            if (playModeTicks > VisibleClickTimeoutTicks)
            {
                throw new TimeoutException(
                    "Unity Editor Play Mode did not receive the external OS preview blank-area click before timeout."
                );
            }

            var slice = UnityEngine.Object.FindAnyObjectByType<GemDuelGameController>();
            var controller = UnityEngine.Object.FindAnyObjectByType<GemDuelInputController>();
            if (slice == null || controller == null)
            {
                throw new InvalidOperationException("Unity Editor Play Mode lost the GemDuel runtime scene.");
            }

            if (controller.LastMouseDispatchScreenPosition == Vector3.zero)
            {
                return;
            }

            var afterState = slice.BuildAutomationStateSnapshot(EvidenceWidth, EvidenceHeight);
            var afterPreview = afterState["preview"] as JObject;
            var afterStatePath = Path.Combine(outputRoot, "after-visible-blank-click-state.json");
            var afterScreenshotPath = Path.Combine(outputRoot, "after-visible-blank-click.png");
            File.WriteAllText(afterStatePath, afterState.ToString(Formatting.Indented));
            CaptureScreenshot(afterScreenshotPath, EvidenceWidth, EvidenceHeight);

            var actionOk = controller.LastMouseDispatchOk && afterPreview == null;
            var evidence = new JObject
            {
                ["source"] = "unity-editor-play-mode-visible-preview-blank-dismiss",
                ["scene"] = ScenePath,
                ["isPlaying"] = EditorApplication.isPlaying,
                ["pendingClickPath"] = Path.Combine(outputRoot, "pending-visible-blank-click.json"),
                ["afterStatePath"] = afterStatePath,
                ["afterScreenshotPath"] = afterScreenshotPath,
                ["action"] = new JObject
                {
                    ["intent"] = "external OS mouse click on blank/background area of an open card preview",
                    ["driver"] = "Input.GetMouseButtonDown(0) -> GemDuelInputController.Update -> TryDispatchScreenPointForEvidence",
                    ["lastMouseDispatchOk"] = controller.LastMouseDispatchOk,
                    ["lastMouseDispatchDetail"] = controller.LastMouseDispatchDetail,
                    ["lastMouseDispatchScreenPosition"] = new JObject
                    {
                        ["x"] = controller.LastMouseDispatchScreenPosition.x,
                        ["y"] = controller.LastMouseDispatchScreenPosition.y,
                        ["z"] = controller.LastMouseDispatchScreenPosition.z,
                    },
                },
                ["result"] = new JObject
                {
                    ["ok"] = actionOk,
                    ["previewClosed"] = afterPreview == null,
                    ["preview"] = afterPreview,
                },
            };

            var evidencePath = Path.Combine(outputRoot, "visible-preview-blank-dismiss-evidence.json");
            File.WriteAllText(evidencePath, evidence.ToString(Formatting.Indented));
            ClearPending();
            EditorApplication.Exit(actionOk ? 0 : 1);
        }

        private static void ArmVisibleOsClickEvidence(string outputRoot)
        {
            var slice = UnityEngine.Object.FindAnyObjectByType<GemDuelGameController>();
            var controller = UnityEngine.Object.FindAnyObjectByType<GemDuelInputController>();
            var camera = Camera.main;
            if (slice == null || controller == null || camera == null)
            {
                throw new InvalidOperationException("Unity Editor Play Mode did not create the GemDuel runtime input scene.");
            }

            slice.SetAutomationViewport(EvidenceWidth, EvidenceHeight);
            var beforeState = WaitForDraftTargets(slice);
            var beforeTargets = ClickableBuffTargets(beforeState);
            var beforeTargetError = ValidateDraftTargets(
                beforeTargets,
                "before visible OS click",
                new[] { "collector", "royal_envoy", "minimalist" }
            );
            if (!string.IsNullOrEmpty(beforeTargetError))
            {
                throw new InvalidOperationException(beforeTargetError);
            }

            var target = FindClickableBuffTarget("royal_envoy");
            var screenPoint = camera.WorldToScreenPoint(target.transform.position);
            var gameView = FocusGameView();
            var gameViewPosition = gameView.position;
            var pixelsPerPoint = EditorGUIUtility.pixelsPerPoint;
            var osClickX =
                gameViewPosition.x + screenPoint.x / Math.Max(1f, camera.pixelWidth) * gameViewPosition.width;
            var osClickY =
                gameViewPosition.y + (1f - screenPoint.y / Math.Max(1f, camera.pixelHeight)) * gameViewPosition.height;

            var beforeStatePath = Path.Combine(outputRoot, "before-visible-os-click-state.json");
            var beforeScreenshotPath = Path.Combine(outputRoot, "before-visible-os-click.png");
            File.WriteAllText(beforeStatePath, beforeState.ToString(Formatting.Indented));
            CaptureScreenshot(beforeScreenshotPath, EvidenceWidth, EvidenceHeight);

            var pending = new JObject
            {
                ["source"] = "unity-editor-play-mode-visible-os-click",
                ["readyForExternalClick"] = true,
                ["beforeStatePath"] = beforeStatePath,
                ["beforeScreenshotPath"] = beforeScreenshotPath,
                ["gameView"] = new JObject
                {
                    ["x"] = gameViewPosition.x,
                    ["y"] = gameViewPosition.y,
                    ["width"] = gameViewPosition.width,
                    ["height"] = gameViewPosition.height,
                    ["pixelsPerPoint"] = pixelsPerPoint,
                },
                ["camera"] = new JObject
                {
                    ["pixelWidth"] = camera.pixelWidth,
                    ["pixelHeight"] = camera.pixelHeight,
                },
                ["target"] = new JObject
                {
                    ["kind"] = target.Kind,
                    ["eventType"] = target.EventType,
                    ["index"] = target.Index,
                    ["buffId"] = target.BuffId,
                    ["clickable"] = target.Clickable,
                },
                ["targetScreenPoint"] = new JObject
                {
                    ["x"] = screenPoint.x,
                    ["y"] = screenPoint.y,
                    ["z"] = screenPoint.z,
                },
                ["osClick"] = new JObject
                {
                    ["coordinateSpace"] = "Windows desktop pixels",
                    ["x"] = (int)Math.Round(osClickX),
                    ["y"] = (int)Math.Round(osClickY),
                },
            };
            var pendingPath = Path.Combine(outputRoot, "pending-visible-os-click.json");
            File.WriteAllText(pendingPath, pending.ToString(Formatting.Indented));
            Debug.Log("GemDuel Unity Editor visible OS click is armed: " + pendingPath);
        }

        private static void ArmVisibleHoverProbeEvidence(string outputRoot)
        {
            var slice = UnityEngine.Object.FindAnyObjectByType<GemDuelGameController>();
            var camera = Camera.main;
            if (slice == null || camera == null)
            {
                throw new InvalidOperationException("Unity Editor Play Mode did not create the GemDuel runtime input scene.");
            }

            slice.SetAutomationViewport(EvidenceWidth, EvidenceHeight);
            var beforeState = WaitForDraftTargets(slice);
            var target = FindClickableBuffTarget("royal_envoy");
            var screenPoint = camera.WorldToScreenPoint(target.transform.position);
            var osPoint = BuildOsPointForGameView(screenPoint, camera);

            var beforeStatePath = Path.Combine(outputRoot, "before-visible-hover-state.json");
            var beforeScreenshotPath = Path.Combine(outputRoot, "before-visible-hover.png");
            File.WriteAllText(beforeStatePath, beforeState.ToString(Formatting.Indented));
            CaptureScreenshot(beforeScreenshotPath, EvidenceWidth, EvidenceHeight);

            var pending = new JObject
            {
                ["source"] = "unity-editor-play-mode-visible-hover",
                ["readyForExternalHover"] = true,
                ["beforeStatePath"] = beforeStatePath,
                ["beforeScreenshotPath"] = beforeScreenshotPath,
                ["target"] = DescribeRuntimeTarget(target),
                ["targetScreenPoint"] = new JObject
                {
                    ["x"] = screenPoint.x,
                    ["y"] = screenPoint.y,
                    ["z"] = screenPoint.z,
                },
                ["osHover"] = osPoint,
            };
            var pendingPath = Path.Combine(outputRoot, "pending-visible-hover.json");
            File.WriteAllText(pendingPath, pending.ToString(Formatting.Indented));
            Debug.Log("GemDuel Unity Editor visible hover probe is armed: " + pendingPath);
        }

        private static void ArmVisiblePreviewBlankDismissEvidence(string outputRoot)
        {
            var slice = UnityEngine.Object.FindAnyObjectByType<GemDuelGameController>();
            var camera = Camera.main;
            if (slice == null || camera == null)
            {
                throw new InvalidOperationException("Unity Editor Play Mode did not create the GemDuel runtime input scene.");
            }

            slice.SetAutomationViewport(EvidenceWidth, EvidenceHeight);
            if (!slice.ApplyFixtureEventsForAutomation(2, out var prepareError))
            {
                throw new InvalidOperationException("Could not prepare post-draft preview state: " + prepareError);
            }

            if (
                !slice.RunSemanticActionForAutomation(
                    "click_market_card",
                    new JObject { ["level"] = 1, ["index"] = 0 },
                    out var previewError
                )
            )
            {
                throw new InvalidOperationException("Could not open preview through Unity hit target: " + previewError);
            }

            var beforeState = slice.BuildAutomationStateSnapshot(EvidenceWidth, EvidenceHeight);
            if (beforeState["preview"] == null)
            {
                throw new InvalidOperationException("Preview did not open before blank-dismiss evidence was armed.");
            }

            var blankScreenPoint = camera.ViewportToScreenPoint(new Vector3(240f / EvidenceWidth, 1f - 280f / EvidenceHeight, 0f));
            var osPoint = BuildOsPointForGameView(blankScreenPoint, camera);

            var beforeStatePath = Path.Combine(outputRoot, "before-visible-blank-click-state.json");
            var beforeScreenshotPath = Path.Combine(outputRoot, "before-visible-blank-click.png");
            File.WriteAllText(beforeStatePath, beforeState.ToString(Formatting.Indented));
            CaptureScreenshot(beforeScreenshotPath, EvidenceWidth, EvidenceHeight);

            var pending = new JObject
            {
                ["source"] = "unity-editor-play-mode-visible-preview-blank-dismiss",
                ["readyForExternalClick"] = true,
                ["beforeStatePath"] = beforeStatePath,
                ["beforeScreenshotPath"] = beforeScreenshotPath,
                ["target"] = new JObject
                {
                    ["kind"] = "PreviewBackdropBlankArea",
                    ["referenceViewportX"] = 240,
                    ["referenceViewportY"] = 280,
                },
                ["targetScreenPoint"] = new JObject
                {
                    ["x"] = blankScreenPoint.x,
                    ["y"] = blankScreenPoint.y,
                    ["z"] = blankScreenPoint.z,
                },
                ["osClick"] = osPoint,
            };
            var pendingPath = Path.Combine(outputRoot, "pending-visible-blank-click.json");
            File.WriteAllText(pendingPath, pending.ToString(Formatting.Indented));
            Debug.Log("GemDuel Unity Editor visible preview blank-dismiss click is armed: " + pendingPath);
        }

        private static JObject BuildOsPointForGameView(Vector3 screenPoint, Camera camera)
        {
            var gameView = FocusGameView();
            var gameViewPosition = gameView.position;
            var pixelsPerPoint = EditorGUIUtility.pixelsPerPoint;
            var osClickX =
                gameViewPosition.x + screenPoint.x / Math.Max(1f, camera.pixelWidth) * gameViewPosition.width;
            var osClickY =
                gameViewPosition.y + (1f - screenPoint.y / Math.Max(1f, camera.pixelHeight)) * gameViewPosition.height;

            return new JObject
            {
                ["coordinateSpace"] = "Windows desktop pixels",
                ["x"] = (int)Math.Round(osClickX),
                ["y"] = (int)Math.Round(osClickY),
                ["gameView"] = new JObject
                {
                    ["x"] = gameViewPosition.x,
                    ["y"] = gameViewPosition.y,
                    ["width"] = gameViewPosition.width,
                    ["height"] = gameViewPosition.height,
                    ["pixelsPerPoint"] = pixelsPerPoint,
                },
                ["camera"] = new JObject
                {
                    ["pixelWidth"] = camera.pixelWidth,
                    ["pixelHeight"] = camera.pixelHeight,
                },
            };
        }

        private static (bool MethodAvailable, bool DispatchOk, string Detail) TryInvokeHoverDispatch(
            GemDuelInputController controller,
            Vector3 screenPoint
        )
        {
            var method = typeof(GemDuelInputController).GetMethod("TryHoverScreenPointForEvidence");
            if (method == null)
            {
                return (false, false, "GemDuelInputController.TryHoverScreenPointForEvidence is not implemented.");
            }

            var args = new object[] { screenPoint, null };
            var ok = (bool)method.Invoke(controller, args);
            return (true, ok, args[1] as string ?? string.Empty);
        }

        private static JObject DescribeRuntimeTarget(GemDuelViewTarget target)
        {
            if (target == null)
            {
                return null;
            }

            return new JObject
            {
                ["kind"] = target.Kind,
                ["eventType"] = target.EventType,
                ["semanticKey"] = target.SemanticKey,
                ["index"] = target.Index,
                ["level"] = target.Level,
                ["instanceId"] = target.InstanceId,
                ["buffId"] = target.BuffId,
                ["clickable"] = target.Clickable,
            };
        }

        private static GemDuelViewTarget FindClickableBuffTarget(string buffId)
        {
            var target = FindClickableRuntimeTarget(
                candidate => candidate.Kind == "Buff" && candidate.BuffId == buffId,
                buffId + " draft boon"
            );
            if (target == null)
            {
                throw new InvalidOperationException("No clickable " + buffId + " draft boon target was visible in Play Mode.");
            }

            return target;
        }

        private static GemDuelViewTarget FindClickableRuntimeTarget(
            Func<GemDuelViewTarget, bool> predicate,
            string description
        )
        {
            var target = UnityEngine.Object
                .FindObjectsByType<GemDuelViewTarget>()
                .Where(candidate => candidate.Clickable && predicate(candidate))
                .OrderBy(candidate => candidate.Index < 0 ? int.MaxValue : candidate.Index)
                .FirstOrDefault();
            if (target == null)
            {
                throw new InvalidOperationException("No clickable " + description + " target was visible in Play Mode.");
            }

            return target;
        }

        private static EditorWindow FocusGameView()
        {
            var gameViewType = typeof(EditorWindow).Assembly.GetType("UnityEditor.GameView");
            if (gameViewType == null)
            {
                throw new InvalidOperationException("UnityEditor.GameView type was not available.");
            }

            var gameView = EditorWindow.GetWindow(gameViewType);
            gameView.Show();
            gameView.Focus();
            gameView.Repaint();
            return gameView;
        }

        private static JObject WaitForDraftTargets(GemDuelGameController slice)
        {
            for (var attempt = 0; attempt < 120; attempt += 1)
            {
                var state = slice.BuildAutomationStateSnapshot(EvidenceWidth, EvidenceHeight);
                var targets = ClickableBuffTargets(state);
                if (targets.Count >= 3)
                {
                    return state;
                }
            }

            throw new InvalidOperationException("Unity Editor Play Mode did not render clickable draft boon targets.");
        }

        private static List<JObject> ClickableBuffTargets(JObject state)
        {
            return ((JArray)state["visibleTargets"])
                .OfType<JObject>()
                .Where(target =>
                    target.Value<string>("kind") == "Buff"
                    && target.Value<bool?>("clickable") == true
                )
                .OrderBy(target => target.Value<int?>("index") ?? int.MaxValue)
                .ThenBy(target => target.Value<string>("semanticKey"))
                .ToList();
        }

        private static string ValidateDraftTargets(
            IReadOnlyList<JObject> targets,
            string label,
            string[] expectedBuffIds
        )
        {
            if (targets.Count != expectedBuffIds.Length)
            {
                return label
                    + " expected "
                    + expectedBuffIds.Length
                    + " clickable draft boon targets but found "
                    + targets.Count
                    + ": "
                    + string.Join(", ", targets.Select(DescribeTarget));
            }

            for (var index = 0; index < expectedBuffIds.Length; index += 1)
            {
                var expectedKey = "draft.buff." + index;
                var matchingTargets = targets
                    .Where(target => target.Value<string>("semanticKey") == expectedKey)
                    .ToList();
                if (matchingTargets.Count != 1)
                {
                    return label
                        + " expected one target for "
                        + expectedKey
                        + " but found "
                        + matchingTargets.Count
                        + ".";
                }

                var actualBuffId = matchingTargets[0].Value<string>("buffId");
                if (actualBuffId != expectedBuffIds[index])
                {
                    return label
                        + " expected "
                        + expectedKey
                        + " to be "
                        + expectedBuffIds[index]
                        + " but found "
                        + actualBuffId
                        + ".";
                }
            }

            return string.Empty;
        }

        private static JArray SummarizeTargets(IEnumerable<JObject> targets)
        {
            var summary = new JArray();
            foreach (var target in targets)
            {
                summary.Add(
                    new JObject
                    {
                        ["semanticKey"] = target.Value<string>("semanticKey"),
                        ["index"] = target.Value<int?>("index"),
                        ["buffId"] = target.Value<string>("buffId"),
                    }
                );
            }

            return summary;
        }

        private static string DescribeTarget(JObject target)
        {
            return target.Value<string>("semanticKey") + "/" + target.Value<string>("buffId");
        }

        private static void CaptureScreenshot(string outputPath, int width, int height)
        {
            var camera = Camera.main;
            if (camera == null)
            {
                throw new InvalidOperationException("Unity Editor Play Mode evidence has no camera.");
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

        private static void WriteFailure(Exception ex)
        {
            var outputRoot = EditorPrefs.GetString(
                OutputKey,
                RepositoryPaths.ResolveFromRoot("artifacts", "unity", "editor-playmode-evidence")
            );
            Directory.CreateDirectory(outputRoot);
            var failure = new JObject
            {
                ["source"] = "unity-editor-play-mode",
                ["ok"] = false,
                ["error"] = ex.ToString(),
            };
            File.WriteAllText(
                Path.Combine(outputRoot, "editor-playmode-boon-click-evidence.failure.json"),
                failure.ToString(Formatting.Indented)
            );
        }

        private static void ClearPending()
        {
            EditorPrefs.DeleteKey(PendingKey);
            EditorPrefs.DeleteKey(OutputKey);
            EditorPrefs.DeleteKey(ModeKey);
        }

        private static string GetArgumentValue(string name)
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
    }
}
