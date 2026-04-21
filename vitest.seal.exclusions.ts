export type SealCoverageExclusionCategory = 'leaf' | 'static' | 'wrapper' | 'shell';

export interface SealCoverageExclusion {
    pattern: string;
    reason: string;
    category: SealCoverageExclusionCategory;
    lastReviewedOn: string;
    reviewCadenceDays: number;
    adrPath?: string;
}

const LAST_REVIEWED_ON = '2026-04-21';
const REVIEW_CADENCE_DAYS = 30;
const SHELL_ADR_PATH = 'docs/adr/0008-seal-coverage-exclusion-governance.md';

export const SEAL_COVERAGE_EXCLUSION_GOVERNANCE_POLICY = {
    baselineCount: 73,
    maxReviewCadenceDays: 30,
    shellAdrPath: SHELL_ADR_PATH,
} as const;

const createExclusion = (
    pattern: string,
    reason: string,
    category: SealCoverageExclusionCategory,
    adrPath?: string
): SealCoverageExclusion => ({
    pattern,
    reason,
    category,
    lastReviewedOn: LAST_REVIEWED_ON,
    reviewCadenceDays: REVIEW_CADENCE_DAYS,
    ...(adrPath ? { adrPath } : {}),
});

const leafExclusion = (pattern: string, reason: string) => createExclusion(pattern, reason, 'leaf');
const staticExclusion = (pattern: string, reason: string) =>
    createExclusion(pattern, reason, 'static');
const wrapperExclusion = (pattern: string, reason: string) =>
    createExclusion(pattern, reason, 'wrapper');
const shellExclusion = (pattern: string, reason: string) =>
    createExclusion(pattern, reason, 'shell', SHELL_ADR_PATH);

