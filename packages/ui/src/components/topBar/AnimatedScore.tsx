import React, { useEffect, useRef, useState } from 'react';
import { animate, motion } from 'framer-motion';

interface AnimatedScoreProps {
    value: number;
    className?: string;
    theme: 'light' | 'dark';
}

export const AnimatedScore: React.FC<AnimatedScoreProps> = ({ value, className, theme }) => {
    const [displayValue, setDisplayValue] = useState(value);
    const [isPulsing, setIsPulsing] = useState(false);
    const prevValue = useRef(value);
    const pulseTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    const pulseColors =
        theme === 'dark' ? ['#ffffff', '#fbbf24', '#ffffff'] : ['#0f172a', '#ea580c', '#0f172a'];

    useEffect(() => {
        if (value !== prevValue.current) {
            const delta = Math.abs(value - prevValue.current);
            const stepDuration = 0.1;
            const controls = animate(prevValue.current, value, {
                duration: delta * stepDuration,
                ease: 'linear',
                onUpdate: (latest) => setDisplayValue(Math.floor(latest)),
            });

            if (value > prevValue.current) {
                setIsPulsing(true);
                if (pulseTimeout.current) {
                    clearTimeout(pulseTimeout.current);
                }
                pulseTimeout.current = setTimeout(() => {
                    setIsPulsing(false);
                    pulseTimeout.current = null;
                }, 600);
            }

            prevValue.current = value;
            return () => {
                controls.stop();
                if (pulseTimeout.current) {
                    clearTimeout(pulseTimeout.current);
                    pulseTimeout.current = null;
                }
            };
        }
    }, [value]);

    return (
        <motion.span
            animate={isPulsing ? { scale: [1, 1.4, 1], color: pulseColors } : {}}
            className={className}
        >
            <motion.span>{displayValue}</motion.span>
        </motion.span>
    );
};
