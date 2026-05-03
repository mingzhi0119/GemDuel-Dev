import type { CSSProperties } from 'react';
import { cn } from '../../utils';

interface JokerBonusBadgeProps {
    className?: string;
    theme?: 'light' | 'dark';
}

const JOKER_CONIC_GRADIENT =
    'conic-gradient(from -90deg, #2563eb 0deg 72deg, #f8fafc 72deg 144deg, #16a34a 144deg 216deg, #0f172a 216deg 288deg, #dc2626 288deg 360deg)';

const buildSurfaceStyle = (theme: 'light' | 'dark'): CSSProperties => ({
    background: JOKER_CONIC_GRADIENT,
    boxShadow:
        theme === 'dark'
            ? '0 4px 10px rgba(0,0,0,0.34), inset 0 1px 0 rgba(255,255,255,0.18)'
            : '0 4px 10px rgba(15,23,42,0.14), inset 0 1px 0 rgba(255,255,255,0.72)',
});

export function JokerBonusBadge({ className, theme = 'dark' }: JokerBonusBadgeProps) {
    return (
        <div
            data-joker-badge="true"
            aria-hidden="true"
            className={cn('relative isolate h-full w-full rounded-full', className)}
            style={buildSurfaceStyle(theme)}
        >
            <div
                data-joker-badge-layer="sheen"
                className="absolute inset-[21%] rounded-full"
                style={{
                    background:
                        theme === 'dark'
                            ? 'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.08) 32%, rgba(255,255,255,0.00) 60%), radial-gradient(circle at 50% 55%, rgba(15,23,42,0.28) 0%, rgba(15,23,42,0.14) 55%, rgba(15,23,42,0.00) 100%)'
                            : 'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.52) 0%, rgba(255,255,255,0.16) 34%, rgba(255,255,255,0.00) 62%), radial-gradient(circle at 50% 55%, rgba(148,163,184,0.18) 0%, rgba(148,163,184,0.08) 52%, rgba(148,163,184,0.00) 100%)',
                    boxShadow:
                        theme === 'dark'
                            ? 'inset 0 1px 0 rgba(255,255,255,0.16)'
                            : 'inset 0 1px 0 rgba(255,255,255,0.68)',
                }}
            />
            <div
                data-joker-badge-layer="core"
                className="absolute inset-[37%] rounded-full"
                style={{
                    background:
                        theme === 'dark'
                            ? 'radial-gradient(circle at 35% 35%, rgba(255,255,255,0.82) 0%, rgba(255,255,255,0.24) 34%, rgba(255,255,255,0.00) 74%), rgba(15,23,42,0.76)'
                            : 'radial-gradient(circle at 35% 35%, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.32) 36%, rgba(255,255,255,0.00) 76%), rgba(241,245,249,0.82)',
                }}
            />
        </div>
    );
}
