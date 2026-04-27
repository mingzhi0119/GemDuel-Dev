export interface CardBackArtwork {
    path: string;
    variant: string;
}

export type MarketDeckBackLevel = 1 | 2 | 3;
export type MarketDeckBackArtworkMap = Partial<Record<MarketDeckBackLevel, CardBackArtwork>>;
