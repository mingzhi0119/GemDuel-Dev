import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Crown } from 'lucide-react';

interface AnimatedCrownMetricProps {
    value: number;
    player: string;
    className?: string;
    iconClassName?: string;
    theme: 'light' | 'dark';
    isNearGoal?: boolean;
}

export function AnimatedCrownMetric({
    value,
    player,
    className,
    iconClassName,
    theme,
    isNearGoal = false,
}: AnimatedCrownMetricProps) {
    const prefersReducedMotion = useReducedMotion();
    const previousValue = useRef(value);
    const [burstKey, setBurstKey] = useState(0);

    useEffect(() => {
        if (value > previousValue.current) {
            setBurstKey((current) => current + 1);
        }

        previousValue.current = value;
    }, [value]);

    const glowClass = isNearGoal
        ? theme === 'dark'
            ? 'drop-shadow-[0_0_12px_rgba(250,204,21,0.44)]'
            : 'drop-shadow-[0_0_10px_rgba(217,119,6,0.28)]'
        : 'drop-shadow-lg';

    return (
        <>
            <span className="relative inline-flex items-center justify-center">
                <Crown className={`${iconClassName ?? ''} ${glowClass}`} fill="currentColor" />
                <AnimatePresence>
                    {burstKey > 0 && (
                        <motion.span
                            key={burstKey}
                            aria-hidden="true"
                            initial={{
                                opacity: prefersReducedMotion ? 0.45 : 0.9,
                                scale: prefersReducedMotion ? 0.96 : 0.58,
                            }}
                            animate={{
                                opacity: 0,
                                scale: prefersReducedMotion ? 1.12 : 2.25,
                            }}
                            exit={{ opacity: 0 }}
                            transition={{
                                duration: prefersReducedMotion ? 0.22 : 0.58,
                                ease: 'easeOut',
                            }}
                            className="pointer-events-none absolute inset-[-22%] rounded-full border border-yellow-200/75 bg-yellow-300/18 shadow-[0_0_22px_rgba(250,204,21,0.42)]"
                        />
                    )}
                </AnimatePresence>
            </span>
            <motion.span
                data-topbar-crowns={player}
                data-value={value}
                animate={
                    burstKey > 0
                        ? {
                              scale: prefersReducedMotion ? [1, 1.04, 1] : [1, 1.18, 1],
                              color:
                                  theme === 'dark'
                                      ? ['#facc15', '#fef3c7', '#facc15']
                                      : ['#d97706', '#92400e', '#d97706'],
                          }
                        : {}
                }
                transition={{ duration: prefersReducedMotion ? 0.18 : 0.42, ease: 'easeOut' }}
                className={`${className ?? ''} ${glowClass}`}
            >
                {value}
            </motion.span>
        </>
    );
}
