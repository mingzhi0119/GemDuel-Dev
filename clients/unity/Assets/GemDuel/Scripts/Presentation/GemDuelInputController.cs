using UnityEngine;

namespace GemDuel.Presentation
{
    public sealed class GemDuelInputController : MonoBehaviour
    {
        private GemDuelVerticalSlice verticalSlice;

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
                CaptureVisibleTarget();
            }
        }

        private void CaptureVisibleTarget()
        {
            var mainCamera = Camera.main;
            if (mainCamera == null)
            {
                return;
            }

            var world = mainCamera.ScreenToWorldPoint(Input.mousePosition);
            var target = FindVisibleTargetAtWorld(world);
            if (target != null)
            {
                verticalSlice.HandleVisibleTarget(target);
            }
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
    }
}
