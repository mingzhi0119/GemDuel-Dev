import { createReadStream, existsSync } from 'fs';
import { readdir, readFile, stat } from 'fs/promises';
import { dirname, extname, join, relative, resolve, sep } from 'path';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import { resolveManualChunk } from '@gemduel/shared/build/viteManualChunks';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const workspaceRoot = resolve(__dirname, '../..');
const artLibraryRoot = resolve(workspaceRoot, 'assets/art-library');

const SURFACE_LAB_SLOT_SET = new Set([
    'shell-background',
    'topbar',
    'player-zone',
    'player-zone-p1',
    'player-zone-p2',
    'gem-panel',
    'market-card-back-l1',
    'market-card-back-l2',
    'market-card-back-l3',
    'royal-card-back',
]);

const MIME_TYPES: Record<string, string> = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
};

type SurfaceLabManifestRecord = Record<string, unknown>;

const isInsideDirectory = (root: string, target: string) => {
    const relativePath = relative(root, target);
    return (
        Boolean(relativePath) &&
        !relativePath.startsWith('..') &&
        !relativePath.includes(`..${sep}`)
    );
};

const normalizeAssetPath = (archivePath: unknown): string | null => {
    if (typeof archivePath !== 'string') {
        return null;
    }

    const normalized = archivePath.replace(/\\/g, '/');
    const prefix = 'assets/art-library/';
    const prefixIndex = normalized.indexOf(prefix);

    if (prefixIndex < 0) {
        return null;
    }

    return normalized.slice(prefixIndex + prefix.length);
};

const getFirstString = (...values: unknown[]): string | null => {
    for (const value of values) {
        if (typeof value === 'string' && value.trim()) {
            return value;
        }
    }

    return null;
};

const parseDimensionPair = (value: unknown): readonly [number, number] | undefined => {
    if (Array.isArray(value) && value.length >= 2) {
        const width = Number(value[0]);
        const height = Number(value[1]);
        return Number.isFinite(width) && Number.isFinite(height) ? [width, height] : undefined;
    }

    if (typeof value === 'string') {
        const match = value.match(/(\d+)\s*x\s*(\d+)/i);
        if (match) {
            return [Number(match[1]), Number(match[2])];
        }
    }

    if (value && typeof value === 'object') {
        const record = value as Record<string, unknown>;
        const width = Number(record.width);
        const height = Number(record.height);
        return Number.isFinite(width) && Number.isFinite(height) ? [width, height] : undefined;
    }

    return undefined;
};

const normalizeDimensions = (record: SurfaceLabManifestRecord) => {
    const rawDimensions =
        record.dimensions && typeof record.dimensions === 'object'
            ? (record.dimensions as Record<string, unknown>)
            : {};
    const dimensions = {
        source: parseDimensionPair(
            record.sourceDimensions ?? record.source_dimensions ?? rawDimensions.source
        ),
        target: parseDimensionPair(
            record.targetDimensions ?? record.target_dimensions ?? rawDimensions.target
        ),
        archive: parseDimensionPair(
            record.archiveDimensions ??
                record.archive_dimensions ??
                rawDimensions.archive ??
                record.dimensions
        ),
    };

    return dimensions.source || dimensions.target || dimensions.archive ? dimensions : null;
};

const normalizeRisk = (record: SurfaceLabManifestRecord): string => {
    const risks = record.risks;

    if (Array.isArray(risks)) {
        return risks.map((risk) => String(risk)).join('; ');
    }

    return (
        getFirstString(
            record.risk,
            record.normalization,
            record.operation,
            record.recommendation
        ) ?? ''
    );
};

const getManifestRecords = (manifest: unknown): SurfaceLabManifestRecord[] => {
    const records = Array.isArray(manifest)
        ? manifest
        : manifest && typeof manifest === 'object'
          ? (manifest as { records?: unknown }).records
          : [];

    return Array.isArray(records)
        ? records.filter(
              (record): record is SurfaceLabManifestRecord =>
                  Boolean(record) && typeof record === 'object'
          )
        : [];
};

const collectPreviewManifestPaths = async (directory: string): Promise<string[]> => {
    const entries = await readdir(directory, { withFileTypes: true });
    const paths: string[] = [];

    for (const entry of entries) {
        const entryPath = join(directory, entry.name);

        if (entry.isDirectory()) {
            paths.push(...(await collectPreviewManifestPaths(entryPath)));
        } else if (entry.isFile() && entry.name === 'preview-manifest.json') {
            paths.push(entryPath);
        }
    }

    return paths;
};

