import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import net from 'node:net';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const currentFile = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(currentFile), '..', '..');
const nowSlug = new Date().toISOString().replace(/[:.]/g, '-');
const defaultExe = path.join(
    repoRoot,
    'artifacts',
    'unity',
    'build',
    'windows',
    'GemDuelUnity.exe'
);
const outputDir = path.join(repoRoot, 'artifacts', 'unity', 'lan-built-player-smoke', nowSlug);

const parseArgs = () => {
    const args = process.argv.slice(2);
    const values = new Map();
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

    return {
        exe: values.get('--exe') ?? defaultExe,
        host: values.get('--host') ?? '127.0.0.1',
        port: Number(values.get('--port') ?? 0),
        timeoutMs: Number(values.get('--timeout-ms') ?? 60000),
        lanTimeoutMs: Number(values.get('--lan-timeout-ms') ?? 30000),
        outDir: values.get('--out-dir') ?? outputDir,
    };
};

const readTextIfExists = async (filePath) => {
    try {
        return await readFile(filePath, 'utf8');
    } catch {
        return '';
    }
};

const readJsonIfExists = async (filePath) => {
    const text = await readTextIfExists(filePath);
    if (!text) {
        return null;
    }

    try {
        return JSON.parse(text);
    } catch (error) {
        return {
            ok: false,
            parseError: error instanceof Error ? error.message : String(error),
            rawText: text.slice(0, 4000),
        };
    }
};

const pickFreePort = () =>
    new Promise((resolve, reject) => {
        const server = net.createServer();
        server.on('error', reject);
        server.listen(0, '127.0.0.1', () => {
            const address = server.address();
            const port = typeof address === 'object' && address ? address.port : 0;
            server.close(() => resolve(port));
        });
    });

const assertPortFree = (port) =>
    new Promise((resolve, reject) => {
        const server = net.createServer();
        server.once('error', (error) => reject(error));
        server.listen(port, '127.0.0.1', () => {
            server.close(() => resolve());
        });
    });

const startMailboxBridge = async (mailboxDir, rulesRuntimeDir) => {
    const requestDir = path.join(mailboxDir, 'requests');
    const responseDir = path.join(mailboxDir, 'responses');
    await rm(mailboxDir, { recursive: true, force: true });
    await mkdir(requestDir, { recursive: true });
    await mkdir(responseDir, { recursive: true });

    const bridge = spawn(
        path.join(rulesRuntimeDir, 'node.exe'),
        [path.join(rulesRuntimeDir, 'unity-rules-engine-bridge.mjs'), '--mailbox', mailboxDir],
        {
            cwd: rulesRuntimeDir,
            env: {
                ...process.env,
                GEMDUEL_RULES_RUNTIME_DIR: rulesRuntimeDir,
                GEMDUEL_UNITY_CATALOG_DIR: path.join(rulesRuntimeDir, 'catalog'),
            },
            windowsHide: true,
        }
    );
    const stdoutChunks = [];
    const stderrChunks = [];
    let exit = null;
    let error = null;
    bridge.stdout?.on('data', (chunk) => stdoutChunks.push(Buffer.from(chunk)));
    bridge.stderr?.on('data', (chunk) => stderrChunks.push(Buffer.from(chunk)));
    bridge.on('close', (code, signal) => {
        exit = { code, signal };
    });
    bridge.on('error', (nextError) => {
        error = nextError;
        exit = { code: null, signal: null };
    });
    await new Promise((resolve) => setTimeout(resolve, 250));
    if (exit || error) {
        throw new Error(
            `Unity LAN bridge mailbox failed to start. ${
                error ? String(error) : `code=${exit.code}, signal=${exit.signal}`
            } ${Buffer.concat(stderrChunks).toString('utf8')}`
        );
    }

    return {
        mailboxDir,
        requestDir,
        responseDir,
        stop: async () => {
            if (!bridge.killed && exit == null) {
                bridge.kill();
            }

            return {
                exit,
                stdout: Buffer.concat(stdoutChunks).toString('utf8'),
                stderr: Buffer.concat(stderrChunks).toString('utf8'),
            };
        },
    };
};

const launchPlayer = ({
    exe,
    role,
    host,
    port,
    timeoutMs,
    lanTimeoutMs,
    outDir,
    rulesRuntimeDir,
    mailboxDir,
}) => {
    const report = path.join(outDir, `${role}.json`);
    const stdout = path.join(outDir, `${role}.stdout.log`);
    const stderr = path.join(outDir, `${role}.stderr.log`);
    const playerLog = path.join(outDir, `${role}.player.log`);
    const args = [
        '-batchmode',
        '-nographics',
        '-logFile',
        playerLog,
        '--gemduel-built-player-smoke',
        '--gemduel-smoke-report',
        report,
        '--gemduel-smoke-lan-role',
        role,
        '--gemduel-smoke-lan-host',
        host,
        '--gemduel-smoke-lan-port',
        String(port),
        '--gemduel-smoke-lan-timeout-ms',
        String(lanTimeoutMs),
    ];
    const stdoutChunks = [];
    const stderrChunks = [];
    const child = spawn(exe, args, {
        cwd: repoRoot,
        env: {
            ...process.env,
            GEMDUEL_RULES_RUNTIME_DIR: rulesRuntimeDir,
            GEMDUEL_UNITY_CATALOG_DIR: path.join(rulesRuntimeDir, 'catalog'),
            GEMDUEL_RULES_BRIDGE_MAILBOX_DIR: mailboxDir,
        },
        windowsHide: true,
    });
    child.stdout?.on('data', (chunk) => stdoutChunks.push(Buffer.from(chunk)));
    child.stderr?.on('data', (chunk) => stderrChunks.push(Buffer.from(chunk)));
    const startedAt = new Date().toISOString();
    let timedOut = false;
    const timer = setTimeout(() => {
        timedOut = true;
        child.kill('SIGKILL');
    }, timeoutMs);
    const exit = new Promise((resolve) => {
        child.on('close', (code, signal) => resolve({ code, signal }));
        child.on('error', (error) => resolve({ code: null, signal: null, error }));
    }).then(async (result) => {
        clearTimeout(timer);
        const stdoutText = Buffer.concat(stdoutChunks).toString('utf8');
        const stderrText = Buffer.concat(stderrChunks).toString('utf8');
        await writeFile(stdout, stdoutText);
        await writeFile(stderr, stderrText);
        return {
            role,
            startedAt,
            completedAt: new Date().toISOString(),
            exitCode: result.code,
            signal: result.signal,
            error: result.error ? String(result.error) : null,
            timedOut,
            paths: {
                report,
                stdout,
                stderr,
                playerLog,
            },
            args,
            stdoutBytes: Buffer.byteLength(stdoutText),
            stderrBytes: Buffer.byteLength(stderrText),
            reportJson: await readJsonIfExists(report),
            playerLogTail: (await readTextIfExists(playerLog)).slice(-4000),
        };
    });

    return {
        child,
        exit,
    };
};

