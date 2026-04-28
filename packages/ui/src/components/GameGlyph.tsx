import type React from 'react';

export type GameGlyphVariant =
    | 'load'
    | 'monitor'
    | 'replay-back'
    | 'replay-forward'
    | 'restart'
    | 'rulebook'
    | 'save'
    | 'settings';

interface GameGlyphProps {
    variant: GameGlyphVariant;
    size?: number;
    className?: string;
    style?: React.CSSProperties;
}

const absolute = (style: React.CSSProperties): React.CSSProperties => ({
    position: 'absolute',
    boxSizing: 'border-box',
    ...style,
});

const arrowHead = (
    size: number,
    direction: 'down' | 'left' | 'right' | 'up',
    style: React.CSSProperties = {}
) => {
    const triangleSize = size * 0.19;
    const base: React.CSSProperties = {
        width: 0,
        height: 0,
        position: 'absolute',
        ...style,
    };

    if (direction === 'up') {
        return (
            <span
                style={{
                    ...base,
                    borderLeft: `${triangleSize}px solid transparent`,
                    borderRight: `${triangleSize}px solid transparent`,
                    borderBottom: `${triangleSize * 1.25}px solid currentColor`,
                }}
            />
        );
    }

    if (direction === 'down') {
        return (
            <span
                style={{
                    ...base,
                    borderLeft: `${triangleSize}px solid transparent`,
                    borderRight: `${triangleSize}px solid transparent`,
                    borderTop: `${triangleSize * 1.25}px solid currentColor`,
                }}
            />
        );
    }

    if (direction === 'left') {
        return (
            <span
                style={{
                    ...base,
                    borderTop: `${triangleSize}px solid transparent`,
                    borderBottom: `${triangleSize}px solid transparent`,
                    borderRight: `${triangleSize * 1.25}px solid currentColor`,
                }}
            />
        );
    }

    return (
        <span
            style={{
                ...base,
                borderTop: `${triangleSize}px solid transparent`,
                borderBottom: `${triangleSize}px solid transparent`,
                borderLeft: `${triangleSize * 1.25}px solid currentColor`,
            }}
        />
    );
};

const renderRulebook = (size: number, stroke: number) => (
    <>
        <span
            style={absolute({
                left: size * 0.12,
                top: size * 0.14,
                width: size * 0.36,
                height: size * 0.68,
                border: `${stroke}px solid currentColor`,
                borderRightWidth: stroke * 0.5,
                borderRadius: `${size * 0.05}px ${size * 0.02}px ${size * 0.02}px ${size * 0.05}px`,
                transform: 'skewY(-5deg)',
            })}
        />
        <span
            style={absolute({
                right: size * 0.12,
                top: size * 0.14,
                width: size * 0.36,
                height: size * 0.68,
                border: `${stroke}px solid currentColor`,
                borderLeftWidth: stroke * 0.5,
                borderRadius: `${size * 0.02}px ${size * 0.05}px ${size * 0.05}px ${size * 0.02}px`,
                transform: 'skewY(5deg)',
            })}
        />
        <span
            style={absolute({
                left: size * 0.48,
                top: size * 0.16,
                width: stroke,
                height: size * 0.64,
                background: 'currentColor',
                opacity: 0.75,
            })}
        />
    </>
);

const renderRestart = (size: number, stroke: number) => (
    <>
        <span
            style={absolute({
                left: size * 0.18,
                top: size * 0.18,
                width: size * 0.64,
                height: size * 0.64,
                border: `${stroke}px solid currentColor`,
                borderLeftColor: 'transparent',
                borderRadius: '9999px',
                transform: 'rotate(-28deg)',
            })}
        />
        {arrowHead(size, 'left', { left: size * 0.07, top: size * 0.21 })}
    </>
);

const renderSettings = (size: number, stroke: number) => (
    <>
        {[0, 45, 90, 135].map((rotation) => (
            <span
                key={rotation}
                style={absolute({
                    left: size * 0.46,
                    top: size * 0.08,
                    width: stroke,
                    height: size * 0.84,
                    borderRadius: '9999px',
                    background: 'currentColor',
                    opacity: 0.82,
                    transform: `rotate(${rotation}deg)`,
                    transformOrigin: '50% 50%',
                })}
            />
        ))}
        <span
            style={absolute({
                left: size * 0.22,
                top: size * 0.22,
                width: size * 0.56,
                height: size * 0.56,
                border: `${stroke * 1.25}px solid currentColor`,
                borderRadius: '9999px',
                background: 'var(--gd-shell-bg, rgba(15, 23, 42, 0.92))',
            })}
        />
        <span
            style={absolute({
                left: size * 0.4,
                top: size * 0.4,
                width: size * 0.2,
                height: size * 0.2,
                borderRadius: '9999px',
                background: 'currentColor',
            })}
        />
    </>
);

