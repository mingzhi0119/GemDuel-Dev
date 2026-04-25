export const RELEASE_CHANGELOG_SCHEMA_VERSION = 1;

const isPlainObject = (value) =>
    Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const getReleaseDate = (publishedAt) =>
    typeof publishedAt === 'string' && publishedAt.length >= 10 ? publishedAt.slice(0, 10) : null;

const hasReleaseHeading = (changelogText, tag, date) => {
    const escapedTag = tag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const datePattern = date ? `\\s+-\\s+${date}` : '(?:\\s+-\\s+\\d{4}-\\d{2}-\\d{2})?';
    return new RegExp(`^##\\s+${escapedTag}${datePattern}\\s*$`, 'm').test(changelogText);
};

export const collectChangelogGovernanceErrors = ({
    changelogText,
    releaseSnapshot,
    packageJson,
}) => {
    const errors = [];

    if (!isPlainObject(releaseSnapshot)) {
        return ['Release changelog snapshot must be a JSON object.'];
    }

    if (releaseSnapshot.schemaVersion !== RELEASE_CHANGELOG_SCHEMA_VERSION) {
        errors.push(
            `Release changelog snapshot schemaVersion must remain ${RELEASE_CHANGELOG_SCHEMA_VERSION}.`
        );
    }

    if (releaseSnapshot.source !== 'github-releases') {
        errors.push('Release changelog snapshot source must remain github-releases.');
    }

    const publishedReleases = releaseSnapshot.publishedReleases;
    if (!Array.isArray(publishedReleases) || publishedReleases.length === 0) {
        errors.push('Release changelog snapshot must list publishedReleases.');
        return errors;
    }

    const tags = publishedReleases.map((release) => release?.tag).filter(Boolean);
    const duplicateTags = tags.filter((tag, index) => tags.indexOf(tag) !== index);
    for (const duplicateTag of new Set(duplicateTags)) {
        errors.push(`Release changelog snapshot contains duplicate tag ${duplicateTag}.`);
    }

    const expectedCurrentTag = `v${packageJson?.version ?? ''}`;
    if (!tags.includes(expectedCurrentTag)) {
        errors.push(
            `Release changelog snapshot must include current package tag ${expectedCurrentTag}.`
        );
    }

    for (const release of publishedReleases) {
        if (!isPlainObject(release)) {
            errors.push('Release changelog entries must be objects.');
            continue;
        }

        if (typeof release.tag !== 'string' || !/^v5\./.test(release.tag)) {
            errors.push(
                `Release changelog entry has invalid v5 tag ${release.tag ?? '<missing>'}.`
            );
            continue;
        }

        const date = getReleaseDate(release.publishedAt);
        if (!date) {
            errors.push(`Release changelog entry ${release.tag} must define publishedAt.`);
            continue;
        }

        if (!hasReleaseHeading(changelogText, release.tag, date)) {
            errors.push(`CHANGELOG.md is missing release heading ${release.tag} - ${date}.`);
        }
    }

    if (!changelogText.includes('`pnpm changelog:check`')) {
        errors.push('CHANGELOG.md must document the changelog gate command.');
    }

    return errors;
};
