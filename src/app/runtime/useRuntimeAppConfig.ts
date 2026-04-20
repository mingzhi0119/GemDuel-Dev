import { useEffect, useRef, useState } from 'react';
import { setRuntimeIceServers, setRuntimeRelayProfile } from '../../config/webrtc';
import { reportReleaseHealth } from '../../observability/releaseHealth';
import type { RuntimeRelayProfile } from '../../types';

const DEFAULT_APP_VERSION = '5.2.11';
const TURN_PROFILE_REFRESH_BUFFER_MS = 30_000;

export const useRuntimeAppConfig = () => {
    const [appVersion, setAppVersion] = useState<string>(DEFAULT_APP_VERSION);
    const refreshTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        let disposed = false;

        const clearRefreshTimeout = () => {
            if (refreshTimeoutRef.current !== null) {
                clearTimeout(refreshTimeoutRef.current);
                refreshTimeoutRef.current = null;
            }
        };

        const scheduleRelayRefresh = (expiresAt?: string | null) => {
            clearRefreshTimeout();

            if (!window.electron?.refreshRuntimeRelayProfile || !expiresAt) {
                return;
            }

            const expiresAtMs = Date.parse(expiresAt);
            if (Number.isNaN(expiresAtMs)) {
                return;
            }

            const delayMs = Math.max(0, expiresAtMs - Date.now() - TURN_PROFILE_REFRESH_BUFFER_MS);
            refreshTimeoutRef.current = setTimeout(() => {
                void refreshRuntimeRelayProfile();
            }, delayMs);
        };

        const applyRelayProfile = (
            relayProfile: RuntimeRelayProfile,
            eventName: 'ICE_PROFILE_LOADED' | 'ICE_PROFILE_REFRESHED'
        ) => {
            setRuntimeRelayProfile(relayProfile);
            scheduleRelayRefresh(relayProfile.expiresAt);
            reportReleaseHealth({
                category: 'runtime',
                name: eventName,
                severity: 'info',
                message:
                    eventName === 'ICE_PROFILE_REFRESHED'
                        ? 'Renderer refreshed the governed runtime relay profile.'
                        : 'Renderer loaded the governed runtime relay profile.',
                context: {
                    source: relayProfile.source,
                    iceServerCount: relayProfile.iceServers.length,
                    hasExpiry: Boolean(relayProfile.expiresAt),
                },
            });
        };

        const refreshRuntimeRelayProfile = async () => {
            if (disposed || !window.electron?.refreshRuntimeRelayProfile) {
                return;
            }

            try {
                const relayProfile = await window.electron.refreshRuntimeRelayProfile();
                if (!disposed && relayProfile) {
                    applyRelayProfile(relayProfile, 'ICE_PROFILE_REFRESHED');
                }
            } catch {
                if (!disposed) {
                    reportReleaseHealth({
                        category: 'runtime',
                        name: 'ICE_PROFILE_REFRESH_FAILED',
                        severity: 'error',
                        message: 'Renderer failed to refresh the governed runtime relay profile.',
                    });
                }
            }
        };

        const loadRuntimeAppConfig = async () => {
            try {
                const [version, relayProfile, iceServers] = await Promise.all([
                    window.electron?.getAppVersion?.(),
                    window.electron?.getRuntimeRelayProfile?.(),
                    window.electron?.getRuntimeIceServers?.(),
                ]);

                if (version) setAppVersion(version);
                if (relayProfile) {
                    applyRelayProfile(relayProfile, 'ICE_PROFILE_LOADED');
                } else if (iceServers) {
                    clearRefreshTimeout();
                    setRuntimeIceServers(iceServers);
                    reportReleaseHealth({
                        category: 'runtime',
                        name: 'ICE_PROFILE_FALLBACK',
                        severity: 'warn',
                        message:
                            'Renderer fell back to the legacy runtime ICE server bridge contract.',
                        context: {
                            iceServerCount: Array.isArray(iceServers) ? iceServers.length : 0,
                        },
                    });
                }
                reportReleaseHealth({
                    category: 'runtime',
                    name: 'APP_RUNTIME_CONFIG_LOADED',
                    severity: 'info',
                    message: 'Renderer loaded runtime app configuration successfully.',
                    context: {
                        hasVersion: Boolean(version),
                        iceServerCount: relayProfile
                            ? relayProfile.iceServers.length
                            : Array.isArray(iceServers)
                              ? iceServers.length
                              : 0,
                    },
                });
            } catch {
                if (!disposed) {
                    reportReleaseHealth({
                        category: 'runtime',
                        name: 'APP_RUNTIME_CONFIG_FAILED',
                        severity: 'error',
                        message: 'Renderer failed to load runtime app configuration.',
                    });
                }
            }
        };

        void loadRuntimeAppConfig();

        return () => {
            disposed = true;
            clearRefreshTimeout();
            void window.electron?.revokeRuntimeRelayProfile?.();
        };
    }, []);

    return { appVersion };
};
