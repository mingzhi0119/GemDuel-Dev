import React from 'react';
import { Info, Wifi, WifiOff } from 'lucide-react';
import { cn } from '../utils';

interface StatusBarProps {
    errorMsg: string | null;
    isOnline?: boolean;
    connectionStatus?: 'disconnected' | 'connecting' | 'connected';
}

export const StatusBar: React.FC<StatusBarProps> = ({ errorMsg, isOnline, connectionStatus }) => {
    return (
        <div className="relative flex flex-col items-center gap-2">
            <div
                key={errorMsg}
                className={cn(
                    'absolute -top-9 bg-red-500/90 text-white px-4 py-1.5 rounded-full shadow-xl text-sm font-semibold transition-all duration-300 z-50 flex items-center gap-2 whitespace-nowrap',
                    errorMsg
                        ? 'opacity-100 translate-y-0 animate-shake'
                        : 'opacity-0 translate-y-4 pointer-events-none'
                )}
            >
                <Info size={14} /> {errorMsg}
            </div>

            {isOnline && (
                <div
                    className={`absolute -top-6 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg transition-all whitespace-nowrap
                    ${connectionStatus === 'connected' ? 'bg-emerald-500/25 text-emerald-200 border border-emerald-400/50' : 'bg-rose-500/25 text-rose-200 border border-rose-400/50'}
                `}
                >
                    {connectionStatus === 'connected' ? (
                        <>
                            <Wifi size={12} /> Live Link
                        </>
                    ) : (
                        <>
                            <WifiOff size={12} /> Sync Lost
                        </>
                    )}
                </div>
            )}
        </div>
    );
};
