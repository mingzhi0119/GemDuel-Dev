import type { Config } from 'tailwindcss';
import { tailwindPreset } from '@gemduel/config-web/tailwind-preset';

const config: Config = {
    ...tailwindPreset,
    content: [
        './index.html',
        './src/**/*.{js,ts,jsx,tsx}',
        '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
        '../../packages/shared/src/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        ...tailwindPreset.theme,
        extend: {
            ...tailwindPreset.theme.extend,
            fontFamily: {
                sans: ['var(--gemduel-font-sans)'],
                mono: ['var(--gemduel-font-mono)'],
            },
        },
    },
};

export default config;
