import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { parseArgs } from 'node:util';
import { fileURLToPath } from 'node:url';

import { format as formatWithPrettier } from 'prettier';

import { BUFFS, GEM_TYPES, ROYAL_CARDS } from '../../packages/shared/src/constants';
import { CLASSIC_CARDS, ROGUE_CARDS } from '../../packages/shared/src/data/realCards';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workspaceRoot = path.resolve(__dirname, '..', '..');

const DEFAULT_OUT_DIR = path.join(workspaceRoot, 'fixtures', 'unity-catalog');
const REPLAY_FIXTURE_DIR = path.join(workspaceRoot, 'fixtures', 'replay-golden');
const RULES_VERSION = '5.2.11';
const REPLAY_SCHEMA_VERSION = '1.0';
const CATALOG_SCHEMA_VERSION = 1;

type JsonRecord = Record<string, unknown>;

const formatJson = (value: unknown) =>
    formatWithPrettier(JSON.stringify(value), {
        parser: 'json',
        printWidth: 100,
        tabWidth: 4,
    });

const normalizeAbility = (ability: unknown): string[] => {
    if (Array.isArray(ability)) {
        return ability.map(String).sort();
    }

    return [String(ability ?? 'none')];
};

const cleanJson = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const uniqueById = <T extends { id: string }>(items: T[]): T[] => {
    const seen = new Map<string, T>();
    for (const item of items) {
        if (!seen.has(item.id)) {
            seen.set(item.id, item);
        }
    }

    return [...seen.values()].sort((left, right) => left.id.localeCompare(right.id));
};

const buildCards = () =>
    uniqueById([...CLASSIC_CARDS, ...ROGUE_CARDS]).map((card) => ({
        id: card.id,
        level: card.level,
        points: card.points,
        cost: cleanJson(card.cost),
        bonusColor: card.bonusColor ?? 'null',
        bonusCount: card.bonusCount ?? 0,
        crowns: card.crowns ?? 0,
        ability: normalizeAbility(card.ability),
        prestige: card.prestige ?? 0,
        isBuff: card.isBuff === true,
    }));

const buildRoyals = () =>
    [...ROYAL_CARDS]
        .sort((left, right) => left.id.localeCompare(right.id))
        .map((royal) => ({
            id: royal.id,
            points: royal.points,
            bonusColor: royal.bonusColor,
            crowns: royal.crowns ?? 0,
            ability: normalizeAbility(royal.ability),
            label: royal.label,
        }));

const buildBuffs = () =>
    Object.values(BUFFS)
        .map((buff) => cleanJson(buff) as JsonRecord)
        .sort((left, right) => String(left.id).localeCompare(String(right.id)))
        .map((buff) => ({
            id: buff.id,
            level: buff.level,
            category: buff.category ?? 'none',
            label: buff.label,
            desc: buff.desc,
            effects: buff.effects ?? {},
        }));

const buildGems = () =>
    Object.values(GEM_TYPES)
        .map((gem) => cleanJson(gem))
        .filter(
            (gem, index, gems) => gems.findIndex((candidate) => candidate.id === gem.id) === index
        )
        .sort((left, right) => left.id.localeCompare(right.id));

const readReplayReferences = async () => {
    const manifestPath = path.join(REPLAY_FIXTURE_DIR, 'manifest.json');
    const manifest = JSON.parse(await readFile(manifestPath, 'utf8')) as {
        fixtures: { fileName: string }[];
    };
    const cardIds = new Set<string>();
    const royalIds = new Set<string>();
    const buffIds = new Set<string>();

    for (const fixture of manifest.fixtures) {
        const replay = JSON.parse(
            await readFile(path.join(REPLAY_FIXTURE_DIR, fixture.fileName), 'utf8')
        ) as JsonRecord;
        const init = replay.init as JsonRecord;
        const cardInstances = init.cardInstances as Record<string, string>;
        Object.values(cardInstances).forEach((cardId) => cardIds.add(cardId));
        ((init.royalDeck as string[] | undefined) ?? []).forEach((royalId) =>
            royalIds.add(royalId)
        );

        const players = replay.players as Record<string, { buff?: { id?: string } }> | undefined;
        Object.values(players ?? {}).forEach((player) => {
            if (player.buff?.id) {
                buffIds.add(player.buff.id);
            }
        });

        const events = replay.events as JsonRecord[] | undefined;
        (events ?? []).forEach((event) => {
            if (typeof event.buffId === 'string') {
                buffIds.add(event.buffId);
            }
            if (typeof event.royalId === 'string') {
                royalIds.add(event.royalId);
            }
        });
    }

    return {
        cardIds: [...cardIds].sort(),
        royalIds: [...royalIds].sort(),
        buffIds: [...buffIds].sort(),
    };
};

