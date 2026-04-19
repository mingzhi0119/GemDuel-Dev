export const REQUIRED_OVERRIDE_POLICY = Object.freeze({
    'path-to-regexp': '0.1.13',
    qs: '6.14.2',
    yaml: '2.8.3',
    anymatch: Object.freeze({ picomatch: '2.3.2' }),
    micromatch: Object.freeze({ picomatch: '2.3.2' }),
    readdirp: Object.freeze({ picomatch: '2.3.2' }),
    tinyglobby: Object.freeze({ picomatch: '4.0.4' }),
});

const REQUIRED_POLICY_FIELDS = Object.freeze([
    'owner',
    'defaultValue',
    'validation',
    'secretHandling',
    'failureMode',
]);

export const parseRuntimeEnvNames = (mainProcessText) => {
    const matches = mainProcessText.matchAll(/process\.env\.([A-Z0-9_]+)/g);
    return Array.from(new Set(Array.from(matches, (match) => match[1]).filter(Boolean))).sort();
};

const collectOverrideErrors = (packageJson) => {
    const overrides = packageJson.overrides ?? {};
    const errors = [];

    for (const [key, expectedValue] of Object.entries(REQUIRED_OVERRIDE_POLICY)) {
        const actualValue = overrides[key];

        if (typeof expectedValue === 'string' && actualValue !== expectedValue) {
            errors.push(`Missing override ${key}@${expectedValue}.`);
        }

        if (expectedValue && typeof expectedValue === 'object') {
            for (const [nestedKey, nestedValue] of Object.entries(expectedValue)) {
                if (actualValue?.[nestedKey] !== nestedValue) {
                    errors.push(`Missing override ${key} -> ${nestedKey}@${nestedValue}.`);
                }
            }
        }
    }

    return errors;
};

const collectRuntimePolicyErrors = ({
    runtimeConfigPolicy,
    runtimeEnvNames,
    governanceDocumentText,
}) => {
    const errors = [];
    const policyNames = Object.keys(runtimeConfigPolicy).sort();

    for (const envName of runtimeEnvNames) {
        if (!policyNames.includes(envName)) {
            errors.push(
                `Runtime env ${envName} is used in electron/main.js but missing from RUNTIME_CONFIG_POLICY.`
            );
        }

        if (!governanceDocumentText.includes(envName)) {
            errors.push(`Runtime env ${envName} is missing from DEPENDENCY_RUNTIME_GOVERNANCE.md.`);
        }
    }

    for (const [envName, entry] of Object.entries(runtimeConfigPolicy)) {
        for (const field of REQUIRED_POLICY_FIELDS) {
            if (typeof entry?.[field] !== 'string' || entry[field].trim().length === 0) {
                errors.push(`Runtime policy ${envName} is missing the ${field} field.`);
            }
        }
    }

    return errors;
};

const collectAuditErrors = (auditReport) => {
    const totalVulnerabilities = auditReport?.metadata?.vulnerabilities?.total ?? 0;

    if (totalVulnerabilities === 0) {
        return [];
    }

    const errors = [];
    for (const [name, vulnerability] of Object.entries(auditReport.vulnerabilities ?? {})) {
        errors.push(
            `Production audit still reports ${vulnerability.severity} severity for ${name}.`
        );
    }

    return errors;
};

export const formatAuditSummary = (auditReport) => {
    const counts = auditReport?.metadata?.vulnerabilities ?? {};
    return `info=${counts.info ?? 0}, low=${counts.low ?? 0}, moderate=${counts.moderate ?? 0}, high=${counts.high ?? 0}, critical=${counts.critical ?? 0}`;
};

export const collectDependencyGovernanceErrors = ({
    packageJson,
    runtimeConfigPolicy,
    runtimeEnvNames,
    governanceDocumentText,
    auditReport,
}) => [
    ...collectOverrideErrors(packageJson),
    ...collectRuntimePolicyErrors({
        runtimeConfigPolicy,
        runtimeEnvNames,
        governanceDocumentText,
    }),
    ...collectAuditErrors(auditReport),
];
