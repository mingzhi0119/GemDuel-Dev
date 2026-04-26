import { useEffect, useMemo } from 'react';
import { Crown } from 'lucide-react';
import { motion } from 'framer-motion';
import type { PlayerKey } from '@gemduel/shared/types';
import { type AnchorRect, useAnchorRect } from './useAnchorRect';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

export type RoyalUnlockMilestone = 3 | 6 | 'royal-envoy' | 'forced';

interface RoyalUnlockIntroProps {
    player: PlayerKey;
    milestone: RoyalUnlockMilestone;
    theme: 'light' | 'dark';
    middleZoneSelector: string;
    onComplete: () => void;
}

const INTRO_DURATION_MS = 1250;
const REDUCED_MOTION_DURATION_MS = 140;
const FRAME_PADDING_X_PX = 34;
const FRAME_PADDING_Y_PX = 28;
const FRAME_VIEWPORT_INSET_PX = 20;
const FRAME_RADIUS_PX = 34;

const createAnchorRect = (
    left: number,
    top: number,
    width: number,
    height: number
): AnchorRect => ({
    x: left,
    y: top,
    left,
    top,
    right: left + width,
    bottom: top + height,
    width,
    height,
});

const getViewportSize = () => {
    if (typeof window === 'undefined') {
        return { width: 1920, height: 1080 };
    }

    return {
        width: window.innerWidth || 1920,
        height: window.innerHeight || 1080,
    };
};

const getFallbackMiddleZoneRect = () => {
    const { width, height } = getViewportSize();
    const frameWidth = Math.min(520, Math.max(320, width * 0.34));
    const frameHeight = Math.min(480, Math.max(300, height * 0.46));

    return createAnchorRect(
        (width - frameWidth) / 2,
        Math.max(120, (height - frameHeight) / 2),
        frameWidth,
        frameHeight
    );
};

const formatCoordinate = (value: number) => Number(value.toFixed(2));

const buildRoundedRectPath = (x: number, y: number, width: number, height: number) => {
    const radius = Math.min(FRAME_RADIUS_PX, width / 2, height / 2);
    const right = x + width;
    const bottom = y + height;

    return [
        `M ${formatCoordinate(x + radius)} ${formatCoordinate(y)}`,
        `L ${formatCoordinate(right - radius)} ${formatCoordinate(y)}`,
        `Q ${formatCoordinate(right)} ${formatCoordinate(y)} ${formatCoordinate(right)} ${formatCoordinate(y + radius)}`,
        `L ${formatCoordinate(right)} ${formatCoordinate(bottom - radius)}`,
        `Q ${formatCoordinate(right)} ${formatCoordinate(bottom)} ${formatCoordinate(right - radius)} ${formatCoordinate(bottom)}`,
        `L ${formatCoordinate(x + radius)} ${formatCoordinate(bottom)}`,
        `Q ${formatCoordinate(x)} ${formatCoordinate(bottom)} ${formatCoordinate(x)} ${formatCoordinate(bottom - radius)}`,
        `L ${formatCoordinate(x)} ${formatCoordinate(y + radius)}`,
        `Q ${formatCoordinate(x)} ${formatCoordinate(y)} ${formatCoordinate(x + radius)} ${formatCoordinate(y)}`,
        'Z',
    ].join(' ');
};

const getFrameGeometry = (middleZoneRect: AnchorRect) => {
    const { width: viewportWidth, height: viewportHeight } = getViewportSize();
    const left = Math.max(FRAME_VIEWPORT_INSET_PX, middleZoneRect.left - FRAME_PADDING_X_PX);
    const top = Math.max(FRAME_VIEWPORT_INSET_PX, middleZoneRect.top - FRAME_PADDING_Y_PX);
    const right = Math.min(
        viewportWidth - FRAME_VIEWPORT_INSET_PX,
        middleZoneRect.right + FRAME_PADDING_X_PX
    );
    const bottom = Math.min(
        viewportHeight - FRAME_VIEWPORT_INSET_PX,
        middleZoneRect.bottom + FRAME_PADDING_Y_PX
    );
    const width = Math.max(1, right - left);
    const height = Math.max(1, bottom - top);

    return {
        crownX: formatCoordinate(left + width / 2),
        crownY: formatCoordinate(top + height / 2),
        framePath: buildRoundedRectPath(left, top, width, height),
    };
};

