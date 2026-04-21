import { z } from 'zod';
import {
    bootstrapCommandSchema,
    gameActionSchema,
    guestIntentCommandSchema,
    marketCardRefSchema,
    networkMessageSchema,
    releaseHealthSnapshotSchema,
    responsiveLayoutSchema,
    runtimeRelayProfileSchema,
    runtimeIceServerListSchema,
    selectBuffPayloadSchema,
    turnCredentialIssueRequestSchema,
    turnCredentialBundleSchema,
    turnCredentialLeaseSchema,
    turnCredentialRefreshRequestSchema,
    turnCredentialRevokeRequestSchema,
    turnCredentialRevokeResultSchema,
    uiStatusNoticeSchema,
} from './contractSchemas';

export const CONTRACT_SNAPSHOT_SCHEMA_VERSION = 1;

const buildContractEntry = ({
    id,
    layer,
    schema,
    sourceRefs,
}: {
    id: string;
    layer: 'domain' | 'network' | 'ui' | 'runtime' | 'desktop';
    schema: z.ZodTypeAny;
    sourceRefs: string[];
}) => ({
    id,
    layer,
    sourceRefs,
    schema: z.toJSONSchema(schema),
});

export const buildContractSnapshot = () => ({
    schemaVersion: CONTRACT_SNAPSHOT_SCHEMA_VERSION,
    contracts: [
        buildContractEntry({
            id: 'domain-market-card-ref',
            layer: 'domain',
            schema: marketCardRefSchema,
            sourceRefs: [
                'packages/shared/src/logic/contractSchemas.ts',
                'packages/shared/src/types/domain.ts',
            ],
        }),
        buildContractEntry({
            id: 'domain-select-buff-payload',
            layer: 'domain',
            schema: selectBuffPayloadSchema,
            sourceRefs: [
                'packages/shared/src/logic/contractSchemas.ts',
                'packages/shared/src/types/domain.ts',
            ],
        }),
        buildContractEntry({
            id: 'domain-runtime-action',
            layer: 'domain',
            schema: gameActionSchema,
            sourceRefs: [
                'packages/shared/src/logic/contractSchemas.ts',
                'packages/shared/src/types/domain.ts',
            ],
        }),
        buildContractEntry({
            id: 'network-bootstrap-command',
            layer: 'network',
            schema: bootstrapCommandSchema,
            sourceRefs: [
                'packages/shared/src/logic/contractSchemas.ts',
                'packages/shared/src/types/network.ts',
            ],
        }),
        buildContractEntry({
            id: 'network-guest-intent-command',
            layer: 'network',
            schema: guestIntentCommandSchema,
            sourceRefs: [
                'packages/shared/src/logic/contractSchemas.ts',
                'packages/shared/src/types/network.ts',
            ],
        }),
        buildContractEntry({
            id: 'network-message-envelope',
            layer: 'network',
            schema: networkMessageSchema,
            sourceRefs: [
                'packages/shared/src/logic/contractSchemas.ts',
                'packages/shared/src/types/network.ts',
            ],
        }),
        buildContractEntry({
            id: 'network-turn-credential-issue-request',
            layer: 'network',
            schema: turnCredentialIssueRequestSchema,
            sourceRefs: [
                'packages/shared/src/logic/contractSchemas.ts',
                'packages/turn-service/src/turnCredentialService.js',
            ],
        }),
        buildContractEntry({
            id: 'network-turn-credential-refresh-request',
            layer: 'network',
            schema: turnCredentialRefreshRequestSchema,
            sourceRefs: [
                'packages/shared/src/logic/contractSchemas.ts',
                'packages/turn-service/src/turnCredentialService.js',
            ],
        }),
        buildContractEntry({
            id: 'network-turn-credential-revoke-request',
            layer: 'network',
            schema: turnCredentialRevokeRequestSchema,
            sourceRefs: [
                'packages/shared/src/logic/contractSchemas.ts',
                'packages/turn-service/src/turnCredentialService.js',
            ],
        }),
        buildContractEntry({
            id: 'network-turn-credential-lease',
            layer: 'network',
            schema: turnCredentialLeaseSchema,
            sourceRefs: [
                'packages/shared/src/logic/contractSchemas.ts',
                'packages/turn-service/src/turnCredentialService.js',
            ],
        }),
        buildContractEntry({
            id: 'network-turn-credential-revoke-result',
            layer: 'network',
            schema: turnCredentialRevokeResultSchema,
            sourceRefs: [
                'packages/shared/src/logic/contractSchemas.ts',
                'packages/turn-service/src/turnCredentialService.js',
            ],
        }),
        buildContractEntry({
            id: 'ui-status-notice',
            layer: 'ui',
            schema: uiStatusNoticeSchema,
            sourceRefs: [
                'packages/shared/src/logic/contractSchemas.ts',
                'packages/shared/src/types/ui.ts',
            ],
        }),
        buildContractEntry({
            id: 'ui-responsive-layout',
            layer: 'ui',
            schema: responsiveLayoutSchema,
            sourceRefs: [
                'packages/shared/src/logic/contractSchemas.ts',
                'packages/shared/src/types/ui.ts',
            ],
        }),
        buildContractEntry({
            id: 'runtime-ice-server-list',
            layer: 'runtime',
            schema: runtimeIceServerListSchema,
            sourceRefs: [
                'packages/shared/src/logic/contractSchemas.ts',
                'apps/desktop/electron/runtimeConfig.js',
            ],
        }),
        buildContractEntry({
            id: 'runtime-turn-credential-bundle',
            layer: 'runtime',
            schema: turnCredentialBundleSchema,
            sourceRefs: [
                'packages/shared/src/logic/contractSchemas.ts',
                'apps/desktop/electron/runtimeConfig.js',
            ],
        }),
        buildContractEntry({
            id: 'runtime-relay-profile',
            layer: 'runtime',
            schema: runtimeRelayProfileSchema,
            sourceRefs: [
                'packages/shared/src/logic/contractSchemas.ts',
                'packages/shared/src/types/runtime.ts',
            ],
        }),
        buildContractEntry({
            id: 'desktop-release-health-snapshot',
            layer: 'desktop',
            schema: releaseHealthSnapshotSchema,
            sourceRefs: [
                'packages/shared/src/logic/contractSchemas.ts',
                'apps/desktop/electron/releaseHealth.js',
            ],
        }),
    ],
});
