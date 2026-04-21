import { STANDARD_CARD_SIZE } from '../Card';
import type { PlayerZoneScaledCardFrameProps } from './types';

export function ScaledCardFrame({ scale, children }: PlayerZoneScaledCardFrameProps) {
    const safeScale = Number.isFinite(scale) ? scale : 1;
    const scaledWidth = STANDARD_CARD_SIZE.width * safeScale;
    const scaledHeight = STANDARD_CARD_SIZE.height * safeScale;

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
                    width: `${STANDARD_CARD_SIZE.width}px`,
                    height: `${STANDARD_CARD_SIZE.height}px`,
                    transform: `scale(${safeScale})`,
                    transformOrigin: 'top left',
                }}
            >
                {children}
            </div>
        </div>
    );
}
