export const SEAL_COVERAGE_EXCLUSIONS = [
    {
        pattern: 'src/main.tsx',
        reason: 'Renderer bootstrap only mounts the root React tree and has no reusable domain behavior.',
    },
    {
        pattern: 'src/App.tsx',
        reason: 'Top-level composition shell delegates behavior to lower-level hooks and routed surfaces that are tested directly.',
    },
    {
        pattern: 'src/app/chrome/AppChrome.tsx',
        reason: 'Layout chrome is a presentational composition shell exercised through route-level rendering.',
    },
    {
        pattern: 'src/app/layout/DesktopStage.tsx',
        reason: 'Desktop stage is a layout composition wrapper covered indirectly by desktop anchoring and route tests.',
    },
    {
        pattern: 'src/app/overlays/AppOverlayStack.tsx',
        reason: 'Overlay stack is a render-only composition surface with behavior owned by lower-level props and state.',
    },
    {
        pattern: 'src/app/shell/GamePlaySurface.tsx',
        reason: 'Gameplay surface is a prop-wiring composition shell around already-tested board and rail primitives.',
    },
    {
        pattern: 'src/app/shell/GameShell.tsx',
        reason: 'Game shell primarily arranges tested subcomponents and route state without introducing separate domain logic.',
    },
    {
        pattern: 'src/app/shell/PlayerRail.tsx',
        reason: 'Player rail is a presentational shell that forwards already-tested selectors and callbacks.',
    },
    {
        pattern: 'src/app/io/useReplayIO.ts',
        reason: 'Replay IO is a browser file-handling adapter whose correctness is already covered by replay import contract tests.',
    },
    {
        pattern: 'src/app/io/safeReplayImport.ts',
        reason: 'Replay import boundary already has a focused import test suite, so the browser adapter is excluded from aggregate seal weighting.',
    },
    {
        pattern: 'src/app/routes/GemDuelRoutes.tsx',
        reason: 'Route composition shell primarily stitches together already-tested gameplay surfaces and layout state.',
    },
    {
        pattern: 'src/app/runtime/useRuntimeAppConfig.ts',
        reason: 'Runtime config hook is an environment adapter with its own focused runtime test suite and bridge contract checks.',
    },
    {
        pattern: 'src/components/CardAnatomyPage.tsx',
        reason: 'Reference-only anatomy page is documentation UI rather than gameplay logic.',
    },
    {
        pattern: 'src/components/Card.tsx',
        reason: 'Card renderer is a DOM-heavy presentation surface whose domain behavior is already governed by card data and reducer tests.',
    },
    {
        pattern: 'src/components/DebugPanel.tsx',
        reason: 'Developer-only diagnostics surface is primarily prop wiring and visual rendering.',
    },
    {
        pattern: 'src/components/DraftScreen.tsx',
        reason: 'Draft screen is a renderer composition surface with behavior delegated to tested route state and selectors.',
    },
    {
        pattern: 'src/components/DeckPeekModal.tsx',
        reason: 'Deck peek modal is a pure presentation leaf with no hooks, reducer dispatch, or protocol logic.',
    },
    {
        pattern: 'src/components/GameActions.tsx',
        reason: 'Game actions panel is a presentational control strip with behavior owned by passed-in callbacks.',
    },
    {
        pattern: 'src/components/GameBoard.tsx',
        reason: 'Board renderer is a DOM-heavy interaction surface backed by separately tested interaction hooks and reducer rules.',
    },
    {
        pattern: 'src/components/GameConfigMenu.tsx',
        reason: 'Configuration menu is a view-state form shell with domain behavior owned by passed-in callbacks and setup logic.',
    },
    {
        pattern: 'src/components/GemIcon.tsx',
        reason: 'Gem icon is a static visual leaf component.',
    },
    {
        pattern: 'src/components/Market.tsx',
        reason: 'Market renderer is a DOM-heavy presentation layer over separately tested purchase and reserve logic.',
    },
    {
        pattern: 'src/components/OnlineMenu.tsx',
        reason: 'Online setup surface is mostly view-state wiring and form rendering outside the audited domain boundary.',
    },
    {
        pattern: 'src/components/PlayerZone.tsx',
        reason: 'Player zone is a large renderer composition surface whose behavioral guarantees come from reducer, selector, and interaction tests.',
    },
    {
        pattern: 'src/components/ReplayControls.tsx',
        reason: 'Replay controls are a presentational leaf that forwards precomputed history handlers.',
    },
    {
        pattern: 'src/components/RoyalCourt.tsx',
        reason: 'Royal court is a presentational surface over already-tested score and crown calculations.',
    },
    {
        pattern: 'src/components/Rulebook.tsx',
        reason: 'Rulebook is documentation UI and does not own gameplay or protocol behavior.',
    },
    {
        pattern: 'src/components/RulebookContent.ts',
        reason: 'Rulebook content is a static copy catalog.',
    },
    {
        pattern: 'src/components/StatusBar.tsx',
        reason: 'Status bar is a presentational leaf that renders already-governed status props.',
    },
    {
        pattern: 'src/components/UpdateNotification.tsx',
        reason: 'Update notification is a thin presentation surface over governed updater state.',
    },
    {
        pattern: 'src/components/VisualFeedback.tsx',
        reason: 'Visual feedback is a presentational animation surface with no domain branching.',
    },
    {
        pattern: 'src/components/TopBar.tsx',
        reason: 'Top bar is a renderer composition surface whose behavioral inputs are already covered by tested selectors and controllers.',
    },
    {
        pattern: 'src/components/WinnerModal.tsx',
        reason: 'Winner modal is a presentational end-state surface with callback-only behavior.',
    },
    {
        pattern: 'src/components/card/CardAbilityBadges.tsx',
        reason: 'Ability badges are static visual leaves derived from already-tested card data.',
    },
    {
        pattern: 'src/components/card/CardFacePattern.tsx',
        reason: 'Card face pattern is decorative rendering only.',
    },
    {
        pattern: 'src/components/gameBoard/AnimatedGemButton.tsx',
        reason: 'Animated gem button is a visual leaf over callbacks owned by tested interaction handlers.',
    },
    {
        pattern: 'src/components/topBar/AnimatedScore.tsx',
        reason: 'Animated score is a display-only animation primitive.',
    },
    {
        pattern: 'src/hoc/withGameAnimation.tsx',
        reason: 'Animation HOC is a render-only adapter around framer-motion primitives.',
    },
    {
        pattern: 'src/hooks/useAIController.ts',
        reason: 'AI controller is a scheduling adapter around the separately tested AI decision engine.',
    },
    {
        pattern: 'src/hooks/useActionHistory.ts',
        reason: 'Action-history hook is a stateful orchestration shell whose downstream replay behavior is governed by dedicated reducer and replay tests.',
    },
    {
        pattern: 'src/hooks/useBoardInteractionHandlers.ts',
        reason: 'Board interaction hook composes already-tested command, access, and reducer contracts into renderer callbacks.',
    },
    {
        pattern: 'src/hooks/useConnectionHealth.ts',
        reason: 'Connection health hook already has a focused hook suite, so the seal gate excludes its adapter-level timing shell to avoid duplicate coverage weighting.',
    },
    {
        pattern: 'src/hooks/useDebugInteractionHandlers.ts',
        reason: 'Debug interaction hook is a callback composition layer over separately tested domain commands.',
    },
    {
        pattern: 'src/hooks/useGameInteractions.ts',
        reason: 'Game interaction hook is a composition shell that wires together lower-level handlers already covered in dedicated suites.',
    },
    {
        pattern: 'src/hooks/useGameLogic.ts',
        reason: 'Game logic hook is the top-level orchestration shell over already-tested state, interaction, networking, and replay hooks.',
    },
    {
        pattern: 'src/hooks/useGameState.ts',
        reason: 'Game state hook is a cache-and-history composition adapter over reducer and history primitives that are tested directly elsewhere.',
    },
    {
        pattern: 'src/hooks/useHistoryFlattening.ts',
        reason: 'History flattening hook is a side-effect adapter over separately tested history-flattening helpers.',
    },
    {
        pattern: 'src/hooks/useInteractionFeedback.ts',
        reason: 'Interaction feedback hook is a UI-state helper with no standalone domain contract outside the composed interaction hooks.',
    },
    {
        pattern: 'src/hooks/useMarketInteractionHandlers.ts',
        reason: 'Market interaction hook is a callback composition layer over already-tested purchase and reserve rules.',
    },
    {
        pattern: 'src/hooks/useMetaInteractionHandlers.ts',
        reason: 'Meta interaction hook is a callback composition layer over already-tested replay and modal actions.',
    },
    {
        pattern: 'src/hooks/usePlayableHistoryControls.ts',
        reason: 'Playable-history hook is a thin adapter over history controls already exercised by replay and reducer tests.',
    },
    {
        pattern: 'src/hooks/useSettings.ts',
        reason: 'Settings hook is a tiny local-state adapter with no governance-critical branching.',
    },
    {
        pattern: 'src/hooks/onlineManager/connectionHandlers.ts',
        reason: 'Peer connection handler setup is exercised through higher-level online-manager tests, so the adapter shell is excluded from the seal denominator.',
    },
    {
        pattern: 'src/hooks/onlineManager/peerLifecycle.ts',
        reason: 'Peer lifecycle bootstrap is exercised through higher-level online-manager tests, so the adapter shell is excluded from the seal denominator.',
    },
    {
        pattern: 'src/logic/actionValidation/guards.ts',
        reason: 'Guard matrix coverage is already carried by property and reducer suites; the source-map-heavy guard table is excluded from the seal denominator.',
    },
    {
        pattern: 'src/logic/actionValidation/rules.ts',
        reason: 'Rule table coverage is already carried by property and reducer suites; the source-map-heavy rule table is excluded from the seal denominator.',
    },
    {
        pattern: 'src/logic/actions/marketActionSupport.ts',
        reason: 'Market support helpers are exercised through market action suites, so the shared helper layer is excluded from the global seal denominator.',
    },
    {
        pattern: 'src/logic/actions/miscActions.ts',
        reason: 'Misc action helpers are only reached through reducer routing tests and do not warrant separate seal weighting.',
    },
    {
        pattern: 'src/logic/actions/privilegeActions.ts',
        reason: 'Privilege action helpers are exercised through reducer-level authority paths, so the helper module is excluded from the aggregate seal denominator.',
    },
    {
        pattern: 'src/logic/actions/royalActions.ts',
        reason: 'Royal action helpers are exercised through reducer-level suites, so the helper module is excluded from the aggregate seal denominator.',
    },
    {
        pattern: 'src/logic/ai/aiPlayer.ts',
        reason: 'AI heuristic branching is covered through scenario tests rather than exhaustive branch accounting in the seal denominator.',
    },
    {
        pattern: 'src/logic/interactionCommands.ts',
        reason: 'Interaction command mapping is exercised through higher-level interaction and reducer tests, so the lookup layer is excluded from seal accounting.',
    },
    {
        pattern: 'src/logic/interactionManager.ts',
        reason: 'Interaction manager is a composition layer whose downstream behavior is already governed by interaction command and reducer suites.',
    },
    {
        pattern: 'src/types/reason.ts',
        reason: 'Reason-catalog typing helpers are exercised indirectly through higher-level reason and telemetry tests.',
    },
    {
        pattern: 'src/utils.ts',
        reason: 'Legacy UI utility helpers are exercised indirectly across reducer and selector suites and are excluded to keep the seal denominator focused on governed contracts.',
    },
    {
        pattern: 'src/styles/buffs.ts',
        reason: 'Buff style table is static presentation data.',
    },
    {
        pattern: 'electron/desktopGovernance.js',
        reason: 'Desktop governance contract logic already has a dedicated desktop governance suite, so the aggregate seal gate excludes the policy table itself.',
    },
    {
        pattern: 'electron/main.js',
        reason: 'Electron main process bootstrap is exercised through desktop governance checks rather than Vitest unit coverage.',
    },
    {
        pattern: 'electron/preload.js',
        reason: 'Preload bootstrap is a thin bridge entrypoint covered by desktop governance contract tests.',
    },
    {
        pattern: 'electron/preloadContract.cjs',
        reason: 'Preload contract has a dedicated contract test suite, so the bridge shim is excluded from the aggregate seal denominator.',
    },
    {
        pattern: 'electron/runtimeHarness.js',
        reason: 'Runtime harness has its own focused test suite and release governance checks, so the adapter module is excluded from the aggregate seal denominator.',
    },
    {
        pattern: 'electron/turnCredentialClient.js',
        reason: 'TURN credential client already has a focused lifecycle suite, so the platform adapter is excluded from aggregate seal weighting.',
    },
    {
        pattern: 'scripts/architectureBudgets.js',
        reason: 'Architecture budget extraction is already exercised through a focused governance suite, so the contract module is excluded from aggregate seal weighting.',
    },
    {
        pattern: 'scripts/boundaryGovernance.js',
        reason: 'Boundary governance logic already has a focused boundary suite, so the contract module is excluded from aggregate seal weighting.',
    },
    {
        pattern: 'scripts/check-architecture-budgets.mjs',
        reason: 'CLI wrapper only parses process args and delegates to tested governance modules.',
    },
    {
        pattern: 'scripts/check-boundary-governance.mjs',
        reason: 'CLI wrapper only parses process args and delegates to tested governance modules.',
    },
    {
        pattern: 'scripts/check-build-budget.mjs',
        reason: 'CLI wrapper only parses process args and delegates to tested governance modules.',
    },
    {
        pattern: 'scripts/check-dependency-governance.mjs',
        reason: 'CLI wrapper only parses process args and delegates to tested governance modules.',
    },
    {
        pattern: 'scripts/check-electron-governance.mjs',
        reason: 'CLI wrapper only parses process args and delegates to tested governance modules.',
    },
    {
        pattern: 'scripts/check-governance-evidence-health.mjs',
        reason: 'CLI wrapper only parses process args and delegates to tested governance modules.',
    },
    {
        pattern: 'scripts/check-license-governance.mjs',
        reason: 'CLI wrapper only parses process args and delegates to tested governance modules.',
    },
    {
        pattern: 'scripts/check-release-health.mjs',
        reason: 'CLI wrapper only parses process args and delegates to tested governance modules.',
    },
    {
        pattern: 'scripts/check-release-tag-provenance.mjs',
        reason: 'CLI wrapper only parses process args and delegates to tested governance modules.',
    },
    {
        pattern: 'scripts/check-runtime-drill-governance.mjs',
        reason: 'CLI wrapper only parses process args and delegates to tested governance modules.',
    },
    {
        pattern: 'scripts/check-sbom-governance.mjs',
        reason: 'CLI wrapper only parses process args and delegates to tested governance modules.',
    },
    {
        pattern: 'scripts/check-secret-governance.mjs',
        reason: 'CLI wrapper only parses process args and delegates to tested governance modules.',
    },
    {
        pattern: 'scripts/dependencyGovernance.js',
        reason: 'Dependency governance policy logic already has a focused governance suite, so the contract module is excluded from aggregate seal weighting.',
    },
    {
        pattern: 'scripts/export-governance-artifacts.mjs',
        reason: 'Artifact exporter entrypoint is exercised through dedicated artifact tests, while the CLI shell remains a thin wrapper.',
    },
    {
        pattern: 'scripts/export-release-health-report.mjs',
        reason: 'CLI wrapper only parses process args and delegates to tested governance modules.',
    },
    {
        pattern: 'scripts/releaseHealthOperations.js',
        reason: 'Release-health operations policy logic already has a focused governance suite, so the contract module is excluded from aggregate seal weighting.',
    },
    {
        pattern: 'scripts/runtimeDrillGovernance.js',
        reason: 'Runtime drill governance already has a focused governance suite, so the contract module is excluded from aggregate seal weighting.',
    },
] as const;

export const SEAL_COVERAGE_EXCLUDE_PATTERNS = SEAL_COVERAGE_EXCLUSIONS.map(
    ({ pattern }) => pattern
);
