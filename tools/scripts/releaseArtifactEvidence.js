import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

export const RELEASE_ARTIFACT_EVIDENCE_SCHEMA_VERSION = 1;
export const RELEASE_ARTIFACT_REPORT_BASENAME = 'release-artifact-evidence.report';
const RELEASE_ARTIFACT_EXTENSIONS = new Set(['.blockmap', '.exe', '.yml', '.yaml']);

const normalizePath = (value) => value.split(path.sep).join('/');

export const isReleaseArtifactFile = (filePath) =>
    RELEASE_ARTIFACT_EXTENSIONS.has(path.extname(filePath).toLowerCase());

const walkFiles = (rootDir) => {
    if (!fs.existsSync(rootDir)) {
        return [];
    }

    const files = [];
    const stack = [rootDir];
    while (stack.length > 0) {
        const currentDir = stack.pop();
        for (const entry of fs.readdirSync(currentDir, { withFileTypes: true })) {
            const absolutePath = path.join(currentDir, entry.name);
            if (entry.isDirectory()) {
                stack.push(absolutePath);
                continue;
            }

            if (entry.isFile()) {
                files.push(absolutePath);
            }
        }
    }

    return files.sort((a, b) => a.localeCompare(b));
};

export const collectReleaseArtifactFiles = (distDir) =>
    walkFiles(distDir).filter(isReleaseArtifactFile);

export const buildArtifactChecksum = ({ artifactPath, distDir, repoRoot }) => {
    const contents = fs.readFileSync(artifactPath);
    const relativePath = normalizePath(path.relative(repoRoot, artifactPath));
    const relativeDistPath = normalizePath(path.relative(distDir, artifactPath));

    return {
        fileName: path.basename(artifactPath),
        path: relativePath,
        distPath: relativeDistPath,
        sizeBytes: contents.length,
        sha256: crypto.createHash('sha256').update(contents).digest('hex'),
        kind:
            path.extname(artifactPath).toLowerCase() === '.exe' ? 'windows-installer' : 'metadata',
    };
};

export const buildReleaseArtifactEvidence = ({
    artifactFiles,
    distDir,
    repoRoot,
    generatedAt,
    provenance,
    requireSigned,
    platform,
    signatures = new Map(),
}) => {
    const artifacts = artifactFiles.map((artifactPath) => {
        const checksum = buildArtifactChecksum({
            artifactPath,
            distDir,
            repoRoot,
        });

        return {
            ...checksum,
            signature: signatures.get(artifactPath) ?? {
                checked: false,
                status: platform === 'win32' ? 'missing' : 'not-checked',
                reason: platform === 'win32' ? 'signature-not-verified' : 'non-windows-platform',
            },
        };
    });

    const evidence = {
        schemaVersion: RELEASE_ARTIFACT_EVIDENCE_SCHEMA_VERSION,
        generatedAt,
        status: 'computed',
        requireSigned,
        platform,
        distDir: normalizePath(path.relative(repoRoot, distDir)),
        provenance,
        artifactCount: artifacts.length,
        artifacts,
        errors: [],
    };
    const errors = collectReleaseArtifactEvidenceErrors(evidence);

    return {
        ...evidence,
        status:
            errors.length > 0 ? 'failed' : artifacts.length > 0 ? 'passed' : 'skipped-no-artifacts',
        errors,
    };
};

export const collectReleaseArtifactEvidenceErrors = (evidence) => {
    const errors = [];
    const artifacts = evidence?.artifacts ?? [];
    const installerArtifacts = artifacts.filter(
        (artifact) => artifact.kind === 'windows-installer'
    );

    if (!evidence?.requireSigned) {
        return errors;
    }

    if (artifacts.length === 0) {
        errors.push('Release artifact evidence requires at least one generated artifact.');
    }

    if (evidence.platform !== 'win32') {
        errors.push('Release artifact signature verification must run on Windows.');
    }

    if (installerArtifacts.length === 0) {
        errors.push('Release artifact evidence requires at least one Windows installer.');
    }

    for (const artifact of installerArtifacts) {
        if (artifact.signature?.status !== 'Valid') {
            errors.push(`${artifact.path} must have a valid Authenticode signature.`);
        }
    }

    return errors;
};

export const renderReleaseArtifactEvidenceMarkdown = (evidence) => {
    const lines = [
        '# Release Artifact Evidence',
        '',
        `- Generated: ${evidence.generatedAt}`,
        `- Status: ${evidence.status}`,
        `- Dist dir: \`${evidence.distDir}\``,
        `- Require signed artifacts: ${evidence.requireSigned}`,
        `- Platform: ${evidence.platform}`,
        '',
        '## Failures',
    ];

    if (evidence.errors.length === 0) {
        lines.push('', 'None.');
    } else {
        lines.push('');
        for (const error of evidence.errors) {
            lines.push(`- ${error}`);
        }
    }

    lines.push(
        '',
        '## Artifacts',
        '',
        '| Artifact | Kind | Size | SHA256 | Signature |',
        '| --- | --- | ---: | --- | --- |'
    );

    if (evidence.artifacts.length === 0) {
        lines.push('| None | - | 0 | - | - |');
    } else {
        for (const artifact of evidence.artifacts) {
            lines.push(
                `| \`${artifact.path}\` | ${artifact.kind} | ${artifact.sizeBytes} | \`${artifact.sha256}\` | ${artifact.signature?.status ?? 'not-checked'} |`
            );
        }
    }

    lines.push('');
    return `${lines.join('\n')}\n`;
};
