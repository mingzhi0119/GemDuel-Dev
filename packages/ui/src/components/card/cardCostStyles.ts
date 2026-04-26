import type { CSSProperties } from 'react';
import type { GemColor } from '@gemduel/shared/types';

export const getCardCostCountStyle = (gemId: GemColor, theme: 'light' | 'dark'): CSSProperties => {
    switch (gemId) {
        case 'blue':
            return {
                color: theme === 'dark' ? '#fef3c7' : '#fff7ed',
                textShadow: '0 1px 2px rgba(15,23,42,0.92), 0 0 3px rgba(15,23,42,0.35)',
            };
        case 'green':
            return {
                color: theme === 'dark' ? '#ecfccb' : '#f7fee7',
                textShadow: '0 1px 2px rgba(6,78,59,0.92), 0 0 3px rgba(6,78,59,0.35)',
            };
        case 'red':
            return {
                color: theme === 'dark' ? '#ffedd5' : '#fff7ed',
                textShadow: '0 1px 2px rgba(127,29,29,0.92), 0 0 3px rgba(127,29,29,0.35)',
            };
        case 'black':
            return {
                color: '#fde68a',
                textShadow: '0 1px 2px rgba(15,23,42,0.96), 0 0 3px rgba(15,23,42,0.46)',
            };
        case 'white':
            return {
                color: '#ffffff',
                WebkitTextStroke: '0.45px rgba(15,23,42,0.94)',
                textShadow:
                    '0 0 1px rgba(15,23,42,1), 0 1px 3px rgba(15,23,42,0.98), 0 0 6px rgba(15,23,42,0.62)',
            };
        case 'pearl':
            return {
                color: theme === 'dark' ? '#fff7fb' : '#701a75',
                WebkitTextStroke:
                    theme === 'dark'
                        ? '0.42px rgba(76,29,149,0.9)'
                        : '0.35px rgba(255,255,255,0.9)',
                textShadow:
                    theme === 'dark'
                        ? '0 0 1px rgba(76,29,149,1), 0 1px 3px rgba(76,29,149,0.96), 0 0 6px rgba(131,24,67,0.5)'
                        : '0 1px 2px rgba(255,255,255,0.9), 0 0 4px rgba(255,255,255,0.55)',
            };
        case 'gold':
            return {
                color: '#78350f',
                textShadow: '0 1px 1px rgba(255,255,255,0.84), 0 0 2px rgba(255,255,255,0.40)',
            };
        default:
            return {
                color: theme === 'dark' ? '#f8fafc' : '#0f172a',
                textShadow:
                    theme === 'dark'
                        ? '0 1px 2px rgba(15,23,42,0.92)'
                        : '0 1px 1px rgba(255,255,255,0.72)',
            };
    }
};
