// @vitest-environment node

import { execFileSync, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it } from 'vitest';

const currentFile = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(currentFile), '..', '..');
const summarizerPath = path.join(
    repoRoot,
    'tools',
    'migration',
    'summarize-unity-built-player-smokes.mjs'
);

let tempRoots: string[] = [];

const makeTempRoot = () => {
    const root = mkdtempSync(path.join(tmpdir(), 'gemduel-built-player-summary-'));
    tempRoots.push(root);
    return root;
};

const makeArtifactSmokeRoot = () => {
    const smokeRoot = path.join(repoRoot, 'artifacts', 'unity', 'built-player-smoke');
    mkdirSync(smokeRoot, { recursive: true });
    const root = mkdtempSync(path.join(smokeRoot, 'summary-test-'));
    tempRoots.push(root);
    return root;
};

const makeArtifactBuildRoot = () => {
    const buildRoot = path.join(repoRoot, 'artifacts', 'unity', 'build', 'windows');
    mkdirSync(buildRoot, { recursive: true });
    const root = mkdtempSync(path.join(buildRoot, 'summary-test-'));
    tempRoots.push(root);
    return root;
};

afterEach(() => {
    for (const tempRoot of tempRoots) {
        rmSync(tempRoot, { force: true, recursive: true });
    }
    tempRoots = [];
});

const writeJson = (filePath: string, value: unknown) => {
    mkdirSync(path.dirname(filePath), { recursive: true });
    writeFileSync(filePath, `${JSON.stringify(value, null, 4)}\n`, 'utf8');
};

const sha256 = (buffer: Buffer) => createHash('sha256').update(buffer).digest('hex');

const requiredReplayReleasePathCoverage = [
    'corrupted_summary',
    'failed_overwrite_load',
    'hash_mismatch',
    'invalid_json',
    'malformed_bootstrap',
    'malformed_draft_bootstrap',
    'missing_file',
    'unsupported_schema',
    'valid_overwrite_reload_review',
];

const requiredInvalidActionCaseIds = [
    'reject-cancel-reserve-idle',
    'reject-close-modal-without-modal',
    'reject-inactive-player-take-gems',
    'reject-reroll-draft-pool-idle',
    'reject-select-buff-idle',
    'reject-take-gems-empty-selection',
];

const requiredRecoveryInvalidActionCaseIds = [
    'reject-recovered-cancel-reserve-idle',
    'reject-recovered-close-modal-without-modal',
    'reject-recovered-inactive-player-take-gems',
];

const expectedSettings = {
    locale: 'en',
    theme: 'dark',
    surfaceTheme: 'pearl-opaline',
    soundEnabled: false,
    lanShowOpponentPlayerZoneCards: false,
    lanShowOpponentGems: false,
};

const createLauncherFixture = (options: {
    auditResponse?: unknown;
    auditResponseBytes?: number;
    auditResponsePath?: string;
    auditResponseRequestName?: string;
    auditResponseSha256?: string;
    auditResponseUnderMailbox?: boolean;
    includeAuditResponseDigest?: boolean;
    launcherArgs?: string[];
    evidenceUnderSmokeDir?: boolean;
    exeUnderBuildDir?: boolean;
    playerLogBytes?: number;
    playerLogText?: string;
    smokeReport?: unknown;
    smokeReportText?: string;
    stderrBytes?: number;
    stderrText?: string;
    stdoutBytes?: number;
    stdoutText?: string;
    writeStderr?: boolean;
    writeExecutable?: boolean;
    writeSmokeReport?: boolean;
}) => {
    const root = options.evidenceUnderSmokeDir === false ? makeTempRoot() : makeArtifactSmokeRoot();
    const executableRoot = options.exeUnderBuildDir === false ? root : makeArtifactBuildRoot();
    const mailboxDir = path.join(root, 'mailbox');
    const auditResponse =
        options.auditResponse === undefined
            ? { ok: true, actionType: 'TAKE_GEMS' }
            : options.auditResponse;
    const auditResponsePath =
        options.auditResponsePath ??
        (options.auditResponseUnderMailbox === false
            ? path.join(root, 'audit-outside-mailbox.json')
            : path.join(
                  mailboxDir,
                  'responses',
                  'audit',
                  options.auditResponseRequestName ?? 'req-1.json'
              ));
    const stdoutPath = path.join(root, 'stdout.log');
    const stderrPath = path.join(root, 'stderr.log');
    const playerLogPath = path.join(root, 'player.log');
    const smokeReportPath = path.join(root, 'smoke-report.json');
    const launcherPath = path.join(root, 'launcher.json');
    const executablePath = path.join(executableRoot, 'GemDuelUnity.exe');
    const stdoutText = options.stdoutText ?? 'stdout\n';
    const reportedStdoutBytes = options.stdoutBytes ?? Buffer.byteLength(stdoutText, 'utf8');
    const stderrText = options.stderrText ?? '';
    const reportedStderrBytes = options.stderrBytes ?? Buffer.byteLength(stderrText, 'utf8');
    const playerLogText = options.playerLogText ?? 'player log\n';
    const reportedPlayerLogBytes =
        options.playerLogBytes ?? Buffer.byteLength(playerLogText, 'utf8');
    const smoke = {
        kind: 'unity-built-player-smoke-wrapper',
        ok: true,
        seed: 'unit-smoke-seed',
        maxSteps: 1,
        startMode: 'classic',
        idleActionPreference: 'balanced',
        draftActionPreference: 'select-first',
        includeReplayReleasePath: false,
        includeRecoveryReleasePath: false,
        includeSettingsReleasePath: false,
        includeChromeReleasePath: false,
        includeReplayReviewReleasePath: false,
        includeInvalidActionReleasePath: false,
        includePeekModalReleasePath: false,
        includeRecoveryInvalidActionReleasePath: false,
        includePrivilegeCancelReleasePath: false,
        includeReservedDiscardReleasePath: false,
        includeReservedBuyReleasePath: false,
        includeReserveCancelReleasePath: false,
        includeReserveDeckReleasePath: false,
        includeReserveDeckCancelReleasePath: false,
        includeJokerReleasePath: false,
        player: {
            platform: 'WindowsPlayer',
        },
        smoke: {
            kind: 'unity-localdev-product-surface-smoke',
            ok: true,
            freshLaunch: true,
            seed: 'unit-smoke-seed',
            maxSteps: 1,
            startMode: 'classic',
            idleActionPreference: 'balanced',
            draftActionPreference: 'select-first',
            usedFixtureReplayAsGameplayDriver: false,
            usedCheckpointStateReplacement: false,
            actions: [
                {
                    step: 0,
                    family: 'take_gems',
                    recordedEvents: 1,
                },
            ],
            productStateSummary: {
                phase: 'IDLE',
                turn: 'p2',
                winner: null,
                stateHash: 'abc12345',
                summaryFinalStateHash: 'abc12345',
                recordedEvents: 1,
            },
            replayHashSummary: {
                exportedEvents: 1,
                exportedSummaryFinalStateHash: 'abc12345',
                controllerCurrentStateHash: 'abc12345',
            },
            replayReview: {
                ok: true,
                reviewedFinalStateHash: 'abc12345',
            },
        },
    };

    writeFileSync(stdoutPath, stdoutText, 'utf8');
    if (options.writeStderr !== false) {
        writeFileSync(stderrPath, stderrText, 'utf8');
    }
    writeFileSync(playerLogPath, playerLogText, 'utf8');
    if (options.writeSmokeReport !== false) {
        if (options.smokeReportText !== undefined) {
            writeFileSync(smokeReportPath, options.smokeReportText, 'utf8');
        } else {
            writeJson(smokeReportPath, options.smokeReport ?? smoke);
        }
    }
    if (options.writeExecutable !== false) {
        writeFileSync(executablePath, 'fake exe\n', 'utf8');
    }
    if (auditResponse !== null) {
        writeJson(auditResponsePath, auditResponse);
    }
    const auditResponseBuffer =
        auditResponse !== null ? readFileSync(auditResponsePath) : Buffer.alloc(0);
    const includeAuditResponseDigest = options.includeAuditResponseDigest !== false;

    const launcher = {
        schemaVersion: 1,
        kind: 'unity-built-player-smoke-launcher',
        ok: true,
        exitCode: 0,
        signal: null,
        timedOut: false,
        exe: executablePath,
        paths: {
            stdout: stdoutPath,
            stderr: stderrPath,
            playerLog: playerLogPath,
            smokeReport: smokeReportPath,
            bridgeMailbox: mailboxDir,
        },
        stdoutBytes: reportedStdoutBytes,
        stderrBytes: reportedStderrBytes,
        playerLogBytes: reportedPlayerLogBytes,
        args: options.launcherArgs ?? [
            '-batchmode',
            '-nographics',
            '-logFile',
            playerLogPath,
            '--gemduel-built-player-smoke',
            '--gemduel-smoke-report',
            smokeReportPath,
            '--gemduel-smoke-seed',
            smoke.seed,
            '--gemduel-smoke-max-steps',
            String(smoke.maxSteps),
            '--gemduel-smoke-start-mode',
            smoke.startMode,
            '--gemduel-smoke-idle-action-preference',
            smoke.idleActionPreference,
            '--gemduel-smoke-draft-action-preference',
            smoke.draftActionPreference,
        ],
        bridgeMailboxEvents: [
            {
                request: 'req-1.json',
                auditResponse: path
                    .relative(mailboxDir, auditResponsePath)
                    .replaceAll(path.sep, '/'),
                exitCode: 0,
                signal: null,
                stderr: '',
                ...(includeAuditResponseDigest
                    ? {
                          auditResponseBytes:
                              options.auditResponseBytes ?? auditResponseBuffer.byteLength,
                          auditResponseSha256:
                              options.auditResponseSha256 ?? sha256(auditResponseBuffer),
                      }
                    : {}),
                responseOk: true,
                responseActionType: 'TAKE_GEMS',
                rejectionCode: null,
            },
        ],
        smoke,
    };

    writeJson(launcherPath, launcher);
    return { launcherPath, root };
};

const attachDraftReleasePath = (
    launcherPath: string,
    actionOverrides: Record<number, Record<string, unknown>> = {}
) => {
    const launcher = JSON.parse(readFileSync(launcherPath, 'utf8'));
    const finalHash = 'draft-final-hash';
    const actions = [
        {
            step: 0,
            detail: 'reroll_draft_pool',
            family: 'reroll_draft_pool',
            phaseBefore: 'DRAFT_PHASE',
            phaseAfter: 'DRAFT_PHASE',
            stateHash: 'p1-reroll-hash',
            recordedEvents: 1,
        },
        {
            step: 1,
            detail: 'choose_boon',
            family: 'choose_boon',
            phaseBefore: 'DRAFT_PHASE',
            phaseAfter: 'DRAFT_PHASE',
            stateHash: 'p1-choice-hash',
            recordedEvents: 2,
        },
        {
            step: 2,
            detail: 'reroll_draft_pool',
            family: 'reroll_draft_pool',
            phaseBefore: 'DRAFT_PHASE',
            phaseAfter: 'DRAFT_PHASE',
            stateHash: 'p2-reroll-hash',
            recordedEvents: 3,
        },
        {
            step: 3,
            detail: 'choose_boon',
            family: 'choose_boon',
            phaseBefore: 'DRAFT_PHASE',
            phaseAfter: 'IDLE',
            stateHash: 'draft-complete-hash',
            recordedEvents: 4,
        },
        {
            step: 4,
            detail: 'take_gems',
            family: 'take_gems',
            phaseBefore: 'IDLE',
            phaseAfter: 'IDLE',
            stateHash: finalHash,
            recordedEvents: 5,
        },
    ].map((action, index) => ({ ...action, ...(actionOverrides[index] ?? {}) }));

    launcher.smoke.startMode = 'roguelike';
    launcher.smoke.draftActionPreference = 'reroll-each-player-first';
    launcher.smoke.smoke.startMode = 'roguelike';
    launcher.smoke.smoke.draftActionPreference = 'reroll-each-player-first';
    launcher.smoke.smoke.actions = actions;
    launcher.smoke.smoke.productStateSummary = {
        phase: 'IDLE',
        turn: 'p1',
        winner: null,
        stateHash: finalHash,
        recordedEvents: actions.length,
        summaryFinalStateHash: finalHash,
    };
    launcher.smoke.smoke.replayHashSummary = {
        exportedEvents: actions.length,
        exportedSummaryFinalStateHash: finalHash,
        controllerCurrentStateHash: finalHash,
    };
    launcher.smoke.smoke.actionFamilies = ['choose_boon', 'reroll_draft_pool', 'take_gems'];
    launcher.smoke.smoke.replayReview = {
        ok: true,
        reviewedFinalStateHash: finalHash,
    };

    for (let index = launcher.bridgeMailboxEvents.length; index < actions.length; index += 1) {
        const request = `draft-${index}.json`;
        writeJson(path.join(launcher.paths.bridgeMailbox, 'responses', 'audit', request), {
            ok: true,
            actionType: actions[index].family,
        });
        launcher.bridgeMailboxEvents.push({
            request,
            auditResponse: `responses/audit/${request}`,
            exitCode: 0,
            signal: null,
            stderr: '',
            responseOk: true,
            responseActionType: actions[index].family,
            rejectionCode: null,
        });
    }

    writeJson(launcherPath, launcher);
    writeJson(path.join(path.dirname(launcherPath), 'smoke-report.json'), launcher.smoke);
};

