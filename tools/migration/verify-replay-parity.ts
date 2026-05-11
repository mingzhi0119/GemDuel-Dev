import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { parseArgs } from 'node:util';
import { fileURLToPath } from 'node:url';

import { format as formatWithPrettier } from 'prettier';

import { GEM_TYPES } from '../../packages/shared/src/constants';
import { getActionRejectionReason } from '../../packages/shared/src/logic/actionValidation/rules';
import { applyAction } from '../../packages/shared/src/logic/gameReducer';
import { auditReplay } from '../../packages/shared/src/replay/index';
import {
    buildIdentityRuntimeToInstanceMap,
    loadReplayStateAtRevision,
} from '../../packages/shared/src/replay/index';
import { generateReplayStateHash } from '../../packages/shared/src/replay/stateHash';
import type { ReplayEndReason, ReplayVNext } from '../../packages/shared/src/replay/index';
import type { Card, GameAction, GameState, PlayerKey } from '../../packages/shared/src/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workspaceRoot = path.resolve(__dirname, '..', '..');
const DEFAULT_MANIFEST = path.join(workspaceRoot, 'fixtures', 'replay-golden', 'manifest.json');
const DEFAULT_REJECTION_MANIFEST = path.join(
    workspaceRoot,
    'fixtures',
    'replay-golden',
    'rejection-manifest.json'
);

const formatJson = (value: unknown) =>
    formatWithPrettier(JSON.stringify(value), {
        parser: 'json',
        printWidth: 100,
        tabWidth: 4,
    });

const cloneJson = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const REQUIRED_COVERAGE = [
    'local-pvp-opening',
    'reserve',
    'buy',
    'joker-buy',
    'reserved-buy',
    'reserve-cancel',
    'reserve-deck',
    'discard-reserved',
    'privilege',
    'peek-modal',
    'draft-reroll',
    'draft-p2-reroll',
    'royal-selection',
    'royal-handoff',
    'extra-turn',
    'buff',
    'game-over',
] as const;

const REQUIRED_REJECTION_COVERAGE = [
    'wrong-phase:SELECT_BUFF',
    'wrong-phase:TAKE_GEMS',
    'wrong-phase:REPLENISH',
    'wrong-phase:TAKE_BONUS_GEM',
    'wrong-phase:DISCARD_GEM',
    'wrong-phase:STEAL_GEM',
    'wrong-phase:INITIATE_BUY_JOKER',
    'wrong-phase:BUY_CARD',
    'wrong-phase:INITIATE_RESERVE',
    'wrong-phase:INITIATE_RESERVE_DECK',
    'wrong-phase:CANCEL_RESERVE',
    'wrong-phase:RESERVE_CARD',
    'wrong-phase:RESERVE_DECK',
    'wrong-phase:DISCARD_RESERVED',
    'wrong-phase:ACTIVATE_PRIVILEGE',
    'wrong-phase:USE_PRIVILEGE',
    'wrong-phase:CANCEL_PRIVILEGE',
    'wrong-phase:SELECT_ROYAL_CARD',
    'wrong-phase:REROLL_DRAFT_POOL',
    'edge:SELECT_BUFF:unavailable',
    'edge:REPLENISH:empty-bag',
    'edge:TAKE_GEMS:empty',
    'edge:TAKE_GEMS:gold-cell',
    'edge:TAKE_GEMS:gapped',
    'edge:TAKE_BONUS_GEM:wrong-color',
    'edge:TAKE_BONUS_GEM:unavailable-cell',
    'edge:DISCARD_GEM:not-owned',
    'edge:STEAL_GEM:gold',
    'edge:STEAL_GEM:not-owned',
    'edge:INITIATE_BUY_JOKER:non-joker',
    'edge:BUY_CARD:market-mismatch',
    'edge:BUY_CARD:reserved-not-owned',
    'edge:INITIATE_RESERVE:market-mismatch',
    'edge:INITIATE_RESERVE_DECK:empty-deck',
    'edge:RESERVE_CARD:missing-gold',
    'edge:RESERVE_CARD:non-gold',
    'edge:RESERVE_CARD:pending-mismatch',
    'edge:RESERVE_CARD:full-row',
    'edge:RESERVE_DECK:missing-gold',
    'edge:RESERVE_DECK:non-gold',
    'edge:RESERVE_DECK:pending-mismatch',
    'edge:RESERVE_DECK:full-row',
    'edge:DISCARD_RESERVED:no-ability',
    'edge:DISCARD_RESERVED:not-owned',
    'edge:ACTIVATE_PRIVILEGE:no-charge',
    'edge:ACTIVATE_PRIVILEGE:no-target',
    'edge:USE_PRIVILEGE:no-charge',
    'edge:USE_PRIVILEGE:invalid-target',
    'edge:SELECT_ROYAL_CARD:unavailable',
    'edge:PEEK_DECK:no-ability',
    'edge:CLOSE_MODAL:no-modal',
    'edge:CLOSE_MODAL:blocked',
    'edge:REROLL_DRAFT_POOL:online',
    'edge:REROLL_DRAFT_POOL:p2-before-p1',
] as const;

