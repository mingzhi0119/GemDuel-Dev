import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
    ARCHITECTURE_BUDGET_SCHEMA_VERSION,
    collectArchitectureBudgetResults,
    extractArchitectureBudgetContract,
} from '../architectureBudgets.js';
import { GOVERNANCE_DOC_PATHS } from '../governanceDocPaths.js';

const repoRoot = path.resolve(process.cwd());

const createArchitectureLayerMap = (contract) => `# Test Contract

<!-- architecture-budget-contract:start -->
\`\`\`json
${JSON.stringify(contract, null, 2)}
\`\`\`
<!-- architecture-budget-contract:end -->
`;

const writeFile = (repoRootPath, relativePath, content) => {
    const absolutePath = path.join(repoRootPath, relativePath);
    fs.mkdirSync(path.dirname(absolutePath), {
        recursive: true,
    });
    fs.writeFileSync(absolutePath, content, 'utf8');
};

describe('architecture budgets', () => {
    it('accepts the governed repo contract', () => {
        const architectureLayerMapText = fs.readFileSync(
            path.join(repoRoot, GOVERNANCE_DOC_PATHS.architectureLayerMap),
            'utf8'
        );

        expect(extractArchitectureBudgetContract(architectureLayerMapText).schemaVersion).toBe(
            ARCHITECTURE_BUDGET_SCHEMA_VERSION
        );
        expect(
            collectArchitectureBudgetResults({
                architectureLayerMapText,
                repoRoot,
            }).errors
        ).toEqual([]);
    });

    it('rejects files that exceed a hard layer ceiling without an approved ADR exception', () => {
        const tempRepo = fs.mkdtempSync(path.join(os.tmpdir(), 'architecture-budget-'));
        const architectureLayerMapText = createArchitectureLayerMap({
            schemaVersion: ARCHITECTURE_BUDGET_SCHEMA_VERSION,
            layers: [
                {
                    id: 'ui-app-shell',
                    label: 'UI / App Shell',
                    paths: ['src/components/'],
                    warningMaxLines: 400,
                    incidentMaxLines: 500,
                    forbiddenImportPaths: [],
                },
            ],
            approvedExceptions: [],
        });

        try {
            writeFile(
                tempRepo,
                'src/components/Oversized.tsx',
                `${'const value = 1;\n'.repeat(520)}`
            );

            expect(
                collectArchitectureBudgetResults({
                    architectureLayerMapText,
                    repoRoot: tempRepo,
                }).errors
            ).toContain(
                'src/components/Oversized.tsx exceeds the hard UI / App Shell budget (521 > 500).'
            );
        } finally {
            fs.rmSync(tempRepo, { force: true, recursive: true });
        }
    });

    it('rejects forbidden cross-layer imports', () => {
        const tempRepo = fs.mkdtempSync(path.join(os.tmpdir(), 'architecture-import-'));
        const architectureLayerMapText = createArchitectureLayerMap({
            schemaVersion: ARCHITECTURE_BUDGET_SCHEMA_VERSION,
            layers: [
                {
                    id: 'domain-logic',
                    label: 'Domain Logic',
                    paths: ['src/logic/'],
                    warningMaxLines: 400,
                    incidentMaxLines: 500,
                    forbiddenImportPaths: ['src/hooks/'],
                },
            ],
            approvedExceptions: [],
        });

        try {
            writeFile(tempRepo, 'src/hooks/useThing.ts', 'export const useThing = () => null;\n');
            writeFile(
                tempRepo,
                'src/logic/rule.ts',
                "import { useThing } from '../hooks/useThing';\nexport const value = useThing;\n"
            );

            expect(
                collectArchitectureBudgetResults({
                    architectureLayerMapText,
                    repoRoot: tempRepo,
                }).errors
            ).toContain(
                'src/logic/rule.ts must not import src/hooks/useThing.ts under the Domain Logic layer rules.'
            );
        } finally {
            fs.rmSync(tempRepo, { force: true, recursive: true });
        }
    });

    it('requires ADR files for approved hard-limit exceptions', () => {
        const tempRepo = fs.mkdtempSync(path.join(os.tmpdir(), 'architecture-adr-'));
        const architectureLayerMapText = createArchitectureLayerMap({
            schemaVersion: ARCHITECTURE_BUDGET_SCHEMA_VERSION,
            layers: [
                {
                    id: 'domain-logic',
                    label: 'Domain Logic',
                    paths: ['src/logic/'],
                    warningMaxLines: 400,
                    incidentMaxLines: 500,
                    forbiddenImportPaths: [],
                },
            ],
            approvedExceptions: [
                {
                    path: 'src/logic/contractSchemas.ts',
                    approvedMaxLines: 800,
                    adrPath: 'docs/adr/0002-zod-contract-boundary-strategy.md',
                },
            ],
        });

        try {
            writeFile(
                tempRepo,
                'src/logic/contractSchemas.ts',
                `${'export const value = 1;\n'.repeat(760)}`
            );

            expect(
                collectArchitectureBudgetResults({
                    architectureLayerMapText,
                    repoRoot: tempRepo,
                }).errors
            ).toContain(
                'Architecture budget exception for src/logic/contractSchemas.ts references missing ADR docs/adr/0002-zod-contract-boundary-strategy.md.'
            );
        } finally {
            fs.rmSync(tempRepo, { force: true, recursive: true });
        }
    });
});
