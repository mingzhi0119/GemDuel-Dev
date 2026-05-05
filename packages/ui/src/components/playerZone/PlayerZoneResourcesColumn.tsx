import { AnimatePresence } from 'framer-motion';
import { GEM_TYPES } from '@gemduel/shared/constants';
import { GemIcon } from '../GemIcon';
import { FloatingGem, FloatingText } from '../VisualFeedback';
import type { RefObject } from 'react';
import type { GemColor, GemInventory, PlayerKey } from '@gemduel/shared/types';
import type { ReservedCardVisibility } from '@gemduel/shared/types';
import {
    PLAYER_ZONE_DISPLAY_COLORS,
    PLAYER_ZONE_RESOURCE_COLORS,
    TABLEAU_STACK_GAP_PX,
} from './constants';
import { PlayerZoneTableauStack } from './PlayerZoneTableauStack';
import type {
    PlayerZoneColorStats,
    PlayerZoneFeedbackItem,
    PlayerZoneSpecialStackStats,
    PlayerZoneStackState,
} from './types';

const SPECIAL_STACK_COLOR = 'pure-royal';
const SPECIAL_STACK_TITLE = 'Pure / Royal';

interface PlayerZoneResourcesColumnProps {
    player: PlayerKey;
    inventory: GemInventory;
    feedbacks: PlayerZoneFeedbackItem[];
    isStealMode: boolean;
    isDiscardMode: boolean;
    theme: 'light' | 'dark';
    colorStats: Record<string, PlayerZoneColorStats>;
    specialStackStats: PlayerZoneSpecialStackStats;
    tableauRowRef: RefObject<HTMLDivElement | null>;
    tableauSummaryScale: number;
    inventoryGemSizePx: number;
    inventoryGemBadgeSizePx: number;
    inventoryGemCountFontPx: number;
    summaryBadgeFontPx: number;
    summaryBadgeSizePx: number;
    surfaceVariant?: string;
    onGemClick: (color: string) => void;
    onSelectStack: (stack: PlayerZoneStackState) => void;
    readabilityTreatment?: boolean;
    tableauVisibility?: ReservedCardVisibility;
    gemVisibility?: 'visible' | 'hidden';
}

