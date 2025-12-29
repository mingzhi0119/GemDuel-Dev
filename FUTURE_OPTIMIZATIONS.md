# Future Optimization Plan (Post-v5.0.0)

**Context**: The project has successfully migrated from v4.2.3 to v5.0.0, introducing an **Authoritative Host** architecture and significantly refactoring `useGameLogic`. While the architectural foundation is now more robust for multiplayer synchronization, the codebase still retains legacy type looseness (`any`) that needs to be addressed to fully leverage the new system.

## 1. Type Safety & Integrity (Critical)

Despite the v5.0.0 upgrade, `any` usage remains prevalent in critical data flows, undermining the reliability of the new Authoritative Host model.

### High Priority Targets

- **Network Protocol Typing (`src/hooks/useOnlineManager.ts`)**:
    - **Current State**: Network messages often use `any` payloads.
    - **Optimization**: Define a strict `NetworkMessage` discriminated union (e.g., `{ type: 'SYNC_STATE', payload: GameState } | { type: 'ACTION_REQUEST', action: GameAction }`). This ensures that the "Host" receives exactly what it expects and "Guests" parse updates correctly.
- **Action Payload Standardization (`src/logic/actions/*.ts`)**:
    - **Current State**: Action handlers like `handleInitiateBuyJoker` accept `payload: any`.
    - **Optimization**: Replace `payload: any` with strict interfaces (e.g., `BuyJokerPayload`). This is crucial for the new "Host-is-Law" pattern, as the Host must validate these payloads rigorously.
- **Card Data & Abilities (`src/data/realCards.ts`)**:
    - **Optimization**: Remove `as any` casting for ability IDs. Ensure the `Card` interface perfectly matches the static data.

## 2. Architectural Refinement (Post-Decoupling)

v5.0.0 successfully moved much logic out of `useGameLogic` (reducing it by ~500 lines), but further separation is beneficial.

### Next Steps

- **Isolate AI Logic**:
    - Move AI orchestration entirely out of the React lifecycle (`useGameLogic`) and into a pure worker or separate logic controller. The AI should interact with the game state exactly like a human player (via `GameAction` dispatch), further validating the Authoritative Host model.
- **Strict Read-Only State for Views**:
    - Ensure that UI components (Guests) explicitly receive a `Readonly<GameState>` to prevent accidental direct mutation, reinforcing the "One-Way Data Flow" from the Host.

## 3. Testing Strategy Update

With the new architecture, tests need to verify the _authority_ aspect.

### Action Items

- **Authority Verification**: Add tests specifically checking that "Guest" clients cannot mutate state directly and must wait for a "SYNC" message from the Host.
- **Type-Safe Mocking**: Replace `as any` in tests with proper `MockGameState` factories to ensure tests reflect real-world scenarios.

## 4. Immediate Next Steps (Tomorrow)

1.  **Network Schema Definition**: Create `src/types/network.ts` to define the strict protocol between Host and Guest.
2.  **Action Type Hardening**: systemically go through `src/logic/actions/` and replace `any` with concrete types.
