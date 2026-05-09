import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { CLASSIC_CARDS } from '@gemduel/shared/data/realCards';
import { Card } from '../Card';

const testCard = CLASSIC_CARDS.find((card) => card.id === '151-bk');

if (!testCard) {
    throw new Error('Expected 151-bk to exist in CLASSIC_CARDS.');
}

describe('Card Three slab anchor', () => {
    it('marks opted-in cards for the app-level Three depth layer', () => {
        const html = renderToStaticMarkup(
            <Card card={testCard} theme="dark" size="featured" depthLayer="market" canBuy />
        );

        expect(html).toContain('data-three-card-slab="market"');
        expect(html).toContain('data-three-card-slab-card-id="151-bk"');
        expect(html).toContain('data-three-card-slab-size="featured"');
        expect(html).toContain('data-three-card-slab-theme="dark"');
        expect(html).toContain('data-three-card-slab-affordable="true"');
    });

    it('does not mark ordinary cards by default', () => {
        const html = renderToStaticMarkup(<Card card={testCard} theme="dark" size="featured" />);

        expect(html).not.toContain('data-three-card-slab=');
    });
});