const attachReplayReviewReleasePath = (
    launcherPath: string,
    root: string,
    navigationOverrides: Record<string, unknown> = {}
) => {
    const replayPath = path.join(root, 'replay-review-release-path.replay.json');
    writeJson(replayPath, { schemaVersion: 1, events: [] });

    const launcher = JSON.parse(readFileSync(launcherPath, 'utf8'));
    const reviewNavigationSummary = {
        path: replayPath,
        exportedEvents: 2,
        importedRevision: 0,
        firstForwardRevision: 1,
        secondForwardRevision: 2,
        backToFirstRevision: 1,
        finalRevision: 2,
        beforeReturnedFinalRevision: 1,
        returnedFinalRevision: 2,
        firstForwardHash: 'revision-one',
        backToFirstHash: 'revision-one',
        exportedSummaryFinalStateHash: 'review-final',
        finalReviewHash: 'review-final',
        returnedFinalHash: 'review-final',
        sourceHashBeforeReview: 'source-live',
        sourceHashAfterReview: 'source-live',
        sourceRecordedEventsBeforeReview: 2,
        sourceRecordedEventsAfterReview: 2,
        usedVisibleRedoControl: true,
        usedVisibleUndoControl: true,
        sourceLiveStateUnchanged: true,
        sourceLiveReplayStreamUnchanged: true,
        ...navigationOverrides,
    };

    launcher.smoke.includeReplayReviewReleasePath = true;
    launcher.smoke.replayReviewReleasePath = {
        kind: 'unity-localdev-replay-review-release-path-smoke',
        ok: true,
        freshLaunch: true,
        usedFixtureReplayAsGameplayDriver: false,
        usedCheckpointStateReplacement: false,
        sourceSmoke: {
            ok: true,
            actions: [{ family: 'take_gems' }, { family: 'replenish' }],
        },
        reviewNavigationSummary,
    };

    writeJson(launcherPath, launcher);
    writeJson(path.join(root, 'smoke-report.json'), launcher.smoke);
};

const attachInvalidActionReleasePath = (
    launcherPath: string,
    caseOverrides: Record<string, unknown> = {}
) => {
    const launcher = JSON.parse(readFileSync(launcherPath, 'utf8'));
    const mailboxDir = launcher.paths.bridgeMailbox;
    const rejectedHash = 'invalid-action-hash';
    const rejectedCases = requiredInvalidActionCaseIds.map((id) => ({
        id,
        ok: true,
        accepted: false,
        stateHashBefore: rejectedHash,
        stateHashAfter: rejectedHash,
        summaryHashBefore: rejectedHash,
        summaryHashAfter: rejectedHash,
        recordedEventsBefore: 0,
        recordedEventsAfter: 0,
        driver: 'live-rules-engine-command-rejected',
        ...(caseOverrides[id] ?? {}),
    }));

    for (const id of requiredInvalidActionCaseIds) {
        const requestName = `${id}.json`;
        const auditResponse = path.join(mailboxDir, 'responses', 'audit', requestName);
        writeJson(auditResponse, {
            ok: false,
            rejection: {
                code: 'COMMAND_REJECTED',
            },
        });
        launcher.bridgeMailboxEvents.push({
            request: requestName,
            auditResponse: `responses/audit/${requestName}`,
            exitCode: 2,
            signal: null,
            stderr: '',
            responseOk: false,
            responseActionType: null,
            rejectionCode: 'COMMAND_REJECTED',
        });
    }

    launcher.smoke.includeInvalidActionReleasePath = true;
    launcher.smoke.invalidActionReleasePath = {
        kind: 'unity-localdev-invalid-action-release-path-smoke',
        ok: true,
        freshLaunch: true,
        usedFixtureReplayAsGameplayDriver: false,
        usedCheckpointStateReplacement: false,
        cases: rejectedCases,
        productStateSummary: {
            stateHash: rejectedHash,
            summaryFinalStateHash: rejectedHash,
            recordedEvents: 0,
        },
        replayHashSummary: {
            exportedEvents: 0,
            exportedSummaryFinalStateHash: rejectedHash,
            controllerCurrentStateHash: rejectedHash,
        },
        replayReview: {
            ok: true,
            reviewedFinalStateHash: rejectedHash,
        },
    };

    writeJson(launcherPath, launcher);
    writeJson(path.join(path.dirname(launcherPath), 'smoke-report.json'), launcher.smoke);
};

const attachRecoveryReleasePath = (
    launcherPath: string,
    recoverySummaryOverrides: Record<string, unknown> = {}
) => {
    const launcher = JSON.parse(readFileSync(launcherPath, 'utf8'));
    const savedHash = 'recovery-saved-hash';
    const continuedHash = 'recovery-continued-hash';
    const recoverySummary = {
        savedStatus: 'saved',
        restoredStatus: 'loaded',
        continuedStatus: 'saved',
        savedStateHash: savedHash,
        restoredStateHash: savedHash,
        continuedStateHash: continuedHash,
        savedRecordedEvents: 1,
        restoredRecordedEvents: 1,
        continuedRecordedEvents: 2,
        ...recoverySummaryOverrides,
    };

    launcher.smoke.includeRecoveryReleasePath = true;
    launcher.smoke.recoveryReleasePath = {
        kind: 'unity-localdev-recovery-release-path-smoke',
        ok: true,
        freshLaunch: true,
        usedFixtureReplayAsGameplayDriver: false,
        usedCheckpointStateReplacement: false,
        recoverySummary,
        sourceStateSummary: {
            stateHash: recoverySummary.savedStateHash,
        },
        restoredStateSummary: {
            stateHash: recoverySummary.restoredStateHash,
        },
        continuedStateSummary: {
            stateHash: recoverySummary.continuedStateHash,
        },
        replayHashSummary: {
            exportedEvents: recoverySummary.continuedRecordedEvents,
            exportedSummaryFinalStateHash: recoverySummary.continuedStateHash,
            controllerCurrentStateHash: recoverySummary.continuedStateHash,
        },
        replayReview: {
            ok: true,
            reviewedFinalStateHash: recoverySummary.continuedStateHash,
        },
    };

    writeJson(launcherPath, launcher);
    writeJson(path.join(path.dirname(launcherPath), 'smoke-report.json'), launcher.smoke);
};

const attachSettingsReleasePath = (
    launcherPath: string,
    root: string,
    settingsSummaryOverrides: Record<string, unknown> = {}
) => {
    const settingsPath = path.join(root, 'settings-release-path.json');
    writeJson(settingsPath, expectedSettings);

    const launcher = JSON.parse(readFileSync(launcherPath, 'utf8'));
    const gameplayHash = 'settings-gameplay-hash';
    launcher.smoke.includeSettingsReleasePath = true;
    launcher.smoke.settingsReleasePath = {
        kind: 'unity-localdev-settings-release-path-smoke',
        ok: true,
        freshLaunch: true,
        usedFixtureReplayAsGameplayDriver: false,
        usedCheckpointStateReplacement: false,
        settingsSummary: {
            savedStatus: 'saved',
            reloadedStatus: 'loaded',
            path: settingsPath,
            gameplayHashBefore: gameplayHash,
            gameplayHashAfterSave: gameplayHash,
            recordedEventsBefore: 0,
            recordedEventsAfterSave: 0,
            reloadGameplayHashBefore: gameplayHash,
            reloadGameplayHashAfterLoad: gameplayHash,
            reloadRecordedEventsBefore: 0,
            reloadRecordedEventsAfterLoad: 0,
            savedSettings: expectedSettings,
            persistedSettings: expectedSettings,
            reloadedSettings: expectedSettings,
            ...settingsSummaryOverrides,
        },
    };

    writeJson(launcherPath, launcher);
    writeJson(path.join(path.dirname(launcherPath), 'smoke-report.json'), launcher.smoke);
};

const attachChromeReleasePath = (
    launcherPath: string,
    chromeSummaryOverrides: Record<string, unknown> = {}
) => {
    const launcher = JSON.parse(readFileSync(launcherPath, 'utf8'));
    const gameplayHash = 'chrome-gameplay-hash';
    const restartedHash = 'chrome-restarted-command-hash';

    launcher.smoke.includeChromeReleasePath = true;
    launcher.smoke.chromeReleasePath = {
        kind: 'unity-localdev-chrome-release-path-smoke',
        ok: true,
        freshLaunch: true,
        usedFixtureReplayAsGameplayDriver: false,
        usedCheckpointStateReplacement: false,
        chromeSummary: {
            gameplayHashBeforeRulebook: gameplayHash,
            gameplayHashAfterRulebookOpen: gameplayHash,
            gameplayHashAfterRulebookClose: gameplayHash,
            recordedEventsBeforeRulebook: 0,
            recordedEventsAfterRulebookOpen: 0,
            recordedEventsAfterRulebookClose: 0,
            rulebookOverlayVisibleAfterOpen: true,
            rulebookOverlayVisibleAfterClose: false,
            shellAfterRestart: true,
            localStartVisibleAfterRestart: true,
            restartedStartHash: gameplayHash,
            restartedCommandDetail: 'take_gems',
            restartedCommandHash: restartedHash,
            restartedCommandRecordedEvents: 1,
            ...chromeSummaryOverrides,
        },
    };

    writeJson(launcherPath, launcher);
    writeJson(path.join(path.dirname(launcherPath), 'smoke-report.json'), launcher.smoke);
};

const attachPeekModalReleasePath = (
    launcherPath: string,
    peekSummaryOverrides: Record<string, unknown> = {}
) => {
    const launcher = JSON.parse(readFileSync(launcherPath, 'utf8'));
    const finalHash = 'peek-modal-final-hash';

    launcher.smoke.includePeekModalReleasePath = true;
    launcher.smoke.peekModalReleasePath = {
        kind: 'unity-localdev-peek-modal-release-path-smoke',
        ok: true,
        freshLaunch: true,
        usedFixtureReplayAsGameplayDriver: false,
        usedCheckpointStateReplacement: false,
        peekModalSummary: {
            p1BuffId: 'intelligence',
            p2BuffId: null,
            eventTypes: ['select_buff', 'peek_deck', 'close_modal'],
            peekControlVisibleBefore: true,
            modalVisibleAfterPeek: true,
            closeControlVisibleAfterPeek: true,
            modalVisibleAfterClose: false,
            recordedEvents: 4,
            exportedEvents: 4,
            exportedSummaryFinalStateHash: finalHash,
            controllerCurrentStateHash: finalHash,
            reviewedFinalStateHash: finalHash,
            ...peekSummaryOverrides,
        },
        replayReview: {
            ok: true,
        },
    };

    writeJson(launcherPath, launcher);
    writeJson(path.join(path.dirname(launcherPath), 'smoke-report.json'), launcher.smoke);
};

