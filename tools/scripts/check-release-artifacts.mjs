import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import {
    RELEASE_ARTIFACT_REPORT_BASENAME,
    buildReleaseArtifactEvidence,
    collectReleaseArtifactFiles,
    renderReleaseArtifactEvidenceMarkdown,
} from './releaseArtifactEvidence.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');

const parseArgs = (argv) => {
    const args = {
        distDir: path.join(repoRoot, 'apps', 'desktop', 'dist_electron'),
        outDir: path.join(repoRoot, 'artifacts', 'governance'),
        requireSigned: (process.env.GITHUB_REF ?? '').startsWith('refs/tags/'),
        pretty: true,
    };

    for (let index = 0; index < argv.length; index += 1) {
        const value = argv[index];
        if (value === '--dist-dir') {
            args.distDir = path.resolve(repoRoot, argv[index + 1] ?? args.distDir);
            index += 1;
        } else if (value === '--out-dir') {
            args.outDir = path.resolve(repoRoot, argv[index + 1] ?? args.outDir);
            index += 1;
        } else if (value === '--require-signed') {
            args.requireSigned = true;
        } else if (value === '--no-require-signed') {
            args.requireSigned = false;
        } else if (value === '--compact') {
            args.pretty = false;
        }
    }

    return args;
};

const escapePowerShellSingleQuotedString = (value) => `'${value.replaceAll("'", "''")}'`;

const verifyAuthenticodeSignature = (artifactPath) => {
    if (process.platform !== 'win32') {
        return {
            checked: false,
            status: 'not-checked',
            reason: 'non-windows-platform',
        };
    }

    const script = [
        `$signature = Get-AuthenticodeSignature -LiteralPath ${escapePowerShellSingleQuotedString(artifactPath)}`,
        '[PSCustomObject]@{',
        '  checked = $true',
        '  status = $signature.Status.ToString()',
        '  statusMessage = $signature.StatusMessage',
        '  signerCertificateSubject = if ($signature.SignerCertificate) { $signature.SignerCertificate.Subject } else { $null }',
        '} | ConvertTo-Json -Compress',
    ].join('; ');
    const result = spawnSync('powershell', ['-NoProfile', '-Command', script], {
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe'],
    });

    if (result.status !== 0) {
        return {
            checked: true,
            status: 'verification-failed',
            reason: result.stderr.trim() || 'powershell-verification-failed',
        };
    }

    try {
        return JSON.parse(result.stdout);
    } catch {
        return {
            checked: true,
            status: 'verification-failed',
            reason: 'invalid-powershell-json',
        };
    }
};

const buildProvenance = () => ({
    repository: process.env.GITHUB_REPOSITORY ?? null,
    sha: process.env.GITHUB_SHA ?? null,
    ref: process.env.GITHUB_REF ?? null,
    workflowName: process.env.GITHUB_WORKFLOW ?? null,
    runId: process.env.GITHUB_RUN_ID ?? null,
    runAttempt: process.env.GITHUB_RUN_ATTEMPT ?? null,
    jobName: process.env.GITHUB_JOB ?? null,
    generatedBy: 'tools/scripts/check-release-artifacts.mjs',
});

const main = () => {
    const args = parseArgs(process.argv.slice(2));
    const artifactFiles = collectReleaseArtifactFiles(args.distDir);
    const signatures = new Map(
        artifactFiles
            .filter((artifactPath) => path.extname(artifactPath).toLowerCase() === '.exe')
            .map((artifactPath) => [artifactPath, verifyAuthenticodeSignature(artifactPath)])
    );
    const evidence = buildReleaseArtifactEvidence({
        artifactFiles,
        distDir: args.distDir,
        repoRoot,
        generatedAt: new Date().toISOString(),
        provenance: buildProvenance(),
        requireSigned: args.requireSigned,
        platform: process.platform,
        signatures,
    });

    fs.mkdirSync(args.outDir, { recursive: true });
    fs.writeFileSync(
        path.join(args.outDir, `${RELEASE_ARTIFACT_REPORT_BASENAME}.json`),
        `${JSON.stringify(evidence, null, args.pretty ? 2 : 0)}\n`,
        'utf8'
    );
    fs.writeFileSync(
        path.join(args.outDir, `${RELEASE_ARTIFACT_REPORT_BASENAME}.md`),
        renderReleaseArtifactEvidenceMarkdown(evidence),
        'utf8'
    );

    if (evidence.errors.length > 0) {
        console.error('Release artifact evidence check failed:');
        for (const error of evidence.errors) {
            console.error(`- ${error}`);
        }
        process.exit(1);
    }

    console.log(`Release artifact evidence check ${evidence.status}.`);
};

main();
