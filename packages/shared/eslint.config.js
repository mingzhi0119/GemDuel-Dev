import libraryConfig from '@gemduel/config-eslint/library';

export default [
    ...libraryConfig,
    {
        files: ['src/observability/**/*.{js,jsx,ts,tsx}'],
        rules: {
            'no-console': 'off',
        },
    },
];
