export const LIFECYCLE_DASHBOARD_SCHEMA_VERSION = 1;

const isPlainObject = (value) =>
    Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const findSection = (lifecycleReport, sectionId) =>
    (lifecycleReport?.sections ?? []).find((section) => section.id === sectionId) ?? null;

const metricStatus = (condition) => (condition ? 'passed' : 'failed');

const statusFromMetrics = (metrics, { requireCompleteEvidence }) => {
    if (
        metrics.some(
            (metric) =>
                metric.status === 'failed' ||
                (requireCompleteEvidence && metric.status === 'not-collected')
        )
    ) {
        return 'failed';
    }

    return 'passed';
};

const formatPercent = (value) => (typeof value === 'number' ? `${value.toFixed(2)}%` : 'n/a');

export const collectLifecycleDashboardSnapshotErrors = (snapshot) => {
    const errors = [];

    if (!isPlainObject(snapshot)) {
        return ['Lifecycle dashboard snapshot must be a JSON object.'];
    }

    if (snapshot.schemaVersion !== LIFECYCLE_DASHBOARD_SCHEMA_VERSION) {
        errors.push(
            `Lifecycle dashboard snapshot schemaVersion must remain ${LIFECYCLE_DASHBOARD_SCHEMA_VERSION}.`
        );
    }

    if (snapshot.mode !== 'single-snapshot-baseline') {
        errors.push('Lifecycle dashboard snapshot must use single-snapshot-baseline mode.');
    }

    if (snapshot.historyPolicy?.syntheticHistoryAllowed !== false) {
        errors.push('Lifecycle dashboard snapshot must forbid synthetic history.');
    }

    if (!Array.isArray(snapshot.requiredMetrics) || snapshot.requiredMetrics.length === 0) {
        errors.push('Lifecycle dashboard snapshot must define requiredMetrics.');
    }

    return errors;
};