type CoverageTag = (typeof REQUIRED_COVERAGE)[number];
type RejectionCoverageTag = (typeof REQUIRED_REJECTION_COVERAGE)[number];
type RejectionStateSetupId =
    | 'empty-bag'
    | 'empty-deck'
    | 'full-reserve-row'
    | 'empty-board-with-privilege'
    | 'privilege-action-no-charge'
    | 'blocked-peek-modal'
    | 'online-draft'
    | 'p2-draft-before-p1-selection';

interface ManifestFixture {
    id: string;
    fileName: string;
    tags: CoverageTag[];
    expectedFinalStateHash: string;
    expectedWinner: PlayerKey | null;
    expectedEndReason: ReplayEndReason;
    expectedTotalEvents: number;
    expectedTurnCount: number;
}

interface Manifest {
    schemaVersion: number;
    rulesVersion: string;
    replaySchemaVersion: string;
    requiredCoverage: CoverageTag[];
    fixtures: ManifestFixture[];
}

interface RejectionManifestCase {
    id: string;
    fixtureId: string;
    fileName: string;
    revision: number;
    stateSetupId?: RejectionStateSetupId;
    tags: RejectionCoverageTag[];
    actionType: GameAction['type'];
    action: GameAction;
    expectedRejectionCode: string;
    expectedRejectionReason: string;
    expectedBeforeStateHash: string;
    expectedAfterStateHash: string;
}

interface RejectionManifest {
    schemaVersion: number;
    rulesVersion: string;
    replaySchemaVersion: string;
    requiredCoverage: RejectionCoverageTag[];
    cases: RejectionManifestCase[];
}

interface ReplayForCoverageChecks {
    init?: {
        cardInstances?: Record<string, string>;
    };
    replayRevision?: number;
    events?: Array<{
        type?: string;
        actor?: PlayerKey;
        instanceId?: string;
        source?: string;
        bonusColor?: string;
        marketRef?: {
            level?: number;
            idx?: number;
            isExtra?: boolean;
            extraIdx?: number;
        };
    }>;
}

const parseCliOptions = () => {
    const { values } = parseArgs({
        args: process.argv.slice(2),
        options: {
            manifest: { type: 'string' },
            'rejection-manifest': { type: 'string' },
            report: { type: 'string' },
            help: { type: 'boolean' },
        },
        allowPositionals: false,
        strict: true,
    });

    if (values.help) {
        process.stdout.write(
            [
                'Usage: pnpm --dir tools/scripts exec vite-node --script ../../tools/migration/verify-replay-parity.ts [options]',
                '',
                'Options:',
                '  --manifest <path>  Manifest path (default: fixtures/replay-golden/manifest.json)',
                '  --rejection-manifest <path>  Rejection oracle manifest path (default: fixtures/replay-golden/rejection-manifest.json)',
                '  --report <path>    Optional JSON report path',
                '  --help             Show this help message',
                '',
            ].join('\n')
        );
        process.exit(0);
    }

    return {
        manifestPath: path.resolve(values.manifest ?? DEFAULT_MANIFEST),
        rejectionManifestPath: path.resolve(
            values['rejection-manifest'] ?? DEFAULT_REJECTION_MANIFEST
        ),
        reportPath: values.report ? path.resolve(values.report) : null,
    };
};

const parseManifest = (raw: string): Manifest => {
    const parsed = JSON.parse(raw) as Manifest;
    if (parsed.schemaVersion !== 1) {
        throw new Error(`Unsupported replay golden manifest schema: ${parsed.schemaVersion}`);
    }
    if (!Array.isArray(parsed.fixtures) || parsed.fixtures.length === 0) {
        throw new Error('Replay golden manifest must contain at least one fixture.');
    }
    return parsed;
};

