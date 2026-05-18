// @vitest-environment node

import { describe, expect, it } from 'vitest';
import { getParityRunnerDefinitionForTest } from './electron-unity-parity-runner.mjs';

describe('electron-unity ui-alignment suite coverage', () => {
    it('keeps Rulebook page navigation under strict pixel parity coverage', () => {
        const { suites, scenarios } = getParityRunnerDefinitionForTest();
        const uiAlignment = suites['ui-alignment'];
        expect(uiAlignment.strictPixelVisualDiff).toBe(true);
        expect(uiAlignment.visualMismatchThresholdPercent).toBe(1);
        expect(uiAlignment.failOnMatrixFailure).toBe(true);

        const scenarioById = new Map(scenarios.map((scenario) => [scenario.id, scenario]));
        expect(uiAlignment.scenarioIds).toContain('chrome-rulebook-open');

        for (let page = 2; page <= 9; page += 1) {
            const id = `chrome-rulebook-page-${page}`;
            expect(uiAlignment.scenarioIds).toContain(id);
            const scenario = scenarioById.get(id);
            expect(scenario).toBeTruthy();
            expect(scenario.strictPixelVisualDiff).toBe(true);
            expect(scenario.visualMismatchThresholdPercent).toBe(1);
            expect(scenario.actionsAfterLoad?.[0]).toEqual({ action: 'click_chrome_rulebook' });

            if (page === 2) {
                expect(scenario.actionsAfterLoad?.[1]).toEqual({ action: 'click_rulebook_next' });
            } else {
                expect(scenario.actionsAfterLoad?.[1]).toEqual({
                    action: 'click_rulebook_nav',
                    payload: { index: page - 1 },
                });
            }

            for (let navIndex = 0; navIndex < 9; navIndex += 1) {
                expect(scenario.visualBoundingBoxKeys).toContain(`rulebook.nav.${navIndex}`);
            }
        }
    });

    it('keeps dynamic gameplay surfaces in the strict UI alignment suite', () => {
        const { suites, effectiveSuiteScenarios } = getParityRunnerDefinitionForTest();
        expect(suites['ui-alignment'].scenarioIds).toEqual(
            expect.arrayContaining([
                'initial-board-render',
                'chrome-settings-open',
                'market-card-preview',
                'market-deck-reserve-preview',
                'reserved-card-preview',
                'p1-reserved-card-display',
                'p1-multi-reserved-card-display',
                'royal-featured-card-display',
                'player-zone-resource-score',
                'buy-card',
                'reserve-card',
                'end-turn',
            ])
        );

        for (const scenario of effectiveSuiteScenarios['ui-alignment']) {
            expect(scenario.skipVisualDiff).toBe(false);
            expect(scenario.strictPixelVisualDiff).toBe(true);
            expect(scenario.visualMismatchThresholdPercent).toBe(1);
        }
    });
});
