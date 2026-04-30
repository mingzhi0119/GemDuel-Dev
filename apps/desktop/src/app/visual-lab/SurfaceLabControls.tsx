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
import type { SurfaceLabReviewPlanExportState } from './surfaceLabReviewPlanTypes';

const SLOT_LABELS: Record<SurfaceLabSlot, string> = {
    'shell-background': 'Shell',
    topbar: 'TopBar',
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

const getReviewPlanPathLabel = (jsonPath?: string): string => {
    if (!jsonPath) {
        return 'surface-review-plan.json';
    }

    const parts = jsonPath.replace(/\\/g, '/').split('/').filter(Boolean);
    const fileName = parts[parts.length - 1] ?? 'surface-review-plan.json';
    const directoryName = parts[parts.length - 2];

    return fileName === 'surface-review-plan.json' && directoryName ? directoryName : fileName;
};

const getReviewPlanExportTitle = (reviewPlanExport: SurfaceLabReviewPlanExportState) =>
    [
        reviewPlanExport.jsonPath ? `JSON: ${reviewPlanExport.jsonPath}` : null,
        reviewPlanExport.markdownPath ? `Markdown: ${reviewPlanExport.markdownPath}` : null,
    ]
        .filter(Boolean)
        .join('\n');

function SurfaceLabSlotSummary({
    assetSlots,
    regenMarks,
    toggleSurfaceLabSlotRegenMark,
}: {
    assetSlots: Record<SurfaceLabSlot, SurfaceLabCandidate>;
    regenMarks: SurfaceLabRegenMarks;
    toggleSurfaceLabSlotRegenMark: (candidate: SurfaceLabCandidate) => void;
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
    reviewPlanExport,
    onExportReviewPlan,
    onSyncLatestCompletion,
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
    reviewPlanExport?: SurfaceLabReviewPlanExportState;
    onExportReviewPlan?: () => void;
    onSyncLatestCompletion?: () => void;
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

    return (
        <section className="flex flex-col gap-3">
            <div>
                <div className="text-[12px] font-black uppercase tracking-[0.2em] text-cyan-100">
                    {mode === 'surfaces' ? 'Surface Suite' : 'Motion Suite'}
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
            />
            {reviewPlanExport && onExportReviewPlan ? (
                <div className="grid min-w-0 max-w-full gap-2 rounded-lg border border-slate-700 bg-slate-950/70 p-2">
                    <button
                        type="button"
                        className="rounded-md border border-cyan-300/70 bg-cyan-300 px-2 py-2 text-[11px] font-black uppercase tracking-[0.12em] text-slate-950 hover:bg-cyan-200 disabled:cursor-not-allowed disabled:border-slate-600 disabled:bg-slate-800 disabled:text-slate-400"
                        disabled={
                            reviewPlanExport.status === 'exporting' ||
                            reviewPlanExport.status === 'syncing'
                        }
                        onClick={onExportReviewPlan}
                    >
                        {reviewPlanExport.status === 'exporting'
                            ? 'Exporting review plan'
                            : 'Export review plan'}
                    </button>
                    {onSyncLatestCompletion ? (
                        <button
                            type="button"
                            className="rounded-md border border-slate-600 px-2 py-1.5 text-[11px] font-black uppercase tracking-[0.12em] text-slate-200 hover:border-cyan-300 hover:text-cyan-100 disabled:cursor-not-allowed disabled:text-slate-500"
                            disabled={
                                reviewPlanExport.status === 'exporting' ||
                                reviewPlanExport.status === 'syncing'
                            }
                            onClick={onSyncLatestCompletion}
                        >
                            {reviewPlanExport.status === 'syncing'
                                ? 'Syncing completion'
                                : 'Sync latest completion'}
                        </button>
                    ) : null}
                    {reviewPlanExport.status !== 'idle' ? (
                        <div className="min-w-0 max-w-full space-y-1 text-[11px] leading-5 text-slate-400">
                            {reviewPlanExport.message ? (
                                <div className="min-w-0 max-w-full truncate font-bold text-slate-200">
                                    {reviewPlanExport.message}
                                </div>
                            ) : null}
                            {reviewPlanExport.jsonPath || reviewPlanExport.markdownPath ? (
                                <div
                                    className="min-w-0 max-w-full truncate font-mono text-cyan-100"
                                    title={getReviewPlanExportTitle(reviewPlanExport)}
                                >
                                    Plan: {getReviewPlanPathLabel(reviewPlanExport.jsonPath)}
                                </div>
                            ) : null}
                            {reviewPlanExport.status === 'exported' ? (
                                <div className="min-w-0 max-w-full truncate">
                                    Delete {reviewPlanExport.deleteSetCount ?? 0} / Regen{' '}
                                    {reviewPlanExport.regenerateSlotCount ?? 0} / Warnings{' '}
                                    {reviewPlanExport.warningCount ?? 0}
                                </div>
                            ) : null}
                            {reviewPlanExport.status === 'synced' ? (
                                <div className="min-w-0 max-w-full truncate">
                                    Cleared {reviewPlanExport.syncedCount ?? 0} regen marks
                                </div>
                            ) : null}
                        </div>
                    ) : null}
                </div>
            ) : null}
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
