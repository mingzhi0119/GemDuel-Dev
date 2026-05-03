import {
    reportReleaseHealth,
    type ReleaseHealthEvent,
    type ReleaseHealthSeverity,
} from './releaseHealth';

const isDevRuntime = () =>
    typeof import.meta !== 'undefined' &&
    Boolean((import.meta as ImportMeta & { env?: { DEV?: boolean } }).env?.DEV);

const selectConsoleMethod = (severity: ReleaseHealthSeverity) => {
    switch (severity) {
        case 'error':
            return console.error;
        case 'warn':
            return console.warn;
        default:
            return console.info;
    }
};

export const logRendererMessage = (
    severity: ReleaseHealthSeverity,
    message: string,
    details?: unknown,
    devRuntime = isDevRuntime()
) => {
    if (severity === 'info' && !devRuntime) {
        return;
    }

    const write = selectConsoleMethod(severity);
    if (details === undefined) {
        write(message);
        return;
    }

    write(message, details);
};

export const reportRendererEvent = (
    event: ReleaseHealthEvent,
    options: {
        consoleMessage?: string;
        consoleDetails?: unknown;
    } = {}
) => {
    logRendererMessage(
        event.severity,
        options.consoleMessage ?? event.message,
        options.consoleDetails
    );
    reportReleaseHealth(event);
};
