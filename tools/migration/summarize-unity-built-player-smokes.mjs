import { createHash } from 'node:crypto';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const currentFile = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(currentFile), '..', '..');
const defaultOutputDir = path.join(repoRoot, 'artifacts', 'unity', 'built-player-smoke');
const expectedWindowsBuildDir = path.join(repoRoot, 'artifacts', 'unity', 'build', 'windows');
const defaultDateSlug = new Date().toISOString().slice(0, 10).replaceAll('-', '');

const usage = `Usage:
  node tools/migration/summarize-unity-built-player-smokes.mjs [--check] [--out <file>] [--require-report-count <count>] [--require-unique-report-paths] [--require-unique-smoke-report-paths] [--require-unique-log-paths] [--require-family <family>] [--require-game-over-count <count>] [--require-game-over-winner <winner>] [--require-audited-mailbox-responses] [--require-audited-mailbox-response-digests] [--require-audited-mailbox-response-digest-count <count>] [--require-launcher-args] [--require-draft-release-path] [--require-replay-release-path] [--require-replay-release-path-no-mutation] [--require-recovery-release-path] [--require-settings-release-path] [--require-chrome-release-path] [--require-replay-review-release-path] [--require-invalid-action-release-path] [--require-peek-modal-release-path] [--require-recovery-invalid-action-release-path] [--require-privilege-cancel-release-path] [--require-reserved-discard-release-path] [--require-reserved-buy-release-path] [--require-reserve-cancel-release-path] [--require-reserve-deck-release-path] [--require-reserve-deck-cancel-release-path] [--require-joker-release-path] <launcher-report...>

Aggregates built Windows player smoke launcher JSON reports and validates that each report proves
fresh LocalDev Local PvP gameplay, live replay recording, and export/import/review hash stability.
The output remains incomplete evidence by design; it does not mark Unity replacement-candidate
readiness complete.
`;

const toRepoPath = (filePath) => {
    if (!filePath || typeof filePath !== 'string') {
        return null;
    }

    const absolute = path.isAbsolute(filePath) ? filePath : path.resolve(repoRoot, filePath);
    return path.relative(repoRoot, absolute).replaceAll(path.sep, '/');
};

const sha256 = (buffer) => createHash('sha256').update(buffer).digest('hex');

const resolveFromRepo = (filePath) => {
    if (!filePath || typeof filePath !== 'string') {
        return null;
    }

    return path.isAbsolute(filePath) ? filePath : path.resolve(repoRoot, filePath);
};

const uniqueSorted = (values) =>
    [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b));

const duplicatePaths = (paths) => {
    const pathCounts = new Map();
    for (const filePath of paths.filter(Boolean)) {
        const key = process.platform === 'win32' ? filePath.toLowerCase() : filePath;
        const previous = pathCounts.get(key);
        pathCounts.set(key, {
            path: previous?.path ?? filePath,
            count: (previous?.count ?? 0) + 1,
        });
    }

    return [...pathCounts.values()]
        .filter((entry) => entry.count > 1)
        .map((entry) => entry.path)
        .sort((a, b) => a.localeCompare(b));
};

const isPathInside = (candidatePath, parentPath) => {
    if (!candidatePath || !parentPath) {
        return false;
    }

    const relative = path.relative(parentPath, candidatePath);
    return (
        relative === '' || (!!relative && !relative.startsWith('..') && !path.isAbsolute(relative))
    );
};

const isExistingFile = (filePath) => {
    if (!filePath) {
        return false;
    }

    try {
        return statSync(filePath).isFile();
    } catch {
        return false;
    }
};

const fileSize = (filePath) => {
    if (!filePath) {
        return null;
    }

    try {
        return statSync(filePath).size;
    } catch {
        return null;
    }
};