const buildCatalogs = async () => {
    const cards = buildCards();
    const royals = buildRoyals();
    const buffs = buildBuffs();
    const gems = buildGems();
    const replayReferences = await readReplayReferences();

    const catalogIds = {
        cards: new Set(cards.map((card) => card.id)),
        royals: new Set(royals.map((royal) => royal.id)),
        buffs: new Set(buffs.map((buff) => String(buff.id))),
    };
    const missingCards = replayReferences.cardIds.filter((id) => !catalogIds.cards.has(id));
    const missingRoyals = replayReferences.royalIds.filter((id) => !catalogIds.royals.has(id));
    const missingBuffs = replayReferences.buffIds.filter((id) => !catalogIds.buffs.has(id));

    if (missingCards.length > 0 || missingRoyals.length > 0 || missingBuffs.length > 0) {
        throw new Error(
            [
                'Unity catalog export does not cover replay fixtures.',
                `Missing cards: ${missingCards.join(', ') || 'none'}`,
                `Missing royals: ${missingRoyals.join(', ') || 'none'}`,
                `Missing buffs: ${missingBuffs.join(', ') || 'none'}`,
            ].join('\n')
        );
    }

    const manifest = {
        schemaVersion: CATALOG_SCHEMA_VERSION,
        generatedAt: '2026-05-09T00:00:00.000Z',
        generatedBy: 'tools/migration/export-unity-catalogs.ts',
        rulesVersion: RULES_VERSION,
        replaySchemaVersion: REPLAY_SCHEMA_VERSION,
        files: {
            cards: 'cards.json',
            royals: 'royals.json',
            buffs: 'buffs.json',
            gems: 'gems.json',
        },
        counts: {
            cards: cards.length,
            royals: royals.length,
            buffs: buffs.length,
            gems: gems.length,
        },
        replayCoverage: {
            fixtureDirectory: 'fixtures/replay-golden',
            referencedCards: replayReferences.cardIds.length,
            referencedRoyals: replayReferences.royalIds.length,
            referencedBuffs: replayReferences.buffIds.length,
        },
    };

    return {
        'manifest.json': manifest,
        'cards.json': cards,
        'royals.json': royals,
        'buffs.json': buffs,
        'gems.json': gems,
    };
};

const writeCatalogs = async (outDir: string, catalogs: Record<string, unknown>) => {
    await mkdir(outDir, { recursive: true });
    await Promise.all(
        Object.entries(catalogs).map(async ([fileName, value]) =>
            writeFile(path.join(outDir, fileName), await formatJson(value), 'utf8')
        )
    );
};

const checkCatalogs = async (outDir: string, catalogs: Record<string, unknown>) => {
    const mismatches: string[] = [];
    for (const [fileName, value] of Object.entries(catalogs)) {
        const expected = await formatJson(value);
        let actual = '';
        try {
            actual = await readFile(path.join(outDir, fileName), 'utf8');
        } catch {
            mismatches.push(`${fileName}: missing`);
            continue;
        }

        if (actual !== expected) {
            mismatches.push(`${fileName}: differs from generated output`);
        }
    }

    if (mismatches.length > 0) {
        throw new Error(`Unity catalog check failed:\n${mismatches.join('\n')}`);
    }
};

const main = async () => {
    const { values } = parseArgs({
        options: {
            outDir: { type: 'string' },
            check: { type: 'boolean', default: false },
        },
    });
    const outDir = path.resolve(String(values.outDir ?? DEFAULT_OUT_DIR));
    const catalogs = await buildCatalogs();

    if (values.check) {
        await checkCatalogs(outDir, catalogs);
        process.stdout.write(`Unity catalog check passed for ${outDir}\n`);
        return;
    }

    await writeCatalogs(outDir, catalogs);
    process.stdout.write(`Unity catalogs exported to ${outDir}\n`);
};

main().catch((error) => {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    process.exit(1);
});
