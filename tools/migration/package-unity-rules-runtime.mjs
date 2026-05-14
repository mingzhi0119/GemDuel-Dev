#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { copyFile, mkdir, readdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const currentFile = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(currentFile), '..', '..');
const defaultBuildDir = path.join(repoRoot, 'artifacts', 'unity', 'build', 'windows');
const defaultReportDir = path.join(repoRoot, 'artifacts', 'unity', 'rules-runtime-package');
const runtimeDirectoryName = 'GemDuelRulesRuntime';
const bridgeBundleName = 'unity-rules-engine-bridge.mjs';
const manifestName = 'manifest.json';
const nodeRuntimeName = process.platform === 'win32' ? 'node.exe' : 'node';
const catalogFiles = ['cards.json', 'royals.json', 'buffs.json', 'gems.json'];

const parseArgs = () => {
    const values = new Map();
    const args = process.argv.slice(2);
    for (let index = 0; index < args.length; index += 1) {
        const arg = args[index];
        if (!arg.startsWith('--')) {
            continue;
        }

        const next = args[index + 1];
        if (next && !next.startsWith('--')) {
            values.set(arg, next);
            index += 1;
        } else {
            values.set(arg, 'true');
        }
    }

    const buildDir = path.resolve(values.get('--build-dir') ?? defaultBuildDir);
    const runtimeDir = path.resolve(
        values.get('--runtime-dir') ??
            path.join(buildDir, 'GemDuelUnity_Data', 'StreamingAssets', runtimeDirectoryName)
    );
    return {
        buildDir,
        runtimeDir,
        reportPath: path.resolve(
            values.get('--report') ??
                path.join(defaultReportDir, 'unity-rules-runtime-package-report.json')
        ),
    };
};

const sha256File = async (filePath) =>
    createHash('sha256')
        .update(await readFile(filePath))
        .digest('hex');

const repoPath = (filePath) => path.relative(repoRoot, filePath).replaceAll(path.sep, '/');

const readJson = async (filePath) => JSON.parse(await readFile(filePath, 'utf8'));

const findEsbuildBin = async () => {
    const pnpmDir = path.join(repoRoot, 'node_modules', '.pnpm');
    const entries = await readdir(pnpmDir, { withFileTypes: true }).catch(() => []);
    const packageDir = entries
        .filter((entry) => entry.isDirectory() && entry.name.startsWith('esbuild@'))
        .map((entry) => path.join(pnpmDir, entry.name, 'node_modules', 'esbuild', 'bin', 'esbuild'))
        .find((candidate) => existsSync(candidate));
    if (!packageDir) {
        throw new Error(
            'Unable to locate the local esbuild package. Run pnpm install from the repository root.'
        );
    }

    return packageDir;
};

const runEsbuild = async (runtimeDir) => {
    const esbuildBin = await findEsbuildBin();
    const outputPath = path.join(runtimeDir, bridgeBundleName);
    const result = spawnSync(
        process.execPath,
        [
            esbuildBin,
            'tools/migration/unity-rules-engine-bridge.ts',
            '--bundle',
            '--platform=node',
            '--format=esm',
            '--target=node24',
            `--outfile=${outputPath}`,
        ],
        {
            cwd: repoRoot,
            encoding: 'utf8',
            windowsHide: true,
        }
    );
    if (result.status !== 0) {
        throw new Error(
            `esbuild failed with status ${result.status}.\n${result.stdout}\n${result.stderr}`
        );
    }

    return {
        bundler: repoPath(esbuildBin),
        stdout: result.stdout,
        stderr: result.stderr,
        outputPath,
    };
};

const copyCatalog = async (runtimeDir) => {
    const catalogSourceDir = path.join(repoRoot, 'fixtures', 'unity-catalog');
    const catalogRuntimeDir = path.join(runtimeDir, 'catalog');
    await mkdir(catalogRuntimeDir, { recursive: true });
    const copied = [];
    for (const fileName of catalogFiles) {
        const source = path.join(catalogSourceDir, fileName);
        const destination = path.join(catalogRuntimeDir, fileName);
        await copyFile(source, destination);
        copied.push({ source, destination });
    }

    return copied;
};

const collectFiles = async (dir) => {
    const entries = await readdir(dir, { withFileTypes: true });
    const files = [];
    for (const entry of entries) {
        const filePath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            files.push(...(await collectFiles(filePath)));
        } else {
            files.push(filePath);
        }
    }

    return files.sort((left, right) => repoPath(left).localeCompare(repoPath(right)));
};

const assertNoForbiddenRuntimeFiles = (runtimeDir, filePaths) => {
    const forbiddenSegments = [
        'node_modules',
        '.git',
        'Library',
        'Temp',
        'Obj',
        'Logs',
        'UserSettings',
        '.env',
        'credential',
        'credentials',
        'secret',
    ];
    const violations = filePaths
        .map((filePath) => path.relative(runtimeDir, filePath).replaceAll(path.sep, '/'))
        .filter((relativePath) =>
            forbiddenSegments.some((segment) =>
                relativePath.toLowerCase().includes(segment.toLowerCase())
            )
        );
    if (violations.length > 0) {
        throw new Error(
            `Packaged Unity rules runtime contains forbidden local-only files: ${violations.join(', ')}`
        );
    }
};

