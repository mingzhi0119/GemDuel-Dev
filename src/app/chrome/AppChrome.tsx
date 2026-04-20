import React, { Suspense, type ChangeEventHandler } from 'react';
import { BookOpen, Download, Moon, RotateCcw, Sun, Upload } from 'lucide-react';
import type { ThemeName } from '../../types';

const DebugPanel = React.lazy(() =>
    import('../../components/DebugPanel').then((module) => ({ default: module.DebugPanel }))
);

interface AppChromeProps {
    theme: ThemeName;
    showDebug: boolean;
    canShowDebug: boolean;
    onToggleDebug: () => void;
    onDownloadReplay: () => void;
    onUploadReplay: ChangeEventHandler<HTMLInputElement>;
    onRequestRestart: () => void;
    onShowRulebook: () => void;
    onToggleTheme: () => void;
    onAddCrowns: (player: 'p1' | 'p2') => void;
    onAddPoints: (player: 'p1' | 'p2') => void;
    onAddPrivilege: (player: 'p1' | 'p2') => void;
    onForceRoyal: () => void;
    showDebugPanels: boolean;
}

export function AppChrome({
    theme,
    showDebug,
    canShowDebug,
    onToggleDebug,
    onDownloadReplay,
    onUploadReplay,
    onRequestRestart,
    onShowRulebook,
    onToggleTheme,
    onAddCrowns,
    onAddPoints,
    onAddPrivilege,
    onForceRoyal,
    showDebugPanels,
}: AppChromeProps) {
    return (
        <>
            <div className="fixed top-24 right-4 z-[200] flex flex-col gap-1.5">
                <div className="flex flex-col gap-2 border-y border-stone-200/30 py-2 my-1">
                    <button
                        onClick={onDownloadReplay}
                        className={`p-2 rounded-lg backdrop-blur-md border flex items-center gap-2 transition-all justify-center shadow-none 
                        ${theme === 'dark' ? 'bg-slate-900/70 hover:bg-slate-800/90 text-slate-200 hover:text-white border-slate-600 hover:border-slate-500 shadow-[0_6px_20px_rgba(0,0,0,0.35)]' : 'bg-white/95 hover:bg-stone-50 text-stone-700 border-stone-300'}`}
                        title="Download Replay"
                        aria-label="Download Replay"
                    >
                        <Download size={16} />
                        <span className="text-[10px] font-bold hidden md:inline">Save</span>
                    </button>

                    <label
                        className={`p-2 rounded-lg backdrop-blur-md border flex items-center gap-2 transition-all justify-center cursor-pointer shadow-none 
                        ${theme === 'dark' ? 'bg-slate-900/70 hover:bg-slate-800/90 text-slate-200 hover:text-white border-slate-600 hover:border-slate-500 shadow-[0_6px_20px_rgba(0,0,0,0.35)]' : 'bg-white/95 hover:bg-stone-50 text-stone-700 border-stone-300'}`}
                        title="Upload Replay"
                        aria-label="Upload Replay"
                    >
                        <Upload size={16} />
                        <span className="text-[10px] font-bold hidden md:inline">Load</span>
                        <input
                            type="file"
                            accept=".json"
                            onChange={onUploadReplay}
                            className="hidden"
                        />
                    </label>
                </div>

                <button
                    onClick={onRequestRestart}
                    className={`p-2 rounded-lg backdrop-blur-md border flex items-center gap-2 transition-all justify-center shadow-none 
                    ${theme === 'dark' ? 'bg-red-950/50 hover:bg-red-900/70 text-red-200 hover:text-white border-red-700/60 hover:border-red-500/70 shadow-[0_6px_20px_rgba(69,10,10,0.35)]' : 'bg-red-50 hover:bg-red-100 text-red-800 border-red-300'}`}
                    aria-label="Restart Game"
                >
                    <RotateCcw size={16} />
                    <span className="text-xs font-bold hidden md:inline">Restart</span>
                </button>

                <button
                    onClick={onShowRulebook}
                    className={`p-2 rounded-lg backdrop-blur-md border flex items-center gap-2 transition-all justify-center shadow-none 
                    ${theme === 'dark' ? 'bg-slate-900/70 hover:bg-slate-800/90 text-slate-200 hover:text-white border-slate-600 hover:border-slate-500 shadow-[0_6px_20px_rgba(0,0,0,0.35)]' : 'bg-white/95 hover:bg-stone-50 text-stone-800 border-stone-300'}`}
                    aria-label="Open Rules"
                >
                    <BookOpen size={16} />
                    <span className="text-xs font-bold hidden md:inline">Rules</span>
                </button>

                <button
                    onClick={onToggleTheme}
                    className={`p-2 rounded-lg backdrop-blur-md border flex items-center gap-2 transition-all justify-center shadow-none 
                    ${theme === 'dark' ? 'bg-slate-900/70 hover:bg-slate-800/90 text-slate-200 hover:text-white border-slate-600 hover:border-slate-500 shadow-[0_6px_20px_rgba(0,0,0,0.35)]' : 'bg-white/95 hover:bg-stone-50 text-stone-800 border-stone-300'}`}
                    aria-label="Toggle Theme"
                >
                    {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
                    <span className="text-xs font-bold hidden md:inline">
                        {theme === 'dark' ? 'Dark' : 'Light'}
                    </span>
                </button>
            </div>

            {canShowDebug && (
                <button
                    onClick={onToggleDebug}
                    className={`fixed top-24 left-4 z-[100] p-2 rounded border text-[10px] transition-colors shadow-none 
                    ${theme === 'dark' ? 'bg-slate-900/70 hover:bg-slate-800/90 text-slate-200 hover:text-white border-slate-600 hover:border-slate-500 shadow-[0_6px_20px_rgba(0,0,0,0.35)]' : 'bg-white/90 hover:bg-stone-100 text-stone-700 border-stone-300'}`}
                >
                    {showDebug ? 'CLOSE DEBUG' : 'OPEN DEBUG'}
                </button>
            )}

            {showDebugPanels && (
                <Suspense fallback={null}>
                    <div className="fixed left-4 top-36 z-[90] flex flex-col gap-4 animate-in slide-in-from-left duration-300">
                        <DebugPanel
                            player="p1"
                            onAddCrowns={() => onAddCrowns('p1')}
                            onAddPoints={() => onAddPoints('p1')}
                            onAddPrivilege={() => onAddPrivilege('p1')}
                            onForceRoyal={onForceRoyal}
                            theme={theme}
                        />
                        <DebugPanel
                            player="p2"
                            onAddCrowns={() => onAddCrowns('p2')}
                            onAddPoints={() => onAddPoints('p2')}
                            onAddPrivilege={() => onAddPrivilege('p2')}
                            onForceRoyal={onForceRoyal}
                            theme={theme}
                        />
                    </div>
                </Suspense>
            )}
        </>
    );
}
