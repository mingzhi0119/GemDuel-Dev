import React from 'react';
import { Crown } from 'lucide-react';
import { Card } from './Card';
import { isRoyalSelectionPhase } from '@gemduel/shared/logic/fsm';
import { RoyalCard, GamePhase, Card as CardType } from '@gemduel/shared/types';
import { useT } from '../i18n/LocaleProvider';
import { LexiconTerm } from '../lexicon/LexiconTerm';
import { FEATURED_CARD_SIZE } from './card/cardSizing';
import { READABILITY_HUD_GLASS_CLASS, READABILITY_HUD_TEXT_STYLE } from './readabilityHudStyles';
import type { CardBackArtwork } from './card/cardBackArtwork';

export type RoyalCourtDisplayMode = 'faces' | 'backs';

interface RoyalCourtProps {
    royalDeck: RoyalCard[];
    phase: GamePhase | string;
    handleSelectRoyal: (card: RoyalCard) => void;
    theme: 'light' | 'dark';
    canInteract?: boolean;
    onPreviewRoyal?: (card: RoyalCard) => void;
    displayMode?: RoyalCourtDisplayMode;
    royalCardBackArtwork?: CardBackArtwork;
    readabilityTreatment?: boolean;
}

const ROYAL_COURT_SLOT_COUNT = 4;
const ROYAL_COURT_COLUMNS = 2;
const ROYAL_COURT_GAP_PX = 16;
const ROYAL_COURT_GRID_SIZE = {
    width: FEATURED_CARD_SIZE.width * ROYAL_COURT_COLUMNS + ROYAL_COURT_GAP_PX,
    height:
        FEATURED_CARD_SIZE.height * (ROYAL_COURT_SLOT_COUNT / ROYAL_COURT_COLUMNS) +
        ROYAL_COURT_GAP_PX,
};

export const RoyalCourt: React.FC<RoyalCourtProps> = ({
    royalDeck,
    phase,
    handleSelectRoyal,
    theme,
    canInteract = true,
    onPreviewRoyal,
    displayMode = 'faces',
    royalCardBackArtwork,
    readabilityTreatment = false,
}) => {
    const t = useT();
    const isSelectingRoyal = isRoyalSelectionPhase(phase);
    const canSelectRoyal = isSelectingRoyal && canInteract;
    const canPreviewRoyal = !isSelectingRoyal && Boolean(onPreviewRoyal);
    const showRoyalBacks = displayMode === 'backs' && Boolean(royalCardBackArtwork);
    const royalSlots = Array.from(
        { length: ROYAL_COURT_SLOT_COUNT },
        (_, index) => royalDeck[index] ?? null
    );

    return (
        <div
            data-readability-hud-chip={readabilityTreatment ? 'royal-court' : undefined}
            className={`flex flex-col items-center gap-4 shrink-0 transition-all duration-500 ${
                readabilityTreatment
                    ? `${READABILITY_HUD_GLASS_CLASS} rounded-[1.75rem] px-4 py-3`
                    : 'p-1'
            }`}
            style={{
                width: readabilityTreatment
                    ? ROYAL_COURT_GRID_SIZE.width + 32
                    : ROYAL_COURT_GRID_SIZE.width,
            }}
        >
            <h2
                data-readability-hud-chip={readabilityTreatment ? 'royal-label' : undefined}
                className="mb-2 flex min-h-6 items-center justify-center gap-2.5 text-[13px] font-black uppercase tracking-[0.34em]"
                style={{
                    ...(readabilityTreatment ? READABILITY_HUD_TEXT_STYLE : {}),
                    color: 'var(--gd-shell-gold-text)',
                    textShadow: readabilityTreatment
                        ? READABILITY_HUD_TEXT_STYLE.textShadow
                        : 'var(--gd-shell-text-shadow)',
                }}
            >
                <Crown size={18} />{' '}
                <LexiconTerm termId="royal" className="normal-case" underline={false}>
                    {t('royalCourt.title')}
                </LexiconTerm>
            </h2>
            <div
                data-royal-court-grid="true"
                className="relative grid grid-cols-2 gap-4 shrink-0"
                style={{
                    width: ROYAL_COURT_GRID_SIZE.width,
                    height: ROYAL_COURT_GRID_SIZE.height,
                }}
            >
                {royalSlots.map((card, index) =>
                    card ? (
                        <button
                            type="button"
                            key={card.id}
                            data-royal-card={card.id}
                            data-royal-card-preview={canPreviewRoyal ? 'true' : undefined}
                            disabled={!canSelectRoyal && !canPreviewRoyal}
                            aria-label={`${canSelectRoyal ? 'Select' : 'Preview'} royal card ${card.label ?? card.id}`}
                            className={`relative appearance-none border-0 bg-transparent p-0 text-left ${
                                canSelectRoyal || canPreviewRoyal ? 'cursor-pointer z-50' : ''
                            }`}
                            onClick={() => {
                                if (canSelectRoyal) {
                                    handleSelectRoyal(card);
                                    return;
                                }

                                if (canPreviewRoyal) {
                                    onPreviewRoyal?.(card);
                                }
                            }}
                        >
                            {showRoyalBacks && royalCardBackArtwork ? (
                                <img
                                    data-royal-card-display="back"
                                    data-royal-card-back-variant={royalCardBackArtwork.variant}
                                    src={royalCardBackArtwork.path}
                                    alt=""
                                    draggable={false}
                                    className="rounded-md object-cover"
                                    style={FEATURED_CARD_SIZE}
                                />
                            ) : (
                                <Card
                                    card={card as unknown as CardType}
                                    isRoyal={true}
                                    theme={theme}
                                    size="featured"
                                />
                            )}
                        </button>
                    ) : (
                        <div
                            key={`royal-empty-slot-${index}`}
                            data-royal-court-empty-slot="true"
                            aria-hidden="true"
                            className="invisible pointer-events-none"
                            style={{
                                width: FEATURED_CARD_SIZE.width,
                                height: FEATURED_CARD_SIZE.height,
                            }}
                        />
                    )
                )}
            </div>
        </div>
    );
};
