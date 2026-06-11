import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { CRITICAL_STARTUP_ASSET_PATHS, warmAssetCache } from './assetPreloader';

interface AssetLoadingGateProps {
    children: ReactNode;
}

interface LoadingState {
    loaded: number;
    total: number;
    failed: number;
    ready: boolean;
}

const formatPercent = ({ loaded, total }: LoadingState): number =>
    total > 0 ? Math.round((loaded / total) * 100) : 100;

export function AssetLoadingGate({ children }: AssetLoadingGateProps) {
    const total = CRITICAL_STARTUP_ASSET_PATHS.length;
    const [state, setState] = useState<LoadingState>({
        loaded: 0,
        total,
        failed: 0,
        ready: total === 0,
    });
    const percent = useMemo(() => formatPercent(state), [state]);

    useEffect(() => {
        let cancelled = false;

        void warmAssetCache(CRITICAL_STARTUP_ASSET_PATHS, {
            concurrency: 5,
            onProgress: ({ loaded, total: nextTotal, failed }) => {
                if (cancelled) {
                    return;
                }

                setState({
                    loaded,
                    total: nextTotal,
                    failed,
                    ready: false,
                });
            },
        }).then(({ total: nextTotal, failed }) => {
            if (cancelled) {
                return;
            }

            setState({
                loaded: nextTotal,
                total: nextTotal,
                failed,
                ready: true,
            });
        });

        return () => {
            cancelled = true;
        };
    }, []);

    if (state.ready) {
        return <>{children}</>;
    }

    return (
        <main
            aria-busy="true"
            aria-live="polite"
            className="min-h-screen w-full overflow-hidden bg-[#07111f] text-slate-50"
        >
            <div className="flex min-h-screen w-full items-center justify-center px-6">
                <section className="w-full max-w-sm">
                    <div className="mb-5 flex items-end justify-between gap-4">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-200/80">
                                GemDuel
                            </p>
                            <h1 className="mt-2 text-2xl font-black leading-tight">
                                Loading game assets
                            </h1>
                        </div>
                        <p className="font-mono text-sm text-slate-300">{percent}%</p>
                    </div>

                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                        <div
                            className="h-full rounded-full bg-emerald-300 transition-[width] duration-200"
                            style={{ width: `${percent}%` }}
                        />
                    </div>

                    <p className="mt-4 text-sm text-slate-300">
                        Preparing board art, gems, and interface assets before the duel opens.
                    </p>
                    {state.failed > 0 && (
                        <p className="mt-2 text-xs text-amber-200">
                            {state.failed} asset{state.failed === 1 ? '' : 's'} failed to preload;
                            the game will continue with runtime fallbacks.
                        </p>
                    )}
                </section>
            </div>
        </main>
    );
}
