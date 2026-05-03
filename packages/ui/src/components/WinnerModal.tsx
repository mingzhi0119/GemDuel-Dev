import React, { useEffect } from 'react';
import { Trophy, Eye } from 'lucide-react';
import { getPlayerDisplayName } from '@gemduel/shared';
import confetti from 'canvas-confetti';
import { PlayerKey } from '@gemduel/shared/types';
import { useLocale, useT } from '../i18n/LocaleProvider';

interface WinnerModalProps {
    winner: PlayerKey | null;
    onReview: () => void;
}

export const WinnerModal: React.FC<WinnerModalProps> = ({ winner, onReview }) => {
    const { locale } = useLocale();
    const t = useT();

    useEffect(() => {
        if (winner) {
            const duration = 3000;
            const end = Date.now() + duration;

            const frame = () => {
                confetti({
                    particleCount: 5,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 },
                    colors: ['#34d399', '#ffbbf24', '#f472b6'],
                });
                confetti({
                    particleCount: 5,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 },
                    colors: ['#34d399', '#ffbbf24', '#f472b6'],
                });

                if (Date.now() < end) {
                    requestAnimationFrame(frame);
                }
            };
            frame();
        }
    }, [winner]);

    if (!winner) return null;

    return (
        <div className="absolute inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center animate-in zoom-in duration-300">
            <Trophy
                size={160}
                className="text-yellow-400 mb-8 drop-shadow-[0_0_40px_rgba(250,204,21,0.5)] animate-bounce"
            />
            <h1 className="text-8xl font-black text-white mb-4">
                {t('winner.banner', { winner: getPlayerDisplayName(winner, locale) })}
            </h1>
            <p className="text-slate-400 text-4xl mb-16">{t('winner.congratulations')}</p>
            <div className="flex gap-8">
                <button
                    onClick={onReview}
                    className="flex items-center gap-4 bg-slate-700 hover:bg-slate-600 text-white px-12 py-6 rounded-full font-bold text-4xl shadow-xl transition-transform hover:scale-105"
                >
                    <Eye size={40} /> {t('winner.reviewBoard')}
                </button>
                <button
                    onClick={() => window.location.reload()}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-16 py-6 rounded-full font-bold text-[40px] shadow-xl transition-transform hover:scale-105"
                >
                    {t('winner.playAgain')}
                </button>
            </div>
        </div>
    );
};
