using Newtonsoft.Json.Linq;
using UnityEngine;

namespace GemDuel.Presentation
{
    public sealed class GemDuelInputController : MonoBehaviour
    {
        private GemDuelVerticalSlice verticalSlice;
        private readonly JArray selectedGemCoords = new JArray();

        private void Awake()
        {
            verticalSlice = FindObjectOfType<GemDuelVerticalSlice>();
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
                CaptureBoardSelection();
            }

            if (Input.GetKeyDown(KeyCode.R))
            {
                verticalSlice.EmitReserveMarketCard("presentation-reserve", 1, 0);
            }

            if (Input.GetKeyDown(KeyCode.B))
            {
                verticalSlice.EmitBuyMarketCard("presentation-buy", 1, 0);
            }

            if (Input.GetKeyDown(KeyCode.Alpha1))
            {
                verticalSlice.EmitSelectRoyal("r91-ro");
            }

            if (Input.GetKeyDown(KeyCode.G))
            {
                verticalSlice.EmitSingleGemStateAction("take_bonus_gem", "red");
            }

            if (Input.GetKeyDown(KeyCode.S))
            {
                verticalSlice.EmitSingleGemStateAction("steal_gem", "red");
            }

            if (Input.GetKeyDown(KeyCode.D))
            {
                verticalSlice.EmitSingleGemStateAction("discard_gem", "red");
            }
        }

        private void CaptureBoardSelection()
        {
            var world = Camera.main.ScreenToWorldPoint(Input.mousePosition);
            var column = Mathf.RoundToInt(world.x + 2f);
            var row = Mathf.RoundToInt(2f - world.y);
            if (row < 0 || row > 4 || column < 0 || column > 4)
            {
                return;
            }

            selectedGemCoords.Add(new JObject { ["r"] = row, ["c"] = column });
            if (selectedGemCoords.Count < 3)
            {
                return;
            }

            verticalSlice.EmitTakeGems((JArray)selectedGemCoords.DeepClone());
            selectedGemCoords.Clear();
        }
    }
}
