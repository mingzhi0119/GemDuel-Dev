// @vitest-environment node

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workspaceRoot = path.resolve(__dirname, '../../..');
const scriptPath = path.join(
    workspaceRoot,
    'tools',
    'scripts',
    'check-coverage-perfile-key-modules.mjs'
);

describe('check-coverage-perfile-key-modules.mjs', () => {
    it('writes failed report and warns when a key-module file is below its line threshold', () => {
        const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'gemduel-perfile-'));
        const rel = 'apps/desktop/src/hooks/gameNetwork/useHostStateSync.ts';
        const absFile = path.join(tmp, rel);
        fs.mkdirSync(path.dirname(absFile), {
            recursive: true,
        });
        fs.writeFileSync(absFile, 'export const x = 1;\n', 'utf8');

        const coverageFinal = {
            [absFile]: {
                path: absFile,
                all: false,
                statementMap: {
                    '1': {
                        start: { line: 1, column: 0 },
                        end: { line: 1, column: 20 },
                    },
                },
                s: { '1': 0 },
                branchMap: {},
                b: {},
                fnMap: {},
                f: {},
            },
        };

        const covPath = path.join(tmp, 'coverage-final.json');
        fs.writeFileSync(covPath, `${JSON.stringify(coverageFinal)}\n`, 'utf8');
        const outPath = path.join(tmp, 'coverage-perfile-key-modules.report.json');

        execFileSync(
            process.execPath,
            [scriptPath, '--repo-root', tmp, '--coverage-file', covPath, '--out-json', outPath],
            {
                encoding: 'utf8',
            }
        );

        const report = JSON.parse(fs.readFileSync(outPath, 'utf8'));
        expect(report.status).toBe('failed');
        expect(report.violations.length).toBeGreaterThan(0);
        expect(report.violations[0].ruleId).toBe('hooks-game-network');
    });
});
