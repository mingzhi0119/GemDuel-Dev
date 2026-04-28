const escapeHtml = (value) =>
    String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');

const renderKeyValueTable = (rows) => {
    if (!rows.length) {
        return '<p class="muted">No rows.</p>';
    }

    const body = rows
        .map(
            ([key, value]) =>
                `<tr><th scope="row">${escapeHtml(key)}</th><td>${escapeHtml(value)}</td></tr>`
        )
        .join('');

    return `<table class="kv"><tbody>${body}</tbody></table>`;
};

const renderMetricsTable = (metrics) => {
    if (!Array.isArray(metrics) || metrics.length === 0) {
        return '<p class="muted">No dashboard metrics loaded.</p>';
    }

    const header =
        '<thead><tr><th>Metric</th><th>Status</th><th>Value</th><th>Evidence</th></tr></thead>';
    const body = metrics
        .map((metric) => {
            const refs = Array.isArray(metric.evidenceRefs) ? metric.evidenceRefs.join(', ') : '';
            return `<tr>
<td>${escapeHtml(metric.title ?? metric.id)}</td>
<td><span class="pill pill-${escapeHtml(metric.status)}">${escapeHtml(metric.status)}</span></td>
<td>${escapeHtml(metric.value ?? '')}</td>
<td class="small">${escapeHtml(refs)}</td>
</tr>`;
        })
        .join('');

    return `<table class="grid">${header}<tbody>${body}</tbody></table>`;
};

const renderScorecard = (scorecard) => {
    if (!Array.isArray(scorecard) || scorecard.length === 0) {
        return '<p class="muted">No certification scorecard.</p>';
    }

    const header =
        '<thead><tr><th>Dimension</th><th>Score</th><th>Status</th><th>Failures</th></tr></thead>';
    const body = scorecard
        .map((row) => {
            const failures = Array.isArray(row.failures) ? row.failures.join('; ') : '';
            return `<tr>
<td>${escapeHtml(row.title ?? row.id)}</td>
<td>${escapeHtml(String(row.score ?? ''))}</td>
<td>${escapeHtml(row.status ?? '')}</td>
<td class="small">${escapeHtml(failures)}</td>
</tr>`;
        })
        .join('');

    return `<table class="grid">${header}<tbody>${body}</tbody></table>`;
};

const renderBenchmarks = (benchmarks) => {
    if (!Array.isArray(benchmarks) || benchmarks.length === 0) {
        return '<p class="muted">No benchmark samples.</p>';
    }

    const header = '<thead><tr><th>Id</th><th>Median ms</th><th>P95 ms</th></tr></thead>';
    const body = benchmarks
        .map(
            (b) =>
                `<tr><td>${escapeHtml(b.id)}</td><td>${escapeHtml(String(b.medianMs ?? ''))}</td><td>${escapeHtml(String(b.p95Ms ?? ''))}</td></tr>`
        )
        .join('');

    return `<table class="grid">${header}<tbody>${body}</tbody></table>`;
};

const renderPerFileViolations = (violations) => {
    if (!Array.isArray(violations) || violations.length === 0) {
        return '<p class="muted">No per-file violations (or report missing).</p>';
    }

    const header =
        '<thead><tr><th>File</th><th>Rule</th><th>Actual lines %</th><th>Minimum %</th></tr></thead>';
    const body = violations
        .slice(0, 40)
        .map((v) => {
            const file = typeof v?.file === 'string' ? v.file : '';
            const ruleId = typeof v?.ruleId === 'string' ? v.ruleId : '';
            const actual = typeof v?.actualLines === 'number' ? String(v.actualLines) : '—';
            const minimum = typeof v?.minimumLines === 'number' ? String(v.minimumLines) : '—';
            return `<tr><td class="small">${escapeHtml(file)}</td><td>${escapeHtml(ruleId)}</td><td>${escapeHtml(actual)}</td><td>${escapeHtml(minimum)}</td></tr>`;
        })
        .join('');

    const more =
        violations.length > 40
            ? `<p class="muted">Showing first 40 of ${violations.length}.</p>`
            : '';

    return `<table class="grid">${header}<tbody>${body}</tbody></table>${more}`;
};

/**
 * Build a self-contained HTML governance dashboard from parsed JSON payloads.
 * Missing sections render placeholders so CI can still emit the artifact.
 *
 * @param {{
 *   generatedAt: string;
 *   artifactsLabel?: string;
 *   retainedEvidenceNote?: string;
 *   dashboard?: { status?: string; completeness?: string; metrics?: unknown[]; generatedAt?: string } | null;
 *   certification?: { status?: string; localScore?: { score?: number; maxScore?: number }; scorecard?: unknown[]; errors?: string[] } | null;
 *   auditGate?: { status?: string; errors?: string[]; generatedAt?: string } | null;
 *   lifecycle?: { status?: string; issues?: string[]; generatedAt?: string } | null;
 *   bundleBudget?: { status?: string; budget?: { observed?: number }; generatedAt?: string } | null;
 *   benchmarks?: { benchmarks?: unknown[]; status?: string } | null;
 *   perFileCoverage?: { status?: string; violations?: unknown[] } | null;
 *   manifest?: { batch?: { commitSha?: string | null; gitRef?: string | null }; artifactPolicy?: { retentionDays?: number } } | null;
 * }} input
 */