const createSurfaceLabPlugin = (): Plugin => ({
    name: 'gemduel-surface-lab-assets',
    apply: 'serve',
    configureServer(server) {
        server.middlewares.use('/__surface-lab/candidates.json', async (_request, response) => {
            try {
                const rootEntries = existsSync(artLibraryRoot)
                    ? await readdir(artLibraryRoot, { withFileTypes: true })
                    : [];
                const candidates = [];

                for (const rootEntry of rootEntries) {
                    if (
                        !rootEntry.isDirectory() ||
                        !/^surface-autonomous(?:-.+)?-candidates$/.test(rootEntry.name)
                    ) {
                        continue;
                    }

                    const batchRoot = join(artLibraryRoot, rootEntry.name);
                    const manifestPaths = await collectPreviewManifestPaths(batchRoot);

                    for (const manifestPath of manifestPaths) {
                        const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
                        const records = getManifestRecords(manifest);
                        const relativeManifestPath = relative(batchRoot, manifestPath);
                        const [date] = relativeManifestPath.split(sep);

                        if (!date || records.length === 0) {
                            continue;
                        }

                        for (const record of records) {
                            const archivePath = normalizeAssetPath(
                                record.archive ??
                                    record.archivePath ??
                                    record.archive_path ??
                                    record.archive_relative
                            );
                            const slot = record.slot;

                            if (
                                !archivePath ||
                                typeof slot !== 'string' ||
                                !SURFACE_LAB_SLOT_SET.has(slot)
                            ) {
                                continue;
                            }

                            candidates.push({
                                batch: rootEntry.name,
                                date,
                                promptId: getFirstString(record.promptId, record.prompt_id) ?? '',
                                slot,
                                style: getFirstString(record.style) ?? '',
                                variant: getFirstString(record.variant) ?? '',
                                score:
                                    typeof record.score === 'number'
                                        ? record.score
                                        : Number(record.score) || null,
                                risk: normalizeRisk(record),
                                dimensions: normalizeDimensions(record),
                                archiveUrl: `/__surface-lab/assets/${archivePath}`,
                            });
                        }
                    }
                }

                response.statusCode = 200;
                response.setHeader('Content-Type', 'application/json; charset=utf-8');
                response.end(JSON.stringify({ candidates }));
            } catch (error) {
                response.statusCode = 500;
                response.setHeader('Content-Type', 'application/json; charset=utf-8');
                response.end(
                    JSON.stringify({
                        candidates: [],
                        error: error instanceof Error ? error.message : 'Unknown error',
                    })
                );
            }
        });

        server.middlewares.use('/__surface-lab/assets/', async (request, response) => {
            const url = new URL(request.url ?? '', 'http://surface-lab.local');
            const relativeAssetPath = decodeURIComponent(url.pathname.replace(/^\/+/, ''));
            const assetPath = resolve(artLibraryRoot, relativeAssetPath);

            if (!isInsideDirectory(artLibraryRoot, assetPath)) {
                response.statusCode = 403;
                response.end('Forbidden');
                return;
            }

            try {
                const assetStat = await stat(assetPath);

                if (!assetStat.isFile()) {
                    response.statusCode = 404;
                    response.end('Not found');
                    return;
                }

                response.statusCode = 200;
                response.setHeader(
                    'Content-Type',
                    MIME_TYPES[extname(assetPath).toLowerCase()] ?? 'application/octet-stream'
                );
                createReadStream(assetPath).pipe(response);
            } catch {
                response.statusCode = 404;
                response.end('Not found');
            }
        });
    },
});

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), createSurfaceLabPlugin()],
    base: './',
    server: {
        host: '127.0.0.1',
        port: 5173,
        strictPort: true,
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: resolveManualChunk,
            },
        },
    },
    resolve: {
        alias: {
            '@app': resolve(__dirname, './src'),
            '@gemduel/shared': resolve(workspaceRoot, './packages/shared/src'),
            '@gemduel/ui': resolve(workspaceRoot, './packages/ui/src'),
            '@gemduel/turn-service': resolve(workspaceRoot, './packages/turn-service/src'),
        },
    },
});
