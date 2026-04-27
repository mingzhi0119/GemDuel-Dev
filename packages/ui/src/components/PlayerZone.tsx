import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { FEATURED_CARD_SIZE, STANDARD_CARD_SIZE } from './Card';
import {
    clamp,
    PLAYER_ZONE_DISPLAY_COLORS,
    RESERVED_CARD_FALLBACK_SCALE,
    RESERVED_CARD_GAP_PX,
    RESERVED_CARD_MAX_SCALE,
    RESERVED_CARD_MIN_SCALE,
    RESERVED_CARD_TARGET_SLOTS,
    TABLEAU_STACK_FALLBACK_SCALE,
    TABLEAU_STACK_GAP_PX,
    TABLEAU_STACK_MIN_SCALE,
} from './playerZone/constants';
import { GEM_BOARD_GEM_SIZE_PX } from './gameBoard/gemPanelLayout';
import { PlayerZoneIdentityColumn } from './playerZone/PlayerZoneIdentityColumn';
import { PlayerZoneReservedColumn } from './playerZone/PlayerZoneReservedColumn';
import { PlayerZoneResourcesColumn } from './playerZone/PlayerZoneResourcesColumn';
import { StackOverlay } from './playerZone/StackOverlay';
import { usePlayerZoneFeedback } from './playerZone/usePlayerZoneFeedback';
import { usePlayerZoneMeasurements } from './playerZone/usePlayerZoneMeasurements';
import type {
    PlayerZoneColorStats,
    PlayerZoneProps,
    PlayerZoneStackState,
} from './playerZone/types';

export type { PlayerZoneProps };

const INVENTORY_GEM_SIZE_PX = Math.round(GEM_BOARD_GEM_SIZE_PX * 1.3);
const INVENTORY_GEM_BADGE_SIZE_PX = Math.round(INVENTORY_GEM_SIZE_PX * 0.42);
const INVENTORY_GEM_COUNT_FONT_PX = Math.round(INVENTORY_GEM_SIZE_PX * 0.24);