const renderFileTransfer = (size: number, stroke: number, direction: 'down' | 'up') => (
    <>
        <span
            style={absolute({
                left: size * 0.16,
                bottom: size * 0.14,
                width: size * 0.68,
                height: size * 0.3,
                border: `${stroke}px solid currentColor`,
                borderTopWidth: 0,
                borderRadius: `${size * 0.04}px`,
            })}
        />
        <span
            style={absolute({
                left: size * 0.48,
                top: direction === 'down' ? size * 0.12 : size * 0.32,
                width: stroke,
                height: size * 0.38,
                borderRadius: '9999px',
                background: 'currentColor',
            })}
        />
        {arrowHead(size, direction, {
            left: size * 0.31,
            top: direction === 'down' ? size * 0.42 : size * 0.09,
        })}
    </>
);

const renderMonitor = (size: number, stroke: number) => (
    <>
        <span
            style={absolute({
                left: size * 0.12,
                top: size * 0.18,
                width: size * 0.76,
                height: size * 0.52,
                border: `${stroke}px solid currentColor`,
                borderRadius: `${size * 0.06}px`,
            })}
        />
        <span
            style={absolute({
                left: size * 0.46,
                top: size * 0.7,
                width: stroke * 1.3,
                height: size * 0.12,
                background: 'currentColor',
            })}
        />
        <span
            style={absolute({
                left: size * 0.28,
                top: size * 0.82,
                width: size * 0.44,
                height: stroke,
                borderRadius: '9999px',
                background: 'currentColor',
            })}
        />
    </>
);

const renderReplay = (size: number, stroke: number, direction: 'left' | 'right') => {
    const arrowStyle =
        direction === 'left'
            ? { left: size * 0.13, top: size * 0.27 }
            : { right: size * 0.13, top: size * 0.27 };
    const barSide = direction === 'left' ? { left: size * 0.72 } : { right: size * 0.72 };

    return (
        <>
            <span
                style={absolute({
                    ...barSide,
                    top: size * 0.18,
                    width: stroke,
                    height: size * 0.64,
                    borderRadius: '9999px',
                    background: 'currentColor',
                })}
            />
            {arrowHead(size, direction, arrowStyle)}
            <span
                style={absolute({
                    left: direction === 'left' ? size * 0.38 : size * 0.28,
                    top: size * 0.27,
                    width: stroke,
                    height: size * 0.46,
                    borderRadius: '9999px',
                    background: 'currentColor',
                    transform: `rotate(${direction === 'left' ? '35deg' : '-35deg'})`,
                })}
            />
            <span
                style={absolute({
                    left: direction === 'left' ? size * 0.38 : size * 0.28,
                    top: size * 0.27,
                    width: stroke,
                    height: size * 0.46,
                    borderRadius: '9999px',
                    background: 'currentColor',
                    transform: `rotate(${direction === 'left' ? '-35deg' : '35deg'})`,
                })}
            />
        </>
    );
};

const renderGlyph = (variant: GameGlyphVariant, size: number, stroke: number) => {
    switch (variant) {
        case 'load':
            return renderFileTransfer(size, stroke, 'up');
        case 'monitor':
            return renderMonitor(size, stroke);
        case 'replay-back':
            return renderReplay(size, stroke, 'left');
        case 'replay-forward':
            return renderReplay(size, stroke, 'right');
        case 'restart':
            return renderRestart(size, stroke);
        case 'rulebook':
            return renderRulebook(size, stroke);
        case 'save':
            return renderFileTransfer(size, stroke, 'down');
        case 'settings':
            return renderSettings(size, stroke);
    }
};

export function GameGlyph({ variant, size = 24, className, style }: GameGlyphProps) {
    const stroke = Math.max(2, Math.round(size * 0.08));

    return (
        <span
            aria-hidden="true"
            data-game-glyph={variant}
            className={`relative inline-block shrink-0 ${className ?? ''}`}
            style={{ width: size, height: size, ...style }}
        >
            {renderGlyph(variant, size, stroke)}
        </span>
    );
}
