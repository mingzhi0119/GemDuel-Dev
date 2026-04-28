import fs from 'node:fs';
import path from 'node:path';

const DEFAULT_EVIDENCE_PREFIX = 'artifacts/governance';

const BASE_COMMANDS = Object.freeze(['pnpm lifecycle:certify', 'pnpm governance:artifacts']);

const METRIC_EXTRA_COMMANDS = Object.freeze({
    'gate-status': ['pnpm audit:gates', 'pnpm governance:report'],
    'coverage-branch': ['pnpm test:coverage'],
    'coverage-perfile-key-modules': ['pnpm coverage:perfile-modules', 'pnpm test:coverage'],
    'architecture-warnings': ['pnpm architecture:check'],
    'seal-exclusions': ['pnpm seal-exclusions:check'],
    'release-changelog': ['pnpm changelog:check'],
    'dependency-sbom': ['pnpm sbom:check', 'pnpm licenses:check'],
    'bundle-budget': ['pnpm bundle:check', 'pnpm build'],
    'lifecycle-benchmarks': ['pnpm bench'],
});

const escapeMdCell = (value) =>
    String(value ?? '')
        .replace(/\|/g, '\\|')
        .replace(/\r?\n/g, ' ');

const uniqueCommands = (commands) => [...new Set(commands.filter(Boolean))];

const suggestCommandsForMetric = (metricId) =>
    uniqueCommands([...(METRIC_EXTRA_COMMANDS[metricId] ?? []), ...BASE_COMMANDS]);

/**
 * @param {{
 *   auditGateReport?: { errors?: string[] };
 *   lifecycleReport?: { status?: string; issues?: string[] };
 *   dashboardReport?: {
 *     metrics?: Array<{
 *       id: string;
 *       title?: string;
 *       status?: string;
 *       value?: string;
 *       evidenceRefs?: string[];
 *     }>;
 *     errors?: string[];
 *   };
 *   certificationReport?: {
 *     errors?: string[];
 *     scorecard?: Array<{ id: string; title?: string; failures?: string[] }>;
 *   };
 *   evidencePrefix?: string;
 * }} input
 */
