using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using GemDuel.Catalog;
using Newtonsoft.Json;

namespace GemDuel.Platform
{
    public enum PlatformLaunchSource
    {
        LocalDev,
        Steam,
        Epic,
        DirectExecutable,
        Unknown
    }

    public sealed class PlatformCapabilities
    {
        public bool OverlayAvailable { get; set; }
        public bool AchievementsAvailable { get; set; }
        public bool CloudSaveAvailable { get; set; }
        public bool InvitesAvailable { get; set; }
        public bool PresenceAvailable { get; set; }
        public bool RelayAvailable { get; set; }
        public bool CrossplayAvailable { get; set; }
        public bool AccountLinkingAvailable { get; set; }

        public static PlatformCapabilities LocalDev()
        {
            return new PlatformCapabilities
            {
                OverlayAvailable = false,
                AchievementsAvailable = true,
                CloudSaveAvailable = false,
                InvitesAvailable = false,
                PresenceAvailable = false,
                RelayAvailable = false,
                CrossplayAvailable = false,
                AccountLinkingAvailable = false,
            };
        }
    }

    public interface IPlatformServices
    {
        Task<PlatformCapabilities> Init();
        Task<string> GetUserId();
        Task<bool> IsOverlayAvailable();
        Task UnlockAchievement(string achievementKey);
        Task<byte[]> ReadCloudSave(string saveName);
        Task WriteCloudSave(string saveName, byte[] payload);
        Task<PlatformLaunchSource> GetLaunchSource();
        Task OpenStorePage(string pageKey);
    }

    public static class AchievementKeys
    {
        public const string FirstLocalWin = "FIRST_LOCAL_WIN";

        public static readonly ISet<string> All = new HashSet<string>(StringComparer.Ordinal)
        {
            FirstLocalWin,
        };
    }

    public sealed class LocalDevPlatformServices : IPlatformServices
    {
        private readonly HashSet<string> unlockedAchievements = new HashSet<string>(StringComparer.Ordinal);
        private readonly string saveDirectory;
        private PlatformCapabilities capabilities = PlatformCapabilities.LocalDev();

        public LocalDevPlatformServices()
        {
            saveDirectory = RepositoryPaths.ResolveFromRoot("artifacts", "unity", "localdev-saves");
        }

        public Task<PlatformCapabilities> Init()
        {
            Directory.CreateDirectory(saveDirectory);
            capabilities = PlatformCapabilities.LocalDev();
            return Task.FromResult(capabilities);
        }

        public Task<string> GetUserId()
        {
            return Task.FromResult("localdev-player");
        }

        public Task<bool> IsOverlayAvailable()
        {
            return Task.FromResult(capabilities.OverlayAvailable);
        }

        public Task UnlockAchievement(string achievementKey)
        {
            if (!AchievementKeys.All.Contains(achievementKey))
            {
                throw new ArgumentException("Unknown achievement key: " + achievementKey, nameof(achievementKey));
            }

            unlockedAchievements.Add(achievementKey);
            return Task.CompletedTask;
        }

        public Task<byte[]> ReadCloudSave(string saveName)
        {
            var path = ResolveSavePath(saveName);
            if (!File.Exists(path))
            {
                return Task.FromResult<byte[]>(null);
            }

            return Task.FromResult(File.ReadAllBytes(path));
        }

        public Task WriteCloudSave(string saveName, byte[] payload)
        {
            var path = ResolveSavePath(saveName);
            Directory.CreateDirectory(Path.GetDirectoryName(path));
            File.WriteAllBytes(path, payload);
            return Task.CompletedTask;
        }

        public Task<PlatformLaunchSource> GetLaunchSource()
        {
            return Task.FromResult(PlatformLaunchSource.LocalDev);
        }

        public Task OpenStorePage(string pageKey)
        {
            UnityEngine.Debug.Log("LocalDev store page fallback requested: " + pageKey);
            return Task.CompletedTask;
        }

        public string ExportLocalProgressJson()
        {
            return JsonConvert.SerializeObject(
                new
                {
                    userId = "localdev-player",
                    unlockedAchievements = unlockedAchievements,
                    launchSource = PlatformLaunchSource.LocalDev.ToString(),
                },
                Formatting.Indented
            );
        }

        private string ResolveSavePath(string saveName)
        {
            if (string.IsNullOrWhiteSpace(saveName))
            {
                throw new ArgumentException("Save name is required.", nameof(saveName));
            }

            var safeName = saveName.Replace("/", "_").Replace("\\", "_");
            return Path.Combine(saveDirectory, safeName + ".json");
        }
    }
}
