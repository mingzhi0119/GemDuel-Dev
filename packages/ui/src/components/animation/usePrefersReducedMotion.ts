import { useEffect, useState } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

export const usePrefersReducedMotion = () => {
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(() =>
        typeof window !== 'undefined' && typeof window.matchMedia === 'function'
            ? window.matchMedia(QUERY).matches
            : false
    );

    useEffect(() => {
        if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
            return undefined;
        }

        const mediaQuery = window.matchMedia(QUERY);
        const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);
        updatePreference();

        mediaQuery.addEventListener?.('change', updatePreference);

        return () => {
            mediaQuery.removeEventListener?.('change', updatePreference);
        };
    }, []);

    return prefersReducedMotion;
};
