import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
    collectRepoSettingsLiveDriftErrors,
    collectRepoSettingsSnapshotErrors,
    readLiveRepoSettings,
} from './repoSettingsGovernance.js';
import { GOVERNANCE_DOC_PATHS } from './governanceDocPaths.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');

const parseArgs = (argv) => ({
    live: argv.includes('--live'),
});

const readWorkflowEntries = () =>
    fs
        .readdirSync(path.join(repoRoot, '.github', 'workflows'))
        .filter((fileName) => /\.(ya?ml)$/i.test(fileName))
        .sort((a, b) => a.localeCompare(b))
        .map((fileName) => {
            const relativePath = `.github/workflows/${fileName}`;
            return {
                relativePath,
                text: fs.readFileSync(path.join(repoRoot, relativePath), 'utf8'),
            };
        });

const main = () => {
    const args = parseArgs(process.argv.slice(2));
    const snapshotPath = path.join(repoRoot, 'tools', 'governance', 'repo-settings.snapshot.json');
    const snapshot = JSON.parse(fs.readFileSync(snapshotPath, 'utf8'));
    const checklistText = fs.readFileSync(
        path.join(repoRoot, GOVERNANCE_DOC_PATHS.repoSettingsChecklist),
        'utf8'
    );
    const issues = collectRepoSettingsSnapshotErrors({
        snapshot,
        checklistText,
        workflowEntries: readWorkflowEntries(),
    });

    if (args.live) {
        const liveState = readLiveRepoSettings(snapshot.repository);
        issues.push(
            ...collectRepoSettingsLiveDriftErrors({
                snapshot,
                liveState,
            })
        );
    }

    if (issues.length > 0) {
        const mode = args.live ? 'live comparison' : 'desired-state snapshot';
        console.error(`Repo settings governance ${mode} failed:`);
        for (const issue of issues) {
            console.error(`- ${issue}`);
        }
        process.exit(1);
    }

    const mode = args.live ? 'desired-state and live GitHub comparison' : 'desired-state snapshot';
    console.log(`Repo settings governance ${mode} passed.`);
};

main();
