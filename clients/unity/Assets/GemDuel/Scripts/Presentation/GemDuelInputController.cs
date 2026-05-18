using UnityEngine;

namespace GemDuel.Presentation
{
    public sealed class GemDuelInputController : MonoBehaviour
    {
        private GemDuelGameController gameController;
        private readonly System.Collections.Generic.HashSet<string> draggedBoardGemKeys =
            new System.Collections.Generic.HashSet<string>();
        private bool boardGemDragActive;
        private Vector3 lastHoverPollScreenPosition = new Vector3(float.NaN, float.NaN, float.NaN);
        private float nextHoverPollAt;

        public bool LastMouseDispatchOk { get; private set; }
        public string LastMouseDispatchDetail { get; private set; } = string.Empty;
        public Vector3 LastMouseDispatchScreenPosition { get; private set; }
        public bool LastHoverDispatchOk { get; private set; }
        public string LastHoverDispatchDetail { get; private set; } = string.Empty;
        public Vector3 LastHoverDispatchScreenPosition { get; private set; }

        private void Awake()
        {
            gameController = FindAnyObjectByType<GemDuelGameController>();
        }

        private void Update()
        {
            if (gameController == null)
            {
                return;
            }

            if (Input.GetKeyDown(KeyCode.Space))
            {
                gameController.ApplyNextFixtureEvent();
            }

            if (Input.GetKeyDown(KeyCode.Escape) && gameController.CloseActiveLexiconPopoverFromInput())
            {
                return;
            }

            if (
                (Input.GetKeyDown(KeyCode.Return)
                    || Input.GetKeyDown(KeyCode.KeypadEnter)
                    || Input.GetKeyDown(KeyCode.JoystickButton0))
                && gameController.OpenFirstRulebookLexiconTermFromInput()
            )
            {
                return;
            }

            if (!Input.GetMouseButton(0) && ShouldPollHover(Input.mousePosition))
            {
                LastHoverDispatchScreenPosition = Input.mousePosition;
                LastHoverDispatchOk = TryHoverScreenPointForEvidence(Input.mousePosition, out var hoverDetail);
                LastHoverDispatchDetail = hoverDetail;
            }

            if (Input.GetMouseButtonDown(0))
            {
                LastMouseDispatchScreenPosition = Input.mousePosition;
                var dragTarget = TryFindTargetAtScreenPoint(Input.mousePosition, out var initialTarget, out _)
                    ? initialTarget
                    : null;
                LastMouseDispatchOk = TryDispatchScreenPointForEvidence(Input.mousePosition, out var detail);
                LastMouseDispatchDetail = detail;
                boardGemDragActive = gameController.IsTakeGemsBoardGemTarget(dragTarget);
                draggedBoardGemKeys.Clear();
                if (boardGemDragActive && dragTarget != null)
                {
                    draggedBoardGemKeys.Add(BoardGemKey(dragTarget));
                }
            }
            else if (Input.GetMouseButton(0) && boardGemDragActive)
            {
                LastMouseDispatchScreenPosition = Input.mousePosition;
                LastMouseDispatchOk = TryDispatchBoardGemDragScreenPoint(Input.mousePosition, out var detail);
                LastMouseDispatchDetail = detail;
            }

            if (Input.GetMouseButtonUp(0))
            {
                boardGemDragActive = false;
                draggedBoardGemKeys.Clear();
            }
        }

        public bool TryDispatchScreenPointForEvidence(Vector3 screenPosition, out string detail)
        {
            if (!TryFindTargetAtScreenPoint(screenPosition, out var target, out detail))
            {
                return false;
            }

            gameController.HandleVisibleTarget(target);
            detail = DescribeTarget(target);
            return true;
        }

        private bool ShouldPollHover(Vector3 screenPosition)
        {
            const float hoverPollIntervalSeconds = 0.05f;
            const float hoverMoveEpsilonPixels = 0.75f;
            var moved =
                float.IsNaN(lastHoverPollScreenPosition.x)
                || (screenPosition - lastHoverPollScreenPosition).sqrMagnitude
                    >= hoverMoveEpsilonPixels * hoverMoveEpsilonPixels;
            if (!moved && Time.unscaledTime < nextHoverPollAt)
            {
                return false;
            }

            lastHoverPollScreenPosition = screenPosition;
            nextHoverPollAt = Time.unscaledTime + hoverPollIntervalSeconds;
            return true;
        }