export function PlayerZoneResourcesColumn({
    player,
    inventory,
    feedbacks,
    isStealMode,
    isDiscardMode,
    theme,
    colorStats,
    specialStackStats,
    tableauRowRef,
    tableauSummaryScale,
    inventoryGemSizePx,
    inventoryGemBadgeSizePx,
    inventoryGemCountFontPx,
    summaryBadgeFontPx,
    summaryBadgeSizePx,
    surfaceVariant,
    onGemClick,
    onSelectStack,
    readabilityTreatment = false,
    tableauVisibility = 'faces',
    gemVisibility = 'visible',
}: PlayerZoneResourcesColumnProps) {
    const gemsAreHidden = gemVisibility === 'hidden';

    return (
        <div
            data-player-zone-column="resources"
            className="self-stretch flex flex-col gap-3 shrink-0 justify-center"
            style={{ flex: 78 }}
        >
            <div
                data-readability-hud-chip={readabilityTreatment ? 'player-resources' : undefined}
                className="flex gap-3 justify-center items-center"
            >
                {PLAYER_ZONE_RESOURCE_COLORS.map(
                    (color) => GEM_TYPES[color.toUpperCase() as keyof typeof GEM_TYPES]
                ).map((gem) => {
                    const count = inventory[gem.id as GemColor] || 0;
                    const isClickable =
                        !gemsAreHidden &&
                        ((isStealMode && count > 0 && gem.id !== 'gold') ||
                            (isDiscardMode && count > 0));

                    if (gemsAreHidden) {
                        return (
                            <button
                                type="button"
                                key={gem.id}
                                data-player-gem={`${player}-${gem.id}`}
                                data-player-zone-gem-hidden={`${player}-${gem.id}`}
                                data-player-gem-color={gem.id}
                                disabled={true}
                                aria-label="Hidden gem inventory"
                                className="relative appearance-none border-0 bg-transparent p-0 disabled:cursor-default"
                            >
                                <div
                                    aria-hidden="true"
                                    data-player-gem-back="true"
                                    className={`rounded-full border ${
                                        theme === 'dark'
                                            ? 'border-slate-500/45 bg-slate-950/70'
                                            : 'border-stone-400/55 bg-stone-700/30'
                                    }`}
                                    style={{
                                        width: `${inventoryGemSizePx}px`,
                                        height: `${inventoryGemSizePx}px`,
                                    }}
                                />
                            </button>
                        );
                    }

                    return (
                        <button
                            type="button"
                            key={gem.id}
                            data-player-gem={`${player}-${gem.id}`}
                            data-player-zone-gem={`${player}-${gem.id}`}
                            data-player-gem-color={gem.id}
                            data-player-gem-count={count}
                            disabled={!isClickable}
                            aria-label={`${isDiscardMode ? 'Discard' : 'Select'} ${gem.label} gem`}
                            onClick={() => isClickable && onGemClick && onGemClick(gem.id)}
                            className={`relative appearance-none border-0 bg-transparent p-0 transition-all group disabled:cursor-default ${isClickable ? 'cursor-pointer hover:scale-110 active:scale-95 ring-2 ring-rose-500 rounded-full' : ''}`}
                        >
                            <AnimatePresence>
                                {feedbacks
                                    .filter((f) => f.type === gem.id)
                                    .map((f) =>
                                        Object.keys(GEM_TYPES)
                                            .map((k) => k.toLowerCase())
                                            .includes(f.type) ? (
                                            <FloatingGem
                                                key={f.id}
                                                type={f.type}
                                                count={parseInt(f.quantity)}
                                                theme={theme}
                                            />
                                        ) : (
                                            <FloatingText
                                                key={f.id}
                                                quantity={f.quantity}
                                                label={f.label}
                                            />
                                        )
                                    )}
                            </AnimatePresence>
                            <div
                                style={{
                                    width: `${inventoryGemSizePx}px`,
                                    height: `${inventoryGemSizePx}px`,
                                }}
                            >
                                <GemIcon
                                    type={gem}
                                    size="w-full h-full"
                                    count={count}
                                    theme={theme}
                                    countClassName="-bottom-2 -right-2 px-2 py-0.5"
                                    countStyle={{
                                        minWidth: `${inventoryGemBadgeSizePx}px`,
                                        minHeight: `${inventoryGemBadgeSizePx}px`,
                                        fontSize: `${inventoryGemCountFontPx}px`,
                                        lineHeight: 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                    className={count === 0 ? 'grayscale opacity-50' : 'shadow-lg'}
                                />
                            </div>
                        </button>
                    );
                })}
            </div>

            <div
                ref={tableauRowRef}
                data-tableau-row={player}
                data-readability-hud-chip={readabilityTreatment ? 'player-tableau-row' : undefined}
                className="flex w-full shrink-0 items-start justify-start mt-1 overflow-hidden py-2 max-w-full min-w-0"
                style={{ gap: `${TABLEAU_STACK_GAP_PX}px` }}
            >
                {PLAYER_ZONE_DISPLAY_COLORS.map((color: string) => {
                    const stats = colorStats[color];

                    return (
                        <PlayerZoneTableauStack
                            key={color}
                            player={player}
                            color={color}
                            stats={stats}
                            theme={theme}
                            tableauSummaryScale={tableauSummaryScale}
                            summaryBadgeFontPx={summaryBadgeFontPx}
                            summaryBadgeSizePx={summaryBadgeSizePx}
                            surfaceVariant={surfaceVariant}
                            onSelectStack={onSelectStack}
                            readabilityTreatment={readabilityTreatment}
                            visibility={tableauVisibility}
                        />
                    );
                })}
                <PlayerZoneTableauStack
                    player={player}
                    color={SPECIAL_STACK_COLOR}
                    stats={specialStackStats}
                    theme={theme}
                    tableauSummaryScale={tableauSummaryScale}
                    summaryBadgeFontPx={summaryBadgeFontPx}
                    summaryBadgeSizePx={summaryBadgeSizePx}
                    surfaceVariant={surfaceVariant}
                    onSelectStack={onSelectStack}
                    title={SPECIAL_STACK_TITLE}
                    purePointCount={specialStackStats.purePointCount}
                    royalCount={specialStackStats.royalCount}
                    readabilityTreatment={readabilityTreatment}
                    visibility={tableauVisibility}
                />
            </div>
        </div>
    );
}
