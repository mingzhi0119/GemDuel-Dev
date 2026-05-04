import { RefreshCw } from 'lucide-react';
import {
    SURFACE_LAB_SLOTS,
    type SurfaceLabAssetSet,
    type SurfaceLabCandidate,
    type SurfaceLabSlot,
    type VisualLabMode,
} from './surfaceLabTypes';
import { SurfaceLabSelect } from './SurfaceLabSelect';
import {
    SURFACE_LAB_RATING_FILTER_OPTIONS,
    matchesSurfaceLabRatingFilter,
    type SurfaceLabRatingFilter,
    type SurfaceLabStyleRatings,
} from './useSurfaceLabRatings';
import {
    SURFACE_LAB_REGEN_FILTER_OPTIONS,
    isSurfaceLabSlotMarkedForRegen,
    matchesSurfaceLabRegenFilter,
    type SurfaceLabRegenFilter,
    type SurfaceLabRegenMarks,
} from './useSurfaceLabRegenMarks';
import {
    SURFACE_LAB_REVIEW_STATE_FILE_PATH,
    type SurfaceLabReviewStateStatus,
} from './surfaceLabReviewStateTypes';

const SLOT_LABELS: Record<SurfaceLabSlot, string> = {
    'shell-background': 'Shell',
    'player-zone': 'PlayerZone',
    'gem-panel': 'Gem panel',
    'market-card-back-l1': 'L1 back',
    'market-card-back-l2': 'L2 back',
    'market-card-back-l3': 'L3 back',
    'royal-card-back': 'Royal back',
};

const getBatchOptions = (assetSets: readonly SurfaceLabAssetSet[]) =>
    Array.from(new Map(assetSets.map((set) => [set.batchLabel, set.batchLabel])).values());
const formatDimensions = (candidate: SurfaceLabCandidate): string => {
    const archive = candidate.dimensions?.archive;
    const target = candidate.dimensions?.target;
    if (archive) {
        return `${archive[0]}x${archive[1]}`;
    }
    if (target) {
        return `${target[0]}x${target[1]}`;
    }
    return 'runtime';
};
const getRatingCount = (reviewStateStatus: SurfaceLabReviewStateStatus | undefined): number =>
    reviewStateStatus?.counts
        ? Object.values(reviewStateStatus.counts.ratings).reduce((total, count) => total + count, 0)
        : 0;