const attachRecoveryInvalidActionReleasePath = (
    launcherPath: string,
    invalidSummaryOverrides: Record<string, unknown> = {}
) => {
    const launcher = JSON.parse(readFileSync(launcherPath, 'utf8'));
    const mailboxDir = launcher.paths.bridgeMailbox;
    const recoveredHash = 'recovery-invalid-recovered-hash';
    const continuedHash = 'recovery-invalid-continued-hash';
    const rejectedCases = requiredRecoveryInvalidActionCaseIds.map((id) => ({
        id,
        ok: true,
        accepted: false,
        recoveryStateHashBefore: recoveredHash,
        recoveryStateHashAfter: recoveredHash,
        replayStateHashBefore: recoveredHash,
        replayStateHashAfter: recoveredHash,
        summaryHashBefore: recoveredHash,
        summaryHashAfter: recoveredHash,
        recordedEventsBefore: 1,
        recordedEventsAfter: 1,
        driver: 'live-rules-engine-command-rejected',
    }));

    for (const id of requiredRecoveryInvalidActionCaseIds) {
        const requestName = `${id}.json`;
        const auditResponse = path.join(mailboxDir, 'responses', 'audit', requestName);
        writeJson(auditResponse, {
            ok: false,
            rejection: {
                code: 'COMMAND_REJECTED',
            },
        });
        launcher.bridgeMailboxEvents.push({
            request: requestName,
            auditResponse: `responses/audit/${requestName}`,
            exitCode: 2,
            signal: null,
            stderr: '',
            responseOk: false,
            responseActionType: null,
            rejectionCode: 'COMMAND_REJECTED',
        });
    }

    launcher.smoke.includeRecoveryInvalidActionReleasePath = true;
    launcher.smoke.recoveryInvalidActionReleasePath = {
        kind: 'unity-localdev-recovery-invalid-action-release-path-smoke',
        ok: true,
        freshLaunch: true,
        usedFixtureReplayAsGameplayDriver: false,
        usedCheckpointStateReplacement: false,
        cases: rejectedCases,
        recoverySummary: {
            savedStatus: 'saved',
            restoredStatus: 'loaded',
            continuedStatus: 'saved',
            savedStateHash: recoveredHash,
            restoredStateHash: recoveredHash,
            afterInvalidStateHash: recoveredHash,
            continuedStateHash: continuedHash,
            savedRecordedEvents: 1,
            restoredRecordedEvents: 1,
            afterInvalidRecordedEvents: 1,
            continuedRecordedEvents: 2,
        },
        invalidActionSummary: {
            caseCount: rejectedCases.length,
            stateHashBefore: recoveredHash,
            stateHashAfter: recoveredHash,
            recordedEventsBefore: 1,
            recordedEventsAfter: 1,
            ...invalidSummaryOverrides,
        },
        replayHashSummary: {
            exportedEvents: 2,
            exportedSummaryFinalStateHash: continuedHash,
            controllerCurrentStateHash: continuedHash,
            reviewedFinalStateHash: continuedHash,
        },
        replayReview: {
            ok: true,
            reviewedFinalStateHash: continuedHash,
        },
    };

    writeJson(launcherPath, launcher);
    writeJson(path.join(path.dirname(launcherPath), 'smoke-report.json'), launcher.smoke);
};

const attachPrivilegeCancelReleasePath = (
    launcherPath: string,
    privilegeSummaryOverrides: Record<string, unknown> = {}
) => {
    const launcher = JSON.parse(readFileSync(launcherPath, 'utf8'));
    const finalHash = 'privilege-cancel-final-hash';

    launcher.smoke.includePrivilegeCancelReleasePath = true;
    launcher.smoke.privilegeCancelReleasePath = {
        kind: 'unity-localdev-privilege-cancel-release-path-smoke',
        ok: true,
        freshLaunch: true,
        usedFixtureReplayAsGameplayDriver: false,
        usedCheckpointStateReplacement: false,
        privilegeCancelSummary: {
            activatedPhase: 'PRIVILEGE_ACTION',
            cancelledPhase: 'IDLE',
            eventTypes: ['activate_privilege', 'cancel_privilege'],
            activateEventIndex: 0,
            cancelEventIndex: 1,
            recordedEvents: 2,
            exportedEvents: 2,
            exportedSummaryFinalStateHash: finalHash,
            controllerCurrentStateHash: finalHash,
            reviewedFinalStateHash: finalHash,
            ...privilegeSummaryOverrides,
        },
        replayReview: {
            ok: true,
        },
    };

    writeJson(launcherPath, launcher);
    writeJson(path.join(path.dirname(launcherPath), 'smoke-report.json'), launcher.smoke);
};

const attachReservedDiscardReleasePath = (
    launcherPath: string,
    reservedSummaryOverrides: Record<string, unknown> = {}
) => {
    const launcher = JSON.parse(readFileSync(launcherPath, 'utf8'));
    const finalHash = 'reserved-discard-final-hash';

    launcher.smoke.includeReservedDiscardReleasePath = true;
    launcher.smoke.reservedDiscardReleasePath = {
        kind: 'unity-localdev-reserved-discard-release-path-smoke',
        ok: true,
        freshLaunch: true,
        usedFixtureReplayAsGameplayDriver: false,
        usedCheckpointStateReplacement: false,
        reservedDiscardSummary: {
            p1BuffId: 'puppet_master',
            eventTypes: [
                'select_buff',
                'reserve_card',
                'take_gems',
                'take_gems',
                'discard_reserved',
            ],
            selectBuffEventIndex: 0,
            reserveEventIndex: 1,
            discardEventIndex: 4,
            reservedCardVisibleBeforeDiscard: true,
            discardControlVisibleBeforeDiscard: true,
            recordedEvents: 5,
            exportedEvents: 5,
            exportedSummaryFinalStateHash: finalHash,
            controllerCurrentStateHash: finalHash,
            reviewedFinalStateHash: finalHash,
            ...reservedSummaryOverrides,
        },
        replayReview: {
            ok: true,
        },
    };

    writeJson(launcherPath, launcher);
    writeJson(path.join(path.dirname(launcherPath), 'smoke-report.json'), launcher.smoke);
};

const attachReservedBuyReleasePath = (
    launcherPath: string,
    reservedSummaryOverrides: Record<string, unknown> = {}
) => {
    const launcher = JSON.parse(readFileSync(launcherPath, 'utf8'));
    const finalHash = 'reserved-buy-final-hash';

    launcher.smoke.includeReservedBuyReleasePath = true;
    launcher.smoke.reservedBuyReleasePath = {
        kind: 'unity-localdev-reserved-buy-release-path-smoke',
        ok: true,
        freshLaunch: true,
        usedFixtureReplayAsGameplayDriver: false,
        usedCheckpointStateReplacement: false,
        reservedBuySummary: {
            reservedCard: 'c:155-bk#0',
            reservedCardBaseId: '155-bk',
            reservedCardLevel: 1,
            setupActionCount: 5,
            reservedCardVisibleBeforeBuy: true,
            buyControlVisibleBeforeBuy: true,
            finalPhase: 'IDLE',
            finalTurn: 'p2',
            eventTypes: ['initiate_reserve', 'reserve_card', 'take_gems', 'buy_card'],
            reserveEventIndex: 1,
            buyEventIndex: 3,
            buyEventSource: 'reserved',
            recordedEvents: 4,
            exportedEvents: 4,
            exportedSummaryFinalStateHash: finalHash,
            controllerCurrentStateHash: finalHash,
            reviewedFinalStateHash: finalHash,
            ...reservedSummaryOverrides,
        },
        replayReview: {
            ok: true,
        },
    };

    writeJson(launcherPath, launcher);
    writeJson(path.join(path.dirname(launcherPath), 'smoke-report.json'), launcher.smoke);
};

const attachReserveCancelReleasePath = (
    launcherPath: string,
    reserveSummaryOverrides: Record<string, unknown> = {}
) => {
    const launcher = JSON.parse(readFileSync(launcherPath, 'utf8'));
    const finalHash = 'reserve-cancel-final-hash';

    launcher.smoke.includeReserveCancelReleasePath = true;
    launcher.smoke.reserveCancelReleasePath = {
        kind: 'unity-localdev-reserve-cancel-release-path-smoke',
        ok: true,
        freshLaunch: true,
        usedFixtureReplayAsGameplayDriver: false,
        usedCheckpointStateReplacement: false,
        reserveCancelSummary: {
            marketCard: 'c:131-bl#0',
            marketCardVisibleBeforePreview: true,
            visibleReserveControlBeforeInitiate: true,
            phaseBeforeCancel: 'RESERVE_WAITING_GEM',
            visibleCancelControlBeforeCancel: true,
            finalPhase: 'IDLE',
            finalTurn: 'p1',
            pendingReservePresentAfterCancel: false,
            reservedCardPresentAfterCancel: false,
            initialStateHash: finalHash,
            controllerCurrentStateHash: finalHash,
            recordedEvents: 2,
            totalEventsAfterCancel: 0,
            eventTypes: ['initiate_reserve', 'cancel_reserve'],
            initiateEventIndex: 0,
            cancelEventIndex: 1,
            exportedEvents: 2,
            exportedSummaryFinalStateHash: finalHash,
            reviewedFinalStateHash: finalHash,
            ...reserveSummaryOverrides,
        },
        replayReview: {
            ok: true,
        },
    };

    writeJson(launcherPath, launcher);
    writeJson(path.join(path.dirname(launcherPath), 'smoke-report.json'), launcher.smoke);
};

const attachReserveDeckReleasePath = (
    launcherPath: string,
    reserveSummaryOverrides: Record<string, unknown> = {}
) => {
    const launcher = JSON.parse(readFileSync(launcherPath, 'utf8'));
    const finalHash = 'reserve-deck-final-hash';

    launcher.smoke.includeReserveDeckReleasePath = true;
    launcher.smoke.reserveDeckReleasePath = {
        kind: 'unity-localdev-reserve-deck-release-path-smoke',
        ok: true,
        freshLaunch: true,
        usedFixtureReplayAsGameplayDriver: false,
        usedCheckpointStateReplacement: false,
        reserveDeckSummary: {
            topDeckCard: 'c:174-jo#0',
            deckTargetVisibleBeforePreview: true,
            goldTargetVisibleBeforeReserve: true,
            visibleReserveControlBeforeInitiate: true,
            phaseBeforeGold: 'RESERVE_WAITING_GEM',
            pendingReserveIsDeck: true,
            finalPhase: 'IDLE',
            finalTurn: 'p2',
            startDeckCount: 25,
            afterDeckCount: 24,
            startReservedCount: 0,
            afterReservedCount: 1,
            reservedCardPresentAfterReserve: true,
            goldCellAfterReserve: 'empty',
            controllerCurrentStateHash: finalHash,
            recordedEvents: 2,
            totalEventsAfterReserve: 0,
            eventTypes: ['initiate_reserve_deck', 'reserve_deck'],
            initiateEventIndex: 0,
            reserveEventIndex: 1,
            exportedEvents: 2,
            exportedSummaryFinalStateHash: finalHash,
            reviewedFinalStateHash: finalHash,
            ...reserveSummaryOverrides,
        },
        replayReview: {
            ok: true,
        },
    };

    writeJson(launcherPath, launcher);
    writeJson(path.join(path.dirname(launcherPath), 'smoke-report.json'), launcher.smoke);
};

