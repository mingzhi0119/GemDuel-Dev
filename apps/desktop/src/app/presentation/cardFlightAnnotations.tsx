import type { PresentationPreviewMode } from './presentationPreviewMode';

export function CardFlightAnchorHalo({
    point,
    tone,
    previewMode,
}: {
    point: { x: number; y: number };
    tone: 'source' | 'target';
    previewMode?: PresentationPreviewMode;
}) {
    const size = tone === 'target' ? 96 : 72;

    return (
        <div
            aria-hidden="true"
            data-card-flight-anchor={tone}
            className={`fixed z-[117] pointer-events-none rounded-xl border-2 ${
                tone === 'target'
                    ? 'border-emerald-200/80 shadow-[0_0_34px_rgba(52,211,153,0.72)]'
                    : 'border-cyan-200/70 shadow-[0_0_26px_rgba(125,211,252,0.58)]'
            }`}
            style={{
                left: point.x - size / 2,
                top: point.y - size / 2,
                width: size,
                height: size,
                zIndex: previewMode ? 1000 : undefined,
                animation: 'gemduel-card-anchor-pulse 720ms ease-out both',
            }}
        />
    );
}

export function CardFlightLabel({ label }: { label: string }) {
    return (
        <div
            aria-hidden="true"
            data-card-flight-label={label}
            className="absolute left-1/2 top-[-28px] z-10 -translate-x-1/2 whitespace-nowrap text-[11px] font-black uppercase tracking-[0.14em] text-cyan-50 drop-shadow-[0_2px_7px_rgba(0,0,0,0.95)]"
        >
            {label}
        </div>
    );
}
