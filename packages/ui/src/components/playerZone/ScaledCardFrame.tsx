import { STANDARD_CARD_SIZE } from '../Card';
import type { PlayerZoneScaledCardFrameProps } from './types';

export function ScaledCardFrame({
    scale,
    baseSize = STANDARD_CARD_SIZE,
    children,
}: PlayerZoneScaledCardFrameProps) {
    const safeScale = Number.isFinite(scale) ? scale : 1;
    const scaledWidth = baseSize.width * safeScale;
    const scaledHeight = baseSize.height * safeScale;

    return (
        <div
            className="relative shrink-0"
            style={{
                width: `${scaledWidth}px`,
                height: `${scaledHeight}px`,
            }}
        >
            <div
                style={{
                    width: `${baseSize.width}px`,
                    height: `${baseSize.height}px`,
                    transform: `scale(${safeScale})`,
                    transformOrigin: 'top left',
                }}
            >
                {children}
            </div>
        </div>
    );
}
