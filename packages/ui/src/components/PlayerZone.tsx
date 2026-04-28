import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { FEATURED_CARD_SIZE, STANDARD_CARD_SIZE } from './Card';
import {
    clamp,
    PLAYER_ZONE_DISPLAY_COLORS,
    RESERVED_CARD_FALLBACK_SCALE,
    RESERVED_CARD_MAX_SCALE,
    RESERVED_CARD_MIN_SCALE,
    RESERVED_MINI_STACK_OFFSET_X_PX,
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
    PlayerZoneSpecialStackStats,
    PlayerZoneStackState,
} from './playerZone/types';
import type { Card as CardType, GemInventory, RoyalCard } from '@gemduel/shared/types';

export type { PlayerZoneProps };

const INVENTORY_GEM_SIZE_PX = Math.round(GEM_BOARD_GEM_SIZE_PX * 1.3);
const INVENTORY_GEM_BADGE_SIZE_PX = Math.round(INVENTORY_GEM_SIZE_PX * 0.42);
const INVENTORY_GEM_COUNT_FONT_PX = Math.round(INVENTORY_GEM_SIZE_PX * 0.24);
const SPECIAL_TABLEAU_STACK_COUNT = PLAYER_ZONE_DISPLAY_COLORS.length + 1;

const EMPTY_CARD_COST: GemInventory = {
    blue: 0,
    white: 0,
    green: 0,
    black: 0,
    red: 0,
    pearl: 0,
    gold: 0,
};

const normalizeRoyalToPreviewCard = (royal: RoyalCard): CardType => ({
    id: royal.id,
    level: 3,
    cost: { ...EMPTY_CARD_COST },
    points: royal.points,
    ability: royal.ability,
    bonusColor: royal.bonusColor,
    crowns: royal.crowns ?? 1,
    bonusCount: 0,
});

