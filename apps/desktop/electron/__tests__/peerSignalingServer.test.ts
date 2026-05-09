// @vitest-environment node

import { EventEmitter } from 'node:events';
import { describe, expect, it, vi } from 'vitest';
import {
    createStableLogId,
    findAvailablePort,
    startPeerSignalingServer,
    stopPeerSignalingServer,
} from '../peerSignalingServer.js';

describe('peer signaling server governance', () => {
    it('retries occupied ports and rejects non-retryable probe errors', async () => {
        const createServer = vi
            .fn()
            .mockImplementationOnce(() => {
                const handlers = new Map<string, (value?: unknown) => void>();
                return {
                    unref: vi.fn(),
                    once: vi.fn((event: string, callback: (value?: unknown) => void) => {
                        handlers.set(event, callback);
                    }),
                    close: vi.fn(),
                    listen: vi.fn(() => {
                        handlers.get('error')?.(
                            Object.assign(new Error('busy'), { code: 'EADDRINUSE' })
                        );
                    }),
                    address: vi.fn(),
                };
            })
            .mockImplementationOnce(() => {
                const handlers = new Map<string, () => void>();
                return {
                    unref: vi.fn(),
                    once: vi.fn((event: string, callback: () => void) => {
                        handlers.set(event, callback);
                    }),
                    close: vi.fn((callback: () => void) => callback()),
                    listen: vi.fn(() => {
                        handlers.get('listening')?.();
                    }),
                    address: vi.fn(() => ({ port: 9001 })),
                };
            });

        await expect(
            findAvailablePort({
                startingPort: 9000,
                host: '127.0.0.1',
                portCandidates: 2,
                createServer,
            })
        ).resolves.toBe(9001);

        const failingCreateServer = vi.fn(() => {
            const handlers = new Map<string, (value?: unknown) => void>();
            return {
                unref: vi.fn(),
                once: vi.fn((event: string, callback: (value?: unknown) => void) => {
                    handlers.set(event, callback);
                }),
                close: vi.fn(),
                listen: vi.fn(() => {
                    handlers.get('error')?.(Object.assign(new Error('denied'), { code: 'EACCES' }));
                }),
                address: vi.fn(),
            };
        });

        await expect(
            findAvailablePort({
                startingPort: 9000,
                host: '127.0.0.1',
                createServer:
                    failingCreateServer as unknown as typeof import('node:net').createServer,
            })
        ).rejects.toMatchObject({ code: 'EACCES' });
    });

    it('rejects start when the PeerServer factory throws', async () => {
        await expect(
            startPeerSignalingServer({
                startingPort: 9000,
                peerServerFactory: vi.fn(() => {
                    throw new Error('factory failed');
                }),
                findPort: vi.fn(async () => 9000),
            })
        ).rejects.toThrow('factory failed');
    });

    it('creates stable short log ids without exposing raw peer ids', () => {
        const logId = createStableLogId('peer-1', 'peer');

        expect(logId).toMatch(/^peer:[a-f0-9]{12}$/);
        expect(createStableLogId('peer-1', 'peer')).toBe(logId);
        expect(logId).not.toContain('peer-1');
    });

    it('starts PeerServer on an explicit LAN-capable host and records host/port health', async () => {
        const peerApp = new EventEmitter();
        const httpServer = {
            close: vi.fn((callback: (error?: Error) => void) => callback()),
        };
        const peerServerFactory = vi.fn((options, callback) => {
            callback(httpServer);
            return peerApp;
        });
        const recordMainHealth = vi.fn();
        const logger = {
            info: vi.fn(),
            warn: vi.fn(),
        };

        const server = await startPeerSignalingServer({
            startingPort: 9000,
            host: '0.0.0.0',
            peerServerFactory,
            findPort: vi.fn(async () => 9100),
            logger,
            recordMainHealth,
        });

        expect(peerServerFactory).toHaveBeenCalledWith(
            expect.objectContaining({
                host: '0.0.0.0',
                path: '/gemduel',
                port: 9100,
                proxied: true,
            }),
            expect.any(Function)
        );
        expect(server).toMatchObject({
            httpServer,
            host: '0.0.0.0',
            port: 9100,
            path: '/gemduel',
        });
        expect(recordMainHealth).toHaveBeenCalledWith(
            expect.objectContaining({
                name: 'PEER_SERVER_STARTED',
                context: {
                    host: '0.0.0.0',
                    port: 9100,
                },
            })
        );

        peerApp.emit('connection', {
            getId: () => 'peer-1',
        });
        peerApp.emit('disconnect', {
            getId: () => 'peer-1',
        });

        const clientIdHash = createStableLogId('peer-1', 'peer');
        expect(logger.info).toHaveBeenCalledWith(`[P2P] Client connected: ${clientIdHash}`);
        expect(logger.info).toHaveBeenCalledWith(`[P2P] Client disconnected: ${clientIdHash}`);
        expect(logger.info).not.toHaveBeenCalledWith(expect.stringContaining('peer-1'));
        expect(recordMainHealth).toHaveBeenCalledWith(
            expect.objectContaining({
                name: 'PEER_SERVER_CLIENT_CONNECTED',
                context: expect.objectContaining({
                    clientIdHash,
                    host: '0.0.0.0',
                    port: 9100,
                }),
            })
        );
        expect(recordMainHealth).toHaveBeenCalledWith(
            expect.objectContaining({
                name: 'PEER_SERVER_CLIENT_DISCONNECTED',
                context: expect.objectContaining({
                    clientIdHash,
                    host: '0.0.0.0',
                    port: 9100,
                }),
            })
        );
    });

    it('closes the captured HTTP server once during Electron shutdown', async () => {
        const httpServer = {
            close: vi.fn((callback: (error?: Error) => void) => callback()),
        };
        const server = {
            httpServer,
            host: '0.0.0.0',
            port: 9100,
            path: '/gemduel',
            closed: false,
        };
        const recordMainHealth = vi.fn();

        await expect(
            stopPeerSignalingServer(server, {
                recordMainHealth,
                reason: 'before-quit',
            })
        ).resolves.toEqual({ closed: true });
        await expect(
            stopPeerSignalingServer(server, {
                recordMainHealth,
                reason: 'window-all-closed',
            })
        ).resolves.toEqual({ closed: false });

        expect(httpServer.close).toHaveBeenCalledTimes(1);
        expect(recordMainHealth).toHaveBeenCalledTimes(1);
        expect(recordMainHealth).toHaveBeenCalledWith(
            expect.objectContaining({
                name: 'PEER_SERVER_SHUTDOWN',
                context: {
                    host: '0.0.0.0',
                    port: 9100,
                    reason: 'before-quit',
                },
            })
        );
    });

    it('returns safe shutdown results for missing, errored, and throwing close paths', async () => {
        await expect(stopPeerSignalingServer(null)).resolves.toEqual({ closed: false });
        await expect(
            stopPeerSignalingServer({
                host: '0.0.0.0',
                port: 9100,
                path: '/gemduel',
                closed: false,
            })
        ).resolves.toEqual({ closed: false });

        const closeError = new Error('close failed');
        await expect(
            stopPeerSignalingServer(
                {
                    httpServer: {
                        close: vi.fn((callback: (error?: Error) => void) => callback(closeError)),
                    },
                    host: '0.0.0.0',
                    port: 9100,
                    path: '/gemduel',
                    closed: false,
                },
                { logger: { warn: vi.fn(), info: vi.fn() } }
            )
        ).resolves.toEqual({ closed: false, error: closeError });

        const thrownError = new Error('close threw');
        await expect(
            stopPeerSignalingServer(
                {
                    httpServer: {
                        close: vi.fn(() => {
                            throw thrownError;
                        }),
                    },
                    host: '0.0.0.0',
                    port: 9100,
                    path: '/gemduel',
                    closed: false,
                },
                { logger: { warn: vi.fn(), info: vi.fn() } }
            )
        ).resolves.toEqual({ closed: false, error: thrownError });
    });
});
