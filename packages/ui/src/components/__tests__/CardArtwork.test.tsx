import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ROYAL_CARDS } from '@gemduel/shared/constants';
import { CLASSIC_CARDS, ROGUE_CARDS } from '@gemduel/shared/data/realCards';
import type { Card as CardType } from '@gemduel/shared/types';
import { Card, FEATURED_CARD_SAMPLE_SIZE, FEATURED_CARD_SIZE } from '../Card';
import { CARD_ARTWORK_SOURCE_SIZE } from '../card/cardArtwork';
import { RoyalCourt } from '../RoyalCourt';

const realCard = CLASSIC_CARDS.find((card) => card.id === '151-bk');
const metadataHeavyCard = ROGUE_CARDS.find((card) => card.id === '373-jo');
const royalCard = ROYAL_CARDS.find((card) => card.id === 'r92-ro');

if (!realCard) {
    throw new Error('Expected 151-bk to exist in CLASSIC_CARDS.');
}
if (!metadataHeavyCard) {
    throw new Error('Expected 373-jo to exist in ROGUE_CARDS.');
}
if (!royalCard) {
    throw new Error('Expected r92-ro to exist in ROYAL_CARDS.');
}

const fakeCard: CardType = {
    ...realCard,
    id: 'fake-test-card',
};