// Keep this file as the single source of truth for seal exclusions.
// Every entry must stay explicit, carry a 30-day review stamp, and shell-category
// composition surfaces must keep an ADR-backed rationale plus smoke-test coverage.
export const SEAL_COVERAGE_EXCLUSIONS = [
    wrapperExclusion(
        'src/main.tsx',
        'Renderer bootstrap only mounts the root React tree and has no reusable domain behavior.'
    ),
    wrapperExclusion(
        'src/App.tsx',
        'Top-level composition shell delegates behavior to lower-level hooks and routed surfaces that are tested directly.'
    ),
    shellExclusion(
        'src/app/chrome/AppChrome.tsx',
        'Layout chrome is a composition shell whose retained exclusion requires periodic shell-level review.'
    ),
    shellExclusion(
        'src/app/layout/DesktopStage.tsx',
        'Desktop stage is a composition shell around stage anchoring and layout primitives rather than a governed domain surface.'
    ),
    shellExclusion(
        'src/app/overlays/AppOverlayStack.tsx',
        'Overlay stack is a composition shell whose modal behavior is governed by lower-level props and dedicated route tests.'
    ),
    shellExclusion(
        'src/app/shell/GamePlaySurface.tsx',
        'Gameplay surface is a prop-wiring shell around already-tested board, action, and rail primitives.'
    ),
    shellExclusion(
        'src/app/shell/GameShell.tsx',
        'Game shell primarily arranges tested subcomponents and route state without introducing separate domain logic.'
    ),
    staticExclusion(
        'src/app/shell/gameShellStyles.ts',
        'Game shell styles are static presentation tokens and layout style objects.'
    ),
    shellExclusion(
        'src/app/shell/PlayerRail.tsx',
        'Player rail is a composition shell that forwards already-tested selectors and callbacks.'
    ),
    wrapperExclusion(
        'src/app/routes/GemDuelRoutes.tsx',
        'Route composition shell primarily stitches together already-tested gameplay surfaces and layout state.'
    ),
    leafExclusion(
        'src/components/CardAnatomyPage.tsx',
        'Reference-only anatomy page is documentation UI rather than gameplay logic.'
    ),
    leafExclusion(
        'src/components/Card.tsx',
        'Card renderer is a DOM-heavy presentation surface whose domain behavior is already governed by card data and reducer tests.'
    ),
    leafExclusion(
        'src/components/DebugPanel.tsx',
        'Developer-only diagnostics surface is primarily prop wiring and visual rendering.'
    ),
    leafExclusion(
        'src/components/DraftScreen.tsx',
        'Draft screen is a renderer composition surface with behavior delegated to tested route state and selectors.'
    ),
    leafExclusion(
        'src/components/DeckPeekModal.tsx',
        'Deck peek modal is a pure presentation leaf with no hooks, reducer dispatch, or protocol logic.'
    ),
    leafExclusion(
        'src/components/GameActions.tsx',
        'Game actions panel is a presentational control strip with behavior owned by passed-in callbacks.'
    ),
    leafExclusion(
        'src/components/GameBoard.tsx',
        'Board renderer is a DOM-heavy interaction surface backed by separately tested interaction hooks and reducer rules.'
    ),
    leafExclusion(
        'src/components/GameConfigMenu.tsx',
        'Configuration menu is a view-state form shell with domain behavior owned by passed-in callbacks and setup logic.'
    ),
    leafExclusion('src/components/GemIcon.tsx', 'Gem icon is a static visual leaf component.'),
    leafExclusion(
        'src/components/Market.tsx',
        'Market renderer is a DOM-heavy presentation layer over separately tested purchase and reserve logic.'
    ),
    leafExclusion(
        'src/components/OnlineMenu.tsx',
        'Online setup surface is mostly view-state wiring and form rendering outside the audited domain boundary.'
    ),
    leafExclusion(
        'src/components/PlayerZone.tsx',
        'Player zone is a large renderer composition surface whose behavioral guarantees come from reducer, selector, and interaction tests.'
    ),
    leafExclusion(
        'src/components/ReplayControls.tsx',
        'Replay controls are a presentational leaf that forwards precomputed history handlers.'
    ),
    leafExclusion(
        'src/components/RoyalCourt.tsx',
        'Royal court is a presentational surface over already-tested score and crown calculations.'
    ),
    leafExclusion(
        'src/components/Rulebook.tsx',
        'Rulebook is documentation UI and does not own gameplay or protocol behavior.'
    ),
    staticExclusion(
        'src/components/RulebookContent.ts',
        'Rulebook content is a static copy catalog.'
    ),
    leafExclusion(
        'src/components/StatusBar.tsx',
        'Status bar is a presentational leaf that renders already-governed status props.'
    ),
    leafExclusion(
        'src/components/UpdateNotification.tsx',
        'Update notification is a thin presentation surface over governed updater state.'
    ),
    leafExclusion(
        'src/components/VisualFeedback.tsx',
        'Visual feedback is a presentational animation surface with no domain branching.'
    ),
    leafExclusion(
        'src/components/TopBar.tsx',
        'Top bar is a renderer composition surface whose behavioral inputs are already covered by tested selectors and controllers.'
    ),
    leafExclusion(
        'src/components/WinnerModal.tsx',
        'Winner modal is a presentational end-state surface with callback-only behavior.'
    ),
    leafExclusion(
        'src/components/card/CardAbilityBadges.tsx',
        'Ability badges are static visual leaves derived from already-tested card data.'
    ),
    leafExclusion(
        'src/components/card/CardFacePattern.tsx',
        'Card face pattern is decorative rendering only.'
    ),
    staticExclusion(
        'src/components/cardAnatomy/cardAnatomyData.ts',
        'Card anatomy copy and icon metadata are static reference data for documentation UI.'
    ),
    leafExclusion(
        'src/components/cardAnatomy/CardAnatomyDiagram.tsx',
        'Card anatomy diagram is a documentation-only responsive illustration surface and does not own gameplay or protocol behavior.'
    ),
    leafExclusion(
        'src/components/cardAnatomy/CardAnatomyGlossary.tsx',
        'Card anatomy glossary is a documentation-only presentational leaf over static ability metadata.'
    ),
    leafExclusion(
        'src/components/gameBoard/AnimatedGemButton.tsx',
        'Animated gem button is a visual leaf over callbacks owned by tested interaction handlers.'
    ),
    staticExclusion(
        'src/components/playerZone/constants.ts',
        'Player-zone sizing and display constants are static presentation data.'
    ),
    leafExclusion(
        'src/components/playerZone/PlayerZoneIdentityColumn.tsx',
        'Identity column is a presentational leaf that renders already-governed player and privilege props.'
    ),
    leafExclusion(
        'src/components/playerZone/PlayerZoneReservedColumn.tsx',
        'Reserved-card column is a presentational leaf over governed card props and callback wiring.'
    ),
    leafExclusion(
        'src/components/playerZone/PlayerZoneResourcesColumn.tsx',
        'Resources column is a DOM-heavy presentation surface over already-tested inventory, tableau, and callback state.'
    ),
    leafExclusion(
        'src/components/playerZone/ScaledCardFrame.tsx',
        'Scaled card frame is a visual layout primitive with no domain logic.'
    ),
    leafExclusion(
        'src/components/playerZone/StackOverlay.tsx',
        'Stack overlay is a presentation-only helper for renderer layering.'
    ),
    leafExclusion(
        'src/components/topBar/AnimatedScore.tsx',
        'Animated score is a display-only animation primitive.'
    ),
    wrapperExclusion(
        'src/hoc/withGameAnimation.tsx',
        'Animation HOC is a render-only adapter around framer-motion primitives.'
    ),
    wrapperExclusion(
        'src/types/reason.ts',
        'Reason-catalog typing helpers are exercised indirectly through higher-level reason and telemetry tests.'
    ),
    wrapperExclusion(
        'src/utils.ts',
        'Legacy UI utility helpers are exercised indirectly across reducer and selector suites and are excluded to keep the seal denominator focused on governed contracts.'
    ),
    staticExclusion('src/styles/buffs.ts', 'Buff style table is static presentation data.'),
    staticExclusion(
        'src/data/buffs.ts',
        'Buff definitions are static reference data with no runtime branching.'
    ),
    staticExclusion('src/data/buffCopy.ts', 'Buff copy barrel is static reference content.'),
    staticExclusion(
        'src/data/buffCopyCatalog.ts',
        'Buff copy catalog is static documentation and localization data.'
    ),
    staticExclusion(
        'src/data/realCards.ts',
        'Card catalog barrel only re-exports static reference data modules.'
    ),
    staticExclusion(
        'src/data/realCardsLevel1.ts',
        'Level 1 card catalog is static reference data.'
    ),
    staticExclusion(
        'src/data/realCardsLevel2.ts',
        'Level 2 card catalog is static reference data.'
    ),
    staticExclusion(
        'src/data/realCardsLevel3.ts',
        'Level 3 card catalog is static reference data.'
    ),
    staticExclusion('src/data/realCardsRogue.ts', 'Rogue card catalog is static reference data.'),
    wrapperExclusion(
        'electron/main.js',
        'Electron main process bootstrap is exercised through desktop governance checks rather than Vitest unit coverage.'
    ),
    wrapperExclusion(
        'electron/preload.js',
        'Preload bootstrap is a thin bridge entrypoint covered by desktop governance contract tests.'
    ),
    wrapperExclusion(
        'electron/preloadContract.cjs',
        'Preload contract has a dedicated contract test suite, so the bridge shim is excluded from the aggregate seal denominator.'
    ),
    wrapperExclusion(
        'scripts/check-architecture-budgets.mjs',
        'CLI wrapper only parses process args and delegates to tested governance modules.'
    ),
    wrapperExclusion(
        'scripts/check-boundary-governance.mjs',
        'CLI wrapper only parses process args and delegates to tested governance modules.'
    ),
    wrapperExclusion(
        'scripts/check-build-budget.mjs',
        'CLI wrapper only parses process args and delegates to tested governance modules.'
    ),
    wrapperExclusion(
        'scripts/check-dependency-governance.mjs',
        'CLI wrapper only parses process args and delegates to tested governance modules.'
    ),
    wrapperExclusion(
        'scripts/check-electron-governance.mjs',
        'CLI wrapper only parses process args and delegates to tested governance modules.'
    ),
    wrapperExclusion(
        'scripts/check-governance-evidence-health.mjs',
        'CLI wrapper only parses process args and delegates to tested governance modules.'
    ),
    wrapperExclusion(
        'scripts/check-license-governance.mjs',
        'CLI wrapper only parses process args and delegates to tested governance modules.'
    ),
    wrapperExclusion(
        'scripts/check-release-health.mjs',
        'CLI wrapper only parses process args and delegates to tested governance modules.'
    ),
    wrapperExclusion(
        'scripts/check-release-tag-provenance.mjs',
        'CLI wrapper only parses process args and delegates to tested governance modules.'
    ),
    wrapperExclusion(
        'scripts/check-runtime-drill-governance.mjs',
        'CLI wrapper only parses process args and delegates to tested governance modules.'
    ),
    wrapperExclusion(
        'scripts/check-sbom-governance.mjs',
        'CLI wrapper only parses process args and delegates to tested governance modules.'
    ),
    wrapperExclusion(
        'scripts/check-secret-governance.mjs',
        'CLI wrapper only parses process args and delegates to tested governance modules.'
    ),
    wrapperExclusion(
        'scripts/export-governance-artifacts.mjs',
        'Artifact exporter entrypoint is exercised through dedicated artifact tests, while the CLI shell remains a thin wrapper.'
    ),
    wrapperExclusion(
        'scripts/export-release-health-report.mjs',
        'CLI wrapper only parses process args and delegates to tested governance modules.'
    ),
] as const satisfies readonly SealCoverageExclusion[];

export const SEAL_COVERAGE_EXCLUDE_PATTERNS = SEAL_COVERAGE_EXCLUSIONS.map(
    ({ pattern }) => pattern
);
