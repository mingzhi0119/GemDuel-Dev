import { spawnSync } from 'node:child_process';

export const REPO_SETTINGS_SCHEMA_VERSION = 1;
export const REQUIRED_STATUS_CHECKS = Object.freeze(['governance', 'production-audit']);

const isPlainObject = (value) =>
    Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const unique = (values) => Array.from(new Set(values));

const asArray = (value) => (Array.isArray(value) ? value : []);

export const collectRepoSettingsSnapshotErrors = ({ snapshot, checklistText = '' }) => {
    const errors = [];

    if (!isPlainObject(snapshot)) {
        return ['Repo settings snapshot must be a JSON object.'];
    }

    if (snapshot.schemaVersion !== REPO_SETTINGS_SCHEMA_VERSION) {
        errors.push(
            `Repo settings snapshot schemaVersion must remain ${REPO_SETTINGS_SCHEMA_VERSION}.`
        );
    }

    for (const field of ['owner', 'name', 'defaultBranch']) {
        if (typeof snapshot.repository?.[field] !== 'string') {
            errors.push(`Repo settings snapshot must define repository.${field}.`);
        }
    }

    if (snapshot.scope?.mode !== 'code-only-desired-state') {
        errors.push('Repo settings snapshot must remain in code-only desired-state mode.');
    }

    if (snapshot.scope?.liveMutationsAllowed !== false) {
        errors.push('Repo settings snapshot must explicitly forbid live mutations.');
    }

    const branchProtection = snapshot.branchProtection;
    if (!isPlainObject(branchProtection)) {
        errors.push('Repo settings snapshot must define branchProtection.');
    } else {
        for (const flag of [
            'protected',
            'requirePullRequest',
            'requireConversationResolution',
            'restrictDirectPushes',
        ]) {
            if (branchProtection[flag] !== true) {
                errors.push(`Repo settings branchProtection.${flag} must be true.`);
            }
        }

        const checks = asArray(branchProtection.requiredStatusChecks);
        for (const check of REQUIRED_STATUS_CHECKS) {
            if (!checks.includes(check)) {
                errors.push(`Repo settings snapshot is missing required status check ${check}.`);
            }
        }
    }

    const rulesets = asArray(snapshot.rulesets);
    if (rulesets.length < 2) {
        errors.push('Repo settings snapshot must define branch and tag rulesets.');
    }

    const rulesetTargets = new Set(rulesets.map((ruleset) => ruleset?.target));
    if (!rulesetTargets.has('branch')) {
        errors.push('Repo settings snapshot must include a branch ruleset.');
    }
    if (!rulesetTargets.has('tag')) {
        errors.push('Repo settings snapshot must include a release tag ruleset.');
    }

    for (const ruleset of rulesets) {
        if (!isPlainObject(ruleset)) {
            errors.push('Repo settings rulesets must be objects.');
            continue;
        }

        if (typeof ruleset.id !== 'string' || ruleset.id.length === 0) {
            errors.push('Repo settings rulesets must define stable ids.');
        }

        if (ruleset.enforcement !== 'active') {
            errors.push(`Repo settings ruleset ${ruleset.id ?? '<unknown>'} must be active.`);
        }

        if (!Array.isArray(ruleset.rules) || ruleset.rules.length === 0) {
            errors.push(`Repo settings ruleset ${ruleset.id ?? '<unknown>'} must define rules.`);
        }
    }

    const security = snapshot.security;
    if (!isPlainObject(security)) {
        errors.push('Repo settings snapshot must define security.');
    } else {
        if (security.vulnerabilityAlerts !== true) {
            errors.push('Repo settings snapshot must require vulnerability alerts.');
        }
        if (security.privateVulnerabilityReporting !== true) {
            errors.push('Repo settings snapshot must require private vulnerability reporting.');
        }
        if (
            typeof security.securityAdvisoryUrl !== 'string' ||
            !security.securityAdvisoryUrl.includes('/security/advisories/new')
        ) {
            errors.push('Repo settings snapshot must include a GitHub security advisory URL.');
        }
    }

    for (const requiredDocToken of [
        '`pnpm repo-settings:check`',
        '`tools/governance/repo-settings.snapshot.json`',
    ]) {
        if (!checklistText.includes(requiredDocToken)) {
            errors.push(`Repo settings checklist must mention ${requiredDocToken}.`);
        }
    }

    return errors;
};

