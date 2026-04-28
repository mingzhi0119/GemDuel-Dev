const sortRecord = (record) =>
    Object.keys(record)
        .sort()
        .reduce((acc, key) => {
            acc[key] = record[key];
            return acc;
        }, {});

/**
 * @param {Array<{ ownerRole?: string; category?: string }>} exclusions
 * @param {{ month: string; generatedAt: string }} meta
 */
export const buildSealExclusionsMonthlySnapshot = (exclusions, { month, generatedAt }) => {
    const byOwnerRole = {};
    const byCategory = {};

    for (const entry of exclusions) {
        const role = typeof entry.ownerRole === 'string' ? entry.ownerRole : '<missing>';
        const cat = typeof entry.category === 'string' ? entry.category : '<missing>';
        byOwnerRole[role] = (byOwnerRole[role] ?? 0) + 1;
        byCategory[cat] = (byCategory[cat] ?? 0) + 1;
    }

    return {
        schemaVersion: 1,
        month,
        generatedAt,
        exclusionCount: exclusions.length,
        totals: {
            byOwnerRole: sortRecord(byOwnerRole),
            byCategory: sortRecord(byCategory),
        },
    };
};

const stableStringify = (value) => JSON.stringify(value);

/**
 * @param {{ exclusions: unknown[]; monthlySnapshot: unknown }} input
 * @returns {string[]}
 */
export const collectSealMonthlySnapshotErrors = ({ exclusions, monthlySnapshot }) => {
    const errors = [];

    if (!monthlySnapshot || typeof monthlySnapshot !== 'object' || Array.isArray(monthlySnapshot)) {
        return ['Seal exclusions monthly snapshot must be a JSON object.'];
    }

    if (monthlySnapshot.schemaVersion !== 1) {
        errors.push('Seal exclusions monthly snapshot schemaVersion must remain 1.');
    }

    if (typeof monthlySnapshot.month !== 'string' || !/^\d{4}-\d{2}$/.test(monthlySnapshot.month)) {
        errors.push('Seal exclusions monthly snapshot must define month as YYYY-MM.');
    }

    if (!Array.isArray(exclusions) || exclusions.length === 0) {
        errors.push('Seal exclusions monthly snapshot validation requires exclusions.');
        return errors;
    }

    const expected = buildSealExclusionsMonthlySnapshot(exclusions, {
        month: monthlySnapshot.month,
        generatedAt: monthlySnapshot.generatedAt ?? 'snapshot-compare',
    });

    if (monthlySnapshot.exclusionCount !== expected.exclusionCount) {
        errors.push(
            `Seal exclusions monthly snapshot exclusionCount ${monthlySnapshot.exclusionCount} does not match live exclusions (${expected.exclusionCount}).`
        );
    }

    if (
        stableStringify(monthlySnapshot.totals?.byOwnerRole ?? {}) !==
        stableStringify(expected.totals.byOwnerRole)
    ) {
        errors.push(
            'Seal exclusions monthly snapshot totals.byOwnerRole drifted from live exclusions; run pnpm run seal-exclusions:refresh-monthly.'
        );
    }

    if (
        stableStringify(monthlySnapshot.totals?.byCategory ?? {}) !==
        stableStringify(expected.totals.byCategory)
    ) {
        errors.push(
            'Seal exclusions monthly snapshot totals.byCategory drifted from live exclusions; run pnpm run seal-exclusions:refresh-monthly.'
        );
    }

    return errors;
};
