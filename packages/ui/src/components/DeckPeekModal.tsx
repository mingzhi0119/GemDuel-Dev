import React from 'react';
import { X } from 'lucide-react';
import { Card } from './Card';
import { Card as CardType } from '@gemduel/shared/types';
import { useT } from '../i18n/LocaleProvider';

interface DeckPeekModalProps {
    isOpen: boolean;
    cards: CardType[] | null;
    onClose: () => void;
    theme: 'light' | 'dark';
}

export const DeckPeekModal: React.FC<DeckPeekModalProps> = ({ isOpen, cards, onClose, theme }) => {
    const t = useT();
    if (!isOpen || !cards) return null;

    return (
        <div className="absolute inset-0 z-[150] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Modal */}
            <div
                className={`relative flex max-h-[88%] min-h-[520px] w-[min(92vw,1500px)] flex-col overflow-hidden rounded-[2rem] border shadow-2xl animate-in zoom-in-95 duration-300
                ${theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-stone-200'}
            `}
            >
                {/* Header */}
                <div
                    className={`flex items-center justify-between border-b px-7 py-5
                    ${theme === 'dark' ? 'border-slate-800' : 'border-stone-100'}
                `}
                >
                    <h2
                        className={`text-2xl font-black uppercase tracking-wider ${theme === 'dark' ? 'text-white' : 'text-stone-800'}`}
                    >
                        {t('deckPeek.title')}
                    </h2>
                    <button
                        onClick={onClose}
                        aria-label={t('deckPeek.close')}
                        className={`p-2 rounded-full transition-colors ${theme === 'dark' ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-stone-100 text-stone-400'}`}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex min-h-[360px] flex-1 flex-wrap items-center justify-center gap-8 overflow-y-auto p-10">
                    {cards.length > 0 ? (
                        cards.map((card, i) => (
                            <div
                                key={card.id || i}
                                className="animate-in slide-in-from-bottom-4 duration-500"
                                style={{ animationDelay: `${i * 100}ms` }}
                            >
                                <Card card={card} canBuy={false} theme={theme} size="large" />
                            </div>
                        ))
                    ) : (
                        <div
                            className={`h-48 flex items-center justify-center italic ${theme === 'dark' ? 'text-slate-500' : 'text-stone-400'}`}
                        >
                            {t('deckPeek.empty')}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div
                    className={`p-4 border-t flex justify-end
                    ${theme === 'dark' ? 'border-slate-800 bg-slate-950/30' : 'border-stone-100 bg-[#fdfbf7]'}`}
                >
                    <button
                        onClick={onClose}
                        className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-2.5 rounded-xl font-black uppercase tracking-widest text-xs transition-all active:scale-95 shadow-lg shadow-purple-900/20"
                    >
                        {t('deckPeek.done')}
                    </button>
                </div>
            </div>
        </div>
    );
};
