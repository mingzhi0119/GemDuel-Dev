import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import tseslint from 'typescript-eslint';

const typedFiles = ['**/*.{js,jsx,ts,tsx,cjs,mjs}'];

const reactWorkspaceFiles = [
    'apps/desktop/**/*.{js,jsx,ts,tsx,cjs,mjs}',
    'packages/ui/**/*.{js,jsx,ts,tsx,cjs,mjs}',
];

const libraryWorkspaceFiles = [
    'packages/shared/**/*.{js,jsx,ts,tsx,cjs,mjs}',
    'packages/turn-service/**/*.{js,jsx,ts,tsx,cjs,mjs}',
];

const toolsWorkspaceFiles = ['tools/scripts/**/*.{js,jsx,ts,tsx,cjs,mjs}'];

export default tseslint.config(
    {
        ignores: [
            '**/node_modules/**',
            '**/dist/**',
            '**/dist_electron/**',
            '**/coverage/**',
            '**/artifacts/**',
            '.turbo/**',
            '.vite/**',
        ],
    },
    {
        extends: [js.configs.recommended, ...tseslint.configs.recommended],
        files: reactWorkspaceFiles,
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
        extends: [js.configs.recommended, ...tseslint.configs.recommended],
        files: libraryWorkspaceFiles,
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
        rules: {
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
            '@typescript-eslint/no-explicit-any': 'warn',
        },
    },
    {
        extends: [js.configs.recommended, ...tseslint.configs.recommended],
        files: toolsWorkspaceFiles,
        languageOptions: {
            ecmaVersion: 2020,
            globals: {
                ...globals.node,
                ...globals.commonjs,
            },
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
            },
        },
        rules: {
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
            '@typescript-eslint/no-explicit-any': 'warn',
        },
    },
    {
        files: ['apps/desktop/electron/preload.js', 'apps/desktop/electron/preloadContract.cjs'],
        rules: {
            '@typescript-eslint/no-require-imports': 'off',
        },
    },
    {
        files: ['apps/desktop/src/**/*.{ts,tsx}'],
        ignores: ['apps/desktop/src/**/__tests__/**', 'apps/desktop/src/observability/**/*'],
        rules: {
            'no-console': 'error',
        },
    },
    {
        files: ['packages/shared/src/**/*.{ts,tsx}', 'packages/ui/src/**/*.{ts,tsx}'],
        ignores: ['**/__tests__/**', 'packages/shared/src/observability/**/*'],
        rules: {
            'no-console': 'error',
        },
    },
    {
        files: ['apps/desktop/electron/**/*.{js,cjs}'],
        ignores: ['apps/desktop/electron/**/__tests__/**', 'apps/desktop/electron/main.js'],
        rules: {
            'no-console': 'error',
        },
    },
    {
        files: ['tools/scripts/**/*.{js,cjs,mjs,ts}'],
        ignores: [
            'tools/scripts/**/__tests__/**',
            'tools/scripts/check-*.mjs',
            'tools/scripts/export-*.mjs',
        ],
        rules: {
            'no-console': 'error',
        },
    },
    {
        files: ['packages/shared/src/observability/**/*.{js,jsx,ts,tsx}'],
        rules: {
            'no-console': 'off',
        },
    },
    prettierRecommended
);
