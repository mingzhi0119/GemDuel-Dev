using System.Collections.Generic;
using System.IO;
using TMPro;
using UnityEditor;
using UnityEngine;
using UnityEngine.TextCore.LowLevel;

namespace GemDuel.Editor
{
    public static class GemDuelFontAssetGenerator
    {
        private const string SourceFolder = "Assets/GemDuel/Fonts/SourceFonts";
        private const string OutputFolder = "Assets/GemDuel/Fonts/Resources/GemDuelFonts";
        private const string TmpSettingsPath = "Assets/TextMesh Pro/Resources/TMP Settings.asset";
        private const string TmpShadersFolder = "Assets/TextMesh Pro/Shaders";
        private const string LocalTmpSettingsPath = "Assets/GemDuel/Fonts/Resources/TMP Settings.asset";
        private const int SamplingPointSize = 90;
        private const int AtlasPadding = 9;
        private const int AtlasSize = 2048;

        private static readonly FontSpec[] FontSpecs =
        {
            new FontSpec("NotoSansSC", "NotoSansSC-wght.ttf", "NotoSansSC-SDF.asset"),
            new FontSpec("NotoSerifSC", "NotoSerifSC-wght.ttf", "NotoSerifSC-SDF.asset"),
            new FontSpec("ZCOOLQingKeHuangYou", "ZCOOLQingKeHuangYou-Regular.ttf", "ZCOOLQingKeHuangYou-SDF.asset"),
            new FontSpec("NotoSansSymbols", "NotoSansSymbols-Regular.ttf", "NotoSansSymbols-SDF.asset"),
            new FontSpec("NotoSansSymbols2", "NotoSansSymbols2-Regular.ttf", "NotoSansSymbols2-SDF.asset"),
            new FontSpec("NotoSansMath", "NotoSansMath-Regular.ttf", "NotoSansMath-SDF.asset"),
        };

        [MenuItem("GemDuel/Fonts/Generate TMP Font Assets")]
        public static void Generate()
        {
            EnsureTmpEssentialResources();
            EnsureAssetFolder("Assets/GemDuel/Fonts");
            EnsureAssetFolder("Assets/GemDuel/Fonts/Resources");
            EnsureAssetFolder(OutputFolder);

            var generated = new Dictionary<string, TMP_FontAsset>();
            foreach (var spec in FontSpecs)
            {
                var fontAsset = GenerateFontAsset(spec);
                if (fontAsset != null)
                {
                    generated[spec.Key] = fontAsset;
                }
            }

            WireFallbacks(generated);

            if (generated.TryGetValue("NotoSansSC", out var primaryFont))
            {
                CreateMaterialPreset(
                    primaryFont,
                    OutputFolder + "/GemDuelTextMaterial-Readable.mat",
                    "GemDuelTextMaterial-Readable",
                    outlineWidth: 0.025f,
                    underlayAlpha: 0.52f
                );
                CreateMaterialPreset(
                    primaryFont,
                    OutputFolder + "/GemDuelTextMaterial-Title.mat",
                    "GemDuelTextMaterial-Title",
                    outlineWidth: 0.04f,
                    underlayAlpha: 0.65f
                );
            }

            AssetDatabase.SaveAssets();
            AssetDatabase.Refresh();
        }

        private static void EnsureTmpEssentialResources()
        {
            if (AssetDatabase.LoadAssetAtPath<TMP_Settings>(LocalTmpSettingsPath) != null)
            {
                AssetDatabase.DeleteAsset(LocalTmpSettingsPath);
            }

            if (AssetDatabase.LoadAssetAtPath<TMP_Settings>(TmpSettingsPath) == null || !AssetDatabase.IsValidFolder(TmpShadersFolder))
            {
                var packagePath = FindTmpEssentialResourcesPackage();
                if (string.IsNullOrEmpty(packagePath))
                {
                    Debug.LogError("Unable to find TMP Essential Resources package.");
                    return;
                }

                Debug.Log("Importing TMP Essential Resources from " + packagePath);
                AssetDatabase.ImportPackage(packagePath, false);
                AssetDatabase.Refresh();
            }

            TMP_Settings.LoadDefaultSettings();
            if (TMP_Settings.instance == null)
            {
                Debug.LogError("Unable to initialize TMP Settings from " + TmpSettingsPath);
            }
        }

