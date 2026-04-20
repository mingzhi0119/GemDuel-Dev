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
    turnCredentialBundleSchema,
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
            sourceRefs: ['src/logic/contractSchemas.ts', 'src/types/domain.ts'],
        }),
        buildContractEntry({
            id: 'domain-select-buff-payload',
            layer: 'domain',
            schema: selectBuffPayloadSchema,
            sourceRefs: ['src/logic/contractSchemas.ts', 'src/types/domain.ts'],
        }),
        buildContractEntry({
            id: 'domain-runtime-action',
            layer: 'domain',
            schema: gameActionSchema,
            sourceRefs: ['src/logic/contractSchemas.ts', 'src/types/domain.ts'],
        }),
        buildContractEntry({
            id: 'network-bootstrap-command',
            layer: 'network',
            schema: bootstrapCommandSchema,
            sourceRefs: ['src/logic/contractSchemas.ts', 'src/types/network.ts'],
        }),
        buildContractEntry({
            id: 'network-guest-intent-command',
            layer: 'network',
            schema: guestIntentCommandSchema,
            sourceRefs: ['src/logic/contractSchemas.ts', 'src/types/network.ts'],
        }),
        buildContractEntry({
            id: 'network-message-envelope',
            layer: 'network',
            schema: networkMessageSchema,
            sourceRefs: ['src/logic/contractSchemas.ts', 'src/types/network.ts'],
        }),
        buildContractEntry({
            id: 'ui-status-notice',
            layer: 'ui',
            schema: uiStatusNoticeSchema,
            sourceRefs: ['src/logic/contractSchemas.ts', 'src/types/ui.ts'],
        }),
        buildContractEntry({
            id: 'ui-responsive-layout',
            layer: 'ui',
            schema: responsiveLayoutSchema,
            sourceRefs: ['src/logic/contractSchemas.ts', 'src/types/ui.ts'],
        }),
        buildContractEntry({
            id: 'runtime-ice-server-list',
            layer: 'runtime',
            schema: runtimeIceServerListSchema,
            sourceRefs: ['src/logic/contractSchemas.ts', 'electron/runtimeConfig.js'],
        }),
        buildContractEntry({
            id: 'runtime-turn-credential-bundle',
            layer: 'runtime',
            schema: turnCredentialBundleSchema,
            sourceRefs: ['src/logic/contractSchemas.ts', 'electron/runtimeConfig.js'],
        }),
        buildContractEntry({
            id: 'runtime-relay-profile',
            layer: 'runtime',
            schema: runtimeRelayProfileSchema,
            sourceRefs: ['src/logic/contractSchemas.ts', 'src/types/runtime.ts'],
        }),
        buildContractEntry({
            id: 'desktop-release-health-snapshot',
            layer: 'desktop',
            schema: releaseHealthSnapshotSchema,
            sourceRefs: ['src/logic/contractSchemas.ts', 'electron/releaseHealth.js'],
        }),
    ],
});
