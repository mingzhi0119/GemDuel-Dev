import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import process from 'node:process';

const inspectScript = String.raw`
$ErrorActionPreference = 'Stop'
$allProcesses = @(Get-CimInstance Win32_Process)
$processIds = [System.Collections.Generic.HashSet[int]]::new()
foreach ($proc in $allProcesses) {
    [void]$processIds.Add([int]$proc.ProcessId)
}

$userProfile = [Environment]::GetFolderPath('UserProfile')
$agentBrowserRoot = (Join-Path $userProfile '.agent-browser\browsers').ToLowerInvariant()
$targets = foreach ($proc in $allProcesses) {
    $name = [string]$proc.Name
    $executablePath = [string]$proc.ExecutablePath
    $commandLine = [string]$proc.CommandLine
    $pathMatch = $false
    if ($executablePath) {
        $normalizedPath = $executablePath.ToLowerInvariant()
        $pathMatch = $name -ieq 'chrome.exe' -and
            $normalizedPath.StartsWith($agentBrowserRoot) -and
            $normalizedPath.EndsWith('\chrome.exe')
    }
    $commandMatch = $name -ieq 'chrome.exe' -and
        (($commandLine -like '*.agent-browser*') -or ($commandLine -like '*agent-browser-chrome-*'))

    if ($pathMatch -or $commandMatch) {
        $matchedBy = @()
        if ($pathMatch) {
            $matchedBy += 'agent-browser-chrome-path'
        }
        if ($commandMatch) {
            $matchedBy += 'agent-browser-command-line'
        }
        [pscustomobject]@{
            processId = [int]$proc.ProcessId
            parentProcessId = [int]$proc.ParentProcessId
            parentExists = $processIds.Contains([int]$proc.ParentProcessId)
            name = $name
            executablePath = $executablePath
            commandLine = $commandLine
            matchedBy = $matchedBy
        }
    }
}

@($targets) | ConvertTo-Json -Depth 5 -Compress
`;

const runPowerShell = (script) => {
    const shells = ['powershell.exe', 'pwsh.exe'];
    const failures = [];

    for (const shell of shells) {
        const result = spawnSync(
            shell,
            ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-Command', script],
            {
                encoding: 'utf8',
                windowsHide: true,
            }
        );
        if (!result.error && result.status === 0) {
            return result.stdout;
        }
        failures.push(
            `${shell}: ${result.error?.message ?? result.stderr?.trim() ?? `exit ${result.status}`}`
        );
    }

    throw new Error(`Could not inspect Windows processes:\n${failures.join('\n')}`);
};

export const inspectAgentBrowserProcesses = () => {
    if (process.platform !== 'win32') {
        return { supported: false, processes: [] };
    }

    const stdout = runPowerShell(inspectScript).trim();
    if (!stdout) {
        return { supported: true, processes: [] };
    }

    const parsed = JSON.parse(stdout);
    return {
        supported: true,
        processes: Array.isArray(parsed) ? parsed : [parsed],
    };
};

export const summarizeAgentBrowserProcesses = (processes) => ({
    count: processes.length,
    orphanCount: processes.filter((entry) => !entry.parentExists).length,
    processIds: processes.map((entry) => entry.processId),
});

export const formatAgentBrowserProcesses = (processes) =>
    processes.length === 0
        ? '(none)'
        : processes
              .map((entry) =>
                  [
                      `PID ${entry.processId} parent ${entry.parentProcessId} parentExists=${entry.parentExists}`,
                      `path: ${entry.executablePath || '(unknown)'}`,
                      `command: ${entry.commandLine || '(empty)'}`,
                  ].join('\n  ')
              )
              .join('\n');

export const killAgentBrowserProcesses = (processes) =>
    processes.map((entry) => {
        const result = spawnSync('taskkill', ['/PID', String(entry.processId), '/T', '/F'], {
            encoding: 'utf8',
            windowsHide: true,
        });
        return {
            action: 'taskkill /T /F',
            processId: entry.processId,
            ok: result.status === 0,
            exitCode: result.status,
            stderr: result.stderr?.trim() || null,
        };
    });

const parseArgs = (argv) => {
    const options = {
        kill: false,
        max: null,
        pretty: false,
    };

    for (let index = 0; index < argv.length; index += 1) {
        const arg = argv[index];
        if (arg === '--kill') {
            options.kill = true;
        } else if (arg === '--max') {
            options.max = Number(argv[index + 1]);
            index += 1;
        } else if (arg === '--pretty') {
            options.pretty = true;
        } else if (arg === '--help') {
            process.stdout.write(
                [
                    'Usage: node tools/migration/agent-browser-process-guard.mjs [options]',
                    '',
                    'Options:',
                    '  --pretty      Pretty-print JSON output.',
                    '  --max <n>     Exit 1 when the matched process count exceeds n.',
                    '  --kill        Kill matched agent-browser Chrome process trees.',
                    '',
                    'Default mode is dry-run. The matcher only includes Chrome for Testing',
                    'processes under %USERPROFILE%\\.agent-browser\\browsers or command lines',
                    'containing .agent-browser / agent-browser-chrome-. Normal Chrome and Edge',
                    'processes are excluded by construction.',
                    '',
                ].join('\n')
            );
            process.exit(0);
        }
    }

    return options;
};

const main = () => {
    const options = parseArgs(process.argv.slice(2));
    const before = inspectAgentBrowserProcesses();
    const cleanupActions = options.kill ? killAgentBrowserProcesses(before.processes) : [];
    const after = options.kill ? inspectAgentBrowserProcesses() : before;
    const summary = summarizeAgentBrowserProcesses(after.processes);
    const payload = {
        dryRun: !options.kill,
        supported: after.supported,
        beforeCount: before.processes.length,
        afterCount: summary.count,
        orphanCount: summary.orphanCount,
        cleanupActions,
        processes: after.processes,
    };

    process.stdout.write(JSON.stringify(payload, null, options.pretty ? 4 : 0) + '\n');

    if (Number.isFinite(options.max) && summary.count > options.max) {
        process.exitCode = 1;
    }
};

if (
    process.argv[1] &&
    path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))
) {
    main();
}
