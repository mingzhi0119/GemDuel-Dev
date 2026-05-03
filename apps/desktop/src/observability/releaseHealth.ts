export type {
    ReleaseHealthCategory,
    ReleaseHealthEvent,
    ReleaseHealthSeverity,
} from '@gemduel/shared/observability/releaseHealth';

import type { ReleaseHealthEvent } from '@gemduel/shared/observability/releaseHealth';

export const reportReleaseHealth = (event: ReleaseHealthEvent) => {
    const payload = {
        source: 'renderer' as const,
        ...event,
    };

    try {
        window.electron?.reportReleaseHealth?.(payload);
    } catch (error) {
        const fallback =
            event.severity === 'error'
                ? console.error
                : event.severity === 'warn'
                  ? console.warn
                  : console.info;
        fallback('[RELEASE_HEALTH] Failed to forward renderer event.', error);
    }
};
