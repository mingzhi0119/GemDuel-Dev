# Gem Duel

**Gem Duel** is a competitive strategy game designed specifically for two players. In this digital adaptation, players act as masters of a jewelry guild, competing to satisfy monarchs and nobility by collecting gems, pearls, and gold to acquire prestigious cards.

> **v3.1.0 "Architecture & Stability" Update** is now live!

## 🔧 What's New in v3.1.0

### 🏗️ Architectural Overhaul (Refactoring)
To support future expansions and ensure rock-solid stability, the entire Game Logic Engine has been rewritten.
*   **Modular Design:** The monolithic logic hook has been split into a dedicated Reducer and specialized Action Handlers (`boardActions`, `marketActions`, etc.).
*   **Pure Logic Engine:** Game rules are now completely decoupled from UI code, improving performance and testability.

### 🛡️ Bug Fixes & Stability
*   **Fixed State Corruption:** Resolved a critical issue where the initial game state was mutable, causing bugs across game resets.
*   **Unified Calculations:** All cost and affordability checks (UI and Logic) now use a single `calculateTransaction` source of truth, fixing discrepancies with specific buffs like "Color Preference".
*   **Market Fixes:** Resolved rendering crashes related to missing prop propagation in the Market component.

## 🚀 v3.0.0 "Fate & Fortune" Features

### 🔮 Roguelike Mode (Asymmetric Gameplay)
Break away from the symmetry! Before the game begins, players participate in a **Draft Phase** to select powerful Buffs that alter their strategy for the entire match.
*   **Draft System:** A randomized drafting phase where Player 2 picks first to balance the first-move advantage.
*   **3 Power Tiers:**
    *   **Level 1 (Minor Tweak):** Small boosts like *Head Start* (free gem) or *Intelligence* (peek at decks).
    *   **Level 2 (Tactical Shift):** Strategy-altering effects like *Pearl Trader* (start with Pearl, higher cap) or *Extortion* (steal gems on refill).
    *   **Level 3 (Game Changer):** Powerful rule-breaking abilities with significant trade-offs, such as *King of Greed* (+1 score per card, but need 25 points to win) or *High Stakes* (periodic free privileges).

### ⚡ New Mechanics & Balancing
*   **24 Unique Buffs:** From "Color Preference" (cost reduction) to "Minimalism" (double bonuses for early cards).
*   **Dynamic Win Conditions:** Victory thresholds (Points/Crowns/Monochrome) now adapt dynamically based on your chosen Buff.
*   **Special Abilities:** Active skills like "Deck Peek" allow you to scout ahead, while passive traits modify core rules like gem caps or privilege strength.

### 🎨 Visual & Quality of Life
*   **Buff Indicators:** Hover over player avatars to see active buffs and their effects.
*   **Dynamic HUD:** The top bar now reflects your personalized victory goals (e.g., "Score: 12/25").
*   **Rulebook Update:** New section (Page 7) detailing all Buffs and interactions.

## 🌟 Key Features

### Core Mechanics
*   **Strategic Resource Management:** Collect Gems, Pearls, and Gold from a shared board.
*   **Card Abilities:** Trigger special effects upon purchase:
    *   **Extra Turn:** Take another turn immediately.
    *   **Bonus Gem:** Take a matching gem from the board.
    *   **Steal:** Take a gem from your opponent.
    *   **Privilege:** Gain a Privilege Scroll.
*   **Royal Court:** Claim powerful Royal cards upon reaching Crown milestones (3 and 6).
*   **Multiple Victory Conditions:**
    1.  **20 Total Prestige Points** (Variable in Roguelike Mode)
    2.  **10 Points in a single color** (Variable in Roguelike Mode)
    3.  **10 Crowns** (Variable in Roguelike Mode)

### Technical Highlights
*   **Infinite Replay System:** A robust Action-Log architecture enables deterministic state rehydration, allowing for seamless infinite undo/redo functionality.
*   **Review Mode:** Inspect the final board state and inventories after the game ends without triggering new actions.
*   **Smart State Management:** Logic deadlocks are prevented via pre-checks for card skills.
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