const attachReserveDeckCancelReleasePath = (
    launcherPath: string,
    reserveSummaryOverrides: Record<string, unknown> = {}
) => {
    const launcher = JSON.parse(readFileSync(launcherPath, 'utf8'));
    const finalHash = 'reserve-deck-cancel-final-hash';

    launcher.smoke.includeReserveDeckCancelReleasePath = true;
    launcher.smoke.reserveDeckCancelReleasePath = {
        kind: 'unity-localdev-reserve-deck-cancel-release-path-smoke',
        ok: true,
        freshLaunch: true,
        usedFixtureReplayAsGameplayDriver: false,
        usedCheckpointStateReplacement: false,
        reserveDeckCancelSummary: {
            topDeckCard: 'c:172-jo#0',
            deckTargetVisibleBeforePreview: true,
            goldTargetVisibleBeforeCancel: true,
            visibleReserveControlBeforeInitiate: true,
            phaseBeforeCancel: 'RESERVE_WAITING_GEM',
            pendingReserveIsDeckBeforeCancel: true,
            visibleCancelControlBeforeCancel: true,
            finalPhase: 'IDLE',
            finalTurn: 'p1',
            pendingReservePresentAfterCancel: false,
            startDeckCount: 25,
            afterDeckCount: 25,
            startReservedCount: 0,
            afterReservedCount: 0,
            reservedCardPresentAfterCancel: false,
            goldCellAfterCancel: 'gold',
            initialStateHash: finalHash,
            controllerCurrentStateHash: finalHash,
            recordedEvents: 2,
            totalEventsAfterCancel: 0,
            eventTypes: ['initiate_reserve_deck', 'cancel_reserve'],
            initiateEventIndex: 0,
            cancelEventIndex: 1,
            exportedEvents: 2,
            exportedSummaryFinalStateHash: finalHash,
            reviewedFinalStateHash: finalHash,
            ...reserveSummaryOverrides,
        },
        replayReview: {
            ok: true,
        },
    };

    writeJson(launcherPath, launcher);
    writeJson(path.join(path.dirname(launcherPath), 'smoke-report.json'), launcher.smoke);
};

const attachJokerReleasePath = (
    launcherPath: string,
    jokerSummaryOverrides: Record<string, unknown> = {}
) => {
    const launcher = JSON.parse(readFileSync(launcherPath, 'utf8'));
    const finalHash = 'joker-final-hash';

    launcher.smoke.includeJokerReleasePath = true;
    launcher.smoke.jokerReleasePath = {
        kind: 'unity-localdev-joker-release-path-smoke',
        ok: true,
        freshLaunch: true,
        usedFixtureReplayAsGameplayDriver: false,
        usedCheckpointStateReplacement: false,
        jokerSummary: {
            actor: 'p1',
            jokerCard: 'c:174-jo#0',
            jokerCardBaseId: '174-jo',
            jokerLevel: 1,
            jokerMarketIndex: 4,
            selectedColor: 'red',
            setupActionCount: 6,
            marketCardVisibleBeforePreview: true,
            buyControlVisibleBeforeBuy: true,
            colorTargetVisibleBeforeSelection: true,
            phaseBeforeColor: 'SELECT_CARD_COLOR',
            finalPhase: 'IDLE',
            finalTurn: 'p2',
            tableauContainsJokerAfterBuy: true,
            pendingBuyClearedAfterBuy: true,
            recordedEvents: 8,
            totalEventsAfterBuy: 0,
            eventTypes: [
                'take_gems',
                'take_gems',
                'take_gems',
                'take_gems',
                'take_gems',
                'take_gems',
                'initiate_buy_joker',
                'buy_card',
            ],
            initiateEventIndex: 6,
            buyEventIndex: 7,
            exportedEvents: 8,
            exportedSummaryFinalStateHash: finalHash,
            controllerCurrentStateHash: finalHash,
            reviewedFinalStateHash: finalHash,
            ...jokerSummaryOverrides,
        },
        replayReview: {
            ok: true,
        },
    };

    writeJson(launcherPath, launcher);
    writeJson(path.join(path.dirname(launcherPath), 'smoke-report.json'), launcher.smoke);
};

const attachReplayReleasePath = (
    launcherPath: string,
    root: string,
    coverage = requiredReplayReleasePathCoverage
) => {
    const releasePathRoot = path.join(root, 'replay-release-path');
    mkdirSync(releasePathRoot, { recursive: true });

    const launcher = JSON.parse(readFileSync(launcherPath, 'utf8'));
    const finalHash = launcher.smoke.smoke.productStateSummary.stateHash;
    const recordedEvents = launcher.smoke.smoke.productStateSummary.recordedEvents;

    launcher.paths.replayReleasePathDir = releasePathRoot;
    launcher.smoke.includeReplayReleasePath = true;
    launcher.smoke.replayReleasePath = {
        kind: 'unity-localdev-replay-release-path-smoke',
        ok: true,
        outputDirectory: releasePathRoot,
        coverage,
        cases: coverage.map((name) => {
            const rejectedImport = name !== 'valid_overwrite_reload_review';
            return {
                name,
                ok: true,
                ...(rejectedImport
                    ? {
                          accepted: false,
                          stateHashBefore: finalHash,
                          stateHashAfter: finalHash,
                          recordedEventsBefore: recordedEvents,
                          recordedEventsAfter: recordedEvents,
                          liveReplayStateUnchanged: true,
                      }
                    : {}),
            };
        }),
        baseline: {
            stateHash: finalHash,
            recordedEvents,
        },
        reviewedFinalStateHash: finalHash,
    };

    writeJson(launcherPath, launcher);
    writeJson(path.join(root, 'smoke-report.json'), launcher.smoke);
};

const runSummarizer = (
    launcherPath: string | string[],
    outPath: string,
    extraArgs: string[] = []
) => {
    const launcherPaths = Array.isArray(launcherPath) ? launcherPath : [launcherPath];
    return spawnSync(
        process.execPath,
        [
            summarizerPath,
            '--check',
            '--require-audited-mailbox-responses',
            ...extraArgs,
            '--require-family',
            'take_gems',
            '--out',
            outPath,
            ...launcherPaths,
        ],
        { cwd: repoRoot, encoding: 'utf8' }
    );
};

