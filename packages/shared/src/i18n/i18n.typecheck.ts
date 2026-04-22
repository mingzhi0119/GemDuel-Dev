import { translate } from './index';

translate('en', 'startPage.title');
translate('zh', 'actions.refill', { count: 3 });
translate('en', 'winner.banner', { winner: 'Player 1' });

// @ts-expect-error Invalid translation key must fail at compile time.
translate('en', 'caerd_name');

// @ts-expect-error Missing interpolation params must fail at compile time.
translate('en', 'actions.refill');