const stableStringify = (value) => {
    if (Array.isArray(value)) {
        return `[${value.map((entry) => stableStringify(entry)).join(',')}]`;
    }

    if (value && typeof value === 'object') {
        return `{${Object.keys(value)
            .sort((a, b) => a.localeCompare(b))
            .map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`)
            .join(',')}}`;
    }

    return JSON.stringify(value);
};

const collectFailureReasons = (sources) =>
    sources
        .map(([source, reason]) => ({
            source,
            reason: typeof reason === 'string' ? reason.trim() : '',
        }))
        .filter((entry) => entry.reason.length > 0);

const getArgValue = (args, flag) => {
    const index = args.indexOf(flag);
    if (index === -1 || index + 1 >= args.length) {
        return null;
    }

    return args[index + 1];
};

const pathsMatch = (left, right) => {
    const leftRepoPath = toRepoPath(left);
    const rightRepoPath = toRepoPath(right);
    return leftRepoPath !== null && rightRepoPath !== null && leftRepoPath === rightRepoPath;
};

const validateLauncherArgs = (launcher, wrapper) => {
    const failures = [];
    const args = Array.isArray(launcher?.args) ? launcher.args : null;
    const smoke = wrapper?.smoke;
    if (!args) {
        return {
            ok: false,
            failures: ['Launcher args are missing or not an array.'],
        };
    }

    const requireFlag = (flag) => {
        if (!args.includes(flag)) {
            failures.push(`Launcher args are missing ${flag}.`);
        }
    };
    const requireValue = (flag, expected, label) => {
        if (expected === undefined || expected === null) {
            return;
        }

        const actual = getArgValue(args, flag);
        if (actual !== String(expected)) {
            failures.push(`Launcher args ${label} mismatch: expected ${expected}, got ${actual}.`);
        }
    };
    const requirePathValue = (flag, expected, label) => {
        if (expected === undefined || expected === null) {
            return;
        }

        const actual = getArgValue(args, flag);
        if (!pathsMatch(actual, expected)) {
            failures.push(
                `Launcher args ${label} path mismatch: expected ${toRepoPath(expected)}, got ${toRepoPath(actual)}.`
            );
        }
    };
    const requireBooleanFlag = (flag, expected, label) => {
        const actual = args.includes(flag);
        if (actual !== expected) {
            failures.push(
                `Launcher args ${label} flag mismatch: expected ${expected}, got ${actual}.`
            );
        }
    };

    requireFlag('-batchmode');
    requireFlag('-nographics');
    requireFlag('--gemduel-built-player-smoke');
    requirePathValue('-logFile', launcher?.paths?.playerLog, 'player log');
    requirePathValue('--gemduel-smoke-report', launcher?.paths?.smokeReport, 'smoke report');
    requireValue('--gemduel-smoke-seed', wrapper?.seed ?? smoke?.seed, 'seed');
    requireValue('--gemduel-smoke-max-steps', wrapper?.maxSteps ?? smoke?.maxSteps, 'max steps');
    requireValue(
        '--gemduel-smoke-start-mode',
        wrapper?.startMode ?? smoke?.startMode,
        'start mode'
    );
    requireValue(
        '--gemduel-smoke-idle-action-preference',
        wrapper?.idleActionPreference ?? smoke?.idleActionPreference,
        'idle action preference'
    );
    requireValue(
        '--gemduel-smoke-draft-action-preference',
        wrapper?.draftActionPreference ?? smoke?.draftActionPreference,
        'draft action preference'
    );

    const booleanFlags = [
        ['--gemduel-smoke-include-replay-release-path', 'includeReplayReleasePath'],
        ['--gemduel-smoke-include-recovery-release-path', 'includeRecoveryReleasePath'],
        ['--gemduel-smoke-include-settings-release-path', 'includeSettingsReleasePath'],
        ['--gemduel-smoke-include-chrome-release-path', 'includeChromeReleasePath'],
        ['--gemduel-smoke-include-replay-review-release-path', 'includeReplayReviewReleasePath'],
        ['--gemduel-smoke-include-invalid-action-release-path', 'includeInvalidActionReleasePath'],
        ['--gemduel-smoke-include-peek-modal-release-path', 'includePeekModalReleasePath'],
        [
            '--gemduel-smoke-include-recovery-invalid-action-release-path',
            'includeRecoveryInvalidActionReleasePath',
        ],
        [
            '--gemduel-smoke-include-privilege-cancel-release-path',
            'includePrivilegeCancelReleasePath',
        ],
        [
            '--gemduel-smoke-include-reserved-discard-release-path',
            'includeReservedDiscardReleasePath',
        ],
        ['--gemduel-smoke-include-reserved-buy-release-path', 'includeReservedBuyReleasePath'],
        ['--gemduel-smoke-include-reserve-cancel-release-path', 'includeReserveCancelReleasePath'],
        ['--gemduel-smoke-include-reserve-deck-release-path', 'includeReserveDeckReleasePath'],
        [
            '--gemduel-smoke-include-reserve-deck-cancel-release-path',
            'includeReserveDeckCancelReleasePath',
        ],
        ['--gemduel-smoke-include-joker-release-path', 'includeJokerReleasePath'],
    ];
    for (const [flag, key] of booleanFlags) {
        requireBooleanFlag(flag, wrapper?.[key] === true, key);
    }
    requirePathValue(
        '--gemduel-smoke-replay-release-dir',
        wrapper?.includeReplayReleasePath === true ? launcher?.paths?.replayReleasePathDir : null,
        'replay release directory'
    );
    requirePathValue(
        '--gemduel-smoke-replay-review-release-dir',
        wrapper?.includeReplayReviewReleasePath === true
            ? launcher?.paths?.replayReviewReleasePathDir
            : null,
        'replay review release directory'
    );

    return {
        ok: failures.length === 0,
        failures,
    };
};

const readNestedSmokeReportSummary = (launcher) => {
    const smokeReportPath =
        typeof launcher?.paths?.smokeReport === 'string'
            ? resolveFromRepo(launcher.paths.smokeReport)
            : null;

    if (!smokeReportPath) {
        return {
            path: null,
            exists: false,
            validJson: false,
            matchesLauncherSmoke: false,
            failure: 'Nested smoke report path is missing.',
        };
    }

    if (!isExistingFile(smokeReportPath)) {
        return {
            path: smokeReportPath,
            exists: false,
            validJson: false,
            matchesLauncherSmoke: false,
            failure: 'Nested smoke report file does not exist.',
        };
    }

    try {
        const parsed = JSON.parse(readFileSync(smokeReportPath, 'utf8'));
        const matchesLauncherSmoke = stableStringify(parsed) === stableStringify(launcher?.smoke);
        return {
            path: smokeReportPath,
            exists: true,
            validJson: true,
            matchesLauncherSmoke,
            failure: matchesLauncherSmoke
                ? null
                : 'Nested smoke report JSON does not match launcher embedded smoke report.',
        };
    } catch (error) {
        return {
            path: smokeReportPath,
            exists: true,
            validJson: false,
            matchesLauncherSmoke: false,
            failure: `Nested smoke report file is not valid JSON: ${
                error instanceof Error ? error.message : String(error)
            }`,
        };
    }
};

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
const requiredReplayRejectedImportCases = requiredReplayReleasePathCoverage.filter(
    (entry) => entry !== 'valid_overwrite_reload_review'
);

const expectedSettings = {
    locale: 'en',
    theme: 'dark',
    surfaceTheme: 'pearl-opaline',
    soundEnabled: false,
    lanShowOpponentPlayerZoneCards: false,
    lanShowOpponentGems: false,
};

const parseArgs = () => {
    const args = process.argv.slice(2);
    const reports = [];
    const requiredFamilies = [];
    const requiredGameOverWinners = [];
    let requiredReportCount = 0;
    let requiredGameOverCount = 0;
    let check = false;
    let requireUniqueReportPaths = false;
    let requireUniqueSmokeReportPaths = false;
    let requireUniqueLogPaths = false;
    let requireAuditedMailboxResponses = false;
    let requireAuditedMailboxResponseDigests = false;
    let requiredAuditedMailboxResponseDigestCount = 0;
    let requireLauncherArgs = false;
    let requireDraftReleasePath = false;
    let requireRecoveryReleasePath = false;
    let requireReplayReleasePath = false;
    let requireReplayReleasePathNoMutation = false;
    let requireSettingsReleasePath = false;
    let requireChromeReleasePath = false;
    let requireReplayReviewReleasePath = false;
    let requireInvalidActionReleasePath = false;
    let requirePeekModalReleasePath = false;
    let requireRecoveryInvalidActionReleasePath = false;
    let requirePrivilegeCancelReleasePath = false;
    let requireReservedDiscardReleasePath = false;
    let requireReservedBuyReleasePath = false;
    let requireReserveCancelReleasePath = false;
    let requireReserveDeckReleasePath = false;
    let requireReserveDeckCancelReleasePath = false;
    let requireJokerReleasePath = false;
    let out = path.join(defaultOutputDir, `built-player-smoke-matrix-${defaultDateSlug}.json`);

    for (let index = 0; index < args.length; index += 1) {
        const arg = args[index];
        if (arg === '--help' || arg === '-h') {
            process.stdout.write(usage);
            process.exit(0);
        }

        if (arg === '--check') {
            check = true;
            continue;
        }

        if (arg === '--require-recovery-release-path') {
            requireRecoveryReleasePath = true;
            continue;
        }

        if (arg === '--require-audited-mailbox-responses') {
            requireAuditedMailboxResponses = true;
            continue;
        }

        if (arg === '--require-audited-mailbox-response-digests') {
            requireAuditedMailboxResponseDigests = true;
            requireAuditedMailboxResponses = true;
            continue;
        }

        if (arg === '--require-audited-mailbox-response-digest-count') {
            const next = args[index + 1];
            const parsed = Number.parseInt(next ?? '', 10);
            if (!Number.isInteger(parsed) || parsed <= 0) {
                throw new Error(
                    '--require-audited-mailbox-response-digest-count requires a positive integer.'
                );
            }

            requiredAuditedMailboxResponseDigestCount = parsed;
            requireAuditedMailboxResponses = true;
            index += 1;
            continue;
        }

        if (arg === '--require-launcher-args') {
            requireLauncherArgs = true;
            continue;
        }

        if (arg === '--require-draft-release-path') {
            requireDraftReleasePath = true;
            continue;
        }

        if (arg === '--require-replay-release-path') {
            requireReplayReleasePath = true;
            continue;
        }

        if (arg === '--require-replay-release-path-no-mutation') {
            requireReplayReleasePath = true;
            requireReplayReleasePathNoMutation = true;
            continue;
        }

        if (arg === '--require-settings-release-path') {
            requireSettingsReleasePath = true;
            continue;
        }

        if (arg === '--require-chrome-release-path') {
            requireChromeReleasePath = true;
            continue;
        }

        if (arg === '--require-replay-review-release-path') {
            requireReplayReviewReleasePath = true;
            continue;
        }

        if (arg === '--require-invalid-action-release-path') {
            requireInvalidActionReleasePath = true;
            continue;
        }

        if (arg === '--require-peek-modal-release-path') {
            requirePeekModalReleasePath = true;
            continue;
        }

        if (arg === '--require-recovery-invalid-action-release-path') {
            requireRecoveryInvalidActionReleasePath = true;
            continue;
        }

        if (arg === '--require-privilege-cancel-release-path') {
            requirePrivilegeCancelReleasePath = true;
            continue;
        }

        if (arg === '--require-reserved-discard-release-path') {
            requireReservedDiscardReleasePath = true;
            continue;
        }

        if (arg === '--require-reserved-buy-release-path') {
            requireReservedBuyReleasePath = true;
            continue;
        }

        if (arg === '--require-reserve-cancel-release-path') {
            requireReserveCancelReleasePath = true;
            continue;
        }

        if (arg === '--require-reserve-deck-release-path') {
            requireReserveDeckReleasePath = true;
            continue;
        }

        if (arg === '--require-reserve-deck-cancel-release-path') {
            requireReserveDeckCancelReleasePath = true;
            continue;
        }

        if (arg === '--require-joker-release-path') {
            requireJokerReleasePath = true;
            continue;
        }

        if (arg === '--out') {
            const next = args[index + 1];
            if (!next || next.startsWith('--')) {
                throw new Error('--out requires a file path.');
            }

            out = path.isAbsolute(next) ? next : path.resolve(repoRoot, next);
            index += 1;
            continue;
        }

        if (arg === '--require-family') {
            const next = args[index + 1];
            if (!next || next.startsWith('--')) {
                throw new Error('--require-family requires an action family.');
            }

            for (const family of next.split(',')) {
                const trimmed = family.trim();
                if (trimmed) {
                    requiredFamilies.push(trimmed);
                }
            }
            index += 1;
            continue;
        }

        if (arg === '--require-report-count') {
            const next = args[index + 1];
            const parsed = Number.parseInt(next ?? '', 10);
            if (!Number.isInteger(parsed) || parsed <= 0) {
                throw new Error('--require-report-count requires a positive integer.');
            }

            requiredReportCount = parsed;
            index += 1;
            continue;
        }

        if (arg === '--require-unique-report-paths') {
            requireUniqueReportPaths = true;
            continue;
        }

        if (arg === '--require-unique-smoke-report-paths') {
            requireUniqueSmokeReportPaths = true;
            continue;
        }

        if (arg === '--require-unique-log-paths') {
            requireUniqueLogPaths = true;
            continue;
        }

        if (arg === '--require-game-over-count') {
            const next = args[index + 1];
            const parsed = Number.parseInt(next ?? '', 10);
            if (!Number.isInteger(parsed) || parsed <= 0) {
                throw new Error('--require-game-over-count requires a positive integer.');
            }

            requiredGameOverCount = parsed;
            index += 1;
            continue;
        }

        if (arg === '--require-game-over-winner') {
            const next = args[index + 1];
            if (!next || next.startsWith('--')) {
                throw new Error('--require-game-over-winner requires a winner.');
            }

            for (const winner of next.split(',')) {
                const trimmed = winner.trim();
                if (trimmed) {
                    requiredGameOverWinners.push(trimmed);
                }
            }
            index += 1;
            continue;
        }

        if (arg.startsWith('--')) {
            throw new Error(`Unknown option: ${arg}`);
        }

        reports.push(path.isAbsolute(arg) ? arg : path.resolve(repoRoot, arg));
    }

    return {
        check,
        out,
        reports,
        requiredFamilies: uniqueSorted(requiredFamilies),
        requiredReportCount,
        requireUniqueReportPaths,
        requireUniqueSmokeReportPaths,
        requireUniqueLogPaths,
        requiredGameOverCount,
        requiredGameOverWinners: uniqueSorted(requiredGameOverWinners),
        requireAuditedMailboxResponses,
        requireAuditedMailboxResponseDigests,
        requiredAuditedMailboxResponseDigestCount,
        requireLauncherArgs,
        requireDraftReleasePath,
        requireReplayReleasePath,
        requireReplayReleasePathNoMutation,
        requireRecoveryReleasePath,
        requireSettingsReleasePath,
        requireChromeReleasePath,
        requireReplayReviewReleasePath,
        requireInvalidActionReleasePath,
        requirePeekModalReleasePath,
        requireRecoveryInvalidActionReleasePath,
        requirePrivilegeCancelReleasePath,
        requireReservedDiscardReleasePath,
        requireReservedBuyReleasePath,
        requireReserveCancelReleasePath,
        requireReserveDeckReleasePath,
        requireReserveDeckCancelReleasePath,
        requireJokerReleasePath,
    };
};

const readJson = async (filePath) => {
    const text = await readFile(filePath, 'utf8');
    return JSON.parse(text);
};

const assertCondition = (failures, condition, message) => {
    if (!condition) {
        failures.push(message);
    }
};

const expectedBridgeRejectionCodes = new Set([
    'COMMAND_REJECTED',
    'INVALID_ACTOR',
    'NO_REPLAY_STATE_CHANGE',
]);

const resolveBridgeMailboxPath = (launcher) => {
    const mailboxDir =
        typeof launcher?.paths?.bridgeMailbox === 'string'
            ? launcher.paths.bridgeMailbox
            : launcher?.environment?.mailboxDir;

    return typeof mailboxDir === 'string' && mailboxDir.length > 0
        ? resolveFromRepo(mailboxDir)
        : null;
};

const resolveAuditResponsePath = (launcher, event) => {
    if (typeof event?.auditResponse !== 'string' || event.auditResponse.length === 0) {
        return null;
    }

    if (path.isAbsolute(event.auditResponse)) {
        return event.auditResponse;
    }

    const mailboxDir = resolveBridgeMailboxPath(launcher);
    if (!mailboxDir) {
        return null;
    }

    return path.resolve(mailboxDir, event.auditResponse);
};

const readAuditResponseSummary = (launcher, event) => {
    const auditResponsePath = resolveAuditResponsePath(launcher, event);
    const mailboxDir = resolveBridgeMailboxPath(launcher);
    const requestFileName =
        typeof event?.request === 'string' ? path.basename(event.request) : null;
    const responseFileName = auditResponsePath ? path.basename(auditResponsePath) : null;
    if (!auditResponsePath) {
        return {
            ok: false,
            path: null,
            underBridgeMailbox: false,
            matchesRequestName: false,
            failure: `Mailbox event ${event?.request ?? '<unknown>'} is missing an audit-response path.`,
        };
    }

    if (!isPathInside(auditResponsePath, mailboxDir)) {
        return {
            ok: false,
            path: auditResponsePath,
            underBridgeMailbox: false,
            matchesRequestName: requestFileName !== null && responseFileName === requestFileName,
            failure: `Mailbox audit response path is not under the bridge mailbox directory: ${toRepoPath(auditResponsePath)}.`,
        };
    }

    if (!requestFileName || responseFileName !== requestFileName) {
        return {
            ok: false,
            path: auditResponsePath,
            underBridgeMailbox: true,
            matchesRequestName: false,
            failure: `Mailbox audit response file name does not match launcher request ${event?.request ?? '<unknown>'}: ${toRepoPath(auditResponsePath)}.`,
        };
    }

    if (!existsSync(auditResponsePath)) {
        return {
            ok: false,
            path: auditResponsePath,
            underBridgeMailbox: true,
            matchesRequestName: true,
            failure: `Mailbox audit response file does not exist: ${toRepoPath(auditResponsePath)}.`,
        };
    }

    try {
        const auditResponseBuffer = readFileSync(auditResponsePath);
        const auditResponseText = auditResponseBuffer.toString('utf8');
        const auditResponseBytes = auditResponseBuffer.byteLength;
        const auditResponseSha256 = sha256(auditResponseBuffer);
        const reportedAuditResponseBytes = Number(event?.auditResponseBytes ?? NaN);
        const reportedAuditResponseSha256 =
            typeof event?.auditResponseSha256 === 'string' ? event.auditResponseSha256 : null;
        const hasAuditResponseDigest =
            Number.isFinite(reportedAuditResponseBytes) || reportedAuditResponseSha256 !== null;
        const matchesAuditResponseDigest =
            Number.isFinite(reportedAuditResponseBytes) &&
            reportedAuditResponseBytes === auditResponseBytes &&
            reportedAuditResponseSha256 === auditResponseSha256;
        const response = JSON.parse(auditResponseText);
        const responseOk = response?.ok === true;
        const responseActionType = response?.actionType ?? null;
        const rejectionCode = response?.rejection?.code ?? null;
        const matchesEvent =
            event?.responseOk === responseOk &&
            (event?.responseActionType ?? null) === responseActionType &&
            (event?.rejectionCode ?? null) === rejectionCode;
        const ok = matchesEvent && (!hasAuditResponseDigest || matchesAuditResponseDigest);

        return {
            ok,
            path: auditResponsePath,
            underBridgeMailbox: true,
            matchesRequestName: true,
            matchesAuditResponseDigest,
            auditResponseBytes,
            reportedAuditResponseBytes: Number.isFinite(reportedAuditResponseBytes)
                ? reportedAuditResponseBytes
                : null,
            auditResponseSha256,
            reportedAuditResponseSha256,
            responseOk,
            responseActionType,
            rejectionCode,
            failure: matchesEvent
                ? hasAuditResponseDigest && !matchesAuditResponseDigest
                    ? `Mailbox audit response digest does not match launcher event for ${event?.request ?? '<unknown>'}.`
                    : null
                : `Mailbox audit response summary does not match launcher event for ${event?.request ?? '<unknown>'}.`,
        };
    } catch (error) {
        return {
            ok: false,
            path: auditResponsePath,
            underBridgeMailbox: true,
            matchesRequestName: true,
            failure: `Mailbox audit response file is not valid JSON: ${toRepoPath(auditResponsePath)} (${error instanceof Error ? error.message : String(error)}).`,
        };
    }
};

const allMailboxEventsPassed = (events, options = {}) =>
    Array.isArray(events) &&
    events.length > 0 &&
    (() => {
        let remainingExpectedRejections = Number(options.expectedRejectionCount ?? 0);
        return events.every((event) => {
            const hasAuditResponse =
                typeof event?.auditResponse === 'string' && event.auditResponse.length > 0;
            if (event?.exitCode === 0) {
                return options.requireAuditedMailboxResponses === true
                    ? hasAuditResponse && event?.responseOk === true
                    : true;
            }

            if (
                options.allowExpectedRejections === true &&
                event?.exitCode === 2 &&
                remainingExpectedRejections > 0
            ) {
                const hasStructuredRejection =
                    event?.responseOk === false &&
                    expectedBridgeRejectionCodes.has(event?.rejectionCode);
                const responseWasConsumedBeforeSummary =
                    event?.responseOk === false &&
                    event?.rejectionCode === 'BRIDGE_EXECUTION_FAILED';
                const responseAccepted =
                    options.requireAuditedMailboxResponses === true
                        ? hasAuditResponse && hasStructuredRejection
                        : hasStructuredRejection || responseWasConsumedBeforeSummary;
                if (responseAccepted) {
                    remainingExpectedRejections -= 1;
                    return true;
                }
            }

            return false;
        });
    })();

const settingsMatchExpected = (settings) =>
    !!settings && Object.entries(expectedSettings).every(([key, value]) => settings[key] === value);

const validateReport = (filePath, launcher, options = {}) => {
    const failures = [];
    const wrapper = launcher?.smoke;
    const smoke = wrapper?.smoke;
    const actions = Array.isArray(smoke?.actions) ? smoke.actions : [];
    const productState = smoke?.productStateSummary;
    const replayHashes = smoke?.replayHashSummary;
    const replayReview = smoke?.replayReview;
    const replayReleasePath = wrapper?.replayReleasePath;
    const recoveryReleasePath = wrapper?.recoveryReleasePath;
    const settingsReleasePath = wrapper?.settingsReleasePath;
    const chromeReleasePath = wrapper?.chromeReleasePath;
    const replayReviewReleasePath = wrapper?.replayReviewReleasePath;
    const invalidActionReleasePath = wrapper?.invalidActionReleasePath;
    const peekModalReleasePath = wrapper?.peekModalReleasePath;
    const recoveryInvalidActionReleasePath = wrapper?.recoveryInvalidActionReleasePath;
    const privilegeCancelReleasePath = wrapper?.privilegeCancelReleasePath;
    const reservedDiscardReleasePath = wrapper?.reservedDiscardReleasePath;
    const reservedBuyReleasePath = wrapper?.reservedBuyReleasePath;
    const reserveCancelReleasePath = wrapper?.reserveCancelReleasePath;
    const reserveDeckReleasePath = wrapper?.reserveDeckReleasePath;
    const reserveDeckCancelReleasePath = wrapper?.reserveDeckCancelReleasePath;
    const jokerReleasePath = wrapper?.jokerReleasePath;
    const privilegeCancelActions = Array.isArray(privilegeCancelReleasePath?.actions)
        ? privilegeCancelReleasePath.actions
        : [];
    const reservedDiscardActions = Array.isArray(reservedDiscardReleasePath?.actions)
        ? reservedDiscardReleasePath.actions
        : [];
    const reservedBuyActions = Array.isArray(reservedBuyReleasePath?.actions)
        ? reservedBuyReleasePath.actions
        : [];
    const reserveCancelActions = Array.isArray(reserveCancelReleasePath?.actions)
        ? reserveCancelReleasePath.actions
        : [];
    const reserveDeckActions = Array.isArray(reserveDeckReleasePath?.actions)
        ? reserveDeckReleasePath.actions
        : [];
    const reserveDeckCancelActions = Array.isArray(reserveDeckCancelReleasePath?.actions)
        ? reserveDeckCancelReleasePath.actions
        : [];
    const jokerActions = Array.isArray(jokerReleasePath?.actions) ? jokerReleasePath.actions : [];
    const actionFamilies = uniqueSorted([
        ...actions.map((action) => action?.family),
        ...privilegeCancelActions.map((action) => action?.family),
        ...reservedDiscardActions.map((action) => action?.family),
        ...reservedBuyActions.map((action) => action?.family),
        ...reserveCancelActions.map((action) => action?.family),
        ...reserveDeckActions.map((action) => action?.family),
        ...reserveDeckCancelActions.map((action) => action?.family),
        ...jokerActions.map((action) => action?.family),
    ]);
    const invalidActionCases = Array.isArray(invalidActionReleasePath?.cases)
        ? invalidActionReleasePath.cases
        : [];
    const recoveryInvalidActionCases = Array.isArray(recoveryInvalidActionReleasePath?.cases)
        ? recoveryInvalidActionReleasePath.cases
        : [];
    const expectedBridgeRejectionCount =
        invalidActionCases.length + recoveryInvalidActionCases.length;
    const allowExpectedBridgeRejections =
        wrapper?.includeInvalidActionReleasePath === true ||
        wrapper?.includeRecoveryInvalidActionReleasePath === true;
    const replayReleasePathCoverage = Array.isArray(replayReleasePath?.coverage)
        ? replayReleasePath.coverage.filter((entry) => typeof entry === 'string')
        : [];
    const replayReleasePathCases = Array.isArray(replayReleasePath?.cases)
        ? replayReleasePath.cases
        : [];
    const mailboxEvents = Array.isArray(launcher?.bridgeMailboxEvents)
        ? launcher.bridgeMailboxEvents
        : [];
    const mailboxAuditResponses = mailboxEvents.map((event) =>
        readAuditResponseSummary(launcher, event)
    );
    const validMailboxAuditResponseCount = mailboxAuditResponses.filter(
        (entry) => entry.ok === true
    ).length;
    const validMailboxAuditResponseDigestCount = mailboxAuditResponses.filter(
        (entry) => entry.matchesAuditResponseDigest === true
    ).length;
    const mailboxAuditResponseFailures = mailboxAuditResponses
        .map((entry) => entry.failure)
        .filter(Boolean);
    const auditedMailboxResponseCount = mailboxEvents.filter(
        (event) => typeof event?.auditResponse === 'string' && event.auditResponse.length > 0
    ).length;
    const successfulMailboxResponseCount = mailboxEvents.filter(
        (event) => event?.responseOk === true
    ).length;
    const finalHash = productState?.stateHash;
    const controllerHash = replayHashes?.controllerCurrentStateHash;
    const exportedHash = replayHashes?.exportedSummaryFinalStateHash;
    const reviewedHash = replayReview?.reviewedFinalStateHash;
    const recordedEvents = Number(productState?.recordedEvents ?? NaN);
    const exportedEvents = Number(replayHashes?.exportedEvents ?? NaN);
    const lastRecordedEvents = Number(actions.at(-1)?.recordedEvents ?? NaN);
    const draftReleasePathEnabled =
        wrapper?.startMode === 'roguelike' &&
        smoke?.startMode === 'roguelike' &&
        wrapper?.draftActionPreference === 'reroll-each-player-first' &&
        smoke?.draftActionPreference === 'reroll-each-player-first';
    const draftReleasePathActions = actions.slice(0, 4);
    const draftReleasePathFamilies = draftReleasePathActions.map((action) => action?.family);
    const expectedDraftReleasePathFamilies = [
        'reroll_draft_pool',
        'choose_boon',
        'reroll_draft_pool',
        'choose_boon',
    ];
    const launcherReportPath = resolveFromRepo(filePath);
    const executablePath = resolveFromRepo(launcher?.exe);
    const executableExists = isExistingFile(executablePath);
    const executableUnderWindowsBuild = isPathInside(executablePath, expectedWindowsBuildDir);
    const stdoutPath = resolveFromRepo(launcher?.paths?.stdout);
    const stdoutBytes = fileSize(stdoutPath);
    const reportedStdoutBytes = Number(launcher?.stdoutBytes ?? NaN);
    const stderrPath = resolveFromRepo(launcher?.paths?.stderr);
    const stderrBytes = fileSize(stderrPath);
    const reportedStderrBytes = Number(launcher?.stderrBytes ?? NaN);
    const playerLogPath = resolveFromRepo(launcher?.paths?.playerLog);
    const playerLogBytes = fileSize(playerLogPath);
    const reportedPlayerLogBytes = Number(launcher?.playerLogBytes ?? NaN);
    const nestedSmokeReport = readNestedSmokeReportSummary(launcher);
    const bridgeMailboxPath = resolveBridgeMailboxPath(launcher);
    const launcherArgsSummary = validateLauncherArgs(launcher, wrapper);
    const failureReasons = collectFailureReasons([
        ['launcher', launcher?.failureReason],
        ['wrapper', wrapper?.failureReason],
        ['product-surface smoke', smoke?.failureReason],
        ['replay release path', replayReleasePath?.failureReason],
        ['recovery release path', recoveryReleasePath?.failureReason],
        ['settings release path', settingsReleasePath?.failureReason],
        ['chrome release path', chromeReleasePath?.failureReason],
        ['replay-review release path', replayReviewReleasePath?.failureReason],
        ['invalid-action release path', invalidActionReleasePath?.failureReason],
        ['peek-modal release path', peekModalReleasePath?.failureReason],
        ['recovery invalid-action release path', recoveryInvalidActionReleasePath?.failureReason],
        ['privilege-cancel release path', privilegeCancelReleasePath?.failureReason],
        ['reserved-discard release path', reservedDiscardReleasePath?.failureReason],
        ['reserved-buy release path', reservedBuyReleasePath?.failureReason],
        ['reserve-cancel release path', reserveCancelReleasePath?.failureReason],
        ['reserve-deck release path', reserveDeckReleasePath?.failureReason],
        ['reserve-deck-cancel release path', reserveDeckCancelReleasePath?.failureReason],
        ['joker release path', jokerReleasePath?.failureReason],
    ]);

    assertCondition(
        failures,
        launcher?.kind === 'unity-built-player-smoke-launcher',
        'Launcher report kind is not unity-built-player-smoke-launcher.'
    );
    assertCondition(
        failures,
        isPathInside(launcherReportPath, defaultOutputDir),
        'Launcher report path is not under artifacts/unity/built-player-smoke.'
    );
    assertCondition(failures, launcher?.ok === true, 'Launcher report ok is not true.');
    assertCondition(
        failures,
        failureReasons.length === 0,
        `Passing built-player report retains failure reason(s): ${failureReasons
            .map((entry) => `${entry.source}: ${entry.reason}`)
            .join(' | ')}`
    );
    assertCondition(failures, launcher?.exitCode === 0, 'Built player exitCode is not 0.');
    assertCondition(failures, launcher?.timedOut === false, 'Built player smoke timed out.');
    assertCondition(
        failures,
        typeof launcher?.exe === 'string' && executableExists,
        'Built player executable path is missing or does not exist.'
    );
    assertCondition(
        failures,
        executableUnderWindowsBuild,
        'Built player executable path is not under artifacts/unity/build/windows.'
    );
    assertCondition(
        failures,
        typeof launcher?.paths?.stdout === 'string' && stdoutBytes !== null,
        'Captured stdout log path is missing or does not exist.'
    );
    assertCondition(
        failures,
        isPathInside(stdoutPath, defaultOutputDir),
        'Captured stdout log path is not under artifacts/unity/built-player-smoke.'
    );
    assertCondition(failures, Number(stdoutBytes ?? 0) > 0, 'Captured stdout log is empty.');
    assertCondition(
        failures,
        Number.isFinite(reportedStdoutBytes) && reportedStdoutBytes === stdoutBytes,
        'Captured stdout log byte count does not match the retained file.'
    );
    assertCondition(
        failures,
        typeof launcher?.paths?.stderr === 'string' && stderrBytes !== null,
        'Captured stderr log path is missing or does not exist.'
    );
    assertCondition(
        failures,
        isPathInside(stderrPath, defaultOutputDir),
        'Captured stderr log path is not under artifacts/unity/built-player-smoke.'
    );
    assertCondition(
        failures,
        Number.isFinite(reportedStderrBytes) && reportedStderrBytes === stderrBytes,
        'Captured stderr log byte count does not match the retained file.'
    );
    assertCondition(
        failures,
        typeof launcher?.paths?.playerLog === 'string' && playerLogBytes !== null,
        'Captured Unity player log path is missing or does not exist.'
    );
    assertCondition(
        failures,
        isPathInside(playerLogPath, defaultOutputDir),
        'Captured Unity player log path is not under artifacts/unity/built-player-smoke.'
    );
    assertCondition(
        failures,
        isPathInside(nestedSmokeReport.path, defaultOutputDir),
        'Nested smoke report path is not under artifacts/unity/built-player-smoke.'
    );
    assertCondition(
        failures,
        isPathInside(bridgeMailboxPath, defaultOutputDir),
        'Bridge mailbox path is not under artifacts/unity/built-player-smoke.'
    );
    assertCondition(
        failures,
        nestedSmokeReport.exists === true,
        nestedSmokeReport.failure ?? 'Nested smoke report path is missing or does not exist.'
    );
    assertCondition(
        failures,
        nestedSmokeReport.validJson === true,
        nestedSmokeReport.failure ?? 'Nested smoke report file is not valid JSON.'
    );
    assertCondition(
        failures,
        nestedSmokeReport.matchesLauncherSmoke === true,
        nestedSmokeReport.failure ??
            'Nested smoke report JSON does not match launcher embedded smoke report.'
    );
    if (options.requireLauncherArgs === true) {
        assertCondition(
            failures,
            launcherArgsSummary.ok === true,
            `Launcher args do not match retained smoke metadata: ${launcherArgsSummary.failures.join(' ')}`
        );
    }
    assertCondition(
        failures,
        Number(playerLogBytes ?? 0) > 0,
        'Captured Unity player log is empty.'
    );
    assertCondition(
        failures,
        Number.isFinite(reportedPlayerLogBytes) && reportedPlayerLogBytes === playerLogBytes,
        'Captured Unity player log byte count does not match the retained file.'
    );
    assertCondition(
        failures,
        allMailboxEventsPassed(mailboxEvents, {
            allowExpectedRejections: allowExpectedBridgeRejections,
            expectedRejectionCount: expectedBridgeRejectionCount,
            requireAuditedMailboxResponses: options.requireAuditedMailboxResponses,
        }),
        'Bridge mailbox did not record successful request handling.'
    );
    if (options.requireAuditedMailboxResponses === true) {
        assertCondition(
            failures,
            validMailboxAuditResponseCount === mailboxEvents.length,
            `Mailbox audit response files are missing, invalid, or mismatched: ${mailboxAuditResponseFailures.join(' ')}`
        );
    }
    if (options.requireAuditedMailboxResponseDigests === true) {
        assertCondition(
            failures,
            validMailboxAuditResponseDigestCount === mailboxEvents.length,
            `Mailbox audit response digests are missing or mismatched: ${mailboxAuditResponseFailures.join(' ')}`
        );
    }
    assertCondition(
        failures,
        wrapper?.kind === 'unity-built-player-smoke-wrapper',
        'Nested wrapper kind is not unity-built-player-smoke-wrapper.'
    );
    assertCondition(failures, wrapper?.ok === true, 'Nested wrapper ok is not true.');
    assertCondition(
        failures,
        wrapper?.player?.platform === 'WindowsPlayer',
        'Smoke did not run as a WindowsPlayer build.'
    );
    assertCondition(
        failures,
        smoke?.kind === 'unity-localdev-product-surface-smoke',
        'Nested smoke kind is not unity-localdev-product-surface-smoke.'
    );
    assertCondition(failures, smoke?.ok === true, 'Nested product-surface smoke ok is not true.');
    assertCondition(failures, smoke?.freshLaunch === true, 'Smoke did not record a fresh launch.');
    assertCondition(
        failures,
        smoke?.usedFixtureReplayAsGameplayDriver === false,
        'Smoke used a fixture replay as gameplay driver.'
    );
    assertCondition(
        failures,
        smoke?.usedCheckpointStateReplacement === false,
        'Smoke used checkpoint state replacement.'
    );
    assertCondition(
        failures,
        actions.length > 0,
        'Smoke did not apply any product-surface actions.'
    );
    assertCondition(
        failures,
        mailboxEvents.length >= actions.length,
        'Mailbox event count is lower than product-surface action count.'
    );
    assertCondition(
        failures,
        typeof finalHash === 'string' && finalHash.length > 0,
        'Product state final hash is missing.'
    );
    assertCondition(
        failures,
        finalHash === controllerHash,
        'Product state hash does not match controller replay hash.'
    );
    assertCondition(
        failures,
        exportedHash === controllerHash,
        'Exported replay summary hash does not match controller replay hash.'
    );
    assertCondition(failures, replayReview?.ok === true, 'Replay review did not report ok.');
    assertCondition(
        failures,
        reviewedHash === controllerHash,
        'Reviewed replay final hash does not match controller replay hash.'
    );
    assertCondition(
        failures,
        productState?.summaryFinalStateHash === controllerHash,
        'Product summary final hash does not match controller replay hash.'
    );
    assertCondition(
        failures,
        Number.isFinite(recordedEvents) && recordedEvents === actions.length,
        'Recorded event count does not match action count.'
    );
    assertCondition(
        failures,
        Number.isFinite(exportedEvents) && exportedEvents === recordedEvents,
        'Exported replay event count does not match recorded events.'
    );
    assertCondition(
        failures,
        Number.isFinite(lastRecordedEvents) && lastRecordedEvents === recordedEvents,
        'Last action recorded-event count does not match product summary.'
    );
    if (draftReleasePathEnabled) {
        assertCondition(
            failures,
            draftReleasePathActions.length === expectedDraftReleasePathFamilies.length,
            'Draft release-path proof does not contain both players draft reroll/select actions.'
        );
        assertCondition(
            failures,
            expectedDraftReleasePathFamilies.every(
                (family, index) => draftReleasePathFamilies[index] === family
            ),
            'Draft release-path proof does not record ordered P1/P2 reroll and choose_boon actions.'
        );
        assertCondition(
            failures,
            draftReleasePathActions[0]?.phaseBefore === 'DRAFT_PHASE' &&
                draftReleasePathActions[0]?.phaseAfter === 'DRAFT_PHASE' &&
                draftReleasePathActions[1]?.phaseBefore === 'DRAFT_PHASE' &&
                draftReleasePathActions[1]?.phaseAfter === 'DRAFT_PHASE' &&
                draftReleasePathActions[2]?.phaseBefore === 'DRAFT_PHASE' &&
                draftReleasePathActions[2]?.phaseAfter === 'DRAFT_PHASE' &&
                draftReleasePathActions[3]?.phaseBefore === 'DRAFT_PHASE' &&
                draftReleasePathActions[3]?.phaseAfter === 'IDLE' &&
                productState?.phase === 'IDLE',
            'Draft release-path proof did not complete both players draft selections into IDLE.'
        );
        assertCondition(
            failures,
            Number(draftReleasePathActions[3]?.recordedEvents ?? NaN) === 4 &&
                Number.isFinite(recordedEvents) &&
                recordedEvents >= 4,
            'Draft release-path proof does not preserve draft live replay event counts.'
        );
    }
    if (wrapper?.includeReplayReleasePath === true) {
        const missingReplayReleasePathCoverage = requiredReplayReleasePathCoverage.filter(
            (entry) => !replayReleasePathCoverage.includes(entry)
        );
        const replayRejectedImportCases = replayReleasePathCases.filter((entry) =>
            requiredReplayRejectedImportCases.includes(entry?.name)
        );
        assertCondition(
            failures,
            replayReleasePath?.kind === 'unity-localdev-replay-release-path-smoke',
            'Replay release-path proof kind is missing or unexpected.'
        );
        assertCondition(
            failures,
            replayReleasePath?.ok === true,
            'Replay release-path proof ok is not true.'
        );
        if (options.requireReplayReleasePath === true) {
            assertCondition(
                failures,
                missingReplayReleasePathCoverage.length === 0,
                `Replay release-path proof is missing coverage: ${missingReplayReleasePathCoverage.join(', ')}.`
            );
            assertCondition(
                failures,
                replayReleasePathCases.length >= requiredReplayReleasePathCoverage.length,
                'Replay release-path proof has too few case records.'
            );
        }
        if (options.requireReplayReleasePathNoMutation === true) {
            assertCondition(
                failures,
                replayRejectedImportCases.length === requiredReplayRejectedImportCases.length,
                'Replay release-path rejected import proof is missing no-mutation case records.'
            );
            assertCondition(
                failures,
                replayRejectedImportCases.every(
                    (entry) =>
                        entry?.ok === true &&
                        entry?.accepted === false &&
                        typeof entry?.stateHashBefore === 'string' &&
                        entry.stateHashBefore.length > 0 &&
                        entry?.stateHashBefore === entry?.stateHashAfter &&
                        Number.isFinite(Number(entry?.recordedEventsBefore)) &&
                        Number(entry.recordedEventsBefore) === Number(entry?.recordedEventsAfter) &&
                        entry?.liveReplayStateUnchanged === true
                ),
                'Replay release-path rejected import proof mutated state, recorded events, or omitted explicit no-mutation evidence.'
            );
        }
        assertCondition(
            failures,
            replayReleasePathCases.every((entry) => entry?.ok === true),
            'Replay release-path proof has a failing case record.'
        );
        assertCondition(
            failures,
            replayReleasePath?.baseline?.stateHash === finalHash,
            'Replay release-path baseline hash does not match product final hash.'
        );
        assertCondition(
            failures,
            replayReleasePath?.baseline?.recordedEvents === recordedEvents,
            'Replay release-path baseline recorded-events count does not match product summary.'
        );
        assertCondition(
            failures,
            replayReleasePath?.reviewedFinalStateHash === finalHash,
            'Replay release-path reviewed final hash does not match product final hash.'
        );
    }
    if (wrapper?.includeRecoveryReleasePath === true) {
        const recoveryReplayHashes = recoveryReleasePath?.replayHashSummary;
        const recoveryReview = recoveryReleasePath?.replayReview;
        const recoverySummary = recoveryReleasePath?.recoverySummary;
        const sourceState = recoveryReleasePath?.sourceStateSummary;
        const restoredState = recoveryReleasePath?.restoredStateSummary;
        const continuedState = recoveryReleasePath?.continuedStateSummary;
        assertCondition(
            failures,
            recoveryReleasePath?.kind === 'unity-localdev-recovery-release-path-smoke',
            'Recovery release-path proof kind is missing or unexpected.'
        );
        assertCondition(
            failures,
            recoveryReleasePath?.ok === true,
            'Recovery release-path proof ok is not true.'
        );
        assertCondition(
            failures,
            recoveryReleasePath?.freshLaunch === true,
            'Recovery release-path proof did not record a fresh launch.'
        );
        assertCondition(
            failures,
            recoveryReleasePath?.usedFixtureReplayAsGameplayDriver === false,
            'Recovery release-path proof used a fixture replay as gameplay driver.'
        );
        assertCondition(
            failures,
            recoveryReleasePath?.usedCheckpointStateReplacement === false,
            'Recovery release-path proof used checkpoint state replacement.'
        );
        assertCondition(
            failures,
            recoverySummary?.savedStatus === 'saved' &&
                recoverySummary?.restoredStatus === 'loaded' &&
                recoverySummary?.continuedStatus === 'saved',
            'Recovery release-path proof did not save, load, then save recovery state.'
        );
        assertCondition(
            failures,
            recoverySummary?.savedStateHash === recoverySummary?.restoredStateHash,
            'Recovery release-path restored hash does not match saved hash.'
        );
        assertCondition(
            failures,
            recoverySummary?.continuedStateHash &&
                recoverySummary.continuedStateHash !== recoverySummary.savedStateHash,
            'Recovery release-path continuation did not produce a new state hash.'
        );
        assertCondition(
            failures,
            recoverySummary?.savedRecordedEvents === 1 &&
                recoverySummary?.restoredRecordedEvents === 1 &&
                recoverySummary?.continuedRecordedEvents === 2,
            'Recovery release-path proof did not preserve then append live replay events.'
        );
        assertCondition(
            failures,
            sourceState?.stateHash === recoverySummary?.savedStateHash &&
                restoredState?.stateHash === recoverySummary?.restoredStateHash &&
                continuedState?.stateHash === recoverySummary?.continuedStateHash,
            'Recovery release-path state summaries do not match recovery hashes.'
        );
        assertCondition(
            failures,
            recoveryReplayHashes?.exportedEvents === recoverySummary?.continuedRecordedEvents,
            'Recovery release-path exported event count does not match continued recording.'
        );
        assertCondition(
            failures,
            recoveryReplayHashes?.exportedSummaryFinalStateHash ===
                recoverySummary?.continuedStateHash,
            'Recovery release-path exported replay hash does not match continued state hash.'
        );
        assertCondition(
            failures,
            recoveryReplayHashes?.controllerCurrentStateHash ===
                recoverySummary?.continuedStateHash,
            'Recovery release-path controller hash does not match continued state hash.'
        );
        assertCondition(
            failures,
            recoveryReview?.ok === true,
            'Recovery release-path review did not report ok.'
        );
        assertCondition(
            failures,
            recoveryReview?.reviewedFinalStateHash === recoverySummary?.continuedStateHash,
            'Recovery release-path review hash does not match continued state hash.'
        );
    }
    if (wrapper?.includeSettingsReleasePath === true) {
        const settingsSummary = settingsReleasePath?.settingsSummary;
        assertCondition(
            failures,
            settingsReleasePath?.kind === 'unity-localdev-settings-release-path-smoke',
            'Settings release-path proof kind is missing or unexpected.'
        );
        assertCondition(
            failures,
            settingsReleasePath?.ok === true,
            'Settings release-path proof ok is not true.'
        );
        assertCondition(
            failures,
            settingsReleasePath?.freshLaunch === true,
            'Settings release-path proof did not record a fresh launch.'
        );
        assertCondition(
            failures,
            settingsReleasePath?.usedFixtureReplayAsGameplayDriver === false,
            'Settings release-path proof used a fixture replay as gameplay driver.'
        );
        assertCondition(
            failures,
            settingsReleasePath?.usedCheckpointStateReplacement === false,
            'Settings release-path proof used checkpoint state replacement.'
        );
        assertCondition(
            failures,
            settingsSummary?.savedStatus === 'saved' &&
                settingsSummary?.reloadedStatus === 'loaded',
            'Settings release-path proof did not save and reload settings.'
        );
        assertCondition(
            failures,
            typeof settingsSummary?.path === 'string' && existsSync(settingsSummary.path),
            'Settings release-path proof persistence file is missing.'
        );
        assertCondition(
            failures,
            settingsSummary?.gameplayHashBefore === settingsSummary?.gameplayHashAfterSave,
            'Settings release-path proof changed gameplay state hash.'
        );
        assertCondition(
            failures,
            settingsSummary?.recordedEventsBefore === 0 &&
                settingsSummary?.recordedEventsAfterSave === 0,
            'Settings release-path proof recorded gameplay events.'
        );
        assertCondition(
            failures,
            settingsSummary?.reloadGameplayHashBefore ===
                settingsSummary?.reloadGameplayHashAfterLoad,
            'Settings release-path load changed reloaded gameplay state hash.'
        );
        assertCondition(
            failures,
            settingsSummary?.reloadRecordedEventsBefore === 0 &&
                settingsSummary?.reloadRecordedEventsAfterLoad === 0,
            'Settings release-path load recorded gameplay events.'
        );
        assertCondition(
            failures,
            settingsMatchExpected(settingsSummary?.savedSettings),
            'Settings release-path saved settings do not match expected values.'
        );
        assertCondition(
            failures,
            settingsMatchExpected(settingsSummary?.persistedSettings),
            'Settings release-path persisted settings do not match expected values.'
        );
        assertCondition(
            failures,
            settingsMatchExpected(settingsSummary?.reloadedSettings),
            'Settings release-path reloaded settings do not match expected values.'
        );
    }
    if (wrapper?.includeChromeReleasePath === true) {
        const chromeSummary = chromeReleasePath?.chromeSummary;
        assertCondition(
            failures,
            chromeReleasePath?.kind === 'unity-localdev-chrome-release-path-smoke',
            'Chrome release-path proof kind is missing or unexpected.'
        );
        assertCondition(
            failures,
            chromeReleasePath?.ok === true,
            'Chrome release-path proof ok is not true.'
        );
        assertCondition(
            failures,
            chromeReleasePath?.freshLaunch === true,
            'Chrome release-path proof did not record a fresh launch.'
        );
        assertCondition(
            failures,
            chromeReleasePath?.usedFixtureReplayAsGameplayDriver === false,
            'Chrome release-path proof used a fixture replay as gameplay driver.'
        );
        assertCondition(
            failures,
            chromeReleasePath?.usedCheckpointStateReplacement === false,
            'Chrome release-path proof used checkpoint state replacement.'
        );
        assertCondition(
            failures,
            chromeSummary?.rulebookOverlayVisibleAfterOpen === true,
            'Chrome release-path proof did not open the rulebook overlay.'
        );
        assertCondition(
            failures,
            chromeSummary?.rulebookOverlayVisibleAfterClose === false,
            'Chrome release-path proof did not close the rulebook overlay.'
        );
        assertCondition(
            failures,
            chromeSummary?.gameplayHashBeforeRulebook ===
                chromeSummary?.gameplayHashAfterRulebookOpen &&
                chromeSummary?.gameplayHashBeforeRulebook ===
                    chromeSummary?.gameplayHashAfterRulebookClose,
            'Chrome release-path rulebook controls changed gameplay state hash.'
        );
        assertCondition(
            failures,
            chromeSummary?.recordedEventsBeforeRulebook ===
                chromeSummary?.recordedEventsAfterRulebookOpen &&
                chromeSummary?.recordedEventsBeforeRulebook ===
                    chromeSummary?.recordedEventsAfterRulebookClose,
            'Chrome release-path rulebook controls changed live replay event count.'
        );
        assertCondition(
            failures,
            chromeSummary?.shellAfterRestart === true,
            'Chrome release-path restart did not return to the shell.'
        );
        assertCondition(
            failures,
            chromeSummary?.localStartVisibleAfterRestart === true,
            'Chrome release-path restart did not expose Local PvP start.'
        );
        assertCondition(
            failures,
            typeof chromeSummary?.restartedCommandHash === 'string' &&
                chromeSummary.restartedCommandHash.length > 0 &&
                chromeSummary.restartedCommandHash !== chromeSummary?.restartedStartHash,
            'Chrome release-path restarted live command did not produce a new gameplay hash.'
        );
        assertCondition(
            failures,
            chromeSummary?.restartedCommandRecordedEvents === 1,
            'Chrome release-path restarted live command did not record exactly one event.'
        );
    }
    if (wrapper?.includeReplayReviewReleasePath === true) {
        const navigation = replayReviewReleasePath?.reviewNavigationSummary;
        const sourceSmoke = replayReviewReleasePath?.sourceSmoke;
        const sourceActions = Array.isArray(sourceSmoke?.actions) ? sourceSmoke.actions : [];
        assertCondition(
            failures,
            replayReviewReleasePath?.kind === 'unity-localdev-replay-review-release-path-smoke',
            'Replay review release-path proof kind is missing or unexpected.'
        );
        assertCondition(
            failures,
            replayReviewReleasePath?.ok === true,
            'Replay review release-path proof ok is not true.'
        );
        assertCondition(
            failures,
            replayReviewReleasePath?.freshLaunch === true,
            'Replay review release-path proof did not record a fresh launch.'
        );
        assertCondition(
            failures,
            replayReviewReleasePath?.usedFixtureReplayAsGameplayDriver === false,
            'Replay review release-path proof used a fixture replay as gameplay driver.'
        );
        assertCondition(
            failures,
            replayReviewReleasePath?.usedCheckpointStateReplacement === false,
            'Replay review release-path proof used checkpoint state replacement.'
        );
        assertCondition(
            failures,
            sourceSmoke?.ok === true && sourceActions.length >= 2,
            'Replay review release-path proof did not create a live source replay with at least two actions.'
        );
        assertCondition(
            failures,
            navigation?.exportedEvents >= 2,
            'Replay review release-path proof exported fewer than two events.'
        );
        assertCondition(
            failures,
            typeof navigation?.path === 'string' && existsSync(navigation.path),
            'Replay review release-path proof replay file is missing.'
        );
        assertCondition(
            failures,
            navigation?.importedRevision === 0 &&
                navigation?.firstForwardRevision === 1 &&
                navigation?.secondForwardRevision === 2 &&
                navigation?.backToFirstRevision === 1,
            'Replay review release-path proof did not navigate initial redo/redo/undo revisions as expected.'
        );
        assertCondition(
            failures,
            navigation?.finalRevision === navigation?.exportedEvents &&
                navigation?.returnedFinalRevision === navigation?.exportedEvents,
            'Replay review release-path proof did not navigate to final and back to final.'
        );
        assertCondition(
            failures,
            navigation?.beforeReturnedFinalRevision === navigation?.exportedEvents - 1,
            'Replay review release-path undo from final did not land on final - 1.'
        );
        assertCondition(
            failures,
            navigation?.firstForwardHash === navigation?.backToFirstHash,
            'Replay review release-path undo did not restore the first-forward hash.'
        );
        assertCondition(
            failures,
            navigation?.finalReviewHash === navigation?.exportedSummaryFinalStateHash &&
                navigation?.returnedFinalHash === navigation?.exportedSummaryFinalStateHash,
            'Replay review release-path final review hashes do not match the exported summary hash.'
        );
        assertCondition(
            failures,
            navigation?.sourceHashBeforeReview === navigation?.sourceHashAfterReview,
            'Replay review release-path navigation changed the source live gameplay hash.'
        );
        assertCondition(
            failures,
            navigation?.sourceRecordedEventsBeforeReview ===
                navigation?.sourceRecordedEventsAfterReview,
            'Replay review release-path navigation changed the source live replay event count.'
        );
        assertCondition(
            failures,
            navigation?.usedVisibleRedoControl === true &&
                navigation?.usedVisibleUndoControl === true,
            'Replay review release-path proof did not use visible review controls.'
        );
        assertCondition(
            failures,
            navigation?.sourceLiveStateUnchanged === true &&
                navigation?.sourceLiveReplayStreamUnchanged === true,
            'Replay review release-path proof did not preserve the source live state and replay stream.'
        );
    }
    if (wrapper?.includeInvalidActionReleasePath === true) {
        const invalidCases = invalidActionCases;
        const invalidProductState = invalidActionReleasePath?.productStateSummary;
        const invalidReplayHashes = invalidActionReleasePath?.replayHashSummary;
        const invalidReplayReview = invalidActionReleasePath?.replayReview;
        const invalidCaseIds = invalidCases
            .map((entry) => entry?.id)
            .filter((entry) => typeof entry === 'string');
        const requiredInvalidCaseIds = [
            'reject-cancel-reserve-idle',
            'reject-close-modal-without-modal',
            'reject-inactive-player-take-gems',
            'reject-reroll-draft-pool-idle',
            'reject-select-buff-idle',
            'reject-take-gems-empty-selection',
        ];
        const missingInvalidCaseIds = requiredInvalidCaseIds.filter(
            (id) => !invalidCaseIds.includes(id)
        );
        assertCondition(
            failures,
            invalidActionReleasePath?.kind === 'unity-localdev-invalid-action-release-path-smoke',
            'Invalid-action release-path proof kind is missing or unexpected.'
        );
        assertCondition(
            failures,
            invalidActionReleasePath?.ok === true,
            'Invalid-action release-path proof ok is not true.'
        );
        assertCondition(
            failures,
            invalidActionReleasePath?.freshLaunch === true,
            'Invalid-action release-path proof did not record a fresh launch.'
        );
        assertCondition(
            failures,
            invalidActionReleasePath?.usedFixtureReplayAsGameplayDriver === false,
            'Invalid-action release-path proof used a fixture replay as gameplay driver.'
        );
        assertCondition(
            failures,
            invalidActionReleasePath?.usedCheckpointStateReplacement === false,
            'Invalid-action release-path proof used checkpoint state replacement.'
        );
        assertCondition(
            failures,
            missingInvalidCaseIds.length === 0,
            `Invalid-action release-path proof is missing cases: ${missingInvalidCaseIds.join(', ')}.`
        );
        assertCondition(
            failures,
            invalidCases.every(
                (entry) =>
                    entry?.ok === true &&
                    entry?.accepted === false &&
                    entry?.stateHashBefore === entry?.stateHashAfter &&
                    entry?.summaryHashBefore === entry?.summaryHashAfter &&
                    entry?.recordedEventsBefore === entry?.recordedEventsAfter &&
                    entry?.driver === 'live-rules-engine-command-rejected'
            ),
            'Invalid-action release-path proof has a case that mutated state, recorded an event, or bypassed the bridge rejection path.'
        );
        assertCondition(
            failures,
            mailboxEvents.filter((event) => event?.exitCode === 2).length === invalidCases.length,
            'Invalid-action release-path proof did not produce one rejected bridge process result per invalid case.'
        );
        assertCondition(
            failures,
            invalidProductState?.recordedEvents === 0,
            'Invalid-action release-path proof recorded live replay events.'
        );
        assertCondition(
            failures,
            invalidProductState?.stateHash === invalidProductState?.summaryFinalStateHash,
            'Invalid-action release-path product hash does not match live replay summary hash.'
        );
        assertCondition(
            failures,
            invalidReplayHashes?.exportedEvents === invalidProductState?.recordedEvents,
            'Invalid-action release-path exported event count does not match product summary.'
        );
        assertCondition(
            failures,
            invalidReplayHashes?.exportedSummaryFinalStateHash === invalidProductState?.stateHash &&
                invalidReplayHashes?.controllerCurrentStateHash === invalidProductState?.stateHash,
            'Invalid-action release-path exported/controller hashes do not match product hash.'
        );
        assertCondition(
            failures,
            invalidReplayReview?.ok === true &&
                invalidReplayReview?.reviewedFinalStateHash === invalidProductState?.stateHash,
            'Invalid-action release-path replay review hash does not match product hash.'
        );
    }
    if (wrapper?.includePeekModalReleasePath === true) {
        const peekSummary = peekModalReleasePath?.peekModalSummary;
        const eventTypes = Array.isArray(peekSummary?.eventTypes) ? peekSummary.eventTypes : [];
        assertCondition(
            failures,
            peekModalReleasePath?.kind === 'unity-localdev-peek-modal-release-path-smoke',
            'Peek-modal release-path proof kind is missing or unexpected.'
        );
        assertCondition(
            failures,
            peekModalReleasePath?.ok === true,
            'Peek-modal release-path proof ok is not true.'
        );
        assertCondition(
            failures,
            peekModalReleasePath?.freshLaunch === true,
            'Peek-modal release-path proof did not record a fresh launch.'
        );
        assertCondition(
            failures,
            peekModalReleasePath?.usedFixtureReplayAsGameplayDriver === false,
            'Peek-modal release-path proof used a fixture replay as gameplay driver.'
        );
        assertCondition(
            failures,
            peekModalReleasePath?.usedCheckpointStateReplacement === false,
            'Peek-modal release-path proof used checkpoint state replacement.'
        );
        assertCondition(
            failures,
            peekSummary?.p1BuffId === 'intelligence',
            'Peek-modal release-path proof did not select the intelligence buff.'
        );
        assertCondition(
            failures,
            eventTypes.includes('select_buff') &&
                eventTypes.includes('peek_deck') &&
                eventTypes.includes('close_modal'),
            'Peek-modal release-path proof did not export select_buff, peek_deck, and close_modal events.'
        );
        assertCondition(
            failures,
            peekSummary?.peekControlVisibleBefore === true &&
                peekSummary?.modalVisibleAfterPeek === true &&
                peekSummary?.closeControlVisibleAfterPeek === true &&
                peekSummary?.modalVisibleAfterClose === false,
            'Peek-modal release-path proof did not exercise the visible peek/modal controls.'
        );
        assertCondition(
            failures,
            peekSummary?.recordedEvents === peekSummary?.exportedEvents &&
                peekSummary?.recordedEvents >= 4,
            'Peek-modal release-path proof did not preserve recorded/exported event counts.'
        );
        assertCondition(
            failures,
            peekSummary?.exportedSummaryFinalStateHash ===
                peekSummary?.controllerCurrentStateHash &&
                peekSummary?.reviewedFinalStateHash === peekSummary?.controllerCurrentStateHash,
            'Peek-modal release-path proof did not preserve export/review hashes.'
        );
        assertCondition(
            failures,
            peekModalReleasePath?.replayReview?.ok === true,
            'Peek-modal release-path replay review did not report ok.'
        );
    }
    if (wrapper?.includeRecoveryInvalidActionReleasePath === true) {
        const recoveryInvalidCases = recoveryInvalidActionCases;
        const recoveryInvalidCaseIds = recoveryInvalidCases
            .map((entry) => entry?.id)
            .filter((entry) => typeof entry === 'string');
        const requiredRecoveryInvalidCaseIds = [
            'reject-recovered-cancel-reserve-idle',
            'reject-recovered-close-modal-without-modal',
            'reject-recovered-inactive-player-take-gems',
        ];
        const missingRecoveryInvalidCaseIds = requiredRecoveryInvalidCaseIds.filter(
            (id) => !recoveryInvalidCaseIds.includes(id)
        );
        const recoverySummary = recoveryInvalidActionReleasePath?.recoverySummary;
        const invalidSummary = recoveryInvalidActionReleasePath?.invalidActionSummary;
        const recoveryReplayHashes = recoveryInvalidActionReleasePath?.replayHashSummary;
        const recoveryReplayReview = recoveryInvalidActionReleasePath?.replayReview;
        assertCondition(
            failures,
            recoveryInvalidActionReleasePath?.kind ===
                'unity-localdev-recovery-invalid-action-release-path-smoke',
            'Recovery invalid-action release-path proof kind is missing or unexpected.'
        );
        assertCondition(
            failures,
            recoveryInvalidActionReleasePath?.ok === true,
            'Recovery invalid-action release-path proof ok is not true.'
        );
        assertCondition(
            failures,
            recoveryInvalidActionReleasePath?.freshLaunch === true,
            'Recovery invalid-action release-path proof did not record a fresh launch.'
        );
        assertCondition(
            failures,
            recoveryInvalidActionReleasePath?.usedFixtureReplayAsGameplayDriver === false,
            'Recovery invalid-action release-path proof used a fixture replay as gameplay driver.'
        );
        assertCondition(
            failures,
            recoveryInvalidActionReleasePath?.usedCheckpointStateReplacement === false,
            'Recovery invalid-action release-path proof used checkpoint state replacement.'
        );
        assertCondition(
            failures,
            missingRecoveryInvalidCaseIds.length === 0,
            `Recovery invalid-action release-path proof is missing cases: ${missingRecoveryInvalidCaseIds.join(', ')}.`
        );
        assertCondition(
            failures,
            recoveryInvalidCases.every(
                (entry) =>
                    entry?.ok === true &&
                    entry?.accepted === false &&
                    entry?.recoveryStateHashBefore === entry?.recoveryStateHashAfter &&
                    entry?.replayStateHashBefore === entry?.replayStateHashAfter &&
                    entry?.summaryHashBefore === entry?.summaryHashAfter &&
                    entry?.recordedEventsBefore === entry?.recordedEventsAfter &&
                    entry?.driver === 'live-rules-engine-command-rejected'
            ),
            'Recovery invalid-action release-path proof has a case that mutated state, recorded an event, or bypassed the bridge rejection path.'
        );
        assertCondition(
            failures,
            mailboxEvents.filter((event) => event?.exitCode === 2).length >=
                recoveryInvalidCases.length,
            'Recovery invalid-action release-path proof did not produce rejected bridge process results for its invalid cases.'
        );
        assertCondition(
            failures,
            recoverySummary?.savedStatus === 'saved' &&
                recoverySummary?.restoredStatus === 'loaded' &&
                recoverySummary?.continuedStatus === 'saved',
            'Recovery invalid-action release-path proof did not save, load, then save recovery state.'
        );
        assertCondition(
            failures,
            recoverySummary?.savedStateHash === recoverySummary?.restoredStateHash &&
                recoverySummary?.savedStateHash === recoverySummary?.afterInvalidStateHash,
            'Recovery invalid-action release-path proof changed state before valid continuation.'
        );
        assertCondition(
            failures,
            recoverySummary?.continuedStateHash &&
                recoverySummary.continuedStateHash !== recoverySummary.savedStateHash,
            'Recovery invalid-action release-path proof did not continue to a new state hash after invalid rejections.'
        );
        assertCondition(
            failures,
            recoverySummary?.savedRecordedEvents === 1 &&
                recoverySummary?.restoredRecordedEvents === 1 &&
                recoverySummary?.afterInvalidRecordedEvents === 1 &&
                recoverySummary?.continuedRecordedEvents === 2,
            'Recovery invalid-action release-path proof did not preserve then append live replay events as expected.'
        );
        assertCondition(
            failures,
            invalidSummary?.caseCount === recoveryInvalidCases.length &&
                invalidSummary?.stateHashBefore === invalidSummary?.stateHashAfter &&
                invalidSummary?.recordedEventsBefore === invalidSummary?.recordedEventsAfter,
            'Recovery invalid-action summary does not prove no mutation/no recording.'
        );
        assertCondition(
            failures,
            recoveryReplayHashes?.exportedEvents === recoverySummary?.continuedRecordedEvents,
            'Recovery invalid-action release-path exported event count does not match continued recording.'
        );
        assertCondition(
            failures,
            recoveryReplayHashes?.exportedSummaryFinalStateHash ===
                recoverySummary?.continuedStateHash &&
                recoveryReplayHashes?.controllerCurrentStateHash ===
                    recoverySummary?.continuedStateHash &&
                recoveryReplayHashes?.reviewedFinalStateHash ===
                    recoverySummary?.continuedStateHash,
            'Recovery invalid-action release-path export/review hashes do not match continued state hash.'
        );
        assertCondition(
            failures,
            recoveryReplayReview?.ok === true &&
                recoveryReplayReview?.reviewedFinalStateHash ===
                    recoverySummary?.continuedStateHash,
            'Recovery invalid-action release-path replay review hash does not match continued state hash.'
        );
    }
    if (wrapper?.includePrivilegeCancelReleasePath === true) {
        const privilegeSummary = privilegeCancelReleasePath?.privilegeCancelSummary;
        const privilegeEventTypes = Array.isArray(privilegeSummary?.eventTypes)
            ? privilegeSummary.eventTypes
            : [];
        assertCondition(
            failures,
            privilegeCancelReleasePath?.kind ===
                'unity-localdev-privilege-cancel-release-path-smoke',
            'Privilege-cancel release-path proof kind is missing or unexpected.'
        );
        assertCondition(
            failures,
            privilegeCancelReleasePath?.ok === true,
            'Privilege-cancel release-path proof ok is not true.'
        );
        assertCondition(
            failures,
            privilegeCancelReleasePath?.freshLaunch === true,
            'Privilege-cancel release-path proof did not record a fresh launch.'
        );
        assertCondition(
            failures,
            privilegeCancelReleasePath?.usedFixtureReplayAsGameplayDriver === false,
            'Privilege-cancel release-path proof used a fixture replay as gameplay driver.'
        );
        assertCondition(
            failures,
            privilegeCancelReleasePath?.usedCheckpointStateReplacement === false,
            'Privilege-cancel release-path proof used checkpoint state replacement.'
        );
        assertCondition(
            failures,
            privilegeSummary?.activatedPhase === 'PRIVILEGE_ACTION' &&
                privilegeSummary?.cancelledPhase === 'IDLE',
            'Privilege-cancel release-path proof did not enter PRIVILEGE_ACTION then return to IDLE.'
        );
        assertCondition(
            failures,
            privilegeEventTypes.includes('activate_privilege') &&
                privilegeEventTypes.includes('cancel_privilege') &&
                privilegeSummary?.cancelEventIndex > privilegeSummary?.activateEventIndex,
            'Privilege-cancel release-path proof did not export ordered activate_privilege then cancel_privilege events.'
        );
        assertCondition(
            failures,
            privilegeSummary?.recordedEvents === privilegeSummary?.exportedEvents &&
                privilegeSummary?.recordedEvents >= 2,
            'Privilege-cancel release-path proof did not preserve recorded/exported event counts.'
        );
        assertCondition(
            failures,
            privilegeSummary?.exportedSummaryFinalStateHash ===
                privilegeSummary?.controllerCurrentStateHash &&
                privilegeSummary?.reviewedFinalStateHash ===
                    privilegeSummary?.controllerCurrentStateHash,
            'Privilege-cancel release-path proof did not preserve export/review hashes.'
        );
        assertCondition(
            failures,
            privilegeCancelReleasePath?.replayReview?.ok === true,
            'Privilege-cancel release-path replay review did not report ok.'
        );
    }
    if (wrapper?.includeReservedDiscardReleasePath === true) {
        const reservedSummary = reservedDiscardReleasePath?.reservedDiscardSummary;
        const reservedEventTypes = Array.isArray(reservedSummary?.eventTypes)
            ? reservedSummary.eventTypes
            : [];
        assertCondition(
            failures,
            reservedDiscardReleasePath?.kind ===
                'unity-localdev-reserved-discard-release-path-smoke',
            'Reserved-discard release-path proof kind is missing or unexpected.'
        );
        assertCondition(
            failures,
            reservedDiscardReleasePath?.ok === true,
            'Reserved-discard release-path proof ok is not true.'
        );
        assertCondition(
            failures,
            reservedDiscardReleasePath?.freshLaunch === true,
            'Reserved-discard release-path proof did not record a fresh launch.'
        );
        assertCondition(
            failures,
            reservedDiscardReleasePath?.usedFixtureReplayAsGameplayDriver === false,
            'Reserved-discard release-path proof used a fixture replay as gameplay driver.'
        );
        assertCondition(
            failures,
            reservedDiscardReleasePath?.usedCheckpointStateReplacement === false,
            'Reserved-discard release-path proof used checkpoint state replacement.'
        );
        assertCondition(
            failures,
            reservedSummary?.p1BuffId === 'puppet_master',
            'Reserved-discard release-path proof did not select the puppet_master buff.'
        );
        assertCondition(
            failures,
            reservedSummary?.reservedCardVisibleBeforeDiscard === true &&
                reservedSummary?.discardControlVisibleBeforeDiscard === true,
            'Reserved-discard release-path proof did not exercise visible reserved-card discard controls.'
        );
        assertCondition(
            failures,
            reservedEventTypes.includes('select_buff') &&
                reservedEventTypes.includes('reserve_card') &&
                reservedEventTypes.includes('discard_reserved') &&
                reservedSummary?.reserveEventIndex > reservedSummary?.selectBuffEventIndex &&
                reservedSummary?.discardEventIndex > reservedSummary?.reserveEventIndex,
            'Reserved-discard release-path proof did not export ordered select_buff, reserve_card, and discard_reserved events.'
        );
        assertCondition(
            failures,
            reservedSummary?.recordedEvents === reservedSummary?.exportedEvents &&
                reservedSummary?.recordedEvents >= 5,
            'Reserved-discard release-path proof did not preserve recorded/exported event counts.'
        );
        assertCondition(
            failures,
            reservedSummary?.exportedSummaryFinalStateHash ===
                reservedSummary?.controllerCurrentStateHash &&
                reservedSummary?.reviewedFinalStateHash ===
                    reservedSummary?.controllerCurrentStateHash,
            'Reserved-discard release-path proof did not preserve export/review hashes.'
        );
        assertCondition(
            failures,
            reservedDiscardReleasePath?.replayReview?.ok === true,
            'Reserved-discard release-path replay review did not report ok.'
        );
    }
    if (wrapper?.includeReservedBuyReleasePath === true) {
        const reservedBuySummary = reservedBuyReleasePath?.reservedBuySummary;
        const reservedBuyEventTypes = Array.isArray(reservedBuySummary?.eventTypes)
            ? reservedBuySummary.eventTypes
            : [];
        assertCondition(
            failures,
            reservedBuyReleasePath?.kind === 'unity-localdev-reserved-buy-release-path-smoke',
            'Reserved-buy release-path proof kind is missing or unexpected.'
        );
        assertCondition(
            failures,
            reservedBuyReleasePath?.ok === true,
            'Reserved-buy release-path proof ok is not true.'
        );
        assertCondition(
            failures,
            reservedBuyReleasePath?.freshLaunch === true,
            'Reserved-buy release-path proof did not record a fresh launch.'
        );
        assertCondition(
            failures,
            reservedBuyReleasePath?.usedFixtureReplayAsGameplayDriver === false,
            'Reserved-buy release-path proof used a fixture replay as gameplay driver.'
        );
        assertCondition(
            failures,
            reservedBuyReleasePath?.usedCheckpointStateReplacement === false,
            'Reserved-buy release-path proof used checkpoint state replacement.'
        );
        assertCondition(
            failures,
            reservedBuySummary?.reservedCardVisibleBeforeBuy === true &&
                reservedBuySummary?.buyControlVisibleBeforeBuy === true,
            'Reserved-buy release-path proof did not exercise visible reserved-card buy controls.'
        );
        assertCondition(
            failures,
            reservedBuyEventTypes.includes('reserve_card') &&
                reservedBuyEventTypes.includes('buy_card') &&
                reservedBuySummary?.buyEventSource === 'reserved' &&
                reservedBuySummary?.buyEventIndex > reservedBuySummary?.reserveEventIndex,
            'Reserved-buy release-path proof did not export ordered reserve_card and reserved-source buy_card events.'
        );
        assertCondition(
            failures,
            reservedBuySummary?.recordedEvents === reservedBuySummary?.exportedEvents &&
                reservedBuySummary?.recordedEvents >= 2,
            'Reserved-buy release-path proof did not preserve recorded/exported event counts.'
        );
        assertCondition(
            failures,
            reservedBuySummary?.exportedSummaryFinalStateHash ===
                reservedBuySummary?.controllerCurrentStateHash &&
                reservedBuySummary?.reviewedFinalStateHash ===
                    reservedBuySummary?.controllerCurrentStateHash,
            'Reserved-buy release-path proof did not preserve export/review hashes.'
        );
        assertCondition(
            failures,
            reservedBuyReleasePath?.replayReview?.ok === true,
            'Reserved-buy release-path replay review did not report ok.'
        );
    }
    if (wrapper?.includeReserveCancelReleasePath === true) {
        const reserveCancelSummary = reserveCancelReleasePath?.reserveCancelSummary;
        const reserveCancelEventTypes = Array.isArray(reserveCancelSummary?.eventTypes)
            ? reserveCancelSummary.eventTypes
            : [];
        assertCondition(
            failures,
            reserveCancelReleasePath?.kind === 'unity-localdev-reserve-cancel-release-path-smoke',
            'Reserve-cancel release-path proof kind is missing or unexpected.'
        );
        assertCondition(
            failures,
            reserveCancelReleasePath?.ok === true,
            'Reserve-cancel release-path proof ok is not true.'
        );
        assertCondition(
            failures,
            reserveCancelReleasePath?.freshLaunch === true,
            'Reserve-cancel release-path proof did not record a fresh launch.'
        );
        assertCondition(
            failures,
            reserveCancelReleasePath?.usedFixtureReplayAsGameplayDriver === false,
            'Reserve-cancel release-path proof used a fixture replay as gameplay driver.'
        );
        assertCondition(
            failures,
            reserveCancelReleasePath?.usedCheckpointStateReplacement === false,
            'Reserve-cancel release-path proof used checkpoint state replacement.'
        );
        assertCondition(
            failures,
            reserveCancelSummary?.marketCardVisibleBeforePreview === true &&
                reserveCancelSummary?.visibleReserveControlBeforeInitiate === true &&
                reserveCancelSummary?.visibleCancelControlBeforeCancel === true,
            'Reserve-cancel release-path proof did not exercise visible market reserve and cancel controls.'
        );
        assertCondition(
            failures,
            reserveCancelSummary?.phaseBeforeCancel === 'RESERVE_WAITING_GEM' &&
                reserveCancelSummary?.finalPhase === 'IDLE',
            'Reserve-cancel release-path proof did not enter RESERVE_WAITING_GEM then return to IDLE.'
        );
        assertCondition(
            failures,
            reserveCancelSummary?.pendingReservePresentAfterCancel === false &&
                reserveCancelSummary?.reservedCardPresentAfterCancel === false,
            'Reserve-cancel release-path proof left pending reserve or reserved card state after cancel.'
        );
        assertCondition(
            failures,
            reserveCancelEventTypes.includes('initiate_reserve') &&
                reserveCancelEventTypes.includes('cancel_reserve') &&
                reserveCancelSummary?.cancelEventIndex > reserveCancelSummary?.initiateEventIndex,
            'Reserve-cancel release-path proof did not export ordered initiate_reserve and cancel_reserve events.'
        );
        assertCondition(
            failures,
            reserveCancelSummary?.recordedEvents === reserveCancelSummary?.exportedEvents &&
                reserveCancelSummary?.recordedEvents >= 2 &&
                reserveCancelSummary?.totalEventsAfterCancel === 0,
            'Reserve-cancel release-path proof did not preserve recorded/exported event counts.'
        );
        assertCondition(
            failures,
            reserveCancelSummary?.initialStateHash ===
                reserveCancelSummary?.controllerCurrentStateHash &&
                reserveCancelSummary?.exportedSummaryFinalStateHash ===
                    reserveCancelSummary?.controllerCurrentStateHash &&
                reserveCancelSummary?.reviewedFinalStateHash ===
                    reserveCancelSummary?.controllerCurrentStateHash,
            'Reserve-cancel release-path proof did not preserve initial/export/review hashes.'
        );
        assertCondition(
            failures,
            reserveCancelReleasePath?.replayReview?.ok === true,
            'Reserve-cancel release-path replay review did not report ok.'
        );
    }
    if (wrapper?.includeReserveDeckReleasePath === true) {
        const reserveDeckSummary = reserveDeckReleasePath?.reserveDeckSummary;
        const reserveDeckEventTypes = Array.isArray(reserveDeckSummary?.eventTypes)
            ? reserveDeckSummary.eventTypes
            : [];
        assertCondition(
            failures,
            reserveDeckReleasePath?.kind === 'unity-localdev-reserve-deck-release-path-smoke',
            'Reserve-deck release-path proof kind is missing or unexpected.'
        );
        assertCondition(
            failures,
            reserveDeckReleasePath?.ok === true,
            'Reserve-deck release-path proof ok is not true.'
        );
        assertCondition(
            failures,
            reserveDeckReleasePath?.freshLaunch === true,
            'Reserve-deck release-path proof did not record a fresh launch.'
        );
        assertCondition(
            failures,
            reserveDeckReleasePath?.usedFixtureReplayAsGameplayDriver === false,
            'Reserve-deck release-path proof used a fixture replay as gameplay driver.'
        );
        assertCondition(
            failures,
            reserveDeckReleasePath?.usedCheckpointStateReplacement === false,
            'Reserve-deck release-path proof used checkpoint state replacement.'
        );
        assertCondition(
            failures,
            reserveDeckSummary?.deckTargetVisibleBeforePreview === true &&
                reserveDeckSummary?.goldTargetVisibleBeforeReserve === true &&
                reserveDeckSummary?.visibleReserveControlBeforeInitiate === true,
            'Reserve-deck release-path proof did not exercise visible deck, reserve, and Gold targets.'
        );
        assertCondition(
            failures,
            reserveDeckSummary?.phaseBeforeGold === 'RESERVE_WAITING_GEM' &&
                reserveDeckSummary?.pendingReserveIsDeck === true &&
                reserveDeckSummary?.finalPhase === 'IDLE' &&
                reserveDeckSummary?.finalTurn === 'p2',
            'Reserve-deck release-path proof did not enter deck-reserve waiting state then return to P2 IDLE.'
        );
        assertCondition(
            failures,
            reserveDeckSummary?.afterDeckCount === reserveDeckSummary?.startDeckCount - 1 &&
                reserveDeckSummary?.afterReservedCount ===
                    reserveDeckSummary?.startReservedCount + 1 &&
                reserveDeckSummary?.reservedCardPresentAfterReserve === true &&
                reserveDeckSummary?.goldCellAfterReserve === 'empty',
            'Reserve-deck release-path proof did not move the deck card into reserve and consume Gold.'
        );
        assertCondition(
            failures,
            reserveDeckEventTypes.includes('initiate_reserve_deck') &&
                reserveDeckEventTypes.includes('reserve_deck') &&
                reserveDeckSummary?.reserveEventIndex > reserveDeckSummary?.initiateEventIndex,
            'Reserve-deck release-path proof did not export ordered initiate_reserve_deck and reserve_deck events.'
        );
        assertCondition(
            failures,
            reserveDeckSummary?.recordedEvents === reserveDeckSummary?.exportedEvents &&
                reserveDeckSummary?.recordedEvents >= 2 &&
                reserveDeckSummary?.totalEventsAfterReserve === 0,
            'Reserve-deck release-path proof did not preserve recorded/exported event counts.'
        );
        assertCondition(
            failures,
            reserveDeckSummary?.exportedSummaryFinalStateHash ===
                reserveDeckSummary?.controllerCurrentStateHash &&
                reserveDeckSummary?.reviewedFinalStateHash ===
                    reserveDeckSummary?.controllerCurrentStateHash,
            'Reserve-deck release-path proof did not preserve export/review hashes.'
        );
        assertCondition(
            failures,
            reserveDeckReleasePath?.replayReview?.ok === true,
            'Reserve-deck release-path replay review did not report ok.'
        );
    }
    if (wrapper?.includeReserveDeckCancelReleasePath === true) {
        const reserveDeckCancelSummary = reserveDeckCancelReleasePath?.reserveDeckCancelSummary;
        const reserveDeckCancelEventTypes = Array.isArray(reserveDeckCancelSummary?.eventTypes)
            ? reserveDeckCancelSummary.eventTypes
            : [];
        assertCondition(
            failures,
            reserveDeckCancelReleasePath?.kind ===
                'unity-localdev-reserve-deck-cancel-release-path-smoke',
            'Deck-reserve cancel release-path proof kind is missing or unexpected.'
        );
        assertCondition(
            failures,
            reserveDeckCancelReleasePath?.ok === true,
            'Deck-reserve cancel release-path proof ok is not true.'
        );
        assertCondition(
            failures,
            reserveDeckCancelReleasePath?.freshLaunch === true,
            'Deck-reserve cancel release-path proof did not record a fresh launch.'
        );
        assertCondition(
            failures,
            reserveDeckCancelReleasePath?.usedFixtureReplayAsGameplayDriver === false,
            'Deck-reserve cancel release-path proof used a fixture replay as gameplay driver.'
        );
        assertCondition(
            failures,
            reserveDeckCancelReleasePath?.usedCheckpointStateReplacement === false,
            'Deck-reserve cancel release-path proof used checkpoint state replacement.'
        );
        assertCondition(
            failures,
            reserveDeckCancelSummary?.deckTargetVisibleBeforePreview === true &&
                reserveDeckCancelSummary?.goldTargetVisibleBeforeCancel === true &&
                reserveDeckCancelSummary?.visibleReserveControlBeforeInitiate === true &&
                reserveDeckCancelSummary?.visibleCancelControlBeforeCancel === true,
            'Deck-reserve cancel release-path proof did not exercise visible deck, reserve, and cancel controls.'
        );
        assertCondition(
            failures,
            reserveDeckCancelSummary?.phaseBeforeCancel === 'RESERVE_WAITING_GEM' &&
                reserveDeckCancelSummary?.pendingReserveIsDeckBeforeCancel === true &&
                reserveDeckCancelSummary?.finalPhase === 'IDLE' &&
                reserveDeckCancelSummary?.finalTurn === 'p1',
            'Deck-reserve cancel release-path proof did not enter deck-reserve waiting state then return to P1 IDLE.'
        );
        assertCondition(
            failures,
            reserveDeckCancelSummary?.pendingReservePresentAfterCancel === false &&
                reserveDeckCancelSummary?.afterDeckCount ===
                    reserveDeckCancelSummary?.startDeckCount &&
                reserveDeckCancelSummary?.afterReservedCount ===
                    reserveDeckCancelSummary?.startReservedCount &&
                reserveDeckCancelSummary?.reservedCardPresentAfterCancel === false &&
                reserveDeckCancelSummary?.goldCellAfterCancel === 'gold',
            'Deck-reserve cancel release-path proof mutated deck, reserve row, pending reserve, or Gold state.'
        );
        assertCondition(
            failures,
            reserveDeckCancelEventTypes.includes('initiate_reserve_deck') &&
                reserveDeckCancelEventTypes.includes('cancel_reserve') &&
                reserveDeckCancelSummary?.cancelEventIndex >
                    reserveDeckCancelSummary?.initiateEventIndex,
            'Deck-reserve cancel release-path proof did not export ordered initiate_reserve_deck and cancel_reserve events.'
        );
        assertCondition(
            failures,
            reserveDeckCancelSummary?.recordedEvents === reserveDeckCancelSummary?.exportedEvents &&
                reserveDeckCancelSummary?.recordedEvents >= 2 &&
                reserveDeckCancelSummary?.totalEventsAfterCancel === 0,
            'Deck-reserve cancel release-path proof did not preserve recorded/exported event counts.'
        );
        assertCondition(
            failures,
            reserveDeckCancelSummary?.initialStateHash ===
                reserveDeckCancelSummary?.controllerCurrentStateHash &&
                reserveDeckCancelSummary?.exportedSummaryFinalStateHash ===
                    reserveDeckCancelSummary?.controllerCurrentStateHash &&
                reserveDeckCancelSummary?.reviewedFinalStateHash ===
                    reserveDeckCancelSummary?.controllerCurrentStateHash,
            'Deck-reserve cancel release-path proof did not preserve initial/export/review hashes.'
        );
        assertCondition(
            failures,
            reserveDeckCancelReleasePath?.replayReview?.ok === true,
            'Deck-reserve cancel release-path replay review did not report ok.'
        );
    }
    if (wrapper?.includeJokerReleasePath === true) {
        const jokerSummary = jokerReleasePath?.jokerSummary;
        const jokerEventTypes = Array.isArray(jokerSummary?.eventTypes)
            ? jokerSummary.eventTypes
            : [];
        assertCondition(
            failures,
            jokerReleasePath?.kind === 'unity-localdev-joker-release-path-smoke',
            'Joker release-path proof kind is missing or unexpected.'
        );
        assertCondition(
            failures,
            jokerReleasePath?.ok === true,
            'Joker release-path proof ok is not true.'
        );
        assertCondition(
            failures,
            jokerReleasePath?.freshLaunch === true,
            'Joker release-path proof did not record a fresh launch.'
        );
        assertCondition(
            failures,
            jokerReleasePath?.usedFixtureReplayAsGameplayDriver === false,
            'Joker release-path proof used a fixture replay as gameplay driver.'
        );
        assertCondition(
            failures,
            jokerReleasePath?.usedCheckpointStateReplacement === false,
            'Joker release-path proof used checkpoint state replacement.'
        );
        assertCondition(
            failures,
            jokerSummary?.marketCardVisibleBeforePreview === true &&
                jokerSummary?.buyControlVisibleBeforeBuy === true &&
                jokerSummary?.colorTargetVisibleBeforeSelection === true,
            'Joker release-path proof did not exercise visible market preview, buy, and color controls.'
        );
        assertCondition(
            failures,
            jokerSummary?.phaseBeforeColor === 'SELECT_CARD_COLOR' &&
                jokerSummary?.finalPhase === 'IDLE' &&
                jokerSummary?.tableauContainsJokerAfterBuy === true &&
                jokerSummary?.pendingBuyClearedAfterBuy === true,
            'Joker release-path proof did not enter color selection, buy the Joker, and clear pendingBuy.'
        );
        assertCondition(
            failures,
            jokerEventTypes.includes('initiate_buy_joker') &&
                jokerEventTypes.includes('buy_card') &&
                jokerSummary?.buyEventIndex > jokerSummary?.initiateEventIndex,
            'Joker release-path proof did not export ordered initiate_buy_joker and buy_card events.'
        );
        assertCondition(
            failures,
            jokerSummary?.recordedEvents === jokerSummary?.exportedEvents &&
                jokerSummary?.recordedEvents >= (jokerSummary?.setupActionCount ?? 0) + 2 &&
                jokerSummary?.totalEventsAfterBuy === 0,
            'Joker release-path proof did not preserve recorded/exported event counts.'
        );
        assertCondition(
            failures,
            jokerSummary?.exportedSummaryFinalStateHash ===
                jokerSummary?.controllerCurrentStateHash &&
                jokerSummary?.reviewedFinalStateHash === jokerSummary?.controllerCurrentStateHash,
            'Joker release-path proof did not preserve export/review hashes.'
        );
        assertCondition(
            failures,
            jokerReleasePath?.replayReview?.ok === true,
            'Joker release-path replay review did not report ok.'
        );
    }

    return {
        path: toRepoPath(filePath),
        status: failures.length === 0 ? 'passed' : 'failed',
        seed: smoke?.seed ?? wrapper?.seed ?? null,
        maxSteps: smoke?.maxSteps ?? wrapper?.maxSteps ?? null,
        idleActionPreference: smoke?.idleActionPreference ?? wrapper?.idleActionPreference ?? null,
        startedAt: launcher?.startedAt ?? null,
        completedAt: launcher?.completedAt ?? null,
        exitCode: launcher?.exitCode ?? null,
        timedOut: launcher?.timedOut ?? null,
        launcherArgsMatchSmoke: launcherArgsSummary.ok === true,
        launcherArgsFailures: launcherArgsSummary.failures,
        launcherReportUnderBuiltPlayerSmokeDir: isPathInside(launcherReportPath, defaultOutputDir),
        executable: toRepoPath(launcher?.exe),
        executableExists,
        executableUnderWindowsBuild,
        stdout: toRepoPath(launcher?.paths?.stdout),
        stdoutUnderBuiltPlayerSmokeDir: isPathInside(stdoutPath, defaultOutputDir),
        stdoutBytes,
        reportedStdoutBytes: Number.isFinite(reportedStdoutBytes) ? reportedStdoutBytes : null,
        stderr: toRepoPath(launcher?.paths?.stderr),
        stderrUnderBuiltPlayerSmokeDir: isPathInside(stderrPath, defaultOutputDir),
        stderrBytes,
        reportedStderrBytes: Number.isFinite(reportedStderrBytes) ? reportedStderrBytes : null,
        playerLog: toRepoPath(launcher?.paths?.playerLog),
        playerLogUnderBuiltPlayerSmokeDir: isPathInside(playerLogPath, defaultOutputDir),
        playerLogBytes,
        reportedPlayerLogBytes: Number.isFinite(reportedPlayerLogBytes)
            ? reportedPlayerLogBytes
            : null,
        smokeReport: toRepoPath(launcher?.paths?.smokeReport),
        smokeReportUnderBuiltPlayerSmokeDir: isPathInside(nestedSmokeReport.path, defaultOutputDir),
        smokeReportExists: nestedSmokeReport.exists === true,
        smokeReportValidJson: nestedSmokeReport.validJson === true,
        smokeReportMatchesLauncherSmoke: nestedSmokeReport.matchesLauncherSmoke === true,
        bridgeMailbox: toRepoPath(bridgeMailboxPath),
        bridgeMailboxUnderBuiltPlayerSmokeDir: isPathInside(bridgeMailboxPath, defaultOutputDir),
        mailboxEventCount: mailboxEvents.length,
        auditedMailboxResponseCount,
        validMailboxAuditResponseCount,
        validMailboxAuditResponseDigestCount,
        successfulMailboxResponseCount,
        mailboxAuditResponses: mailboxAuditResponses.map((entry) => ({
            path: toRepoPath(entry.path),
            ok: entry.ok === true,
            underBridgeMailbox: entry.underBridgeMailbox === true,
            matchesRequestName: entry.matchesRequestName === true,
            matchesAuditResponseDigest: entry.matchesAuditResponseDigest === true,
            auditResponseBytes: entry.auditResponseBytes ?? null,
            reportedAuditResponseBytes: entry.reportedAuditResponseBytes ?? null,
            auditResponseSha256: entry.auditResponseSha256 ?? null,
            reportedAuditResponseSha256: entry.reportedAuditResponseSha256 ?? null,
            responseOk: entry.responseOk ?? null,
            responseActionType: entry.responseActionType ?? null,
            rejectionCode: entry.rejectionCode ?? null,
            failure: entry.failure ?? null,
        })),
        failureReasons,
        commandCount: actions.length,
        recordedEvents: Number.isFinite(recordedEvents) ? recordedEvents : null,
        actionFamilies,
        productStateSummary: {
            phase: productState?.phase ?? null,
            turn: productState?.turn ?? null,
            winner: productState?.winner ?? null,
            stateHash: finalHash ?? null,
            summaryFinalStateHash: productState?.summaryFinalStateHash ?? null,
        },
        replayHashSummary: {
            exportedEvents: Number.isFinite(exportedEvents) ? exportedEvents : null,
            exportedSummaryFinalStateHash: exportedHash ?? null,
            controllerCurrentStateHash: controllerHash ?? null,
            reviewedFinalStateHash: reviewedHash ?? null,
        },
        draftReleasePath: {
            enabled: draftReleasePathEnabled,
            ok:
                draftReleasePathEnabled &&
                expectedDraftReleasePathFamilies.every(
                    (family, index) => draftReleasePathFamilies[index] === family
                ) &&
                draftReleasePathActions[3]?.phaseAfter === 'IDLE' &&
                productState?.phase === 'IDLE',
            startMode: smoke?.startMode ?? wrapper?.startMode ?? null,
            draftActionPreference:
                smoke?.draftActionPreference ?? wrapper?.draftActionPreference ?? null,
            actionFamilies: draftReleasePathFamilies,
            finalDraftPhase: draftReleasePathActions[3]?.phaseAfter ?? null,
            recordedEvents: Number.isFinite(recordedEvents) ? recordedEvents : null,
            exportedEvents: Number.isFinite(exportedEvents) ? exportedEvents : null,
            controllerCurrentStateHash: controllerHash ?? null,
            reviewedFinalStateHash: reviewedHash ?? null,
        },
        replayReleasePath: {
            enabled: wrapper?.includeReplayReleasePath === true,
            ok: replayReleasePath?.ok === true,
            outputDirectory: toRepoPath(replayReleasePath?.outputDirectory),
            coverage: uniqueSorted(replayReleasePathCoverage),
            cases: replayReleasePathCases.map((entry) => ({
                name: entry?.name ?? null,
                ok: entry?.ok === true,
                accepted: entry?.accepted ?? null,
                stateHashBefore: entry?.stateHashBefore ?? null,
                stateHashAfter: entry?.stateHashAfter ?? null,
                recordedEventsBefore: entry?.recordedEventsBefore ?? null,
                recordedEventsAfter: entry?.recordedEventsAfter ?? null,
                liveReplayStateUnchanged: entry?.liveReplayStateUnchanged ?? null,
            })),
            reviewedFinalStateHash: replayReleasePath?.reviewedFinalStateHash ?? null,
        },
        recoveryReleasePath: {
            enabled: wrapper?.includeRecoveryReleasePath === true,
            ok: recoveryReleasePath?.ok === true,
            savedStateHash: recoveryReleasePath?.recoverySummary?.savedStateHash ?? null,
            restoredStateHash: recoveryReleasePath?.recoverySummary?.restoredStateHash ?? null,
            continuedStateHash: recoveryReleasePath?.recoverySummary?.continuedStateHash ?? null,
            savedRecordedEvents: recoveryReleasePath?.recoverySummary?.savedRecordedEvents ?? null,
            restoredRecordedEvents:
                recoveryReleasePath?.recoverySummary?.restoredRecordedEvents ?? null,
            continuedRecordedEvents:
                recoveryReleasePath?.recoverySummary?.continuedRecordedEvents ?? null,
            exportedEvents: recoveryReleasePath?.replayHashSummary?.exportedEvents ?? null,
            reviewedFinalStateHash:
                recoveryReleasePath?.replayReview?.reviewedFinalStateHash ?? null,
        },
        settingsReleasePath: {
            enabled: wrapper?.includeSettingsReleasePath === true,
            ok: settingsReleasePath?.ok === true,
            path: toRepoPath(settingsReleasePath?.settingsSummary?.path),
            savedStatus: settingsReleasePath?.settingsSummary?.savedStatus ?? null,
            reloadedStatus: settingsReleasePath?.settingsSummary?.reloadedStatus ?? null,
            gameplayHashBefore: settingsReleasePath?.settingsSummary?.gameplayHashBefore ?? null,
            gameplayHashAfterSave:
                settingsReleasePath?.settingsSummary?.gameplayHashAfterSave ?? null,
            recordedEventsBefore:
                settingsReleasePath?.settingsSummary?.recordedEventsBefore ?? null,
            recordedEventsAfterSave:
                settingsReleasePath?.settingsSummary?.recordedEventsAfterSave ?? null,
            reloadGameplayHashBefore:
                settingsReleasePath?.settingsSummary?.reloadGameplayHashBefore ?? null,
            reloadGameplayHashAfterLoad:
                settingsReleasePath?.settingsSummary?.reloadGameplayHashAfterLoad ?? null,
            reloadRecordedEventsBefore:
                settingsReleasePath?.settingsSummary?.reloadRecordedEventsBefore ?? null,
            reloadRecordedEventsAfterLoad:
                settingsReleasePath?.settingsSummary?.reloadRecordedEventsAfterLoad ?? null,
            savedSettings: settingsReleasePath?.settingsSummary?.savedSettings ?? null,
            persistedSettings: settingsReleasePath?.settingsSummary?.persistedSettings ?? null,
            reloadedSettings: settingsReleasePath?.settingsSummary?.reloadedSettings ?? null,
        },
        chromeReleasePath: {
            enabled: wrapper?.includeChromeReleasePath === true,
            ok: chromeReleasePath?.ok === true,
            gameplayHashBeforeRulebook:
                chromeReleasePath?.chromeSummary?.gameplayHashBeforeRulebook ?? null,
            gameplayHashAfterRulebookOpen:
                chromeReleasePath?.chromeSummary?.gameplayHashAfterRulebookOpen ?? null,
            gameplayHashAfterRulebookClose:
                chromeReleasePath?.chromeSummary?.gameplayHashAfterRulebookClose ?? null,
            recordedEventsBeforeRulebook:
                chromeReleasePath?.chromeSummary?.recordedEventsBeforeRulebook ?? null,
            recordedEventsAfterRulebookOpen:
                chromeReleasePath?.chromeSummary?.recordedEventsAfterRulebookOpen ?? null,
            recordedEventsAfterRulebookClose:
                chromeReleasePath?.chromeSummary?.recordedEventsAfterRulebookClose ?? null,
            rulebookOverlayVisibleAfterOpen:
                chromeReleasePath?.chromeSummary?.rulebookOverlayVisibleAfterOpen ?? null,
            rulebookOverlayVisibleAfterClose:
                chromeReleasePath?.chromeSummary?.rulebookOverlayVisibleAfterClose ?? null,
            shellAfterRestart: chromeReleasePath?.chromeSummary?.shellAfterRestart ?? null,
            localStartVisibleAfterRestart:
                chromeReleasePath?.chromeSummary?.localStartVisibleAfterRestart ?? null,
            restartedStartHash: chromeReleasePath?.chromeSummary?.restartedStartHash ?? null,
            restartedCommandDetail:
                chromeReleasePath?.chromeSummary?.restartedCommandDetail ?? null,
            restartedCommandHash: chromeReleasePath?.chromeSummary?.restartedCommandHash ?? null,
            restartedCommandRecordedEvents:
                chromeReleasePath?.chromeSummary?.restartedCommandRecordedEvents ?? null,
        },
        replayReviewReleasePath: {
            enabled: wrapper?.includeReplayReviewReleasePath === true,
            ok: replayReviewReleasePath?.ok === true,
            path: toRepoPath(replayReviewReleasePath?.reviewNavigationSummary?.path),
            exportedEvents:
                replayReviewReleasePath?.reviewNavigationSummary?.exportedEvents ?? null,
            finalReviewHash:
                replayReviewReleasePath?.reviewNavigationSummary?.finalReviewHash ?? null,
            returnedFinalHash:
                replayReviewReleasePath?.reviewNavigationSummary?.returnedFinalHash ?? null,
            sourceHashBeforeReview:
                replayReviewReleasePath?.reviewNavigationSummary?.sourceHashBeforeReview ?? null,
            sourceHashAfterReview:
                replayReviewReleasePath?.reviewNavigationSummary?.sourceHashAfterReview ?? null,
            sourceRecordedEventsBeforeReview:
                replayReviewReleasePath?.reviewNavigationSummary
                    ?.sourceRecordedEventsBeforeReview ?? null,
            sourceRecordedEventsAfterReview:
                replayReviewReleasePath?.reviewNavigationSummary?.sourceRecordedEventsAfterReview ??
                null,
            usedVisibleRedoControl:
                replayReviewReleasePath?.reviewNavigationSummary?.usedVisibleRedoControl ?? null,
            usedVisibleUndoControl:
                replayReviewReleasePath?.reviewNavigationSummary?.usedVisibleUndoControl ?? null,
        },
        invalidActionReleasePath: {
            enabled: wrapper?.includeInvalidActionReleasePath === true,
            ok: invalidActionReleasePath?.ok === true,
            caseCount: Array.isArray(invalidActionReleasePath?.cases)
                ? invalidActionReleasePath.cases.length
                : 0,
            cases: Array.isArray(invalidActionReleasePath?.cases)
                ? invalidActionReleasePath.cases.map((entry) => ({
                      id: entry?.id ?? null,
                      ok: entry?.ok === true,
                      accepted: entry?.accepted === true,
                      stateHashBefore: entry?.stateHashBefore ?? null,
                      stateHashAfter: entry?.stateHashAfter ?? null,
                      recordedEventsBefore: entry?.recordedEventsBefore ?? null,
                      recordedEventsAfter: entry?.recordedEventsAfter ?? null,
                  }))
                : [],
            productStateHash: invalidActionReleasePath?.productStateSummary?.stateHash ?? null,
            recordedEvents: invalidActionReleasePath?.productStateSummary?.recordedEvents ?? null,
            exportedEvents: invalidActionReleasePath?.replayHashSummary?.exportedEvents ?? null,
            reviewedFinalStateHash:
                invalidActionReleasePath?.replayReview?.reviewedFinalStateHash ?? null,
        },
        peekModalReleasePath: {
            enabled: wrapper?.includePeekModalReleasePath === true,
            ok: peekModalReleasePath?.ok === true,
            p1BuffId: peekModalReleasePath?.peekModalSummary?.p1BuffId ?? null,
            p2BuffId: peekModalReleasePath?.peekModalSummary?.p2BuffId ?? null,
            eventTypes: Array.isArray(peekModalReleasePath?.peekModalSummary?.eventTypes)
                ? peekModalReleasePath.peekModalSummary.eventTypes
                : [],
            recordedEvents: peekModalReleasePath?.peekModalSummary?.recordedEvents ?? null,
            exportedEvents: peekModalReleasePath?.peekModalSummary?.exportedEvents ?? null,
            controllerCurrentStateHash:
                peekModalReleasePath?.peekModalSummary?.controllerCurrentStateHash ?? null,
            reviewedFinalStateHash:
                peekModalReleasePath?.peekModalSummary?.reviewedFinalStateHash ?? null,
        },
        recoveryInvalidActionReleasePath: {
            enabled: wrapper?.includeRecoveryInvalidActionReleasePath === true,
            ok: recoveryInvalidActionReleasePath?.ok === true,
            caseCount: recoveryInvalidActionCases.length,
            savedStateHash:
                recoveryInvalidActionReleasePath?.recoverySummary?.savedStateHash ?? null,
            restoredStateHash:
                recoveryInvalidActionReleasePath?.recoverySummary?.restoredStateHash ?? null,
            afterInvalidStateHash:
                recoveryInvalidActionReleasePath?.recoverySummary?.afterInvalidStateHash ?? null,
            continuedStateHash:
                recoveryInvalidActionReleasePath?.recoverySummary?.continuedStateHash ?? null,
            savedRecordedEvents:
                recoveryInvalidActionReleasePath?.recoverySummary?.savedRecordedEvents ?? null,
            afterInvalidRecordedEvents:
                recoveryInvalidActionReleasePath?.recoverySummary?.afterInvalidRecordedEvents ??
                null,
            continuedRecordedEvents:
                recoveryInvalidActionReleasePath?.recoverySummary?.continuedRecordedEvents ?? null,
            exportedEvents:
                recoveryInvalidActionReleasePath?.replayHashSummary?.exportedEvents ?? null,
            reviewedFinalStateHash:
                recoveryInvalidActionReleasePath?.replayReview?.reviewedFinalStateHash ?? null,
            cases: recoveryInvalidActionCases.map((entry) => ({
                id: entry?.id ?? null,
                ok: entry?.ok === true,
                accepted: entry?.accepted === true,
                recoveryStateHashBefore: entry?.recoveryStateHashBefore ?? null,
                recoveryStateHashAfter: entry?.recoveryStateHashAfter ?? null,
                recordedEventsBefore: entry?.recordedEventsBefore ?? null,
                recordedEventsAfter: entry?.recordedEventsAfter ?? null,
            })),
        },
        privilegeCancelReleasePath: {
            enabled: wrapper?.includePrivilegeCancelReleasePath === true,
            ok: privilegeCancelReleasePath?.ok === true,
            setupStepCount:
                privilegeCancelReleasePath?.privilegeCancelSummary?.setupStepCount ?? null,
            activatedPhase:
                privilegeCancelReleasePath?.privilegeCancelSummary?.activatedPhase ?? null,
            cancelledPhase:
                privilegeCancelReleasePath?.privilegeCancelSummary?.cancelledPhase ?? null,
            eventTypes: Array.isArray(
                privilegeCancelReleasePath?.privilegeCancelSummary?.eventTypes
            )
                ? privilegeCancelReleasePath.privilegeCancelSummary.eventTypes
                : [],
            recordedEvents:
                privilegeCancelReleasePath?.privilegeCancelSummary?.recordedEvents ?? null,
            exportedEvents:
                privilegeCancelReleasePath?.privilegeCancelSummary?.exportedEvents ?? null,
            controllerCurrentStateHash:
                privilegeCancelReleasePath?.privilegeCancelSummary?.controllerCurrentStateHash ??
                null,
            reviewedFinalStateHash:
                privilegeCancelReleasePath?.privilegeCancelSummary?.reviewedFinalStateHash ?? null,
        },
        reservedDiscardReleasePath: {
            enabled: wrapper?.includeReservedDiscardReleasePath === true,
            ok: reservedDiscardReleasePath?.ok === true,
            p1BuffId: reservedDiscardReleasePath?.reservedDiscardSummary?.p1BuffId ?? null,
            p2BuffId: reservedDiscardReleasePath?.reservedDiscardSummary?.p2BuffId ?? null,
            reservedCard: reservedDiscardReleasePath?.reservedDiscardSummary?.reservedCard ?? null,
            finalPhase: reservedDiscardReleasePath?.reservedDiscardSummary?.finalPhase ?? null,
            finalTurn: reservedDiscardReleasePath?.reservedDiscardSummary?.finalTurn ?? null,
            eventTypes: Array.isArray(
                reservedDiscardReleasePath?.reservedDiscardSummary?.eventTypes
            )
                ? reservedDiscardReleasePath.reservedDiscardSummary.eventTypes
                : [],
            recordedEvents:
                reservedDiscardReleasePath?.reservedDiscardSummary?.recordedEvents ?? null,
            exportedEvents:
                reservedDiscardReleasePath?.reservedDiscardSummary?.exportedEvents ?? null,
            controllerCurrentStateHash:
                reservedDiscardReleasePath?.reservedDiscardSummary?.controllerCurrentStateHash ??
                null,
            reviewedFinalStateHash:
                reservedDiscardReleasePath?.reservedDiscardSummary?.reviewedFinalStateHash ?? null,
        },
        reservedBuyReleasePath: {
            enabled: wrapper?.includeReservedBuyReleasePath === true,
            ok: reservedBuyReleasePath?.ok === true,
            reservedCard: reservedBuyReleasePath?.reservedBuySummary?.reservedCard ?? null,
            reservedCardBaseId:
                reservedBuyReleasePath?.reservedBuySummary?.reservedCardBaseId ?? null,
            reservedCardLevel:
                reservedBuyReleasePath?.reservedBuySummary?.reservedCardLevel ?? null,
            setupActionCount: reservedBuyReleasePath?.reservedBuySummary?.setupActionCount ?? null,
            finalPhase: reservedBuyReleasePath?.reservedBuySummary?.finalPhase ?? null,
            finalTurn: reservedBuyReleasePath?.reservedBuySummary?.finalTurn ?? null,
            eventTypes: Array.isArray(reservedBuyReleasePath?.reservedBuySummary?.eventTypes)
                ? reservedBuyReleasePath.reservedBuySummary.eventTypes
                : [],
            buyEventSource: reservedBuyReleasePath?.reservedBuySummary?.buyEventSource ?? null,
            recordedEvents: reservedBuyReleasePath?.reservedBuySummary?.recordedEvents ?? null,
            exportedEvents: reservedBuyReleasePath?.reservedBuySummary?.exportedEvents ?? null,
            controllerCurrentStateHash:
                reservedBuyReleasePath?.reservedBuySummary?.controllerCurrentStateHash ?? null,
            reviewedFinalStateHash:
                reservedBuyReleasePath?.reservedBuySummary?.reviewedFinalStateHash ?? null,
        },
        reserveCancelReleasePath: {
            enabled: wrapper?.includeReserveCancelReleasePath === true,
            ok: reserveCancelReleasePath?.ok === true,
            marketCard: reserveCancelReleasePath?.reserveCancelSummary?.marketCard ?? null,
            phaseBeforeCancel:
                reserveCancelReleasePath?.reserveCancelSummary?.phaseBeforeCancel ?? null,
            finalPhase: reserveCancelReleasePath?.reserveCancelSummary?.finalPhase ?? null,
            finalTurn: reserveCancelReleasePath?.reserveCancelSummary?.finalTurn ?? null,
            eventTypes: Array.isArray(reserveCancelReleasePath?.reserveCancelSummary?.eventTypes)
                ? reserveCancelReleasePath.reserveCancelSummary.eventTypes
                : [],
            recordedEvents: reserveCancelReleasePath?.reserveCancelSummary?.recordedEvents ?? null,
            exportedEvents: reserveCancelReleasePath?.reserveCancelSummary?.exportedEvents ?? null,
            controllerCurrentStateHash:
                reserveCancelReleasePath?.reserveCancelSummary?.controllerCurrentStateHash ?? null,
            reviewedFinalStateHash:
                reserveCancelReleasePath?.reserveCancelSummary?.reviewedFinalStateHash ?? null,
        },
        reserveDeckReleasePath: {
            enabled: wrapper?.includeReserveDeckReleasePath === true,
            ok: reserveDeckReleasePath?.ok === true,
            topDeckCard: reserveDeckReleasePath?.reserveDeckSummary?.topDeckCard ?? null,
            phaseBeforeGold: reserveDeckReleasePath?.reserveDeckSummary?.phaseBeforeGold ?? null,
            finalPhase: reserveDeckReleasePath?.reserveDeckSummary?.finalPhase ?? null,
            finalTurn: reserveDeckReleasePath?.reserveDeckSummary?.finalTurn ?? null,
            eventTypes: Array.isArray(reserveDeckReleasePath?.reserveDeckSummary?.eventTypes)
                ? reserveDeckReleasePath.reserveDeckSummary.eventTypes
                : [],
            recordedEvents: reserveDeckReleasePath?.reserveDeckSummary?.recordedEvents ?? null,
            exportedEvents: reserveDeckReleasePath?.reserveDeckSummary?.exportedEvents ?? null,
            controllerCurrentStateHash:
                reserveDeckReleasePath?.reserveDeckSummary?.controllerCurrentStateHash ?? null,
            reviewedFinalStateHash:
                reserveDeckReleasePath?.reserveDeckSummary?.reviewedFinalStateHash ?? null,
        },
        reserveDeckCancelReleasePath: {
            enabled: wrapper?.includeReserveDeckCancelReleasePath === true,
            ok: reserveDeckCancelReleasePath?.ok === true,
            topDeckCard:
                reserveDeckCancelReleasePath?.reserveDeckCancelSummary?.topDeckCard ?? null,
            phaseBeforeCancel:
                reserveDeckCancelReleasePath?.reserveDeckCancelSummary?.phaseBeforeCancel ?? null,
            finalPhase: reserveDeckCancelReleasePath?.reserveDeckCancelSummary?.finalPhase ?? null,
            finalTurn: reserveDeckCancelReleasePath?.reserveDeckCancelSummary?.finalTurn ?? null,
            eventTypes: Array.isArray(
                reserveDeckCancelReleasePath?.reserveDeckCancelSummary?.eventTypes
            )
                ? reserveDeckCancelReleasePath.reserveDeckCancelSummary.eventTypes
                : [],
            recordedEvents:
                reserveDeckCancelReleasePath?.reserveDeckCancelSummary?.recordedEvents ?? null,
            exportedEvents:
                reserveDeckCancelReleasePath?.reserveDeckCancelSummary?.exportedEvents ?? null,
            controllerCurrentStateHash:
                reserveDeckCancelReleasePath?.reserveDeckCancelSummary
                    ?.controllerCurrentStateHash ?? null,
            reviewedFinalStateHash:
                reserveDeckCancelReleasePath?.reserveDeckCancelSummary?.reviewedFinalStateHash ??
                null,
        },
        jokerReleasePath: {
            enabled: wrapper?.includeJokerReleasePath === true,
            ok: jokerReleasePath?.ok === true,
            jokerCard: jokerReleasePath?.jokerSummary?.jokerCard ?? null,
            jokerCardBaseId: jokerReleasePath?.jokerSummary?.jokerCardBaseId ?? null,
            jokerLevel: jokerReleasePath?.jokerSummary?.jokerLevel ?? null,
            jokerMarketIndex: jokerReleasePath?.jokerSummary?.jokerMarketIndex ?? null,
            selectedColor: jokerReleasePath?.jokerSummary?.selectedColor ?? null,
            setupActionCount: jokerReleasePath?.jokerSummary?.setupActionCount ?? null,
            phaseBeforeColor: jokerReleasePath?.jokerSummary?.phaseBeforeColor ?? null,
            finalPhase: jokerReleasePath?.jokerSummary?.finalPhase ?? null,
            finalTurn: jokerReleasePath?.jokerSummary?.finalTurn ?? null,
            eventTypes: Array.isArray(jokerReleasePath?.jokerSummary?.eventTypes)
                ? jokerReleasePath.jokerSummary.eventTypes
                : [],
            recordedEvents: jokerReleasePath?.jokerSummary?.recordedEvents ?? null,
            exportedEvents: jokerReleasePath?.jokerSummary?.exportedEvents ?? null,
            controllerCurrentStateHash:
                jokerReleasePath?.jokerSummary?.controllerCurrentStateHash ?? null,
            reviewedFinalStateHash: jokerReleasePath?.jokerSummary?.reviewedFinalStateHash ?? null,
        },
        proofFlags: {
            freshLaunch: smoke?.freshLaunch === true,
            liveReplayRecording: recordedEvents > 0 && exportedEvents === recordedEvents,
            replayReviewOk: replayReview?.ok === true,
            noFixtureReplayGameplayDriver: smoke?.usedFixtureReplayAsGameplayDriver === false,
            noCheckpointStateReplacement: smoke?.usedCheckpointStateReplacement === false,
            bridgeMailboxSuccessful: allMailboxEventsPassed(mailboxEvents, {
                allowExpectedRejections: allowExpectedBridgeRejections,
                expectedRejectionCount: expectedBridgeRejectionCount,
                requireAuditedMailboxResponses: options.requireAuditedMailboxResponses,
            }),
            replayReleasePathOk:
                wrapper?.includeReplayReleasePath !== true || replayReleasePath?.ok === true,
            recoveryReleasePathOk:
                wrapper?.includeRecoveryReleasePath !== true || recoveryReleasePath?.ok === true,
            settingsReleasePathOk:
                wrapper?.includeSettingsReleasePath !== true || settingsReleasePath?.ok === true,
            chromeReleasePathOk:
                wrapper?.includeChromeReleasePath !== true || chromeReleasePath?.ok === true,
            replayReviewReleasePathOk:
                wrapper?.includeReplayReviewReleasePath !== true ||
                replayReviewReleasePath?.ok === true,
            invalidActionReleasePathOk:
                wrapper?.includeInvalidActionReleasePath !== true ||
                invalidActionReleasePath?.ok === true,
            peekModalReleasePathOk:
                wrapper?.includePeekModalReleasePath !== true || peekModalReleasePath?.ok === true,
            recoveryInvalidActionReleasePathOk:
                wrapper?.includeRecoveryInvalidActionReleasePath !== true ||
                recoveryInvalidActionReleasePath?.ok === true,
            privilegeCancelReleasePathOk:
                wrapper?.includePrivilegeCancelReleasePath !== true ||
                privilegeCancelReleasePath?.ok === true,
            reservedDiscardReleasePathOk:
                wrapper?.includeReservedDiscardReleasePath !== true ||
                reservedDiscardReleasePath?.ok === true,
            reservedBuyReleasePathOk:
                wrapper?.includeReservedBuyReleasePath !== true ||
                reservedBuyReleasePath?.ok === true,
            reserveCancelReleasePathOk:
                wrapper?.includeReserveCancelReleasePath !== true ||
                reserveCancelReleasePath?.ok === true,
            reserveDeckReleasePathOk:
                wrapper?.includeReserveDeckReleasePath !== true ||
                reserveDeckReleasePath?.ok === true,
            reserveDeckCancelReleasePathOk:
                wrapper?.includeReserveDeckCancelReleasePath !== true ||
                reserveDeckCancelReleasePath?.ok === true,
            jokerReleasePathOk:
                wrapper?.includeJokerReleasePath !== true || jokerReleasePath?.ok === true,
        },
        failureReason: failureReasons[0]?.reason ?? null,
        failures,
    };
};

const buildMatrix = async (options) => {
    const matrixFailures = [];
    if (options.reports.length === 0) {
        matrixFailures.push('At least one launcher report path is required.');
    }

    const duplicateReportPaths = duplicatePaths(
        options.reports.map((reportPath) => toRepoPath(reportPath))
    );

    const reports = [];
    for (const reportPath of options.reports) {
        try {
            const launcher = await readJson(reportPath);
            reports.push(validateReport(reportPath, launcher, options));
        } catch (error) {
            reports.push({
                path: toRepoPath(reportPath),
                status: 'failed',
                failures: [error instanceof Error ? error.message : String(error)],
            });
        }
    }

    const duplicateSmokeReportPaths = duplicatePaths(reports.map((report) => report.smokeReport));
    const duplicateStdoutLogPaths = duplicatePaths(reports.map((report) => report.stdout));
    const duplicateStderrLogPaths = duplicatePaths(reports.map((report) => report.stderr));
    const duplicatePlayerLogPaths = duplicatePaths(reports.map((report) => report.playerLog));
    const validMailboxAuditResponseCount = reports.reduce(
        (total, report) => total + (report.validMailboxAuditResponseCount ?? 0),
        0
    );
    const validMailboxAuditResponseDigestCount = reports.reduce(
        (total, report) => total + (report.validMailboxAuditResponseDigestCount ?? 0),
        0
    );

    const actionFamilies = uniqueSorted(reports.flatMap((report) => report.actionFamilies ?? []));
    const gameOverReports = reports.filter(
        (report) =>
            typeof report.productStateSummary?.winner === 'string' &&
            report.productStateSummary.winner.length > 0
    );
    const winners = uniqueSorted(
        gameOverReports.map((report) => report.productStateSummary?.winner)
    );
    const replayReleasePathCoverage = uniqueSorted(
        reports.flatMap((report) => report.replayReleasePath?.coverage ?? [])
    );
    const missingRequiredFamilies = options.requiredFamilies.filter(
        (family) => !actionFamilies.includes(family)
    );
    const missingRequiredGameOverWinners = options.requiredGameOverWinners.filter(
        (winner) => !winners.includes(winner)
    );
    for (const family of missingRequiredFamilies) {
        matrixFailures.push(`Required action family was not covered: ${family}`);
    }
    if (options.requiredReportCount > 0 && reports.length !== options.requiredReportCount) {
        matrixFailures.push(
            `Required built-player report count was not met: expected ${options.requiredReportCount}, found ${reports.length}.`
        );
    }
    if (
        options.requiredAuditedMailboxResponseDigestCount > 0 &&
        validMailboxAuditResponseDigestCount < options.requiredAuditedMailboxResponseDigestCount
    ) {
        matrixFailures.push(
            `Required audited mailbox response digest count was not met: expected at least ${options.requiredAuditedMailboxResponseDigestCount}, found ${validMailboxAuditResponseDigestCount}.`
        );
    }
    if (options.requireUniqueReportPaths) {
        for (const reportPath of duplicateReportPaths) {
            matrixFailures.push(
                `Duplicate built-player launcher report path supplied: ${reportPath}`
            );
        }
    }
    if (options.requireUniqueSmokeReportPaths) {
        for (const smokeReportPath of duplicateSmokeReportPaths) {
            matrixFailures.push(
                `Duplicate built-player nested smoke report path supplied: ${smokeReportPath}`
            );
        }
    }
    if (options.requireUniqueLogPaths) {
        for (const stdoutPath of duplicateStdoutLogPaths) {
            matrixFailures.push(`Duplicate built-player stdout log path supplied: ${stdoutPath}`);
        }
        for (const stderrPath of duplicateStderrLogPaths) {
            matrixFailures.push(`Duplicate built-player stderr log path supplied: ${stderrPath}`);
        }
        for (const playerLogPath of duplicatePlayerLogPaths) {
            matrixFailures.push(
                `Duplicate built-player player log path supplied: ${playerLogPath}`
            );
        }
    }
    for (const winner of missingRequiredGameOverWinners) {
        matrixFailures.push(`Required built-player game-over winner was not covered: ${winner}`);
    }
    if (
        options.requiredGameOverCount > 0 &&
        gameOverReports.length < options.requiredGameOverCount
    ) {
        matrixFailures.push(
            `Required built-player game-over report count was not met: expected at least ${options.requiredGameOverCount}, found ${gameOverReports.length}.`
        );
    }
    const draftReleasePathReports = reports.filter(
        (report) => report.draftReleasePath?.enabled === true
    );
    if (options.requireDraftReleasePath && draftReleasePathReports.length === 0) {
        matrixFailures.push('Required draft release-path proof was not covered.');
    }
    const replayReleasePathReports = reports.filter(
        (report) => report.replayReleasePath?.enabled === true
    );
    if (options.requireReplayReleasePath && replayReleasePathReports.length === 0) {
        matrixFailures.push('Required replay release-path proof was not covered.');
    }
    const recoveryReleasePathReports = reports.filter(
        (report) => report.recoveryReleasePath?.enabled === true
    );
    if (options.requireRecoveryReleasePath && recoveryReleasePathReports.length === 0) {
        matrixFailures.push('Required recovery release-path proof was not covered.');
    }
    const settingsReleasePathReports = reports.filter(
        (report) => report.settingsReleasePath?.enabled === true
    );
    if (options.requireSettingsReleasePath && settingsReleasePathReports.length === 0) {
        matrixFailures.push('Required settings release-path proof was not covered.');
    }
    const chromeReleasePathReports = reports.filter(
        (report) => report.chromeReleasePath?.enabled === true
    );
    if (options.requireChromeReleasePath && chromeReleasePathReports.length === 0) {
        matrixFailures.push('Required chrome release-path proof was not covered.');
    }
    const replayReviewReleasePathReports = reports.filter(
        (report) => report.replayReviewReleasePath?.enabled === true
    );
    if (options.requireReplayReviewReleasePath && replayReviewReleasePathReports.length === 0) {
        matrixFailures.push('Required replay review release-path proof was not covered.');
    }
    const invalidActionReleasePathReports = reports.filter(
        (report) => report.invalidActionReleasePath?.enabled === true
    );
    if (options.requireInvalidActionReleasePath && invalidActionReleasePathReports.length === 0) {
        matrixFailures.push('Required invalid-action release-path proof was not covered.');
    }
    const peekModalReleasePathReports = reports.filter(
        (report) => report.peekModalReleasePath?.enabled === true
    );
    if (options.requirePeekModalReleasePath && peekModalReleasePathReports.length === 0) {
        matrixFailures.push('Required peek-modal release-path proof was not covered.');
    }
    const recoveryInvalidActionReleasePathReports = reports.filter(
        (report) => report.recoveryInvalidActionReleasePath?.enabled === true
    );
    if (
        options.requireRecoveryInvalidActionReleasePath &&
        recoveryInvalidActionReleasePathReports.length === 0
    ) {
        matrixFailures.push('Required recovery invalid-action release-path proof was not covered.');
    }
    const privilegeCancelReleasePathReports = reports.filter(
        (report) => report.privilegeCancelReleasePath?.enabled === true
    );
    if (
        options.requirePrivilegeCancelReleasePath &&
        privilegeCancelReleasePathReports.length === 0
    ) {
        matrixFailures.push('Required privilege-cancel release-path proof was not covered.');
    }
    const reservedDiscardReleasePathReports = reports.filter(
        (report) => report.reservedDiscardReleasePath?.enabled === true
    );
    if (
        options.requireReservedDiscardReleasePath &&
        reservedDiscardReleasePathReports.length === 0
    ) {
        matrixFailures.push('Required reserved-discard release-path proof was not covered.');
    }
    const reservedBuyReleasePathReports = reports.filter(
        (report) => report.reservedBuyReleasePath?.enabled === true
    );
    if (options.requireReservedBuyReleasePath && reservedBuyReleasePathReports.length === 0) {
        matrixFailures.push('Required reserved-buy release-path proof was not covered.');
    }
    const reserveCancelReleasePathReports = reports.filter(
        (report) => report.reserveCancelReleasePath?.enabled === true
    );
    if (options.requireReserveCancelReleasePath && reserveCancelReleasePathReports.length === 0) {
        matrixFailures.push('Required reserve-cancel release-path proof was not covered.');
    }
    const reserveDeckReleasePathReports = reports.filter(
        (report) => report.reserveDeckReleasePath?.enabled === true
    );
    if (options.requireReserveDeckReleasePath && reserveDeckReleasePathReports.length === 0) {
        matrixFailures.push('Required reserve-deck release-path proof was not covered.');
    }
    const reserveDeckCancelReleasePathReports = reports.filter(
        (report) => report.reserveDeckCancelReleasePath?.enabled === true
    );
    if (
        options.requireReserveDeckCancelReleasePath &&
        reserveDeckCancelReleasePathReports.length === 0
    ) {
        matrixFailures.push('Required deck-reserve cancel release-path proof was not covered.');
    }
    const jokerReleasePathReports = reports.filter(
        (report) => report.jokerReleasePath?.enabled === true
    );
    if (options.requireJokerReleasePath && jokerReleasePathReports.length === 0) {
        matrixFailures.push('Required Joker release-path proof was not covered.');
    }

    const failedReports = reports.filter((report) => report.status !== 'passed');
    for (const report of failedReports) {
        for (const failure of report.failures ?? []) {
            matrixFailures.push(`${report.path}: ${failure}`);
        }
    }

    const passed = matrixFailures.length === 0;
    return {
        schemaVersion: 1,
        kind: 'unity-built-player-smoke-matrix',
        generatedAt: new Date().toISOString(),
        status: passed ? 'incomplete-evidence' : 'failed-check',
        statusReason: passed
            ? 'All supplied built-player reports passed validation, but this remains bounded LocalDev smoke evidence and does not close replacement-candidate gates.'
            : 'One or more built-player smoke reports failed validation.',
        check: {
            passed,
            requiredFamilies: options.requiredFamilies,
            missingRequiredFamilies,
            requiredReportCount: options.requiredReportCount,
            requireUniqueReportPaths: options.requireUniqueReportPaths,
            duplicateReportPaths,
            requireUniqueSmokeReportPaths: options.requireUniqueSmokeReportPaths,
            duplicateSmokeReportPaths,
            requireUniqueLogPaths: options.requireUniqueLogPaths,
            duplicateStdoutLogPaths,
            duplicateStderrLogPaths,
            duplicatePlayerLogPaths,
            requiredGameOverCount: options.requiredGameOverCount,
            requiredGameOverWinners: options.requiredGameOverWinners,
            missingRequiredGameOverWinners,
            gameOverReportCount: gameOverReports.length,
            requireAuditedMailboxResponses: options.requireAuditedMailboxResponses,
            requireAuditedMailboxResponseDigests: options.requireAuditedMailboxResponseDigests,
            requiredAuditedMailboxResponseDigestCount:
                options.requiredAuditedMailboxResponseDigestCount,
            requireLauncherArgs: options.requireLauncherArgs,
            requireDraftReleasePath: options.requireDraftReleasePath,
            requireReplayReleasePathNoMutation: options.requireReplayReleasePathNoMutation,
            validMailboxAuditResponseCount,
            validMailboxAuditResponseDigestCount,
            failureCount: matrixFailures.length,
            failures: matrixFailures,
            requireReplayReleasePath: options.requireReplayReleasePath,
            requireRecoveryReleasePath: options.requireRecoveryReleasePath,
            requireSettingsReleasePath: options.requireSettingsReleasePath,
            requireChromeReleasePath: options.requireChromeReleasePath,
            requireReplayReviewReleasePath: options.requireReplayReviewReleasePath,
            requireInvalidActionReleasePath: options.requireInvalidActionReleasePath,
            requirePeekModalReleasePath: options.requirePeekModalReleasePath,
            requireRecoveryInvalidActionReleasePath:
                options.requireRecoveryInvalidActionReleasePath,
            requirePrivilegeCancelReleasePath: options.requirePrivilegeCancelReleasePath,
            requireReservedDiscardReleasePath: options.requireReservedDiscardReleasePath,
            requireReservedBuyReleasePath: options.requireReservedBuyReleasePath,
            requireReserveCancelReleasePath: options.requireReserveCancelReleasePath,
            requireReserveDeckReleasePath: options.requireReserveDeckReleasePath,
            requireReserveDeckCancelReleasePath: options.requireReserveDeckCancelReleasePath,
            requireJokerReleasePath: options.requireJokerReleasePath,
        },
        summary: {
            reportCount: reports.length,
            passedReportCount: reports.filter((report) => report.status === 'passed').length,
            totalCommandCount: reports.reduce(
                (total, report) => total + (report.commandCount ?? 0),
                0
            ),
            totalMailboxEventCount: reports.reduce(
                (total, report) => total + (report.mailboxEventCount ?? 0),
                0
            ),
            totalAuditedMailboxResponseCount: reports.reduce(
                (total, report) => total + (report.auditedMailboxResponseCount ?? 0),
                0
            ),
            totalValidMailboxAuditResponseCount: reports.reduce(
                (total, report) => total + (report.validMailboxAuditResponseCount ?? 0),
                0
            ),
            totalValidMailboxAuditResponseDigestCount: validMailboxAuditResponseDigestCount,
            totalSuccessfulMailboxResponseCount: reports.reduce(
                (total, report) => total + (report.successfulMailboxResponseCount ?? 0),
                0
            ),
            seeds: uniqueSorted(reports.map((report) => report.seed)),
            idleActionPreferences: uniqueSorted(
                reports.map((report) => report.idleActionPreference)
            ),
            actionFamilies,
            gameOverReportCount: gameOverReports.length,
            winners,
            draftReleasePathReportCount: draftReleasePathReports.length,
            replayReleasePathReportCount: replayReleasePathReports.length,
            recoveryReleasePathReportCount: recoveryReleasePathReports.length,
            settingsReleasePathReportCount: settingsReleasePathReports.length,
            chromeReleasePathReportCount: chromeReleasePathReports.length,
            replayReviewReleasePathReportCount: replayReviewReleasePathReports.length,
            invalidActionReleasePathReportCount: invalidActionReleasePathReports.length,
            peekModalReleasePathReportCount: peekModalReleasePathReports.length,
            recoveryInvalidActionReleasePathReportCount:
                recoveryInvalidActionReleasePathReports.length,
            privilegeCancelReleasePathReportCount: privilegeCancelReleasePathReports.length,
            reservedDiscardReleasePathReportCount: reservedDiscardReleasePathReports.length,
            reservedBuyReleasePathReportCount: reservedBuyReleasePathReports.length,
            reserveCancelReleasePathReportCount: reserveCancelReleasePathReports.length,
            reserveDeckReleasePathReportCount: reserveDeckReleasePathReports.length,
            reserveDeckCancelReleasePathReportCount: reserveDeckCancelReleasePathReports.length,
            jokerReleasePathReportCount: jokerReleasePathReports.length,
            replayReleasePathCoverage,
            finalStateHashes: uniqueSorted(
                reports.map((report) => report.productStateSummary?.stateHash)
            ),
            gameOverFinalStateHashes: uniqueSorted(
                gameOverReports.map((report) => report.productStateSummary?.stateHash)
            ),
            draftFinalStateHashes: uniqueSorted(
                reports.map((report) => report.draftReleasePath?.controllerCurrentStateHash)
            ),
            recoveryFinalStateHashes: uniqueSorted(
                reports.map((report) => report.recoveryReleasePath?.continuedStateHash)
            ),
            settingsPersistencePaths: uniqueSorted(
                reports.map((report) => report.settingsReleasePath?.path)
            ),
            chromeRestartHashes: uniqueSorted(
                reports.map((report) => report.chromeReleasePath?.restartedCommandHash)
            ),
            replayReviewFinalHashes: uniqueSorted(
                reports.map((report) => report.replayReviewReleasePath?.returnedFinalHash)
            ),
            invalidActionFinalHashes: uniqueSorted(
                reports.map((report) => report.invalidActionReleasePath?.productStateHash)
            ),
            peekModalFinalHashes: uniqueSorted(
                reports.map((report) => report.peekModalReleasePath?.controllerCurrentStateHash)
            ),
            recoveryInvalidActionFinalHashes: uniqueSorted(
                reports.map((report) => report.recoveryInvalidActionReleasePath?.continuedStateHash)
            ),
            privilegeCancelFinalHashes: uniqueSorted(
                reports.map(
                    (report) => report.privilegeCancelReleasePath?.controllerCurrentStateHash
                )
            ),
            reservedDiscardFinalHashes: uniqueSorted(
                reports.map(
                    (report) => report.reservedDiscardReleasePath?.controllerCurrentStateHash
                )
            ),
            reservedBuyFinalHashes: uniqueSorted(
                reports.map((report) => report.reservedBuyReleasePath?.controllerCurrentStateHash)
            ),
            reserveCancelFinalHashes: uniqueSorted(
                reports.map((report) => report.reserveCancelReleasePath?.controllerCurrentStateHash)
            ),
            reserveDeckFinalHashes: uniqueSorted(
                reports.map((report) => report.reserveDeckReleasePath?.controllerCurrentStateHash)
            ),
            reserveDeckCancelFinalHashes: uniqueSorted(
                reports.map(
                    (report) => report.reserveDeckCancelReleasePath?.controllerCurrentStateHash
                )
            ),
            jokerFinalHashes: uniqueSorted(
                reports.map((report) => report.jokerReleasePath?.controllerCurrentStateHash)
            ),
            stdoutLogs: uniqueSorted(reports.map((report) => report.stdout)),
            stderrLogs: uniqueSorted(reports.map((report) => report.stderr)),
            playerLogs: uniqueSorted(reports.map((report) => report.playerLog)),
        },
        reports,
        remainingBlockers: [
            'Bounded built-player LocalDev smoke coverage is not arbitrary full product-surface Local PvP coverage.',
            'TypeScriptGameRulesEngine remains a LocalDev/evidence bridge; release-runtime packaging is unresolved.',
            'LAN route is not migrated or user-approved excluded.',
            'Online route is not migrated or user-approved excluded.',
            'Visual Lab route is not migrated or user-approved excluded.',
        ],
    };
};

const run = async () => {
    const options = parseArgs();
    const matrix = await buildMatrix(options);
    await mkdir(path.dirname(options.out), { recursive: true });
    await writeFile(options.out, `${JSON.stringify(matrix, null, 4)}\n`, 'utf8');
    process.stdout.write(
        `${JSON.stringify({ out: toRepoPath(options.out), ...matrix.summary, status: matrix.status }, null, 4)}\n`
    );

    if (options.check && !matrix.check.passed) {
        process.stderr.write(`${matrix.check.failures.join('\n')}\n`);
        process.exit(1);
    }
};

run().catch((error) => {
    process.stderr.write(`${error instanceof Error ? error.stack : String(error)}\n`);
    process.exit(1);
});
