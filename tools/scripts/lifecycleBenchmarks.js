export const BENCHMARK_BASELINE_SCHEMA_VERSION = 1;

const isPlainObject = (value) =>
    Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const asBenchmarkMap = (benchmarks) =>
    new Map(
        (Array.isArray(benchmarks) ? benchmarks : []).map((benchmark) => [benchmark.id, benchmark])
    );

export const collectBenchmarkBaselineErrors = (baseline) => {
    const errors = [];

    if (!isPlainObject(baseline)) {
        return ['Benchmark baseline must be a JSON object.'];
    }

    if (baseline.schemaVersion !== BENCHMARK_BASELINE_SCHEMA_VERSION) {
        errors.push(
            `Benchmark baseline schemaVersion must remain ${BENCHMARK_BASELINE_SCHEMA_VERSION}.`
        );
    }

    if (!Array.isArray(baseline.benchmarks) || baseline.benchmarks.length === 0) {
        errors.push('Benchmark baseline must define benchmarks.');
        return errors;
    }

    for (const benchmark of baseline.benchmarks) {
        if (typeof benchmark?.id !== 'string') {
            errors.push('Benchmark entries must define id.');
        }

        for (const field of ['maxMedianMs', 'maxP95Ms']) {
            if (typeof benchmark?.[field] !== 'number' || benchmark[field] <= 0) {
                errors.push(`Benchmark ${benchmark?.id ?? '<unknown>'} must define ${field}.`);
            }
        }
    }

    return errors;
};

export const collectBenchmarkReportErrors = ({ report, baseline }) => {
    const errors = collectBenchmarkBaselineErrors(baseline);
    const baselineMap = asBenchmarkMap(baseline?.benchmarks);
    const reportMap = asBenchmarkMap(report?.benchmarks);

    for (const [id, expected] of baselineMap) {
        const actual = reportMap.get(id);
        if (!actual) {
            errors.push(`Benchmark report is missing ${id}.`);
            continue;
        }

        if (actual.medianMs > expected.maxMedianMs) {
            errors.push(
                `Benchmark ${id} median ${actual.medianMs}ms exceeded ${expected.maxMedianMs}ms.`
            );
        }

        if (actual.p95Ms > expected.maxP95Ms) {
            errors.push(`Benchmark ${id} p95 ${actual.p95Ms}ms exceeded ${expected.maxP95Ms}ms.`);
        }
    }

    return errors;
};
