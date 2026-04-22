import React from 'react';
import { PlayerKey } from '@gemduel/shared/types';
import { useT } from '../i18n/LocaleProvider';

interface DebugPanelProps {
    player: PlayerKey;
    onAddCrowns: () => void;
    onAddPoints: () => void;
    onAddPrivilege: () => void;
    onForceRoyal: () => void;
    theme: 'light' | 'dark';
}

export function DebugPanel({
    player,
    onAddCrowns,
    onAddPoints,
    onAddPrivilege,
    onForceRoyal,
    theme,
}: DebugPanelProps) {
    const t = useT();

    return (
        <div
            className={`p-3 rounded-lg backdrop-blur-md shadow-2xl w-48 transition-colors duration-500
      ${
          theme === 'dark'
              ? 'bg-slate-900/90 border-2 border-red-900/50'
              : 'bg-white/90 border-2 border-red-300/80'
      }
    `}
        >
            <div
                className={`font-bold text-[10px] mb-2 uppercase tracking-tighter border-b pb-1 transition-colors duration-500
        ${theme === 'dark' ? 'text-red-500 border-red-900/30' : 'text-red-600 border-red-200'}
      `}
            >
                {t('debug.title', { player: player.toUpperCase() })}
            </div>
            <div className="flex flex-col gap-2">
                <button
                    onClick={onAddCrowns}
                    className={`text-[9px] py-1 rounded border transition-colors text-left px-2
          ${theme === 'dark' ? 'bg-slate-800 hover:bg-slate-700 text-white border-slate-600' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'}
        `}
                >
                    {t('debug.addCrown')}
                </button>
                <button
                    onClick={onAddPoints}
                    className={`text-[9px] py-1 rounded border transition-colors text-left px-2
          ${theme === 'dark' ? 'bg-slate-800 hover:bg-slate-700 text-white border-slate-600' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'}
        `}
                >
                    {t('debug.addPoint')}
                </button>
                <button
                    onClick={onAddPrivilege}
                    className={`text-[9px] py-1 rounded border transition-colors text-left px-2
          ${theme === 'dark' ? 'bg-slate-800 hover:bg-slate-700 text-white border-slate-600' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'}
        `}
                >
                    {t('debug.addPrivilege')}
                </button>
                <button
                    onClick={onForceRoyal}
                    className={`text-[9px] py-1 rounded border transition-colors font-bold
          ${theme === 'dark' ? 'bg-red-900/40 hover:bg-red-800/60 text-red-200 border-red-700' : 'bg-red-100 hover:bg-red-200 text-red-700 border-red-300'}
        `}
                >
                    {t('debug.forceRoyal')}
                </button>
            </div>
        </div>
    );
}
