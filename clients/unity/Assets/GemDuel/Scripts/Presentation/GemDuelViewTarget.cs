using UnityEngine;

namespace GemDuel.Presentation
{
    public sealed class GemDuelViewTarget : MonoBehaviour
    {
        public string Kind = string.Empty;
        public string EventType = string.Empty;
        public int Row = -1;
        public int Column = -1;
        public int Level = -1;
        public int Index = -1;
        public string InstanceId = string.Empty;
        public string RoyalId = string.Empty;
        public string GemId = string.Empty;
        public string BuffId = string.Empty;
        public string SemanticKey = string.Empty;
        public Vector2 Size = Vector2.zero;
    }
}
