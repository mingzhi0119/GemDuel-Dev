import type { Config } from 'tailwindcss';
import { tailwindPreset } from '@gemduel/config-web/tailwind-preset';

const config: Config = {
    ...tailwindPreset,
    content: [
        './index.html',
        './src/**/*.{js,ts,jsx,tsx}',
        '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
    ],
};

export default config;