const parseRejectionManifest = (raw: string): RejectionManifest => {
    const parsed = JSON.parse(raw) as RejectionManifest;
    if (parsed.schemaVersion !== 1) {
        throw new Error(`Unsupported replay rejection manifest schema: ${parsed.schemaVersion}`);
    }
    if (!Array.isArray(parsed.cases) || parsed.cases.length === 0) {
        throw new Error('Replay rejection manifest must contain at least one case.');
    }
    return parsed;
};

const findCoverageGaps = (manifest: Manifest): CoverageTag[] => {
    const covered = new Set(manifest.fixtures.flatMap((fixture) => fixture.tags));
    const required = new Set([...REQUIRED_COVERAGE, ...(manifest.requiredCoverage ?? [])]);
    return [...required].filter((tag) => !covered.has(tag));
};

const findRejectionCoverageGaps = (manifest: RejectionManifest): RejectionCoverageTag[] => {
    const covered = new Set(manifest.cases.flatMap((fixture) => fixture.tags));
    const required = new Set([
        ...REQUIRED_REJECTION_COVERAGE,
        ...(manifest.requiredCoverage ?? []),
    ]);
    return [...required].filter((tag) => !covered.has(tag));
};

const getTemplateId = (replay: ReplayForCoverageChecks, instanceId: string | undefined) => {
    if (!instanceId) {
        return '';
    }

    return replay.init?.cardInstances?.[instanceId] ?? instanceId;
};

const sameMarketRef = (
    left: NonNullable<ReplayForCoverageChecks['events']>[number]['marketRef'],
    right: NonNullable<ReplayForCoverageChecks['events']>[number]['marketRef']
) =>
    left?.level === right?.level &&
    left?.idx === right?.idx &&
    left?.isExtra === right?.isExtra &&
    left?.extraIdx === right?.extraIdx;

const hasEventType = (replay: ReplayForCoverageChecks, type: string) =>
    (replay.events ?? []).some((event) => event.type === type);

const hasJokerBuyCoverage = (replay: ReplayForCoverageChecks) =>
    (replay.events ?? []).some((event, index, events) => {
        if (
            event.type !== 'buy_card' ||
            !/-jo(?:-|$)/.test(getTemplateId(replay, event.instanceId)) ||
            event.bonusColor === undefined ||
            event.bonusColor === 'gold' ||
            event.bonusColor === 'null'
        ) {
            return false;
        }

        return events
            .slice(0, index)
            .some(
                (previous) =>
                    previous.type === 'initiate_buy_joker' &&
                    previous.actor === event.actor &&
                    previous.instanceId === event.instanceId &&
                    previous.source === event.source &&
                    sameMarketRef(previous.marketRef, event.marketRef)
            );
    });

const hasReservedBuyCoverage = (replay: ReplayForCoverageChecks) =>
    (replay.events ?? []).some((event) => event.type === 'buy_card' && event.source === 'reserved');

const hasReserveCancelCoverage = (replay: ReplayForCoverageChecks) =>
    (replay.events ?? []).some((event, index, events) => {
        if (event.type !== 'cancel_reserve') {
            return false;
        }
        const previous = events[index - 1];
        return previous?.type === 'initiate_reserve' || previous?.type === 'initiate_reserve_deck';
    });

const hasReserveDeckCoverage = (replay: ReplayForCoverageChecks) =>
    (replay.events ?? []).some((event, index, events) => {
        if (event.type !== 'reserve_deck') {
            return false;
        }
        return events.slice(0, index).some((previous) => previous.type === 'initiate_reserve_deck');
    });

const hasDiscardReservedCoverage = (replay: ReplayForCoverageChecks) =>
    (replay.events ?? []).some((event) => event.type === 'discard_reserved');

const hasPrivilegeCoverage = (replay: ReplayForCoverageChecks) => {
    const eventTypes = new Set((replay.events ?? []).map((event) => event.type));
    return (
        eventTypes.has('activate_privilege') &&
        eventTypes.has('cancel_privilege') &&
        eventTypes.has('use_privilege')
    );
};

const hasPeekModalCoverage = (replay: ReplayForCoverageChecks) =>
    (replay.events ?? []).some((event, index, events) => {
        if (event.type !== 'close_modal') {
            return false;
        }
        return events.slice(0, index).some((previous) => previous.type === 'peek_deck');
    });

const hasDraftRerollCoverage = (replay: ReplayForCoverageChecks) =>
    (replay.events ?? []).some((event) => event.type === 'reroll_draft_pool');

