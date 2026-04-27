import React from 'react';
import { Crown } from 'lucide-react';
import { Card } from './Card';
import { isRoyalSelectionPhase } from '@gemduel/shared/logic/fsm';
import { RoyalCard, GamePhase, Card as CardType } from '@gemduel/shared/types';
import { useT } from '../i18n/LocaleProvider';
import { LexiconTerm } from '../lexicon/LexiconTerm';
import { FEATURED_CARD_SIZE } from './card/cardSizing';

interface RoyalCourtProps {
    royalDeck: RoyalCard[];
    phase: GamePhase | string;
    handleSelectRoyal: (card: RoyalCard) => void;
    theme: 'light' | 'dark';
    canInteract?: boolean;
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
}) => {
    const t = useT();
    const canSelectRoyal = isRoyalSelectionPhase(phase) && canInteract;
    const royalSlots = Array.from(
        { length: ROYAL_COURT_SLOT_COUNT },
        (_, index) => royalDeck[index] ?? null
    );

    return (
        <div
            className={`flex flex-col gap-4 items-center p-1 shrink-0 transition-all duration-500
            ${!canInteract ? 'opacity-70 pointer-events-none' : ''}
        `}
            style={{ width: ROYAL_COURT_GRID_SIZE.width }}
        >
            <h2
                className="mb-2 flex min-h-6 items-center justify-center gap-2.5 text-[13px] font-black uppercase tracking-[0.34em]"
                style={{
                    color: 'var(--gd-shell-gold-text)',
                    textShadow: 'var(--gd-shell-text-shadow)',
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
                        <div
                            key={card.id}
                            data-royal-card={card.id}
                            className={`relative ${canSelectRoyal ? 'cursor-pointer z-50' : ''}`}
                            onClick={() => canSelectRoyal && handleSelectRoyal(card)}
                        >
                            <Card
                                card={card as unknown as CardType}
                                isRoyal={true}
                                theme={theme}
                                size="featured"
                            />
                        </div>
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
                {royalDeck.length === 0 && (
                    <div
                        className="absolute inset-0 flex items-center justify-center text-xs italic"
                        style={{
                            color: 'var(--gd-shell-label-muted)',
                            textShadow: 'var(--gd-shell-text-shadow)',
                        }}
                    >
                        {t('royalCourt.empty')}
                    </div>
                )}
            </div>
        </div>
    );
};
