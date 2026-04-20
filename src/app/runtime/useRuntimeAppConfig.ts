import { useEffect, useState } from 'react';
import { setRuntimeIceServers, setRuntimeRelayProfile } from '../../config/webrtc';
import { reportReleaseHealth } from '../../observability/releaseHealth';

const DEFAULT_APP_VERSION = '5.2.11';

export const useRuntimeAppConfig = () => {
    const [appVersion, setAppVersion] = useState<string>(DEFAULT_APP_VERSION);

    useEffect(() => {
        const loadRuntimeAppConfig = async () => {
            try {
                const [version, relayProfile, iceServers] = await Promise.all([
                    window.electron?.getAppVersion?.(),
                    window.electron?.getRuntimeRelayProfile?.(),
                    window.electron?.getRuntimeIceServers?.(),
                ]);

                if (version) setAppVersion(version);
                if (relayProfile) {
                    setRuntimeRelayProfile(relayProfile);
                    reportReleaseHealth({
                        category: 'runtime',
                        name: 'ICE_PROFILE_LOADED',
                        severity: 'info',
                        message: 'Renderer loaded the governed runtime relay profile.',
                        context: {
                            source: relayProfile.source,
                            iceServerCount: relayProfile.iceServers.length,
                            hasExpiry: Boolean(relayProfile.expiresAt),
                        },
                    });
                } else if (iceServers) {
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
                reportReleaseHealth({
                    category: 'runtime',
                    name: 'APP_RUNTIME_CONFIG_FAILED',
                    severity: 'error',
                    message: 'Renderer failed to load runtime app configuration.',
                });
            }
        };

        loadRuntimeAppConfig();
    }, []);

    return { appVersion };
};
