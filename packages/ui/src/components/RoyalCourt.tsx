import React from 'react';
import { Crown } from 'lucide-react';
import { Card } from './Card';
import { isRoyalSelectionPhase } from '@gemduel/shared/logic/fsm';
import { RoyalCard, GamePhase, Card as CardType } from '@gemduel/shared/types';
import { useT } from '../i18n/LocaleProvider';
import { LexiconTerm } from '../lexicon/LexiconTerm';

interface RoyalCourtProps {
    royalDeck: RoyalCard[];
    phase: GamePhase | string;
    handleSelectRoyal: (card: RoyalCard) => void;
    theme: 'light' | 'dark';
    canInteract?: boolean;
}

export const RoyalCourt: React.FC<RoyalCourtProps> = ({
    royalDeck,
    phase,
    handleSelectRoyal,
    theme,
    canInteract = true,
}) => {
    const t = useT();
    const canSelectRoyal = isRoyalSelectionPhase(phase) && canInteract;

    return (
        <div
            className={`flex flex-col gap-4 items-center p-1 shrink-0 w-fit transition-all duration-500
            ${!canInteract ? 'opacity-70 pointer-events-none' : ''}
        `}
        >
            <h2
                className={`text-[13px] font-black uppercase tracking-[0.34em] flex items-center gap-2.5 mb-2
                ${theme === 'dark' ? 'text-yellow-300' : 'text-amber-800'}`}
            >
                <Crown size={18} />{' '}
                <LexiconTerm termId="royal" className="normal-case" underline={false}>
                    {t('royalCourt.title')}
                </LexiconTerm>
            </h2>
            <div className="grid grid-cols-2 gap-4">
                {royalDeck.length > 0 ? (
                    royalDeck.map((card) => (
                        <div
                            key={card.id}
                            className={`relative ${canSelectRoyal ? 'cursor-pointer z-50' : ''}`}
                            onClick={() => canSelectRoyal && handleSelectRoyal(card)}
                        >
                            <Card
                                card={card as unknown as CardType}
                                isRoyal={true}
                                theme={theme}
                                size="featured"
                            />
                            {canSelectRoyal && (
                                <div className="absolute -top-2 -right-2 bg-yellow-500 text-black text-[9px] font-black px-1.5 py-0.5 rounded-full animate-bounce">
                                    {t('royalCourt.pick')}
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div
                        className={`col-span-2 h-64 flex items-center justify-center italic text-xs
                        ${theme === 'dark' ? 'text-slate-400' : 'text-stone-600'}`}
                    >
                        {t('royalCourt.empty')}
                    </div>
                )}
            </div>
        </div>
    );
};