export function RoyalUnlockIntro({
    player,
    milestone,
    theme,
    middleZoneSelector,
    onComplete,
}: RoyalUnlockIntroProps) {
    const { rect: middleZoneRect } = useAnchorRect(middleZoneSelector);
    const prefersReducedMotion = usePrefersReducedMotion();
    const frame = useMemo(
        () => getFrameGeometry(middleZoneRect ?? getFallbackMiddleZoneRect()),
        [middleZoneRect]
    );
    const crownLabel =
        milestone === 'royal-envoy'
            ? 'Royal envoy'
            : milestone === 'forced'
              ? 'Royal selection'
              : `${milestone} crowns`;

    useEffect(() => {
        const timer = window.setTimeout(
            onComplete,
            prefersReducedMotion ? REDUCED_MOTION_DURATION_MS : INTRO_DURATION_MS
        );

        return () => window.clearTimeout(timer);
    }, [onComplete, prefersReducedMotion]);

    return (
        <div
            data-royal-unlock-intro={player}
            data-royal-unlock-milestone={String(milestone)}
            className="fixed inset-0 z-[120] pointer-events-none"
            aria-hidden="true"
        >
            <style>
                {`
                    @keyframes gemduel-royal-line-draw {
                        from { stroke-dashoffset: 1; }
                        to { stroke-dashoffset: 0; }
                    }
                    @keyframes gemduel-royal-line-flare {
                        0%, 100% { opacity: 0.22; }
                        55% { opacity: 0.72; }
                    }
                `}
            </style>
            <div
                className={`absolute inset-0 transition-colors ${
                    theme === 'dark' ? 'bg-black/30' : 'bg-stone-950/20'
                }`}
            />
            <svg className="absolute inset-0 h-screen w-screen overflow-visible">
                <path
                    data-royal-unlock-frame-glow="true"
                    d={frame.framePath}
                    fill="none"
                    stroke="rgba(253, 224, 71, 0.2)"
                    strokeWidth="18"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    pathLength="1"
                    strokeDasharray="1"
                    strokeDashoffset={prefersReducedMotion ? '0' : '1'}
                    style={{
                        animation: prefersReducedMotion
                            ? undefined
                            : 'gemduel-royal-line-flare 1.1s ease-out forwards, gemduel-royal-line-draw 0.98s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
                    }}
                />
                <path
                    data-royal-unlock-frame="true"
                    d={frame.framePath}
                    fill="none"
                    stroke="#facc15"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    pathLength="1"
                    strokeDasharray="1"
                    strokeDashoffset={prefersReducedMotion ? '0' : '1'}
                    style={{
                        filter: 'drop-shadow(0 0 12px rgba(250, 204, 21, 0.7))',
                        animation: prefersReducedMotion
                            ? undefined
                            : 'gemduel-royal-line-draw 0.98s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
                    }}
                />
            </svg>
            <div
                className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-4"
                style={{ left: frame.crownX, top: frame.crownY }}
            >
                <div className="flex items-center gap-5">
                    {[0, 1, 2].map((index) => (
                        <motion.div
                            key={index}
                            data-royal-unlock-crown="true"
                            initial={
                                prefersReducedMotion
                                    ? { opacity: 1, scale: 1 }
                                    : { opacity: 0, y: 16, scale: 0.65 }
                            }
                            animate={
                                prefersReducedMotion
                                    ? { opacity: 1, y: 0, scale: 1 }
                                    : { opacity: 1, y: 0, scale: [1, 1.18, 1] }
                            }
                            transition={{
                                delay: prefersReducedMotion ? 0 : 0.58 + index * 0.15,
                                duration: prefersReducedMotion ? 0 : 0.34,
                                ease: 'easeOut',
                            }}
                            className="rounded-full border border-amber-200/80 bg-black/45 p-3 shadow-[0_0_28px_rgba(250,204,21,0.45)] backdrop-blur-sm"
                        >
                            <Crown
                                size={46}
                                className="text-amber-300 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]"
                                fill="currentColor"
                            />
                        </motion.div>
                    ))}
                </div>
                <motion.div
                    initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: prefersReducedMotion ? 0 : 0.82, duration: 0.24 }}
                    className="rounded-full border border-amber-200/60 bg-black/55 px-5 py-2 text-[12px] font-black uppercase tracking-[0.24em] text-amber-100 shadow-[0_0_24px_rgba(250,204,21,0.22)]"
                >
                    {crownLabel}
                </motion.div>
            </div>
        </div>
    );
}
