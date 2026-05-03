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

export const reportReleaseHealth = (_event: ReleaseHealthEvent) => {
    void _event;
};
