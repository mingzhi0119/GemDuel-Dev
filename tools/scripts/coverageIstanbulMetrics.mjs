const roundPct = (value) => Number(value.toFixed(2));

/**
 * @param {Record<string, unknown> | null | undefined} entry Istanbul-style file entry from coverage-final.json
 * @returns {{ lines: number, statements: number, functions: number, branches: number } | null}
 */
export const computeFileMetrics = (entry) => {
    if (!entry || typeof entry !== 'object' || !entry.s) {
        return null;
    }

    const sKeys = Object.keys(entry.s);
    const stmtTotal = sKeys.length;
    const stmtCovered = sKeys.filter((k) => (entry.s[k] ?? 0) > 0).length;
    const stmtPct = stmtTotal > 0 ? (stmtCovered / stmtTotal) * 100 : 100;

    const fnMap = entry.fnMap ?? {};
    const fHits = entry.f ?? {};
    const fnIds = Object.keys(fnMap);
    const fnTotal = fnIds.length;
    const fnCovered = fnIds.filter((id) => (fHits[id] ?? 0) > 0).length;
    const fnPct = fnTotal > 0 ? (fnCovered / fnTotal) * 100 : 100;

    let brTotal = 0;
    let brCovered = 0;
    const bMap = entry.b ?? {};
    for (const bid of Object.keys(entry.branchMap ?? {})) {
        const counts = bMap[bid];
        if (!Array.isArray(counts)) {
            continue;
        }
        for (const c of counts) {
            brTotal += 1;
            if (c > 0) {
                brCovered += 1;
            }
        }
    }
    const brPct = brTotal > 0 ? (brCovered / brTotal) * 100 : 100;

    const sm = entry.statementMap ?? {};
    const lines = new Set();
    const coveredLines = new Set();
    for (const sid of sKeys) {
        const stmt = sm[sid];
        const ln = stmt?.start?.line;
        if (typeof ln !== 'number') {
            continue;
        }
        lines.add(ln);
        if ((entry.s[sid] ?? 0) > 0) {
            coveredLines.add(ln);
        }
    }
    const linePct = lines.size > 0 ? (coveredLines.size / lines.size) * 100 : 100;

    return {
        lines: roundPct(linePct),
        statements: roundPct(stmtPct),
        functions: roundPct(fnPct),
        branches: roundPct(brPct),
    };
};

export { roundPct };
