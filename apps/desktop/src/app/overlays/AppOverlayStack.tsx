import React, { Suspense, useEffect, useId, useRef } from 'react';
import { ArrowLeft, RotateCcw, Users } from 'lucide-react';
import { GEM_TYPES, BONUS_COLORS } from '@gemduel/shared/constants';
import { getGemLabel } from '@gemduel/shared';
import { isBonusColorSelectionPhase } from '@gemduel/shared/logic/fsm';
import type { GamePhase, GemColor, PlayerKey } from '@gemduel/shared/types';
import type { ThemeName } from '@gemduel/shared/types';
import { GemIcon } from '@gemduel/ui/components/GemIcon';
import { useLocale, useT } from '@gemduel/ui/i18n/LocaleProvider';
import { LexiconTerm } from '@gemduel/ui/lexicon/LexiconTerm';

const Rulebook = React.lazy(() =>
    import('@gemduel/ui/components/Rulebook').then((module) => ({ default: module.Rulebook }))
);
const WinnerModal = React.lazy(() =>
    import('@gemduel/ui/components/WinnerModal').then((module) => ({ default: module.WinnerModal }))
);

interface AppOverlayStackProps {
    theme: ThemeName;
    showRulebook: boolean;
    persistentWinner: PlayerKey | null;
    isReviewing: boolean;
    showRestartConfirm: boolean;
    phase: GamePhase;
    isPeekingBoard: boolean;
    onCloseRulebook: () => void;
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
    persistentWinner,
    isReviewing,
    showRestartConfirm,
    phase,
    isPeekingBoard,
    onCloseRulebook,
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
    const restartDialogTitleId = useId();
    const restartDialogRef = useRef<HTMLDivElement | null>(null);
    const cancelRestartButtonRef = useRef<HTMLButtonElement | null>(null);

    useEffect(() => {
        if (!showRestartConfirm) {
            return undefined;
        }

        const previouslyFocused = document.activeElement as HTMLElement | null;
        cancelRestartButtonRef.current?.focus();

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                onCancelRestart();
                return;
            }

            if (event.key !== 'Tab') {
                return;
            }

            const focusableButtons = Array.from(
                restartDialogRef.current?.querySelectorAll<HTMLButtonElement>(
                    'button:not(:disabled)'
                ) ?? []
            );

            if (focusableButtons.length === 0) {
                return;
            }

            const firstButton = focusableButtons[0];
            const lastButton = focusableButtons[focusableButtons.length - 1];
            const activeElement = document.activeElement;

            if (event.shiftKey && activeElement === firstButton) {
                event.preventDefault();
                lastButton.focus();
            } else if (!event.shiftKey && activeElement === lastButton) {
                event.preventDefault();
                firstButton.focus();
            }
        };

        window.addEventListener('keydown', handleKeyDown, true);
        return () => {
            window.removeEventListener('keydown', handleKeyDown, true);
            previouslyFocused?.focus?.();
        };
    }, [onCancelRestart, showRestartConfirm]);

    return (
        <>
            <Suspense fallback={<div className="absolute inset-0 z-[200] bg-black/50" />}>
                {showRulebook && <Rulebook onClose={onCloseRulebook} theme={theme} />}
            </Suspense>

            {persistentWinner && !isReviewing && (
                <Suspense fallback={null}>
                    <WinnerModal winner={persistentWinner} onReview={onStartReview} />
                </Suspense>
            )}

            {isBonusColorSelectionPhase(phase) && !isReviewing && (
                <div
                    className={`absolute inset-0 z-[100] transition-all duration-500 flex flex-col items-center justify-center ${isPeekingBoard ? 'bg-black/20 pointer-events-none' : 'bg-black/80'}`}
                >
                    {!isPeekingBoard ? (
                        <>
                            <h2 className="text-2xl font-black text-white mb-6 uppercase tracking-widest animate-in fade-in zoom-in">
                                {locale === 'zh' ? (
                                    <>
                                        选择{' '}
                                        <LexiconTerm termId="cardColor" className="normal-case">
                                            卡牌颜色
                                        </LexiconTerm>
                                    </>
                                ) : (
                                    <>
                                        Select{' '}
                                        <LexiconTerm termId="cardColor" className="normal-case">
                                            Card Color
                                        </LexiconTerm>
                                    </>
                                )}
                            </h2>
                            <div className="flex flex-wrap justify-center gap-4 p-6 bg-white/5 rounded-3xl backdrop-blur-md border border-white/10 shadow-2xl animate-in slide-in-from-bottom-4 md:flex-nowrap md:gap-5 md:p-8">
                                {BONUS_COLORS.map((color) => (
                                    <button
                                        key={color}
                                        onClick={() => onSelectBonusColor(color)}
                                        data-bonus-color={color}
                                        className="h-20 w-20 rounded-full transition-all hover:scale-110 active:scale-95 md:h-24 md:w-24"
                                        aria-label={t('overlays.selectColor', {
                                            color: getGemLabel(color, locale),
                                        })}
                                    >
                                        <GemIcon
                                            type={
                                                GEM_TYPES[
                                                    color.toUpperCase() as keyof typeof GEM_TYPES
                                                ]
                                            }
                                            size="w-full h-full"
                                            theme={theme}
                                            variant="choice"
                                        />
                                    </button>
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
                        className="flex items-center gap-4 bg-slate-800 hover:bg-slate-700 text-white px-12 py-6 rounded-full text-4xl font-bold shadow-2xl border-2 border-slate-600 transition-all hover:scale-105"
                    >
                        <RotateCcw size={36} /> {t('overlays.returnToResults')}
                    </button>
                </div>
            )}

            {showRestartConfirm && (
                <div className="absolute inset-0 z-[300] bg-black/80 backdrop-blur-sm flex items-center justify-center animate-in fade-in">
                    <div
                        ref={restartDialogRef}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby={restartDialogTitleId}
                        className="max-h-[calc(100vh-96px)] w-[min(88vw,1344px)] overflow-auto rounded-[48px] border border-slate-700 bg-slate-900 p-12 text-center shadow-2xl lg:p-24"
                    >
                        <h3
                            id={restartDialogTitleId}
                            className="mb-6 text-4xl font-bold text-white lg:text-6xl"
                        >
                            {t('overlays.restartTitle')}
                        </h3>
                        <p className="mb-16 text-2xl text-slate-300 lg:text-4xl">
                            {t('overlays.restartBody')}
                        </p>
                        <div className="flex flex-wrap justify-center gap-8 lg:gap-12">
                            <button
                                ref={cancelRestartButtonRef}
                                type="button"
                                data-app-restart-cancel="true"
                                onClick={onCancelRestart}
                                className="rounded-3xl bg-slate-800 px-12 py-6 text-2xl font-semibold text-white transition-colors hover:bg-slate-700 lg:px-[4.5rem] lg:py-7 lg:text-4xl"
                            >
                                {t('actions.cancel')}
                            </button>
                            <button
                                type="button"
                                data-app-restart-confirm="true"
                                onClick={onConfirmRestart}
                                className="rounded-3xl bg-red-600 px-12 py-6 text-2xl font-semibold text-white shadow-lg shadow-red-900/20 transition-all hover:scale-105 hover:bg-red-500 lg:px-[4.5rem] lg:py-7 lg:text-4xl"
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
