import fs from 'node:fs';
import path from 'node:path';
import { getReleaseHealthIndicatorKeys } from './releaseHealthChecklist.js';
import { GOVERNANCE_DOC_PATHS } from './governanceDocPaths.js';

export const RELEASE_HEALTH_OPERATION_SCHEMA_VERSION = 2;
export const REQUIRED_RELEASE_HEALTH_SOURCE_FORMATS = Object.freeze([
    'release-health-summary',
    'release-health-jsonl',
]);
export const REQUIRED_FAULT_DRILL_IDS = Object.freeze([
    'updater-fail',
    'ipc-reject',
    'network-recovery',
]);

const REQUIRED_FAULT_DRILL_EVENTS = Object.freeze({
    'updater-fail': 'UPDATER_CHECK_FAILED',
    'ipc-reject': 'IPC_REQUEST_REJECTED',
    'network-recovery': 'RECOVERY_REQUEST_SENT',
});

const REQUIRED_FAULT_DRILL_INDICATORS = Object.freeze({
    'updater-fail': 'updaterFailures',
    'ipc-reject': 'ipcRejected',
    'network-recovery': 'recoveryRequests',
});

const REQUIRED_ARTIFACT_REPORT_IDS = Object.freeze([
    'healthy-baseline',
    'updater-fail',
    'ipc-reject',
    'network-recovery',
]);

const REQUIRED_SLO_STATE_DESCRIPTIONS = Object.freeze({
    startupFailures: 'incident',
    runtimeConfigFailures: 'incident',
    updaterFailures: 'incident',
    peerFailures: 'incident',
    recoveryRequests: 'warning',
    ipcRejected: 'incident',
});

const hasAllExpectedValues = (text, expectedValues) =>
    expectedValues.every((value) => text.includes(`\`${value}\``));

const collectArtifactPolicyErrors = (sloText, operationsSnapshot, repoRoot) => {
    const issues = [];
    const artifactPolicy = operationsSnapshot?.artifactPolicy;
    const artifactReports = operationsSnapshot?.artifactReports ?? [];

    if (!artifactPolicy || typeof artifactPolicy !== 'object') {
        issues.push('Release-health operations snapshot must define an artifactPolicy block.');
        return issues;
    }

    if (
        typeof artifactPolicy.artifactName !== 'string' ||
        artifactPolicy.artifactName.length === 0
    ) {
        issues.push('artifactPolicy.artifactName must be a non-empty string.');
    }

    if (
        typeof artifactPolicy.outputDirectory !== 'string' ||
        artifactPolicy.outputDirectory.length === 0
    ) {
        issues.push('artifactPolicy.outputDirectory must be a non-empty string.');
    }

    if (
        typeof artifactPolicy.retentionDays !== 'number' ||
        !Number.isInteger(artifactPolicy.retentionDays) ||
        artifactPolicy.retentionDays <= 0
    ) {
        issues.push('artifactPolicy.retentionDays must be a positive integer.');
    }

    if (typeof artifactPolicy.storageKind !== 'string' || artifactPolicy.storageKind.length === 0) {
        issues.push('artifactPolicy.storageKind must be a non-empty string.');
    }

    if (!Array.isArray(artifactReports) || artifactReports.length === 0) {
        issues.push('Release-health operations snapshot must define artifactReports.');
        return issues;
    }

    for (const reportId of REQUIRED_ARTIFACT_REPORT_IDS) {
        const report = artifactReports.find((entry) => entry?.id === reportId);
        if (!report) {
            issues.push(`Missing governed release-health artifact report ${reportId}.`);
            continue;
        }

        if (typeof report.sourcePath !== 'string' || report.sourcePath.length === 0) {
            issues.push(`Artifact report ${reportId} must define sourcePath.`);
        } else if (!repoRoot) {
            continue;
        } else {
            const absolutePath = path.join(repoRoot, report.sourcePath);
            if (!fs.existsSync(absolutePath)) {
                issues.push(
                    `Artifact report ${reportId} references missing source ${report.sourcePath}.`
                );
            }
        }

        if (typeof report.expectedStatus !== 'string' || report.expectedStatus.length === 0) {
            issues.push(`Artifact report ${reportId} must define expectedStatus.`);
        }
    }

    if (!sloText.includes(`\`${artifactPolicy.artifactName}\``)) {
        issues.push(
            `${GOVERNANCE_DOC_PATHS.operationsSlo} must mention artifact ${artifactPolicy.artifactName}.`
        );
    }

    if (!sloText.includes(`\`${artifactPolicy.retentionDays}\``)) {
        issues.push(
            `${GOVERNANCE_DOC_PATHS.operationsSlo} must mention retention window ${artifactPolicy.retentionDays}.`
        );
    }

    return issues;
};

