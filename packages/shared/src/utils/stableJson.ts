const sortJsonValue = (value: unknown): unknown => {
    if (Array.isArray(value)) {
        return value.map((entry) => sortJsonValue(entry));
    }

    if (value && typeof value === 'object') {
        return Object.keys(value as Record<string, unknown>)
            .sort()
            .reduce<Record<string, unknown>>((accumulator, key) => {
                accumulator[key] = sortJsonValue((value as Record<string, unknown>)[key]);
                return accumulator;
            }, {});
    }

    return value;
};

export const stableJsonStringify = (value: unknown): string => JSON.stringify(sortJsonValue(value));
