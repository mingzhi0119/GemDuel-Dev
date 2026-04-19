export type ReleaseHealthSeverity = 'info' | 'warn' | 'error';
export type ReleaseHealthCategory =
    | 'startup'
    | 'updater'
    | 'peer'
    | 'network'
    | 'recovery'
    | 'runtime'
    | 'security';

export interface ReleaseHealthEvent {
    category: ReleaseHealthCategory;
    name: string;
    severity: ReleaseHealthSeverity;
    message: string;
    context?: Record<string, string | number | boolean | null>;
}

export const reportReleaseHealth = (event: ReleaseHealthEvent) => {
    if (typeof window === 'undefined') {
        return;
    }

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
