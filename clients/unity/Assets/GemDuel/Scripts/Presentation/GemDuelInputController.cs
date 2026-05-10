using UnityEngine;

namespace GemDuel.Presentation
{
    public sealed class GemDuelInputController : MonoBehaviour
    {
        private GemDuelVerticalSlice verticalSlice;

        public bool LastMouseDispatchOk { get; private set; }
        public string LastMouseDispatchDetail { get; private set; } = string.Empty;
        public Vector3 LastMouseDispatchScreenPosition { get; private set; }

        private void Awake()
        {
            verticalSlice = FindAnyObjectByType<GemDuelVerticalSlice>();
        }

        private void Update()
        {
            if (verticalSlice == null)
            {
                return;
            }

            if (Input.GetKeyDown(KeyCode.Space))
            {
                verticalSlice.ApplyNextFixtureEvent();
            }

            if (Input.GetMouseButtonDown(0))
            {
                LastMouseDispatchScreenPosition = Input.mousePosition;
                LastMouseDispatchOk = TryDispatchScreenPointForEvidence(Input.mousePosition, out var detail);
                LastMouseDispatchDetail = detail;
            }
        }

        public bool TryDispatchScreenPointForEvidence(Vector3 screenPosition, out string detail)
        {
            detail = string.Empty;
            if (verticalSlice == null)
            {
                verticalSlice = FindAnyObjectByType<GemDuelVerticalSlice>();
            }

            if (verticalSlice == null)
            {
                detail = "No GemDuelVerticalSlice is available for input dispatch.";
                return false;
            }

            var mainCamera = Camera.main;
            if (mainCamera == null)
            {
                detail = "No main camera is available for input dispatch.";
                return false;
            }

            var world = mainCamera.ScreenToWorldPoint(screenPosition);
            var target = FindVisibleTargetAtWorld(world);
            if (target == null)
            {
                detail = "No clickable GemDuelViewTarget at screen point " + screenPosition + ".";
                return false;
            }

            verticalSlice.HandleVisibleTarget(target);
            detail = DescribeTarget(target);
            return true;
        }

        public static GemDuelViewTarget FindVisibleTargetAtWorld(Vector3 world)
        {
            var targets = FindObjectsByType<GemDuelViewTarget>();
            GemDuelViewTarget best = null;
            var bestZ = float.MaxValue;
            foreach (var target in targets)
            {
                if (!target.Clickable)
                {
                    continue;
                }

                var size = target.Size;
                if (size.x <= 0f || size.y <= 0f)
                {
                    continue;
                }

                var position = target.transform.position;
                var inside =
                    world.x >= position.x - size.x * 0.5f &&
                    world.x <= position.x + size.x * 0.5f &&
                    world.y >= position.y - size.y * 0.5f &&
                    world.y <= position.y + size.y * 0.5f;
                if (!inside || position.z >= bestZ)
                {
                    continue;
                }

                best = target;
                bestZ = position.z;
            }

            return best;
        }

        private static string DescribeTarget(GemDuelViewTarget target)
        {
            if (target.Kind == "Buff")
            {
                return "Buff " + target.BuffId + " at draft index " + target.Index;
            }

            if (target.Kind == "MarketCard")
            {
                return "Market card " + target.InstanceId + " L" + target.Level + " #" + target.Index;
            }

            if (target.Kind == "Royal")
            {
                return "Royal " + target.RoyalId + " #" + target.Index;
            }

            return target.Kind + " " + target.EventType;
        }
    }
}
