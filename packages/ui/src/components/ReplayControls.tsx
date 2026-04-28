import React from 'react';
import { GameGlyph } from './GameGlyph';
import { useT } from '../i18n/LocaleProvider';

interface ReplayControlsProps {
    undo: () => void;
    redo: () => void;
    canUndo: boolean;
    canRedo: boolean;
    currentIndex: number;
    historyLength: number;
    theme: 'light' | 'dark';
}

export const ReplayControls: React.FC<ReplayControlsProps> = ({
    undo,
    redo,
    canUndo,
    canRedo,
    currentIndex,
    historyLength,
    theme,
}) => {
    const t = useT();
    const safeIndex = Math.min(currentIndex, historyLength - 1);
    const currentStep = historyLength === 0 ? 0 : safeIndex + 1;

    return (
        <div className="flex items-center gap-4 transition-all duration-500">
            <button
                onClick={undo}
                disabled={!canUndo}
                aria-label={t('replay.stepBackward')}
                data-replay-control="undo"
                className={`p-3 rounded-xl border transition-all flex items-center justify-center
                    ${
                        canUndo
                            ? (theme === 'dark'
                                  ? 'bg-slate-800 border-slate-600 text-slate-200 hover:bg-slate-800/80'
                                  : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200') +
                              ' hover:border-amber-500 hover:text-amber-500 hover:shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                            : (theme === 'dark'
                                  ? 'bg-slate-900/40 border-slate-700 text-slate-400'
                                  : 'bg-slate-100/60 border-slate-300 text-slate-500') +
                              ' cursor-not-allowed'
                    }
                `}
            >
                <GameGlyph variant="replay-back" size={26} />
            </button>

            <div className="flex flex-col items-center min-w-[5.25rem]">
                <span
                    className="mb-0.5 text-[13px] font-bold uppercase tracking-widest"
                    style={{
                        color: 'var(--gd-shell-label-muted)',
                        textShadow: 'var(--gd-shell-text-shadow)',
                    }}
                >
                    {t('replay.action')}
                </span>
                <span
                    data-replay-step-counter="true"
                    data-current-step={currentStep}
                    data-history-length={historyLength}
                    className="font-mono text-[21px] font-bold tabular-nums"
                    style={{
                        color: 'var(--gd-shell-action-text)',
                        textShadow: 'var(--gd-shell-text-shadow)',
                    }}
                >
                    {currentStep}{' '}
                    <span className="mx-1" style={{ color: 'var(--gd-shell-label-muted)' }}>
                        /
                    </span>{' '}
                    {historyLength}
                </span>
            </div>

            <button
                onClick={redo}
                disabled={!canRedo}
                aria-label={t('replay.stepForward')}
                data-replay-control="redo"
                className={`p-3 rounded-xl border transition-all flex items-center justify-center
                    ${
                        canRedo
                            ? (theme === 'dark'
                                  ? 'bg-slate-800 border-slate-600 text-slate-200 hover:bg-slate-800/80'
                                  : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200') +
                              ' hover:border-cyan-500 hover:text-cyan-500 hover:shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                            : (theme === 'dark'
                                  ? 'bg-slate-900/40 border-slate-700 text-slate-400'
                                  : 'bg-slate-100/60 border-slate-300 text-slate-500') +
                              ' cursor-not-allowed'
                    }
                `}
            >
                <GameGlyph variant="replay-forward" size={26} />
            </button>
        </div>
    );
};
