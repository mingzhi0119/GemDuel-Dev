import React from 'react';
import { Check, RefreshCw, X, Eye } from 'lucide-react';
import { GamePhase, BagItem, Buff } from '../types';

interface GameActionsProps {
    handleReplenish: () => void;
    bag?: BagItem[];
    phase: GamePhase | string;
    handleConfirmTake: () => void;
    selectedGems?: any[];
    handleCancelReserve: () => void;
    handleCancelPrivilege: () => void;
    theme: 'light' | 'dark';
    canInteract?: boolean;
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
}) => {
    const bagCount = bag ? bag.length : 0;
    const selectedCount = selectedGems ? selectedGems.length : 0;

    return (
        <div
            className={`flex flex-col gap-4 items-center mt-4 z-50 ${!canInteract ? 'opacity-50 pointer-events-none' : ''}`}
        >
            {/* Game Action Buttons */}
            {phase === 'RESERVE_WAITING_GEM' ? (
                // Cancel Reserve Mode - replaces other buttons
                <button
                    onClick={handleCancelReserve}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-6 py-2 rounded-full font-bold shadow-lg transition-all hover:-translate-y-0.5 active:scale-95"
                >
                    <X size={20} />
                    Cancel Reserve
                </button>
            ) : phase === 'PRIVILEGE_ACTION' ? (
                <button
                    onClick={handleCancelPrivilege}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-6 py-2 rounded-full font-bold shadow-lg transition-all hover:-translate-y-0.5 active:scale-95"
                >
                    <X size={20} />
                    Cancel Privilege
                </button>
            ) : (
                // Normal game actions
                <div className="flex gap-3">
                    {/* Confirm Take Gems */}
                    {selectedCount > 0 && (
                        <button
                            onClick={handleConfirmTake}
                            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-full font-bold shadow-lg transition-all animate-in fade-in zoom-in hover:-translate-y-0.5 active:scale-95 active:translate-y-0"
                        >
                            <Check size={20} />
                            Take {selectedCount} Gem{selectedCount > 1 ? 's' : ''}
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
                </div>
            )}
        </div>
    );
};
