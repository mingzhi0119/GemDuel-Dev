import fs from 'node:fs';
import path from 'node:path';
import { GOVERNANCE_DOC_PATHS } from './governanceDocPaths.js';

export const BOUNDARY_REGISTRY_SCHEMA_VERSION = 1;
export const EXPECTED_BOUNDARY_IDS = Object.freeze([
    'renderer-action-dispatch',
    'network-message-parsing',
    'guest-intent-authority-review',
    'replay-local-file-read',
    'replay-schema-deterministic-replay',
    'ipc-bridge',
    'desktop-window-security',
    'runtime-relay-profile',
    'release-health-checklist',
    'dependency-governance',
]);

const REQUIRED_STRING_FIELDS = Object.freeze([
    'id',
    'title',
    'entrySurface',
    'owner',
    'failClosedBehavior',
]);
const REQUIRED_ARRAY_FIELDS = Object.freeze([
    'validatorRefs',
    'contractRefs',
    'reasonCodes',
    'runtimeSignals',
    'testRefs',
]);

const UPPER_UNDERSCORE_PATTERN = /^[A-Z0-9_]+$/;

const relativePathExists = (repoRoot, relativePath) =>
    fs.existsSync(path.join(repoRoot, relativePath));

const asSortedJson = (value) => JSON.stringify(value);

export const collectBoundaryRegistryErrors = ({
    boundaryRegistry,
    boundaryInventoryText,
    repoRoot,
}) => {
    const errors = [];

    if (boundaryRegistry?.schemaVersion !== BOUNDARY_REGISTRY_SCHEMA_VERSION) {
        errors.push(
            `Boundary registry schemaVersion must remain ${BOUNDARY_REGISTRY_SCHEMA_VERSION}.`
        );
    }

    if (!Array.isArray(boundaryRegistry?.boundaries) || boundaryRegistry.boundaries.length === 0) {
        errors.push('Boundary registry must declare a non-empty boundaries array.');
        return errors;
    }

    const ids = boundaryRegistry.boundaries.map((entry) => entry?.id).filter(Boolean);
    const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
    for (const duplicateId of new Set(duplicateIds)) {
        errors.push(`Boundary registry contains duplicate id ${duplicateId}.`);
    }

    const missingIds = EXPECTED_BOUNDARY_IDS.filter((id) => !ids.includes(id));
    for (const missingId of missingIds) {
        errors.push(`Boundary registry is missing required boundary ${missingId}.`);
    }

    const unexpectedIds = ids.filter((id) => !EXPECTED_BOUNDARY_IDS.includes(id));
    for (const unexpectedId of unexpectedIds) {
        errors.push(`Boundary registry declared unexpected boundary ${unexpectedId}.`);
    }

    for (const entry of boundaryRegistry.boundaries) {
        if (!entry || typeof entry !== 'object') {
            errors.push('Boundary registry entries must be objects.');
            continue;
        }

        for (const field of REQUIRED_STRING_FIELDS) {
            if (typeof entry[field] !== 'string' || entry[field].trim().length === 0) {
                errors.push(
                    `Boundary ${entry.id ?? '<unknown>'} is missing string field ${field}.`
                );
            }
        }

        for (const field of REQUIRED_ARRAY_FIELDS) {
            if (!Array.isArray(entry[field]) || entry[field].length === 0) {
                errors.push(`Boundary ${entry.id ?? '<unknown>'} is missing non-empty ${field}.`);
                continue;
            }

            for (const item of entry[field]) {
                if (typeof item !== 'string' || item.trim().length === 0) {
                    errors.push(
                        `Boundary ${entry.id ?? '<unknown>'} contains a non-string ${field} entry.`
                    );
                }
            }
        }

        for (const refField of ['validatorRefs', 'contractRefs', 'testRefs']) {
            for (const relativePath of entry[refField] ?? []) {
                if (
                    typeof relativePath === 'string' &&
                    !relativePathExists(repoRoot, relativePath)
                ) {
                    errors.push(
                        `Boundary ${entry.id ?? '<unknown>'} references missing file ${relativePath}.`
                    );
                }
            }
        }

        for (const reasonCode of entry.reasonCodes ?? []) {
            if (typeof reasonCode === 'string' && !UPPER_UNDERSCORE_PATTERN.test(reasonCode)) {
                errors.push(
                    `Boundary ${entry.id ?? '<unknown>'} uses invalid reason code ${reasonCode}.`
                );
            }
        }

        for (const runtimeSignal of entry.runtimeSignals ?? []) {
            if (
                typeof runtimeSignal === 'string' &&
                !UPPER_UNDERSCORE_PATTERN.test(runtimeSignal)
            ) {
                errors.push(
                    `Boundary ${entry.id ?? '<unknown>'} uses invalid runtime signal ${runtimeSignal}.`
                );
            }
        }

        if (
            typeof entry.id === 'string' &&
            !boundaryInventoryText.includes(`\`${entry.id}\``) &&
            !boundaryInventoryText.includes(entry.title)
        ) {
            errors.push(
                `Boundary ${entry.id} is not traceable from ${GOVERNANCE_DOC_PATHS.boundaryInventory} via id or title.`
            );
        }
    }

    return errors;
};

export const collectBoundaryRegistrySnapshotErrors = ({
    actualRegistry,
    expectedRegistry,
    boundaryInventoryText,
    repoRoot,
}) => {
    const errors = collectBoundaryRegistryErrors({
        boundaryRegistry: actualRegistry,
        boundaryInventoryText,
        repoRoot,
    });

    if (!expectedRegistry || typeof expectedRegistry !== 'object') {
        errors.push('Missing boundary registry snapshot.');
        return errors;
    }

    if (asSortedJson(actualRegistry) !== asSortedJson(expectedRegistry)) {
        errors.push('Boundary registry snapshot drifted from the audited source of truth.');
    }

    return errors;
};
