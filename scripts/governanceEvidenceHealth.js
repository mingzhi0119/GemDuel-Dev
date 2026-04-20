import fs from 'node:fs';
import path from 'node:path';

export const MIN_GOVERNANCE_EVIDENCE_RETENTION_DAYS = 30;
export const DEFAULT_ALLOWED_WARNING_INDICATORS = Object.freeze(['recoveryRequests']);

const isPlainObject = (value) =>
    Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const resolveReportPath = ({ artifactsDir, repoRoot, declaredPath }) => {
    const candidates = [
        path.resolve(repoRoot, declaredPath),
        path.resolve(artifactsDir, declaredPath),
        path.resolve(artifactsDir, path.basename(declaredPath)),
    ];

    return candidates.find((candidate) => fs.existsSync(candidate)) ?? null;
};

export const loadGovernanceEvidence = ({
    artifactsDir,
    repoRoot = process.cwd(),
    manifestFileName = 'governance-evidence.manifest.json',
}) => {
    const manifestPath = path.join(artifactsDir, manifestFileName);
    if (!fs.existsSync(manifestPath)) {
        throw new Error(`Governance evidence manifest is missing at ${manifestPath}.`);
    }

    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    const reports = {};

    for (const reportEntry of manifest?.release?.releaseHealthReports ?? []) {
        if (typeof reportEntry?.path !== 'string' || reportEntry.path.length === 0) {
            continue;
        }

        const resolvedPath = resolveReportPath({
            artifactsDir,
            repoRoot,
            declaredPath: reportEntry.path,
        });
        reports[reportEntry.path] = resolvedPath
            ? JSON.parse(fs.readFileSync(resolvedPath, 'utf8'))
            : null;
    }

    return {
        manifest,
        reports,
    };
};

const isAllowedWarningAlert = (alert, allowedWarningIndicators) =>
    alert?.status === 'warning' && allowedWarningIndicators.has(alert.indicator);

const describeAlert = (alert) => `${alert.indicator}:${alert.status}:${alert.value}`;

export const collectGovernanceEvidenceHealthErrors = ({
    manifest,
    reports,
    minimumRetentionDays = MIN_GOVERNANCE_EVIDENCE_RETENTION_DAYS,
    allowedWarningIndicators = DEFAULT_ALLOWED_WARNING_INDICATORS,
}) => {
    const issues = [];

    if (!isPlainObject(manifest)) {
        return ['Governance evidence manifest must be a JSON object.'];
    }

    const artifactPolicy = manifest.artifactPolicy;
    if (!isPlainObject(artifactPolicy)) {
        issues.push('Governance evidence manifest must define artifactPolicy.');
    } else {
        if (artifactPolicy.artifactName !== 'governance-evidence') {
            issues.push(
                'Governance evidence manifest must retain the governance-evidence artifact name.'
            );
        }

        if (
            !Number.isInteger(artifactPolicy.retentionDays) ||
            artifactPolicy.retentionDays < minimumRetentionDays
        ) {
            issues.push(
                `Governance evidence retention must be at least ${minimumRetentionDays} days.`
            );
        }
    }

    const releaseHealthReports = manifest?.release?.releaseHealthReports;
    if (!Array.isArray(releaseHealthReports) || releaseHealthReports.length === 0) {
        issues.push('Governance evidence manifest must enumerate releaseHealthReports.');
        return issues;
    }

    const governedReports = releaseHealthReports.filter(
        (entry) => (entry?.expectedStatus ?? null) === 'healthy' || entry?.expectedStatus == null
    );

    if (governedReports.length === 0) {
        issues.push(
            'Governance evidence manifest must include at least one governed healthy release-health report.'
        );
        return issues;
    }

    const allowedWarningIndicatorSet = new Set(allowedWarningIndicators);

    for (const reportEntry of governedReports) {
        const reportPath = reportEntry?.path;
        const reportLabel = reportEntry?.id ?? reportPath ?? '<unknown-report>';

        if (typeof reportPath !== 'string' || reportPath.length === 0) {
            issues.push(`Governance evidence report ${reportLabel} must define a path.`);
            continue;
        }

        const report = reports?.[reportPath] ?? null;
        if (!isPlainObject(report)) {
            issues.push(`Governance evidence report ${reportLabel} is missing from the artifact.`);
            continue;
        }

        if (!Array.isArray(report.alerts) || report.alerts.length === 0) {
            issues.push(`Governance evidence report ${reportLabel} must expose alert entries.`);
            continue;
        }

        const breachedAlerts = report.alerts.filter(
            (alert) =>
                alert?.status !== 'healthy' &&
                !isAllowedWarningAlert(alert, allowedWarningIndicatorSet)
        );
        if (breachedAlerts.length > 0) {
            issues.push(
                `Governance evidence report ${reportLabel} contains non-healthy indicators: ${breachedAlerts
                    .map(describeAlert)
                    .join(', ')}.`
            );
        }

        if (report.status === 'incident') {
            issues.push(`Governance evidence report ${reportLabel} is in incident state.`);
        }
    }

    return issues;
};
