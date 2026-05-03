import React from 'react';
import { reportRendererEvent } from '../../observability/rendererLogger';

interface RouteErrorBoundaryProps {
    children: React.ReactNode;
    resetKey: string;
}

interface RouteErrorBoundaryState {
    hasError: boolean;
}

export class RouteErrorBoundary extends React.Component<
    RouteErrorBoundaryProps,
    RouteErrorBoundaryState
> {
    state: RouteErrorBoundaryState = {
        hasError: false,
    };

    static getDerivedStateFromError(): RouteErrorBoundaryState {
        return {
            hasError: true,
        };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        reportRendererEvent(
            {
                category: 'runtime',
                name: 'ROUTE_RENDER_FAILED',
                severity: 'error',
                message: 'A renderer route failed to render.',
                context: {
                    componentStack: errorInfo.componentStack?.slice(0, 500) ?? '',
                },
            },
            {
                consoleMessage: '[ROUTE] Renderer route failed to render.',
                consoleDetails: error,
            }
        );
    }

    componentDidUpdate(previousProps: RouteErrorBoundaryProps) {
        if (previousProps.resetKey !== this.props.resetKey && this.state.hasError) {
            this.setState({ hasError: false });
        }
    }

    private reload = () => {
        window.location.reload();
    };

    private restart = () => {
        window.electron?.restartApp?.();
    };

    render() {
        if (!this.state.hasError) {
            return this.props.children;
        }

        return (
            <div
                role="alert"
                className="flex h-full w-full items-center justify-center bg-slate-950 p-8 text-slate-100"
            >
                <div className="flex max-w-xl flex-col gap-4 rounded border border-red-400/40 bg-slate-900 p-6 shadow-2xl">
                    <h1 className="text-2xl font-semibold">Route failed to render</h1>
                    <p className="text-sm text-slate-300">
                        Reload the renderer or restart after an update has been downloaded.
                    </p>
                    <div className="flex gap-3">
                        <button
                            type="button"
                            className="rounded bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-950"
                            onClick={this.reload}
                        >
                            Reload
                        </button>
                        <button
                            type="button"
                            className="rounded border border-slate-500 px-4 py-2 text-sm font-semibold text-slate-100"
                            onClick={this.restart}
                        >
                            Restart
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}
