import { useEffect, useState } from 'react';
import type { GemCoord } from '@gemduel/shared/types';

export const useInteractionFeedback = (currentIndex: number) => {
    const [selectedGems, setSelectedGems] = useState<GemCoord[]>([]);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        setSelectedGems([]);
    }, [currentIndex]);

    useEffect(() => {
        if (!errorMsg) return;

        const timer = setTimeout(() => {
            setErrorMsg(null);
        }, 3000);

        return () => clearTimeout(timer);
    }, [errorMsg]);

    return {
        selectedGems,
        setSelectedGems,
        clearSelectedGems: () => setSelectedGems([]),
        errorMsg,
        setErrorMsg,
    };
};
