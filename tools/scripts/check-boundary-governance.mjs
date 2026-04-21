import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildBoundaryRegistryFromSource } from './buildBoundaryRegistryFromSource.js';
import { collectBoundaryRegistrySnapshotErrors } from './boundaryGovernance.js';
import { GOVERNANCE_DOC_PATHS } from './governanceDocPaths.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');

const boundaryInventoryText = fs.readFileSync(
    path.join(repoRoot, GOVERNANCE_DOC_PATHS.boundaryInventory),
    'utf8'
);
const actualRegistry = buildBoundaryRegistryFromSource();
const expectedRegistry = JSON.parse(
    fs.readFileSync(
        path.join(repoRoot, 'tools', 'governance', 'boundary-registry.snapshot.json'),
        'utf8'
    )
);

const errors = collectBoundaryRegistrySnapshotErrors({
    actualRegistry,
    expectedRegistry,
    boundaryInventoryText,
    repoRoot,
});

if (errors.length > 0) {
    console.error('Boundary governance check failed:');
    for (const error of errors) {
        console.error(`- ${error}`);
    }
    process.exit(1);
}

console.log(
    `Boundary governance check passed for ${expectedRegistry.boundaries.length} governed boundaries.`
);
