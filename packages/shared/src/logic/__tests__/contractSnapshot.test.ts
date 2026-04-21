import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { buildContractSnapshot, CONTRACT_SNAPSHOT_SCHEMA_VERSION } from '../contractSnapshot';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../../../../../');
const expectedSnapshot = JSON.parse(
    fs.readFileSync(
        path.join(repoRoot, 'tools', 'governance', 'contract-registry.snapshot.json'),
        'utf8'
    )
);

describe('contract snapshot governance', () => {
    it('matches the committed audited contract snapshot', () => {
        expect(buildContractSnapshot()).toEqual(expectedSnapshot);
    });

    it('guards the exact core contract set and schema version', () => {
        const snapshot = buildContractSnapshot();

        expect(snapshot.schemaVersion).toBe(CONTRACT_SNAPSHOT_SCHEMA_VERSION);
        expect(snapshot.contracts.map((contract) => contract.id)).toEqual([
            'domain-market-card-ref',
            'domain-select-buff-payload',
            'domain-runtime-action',
            'network-bootstrap-command',
            'network-guest-intent-command',
            'network-message-envelope',
            'network-turn-credential-issue-request',
            'network-turn-credential-refresh-request',
            'network-turn-credential-revoke-request',
            'network-turn-credential-lease',
            'network-turn-credential-revoke-result',
            'ui-status-notice',
            'ui-responsive-layout',
            'runtime-ice-server-list',
            'runtime-turn-credential-bundle',
            'runtime-relay-profile',
            'desktop-release-health-snapshot',
        ]);
    });
});
