export interface SelectionMarker {
    key: string;
    label: string;
    x: number;
    y: number;
}

export function ThreeBoardSelectionOverlay({ markers }: { markers: SelectionMarker[] }) {
    if (markers.length === 0) {
        return null;
    }

    return (
        <div
            aria-hidden="true"
            data-three-board-gem-selection-overlay="true"
            className="pointer-events-none absolute inset-0 z-[75]"
        >
            {markers.map((marker) => (
                <div
                    key={marker.key}
                    data-three-board-gem-selection-marker={marker.key}
                    className="absolute flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/90 bg-slate-950/60 text-[17px] font-black leading-none text-white shadow-[0_0_14px_rgba(255,255,255,0.72)]"
                    style={{ left: marker.x, top: marker.y }}
                >
                    {marker.label}
                </div>
            ))}
        </div>
    );
}
