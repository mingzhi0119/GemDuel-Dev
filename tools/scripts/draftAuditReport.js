const isPlainObject = (value) =>
    Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const safeReadJson = (readFileSync, filePath) => {
    try {
        const raw = readFileSync(filePath, 'utf8');
        return JSON.parse(raw);
    } catch {
        return null;
    }
};

export const loadGovernanceDraftInputs = ({ artifactsDir, readFileSync, pathJoin }) => {
    const files = {
        dashboard: 'lifecycle-governance.dashboard.json',
        certification: 'lifecycle-certification.report.json',
        auditGates: 'audit-gates.report.json',
        lifecycleReport: 'lifecycle-governance.report.json',
    };

    return Object.fromEntries(
        Object.entries(files).map(([key, name]) => [
            key,
            safeReadJson(readFileSync, pathJoin(artifactsDir, name)),
        ])
    );
};

const formatMetricRow = (metric) => {
    if (!isPlainObject(metric)) {
        return '| (invalid metric) | n/a | n/a |';
    }
    const title = metric.title ?? metric.id ?? 'n/a';
    const status = metric.status ?? 'n/a';
    const value = metric.value ?? '';
    return `| ${title} | ${status} | ${value} |`;
};

const formatScorecardRow = (row) => {
    if (!isPlainObject(row)) {
        return '| (invalid row) | n/a | n/a |';
    }
    const failures = Array.isArray(row.failures) ? row.failures.join('; ') : '';
    return `| ${row.title ?? row.id ?? 'n/a'} | ${row.score ?? 'n/a'} | ${row.status ?? 'n/a'} | ${failures} |`;
};

const formatScriptRow = (entry) => {
    if (!isPlainObject(entry)) {
        return '| (invalid) | n/a |';
    }
    return `| \`${entry.scriptName ?? 'n/a'}\` | ${entry.command ?? 'n/a'} |`;
};

/**
 * @param {{
 *   dashboard: unknown,
 *   certification: unknown,
 *   auditGates: unknown,
 *   lifecycleReport: unknown,
 *   utcDate: string,
 * }} input
 */
export const buildDraftAuditReportMarkdown = ({
    dashboard,
    certification,
    auditGates,
    lifecycleReport,
    utcDate,
}) => {
    const lines = [];
    lines.push(`# Engineering audit draft (${utcDate} UTC)`);
    lines.push('');
    lines.push(
        '> **Not a formal audit.** This file is an auto-generated scaffold from local governance JSON. Do not cite it as an independent third-party or compliance audit. See ADR `docs/adr/0010-engineering-audit-draft-from-governance.md`.'
    );
    lines.push('');
    lines.push('## Provenance');
    lines.push('');
    lines.push('| Source | Value |');
    lines.push('| --- | --- |');
    lines.push(
        `| Certification status | ${certification?.status ?? '(missing lifecycle-certification.report.json)'} |`
    );
    lines.push(
        `| Dashboard status | ${dashboard?.status ?? '(missing lifecycle-governance.dashboard.json)'} |`
    );
    lines.push(
        `| Audit gates status | ${auditGates?.status ?? '(missing audit-gates.report.json)'} |`
    );
    lines.push(
        `| Lifecycle report | ${lifecycleReport ? 'present' : '(missing lifecycle-governance.report.json)'} |`
    );
    lines.push('');

    lines.push('## Dashboard dimensions');
    lines.push('');
    lines.push('| Dimension | Status | Value |');
    lines.push('| --- | --- | --- |');
    if (Array.isArray(dashboard?.metrics) && dashboard.metrics.length > 0) {
        for (const metric of dashboard.metrics) {
            lines.push(formatMetricRow(metric));
        }
    } else {
        lines.push('| (no metrics loaded) | n/a | |');
    }
    lines.push('');

    lines.push('## Certification scorecard');
    lines.push('');
    lines.push('| Dimension | Score | Status | Failures |');
    lines.push('| --- | --- | --- | --- |');
    if (Array.isArray(certification?.scorecard) && certification.scorecard.length > 0) {
        for (const row of certification.scorecard) {
            lines.push(formatScorecardRow(row));
        }
    } else {
        lines.push('| (no scorecard loaded) | n/a | n/a | |');
    }
    lines.push('');

    lines.push('## Blocking triage (P0–P3 placeholder)');
    lines.push('');
    lines.push(
        'Fill this table from `lifecycle-governance.report.json` section issues, dashboard failures, and certification `failures` arrays after triage.'
    );
    lines.push('');
    lines.push('| Priority | Area | Evidence | Next step |');
    lines.push('| --- | --- | --- | --- |');
    lines.push('| P0 | (triage) | | |');
    lines.push('| P1 | (triage) | | |');
    lines.push('| P2 | (triage) | | |');
    lines.push('| P3 | (triage) | | |');
    lines.push('');

    lines.push('## Suggested rerun commands');
    lines.push('');
    lines.push('| Script | Command |');
    lines.push('| --- | --- |');
    if (Array.isArray(auditGates?.rootScripts) && auditGates.rootScripts.length > 0) {
        for (const entry of auditGates.rootScripts) {
            lines.push(formatScriptRow(entry));
        }
    } else {
        lines.push('| (no audit gate script matrix) | Run `pnpm lifecycle:certify` locally |');
    }
    lines.push('');
    lines.push(
        'Additional common reruns: `pnpm bench`, `pnpm governance:report`, `pnpm audit:gates`.'
    );
    lines.push('');

    return `${lines.join('\n')}\n`;
};
