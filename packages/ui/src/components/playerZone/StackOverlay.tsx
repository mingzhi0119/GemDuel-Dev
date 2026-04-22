import { Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { GEM_TYPES } from '@gemduel/shared/constants';
import { getGemLabel } from '@gemduel/shared';
import { Card } from '../Card';
import type { Card as CardType } from '@gemduel/shared/types';
import { useLocale, useT } from '../../i18n/LocaleProvider';

interface StackOverlayProps {
    isOpen: boolean;
    color: string;
    cards: CardType[];
    onClose: () => void;
    theme: 'light' | 'dark';
}

export function StackOverlay({ isOpen, color, cards, onClose, theme }: StackOverlayProps) {
    const { locale } = useLocale();
    const t = useT();
    if (!isOpen) return null;
    const type = GEM_TYPES[color.toUpperCase() as keyof typeof GEM_TYPES] || GEM_TYPES.NULL;

    const colorMap: Record<string, string> = {
        blue: '#60a5fa',
        white: '#f1f5f9',
        green: '#34d399',
        black: '#94a3b8',
        red: '#f87171',
        pearl: '#f472b6',
        gold: '#fbbf24',
    };

    const textColor = colorMap[type.id] || '#94a3b8';

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`absolute inset-0 z-[600] rounded-2xl flex flex-col overflow-hidden shadow-inner ${theme === 'dark' ? 'bg-slate-900/95' : 'bg-white/95'}`}
        >
            <div className="absolute top-3 left-4 z-[610] flex items-center gap-2">
                <span
                    className="text-sm font-black uppercase tracking-widest bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm shadow-sm"
                    style={{ color: textColor }}
                >
                    {t('labels.color')}:{' '}
                    {getGemLabel(type.id === 'empty' ? 'empty' : type.id, locale)}
                </span>
            </div>

            <div className="absolute top-2 right-2 z-[610]">
                <button
                    onClick={onClose}
                    className={`p-2 rounded-full shadow-lg transition-all hover:scale-110 active:scale-95 ${theme === 'dark' ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' : 'bg-slate-100 text-slate-800 hover:bg-slate-200'}`}
                >
                    <Shield size={16} className="rotate-45" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 flex flex-wrap items-center justify-center gap-4">
                {cards.map((card, i) => (
                    <motion.div
                        key={card.id || i}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.2, delay: i * 0.03 }}
                    >
                        <Card card={card} canBuy={false} theme={theme} size="default" />
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
