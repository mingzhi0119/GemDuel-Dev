using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using GemDuel.Core;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace GemDuel.Replay
{
    public sealed class ReplayStateHasher
    {
        public string Hash(GameState state)
        {
            var sorted = SortToken(NormalizeHashToken(state.Snapshot));
            var json = JsonConvert.SerializeObject(
                sorted,
                Formatting.None,
                new JsonSerializerSettings { Culture = CultureInfo.InvariantCulture }
            );
            return HashString(json);
        }

        public string HashSnapshot(JObject snapshot)
        {
            var sorted = SortToken(NormalizeHashToken(snapshot));
            var json = JsonConvert.SerializeObject(
                sorted,
                Formatting.None,
                new JsonSerializerSettings { Culture = CultureInfo.InvariantCulture }
            );
            return HashString(json);
        }

        public static JToken NormalizeHashToken(JToken token)
        {
            var clone = token.DeepClone();
            RemoveEmptyBuffStateObjects(clone);
            return clone;
        }

        public static JToken SortToken(JToken token)
        {
            if (token is JObject obj)
            {
                var sorted = new JObject();
                foreach (var property in obj.Properties().OrderBy(property => property.Name))
                {
                    sorted[property.Name] = SortToken(property.Value);
                }

                return sorted;
            }

            if (token is JArray array)
            {
                return new JArray(array.Select(SortToken));
            }

            return token.DeepClone();
        }

        private static void RemoveEmptyBuffStateObjects(JToken token)
        {
            if (token is JObject obj)
            {
                if (obj["buff"] is JObject buff &&
                    buff["state"] is JObject state &&
                    !state.Properties().Any())
                {
                    buff.Property("state")?.Remove();
                }

                foreach (var property in obj.Properties().ToList())
                {
                    RemoveEmptyBuffStateObjects(property.Value);
                }
                return;
            }

            if (token is JArray array)
            {
                foreach (var item in array.ToList())
                {
                    RemoveEmptyBuffStateObjects(item);
                }
            }
        }

        private static string HashString(string value)
        {
            uint hash = 5381;
            foreach (var character in value)
            {
                hash = (hash * 33) ^ character;
            }

            return hash.ToString("x", CultureInfo.InvariantCulture);
        }
    }
}
