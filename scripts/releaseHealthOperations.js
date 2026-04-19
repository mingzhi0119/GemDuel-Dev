import { getReleaseHealthIndicatorKeys } from './releaseHealthChecklist.js';

export const RELEASE_HEALTH_OPERATION_SCHEMA_VERSION = 1;
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
        issues.push('OPERATIONS_SLO.md must document every release-health indicator.');
    }

    if (!hasAllExpectedValues(drillText, REQUIRED_FAULT_DRILL_IDS)) {
        issues.push(
            'OPERATIONS_FAULT_DRILLS.md must document updater-fail, ipc-reject, and network-recovery drills.'
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
            issues.push(`OPERATIONS_SLO.md must mention ${indicatorKey}.`);
        }

        if (!sloText.includes(stateDescription)) {
            issues.push(
                `OPERATIONS_SLO.md must explain the ${stateDescription} threshold for ${indicatorKey}.`
            );
        }
    }

    issues.push(...collectThresholdErrors(operationsSnapshot));
    issues.push(...collectDrillErrors(sloText, drillText, operationsSnapshot));

    return issues;
};
