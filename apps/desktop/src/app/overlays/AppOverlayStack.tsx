import React, { Suspense } from 'react';
import { ArrowLeft, RotateCcw, Users } from 'lucide-react';
import { GEM_TYPES, BONUS_COLORS } from '@gemduel/shared/constants';
import { getGemLabel } from '@gemduel/shared';
import { isBonusColorSelectionPhase } from '@gemduel/shared/logic/fsm';
import type { ActiveModal, GameMode, GamePhase, GemColor, PlayerKey } from '@gemduel/shared/types';
import type { ThemeName } from '@gemduel/shared/types';
import { useLocale, useT } from '@gemduel/ui/i18n/LocaleProvider';

const Rulebook = React.lazy(() =>
    import('@gemduel/ui/components/Rulebook').then((module) => ({ default: module.Rulebook }))
);
const DeckPeekModal = React.lazy(() =>
    import('@gemduel/ui/components/DeckPeekModal').then((module) => ({
        default: module.DeckPeekModal,
    }))
);
const WinnerModal = React.lazy(() =>
    import('@gemduel/ui/components/WinnerModal').then((module) => ({ default: module.WinnerModal }))
);

interface AppOverlayStackProps {
    theme: ThemeName;
    showRulebook: boolean;
    activeModal: ActiveModal | null;
    mode: GameMode;
    localPlayer: PlayerKey;
    persistentWinner: PlayerKey | null;
    isReviewing: boolean;
    showRestartConfirm: boolean;
    phase: GamePhase;
    isPeekingBoard: boolean;
    onCloseRulebook: () => void;
    onCloseModal: () => void;
    onStartReview: () => void;
    onStopReview: () => void;
    onCancelRestart: () => void;
    onConfirmRestart: () => void;
    onStartBoardPeek: () => void;
    onStopBoardPeek: () => void;
    onSelectBonusColor: (color: GemColor) => void;
}

export function AppOverlayStack({
    theme,
    showRulebook,
    activeModal,
    mode,
    localPlayer,
    persistentWinner,
    isReviewing,
    showRestartConfirm,
    phase,
    isPeekingBoard,
    onCloseRulebook,
    onCloseModal,
    onStartReview,
    onStopReview,
    onCancelRestart,
    onConfirmRestart,
    onStartBoardPeek,
    onStopBoardPeek,
    onSelectBonusColor,
}: AppOverlayStackProps) {
    const { locale } = useLocale();
    const t = useT();
    return (
        <>
            <Suspense fallback={<div className="absolute inset-0 z-[200] bg-black/50" />}>
                {showRulebook && <Rulebook onClose={onCloseRulebook} theme={theme} />}

                {activeModal?.type === 'PEEK' &&
                    (mode !== 'ONLINE_MULTIPLAYER' ||
                        activeModal.data?.initiator === localPlayer) && (
                        <DeckPeekModal
                            isOpen={true}
                            cards={activeModal.data.cards}
                            onClose={onCloseModal}
                            theme={theme}
                        />
                    )}
            </Suspense>

            {persistentWinner && !isReviewing && (
                <Suspense fallback={null}>
                    <WinnerModal winner={persistentWinner} onReview={onStartReview} />
                </Suspense>
            )}

            {isBonusColorSelectionPhase(phase) && (
                <div
                    className={`absolute inset-0 z-[100] transition-all duration-500 flex flex-col items-center justify-center ${isPeekingBoard ? 'bg-black/20 pointer-events-none' : 'bg-black/80'}`}
                >
                    {!isPeekingBoard ? (
                        <>
                            <h2 className="text-2xl font-black text-white mb-6 uppercase tracking-widest animate-in fade-in zoom-in">
                                {t('overlays.selectJokerColor')}
                            </h2>
                            <div className="flex gap-4 p-8 bg-white/5 rounded-3xl backdrop-blur-md border border-white/10 shadow-2xl animate-in slide-in-from-bottom-4">
                                {BONUS_COLORS.map((color) => (
                                    <button
                                        key={color}
                                        onClick={() => onSelectBonusColor(color)}
                                        className={`w-16 h-16 rounded-full bg-gradient-to-br ${GEM_TYPES[color.toUpperCase() as keyof typeof GEM_TYPES].color} border-2 border-white/50 shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:scale-110 active:scale-95 transition-all`}
                                        aria-label={t('overlays.selectColor', {
                                            color: getGemLabel(color, locale),
                                        })}
                                    />
                                ))}
                            </div>
                            <button
                                onClick={onStartBoardPeek}
                                className="mt-8 flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white font-bold border border-slate-600 transition-all hover:scale-105 active:scale-95"
                            >
                                <Users size={18} /> {t('overlays.viewBoard')}
                            </button>
                        </>
                    ) : (
                        <div className="absolute bottom-12 pointer-events-auto animate-in fade-in slide-in-from-bottom-8">
                            <button
                                onClick={onStopBoardPeek}
                                className="flex items-center gap-3 px-10 py-5 rounded-full bg-amber-600 hover:bg-amber-500 text-white font-black uppercase tracking-wider shadow-[0_0_30px_rgba(217,119,6,0.4)] transition-all hover:scale-110 active:scale-95"
                            >
                                <ArrowLeft size={24} /> {t('overlays.backToColorSelection')}
                            </button>
                        </div>
                    )}
                </div>
            )}

            {isReviewing && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-bottom-4">
                    <button
                        onClick={onStopReview}
                        className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-full font-bold shadow-2xl border border-slate-600 transition-all hover:scale-105"
                    >
                        <RotateCcw size={18} /> {t('overlays.returnToResults')}
                    </button>
                </div>
            )}

            {showRestartConfirm && (
                <div className="absolute inset-0 z-[300] bg-black/80 backdrop-blur-sm flex items-center justify-center animate-in fade-in">
                    <div className="bg-slate-900 border border-slate-700 p-8 rounded-2xl shadow-2xl max-w-md w-full text-center">
                        <h3 className="text-xl font-bold text-white mb-2">
                            {t('overlays.restartTitle')}
                        </h3>
                        <p className="text-slate-300 mb-8">{t('overlays.restartBody')}</p>
                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={onCancelRestart}
                                className="px-6 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors"
                            >
                                {t('actions.cancel')}
                            </button>
                            <button
                                onClick={onConfirmRestart}
                                className="px-6 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold shadow-lg shadow-red-900/20 transition-all hover:scale-105"
                            >
                                {t('overlays.confirmRestart')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
