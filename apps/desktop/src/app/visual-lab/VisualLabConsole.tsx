import { useCallback, useEffect, useRef, useState, type MouseEvent } from 'react';
import { createPortal } from 'react-dom';
import { Eye, EyeOff } from 'lucide-react';
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
import type { SurfaceLabReviewStateStatus } from './surfaceLabReviewStateTypes';
import {
    SURFACE_LAB_STYLE_RATINGS,
    type SurfaceLabRatingFilter,
    type SurfaceLabStyleRating,
    type SurfaceLabStyleRatings,
} from './useSurfaceLabRatings';
import type { SurfaceLabRegenFilter, SurfaceLabRegenMarks } from './useSurfaceLabRegenMarks';

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
    regenFilter: SurfaceLabRegenFilter;
    setRegenFilter: (filter: SurfaceLabRegenFilter) => void;
    styleRatings: SurfaceLabStyleRatings;
    styleRating: SurfaceLabStyleRating | null;
    setStyleRating: (rating: SurfaceLabStyleRating) => void;
    styleComment?: string;
    setStyleComment?: (comment: string) => void;
    regenMarks: SurfaceLabRegenMarks;
    toggleSurfaceLabSlotRegenMark: (candidate: SurfaceLabCandidate) => void;
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
    reviewStateStatus?: SurfaceLabReviewStateStatus;
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
    regenFilter,
    setRegenFilter,
    styleRatings,
    styleRating,
    setStyleRating,
    styleComment = '',
    setStyleComment = () => undefined,
    regenMarks,
    toggleSurfaceLabSlotRegenMark,
    slotOverrides,
    setSlotOverrides,
    assetSlots,
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
    reviewStateStatus,
}: VisualLabConsoleProps) {
    const consoleRef = useRef<HTMLElement | null>(null);
    const dragStateRef = useRef<ConsoleDragState | null>(null);
    const [position, setPosition] = useState<ConsolePosition | null>(null);
    const [isHidden, setIsHidden] = useState(false);
    const [styleCommentDraft, setStyleCommentDraft] = useState(styleComment);
    const isComposingStyleCommentRef = useRef(false);
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
        if (!isComposingStyleCommentRef.current) {
            setStyleCommentDraft(styleComment);
        }
    }, [styleComment]);

    const updateStyleCommentDraft = useCallback(
        (value: string) => {
            setStyleCommentDraft(value);

            if (!isComposingStyleCommentRef.current) {
                setStyleComment(value);
            }
        },
        [setStyleComment]
    );

    const commitStyleCommentDraft = useCallback(
        (value: string) => {
            isComposingStyleCommentRef.current = false;
            setStyleCommentDraft(value);
            setStyleComment(value);
        },
        [setStyleComment]
    );

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

    if (isHidden) {
        return createPortal(
            <button
                type="button"
                data-visual-lab-console-show="true"
                aria-label="Show visual lab console"
                className="fixed z-[999] flex min-h-9 items-center gap-2 rounded-lg border border-cyan-300/70 bg-slate-950/92 px-3 py-2 text-[11px] font-black uppercase tracking-[0.12em] text-cyan-100 shadow-[0_18px_45px_rgba(0,0,0,0.4)] backdrop-blur-xl hover:bg-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
                style={{
                    top: position?.top ?? CONSOLE_DEFAULT_TOP,
                    left: position?.left,
                    right: position === null ? CONSOLE_MARGIN : undefined,
                }}
                onClick={() => setIsHidden(false)}
            >
                <Eye size={14} aria-hidden="true" />
                Show Console
            </button>,
            document.body
        );
    }

    return createPortal(
        <aside
            ref={consoleRef}
            data-visual-lab-console="true"
            className="fixed z-[999] flex flex-col gap-3 overflow-hidden rounded-lg border border-slate-700 bg-slate-950/92 p-3 shadow-[0_24px_70px_rgba(0,0,0,0.46)] backdrop-blur-xl"
            style={{
                width: `min(${CONSOLE_WIDTH}px, calc(100vw - ${CONSOLE_MARGIN * 2}px))`,
                height: maxHeight,
                top: position?.top ?? CONSOLE_DEFAULT_TOP,
                left: position?.left,
                right: position === null ? CONSOLE_MARGIN : undefined,
            }}
        >
            <div className="-m-1 mb-0 flex select-none items-center justify-between gap-2 rounded-md border border-slate-700/80 bg-slate-900/80 px-2 py-1.5 text-left text-[11px] font-black uppercase tracking-[0.16em] text-slate-300">
                <button
                    type="button"
                    aria-label="Drag visual lab console"
                    className="flex min-w-0 flex-1 cursor-move items-center justify-between gap-2 rounded-sm text-left hover:text-cyan-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
                    style={{ touchAction: 'none' }}
                    onMouseDown={beginDrag}
                >
                    <span>Visual Lab Console</span>
                    <span className="font-mono text-[10px] text-slate-500">drag</span>
                </button>
                <button
                    type="button"
                    data-visual-lab-console-hide="true"
                    aria-label="Hide visual lab console"
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded border border-slate-600 bg-slate-950 text-slate-300 hover:border-cyan-300 hover:text-cyan-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
                    onClick={() => setIsHidden(true)}
                >
                    <EyeOff size={14} aria-hidden="true" />
                </button>
            </div>

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
                    regenFilter={regenFilter}
                    setRegenFilter={setRegenFilter}
                    styleRatings={styleRatings}
                    regenMarks={regenMarks}
                    toggleSurfaceLabSlotRegenMark={toggleSurfaceLabSlotRegenMark}
                    slotOverrides={slotOverrides}
                    setSlotOverrides={setSlotOverrides}
                    assetSlots={assetSlots}
                    reviewStateStatus={reviewStateStatus}
                />

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
                    <label className="mt-2 grid gap-1.5 text-[11px] font-black uppercase tracking-[0.12em] text-slate-300">
                        <span>Style comment</span>
                        <textarea
                            aria-label="Style comment"
                            value={styleCommentDraft}
                            rows={3}
                            className="min-h-20 resize-y rounded-md border border-slate-600 bg-slate-950 px-2 py-1.5 font-sans text-[12px] normal-case leading-5 tracking-normal text-slate-100 outline-none placeholder:text-slate-600 focus:border-cyan-300"
                            placeholder="What to change"
                            onBeforeInput={(event) => event.stopPropagation()}
                            onKeyDown={(event) => event.stopPropagation()}
                            onKeyUp={(event) => event.stopPropagation()}
                            onCompositionStart={() => {
                                isComposingStyleCommentRef.current = true;
                            }}
                            onCompositionEnd={(event) =>
                                commitStyleCommentDraft(event.currentTarget.value)
                            }
                            onChange={(event) => updateStyleCommentDraft(event.currentTarget.value)}
                        />
                    </label>
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
