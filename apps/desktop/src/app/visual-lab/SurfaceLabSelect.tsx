export function SurfaceLabSelect({
    label,
    value,
    options,
    onChange,
}: {
    label: string;
    value: string;
    options: readonly string[];
    onChange: (value: string) => void;
}) {
    return (
        <label className="flex flex-col gap-1 text-[11px] font-black uppercase tracking-[0.14em] text-slate-300">
            <span>{label}</span>
            <select
                value={value}
                onChange={(event) => onChange(event.currentTarget.value)}
                className="min-h-9 rounded-md border border-slate-600 bg-slate-950 px-2 text-[12px] font-bold normal-case tracking-normal text-slate-100 outline-none focus:border-cyan-300"
            >
                {options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </label>
    );
}
