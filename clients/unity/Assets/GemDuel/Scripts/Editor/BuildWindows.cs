using System.IO;
using GemDuel.Catalog;
using UnityEditor;
using UnityEditor.Build;
using UnityEditor.Build.Reporting;

namespace GemDuel.Editor
{
    public static class BuildWindows
    {
        public static void Build()
        {
            EditorUserBuildSettings.SwitchActiveBuildTarget(
                BuildTargetGroup.Standalone,
                BuildTarget.StandaloneWindows64
            );
            PlayerSettings.SetScriptingBackend(NamedBuildTarget.Standalone, ScriptingImplementation.IL2CPP);

            var outputDirectory = RepositoryPaths.ResolveFromRoot("artifacts", "unity", "build", "windows");
            Directory.CreateDirectory(outputDirectory);

            var report = BuildPipeline.BuildPlayer(
                new[]
                {
                    "Assets/GemDuel/Scenes/GemDuelVerticalSlice.unity",
                },
                Path.Combine(outputDirectory, "GemDuelUnitySlice.exe"),
                BuildTarget.StandaloneWindows64,
                BuildOptions.None
            );

            if (report.summary.result != BuildResult.Succeeded)
            {
                throw new BuildFailedException("GemDuel Unity Windows build failed: " + report.summary.result);
            }
        }
    }
}