export const PlayerZone = ({
    player,
    inventory,
    cards,
    reserved,
    royals = [],
    privileges,
    extraPrivileges = 0,
    isActive,
    phase,
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
    surfaceArtwork,
    surfaceVariant,
    pendingReservedCardIds = [],
    onPreviewStack,
}: PlayerZoneProps) => {
    const safeCards = Array.isArray(cards) ? cards : [];
    const [selectedStack, setSelectedStack] = useState<PlayerZoneStackState | null>(null);
    const { tableauRowRef, reservedRowRef, tableauRowWidth, reservedRowWidth } =
        usePlayerZoneMeasurements();
    const { feedbacks, isExtortionEffect } = usePlayerZoneFeedback(player, lastFeedback);
    const [surfaceImage, setSurfaceImage] = useState<{
        path: string;
        isFallback: boolean;
    } | null>(() =>
        surfaceArtwork
            ? {
                  path: surfaceArtwork.primaryPath,
                  isFallback:
                      surfaceArtwork.primaryPath === surfaceArtwork.fallbackPath &&
                      Boolean(surfaceArtwork.mirrorFallback),
              }
            : null
    );

    const hasPuppetMaster =
        buff?.effects?.active === 'discard_reserved' || buff?.id === 'puppet_master';
    const handleSelectStack = (stack: PlayerZoneStackState) => {
        if (onPreviewStack) {
            onPreviewStack({ ...stack, player });
            return;
        }

        setSelectedStack(stack);
    };

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
    const purePointCards = safeCards.filter((card) => card.bonusColor === 'null');
    const royalPreviewCards = royals.map(normalizeRoyalToPreviewCard);
    const specialStackCards = [...purePointCards, ...royalPreviewCards];
    const specialStackStats: PlayerZoneSpecialStackStats = {
        cards: specialStackCards,
        bonusCount: specialStackCards.length,
        points: specialStackCards.reduce((sum, card) => sum + card.points, 0),
        purePointCount: purePointCards.length,
        royalCount: royalPreviewCards.length,
    };
    useEffect(() => {
        setSurfaceImage(
            surfaceArtwork
                ? {
                      path: surfaceArtwork.primaryPath,
                      isFallback:
                          surfaceArtwork.primaryPath === surfaceArtwork.fallbackPath &&
                          Boolean(surfaceArtwork.mirrorFallback),
                  }
                : null
        );
    }, [surfaceArtwork?.fallbackPath, surfaceArtwork?.mirrorFallback, surfaceArtwork?.primaryPath]);

    const rootSurfaceStyle = surfaceArtwork
        ? {
              ...surfaceStyle,
              backgroundImage: undefined,
              backgroundPosition: undefined,
              backgroundRepeat: undefined,
              backgroundSize: undefined,
          }
        : surfaceStyle;

    const tableauSummaryGapTotalPx =
        Math.max(SPECIAL_TABLEAU_STACK_COUNT - 1, 0) * TABLEAU_STACK_GAP_PX;
    const tableauSummaryScale =
        tableauRowWidth > 0
            ? Math.max(
                  TABLEAU_STACK_MIN_SCALE,
                  (tableauRowWidth - tableauSummaryGapTotalPx) /
                      (SPECIAL_TABLEAU_STACK_COUNT * STANDARD_CARD_SIZE.width)
              )
            : TABLEAU_STACK_FALLBACK_SCALE;
    const summaryDisplayScale = clamp(tableauSummaryScale, TABLEAU_STACK_MIN_SCALE, 1);
    const summaryBadgeFontPx = Math.round(INVENTORY_GEM_COUNT_FONT_PX / summaryDisplayScale);
    const summaryBadgeSizePx = Math.round(INVENTORY_GEM_BADGE_SIZE_PX / summaryDisplayScale);
    const reservedSlotCount = Math.min(Math.max(reserved.length, 1), RESERVED_CARD_TARGET_SLOTS);
    const reservedMiniStackWidthPx =
        FEATURED_CARD_SIZE.width +
        Math.max(reservedSlotCount - 1, 0) * RESERVED_MINI_STACK_OFFSET_X_PX;
    const reservedCardScale =
        reserved.length > 0 && reservedRowWidth > 0
            ? clamp(
                  reservedRowWidth / reservedMiniStackWidthPx,
                  RESERVED_CARD_MIN_SCALE,
                  RESERVED_CARD_MAX_SCALE
              )
            : RESERVED_CARD_FALLBACK_SCALE;
    const identityColumn = (
        <PlayerZoneIdentityColumn
            player={player}
            privileges={privileges}
            extraPrivileges={extraPrivileges}
            buff={buff}
            isActive={isActive}
            isPrivilegeMode={isPrivilegeMode}
            phase={phase}
            theme={theme}
            onUsePrivilege={onUsePrivilege}
            dividerSide={player === 'p1' ? 'left' : 'right'}
        />
    );
    const resourcesColumn = (
        <PlayerZoneResourcesColumn
            player={player}
            inventory={inventory}
            feedbacks={feedbacks}
            isStealMode={isStealMode}
            isDiscardMode={isDiscardMode}
            theme={theme}
            colorStats={colorStats}
            specialStackStats={specialStackStats}
            tableauRowRef={tableauRowRef}
            tableauSummaryScale={tableauSummaryScale}
            inventoryGemSizePx={INVENTORY_GEM_SIZE_PX}
            inventoryGemBadgeSizePx={INVENTORY_GEM_BADGE_SIZE_PX}
            inventoryGemCountFontPx={INVENTORY_GEM_COUNT_FONT_PX}
            summaryBadgeFontPx={summaryBadgeFontPx}
            summaryBadgeSizePx={summaryBadgeSizePx}
            onGemClick={onGemClick}
            onSelectStack={handleSelectStack}
        />
    );
    const reservedColumn = (
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
            dividerSide={player === 'p1' ? 'right' : 'left'}
        />
    );

    return (
        <div
            data-player-zone={player}
            data-player-zone-bg={surfaceVariant ?? 'none'}
            data-reserved-count={reserved.length}
            className={`relative w-full h-full overflow-hidden p-4 transition-all duration-500 bg-transparent
        ${isStealMode ? 'ring-2 ring-rose-500 animate-pulse' : ''}
        ${isDiscardMode && isActive ? 'ring-2 ring-red-500 animate-pulse' : ''}
        ${isExtortionEffect ? 'ring-4 ring-purple-500 bg-purple-500/10 animate-pulse' : ''}
    `}
            style={rootSurfaceStyle}
        >
            {surfaceArtwork && surfaceImage && (
                <img
                    src={surfaceImage.path}
                    alt=""
                    aria-hidden="true"
                    data-player-zone-surface-artwork={player}
                    data-player-zone-surface-primary={surfaceArtwork.primaryPath}
                    data-player-zone-surface-fallback={surfaceArtwork.fallbackPath ?? 'none'}
                    data-player-zone-surface-using-fallback={
                        surfaceImage.isFallback ? 'true' : undefined
                    }
                    data-player-zone-surface-mirrored={
                        surfaceImage.isFallback && surfaceArtwork.mirrorFallback
                            ? 'true'
                            : undefined
                    }
                    draggable={false}
                    decoding="async"
                    className="pointer-events-none absolute inset-0 z-0 h-full w-full select-none object-cover"
                    style={{
                        transform:
                            surfaceImage.isFallback && surfaceArtwork.mirrorFallback
                                ? 'scaleX(-1)'
                                : undefined,
                    }}
                    onError={() => {
                        if (
                            surfaceArtwork.fallbackPath &&
                            surfaceImage.path !== surfaceArtwork.fallbackPath
                        ) {
                            setSurfaceImage({
                                path: surfaceArtwork.fallbackPath,
                                isFallback: true,
                            });
                        }
                    }}
                />
            )}
            <AnimatePresence>
                {selectedStack && (
                    <StackOverlay
                        isOpen={true}
                        color={selectedStack.color}
                        cards={selectedStack.cards}
                        onClose={() => setSelectedStack(null)}
                        theme={theme}
                        title={selectedStack.title}
                    />
                )}
            </AnimatePresence>

            <div className="relative z-10 flex h-full w-full flex-row items-stretch gap-4">
                {player === 'p1' ? (
                    <>
                        {reservedColumn}
                        {resourcesColumn}
                        {identityColumn}
                    </>
                ) : (
                    <>
                        {identityColumn}
                        {resourcesColumn}
                        {reservedColumn}
                    </>
                )}
            </div>
        </div>
    );
};
