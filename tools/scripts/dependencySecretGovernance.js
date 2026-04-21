import { collectTextFileEntries } from './dependencyGovernance.js';

const SECRET_PLACEHOLDER_VALUES = new Set([
    'example',
    'placeholder',
    'redacted',
    'sample',
    'test',
    'mock',
    'dummy',
    'runtime-pass',
    'runtime-user',
    'user',
    'pass',
]);

const HIGH_CONFIDENCE_SECRET_PATTERNS = [
    /-----BEGIN [A-Z ]*PRIVATE KEY-----/,
    /\b(?:ghp_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|glpat-[A-Za-z0-9_-]{20,}|sk-[A-Za-z0-9]{20,}|xox[baprs]-[A-Za-z0-9-]{10,}|AKIA[0-9A-Z]{16}|ASIA[0-9A-Z]{16})\b/,
    /:\/\/[^/\s:@]+:[^/\s@]+@/,
];

const SENSITIVE_ASSIGNMENT_PATTERN =
    /\b(password|secret|token|credential|api[_-]?key|access[_-]?key|private[_-]?key)\b\s*[:=]\s*(['"])([^'"`]+)\2/i;

const isPlaceholderSecretValue = (value) => {
    const normalized = value.trim().toLowerCase();
    if (SECRET_PLACEHOLDER_VALUES.has(normalized)) {
        return true;
    }

    return /^<.*>$/.test(normalized) || normalized === '[redacted]' || normalized === 'redacted';
};

const findSecretLikeLines = ({ relativePath, text }) => {
    const issues = [];
    const lines = text.split(/\r?\n/);

    for (let index = 0; index < lines.length; index += 1) {
        const line = lines[index];
        if (line.includes('${{ secrets.')) {
            continue;
        }

        for (const pattern of HIGH_CONFIDENCE_SECRET_PATTERNS) {
            if (pattern.test(line)) {
                issues.push(
                    `${relativePath}:${index + 1} contains a high-confidence secret-like literal.`
                );
                break;
            }
        }

        const assignmentMatch = line.match(SENSITIVE_ASSIGNMENT_PATTERN);
        if (!assignmentMatch) {
            continue;
        }

        const sensitiveValue = assignmentMatch[3];
        if (isPlaceholderSecretValue(sensitiveValue)) {
            continue;
        }

        const looksCredLike =
            sensitiveValue.length >= 8 &&
            (/[0-9]/.test(sensitiveValue) ||
                /[-_/+=]/.test(sensitiveValue) ||
                /[A-Z]/.test(sensitiveValue));

        if (looksCredLike) {
            issues.push(
                `${relativePath}:${index + 1} assigns a credential-like value to ${assignmentMatch[1]}.`
            );
        }
    }

    return issues;
};

export const collectSecretScanErrorsFromEntries = (entries) =>
    entries.flatMap((entry) => findSecretLikeLines(entry));

export const collectSecretScanErrorsFromRepo = (repoRoot) =>
    collectSecretScanErrorsFromEntries(
        collectTextFileEntries(repoRoot, {
            includeTests: false,
        })
    );
