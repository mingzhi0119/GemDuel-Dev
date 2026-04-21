import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    {
        ignores: ['dist', 'dist_electron', 'coverage', 'artifacts'],
    },
    {
        extends: [js.configs.recommended, ...tseslint.configs.recommended],
        files: ['**/*.{js,jsx,ts,tsx,cjs,mjs}'],
        languageOptions: {
            ecmaVersion: 2020,
            globals: {
                ...globals.browser,
                ...globals.node,
                ...globals.commonjs,
            },
            parserOptions: {
                ecmaVersion: 'latest',
                ecmaFeatures: { jsx: true },
                sourceType: 'module',
            },
        },
        plugins: {
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
            '@typescript-eslint/no-explicit-any': 'warn',
        },
    },
    {
        files: ['electron/preload.js', 'electron/preloadContract.cjs'],
        rules: {
            '@typescript-eslint/no-require-imports': 'off',
        },
    },
    {
        files: ['src/**/*.{ts,tsx}'],
        ignores: ['src/**/__tests__/**', 'src/observability/**/*'],
        rules: {
            'no-console': 'error',
        },
    },
    {
        files: ['electron/**/*.{js,cjs}'],
        ignores: ['electron/**/__tests__/**', 'electron/main.js'],
        rules: {
            'no-console': 'error',
        },
    },
    prettierRecommended
);