        private static TMP_FontAsset GenerateFontAsset(FontSpec spec)
        {
            var fontPath = SourceFolder + "/" + spec.SourceFileName;
            AssetDatabase.ImportAsset(fontPath, ImportAssetOptions.ForceUpdate);
            var font = AssetDatabase.LoadAssetAtPath<Font>(fontPath);
            if (font == null)
            {
                Debug.LogError("GemDuel font source is missing: " + fontPath);
                return null;
            }

            var assetPath = OutputFolder + "/" + spec.AssetFileName;
            AssetDatabase.DeleteAsset(assetPath);

            var fontAsset = TMP_FontAsset.CreateFontAsset(
                font,
                SamplingPointSize,
                AtlasPadding,
                GlyphRenderMode.SDFAA,
                AtlasSize,
                AtlasSize,
                AtlasPopulationMode.Dynamic,
                true
            );
            if (fontAsset == null)
            {
                Debug.LogError("TextMeshPro could not create a font asset for " + fontPath);
                return null;
            }

            fontAsset.name = Path.GetFileNameWithoutExtension(spec.AssetFileName);
            fontAsset.atlasPopulationMode = AtlasPopulationMode.Dynamic;
            fontAsset.isMultiAtlasTexturesEnabled = true;

            AssetDatabase.CreateAsset(fontAsset, assetPath);
            AddChildAssets(fontAsset);
            EditorUtility.SetDirty(fontAsset);
            return fontAsset;
        }

        private static void AddChildAssets(TMP_FontAsset fontAsset)
        {
            if (fontAsset.atlasTextures != null)
            {
                foreach (var texture in fontAsset.atlasTextures)
                {
                    if (texture != null && !AssetDatabase.Contains(texture))
                    {
                        texture.name = fontAsset.name + " Atlas";
                        AssetDatabase.AddObjectToAsset(texture, fontAsset);
                    }
                }
            }

            if (fontAsset.material != null && !AssetDatabase.Contains(fontAsset.material))
            {
                fontAsset.material.name = fontAsset.name + " Material";
                AssetDatabase.AddObjectToAsset(fontAsset.material, fontAsset);
            }
        }

        private static void WireFallbacks(IReadOnlyDictionary<string, TMP_FontAsset> generated)
        {
            if (!generated.TryGetValue("NotoSansSC", out var sans))
            {
                return;
            }

            var sansFallbacks = new List<TMP_FontAsset>();
            var symbolFallbacks = new List<TMP_FontAsset>();

            if (generated.TryGetValue("NotoSerifSC", out var serif))
            {
                sansFallbacks.Add(serif);
            }

            if (generated.TryGetValue("ZCOOLQingKeHuangYou", out var display))
            {
                sansFallbacks.Add(display);
            }

            if (generated.TryGetValue("NotoSansSymbols", out var symbols))
            {
                sansFallbacks.Add(symbols);
                symbolFallbacks.Add(symbols);
            }

            if (generated.TryGetValue("NotoSansSymbols2", out var symbols2))
            {
                sansFallbacks.Add(symbols2);
                symbolFallbacks.Add(symbols2);
            }

            if (generated.TryGetValue("NotoSansMath", out var math))
            {
                sansFallbacks.Add(math);
                symbolFallbacks.Add(math);
            }

            sans.fallbackFontAssetTable = sansFallbacks;
            EditorUtility.SetDirty(sans);

            var secondaryFallbacks = new List<TMP_FontAsset> { sans };
            secondaryFallbacks.AddRange(symbolFallbacks);

            if (generated.TryGetValue("NotoSerifSC", out serif))
            {
                serif.fallbackFontAssetTable = secondaryFallbacks;
                EditorUtility.SetDirty(serif);
            }

            if (generated.TryGetValue("ZCOOLQingKeHuangYou", out display))
            {
                display.fallbackFontAssetTable = secondaryFallbacks;
                EditorUtility.SetDirty(display);
            }

            if (generated.TryGetValue("NotoSansSymbols", out symbols))
            {
                var fallbacks = new List<TMP_FontAsset>();
                if (generated.TryGetValue("NotoSansSymbols2", out symbols2))
                {
                    fallbacks.Add(symbols2);
                }
                if (generated.TryGetValue("NotoSansMath", out math))
                {
                    fallbacks.Add(math);
                }
                fallbacks.Add(sans);
                symbols.fallbackFontAssetTable = fallbacks;
                EditorUtility.SetDirty(symbols);
            }

            if (generated.TryGetValue("NotoSansSymbols2", out symbols2))
            {
                var fallbacks = new List<TMP_FontAsset>();
                if (generated.TryGetValue("NotoSansSymbols", out symbols))
                {
                    fallbacks.Add(symbols);
                }
                if (generated.TryGetValue("NotoSansMath", out math))
                {
                    fallbacks.Add(math);
                }
                fallbacks.Add(sans);
                symbols2.fallbackFontAssetTable = fallbacks;
                EditorUtility.SetDirty(symbols2);
            }

            if (generated.TryGetValue("NotoSansMath", out math))
            {
                var fallbacks = new List<TMP_FontAsset>();
                if (generated.TryGetValue("NotoSansSymbols", out symbols))
                {
                    fallbacks.Add(symbols);
                }
                if (generated.TryGetValue("NotoSansSymbols2", out symbols2))
                {
                    fallbacks.Add(symbols2);
                }
                fallbacks.Add(sans);
                math.fallbackFontAssetTable = fallbacks;
                EditorUtility.SetDirty(math);
            }
        }

