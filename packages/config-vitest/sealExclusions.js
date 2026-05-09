import { minimatch } from 'minimatch';

const LAST_REVIEWED_ON = '2026-04-21';
const REVIEW_CADENCE_DAYS = 30;
const SHELL_ADR_PATH = 'docs/adr/0008-seal-coverage-exclusion-governance.md';

/** Canonical owner roles for seal exclusion ledger (P3-2). */
export const SEAL_EXCLUSION_OWNER_ROLES = Object.freeze([
    'Frontend Platform',
    'Domain Logic',
    'Networking',
    'Desktop Platform',
    'Release Engineering',
]);

export const SEAL_COVERAGE_EXCLUSION_GOVERNANCE_POLICY = {
    baselineCount: 100,
    maxReviewCadenceDays: 30,
    shellAdrPath: SHELL_ADR_PATH,
};

const OR = {
    FP: 'Frontend Platform',
    DL: 'Domain Logic',
    NW: 'Networking',
    DP: 'Desktop Platform',
    RE: 'Release Engineering',
};

const norm = (pattern) => pattern.replace(/\\/g, '/');

const inferLeafOwnerRole = (pattern) => {
    const p = norm(pattern);
    if (p.includes('packages/shared/')) {
        return OR.DL;
    }
    return OR.FP;
};

const inferStaticOwnerRole = (pattern) => {
    const p = norm(pattern);
    if (p.includes('packages/shared/src/data/')) {
        return OR.DL;
    }
    if (p.includes('packages/ui/')) {
        return OR.FP;
    }
    return OR.DL;
};

const inferWrapperOwnerRole = (pattern) => {
    const p = norm(pattern);
    if (p.includes('tools/scripts')) {
        return OR.RE;
    }
    if (p.includes('electron/')) {
        return OR.DP;
    }
    if (p.includes('gameNetwork/')) {
        return OR.NW;
    }
    if (p.includes('packages/shared/src/types/') || p.endsWith('packages/shared/src/utils.ts')) {
        return OR.DL;
    }
    return OR.FP;
};

const inferShellOwnerRole = (pattern) => {
    const p = norm(pattern);
    if (p.includes('DesktopStage.tsx')) {
        return OR.DP;
    }
    return OR.FP;
};

const createExclusion = (pattern, reason, category, adrPath, ownerRole) => ({
    pattern,
    reason,
    category,
    ownerRole,
    lastReviewedOn: LAST_REVIEWED_ON,
    reviewCadenceDays: REVIEW_CADENCE_DAYS,
    ...(adrPath ? { adrPath } : {}),
});

const leafExclusion = (pattern, reason, ownerRole = inferLeafOwnerRole(pattern)) =>
    createExclusion(pattern, reason, 'leaf', undefined, ownerRole);
const staticExclusion = (pattern, reason, ownerRole = inferStaticOwnerRole(pattern)) =>
    createExclusion(pattern, reason, 'static', undefined, ownerRole);
const wrapperExclusion = (pattern, reason, ownerRole = inferWrapperOwnerRole(pattern)) =>
    createExclusion(pattern, reason, 'wrapper', undefined, ownerRole);
const shellExclusion = (pattern, reason, ownerRole = inferShellOwnerRole(pattern)) =>
    createExclusion(pattern, reason, 'shell', SHELL_ADR_PATH, ownerRole);

