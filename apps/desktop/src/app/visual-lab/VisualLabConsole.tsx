import { useCallback, useEffect, useRef, useState, type MouseEvent } from 'react';
import { createPortal } from 'react-dom';
import { FEATURED_CARD_SIZE } from '@gemduel/ui/components/Card';
import type { PresentationEvent } from '../presentation/presentationTypes';
import type {
    SurfaceLabAssetSet,
    SurfaceLabCandidate,
    SurfaceLabSlot,
    VisualLabMode,
} from './surfaceLabTypes';
import { SurfaceLabControls } from './SurfaceLabControls';
import { MotionLabControls } from './MotionLabControls';
import { getMotionLabel } from './motionLabLabels';
import type { SurfaceLabMotionEventType, SurfaceLabMotionOptions } from './motionLabEvents';
import type { VisualLabShellStyles } from './visualLabStyles';
import {
    SURFACE_LAB_STYLE_RATINGS,
    type SurfaceLabRatingFilter,
    type SurfaceLabStyleRating,
    type SurfaceLabStyleRatings,
} from './useSurfaceLabRatings';

const CONSOLE_WIDTH = 390;
const CONSOLE_MARGIN = 12;
const CONSOLE_DEFAULT_TOP = 96;
const CONSOLE_MIN_VISIBLE_HEIGHT = 180;

type ConsolePosition = {
    left: number;
    top: number;
};

type ConsoleDragState = {
    startClientX: number;
    startClientY: number;
    startLeft: number;
    startTop: number;
    maxLeft: number;
    maxTop: number;
};

interface VisualLabConsoleProps {
    mode: VisualLabMode;
    catalogStatus: string;
    catalogError?: string;
    assetSets: readonly SurfaceLabAssetSet[];
    visibleAssetSets: readonly SurfaceLabAssetSet[];
    selectedSet: SurfaceLabAssetSet;
    selectedSetId: string;
    setSelectedSetId: (id: string) => void;
    ratingFilter: SurfaceLabRatingFilter;
    setRatingFilter: (filter: SurfaceLabRatingFilter) => void;
    styleRatings: SurfaceLabStyleRatings;
    styleRating: SurfaceLabStyleRating | null;
    setStyleRating: (rating: SurfaceLabStyleRating) => void;
    slotOverrides: Partial<Record<SurfaceLabSlot, string>>;
    setSlotOverrides: (next: Partial<Record<SurfaceLabSlot, string>>) => void;
    assetSlots: Record<SurfaceLabSlot, SurfaceLabCandidate>;
    styles: VisualLabShellStyles;
    activeEvent: PresentationEvent | null;
    motionType: SurfaceLabMotionEventType;
    setMotionType: (type: SurfaceLabMotionEventType) => void;
    motionOptions: SurfaceLabMotionOptions;
    setMotionOptions: (options: SurfaceLabMotionOptions) => void;
    holdRoyalIntro: boolean;
    setHoldRoyalIntro: (value: boolean) => void;
    onTriggerMotion: () => void;
    onRepeatMotion: () => void;
    onClearMotion: () => void;
}

