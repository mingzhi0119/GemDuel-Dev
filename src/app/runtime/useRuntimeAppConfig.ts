import { useEffect, useState } from 'react';
import { setRuntimeIceServers } from '../../config/webrtc';
import { reportReleaseHealth } from '../../observability/releaseHealth';

const DEFAULT_APP_VERSION = '5.2.11';

export const useRuntimeAppConfig = () => {
    const [appVersion, setAppVersion] = useState<string>(DEFAULT_APP_VERSION);

    useEffect(() => {
        const loadRuntimeAppConfig = async () => {
            try {
                const [version, iceServers] = await Promise.all([
                    window.electron?.getAppVersion?.(),
                    window.electron?.getRuntimeIceServers?.(),
                ]);

                if (version) setAppVersion(version);
                if (iceServers) setRuntimeIceServers(iceServers);
                reportReleaseHealth({
                    category: 'runtime',
                    name: 'APP_RUNTIME_CONFIG_LOADED',
                    severity: 'info',
                    message: 'Renderer loaded runtime app configuration successfully.',
                    context: {
                        hasVersion: Boolean(version),
                        iceServerCount: Array.isArray(iceServers) ? iceServers.length : 0,
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
