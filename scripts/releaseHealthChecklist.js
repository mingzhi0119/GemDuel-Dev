import { createReleaseHealthMonitor } from '../electron/releaseHealth.js';

export const REQUIRED_RELEASE_CHECKLIST_COMMANDS = Object.freeze([
    'npm run lint',
    'npm test',
    'npm run test:security',
    'npm run test:coverage',
    'npm run desktop:check',
    'npm run release:check',
]);

export const getReleaseHealthIndicatorKeys = () =>
    Object.keys(
        createReleaseHealthMonitor({
            logger: {
                info: () => undefined,
                warn: () => undefined,
                error: () => undefined,
            },
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

    if (!checklistText.includes('`window.electron.getReleaseHealthSnapshot()`')) {
        issues.push(
            'Checklist must document how operators fetch the sanitized release-health snapshot.'
        );
    }

    return issues;
};
