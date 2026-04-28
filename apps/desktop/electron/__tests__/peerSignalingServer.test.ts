// @vitest-environment node

import { EventEmitter } from 'node:events';
import { describe, expect, it, vi } from 'vitest';
import { startPeerSignalingServer, stopPeerSignalingServer } from '../peerSignalingServer.js';

describe('peer signaling server governance', () => {
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

        expect(recordMainHealth).toHaveBeenCalledWith(
            expect.objectContaining({
                name: 'PEER_SERVER_CLIENT_CONNECTED',
                context: expect.objectContaining({
                    clientId: 'peer-1',
                    host: '0.0.0.0',
                    port: 9100,
                }),
            })
        );
        expect(recordMainHealth).toHaveBeenCalledWith(
            expect.objectContaining({
                name: 'PEER_SERVER_CLIENT_DISCONNECTED',
                context: expect.objectContaining({
                    clientId: 'peer-1',
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
});
