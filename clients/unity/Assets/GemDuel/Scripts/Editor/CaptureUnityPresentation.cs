using System;
using System.IO;
using GemDuel.Catalog;
using GemDuel.Presentation;
using UnityEditor.SceneManagement;
using UnityEngine;

namespace GemDuel.Editor
{
    public static class CaptureUnityPresentation
    {
        public static void CaptureOpening()
        {
            Capture("opening", (slice, root) => { });
        }

        public static void CaptureCompletedFixture()
        {
            Capture("completed-fixture", (slice, root) =>
            {
                if (!slice.PlayReplayToEndForAutomation(out var error))
                {
                    throw new InvalidOperationException("Replay playback failed: " + error);
                }
            });
        }

        public static void CaptureFreeGemSelection()
        {
            Capture("free-gem-selection", (slice, root) =>
            {
                slice.ApplyNextFixtureEvent();
                slice.ApplyNextFixtureEvent();
                slice.HandleVisibleTarget(CreateGemTarget(root, 3, 0, "green"));
                slice.HandleVisibleTarget(CreateGemTarget(root, 3, 1, "red"));
                slice.HandleVisibleTarget(CreateGemTarget(root, 3, 2, "red"));
            });
        }

        private static void Capture(string label, Action<GemDuelGameController, GameObject> prepare)
        {
            EditorSceneManager.NewScene(NewSceneSetup.EmptyScene, NewSceneMode.Single);
            var root = new GameObject("GemDuel Capture Harness");
            var slice = root.AddComponent<GemDuelGameController>();
            slice.LoadFixtureForRuntime("local-pvp-royal-extra-turn-game-over.replay.json");
            prepare(slice, root);

            var camera = Camera.main;
            if (camera == null)
            {
                throw new InvalidOperationException("Unity presentation capture has no camera.");
            }

            var outputDirectory = RepositoryPaths.ResolveFromRoot("artifacts", "unity", "screenshots");
            Directory.CreateDirectory(outputDirectory);
            var outputPath = Path.Combine(outputDirectory, "unity-" + label + ".png");
            var renderTexture = new RenderTexture(2560, 1440, 24);
            var texture = new Texture2D(2560, 1440, TextureFormat.RGB24, false);
            var previousTarget = camera.targetTexture;
            var previousActive = RenderTexture.active;

            try
            {
                camera.targetTexture = renderTexture;
                RenderTexture.active = renderTexture;
                camera.Render();
                texture.ReadPixels(new Rect(0, 0, 2560, 1440), 0, 0);
                texture.Apply();
                File.WriteAllBytes(outputPath, texture.EncodeToPNG());
                Debug.Log("GemDuel Unity presentation screenshot written: " + outputPath);
            }
            finally
            {
                camera.targetTexture = previousTarget;
                RenderTexture.active = previousActive;
                UnityEngine.Object.DestroyImmediate(renderTexture);
                UnityEngine.Object.DestroyImmediate(texture);
                UnityEngine.Object.DestroyImmediate(root);
            }
        }

        private static GemDuelViewTarget CreateGemTarget(GameObject root, int row, int column, string gemId)
        {
            var targetObject = new GameObject("Capture Gem Target " + row + "," + column);
            targetObject.transform.SetParent(root.transform, false);
            var target = targetObject.AddComponent<GemDuelViewTarget>();
            target.Kind = "Gem";
            target.Row = row;
            target.Column = column;
            target.GemId = gemId;
            target.Clickable = true;
            return target;
        }
    }
}
