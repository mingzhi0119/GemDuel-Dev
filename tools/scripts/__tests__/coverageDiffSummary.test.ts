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
const scriptPath = path.join(workspaceRoot, 'tools', 'scripts', 'coverage-diff-summary.mjs');

const runGit = (cwd: string, args: string[]) => {
    execFileSync('git', args, { cwd, stdio: 'ignore' });
};

describe('coverage-diff-summary.mjs', () => {
    it('writes markdown with FAIL, deduction, and fix hints for a touched uncovered file', () => {
        const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'gemduel-cov-diff-'));
        const srcRel = 'apps/desktop/src/mymodule.ts';
        const srcFile = path.join(tmp, srcRel);
        fs.mkdirSync(path.dirname(srcFile), {
            recursive: true,
        });
        fs.writeFileSync(srcFile, 'export const x = 1;\n', 'utf8');

        runGit(tmp, ['init']);
        runGit(tmp, ['config', 'user.email', 'cov@test.local']);
        runGit(tmp, ['config', 'user.name', 'cov']);
        runGit(tmp, ['add', '.']);
        runGit(tmp, ['commit', '-m', 'first', '--no-verify']);

        const sha1 = execFileSync('git', ['rev-parse', 'HEAD'], {
            cwd: tmp,
            encoding: 'utf8',
        }).trim();

        fs.appendFileSync(srcFile, 'export const y = 2;\n');
        runGit(tmp, ['add', '.']);
        runGit(tmp, ['commit', '-m', 'second', '--no-verify']);

        const sha2 = execFileSync('git', ['rev-parse', 'HEAD'], {
            cwd: tmp,
            encoding: 'utf8',
        }).trim();

        const coverageKey = path.resolve(srcFile);
        const coverageFinal = {
            [coverageKey]: {
                path: coverageKey,
                all: false,
                statementMap: {
                    '1': {
                        start: {
                            line: 1,
                            column: 0,
                        },
                        end: {
                            line: 1,
                            column: 20,
                        },
                    },
                },
                s: {
                    '1': 0,
                },
                branchMap: {},
                b: {},
                fnMap: {},
                f: {},
            },
        };

        const covDir = path.join(tmp, 'apps', 'desktop', 'coverage');
        fs.mkdirSync(covDir, {
            recursive: true,
        });
        fs.writeFileSync(
            path.join(covDir, 'coverage-final.json'),
            `${JSON.stringify(coverageFinal)}\n`,
            'utf8'
        );

        execFileSync(
            process.execPath,
            [
                scriptPath,
                '--repo-root',
                tmp,
                '--coverage-file',
                path.join('apps', 'desktop', 'coverage', 'coverage-final.json'),
                '--base',
                sha1,
                '--head',
                sha2,
            ],
            {
                encoding: 'utf8',
            }
        );

        const mdPath = path.join(tmp, 'artifacts', 'governance', 'coverage-diff.md');
        const md = fs.readFileSync(mdPath, 'utf8');
        expect(md).toContain('mymodule.ts');
        expect(md).toContain('FAIL');
        expect(md).toContain('Total deduction');
        expect(md).toContain('pnpm run test:coverage');
        expect(md).toContain('seal-exclusions:check');
    });
});
