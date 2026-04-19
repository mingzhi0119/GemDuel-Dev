import { z } from 'zod';

export const RELEASE_HEALTH_SEVERITIES = ['info', 'warn', 'error'];
export const RELEASE_HEALTH_CATEGORIES = [
    'startup',
    'updater',
    'peer',
    'network',
    'recovery',
    'runtime',
    'security',
];

const RELEASE_HEALTH_CONTEXT_VALUE_SCHEMA = z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.null(),
]);

export const RELEASE_HEALTH_EVENT_SCHEMA = z.object({
    source: z.enum(['main', 'renderer']).default('renderer'),
    category: z.enum(RELEASE_HEALTH_CATEGORIES),
    name: z
        .string()
        .regex(/^[A-Z0-9_]+$/)
        .max(64),
    severity: z.enum(RELEASE_HEALTH_SEVERITIES),
    message: z.string().min(1).max(200),
    context: z.record(z.string(), RELEASE_HEALTH_CONTEXT_VALUE_SCHEMA).optional(),
});

const REDACTED_KEY_PATTERN =
    /(peerid|remotepeerid|requestid|checksum|url|targetip|token|secret|password|credential)/i;
const MAX_STRING_VALUE_LENGTH = 120;
const MAX_RECENT_EVENTS = 25;

const defaultIndicators = () => ({
    startupFailures: 0,
    runtimeConfigFailures: 0,
    updaterFailures: 0,
    peerFailures: 0,
    recoveryRequests: 0,
    ipcRejected: 0,
});

const sanitizeContextValue = (key, value) => {
    if (REDACTED_KEY_PATTERN.test(key)) {
        return '[REDACTED]';
    }

    if (typeof value === 'string' && value.length > MAX_STRING_VALUE_LENGTH) {
        return `${value.slice(0, MAX_STRING_VALUE_LENGTH)}…`;
    }

    return value;
};

export const sanitizeReleaseHealthContext = (context = {}) =>
    Object.fromEntries(
        Object.entries(context).map(([key, value]) => [key, sanitizeContextValue(key, value)])
    );

const getIndicatorUpdater = (indicators, event) => {
    if (event.category === 'startup' && event.severity === 'error') {
        indicators.startupFailures += 1;
    }

    if (event.name === 'APP_RUNTIME_CONFIG_FAILED') {
        indicators.runtimeConfigFailures += 1;
    }

    if (event.category === 'updater' && event.severity === 'error') {
        indicators.updaterFailures += 1;
    }

    if (event.category === 'peer' && event.severity === 'error') {
        indicators.peerFailures += 1;
    }

    if (event.category === 'recovery') {
        indicators.recoveryRequests += 1;
    }

    if (event.name === 'IPC_REQUEST_REJECTED') {
        indicators.ipcRejected += 1;
    }
};

export const createReleaseHealthMonitor = ({ logger, now = () => Date.now() }) => {
    const startedAt = new Date(now()).toISOString();
    const severityCounts = {
        info: 0,
        warn: 0,
        error: 0,
    };
    const indicators = defaultIndicators();
    const eventCounts = new Map();
    const recentEvents = [];
    let totalEvents = 0;
    let lastEventAt = null;

    const record = (rawEvent) => {
        const parsed = RELEASE_HEALTH_EVENT_SCHEMA.parse(rawEvent);
        const timestamp = new Date(now()).toISOString();
        const sanitizedEvent = {
            ...parsed,
            timestamp,
            context: parsed.context ? sanitizeReleaseHealthContext(parsed.context) : undefined,
        };

        totalEvents += 1;
        lastEventAt = timestamp;
        severityCounts[sanitizedEvent.severity] += 1;
        getIndicatorUpdater(indicators, sanitizedEvent);

        const eventKey = `${sanitizedEvent.category}:${sanitizedEvent.name}`;
        const current = eventCounts.get(eventKey) ?? {
            count: 0,
            severity: sanitizedEvent.severity,
        };
        eventCounts.set(eventKey, {
            count: current.count + 1,
            severity: sanitizedEvent.severity,
            lastAt: timestamp,
        });

        recentEvents.unshift(sanitizedEvent);
        if (recentEvents.length > MAX_RECENT_EVENTS) {
            recentEvents.pop();
        }

        const logLine = JSON.stringify(sanitizedEvent);
        logger[sanitizedEvent.severity]?.(`[RELEASE_HEALTH] ${logLine}`);

        return sanitizedEvent;
    };

    const getSnapshot = () => ({
        startedAt,
        lastEventAt,
        totalEvents,
        severityCounts: { ...severityCounts },
        indicators: { ...indicators },
        counters: Object.fromEntries(eventCounts.entries()),
        recentEvents: [...recentEvents],
    });

    return {
        getSnapshot,
        record,
    };
};