const hasP2DraftRerollCoverage = (replay: ReplayForCoverageChecks) =>
    (replay.events ?? []).some((event, index, events) => {
        if (event.type !== 'reroll_draft_pool' || event.actor !== 'p2') {
            return false;
        }

        const sawP1Selection = events
            .slice(0, index)
            .some((previous) => previous.type === 'select_buff' && previous.actor === 'p1');
        const sawP2SelectionAfter = events
            .slice(index + 1)
            .some((next) => next.type === 'select_buff' && next.actor === 'p2');

        return sawP1Selection && sawP2SelectionAfter;
    });

const hasExtraTurnCoverage = (replay: ReplayForCoverageChecks) =>
    (replay.events ?? []).some((event, index, events) => {
        const previous = events[index - 1];
        return previous?.type === 'select_royal' && event.actor === previous.actor;
    });

const hasRoyalHandoffCoverage = (replay: ReplayForCoverageChecks) =>
    (replay.events ?? []).some((event, index, events) => {
        const previous = events[index - 1];
        return previous?.type === 'select_royal' && event.actor !== previous.actor;
    });

const findSemanticCoverageMismatches = (
    fixture: ManifestFixture,
    replay: ReplayForCoverageChecks
): string[] => {
    const mismatches: string[] = [];

    if (
        fixture.tags.includes('local-pvp-opening') &&
        ((replay.events?.length ?? 0) !== 0 || replay.replayRevision !== 0)
    ) {
        mismatches.push(
            'coverage.local-pvp-opening: expected a zero-event INIT replay at revision 0'
        );
    }

    if (fixture.tags.includes('reserve') && !hasEventType(replay, 'reserve_card')) {
        mismatches.push('coverage.reserve: expected a reserve_card event');
    }

    if (fixture.tags.includes('buy') && !hasEventType(replay, 'buy_card')) {
        mismatches.push('coverage.buy: expected a buy_card event');
    }

    if (fixture.tags.includes('joker-buy') && !hasJokerBuyCoverage(replay)) {
        mismatches.push(
            'coverage.joker-buy: expected initiate_buy_joker followed by buy_card for the same Joker instance with a selected bonus color'
        );
    }

    if (fixture.tags.includes('reserved-buy') && !hasReservedBuyCoverage(replay)) {
        mismatches.push('coverage.reserved-buy: expected a buy_card event with source reserved');
    }

    if (fixture.tags.includes('reserve-cancel') && !hasReserveCancelCoverage(replay)) {
        mismatches.push(
            'coverage.reserve-cancel: expected initiate_reserve or initiate_reserve_deck followed by cancel_reserve'
        );
    }

    if (fixture.tags.includes('reserve-deck') && !hasReserveDeckCoverage(replay)) {
        mismatches.push(
            'coverage.reserve-deck: expected initiate_reserve_deck followed by reserve_deck'
        );
    }

    if (fixture.tags.includes('discard-reserved') && !hasDiscardReservedCoverage(replay)) {
        mismatches.push(
            'coverage.discard-reserved: expected a discard_reserved event for a visible reserved card'
        );
    }

    if (fixture.tags.includes('privilege') && !hasPrivilegeCoverage(replay)) {
        mismatches.push(
            'coverage.privilege: expected activate_privilege, cancel_privilege, and use_privilege events'
        );
    }

    if (fixture.tags.includes('peek-modal') && !hasPeekModalCoverage(replay)) {
        mismatches.push('coverage.peek-modal: expected peek_deck followed by close_modal');
    }

    if (fixture.tags.includes('draft-reroll') && !hasDraftRerollCoverage(replay)) {
        mismatches.push('coverage.draft-reroll: expected a reroll_draft_pool event');
    }

    if (fixture.tags.includes('draft-p2-reroll') && !hasP2DraftRerollCoverage(replay)) {
        mismatches.push(
            'coverage.draft-p2-reroll: expected P1 select_buff, P2 reroll_draft_pool, then P2 select_buff'
        );
    }

    if (fixture.tags.includes('royal-selection') && !hasEventType(replay, 'select_royal')) {
        mismatches.push('coverage.royal-selection: expected a select_royal event');
    }

    if (fixture.tags.includes('royal-handoff') && !hasRoyalHandoffCoverage(replay)) {
        mismatches.push(
            'coverage.royal-handoff: expected the event after select_royal to be owned by the next player'
        );
    }

    if (fixture.tags.includes('extra-turn') && !hasExtraTurnCoverage(replay)) {
        mismatches.push(
            'coverage.extra-turn: expected an event by the same actor immediately after select_royal'
        );
    }

    if (fixture.tags.includes('buff') && !hasEventType(replay, 'select_buff')) {
        mismatches.push('coverage.buff: expected at least one select_buff event');
    }

    if (
        fixture.tags.includes('game-over') &&
        (fixture.expectedWinner === null || fixture.expectedEndReason !== 'normal')
    ) {
        mismatches.push(
            'coverage.game-over: expected a completed replay with a winner and normal end reason'
        );
    }

    return mismatches;
};