export const buildGovernanceDashboardHtml = ({
    generatedAt,
    artifactsLabel = 'artifacts/governance',
    retainedEvidenceNote = 'GitHub Actions retains governance-evidence artifacts for 30 days; download historical ZIPs to compare trends locally.',
    dashboard = null,
    certification = null,
    auditGate = null,
    lifecycle = null,
    bundleBudget = null,
    benchmarks = null,
    perFileCoverage = null,
    manifest = null,
}) => {
    const summaryRows = [
        ['Generated (dashboard render)', generatedAt],
        ['Artifacts directory', artifactsLabel],
        ['Manifest batch SHA', manifest?.batch?.commitSha ?? '—'],
        ['Manifest batch ref', manifest?.batch?.gitRef ?? '—'],
        ['Declared retention (manifest)', String(manifest?.artifactPolicy?.retentionDays ?? '—')],
        ['Lifecycle dashboard status', dashboard?.status ?? 'not loaded'],
        ['Lifecycle dashboard completeness', dashboard?.completeness ?? '—'],
        ['Certification status', certification?.status ?? 'not loaded'],
        [
            'Certification local score',
            certification?.localScore
                ? `${certification.localScore.score}/${certification.localScore.maxScore}`
                : '—',
        ],
        ['Audit gates status', auditGate?.status ?? 'not loaded'],
        ['Lifecycle governance status', lifecycle?.status ?? 'not loaded'],
        ['Bundle budget status', bundleBudget?.status ?? 'not loaded'],
        ['Benchmarks status', benchmarks?.status ?? 'not loaded'],
        ['Key-module per-file gate', perFileCoverage?.status ?? 'not loaded'],
    ];

    const auditErrors = Array.isArray(auditGate?.errors) ? auditGate.errors : [];
    const lifecycleIssues = Array.isArray(lifecycle?.issues) ? lifecycle.issues : [];
    const certificationErrors = Array.isArray(certification?.errors) ? certification.errors : [];

    const issuesHtml = [...auditErrors, ...lifecycleIssues, ...certificationErrors]
        .slice(0, 80)
        .map((line) => `<li>${escapeHtml(line)}</li>`)
        .join('');

    const issuesSection =
        auditErrors.length + lifecycleIssues.length + certificationErrors.length === 0
            ? '<p class="muted">No aggregated certification or audit errors in supplied JSON.</p>'
            : `<ul class="issues">${issuesHtml}</ul>`;

    const styles = `
:root { color-scheme: dark; }
body { margin: 0; font-family: ui-sans-serif, system-ui, sans-serif; background: #0b1020; color: #e2e8f0; }
header { padding: 1.25rem 1.5rem; border-bottom: 1px solid #1e293b; background: #0f172a; }
h1 { margin: 0 0 0.35rem; font-size: 1.25rem; }
main { padding: 1.25rem 1.5rem 2.5rem; max-width: 1200px; }
section { margin-bottom: 2rem; }
h2 { font-size: 1rem; margin: 0 0 0.75rem; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.04em; }
table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
table.kv th { text-align: left; width: 220px; padding: 0.35rem 0.5rem; border-bottom: 1px solid #1e293b; color: #94a3b8; font-weight: 500; }
table.kv td { padding: 0.35rem 0.5rem; border-bottom: 1px solid #1e293b; }
table.grid th, table.grid td { border: 1px solid #1e293b; padding: 0.4rem 0.5rem; text-align: left; vertical-align: top; }
table.grid thead { background: #111827; }
.pill { display: inline-block; padding: 0.1rem 0.45rem; border-radius: 999px; font-size: 0.75rem; }
.pill-passed { background: #14532d; color: #bbf7d0; }
.pill-failed { background: #7f1d1d; color: #fecaca; }
.pill-not-collected { background: #422006; color: #fde68a; }
.muted { color: #64748b; font-size: 0.875rem; }
.small { font-size: 0.75rem; word-break: break-all; }
ul.issues { margin: 0; padding-left: 1.1rem; }
ul.issues li { margin-bottom: 0.25rem; }
footer { padding: 1rem 1.5rem; border-top: 1px solid #1e293b; color: #64748b; font-size: 0.8rem; }
`;

    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Governance dashboard</title>
<style>${styles}</style>
</head>
<body>
<header>
<h1>Gem Duel · Governance dashboard</h1>
<p class="muted">Single-page snapshot from exported JSON in <code>${escapeHtml(artifactsLabel)}</code>. Not player-facing.</p>
</header>
<main>
<section><h2>Summary</h2>${renderKeyValueTable(summaryRows)}</section>
<section><h2>Lifecycle metrics</h2>${renderMetricsTable(dashboard?.metrics)}</section>
<section><h2>Certification scorecard</h2>${renderScorecard(certification?.scorecard)}</section>
<section><h2>Bundle budget</h2>${renderKeyValueTable([
        ['Status', bundleBudget?.status ?? '—'],
        ['Observed main chunk (kB)', String(bundleBudget?.budget?.observed ?? '—')],
        ['Report generatedAt', bundleBudget?.generatedAt ?? '—'],
    ])}</section>
<section><h2>Lifecycle benchmarks</h2>${renderBenchmarks(benchmarks?.benchmarks)}</section>
<section><h2>Key-module per-file coverage</h2>${renderPerFileViolations(perFileCoverage?.violations)}</section>
<section><h2>Aggregated issues</h2>${issuesSection}</section>
<section><h2>Retained evidence</h2><p class="muted">${escapeHtml(retainedEvidenceNote)}</p></section>
</main>
<footer>Produced by tools/scripts/render-governance-dashboard.mjs · ${escapeHtml(generatedAt)}</footer>
</body>
</html>`;
};