        public bool TryHoverScreenPointForEvidence(Vector3 screenPosition, out string detail)
        {
            detail = string.Empty;
            if (gameController == null)
            {
                gameController = FindAnyObjectByType<GemDuelGameController>();
            }

            if (gameController == null)
            {
                detail = "No GemDuelGameController is available for hover dispatch.";
                return false;
            }

            var mainCamera = Camera.main;
            if (mainCamera == null)
            {
                detail = "No main camera is available for hover dispatch.";
                return false;
            }

            var world = mainCamera.ScreenToWorldPoint(screenPosition);
            var target = FindVisibleTargetAtWorld(world);
            if (target == null)
            {
                gameController.SetHoveredTarget(null);
                detail = "No clickable GemDuelViewTarget at hover screen point " + screenPosition + ".";
                return false;
            }

            if (!gameController.IsStableHoverTarget(target))
            {
                gameController.SetHoveredTarget(null);
                detail = "GemDuelViewTarget is not hover-stable: " + DescribeTarget(target) + ".";
                return false;
            }

            detail = DescribeTarget(target);
            gameController.SetHoveredTarget(target);
            return true;
        }

        private bool TryDispatchBoardGemDragScreenPoint(Vector3 screenPosition, out string detail)
        {
            if (!TryFindTargetAtScreenPoint(screenPosition, out var target, out detail))
            {
                return false;
            }

            if (!gameController.IsTakeGemsBoardGemTarget(target))
            {
                detail = "Board gem drag ignored non-selectable target " + DescribeTarget(target) + ".";
                return false;
            }

            var key = BoardGemKey(target);
            if (draggedBoardGemKeys.Contains(key))
            {
                detail = "Board gem drag already dispatched " + key + ".";
                return true;
            }

            var dispatched = gameController.TryHandleTakeGemsDragTarget(target, out var dragDetail);
            if (dispatched)
            {
                draggedBoardGemKeys.Add(key);
                foreach (var selectedKey in gameController.GetSelectedTakeGemDragKeysForInput())
                {
                    draggedBoardGemKeys.Add(selectedKey);
                }
            }

            detail = dispatched
                ? "Dragged " + DescribeTarget(target) + ". " + dragDetail
                : dragDetail;
            return dispatched;
        }

        private bool TryFindTargetAtScreenPoint(
            Vector3 screenPosition,
            out GemDuelViewTarget target,
            out string detail
        )
        {
            target = null;
            detail = string.Empty;
            if (gameController == null)
            {
                gameController = FindAnyObjectByType<GemDuelGameController>();
            }

            if (gameController == null)
            {
                detail = "No GemDuelGameController is available for input dispatch.";
                return false;
            }

            var mainCamera = Camera.main;
            if (mainCamera == null)
            {
                detail = "No main camera is available for input dispatch.";
                return false;
            }

            var world = mainCamera.ScreenToWorldPoint(screenPosition);
            target = FindVisibleTargetAtWorld(world);
            if (target == null)
            {
                detail = "No clickable GemDuelViewTarget at screen point " + screenPosition + ".";
                return false;
            }

            return true;
        }

        public static GemDuelViewTarget FindVisibleTargetAtWorld(Vector3 world)
        {
            var targets = FindObjectsByType<GemDuelViewTarget>();
            GemDuelViewTarget best = null;
            var bestZ = float.MaxValue;
            foreach (var target in targets)
            {
                if (
                    target == null
                    || !target.isActiveAndEnabled
                    || !target.gameObject.activeInHierarchy
                    || !target.Clickable
                )
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
                if (!inside)
                {
                    continue;
                }

                if (best != null && !IsBetterHitTarget(target, best, position.z, bestZ))
                {
                    continue;
                }

                best = target;
                bestZ = position.z;
            }

            return best;
        }

        private static bool IsBetterHitTarget(
            GemDuelViewTarget candidate,
            GemDuelViewTarget existing,
            float candidateZ,
            float existingZ
        )
        {
            if (candidate == null)
            {
                return false;
            }

            if (existing == null)
            {
                return true;
            }

            if (
                !string.IsNullOrEmpty(candidate.SemanticKey)
                && candidate.SemanticKey == existing.SemanticKey
            )
            {
                var candidateActionable = !string.IsNullOrEmpty(candidate.EventType);
                var existingActionable = !string.IsNullOrEmpty(existing.EventType);
                if (candidateActionable != existingActionable)
                {
                    return candidateActionable;
                }
            }

            if (
                candidate.Kind == "InventoryGem"
                && existing.Kind == "InventoryGem"
                && candidate.InstanceId == existing.InstanceId
                && candidate.GemId == existing.GemId
            )
            {
                var candidateActionable = !string.IsNullOrEmpty(candidate.EventType);
                var existingActionable = !string.IsNullOrEmpty(existing.EventType);
                if (candidateActionable != existingActionable)
                {
                    return candidateActionable;
                }
            }

            return candidateZ < existingZ;
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

            if (target.Kind == "MarketDeck")
            {
                return "Market deck L" + target.Level;
            }

            if (target.Kind == "Royal")
            {
                return "Royal " + target.RoyalId + " #" + target.Index;
            }

            if (target.Kind == "LexiconTerm")
            {
                return "Lexicon term " + target.LexiconTermId;
            }

            return target.Kind + " " + target.EventType;
        }

        private static string BoardGemKey(GemDuelViewTarget target)
        {
            return target == null ? string.Empty : target.Row + ":" + target.Column;
        }
    }
}
