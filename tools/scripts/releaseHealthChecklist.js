import { createReleaseHealthMonitor } from '../../apps/desktop/electron/releaseHealth.js';
import { GOVERNANCE_DOC_PATHS } from './governanceDocPaths.js';
import { collectReleaseTagProvenanceErrors } from './releaseTagProvenance.js';

export const REQUIRED_RELEASE_CHECKLIST_COMMANDS = Object.freeze([
    'pnpm lint',
    'pnpm test',
    'pnpm test:security',
    'pnpm test:coverage',
    'pnpm desktop:check',
    'pnpm release:check',
    'pnpm release:provenance:check',
    'pnpm repo-settings:check',
    'pnpm codeowners:check',
    'pnpm changelog:check',
    'pnpm audit:gates',
    'pnpm bench',
    'pnpm governance:report',
    'pnpm lifecycle:certify',
    'pnpm governance:evidence:check',
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

    if (!checklistText.includes(`\`${GOVERNANCE_DOC_PATHS.operationsSlo}\``)) {
        issues.push('Checklist must link to the release-health SLO document.');
    }

    if (!checklistText.includes(`\`${GOVERNANCE_DOC_PATHS.operationsFaultDrills}\``)) {
        issues.push('Checklist must link to the fault drill runbook.');
    }

    if (!checklistText.includes('`tools/scripts/export-release-health-report.mjs`')) {
        issues.push('Checklist must document the release-health report export script.');
    }

    if (!checklistText.includes('`tools/scripts/export-governance-artifacts.mjs`')) {
        issues.push('Checklist must document the retained governance artifact export script.');
    }

    if (!checklistText.includes('`window.electron.getReleaseHealthSnapshot()`')) {
        issues.push(
            'Checklist must document how operators fetch the sanitized release-health snapshot.'
        );
    }

    return issues;
};

export const collectReleaseChecklistProvenanceErrors = ({
    commitSha,
    defaultBranch,
    releaseRef,
    git,
}) => {
    if (typeof releaseRef !== 'string' || !releaseRef.startsWith('refs/tags/')) {
        return [];
    }

    return collectReleaseTagProvenanceErrors({
        commitSha,
        defaultBranch,
        releaseRef,
        git,
    });
};
