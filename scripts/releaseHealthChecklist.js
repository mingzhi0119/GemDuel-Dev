import { createReleaseHealthMonitor } from '../electron/releaseHealth.js';

export const REQUIRED_RELEASE_CHECKLIST_COMMANDS = Object.freeze([
    'npm run lint',
    'npm test',
    'npm run test:security',
    'npm run test:coverage',
    'npm run desktop:check',
    'npm run release:check',
]);

const noop = () => undefined;
const SNAPSHOT_LOGGER = Object.freeze({
    info: noop,
    warn: noop,
    error: noop,
});

export const getReleaseHealthIndicatorKeys = () =>
    Object.keys(
        createReleaseHealthMonitor({
            logger: SNAPSHOT_LOGGER,
        }).getSnapshot().indicators
    );

export const collectReleaseHealthChecklistErrors = (checklistText) => {
    const issues = [];

    for (const command of REQUIRED_RELEASE_CHECKLIST_COMMANDS) {
        if (!checklistText.includes(`\`${command}\``)) {
            issues.push(`Missing required checklist command ${command}.`);
        }
    }

    for (const indicatorKey of getReleaseHealthIndicatorKeys()) {
        if (!checklistText.includes(`\`${indicatorKey}\``)) {
            issues.push(`Missing release-health indicator ${indicatorKey}.`);
        }
    }

    if (!checklistText.includes('`OPERATIONS_SLO.md`')) {
        issues.push('Checklist must link to the release-health SLO document.');
    }

    if (!checklistText.includes('`OPERATIONS_FAULT_DRILLS.md`')) {
        issues.push('Checklist must link to the fault drill runbook.');
    }

    if (!checklistText.includes('`scripts/export-release-health-report.mjs`')) {
        issues.push('Checklist must document the release-health report export script.');
    }

    if (!checklistText.includes('`scripts/export-governance-artifacts.mjs`')) {
        issues.push('Checklist must document the retained governance artifact export script.');
    }

    if (!checklistText.includes('`window.electron.getReleaseHealthSnapshot()`')) {
        issues.push(
            'Checklist must document how operators fetch the sanitized release-health snapshot.'
        );
    }

    return issues;
};