const finalLan = (player) => player?.reportJson?.lanSmoke?.final?.lan ?? null;

const run = async () => {
    const options = parseArgs();
    const exe = path.resolve(options.exe);
    if (!existsSync(exe)) {
        throw new Error(`Unity built player not found: ${exe}`);
    }

    const port = options.port > 0 ? options.port : await pickFreePort();
    await assertPortFree(port);
    const rulesRuntimeManifest = path.join(
        path.dirname(exe),
        `${path.parse(exe).name}_Data`,
        'StreamingAssets',
        'GemDuelRulesRuntime',
        'manifest.json'
    );
    if (!existsSync(rulesRuntimeManifest)) {
        throw new Error(
            `Packaged Unity rules runtime is missing: ${rulesRuntimeManifest}. Run pnpm unity:rules-runtime:package.`
        );
    }

    await mkdir(options.outDir, { recursive: true });
    const mailbox = await startMailboxBridge(path.join(options.outDir, 'rules-bridge-mailbox'), path.dirname(rulesRuntimeManifest));
    const startedAt = new Date().toISOString();
    const hostPlayer = launchPlayer({
        exe,
        role: 'host',
        host: options.host,
        port,
        timeoutMs: options.timeoutMs,
        lanTimeoutMs: options.lanTimeoutMs,
        outDir: options.outDir,
        rulesRuntimeDir: path.dirname(rulesRuntimeManifest),
        mailboxDir: mailbox.mailboxDir,
    });

    await new Promise((resolve) => setTimeout(resolve, 1000));
    const clientPlayer = launchPlayer({
        exe,
        role: 'client',
        host: options.host,
        port,
        timeoutMs: options.timeoutMs,
        lanTimeoutMs: options.lanTimeoutMs,
        outDir: options.outDir,
        rulesRuntimeDir: path.dirname(rulesRuntimeManifest),
        mailboxDir: mailbox.mailboxDir,
    });

    const [host, client] = await Promise.all([hostPlayer.exit, clientPlayer.exit]);
    const mailboxExit = await mailbox.stop();
    const hostFinal = finalLan(host);
    const clientFinal = finalLan(client);
    const sameFinalHash =
        hostFinal?.stateHash &&
        clientFinal?.stateHash &&
        hostFinal.stateHash === clientFinal.stateHash;
    const sameFinalRevision =
        Number.isFinite(hostFinal?.replayRevision) &&
        Number.isFinite(clientFinal?.replayRevision) &&
        hostFinal.replayRevision === clientFinal.replayRevision;
    const committedRevision =
        Number.isFinite(hostFinal?.replayRevision) && hostFinal.replayRevision >= 2;
    const ok =
        host.exitCode === 0 &&
        client.exitCode === 0 &&
        host.reportJson?.ok === true &&
        client.reportJson?.ok === true &&
        host.reportJson?.lanSmoke?.ok === true &&
        client.reportJson?.lanSmoke?.ok === true &&
        sameFinalHash &&
        sameFinalRevision &&
        committedRevision;
    const report = {
        schemaVersion: 1,
        kind: 'unity-lan-built-player-smoke-launcher',
        startedAt,
        completedAt: new Date().toISOString(),
        ok,
        exe,
        host: options.host,
        port,
        rulesRuntimeManifest,
        bridgeMailbox: {
            mailboxDir: mailbox.mailboxDir,
            requestDir: mailbox.requestDir,
            responseDir: mailbox.responseDir,
            exit: mailboxExit.exit,
            stdoutTail: mailboxExit.stdout.slice(-4000),
            stderrTail: mailboxExit.stderr.slice(-4000),
        },
        final: {
            sameFinalHash,
            sameFinalRevision,
            committedRevision,
            host: hostFinal,
            client: clientFinal,
        },
        players: {
            host,
            client,
        },
        failureReason: ok
            ? null
            : 'Unity LAN built-player smoke did not finish with matching host/client replayRevision and stateHash.',
    };
    const reportPath = path.join(options.outDir, 'unity-lan-built-player-smoke-launcher.json');
    await writeFile(reportPath, `${JSON.stringify(report, null, 4)}\n`);
    process.stdout.write(`${JSON.stringify({ ...report, reportPath }, null, 4)}\n`);
    process.exit(ok ? 0 : 1);
};

run().catch((error) => {
    process.stderr.write(`${error instanceof Error ? error.stack : String(error)}\n`);
    process.exit(1);
});
