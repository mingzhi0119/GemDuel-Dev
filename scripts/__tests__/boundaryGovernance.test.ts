import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
    BOUNDARY_REGISTRY_SCHEMA_VERSION,
    EXPECTED_BOUNDARY_IDS,
    collectBoundaryRegistryErrors,
    collectBoundaryRegistrySnapshotErrors,
} from '../boundaryGovernance.js';
import { GOVERNANCE_DOC_PATHS } from '../governanceDocPaths.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');

const boundaryInventoryText = fs.readFileSync(
    path.join(repoRoot, GOVERNANCE_DOC_PATHS.boundaryInventory),
    'utf8'
);
const expectedRegistry = JSON.parse(
    fs.readFileSync(path.join(repoRoot, 'governance', 'boundary-registry.snapshot.json'), 'utf8')
);

describe('boundary governance', () => {
    it('accepts the audited registry snapshot', () => {
        expect(
            collectBoundaryRegistrySnapshotErrors({
                actualRegistry: expectedRegistry,
                expectedRegistry,
                boundaryInventoryText,
                repoRoot,
            })
        ).toEqual([]);
    });

    it('rejects duplicate ids and missing file references', () => {
        const malformedRegistry = {
            schemaVersion: BOUNDARY_REGISTRY_SCHEMA_VERSION,
            boundaries: [
                {
                    ...expectedRegistry.boundaries[0],
                    validatorRefs: ['src/logic/does-not-exist.ts'],
                },
                {
                    ...expectedRegistry.boundaries[0],
                },
                ...expectedRegistry.boundaries.slice(2),
            ],
        };

        const errors = collectBoundaryRegistryErrors({
            boundaryRegistry: malformedRegistry,
            boundaryInventoryText,
            repoRoot,
        });

        expect(errors).toContain(
            `Boundary registry contains duplicate id ${expectedRegistry.boundaries[0].id}.`
        );
        expect(errors).toContain(
            'Boundary registry is missing required boundary network-message-parsing.'
        );
        expect(errors).toContain(
            'Boundary renderer-action-dispatch references missing file src/logic/does-not-exist.ts.'
        );
    });

    it('guards the exact expected boundary set', () => {
        expect(expectedRegistry.boundaries.map((entry: { id: string }) => entry.id)).toEqual(
            EXPECTED_BOUNDARY_IDS
        );
    });
});
