import { spawn } from 'node:child_process';
import net from 'node:net';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workspaceRoot = path.resolve(__dirname, '..', '..');
const DEFAULT_TIMEOUT_MS = 90_000;
const POLL_INTERVAL_MS = 250;

const trackedChildren = new Set();
let cleaningUp = false;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const writeStdout = (line) => {
    process.stdout.write(`${line}\n`);
};
const writeStderr = (line) => {
    process.stderr.write(`${line}\n`);
};

const findFreePort = (preferredPort = 5173) =>
    new Promise((resolve, reject) => {
        const tryPort = (candidatePort, remainingAttempts) => {
            const server = net.createServer();
            server.unref();
            server.once('error', (error) => {
                server.close();
                if (error?.code === 'EADDRINUSE' && remainingAttempts > 0) {
                    tryPort(candidatePort + 1, remainingAttempts - 1);
                    return;
                }

                reject(error);
            });
            server.once('listening', () => {
                const address = server.address();
                server.close(() =>
                    resolve(typeof address === 'object' ? address.port : candidatePort)
                );
            });
            server.listen(candidatePort, '127.0.0.1');
        };

        tryPort(preferredPort, 50);
    });

const readLines = (stream, onLine) => {
    let buffer = '';
    stream.on('data', (chunk) => {
        buffer += chunk.toString();
        const lines = buffer.split(/\r?\n/);
        buffer = lines.pop() ?? '';
        for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed) {
                onLine(trimmed);
            }
        }
    });
    stream.on('end', () => {
        const trimmed = buffer.trim();
        if (trimmed) {
            onLine(trimmed);
        }
    });
};

const createPnpmInvocation = (args) =>
    process.platform === 'win32'
        ? {
              command: process.env.ComSpec ?? 'cmd.exe',
              args: ['/d', '/s', '/c', 'pnpm', ...args],
          }
        : {
              command: 'pnpm',
              args,
          };

const spawnTracked = (label, args, env = {}) => {
    const invocation = createPnpmInvocation(args);
    const child = spawn(invocation.command, invocation.args, {
        cwd: workspaceRoot,
        env: {
            ...process.env,
            ...env,
        },
        stdio: ['ignore', 'pipe', 'pipe'],
        windowsHide: true,
    });
    const captured = {
        label,
        child,
        lines: [],
    };
    trackedChildren.add(captured);

    const onLine = (line) => {
        captured.lines.push(line);
        writeStdout(`[${label}] ${line}`);
    };

    readLines(child.stdout, onLine);
    readLines(child.stderr, onLine);
    child.on('exit', (code, signal) => {
        onLine(`process exited (code=${code ?? 'null'}, signal=${signal ?? 'null'})`);
    });

    return captured;
};

const waitForHttpReady = async (url, timeoutMs) => {
    const deadline = Date.now() + timeoutMs;

    while (Date.now() < deadline) {
        try {
            const response = await fetch(url);
            if (response.ok) {
                return;
            }
        } catch {
            // Keep polling until the timeout.
        }

        await wait(POLL_INTERVAL_MS);
    }

    throw new Error(`Timed out waiting for dev server at ${url}.`);
};

const waitForLogLine = async (captured, matcher, timeoutMs) => {
    const deadline = Date.now() + timeoutMs;

    while (Date.now() < deadline) {
        const line = captured.lines.find((entry) => matcher(entry));
        if (line) {
            return line;
        }

        if (captured.child.exitCode !== null) {
            throw new Error(`${captured.label} exited before reaching the expected state.`);
        }

        await wait(POLL_INTERVAL_MS);
    }

    const recentLines = captured.lines.slice(-25).join('\n');
    throw new Error(
        `Timed out waiting for ${captured.label} to emit the expected marker.\nRecent output:\n${recentLines}`
    );
};

const terminateCaptured = async (captured) => {
    if (!captured || captured.child.exitCode !== null) {
        return;
    }

    if (process.platform === 'win32') {
        await new Promise((resolve) => {
            const killer = spawn('taskkill', ['/PID', String(captured.child.pid), '/T', '/F'], {
                stdio: 'ignore',
                windowsHide: true,
            });
            killer.on('exit', () => resolve(undefined));
            killer.on('error', () => resolve(undefined));
        });
        return;
    }

    captured.child.kill('SIGTERM');
    await wait(1_000);
    if (captured.child.exitCode === null) {
        captured.child.kill('SIGKILL');
    }
};

const cleanupAllChildren = async () => {
    if (cleaningUp) {
        return;
    }

    cleaningUp = true;
    await Promise.allSettled(
        Array.from(trackedChildren).map((captured) => terminateCaptured(captured))
    );
    trackedChildren.clear();
};

process.on('SIGINT', async () => {
    await cleanupAllChildren();
    process.exit(130);
});

process.on('SIGTERM', async () => {
    await cleanupAllChildren();
    process.exit(143);
});

const launchElectronVerifier = ({ profile, devServerPort, preferredPeerPort }) => {
    const devServerUrl = `http://localhost:${devServerPort}/?lanHarness=1&lanMode=classic&lanProfile=${profile}`;

    return spawnTracked(`electron-${profile}`, ['--dir', 'apps/desktop', 'exec', 'electron', '.'], {
        GEMDUEL_DEV_SERVER_URL: devServerUrl,
        GEMDUEL_USER_DATA_SUFFIX: `lan-verify-${profile}-${Date.now()}`,
        GEMDUEL_DISABLE_UPDATES: 'true',
        GEMDUEL_LOG_LEVEL: 'debug',
        GEMDUEL_PEER_SERVER_PORT: String(preferredPeerPort),
    });
};

const main = async () => {
    const devServerPort = await findFreePort(5173);
    spawnTracked('vite', [
        '--dir',
        'apps/desktop',
        'exec',
        'vite',
        '--host',
        '127.0.0.1',
        '--port',
        String(devServerPort),
        '--strictPort',
    ]);

    try {
        await waitForHttpReady(`http://localhost:${devServerPort}`, 30_000);

        const alpha = launchElectronVerifier({
            profile: 'alpha',
            devServerPort,
            preferredPeerPort: 9000,
        });
        const beta = launchElectronVerifier({
            profile: 'beta',
            devServerPort,
            preferredPeerPort: 9001,
        });

        await Promise.all([
            waitForLogLine(
                alpha,
                (line) =>
                    line.includes('[LAN-VERIFY][alpha] STARTED') ||
                    (line.includes('"name":"LAN_DEV_VERIFICATION_STARTED"') &&
                        line.includes('"profile":"alpha"')),
                DEFAULT_TIMEOUT_MS
            ),
            waitForLogLine(
                beta,
                (line) =>
                    line.includes('[LAN-VERIFY][beta] STARTED') ||
                    (line.includes('"name":"LAN_DEV_VERIFICATION_STARTED"') &&
                        line.includes('"profile":"beta"')),
                DEFAULT_TIMEOUT_MS
            ),
        ]);

        writeStdout('[lan-verify] Local dual-Electron LAN verification succeeded.');
    } finally {
        await cleanupAllChildren();
    }
};

main().catch(async (error) => {
    writeStderr('[lan-verify] Verification failed.');
    writeStderr(error instanceof Error ? error.message : String(error));
    await cleanupAllChildren();
    process.exit(1);
});
