import net from 'node:net';
import { createHash } from 'node:crypto';
import { PeerServer } from 'peer';

export const DEFAULT_PEER_SERVER_HOST = '0.0.0.0';
export const DEFAULT_PEER_SERVER_PATH = '/gemduel';
export const DEFAULT_PEER_SERVER_PORT_CANDIDATES = 25;

export const findAvailablePort = ({
    startingPort,
    host = DEFAULT_PEER_SERVER_HOST,
    portCandidates = DEFAULT_PEER_SERVER_PORT_CANDIDATES,
    createServer = net.createServer,
}) =>
    new Promise((resolve, reject) => {
        const tryPort = (candidatePort, remainingAttempts) => {
            const probe = createServer();
            probe.unref?.();
            probe.once('error', (error) => {
                probe.close?.();
                if (error?.code === 'EADDRINUSE' && remainingAttempts > 0) {
                    tryPort(candidatePort + 1, remainingAttempts - 1);
                    return;
                }
                reject(error);
            });
            probe.once('listening', () => {
                const address = probe.address();
                const port = typeof address === 'object' && address ? address.port : candidatePort;
                probe.close(() => resolve(port));
            });
            probe.listen(candidatePort, host);
        };

        tryPort(startingPort, portCandidates);
    });

const recordPeerHealth = (recordMainHealth, payload) => {
    if (typeof recordMainHealth === 'function') {
        recordMainHealth(payload);
    }
};

export const createStableLogId = (value, prefix = 'id') =>
    `${prefix}:${createHash('sha256')
        .update(typeof value === 'string' ? value : String(value ?? 'unknown'))
        .digest('hex')
        .slice(0, 12)}`;

/**
 * @param {{
 *   startingPort: number,
 *   host?: string,
 *   path?: string,
 *   portCandidates?: number,
 *   peerServerFactory?: Function,
 *   findPort?: Function,
 *   logger?: { info?: Function, warn?: Function },
 *   recordMainHealth?: Function,
 * }} options
 */
export const startPeerSignalingServer = async ({
    startingPort,
    host = DEFAULT_PEER_SERVER_HOST,
    path = DEFAULT_PEER_SERVER_PATH,
    portCandidates = DEFAULT_PEER_SERVER_PORT_CANDIDATES,
    peerServerFactory = PeerServer,
    findPort = findAvailablePort,
    logger,
    recordMainHealth,
}) => {
    const selectedPort = await findPort({
        startingPort,
        host,
        portCandidates,
    });
    let peerApp = null;
    const httpServer = await new Promise((resolve, reject) => {
        try {
            peerApp = peerServerFactory(
                {
                    port: selectedPort,
                    host,
                    path,
                    proxied: true,
                },
                (server) => resolve(server)
            );
        } catch (error) {
            reject(error);
        }
    });

    const serverState = {
        app: peerApp,
        httpServer,
        host,
        port: selectedPort,
        path,
        closed: false,
    };

    logger?.info?.(`[P2P] Local Signaling Server running on ${host}:${selectedPort}`);
    recordPeerHealth(recordMainHealth, {
        category: 'peer',
        name: 'PEER_SERVER_STARTED',
        severity: 'info',
        message: 'Local PeerJS signaling server started successfully.',
        context: {
            host,
            port: selectedPort,
        },
    });
    peerApp.on('connection', (client) => {
        const clientIdHash = createStableLogId(client.getId(), 'peer');
        logger?.info?.(`[P2P] Client connected: ${clientIdHash}`);
        recordPeerHealth(recordMainHealth, {
            category: 'peer',
            name: 'PEER_SERVER_CLIENT_CONNECTED',
            severity: 'info',
            message: 'A client connected to the local signaling server.',
            context: {
                clientIdHash,
                host,
                port: selectedPort,
            },
        });
    });

    peerApp.on('disconnect', (client) => {
        const clientIdHash = createStableLogId(client.getId(), 'peer');
        logger?.info?.(`[P2P] Client disconnected: ${clientIdHash}`);
        recordPeerHealth(recordMainHealth, {
            category: 'peer',
            name: 'PEER_SERVER_CLIENT_DISCONNECTED',
            severity: 'info',
            message: 'A client disconnected from the local signaling server.',
            context: {
                clientIdHash,
                host,
                port: selectedPort,
            },
        });
    });

    return serverState;
};

/**
 * @param {{
 *   httpServer?: { close?: Function },
 *   host?: string,
 *   port?: number,
 *   path?: string,
 *   closed?: boolean,
 * } | null | undefined} serverState
 * @param {{
 *   logger?: { info?: Function, warn?: Function },
 *   recordMainHealth?: Function,
 *   reason?: string,
 * }} [options]
 */
export const stopPeerSignalingServer = async (
    serverState,
    { logger, recordMainHealth, reason = 'app-shutdown' } = {}
) => {
    if (!serverState || serverState.closed) {
        return { closed: false };
    }

    serverState.closed = true;
    logger?.info?.('[P2P] Shutting down PeerServer...');
    recordPeerHealth(recordMainHealth, {
        category: 'peer',
        name: 'PEER_SERVER_SHUTDOWN',
        severity: 'info',
        message: 'Desktop process is shutting down the local signaling server.',
        context: {
            host: serverState.host,
            port: serverState.port,
            reason,
        },
    });

    if (typeof serverState.httpServer?.close !== 'function') {
        return { closed: false };
    }

    return new Promise((resolve) => {
        try {
            serverState.httpServer.close((error) => {
                if (error) {
                    logger?.warn?.('[P2P] PeerServer shutdown reported an error.', error);
                    resolve({ closed: false, error });
                    return;
                }

                resolve({ closed: true });
            });
        } catch (error) {
            logger?.warn?.('[P2P] PeerServer shutdown threw an error.', error);
            resolve({ closed: false, error });
        }
    });
};