const parseJsonOrNull = (text) => {
    if (typeof text !== 'string' || text.trim().length === 0) {
        return null;
    }

    try {
        return JSON.parse(text);
    } catch {
        return null;
    }
};

const runGhApi = (endpoint) => {
    const result = spawnSync('gh', ['api', endpoint], {
        encoding: 'utf8',
        windowsHide: true,
    });

    return {
        ok: result.status === 0,
        status: result.status,
        stdout: result.stdout ?? '',
        stderr: result.stderr ?? '',
        json: parseJsonOrNull(result.stdout ?? ''),
    };
};

export const readLiveRepoSettings = ({ owner, name, defaultBranch }) => {
    const repoPath = `repos/${owner}/${name}`;
    const repo = runGhApi(repoPath);
    const branchProtection = runGhApi(`${repoPath}/branches/${defaultBranch}/protection`);
    const rulesets = runGhApi(`${repoPath}/rulesets`);
    const vulnerabilityAlerts = runGhApi(`${repoPath}/vulnerability-alerts`);

    return {
        repository: repo.json,
        branchProtection: branchProtection.ok ? branchProtection.json : null,
        branchProtectionAvailable: branchProtection.ok,
        rulesets: Array.isArray(rulesets.json) ? rulesets.json : [],
        rulesetsAvailable: rulesets.ok,
        vulnerabilityAlertsEnabled: vulnerabilityAlerts.ok,
        diagnostics: {
            branchProtectionStatus: branchProtection.status,
            rulesetsStatus: rulesets.status,
            vulnerabilityAlertsStatus: vulnerabilityAlerts.status,
        },
    };
};

const hasRequiredStatusCheck = (branchProtection, checkName) => {
    const contexts = [
        ...asArray(branchProtection?.required_status_checks?.contexts),
        ...asArray(branchProtection?.required_status_checks?.checks).map((check) => check.context),
    ].filter(Boolean);

    return contexts.includes(checkName);
};

const hasRulesetTarget = (liveRulesets, target) =>
    liveRulesets.some(
        (ruleset) =>
            ruleset?.target === target &&
            (ruleset.enforcement === 'active' || ruleset.enforcement === 'evaluate')
    );

export const collectRepoSettingsLiveDriftErrors = ({ snapshot, liveState }) => {
    const errors = [];
    const desiredBranch = snapshot.repository?.defaultBranch ?? '<unknown>';

    if (!liveState?.branchProtectionAvailable || !liveState.branchProtection) {
        errors.push(`GitHub default branch ${desiredBranch} is not protected.`);
    } else {
        const branchProtection = liveState.branchProtection;
        const requiredChecks = asArray(snapshot.branchProtection?.requiredStatusChecks);
        for (const check of requiredChecks) {
            if (!hasRequiredStatusCheck(branchProtection, check)) {
                errors.push(`GitHub branch protection is missing required status check ${check}.`);
            }
        }

        if (!branchProtection.required_pull_request_reviews) {
            errors.push('GitHub branch protection does not require pull request reviews.');
        }

        if (branchProtection.required_conversation_resolution?.enabled !== true) {
            errors.push('GitHub branch protection does not require resolved conversations.');
        }
    }

    if (!liveState?.rulesetsAvailable) {
        errors.push('GitHub rulesets could not be read.');
    } else {
        for (const target of unique(asArray(snapshot.rulesets).map((ruleset) => ruleset.target))) {
            if (!hasRulesetTarget(liveState.rulesets, target)) {
                errors.push(`GitHub rulesets are missing an active ${target} ruleset.`);
            }
        }
    }

    if (snapshot.security?.vulnerabilityAlerts && !liveState?.vulnerabilityAlertsEnabled) {
        errors.push('GitHub vulnerability alerts are disabled or unavailable.');
    }

    return errors;
};
