import React from 'react';
import { Check, RefreshCw, X, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { canActionRunInPhase } from '@gemduel/shared/logic/fsm';
import { GamePhase, BagItem, Buff, GemCoord } from '@gemduel/shared/types';

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
    const showReserveCancel = canActionRunInPhase('CANCEL_RESERVE', phase);
    const showPrivilegeCancel = canActionRunInPhase('CANCEL_PRIVILEGE', phase);
    const showCancel = showReserveCancel || showPrivilegeCancel;
    const showConfirm = canActionRunInPhase('TAKE_GEMS', phase) && selectedCount > 0;
    const showRefill = canActionRunInPhase('REPLENISH', phase) && selectedCount === 0;

    return (
        <div
            className={`flex flex-col gap-4 items-center z-50 justify-start ${!canInteract ? 'opacity-50 pointer-events-none' : ''}`}
        >
            <div className="flex min-h-[48px] items-center justify-center">
                <AnimatePresence mode="wait" initial={false}>
                    {showCancel ? (
                        <motion.button
                            key="cancel"
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.96 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={
                                showReserveCancel ? handleCancelReserve : handleCancelPrivilege
                            }
                            className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-rose-900/20 transition-colors"
                        >
                            <X size={18} /> Cancel
                        </motion.button>
                    ) : showConfirm ? (
                        <motion.button
                            key="confirm"
                            initial={{ opacity: 0, scale: 0.88 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.88 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleConfirmTake}
                            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-full font-bold shadow-lg shadow-emerald-900/20 transition-colors"
                        >
                            <Check size={18} /> Confirm
                        </motion.button>
                    ) : showRefill ? (
                        <motion.button
                            key="refill"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            whileTap={selectedCount === 0 && bagCount > 0 ? { scale: 0.95 } : {}}
                            onClick={handleReplenish}
                            disabled={bagCount === 0 || selectedCount > 0}
                            className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold text-base transition-all duration-300 border
                            ${
                                bagCount > 0 && selectedCount === 0
                                    ? theme === 'dark'
                                        ? 'bg-slate-800 border-slate-600 text-slate-200 hover:bg-slate-700'
                                        : 'bg-white border-stone-300 text-stone-800 shadow-sm hover:border-stone-400 active:bg-stone-100'
                                    : (theme === 'dark'
                                          ? 'bg-slate-900/20 border-slate-800/50 text-slate-700'
                                          : 'bg-stone-100/50 border-stone-200/50 text-stone-400') +
                                      ' cursor-default opacity-50'
                            }`}
                        >
                            <RefreshCw size={18} />
                            Refill ({bagCount})
                        </motion.button>
                    ) : null}
                </AnimatePresence>
            </div>
        </div>
    );
};
