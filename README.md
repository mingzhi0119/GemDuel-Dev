# Gem Duel: Splendor Duel Reimagined

[![Release](https://img.shields.io/badge/version-5.0.0-purple.svg)]()
[![Build](https://github.com/mingzhi0119/GemDuel-Dev/actions/workflows/build.yml/badge.svg)](https://github.com/mingzhi0119/GemDuel-Dev/actions)

A high-fidelity digital remake of the popular strategy board game **Splendor Duel**, enhanced with modern architecture and a deep **Roguelike Expansion**. Built with React, TypeScript, and Electron.

## 🚀 Key Features

### 🕹️ Multi-Mode Gameplay

- **Local PvP**: Classic same-screen competitive play.
- **VS AI**: Challenge a heuristic-based "Gem Bot" for solo practice.
- **Online Multiplayer**: Seamless P2P gameplay powered by WebRTC (PeerJS) with a robust **Authoritative Host** architecture to ensure synchronization and fairness.

### 🃏 Roguelike Evolution

- **Buff Drafting**: Dynamic selection phase with 24+ unique abilities across 3 tiers (Tactic, Shift, Game Changer).
- **Exclusive Rogue Cards**: 7 additional high-tier development cards with massive point potential and skill combos.
- **Asymmetric Starts**: Every match feels different with randomized starting bonuses and win-condition shifts.

### 🛡️ Technical Excellence

- **Authoritative Sync**: Implemented a "Host-is-Law" sync protocol. Actions are validated by the Host before being broadcasted to Guests via full state snapshots.
- **Type Safety**: 100% TypeScript codebase, providing robust logic validation and IDE support.
- **Stress Tested**: Verified by an intensive **5000-iteration Monkey Test** suite to ensure zero memory leaks and logic crashes.
- **High Performance**: Powered by **Vite** for near-instant hot-reloads and optimized builds.

## 🎨 UI & UX

- **Authoritative Feedback**: Real-time "Your Turn" indicators and status markers.
- **Information Integrity**: 100% synced with official card data (CSV-verified).
- **Responsive Design**: Supports multiple resolutions with dynamic scaling for the game board and dashboards.
- **Accessible UI**: High-visibility score markers (12pt Black) and smart tooltip positioning.

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18+)
- npm

### Installation

```bash
git clone https://github.com/mingzhi0119/GemDuel-Dev.git
cd splendor-duel
npm install
```

### Development

```bash
# Run web version
npm run dev

# Run desktop version (Electron)
npm run electron:dev
```

### Testing

```bash
# Run full test suite
npm test
```

## 📜 Version History

Check the [Release Notes](#) for detailed changelogs. Current Stable: **v5.0.0**.

---

_Created with strategic precision by Mingzhi and contributors._
