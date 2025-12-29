import React from 'react';
import { Check, RefreshCw, X, Eye } from 'lucide-react';
import { GamePhase, BagItem, Buff, GemCoord } from '../types';

interface GameActionsProps {
    handleReplenish: () => void;
    bag?: BagItem[];
    phase: GamePhase | string;
    handleConfirmTake: () => void;
    selectedGems?: GemCoord[];
    handleCancelReserve: () => void;
    handleCancelPrivilege: () => void;
    theme: 'light' | 'dark';
    canInteract?: boolean;
    activeBuff?: Buff;
    onPeekDeck?: (level: 1 | 2 | 3) => void;
}

export const GameActions: React.FC<GameActionsProps> = ({
    handleReplenish,
    bag = [],
    phase,
    handleConfirmTake,
    selectedGems = [],
    handleCancelReserve,
    handleCancelPrivilege,
    theme,
    canInteract = true,
    activeBuff,
    onPeekDeck,
}) => {
    const bagCount = bag ? bag.length : 0;
    const selectedCount = selectedGems ? selectedGems.length : 0;

    // Buff Action: Peek Deck (Intelligence)
    const hasIntelligence = activeBuff?.effects?.active === 'peek_deck';

    return (
        <div
            className={`flex flex-col gap-4 items-center mt-4 z-50 ${!canInteract ? 'opacity-50 pointer-events-none' : ''}`}
        >
            {(phase === 'RESERVE_WAITING_GEM' || phase === 'PRIVILEGE_ACTION') && (
                <div className="flex gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <button
                        onClick={
                            phase === 'RESERVE_WAITING_GEM'
                                ? handleCancelReserve
                                : handleCancelPrivilege
                        }
                        className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-rose-900/20 transition-all active:scale-95"
                    >
                        <X size={18} /> Cancel
                    </button>
                </div>
            )}

            {phase === 'IDLE' && (
                <div className="flex flex-wrap justify-center gap-2 animate-in fade-in duration-500">
                    {/* Confirm Selection (Get Gem) */}
                    {selectedCount > 0 && (
                        <button
                            onClick={handleConfirmTake}
                            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-full font-bold shadow-lg shadow-emerald-900/20 transition-all active:scale-95 animate-in fade-in slide-in-from-left-4 duration-300"
                        >
                            <Check size={18} /> Confirm
                        </button>
                    )}

                    {/* Replenish Board */}
                    <button
                        onClick={handleReplenish}
                        disabled={bagCount === 0 || phase !== 'IDLE' || selectedCount > 0}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all border active:scale-95
                            ${
                                bagCount > 0 && phase === 'IDLE' && selectedCount === 0
                                    ? theme === 'dark'
                                        ? 'bg-slate-800 border-slate-600 text-slate-200 hover:bg-slate-700'
                                        : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                                    : (theme === 'dark'
                                          ? 'bg-slate-900/20 border-slate-800/50 text-slate-700'
                                          : 'bg-slate-100/50 border-slate-200/50 text-slate-400') +
                                      ' cursor-default opacity-50'
                            }`}
                    >
                        <RefreshCw size={16} />
                        Refill ({bagCount})
                    </button>

                    {/* Buff Active Actions */}
                    {hasIntelligence && phase === 'IDLE' && selectedCount === 0 && onPeekDeck && (
                        <div className="flex gap-2">
                            {([1, 2, 3] as const).map((lvl) => (
                                <button
                                    key={lvl}
                                    onClick={() => onPeekDeck(lvl)}
                                    className="flex items-center gap-1.5 bg-purple-600/20 hover:bg-purple-600/40 text-purple-400 border border-purple-500/30 px-3 py-2 rounded-full text-xs font-bold transition-all shadow-lg active:scale-95"
                                >
                                    <Eye size={14} /> Peek L{lvl}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
