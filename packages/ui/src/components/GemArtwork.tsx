import type { CSSProperties } from 'react';
import { cn } from '../utils';
import type { GemColor, GemTypeObject } from '@gemduel/shared/types';
import { GemContrastOverlay } from './gemContrast/GemContrastOverlay';
import { GEM_ARTWORK_ASSETS } from './gemArtworkAssets';

export type GemArtworkVariant = 'icon' | 'board' | 'card-cost' | 'card-bonus' | 'choice';

interface GemArtworkLayout {
    inset: string;
    translateXPercent: number;
    translateYPercent: number;
}

const VARIANT_STYLE: Record<
    GemArtworkVariant,
    {
        layout: GemArtworkLayout;
        shadow: Record<'light' | 'dark', string>;
    }
> = {
    icon: {
        layout: {
            inset: '6%',
            translateXPercent: 0,
            translateYPercent: 0,
        },
        shadow: {
            light: 'drop-shadow(0 5px 10px rgba(15,23,42,0.16))',
            dark: 'drop-shadow(0 6px 12px rgba(0,0,0,0.42))',
        },
    },
    board: {
        layout: {
            inset: '2%',
            translateXPercent: 0,
            translateYPercent: 0,
        },
        shadow: {
            light: 'drop-shadow(0 8px 12px rgba(15,23,42,0.18))',
            dark: 'drop-shadow(0 10px 16px rgba(0,0,0,0.45))',
        },
    },
    'card-cost': {
        layout: {
            inset: '7%',
            translateXPercent: -3.5,
            translateYPercent: -3.5,
        },
        shadow: {
            light: 'drop-shadow(0 1px 2px rgba(15,23,42,0.16))',
            dark: 'drop-shadow(0 1px 2px rgba(0,0,0,0.35))',
        },
    },
    'card-bonus': {
        layout: {
            inset: '6%',
            translateXPercent: -1.5,
            translateYPercent: -1.5,
        },
        shadow: {
            light: 'drop-shadow(0 4px 10px rgba(15,23,42,0.15))',
            dark: 'drop-shadow(0 5px 12px rgba(0,0,0,0.40))',
        },
    },
    choice: {
        layout: {
            inset: '6%',
            translateXPercent: 0,
            translateYPercent: 0,
        },
        shadow: {
            light: 'drop-shadow(0 6px 10px rgba(15,23,42,0.18))',
            dark: 'drop-shadow(0 7px 12px rgba(0,0,0,0.44))',
        },
    },
};

const GEM_ARTWORK_LAYOUT_OVERRIDES: Partial<
    Record<GemColor, Partial<Record<GemArtworkVariant, Partial<GemArtworkLayout>>>>
> = {
    gold: {
        icon: {
            inset: '19% 7%',
            translateYPercent: -6,
        },
        board: {
            inset: '16% 3%',
            translateYPercent: -11,
        },
        'card-bonus': {
            inset: '20% 6%',
            translateYPercent: -5,
        },
    },
};

interface GemArtworkProps {
    gemId: GemTypeObject['id'];
    theme?: 'light' | 'dark';
    variant?: GemArtworkVariant;
    className?: string;
    imageClassName?: string;
    decorative?: boolean;
}

const buildBackdropStyle = (
    gemId: GemColor,
    theme: 'light' | 'dark',
    variant: GemArtworkVariant
): CSSProperties | undefined => {
    if (variant === 'board') {
        return undefined;
    }

    if (variant !== 'choice') {
        if (theme === 'light' && gemId === 'white') {
            return {
                background:
                    'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.90) 0%, rgba(255,255,255,0.55) 58%, rgba(148,163,184,0.22) 100%)',
                borderRadius: '9999px',
            };
        }

        return undefined;
    }

    if (theme === 'light' && gemId === 'white') {
        return {
            background:
                'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.92) 0%, rgba(248,250,252,0.65) 60%, rgba(148,163,184,0.22) 100%)',
            borderRadius: '9999px',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.82)',
        };
    }

    if (theme === 'dark' && gemId === 'black') {
        return {
            background:
                'radial-gradient(circle at 34% 30%, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.05) 42%, rgba(255,255,255,0.00) 72%)',
            borderRadius: '9999px',
        };
    }

    return {
        background:
            theme === 'light'
                ? 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.10) 58%, rgba(15,23,42,0.06) 100%)'
                : 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 56%, rgba(255,255,255,0.00) 100%)',
        borderRadius: '9999px',
    };
};

const getGemArtworkLayout = (gemId: GemColor, variant: GemArtworkVariant): GemArtworkLayout => {
    const baseLayout = VARIANT_STYLE[variant].layout;
    const override = GEM_ARTWORK_LAYOUT_OVERRIDES[gemId]?.[variant];

    return {
        inset: override?.inset ?? baseLayout.inset,
        translateXPercent: override?.translateXPercent ?? baseLayout.translateXPercent,
        translateYPercent: override?.translateYPercent ?? baseLayout.translateYPercent,
    };
};

export function GemArtwork({
    gemId,
    theme = 'dark',
    variant = 'icon',
    className,
    imageClassName,
    decorative = true,
}: GemArtworkProps) {
    if (gemId === 'empty') {
        return null;
    }

    const asset = GEM_ARTWORK_ASSETS[gemId];
    const hasEnhancedContrast = theme === 'dark' && gemId === 'black';
    const backdropStyle = buildBackdropStyle(gemId, theme, variant);
    const variantStyle = VARIANT_STYLE[variant];
    const artworkLayout = getGemArtworkLayout(gemId, variant);

    return (
        <div
            data-gem-artwork="true"
            data-gem-id={gemId}
            data-gem-variant={variant}
            data-gem-asset={asset.path}
            data-gem-contrast={hasEnhancedContrast ? 'enhanced' : 'default'}
            className={cn('relative isolate block h-full w-full pointer-events-none', className)}
        >
            {backdropStyle && (
                <div aria-hidden="true" className="absolute inset-[12%]" style={backdropStyle} />
            )}
            <img
                src={asset.path}
                alt={decorative ? '' : asset.alt}
                draggable={false}
                aria-hidden={decorative ? 'true' : undefined}
                className={cn('absolute select-none object-contain', imageClassName)}
                style={{
                    inset: artworkLayout.inset,
                    filter: variantStyle.shadow[theme],
                    transform:
                        artworkLayout.translateXPercent !== 0 ||
                        artworkLayout.translateYPercent !== 0
                            ? `translate(${artworkLayout.translateXPercent}%, ${artworkLayout.translateYPercent}%)`
                            : undefined,
                }}
            />
            {hasEnhancedContrast && <GemContrastOverlay insetClassName="inset-[13%]" />}
            {theme === 'light' && gemId === 'white' && (
                <div
                    aria-hidden="true"
                    className="absolute inset-[10%] rounded-full border border-slate-300/60"
                />
            )}
        </div>
    );
}
