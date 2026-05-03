interface CardEmptyPlaceholderProps {
    dimensions: {
        width: number;
        height: number;
    };
    cornerRadiusPx: number;
    label: string;
}

export function CardEmptyPlaceholder({
    dimensions,
    cornerRadiusPx,
    label,
}: CardEmptyPlaceholderProps) {
    return (
        <div
            className="bg-slate-800/50 rounded-lg border border-dashed border-slate-700 flex items-center justify-center text-slate-600 text-xs"
            style={{
                width: `${dimensions.width}px`,
                height: `${dimensions.height}px`,
                borderRadius: `${cornerRadiusPx}px`,
            }}
        >
            {label}
        </div>
    );
}