export const buildLifecycleDashboardReport = ({
    generatedAt,
    dashboardSnapshot,
    lifecycleReport,
    auditGateReport,
    benchmarkBaseline,
    benchmarkReport,
    bundleBudgetReport,
    coverageSummary,
    coveragePerFileKeyModulesReport = null,
    architectureBudgetSummary,
    sealReviewSummary,
    dependencySbomSnapshot,
    licenseAllowlist,
    provenance = {},
    requireCompleteEvidence = false,
}) => {
    const releaseChangelogSection = findSection(lifecycleReport, 'release-changelog');
    const benchmarkErrors = benchmarkReport?.errors ?? [];
    const benchmarkStatus =
        benchmarkReport == null
            ? 'not-collected'
            : metricStatus(benchmarkReport.status === 'passed' && benchmarkErrors.length === 0);
    const bundleStatus =
        bundleBudgetReport == null
            ? 'not-collected'
            : metricStatus(bundleBudgetReport.status !== 'incident');

    const perFileReport = coveragePerFileKeyModulesReport ?? null;
    let keyModulePerFileDashboardStatus = 'not-collected';
    let keyModulePerFileValue =
        'Report not found; run pnpm run test:coverage or pnpm run coverage:perfile-modules';
    if (perFileReport != null) {
        const violated =
            perFileReport.status === 'failed' || (perFileReport.violations?.length ?? 0) > 0;
        keyModulePerFileDashboardStatus = violated ? 'failed' : 'passed';
        keyModulePerFileValue = violated
            ? `${perFileReport.violations.length} file(s) below line-coverage policy (first: ${perFileReport.violations[0]?.file ?? 'n/a'})`
            : `0 key-module line-coverage violations (${perFileReport.status})`;
    }

    const metrics = [
        {
            id: 'gate-status',
            title: 'Lifecycle Gates',
            status: metricStatus(
                lifecycleReport?.status === 'passed' && auditGateReport?.status === 'passed'
            ),
            value: `${lifecycleReport?.summary?.passed ?? 0}/${lifecycleReport?.summary?.sections ?? 0} lifecycle sections passed`,
            evidenceRefs: [
                'artifacts/governance/lifecycle-governance.report.json',
                'artifacts/governance/audit-gates.report.json',
            ],
        },
        {
            id: 'coverage-branch',
            title: 'Branch Coverage',
            status: metricStatus(
                typeof coverageSummary?.branches?.percent === 'number' &&
                    coverageSummary.branches.percent >=
                        (coverageSummary.branches.minimumPercent ?? 0)
            ),
            value: `${formatPercent(coverageSummary?.branches?.percent)} / minimum ${formatPercent(
                coverageSummary?.branches?.minimumPercent
            )}`,
            evidenceRefs: [
                coverageSummary?.sourcePath ?? 'apps/desktop/coverage/coverage-final.json',
            ],
        },
        {
            id: 'coverage-perfile-key-modules',
            title: 'Key Module Per-File Line Coverage',
            status: keyModulePerFileDashboardStatus,
            value: keyModulePerFileValue,
            evidenceRefs: ['artifacts/governance/coverage-perfile-key-modules.report.json'],
        },
        {
            id: 'architecture-warnings',
            title: 'Architecture Budget Warnings',
            status: metricStatus(
                architectureBudgetSummary?.errors === 0 && architectureBudgetSummary?.warnings === 0
            ),
            value: `${architectureBudgetSummary?.warnings ?? 'n/a'} warnings, ${architectureBudgetSummary?.errors ?? 'n/a'} errors`,
            evidenceRefs: ['docs/governance/architecture-layer-map.md'],
        },
        {
            id: 'seal-exclusions',
            title: 'Seal Exclusion Review',
            status: metricStatus(sealReviewSummary?.errors === 0),
            value: `${sealReviewSummary?.count ?? 'n/a'} reviewed exclusions / baseline ${sealReviewSummary?.baselineCount ?? 'n/a'}`,
            evidenceRefs: ['tools/governance/seal-exclusions-review.snapshot.json'],
        },
        {
            id: 'release-changelog',
            title: 'Release Changelog Coverage',
            status: metricStatus(releaseChangelogSection?.status === 'passed'),
            value: releaseChangelogSection?.status ?? 'missing',
            evidenceRefs: ['CHANGELOG.md', 'tools/governance/release-changelog.snapshot.json'],
        },
        {
            id: 'dependency-sbom',
            title: 'Dependency SBOM And Licenses',
            status: metricStatus(
                Number.isInteger(dependencySbomSnapshot?.componentCount) &&
                    Array.isArray(licenseAllowlist?.allowedLicenses) &&
                    licenseAllowlist.allowedLicenses.length > 0
            ),
            value: `${dependencySbomSnapshot?.componentCount ?? 'n/a'} components, ${licenseAllowlist?.allowedLicenses?.length ?? 'n/a'} allowed licenses`,
            evidenceRefs: [
                'tools/governance/dependency-sbom.snapshot.json',
                'tools/governance/dependency-license-allowlist.json',
            ],
        },
        {
            id: 'bundle-budget',
            title: 'Bundle Budget',
            status: bundleStatus,
            value:
                bundleBudgetReport == null
                    ? 'not collected'
                    : `${bundleBudgetReport.budget.observed} kB main chunk (${bundleBudgetReport.status})`,
            evidenceRefs: ['artifacts/governance/bundle-budget.report.json'],
        },
        {
            id: 'lifecycle-benchmarks',
            title: 'Lifecycle Benchmarks',
            status: benchmarkStatus,
            value:
                benchmarkReport == null
                    ? `${benchmarkBaseline?.benchmarks?.length ?? 0} baselines, report not collected`
                    : `${benchmarkReport.benchmarks.length} benchmarks passed`,
            evidenceRefs: [
                'tools/governance/benchmark-baselines.snapshot.json',
                'artifacts/governance/lifecycle-benchmarks.report.json',
            ],
            samples:
                benchmarkReport?.benchmarks?.map((benchmark) => ({
                    id: benchmark.id,
                    medianMs: benchmark.medianMs,
                    p95Ms: benchmark.p95Ms,
                })) ?? [],
        },
    ];
    const snapshotErrors = collectLifecycleDashboardSnapshotErrors(dashboardSnapshot);
    const requiredMetricIds = new Set(dashboardSnapshot?.requiredMetrics ?? []);
    const metricIds = new Set(metrics.map((metric) => metric.id));
    const errors = [...snapshotErrors];

    for (const requiredMetricId of requiredMetricIds) {
        if (!metricIds.has(requiredMetricId)) {
            errors.push(`Lifecycle dashboard is missing required metric ${requiredMetricId}.`);
        }
    }

    for (const metric of metrics) {
        if (metric.status === 'failed') {
            errors.push(`Lifecycle dashboard metric ${metric.id} failed: ${metric.value}.`);
        }

        if (requireCompleteEvidence && metric.status === 'not-collected') {
            errors.push(`Lifecycle dashboard metric ${metric.id} was not collected.`);
        }
    }

    return {
        schemaVersion: 1,
        generatedAt,
        provenance,
        status:
            errors.length === 0
                ? statusFromMetrics(metrics, { requireCompleteEvidence })
                : 'failed',
        completeness: metrics.some((metric) => metric.status === 'not-collected')
            ? 'partial'
            : 'complete',
        scopeAnchor: dashboardSnapshot?.scopeAnchor ?? null,
        trend: {
            historyMode: dashboardSnapshot?.mode ?? null,
            syntheticHistoryAllowed:
                dashboardSnapshot?.historyPolicy?.syntheticHistoryAllowed ?? null,
            retentionDays: dashboardSnapshot?.historyPolicy?.retentionDays ?? null,
            baselineLabel: dashboardSnapshot?.historyPolicy?.baselineLabel ?? null,
        },
        metrics,
        errors,
    };
};

export const renderLifecycleDashboardMarkdown = (dashboard) => {
    const lines = [
        '# Lifecycle Governance Dashboard',
        '',
        `- Generated: ${dashboard.generatedAt}`,
        `- Status: ${dashboard.status}`,
        `- Completeness: ${dashboard.completeness}`,
        `- Scope anchor: ${dashboard.scopeAnchor}`,
        `- Trend mode: ${dashboard.trend.historyMode}`,
        '',
        '## Failures',
    ];

    if (dashboard.errors.length === 0) {
        lines.push('', 'None.');
    } else {
        lines.push('');
        for (const error of dashboard.errors) {
            lines.push(`- ${error}`);
        }
    }

    lines.push('', '## Metrics', '', '| Metric | Status | Value |', '| --- | --- | --- |');
    for (const metric of dashboard.metrics) {
        lines.push(`| ${metric.title} | ${metric.status} | ${metric.value} |`);
    }

    lines.push('');
    return `${lines.join('\n')}\n`;
};
