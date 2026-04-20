import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { collectReleaseTagProvenanceErrors, createGitRunner } from './releaseTagProvenance.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

const parseArgs = (argv) => {
    const args = {
        commitSha: process.env.GITHUB_SHA ?? null,
        defaultBranch: process.env.GITHUB_DEFAULT_BRANCH ?? null,
        releaseRef: process.env.GITHUB_REF ?? null,
        repoRoot,
    };

    for (let index = 0; index < argv.length; index += 1) {
        const value = argv[index];

        if (value === '--commit-sha') {
            args.commitSha = argv[index + 1] ?? args.commitSha;
            index += 1;
            continue;
        }

        if (value === '--default-branch') {
            args.defaultBranch = argv[index + 1] ?? args.defaultBranch;
            index += 1;
            continue;
        }

        if (value === '--release-ref') {
            args.releaseRef = argv[index + 1] ?? args.releaseRef;
            index += 1;
            continue;
        }

        if (value === '--repo-root') {
            args.repoRoot = path.resolve(argv[index + 1] ?? args.repoRoot);
            index += 1;
        }
    }

    return args;
};

const main = () => {
    const {
        commitSha,
        defaultBranch,
        releaseRef,
        repoRoot: targetRepoRoot,
    } = parseArgs(process.argv.slice(2));
    const issues = collectReleaseTagProvenanceErrors({
        commitSha,
        defaultBranch,
        releaseRef,
        git: createGitRunner(targetRepoRoot),
    });

    if (issues.length > 0) {
        console.error('Release tag provenance check failed:');
        for (const issue of issues) {
            console.error(`- ${issue}`);
        }
        process.exit(1);
    }

    console.log(
        `Release tag provenance check passed for ${releaseRef} against origin/${defaultBranch}.`
    );
};

main();
