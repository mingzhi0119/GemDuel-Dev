import React from 'react';
import { getGemLabel } from '@gemduel/shared';
import { GemTypeObject } from '@gemduel/shared/types';
import { useLocale } from '../i18n/LocaleProvider';
import { cn } from '@gemduel/shared/utils';
import { GemArtwork, type GemArtworkVariant } from './GemArtwork';

interface GemIconProps {
    type: GemTypeObject;
    size?: string;
    className?: string;
    count?: number;
    theme?: 'light' | 'dark';
    countClassName?: string;
    countStyle?: React.CSSProperties;
    variant?: GemArtworkVariant;
}

export const GemIcon: React.FC<GemIconProps> = ({
    type,
    size = 'w-6 h-6',
    className = '',
    count,
    theme = 'dark',
    countClassName = '',
    countStyle,
    variant = 'icon',
}) => {
    const { locale } = useLocale();
    const hasEnhancedContrast = theme === 'dark' && type.id === 'black';

    return (
        <div
            data-gem-contrast={hasEnhancedContrast ? 'enhanced' : 'default'}
            className={cn('relative', size, className)}
            title={getGemLabel(type.id === 'empty' ? 'empty' : type.id, locale)}
        >
            <GemArtwork gemId={type.id} theme={theme} variant={variant} />
            {count !== undefined && (
                <span
                    className={`absolute -bottom-1 -right-1 z-10 rounded-full px-1.5 text-[10px] font-black border shadow-md
                ${
                    theme === 'dark'
                        ? 'bg-slate-900 text-white border-slate-600'
                        : 'bg-white text-stone-800 border-stone-200'
                }
            ${countClassName}`}
                    style={countStyle}
                >
                    {count}
                </span>
            )}
        </div>
    );
};
