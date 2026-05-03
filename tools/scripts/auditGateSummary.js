export const AUDIT_GATES_SCHEMA_VERSION = 1;

const isPlainObject = (value) =>
    Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const hasRootScript = (packageJson, scriptName) =>
    typeof packageJson?.scripts?.[scriptName] === 'string' &&
    packageJson.scripts[scriptName].length > 0;

export const buildAuditGateSummary = ({ gateSnapshot, packageJson, workflowTexts }) => {
    const requiredRootScripts = gateSnapshot?.requiredRootScripts ?? [];
    const orderedRootScriptCommands = gateSnapshot?.orderedRootScriptCommands ?? {};
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
        orderedRootScriptCommands: Object.entries(orderedRootScriptCommands).map(
            ([scriptName, commands]) => {
                const orderedCommands = Array.isArray(commands) ? commands : [];
                const scriptCommand = packageJson?.scripts?.[scriptName] ?? '';
                let searchFrom = 0;

                return {
                    scriptName,
                    commands: orderedCommands.map((command) => {
                        const commandIndex = scriptCommand.indexOf(command, searchFrom);
                        const presentInOrder = commandIndex >= 0;
                        if (presentInOrder) {
                            searchFrom = commandIndex + command.length;
                        }

                        return {
                            command,
                            presentInOrder,
                        };
                    }),
                };
            }
        ),
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

    if (
        gateSnapshot.orderedRootScriptCommands != null &&
        !isPlainObject(gateSnapshot.orderedRootScriptCommands)
    ) {
        errors.push('Audit gate snapshot orderedRootScriptCommands must be an object.');
    }

    if (!isPlainObject(gateSnapshot.workflowCommands)) {
        errors.push('Audit gate snapshot must define workflowCommands.');
    }

    for (const script of summary?.rootScripts ?? []) {
        if (!script.present) {
            errors.push(`Root package.json is missing script ${script.scriptName}.`);
        }
    }

    for (const script of summary?.orderedRootScriptCommands ?? []) {
        for (const command of script.commands) {
            if (!command.presentInOrder) {
                errors.push(
                    `Root package.json script ${script.scriptName} is missing ordered command ${command.command}.`
                );
            }
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
        '## Ordered Root Script Commands',
        '',
        '| Script | Command | Status |',
        '| --- | --- | --- |'
    );
    for (const script of report.orderedRootScriptCommands ?? []) {
        for (const command of script.commands) {
            lines.push(
                `| ${script.scriptName} | \`${command.command}\` | ${command.presentInOrder ? 'present in order' : 'missing or out of order'} |`
            );
        }
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