const collectReserveFillCards = (state: GameState): Card[] => {
    const marketCards = ([1, 2, 3] as const).flatMap((level) =>
        state.market[level].filter((card): card is Card => Boolean(card))
    );
    const deckCards = ([1, 2, 3] as const).flatMap((level) => state.decks[level]);
    const cards = [...marketCards, ...deckCards];
    if (cards.length < 3) {
        throw new Error('Rejection verifier could not find enough cards to fill the reserve row.');
    }
    return cards.slice(0, 3).map((card) => cloneJson(card));
};

const makeEmptyBoard = (state: GameState): GameState['board'] =>
    state.board.map((row, r) =>
        row.map((_cell, c) => ({
            type: GEM_TYPES.EMPTY,
            uid: `oracle-empty-${r}-${c}`,
        }))
    );

const applyRejectionStateSetup = (
    state: GameState,
    setupId: RejectionStateSetupId | undefined
): GameState => {
    if (!setupId) {
        return state;
    }

    const nextState = cloneJson(state);
    switch (setupId) {
        case 'empty-bag':
            nextState.bag = [];
            return nextState;
        case 'empty-deck':
            nextState.decks[1] = [];
            return nextState;
        case 'full-reserve-row':
            nextState.playerReserved[nextState.turn] = collectReserveFillCards(nextState);
            return nextState;
        case 'empty-board-with-privilege':
            nextState.board = makeEmptyBoard(nextState);
            nextState.privileges[nextState.turn] = 1;
            nextState.extraPrivileges[nextState.turn] = 0;
            return nextState;
        case 'privilege-action-no-charge':
            nextState.phase = 'PRIVILEGE_ACTION';
            nextState.privileges[nextState.turn] = 0;
            nextState.extraPrivileges[nextState.turn] = 0;
            nextState.privilegeGemCount = 0;
            return nextState;
        case 'blocked-peek-modal':
            if (!nextState.activeModal) {
                throw new Error('Blocked modal setup requires an active modal.');
            }
            nextState.turn = nextState.activeModal.data.initiator === 'p1' ? 'p2' : 'p1';
            return nextState;
        case 'online-draft':
            nextState.mode = 'ONLINE_MULTIPLAYER';
            return nextState;
        case 'p2-draft-before-p1-selection':
            nextState.turn = 'p2';
            nextState.p1SelectedBuff = null;
            return nextState;
        default: {
            const exhaustive: never = setupId;
            throw new Error(`Unsupported rejection verifier state setup ${exhaustive}.`);
        }
    }
};