const collectBundleBudgetErrors = (sloText, operationsSnapshot) => {
    const issues = [];
    const mainChunkBudget = operationsSnapshot?.bundleBudgets?.mainChunkKb;

    if (!mainChunkBudget) {
        issues.push('Release-health operations snapshot must define bundleBudgets.mainChunkKb.');
        return issues;
    }

    if (
        typeof mainChunkBudget.warningMax !== 'number' ||
        typeof mainChunkBudget.incidentMax !== 'number'
    ) {
        issues.push('bundleBudgets.mainChunkKb must define numeric warningMax and incidentMax.');
    } else if (mainChunkBudget.warningMax > mainChunkBudget.incidentMax) {
        issues.push('bundleBudgets.mainChunkKb must keep warningMax at or below incidentMax.');
    }

    if (!sloText.includes('`mainChunkKb`')) {
        issues.push(
            `${GOVERNANCE_DOC_PATHS.operationsSlo} must mention the mainChunkKb bundle budget.`
        );
    }

    return issues;
};

const collectThresholdErrors = (snapshot) => {
    const issues = [];
    const indicatorKeys = getReleaseHealthIndicatorKeys();
    const thresholds = snapshot?.indicatorThresholds ?? {};

    for (const indicatorKey of indicatorKeys) {
        if (!thresholds[indicatorKey]) {
            issues.push(`Missing alert threshold for release-health indicator ${indicatorKey}.`);
            continue;
        }

        const { warningMax, incidentMax } = thresholds[indicatorKey];
        if (typeof warningMax !== 'number' || typeof incidentMax !== 'number') {
            issues.push(
                `Indicator threshold ${indicatorKey} must define numeric warningMax and incidentMax.`
            );
            continue;
        }

        if (warningMax > incidentMax) {
            issues.push(
                `Indicator threshold ${indicatorKey} must keep warningMax at or below incidentMax.`
            );
        }
    }

    for (const indicatorKey of Object.keys(thresholds)) {
        if (!indicatorKeys.includes(indicatorKey)) {
            issues.push(`Snapshot contains unknown release-health indicator ${indicatorKey}.`);
        }
    }

    return issues;
};

const collectDrillErrors = (sloText, drillText, snapshot) => {
    const issues = [];
    const drills = snapshot?.drills ?? [];

    if (!hasAllExpectedValues(sloText, getReleaseHealthIndicatorKeys())) {
        issues.push(
            `${GOVERNANCE_DOC_PATHS.operationsSlo} must document every release-health indicator.`
        );
    }

    if (!hasAllExpectedValues(drillText, REQUIRED_FAULT_DRILL_IDS)) {
        issues.push(
            `${GOVERNANCE_DOC_PATHS.operationsFaultDrills} must document updater-fail, ipc-reject, and network-recovery drills.`
        );
    }

    for (const drillId of REQUIRED_FAULT_DRILL_IDS) {
        const drill = drills.find((entry) => entry?.id === drillId);
        if (!drill) {
            issues.push(`Missing machine-readable drill entry ${drillId}.`);
            continue;
        }

        if (drill.signal !== REQUIRED_FAULT_DRILL_EVENTS[drillId]) {
            issues.push(
                `Drill ${drillId} must capture ${REQUIRED_FAULT_DRILL_EVENTS[drillId]} in the snapshot.`
            );
        }

        if (drill.expectedIndicator !== REQUIRED_FAULT_DRILL_INDICATORS[drillId]) {
            issues.push(
                `Drill ${drillId} must align to indicator ${REQUIRED_FAULT_DRILL_INDICATORS[drillId]}.`
            );
        }
    }

    return issues;
};

export const collectReleaseHealthOperationsErrors = ({
    sloText,
    drillText,
    operationsSnapshot,
    repoRoot = process.cwd(),
}) => {
    const issues = [];

    if (operationsSnapshot?.schemaVersion !== RELEASE_HEALTH_OPERATION_SCHEMA_VERSION) {
        issues.push(
            `Release-health operations snapshot must stay at schema version ${RELEASE_HEALTH_OPERATION_SCHEMA_VERSION}.`
        );
    }

    if (!Array.isArray(operationsSnapshot?.sourceFormats)) {
        issues.push('Release-health operations snapshot must expose supported source formats.');
    } else {
        for (const format of REQUIRED_RELEASE_HEALTH_SOURCE_FORMATS) {
            if (!operationsSnapshot.sourceFormats.includes(format)) {
                issues.push(
                    `Release-health operations snapshot is missing source format ${format}.`
                );
            }
        }
    }

    if (operationsSnapshot?.reportVersion !== 1) {
        issues.push('Release-health operations snapshot must document reportVersion 1.');
    }

    for (const [indicatorKey, stateDescription] of Object.entries(
        REQUIRED_SLO_STATE_DESCRIPTIONS
    )) {
        if (!sloText.includes(`\`${indicatorKey}\``)) {
            issues.push(`${GOVERNANCE_DOC_PATHS.operationsSlo} must mention ${indicatorKey}.`);
        }

        if (!sloText.includes(stateDescription)) {
            issues.push(
                `${GOVERNANCE_DOC_PATHS.operationsSlo} must explain the ${stateDescription} threshold for ${indicatorKey}.`
            );
        }
    }

    issues.push(...collectThresholdErrors(operationsSnapshot));
    issues.push(...collectDrillErrors(sloText, drillText, operationsSnapshot));
    issues.push(...collectArtifactPolicyErrors(sloText, operationsSnapshot, repoRoot));
    issues.push(...collectBundleBudgetErrors(sloText, operationsSnapshot));

    return issues;
};
