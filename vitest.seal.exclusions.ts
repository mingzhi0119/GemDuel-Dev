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
        pattern: 'src/app/shell/gameShellStyles.ts',
        reason: 'Game shell styles are static presentation tokens and layout style objects.',
    },
    {
        pattern: 'src/app/shell/PlayerRail.tsx',
        reason: 'Player rail is a presentational shell that forwards already-tested selectors and callbacks.',
    },
    {
        pattern: 'src/app/routes/GemDuelRoutes.tsx',
        reason: 'Route composition shell primarily stitches together already-tested gameplay surfaces and layout state.',
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
        pattern: 'src/components/cardAnatomy/cardAnatomyData.ts',
        reason: 'Card anatomy copy and icon metadata are static reference data for documentation UI.',
    },
    {
        pattern: 'src/components/cardAnatomy/CardAnatomyDiagram.tsx',
        reason: 'Card anatomy diagram is a documentation-only responsive illustration surface and does not own gameplay or protocol behavior.',
    },
    {
        pattern: 'src/components/cardAnatomy/CardAnatomyGlossary.tsx',
        reason: 'Card anatomy glossary is a documentation-only presentational leaf over static ability metadata.',
    },
    {
        pattern: 'src/components/gameBoard/AnimatedGemButton.tsx',
        reason: 'Animated gem button is a visual leaf over callbacks owned by tested interaction handlers.',
    },
    {
        pattern: 'src/components/playerZone/constants.ts',
        reason: 'Player-zone sizing and display constants are static presentation data.',
    },
    {
        pattern: 'src/components/playerZone/PlayerZoneIdentityColumn.tsx',
        reason: 'Identity column is a presentational leaf that renders already-governed player and privilege props.',
    },
    {
        pattern: 'src/components/playerZone/PlayerZoneReservedColumn.tsx',
        reason: 'Reserved-card column is a presentational leaf over governed card props and callback wiring.',
    },
    {
        pattern: 'src/components/playerZone/PlayerZoneResourcesColumn.tsx',
        reason: 'Resources column is a DOM-heavy presentation surface over already-tested inventory, tableau, and callback state.',
    },
    {
        pattern: 'src/components/playerZone/ScaledCardFrame.tsx',
        reason: 'Scaled card frame is a visual layout primitive with no domain logic.',
    },
    {
        pattern: 'src/components/playerZone/StackOverlay.tsx',
        reason: 'Stack overlay is a presentation-only helper for renderer layering.',
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
        pattern: 'src/data/buffs.ts',
        reason: 'Buff definitions are static reference data with no runtime branching.',
    },
    {
        pattern: 'src/data/buffCopy.ts',
        reason: 'Buff copy barrel is static reference content.',
    },
    {
        pattern: 'src/data/buffCopyCatalog.ts',
        reason: 'Buff copy catalog is static documentation and localization data.',
    },
    {
        pattern: 'src/data/realCards.ts',
        reason: 'Card catalog barrel only re-exports static reference data modules.',
    },
    {
        pattern: 'src/data/realCardsLevel1.ts',
        reason: 'Level 1 card catalog is static reference data.',
    },
    {
        pattern: 'src/data/realCardsLevel2.ts',
        reason: 'Level 2 card catalog is static reference data.',
    },
    {
        pattern: 'src/data/realCardsLevel3.ts',
        reason: 'Level 3 card catalog is static reference data.',
    },
    {
        pattern: 'src/data/realCardsRogue.ts',
        reason: 'Rogue card catalog is static reference data.',
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
        pattern: 'scripts/export-governance-artifacts.mjs',
        reason: 'Artifact exporter entrypoint is exercised through dedicated artifact tests, while the CLI shell remains a thin wrapper.',
    },
    {
        pattern: 'scripts/export-release-health-report.mjs',
        reason: 'CLI wrapper only parses process args and delegates to tested governance modules.',
    },
] as const;

export const SEAL_COVERAGE_EXCLUDE_PATTERNS = SEAL_COVERAGE_EXCLUSIONS.map(
    ({ pattern }) => pattern
);