export function VisualLabConsole({
    mode,
    catalogStatus,
    catalogError,
    assetSets,
    visibleAssetSets,
    selectedSet,
    selectedSetId,
    setSelectedSetId,
    ratingFilter,
    setRatingFilter,
    styleRatings,
    styleRating,
    setStyleRating,
    slotOverrides,
    setSlotOverrides,
    assetSlots,
    styles,
    activeEvent,
    motionType,
    setMotionType,
    motionOptions,
    setMotionOptions,
    holdRoyalIntro,
    setHoldRoyalIntro,
    onTriggerMotion,
    onRepeatMotion,
    onClearMotion,
}: VisualLabConsoleProps) {
    const consoleRef = useRef<HTMLElement | null>(null);
    const dragStateRef = useRef<ConsoleDragState | null>(null);
    const [position, setPosition] = useState<ConsolePosition | null>(null);
    const maxHeight =
        position === null
            ? `calc(100vh - ${CONSOLE_DEFAULT_TOP + CONSOLE_MARGIN}px)`
            : `calc(100vh - ${Math.max(CONSOLE_MARGIN * 2, position.top + CONSOLE_MARGIN)}px)`;

    const beginDrag = useCallback((event: MouseEvent<HTMLButtonElement>) => {
        const element = consoleRef.current;

        if (!element) {
            return;
        }

        const rect = element.getBoundingClientRect();
        const panelHeight = Math.min(rect.height, window.innerHeight - CONSOLE_MARGIN * 2);

        dragStateRef.current = {
            startClientX: event.clientX,
            startClientY: event.clientY,
            startLeft: rect.left,
            startTop: rect.top,
            maxLeft: Math.max(CONSOLE_MARGIN, window.innerWidth - rect.width - CONSOLE_MARGIN),
            maxTop: Math.max(
                CONSOLE_MARGIN,
                window.innerHeight -
                    Math.max(CONSOLE_MIN_VISIBLE_HEIGHT, panelHeight) -
                    CONSOLE_MARGIN
            ),
        };
        event.preventDefault();
    }, []);

    useEffect(() => {
        const update = (clientX: number, clientY: number) => {
            const dragState = dragStateRef.current;

            if (!dragState) {
                return;
            }

            setPosition({
                left: Math.min(
                    dragState.maxLeft,
                    Math.max(CONSOLE_MARGIN, dragState.startLeft + clientX - dragState.startClientX)
                ),
                top: Math.min(
                    dragState.maxTop,
                    Math.max(CONSOLE_MARGIN, dragState.startTop + clientY - dragState.startClientY)
                ),
            });
        };
        const handleMouseMove = (event: globalThis.MouseEvent) => {
            if (!dragStateRef.current) {
                return;
            }

            update(event.clientX, event.clientY);
            event.preventDefault();
        };
        const handleMouseUp = () => {
            dragStateRef.current = null;
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    if (typeof document === 'undefined') {
        return null;
    }

    return createPortal(
        <aside
            ref={consoleRef}
            className="fixed z-[999] flex flex-col gap-3 overflow-hidden rounded-lg border border-slate-700 bg-slate-950/92 p-3 shadow-[0_24px_70px_rgba(0,0,0,0.46)] backdrop-blur-xl"
            style={{
                width: `min(${CONSOLE_WIDTH}px, calc(100vw - ${CONSOLE_MARGIN * 2}px))`,
                height: maxHeight,
                top: position?.top ?? CONSOLE_DEFAULT_TOP,
                left: position?.left,
                right: position === null ? CONSOLE_MARGIN : undefined,
            }}
        >
            <button
                type="button"
                aria-label="Drag visual lab console"
                className="-m-1 mb-0 flex cursor-move select-none items-center justify-between rounded-md border border-slate-700/80 bg-slate-900/80 px-2 py-1.5 text-left text-[11px] font-black uppercase tracking-[0.16em] text-slate-300 hover:border-cyan-300 hover:text-cyan-100"
                style={{ touchAction: 'none' }}
                onMouseDown={beginDrag}
            >
                <span>Visual Lab Console</span>
                <span className="font-mono text-[10px] text-slate-500">drag</span>
            </button>

            <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto pr-1">
                <SurfaceLabControls
                    mode={mode}
                    catalogStatus={catalogStatus}
                    catalogError={catalogError}
                    assetSets={assetSets}
                    visibleAssetSets={visibleAssetSets}
                    selectedSet={selectedSet}
                    selectedSetId={selectedSetId}
                    setSelectedSetId={setSelectedSetId}
                    ratingFilter={ratingFilter}
                    setRatingFilter={setRatingFilter}
                    styleRatings={styleRatings}
                    slotOverrides={slotOverrides}
                    setSlotOverrides={setSlotOverrides}
                    assetSlots={assetSlots}
                />

                <div className="rounded-lg border border-slate-700 bg-slate-950/70 p-2">
                    <div className="mb-2 text-[11px] font-black uppercase tracking-[0.14em] text-slate-300">
                        Royal back display box
                    </div>
                    <img
                        src={styles.royalCardBackArtwork.path}
                        alt=""
                        draggable={false}
                        className="rounded-md object-cover"
                        style={FEATURED_CARD_SIZE}
                    />
                </div>

                <div className="rounded-lg border border-slate-700 bg-slate-950/70 p-2">
                    <div className="mb-2 flex items-center justify-between gap-2 text-[11px] font-black uppercase tracking-[0.14em] text-slate-300">
                        <span>Style rating</span>
                        <span className="font-mono text-cyan-100">
                            {styleRating === null ? 'Unrated' : styleRating}
                        </span>
                    </div>
                    <div className="grid grid-cols-4 gap-1.5">
                        {SURFACE_LAB_STYLE_RATINGS.map((rating) => {
                            const isSelected = styleRating === rating;

                            return (
                                <button
                                    key={rating}
                                    type="button"
                                    aria-label={`Rate current style ${rating}`}
                                    aria-pressed={isSelected}
                                    className={`min-h-8 rounded-md border px-2 text-[12px] font-black transition-colors ${
                                        isSelected
                                            ? 'border-cyan-200 bg-cyan-300 text-slate-950 shadow-[0_0_18px_rgba(103,232,249,0.28)]'
                                            : 'border-slate-600 bg-slate-950 text-slate-200 hover:border-cyan-300 hover:text-cyan-100'
                                    }`}
                                    onClick={() => setStyleRating(rating)}
                                >
                                    {rating}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {mode === 'motion' && (
                    <MotionLabControls
                        activeEvent={activeEvent}
                        motionType={motionType}
                        setMotionType={setMotionType}
                        motionOptions={motionOptions}
                        setMotionOptions={setMotionOptions}
                        holdRoyalIntro={holdRoyalIntro}
                        setHoldRoyalIntro={setHoldRoyalIntro}
                        onTrigger={onTriggerMotion}
                        onRepeat={onRepeatMotion}
                        onClear={onClearMotion}
                    />
                )}

                {mode === 'motion' && (
                    <div className="text-[11px] leading-5 text-slate-500">
                        Current trigger: {getMotionLabel(motionType)}
                    </div>
                )}
            </div>
        </aside>,
        document.body
    );
}
