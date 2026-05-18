import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import { createMultiplayerViewForPlayer } from '../../packages/shared/src/logic/multiplayerVisibility';
import type { GameState, PlayerKey } from '../../packages/shared/src/types';

const workspaceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const defaultFixturePath = path.join(
    workspaceRoot,
    'artifacts',
    'unity',
    'lan-visibility',
    'unity-lan-visibility-fixture.json'
);
const defaultReportPath = path.join(
    workspaceRoot,
    'artifacts',
    'unity',
    'lan-visibility',
    'unity-lan-visibility-parity-report.json'
);

const parseArgs = () => {
    const values = new Map<string, string>();
    const args = process.argv.slice(2);
    for (let index = 0; index < args.length; index += 1) {
        const arg = args[index];
        if (!arg.startsWith('--')) {
            throw new Error(`Unknown positional argument: ${arg}`);
        }

        const next = args[index + 1];
        if (!next || next.startsWith('--')) {
            throw new Error(`Missing value for ${arg}`);
        }

        values.set(arg, next);
        index += 1;
    }

    return {
        fixturePath: path.resolve(workspaceRoot, values.get('--fixture') ?? defaultFixturePath),
        reportPath: path.resolve(workspaceRoot, values.get('--out') ?? defaultReportPath),
    };
};

const normalizeForCompare = (value: unknown): unknown => {
    if (Array.isArray(value)) {
        return value.map(normalizeForCompare);
    }

    if (value && typeof value === 'object') {
        const record = value as Record<string, unknown>;
        return Object.fromEntries(
            Object.keys(record)
                .sort()
                .map((key) => [key, normalizeForCompare(record[key])])
        );
    }

    return value;
};

const stableJson = (value: unknown): string => JSON.stringify(normalizeForCompare(value));

const selectVisibilityContractFields = (state: GameState) => ({
    localPlayer: state.localPlayer,
    isHost: state.isHost,
    hostPlayer: state.hostPlayer,
    playerReserved: state.playerReserved,
});

const run = () => {
    const options = parseArgs();
    const fixture = JSON.parse(readFileSync(options.fixturePath, 'utf8')) as {
        viewerPlayer: PlayerKey;
        authoritative: GameState;
        unityView: GameState;
    };
    const sharedView = createMultiplayerViewForPlayer(fixture.authoritative, fixture.viewerPlayer);
    const sharedContract = selectVisibilityContractFields(sharedView);
    const unityContract = selectVisibilityContractFields(fixture.unityView);
    const fields = Object.keys(sharedContract) as Array<keyof typeof sharedContract>;
    const differences = fields
        .filter((field) => stableJson(sharedContract[field]) !== stableJson(unityContract[field]))
        .map((field) => ({
            field,
            shared: sharedContract[field],
            unity: unityContract[field],
        }));
    const ok = differences.length === 0;
    const report = {
        schemaVersion: 1,
        kind: 'unity-lan-visibility-parity-report',
        fixturePath: options.fixturePath,
        viewerPlayer: fixture.viewerPlayer,
        ok,
        checkedFields: fields,
        differences,
        sharedContract,
        unityContract,
    };

    mkdirSync(path.dirname(options.reportPath), { recursive: true });
    writeFileSync(options.reportPath, `${JSON.stringify(report, null, 4)}\n`);
    process.stdout.write(
        `${JSON.stringify({ ...report, reportPath: options.reportPath }, null, 4)}\n`
    );
    process.exit(ok ? 0 : 1);
};

run();