describe('Card artwork rendering', () => {
    const expectedFeaturedStyle = `width:${FEATURED_CARD_SIZE.width}px;height:${FEATURED_CARD_SIZE.height}px`;

    it('renders runtime card-face artwork for real development cards', () => {
        const html = renderToStaticMarkup(<Card card={realCard} theme="dark" />);

        expect(html).toContain('data-card-artwork="151-bk"');
        expect(html).toContain('data-card-artwork-placeholder="151-bk"');
        expect(html).toContain('/assets/cards/151-bk.png');
        expect(html).toContain(`width="${CARD_ARTWORK_SOURCE_SIZE.width}"`);
        expect(html).toContain(`height="${CARD_ARTWORK_SOURCE_SIZE.height}"`);
        expect(html).toContain('loading="eager"');
        expect(html).toContain('decoding="sync"');
        expect(html).not.toContain('data-card-face-pattern="true"');
    });

    it('renders featured market and royal cards from high-resolution artwork at the same display size', () => {
        const featuredCardHtml = renderToStaticMarkup(
            <Card card={realCard} theme="dark" size="featured" />
        );
        const royalCourtHtml = renderToStaticMarkup(
            <RoyalCourt
                royalDeck={[royalCard]}
                phase="IDLE"
                handleSelectRoyal={() => undefined}
                theme="dark"
            />
        );

        expect(featuredCardHtml).toContain(expectedFeaturedStyle);
        expect(royalCourtHtml).toContain(expectedFeaturedStyle);
        expect(FEATURED_CARD_SAMPLE_SIZE).toEqual(CARD_ARTWORK_SOURCE_SIZE);
        expect(featuredCardHtml).toContain('data-card-sample-canvas="featured"');
        expect(featuredCardHtml).toContain(
            `data-card-sample-width="${FEATURED_CARD_SAMPLE_SIZE.width}"`
        );
        expect(featuredCardHtml).toContain(
            `data-card-sample-height="${FEATURED_CARD_SAMPLE_SIZE.height}"`
        );
        expect(featuredCardHtml).toContain(`width="${CARD_ARTWORK_SOURCE_SIZE.width}"`);
        expect(featuredCardHtml).toContain(`height="${CARD_ARTWORK_SOURCE_SIZE.height}"`);
        expect(royalCourtHtml).toContain('data-card-sample-canvas="featured"');
        expect(royalCourtHtml).toContain(`width="${CARD_ARTWORK_SOURCE_SIZE.width}"`);
        expect(royalCourtHtml).toContain(`height="${CARD_ARTWORK_SOURCE_SIZE.height}"`);
    });

    it('normalizes generated runtime card IDs to their full-card artwork asset', () => {
        const generatedRuntimeCard: CardType = {
            ...realCard,
            id: '151-bk-1700000000000-abc12',
        };
        const html = renderToStaticMarkup(<Card card={generatedRuntimeCard} theme="dark" />);

        expect(html).toContain('data-card-artwork="151-bk"');
        expect(html).toContain('/assets/cards/151-bk.png');
        expect(html).not.toContain('/assets/cards/151-bk-1700000000000-abc12.png');
        expect(html).not.toContain('data-card-face-pattern="true"');
    });

    it('normalizes replay card instance IDs to their full-card artwork asset', () => {
        const replayInstanceCard: CardType = {
            ...realCard,
            id: 'c:151-bk#0',
        };
        const html = renderToStaticMarkup(<Card card={replayInstanceCard} theme="dark" />);

        expect(html).toContain('data-card-artwork="151-bk"');
        expect(html).toContain('/assets/cards/151-bk.png');
        expect(html).not.toContain('/assets/cards/c:151-bk#0.png');
        expect(html).not.toContain('data-card-face-pattern="true"');
    });

    it('treats runtime artwork as final full-card art without React metadata overlays', () => {
        const html = renderToStaticMarkup(<Card card={metadataHeavyCard} theme="dark" />);

        expect(html).toContain('data-card-artwork="373-jo"');
        expect(html).toContain('/assets/cards/373-jo.png');
        expect(html).not.toContain('bg-gradient-to-b');
        expect(html).not.toContain('opacity-90');
        expect(html).not.toContain('ring-');
        expect(html).not.toContain('shadow-');
        expect(html).not.toContain('data-card-face-pattern="true"');
        expect(html).not.toContain('data-card-cost-row=');
        expect(html).not.toContain('data-card-cost-count=');
        expect(html).not.toContain('data-joker-badge="true"');
        expect(html).not.toContain('/assets/gems/');
        expect(html).not.toContain('lucide-hand');
        expect(html).not.toContain('lucide-crown');
    });

    it('keeps runtime artwork purchasable affordance crisp without opacity or shadow', () => {
        const html = renderToStaticMarkup(<Card card={realCard} theme="light" canBuy />);

        expect(html).toContain('data-card-affordable="true"');
        expect(html).toContain('outline-emerald-500');
        expect(html).not.toContain('opacity-90');
        expect(html).not.toContain('ring-');
        expect(html).not.toContain('shadow-');
        expect(html).not.toContain('data-card-face-pattern="true"');
    });

    it('renders runtime full-card artwork for royal cards', () => {
        const html = renderToStaticMarkup(
            <Card card={royalCard as unknown as CardType} theme="dark" isRoyal />
        );

        expect(html).toContain('data-card-artwork="r92-ro"');
        expect(html).toContain('/assets/cards/r92-ro.png');
        expect(html).not.toContain('bg-gradient-to-b');
        expect(html).not.toContain('opacity-90');
        expect(html).not.toContain('ring-');
        expect(html).not.toContain('shadow-');
        expect(html).not.toContain('data-card-face-pattern="true"');
        expect(html).not.toContain('animate-pulse');
        expect(html).not.toContain('lucide-rotate-ccw');
        expect(html).not.toContain('lucide-crown');
    });

    it('keeps royal court cards on face artwork instead of card backs', () => {
        const html = renderToStaticMarkup(
            <RoyalCourt
                royalDeck={[royalCard]}
                phase="IDLE"
                handleSelectRoyal={() => undefined}
                theme="dark"
            />
        );

        expect(html).toContain('data-card-artwork="r92-ro"');
        expect(html).toContain('/assets/cards/r92-ro.png');
        expect(html).not.toContain('data-card-back-preview=');
        expect(html).not.toContain('/assets/surfaces/anime-themes/');
    });

    it('does not dim royal full-card artwork in the court while selection is inactive', () => {
        const html = renderToStaticMarkup(
            <RoyalCourt
                royalDeck={[royalCard]}
                phase="IDLE"
                handleSelectRoyal={() => undefined}
                theme="dark"
            />
        );

        expect(html).toContain('/assets/cards/r92-ro.png');
        expect(html).not.toContain('opacity-80');
        expect(html).not.toContain('grayscale');
        expect(html).not.toContain('ring-yellow');
        expect(html).not.toContain('shadow-xl');
    });

    it('keeps the royal court footprint fixed after royal cards are removed', () => {
        const html = renderToStaticMarkup(
            <RoyalCourt
                royalDeck={[royalCard]}
                phase="IDLE"
                handleSelectRoyal={() => undefined}
                theme="dark"
            />
        );
        const expectedGridWidth = FEATURED_CARD_SIZE.width * 2 + 16;
        const expectedGridHeight = FEATURED_CARD_SIZE.height * 2 + 16;

        expect(html).toContain('data-royal-court-grid="true"');
        expect(html).toContain(`width:${expectedGridWidth}px;height:${expectedGridHeight}px`);
        expect(html.match(/data-royal-court-empty-slot="true"/g)).toHaveLength(3);
    });

    it('does not render the retired royal selection corner marker', () => {
        const html = renderToStaticMarkup(
            <RoyalCourt
                royalDeck={[royalCard]}
                phase="SELECT_ROYAL"
                handleSelectRoyal={() => undefined}
                theme="dark"
            />
        );

        expect(html).not.toContain('PICK!');
        expect(html).not.toContain('animate-bounce');
    });

    it('falls back to the generated pattern for non-catalog fixture cards', () => {
        const html = renderToStaticMarkup(<Card card={fakeCard} theme="dark" />);

        expect(html).toContain('data-card-face-pattern="true"');
        expect(html).not.toContain('data-card-artwork=');
        expect(html).not.toContain('/assets/cards/fake-test-card.png');
        expect(html).toContain('data-card-cost-row=');
        expect(html).toContain('/assets/gems/');
    });
});
