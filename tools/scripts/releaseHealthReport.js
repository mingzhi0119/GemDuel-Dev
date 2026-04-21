export const RELEASE_HEALTH_REPORT_VERSION = 1;
export const RELEASE_HEALTH_EVENT_PREFIX = '[RELEASE_HEALTH]';
export const RELEASE_HEALTH_SUMMARY_PREFIX = '[RELEASE_HEALTH_SUMMARY]';

const MAX_RECENT_EVENTS = 25;

const DEFAULT_THRESHOLDS = Object.freeze({
    startupFailures: Object.freeze({ warningMax: 0, incidentMax: 0 }),
    runtimeConfigFailures: Object.freeze({ warningMax: 0, incidentMax: 0 }),
    updaterFailures: Object.freeze({ warningMax: 0, incidentMax: 0 }),
    peerFailures: Object.freeze({ warningMax: 0, incidentMax: 0 }),
    recoveryRequests: Object.freeze({ warningMax: 0, incidentMax: 1 }),
    ipcRejected: Object.freeze({ warningMax: 0, incidentMax: 0 }),
});

const cloneJson = (value) => JSON.parse(JSON.stringify(value));

const createEmptySeverityCounts = () => ({
    info: 0,
    warn: 0,
    error: 0,
});

const createEmptyIndicators = () => ({
    startupFailures: 0,
    runtimeConfigFailures: 0,
    updaterFailures: 0,
    peerFailures: 0,
    recoveryRequests: 0,
    ipcRejected: 0,
});

const createEmptyReasonCodeCounts = () => ({});

const createEmptyCounters = () => ({});

