export const LIFECYCLE_CERTIFICATION_SCHEMA_VERSION = 1;

const isPlainObject = (value) =>
    Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const roundPercent = (value) => Number(value.toFixed(2));

export const buildBranchCoverageSummary = ({
    coverageFinal,
    minimumPercent,
    sourcePath = 'apps/desktop/coverage/coverage-final.json',
}) => {
    let total = 0;
    let covered = 0;

    for (const fileCoverage of Object.values(coverageFinal ?? {})) {
        for (const branchCounts of Object.values(fileCoverage?.b ?? {})) {
            for (const branchCount of branchCounts) {
                total += 1;
                if (branchCount > 0) {
                    covered += 1;
                }
            }
        }
    }

    const percent = total > 0 ? roundPercent((covered / total) * 100) : 0;

    return {
        sourcePath,
        branches: {
            covered,
            total,
            percent,
            minimumPercent,
            status: percent >= minimumPercent ? 'passed' : 'failed',
        },
    };
};

export const collectLifecycleCertificationSnapshotErrors = (snapshot) => {
    const errors = [];

    if (!isPlainObject(snapshot)) {
        return ['Lifecycle certification snapshot must be a JSON object.'];
    }

    if (snapshot.schemaVersion !== LIFECYCLE_CERTIFICATION_SCHEMA_VERSION) {
        errors.push(
            `Lifecycle certification snapshot schemaVersion must remain ${LIFECYCLE_CERTIFICATION_SCHEMA_VERSION}.`
        );
    }

    if (snapshot.certificationMode !== 'repo-contained-local-10-of-10') {
        errors.push(
            'Lifecycle certification snapshot must use repo-contained-local-10-of-10 mode.'
        );
    }

    if (snapshot.remoteGitHubSettings?.excludedFromScore !== true) {
        errors.push(
            'Lifecycle certification snapshot must exclude live GitHub settings from score.'
        );
    }

    if (!Array.isArray(snapshot.scorecard) || snapshot.scorecard.length !== 10) {
        errors.push(
            'Lifecycle certification snapshot must define exactly 10 scorecard dimensions.'
        );
    }

    for (const dimension of snapshot.scorecard ?? []) {
        if (typeof dimension.id !== 'string' || typeof dimension.title !== 'string') {
            errors.push('Lifecycle certification scorecard dimensions must define id and title.');
        }

        if (dimension.targetScore !== 10) {
            errors.push(
                `Lifecycle certification dimension ${dimension.id ?? '<unknown>'} must target score 10.`
            );
        }
    }

    return errors;
};

const buildLifecycleSectionMap = (lifecycleReport) =>
    new Map((lifecycleReport?.sections ?? []).map((section) => [section.id, section]));

const buildDashboardMetricMap = (dashboardReport) =>
    new Map((dashboardReport?.metrics ?? []).map((metric) => [metric.id, metric]));

const collectDimensionFailures = ({ dimension, sectionMap, metricMap }) => {
    const failures = [];

    for (const sectionId of dimension.requiredLifecycleSections ?? []) {
        const section = sectionMap.get(sectionId);
        if (!section) {
            failures.push(`missing lifecycle section ${sectionId}`);
            continue;
        }

        if (section.status !== 'passed') {
            failures.push(`lifecycle section ${sectionId} is ${section.status}`);
        }
    }

    for (const metricId of dimension.requiredDashboardMetrics ?? []) {
        const metric = metricMap.get(metricId);
        if (!metric) {
            failures.push(`missing dashboard metric ${metricId}`);
            continue;
        }

        if (metric.status !== 'passed') {
            failures.push(`dashboard metric ${metricId} is ${metric.status}`);
        }
    }

    return failures;
};

export const buildLifecycleCertificationReport = ({
    generatedAt,
    packageJson,
    certificationSnapshot,
    lifecycleReport,
    auditGateReport,
    dashboardReport,
    provenance = {},
}) => {
    const errors = collectLifecycleCertificationSnapshotErrors(certificationSnapshot);
    const sectionMap = buildLifecycleSectionMap(lifecycleReport);
    const metricMap = buildDashboardMetricMap(dashboardReport);

    if (lifecycleReport?.status !== 'passed') {
        errors.push('Lifecycle governance report must be passed.');
    }

    if (auditGateReport?.status !== 'passed') {
        errors.push('Audit gate report must be passed.');
    }

    if (dashboardReport?.status !== 'passed' || dashboardReport?.completeness !== 'complete') {
        errors.push('Lifecycle dashboard report must be passed and complete.');
    }

    const scorecard = (certificationSnapshot?.scorecard ?? []).map((dimension) => {
        const failures = collectDimensionFailures({
            dimension,
            sectionMap,
            metricMap,
        });

        return {
            id: dimension.id,
            title: dimension.title,
            score: failures.length === 0 ? 10 : 0,
            status: failures.length === 0 ? 'passed' : 'failed',
            failures,
        };
    });

    for (const dimension of scorecard) {
        if (dimension.status !== 'passed') {
            errors.push(
                `Lifecycle certification dimension ${dimension.id} failed: ${dimension.failures.join(', ')}.`
            );
        }
    }

    const averageScore =
        scorecard.length > 0
            ? Number(
                  (
                      scorecard.reduce((total, dimension) => total + dimension.score, 0) /
                      scorecard.length
                  ).toFixed(2)
              )
            : 0;

    return {
        schemaVersion: 1,
        generatedAt,
        provenance,
        packageVersion: packageJson?.version ?? null,
        status: errors.length === 0 && averageScore === 10 ? 'passed' : 'failed',
        scopeAnchor: certificationSnapshot?.scopeAnchor ?? null,
        certificationMode: certificationSnapshot?.certificationMode ?? null,
        remoteGitHubSettings: certificationSnapshot?.remoteGitHubSettings ?? null,
        localScore: {
            score: averageScore,
            maxScore: 10,
            scoringNote:
                'Live GitHub branch protection, rulesets, and vulnerability-alert drift are excluded by snapshot policy for this local certification.',
        },
        scorecard,
        errors,
    };
};

export const renderLifecycleCertificationMarkdown = (certification) => {
    const lines = [
        '# Lifecycle Governance Certification',
        '',
        `- Generated: ${certification.generatedAt}`,
        `- Package version: ${certification.packageVersion}`,
        `- Status: ${certification.status}`,
        `- Local score: ${certification.localScore.score}/${certification.localScore.maxScore}`,
        `- Scope anchor: ${certification.scopeAnchor}`,
        `- Remote GitHub settings excluded: ${certification.remoteGitHubSettings?.excludedFromScore === true}`,
        '',
        '## Failures',
    ];

    if (certification.errors.length === 0) {
        lines.push('', 'None.');
    } else {
        lines.push('');
        for (const error of certification.errors) {
            lines.push(`- ${error}`);
        }
    }

    lines.push('', '## Scorecard', '', '| Dimension | Score | Status |', '| --- | ---: | --- |');
    for (const dimension of certification.scorecard) {
        lines.push(`| ${dimension.title} | ${dimension.score}/10 | ${dimension.status} |`);
    }

    lines.push('');
    return `${lines.join('\n')}\n`;
};
