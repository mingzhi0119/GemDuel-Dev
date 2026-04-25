export const CODEOWNERS_ROLE_MAP_SCHEMA_VERSION = 1;

const isPlainObject = (value) =>
    Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const parseCodeownersLines = (codeownersText) =>
    codeownersText
        .split(/\r?\n/)
        .map((line, index) => ({
            lineNumber: index + 1,
            raw: line,
            trimmed: line.trim(),
        }))
        .filter((entry) => entry.trimmed.length > 0 && !entry.trimmed.startsWith('#'))
        .map((entry) => {
            const [pattern, ...owners] = entry.trimmed.split(/\s+/);
            return {
                lineNumber: entry.lineNumber,
                pattern,
                owners,
            };
        });

const unique = (values) => Array.from(new Set(values));

export const collectCodeownersGovernanceErrors = ({
    codeownersText,
    roleMap,
    boundaryRegistry,
    contributingText = '',
}) => {
    const errors = [];

    if (!isPlainObject(roleMap)) {
        return ['CODEOWNERS role map must be a JSON object.'];
    }

    if (roleMap.schemaVersion !== CODEOWNERS_ROLE_MAP_SCHEMA_VERSION) {
        errors.push(
            `CODEOWNERS role map schemaVersion must remain ${CODEOWNERS_ROLE_MAP_SCHEMA_VERSION}.`
        );
    }

    if (roleMap.mode !== 'single-maintainer-role-map') {
        errors.push('CODEOWNERS role map must declare single-maintainer-role-map mode.');
    }

    if (typeof roleMap.maintainer !== 'string' || !roleMap.maintainer.startsWith('@')) {
        errors.push('CODEOWNERS role map must declare a GitHub maintainer handle.');
    }

    const entries = parseCodeownersLines(codeownersText);
    const entryPatterns = new Set(entries.map((entry) => entry.pattern));
    if (entries.length === 0) {
        errors.push('CODEOWNERS must contain at least one owner entry.');
    }

    for (const entry of entries) {
        if (!entry.pattern?.startsWith('/')) {
            errors.push(`CODEOWNERS line ${entry.lineNumber} must use repo-rooted patterns.`);
        }

        if (entry.owners.length !== 1 || entry.owners[0] !== roleMap.maintainer) {
            errors.push(
                `CODEOWNERS line ${entry.lineNumber} must route to ${roleMap.maintainer} in single-maintainer mode.`
            );
        }
    }

    const boundaryOwners = unique(
        (boundaryRegistry?.boundaries ?? [])
            .map((boundary) => boundary?.owner)
            .filter((owner) => typeof owner === 'string' && owner.length > 0)
    );
    const mappedRoles = new Map(
        (roleMap.boundaryRoleMappings ?? []).map((mapping) => [mapping?.role, mapping])
    );

    for (const role of boundaryOwners) {
        const mapping = mappedRoles.get(role);
        if (!mapping) {
            errors.push(`CODEOWNERS role map is missing boundary owner role ${role}.`);
            continue;
        }

        if (!Array.isArray(mapping.reviewers) || !mapping.reviewers.includes(roleMap.maintainer)) {
            errors.push(`CODEOWNERS role ${role} must map to ${roleMap.maintainer}.`);
        }

        const patterns = mapping.codeownerPatterns ?? [];
        if (!Array.isArray(patterns) || patterns.length === 0) {
            errors.push(`CODEOWNERS role ${role} must declare codeownerPatterns.`);
            continue;
        }

        for (const pattern of patterns) {
            if (!entryPatterns.has(pattern)) {
                errors.push(`CODEOWNERS role ${role} references missing pattern ${pattern}.`);
            }
        }
    }

    for (const role of mappedRoles.keys()) {
        if (!boundaryOwners.includes(role)) {
            errors.push(`CODEOWNERS role map declares unexpected role ${role}.`);
        }
    }

    for (const requiredDocToken of [
        '`pnpm codeowners:check`',
        '`tools/governance/codeowners-role-map.snapshot.json`',
    ]) {
        if (!contributingText.includes(requiredDocToken)) {
            errors.push(`Contributing guide must mention ${requiredDocToken}.`);
        }
    }

    return errors;
};