        private static void CreateMaterialPreset(
            TMP_FontAsset fontAsset,
            string path,
            string materialName,
            float outlineWidth,
            float underlayAlpha
        )
        {
            if (fontAsset.material == null)
            {
                return;
            }

            AssetDatabase.DeleteAsset(path);
            var material = new Material(fontAsset.material)
            {
                name = materialName,
                shader = ResolveDistanceFieldShader() ?? fontAsset.material.shader,
            };
            material.SetColor(ShaderUtilities.ID_FaceColor, Color.white);
            material.SetFloat(ShaderUtilities.ID_FaceDilate, 0.02f);
            material.SetColor(ShaderUtilities.ID_OutlineColor, new Color(0.02f, 0.025f, 0.035f, 0.78f));
            material.SetFloat(ShaderUtilities.ID_OutlineWidth, outlineWidth);
            material.EnableKeyword(ShaderUtilities.Keyword_Outline);
            material.SetColor(ShaderUtilities.ID_UnderlayColor, new Color(0f, 0f, 0f, underlayAlpha));
            material.SetFloat(ShaderUtilities.ID_UnderlayOffsetX, 0.45f);
            material.SetFloat(ShaderUtilities.ID_UnderlayOffsetY, -0.45f);
            material.SetFloat(ShaderUtilities.ID_UnderlayDilate, 0.05f);
            material.SetFloat(ShaderUtilities.ID_UnderlaySoftness, 0.22f);
            material.EnableKeyword(ShaderUtilities.Keyword_Underlay);
            ShaderUtilities.UpdateShaderRatios(material);
            AssetDatabase.CreateAsset(material, path);
        }

        private static string FindTmpEssentialResourcesPackage()
        {
            var packagePaths = new[]
            {
                "Library/PackageCache/com.unity.ugui@473409526770/Package Resources/TMP Essential Resources.unitypackage",
                Path.Combine(EditorApplication.applicationContentsPath, "Resources/PackageManager/BuiltInPackages/com.unity.ugui/Package Resources/TMP Essential Resources.unitypackage"),
                Path.Combine(EditorApplication.applicationContentsPath, "Resources/PackageManager/BuiltInPackages/com.unity.textmeshpro/Package Resources/TMP Essential Resources.unitypackage"),
            };

            foreach (var packagePath in packagePaths)
            {
                if (File.Exists(packagePath))
                {
                    return packagePath.Replace('\\', '/');
                }
            }

            return string.Empty;
        }

        private static Shader ResolveDistanceFieldShader()
        {
            return Shader.Find("TextMeshPro/Distance Field")
                ?? Shader.Find("TextMeshPro/Mobile/Distance Field")
                ?? AssetDatabase.LoadAssetAtPath<Shader>(TmpShadersFolder + "/TMP_SDF.shader")
                ?? AssetDatabase.LoadAssetAtPath<Shader>(TmpShadersFolder + "/TMP_SDF-Mobile.shader");
        }

        private static void EnsureAssetFolder(string folder)
        {
            if (AssetDatabase.IsValidFolder(folder))
            {
                return;
            }

            var parent = Path.GetDirectoryName(folder)?.Replace('\\', '/');
            var name = Path.GetFileName(folder);
            if (!string.IsNullOrEmpty(parent))
            {
                EnsureAssetFolder(parent);
                AssetDatabase.CreateFolder(parent, name);
            }
        }

        private readonly struct FontSpec
        {
            public FontSpec(string key, string sourceFileName, string assetFileName)
            {
                Key = key;
                SourceFileName = sourceFileName;
                AssetFileName = assetFileName;
            }

            public string Key { get; }
            public string SourceFileName { get; }
            public string AssetFileName { get; }
        }
    }
}
