import React from 'react';
import { RefreshCw, ShoppingBag, X, Undo2 } from 'lucide-react';

export const GameActions = ({
    handleUndo,
    historyStack,
    handleReplenish,
    bag,
    gameMode,
    handleConfirmTake,
    selectedGems,
    handleCancelReserve,
    handleSkipAction
}) => {
    return (
        <div className="flex gap-2 mt-4 w-full justify-center">
            <button
                onClick={handleUndo}
                disabled={historyStack.length === 0}
                className={`p-3 rounded-xl border transition-colors shadow-lg flex items-center justify-center
                    ${historyStack.length > 0
                        ? 'bg-slate-800 border-slate-600 text-slate-200 hover:border-yellow-500 hover:text-yellow-500'
                        : 'bg-slate-900/50 border-slate-800 text-slate-700 cursor-not-allowed'}
                `}
            >
                <Undo2 size={20} />
            </button>

            <button onClick={handleReplenish} className="p-3 rounded-xl bg-slate-700 hover:bg-slate-600 transition-colors shadow-lg">
                <RefreshCw size={20} className={bag.length === 0 ? "text-slate-500" : "text-white"} />
            </button>
            
            {gameMode === 'IDLE' && (
                <button onClick={handleConfirmTake} disabled={selectedGems.length === 0} className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold shadow-xl transition-all ${selectedGems.length > 0 ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:brightness-110' : 'bg-slate-800 text-slate-600'}`}>
                    <ShoppingBag size={18} /> Take
                </button>
            )}
            
            {(['PRIVILEGE_ACTION', 'STEAL_ACTION', 'BONUS_ACTION', 'SELECT_ROYAL'].includes(gameMode)) && (
                <button onClick={handleSkipAction} className="flex-1 bg-slate-600 text-white px-6 py-3 rounded-xl font-bold shadow-xl hover:bg-slate-500 flex items-center justify-center gap-2">
                    <X size={18} /> Skip Action
                </button>
            )}

            {gameMode === 'RESERVE_WAITING_GEM' && (
                <button onClick={handleCancelReserve} className="flex-1 bg-rose-600 text-white px-6 py-3 rounded-xl font-bold shadow-xl hover:bg-rose-500 flex items-center justify-center gap-2">
                    <X size={18} /> Cancel
                </button>
            )}
        </div>
    );
};
