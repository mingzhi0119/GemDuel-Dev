import React from 'react';
import { Crown } from 'lucide-react';
import { Card } from './Card';
import { isRoyalSelectionPhase } from '@gemduel/shared/logic/fsm';
import { RoyalCard, GamePhase, Card as CardType } from '@gemduel/shared/types';
import { useT } from '../i18n/LocaleProvider';

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
            className={`flex flex-col gap-4 items-center p-5 rounded-[2rem] border backdrop-blur-md shrink-0 w-fit transition-all duration-500
            ${
                theme === 'dark'
                    ? 'bg-slate-800/70 border-slate-600 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.7),inset_0_1px_0_0_rgba(255,255,255,0.07)]'
                    : 'bg-white border-stone-300/80'
            }
            ${!canInteract ? 'opacity-70 pointer-events-none' : ''}
        `}
        >
            <h2
                className={`text-[13px] font-black uppercase tracking-[0.34em] flex items-center gap-2.5 mb-2
                ${theme === 'dark' ? 'text-yellow-300' : 'text-amber-800'}`}
            >
                <Crown size={18} /> {t('royalCourt.title')}
            </h2>
            <div className="grid grid-cols-2 gap-3">
                {royalDeck.length > 0 ? (
                    royalDeck.map((card) => (
                        <div
                            key={card.id}
                            className={`relative transition-all duration-300 ${canSelectRoyal ? 'cursor-pointer hover:scale-110 hover:rotate-1 z-50 ring-4 ring-yellow-400/50 rounded-lg shadow-xl' : 'opacity-80 grayscale-[0.2]'}`}
                            onClick={() => canSelectRoyal && handleSelectRoyal(card)}
                        >
                            <Card card={card as unknown as CardType} isRoyal={true} />
                            {canSelectRoyal && (
                                <div className="absolute -top-2 -right-2 bg-yellow-500 text-black text-[9px] font-black px-1.5 py-0.5 rounded-full animate-bounce shadow-lg">
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
