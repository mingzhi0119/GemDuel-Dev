import {
    reportReleaseHealth,
    type ReleaseHealthEvent,
    type ReleaseHealthSeverity,
} from './releaseHealth';

const isDevRuntime = () =>
    typeof import.meta !== 'undefined' && Boolean(import.meta.env && import.meta.env.DEV);

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
    details?: unknown
) => {
    if (severity === 'info' && !isDevRuntime()) {
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
