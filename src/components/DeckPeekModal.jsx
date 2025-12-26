import React from 'react';
import { X, Eye } from 'lucide-react';
import { Card } from './Card';

export const DeckPeekModal = ({ isOpen, data, onClose, theme }) => {
    if (!isOpen || !data) return null;

    const { cards, level } = data;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className={`relative w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border
                ${theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}
            `}>
                {/* Header */}
                <div className={`flex items-center justify-between p-6 border-b
                    ${theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}
                `}>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-500/20 rounded-lg text-purple-500">
                            <Eye size={24} />
                        </div>
                        <div>
                            <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                                Intelligence Network
                            </h2>
                            <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">
                                Peeking at Level {level} Deck (Top 3 Cards)
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className={`p-2 rounded-full transition-colors
                            ${theme === 'dark' ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-200 text-slate-500'}
                        `}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Cards Grid */}
                <div className="p-8 flex flex-wrap justify-center gap-4 bg-opacity-50">
                    {cards.length === 0 ? (
                        <div className="text-slate-500 italic py-8">No cards left in this deck.</div>
                    ) : (
                        cards.map((card, idx) => (
                            <div key={idx} className="relative group">
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-0.5 rounded-full z-10 shadow-lg border border-slate-600">
                                    {idx + 1}
                                </div>
                                <Card 
                                    card={card} 
                                    canBuy={false} // Just viewing
                                    theme={theme}
                                />
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                <div className={`p-4 border-t text-center
                    ${theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}
                `}>
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold rounded-full transition-colors"
                    >
                        Close & Continue
                    </button>
                </div>
            </div>
        </div>
    );
};