function SurfaceLabSlotSummary({
    assetSlots,
    regenMarks,
    toggleSurfaceLabSlotRegenMark,
    reviewReadOnly,
}: {
    assetSlots: Record<SurfaceLabSlot, SurfaceLabCandidate>;
    regenMarks: SurfaceLabRegenMarks;
    toggleSurfaceLabSlotRegenMark: (candidate: SurfaceLabCandidate) => void;
    reviewReadOnly?: boolean;
}) {
    return (
        <div className="grid gap-1.5">
            {SURFACE_LAB_SLOTS.map((slot) => {
                const candidate = assetSlots[slot];
                const markedForRegen = isSurfaceLabSlotMarkedForRegen(candidate, regenMarks);
                const slotLabel = SLOT_LABELS[slot];

                return (
                    <div
                        key={slot}
                        className="grid grid-cols-[26px_88px_1fr_auto] items-center gap-2 rounded-md border border-slate-700/80 bg-slate-950/70 px-2 py-1.5 text-[11px]"
                    >
                        {reviewReadOnly ? (
                            <span
                                aria-label={`${slotLabel} regeneration mark preview`}
                                className={`flex h-6 w-6 items-center justify-center rounded border ${
                                    markedForRegen
                                        ? 'border-amber-200 bg-amber-300 text-slate-950'
                                        : 'border-slate-700 bg-slate-950 text-slate-600'
                                }`}
                            >
                                <RefreshCw size={13} aria-hidden="true" />
                            </span>
                        ) : (
                            <button
                                type="button"
                                aria-label={`${markedForRegen ? 'Clear' : 'Mark'} ${slotLabel} for regeneration`}
                                aria-pressed={markedForRegen}
                                className={`flex h-6 w-6 items-center justify-center rounded border transition-colors ${
                                    markedForRegen
                                        ? 'border-amber-200 bg-amber-300 text-slate-950 shadow-[0_0_14px_rgba(251,191,36,0.28)]'
                                        : 'border-slate-600 bg-slate-950 text-slate-400 hover:border-amber-300 hover:text-amber-100'
                                }`}
                                onClick={() => toggleSurfaceLabSlotRegenMark(candidate)}
                            >
                                <RefreshCw size={13} aria-hidden="true" />
                            </button>
                        )}
                        <span className="font-black uppercase text-slate-400">{slotLabel}</span>
                        <span className="min-w-0 truncate font-mono text-slate-100">
                            {candidate.promptId}
                        </span>
                        <span className="font-mono text-cyan-100">
                            {candidate.score
                                ? candidate.score.toFixed(1)
                                : formatDimensions(candidate)}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}

export function SurfaceLabControls({
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
    regenMarks,
    toggleSurfaceLabSlotRegenMark,
    slotOverrides,
    setSlotOverrides,
    assetSlots,
    reviewStateStatus,
    reviewReadOnly = false,
}: {
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
    regenMarks: SurfaceLabRegenMarks;
    toggleSurfaceLabSlotRegenMark: (candidate: SurfaceLabCandidate) => void;
    slotOverrides: Partial<Record<SurfaceLabSlot, string>>;
    setSlotOverrides: (next: Partial<Record<SurfaceLabSlot, string>>) => void;
    assetSlots: Record<SurfaceLabSlot, SurfaceLabCandidate>;
    reviewStateStatus?: SurfaceLabReviewStateStatus;
    reviewReadOnly?: boolean;
}) {
    const hasFilterMatches = visibleAssetSets.length > 0;
    const hasRatingMatches =
        ratingFilter === 'All' ||
        assetSets.some((set) => matchesSurfaceLabRatingFilter(set, styleRatings, ratingFilter));
    const hasRegenMatches =
        regenFilter === 'All' ||
        assetSets.some((set) => matchesSurfaceLabRegenFilter(set, regenMarks, regenFilter));
    const selectableAssetSets = hasFilterMatches ? visibleAssetSets : assetSets;
    const batchOptions = getBatchOptions(selectableAssetSets);
    const styleOptions = Array.from(
        new Set(
            selectableAssetSets
                .filter((set) => set.batchLabel === selectedSet.batchLabel)
                .map((set) => set.style)
        )
    );
    const variantOptions = selectableAssetSets
        .filter(
            (set) => set.batchLabel === selectedSet.batchLabel && set.style === selectedSet.style
        )
        .map((set) => set.variant);
    const setOptions = assetSets.map((set) => set.id);
    const setLabelById = new Map(assetSets.map((set) => [set.id, set.label]));
    const statePath = reviewStateStatus?.path ?? SURFACE_LAB_REVIEW_STATE_FILE_PATH;
    const ratingCount = getRatingCount(reviewStateStatus) || Object.keys(styleRatings).length;
    const pendingReplacementCount =
        reviewStateStatus?.counts?.pendingReplacements ??
        reviewStateStatus?.counts?.regenMarks ??
        Object.keys(regenMarks).length;
    const commentCount =
        reviewStateStatus?.counts?.pendingComments ?? reviewStateStatus?.counts?.comments ?? 0;

    return (
        <section className="flex flex-col gap-3">
            <div>
                <div className="text-[12px] font-black uppercase tracking-[0.2em] text-cyan-100">
                    {mode === 'motion'
                        ? 'Motion Suite'
                        : mode === 'readability'
                          ? 'Readability Suite'
                          : 'Surface Suite'}
                </div>
                <div className="mt-1 text-[11px] text-slate-400">
                    {catalogStatus === 'ready'
                        ? `${assetSets.length} complete asset sets loaded`
                        : catalogStatus === 'loading'
                          ? 'Loading candidate manifests'
                          : `Candidate service unavailable: ${catalogError ?? 'using runtime themes'}`}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
                <SurfaceLabSelect
                    label="Batch"
                    value={selectedSet.batchLabel}
                    options={batchOptions}
                    onChange={(batchLabel) => {
                        const next = selectableAssetSets.find(
                            (set) => set.batchLabel === batchLabel
                        );
                        if (next) setSelectedSetId(next.id);
                    }}
                />
                <SurfaceLabSelect
                    label="Style"
                    value={selectedSet.style}
                    options={styleOptions}
                    onChange={(style) => {
                        const next = selectableAssetSets.find(
                            (set) =>
                                set.batchLabel === selectedSet.batchLabel && set.style === style
                        );
                        if (next) setSelectedSetId(next.id);
                    }}
                />
                <SurfaceLabSelect
                    label="A/B"
                    value={selectedSet.variant}
                    options={variantOptions}
                    onChange={(variant) => {
                        const next = selectableAssetSets.find(
                            (set) =>
                                set.batchLabel === selectedSet.batchLabel &&
                                set.style === selectedSet.style &&
                                set.variant === variant
                        );
                        if (next) setSelectedSetId(next.id);
                    }}
                />
                <SurfaceLabSelect
                    label="Rating"
                    value={ratingFilter}
                    options={SURFACE_LAB_RATING_FILTER_OPTIONS}
                    onChange={(filter) => setRatingFilter(filter as SurfaceLabRatingFilter)}
                />
                <SurfaceLabSelect
                    label="Regen"
                    value={regenFilter}
                    options={SURFACE_LAB_REGEN_FILTER_OPTIONS}
                    onChange={(filter) => setRegenFilter(filter as SurfaceLabRegenFilter)}
                />
            </div>

            {!hasRatingMatches ? (
                <div className="rounded-md border border-amber-300/40 bg-amber-950/30 px-2 py-1.5 text-[11px] font-bold text-amber-100">
                    No styles in this rating
                </div>
            ) : null}
            {!hasRegenMatches ? (
                <div className="rounded-md border border-amber-300/40 bg-amber-950/30 px-2 py-1.5 text-[11px] font-bold text-amber-100">
                    No assets in this regeneration filter
                </div>
            ) : null}
            {hasRatingMatches && hasRegenMatches && !hasFilterMatches ? (
                <div className="rounded-md border border-amber-300/40 bg-amber-950/30 px-2 py-1.5 text-[11px] font-bold text-amber-100">
                    No styles match the selected filters
                </div>
            ) : null}

            <details className="rounded-lg border border-slate-700 bg-slate-950/70 p-2">
                <summary className="cursor-pointer text-[11px] font-black uppercase tracking-[0.14em] text-slate-200">
                    Slot overrides
                </summary>
                <div className="mt-2 grid gap-2">
                    {SURFACE_LAB_SLOTS.map((slot) => (
                        <label
                            key={slot}
                            className="grid grid-cols-[88px_1fr] items-center gap-2 text-[11px] text-slate-300"
                        >
                            <span className="font-black uppercase">{SLOT_LABELS[slot]}</span>
                            <select
                                value={slotOverrides[slot] ?? ''}
                                onChange={(event) => {
                                    const value = event.currentTarget.value;
                                    setSlotOverrides({
                                        ...slotOverrides,
                                        [slot]: value || undefined,
                                    });
                                }}
                                className="min-h-8 rounded-md border border-slate-600 bg-slate-950 px-2 text-[11px] text-slate-100"
                            >
                                <option value="">Use selected set</option>
                                {setOptions.map((id) => (
                                    <option key={id} value={id}>
                                        {setLabelById.get(id) ?? id}
                                    </option>
                                ))}
                            </select>
                        </label>
                    ))}
                    <button
                        type="button"
                        className="rounded-md border border-slate-600 px-2 py-1.5 text-[11px] font-black uppercase tracking-[0.12em] text-slate-200 hover:border-cyan-300 hover:text-cyan-100"
                        onClick={() => setSlotOverrides({})}
                    >
                        Reset overrides
                    </button>
                </div>
            </details>

            <SurfaceLabSlotSummary
                assetSlots={assetSlots}
                regenMarks={regenMarks}
                toggleSurfaceLabSlotRegenMark={toggleSurfaceLabSlotRegenMark}
                reviewReadOnly={reviewReadOnly}
            />
            <div className="grid min-w-0 max-w-full gap-2 rounded-lg border border-slate-700 bg-slate-950/70 p-2">
                <div className="flex items-center justify-between gap-2 text-[11px] font-black uppercase tracking-[0.14em] text-slate-300">
                    <span>Review state</span>
                    <span className="font-mono text-cyan-100">
                        {reviewStateStatus?.status ?? 'loading'}
                    </span>
                </div>
                <div
                    className="min-w-0 max-w-full truncate font-mono text-[11px] text-cyan-100"
                    title={statePath}
                >
                    {statePath}
                </div>
                <div className="grid grid-cols-3 gap-1.5 text-center text-[11px]">
                    <div className="rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5">
                        <div className="font-mono text-cyan-100">{ratingCount}</div>
                        <div className="font-black uppercase text-slate-500">Ratings</div>
                    </div>
                    <div className="rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5">
                        <div className="font-mono text-amber-100">{pendingReplacementCount}</div>
                        <div className="font-black uppercase text-slate-500">Pending</div>
                    </div>
                    <div className="rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5">
                        <div className="font-mono text-slate-100">{commentCount}</div>
                        <div className="font-black uppercase text-slate-500">Comments</div>
                    </div>
                </div>
                <div className="min-w-0 max-w-full truncate text-[11px] leading-5 text-slate-400">
                    {reviewStateStatus?.message ?? 'Waiting for state file'}
                    {reviewStateStatus?.revision !== undefined ? (
                        <span className="font-mono text-slate-500">
                            {' '}
                            / rev {reviewStateStatus.revision}
                        </span>
                    ) : null}
                </div>
            </div>
            <div className="text-[11px] leading-5 text-slate-400">
                Active set: <span className="font-mono text-slate-100">{selectedSetId}</span>
                <br />
                Manual rating:{' '}
                <span className="font-mono text-cyan-100">
                    {styleRatings[selectedSetId] ?? 'Unrated'}
                </span>
            </div>
        </section>
    );
}