const describeFiles = async (runtimeDir, filePaths) =>
    Promise.all(
        filePaths.map(async (filePath) => {
            const stats = await stat(filePath);
            return {
                path: path.relative(runtimeDir, filePath).replaceAll(path.sep, '/'),
                bytes: stats.size,
                sha256: await sha256File(filePath),
            };
        })
    );

const runSmoke = async (runtimeDir) => {
    const requestPath = path.join(runtimeDir, 'packaging-smoke-request.json');
    const responsePath = path.join(runtimeDir, 'packaging-smoke-response.json');
    const request = {
        kind: 'start',
        mode: 'LOCAL_PVP',
        seed: 'unity-release-runtime-package-smoke',
        hostPlayer: 'p1',
    };
    await writeFile(requestPath, `${JSON.stringify(request, null, 4)}\n`, 'utf8');
    const nodePath = path.join(runtimeDir, nodeRuntimeName);
    const bridgePath = path.join(runtimeDir, bridgeBundleName);
    const result = spawnSync(nodePath, [bridgePath, requestPath, '--out', responsePath], {
        cwd: runtimeDir,
        encoding: 'utf8',
        input: '',
        windowsHide: true,
    });

    return {
        requestPath,
        responsePath,
        request,
        result,
    };
};

const main = async () => {
    const options = parseArgs();
    const rootPackage = await readJson(path.join(repoRoot, 'package.json'));
    const runtimeParent = path.dirname(options.runtimeDir);
    await mkdir(runtimeParent, { recursive: true });
    await rm(options.runtimeDir, { recursive: true, force: true });
    await mkdir(options.runtimeDir, { recursive: true });

    const bundle = await runEsbuild(options.runtimeDir);
    const nodeDestination = path.join(options.runtimeDir, nodeRuntimeName);
    await copyFile(process.execPath, nodeDestination);
    await copyCatalog(options.runtimeDir);

    const manifestFilesBeforeManifest = await describeFiles(
        options.runtimeDir,
        await collectFiles(options.runtimeDir)
    );
    const manifest = {
        schemaVersion: 1,
        kind: 'gemduel-unity-rules-runtime-package',
        generatedAt: new Date().toISOString(),
        packageVersion: rootPackage.version,
        runtimeMode: 'packaged-node-esm',
        rulesSource: 'packages/shared via bundled tools/migration/unity-rules-engine-bridge.ts',
        launchContract: {
            command: `${nodeRuntimeName} ${bridgeBundleName}`,
            supportsRequestFile: true,
            supportsMailbox: true,
            requiresRepositoryRoot: false,
            requiresPnpm: false,
            requiresViteNode: false,
        },
        node: {
            version: process.version,
            sourcePath: process.execPath,
            packagePath: nodeRuntimeName,
        },
        bridge: {
            sourcePath: 'tools/migration/unity-rules-engine-bridge.ts',
            bundlePath: bridgeBundleName,
            bundler: bundle.bundler,
        },
        catalog: catalogFiles.map((fileName) => ({
            sourcePath: `fixtures/unity-catalog/${fileName}`,
            packagePath: `catalog/${fileName}`,
        })),
        files: manifestFilesBeforeManifest,
        exclusions: {
            nodeModules: true,
            pnpmLock: true,
            unityCache: true,
            sdkCredentials: true,
            localOnlyArtifacts: true,
        },
    };
    const manifestPath = path.join(options.runtimeDir, manifestName);
    await writeFile(manifestPath, `${JSON.stringify(manifest, null, 4)}\n`, 'utf8');

    const smoke = await runSmoke(options.runtimeDir);
    const response = existsSync(smoke.responsePath)
        ? JSON.parse(await readFile(smoke.responsePath, 'utf8'))
        : null;
    await rm(smoke.requestPath, { force: true });
    await rm(smoke.responsePath, { force: true });

    const filePaths = await collectFiles(options.runtimeDir);
    assertNoForbiddenRuntimeFiles(options.runtimeDir, filePaths);
    const packagedFiles = await describeFiles(options.runtimeDir, filePaths);
    const report = {
        schemaVersion: 1,
        kind: 'unity-rules-runtime-package-report',
        generatedAt: new Date().toISOString(),
        ok: smoke.result.status === 0 && response?.ok === true,
        buildDir: repoPath(options.buildDir),
        runtimeDir: repoPath(options.runtimeDir),
        manifestPath: repoPath(manifestPath),
        bridgeBundlePath: repoPath(path.join(options.runtimeDir, bridgeBundleName)),
        packagedFiles,
        smoke: {
            exitCode: smoke.result.status,
            stdout: smoke.result.stdout,
            stderr: smoke.result.stderr,
            responseOk: response?.ok === true,
            actionType: response?.actionType ?? null,
            stateHash: response?.stateHash ?? null,
            replayRevision: response?.replayRevision ?? null,
        },
        releaseRuntimeRulesPackaging: {
            status: smoke.result.status === 0 && response?.ok === true ? 'covered' : 'failed',
            requiresRepositoryRoot: false,
            requiresPnpm: false,
            requiresViteNode: false,
            packagedRuntimeMode: 'packaged-node-esm',
        },
    };

    await mkdir(path.dirname(options.reportPath), { recursive: true });
    await writeFile(options.reportPath, `${JSON.stringify(report, null, 4)}\n`, 'utf8');
    process.stdout.write(`${JSON.stringify(report, null, 4)}\n`);
    process.exit(report.ok ? 0 : 1);
};

main().catch((error) => {
    process.stderr.write(`${error instanceof Error ? error.stack : String(error)}\n`);
    process.exit(1);
});
