import { ArrowLeft, Globe, Copy, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { GameMode } from '../types';

interface OnlineSetupProps {
    onBack: () => void;
    online: {
        peerId: string | null;
        connectionStatus: string;
        isHost: boolean;
        connectToPeer: (id: string) => void;
    };
    startGame: (mode: GameMode, config: { useBuffs: boolean; isHost?: boolean }) => void;
    theme: string;
}

export function OnlineSetup({ onBack, online, startGame, theme }: OnlineSetupProps) {
    const [roomInput, setRoomInput] = useState('');
    const [copySuccess, setCopySetup] = useState(false);

    return (
        <div
            className={`h-screen w-screen flex flex-col items-center justify-center gap-8 transition-colors duration-500
                  ${theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'}`}
        >
            <button
                onClick={onBack}
                className="absolute top-8 left-8 flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity"
            >
                <ArrowLeft size={20} /> Back
            </button>

            <div className="flex flex-col items-center gap-2">
                <Globe size={48} className="text-blue-400 animate-pulse" />
                <h2 className="text-3xl font-black uppercase tracking-tighter">Online Nexus</h2>
                <span className="text-xs opacity-50">Powered by WebRTC P2P</span>
            </div>

            <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl px-8">
                {/* Host Section */}
                <div
                    className={`flex-1 p-8 rounded-3xl border-2 transition-all ${theme === 'dark' ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'} flex flex-col items-center gap-6 ${!online.isHost && online.connectionStatus === 'connected' ? 'opacity-30 pointer-events-none' : ''}`}
                >
                    <h3 className="text-xl font-bold">Host a Game</h3>
                    <p className="text-center text-sm opacity-60">
                        Share your ID with a friend to start a match.
                    </p>

                    <div
                        className={`w-full p-4 rounded-xl flex items-center justify-between gap-4 ${theme === 'dark' ? 'bg-black/40' : 'bg-slate-100'}`}
                    >
                        <code className="text-lg font-mono font-bold text-blue-400 break-all">
                            {online.peerId || 'Generating...'}
                        </code>
                        <button
                            onClick={() => {
                                if (online.peerId) {
                                    navigator.clipboard.writeText(online.peerId);
                                    setCopySetup(true);
                                    setTimeout(() => setCopySetup(false), 2000);
                                }
                            }}
                            className="p-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/40 text-blue-400 transition-colors"
                        >
                            {copySuccess ? <CheckCircle2 size={20} /> : <Copy size={20} />}
                        </button>
                    </div>

                    <div className="w-full flex flex-col gap-3">
                        <div className="flex items-center justify-between px-2">
                            <span className="text-xs opacity-60">Connection Status</span>
                            <span
                                className={`text-xs font-bold uppercase ${online.connectionStatus === 'connected' ? 'text-emerald-400' : online.connectionStatus === 'connecting' ? 'text-amber-400' : 'text-rose-400'}`}
                            >
                                {online.connectionStatus}
                            </span>
                        </div>

                        {online.connectionStatus === 'connected' ? (
                            <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-2">
                                <span className="text-[10px] uppercase font-black tracking-widest text-center opacity-40 mb-1">
                                    Select Match Type
                                </span>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        onClick={() =>
                                            startGame('ONLINE_MULTIPLAYER', {
                                                useBuffs: false,
                                                isHost: true,
                                            })
                                        }
                                        className="py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black uppercase text-xs transition-all active:scale-95 shadow-lg"
                                    >
                                        Classic
                                    </button>
                                    <button
                                        onClick={() =>
                                            startGame('ONLINE_MULTIPLAYER', {
                                                useBuffs: true,
                                                isHost: true,
                                            })
                                        }
                                        className="py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black uppercase text-xs transition-all active:scale-95 shadow-lg"
                                    >
                                        Roguelike
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="py-4 text-center text-xs opacity-40 italic">
                                Waiting for connection...
                            </div>
                        )}
                    </div>
                </div>

                {/* Join Section */}
                <div
                    className={`flex-1 p-8 rounded-3xl border-2 transition-all ${theme === 'dark' ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'} flex flex-col items-center gap-6`}
                >
                    <h3 className="text-xl font-bold">Join a Game</h3>
                    <p className="text-center text-sm opacity-60">
                        Enter your friend's ID to connect to their lobby.
                    </p>

                    <input
                        type="text"
                        placeholder="Paste ID here..."
                        value={roomInput}
                        onChange={(e) => setRoomInput(e.target.value)}
                        className={`w-full p-4 rounded-xl font-mono text-center outline-none border-2 transition-all
                                    ${theme === 'dark' ? 'bg-black/40 border-slate-800 focus:border-amber-500' : 'bg-slate-100 border-slate-200 focus:border-amber-500'}`}
                    />

                    <button
                        onClick={() => online.connectToPeer(roomInput)}
                        disabled={!roomInput || online.connectionStatus === 'connected'}
                        className={`w-full py-4 rounded-2xl font-black uppercase tracking-wider transition-all
                                    ${
                                        roomInput && online.connectionStatus !== 'connected'
                                            ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-xl shadow-amber-900/20 active:scale-95'
                                            : 'bg-slate-800 text-slate-600 cursor-not-allowed'
                                    }`}
                    >
                        {online.connectionStatus === 'connecting'
                            ? 'Connecting...'
                            : 'Connect to Host'}
                    </button>

                    {online.connectionStatus === 'connected' && (
                        <div className="text-emerald-400 text-sm font-bold flex flex-col items-center gap-2 animate-bounce mt-4">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 size={16} /> Connected!
                            </div>
                            <span className="text-[10px] uppercase opacity-60">
                                Host is selecting mode...
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
