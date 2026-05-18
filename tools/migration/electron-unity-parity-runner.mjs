import { spawn, spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import {
    formatAgentBrowserProcesses,
    inspectAgentBrowserProcesses,
    summarizeAgentBrowserProcesses,
} from './agent-browser-process-guard.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workspaceRoot = path.resolve(__dirname, '..', '..');
const parityArtifactRoot = path.join(workspaceRoot, 'artifacts', 'electron-unity-parity');
const runnerLockPath = path.join(parityArtifactRoot, '.runner.lock');
const defaultBrowserProcessMax = 24;
const defaultBrowserFinalExtra = 1;
const defaultElectronSettleMs = 1600;
const defaultUnityExe = 'C:\\Program Files\\Unity\\Hub\\Editor\\6000.4.6f1\\Editor\\Unity.exe';
const resolveAgentBrowserCommand = () => {
    if (process.platform !== 'win32') {
        return 'agent-browser';
    }

    const lookup = spawnSync('where.exe', ['agent-browser.cmd'], {
        encoding: 'utf8',
        windowsHide: true,
    });
    const commandShim = lookup.stdout
        .split(/\r?\n/)
        .map((line) => line.trim())
        .find(Boolean);
    if (!commandShim) {
        return 'agent-browser';
    }

    const nativeCommand = path.join(
        path.dirname(commandShim),
        'node_modules',
        'agent-browser',
        'bin',
        'agent-browser-win32-x64.exe'
    );
    return existsSync(nativeCommand) ? nativeCommand : commandShim;
};
const agentBrowserCommand = resolveAgentBrowserCommand();
const defaultFixtureFileName = 'local-pvp-royal-extra-turn-game-over.replay.json';
const getFixturePath = (fixtureFileName = defaultFixtureFileName) =>
    path.join(workspaceRoot, 'fixtures', 'replay-golden', fixtureFileName);
const rulebookVisualBoundingBoxKeys = [
    'app.shell',
    'chrome.rulebook',
    'rulebook.overlay',
    'rulebook.panel',
    'rulebook.prev',
    'rulebook.next',
    'rulebook.close',
    ...Array.from({ length: 9 }, (_, index) => `rulebook.nav.${index}`),
];
const mainMenuHoverTargets = {
    local: {
        semanticKey: 'mode.local',
        eventType: 'start_local_game',
        labels: ['经典模式', 'Classic'],
    },
    roguelike: {
        semanticKey: 'mode.roguelike',
        eventType: 'start_roguelike_game',
        labels: ['肉鸽模式', 'Roguelike'],
    },
    online: {
        semanticKey: 'mode.online',
        eventType: 'open_online',
        labels: ['在线对决', 'Online'],
    },
    lan: {
        semanticKey: 'mode.lan',
        eventType: 'open_lan',
        labels: ['局域网对决', 'LAN'],
    },
    visualLab: {
        semanticKey: 'mode.visualLab',
        eventType: 'open_visual_lab',
        labels: ['Visual Lab'],
    },
};

const createRulebookPageScenario = (pageIndex) => ({
    id: `chrome-rulebook-page-${pageIndex + 1}`,
    name: `Rulebook page ${pageIndex + 1} pixel parity`,
    revision: 2,
    expectedSharedState: `Rulebook page ${pageIndex + 1} matches the Electron reference after a real rulebook navigation action.`,
    actionsAfterLoad: [
        { action: 'click_chrome_rulebook' },
        pageIndex === 1
            ? { action: 'click_rulebook_next' }
            : { action: 'click_rulebook_nav', payload: { index: pageIndex } },
    ],
    strictPixelVisualDiff: true,
    visualMismatchThresholdPercent: 1.0,
    visualBoundingBoxKeys: rulebookVisualBoundingBoxKeys,
});

const createMainMenuHoverScenario = (mode, label) => {
    const target = mainMenuHoverTargets[mode];
    return {
        id: `main-menu-hover-${label}`,
        name: `Main menu ${label} hover feedback parity`,
        revision: null,
        expectedSharedState:
            'The main menu remains in mode selection while the hovered mode control exposes the Electron-equivalent hover affordance.',
        actions: [{ action: 'reset' }, { action: 'hover_mode', payload: { mode } }],
        electronHoverTarget: { kind: 'main-menu-mode', mode, labels: target.labels },
        strictPixelVisualDiff: true,
        visualMismatchThresholdPercent: 1.0,
        visualDiffScope: 'semantic-bounding-boxes',
        visualBoundingBoxMarginPx: 24,
        visualBoundingBoxKeys: [target.semanticKey],
        operationContract: {
            action: 'hover_mode',
            input: 'hover',
            expectHover: {
                semanticKey: target.semanticKey,
                kind: 'Mode',
                eventType: target.eventType,
            },
            expectStateStable: true,
        },
    };
};

const uiAlignmentScenarioIds = [
    'app-launch-main-menu',
    'initial-board-render',
    'chrome-settings-open',
    'chrome-rulebook-open',
    ...Array.from({ length: 8 }, (_, index) => `chrome-rulebook-page-${index + 2}`),
    'market-card-preview',
    'market-deck-reserve-preview',
    'reserved-card-preview',
    'p1-reserved-card-display',
    'p1-multi-reserved-card-display',
    'royal-featured-card-display',
    'player-zone-resource-score',
    'buy-card',
    'reserve-card',
    'end-turn',
];
const hoverFocusedScenarioIds = [
    'main-menu-hover-local',
    'main-menu-hover-roguelike',
    'main-menu-hover-online',
    'main-menu-hover-lan',
    'main-menu-hover-visual-lab',
    'draft-hover-feedback',
    'market-card-hover-feedback',
    'market-deck-hover-feedback',
    'board-cell-hover-feedback',
    'player-reserved-hover-feedback',
    'player-gem-hover-feedback',
    'chrome-control-hover-feedback',
];

const suiteDefinitions = {
    'ui-alignment': {
        description: 'Electron-vs-Unity visual alignment for migrated player-facing UI surfaces.',
        scenarioIds: uiAlignmentScenarioIds,
        visualMismatchThresholdPercent: 1.0,
        electronSettleMs: 3600,
        failOnMatrixFailure: true,
    },
    'hover-focused': {
        description:
            'Focused Electron-vs-Unity hover parity scenarios using real DOM hover and Unity hit-test hover.',
        scenarioIds: hoverFocusedScenarioIds,
        strictPixelVisualDiff: true,
        visualMismatchThresholdPercent: 1.0,
        electronSettleMs: 3600,
        failOnMatrixFailure: true,
    },
};

export const getParityRunnerDefinitionForTest = () => ({
    suites: JSON.parse(JSON.stringify(suiteDefinitions)),
    scenarios: JSON.parse(JSON.stringify(scenarioDefinitions)),
    effectiveSuiteScenarios: Object.fromEntries(
        Object.entries(suiteDefinitions).map(([suiteName, suite]) => [
            suiteName,
            suite.scenarioIds.map((scenarioId) => {
                const scenario = scenarioDefinitions.find(
                    (candidate) => candidate.id === scenarioId
                );
                return applySuiteProfile(scenario, suite, {});
            }),
        ])
    ),
});

const scenarioDefinitions = [
    {
        id: 'app-launch-main-menu',
        name: 'App launch / main menu parity',
        revision: null,
        expectedSharedState: 'No active game; mode selection shell visible.',
        electronEntry: 'http://127.0.0.1:5173/?parityHarness=1',
        unityEntry: 'GemDuel.Editor.CaptureUnityParityScenarios',
        actions: [{ action: 'reset' }],
        strictPixelVisualDiff: true,
        visualMismatchThresholdPercent: 1.0,
    },
    createMainMenuHoverScenario('local', 'local'),
    createMainMenuHoverScenario('roguelike', 'roguelike'),
    createMainMenuHoverScenario('online', 'online'),
    createMainMenuHoverScenario('lan', 'lan'),
    createMainMenuHoverScenario('visualLab', 'visual-lab'),
    {
        id: 'level-3-boon-selection',
        name: 'Level-3 boon selection parity',
        revision: null,
        expectedSharedState:
            'P1 selects Royal Envoy through a visible level-3 boon card; both clients advance to P2 draft with the same available boon pool and feedback.',
        actions: [
            { action: 'reset' },
            {
                action: 'start_local_game',
                payload: { rawText: { __replayText: true }, revision: 0, interactive: true },
            },
            { action: 'choose_boon', payload: { index: 1, buffId: 'royal_envoy' } },
        ],
    },
    {
        id: 'draft-hover-feedback',
        name: 'Draft hover feedback parity',
        revision: null,
        expectedSharedState:
            'P1 hovers the visible Royal Envoy level-3 boon card; both clients expose a real hover target and visible hover affordance without committing the draft.',
        actions: [
            { action: 'reset' },
            {
                action: 'start_local_game',
                payload: { rawText: { __replayText: true }, revision: 0, interactive: true },
            },
            { action: 'hover_boon', payload: { index: 1, buffId: 'royal_envoy' } },
        ],
        electronHoverSelector: '[data-draft-buff-id="royal_envoy"]',
        strictPixelVisualDiff: true,
        visualMismatchThresholdPercent: 1.0,
        visualDiffScope: 'semantic-bounding-boxes',
        visualBoundingBoxMarginPx: 24,
        visualBoundingBoxKeys: ['draft.buff.1'],
        operationContract: {
            action: 'hover_boon',
            input: 'hover',
            semanticKey: 'draft.buff.1',
            expectHover: { semanticKey: 'draft.buff.1', buffId: 'royal_envoy' },
            expectStateStable: true,
        },
    },
    {
        id: 'initial-board-render',
        name: 'Initial board render parity',
        revision: 2,
        expectedSharedState:
            'Board, market, royals, inventories, and player zones match post-draft replay revision 2.',
    },
    {
        id: 'chrome-settings-open',
        name: 'Top-right settings open operation parity',
        revision: 2,
        expectedSharedState:
            'The top-right settings control opens the same settings operation surface without mutating gameplay state.',
        actionsAfterLoad: [{ action: 'open_settings' }],
        skipVisualDiff: true,
        operationContract: {
            action: 'open_settings',
            input: 'click',
            semanticKey: 'settings.control',
            rectTolerancePx: 160,
            expectSemanticKeys: [
                'settings.panel',
                'settings.locale.en',
                'settings.locale.zh',
                'settings.sound',
                'settings.save',
                'settings.load',
                'settings.surface.control',
            ],
            expectStateStable: true,
        },
    },
    {
        id: 'chrome-rulebook-open',
        name: 'Top-right rulebook open operation parity',
        revision: 2,
        expectedSharedState:
            'The top-right rulebook control exposes a real operation target and opens the rulebook surface without mutating gameplay state.',
        actionsAfterLoad: [{ action: 'click_chrome_rulebook' }],
        strictPixelVisualDiff: true,
        visualMismatchThresholdPercent: 1.0,
        visualBoundingBoxKeys: rulebookVisualBoundingBoxKeys,
        operationContract: {
            action: 'click_chrome_rulebook',
            input: 'click',
            semanticKey: 'chrome.rulebook',
            rectTolerancePx: 160,
            expectSemanticKeys: ['rulebook.panel'],
            expectStateStable: true,
        },
    },
    ...Array.from({ length: 8 }, (_, index) => createRulebookPageScenario(index + 1)),
    {
        id: 'chrome-restart-main-menu',
        name: 'Top-right restart operation parity',
        revision: 2,
        expectedSharedState:
            'The top-right restart operation exits the active Local PVP match and returns to the main menu shell.',
        actionsAfterLoad: [{ action: 'click_chrome_restart' }],
        skipVisualDiff: true,
        operationContract: {
            action: 'click_chrome_restart',
            input: 'click',
            semanticKey: 'chrome.restart',
            rectTolerancePx: 160,
            expectSemanticKeys: ['main.menu', 'mode.local'],
        },
    },
    {
        id: 'market-card-preview',
        name: 'Market card preview parity',
        revision: 2,
        expectedSharedState: 'Preview opens without mutating shared state.',
        actionsAfterLoad: [{ action: 'click_market_card', payload: { level: 1, index: 0 } }],
        skipVisualDiff: true,
        operationContract: {
            action: 'click_market_card',
            input: 'click',
            semanticKey: 'market.card.1.0',
            expectPreview: { visible: true },
            expectSemanticKeys: [
                'card.preview.card',
                'card.preview.primaryAction',
                'card.preview.action.reserve',
            ],
            expectStateStable: true,
        },
    },
    {
        id: 'market-deck-reserve-preview',
        name: 'Market deck reserve preview parity',
        revision: 2,
        expectedSharedState:
            'A market deck click opens the reserve preview without committing reserve_deck or mutating shared state.',
        actionsAfterLoad: [{ action: 'click_market_deck', payload: { level: 1 } }],
        skipVisualDiff: true,
        operationContract: {
            action: 'click_market_deck',
            input: 'click',
            semanticKey: 'market.level.1',
            expectPreview: { visible: true, source: 'deck', level: 1 },
            expectSemanticKeys: ['card.preview.card', 'card.preview.action.reserve'],
            expectStateStable: true,
        },
    },
    {
        id: 'market-card-hover-feedback',
        name: 'Market card hover feedback parity',
        revision: 2,
        expectedSharedState:
            'Hovering a visible market card exposes only that market-card semantic target without mutating gameplay state.',
        actionsAfterLoad: [{ action: 'hover_market_card', payload: { level: 1, index: 0 } }],
        electronHoverSelector: '[data-market-slot="1-0"] [data-market-card-hover-motion="true"]',
        strictPixelVisualDiff: true,
        visualMismatchThresholdPercent: 1.0,
        visualDiffScope: 'semantic-bounding-boxes',
        visualBoundingBoxMarginPx: 24,
        visualBoundingBoxKeys: ['market.card.1.0'],
        operationContract: {
            action: 'hover_market_card',
            input: 'hover',
            semanticKey: 'market.card.1.0',
            expectHover: { semanticKey: 'market.card.1.0', kind: 'MarketCard' },
            expectStateStable: true,
        },
    },
    {
        id: 'market-deck-hover-feedback',
        name: 'Market deck hover feedback parity',
        revision: 2,
        expectedSharedState:
            'Hovering a visible market deck exposes the deck semantic target without mutating gameplay state.',
        actionsAfterLoad: [{ action: 'hover_market_deck', payload: { level: 1 } }],
        electronHoverSelector: '[data-market-deck="1"]',
        strictPixelVisualDiff: true,
        visualMismatchThresholdPercent: 1.0,
        visualDiffScope: 'semantic-bounding-boxes',
        visualBoundingBoxMarginPx: 24,
        visualBoundingBoxKeys: ['market.level.1'],
        operationContract: {
            action: 'hover_market_deck',
            input: 'hover',
            semanticKey: 'market.level.1',
            expectHover: { semanticKey: 'market.level.1', kind: 'MarketDeck' },
            expectStateStable: true,
        },
    },
    {
        id: 'board-cell-hover-feedback',
        name: 'Board cell hover feedback parity',
        revision: 2,
        expectedSharedState:
            'Hovering a board cell exposes the matching board-cell semantic key without mutating gameplay state.',
        actionsAfterLoad: [{ action: 'hover_board_cell', payload: { row: 0, column: 0 } }],
        electronHoverSelector: '[data-board-cell="0-0"] button, [data-board-cell="0-0"]',
        strictPixelVisualDiff: true,
        visualMismatchThresholdPercent: 1.0,
        visualDiffScope: 'semantic-bounding-boxes',
        visualBoundingBoxMarginPx: 20,
        visualBoundingBoxKeys: ['board.cell.0.0'],
        operationContract: {
            action: 'hover_board_cell',
            input: 'hover',
            semanticKey: 'board.cell.0.0',
            expectHover: { semanticKey: 'board.cell.0.0', kind: 'Gem' },
            expectStateStable: true,
        },
    },
    {
        id: 'player-reserved-hover-feedback',
        name: 'Player reserved-card hover feedback parity',
        revision: 45,
        expectedSharedState:
            'Hovering the current player reserved card exposes the reserved-card semantic target without opening preview or mutating gameplay state.',
        actionsAfterLoad: [
            { action: 'hover_player_reserved', payload: { player: 'p2', index: 0 } },
        ],
        electronHoverSelector:
            '[data-reserved-slot="p2-0"] [data-card-preview-click="true"], [data-reserved-slot="p2-0"] button, [data-reserved-slot="p2-0"]',
        strictPixelVisualDiff: true,
        visualMismatchThresholdPercent: 1.0,
        visualDiffScope: 'semantic-bounding-boxes',
        visualBoundingBoxMarginPx: 20,
        visualBoundingBoxKeys: ['player.reserved.0'],
        operationContract: {
            action: 'hover_player_reserved',
            input: 'hover',
            semanticKey: 'player.reserved.0',
            expectHover: { semanticKey: 'player.reserved.0', kind: 'ReservedCard' },
            expectStateStable: true,
        },
    },
    {
        id: 'player-gem-hover-feedback',
        name: 'Player gem hover feedback parity',
        revision: 14,
        expectedSharedState:
            'Hovering the opponent red gem exposes the inventory-gem semantic target without mutating gameplay state.',
        actionsAfterLoad: [
            { action: 'hover_player_gem', payload: { role: 'opponent', gemId: 'red' } },
        ],
        electronHoverSelector: '[data-player-zone-gem="p1-red"], [data-player-zone-gem="p2-red"]',
        strictPixelVisualDiff: true,
        visualMismatchThresholdPercent: 1.0,
        visualDiffScope: 'semantic-bounding-boxes',
        visualBoundingBoxMarginPx: 18,
        visualBoundingBoxKeys: ['player.opponent.gem.red'],
        operationContract: {
            action: 'hover_player_gem',
            input: 'hover',
            semanticKey: 'player.opponent.gem.red',
            expectHover: {
                semanticKey: 'player.opponent.gem.red',
                kind: 'InventoryGem',
                gemId: 'red',
            },
            expectStateStable: true,
        },
    },
    {
        id: 'chrome-control-hover-feedback',
        name: 'Chrome control hover feedback parity',
        revision: 2,
        expectedSharedState:
            'Hovering the top-right rulebook chrome control exposes the action semantic target without opening the rulebook or mutating gameplay state.',
        actionsAfterLoad: [{ action: 'hover_chrome_control', payload: { control: 'rulebook' } }],
        electronHoverSelector: '[data-app-rulebook-button="true"]',
        strictPixelVisualDiff: true,
        visualMismatchThresholdPercent: 1.0,
        visualDiffScope: 'semantic-bounding-boxes',
        visualBoundingBoxMarginPx: 12,
        visualBoundingBoxKeys: ['chrome.rulebook'],
        operationContract: {
            action: 'hover_chrome_control',
            input: 'hover',
            semanticKey: 'chrome.rulebook',
            expectHover: {
                semanticKey: 'chrome.rulebook',
                kind: 'ActionButton',
                eventType: 'open_rulebook',
            },
            expectStateStable: true,
        },
    },
    {
        id: 'take-gems-confirm',
        name: 'Take gems selection and confirm parity',
        revision: 2,
        expectedSharedState:
            'A Local PVP take_gems phase selects the replay gems through board cells and commits through the visible confirm action.',
        actionsAfterLoad: [
            { action: 'click_board_cell', payload: { row: 0, column: 0 } },
            { action: 'click_board_cell', payload: { row: 0, column: 1 } },
            { action: 'click_board_cell', payload: { row: 0, column: 2 } },
            { action: 'confirm_gem_selection' },
        ],
        skipVisualDiff: true,
        operationContract: {
            action: 'click_board_cell',
            input: 'click',
            semanticKey: 'board.cell.0.0',
            expectSemanticKeys: ['board.selection.confirm'],
        },
    },
    {
        id: 'bonus-gem-follow-up',
        name: 'Bonus gem follow-up parity',
        revision: 8,
        expectedSharedState:
            'A bonus gem follow-up is committed by clicking the required board gem target.',
        actionsAfterLoad: [{ action: 'take_bonus_gem', payload: { row: 1, column: 4 } }],
        skipVisualDiff: true,
        operationContract: {
            action: 'take_bonus_gem',
            input: 'click',
            semanticKey: 'board.cell.1.4',
        },
    },
    {
        id: 'preview-blank-dismiss',
        name: 'Preview blank dismiss parity',
        revision: 2,
        expectedSharedState:
            'A market-card preview opens, then a blank/background click closes it and returns to the game without mutating shared state.',
        actionsAfterLoad: [
            { action: 'click_market_card', payload: { level: 1, index: 0 } },
            { action: 'click_preview_blank', payload: { x: 240, y: 280 } },
        ],
    },
    {
        id: 'buy-card',
        name: 'Buy card parity',
        revision: 7,
        expectedSharedState:
            'First committed buy_card event applied through the semantic preview action.',
        actionsAfterLoad: [{ action: 'buy_card', payload: { level: 1, index: 0 } }],
    },
    {
        id: 'reserve-card',
        name: 'Reserve card parity',
        revision: 44,
        expectedSharedState:
            'First committed reserve_card event applied through the semantic preview action.',
        actionsAfterLoad: [{ action: 'reserve_card', payload: { level: 3, index: 0 } }],
    },
    {
        id: 'reserved-card-preview',
        name: 'Reserved-card preview parity',
        revision: 45,
        expectedSharedState:
            'A current-player reserved card opens the preview through the same reserved-card operation target without mutating gameplay state.',
        actionsAfterLoad: [
            { action: 'click_player_reserved', payload: { index: 0, player: 'p2' } },
        ],
        skipVisualDiff: true,
        operationContract: {
            action: 'click_player_reserved',
            input: 'click',
            semanticKey: 'player.reserved.0',
            expectSemanticKeys: ['card.preview.card'],
            expectStateStable: true,
        },
    },
    {
        id: 'p1-reserved-card-display',
        name: 'P1 reserved-card display parity',
        fixtureFileName: 'local-pvp-joker-reserved-buy.replay.json',
        revision: 59,
        expectedSharedState:
            'P1 reserved card renders in the left reserved column using the Electron reserved mini-stack geometry.',
    },
    {
        id: 'p1-multi-reserved-card-display',
        name: 'P1 multi reserved-card mini-stack parity',
        fixtureFileName: 'local-pvp-multi-reserved.replay.json',
        revision: 6,
        expectedSharedState:
            'P1 three-card reserved mini-stack renders with the same diagonal reserved geometry as Electron.',
        visualBoundingBoxKeys: [
            'player.current.zone',
            'player.opponent.zone',
            'player.reserved.0',
            'player.reserved.1',
            'player.reserved.2',
        ],
    },
    {
        id: 'discard-gem-follow-up',
        name: 'Discard gem follow-up parity',
        revision: 45,
        expectedSharedState:
            'Discard excess gems is committed by clicking the current player gem target.',
        actionsAfterLoad: [{ action: 'discard_gem', payload: { gemId: 'black' } }],
        skipVisualDiff: true,
        operationContract: {
            action: 'discard_gem',
            input: 'click',
            semanticKey: 'player.current.gem.black',
        },
    },
    {
        id: 'end-turn',
        name: 'End turn parity',
        revision: 10,
        expectedSharedState:
            'First replenish end-turn boundary applied through the semantic action.',
        actionsAfterLoad: [{ action: 'end_turn' }],
    },
    {
        id: 'royal-featured-card-display',
        name: 'Royal / featured card display parity',
        revision: 13,
        expectedSharedState:
            'First committed select_royal event applied through the semantic action.',
        actionsAfterLoad: [{ action: 'choose_royal', payload: { index: 0 } }],
    },
    {
        id: 'player-zone-resource-score',
        name: 'Player zone resource and score parity',
        revision: 14,
        expectedSharedState:
            'Player inventories, tableau, royal, score, and resource zones match revision 14.',
    },
    {
        id: 'steal-gem-follow-up',
        name: 'Steal gem follow-up parity',
        revision: 31,
        expectedSharedState:
            'A steal-gem follow-up is committed by clicking the opponent gem target.',
        actionsAfterLoad: [{ action: 'steal_gem', payload: { gemId: 'red' } }],
        skipVisualDiff: true,
        operationContract: {
            action: 'steal_gem',
            input: 'click',
            semanticKey: 'player.opponent.gem.red',
        },
    },
    {
        id: 'settings-theme-equivalent',
        name: 'Settings or theme-equivalent parity',
        revision: 2,
        expectedSharedState:
            'Settings menu can open and locale/sound mutations use real controls and dump persisted state.',
        actionsAfterLoad: [
            { action: 'open_settings' },
            { action: 'change_setting', payload: { name: 'locale', value: 'zh' } },
            { action: 'change_setting', payload: { name: 'soundEnabled', value: false } },
            { action: 'change_setting', payload: { name: 'surfaceTheme', value: 'dark-arcane' } },
        ],
        skipVisualDiff: true,
    },
    {
        id: 'settings-surface-theme',
        name: 'Settings surface theme operation parity',
        revision: 2,
        expectedSharedState:
            'The settings surface theme control opens and commits a concrete surface-theme variant through visible settings targets.',
        actionsAfterLoad: [
            { action: 'open_settings' },
            { action: 'change_setting', payload: { name: 'surfaceTheme', value: 'dark-arcane' } },
        ],
        skipVisualDiff: true,
        operationContract: {
            action: 'change_setting',
            input: 'click',
            semanticKey: 'settings.surface.control',
            rectTolerancePx: 80,
            expectSemanticKeys: ['settings.panel', 'settings.surface.control'],
        },
    },
    {
        id: 'settings-save-replay',
        name: 'Settings save replay control parity',
        revision: 2,
        expectedSharedState:
            'The settings save replay row is a real control and closes the settings panel without mutating gameplay state.',
        actionsAfterLoad: [{ action: 'open_settings' }, { action: 'settings_save' }],
        skipVisualDiff: true,
        operationContract: {
            action: 'settings_save',
            input: 'click',
            semanticKey: 'settings.save',
            rectTolerancePx: 80,
            expectStateStable: true,
        },
    },
    {
        id: 'settings-load-replay',
        name: 'Settings load replay control parity',
        revision: 2,
        expectedSharedState:
            'The settings load replay row is a real control and can be targeted without mutating gameplay state.',
        actionsAfterLoad: [{ action: 'open_settings' }, { action: 'settings_load' }],
        skipVisualDiff: true,
        operationContract: {
            action: 'settings_load',
            input: 'click',
            semanticKey: 'settings.load',
            rectTolerancePx: 80,
            expectSemanticKeys: ['settings.panel'],
            expectStateStable: true,
        },
    },
    {
        id: 'invalid-action-state',
        name: 'Error/invalid-action state parity',
        revision: 2,
        expectedSharedState: 'Invalid action is rejected and recorded without state mutation.',
        actionsAfterLoad: [{ action: 'invalid_action' }],
    },
];

const parseIntegerOption = (value, fallback) => {
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed >= 0 ? parsed : fallback;
};

const parseArgs = () => {
    const options = {
        outputRoot: null,
        viewports: [
            { width: 1920, height: 1080 },
            { width: 1366, height: 768 },
        ],
        startRenderer: true,
        skipUnity: false,
        unityExe: process.env.UNITY_EXE || defaultUnityExe,
        unityProjectPath:
            process.env.GEMDUEL_UNITY_PROJECT_PATH || path.join(workspaceRoot, 'clients', 'unity'),
        url: 'http://127.0.0.1:5173/?parityHarness=1',
        scenarioIds: [],
        suite: null,
        browserProcessMax: parseIntegerOption(
            process.env.GEMDUEL_PARITY_BROWSER_PROCESS_MAX,
            defaultBrowserProcessMax
        ),
        browserFinalExtra: parseIntegerOption(
            process.env.GEMDUEL_PARITY_BROWSER_FINAL_EXTRA,
            defaultBrowserFinalExtra
        ),
        electronSettleMs: null,
    };

    for (let index = 2; index < process.argv.length; index += 1) {
        const arg = process.argv[index];
        if (arg === '--out') {
            options.outputRoot = path.resolve(workspaceRoot, process.argv[index + 1]);
            index += 1;
        } else if (arg === '--viewports') {
            options.viewports = parseViewports(process.argv[index + 1]);
            index += 1;
        } else if (arg === '--no-start-electron' || arg === '--no-start-renderer') {
            options.startRenderer = false;
        } else if (arg === '--skip-unity') {
            options.skipUnity = true;
        } else if (arg === '--unity-exe') {
            options.unityExe = process.argv[index + 1];
            index += 1;
        } else if (arg === '--unity-project-path') {
            options.unityProjectPath = path.resolve(workspaceRoot, process.argv[index + 1]);
            index += 1;
        } else if (arg === '--url') {
            options.url = process.argv[index + 1];
            index += 1;
        } else if (arg === '--scenario' || arg === '--scenarios') {
            options.scenarioIds.push(
                ...String(process.argv[index + 1])
                    .split(',')
                    .map((value) => value.trim())
                    .filter(Boolean)
            );
            index += 1;
        } else if (arg === '--suite') {
            options.suite = process.argv[index + 1] || null;
            index += 1;
        } else if (arg === '--browser-process-max') {
            options.browserProcessMax = parseIntegerOption(
                process.argv[index + 1],
                options.browserProcessMax
            );
            index += 1;
        } else if (arg === '--browser-final-extra') {
            options.browserFinalExtra = parseIntegerOption(
                process.argv[index + 1],
                options.browserFinalExtra
            );
            index += 1;
        } else if (arg === '--electron-settle-ms') {
            options.electronSettleMs = parseIntegerOption(
                process.argv[index + 1],
                defaultElectronSettleMs
            );
            index += 1;
        } else if (arg === '--help') {
            printHelp();
            process.exit(0);
        }
    }

    options.scenarioIds = [...new Set(options.scenarioIds)];

    if (!options.outputRoot) {
        const runId = new Date().toISOString().replace(/[:.]/g, '-');
        options.outputRoot = path.join(parityArtifactRoot, runId);
    }

    return options;
};

const parseViewports = (value) => {
    const viewports = String(value)
        .split(',')
        .map((part) => {
            const [width, height] = part.split('x').map((piece) => Number(piece.trim()));
            return Number.isFinite(width) && Number.isFinite(height) ? { width, height } : null;
        })
        .filter(Boolean);

    return viewports.length > 0 ? viewports : [{ width: 1920, height: 1080 }];
};

const printHelp = () => {
    process.stdout.write(
        [
            'Usage: pnpm parity:electron-unity [options]',
            '',
            'Options:',
            '  --out <path>             Artifact output root.',
            '  --viewports <list>       Comma list such as 1920x1080,1366x768.',
            '  --no-start-renderer      Require an existing Vite renderer on 127.0.0.1:5173.',
            '  --no-start-electron      Backward-compatible alias for --no-start-renderer.',
            '  --skip-unity             Capture only Electron and mark Unity as blocked.',
            '  --unity-exe <path>       Unity Editor executable.',
            '  --unity-project-path <path> Unity project path for capture; defaults to clients/unity.',
            '  --url <url>              Electron parity harness URL.',
            '  --scenario <ids>         Comma list of scenario ids to run, e.g. chrome-rulebook-open.',
            '  --scenarios <ids>        Alias for --scenario.',
            '  --suite <name>           Curated suite to run, e.g. ui-alignment.',
            '  --browser-process-max <n> Fail when matched agent-browser Chrome processes exceed n.',
            '  --browser-final-extra <n> Allow n extra matched processes beyond the pre-run baseline after cleanup.',
            '  --electron-settle-ms <n> Wait this many ms after Electron scenario actions before state/screenshot capture.',
            '',
        ].join('\n')
    );
};

const execFileCapture = (
    command,
    args,
    { input, timeoutMs = 120000, allowFailure = false, stdioMode = 'pipe', env = {} } = {}
) =>
    new Promise((resolve, reject) => {
        const useShell =
            process.platform === 'win32' && path.extname(command).toLowerCase() !== '.exe';
        const capturesOutput = stdioMode !== 'ignore';
        const child = spawn(command, args, {
            cwd: workspaceRoot,
            shell: useShell,
            windowsHide: true,
            stdio: capturesOutput ? ['pipe', 'pipe', 'pipe'] : 'ignore',
            env: { ...process.env, ...env },
        });
        let stdout = '';
        let stderr = '';
        const timer = setTimeout(() => {
            stopProcessTree(child.pid);
            reject(new Error(`${command} ${args.join(' ')} timed out after ${timeoutMs}ms`));
        }, timeoutMs);

        if (capturesOutput) {
            child.stdout.on('data', (chunk) => {
                stdout += chunk.toString();
            });
            child.stderr.on('data', (chunk) => {
                stderr += chunk.toString();
            });
        }
        child.on('error', (error) => {
            clearTimeout(timer);
            reject(error);
        });
        child.on('close', (code) => {
            clearTimeout(timer);
            if (code !== 0 && !allowFailure) {
                reject(
                    new Error(
                        `${command} ${args.join(' ')} failed with ${code}\n${stdout}\n${stderr}`
                    )
                );
                return;
            }

            resolve({ code, stdout, stderr });
        });

        if (input && child.stdin) {
            child.stdin.write(input);
        }
        child.stdin?.end();
    });

const waitForUrl = async (url, timeoutMs) => {
    const started = Date.now();
    let lastError = '';
    while (Date.now() - started < timeoutMs) {
        try {
            const response = await fetch(url, { cache: 'no-store' });
            if (response.ok) {
                return;
            }
            lastError = `HTTP ${response.status}`;
        } catch (error) {
            lastError = error instanceof Error ? error.message : String(error);
        }

        await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    throw new Error(`Timed out waiting for ${url}: ${lastError}`);
};

const startRendererDevIfNeeded = async (options) => {
    try {
        await waitForUrl(options.url, 2500);
        return null;
    } catch {
        if (!options.startRenderer) {
            throw new Error(`${options.url} is not reachable and --no-start-renderer was set.`);
        }
    }

    const logPath = path.join(options.outputRoot, 'renderer-dev.log');
    const child = spawn('pnpm', ['run', 'dev'], {
        cwd: workspaceRoot,
        shell: process.platform === 'win32',
        windowsHide: true,
        stdio: ['ignore', 'pipe', 'pipe'],
    });
    const chunks = [];
    child.stdout.on('data', (chunk) => chunks.push(chunk));
    child.stderr.on('data', (chunk) => chunks.push(chunk));
    child.on('close', async () => {
        await writeFile(logPath, Buffer.concat(chunks)).catch(() => {});
    });

    try {
        await waitForUrl(options.url, 90000);
    } catch (error) {
        await writeFile(logPath, Buffer.concat(chunks)).catch(() => {});
        stopProcessTree(child.pid);
        throw error;
    }

    return { child, logPath, chunks };
};

const stopProcessTree = (pid) => {
    if (!pid) {
        return;
    }

    if (process.platform === 'win32') {
        spawnSync('taskkill', ['/PID', String(pid), '/T', '/F'], {
            stdio: 'ignore',
            windowsHide: true,
        });
        return;
    }

    try {
        process.kill(-pid);
    } catch {
        process.kill(pid);
    }
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const processIsAlive = (pid) => {
    if (!Number.isInteger(pid) || pid <= 0) {
        return false;
    }

    try {
        process.kill(pid, 0);
        return true;
    } catch {
        return false;
    }
};

const parseJsonObject = (text) => {
    try {
        const parsed = JSON.parse(text || '{}');
        return parsed && typeof parsed === 'object' ? parsed : {};
    } catch {
        return {};
    }
};

const acquireRunnerLock = async (options) => {
    await mkdir(parityArtifactRoot, { recursive: true });
    const lockPayload = {
        pid: process.pid,
        startedAt: new Date().toISOString(),
        outputRoot: options.outputRoot,
        argv: process.argv.slice(2),
    };

    const createLock = () =>
        writeFile(runnerLockPath, JSON.stringify(lockPayload, null, 4), { flag: 'wx' });

    try {
        await createLock();
    } catch (error) {
        if (error?.code !== 'EEXIST') {
            throw error;
        }

        const existingText = await readFile(runnerLockPath, 'utf8').catch(() => '{}');
        const existing = parseJsonObject(existingText);
        if (processIsAlive(existing.pid)) {
            throw new Error(
                `Electron/Unity parity runner is already active at PID ${existing.pid}. ` +
                    `Lock: ${runnerLockPath}`
            );
        }

        await rm(runnerLockPath, { force: true });
        await createLock();
    }

    return async () => {
        const currentText = await readFile(runnerLockPath, 'utf8').catch(() => '{}');
        const current = parseJsonObject(currentText);
        if (current.pid === process.pid) {
            await rm(runnerLockPath, { force: true });
        }
    };
};

const compactProcesses = (processes) =>
    processes.map((entry) => ({
        processId: entry.processId,
        parentProcessId: entry.parentProcessId,
        parentExists: entry.parentExists,
        executablePath: entry.executablePath,
        matchedBy: entry.matchedBy,
    }));

const createBrowserProcessGuard = (options) => {
    const snapshots = [];
    const cleanupActions = [];
    let baselineCount = null;

    const record = (label) => {
        const inspection = inspectAgentBrowserProcesses();
        const summary = summarizeAgentBrowserProcesses(inspection.processes);
        const snapshot = {
            label,
            at: new Date().toISOString(),
            supported: inspection.supported,
            count: summary.count,
            orphanCount: summary.orphanCount,
            processIds: summary.processIds,
            processes: compactProcesses(inspection.processes),
        };
        snapshots.push(snapshot);
        return { snapshot, processes: inspection.processes };
    };

    const assertUnderMax = ({ snapshot, processes }) => {
        if (!snapshot.supported || snapshot.count <= options.browserProcessMax) {
            return;
        }

        throw new Error(
            [
                `agent-browser process guard exceeded ${options.browserProcessMax} matched Chrome processes at ${snapshot.label}.`,
                formatAgentBrowserProcesses(processes),
            ].join('\n')
        );
    };

    const recordAndAssert = (label) => {
        const result = record(label);
        assertUnderMax(result);
        return result.snapshot;
    };

    const markBaseline = (snapshot) => {
        baselineCount = snapshot.count;
    };

    const waitForFinal = async (label) => {
        const maxFinalCount = (baselineCount ?? 0) + options.browserFinalExtra;
        const startedAt = Date.now();
        let latest = record(label);
        while (
            latest.snapshot.supported &&
            latest.snapshot.count > maxFinalCount &&
            Date.now() - startedAt < 10000
        ) {
            await sleep(500);
            latest = record(`${label}-retry`);
        }

        if (latest.snapshot.supported && latest.snapshot.count > maxFinalCount) {
            throw new Error(
                [
                    `agent-browser final process guard expected <= ${maxFinalCount} matched Chrome processes after cleanup, found ${latest.snapshot.count}.`,
                    formatAgentBrowserProcesses(latest.processes),
                ].join('\n')
            );
        }

        assertUnderMax(latest);
        return latest.snapshot;
    };

    const summary = () => {
        const peakCount = snapshots.reduce((max, snapshot) => Math.max(max, snapshot.count), 0);
        const latest = snapshots.at(-1);
        return {
            beforeCount: baselineCount ?? snapshots[0]?.count ?? 0,
            peakCount,
            afterCount: latest?.count ?? 0,
            orphanCount: latest?.orphanCount ?? 0,
            maxAllowedCount: options.browserProcessMax,
            maxFinalExtraProcesses: options.browserFinalExtra,
            cleanupActions,
            snapshots,
        };
    };

    return {
        cleanupActions,
        markBaseline,
        recordAndAssert,
        summary,
        waitForFinal,
    };
};

const agent = async (session, args, options = {}) =>
    execFileCapture(agentBrowserCommand, ['--session', session, ...args], {
        ...options,
        env: { AGENT_BROWSER_HEADED: 'false', ...(options.env ?? {}) },
    });

const agentNoOutput = async (session, args, options = {}) =>
    execFileCapture(agentBrowserCommand, ['--session', session, ...args], {
        ...options,
        stdioMode: 'ignore',
        env: { AGENT_BROWSER_HEADED: 'false', ...(options.env ?? {}) },
    });

const closeAgentBrowserSession = async (session, options, reason) => {
    const action = {
        action: 'agent-browser close',
        scope: 'session',
        session,
        reason,
        at: new Date().toISOString(),
        ok: false,
    };
    try {
        const result = await agentNoOutput(session, ['close'], {
            timeoutMs: 30000,
            allowFailure: true,
        });
        action.ok = result.code === 0;
        action.exitCode = result.code;
    } catch (error) {
        action.error = error instanceof Error ? error.message : String(error);
    } finally {
        options.browserProcessGuard?.cleanupActions.push(action);
    }
};

const closeAllAgentBrowserSessions = async (options, reason) => {
    const action = {
        action: 'agent-browser close --all',
        scope: 'all',
        reason,
        at: new Date().toISOString(),
        ok: false,
    };
    try {
        const result = await execFileCapture(agentBrowserCommand, ['close', '--all'], {
            timeoutMs: 30000,
            allowFailure: true,
            stdioMode: 'ignore',
            env: { AGENT_BROWSER_HEADED: 'false' },
        });
        action.ok = result.code === 0;
        action.exitCode = result.code;
    } catch (error) {
        action.error = error instanceof Error ? error.message : String(error);
    } finally {
        options.browserProcessGuard?.cleanupActions.push(action);
    }
};

const parseAgentJson = (stdout) => {
    const trimmed = stdout.trim();
    try {
        const value = JSON.parse(trimmed);
        return typeof value === 'string' ? JSON.parse(value) : value;
    } catch {
        const start = Math.min(
            ...['{', '['].map((char) => trimmed.indexOf(char)).filter((index) => index >= 0)
        );
        const end = Math.max(trimmed.lastIndexOf('}'), trimmed.lastIndexOf(']'));
        if (!Number.isFinite(start) || end < start) {
            throw new Error(`Could not parse agent-browser JSON output:\n${stdout}`);
        }
        const value = JSON.parse(trimmed.slice(start, end + 1));
        return typeof value === 'string' ? JSON.parse(value) : value;
    }
};

const agentEvalJson = async (session, script, timeoutMs = 60000) => {
    const result = await agent(session, ['eval', '--stdin'], { input: script, timeoutMs });
    return parseAgentJson(result.stdout);
};

const buildElectronScript = (scenario, replayBase64) => {
    const steps = [];
    if (scenario.revision === null) {
        steps.push(...(scenario.actions ?? [{ action: 'reset' }]));
    } else {
        steps.push({
            action: 'load_replay_fixture',
            payload: {
                rawText: { __replayText: true },
                revision: scenario.revision,
                interactive: Boolean(scenario.actionsAfterLoad?.length),
            },
        });
        steps.push(...(scenario.actionsAfterLoad ?? []));
    }

    const firstOperationIndex = steps.findIndex((step) => !setupActionKeys.has(step.action));
    const setupSteps =
        firstOperationIndex >= 0 ? steps.slice(0, firstOperationIndex) : steps.slice();
    const operationSteps = firstOperationIndex >= 0 ? steps.slice(firstOperationIndex) : [];
    const serializedSetupSteps = JSON.stringify(setupSteps).replaceAll(
        '{"__replayText":true}',
        'replayText'
    );
    const serializedOperationSteps = JSON.stringify(operationSteps).replaceAll(
        '{"__replayText":true}',
        'replayText'
    );

    return `
(async () => {
  const replayText = atob('${replayBase64}');
  const api = window.__GEMDUEL_PARITY__;
  if (!api || !api.isReady()) {
    throw new Error('Electron parity harness is not ready.');
  }
  const setupSteps = ${serializedSetupSteps};
  const operationSteps = ${serializedOperationSteps};
  const results = [];
  for (const step of setupSteps) {
    results.push(await api.dispatch(step.action, step.payload));
  }
  const beforeState = api.dumpState();
  for (const step of operationSteps) {
    results.push(await api.dispatch(step.action, step.payload));
  }
  await new Promise((resolve) => setTimeout(resolve, ${scenario.electronSettleMs ?? defaultElectronSettleMs}));
  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  return JSON.stringify({ results, beforeState, state: api.dumpState() });
})()
`;
};

const buildElectronHoverTargetScript = (scenario) => {
    if (scenario.electronHoverTarget?.kind !== 'main-menu-mode') {
        return null;
    }

    const target = scenario.electronHoverTarget;
    const marker = `scenario-${scenario.id}`;
    const labels = JSON.stringify(target.labels ?? []);
    const mode = JSON.stringify(target.mode);
    const selector = `[data-parity-hover-target="${marker}"]`;
    return `
(() => {
  const labels = ${labels};
  const mode = ${mode};
  const marker = ${JSON.stringify(marker)};
  document
    .querySelectorAll('[data-parity-hover-target]')
    .forEach((element) => element.removeAttribute('data-parity-hover-target'));
  const candidates = Array.from(
    document.querySelectorAll('[data-testid="desktop-stage-canvas"] button, button')
  );
  const target = candidates.find((candidate) => {
    const rect = candidate.getBoundingClientRect();
    const text = candidate.textContent || '';
    return rect.width > 0 && rect.height > 0 && labels.some((label) => text.includes(label));
  });
  if (!target) {
    return JSON.stringify({ ok: false, mode, labels });
  }
  target.setAttribute('data-parity-hover-target', marker);
  const rect = target.getBoundingClientRect();
  return JSON.stringify({
    ok: true,
    mode,
    selector: ${JSON.stringify(selector)},
    text: target.textContent || '',
    rect: {
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
    },
  });
})()
`;
};

const captureElectronScenario = async (options, scenario, viewport, replayBase64) => {
    const viewportId = `${viewport.width}x${viewport.height}`;
    const session = `gemduel-parity-${viewportId}-${scenario.id}`;
    const scenarioDir = path.join(options.outputRoot, 'electron', scenario.id);
    await mkdir(scenarioDir, { recursive: true });
    try {
        await agentNoOutput(session, [
            'set',
            'viewport',
            String(viewport.width),
            String(viewport.height),
        ]);
        await agentNoOutput(session, ['open', options.url], { timeoutMs: 60000 });
        await agentEvalJson(
            session,
            `
JSON.stringify(Boolean(window.__GEMDUEL_PARITY__ && window.__GEMDUEL_PARITY__.isReady()))
`,
            30000
        );
        const stateResult = await agentEvalJson(
            session,
            buildElectronScript(scenario, replayBase64),
            90000
        );
        let electronHoverSelector = scenario.electronHoverSelector;
        const hoverTargetScript = buildElectronHoverTargetScript(scenario);
        if (hoverTargetScript) {
            const hoverTarget = await agentEvalJson(session, hoverTargetScript, 30000);
            if (!hoverTarget.ok || !hoverTarget.selector) {
                throw new Error(
                    `Could not resolve Electron hover target for ${scenario.id}: ${JSON.stringify(
                        hoverTarget
                    )}`
                );
            }
            electronHoverSelector = hoverTarget.selector;
        }
        if (electronHoverSelector) {
            await agentNoOutput(session, ['hover', electronHoverSelector], {
                timeoutMs: 60000,
            });
            await agentNoOutput(session, ['wait', '300'], { timeoutMs: 60000 });
        }
        const screenshotPath = path.join(scenarioDir, `${viewportId}.png`);
        const statePath = path.join(scenarioDir, `${viewportId}-state.json`);
        await agentNoOutput(session, ['screenshot', screenshotPath], { timeoutMs: 60000 });
        await writeFile(statePath, JSON.stringify(stateResult, null, 4));
        return {
            screenshotPath,
            statePath,
            beforeState: stateResult.beforeState,
            state: stateResult.state,
            results: stateResult.results,
        };
    } finally {
        options.browserProcessGuard?.recordAndAssert(
            `before-session-close-${viewportId}-${scenario.id}`
        );
        await closeAgentBrowserSession(
            session,
            options,
            `scenario ${scenario.id} ${viewportId} finished`
        );
    }
};

const createReplayBase64Loader = () => {
    const cache = new Map();
    return async (fixtureFileName = defaultFixtureFileName) => {
        if (!cache.has(fixtureFileName)) {
            const replayText = await readFile(getFixturePath(fixtureFileName), 'utf8');
            cache.set(fixtureFileName, Buffer.from(replayText, 'utf8').toString('base64'));
        }

        return cache.get(fixtureFileName);
    };
};

const runUnityCapture = async (options) => {
    if (options.skipUnity) {
        return { ok: false, blocker: 'Unity capture skipped by --skip-unity.' };
    }

    if (!existsSync(options.unityExe)) {
        return { ok: false, blocker: `Unity executable not found: ${options.unityExe}` };
    }

    const logPath = path.join(options.outputRoot, 'unity-parity-capture.log');
    const viewportArg = options.viewports
        .map((viewport) => `${viewport.width}x${viewport.height}`)
        .join(',');
    const args = [
        '-batchmode',
        '-projectPath',
        options.unityProjectPath,
        '-executeMethod',
        'GemDuel.Editor.CaptureUnityParityScenarios.CaptureAll',
        '-gemduelParityOut',
        options.outputRoot,
        '-gemduelParityViewports',
        viewportArg,
        '-logFile',
        logPath,
        '-quit',
    ];
    if (options.scenarioIds.length > 0) {
        args.splice(
            args.indexOf('-logFile'),
            0,
            '-gemduelParityScenarios',
            options.scenarioIds.join(',')
        );
    }

    const result = await execFileCapture(options.unityExe, args, {
        timeoutMs: 600000,
        allowFailure: true,
    });
    return {
        ok: result.code === 0,
        code: result.code,
        logPath,
        blocker: result.code === 0 ? null : `Unity capture exited with code ${result.code}.`,
    };
};

const normalizeInstance = (value) => {
    if (value == null) {
        return null;
    }
    if (typeof value === 'string') {
        return value;
    }
    return value.instanceId ?? value.uid ?? value.id ?? value.slotKey ?? JSON.stringify(value);
};

const normalizeBuffRef = (value) => {
    const buff = value?.buff ?? value;
    if (!buff || typeof buff !== 'object') {
        return null;
    }
    const state =
        buff.state &&
        typeof buff.state === 'object' &&
        !Array.isArray(buff.state) &&
        Object.keys(buff.state).length === 0
            ? null
            : (buff.state ?? null);

    return {
        id: buff.id ?? null,
        state,
    };
};

const normalizeUnityBuffRef = (value) =>
    normalizeBuffRef(value) ?? {
        id: 'none',
        state: null,
    };

const normalizeUnitySnapshot = (unityState) => {
    const snapshot = unityState?.snapshot ?? {};
    return {
        mode: snapshot.mode ?? unityState?.mode ?? null,
        phase: snapshot.phase ?? unityState?.phase ?? null,
        turn: snapshot.turn ?? unityState?.turn ?? null,
        winner: snapshot.winner ?? unityState?.winner ?? null,
        board: snapshot.board ?? [],
        market: {
            1: (snapshot.market?.[1] ?? snapshot.market?.['1'] ?? []).map(normalizeInstance),
            2: (snapshot.market?.[2] ?? snapshot.market?.['2'] ?? []).map(normalizeInstance),
            3: (snapshot.market?.[3] ?? snapshot.market?.['3'] ?? []).map(normalizeInstance),
        },
        royalDeck: (snapshot.royalDeck ?? []).map(normalizeInstance),
        playerBuffs: {
            p1: normalizeUnityBuffRef(snapshot.playerBuffs?.p1),
            p2: normalizeUnityBuffRef(snapshot.playerBuffs?.p2),
        },
        draftPool: snapshot.draftPool ?? [],
        p2DraftPool: snapshot.p2DraftPool ?? null,
        p1SelectedBuffId: snapshot.p1SelectedBuffId ?? null,
        draftOrder: snapshot.draftOrder ?? [],
        buffLevel: snapshot.buffLevel ?? 0,
        p2DraftLevel: snapshot.p2DraftLevel ?? 0,
        playerTableau: {
            p1: (snapshot.playerTableau?.p1 ?? []).map(normalizeInstance),
            p2: (snapshot.playerTableau?.p2 ?? []).map(normalizeInstance),
        },
        playerReserved: {
            p1: (snapshot.playerReserved?.p1 ?? []).map(normalizeInstance),
            p2: (snapshot.playerReserved?.p2 ?? []).map(normalizeInstance),
        },
        playerRoyals: {
            p1: (snapshot.playerRoyals?.p1 ?? []).map(normalizeInstance),
            p2: (snapshot.playerRoyals?.p2 ?? []).map(normalizeInstance),
        },
        inventories: snapshot.inventories ?? {},
        privileges: snapshot.privileges ?? {},
        extraPoints: snapshot.extraPoints ?? {},
        extraCrowns: snapshot.extraCrowns ?? {},
        pendingReserve: snapshot.pendingReserve ?? null,
        pendingBuy: snapshot.pendingBuy ?? null,
    };
};

const normalizeElectronState = (electronState) => {
    const game = electronState?.game ?? {};
    return {
        mode: game.mode ?? null,
        phase: game.phase ?? null,
        turn: game.turn ?? null,
        winner: game.winner ?? null,
        board: game.board ?? [],
        market: game.market ?? {},
        royalDeck: game.royalDeck ?? [],
        playerBuffs: {
            p1: normalizeBuffRef(game.playerBuffs?.p1),
            p2: normalizeBuffRef(game.playerBuffs?.p2),
        },
        draftPool: game.draftPool ?? [],
        p2DraftPool: game.p2DraftPool ?? null,
        p1SelectedBuffId: game.p1SelectedBuffId ?? null,
        draftOrder: game.draftOrder ?? [],
        buffLevel: game.buffLevel ?? null,
        p2DraftLevel: game.p2DraftLevel ?? null,
        playerTableau: game.playerTableau ?? {},
        playerReserved: game.playerReserved ?? {},
        playerRoyals: game.playerRoyals ?? {},
        inventories: game.inventories ?? {},
        privileges: game.privileges ?? {},
        extraPoints: game.extraPoints ?? {},
        extraCrowns: game.extraCrowns ?? {},
        pendingReserve: game.pendingReserve ?? null,
        pendingBuy: game.pendingBuy ?? null,
    };
};

const semanticBoxText = (state, semanticKey) =>
    state?.visible?.boxes?.find((box) => box.semanticKey === semanticKey)?.text ?? null;

const diffState = (electronState, unityState, scenario) => {
    const electron = normalizeElectronState(electronState);
    const unity = normalizeUnitySnapshot(unityState);
    const mismatches = [];
    const fields = Object.keys(electron);
    for (const field of fields) {
        const left = JSON.stringify(electron[field]);
        const right = JSON.stringify(unity[field]);
        if (left !== right) {
            mismatches.push({ field, electron: electron[field], unity: unity[field] });
        }
    }

    if (scenario?.id === 'settings-theme-equivalent') {
        const electronSettings = electronState?.settings ?? {};
        const unitySettings = unityState?.settings ?? {};
        const settingsFields = ['locale', 'theme', 'surfaceTheme', 'soundEnabled'];
        for (const field of settingsFields) {
            if (electronSettings[field] !== unitySettings[field]) {
                mismatches.push({
                    field: `settings.${field}`,
                    electron: electronSettings[field],
                    unity: unitySettings[field],
                });
            }
        }

        const electronPanelOpen = Boolean(
            electronState?.visible?.boxes?.some((box) => box.semanticKey === 'settings.panel')
        );
        if (electronPanelOpen !== Boolean(unitySettings.panelOpen)) {
            mismatches.push({
                field: 'settings.panelOpen',
                electron: electronPanelOpen,
                unity: unitySettings.panelOpen,
            });
        }

        if (unitySettings?.persistence?.status !== 'saved') {
            mismatches.push({
                field: 'settings.persistence.status',
                electron: 'settings mutation committed',
                unity: unitySettings?.persistence?.status ?? null,
            });
        }
    }

    if (scenario?.id === 'invalid-action-state') {
        const electronError = semanticBoxText(electronState, 'error.banner');
        const unityError = unityState?.errorBanner ?? null;
        if (electronError !== unityError) {
            mismatches.push({
                field: 'errorBanner',
                electron: electronError,
                unity: unityError,
            });
        }
    }

    return { ok: mismatches.length === 0, mismatchCount: mismatches.length, mismatches };
};

const setupActionKeys = new Set([
    'reset',
    'start_local_game',
    'load_replay_fixture',
    'choose_mode',
    'force_royal_selection',
]);
const acceptedNonClickActions = new Set(['invalid_action']);

const normalizeActionResults = (results) =>
    (results ?? []).filter((result) => result?.action && !setupActionKeys.has(result.action));

const actionDriverOk = (source, result) => {
    if (!result?.ok) {
        return false;
    }

    if (acceptedNonClickActions.has(result.action)) {
        return true;
    }

    if (String(result.action).startsWith('hover_')) {
        return source === 'unity'
            ? result.driver === 'unity-hover-target'
            : result.driver === 'dom-hover';
    }

    return source === 'unity'
        ? result.driver === 'unity-hit-target'
        : result.driver === 'dom-click';
};

const buildActionBehaviorReport = (electronResults, unityState) => {
    const electron = normalizeActionResults(electronResults);
    const unity = normalizeActionResults(unityState?.semanticActionResults);
    const failures = [];
    const maxLength = Math.max(electron.length, unity.length);

    for (let index = 0; index < maxLength; index += 1) {
        const electronResult = electron[index] ?? null;
        const unityResult = unity[index] ?? null;
        if (!electronResult || !unityResult) {
            failures.push({
                index,
                reason: 'Missing action result on one side.',
                electron: electronResult,
                unity: unityResult,
            });
            continue;
        }

        if (electronResult.action !== unityResult.action) {
            failures.push({
                index,
                reason: 'Action order or name diverged.',
                electron: electronResult,
                unity: unityResult,
            });
        }

        if (Boolean(electronResult.ok) !== Boolean(unityResult.ok)) {
            failures.push({
                index,
                reason: 'Accepted/rejected action result diverged.',
                electron: electronResult,
                unity: unityResult,
            });
        }

        if (!actionDriverOk('electron', electronResult)) {
            failures.push({
                index,
                reason: 'Electron action was not driven through a live DOM click path.',
                electron: electronResult,
            });
        }

        if (!actionDriverOk('unity', unityResult)) {
            failures.push({
                index,
                reason: 'Unity action was not driven through a live hit-tested target.',
                unity: unityResult,
            });
        }
    }

    return {
        ok: failures.length === 0,
        failureCount: failures.length,
        electron,
        unity,
        failures,
    };
};

const stableJson = (value) => {
    if (Array.isArray(value)) {
        return `[${value.map(stableJson).join(',')}]`;
    }
    if (value && typeof value === 'object') {
        return `{${Object.keys(value)
            .sort()
            .map((key) => `${JSON.stringify(key)}:${stableJson(value[key])}`)
            .join(',')}}`;
    }
    return JSON.stringify(value);
};

const findSemanticBox = (boxes, semanticKey) =>
    boxes.find((box) => box.semanticKey === semanticKey || box.key === semanticKey) ?? null;

const rectDelta = (left, right) => ({
    x: Math.abs((left?.x ?? 0) - (right?.x ?? 0)),
    y: Math.abs((left?.y ?? 0) - (right?.y ?? 0)),
    width: Math.abs((left?.width ?? 0) - (right?.width ?? 0)),
    height: Math.abs((left?.height ?? 0) - (right?.height ?? 0)),
});

const rectWithinTolerance = (delta, tolerance) =>
    delta.x <= tolerance &&
    delta.y <= tolerance &&
    delta.width <= tolerance &&
    delta.height <= tolerance;

const inferElectronPreview = (state) => {
    const boxes = state?.visible?.boxes ?? [];
    const overlay = boxes.find((box) => box.semanticKey === 'card.preview.overlay');
    if (!overlay) {
        return null;
    }

    const deck = boxes.find(
        (box) => box.semanticKey === 'card.preview.card' && box.dataset?.cardPreviewDeckReserve
    );
    if (deck) {
        return {
            visible: true,
            source: 'deck',
            level: Number(deck.dataset.cardPreviewDeckReserve),
            index: -1,
            instanceId: null,
        };
    }

    const card = boxes.find(
        (box) => box.semanticKey === 'card.preview.card' && box.dataset?.cardPreviewCard
    );
    return {
        visible: true,
        source: card ? 'card' : 'unknown',
        level: null,
        index: null,
        instanceId: card?.dataset?.cardPreviewCard ?? null,
    };
};

const inferUnityPreview = (state) =>
    state?.preview
        ? {
              visible: true,
              source: state.preview.source ?? null,
              level: state.preview.level ?? null,
              index: state.preview.index ?? null,
              instanceId: state.preview.instanceId || null,
          }
        : null;

const checkExpectedPreview = (source, preview, expected, failures) => {
    if (!expected) {
        return;
    }

    if (Boolean(preview) !== Boolean(expected.visible)) {
        failures.push({
            source,
            reason: 'Preview visibility diverged from operation contract.',
            expected,
            actual: preview,
        });
        return;
    }

    if (!preview) {
        return;
    }

    for (const field of ['source', 'level', 'index']) {
        if (expected[field] !== undefined && preview[field] !== expected[field]) {
            failures.push({
                source,
                reason: `Preview ${field} diverged from operation contract.`,
                expected: expected[field],
                actual: preview[field],
            });
        }
    }
};

const checkExpectedUnityHover = (hover, expected, failures) => {
    if (!expected) {
        return;
    }

    if (!hover) {
        failures.push({
            source: 'unity',
            reason: 'Unity did not expose the expected hover state.',
            expected,
            actual: null,
        });
        return;
    }

    for (const field of ['semanticKey', 'kind', 'eventType', 'buffId', 'gemId']) {
        if (expected[field] !== undefined && hover[field] !== expected[field]) {
            failures.push({
                source: 'unity',
                reason: `Unity hover ${field} diverged from operation contract.`,
                expected: expected[field],
                actual: hover[field],
            });
        }
    }
};

const checkExpectedSemanticKeys = (source, boxes, expectedSemanticKeys, failures) => {
    if (!expectedSemanticKeys?.length) {
        return;
    }

    const exposedKeys = new Set(boxes.map((box) => box.semanticKey).filter(Boolean));
    for (const semanticKey of expectedSemanticKeys) {
        if (!exposedKeys.has(semanticKey)) {
            failures.push({
                source,
                reason: 'Expected post-operation semantic key is missing.',
                semanticKey,
            });
        }
    }
};

const buildOperationContractReport = (scenario, electron, unityState) => {
    const contract = scenario.operationContract;
    if (!contract) {
        return { ok: true, skipped: true };
    }

    if (!unityState) {
        return {
            ok: false,
            blocker: 'Unity state unavailable for operation contract.',
            contract,
            failureCount: 1,
            failures: [{ reason: 'Unity state unavailable.' }],
        };
    }

    const failures = [];
    const tolerancePx = contract.rectTolerancePx ?? 8;
    const electronActionResults = normalizeActionResults(electron.results);
    const unityActionResults = unityState.semanticActionResults ?? [];
    const electronActionIndex = electronActionResults.findIndex(
        (result) => result.action === contract.action
    );
    const unityActionIndex = unityActionResults.findIndex(
        (result) => result.action === contract.action
    );
    const electronBeforeContractState =
        electronActionIndex > 0
            ? (electronActionResults[electronActionIndex - 1]?.state ?? electron.beforeState)
            : (electron.beforeState ?? electron.state);
    const electronAfterContractState =
        electronActionIndex >= 0
            ? (electronActionResults[electronActionIndex]?.state ?? electron.state)
            : electron.state;
    const unityBeforeContractState =
        unityActionIndex > 0
            ? (unityActionResults[unityActionIndex - 1]?.state ?? unityState.beforeActionState)
            : (unityState.beforeActionState ?? unityState);
    const unityAfterContractState =
        unityActionIndex >= 0
            ? (unityActionResults[unityActionIndex]?.state ?? unityState)
            : unityState;
    const electronTargetState = electronBeforeContractState;
    const unityTargetState = unityBeforeContractState;
    let targetRect = null;
    const electronTargets = summarizeElectronBoxes(electronTargetState);
    const unityTargets = summarizeUnityBoxes(unityTargetState);
    if (contract.semanticKey) {
        const electronTarget = findSemanticBox(electronTargets, contract.semanticKey);
        const unityTarget = findSemanticBox(unityTargets, contract.semanticKey);

        if (!electronTarget) {
            failures.push({
                reason: 'Electron did not expose the contracted semantic target before the operation.',
                semanticKey: contract.semanticKey,
            });
        }
        if (!unityTarget) {
            failures.push({
                reason: 'Unity did not expose the contracted semantic target before the operation.',
                semanticKey: contract.semanticKey,
            });
        } else if (!unityTarget.clickable) {
            failures.push({
                reason: 'Unity semantic target is present but not clickable.',
                semanticKey: contract.semanticKey,
                unity: unityTarget,
            });
        }

        if (electronTarget && unityTarget) {
            const delta = rectDelta(electronTarget.rect, unityTarget.rect);
            targetRect = {
                tolerancePx,
                ok: rectWithinTolerance(delta, tolerancePx),
                electron: electronTarget.rect,
                unity: unityTarget.rect,
                delta,
            };
            if (!targetRect.ok) {
                failures.push({
                    reason: 'Contracted semantic target rectangles diverged.',
                    semanticKey: contract.semanticKey,
                    targetRect,
                });
            }
        }
    }

    const electronAction = electronActionResults.find(
        (result) => result.action === contract.action
    );
    const unityAction = normalizeActionResults(unityState.semanticActionResults).find(
        (result) => result.action === contract.action
    );
    if (!electronAction || !unityAction) {
        failures.push({
            reason: 'Contracted action result missing on one side.',
            electron: electronAction ?? null,
            unity: unityAction ?? null,
        });
    } else {
        if (!actionDriverOk('electron', electronAction)) {
            failures.push({
                reason: 'Electron contracted action did not use the live DOM driver.',
                electron: electronAction,
            });
        }
        if (!actionDriverOk('unity', unityAction)) {
            failures.push({
                reason: 'Unity contracted action did not use the live hit-test driver.',
                unity: unityAction,
            });
        }
    }

    const electronPreview = inferElectronPreview(electronAfterContractState);
    const unityPreview = inferUnityPreview(unityAfterContractState);
    const electronPostTargets = summarizeElectronBoxes(electronAfterContractState);
    const unityPostTargets = summarizeUnityBoxes(unityAfterContractState);
    checkExpectedPreview('electron', electronPreview, contract.expectPreview, failures);
    checkExpectedPreview('unity', unityPreview, contract.expectPreview, failures);
    checkExpectedSemanticKeys(
        'electron',
        electronPostTargets,
        contract.expectSemanticKeys,
        failures
    );
    checkExpectedSemanticKeys('unity', unityPostTargets, contract.expectSemanticKeys, failures);
    checkExpectedUnityHover(unityAfterContractState.hover ?? null, contract.expectHover, failures);

    const stateTransition = {
        expectStateStable: Boolean(contract.expectStateStable),
        electronStable: true,
        unityStable: true,
    };
    if (contract.expectStateStable) {
        const electronBefore = normalizeElectronState(electronBeforeContractState);
        const electronAfter = normalizeElectronState(electronAfterContractState);
        const unityBefore = normalizeUnitySnapshot(unityBeforeContractState);
        const unityAfter = normalizeUnitySnapshot(unityAfterContractState);
        stateTransition.electronStable = stableJson(electronBefore) === stableJson(electronAfter);
        stateTransition.unityStable = stableJson(unityBefore) === stableJson(unityAfter);
        if (!stateTransition.electronStable) {
            failures.push({ reason: 'Electron state mutated during a preview-only operation.' });
        }
        if (!stateTransition.unityStable) {
            failures.push({ reason: 'Unity state mutated during a preview-only operation.' });
        }
    }

    return {
        ok: failures.length === 0,
        version: 1,
        contract,
        targetRect,
        action: {
            electron: electronAction ?? null,
            unity: unityAction ?? null,
        },
        preview: {
            electron: electronPreview,
            unity: unityPreview,
        },
        postSemanticKeys: {
            expected: contract.expectSemanticKeys ?? [],
            electron: electronPostTargets.map((target) => target.semanticKey).filter(Boolean),
            unity: unityPostTargets.map((target) => target.semanticKey).filter(Boolean),
        },
        stateTransition,
        failureCount: failures.length,
        failures,
    };
};

const compareScreenshots = async (electronPath, unityPath, diffPath, scenario) => {
    const args = [
        '-NoProfile',
        '-ExecutionPolicy',
        'Bypass',
        '-File',
        path.join(workspaceRoot, 'tools', 'migration', 'compare-png.ps1'),
        '-BaselinePath',
        electronPath,
        '-CandidatePath',
        unityPath,
        '-DiffPath',
        diffPath,
    ];
    if (scenario?.visualCrop) {
        args.push(
            '-BaselineCropX',
            String(scenario.visualCrop.baseline.x),
            '-BaselineCropY',
            String(scenario.visualCrop.baseline.y),
            '-BaselineCropWidth',
            String(scenario.visualCrop.baseline.width),
            '-BaselineCropHeight',
            String(scenario.visualCrop.baseline.height),
            '-CandidateCropX',
            String(scenario.visualCrop.candidate.x),
            '-CandidateCropY',
            String(scenario.visualCrop.candidate.y),
            '-CandidateCropWidth',
            String(scenario.visualCrop.candidate.width),
            '-CandidateCropHeight',
            String(scenario.visualCrop.candidate.height)
        );
    }
    if (Number.isFinite(scenario?.visualMismatchThresholdPercent)) {
        args.push('-ThresholdPercent', String(scenario.visualMismatchThresholdPercent));
    }
    if (Number.isFinite(scenario?.pixelThreshold)) {
        args.push('-PixelThreshold', String(scenario.pixelThreshold));
    }
    if (scenario?.strictPixelVisualDiff) {
        args.push('-RequireStrictPixel');
    }

    const result = await execFileCapture('powershell', args, {
        timeoutMs: 180000,
        allowFailure: true,
    });
    return parseAgentJson(result.stdout);
};

const safeDiffSegment = (value) => String(value).replace(/[^a-z0-9_.-]+/gi, '_');

const createCropRect = (rect, viewport, marginPx) => {
    if (
        !rect ||
        !Number.isFinite(rect.x) ||
        !Number.isFinite(rect.y) ||
        !Number.isFinite(rect.width) ||
        !Number.isFinite(rect.height)
    ) {
        return null;
    }

    const x = Math.max(0, Math.floor(rect.x - marginPx));
    const y = Math.max(0, Math.floor(rect.y - marginPx));
    const right = Math.min(viewport.width, Math.ceil(rect.x + rect.width + marginPx));
    const bottom = Math.min(viewport.height, Math.ceil(rect.y + rect.height + marginPx));
    const width = Math.max(1, right - x);
    const height = Math.max(1, bottom - y);
    return { x, y, width, height };
};

const normalizeCropPair = (baseline, candidate, viewport) => {
    if (!baseline || !candidate) {
        return null;
    }
    const width = Math.max(1, Math.min(baseline.width, candidate.width));
    const height = Math.max(1, Math.min(baseline.height, candidate.height));
    return {
        baseline: {
            x: baseline.x,
            y: baseline.y,
            width: Math.min(width, viewport.width - baseline.x),
            height: Math.min(height, viewport.height - baseline.y),
        },
        candidate: {
            x: candidate.x,
            y: candidate.y,
            width: Math.min(width, viewport.width - candidate.x),
            height: Math.min(height, viewport.height - candidate.y),
        },
    };
};

const compareScopedScreenshots = async (
    electronPath,
    unityPath,
    diffPath,
    scenario,
    boundingBoxes,
    viewport
) => {
    const scopedKeys = Array.isArray(boundingBoxes?.scopedKeys) ? boundingBoxes.scopedKeys : [];
    const electronByKey = new Map((boundingBoxes?.electron ?? []).map((box) => [box.key, box]));
    const unityByKey = new Map((boundingBoxes?.unity ?? []).map((box) => [box.key, box]));
    const marginPx = Number.isFinite(scenario?.visualBoundingBoxMarginPx)
        ? Math.max(0, Math.round(scenario.visualBoundingBoxMarginPx))
        : 16;
    const comparisons = [];

    for (const key of scopedKeys) {
        const electronBox = electronByKey.get(key);
        const unityBox = unityByKey.get(key);
        const cropPair = normalizeCropPair(
            createCropRect(electronBox?.rect, viewport, marginPx),
            createCropRect(unityBox?.rect, viewport, marginPx),
            viewport
        );

        if (!electronBox || !unityBox || !cropPair) {
            comparisons.push({
                key,
                ok: false,
                blocker: 'Scoped visual key is missing from Electron or Unity state.',
            });
            continue;
        }

        const scopedDiffPath = diffPath.replace(/\.png$/i, `-${safeDiffSegment(key)}.png`);
        const result = await compareScreenshots(electronPath, unityPath, scopedDiffPath, {
            ...scenario,
            strictPixelVisualDiff: false,
            visualCrop: cropPair,
        });
        comparisons.push({
            key,
            ok: Boolean(result.ok),
            diffPath: scopedDiffPath,
            baselineCrop: cropPair.baseline,
            candidateCrop: cropPair.candidate,
            similarityPercent: result.similarityPercent,
            requiredSimilarityPercent: result.requiredSimilarityPercent,
            mismatchPercent: result.mismatchPercent,
            mismatchedPixels: result.mismatchedPixels,
            totalPixels: result.totalPixels,
            pixelThreshold: result.pixelThreshold,
            positionTolerancePx: result.positionTolerancePx,
            meanAbsoluteDelta: result.meanAbsoluteDelta,
            meanDeltaOk: result.meanDeltaOk,
            strictPixelOk: result.strictPixelOk,
        });
    }

    return {
        ok: comparisons.length > 0 && comparisons.every((comparison) => comparison.ok),
        scoped: true,
        scope: 'semantic-bounding-boxes',
        marginPx,
        comparisonCount: comparisons.length,
        comparisons,
    };
};

const roundRectValue = (value) =>
    typeof value === 'number' && Number.isFinite(value) ? Number(value.toFixed(2)) : null;

const normalizeRect = (rect) => ({
    x: roundRectValue(rect?.x),
    y: roundRectValue(rect?.y),
    width: roundRectValue(rect?.width),
    height: roundRectValue(rect?.height),
});

const summarizeElectronBoxes = (electronState) =>
    (electronState?.visible?.boxes ?? []).map((box) => ({
        key: box.semanticKey || box.key,
        rawKey: box.key,
        semanticKey: box.semanticKey || null,
        selector: box.selector,
        clickable: null,
        inputDriver: box.selector?.startsWith('synthetic:') ? 'synthetic-bounds' : 'dom-bounds',
        text: box.text ? String(box.text).slice(0, 160) : '',
        rect: normalizeRect(box.rect),
    }));

const summarizeUnityBoxes = (unityState) =>
    (unityState?.visibleTargets ?? []).map((target, index) => {
        const semanticParts = [
            target.kind,
            target.level >= 0 ? `level:${target.level}` : null,
            target.index >= 0 ? `index:${target.index}` : null,
            target.row >= 0 ? `row:${target.row}` : null,
            target.column >= 0 ? `column:${target.column}` : null,
            target.instanceId || target.royalId || target.gemId || target.buffId || null,
        ].filter(Boolean);
        return {
            key:
                target.semanticKey ||
                (semanticParts.length > 0 ? semanticParts.join('|') : `unity-target:${index}`),
            semanticKey: target.semanticKey || null,
            kind: target.kind,
            level: target.level,
            index: target.index,
            row: target.row,
            column: target.column,
            instanceId: target.instanceId || null,
            royalId: target.royalId || null,
            gemId: target.gemId || null,
            buffId: target.buffId || null,
            clickable: Boolean(target.clickable),
            inputDriver: target.inputDriver || null,
            rect: normalizeRect(target.rect),
        };
    });

const requiredSemanticKeys = [
    'app.shell',
    'main.menu',
    'mode.local',
    'draft.root',
    'draft.buff.0',
    'draft.buff.1',
    'draft.buff.2',
    'draft.buff.3',
    'board.root',
    'market.level.1',
    'market.level.2',
    'market.level.3',
    'market.card.1.0',
    'market.card.2.0',
    'market.card.3.0',
    'topbar.score.p1',
    'topbar.score.p2',
    'topbar.turnCore',
    'topbar.turn.p1',
    'topbar.turn.p2',
    'card.preview.overlay',
    'card.preview.backdrop',
    'card.preview.close',
    'card.preview.card',
    'card.preview.primaryAction',
    'player.current.zone',
    'player.opponent.zone',
    'player.resources',
    'player.score',
    'player.reserved.0',
    'turn.end',
    'replay.returnToResults',
    'replay.control.undo',
    'replay.control.redo',
    'replay.counter',
    'royal.featured',
    'settings.panel',
    'error.banner',
];

const strictBoundingBoxKey = (key) =>
    !(
        key.startsWith('chrome.') ||
        key.startsWith('settings.') ||
        key.startsWith('rulebook.') ||
        key.startsWith('board.selection.')
    );

const buildBoundingBoxReport = (electronState, unityState, scenario = null) => {
    const electron = summarizeElectronBoxes(electronState);
    const unity = summarizeUnityBoxes(unityState);
    const electronByKey = new Map(electron.map((box) => [box.key, box]));
    const unityByKey = new Map(unity.map((box) => [box.key, box]));
    const scenarioBoundingBoxKeys = Array.isArray(scenario?.visualBoundingBoxKeys)
        ? scenario.visualBoundingBoxKeys.filter((key) => typeof key === 'string' && key.length > 0)
        : [];
    const scenarioBoundingBoxKeySet = new Set(scenarioBoundingBoxKeys);
    const commonKeys =
        scenarioBoundingBoxKeys.length > 0
            ? scenarioBoundingBoxKeys.filter((key) => electronByKey.has(key) && unityByKey.has(key))
            : [...electronByKey.keys()].filter(
                  (key) => unityByKey.has(key) && strictBoundingBoxKey(key)
              );
    const electronKeys = new Set(electronByKey.keys());
    const unityKeys = new Set(unityByKey.keys());
    const requiredKeys =
        scenarioBoundingBoxKeys.length > 0 ? scenarioBoundingBoxKeys : requiredSemanticKeys;
    const missingElectronKeys = requiredKeys.filter(
        (key) => unityKeys.has(key) && !electronKeys.has(key)
    );
    const missingUnityKeys = requiredKeys.filter(
        (key) => electronKeys.has(key) && !unityKeys.has(key)
    );
    const absentInBothKeys = requiredKeys.filter(
        (key) => !electronKeys.has(key) && !unityKeys.has(key)
    );
    const comparisons = commonKeys.map((key) => {
        const electronRect = electronByKey.get(key).rect;
        const unityRect = unityByKey.get(key).rect;
        const deltas = {
            x: Math.abs(electronRect.x - unityRect.x),
            y: Math.abs(electronRect.y - unityRect.y),
            width: Math.abs(electronRect.width - unityRect.width),
            height: Math.abs(electronRect.height - unityRect.height),
        };
        return {
            key,
            electron: electronRect,
            unity: unityRect,
            deltas,
            ok: deltas.x <= 2 && deltas.y <= 2 && deltas.width <= 2 && deltas.height <= 2,
        };
    });

    return {
        thresholdPx: 2,
        scopedKeys: scenarioBoundingBoxKeys,
        ok:
            commonKeys.length > 0 &&
            (scenarioBoundingBoxKeys.length === 0 ||
                commonKeys.length === scenarioBoundingBoxKeySet.size) &&
            missingElectronKeys.length === 0 &&
            missingUnityKeys.length === 0 &&
            comparisons.every((comparison) => comparison.ok),
        blocker: null,
        electronCount: electron.length,
        unityCount: unity.length,
        commonKeyCount: commonKeys.length,
        missingElectronKeys,
        missingUnityKeys,
        absentInBothKeys,
        comparisons,
        electron,
        unity,
    };
};

const buildTypographyReport = (electronState, unityState) => {
    const normalizeText = (value) =>
        String(value ?? '')
            .replace(/\s+/g, ' ')
            .trim();
    const compactText = (value) => normalizeText(value).replace(/\s/g, '');
    const electron = electronState?.visible?.typography ?? [];
    const unity = unityState?.typography ?? [];
    const failures = [];
    const electronDraftTexts = electron
        .filter(
            (sample) =>
                sample.selector === '[data-draft-buff-title]' ||
                sample.selector === '[data-draft-buff-description]'
        )
        .map((sample) => compactText(sample.text))
        .filter(Boolean);
    const unityDraftSamples = unity.filter(
        (sample) =>
            String(sample.key ?? '').startsWith('Draft Title ') ||
            String(sample.key ?? '').startsWith('Draft Description ')
    );

    for (const text of electronDraftTexts) {
        if (!unityDraftSamples.some((sample) => compactText(sample.text).includes(text))) {
            failures.push({ reason: 'Missing Unity draft typography text sample.', text });
        }
    }

    for (const sample of unityDraftSamples) {
        if (String(sample.alignment) !== 'Left') {
            failures.push({
                reason: 'Unity draft card text is not left aligned like Electron.',
                key: sample.key,
                alignment: sample.alignment,
            });
        }
        if (!sample.font) {
            failures.push({
                reason: 'Unity typography sample did not resolve a runtime font.',
                key: sample.key,
            });
        }
        if (Number(sample.lineSpacing) < 1.05) {
            failures.push({
                reason: 'Unity typography line spacing is below the Electron-aligned minimum.',
                key: sample.key,
                lineSpacing: sample.lineSpacing,
            });
        }
    }

    if (electronDraftTexts.length > 0 && unityDraftSamples.length === 0) {
        failures.push({
            reason: 'Electron draft typography was visible but Unity emitted no draft typography samples.',
        });
    }

    return {
        ok: failures.length === 0,
        failureCount: failures.length,
        electronSampleCount: electron.length,
        unitySampleCount: unity.length,
        failures,
    };
};

const writeMatrix = async (options, matrixRows) => {
    const jsonPath = path.join(options.outputRoot, 'parity-matrix.json');
    const mdPath = path.join(options.outputRoot, 'parity-matrix.md');
    const lines = [
        '# Electron vs Unity Sync Parity Matrix',
        '',
        `Generated: ${new Date().toISOString()}`,
        '',
        '| Scenario | Electron entry | Unity entry | Input script | Expected shared state | Screenshot path | State diff result | Action behavior result | Operation contract result | Pixel/visual diff result | Status |',
        '| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |',
    ];

    for (const row of matrixRows) {
        lines.push(
            [
                row.scenario,
                row.electronEntry,
                row.unityEntry,
                row.inputScript,
                row.expectedSharedState,
                row.screenshotPath,
                row.stateDiffResult,
                row.actionBehaviorResult,
                row.operationContractResult,
                row.pixelVisualDiffResult,
                row.status,
            ]
                .map((value) =>
                    String(value ?? '')
                        .replace(/\|/g, '\\|')
                        .replace(/\n/g, '<br>')
                )
                .join(' | ')
                .replace(/^/, '| ')
                .replace(/$/, ' |')
        );
    }

    await writeFile(jsonPath, JSON.stringify(matrixRows, null, 4));
    await writeFile(mdPath, lines.join('\n') + '\n');
    return { jsonPath, mdPath };
};

const applySuiteProfile = (scenario, suite, options) => {
    if (!suite) {
        return {
            ...scenario,
            electronSettleMs:
                options.electronSettleMs ?? scenario.electronSettleMs ?? defaultElectronSettleMs,
        };
    }

    return {
        ...scenario,
        skipVisualDiff: scenario.skipVisualDiff ?? false,
        strictPixelVisualDiff: scenario.strictPixelVisualDiff ?? suite.strictPixelVisualDiff,
        visualMismatchThresholdPercent:
            suite.visualMismatchThresholdPercent ?? scenario.visualMismatchThresholdPercent,
        electronSettleMs:
            options.electronSettleMs ??
            scenario.electronSettleMs ??
            suite.electronSettleMs ??
            defaultElectronSettleMs,
    };
};

const main = async () => {
    const options = parseArgs();
    const suite = options.suite ? suiteDefinitions[options.suite] : null;
    if (options.suite && !suite) {
        throw new Error(
            `Unknown parity suite "${options.suite}". Known suites: ${Object.keys(suiteDefinitions).join(', ')}`
        );
    }

    const requestedScenarioIds =
        options.scenarioIds.length > 0 ? options.scenarioIds : suite ? suite.scenarioIds : [];
    const selectedScenarioDefinitions =
        requestedScenarioIds.length > 0
            ? scenarioDefinitions.filter((scenario) => requestedScenarioIds.includes(scenario.id))
            : scenarioDefinitions;
    const missingScenarioIds = requestedScenarioIds.filter(
        (id) => !scenarioDefinitions.some((scenario) => scenario.id === id)
    );
    if (missingScenarioIds.length > 0) {
        throw new Error(`Unknown parity scenario id(s): ${missingScenarioIds.join(', ')}`);
    }
    options.scenarioIds = [...new Set(requestedScenarioIds)];
    const profiledScenarioDefinitions = selectedScenarioDefinitions.map((scenario) =>
        applySuiteProfile(scenario, suite, options)
    );

    await mkdir(options.outputRoot, { recursive: true });
    options.browserProcessGuard = createBrowserProcessGuard(options);
    const releaseRunnerLock = await acquireRunnerLock(options);
    const loadReplayBase64 = createReplayBase64Loader();
    let rendererDev = null;
    let unityResult = { ok: false, blocker: 'Unity capture did not start.' };
    const matrixRows = [];
    let finalGuardError = null;

    try {
        options.browserProcessGuard.recordAndAssert('startup-before-agent-browser-close-all');
        await closeAllAgentBrowserSessions(options, 'preflight before parity run');
        await sleep(1000);
        const baselineSnapshot = options.browserProcessGuard.recordAndAssert(
            'startup-after-agent-browser-close-all'
        );
        options.browserProcessGuard.markBaseline(baselineSnapshot);

        rendererDev = await startRendererDevIfNeeded(options);
        unityResult = await runUnityCapture(options);

        for (const viewport of options.viewports) {
            const viewportId = `${viewport.width}x${viewport.height}`;
            for (const scenario of profiledScenarioDefinitions) {
                const scenarioWithDefaults = {
                    electronEntry: options.url,
                    unityEntry: 'GemDuel.Editor.CaptureUnityParityScenarios',
                    fixtureFileName: defaultFixtureFileName,
                    inputScript:
                        scenario.revision === null
                            ? (scenario.actions ?? [{ action: 'reset' }])
                                  .map((step) => step.action)
                                  .join(', ')
                            : `load_replay_fixture(revision=${scenario.revision})${
                                  scenario.actionsAfterLoad
                                      ? ', ' +
                                        scenario.actionsAfterLoad
                                            .map((step) => step.action)
                                            .join(', ')
                                      : ''
                              }`,
                    ...scenario,
                };
                const replayBase64 = await loadReplayBase64(scenarioWithDefaults.fixtureFileName);
                const electron = await captureElectronScenario(
                    options,
                    scenarioWithDefaults,
                    viewport,
                    replayBase64
                );
                const unityScreenshotPath = path.join(
                    options.outputRoot,
                    'unity',
                    scenario.id,
                    `${viewportId}.png`
                );
                const unityStatePath = path.join(
                    options.outputRoot,
                    'unity',
                    scenario.id,
                    `${viewportId}-state.json`
                );
                const stateDiffPath = path.join(
                    options.outputRoot,
                    'diff',
                    scenario.id,
                    `${viewportId}-state-diff.json`
                );
                const imageDiffPath = path.join(
                    options.outputRoot,
                    'diff',
                    scenario.id,
                    `${viewportId}.png`
                );
                await mkdir(path.dirname(stateDiffPath), { recursive: true });

                let stateDiff = {
                    ok: false,
                    mismatchCount: 0,
                    mismatches: [],
                    blocker: unityResult.blocker ?? 'Unity state capture unavailable.',
                };
                let visualDiff = {
                    ok: false,
                    blocker: unityResult.blocker ?? 'Unity screenshot unavailable.',
                    diffPath: imageDiffPath,
                };
                let actionBehavior = {
                    ok: false,
                    blocker: unityResult.blocker ?? 'Unity action result capture unavailable.',
                    failureCount: 0,
                    failures: [],
                };
                let operationContract = {
                    ok: !scenario.operationContract || options.skipUnity,
                    skipped: !scenario.operationContract || options.skipUnity,
                    blocker: scenario.operationContract
                        ? options.skipUnity
                            ? (unityResult.blocker ?? 'Unity capture skipped by --skip-unity.')
                            : (unityResult.blocker ?? 'Unity operation contract unavailable.')
                        : null,
                    failureCount: scenario.operationContract && !options.skipUnity ? 1 : 0,
                    failures: scenario.operationContract
                        ? options.skipUnity
                            ? []
                            : [
                                  {
                                      reason:
                                          unityResult.blocker ??
                                          'Unity operation contract unavailable.',
                                  },
                              ]
                        : [],
                };

                if (
                    unityResult.ok &&
                    existsSync(unityStatePath) &&
                    existsSync(unityScreenshotPath)
                ) {
                    const unityState = JSON.parse(await readFile(unityStatePath, 'utf8'));
                    stateDiff = diffState(electron.state, unityState, scenario);
                    actionBehavior = buildActionBehaviorReport(electron.results, unityState);
                    operationContract = buildOperationContractReport(
                        scenario,
                        electron,
                        unityState
                    );
                    if (scenario.skipVisualDiff) {
                        visualDiff = {
                            ok: true,
                            skipped: true,
                            blocker: null,
                            reason: 'Scenario is operation-contract only.',
                            diffPath: imageDiffPath,
                            boundingBoxes: buildBoundingBoxReport(
                                electron.state,
                                unityState,
                                scenario
                            ),
                            typography: buildTypographyReport(electron.state, unityState),
                        };
                    } else {
                        const boundingBoxes = buildBoundingBoxReport(
                            electron.state,
                            unityState,
                            scenario
                        );
                        if (scenario.visualDiffScope === 'semantic-bounding-boxes') {
                            const scopedVisualDiff = await compareScopedScreenshots(
                                electron.screenshotPath,
                                unityScreenshotPath,
                                imageDiffPath,
                                scenario,
                                boundingBoxes,
                                viewport
                            );
                            visualDiff = {
                                ...scopedVisualDiff,
                                diffPath: imageDiffPath,
                                visualMetricOk: scopedVisualDiff.ok,
                                pixelOk: scopedVisualDiff.ok,
                                blocker: scopedVisualDiff.ok
                                    ? null
                                    : 'Scoped hover target visual diff did not meet the similarity or mean-delta threshold.',
                            };
                        } else {
                            visualDiff = await compareScreenshots(
                                electron.screenshotPath,
                                unityScreenshotPath,
                                imageDiffPath,
                                scenario
                            );
                            visualDiff.visualMetricOk = Boolean(visualDiff.ok);
                            visualDiff.pixelOk = Boolean(visualDiff.ok);
                        }
                        visualDiff.boundingBoxes = boundingBoxes;
                        visualDiff.typography = buildTypographyReport(electron.state, unityState);
                        visualDiff.ok = Boolean(
                            visualDiff.visualMetricOk &&
                            visualDiff.boundingBoxes.ok &&
                            visualDiff.typography.ok
                        );
                    }
                }

                await writeFile(stateDiffPath, JSON.stringify(stateDiff, null, 4));
                const actionBehaviorPath = path.join(
                    options.outputRoot,
                    'diff',
                    scenario.id,
                    `${viewportId}-action-behavior.json`
                );
                await writeFile(actionBehaviorPath, JSON.stringify(actionBehavior, null, 4));
                const operationContractPath = path.join(
                    options.outputRoot,
                    'diff',
                    scenario.id,
                    `${viewportId}-operation-contract.json`
                );
                await writeFile(operationContractPath, JSON.stringify(operationContract, null, 4));
                const visualDiffPath = path.join(
                    options.outputRoot,
                    'diff',
                    scenario.id,
                    `${viewportId}-visual-diff.json`
                );
                await writeFile(visualDiffPath, JSON.stringify(visualDiff, null, 4));

                const status = scenario.blocker
                    ? 'Blocker'
                    : stateDiff.ok && actionBehavior.ok && operationContract.ok && visualDiff.ok
                      ? 'Equivalent'
                      : unityResult.ok
                        ? 'Failing'
                        : 'Blocker';

                matrixRows.push({
                    scenario: `${scenario.name} (${viewportId})`,
                    electronEntry: scenarioWithDefaults.electronEntry,
                    unityEntry: scenarioWithDefaults.unityEntry,
                    inputScript: scenarioWithDefaults.inputScript,
                    expectedSharedState: scenario.expectedSharedState,
                    screenshotPath: `Electron: ${electron.screenshotPath}; Unity: ${unityScreenshotPath}; Diff: ${imageDiffPath}`,
                    stateDiffResult: stateDiff.ok
                        ? 'Equivalent'
                        : stateDiff.blocker
                          ? `Blocker (${stateDiff.mismatchCount ?? 0}) -> ${stateDiffPath}`
                          : `Mismatch (${stateDiff.mismatchCount ?? 0}) -> ${stateDiffPath}`,
                    actionBehaviorResult: actionBehavior.ok
                        ? 'Equivalent real-action path'
                        : actionBehavior.blocker
                          ? `Blocker -> ${actionBehaviorPath}`
                          : `Failing (${actionBehavior.failureCount ?? 0}) -> ${actionBehaviorPath}`,
                    operationContractResult: operationContract.ok
                        ? operationContract.skipped
                            ? 'Not applicable'
                            : 'Equivalent operation contract'
                        : operationContract.blocker
                          ? `Blocker -> ${operationContractPath}`
                          : `Failing (${operationContract.failureCount ?? 0}) -> ${operationContractPath}`,
                    pixelVisualDiffResult: visualDiff.ok
                        ? `Equivalent (strict ${visualDiff.mismatchPercent}%, meanDelta ${visualDiff.meanAbsoluteDelta})`
                        : visualDiff.blocker
                          ? `Blocker -> ${visualDiffPath}`
                          : `Failing -> ${visualDiffPath}`,
                    status,
                    artifacts: {
                        electronScreenshot: electron.screenshotPath,
                        electronState: electron.statePath,
                        unityScreenshot: unityScreenshotPath,
                        unityState: unityStatePath,
                        stateDiff: stateDiffPath,
                        actionBehavior: actionBehaviorPath,
                        operationContract: operationContractPath,
                        visualDiff: visualDiffPath,
                        visualDiffImage: imageDiffPath,
                    },
                    electronResults: electron.results,
                    expectedDebt: scenario.expectedDebt ?? null,
                });
            }
            options.browserProcessGuard.recordAndAssert(`after-viewport-${viewportId}`);
        }
    } finally {
        await closeAllAgentBrowserSessions(options, 'final parity run cleanup');
        try {
            await options.browserProcessGuard.waitForFinal('final-after-agent-browser-close-all');
        } catch (error) {
            finalGuardError = error;
        }
        if (rendererDev?.child) {
            await writeFile(rendererDev.logPath, Buffer.concat(rendererDev.chunks)).catch(() => {});
            stopProcessTree(rendererDev.child.pid);
        }
        await releaseRunnerLock();
        if (finalGuardError) {
            throw finalGuardError;
        }
    }

    const matrixPaths = await writeMatrix(options, matrixRows);
    const matrixCounts = matrixRows.reduce((acc, row) => {
        acc[row.status] = (acc[row.status] ?? 0) + 1;
        return acc;
    }, {});

    await writeFile(
        path.join(options.outputRoot, 'runner-summary.json'),
        JSON.stringify(
            {
                outputRoot: options.outputRoot,
                viewports: options.viewports,
                unity: unityResult,
                matrix: matrixPaths,
                browserProcessGuard: options.browserProcessGuard.summary(),
                counts: matrixCounts,
            },
            null,
            4
        )
    );

    process.stdout.write(`Electron/Unity parity artifacts: ${options.outputRoot}\n`);
    process.stdout.write(`Matrix: ${matrixPaths.mdPath}\n`);

    const failingRows = matrixRows.filter((row) => row.status !== 'Equivalent');
    if (suite?.failOnMatrixFailure && failingRows.length > 0) {
        const failingScenarioNames = failingRows.map((row) => row.scenario).join('; ');
        process.stderr.write(
            `Parity suite "${options.suite}" failed ${failingRows.length} row(s): ${failingScenarioNames}\n`
        );
        process.exitCode = 1;
    }
};

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
    main().catch((error) => {
        process.stderr.write(`${error instanceof Error ? error.stack : String(error)}\n`);
        process.exit(1);
    });
}