export const PlayerZone = ({
    player,
    inventory,
    cards,
    reserved,
    privileges,
    extraPrivileges = 0,
    isActive,
    lastFeedback,
    onBuyReserved,
    onDiscardReserved,
    onUsePrivilege,
    isPrivilegeMode,
    onGemClick,
    isStealMode,
    isDiscardMode,
    buff,
    theme,
    surfaceStyle,
    surfaceVariant,
    pendingReservedCardIds = [],
}: PlayerZoneProps) => {
    const safeCards = Array.isArray(cards) ? cards : [];
    const [selectedStack, setSelectedStack] = useState<PlayerZoneStackState | null>(null);
    const { tableauRowRef, reservedRowRef, tableauRowWidth, reservedRowWidth } =
        usePlayerZoneMeasurements();
    const { feedbacks, isExtortionEffect } = usePlayerZoneFeedback(player, lastFeedback);

    const hasPuppetMaster =
        buff?.effects?.active === 'discard_reserved' || buff?.id === 'puppet_master';

    const colorStats = PLAYER_ZONE_DISPLAY_COLORS.reduce(
        (acc: Record<string, PlayerZoneColorStats>, color) => {
            const colorCards = safeCards.filter((c) => c.bonusColor === color);
            acc[color] = {
                cards: colorCards,
                bonusCount: colorCards.reduce((sum, c) => sum + (c.bonusCount ?? 1), 0),
                points: colorCards.reduce((sum, c) => sum + c.points, 0),
            };
            return acc;
        },
        {}
    );

    const tableauSummaryGapTotalPx =
        Math.max(PLAYER_ZONE_DISPLAY_COLORS.length - 1, 0) * TABLEAU_STACK_GAP_PX;
    const tableauSummaryScale =
        tableauRowWidth > 0
            ? Math.max(
                  TABLEAU_STACK_MIN_SCALE,
                  (tableauRowWidth - tableauSummaryGapTotalPx) /
                      (PLAYER_ZONE_DISPLAY_COLORS.length * STANDARD_CARD_SIZE.width)
              )
            : TABLEAU_STACK_FALLBACK_SCALE;
    const summaryDisplayScale = clamp(tableauSummaryScale, TABLEAU_STACK_MIN_SCALE, 1);
    const summaryBadgeFontPx = Math.round(INVENTORY_GEM_COUNT_FONT_PX / summaryDisplayScale);
    const summaryBadgeSizePx = Math.round(INVENTORY_GEM_BADGE_SIZE_PX / summaryDisplayScale);
    const reservedSlotCount = Math.max(reserved.length, RESERVED_CARD_TARGET_SLOTS);
    const reservedGapTotalPx = Math.max(reservedSlotCount - 1, 0) * RESERVED_CARD_GAP_PX;
    const reservedCardScale =
        reserved.length > 0 && reservedRowWidth > 0
            ? clamp(
                  (reservedRowWidth - reservedGapTotalPx) /
                      (reservedSlotCount * FEATURED_CARD_SIZE.width),
                  RESERVED_CARD_MIN_SCALE,
                  RESERVED_CARD_MAX_SCALE
              )
            : RESERVED_CARD_FALLBACK_SCALE;

    return (
        <div
            data-player-zone={player}
            data-player-zone-bg={surfaceVariant ?? 'none'}
            data-reserved-count={reserved.length}
            className={`flex w-full h-full flex-row items-stretch p-4 transition-all duration-500 gap-4 bg-transparent
        ${isStealMode ? 'ring-2 ring-rose-500 animate-pulse' : ''}
        ${isDiscardMode && isActive ? 'ring-2 ring-red-500 animate-pulse' : ''}
        ${isExtortionEffect ? 'ring-4 ring-purple-500 bg-purple-500/10 animate-pulse' : ''}
    `}
            style={surfaceStyle}
        >
            <AnimatePresence>
                {selectedStack && (
                    <StackOverlay
                        isOpen={true}
                        color={selectedStack.color}
                        cards={selectedStack.cards}
                        onClose={() => setSelectedStack(null)}
                        theme={theme}
                    />
                )}
            </AnimatePresence>

            <PlayerZoneIdentityColumn
                player={player}
                privileges={privileges}
                extraPrivileges={extraPrivileges}
                buff={buff}
                isActive={isActive}
                isPrivilegeMode={isPrivilegeMode}
                theme={theme}
                onUsePrivilege={onUsePrivilege}
            />

            <PlayerZoneResourcesColumn
                player={player}
                inventory={inventory}
                feedbacks={feedbacks}
                isStealMode={isStealMode}
                isDiscardMode={isDiscardMode}
                theme={theme}
                colorStats={colorStats}
                tableauRowRef={tableauRowRef}
                tableauSummaryScale={tableauSummaryScale}
                inventoryGemSizePx={INVENTORY_GEM_SIZE_PX}
                inventoryGemBadgeSizePx={INVENTORY_GEM_BADGE_SIZE_PX}
                inventoryGemCountFontPx={INVENTORY_GEM_COUNT_FONT_PX}
                summaryBadgeFontPx={summaryBadgeFontPx}
                summaryBadgeSizePx={summaryBadgeSizePx}
                onGemClick={onGemClick}
                onSelectStack={setSelectedStack}
            />

            <PlayerZoneReservedColumn
                player={player}
                reserved={reserved}
                reservedRowRef={reservedRowRef}
                reservedCardScale={reservedCardScale}
                isActive={isActive}
                hasPuppetMaster={hasPuppetMaster}
                theme={theme}
                onBuyReserved={onBuyReserved}
                onDiscardReserved={onDiscardReserved}
                pendingReservedCardIds={pendingReservedCardIds}
            />
        </div>
    );
};
