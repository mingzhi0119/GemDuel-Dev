export const AUDIT_GATES_SCHEMA_VERSION = 1;

const isPlainObject = (value) =>
    Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const hasRootScript = (packageJson, scriptName) =>
    typeof packageJson?.scripts?.[scriptName] === 'string' &&
    packageJson.scripts[scriptName].length > 0;

export const buildAuditGateSummary = ({ gateSnapshot, packageJson, workflowTexts }) => {
    const requiredRootScripts = gateSnapshot?.requiredRootScripts ?? [];
    const workflowCommands = gateSnapshot?.workflowCommands ?? {};

    return {
        schemaVersion: 1,
        status: 'computed',
        scopeAnchor: gateSnapshot?.scopeAnchor ?? null,
        coverage: gateSnapshot?.coverage ?? null,
        rootScripts: requiredRootScripts.map((scriptName) => ({
            scriptName,
            present: hasRootScript(packageJson, scriptName),
            command: packageJson?.scripts?.[scriptName] ?? null,
        })),
        workflows: Object.entries(workflowCommands).map(([workflowPath, commands]) => {
            const workflowText = workflowTexts?.[workflowPath] ?? '';
            return {
                workflowPath,
                commands: commands.map((command) => ({
                    command,
                    present: workflowText.includes(command),
                })),
            };
        }),
        artifactOutputs: gateSnapshot?.artifactOutputs ?? [],
    };
};

export const collectAuditGateSummaryErrors = ({ gateSnapshot, summary }) => {
    const errors = [];

    if (!isPlainObject(gateSnapshot)) {
        return ['Audit gate snapshot must be a JSON object.'];
    }

    if (gateSnapshot.schemaVersion !== AUDIT_GATES_SCHEMA_VERSION) {
        errors.push(`Audit gate snapshot schemaVersion must remain ${AUDIT_GATES_SCHEMA_VERSION}.`);
    }

    if (!Array.isArray(gateSnapshot.requiredRootScripts)) {
        errors.push('Audit gate snapshot must define requiredRootScripts.');
    }

    if (!isPlainObject(gateSnapshot.workflowCommands)) {
        errors.push('Audit gate snapshot must define workflowCommands.');
    }

    for (const script of summary?.rootScripts ?? []) {
        if (!script.present) {
            errors.push(`Root package.json is missing script ${script.scriptName}.`);
        }
    }

    for (const workflow of summary?.workflows ?? []) {
        for (const command of workflow.commands) {
            if (!command.present) {
                errors.push(`${workflow.workflowPath} is missing gate command ${command.command}.`);
            }
        }
    }

    if (!Array.isArray(gateSnapshot.artifactOutputs) || gateSnapshot.artifactOutputs.length === 0) {
        errors.push('Audit gate snapshot must define artifactOutputs.');
    }

    return errors;
};

export const finalizeAuditGateSummary = ({ summary, errors, generatedAt, provenance }) => ({
    ...summary,
    generatedAt,
    provenance,
    status: errors.length > 0 ? 'failed' : 'passed',
    errors,
});

export const renderAuditGateMarkdown = (report) => {
    const lines = [
        '# Audit Gate Summary',
        '',
        `- Generated: ${report.generatedAt}`,
        `- Status: ${report.status}`,
        `- Scope anchor: ${report.scopeAnchor}`,
        '',
        '## Failures',
    ];

    if (report.errors.length === 0) {
        lines.push('', 'None.');
    } else {
        lines.push('');
        for (const error of report.errors) {
            lines.push(`- ${error}`);
        }
    }

    lines.push('', '## Root Scripts', '', '| Script | Status | Command |', '| --- | --- | --- |');
    for (const script of report.rootScripts) {
        lines.push(
            `| ${script.scriptName} | ${script.present ? 'present' : 'missing'} | \`${script.command ?? ''}\` |`
        );
    }

    lines.push(
        '',
        '## Workflow Commands',
        '',
        '| Workflow | Command | Status |',
        '| --- | --- | --- |'
    );
    for (const workflow of report.workflows) {
        for (const command of workflow.commands) {
            lines.push(
                `| ${workflow.workflowPath} | \`${command.command}\` | ${command.present ? 'present' : 'missing'} |`
            );
        }
    }

    lines.push('');
    return `${lines.join('\n')}\n`;
};
