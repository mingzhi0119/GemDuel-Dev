import js from '@eslint/js';
import globals from 'globals';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    {
        ignores: ['dist', 'coverage', 'artifacts'],
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
        rules: {
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
            '@typescript-eslint/no-explicit-any': 'warn',
        },
    },
    {
        files: ['src/**/*.{js,jsx,ts,tsx,cjs,mjs}'],
        ignores: ['src/**/__tests__/**'],
        rules: {
            'no-console': 'error',
        },
    },
    prettierRecommended
);
