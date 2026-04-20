import type { CSSProperties, ReactNode } from 'react';
import type { ResponsiveLayout } from '../../types';

const joinClassNames = (...values: Array<string | undefined>) => values.filter(Boolean).join(' ');

interface DesktopStageProps {
    layout: ResponsiveLayout;
    children: ReactNode;
    viewportClassName?: string;
    viewportStyle?: CSSProperties;
    stageClassName?: string;
    stageStyle?: CSSProperties;
}

export function DesktopStage({
    layout,
    children,
    viewportClassName,
    viewportStyle,
    stageClassName,
    stageStyle,
}: DesktopStageProps) {
    return (
        <div
            data-testid="desktop-stage-viewport"
            className={joinClassNames(
                'relative h-screen w-screen overflow-hidden',
                viewportClassName
            )}
            style={viewportStyle}
        >
            <div
                data-testid="desktop-stage-canvas"
                className={joinClassNames('absolute left-0 top-0 overflow-hidden', stageClassName)}
                style={{
                    width: `${layout.stageCanvasWidthPx}px`,
                    height: `${layout.stageCanvasHeightPx}px`,
                    left: `${layout.stageInsetXPx}px`,
                    top: `${layout.stageInsetYPx}px`,
                    transform: `scale(${layout.stageScale})`,
                    transformOrigin: 'top left',
                    willChange: 'transform',
                    ...stageStyle,
                }}
            >
                {children}
            </div>
        </div>
    );
}
