import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { buildDraftAuditReportMarkdown, loadGovernanceDraftInputs } from '../draftAuditReport.js';

describe('draftAuditReport', () => {
    it('builds markdown containing key sections from fixture inputs', () => {
        const markdown = buildDraftAuditReportMarkdown({
            utcDate: '2026-04-28',
            dashboard: {
                status: 'failed',
                metrics: [
                    {
                        id: 'gate-status',
                        title: 'Lifecycle Gates',
                        status: 'failed',
                        value: '1 issue',
                    },
                ],
            },
            certification: {
                status: 'failed',
                scorecard: [
                    {
                        id: 'type-safety',
                        title: 'Type safety',
                        score: 8,
                        status: 'failed',
                        failures: ['Example failure'],
                    },
                ],
            },
            auditGates: {
                status: 'passed',
                rootScripts: [{ scriptName: 'lint', command: 'turbo run lint' }],
            },
            lifecycleReport: { schemaVersion: 1, sections: [] },
        });

        expect(markdown).toContain('# Engineering audit draft (2026-04-28 UTC)');
        expect(markdown).toContain('Not a formal audit');
        expect(markdown).toContain('## Dashboard dimensions');
        expect(markdown).toContain('| Lifecycle Gates | failed |');
        expect(markdown).toContain('## Certification scorecard');
        expect(markdown).toContain('| Type safety |');
        expect(markdown).toContain('## Blocking triage (P0–P3 placeholder)');
        expect(markdown).toContain('## Suggested rerun commands');
        expect(markdown).toContain('`lint`');
    });

    it('loads JSON files from a temp artifacts directory', () => {
        const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'draft-audit-'));
        fs.writeFileSync(
            path.join(dir, 'lifecycle-governance.dashboard.json'),
            JSON.stringify({ status: 'passed', metrics: [] }),
            'utf8'
        );
        fs.writeFileSync(
            path.join(dir, 'lifecycle-certification.report.json'),
            JSON.stringify({ status: 'passed', scorecard: [] }),
            'utf8'
        );
        fs.writeFileSync(
            path.join(dir, 'audit-gates.report.json'),
            JSON.stringify({ status: 'passed', rootScripts: [] }),
            'utf8'
        );
        fs.writeFileSync(
            path.join(dir, 'lifecycle-governance.report.json'),
            JSON.stringify({ sections: [] }),
            'utf8'
        );

        const loaded = loadGovernanceDraftInputs({
            artifactsDir: dir,
            readFileSync: fs.readFileSync,
            pathJoin: path.join,
        });

        expect(loaded.dashboard?.status).toBe('passed');
        expect(loaded.certification?.status).toBe('passed');
        expect(loaded.auditGates?.status).toBe('passed');
        expect(loaded.lifecycleReport).toEqual({ sections: [] });
    });
});
