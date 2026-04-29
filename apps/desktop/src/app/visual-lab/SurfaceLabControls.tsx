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
    type SurfaceLabRatingFilter,
    type SurfaceLabStyleRatings,
} from './useSurfaceLabRatings';

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

function SurfaceLabSlotSummary({
    assetSlots,
}: {
    assetSlots: Record<SurfaceLabSlot, SurfaceLabCandidate>;
}) {
    return (
        <div className="grid gap-1.5">
            {SURFACE_LAB_SLOTS.map((slot) => {
                const candidate = assetSlots[slot];

                return (
                    <div
                        key={slot}
                        className="grid grid-cols-[88px_1fr_auto] items-center gap-2 rounded-md border border-slate-700/80 bg-slate-950/70 px-2 py-1.5 text-[11px]"
                    >
                        <span className="font-black uppercase text-slate-400">
                            {SLOT_LABELS[slot]}
                        </span>
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
    styleRatings,
    slotOverrides,
    setSlotOverrides,
    assetSlots,
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
    styleRatings: SurfaceLabStyleRatings;
    slotOverrides: Partial<Record<SurfaceLabSlot, string>>;
    setSlotOverrides: (next: Partial<Record<SurfaceLabSlot, string>>) => void;
    assetSlots: Record<SurfaceLabSlot, SurfaceLabCandidate>;
}) {
    const hasRatingMatches = visibleAssetSets.length > 0;
    const selectableAssetSets = hasRatingMatches ? visibleAssetSets : assetSets;
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
            </div>

            {!hasRatingMatches && ratingFilter !== 'All' ? (
                <div className="rounded-md border border-amber-300/40 bg-amber-950/30 px-2 py-1.5 text-[11px] font-bold text-amber-100">
                    No styles in this rating
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

            <SurfaceLabSlotSummary assetSlots={assetSlots} />
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
