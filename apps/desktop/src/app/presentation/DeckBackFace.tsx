import type { CardBackArtwork } from '@gemduel/ui/components/card/cardBackArtwork';

export function DeckBackFace({ artwork, level }: { artwork?: CardBackArtwork; level: 1 | 2 | 3 }) {
    if (artwork) {
        return (
            <img
                src={artwork.path}
                alt=""
                aria-hidden="true"
                draggable={false}
                decoding="async"
                data-card-reserve-deck-back-artwork={artwork.variant}
                className="absolute inset-0 h-full w-full select-none object-cover"
            />
        );
    }

    return (
        <div
            aria-hidden="true"
            data-card-reserve-deck-back-fallback={level}
            className="absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950 to-black"
        />
    );
}