const VISUAL_LAB_SHELL_ADR = 'docs/adr/0009-visual-lab-shell-exclusion.md';
const visualLabShellExclusion = (pattern, reason, ownerRole = OR.FP) =>
    createExclusion(pattern, reason, 'shell', VISUAL_LAB_SHELL_ADR, ownerRole);

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
    leafExclusion(
        'src/app/presentation/AbilityCalloutStack.tsx',
        'Ability callouts are visual animation leaves over presentation events that are covered by controller and event-derivation tests.'
    ),
    leafExclusion(
        'src/app/presentation/CardFlightLayer.tsx',
        'Card flight layer is a DOM-measurement animation surface validated by presentation event tests and browser smoke checks.'
    ),
    leafExclusion(
        'src/app/presentation/DeckBackFace.tsx',
        'Deck back face is a visual asset leaf with no gameplay or protocol branching.'
    ),
    leafExclusion(
        'src/app/presentation/GemFlightLayer.tsx',
        'Gem flight layer is a visual animation surface over already-tested gem presentation events.'
    ),
    shellExclusion(
        'src/app/presentation/PresentationLayer.tsx',
        'Presentation layer composes tested event controllers and visual animation leaves without owning domain decisions.'
    ),
    shellExclusion(
        'src/app/presentation/ThreePresentationLayer.tsx',
        'Three presentation layer is visual WebGL composition over tested DOM anchor collectors and smoke-tested fallback behavior.'
    ),
    shellExclusion(
        'src/app/presentation/ThreeCardSlabLayer.tsx',
        'Three card slab layer is visual WebGL composition over tested card anchor collectors and runtime fallback status.'
    ),
    leafExclusion(
        'src/app/presentation/threeCardSlabObjects.ts',
        'Three card slab mesh factory creates visual-only geometry and materials from tested card slab anchor snapshots.'
    ),
    leafExclusion(
        'src/app/presentation/TurnHandoffBanner.tsx',
        'Turn handoff banner is a transient visual leaf over already-governed turn events.'
    ),
    staticExclusion(
        'src/app/presentation/cardFlightStyles.ts',
        'Card flight keyframes are static animation CSS tokens.'
    ),
    wrapperExclusion(
        'src/app/presentation/presentationGeometry.ts',
        'Presentation geometry is a DOM anchor measurement adapter exercised by browser smoke checks.'
    ),
    wrapperExclusion(
        'src/app/presentation/presentationTypes.ts',
        'Presentation event contracts are type-only surfaces exercised through event and controller tests.'
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
    wrapperExclusion(
        'src/app/shell/presentationPreview.ts',
        'Presentation preview helpers are browser-query developer tooling over already-tested presentation events.'
    ),
    wrapperExclusion(
        'src/app/shell/surfacePreviewQuery.ts',
        'Surface preview query helpers only map local browser preview parameters into runtime surface selections.'
    ),
    shellExclusion(
        'src/app/shell/PlayerRail.tsx',
        'Player rail is a composition shell that forwards already-tested selectors and callbacks.'
    ),
    wrapperExclusion(
        'src/app/routes/GemDuelRoutes.tsx',
        'Route composition shell primarily stitches together already-tested gameplay surfaces and layout state.'
    ),
    visualLabShellExclusion(
        'src/app/visual-lab/MotionLabControls.tsx',
        'Visual lab motion controls are developer-only QA wiring over presentation events; smoke tests cover mount safety.'
    ),
    visualLabShellExclusion(
        'src/app/visual-lab/SurfaceLabControls.tsx',
        'Visual lab surface controls are developer-only asset preview wiring; smoke tests cover mount safety.'
    ),
    visualLabShellExclusion(
        'src/app/visual-lab/SurfaceLabSelect.tsx',
        'Visual lab surface selector is developer-only catalog UI; smoke tests cover mount safety.'
    ),
    visualLabShellExclusion(
        'src/app/visual-lab/VisualLabConsole.tsx',
        'Visual lab console is a developer diagnostics composition shell; smoke tests cover mount safety.'
    ),
    visualLabShellExclusion(
        'src/app/visual-lab/VisualLabRoute.tsx',
        'Visual lab route composes tested presentation and shell primitives behind a URL gate; smoke tests cover mount safety.'
    ),
    visualLabShellExclusion(
        'src/app/visual-lab/useSurfaceLabCatalog.ts',
        'Visual lab catalog hook loads developer asset metadata only; smoke tests exercise the route that consumes it.'
    ),
    visualLabShellExclusion(
        'src/app/visual-lab/visualLabStyles.ts',
        'Visual lab shell styles are static layout tokens for the diagnostics panel; behavior is visual-only.'
    ),
    wrapperExclusion(
        'src/hooks/gameNetwork/useAuthoritativeReplaySync.ts',
        'Authoritative replay sync hook is validated by fixture-backed unit tests and useGameNetwork integration; residual branches are defensive checksum paths tied to live payloads.'
    ),
    wrapperExclusion(
        'src/hooks/gameNetwork/useNetworkEventHandlers.ts',
        'Network event handler wiring is exercised through useGameNetwork integration tests and protocol matrices; the module is orchestration-only over already-governed dispatch paths.'
    ),
    wrapperExclusion(
        'src/hooks/onlineManager/types.ts',
        'Online-manager local types are type-only contracts exercised indirectly through tested runtime adapters and hooks.'
    ),
    wrapperExclusion(
        'src/types/index.ts',
        'App-local type barrel only re-exports UI contracts for consumer ergonomics and has no runtime behavior.'
    ),
    wrapperExclusion(
        'src/types/ui.ts',
        'App-local UI contract definitions are compile-time only and are exercised indirectly through routed shell and hook tests.'
    ),
    leafExclusion(
        '../../packages/ui/src/components/CardAnatomyPage.tsx',
        'Reference-only anatomy page is documentation UI rather than gameplay logic.'
    ),
    leafExclusion(
        '../../packages/ui/src/components/Card.tsx',
        'Card renderer is a DOM-heavy presentation surface whose domain behavior is already governed by card data and reducer tests.'
    ),
    leafExclusion(
        '../../packages/ui/src/components/DebugPanel.tsx',
        'Developer-only diagnostics surface is primarily prop wiring and visual rendering.'
    ),
    leafExclusion(
        '../../packages/ui/src/components/DraftScreen.tsx',
        'Draft screen is a renderer composition surface with behavior delegated to tested route state and selectors.'
    ),
    leafExclusion(
        '../../packages/ui/src/components/DeckPeekModal.tsx',
        'Deck peek modal is a pure presentation leaf with no hooks, reducer dispatch, or protocol logic.'
    ),
    leafExclusion(
        '../../packages/ui/src/components/GameActions.tsx',
        'Game actions panel is a presentational control strip with behavior owned by passed-in callbacks.'
    ),
    leafExclusion(
        '../../packages/ui/src/components/GameBoard.tsx',
        'Board renderer is a DOM-heavy interaction surface backed by separately tested interaction hooks and reducer rules.'
    ),
    leafExclusion(
        '../../packages/ui/src/components/GameConfigMenu.tsx',
        'Configuration menu is a view-state form shell with domain behavior owned by passed-in callbacks and setup logic.'
    ),
    leafExclusion(
        '../../packages/ui/src/components/GemIcon.tsx',
        'Gem icon is a static visual leaf component.'
    ),
    leafExclusion(
        '../../packages/ui/src/components/Market.tsx',
        'Market renderer is a DOM-heavy presentation layer over separately tested purchase and reserve logic.'
    ),
    leafExclusion(
        '../../packages/ui/src/components/OnlineMenu.tsx',
        'Online setup surface is mostly view-state wiring and form rendering outside the audited domain boundary.'
    ),
    leafExclusion(
        '../../packages/ui/src/components/PlayerZone.tsx',
        'Player zone is a large renderer composition surface whose behavioral guarantees come from reducer, selector, and interaction tests.'
    ),
    leafExclusion(
        '../../packages/ui/src/components/ReplayControls.tsx',
        'Replay controls are a presentational leaf that forwards precomputed history handlers.'
    ),
    leafExclusion(
        '../../packages/ui/src/components/RoyalCourt.tsx',
        'Royal court is a presentational surface over already-tested score and crown calculations.'
    ),
    leafExclusion(
        '../../packages/ui/src/components/Rulebook.tsx',
        'Rulebook is documentation UI and does not own gameplay or protocol behavior.'
    ),
    staticExclusion(
        '../../packages/ui/src/components/RulebookContent.ts',
        'Rulebook content is a static copy catalog.'
    ),
    leafExclusion(
        '../../packages/ui/src/components/StatusBar.tsx',
        'Status bar is a presentational leaf that renders already-governed status props.'
    ),
    leafExclusion(
        '../../packages/ui/src/components/UpdateNotification.tsx',
        'Update notification is a thin presentation surface over governed updater state.'
    ),
    leafExclusion(
        '../../packages/ui/src/components/VisualFeedback.tsx',
        'Visual feedback is a presentational animation surface with no domain branching.'
    ),
    leafExclusion(
        '../../packages/ui/src/components/TopBar.tsx',
        'Top bar is a renderer composition surface whose behavioral inputs are already covered by tested selectors and controllers.'
    ),
    leafExclusion(
        '../../packages/ui/src/components/WinnerModal.tsx',
        'Winner modal is a presentational end-state surface with callback-only behavior.'
    ),
    leafExclusion(
        '../../packages/ui/src/components/card/CardAbilityBadges.tsx',
        'Ability badges are static visual leaves derived from already-tested card data.'
    ),
    leafExclusion(
        '../../packages/ui/src/components/card/CardFacePattern.tsx',
        'Card face pattern is decorative rendering only.'
    ),
    staticExclusion(
        '../../packages/ui/src/components/card/cardScoreColor.ts',
        'Card score color classes are static presentation tokens used by the excluded card renderer.'
    ),
    staticExclusion(
        '../../packages/ui/src/components/cardAnatomy/cardAnatomyData.ts',
        'Card anatomy copy and icon metadata are static reference data for documentation UI.'
    ),
    leafExclusion(
        '../../packages/ui/src/components/cardAnatomy/CardAnatomyDiagram.tsx',
        'Card anatomy diagram is a documentation-only responsive illustration surface and does not own gameplay or protocol behavior.'
    ),
    leafExclusion(
        '../../packages/ui/src/components/cardAnatomy/CardAnatomyGlossary.tsx',
        'Card anatomy glossary is a documentation-only presentational leaf over static ability metadata.'
    ),
    leafExclusion(
        '../../packages/ui/src/components/gameBoard/AnimatedGemButton.tsx',
        'Animated gem button is a visual leaf over callbacks owned by tested interaction handlers.'
    ),
    staticExclusion(
        '../../packages/ui/src/components/playerZone/constants.ts',
        'Player-zone sizing and display constants are static presentation data.'
    ),
    leafExclusion(
        '../../packages/ui/src/components/playerZone/PlayerZoneIdentityColumn.tsx',
        'Identity column is a presentational leaf that renders already-governed player and privilege props.'
    ),
    leafExclusion(
        '../../packages/ui/src/components/playerZone/PlayerZoneReservedColumn.tsx',
        'Reserved-card column is a presentational leaf over governed card props and callback wiring.'
    ),
    leafExclusion(
        '../../packages/ui/src/components/playerZone/PlayerZoneResourcesColumn.tsx',
        'Resources column is a DOM-heavy presentation surface over already-tested inventory, tableau, and callback state.'
    ),
    leafExclusion(
        '../../packages/ui/src/components/playerZone/ScaledCardFrame.tsx',
        'Scaled card frame is a visual layout primitive with no domain logic.'
    ),
    leafExclusion(
        '../../packages/ui/src/components/playerZone/StackOverlay.tsx',
        'Stack overlay is a presentation-only helper for renderer layering.'
    ),
    leafExclusion(
        '../../packages/ui/src/components/topBar/AnimatedScore.tsx',
        'Animated score is a display-only animation primitive.'
    ),
    wrapperExclusion(
        '../../packages/ui/src/hoc/withGameAnimation.tsx',
        'Animation HOC is a render-only adapter around framer-motion primitives.'
    ),
    wrapperExclusion(
        '../../packages/shared/src/types/reason.ts',
        'Reason-catalog typing helpers are exercised indirectly through higher-level reason and telemetry tests.'
    ),
    wrapperExclusion(
        '../../packages/shared/src/utils.ts',
        'Legacy UI utility helpers are exercised indirectly across reducer and selector suites and are excluded to keep the seal denominator focused on governed contracts.'
    ),
    staticExclusion(
        '../../packages/ui/src/styles/buffs.ts',
        'Buff style table is static presentation data.'
    ),
    staticExclusion(
        '../../packages/shared/src/data/buffs.ts',
        'Buff definitions are static reference data with no runtime branching.'
    ),
    staticExclusion(
        '../../packages/shared/src/data/buffCopy.ts',
        'Buff copy barrel is static reference content.'
    ),
    staticExclusion(
        '../../packages/shared/src/data/buffCopyCatalog.ts',
        'Buff copy catalog is static documentation and localization data.'
    ),
    staticExclusion(
        '../../packages/shared/src/data/realCards.ts',
        'Card catalog barrel only re-exports static reference data modules.'
    ),
    staticExclusion(
        '../../packages/shared/src/data/realCardsLevel1.ts',
        'Level 1 card catalog is static reference data.'
    ),
    staticExclusion(
        '../../packages/shared/src/data/realCardsLevel2.ts',
        'Level 2 card catalog is static reference data.'
    ),
    staticExclusion(
        '../../packages/shared/src/data/realCardsLevel3.ts',
        'Level 3 card catalog is static reference data.'
    ),
    staticExclusion(
        '../../packages/shared/src/data/realCardsRogue.ts',
        'Rogue card catalog is static reference data.'
    ),
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
        '../../tools/scripts/check-architecture-budgets.mjs',
        'CLI wrapper only parses process args and delegates to tested governance modules.'
    ),
    wrapperExclusion(
        '../../tools/scripts/check-boundary-governance.mjs',
        'CLI wrapper only parses process args and delegates to tested governance modules.'
    ),
    wrapperExclusion(
        '../../tools/scripts/check-build-budget.mjs',
        'CLI wrapper only parses process args and delegates to tested governance modules.'
    ),
    wrapperExclusion(
        '../../tools/scripts/check-dependency-governance.mjs',
        'CLI wrapper only parses process args and delegates to tested governance modules.'
    ),
    wrapperExclusion(
        '../../tools/scripts/check-electron-governance.mjs',
        'CLI wrapper only parses process args and delegates to tested governance modules.'
    ),
    wrapperExclusion(
        '../../tools/scripts/check-governance-evidence-health.mjs',
        'CLI wrapper only parses process args and delegates to tested governance modules.'
    ),
    wrapperExclusion(
        '../../tools/scripts/check-license-governance.mjs',
        'CLI wrapper only parses process args and delegates to tested governance modules.'
    ),
    wrapperExclusion(
        '../../tools/scripts/check-release-health.mjs',
        'CLI wrapper only parses process args and delegates to tested governance modules.'
    ),
    wrapperExclusion(
        '../../tools/scripts/check-release-tag-provenance.mjs',
        'CLI wrapper only parses process args and delegates to tested governance modules.'
    ),
    wrapperExclusion(
        '../../tools/scripts/check-runtime-drill-governance.mjs',
        'CLI wrapper only parses process args and delegates to tested governance modules.'
    ),
    wrapperExclusion(
        '../../tools/scripts/check-sbom-governance.mjs',
        'CLI wrapper only parses process args and delegates to tested governance modules.'
    ),
    wrapperExclusion(
        '../../tools/scripts/check-secret-governance.mjs',
        'CLI wrapper only parses process args and delegates to tested governance modules.'
    ),
    wrapperExclusion(
        '../../tools/scripts/export-governance-artifacts.mjs',
        'Artifact exporter entrypoint is exercised through dedicated artifact tests, while the CLI shell remains a thin wrapper.'
    ),
    wrapperExclusion(
        '../../tools/scripts/export-release-health-report.mjs',
        'CLI wrapper only parses process args and delegates to tested governance modules.'
    ),
];

export const SEAL_COVERAGE_EXCLUDE_PATTERNS = SEAL_COVERAGE_EXCLUSIONS.map(
    ({ pattern }) => pattern
);

/** @param {string} desktopRelativePath Path relative to `apps/desktop` (Vitest coverage keys use this shape). */
export const isSealCoverageExcludedDesktopPath = (desktopRelativePath) => {
    const n = desktopRelativePath.replace(/\\/g, '/');
    return SEAL_COVERAGE_EXCLUSIONS.some((entry) => minimatch(n, entry.pattern, { dot: true }));
};
