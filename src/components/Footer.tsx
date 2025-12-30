import React from 'react';

declare global {
    interface Window {
        electron?: {
            version: string;
        };
    }
}

export const Footer: React.FC = () => {
    // Access version exposed from preload.js, fallback to hardcoded if missing (e.g. in browser dev)
    const version = window.electron?.version ?? '5.2.3';

    return (
        <div className="fixed bottom-0 left-0 right-0 h-6 bg-black/50 backdrop-blur-sm flex items-center justify-between px-4 font-mono text-[10px] text-white/40 z-[200] pointer-events-none select-none">
            <div className="flex items-center gap-2">
                <span className="text-emerald-500/80">●</span> System Ready
            </div>
            <div>v{version}</div>
        </div>
    );
};
