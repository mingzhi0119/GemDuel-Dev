import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { buildBoundaryRegistryFromSource } from '../buildBoundaryRegistryFromSource.js';
import {
    BOUNDARY_REGISTRY_SCHEMA_VERSION,
    EXPECTED_BOUNDARY_IDS,
    collectBoundaryRegistryErrors,
    collectBoundaryRegistrySnapshotErrors,
} from '../boundaryGovernance.js';
import { GOVERNANCE_DOC_PATHS } from '../governanceDocPaths.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../../..');

const boundaryInventoryText = fs.readFileSync(
    path.join(repoRoot, GOVERNANCE_DOC_PATHS.boundaryInventory),
    'utf8'
);
const expectedRegistry = JSON.parse(
    fs.readFileSync(
        path.join(repoRoot, 'tools', 'governance', 'boundary-registry.snapshot.json'),
        'utf8'
    )
);

describe('boundary governance', () => {
    it('accepts the audited registry snapshot', () => {
        expect(
            collectBoundaryRegistrySnapshotErrors({
                actualRegistry: buildBoundaryRegistryFromSource(),
                expectedRegistry,
                boundaryInventoryText,
                repoRoot,
            })
        ).toEqual([]);
    });

    it('rejects schema drift and empty boundary registries', () => {
        const errors = collectBoundaryRegistryErrors({
            boundaryRegistry: {
                schemaVersion: BOUNDARY_REGISTRY_SCHEMA_VERSION + 1,
                boundaries: [],
            },
            boundaryInventoryText,
            repoRoot,
        });

        expect(errors).toContain(
            `Boundary registry schemaVersion must remain ${BOUNDARY_REGISTRY_SCHEMA_VERSION}.`
        );
        expect(errors).toContain('Boundary registry must declare a non-empty boundaries array.');
    });

    it('rejects duplicate ids and missing file references', () => {
        const malformedRegistry = {
            schemaVersion: BOUNDARY_REGISTRY_SCHEMA_VERSION,
            boundaries: [
                {
                    ...expectedRegistry.boundaries[0],
                    validatorRefs: ['packages/shared/src/logic/does-not-exist.ts'],
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
            'Boundary renderer-action-dispatch references missing file packages/shared/src/logic/does-not-exist.ts.'
        );
    });

    it('rejects malformed boundary entries and traces unexpected ids', () => {
        const malformedRegistry = {
            schemaVersion: BOUNDARY_REGISTRY_SCHEMA_VERSION,
            boundaries: [
                null,
                {
                    id: 'custom-boundary',
                    title: 'Custom Boundary',
                    entrySurface: '',
                    owner: '',
                    failClosedBehavior: '',
                    validatorRefs: ['packages/shared/src/logic/does-not-exist.ts'],
                    contractRefs: [''],
                    reasonCodes: ['bad code'],
                    runtimeSignals: ['bad-signal'],
                    testRefs: ['packages/shared/src/logic/also-missing.ts'],
                },
            ],
        };

        const errors = collectBoundaryRegistryErrors({
            boundaryRegistry: malformedRegistry,
            boundaryInventoryText,
            repoRoot,
        });

        expect(errors).toContain('Boundary registry entries must be objects.');
        expect(errors).toContain('Boundary custom-boundary is missing string field entrySurface.');
        expect(errors).toContain('Boundary custom-boundary is missing string field owner.');
        expect(errors).toContain(
            'Boundary custom-boundary is missing string field failClosedBehavior.'
        );
        expect(errors).toContain(
            'Boundary custom-boundary contains a non-string contractRefs entry.'
        );
        expect(errors).toContain(
            'Boundary custom-boundary references missing file packages/shared/src/logic/does-not-exist.ts.'
        );
        expect(errors).toContain('Boundary custom-boundary uses invalid reason code bad code.');
        expect(errors).toContain(
            'Boundary custom-boundary uses invalid runtime signal bad-signal.'
        );
        expect(errors).toContain(
            `Boundary custom-boundary is not traceable from ${GOVERNANCE_DOC_PATHS.boundaryInventory} via id or title.`
        );
    });

    it('guards the exact expected boundary set', () => {
        expect(expectedRegistry.boundaries.map((entry: { id: string }) => entry.id)).toEqual(
            EXPECTED_BOUNDARY_IDS
        );
    });

    it('detects drift between the source registry and the committed snapshot', () => {
        const driftedRegistry = buildBoundaryRegistryFromSource();
        driftedRegistry.boundaries[0].owner = 'Unexpected Owner';

        expect(
            collectBoundaryRegistrySnapshotErrors({
                actualRegistry: driftedRegistry,
                expectedRegistry,
                boundaryInventoryText,
                repoRoot,
            })
        ).toContain('Boundary registry snapshot drifted from the audited source of truth.');
    });

    it('reports a missing boundary registry snapshot before comparing drift', () => {
        expect(
            collectBoundaryRegistrySnapshotErrors({
                actualRegistry: expectedRegistry,
                expectedRegistry: null,
                boundaryInventoryText,
                repoRoot,
            })
        ).toEqual(['Missing boundary registry snapshot.']);
    });
});