describe('summarize-unity-built-player-smokes audit response validation', () => {
    it('passes when retained audit response files exist and match launcher events', () => {
        const { launcherPath, root } = createLauncherFixture({});
        const outPath = path.join(root, 'matrix.json');

        execFileSync(
            process.execPath,
            [
                summarizerPath,
                '--check',
                '--require-audited-mailbox-responses',
                '--require-family',
                'take_gems',
                '--out',
                outPath,
                launcherPath,
            ],
            { cwd: repoRoot, encoding: 'utf8' }
        );

        const matrix = JSON.parse(readFileSync(outPath, 'utf8'));
        expect(matrix.check.passed).toBe(true);
        expect(matrix.summary.totalValidMailboxAuditResponseCount).toBe(1);
        expect(matrix.reports[0]).toMatchObject({
            launcherReportUnderBuiltPlayerSmokeDir: true,
            executableExists: true,
            executableUnderWindowsBuild: true,
            stdoutUnderBuiltPlayerSmokeDir: true,
            stdoutBytes: 7,
            reportedStdoutBytes: 7,
            stderrUnderBuiltPlayerSmokeDir: true,
            stderrBytes: 0,
            reportedStderrBytes: 0,
            playerLogUnderBuiltPlayerSmokeDir: true,
            playerLogBytes: 11,
            reportedPlayerLogBytes: 11,
            launcherArgsMatchSmoke: true,
            smokeReportUnderBuiltPlayerSmokeDir: true,
            smokeReportExists: true,
            smokeReportValidJson: true,
            smokeReportMatchesLauncherSmoke: true,
            bridgeMailboxUnderBuiltPlayerSmokeDir: true,
        });
        expect(matrix.reports[0].mailboxAuditResponses[0]).toMatchObject({
            ok: true,
            underBridgeMailbox: true,
            matchesRequestName: true,
            matchesAuditResponseDigest: true,
            responseOk: true,
            responseActionType: 'TAKE_GEMS',
        });
    });

    it('passes when an exact retained report count is required and present', () => {
        const { launcherPath, root } = createLauncherFixture({});
        const outPath = path.join(root, 'matrix.json');
        const result = runSummarizer(launcherPath, outPath, ['--require-report-count', '1']);

        expect(result.status).toBe(0);
        const matrix = JSON.parse(readFileSync(outPath, 'utf8'));
        expect(matrix.check.requiredReportCount).toBe(1);
        expect(matrix.summary.reportCount).toBe(1);
    });

    it('fails closed when a required retained report count is missing', () => {
        const { launcherPath, root } = createLauncherFixture({});
        const result = runSummarizer(launcherPath, path.join(root, 'matrix.json'), [
            '--require-report-count',
            '2',
        ]);

        expect(result.status).toBe(1);
        expect(result.stderr).toContain(
            'Required built-player report count was not met: expected 2, found 1.'
        );
    });

    it('records every required release-path option in matrix check metadata', () => {
        const { launcherPath, root } = createLauncherFixture({});
        const outPath = path.join(root, 'matrix.json');
        const requiredReleasePathFlags = [
            ['--require-draft-release-path', 'requireDraftReleasePath'],
            ['--require-replay-release-path', 'requireReplayReleasePath'],
            ['--require-recovery-release-path', 'requireRecoveryReleasePath'],
            ['--require-settings-release-path', 'requireSettingsReleasePath'],
            ['--require-chrome-release-path', 'requireChromeReleasePath'],
            ['--require-replay-review-release-path', 'requireReplayReviewReleasePath'],
            ['--require-invalid-action-release-path', 'requireInvalidActionReleasePath'],
            ['--require-peek-modal-release-path', 'requirePeekModalReleasePath'],
            [
                '--require-recovery-invalid-action-release-path',
                'requireRecoveryInvalidActionReleasePath',
            ],
            ['--require-privilege-cancel-release-path', 'requirePrivilegeCancelReleasePath'],
            ['--require-reserved-discard-release-path', 'requireReservedDiscardReleasePath'],
            ['--require-reserved-buy-release-path', 'requireReservedBuyReleasePath'],
            ['--require-reserve-cancel-release-path', 'requireReserveCancelReleasePath'],
            ['--require-reserve-deck-release-path', 'requireReserveDeckReleasePath'],
            ['--require-reserve-deck-cancel-release-path', 'requireReserveDeckCancelReleasePath'],
            ['--require-joker-release-path', 'requireJokerReleasePath'],
        ] as const;
        const result = runSummarizer(
            launcherPath,
            outPath,
            requiredReleasePathFlags.map(([flag]) => flag)
        );

        expect(result.status).toBe(1);
        const matrix = JSON.parse(readFileSync(outPath, 'utf8'));
        for (const [, checkKey] of requiredReleasePathFlags) {
            expect(matrix.check[checkKey]).toBe(true);
        }
        expect(matrix.check.failures).toContain(
            'Required replay release-path proof was not covered.'
        );
        expect(matrix.check.failures).toContain(
            'Required Joker release-path proof was not covered.'
        );
    });

    it('passes when unique retained launcher report paths are required and present', () => {
        const first = createLauncherFixture({});
        const second = createLauncherFixture({});
        const outPath = path.join(first.root, 'matrix.json');
        const result = runSummarizer([first.launcherPath, second.launcherPath], outPath, [
            '--require-unique-report-paths',
            '--require-report-count',
            '2',
        ]);

        expect(result.status).toBe(0);
        const matrix = JSON.parse(readFileSync(outPath, 'utf8'));
        expect(matrix.check.requireUniqueReportPaths).toBe(true);
        expect(matrix.check.duplicateReportPaths).toEqual([]);
        expect(matrix.summary.reportCount).toBe(2);
    });

    it('fails closed when duplicate retained launcher report paths are supplied', () => {
        const { launcherPath, root } = createLauncherFixture({});
        const result = runSummarizer([launcherPath, launcherPath], path.join(root, 'matrix.json'), [
            '--require-unique-report-paths',
        ]);

        expect(result.status).toBe(1);
        expect(result.stderr).toContain('Duplicate built-player launcher report path supplied:');
        expect(result.stderr).toContain('launcher.json');
    });

    it('passes when unique nested smoke report paths are required and present', () => {
        const first = createLauncherFixture({});
        const second = createLauncherFixture({});
        const outPath = path.join(first.root, 'matrix.json');
        const result = runSummarizer([first.launcherPath, second.launcherPath], outPath, [
            '--require-unique-smoke-report-paths',
            '--require-report-count',
            '2',
        ]);

        expect(result.status).toBe(0);
        const matrix = JSON.parse(readFileSync(outPath, 'utf8'));
        expect(matrix.check.requireUniqueSmokeReportPaths).toBe(true);
        expect(matrix.check.duplicateSmokeReportPaths).toEqual([]);
        expect(matrix.summary.reportCount).toBe(2);
    });

    it('fails closed when distinct launcher reports share a nested smoke report path', () => {
        const first = createLauncherFixture({});
        const second = createLauncherFixture({});
        const firstLauncher = JSON.parse(readFileSync(first.launcherPath, 'utf8'));
        const secondLauncher = JSON.parse(readFileSync(second.launcherPath, 'utf8'));
        secondLauncher.paths.smokeReport = firstLauncher.paths.smokeReport;
        writeJson(second.launcherPath, secondLauncher);

        const result = runSummarizer(
            [first.launcherPath, second.launcherPath],
            path.join(first.root, 'matrix.json'),
            ['--require-unique-smoke-report-paths']
        );

        expect(result.status).toBe(1);
        expect(result.stderr).toContain(
            'Duplicate built-player nested smoke report path supplied:'
        );
        expect(result.stderr).toContain('smoke-report.json');
    });

    it('passes when unique retained log paths are required and present', () => {
        const first = createLauncherFixture({});
        const second = createLauncherFixture({});
        const outPath = path.join(first.root, 'matrix.json');
        const result = runSummarizer([first.launcherPath, second.launcherPath], outPath, [
            '--require-unique-log-paths',
            '--require-report-count',
            '2',
        ]);

        expect(result.status).toBe(0);
        const matrix = JSON.parse(readFileSync(outPath, 'utf8'));
        expect(matrix.check.requireUniqueLogPaths).toBe(true);
        expect(matrix.check.duplicateStdoutLogPaths).toEqual([]);
        expect(matrix.check.duplicateStderrLogPaths).toEqual([]);
        expect(matrix.check.duplicatePlayerLogPaths).toEqual([]);
        expect(matrix.summary.reportCount).toBe(2);
    });

    it('fails closed when distinct launcher reports share retained log paths', () => {
        const first = createLauncherFixture({});
        const second = createLauncherFixture({});
        const firstLauncher = JSON.parse(readFileSync(first.launcherPath, 'utf8'));
        const secondLauncher = JSON.parse(readFileSync(second.launcherPath, 'utf8'));
        secondLauncher.paths.stdout = firstLauncher.paths.stdout;
        secondLauncher.paths.stderr = firstLauncher.paths.stderr;
        secondLauncher.paths.playerLog = firstLauncher.paths.playerLog;
        writeJson(second.launcherPath, secondLauncher);

        const result = runSummarizer(
            [first.launcherPath, second.launcherPath],
            path.join(first.root, 'matrix.json'),
            ['--require-unique-log-paths']
        );

        expect(result.status).toBe(1);
        expect(result.stderr).toContain('Duplicate built-player stdout log path supplied:');
        expect(result.stderr).toContain('Duplicate built-player stderr log path supplied:');
        expect(result.stderr).toContain('Duplicate built-player player log path supplied:');
    });

    it('fails closed when a retained audit response file is missing', () => {
        const { launcherPath, root } = createLauncherFixture({ auditResponse: null });
        const result = runSummarizer(launcherPath, path.join(root, 'matrix.json'));

        expect(result.status).toBe(1);
        expect(result.stderr).toContain('Mailbox audit response file does not exist');
    });

    it('fails closed when a passing retained smoke report still carries a failure reason', () => {
        const { launcherPath, root } = createLauncherFixture({});
        const launcher = JSON.parse(readFileSync(launcherPath, 'utf8'));
        launcher.smoke.smoke.failureReason = 'stale nested product-surface failure';
        writeJson(launcherPath, launcher);
        writeJson(path.join(root, 'smoke-report.json'), launcher.smoke);

        const result = runSummarizer(launcherPath, path.join(root, 'matrix.json'));

        expect(result.status).toBe(1);
        expect(result.stderr).toContain('Passing built-player report retains failure reason');
        expect(result.stderr).toContain('stale nested product-surface failure');
    });

    it('fails closed when the retained launcher report ok flag is false', () => {
        const { launcherPath, root } = createLauncherFixture({});
        const launcher = JSON.parse(readFileSync(launcherPath, 'utf8'));
        launcher.ok = false;
        writeJson(launcherPath, launcher);

        const result = runSummarizer(launcherPath, path.join(root, 'matrix.json'));

        expect(result.status).toBe(1);
        expect(result.stderr).toContain('Launcher report ok is not true');
    });

    it('fails closed when the retained nested wrapper ok flag is false', () => {
        const { launcherPath, root } = createLauncherFixture({});
        const launcher = JSON.parse(readFileSync(launcherPath, 'utf8'));
        launcher.smoke.ok = false;
        writeJson(launcherPath, launcher);
        writeJson(path.join(root, 'smoke-report.json'), launcher.smoke);

        const result = runSummarizer(launcherPath, path.join(root, 'matrix.json'));

        expect(result.status).toBe(1);
        expect(result.stderr).toContain('Nested wrapper ok is not true');
    });

    it('fails closed when the retained nested product-surface smoke ok flag is false', () => {
        const { launcherPath, root } = createLauncherFixture({});
        const launcher = JSON.parse(readFileSync(launcherPath, 'utf8'));
        launcher.smoke.smoke.ok = false;
        writeJson(launcherPath, launcher);
        writeJson(path.join(root, 'smoke-report.json'), launcher.smoke);

        const result = runSummarizer(launcherPath, path.join(root, 'matrix.json'));

        expect(result.status).toBe(1);
        expect(result.stderr).toContain('Nested product-surface smoke ok is not true');
    });

    it('fails closed when the built player executable is missing', () => {
        const { launcherPath, root } = createLauncherFixture({ writeExecutable: false });
        const result = runSummarizer(launcherPath, path.join(root, 'matrix.json'));

        expect(result.status).toBe(1);
        expect(result.stderr).toContain(
            'Built player executable path is missing or does not exist'
        );
    });

    it('fails closed when the built player executable is outside the governed build path', () => {
        const { launcherPath, root } = createLauncherFixture({ exeUnderBuildDir: false });
        const result = runSummarizer(launcherPath, path.join(root, 'matrix.json'));

        expect(result.status).toBe(1);
        expect(result.stderr).toContain(
            'Built player executable path is not under artifacts/unity/build/windows'
        );
    });

    it('fails closed when the built player process exit code is non-zero', () => {
        const { launcherPath, root } = createLauncherFixture({});
        const launcher = JSON.parse(readFileSync(launcherPath, 'utf8'));
        launcher.exitCode = 1;
        writeJson(launcherPath, launcher);

        const result = runSummarizer(launcherPath, path.join(root, 'matrix.json'));

        expect(result.status).toBe(1);
        expect(result.stderr).toContain('Built player exitCode is not 0');
    });

    it('fails closed when the built player smoke timed out', () => {
        const { launcherPath, root } = createLauncherFixture({});
        const launcher = JSON.parse(readFileSync(launcherPath, 'utf8'));
        launcher.timedOut = true;
        writeJson(launcherPath, launcher);

        const result = runSummarizer(launcherPath, path.join(root, 'matrix.json'));

        expect(result.status).toBe(1);
        expect(result.stderr).toContain('Built player smoke timed out');
    });

    it('fails closed when retained evidence paths are outside the built-player smoke artifacts directory', () => {
        const { launcherPath, root } = createLauncherFixture({ evidenceUnderSmokeDir: false });
        const result = runSummarizer(launcherPath, path.join(root, 'matrix.json'));

        expect(result.status).toBe(1);
        expect(result.stderr).toContain(
            'Launcher report path is not under artifacts/unity/built-player-smoke'
        );
        expect(result.stderr).toContain(
            'Captured stdout log path is not under artifacts/unity/built-player-smoke'
        );
        expect(result.stderr).toContain(
            'Bridge mailbox path is not under artifacts/unity/built-player-smoke'
        );
    });

    it('fails closed when a retained audit response path escapes the bridge mailbox directory', () => {
        const { launcherPath, root } = createLauncherFixture({
            auditResponseUnderMailbox: false,
        });
        const result = runSummarizer(launcherPath, path.join(root, 'matrix.json'));

        expect(result.status).toBe(1);
        expect(result.stderr).toContain(
            'Mailbox audit response path is not under the bridge mailbox directory'
        );
    });

    it('fails closed when a retained audit response file name does not match the request', () => {
        const { launcherPath, root } = createLauncherFixture({
            auditResponseRequestName: 'other-request.json',
        });
        const result = runSummarizer(launcherPath, path.join(root, 'matrix.json'));

        expect(result.status).toBe(1);
        expect(result.stderr).toContain(
            'Mailbox audit response file name does not match launcher request'
        );
    });

    it('fails closed when a retained audit response digest does not match the launcher event', () => {
        const { launcherPath, root } = createLauncherFixture({
            auditResponseSha256: '0'.repeat(64),
        });
        const result = runSummarizer(launcherPath, path.join(root, 'matrix.json'), [
            '--require-audited-mailbox-response-digests',
        ]);

        expect(result.status).toBe(1);
        expect(result.stderr).toContain(
            'Mailbox audit response digest does not match launcher event'
        );
    });

    it('fails closed when digest validation is required but launcher digest metadata is missing', () => {
        const { launcherPath, root } = createLauncherFixture({
            includeAuditResponseDigest: false,
        });
        const result = runSummarizer(launcherPath, path.join(root, 'matrix.json'), [
            '--require-audited-mailbox-response-digests',
        ]);

        expect(result.status).toBe(1);
        expect(result.stderr).toContain('Mailbox audit response digests are missing or mismatched');
    });

    it('passes when an aggregate audited mailbox digest count is required and present', () => {
        const { launcherPath, root } = createLauncherFixture({});
        const outPath = path.join(root, 'matrix.json');
        const result = runSummarizer(launcherPath, outPath, [
            '--require-audited-mailbox-response-digest-count',
            '1',
        ]);

        expect(result.status).toBe(0);
        const matrix = JSON.parse(readFileSync(outPath, 'utf8'));
        expect(matrix.check.requiredAuditedMailboxResponseDigestCount).toBe(1);
        expect(matrix.check.requireAuditedMailboxResponses).toBe(true);
        expect(matrix.check.validMailboxAuditResponseDigestCount).toBe(1);
        expect(matrix.summary.totalValidMailboxAuditResponseDigestCount).toBe(1);
    });

    it('fails closed when an aggregate audited mailbox digest count is required but missing', () => {
        const { launcherPath, root } = createLauncherFixture({
            includeAuditResponseDigest: false,
        });
        const result = runSummarizer(launcherPath, path.join(root, 'matrix.json'), [
            '--require-audited-mailbox-response-digest-count',
            '1',
        ]);

        expect(result.status).toBe(1);
        expect(result.stderr).toContain(
            'Required audited mailbox response digest count was not met: expected at least 1, found 0.'
        );
    });

    it('passes when draft release-path reroll/select and replay evidence is required and complete', () => {
        const { launcherPath, root } = createLauncherFixture({});
        attachDraftReleasePath(launcherPath);
        const outPath = path.join(root, 'matrix.json');

        const result = runSummarizer(launcherPath, outPath, [
            '--require-draft-release-path',
            '--require-family',
            'reroll_draft_pool',
            '--require-family',
            'choose_boon',
        ]);

        expect(result.status).toBe(0);
        const matrix = JSON.parse(readFileSync(outPath, 'utf8'));
        expect(matrix.check.passed).toBe(true);
        expect(matrix.summary.draftReleasePathReportCount).toBe(1);
        expect(matrix.summary.draftFinalStateHashes).toContain('draft-final-hash');
        expect(matrix.reports[0].draftReleasePath).toMatchObject({
            enabled: true,
            ok: true,
            startMode: 'roguelike',
            draftActionPreference: 'reroll-each-player-first',
            actionFamilies: [
                'reroll_draft_pool',
                'choose_boon',
                'reroll_draft_pool',
                'choose_boon',
            ],
            finalDraftPhase: 'IDLE',
            controllerCurrentStateHash: 'draft-final-hash',
            reviewedFinalStateHash: 'draft-final-hash',
        });
    });

    it('fails closed when draft release-path evidence does not finish draft phase', () => {
        const { launcherPath, root } = createLauncherFixture({});
        attachDraftReleasePath(launcherPath, {
            3: {
                phaseAfter: 'DRAFT_PHASE',
            },
        });
        const result = runSummarizer(launcherPath, path.join(root, 'matrix.json'), [
            '--require-draft-release-path',
        ]);

        expect(result.status).toBe(1);
        expect(result.stderr).toContain(
            'Draft release-path proof did not complete both players draft selections into IDLE.'
        );
    });

    it('passes when replay release-path coverage is required and complete', () => {
        const { launcherPath, root } = createLauncherFixture({});
        attachReplayReleasePath(launcherPath, root);
        const outPath = path.join(root, 'matrix.json');
        const result = runSummarizer(launcherPath, outPath, ['--require-replay-release-path']);

        expect(result.status).toBe(0);
        const matrix = JSON.parse(readFileSync(outPath, 'utf8'));
        expect(matrix.summary.replayReleasePathReportCount).toBe(1);
        expect(matrix.summary.replayReleasePathCoverage).toEqual(requiredReplayReleasePathCoverage);
        expect(matrix.reports[0].replayReleasePath).toMatchObject({
            enabled: true,
            ok: true,
            coverage: requiredReplayReleasePathCoverage,
            reviewedFinalStateHash: 'abc12345',
        });
        expect(matrix.reports[0].replayReleasePath.cases).toHaveLength(
            requiredReplayReleasePathCoverage.length
        );
    });

    it('passes when replay release-path rejected imports require explicit no-mutation evidence', () => {
        const { launcherPath, root } = createLauncherFixture({});
        attachReplayReleasePath(launcherPath, root);
        const outPath = path.join(root, 'matrix.json');
        const result = runSummarizer(launcherPath, outPath, [
            '--require-replay-release-path-no-mutation',
        ]);

        expect(result.status).toBe(0);
        const matrix = JSON.parse(readFileSync(outPath, 'utf8'));
        expect(matrix.check.requireReplayReleasePath).toBe(true);
        expect(matrix.check.requireReplayReleasePathNoMutation).toBe(true);
        const invalidJsonCase = matrix.reports[0].replayReleasePath.cases.find(
            (entry) => entry.name === 'invalid_json'
        );
        expect(invalidJsonCase).toMatchObject({
            accepted: false,
            stateHashBefore: 'abc12345',
            stateHashAfter: 'abc12345',
            recordedEventsBefore: 1,
            recordedEventsAfter: 1,
            liveReplayStateUnchanged: true,
        });
    });

    it('fails closed when required replay release-path coverage is incomplete', () => {
        const { launcherPath, root } = createLauncherFixture({});
        attachReplayReleasePath(
            launcherPath,
            root,
            requiredReplayReleasePathCoverage.filter((entry) => entry !== 'hash_mismatch')
        );
        const result = runSummarizer(launcherPath, path.join(root, 'matrix.json'), [
            '--require-replay-release-path',
        ]);

        expect(result.status).toBe(1);
        expect(result.stderr).toContain(
            'Replay release-path proof is missing coverage: hash_mismatch'
        );
    });

    it('fails closed when replay release-path rejected import evidence mutates state', () => {
        const { launcherPath, root } = createLauncherFixture({});
        attachReplayReleasePath(launcherPath, root);
        const launcher = JSON.parse(readFileSync(launcherPath, 'utf8'));
        const invalidCase = launcher.smoke.replayReleasePath.cases.find(
            (entry) => entry.name === 'invalid_json'
        );
        invalidCase.stateHashAfter = 'mutated-replay-state';
        invalidCase.liveReplayStateUnchanged = false;
        writeJson(launcherPath, launcher);
        writeJson(path.join(root, 'smoke-report.json'), launcher.smoke);

        const result = runSummarizer(launcherPath, path.join(root, 'matrix.json'), [
            '--require-replay-release-path-no-mutation',
        ]);

        expect(result.status).toBe(1);
        expect(result.stderr).toContain(
            'Replay release-path rejected import proof mutated state, recorded events, or omitted explicit no-mutation evidence.'
        );
    });

    it('passes when invalid-action release-path no-mutation evidence is required and complete', () => {
        const { launcherPath, root } = createLauncherFixture({});
        attachInvalidActionReleasePath(launcherPath);
        const outPath = path.join(root, 'matrix.json');
        const result = runSummarizer(launcherPath, outPath, [
            '--require-invalid-action-release-path',
        ]);

        expect(result.status).toBe(0);
        const matrix = JSON.parse(readFileSync(outPath, 'utf8'));
        expect(matrix.summary.invalidActionReleasePathReportCount).toBe(1);
        expect(matrix.summary.invalidActionFinalHashes).toEqual(['invalid-action-hash']);
        expect(matrix.reports[0].invalidActionReleasePath).toMatchObject({
            enabled: true,
            ok: true,
            caseCount: requiredInvalidActionCaseIds.length,
            productStateHash: 'invalid-action-hash',
            recordedEvents: 0,
            exportedEvents: 0,
            reviewedFinalStateHash: 'invalid-action-hash',
        });
        expect(
            matrix.reports[0].invalidActionReleasePath.cases.map((entry) => entry.id).sort()
        ).toEqual([...requiredInvalidActionCaseIds].sort());
    });

    it('fails closed when invalid-action release-path evidence mutates state', () => {
        const { launcherPath, root } = createLauncherFixture({});
        attachInvalidActionReleasePath(launcherPath, {
            'reject-select-buff-idle': {
                stateHashAfter: 'mutated-state',
            },
        });
        const result = runSummarizer(launcherPath, path.join(root, 'matrix.json'), [
            '--require-invalid-action-release-path',
        ]);

        expect(result.status).toBe(1);
        expect(result.stderr).toContain(
            'Invalid-action release-path proof has a case that mutated state, recorded an event, or bypassed the bridge rejection path.'
        );
    });

    it('passes when recovery release-path save/load/continue evidence is required and complete', () => {
        const { launcherPath, root } = createLauncherFixture({});
        attachRecoveryReleasePath(launcherPath);
        const outPath = path.join(root, 'matrix.json');
        const result = runSummarizer(launcherPath, outPath, ['--require-recovery-release-path']);

        expect(result.status).toBe(0);
        const matrix = JSON.parse(readFileSync(outPath, 'utf8'));
        expect(matrix.summary.recoveryReleasePathReportCount).toBe(1);
        expect(matrix.summary.recoveryFinalStateHashes).toEqual(['recovery-continued-hash']);
        expect(matrix.reports[0].recoveryReleasePath).toMatchObject({
            enabled: true,
            ok: true,
            savedStateHash: 'recovery-saved-hash',
            restoredStateHash: 'recovery-saved-hash',
            continuedStateHash: 'recovery-continued-hash',
            savedRecordedEvents: 1,
            restoredRecordedEvents: 1,
            continuedRecordedEvents: 2,
            exportedEvents: 2,
            reviewedFinalStateHash: 'recovery-continued-hash',
        });
    });

    it('fails closed when recovery release-path evidence does not append a replay event', () => {
        const { launcherPath, root } = createLauncherFixture({});
        attachRecoveryReleasePath(launcherPath, {
            continuedRecordedEvents: 1,
        });
        const result = runSummarizer(launcherPath, path.join(root, 'matrix.json'), [
            '--require-recovery-release-path',
        ]);

        expect(result.status).toBe(1);
        expect(result.stderr).toContain(
            'Recovery release-path proof did not preserve then append live replay events.'
        );
    });

    it('passes when settings release-path persistence evidence is required and complete', () => {
        const { launcherPath, root } = createLauncherFixture({});
        attachSettingsReleasePath(launcherPath, root);
        const outPath = path.join(root, 'matrix.json');
        const result = runSummarizer(launcherPath, outPath, ['--require-settings-release-path']);

        expect(result.status).toBe(0);
        const matrix = JSON.parse(readFileSync(outPath, 'utf8'));
        expect(matrix.summary.settingsReleasePathReportCount).toBe(1);
        expect(matrix.summary.settingsPersistencePaths).toEqual([
            path
                .relative(repoRoot, path.join(root, 'settings-release-path.json'))
                .replaceAll(path.sep, '/'),
        ]);
        expect(matrix.reports[0].settingsReleasePath).toMatchObject({
            enabled: true,
            ok: true,
            savedStatus: 'saved',
            reloadedStatus: 'loaded',
            gameplayHashBefore: 'settings-gameplay-hash',
            gameplayHashAfterSave: 'settings-gameplay-hash',
            recordedEventsBefore: 0,
            recordedEventsAfterSave: 0,
            reloadGameplayHashBefore: 'settings-gameplay-hash',
            reloadGameplayHashAfterLoad: 'settings-gameplay-hash',
            reloadRecordedEventsBefore: 0,
            reloadRecordedEventsAfterLoad: 0,
            savedSettings: expectedSettings,
            persistedSettings: expectedSettings,
            reloadedSettings: expectedSettings,
        });
    });

    it('fails closed when settings release-path evidence records gameplay events', () => {
        const { launcherPath, root } = createLauncherFixture({});
        attachSettingsReleasePath(launcherPath, root, {
            recordedEventsAfterSave: 1,
        });
        const result = runSummarizer(launcherPath, path.join(root, 'matrix.json'), [
            '--require-settings-release-path',
        ]);

        expect(result.status).toBe(1);
        expect(result.stderr).toContain('Settings release-path proof recorded gameplay events.');
    });

    it('passes when chrome release-path rulebook and restart evidence is required and complete', () => {
        const { launcherPath, root } = createLauncherFixture({});
        attachChromeReleasePath(launcherPath);
        const outPath = path.join(root, 'matrix.json');
        const result = runSummarizer(launcherPath, outPath, ['--require-chrome-release-path']);

        expect(result.status).toBe(0);
        const matrix = JSON.parse(readFileSync(outPath, 'utf8'));
        expect(matrix.summary.chromeReleasePathReportCount).toBe(1);
        expect(matrix.summary.chromeRestartHashes).toEqual(['chrome-restarted-command-hash']);
        expect(matrix.reports[0].chromeReleasePath).toMatchObject({
            enabled: true,
            ok: true,
            gameplayHashBeforeRulebook: 'chrome-gameplay-hash',
            gameplayHashAfterRulebookOpen: 'chrome-gameplay-hash',
            gameplayHashAfterRulebookClose: 'chrome-gameplay-hash',
            recordedEventsBeforeRulebook: 0,
            recordedEventsAfterRulebookOpen: 0,
            recordedEventsAfterRulebookClose: 0,
            rulebookOverlayVisibleAfterOpen: true,
            rulebookOverlayVisibleAfterClose: false,
            shellAfterRestart: true,
            localStartVisibleAfterRestart: true,
            restartedStartHash: 'chrome-gameplay-hash',
            restartedCommandHash: 'chrome-restarted-command-hash',
            restartedCommandRecordedEvents: 1,
        });
    });

    it('fails closed when chrome release-path rulebook controls record gameplay events', () => {
        const { launcherPath, root } = createLauncherFixture({});
        attachChromeReleasePath(launcherPath, {
            recordedEventsAfterRulebookOpen: 1,
        });
        const result = runSummarizer(launcherPath, path.join(root, 'matrix.json'), [
            '--require-chrome-release-path',
        ]);

        expect(result.status).toBe(1);
        expect(result.stderr).toContain(
            'Chrome release-path rulebook controls changed live replay event count.'
        );
    });

    it('passes when peek-modal release-path control and replay evidence is required and complete', () => {
        const { launcherPath, root } = createLauncherFixture({});
        attachPeekModalReleasePath(launcherPath);
        const outPath = path.join(root, 'matrix.json');
        const result = runSummarizer(launcherPath, outPath, ['--require-peek-modal-release-path']);

        expect(result.status).toBe(0);
        const matrix = JSON.parse(readFileSync(outPath, 'utf8'));
        expect(matrix.summary.peekModalReleasePathReportCount).toBe(1);
        expect(matrix.summary.peekModalFinalHashes).toEqual(['peek-modal-final-hash']);
        expect(matrix.reports[0].peekModalReleasePath).toMatchObject({
            enabled: true,
            ok: true,
            p1BuffId: 'intelligence',
            eventTypes: ['select_buff', 'peek_deck', 'close_modal'],
            recordedEvents: 4,
            exportedEvents: 4,
            controllerCurrentStateHash: 'peek-modal-final-hash',
            reviewedFinalStateHash: 'peek-modal-final-hash',
        });
    });

    it('fails closed when peek-modal release-path evidence misses the close-modal event', () => {
        const { launcherPath, root } = createLauncherFixture({});
        attachPeekModalReleasePath(launcherPath, {
            eventTypes: ['select_buff', 'peek_deck'],
        });
        const result = runSummarizer(launcherPath, path.join(root, 'matrix.json'), [
            '--require-peek-modal-release-path',
        ]);

        expect(result.status).toBe(1);
        expect(result.stderr).toContain(
            'Peek-modal release-path proof did not export select_buff, peek_deck, and close_modal events.'
        );
    });

    it('passes when recovery invalid-action release-path rejection and continuation evidence is required and complete', () => {
        const { launcherPath, root } = createLauncherFixture({});
        attachRecoveryInvalidActionReleasePath(launcherPath);
        const outPath = path.join(root, 'matrix.json');
        const result = runSummarizer(launcherPath, outPath, [
            '--require-recovery-invalid-action-release-path',
        ]);

        expect(result.status).toBe(0);
        const matrix = JSON.parse(readFileSync(outPath, 'utf8'));
        expect(matrix.summary.recoveryInvalidActionReleasePathReportCount).toBe(1);
        expect(matrix.summary.recoveryInvalidActionFinalHashes).toEqual([
            'recovery-invalid-continued-hash',
        ]);
        expect(matrix.reports[0].recoveryInvalidActionReleasePath).toMatchObject({
            enabled: true,
            ok: true,
            caseCount: 3,
            savedStateHash: 'recovery-invalid-recovered-hash',
            restoredStateHash: 'recovery-invalid-recovered-hash',
            afterInvalidStateHash: 'recovery-invalid-recovered-hash',
            continuedStateHash: 'recovery-invalid-continued-hash',
            savedRecordedEvents: 1,
            afterInvalidRecordedEvents: 1,
            continuedRecordedEvents: 2,
            exportedEvents: 2,
            reviewedFinalStateHash: 'recovery-invalid-continued-hash',
        });
    });

    it('fails closed when recovery invalid-action release-path evidence records a rejection event', () => {
        const { launcherPath, root } = createLauncherFixture({});
        attachRecoveryInvalidActionReleasePath(launcherPath, {
            recordedEventsAfter: 2,
        });
        const result = runSummarizer(launcherPath, path.join(root, 'matrix.json'), [
            '--require-recovery-invalid-action-release-path',
        ]);

        expect(result.status).toBe(1);
        expect(result.stderr).toContain(
            'Recovery invalid-action summary does not prove no mutation/no recording.'
        );
    });

    it('passes when privilege-cancel release-path phase, event, and replay evidence is required and complete', () => {
        const { launcherPath, root } = createLauncherFixture({});
        attachPrivilegeCancelReleasePath(launcherPath);
        const outPath = path.join(root, 'matrix.json');
        const result = runSummarizer(launcherPath, outPath, [
            '--require-privilege-cancel-release-path',
        ]);

        expect(result.status).toBe(0);
        const matrix = JSON.parse(readFileSync(outPath, 'utf8'));
        expect(matrix.summary.privilegeCancelReleasePathReportCount).toBe(1);
        expect(matrix.summary.privilegeCancelFinalHashes).toEqual(['privilege-cancel-final-hash']);
        expect(matrix.reports[0].privilegeCancelReleasePath).toMatchObject({
            enabled: true,
            ok: true,
            activatedPhase: 'PRIVILEGE_ACTION',
            cancelledPhase: 'IDLE',
            eventTypes: ['activate_privilege', 'cancel_privilege'],
            recordedEvents: 2,
            exportedEvents: 2,
            controllerCurrentStateHash: 'privilege-cancel-final-hash',
            reviewedFinalStateHash: 'privilege-cancel-final-hash',
        });
    });

    it('fails closed when privilege-cancel release-path event ordering is reversed', () => {
        const { launcherPath, root } = createLauncherFixture({});
        attachPrivilegeCancelReleasePath(launcherPath, {
            activateEventIndex: 1,
            cancelEventIndex: 0,
        });
        const result = runSummarizer(launcherPath, path.join(root, 'matrix.json'), [
            '--require-privilege-cancel-release-path',
        ]);

        expect(result.status).toBe(1);
        expect(result.stderr).toContain(
            'Privilege-cancel release-path proof did not export ordered activate_privilege then cancel_privilege events.'
        );
    });

    it('passes when reserved-discard release-path controls, events, and replay evidence is required and complete', () => {
        const { launcherPath, root } = createLauncherFixture({});
        attachReservedDiscardReleasePath(launcherPath);
        const outPath = path.join(root, 'matrix.json');
        const result = runSummarizer(launcherPath, outPath, [
            '--require-reserved-discard-release-path',
        ]);

        expect(result.status).toBe(0);
        const matrix = JSON.parse(readFileSync(outPath, 'utf8'));
        expect(matrix.summary.reservedDiscardReleasePathReportCount).toBe(1);
        expect(matrix.summary.reservedDiscardFinalHashes).toEqual(['reserved-discard-final-hash']);
        expect(matrix.reports[0].reservedDiscardReleasePath).toMatchObject({
            enabled: true,
            ok: true,
            p1BuffId: 'puppet_master',
            eventTypes: [
                'select_buff',
                'reserve_card',
                'take_gems',
                'take_gems',
                'discard_reserved',
            ],
            recordedEvents: 5,
            exportedEvents: 5,
            controllerCurrentStateHash: 'reserved-discard-final-hash',
            reviewedFinalStateHash: 'reserved-discard-final-hash',
        });
    });

    it('fails closed when reserved-discard release-path controls are not visible', () => {
        const { launcherPath, root } = createLauncherFixture({});
        attachReservedDiscardReleasePath(launcherPath, {
            discardControlVisibleBeforeDiscard: false,
        });
        const result = runSummarizer(launcherPath, path.join(root, 'matrix.json'), [
            '--require-reserved-discard-release-path',
        ]);

        expect(result.status).toBe(1);
        expect(result.stderr).toContain(
            'Reserved-discard release-path proof did not exercise visible reserved-card discard controls.'
        );
    });

    it('passes when reserved-buy release-path controls, events, and replay evidence is required and complete', () => {
        const { launcherPath, root } = createLauncherFixture({});
        attachReservedBuyReleasePath(launcherPath);
        const outPath = path.join(root, 'matrix.json');
        const result = runSummarizer(launcherPath, outPath, [
            '--require-reserved-buy-release-path',
        ]);

        expect(result.status).toBe(0);
        const matrix = JSON.parse(readFileSync(outPath, 'utf8'));
        expect(matrix.summary.reservedBuyReleasePathReportCount).toBe(1);
        expect(matrix.summary.reservedBuyFinalHashes).toEqual(['reserved-buy-final-hash']);
        expect(matrix.reports[0].reservedBuyReleasePath).toMatchObject({
            enabled: true,
            ok: true,
            reservedCard: 'c:155-bk#0',
            reservedCardBaseId: '155-bk',
            reservedCardLevel: 1,
            eventTypes: ['initiate_reserve', 'reserve_card', 'take_gems', 'buy_card'],
            buyEventSource: 'reserved',
            recordedEvents: 4,
            exportedEvents: 4,
            controllerCurrentStateHash: 'reserved-buy-final-hash',
            reviewedFinalStateHash: 'reserved-buy-final-hash',
        });
    });

    it('fails closed when reserved-buy release-path buy event is not reserved-source', () => {
        const { launcherPath, root } = createLauncherFixture({});
        attachReservedBuyReleasePath(launcherPath, {
            buyEventSource: 'market',
        });
        const result = runSummarizer(launcherPath, path.join(root, 'matrix.json'), [
            '--require-reserved-buy-release-path',
        ]);

        expect(result.status).toBe(1);
        expect(result.stderr).toContain(
            'Reserved-buy release-path proof did not export ordered reserve_card and reserved-source buy_card events.'
        );
    });

    it('passes when reserve-cancel release-path controls, events, and replay evidence is required and complete', () => {
        const { launcherPath, root } = createLauncherFixture({});
        attachReserveCancelReleasePath(launcherPath);
        const outPath = path.join(root, 'matrix.json');
        const result = runSummarizer(launcherPath, outPath, [
            '--require-reserve-cancel-release-path',
        ]);

        expect(result.status).toBe(0);
        const matrix = JSON.parse(readFileSync(outPath, 'utf8'));
        expect(matrix.summary.reserveCancelReleasePathReportCount).toBe(1);
        expect(matrix.summary.reserveCancelFinalHashes).toEqual(['reserve-cancel-final-hash']);
        expect(matrix.reports[0].reserveCancelReleasePath).toMatchObject({
            enabled: true,
            ok: true,
            marketCard: 'c:131-bl#0',
            phaseBeforeCancel: 'RESERVE_WAITING_GEM',
            finalPhase: 'IDLE',
            eventTypes: ['initiate_reserve', 'cancel_reserve'],
            recordedEvents: 2,
            exportedEvents: 2,
            controllerCurrentStateHash: 'reserve-cancel-final-hash',
            reviewedFinalStateHash: 'reserve-cancel-final-hash',
        });
    });

    it('fails closed when reserve-cancel release-path leaves pending reserve state after cancel', () => {
        const { launcherPath, root } = createLauncherFixture({});
        attachReserveCancelReleasePath(launcherPath, {
            pendingReservePresentAfterCancel: true,
        });
        const result = runSummarizer(launcherPath, path.join(root, 'matrix.json'), [
            '--require-reserve-cancel-release-path',
        ]);

        expect(result.status).toBe(1);
        expect(result.stderr).toContain(
            'Reserve-cancel release-path proof left pending reserve or reserved card state after cancel.'
        );
    });

    it('passes when reserve-deck release-path controls, events, and replay evidence is required and complete', () => {
        const { launcherPath, root } = createLauncherFixture({});
        attachReserveDeckReleasePath(launcherPath);
        const outPath = path.join(root, 'matrix.json');
        const result = runSummarizer(launcherPath, outPath, [
            '--require-reserve-deck-release-path',
        ]);

        expect(result.status).toBe(0);
        const matrix = JSON.parse(readFileSync(outPath, 'utf8'));
        expect(matrix.summary.reserveDeckReleasePathReportCount).toBe(1);
        expect(matrix.summary.reserveDeckFinalHashes).toEqual(['reserve-deck-final-hash']);
        expect(matrix.reports[0].reserveDeckReleasePath).toMatchObject({
            enabled: true,
            ok: true,
            topDeckCard: 'c:174-jo#0',
            phaseBeforeGold: 'RESERVE_WAITING_GEM',
            finalPhase: 'IDLE',
            finalTurn: 'p2',
            eventTypes: ['initiate_reserve_deck', 'reserve_deck'],
            recordedEvents: 2,
            exportedEvents: 2,
            controllerCurrentStateHash: 'reserve-deck-final-hash',
            reviewedFinalStateHash: 'reserve-deck-final-hash',
        });
    });

    it('fails closed when reserve-deck release-path does not decrement the deck', () => {
        const { launcherPath, root } = createLauncherFixture({});
        attachReserveDeckReleasePath(launcherPath, {
            afterDeckCount: 25,
        });
        const result = runSummarizer(launcherPath, path.join(root, 'matrix.json'), [
            '--require-reserve-deck-release-path',
        ]);

        expect(result.status).toBe(1);
        expect(result.stderr).toContain(
            'Reserve-deck release-path proof did not move the deck card into reserve and consume Gold.'
        );
    });

    it('passes when reserve-deck-cancel release-path controls, events, and replay evidence is required and complete', () => {
        const { launcherPath, root } = createLauncherFixture({});
        attachReserveDeckCancelReleasePath(launcherPath);
        const outPath = path.join(root, 'matrix.json');
        const result = runSummarizer(launcherPath, outPath, [
            '--require-reserve-deck-cancel-release-path',
        ]);

        expect(result.status).toBe(0);
        const matrix = JSON.parse(readFileSync(outPath, 'utf8'));
        expect(matrix.summary.reserveDeckCancelReleasePathReportCount).toBe(1);
        expect(matrix.summary.reserveDeckCancelFinalHashes).toEqual([
            'reserve-deck-cancel-final-hash',
        ]);
        expect(matrix.reports[0].reserveDeckCancelReleasePath).toMatchObject({
            enabled: true,
            ok: true,
            topDeckCard: 'c:172-jo#0',
            phaseBeforeCancel: 'RESERVE_WAITING_GEM',
            finalPhase: 'IDLE',
            finalTurn: 'p1',
            eventTypes: ['initiate_reserve_deck', 'cancel_reserve'],
            recordedEvents: 2,
            exportedEvents: 2,
            controllerCurrentStateHash: 'reserve-deck-cancel-final-hash',
            reviewedFinalStateHash: 'reserve-deck-cancel-final-hash',
        });
    });

    it('fails closed when reserve-deck-cancel release-path consumes the Gold cell after cancel', () => {
        const { launcherPath, root } = createLauncherFixture({});
        attachReserveDeckCancelReleasePath(launcherPath, {
            goldCellAfterCancel: 'empty',
        });
        const result = runSummarizer(launcherPath, path.join(root, 'matrix.json'), [
            '--require-reserve-deck-cancel-release-path',
        ]);

        expect(result.status).toBe(1);
        expect(result.stderr).toContain(
            'Deck-reserve cancel release-path proof mutated deck, reserve row, pending reserve, or Gold state.'
        );
    });

    it('passes when Joker release-path controls, events, and replay evidence is required and complete', () => {
        const { launcherPath, root } = createLauncherFixture({});
        attachJokerReleasePath(launcherPath);
        const outPath = path.join(root, 'matrix.json');
        const result = runSummarizer(launcherPath, outPath, ['--require-joker-release-path']);

        expect(result.status).toBe(0);
        const matrix = JSON.parse(readFileSync(outPath, 'utf8'));
        expect(matrix.summary.jokerReleasePathReportCount).toBe(1);
        expect(matrix.summary.jokerFinalHashes).toEqual(['joker-final-hash']);
        expect(matrix.reports[0].jokerReleasePath).toMatchObject({
            enabled: true,
            ok: true,
            jokerCard: 'c:174-jo#0',
            jokerCardBaseId: '174-jo',
            jokerLevel: 1,
            selectedColor: 'red',
            phaseBeforeColor: 'SELECT_CARD_COLOR',
            finalPhase: 'IDLE',
            finalTurn: 'p2',
            eventTypes: [
                'take_gems',
                'take_gems',
                'take_gems',
                'take_gems',
                'take_gems',
                'take_gems',
                'initiate_buy_joker',
                'buy_card',
            ],
            recordedEvents: 8,
            exportedEvents: 8,
            controllerCurrentStateHash: 'joker-final-hash',
            reviewedFinalStateHash: 'joker-final-hash',
        });
    });

    it('fails closed when Joker release-path does not clear pending buy after buy', () => {
        const { launcherPath, root } = createLauncherFixture({});
        attachJokerReleasePath(launcherPath, {
            pendingBuyClearedAfterBuy: false,
        });
        const result = runSummarizer(launcherPath, path.join(root, 'matrix.json'), [
            '--require-joker-release-path',
        ]);

        expect(result.status).toBe(1);
        expect(result.stderr).toContain(
            'Joker release-path proof did not enter color selection, buy the Joker, and clear pendingBuy.'
        );
    });

    it('passes when launcher args are required and match retained smoke metadata', () => {
        const { launcherPath, root } = createLauncherFixture({});
        const outPath = path.join(root, 'matrix.json');
        const result = runSummarizer(launcherPath, outPath, ['--require-launcher-args']);

        expect(result.status).toBe(0);
        const matrix = JSON.parse(readFileSync(outPath, 'utf8'));
        expect(matrix.check.requireLauncherArgs).toBe(true);
        expect(matrix.reports[0].launcherArgsMatchSmoke).toBe(true);
    });

    it('fails closed when launcher args do not match retained smoke metadata', () => {
        const { launcherPath, root } = createLauncherFixture({});
        const launcher = JSON.parse(readFileSync(launcherPath, 'utf8'));
        const seedIndex = launcher.args.indexOf('--gemduel-smoke-seed');
        launcher.args[seedIndex + 1] = 'wrong-seed';
        writeJson(launcherPath, launcher);
        const result = runSummarizer(launcherPath, path.join(root, 'matrix.json'), [
            '--require-launcher-args',
        ]);

        expect(result.status).toBe(1);
        expect(result.stderr).toContain('Launcher args do not match retained smoke metadata');
        expect(result.stderr).toContain('seed mismatch');
    });

    it('passes when replay review release-path navigation details are required and complete', () => {
        const { launcherPath, root } = createLauncherFixture({});
        attachReplayReviewReleasePath(launcherPath, root);
        const outPath = path.join(root, 'matrix.json');
        const result = runSummarizer(launcherPath, outPath, [
            '--require-replay-review-release-path',
        ]);

        expect(result.status).toBe(0);
        const matrix = JSON.parse(readFileSync(outPath, 'utf8'));
        expect(matrix.summary.replayReviewReleasePathReportCount).toBe(1);
        expect(matrix.summary.replayReviewFinalHashes).toEqual(['review-final']);
        expect(matrix.reports[0].replayReviewReleasePath).toMatchObject({
            enabled: true,
            ok: true,
            exportedEvents: 2,
            finalReviewHash: 'review-final',
            returnedFinalHash: 'review-final',
            sourceHashBeforeReview: 'source-live',
            sourceHashAfterReview: 'source-live',
            sourceRecordedEventsBeforeReview: 2,
            sourceRecordedEventsAfterReview: 2,
            usedVisibleRedoControl: true,
            usedVisibleUndoControl: true,
        });
    });

    it('fails closed when replay review release-path evidence skipped visible review controls', () => {
        const { launcherPath, root } = createLauncherFixture({});
        attachReplayReviewReleasePath(launcherPath, root, {
            usedVisibleUndoControl: false,
        });
        const result = runSummarizer(launcherPath, path.join(root, 'matrix.json'), [
            '--require-replay-review-release-path',
        ]);

        expect(result.status).toBe(1);
        expect(result.stderr).toContain(
            'Replay review release-path proof did not use visible review controls'
        );
    });

    it('fails closed when the captured stdout log is empty', () => {
        const { launcherPath, root } = createLauncherFixture({ stdoutText: '' });
        const result = runSummarizer(launcherPath, path.join(root, 'matrix.json'));

        expect(result.status).toBe(1);
        expect(result.stderr).toContain('Captured stdout log is empty');
    });

    it('fails closed when the retained stdout byte count does not match', () => {
        const { launcherPath, root } = createLauncherFixture({ stdoutBytes: 999 });
        const result = runSummarizer(launcherPath, path.join(root, 'matrix.json'));

        expect(result.status).toBe(1);
        expect(result.stderr).toContain(
            'Captured stdout log byte count does not match the retained file'
        );
    });

    it('fails closed when the captured stderr log is missing', () => {
        const { launcherPath, root } = createLauncherFixture({ writeStderr: false });
        const result = runSummarizer(launcherPath, path.join(root, 'matrix.json'));

        expect(result.status).toBe(1);
        expect(result.stderr).toContain('Captured stderr log path is missing or does not exist');
    });

    it('fails closed when the retained stderr byte count does not match', () => {
        const { launcherPath, root } = createLauncherFixture({
            stderrBytes: 999,
            stderrText: 'stderr\n',
        });
        const result = runSummarizer(launcherPath, path.join(root, 'matrix.json'));

        expect(result.status).toBe(1);
        expect(result.stderr).toContain(
            'Captured stderr log byte count does not match the retained file'
        );
    });

    it('fails closed when the captured Unity player log is empty', () => {
        const { launcherPath, root } = createLauncherFixture({ playerLogText: '' });
        const result = runSummarizer(launcherPath, path.join(root, 'matrix.json'));

        expect(result.status).toBe(1);
        expect(result.stderr).toContain('Captured Unity player log is empty');
    });

    it('fails closed when the nested smoke report is missing', () => {
        const { launcherPath, root } = createLauncherFixture({ writeSmokeReport: false });
        const result = runSummarizer(launcherPath, path.join(root, 'matrix.json'));

        expect(result.status).toBe(1);
        expect(result.stderr).toContain('Nested smoke report file does not exist');
    });

    it('fails closed when the nested smoke report is not valid JSON', () => {
        const { launcherPath, root } = createLauncherFixture({ smokeReportText: '{not-json' });
        const result = runSummarizer(launcherPath, path.join(root, 'matrix.json'));

        expect(result.status).toBe(1);
        expect(result.stderr).toContain('Nested smoke report file is not valid JSON');
    });

    it('fails closed when the nested smoke report does not match the launcher copy', () => {
        const { launcherPath, root } = createLauncherFixture({
            smokeReport: {
                kind: 'unity-built-player-smoke-wrapper',
                ok: true,
                seed: 'different-seed',
            },
        });
        const result = runSummarizer(launcherPath, path.join(root, 'matrix.json'));

        expect(result.status).toBe(1);
        expect(result.stderr).toContain(
            'Nested smoke report JSON does not match launcher embedded smoke report'
        );
    });

    it('fails closed when the retained Unity player log byte count does not match', () => {
        const { launcherPath, root } = createLauncherFixture({ playerLogBytes: 999 });
        const result = runSummarizer(launcherPath, path.join(root, 'matrix.json'));

        expect(result.status).toBe(1);
        expect(result.stderr).toContain(
            'Captured Unity player log byte count does not match the retained file'
        );
    });

    it('fails closed when a retained audit response file is not valid JSON', () => {
        const { launcherPath, root } = createLauncherFixture({});
        writeFileSync(
            path.join(root, 'mailbox', 'responses', 'audit', 'req-1.json'),
            '{not-json',
            'utf8'
        );
        const result = runSummarizer(launcherPath, path.join(root, 'matrix.json'));

        expect(result.status).toBe(1);
        expect(result.stderr).toContain('Mailbox audit response file is not valid JSON');
    });

    it('fails closed when a retained audit response file does not match the launcher event', () => {
        const { launcherPath, root } = createLauncherFixture({
            auditResponse: { ok: true, actionType: 'DISCARD_GEM' },
        });
        const result = runSummarizer(launcherPath, path.join(root, 'matrix.json'));

        expect(result.status).toBe(1);
        expect(result.stderr).toContain(
            'Mailbox audit response summary does not match launcher event'
        );
    });
});
