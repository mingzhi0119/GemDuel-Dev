import React from 'react';
import { Monitor } from 'lucide-react';

export const ResolutionSwitcher = ({ settings, resolution, setResolution, RESOLUTION_SETTINGS }) => {
    return (
        <div className="absolute top-2 right-2 z-50 group">
            <button className="bg-slate-800/80 hover:bg-slate-700 text-white p-2 rounded-lg backdrop-blur-md border border-slate-600 shadow-xl flex items-center gap-2 transition-all">
                <Monitor size={16} />
                <span className="text-xs font-bold hidden md:inline">{settings.label}</span>
            </button>
            
            <div className="absolute right-0 top-full pt-2 hidden group-hover:block w-32 animate-in fade-in slide-in-from-top-2">
                <div className="bg-slate-800 rounded-lg shadow-xl border border-slate-700 overflow-hidden">
                    {Object.entries(RESOLUTION_SETTINGS).map(([key, config]) => (
                        <button 
                            key={key}
                            onClick={() => setResolution(key)}
                            className={`w-full text-left px-4 py-2 text-xs font-bold hover:bg-slate-700 transition-colors ${resolution === key ? 'text-emerald-400 bg-slate-900' : 'text-slate-400'}`}
                        >
                            {config.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
