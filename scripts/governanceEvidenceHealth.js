import fs from 'node:fs';
import path from 'node:path';
import { buildReleaseHealthReport } from './releaseHealthReport.js';

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

const buildComparableAlertMap = (alerts) =>
    new Map(
        (Array.isArray(alerts) ? alerts : []).map((alert) => [
            alert.indicator,
            {
                value: alert.value ?? null,
                status: alert.status ?? null,
                warningMax: alert.warningMax ?? null,
                incidentMax: alert.incidentMax ?? null,
            },
        ])
    );

const collectReleaseHealthReportDriftErrors = ({ report, expectedReport, reportLabel }) => {
    const issues = [];

    if (report.status !== expectedReport.status) {
        issues.push(
            `Governance evidence report ${reportLabel} declared status ${report.status} but recomputed as ${expectedReport.status}.`
        );
    }

    const actualAlerts = buildComparableAlertMap(report.alerts);
    const expectedAlerts = buildComparableAlertMap(expectedReport.alerts);

    for (const [indicator, expectedAlert] of expectedAlerts) {
        const actualAlert = actualAlerts.get(indicator);
        if (!actualAlert) {
            issues.push(`Governance evidence report ${reportLabel} is missing alert ${indicator}.`);
            continue;
        }

        if (
            actualAlert.value !== expectedAlert.value ||
            actualAlert.status !== expectedAlert.status ||
            actualAlert.warningMax !== expectedAlert.warningMax ||
            actualAlert.incidentMax !== expectedAlert.incidentMax
        ) {
            issues.push(`Governance evidence report ${reportLabel} drifted on alert ${indicator}.`);
        }
    }

    for (const indicator of actualAlerts.keys()) {
        if (!expectedAlerts.has(indicator)) {
            issues.push(
                `Governance evidence report ${reportLabel} declared unexpected alert ${indicator}.`
            );
        }
    }

    return issues;
};

export const collectGovernanceEvidenceHealthErrors = ({
    manifest,
    reports,
    operationsSnapshot = {},
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

    const allowedWarningIndicatorSet = new Set(allowedWarningIndicators);

    const governedReports = releaseHealthReports.filter(
        (entry) => entry?.expectedStatus == null || entry?.expectedStatus === 'healthy'
    );
    if (governedReports.length === 0) {
        issues.push(
            'Governance evidence manifest must include at least one governed healthy release-health report.'
        );
    }

    for (const reportEntry of releaseHealthReports) {
        const reportPath = reportEntry?.path;
        const reportLabel = reportEntry?.id ?? reportPath ?? '<unknown-report>';
        const expectedStatus = reportEntry?.expectedStatus ?? 'healthy';

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

        if (!isPlainObject(report.summary)) {
            issues.push(`Governance evidence report ${reportLabel} must expose a summary object.`);
            continue;
        }

        const expectedReport = buildReleaseHealthReport({
            source: {
                kind: report.source?.kind ?? 'summary',
                summaryProvided: true,
                events: [],
                summary: report.summary,
            },
            operationsSnapshot,
            generatedAt: report.generatedAt ?? new Date().toISOString(),
            provenance: report.provenance ?? {},
            retention: report.retention ?? null,
            sourcePath: report.source?.path ?? null,
            drillLabel: report.drillLabel ?? null,
        });

        issues.push(
            ...collectReleaseHealthReportDriftErrors({
                report,
                expectedReport,
                reportLabel,
            })
        );

        const breachedAlerts = expectedReport.alerts.filter(
            (alert) =>
                alert.status !== 'healthy' &&
                !isAllowedWarningAlert(alert, allowedWarningIndicatorSet)
        );

        if (expectedStatus === 'healthy') {
            if (breachedAlerts.length > 0) {
                issues.push(
                    `Governance evidence report ${reportLabel} contains non-healthy indicators: ${breachedAlerts
                        .map(describeAlert)
                        .join(', ')}.`
                );
            }

            if (expectedReport.status === 'incident') {
                issues.push(`Governance evidence report ${reportLabel} is in incident state.`);
            }
            continue;
        }

        if (expectedStatus === 'warning' || expectedStatus === 'incident') {
            if (expectedReport.status !== expectedStatus) {
                issues.push(
                    `Governance evidence report ${reportLabel} expected status ${expectedStatus} but recomputed as ${expectedReport.status}.`
                );
            }
        }
    }

    return issues;
};
