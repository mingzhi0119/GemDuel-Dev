import type { AppLocale } from '@gemduel/shared';
import { useLocale } from '../i18n/LocaleProvider';

interface LocaleSwitchProps {
    theme: 'light' | 'dark';
    className?: string;
}

const OPTIONS: AppLocale[] = ['en', 'zh'];

export function LocaleSwitch({ theme, className = '' }: LocaleSwitchProps) {
    const { locale, setLocale } = useLocale();

    return (
        <div
            className={`inline-flex items-center rounded-full border p-1 ${theme === 'dark' ? 'border-slate-700 bg-slate-900/70' : 'border-stone-300 bg-white/90'} ${className}`}
        >
            {OPTIONS.map((option) => {
                const selected = locale === option;
                const label = option === 'en' ? 'English' : '中文';
                return (
                    <button
                        key={option}
                        type="button"
                        onClick={() => setLocale(option)}
                        className={`rounded-full px-3 py-1.5 text-xs font-black tracking-[0.08em] transition-colors ${
                            selected
                                ? theme === 'dark'
                                    ? 'bg-emerald-500 text-white'
                                    : 'bg-emerald-500 text-white'
                                : theme === 'dark'
                                  ? 'text-slate-300 hover:bg-slate-800'
                                  : 'text-stone-600 hover:bg-stone-100'
                        }`}
                    >
                        {label}
                    </button>
                );
            })}
        </div>
    );
}
