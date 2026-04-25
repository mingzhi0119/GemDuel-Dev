interface GemContrastOverlayProps {
    insetClassName?: string;
}

export function GemContrastOverlay({ insetClassName = 'inset-[12%]' }: GemContrastOverlayProps) {
    return (
        <div
            aria-hidden="true"
            className={`pointer-events-none absolute ${insetClassName} rounded-full bg-[radial-gradient(circle_at_30%_28%,rgba(255,255,255,0.34),rgba(255,255,255,0.10)_38%,transparent_70%)]`}
        />
    );
}
