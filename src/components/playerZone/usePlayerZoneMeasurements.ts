import { useEffect, useRef, useState } from 'react';

export function usePlayerZoneMeasurements() {
    const tableauRowRef = useRef<HTMLDivElement | null>(null);
    const reservedRowRef = useRef<HTMLDivElement | null>(null);
    const [tableauRowWidth, setTableauRowWidth] = useState(0);
    const [reservedRowWidth, setReservedRowWidth] = useState(0);

    useEffect(() => {
        const updateRowWidths = () => {
            const nextTableauWidth = tableauRowRef.current?.clientWidth ?? 0;
            const nextReservedWidth = reservedRowRef.current?.clientWidth ?? 0;

            setTableauRowWidth((current) =>
                current === nextTableauWidth ? current : nextTableauWidth
            );
            setReservedRowWidth((current) =>
                current === nextReservedWidth ? current : nextReservedWidth
            );
        };

        updateRowWidths();

        if (typeof ResizeObserver === 'undefined') {
            window.addEventListener('resize', updateRowWidths);
            return () => window.removeEventListener('resize', updateRowWidths);
        }

        const observer = new ResizeObserver(updateRowWidths);
        if (tableauRowRef.current) observer.observe(tableauRowRef.current);
        if (reservedRowRef.current) observer.observe(reservedRowRef.current);
        window.addEventListener('resize', updateRowWidths);

        return () => {
            observer.disconnect();
            window.removeEventListener('resize', updateRowWidths);
        };
    }, []);

    return { tableauRowRef, reservedRowRef, tableauRowWidth, reservedRowWidth };
}