const verifyRejectionCase = (
    testCase: RejectionManifestCase,
    replayByFileName: Map<string, ReplayVNext>
) => {
    const replay = replayByFileName.get(testCase.fileName);
    const mismatches: string[] = [];

    if (!replay) {
        return {
            id: testCase.id,
            fileName: testCase.fileName,
            revision: testCase.revision,
            stateSetupId: testCase.stateSetupId,
            actionType: testCase.actionType,
            ok: false,
            mismatches: [`missing-fixture: ${testCase.fileName} was not loaded`],
        };
    }

    const baseState = loadReplayStateAtRevision(replay, testCase.revision);
    const state = applyRejectionStateSetup(baseState, testCase.stateSetupId);
    const runtimeToInstance = buildIdentityRuntimeToInstanceMap(replay.init.cardInstances);
    const beforeStateHash = generateReplayStateHash(state, runtimeToInstance);
    if (beforeStateHash !== testCase.expectedBeforeStateHash) {
        mismatches.push(
            `before-hash: expected ${testCase.expectedBeforeStateHash}, received ${beforeStateHash}`
        );
    }

    if (testCase.action.type !== testCase.actionType) {
        mismatches.push(
            `action-type: manifest action ${testCase.action.type} does not match ${testCase.actionType}`
        );
    }

    const rejectionReason = getActionRejectionReason(state, testCase.action);
    if (!rejectionReason) {
        mismatches.push(`rejection: expected ${testCase.actionType} to be rejected`);
    } else if (rejectionReason !== testCase.expectedRejectionReason) {
        mismatches.push(
            `rejection-reason: expected ${testCase.expectedRejectionReason}, received ${rejectionReason}`
        );
    }

    const nextState = applyAction(state, testCase.action);
    if (!nextState) {
        mismatches.push('after-state: reducer returned null for a rejection case');
    }
    if (nextState && nextState !== state) {
        mismatches.push('after-state: reducer returned a different state object for rejection');
    }

    const afterStateHash = nextState
        ? generateReplayStateHash(nextState, runtimeToInstance)
        : '<null>';
    if (afterStateHash !== testCase.expectedAfterStateHash) {
        mismatches.push(
            `after-hash: expected ${testCase.expectedAfterStateHash}, received ${afterStateHash}`
        );
    }
    if (afterStateHash !== beforeStateHash) {
        mismatches.push(
            `mutation: rejected ${testCase.actionType} changed replay hash ${beforeStateHash} -> ${afterStateHash}`
        );
    }

    return {
        id: testCase.id,
        fileName: testCase.fileName,
        revision: testCase.revision,
        stateSetupId: testCase.stateSetupId,
        actionType: testCase.actionType,
        ok: mismatches.length === 0,
        beforeStateHash,
        afterStateHash,
        rejectionCode: testCase.expectedRejectionCode,
        rejectionReason,
        mismatches,
    };
};

const main = async () => {
    const { manifestPath, rejectionManifestPath, reportPath } = parseCliOptions();
    const manifest = parseManifest(await readFile(manifestPath, 'utf8'));
    const rejectionManifest = parseRejectionManifest(await readFile(rejectionManifestPath, 'utf8'));
    const manifestDir = path.dirname(manifestPath);
    const coverageGaps = findCoverageGaps(manifest);
    const rejectionCoverageGaps = findRejectionCoverageGaps(rejectionManifest);
    const results = [];
    const replayByFileName = new Map<string, ReplayVNext>();

    for (const fixture of manifest.fixtures) {
        const fixturePath = path.join(manifestDir, fixture.fileName);
        const value = await readFile(fixturePath, 'utf8');
        const replay = JSON.parse(value) as ReplayForCoverageChecks;
        replayByFileName.set(fixture.fileName, replay as ReplayVNext);
        const audit = auditReplay({
            id: fixture.fileName,
            value,
            expected: {
                fileName: fixture.fileName,
                winner: fixture.expectedWinner,
                endReason: fixture.expectedEndReason,
                turnCount: fixture.expectedTurnCount,
                totalEvents: fixture.expectedTotalEvents,
                finalStateHash: fixture.expectedFinalStateHash,
            },
            verifySummary: 'full',
        });
        const semanticCoverageMismatches = findSemanticCoverageMismatches(fixture, replay);
        const mismatches = [...audit.mismatches, ...semanticCoverageMismatches];

        results.push({
            id: fixture.id,
            fileName: fixture.fileName,
            ok: audit.ok && semanticCoverageMismatches.length === 0,
            finalStateHash: audit.loadedFinalStateHash,
            winner: audit.loadedWinner,
            mismatches,
            error: audit.error,
        });
    }

    const rejectionResults = rejectionManifest.cases.map((testCase) =>
        verifyRejectionCase(testCase, replayByFileName)
    );

    const report = {
        ok:
            coverageGaps.length === 0 &&
            rejectionCoverageGaps.length === 0 &&
            results.every((result) => result.ok) &&
            rejectionResults.every((result) => result.ok),
        manifestPath,
        rejectionManifestPath,
        rulesVersion: manifest.rulesVersion,
        replaySchemaVersion: manifest.replaySchemaVersion,
        fixtureCount: manifest.fixtures.length,
        rejectionCaseCount: rejectionManifest.cases.length,
        coverageGaps,
        rejectionCoverageGaps,
        results,
        rejectionResults,
    };

    const reportJson = await formatJson(report);
    if (reportPath) {
        await writeFile(reportPath, reportJson, 'utf8');
    }

    process.stdout.write(reportJson);
    if (!report.ok) {
        process.exit(1);
    }
};

main().catch((error) => {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    process.exit(1);
});