export const buildLifecycleFailureSummaryMarkdown = ({
    auditGateReport = {},
    lifecycleReport = {},
    dashboardReport = {},
    certificationReport = {},
    evidencePrefix = DEFAULT_EVIDENCE_PREFIX,
}) => {
    const rows = [];
    const auditErrors = auditGateReport.errors ?? [];
    const lifecycleIssues = lifecycleReport.issues ?? [];
    const dashboardMetrics = dashboardReport.metrics ?? [];
    const certificationErrors = certificationReport.errors ?? [];
    const certificationScorecard = certificationReport.scorecard ?? [];

    const auditEvidence = `${evidencePrefix}/audit-gates.report.json`;
    const lifecycleEvidence = `${evidencePrefix}/lifecycle-governance.report.json`;
    const dashboardEvidence = `${evidencePrefix}/lifecycle-governance.dashboard.json`;
    const certificationEvidence = `${evidencePrefix}/lifecycle-certification.report.json`;

    for (const error of auditErrors) {
        pushRow(rows, {
            dimension: 'audit-gates',
            metric: '—',
            threshold: escapeMdCell(error),
            evidenceRefs: auditEvidence,
            suggestedCommands: uniqueCommands(['pnpm audit:gates', ...BASE_COMMANDS]),
        });
    }

    for (const issue of lifecycleIssues) {
        pushRow(rows, {
            dimension: 'lifecycle-governance',
            metric: '—',
            threshold: escapeMdCell(issue),
            evidenceRefs: `${lifecycleEvidence}; ${dashboardEvidence}`,
            suggestedCommands: uniqueCommands(['pnpm governance:report', ...BASE_COMMANDS]),
        });
    }

    for (const metric of dashboardMetrics) {
        if (metric.status !== 'failed' && metric.status !== 'not-collected') {
            continue;
        }

        const refs = Array.isArray(metric.evidenceRefs) ? metric.evidenceRefs.join(', ') : '—';
        pushRow(rows, {
            dimension: escapeMdCell(metric.title ?? metric.id),
            metric: escapeMdCell(metric.id),
            threshold: escapeMdCell(metric.value ?? metric.status),
            evidenceRefs: escapeMdCell(refs),
            suggestedCommands: suggestCommandsForMetric(metric.id),
        });
    }

    for (const dimension of certificationScorecard) {
        const failures = dimension.failures ?? [];
        for (const failure of failures) {
            pushRow(rows, {
                dimension: escapeMdCell(`${dimension.id}: ${dimension.title ?? ''}`.trim()),
                metric: '—',
                threshold: escapeMdCell(failure),
                evidenceRefs: `${certificationEvidence}; ${dashboardEvidence}`,
                suggestedCommands: uniqueCommands([...BASE_COMMANDS]),
            });
        }
    }

    const structuredThresholds = new Set(rows.map((row) => row.threshold));

    for (const error of certificationErrors) {
        const escaped = escapeMdCell(error);
        if (structuredThresholds.has(escaped)) {
            continue;
        }
        pushRow(rows, {
            dimension: 'lifecycle-certification',
            metric: '—',
            threshold: escaped,
            evidenceRefs: certificationEvidence,
            suggestedCommands: uniqueCommands([...BASE_COMMANDS]),
        });
    }

    if (rows.length === 0 && (dashboardReport.errors?.length ?? 0) > 0) {
        for (const error of dashboardReport.errors) {
            pushRow(rows, {
                dimension: 'lifecycle-dashboard',
                metric: '—',
                threshold: escapeMdCell(error),
                evidenceRefs: dashboardEvidence,
                suggestedCommands: uniqueCommands([...BASE_COMMANDS]),
            });
        }
    }

    const header = [
        '# Lifecycle failure summary',
        '',
        'Dimension-scoped failures with dashboard metrics, evidence paths, and suggested reruns.',
        '',
        '| Dimension | Dashboard metric | Threshold / observed | Evidence refs | Suggested commands |',
        '| --- | --- | --- | --- | --- |',
    ];

    const body =
        rows.length === 0
            ? ['| (no structured rows; see raw errors below) | — | — | — | — |']
            : rows.map(
                  (row) =>
                      `| ${row.dimension} | ${row.metric} | ${row.threshold} | ${escapeMdCell(row.evidenceRefs)} | ${escapeMdCell(row.suggestedCommands.join('; '))} |`
              );

    const aggregated = [
        ...auditErrors,
        ...lifecycleIssues,
        ...(dashboardReport.errors ?? []),
        ...certificationErrors,
    ];

    const raw =
        aggregated.length === 0
            ? ['', '## Aggregated error strings', '', '_No aggregated strings supplied._']
            : [
                  '',
                  '## Aggregated error strings',
                  '',
                  ...aggregated.map((line) => `- ${escapeMdCell(line)}`),
              ];

    return `${[...header, ...body, ...raw].join('\n')}\n`;
};

function pushRow(rows, { dimension, metric, threshold, evidenceRefs, suggestedCommands }) {
    rows.push({
        dimension,
        metric,
        threshold,
        evidenceRefs,
        suggestedCommands,
    });
}

export const writeLifecycleFailureSummaryFile = (absoluteOutDir, markdown) => {
    const targetPath = path.join(absoluteOutDir, 'lifecycle-failure-summary.md');
    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    fs.writeFileSync(targetPath, markdown, 'utf8');
    return targetPath;
};

export const printAndWriteLifecycleFailureSummary = ({
    repoRoot,
    absoluteOutDir,
    auditGateReport,
    lifecycleReport,
    dashboardReport,
    certificationReport,
}) => {
    const evidencePrefixRaw = path.relative(repoRoot, absoluteOutDir).replaceAll(path.sep, '/');
    const evidencePrefix =
        evidencePrefixRaw && !evidencePrefixRaw.startsWith('..')
            ? evidencePrefixRaw
            : DEFAULT_EVIDENCE_PREFIX;

    const markdown = buildLifecycleFailureSummaryMarkdown({
        auditGateReport,
        lifecycleReport,
        dashboardReport,
        certificationReport,
        evidencePrefix,
    });

    // eslint-disable-next-line no-console -- CLI failure UX
    console.error(markdown);
    writeLifecycleFailureSummaryFile(absoluteOutDir, markdown);
};