const updateIndicatorsFromEvent = (indicators, event) => {
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

const updateReasonCodeCountsFromEvent = (reasonCodeCounts, event) => {
    const reasonCode = event?.context?.reasonCode;
    if (typeof reasonCode !== 'string' || reasonCode.length === 0) {
        return;
    }

    reasonCodeCounts[reasonCode] = (reasonCodeCounts[reasonCode] ?? 0) + 1;
};

export const deriveReleaseHealthSummaryFromEvents = (events = []) => {
    const severityCounts = createEmptySeverityCounts();
    const indicators = createEmptyIndicators();
    const reasonCodeCounts = createEmptyReasonCodeCounts();
    const counters = createEmptyCounters();
    const recentEvents = [];
    let startedAt = null;
    let lastEventAt = null;

    for (const event of events) {
        if (!startedAt && event.timestamp) {
            startedAt = event.timestamp;
        }

        if (event.timestamp) {
            lastEventAt = event.timestamp;
        }

        if (event.severity in severityCounts) {
            severityCounts[event.severity] += 1;
        }

        updateIndicatorsFromEvent(indicators, event);
        updateReasonCodeCountsFromEvent(reasonCodeCounts, event);

        const counterKey = `${event.category}:${event.name}`;
        const current = counters[counterKey] ?? {
            count: 0,
            severity: event.severity,
        };
        counters[counterKey] = {
            count: current.count + 1,
            severity: event.severity,
            lastAt: event.timestamp ?? lastEventAt ?? startedAt ?? null,
        };
    }

    for (const event of [...events].reverse()) {
        recentEvents.push(event);
        if (recentEvents.length >= MAX_RECENT_EVENTS) {
            break;
        }
    }

    return {
        startedAt,
        lastEventAt,
        totalEvents: events.length,
        severityCounts,
        indicators,
        reasonCodeCounts,
        counters,
        recentEvents,
    };
};

const isLikelyReleaseHealthSummary = (value) =>
    Boolean(
        value &&
        typeof value === 'object' &&
        'totalEvents' in value &&
        'severityCounts' in value &&
        'indicators' in value
    );

const parseJsonMaybe = (value) => {
    try {
        return JSON.parse(value);
    } catch {
        return null;
    }
};

const parseReleaseHealthEventLine = (line) => {
    if (!line.startsWith(RELEASE_HEALTH_EVENT_PREFIX)) {
        return null;
    }

    const payloadText = line.slice(RELEASE_HEALTH_EVENT_PREFIX.length).trim();
    if (!payloadText) {
        return null;
    }

    const parsed = parseJsonMaybe(payloadText);
    return parsed && typeof parsed === 'object' ? parsed : null;
};

const parseReleaseHealthSummaryLine = (line) => {
    if (!line.startsWith(RELEASE_HEALTH_SUMMARY_PREFIX)) {
        return null;
    }

    const payloadText = line.slice(RELEASE_HEALTH_SUMMARY_PREFIX.length).trim();
    if (!payloadText) {
        return null;
    }

    const parsed = parseJsonMaybe(payloadText);
    return isLikelyReleaseHealthSummary(parsed) ? parsed : null;
};

export const parseReleaseHealthSourceText = (sourceText) => {
    const trimmed = sourceText.trim();
    const source = {
        kind: 'empty',
        summaryProvided: false,
        events: [],
        summary: null,
    };

    if (!trimmed) {
        return source;
    }

    const lines = sourceText.split(/\r?\n/);
    const events = [];
    let summary = null;
    let summaryProvided = false;

    for (const line of lines) {
        const summaryLine = parseReleaseHealthSummaryLine(line);
        if (summaryLine) {
            summary = summaryLine;
            summaryProvided = true;
            continue;
        }

        const eventLine = parseReleaseHealthEventLine(line);
        if (eventLine) {
            events.push(eventLine);
        }
    }

    if (!summary) {
        const parsedJson = parseJsonMaybe(trimmed);
        if (isLikelyReleaseHealthSummary(parsedJson)) {
            summary = parsedJson;
            summaryProvided = true;
        }
    }

    if (!summary && events.length > 0) {
        summary = deriveReleaseHealthSummaryFromEvents(events);
    }

    if (!summary && events.length === 0) {
        throw new Error('No release-health events or summary were found in the input.');
    }

    return {
        kind: summaryProvided ? 'summary' : 'jsonl-log',
        summaryProvided,
        events,
        summary,
    };
};

const assessIndicatorStatus = (value, threshold = DEFAULT_THRESHOLDS.startupFailures) => {
    if (value > threshold.incidentMax) {
        return 'incident';
    }

    if (value > threshold.warningMax) {
        return 'warning';
    }

    return 'healthy';
};

const cloneThresholdMap = (thresholds = DEFAULT_THRESHOLDS) =>
    Object.fromEntries(
        Object.entries(thresholds).map(([key, threshold]) => [
            key,
            {
                warningMax: threshold.warningMax,
                incidentMax: threshold.incidentMax,
            },
        ])
    );

export const buildReleaseHealthReport = ({
    source,
    operationsSnapshot = {},
    generatedAt = new Date().toISOString(),
    provenance = {},
    retention = null,
    sourcePath = null,
    drillLabel = null,
}) => {
    const thresholds = cloneThresholdMap(operationsSnapshot.indicatorThresholds);
    const summary = source.summary ?? deriveReleaseHealthSummaryFromEvents(source.events);
    const alerts = Object.entries(summary.indicators ?? createEmptyIndicators()).map(
        ([indicator, value]) => {
            const threshold = thresholds[indicator] ?? DEFAULT_THRESHOLDS[indicator];
            const status = assessIndicatorStatus(value, threshold);

            return {
                indicator,
                value,
                warningMax: threshold?.warningMax ?? null,
                incidentMax: threshold?.incidentMax ?? null,
                status,
                routing: operationsSnapshot.alertRouting?.[indicator] ?? 'manual',
                budget: {
                    observed: value,
                    warningBudget: threshold?.warningMax ?? null,
                    incidentBudget: threshold?.incidentMax ?? null,
                    remainingWarningBudget:
                        typeof threshold?.warningMax === 'number'
                            ? threshold.warningMax - value
                            : null,
                    remainingIncidentBudget:
                        typeof threshold?.incidentMax === 'number'
                            ? threshold.incidentMax - value
                            : null,
                    breached: status !== 'healthy',
                },
            };
        }
    );

    const status = alerts.some((alert) => alert.status === 'incident')
        ? 'incident'
        : alerts.some((alert) => alert.status === 'warning')
          ? 'warning'
          : 'healthy';

    return {
        reportVersion: RELEASE_HEALTH_REPORT_VERSION,
        generatedAt,
        operationsSnapshotVersion: operationsSnapshot?.schemaVersion ?? null,
        provenance: cloneJson(provenance),
        retention: retention ? cloneJson(retention) : null,
        source: {
            kind: source.kind,
            path: sourcePath,
            summaryProvided: source.summaryProvided,
            eventCount: source.events.length,
        },
        drillLabel,
        summary: cloneJson(summary),
        thresholds,
        alerts,
        drills: Array.isArray(operationsSnapshot.drills)
            ? cloneJson(operationsSnapshot.drills)
            : [],
        status,
        notes: source.summaryProvided
            ? []
            : ['Report was derived from release-health JSONL log lines.'],
    };
};

export const serializeReleaseHealthReport = (report, { pretty = true } = {}) =>
    `${JSON.stringify(report, null, pretty ? 2 : 0)}\n`;

export const defaultReleaseHealthThresholds = DEFAULT_THRESHOLDS;
