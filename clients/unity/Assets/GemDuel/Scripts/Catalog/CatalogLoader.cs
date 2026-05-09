using System;
using System.Collections.Generic;
using System.IO;
using GemDuel.Core;
using Newtonsoft.Json;
using UnityEngine;

namespace GemDuel.Catalog
{
    public sealed class UnityCatalog
    {
        public IReadOnlyDictionary<string, CardDef> Cards { get; private set; }
        public IReadOnlyDictionary<string, RoyalDef> Royals { get; private set; }
        public IReadOnlyDictionary<string, BuffDef> Buffs { get; private set; }
        public IReadOnlyList<GemCatalogEntry> Gems { get; private set; }

        public UnityCatalog(
            IReadOnlyDictionary<string, CardDef> cards,
            IReadOnlyDictionary<string, RoyalDef> royals,
            IReadOnlyDictionary<string, BuffDef> buffs,
            IReadOnlyList<GemCatalogEntry> gems
        )
        {
            Cards = cards;
            Royals = royals;
            Buffs = buffs;
            Gems = gems;
        }
    }

    public sealed class GemCatalogEntry
    {
        [JsonProperty("id")]
        public string Id { get; set; } = string.Empty;

        [JsonProperty("color")]
        public string Color { get; set; } = string.Empty;

        [JsonProperty("border")]
        public string Border { get; set; } = string.Empty;

        [JsonProperty("label")]
        public string Label { get; set; } = string.Empty;
    }

    public static class RepositoryPaths
    {
        public static string Root
        {
            get
            {
                return Path.GetFullPath(Path.Combine(Application.dataPath, "..", "..", ".."));
            }
        }

        public static string ResolveFromRoot(params string[] segments)
        {
            var current = Root;
            foreach (var segment in segments)
            {
                current = Path.Combine(current, segment);
            }

            return current;
        }
    }

    public sealed class CatalogLoader
    {
        public UnityCatalog LoadDefault()
        {
            return Load(RepositoryPaths.ResolveFromRoot("fixtures", "unity-catalog"));
        }

        public UnityCatalog Load(string catalogDirectory)
        {
            var cards = LoadArray<CardDef>(catalogDirectory, "cards.json");
            var royals = LoadArray<RoyalDef>(catalogDirectory, "royals.json");
            var buffs = LoadArray<BuffDef>(catalogDirectory, "buffs.json");
            var gems = LoadArray<GemCatalogEntry>(catalogDirectory, "gems.json");

            return new UnityCatalog(
                IndexById(cards, "card"),
                IndexById(royals, "royal"),
                IndexById(buffs, "buff"),
                gems
            );
        }

        public void ValidateReplayReferences(UnityCatalog catalog, GemDuel.Replay.ReplayVNext replay)
        {
            foreach (var pair in replay.Init.CardInstances)
            {
                if (!catalog.Cards.ContainsKey(pair.Value))
                {
                    throw new InvalidOperationException(
                        "Replay card instance " + pair.Key + " references missing catalog card " + pair.Value
                    );
                }
            }

            foreach (var royalId in replay.Init.RoyalDeck)
            {
                if (!catalog.Royals.ContainsKey(royalId))
                {
                    throw new InvalidOperationException("Replay references missing royal " + royalId);
                }
            }

            foreach (var player in replay.Players.Values)
            {
                var buffId = player.Buff.Id;
                if (!catalog.Buffs.ContainsKey(buffId))
                {
                    throw new InvalidOperationException("Replay references missing buff " + buffId);
                }
            }
        }

        private static List<T> LoadArray<T>(string directory, string fileName)
        {
            var path = Path.Combine(directory, fileName);
            if (!File.Exists(path))
            {
                throw new FileNotFoundException("Unity catalog file is missing.", path);
            }

            return JsonConvert.DeserializeObject<List<T>>(File.ReadAllText(path))
                ?? throw new InvalidOperationException("Unity catalog file could not be parsed: " + path);
        }

        private static Dictionary<string, T> IndexById<T>(IEnumerable<T> values, string label)
        {
            var result = new Dictionary<string, T>(StringComparer.Ordinal);
            foreach (var value in values)
            {
                var idProperty = typeof(T).GetProperty("Id");
                var id = idProperty != null ? idProperty.GetValue(value) as string : null;
                if (string.IsNullOrWhiteSpace(id))
                {
                    throw new InvalidOperationException("Unity catalog " + label + " entry is missing an id.");
                }

                if (result.ContainsKey(id))
                {
                    throw new InvalidOperationException("Unity catalog has duplicate " + label + " id " + id);
                }

                result[id] = value;
            }

            return result;
        }
    }
}
