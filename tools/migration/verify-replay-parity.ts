import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { parseArgs } from 'node:util';
import { fileURLToPath } from 'node:url';

import { format as formatWithPrettier } from 'prettier';

import { auditReplay } from '../../packages/shared/src/replay/index';
import type { ReplayEndReason } from '../../packages/shared/src/replay/index';
import type { PlayerKey } from '../../packages/shared/src/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workspaceRoot = path.resolve(__dirname, '..', '..');
const DEFAULT_MANIFEST = path.join(workspaceRoot, 'fixtures', 'replay-golden', 'manifest.json');

const formatJson = (value: unknown) =>
    formatWithPrettier(JSON.stringify(value), {
        parser: 'json',
        printWidth: 100,
        tabWidth: 4,
    });

const REQUIRED_COVERAGE = [
    'local-pvp-opening',
    'reserve',
    'buy',
    'royal-selection',
    'extra-turn',
    'buff',
    'game-over',
] as const;

type CoverageTag = (typeof REQUIRED_COVERAGE)[number];

interface ManifestFixture {
    id: string;
    fileName: string;
    tags: CoverageTag[];
    expectedFinalStateHash: string;
    expectedWinner: PlayerKey | null;
    expectedEndReason: ReplayEndReason;
    expectedTotalEvents: number;
    expectedTurnCount: number;
}

interface Manifest {
    schemaVersion: number;
    rulesVersion: string;
    replaySchemaVersion: string;
    requiredCoverage: CoverageTag[];
    fixtures: ManifestFixture[];
}

const parseCliOptions = () => {
    const { values } = parseArgs({
        args: process.argv.slice(2),
        options: {
            manifest: { type: 'string' },
            report: { type: 'string' },
            help: { type: 'boolean' },
        },
        allowPositionals: false,
        strict: true,
    });

    if (values.help) {
        process.stdout.write(
            [
                'Usage: pnpm --dir tools/scripts exec vite-node --script ../../tools/migration/verify-replay-parity.ts [options]',
                '',
                'Options:',
                '  --manifest <path>  Manifest path (default: fixtures/replay-golden/manifest.json)',
                '  --report <path>    Optional JSON report path',
                '  --help             Show this help message',
                '',
            ].join('\n')
        );
        process.exit(0);
    }

    return {
        manifestPath: path.resolve(values.manifest ?? DEFAULT_MANIFEST),
        reportPath: values.report ? path.resolve(values.report) : null,
    };
};

const parseManifest = (raw: string): Manifest => {
    const parsed = JSON.parse(raw) as Manifest;
    if (parsed.schemaVersion !== 1) {
        throw new Error(`Unsupported replay golden manifest schema: ${parsed.schemaVersion}`);
    }
    if (!Array.isArray(parsed.fixtures) || parsed.fixtures.length === 0) {
        throw new Error('Replay golden manifest must contain at least one fixture.');
    }
    return parsed;
};

const findCoverageGaps = (manifest: Manifest): CoverageTag[] => {
    const covered = new Set(manifest.fixtures.flatMap((fixture) => fixture.tags));
    const required = new Set([...REQUIRED_COVERAGE, ...(manifest.requiredCoverage ?? [])]);
    return [...required].filter((tag) => !covered.has(tag));
};

const main = async () => {
    const { manifestPath, reportPath } = parseCliOptions();
    const manifest = parseManifest(await readFile(manifestPath, 'utf8'));
    const manifestDir = path.dirname(manifestPath);
    const coverageGaps = findCoverageGaps(manifest);
    const results = [];

    for (const fixture of manifest.fixtures) {
        const fixturePath = path.join(manifestDir, fixture.fileName);
        const value = await readFile(fixturePath, 'utf8');
        const audit = auditReplay({
            id: fixture.fileName,
            value,
            expected: {
                fileName: fixture.fileName,
                winner: fixture.expectedWinner,
                endReason: fixture.expectedEndReason,
                turnCount: fixture.expectedTurnCount,
                totalEvents: fixture.expectedTotalEvents,
                finalStateHash: fixture.expectedFinalStateHash,
            },
            verifySummary: 'full',
        });

        results.push({
            id: fixture.id,
            fileName: fixture.fileName,
            ok: audit.ok,
            finalStateHash: audit.loadedFinalStateHash,
            winner: audit.loadedWinner,
            mismatches: audit.mismatches,
            error: audit.error,
        });
    }

    const report = {
        ok: coverageGaps.length === 0 && results.every((result) => result.ok),
        manifestPath,
        rulesVersion: manifest.rulesVersion,
        replaySchemaVersion: manifest.replaySchemaVersion,
        fixtureCount: manifest.fixtures.length,
        coverageGaps,
        results,
    };

    const reportJson = await formatJson(report);
    if (reportPath) {
        await writeFile(reportPath, reportJson, 'utf8');
    }

    process.stdout.write(reportJson);
    if (!report.ok) {
        process.exit(1);
    }
};

main().catch((error) => {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    process.exit(1);
});
