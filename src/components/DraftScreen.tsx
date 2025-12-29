import React from 'react';
import { Sparkles, Crown, Shield, Swords, ArrowRight } from 'lucide-react';
import { BUFF_STYLES } from '../styles/buffs';
import { BUFFS } from '../constants'; // Import for reconstruction
import { Buff, PlayerKey } from '../types';

interface DraftScreenProps {
    draftPool: string[]; // IDs only
    p2DraftPool?: string[]; // IDs only
    p1SelectedBuff?: { id: string } | null;
    buffLevel: number;
    activePlayer: PlayerKey;
    onSelectBuff: (buffId: string) => void;
    theme: 'light' | 'dark';
    localPlayer?: PlayerKey;
    isOnline?: boolean;
}

export const DraftScreen: React.FC<DraftScreenProps> = ({
    draftPool,
    p2DraftPool = [],
    p1SelectedBuff = null,
    buffLevel,
    activePlayer,
    onSelectBuff,
    theme,
    localPlayer,
    isOnline = false,
}) => {
    const rawPool = (activePlayer === 'p1' ? draftPool : p2DraftPool) || [];
    console.log('[UI-DRAFT-SCREEN] Raw Pool IDs from State:', rawPool);

    // RECONSTRUCTION: Map basic sync data (IDs) back to full local constants
    const currentPool: Buff[] = rawPool.map((id) => {
        const fullData = Object.values(BUFFS).find((b) => b.id === id);
        return (fullData as Buff) || (BUFFS.NONE as Buff);
    });

    // RECONSTRUCTION: Also reconstruct p1SelectedBuff if it only contains an ID
    const fullP1Choice: Buff | null = p1SelectedBuff
        ? (Object.values(BUFFS).find((b) => b.id === p1SelectedBuff.id) as Buff) || null
        : null;

    const canInteract = !isOnline || activePlayer === localPlayer;

    return (
        <div
            className={`h-screen w-screen flex flex-col items-center justify-center relative overflow-hidden transition-colors duration-500
            ${theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'}
        `}
        >
            {/* Background Ambience */}
            <div
                className={`absolute inset-0 pointer-events-none opacity-20
                ${
                    theme === 'dark'
                        ? 'bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/40 via-slate-950 to-slate-950'
                        : 'bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-200/40 via-slate-100 to-slate-100'
                }
            `}
            />

            {/* Header */}
            <div className="z-10 text-center mb-6 animate-in slide-in-from-top-10 duration-700">
                <div className="flex items-center justify-center gap-3 mb-2">
                    <Sparkles className="text-amber-400" size={32} />
                    <h1 className="text-4xl font-black uppercase tracking-wider">
                        Roguelike Draft
                    </h1>
                    <Sparkles className="text-amber-400" size={32} />
                </div>
                <p className={`text-lg font-medium opacity-60`}>Level {buffLevel} Buff Selection</p>
            </div>

            {/* P1 Choice Context (Only for P2) */}

            {activePlayer === 'p2' && fullP1Choice && (
                <div className="z-10 mb-8 animate-in fade-in zoom-in duration-500">
                    <div
                        className={`px-6 py-4 rounded-2xl border-2 shadow-xl flex items-center gap-4 ${BUFF_STYLES[fullP1Choice.level || 1]} bg-opacity-40 backdrop-blur-md`}
                    >
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-60">
                                Player 1 Selected
                            </span>

                            <span className="text-xl font-black">{fullP1Choice.label}</span>
                        </div>

                        <div className="h-10 w-[2px] bg-white/20" />

                        <p className="text-sm max-w-[200px] opacity-80 leading-tight italic">
                            "{fullP1Choice.desc}"
                        </p>
                    </div>
                </div>
            )}

            {/* Active Player Indicator */}
            <div
                className={`z-10 mb-8 flex items-center gap-3 px-6 py-3 rounded-full border shadow-lg
                ${
                    activePlayer === 'p1'
                        ? 'bg-emerald-600/20 border-emerald-500 text-emerald-500'
                        : 'bg-blue-600/20 border-blue-500 text-blue-500'
                }
            `}
            >
                {activePlayer === 'p1' ? <Shield size={24} /> : <Swords size={24} />}
                <span className="text-xl font-bold uppercase">
                    {activePlayer === 'p1' ? 'Player 1: Pick 1 from 3' : 'Player 2: Pick 1 from 4'}
                </span>
            </div>

            {/* Buff Cards */}
            <div className="z-10 flex flex-wrap justify-center gap-6 max-w-7xl px-4">
                {currentPool.map((buff, idx) => (
                    <button
                        key={buff.id}
                        id={`buff-select-${buff.id}`}
                        name="buff-selection"
                        disabled={!canInteract}
                        onClick={() => canInteract && onSelectBuff(buff.id)}
                        className={`group relative flex flex-col w-64 h-80 p-5 rounded-2xl border-2 text-left transition-all duration-300 
                            ${canInteract ? 'hover:scale-105 hover:-translate-y-2 hover:shadow-2xl cursor-pointer' : 'opacity-50 cursor-default'}
                            ${BUFF_STYLES[buff.level]}
                            ${theme === 'dark' ? 'hover:shadow-purple-900/50' : 'hover:shadow-purple-200/50'}
                        `}
                        style={{ animationDelay: `${idx * 100}ms` }}
                    >
                        {/* Card Header */}
                        <div className="flex justify-between items-start mb-3">
                            <div className="p-2 rounded-xl bg-white/10 backdrop-blur-sm">
                                <Crown size={22} className="text-amber-300" />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-widest opacity-60 border px-2 py-1 rounded-full">
                                Lvl {buff.level}
                            </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-black mb-3 leading-tight group-hover:text-white transition-colors">
                            {buff.label}
                        </h3>

                        {/* Description */}
                        <p className="text-xs font-medium leading-relaxed opacity-80 mb-4 flex-grow">
                            {buff.desc}
                        </p>

                        {/* Win Condition Changes (if any) */}
                        {buff.effects?.winCondition && (
                            <div className="mt-auto pt-3 border-t border-white/10 text-[10px] space-y-1 opacity-90">
                                <p className="font-bold uppercase opacity-60 mb-1">
                                    Win Condition:
                                </p>
                                {buff.effects.winCondition.points && (
                                    <div className="flex justify-between">
                                        <span>Points:</span>
                                        <span className="font-mono font-bold text-amber-300">
                                            {buff.effects.winCondition.points}
                                        </span>
                                    </div>
                                )}
                                {buff.effects.winCondition.crowns && (
                                    <div className="flex justify-between">
                                        <span>Crowns:</span>
                                        <span className="font-mono font-bold text-amber-300">
                                            {buff.effects.winCondition.crowns}
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Select Action */}
                        <div
                            className={`absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 flex items-center gap-2 font-bold uppercase tracking-widest text-[10px]
                            ${theme === 'dark' ? 'text-white' : 'text-slate-900'}
                        `}
                        >
                            Select <ArrowRight size={14} />
                        </div>
                    </button>
                ))}
            </div>

            <div className="absolute bottom-8 text-[10px] uppercase font-black tracking-tighter opacity-30 z-10 flex gap-12">
                <span>P1 takes initiative but has fewer options</span>
                <span>P2 acts in response with a larger pool</span>
            </div>
        </div>
    );
};
