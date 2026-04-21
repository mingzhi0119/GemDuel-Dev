import { Scroll, Shield, Swords } from 'lucide-react';
import type { ReactElement } from 'react';
import { cn } from '../../utils';

interface PlayerZoneIdentityColumnProps {
    player: 'p1' | 'p2';
    privileges: number;
    extraPrivileges: number;
    isActive: boolean;
    isPrivilegeMode: boolean;
    theme: 'light' | 'dark';
    onUsePrivilege: () => void;
}

export function PlayerZoneIdentityColumn({
    player,
    privileges,
    extraPrivileges,
    isActive,
    isPrivilegeMode,
    theme,
    onUsePrivilege,
}: PlayerZoneIdentityColumnProps) {
    const total = privileges + extraPrivileges;
    const items: ReactElement[] = [];
    let currentIndex = 0;

    for (let i = 0; i < Math.max(0, privileges); i++) {
        const idx = currentIndex++;
        items.push(
            <button
                key={`std-${i}`}
                disabled={!isActive || isPrivilegeMode}
                onClick={onUsePrivilege}
                className={cn(
                    'transition-all',
                    isActive && !isPrivilegeMode
                        ? 'hover:scale-110 hover:text-amber-100 cursor-pointer animate-pulse'
                        : 'opacity-80 cursor-default',
                    (total === 1 || (total === 3 && idx === 2)) && 'col-span-2 justify-self-center'
                )}
            >
                <Scroll
                    size={30}
                    fill="#fcd34d"
                    className={theme === 'dark' ? 'text-amber-200' : 'text-amber-500'}
                />
            </button>
        );
    }

    for (let i = 0; i < Math.max(0, extraPrivileges); i++) {
        const idx = currentIndex++;
        items.push(
            <button
                key={`extra-${i}`}
                disabled={!isActive || isPrivilegeMode}
                onClick={onUsePrivilege}
                className={cn(
                    'transition-all',
                    isActive && !isPrivilegeMode
                        ? 'hover:scale-110 hover:text-yellow-200 cursor-pointer animate-pulse'
                        : 'opacity-80 cursor-default',
                    (total === 1 || (total === 3 && idx === 2)) && 'col-span-2 justify-self-center'
                )}
                title="Special Privilege (Protected)"
            >
                <Scroll size={30} fill="#fbbf24" className="text-yellow-500" />
            </button>
        );
    }

    return (
        <div
            className={`self-stretch flex flex-col gap-5 min-w-[128px] shrink-0 items-center justify-center border-r pr-3 transition-colors duration-500
          ${theme === 'dark' ? 'border-slate-700' : 'border-stone-300'}
      `}
        >
            <div className="flex flex-col items-center gap-2">
                <div
                    className={`p-4 rounded-full ${isActive ? (player === 'p1' ? 'bg-emerald-600' : 'bg-blue-600') : theme === 'dark' ? 'bg-slate-700' : 'bg-stone-300'}`}
                >
                    {player === 'p1' ? (
                        <Shield
                            size={40}
                            className={
                                theme === 'dark' || isActive ? 'text-white' : 'text-stone-600'
                            }
                        />
                    ) : (
                        <Swords
                            size={40}
                            className={
                                theme === 'dark' || isActive ? 'text-white' : 'text-stone-600'
                            }
                        />
                    )}
                </div>
                <h3
                    className={`font-black text-[20px] whitespace-nowrap uppercase tracking-[0.16em] ${
                        isActive
                            ? player === 'p1'
                                ? 'text-emerald-500'
                                : 'text-blue-500'
                            : theme === 'dark'
                              ? 'text-slate-300'
                              : 'text-stone-600'
                    }`}
                >
                    {player === 'p1' ? 'Player 1' : 'Player 2'}
                </h3>
            </div>
            <div className="grid grid-cols-2 gap-2 justify-items-start h-[72px] items-start">
                {items.length === 0 ? (
                    <div className="col-span-2 justify-self-center">
                        <Scroll
                            size={30}
                            className={theme === 'dark' ? 'text-slate-500' : 'text-stone-400'}
                        />
                    </div>
                ) : (
                    items
                )}
            </div>
        </div>
    );
}
