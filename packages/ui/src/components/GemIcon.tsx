import React from 'react';
import { GemTypeObject } from '@gemduel/shared/types';

interface GemIconProps {
    type: GemTypeObject;
    size?: string;
    className?: string;
    count?: number;
    theme?: 'light' | 'dark';
    countClassName?: string;
    countStyle?: React.CSSProperties;
}

export const GemIcon: React.FC<GemIconProps> = ({
    type,
    size = 'w-6 h-6',
    className = '',
    count,
    theme = 'dark',
    countClassName = '',
    countStyle,
}) => (
    <div
        className={`relative ${size} rounded-full bg-gradient-to-br ${type.color} border ${type.border} ${
            theme === 'dark' ? 'shadow-sm' : 'shadow-[0_4px_12px_rgba(0,0,0,0.05)]'
        } ${className}`}
        title={type.label}
    >
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
