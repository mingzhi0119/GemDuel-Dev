# Gem Duel

**Gem Duel** is a competitive strategy game designed specifically for two players. In this digital adaptation, players act as masters of a jewelry guild, competing to satisfy monarchs and nobility by collecting gems, pearls, and gold to acquire prestigious cards.

> **v2.0.0 "Grand Master" Update** is now live!

## 🚀 Features

### Core Mechanics
*   **Strategic Resource Management:** Collect Gems, Pearls, and Gold from a shared board.
*   **Card Abilities:** Trigger special effects upon purchase:
    *   **Extra Turn:** Take another turn immediately.
    *   **Bonus Gem:** Take a matching gem from the board.
    *   **Steal:** Take a gem from your opponent.
    *   **Privilege:** Gain a Privilege Scroll.
*   **Royal Court:** Claim powerful Royal cards upon reaching Crown milestones (3 and 6).
*   **Multiple Victory Conditions:**
    1.  **20 Total Prestige Points**
    2.  **10 Points in a single color**
    3.  **10 Crowns**

### Technical Highlights
*   **Infinite Replay System:** A robust Action-Log architecture enables deterministic state rehydration, allowing for seamless infinite undo/redo functionality.
*   **Review Mode:** Inspect the final board state and inventories after the game ends without triggering new actions.
*   **Smart State Management:** Logic deadlocks are prevented via pre-checks for card skills (e.g., skipping "Take Gem" skills if the board is empty).
*   **Responsive Design:** Native resolution scaling support for **1080p**, **2K**, and **4K** displays.

### UI/UX Enhancements
*   **Dynamic Player Zones:** Features stacked card visuals, real-time color point tracking, and floating text feedback for resource gains.
*   **Visual Polish:** Includes "Winning Condition Glows" (pulsing effects near victory thresholds), Crown flash animations, and a clean, artifact-free interface.
*   **Bilingual Rulebook:** Integrated in-game rulebook available in **English** and **Chinese**.

## 🛠️ Tech Stack

*   **Frontend:** React.js
*   **Styling:** Tailwind CSS
*   **Icons:** Lucide React
*   **State Management:** Custom React Hooks with Reducer pattern

## 📦 Getting Started

### Prerequisites
*   Node.js (v16 or higher recommended)
*   npm or yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/yourusername/gem-duel.git
    ```
2.  Navigate to the project directory:
    ```bash
    cd gem-duel
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```

### Running the Game

Start the development server:
```bash
npm run dev
```
Open your browser and visit `http://localhost:5173` (or the port shown in your terminal).

## 🎮 How to Play

On your turn, you must perform **ONE** of the following main actions:
1.  **Take Gems:** Take up to 3 contiguous gems from the board (row, column, or diagonal). You cannot take Gold directly.
2.  **Reserve:** Take 1 Gold and reserve 1 card from the market or the top of a deck.
3.  **Buy Card:** Pay the gem cost (minus bonuses from owned cards) to place a card in your tableau.

**Optional Actions:**
*   **Use Privilege:** Spend a scroll to take 1 non-Gold gem from the board.
*   **Replenish:** Refill the board from the bag (your opponent gains a Privilege).