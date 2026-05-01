import { createReadStream, existsSync } from 'fs';
import { readdir, readFile, stat } from 'fs/promises';
import { dirname, extname, join, relative, resolve, sep } from 'path';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, pathToFileURL } from 'url';
import { resolveManualChunk } from '@gemduel/shared/build/viteManualChunks';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const workspaceRoot = resolve(__dirname, '../..');
const artLibraryRoot = resolve(workspaceRoot, 'assets/art-library');
const surfaceReviewCorePath = resolve(
    workspaceRoot,
    'tools',
    'scripts',
    'visual-lab-surface-review-core.mjs'
);

const SURFACE_LAB_SLOT_SET = new Set([
    'shell-background',
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

const readJsonBody = async (request: import('http').IncomingMessage): Promise<unknown> =>
    new Promise((resolveBody, rejectBody) => {
        let body = '';
        request.setEncoding('utf8');
        request.on('data', (chunk) => {
            body += chunk;
            if (body.length > 4 * 1024 * 1024) {
                rejectBody(new Error('Request body is too large'));
                request.destroy();
            }
        });
        request.on('end', () => {
            try {
                resolveBody(body ? JSON.parse(body) : {});
            } catch (error) {
                rejectBody(error);
            }
        });
        request.on('error', rejectBody);
    });

const loadSurfaceReviewCore = async () =>
    import(pathToFileURL(surfaceReviewCorePath).href) as Promise<{
        loadSurfaceManifestRecords: (input: { repoRoot: string }) => unknown[];
        buildSurfaceReviewPlan: (input: {
            repoRoot: string;
            records: unknown[];
            ratings?: Record<string, unknown>;
            regenMarks?: Record<string, unknown>;
            comments?: Record<string, unknown>;
            origin?: string;
            href?: string;
            clientAssetSets?: Array<Record<string, unknown>>;
        }) => Record<string, unknown>;
        writeSurfaceReviewPlan: (input: {
            repoRoot: string;
            plan: Record<string, unknown>;
        }) => Record<string, unknown>;
        findLatestCompletion: (input: { repoRoot: string }) => unknown | null;
        readSurfaceReviewStateFile: (input: { repoRoot: string }) => unknown | null;
        writeSurfaceReviewStatePayload: (input: {
            repoRoot: string;
            payload: Record<string, unknown>;
        }) => unknown;
        getSurfaceReviewStateRelativePath: (input: { repoRoot: string }) => string;
    }>;

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

        server.middlewares.use('/__surface-lab/review-state.json', async (request, response) => {
            try {
                const core = await loadSurfaceReviewCore();
                const statePath = core.getSurfaceReviewStateRelativePath({
                    repoRoot: workspaceRoot,
                });

                if (request.method === 'GET') {
                    const state = core.readSurfaceReviewStateFile({ repoRoot: workspaceRoot });

                    if (!state) {
                        response.statusCode = 404;
                        response.setHeader('Content-Type', 'application/json; charset=utf-8');
                        response.end(JSON.stringify({ ok: false, error: 'No review state found' }));
                        return;
                    }

                    response.statusCode = 200;
                    response.setHeader('Content-Type', 'application/json; charset=utf-8');
                    response.end(
                        JSON.stringify({
                            ok: true,
                            state,
                            path: statePath,
                        })
                    );
                    return;
                }

                if (request.method !== 'PUT') {
                    response.statusCode = 405;
                    response.setHeader('Content-Type', 'application/json; charset=utf-8');
                    response.end(JSON.stringify({ ok: false, error: 'Method not allowed' }));
                    return;
                }

                const payload = (await readJsonBody(request)) as Record<string, unknown>;
                const state = core.writeSurfaceReviewStatePayload({
                    repoRoot: workspaceRoot,
                    payload,
                });

                response.statusCode = 200;
                response.setHeader('Content-Type', 'application/json; charset=utf-8');
                response.end(
                    JSON.stringify({
                        ok: true,
                        state,
                        path: statePath,
                    })
                );
            } catch (error) {
                response.statusCode = 500;
                response.setHeader('Content-Type', 'application/json; charset=utf-8');
                response.end(
                    JSON.stringify({
                        ok: false,
                        error: error instanceof Error ? error.message : 'Unknown error',
                    })
                );
            }
        });

        server.middlewares.use('/__surface-lab/review-plan', async (request, response) => {
            if (request.method !== 'POST') {
                response.statusCode = 405;
                response.setHeader('Content-Type', 'application/json; charset=utf-8');
                response.end(JSON.stringify({ error: 'Method not allowed' }));
                return;
            }

            try {
                const payload = (await readJsonBody(request)) as {
                    origin?: string;
                    href?: string;
                    ratings?: Record<string, unknown>;
                    regenMarks?: Record<string, unknown>;
                    comments?: Record<string, unknown>;
                    assetSets?: Array<Record<string, unknown>>;
                };
                const core = await loadSurfaceReviewCore();
                const records = core.loadSurfaceManifestRecords({ repoRoot: workspaceRoot });
                const plan = core.buildSurfaceReviewPlan({
                    repoRoot: workspaceRoot,
                    records,
                    ratings: payload.ratings ?? {},
                    regenMarks: payload.regenMarks ?? {},
                    comments: payload.comments ?? {},
                    origin: payload.origin ?? '',
                    href: payload.href ?? '',
                    clientAssetSets: payload.assetSets ?? [],
                });
                const files = core.writeSurfaceReviewPlan({ repoRoot: workspaceRoot, plan });

                response.statusCode = 200;
                response.setHeader('Content-Type', 'application/json; charset=utf-8');
                response.end(JSON.stringify({ ok: true, plan, files }));
            } catch (error) {
                response.statusCode = 500;
                response.setHeader('Content-Type', 'application/json; charset=utf-8');
                response.end(
                    JSON.stringify({
                        ok: false,
                        error: error instanceof Error ? error.message : 'Unknown error',
                    })
                );
            }
        });

        server.middlewares.use(
            '/__surface-lab/review-completions/latest.json',
            async (_request, response) => {
                try {
                    const core = await loadSurfaceReviewCore();
                    const completion = core.findLatestCompletion({ repoRoot: workspaceRoot });
                    if (!completion) {
                        response.statusCode = 404;
                        response.setHeader('Content-Type', 'application/json; charset=utf-8');
                        response.end(
                            JSON.stringify({ error: 'No surface review completion found' })
                        );
                        return;
                    }

                    response.statusCode = 200;
                    response.setHeader('Content-Type', 'application/json; charset=utf-8');
                    response.end(JSON.stringify(completion));
                } catch (error) {
                    response.statusCode = 500;
                    response.setHeader('Content-Type', 'application/json; charset=utf-8');
                    response.end(
                        JSON.stringify({
                            error: error instanceof Error ? error.message : 'Unknown error',
                        })
                    );
                }
            }
        );

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
export default defineConfig(({ mode }) => {
    const includeVisualLabBundle =
        mode === 'development' || process.env.GEMDUEL_ALLOW_VISUAL_LAB === 'true';

    return {
        define: {
            __GEMDUEL_INCLUDE_VISUAL_LAB_BUNDLE__: JSON.stringify(includeVisualLabBundle),
        },
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
    };
});
