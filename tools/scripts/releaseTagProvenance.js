import { execFileSync } from 'node:child_process';

const isNonEmptyString = (value) => typeof value === 'string' && value.length > 0;

export const createGitRunner = (cwd) => (args) =>
    execFileSync('git', args, {
        cwd,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe'],
    }).trim();

export const collectReleaseTagProvenanceErrors = ({
    commitSha,
    defaultBranch,
    releaseRef,
    git,
}) => {
    const issues = [];

    if (!isNonEmptyString(releaseRef) || !releaseRef.startsWith('refs/tags/')) {
        issues.push('Release provenance check requires a tag ref (refs/tags/*).');
    }

    if (!isNonEmptyString(commitSha)) {
        issues.push('Release provenance check requires a commit SHA.');
    }

    if (!isNonEmptyString(defaultBranch)) {
        issues.push('Release provenance check requires a default branch name.');
    }

    if (issues.length > 0) {
        return issues;
    }

    const remoteBranchRef = `refs/remotes/origin/${defaultBranch}`;

    try {
        git(['rev-parse', '--verify', remoteBranchRef]);
    } catch {
        issues.push(`Default branch ref ${remoteBranchRef} is not available locally.`);
        return issues;
    }

    try {
        git(['merge-base', '--is-ancestor', commitSha, remoteBranchRef]);
    } catch {
        issues.push(`Release commit ${commitSha} is not reachable from ${remoteBranchRef}.`);
    }

    return issues;
};
