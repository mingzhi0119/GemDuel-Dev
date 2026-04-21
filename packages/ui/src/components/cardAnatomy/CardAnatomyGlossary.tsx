import React from 'react';
import { ABILITIES } from './cardAnatomyData';

type Theme = 'light' | 'dark';
type Lang = 'en' | 'zh';

interface CardAnatomyGlossaryProps {
    theme: Theme;
    lang: Lang;
}

export const CardAnatomyGlossary: React.FC<CardAnatomyGlossaryProps> = ({ theme, lang }) => (
    <section>
        <h4
            className={`text-xl font-black uppercase tracking-wider mb-5 ${theme === 'dark' ? 'text-slate-200' : 'text-stone-700'}`}
        >
            {lang === 'en' ? 'Special Abilities' : '特殊能力'}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            {ABILITIES.map((ability) => {
                const Icon = ability.icon;
                return (
                    <div
                        key={ability.id}
                        className={`flex items-start gap-5 p-5 md:p-6 rounded-xl border transition-colors ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-stone-50 border-stone-200'}`}
                    >
                        <div
                            className={`p-3 rounded-xl ${ability.color} shadow-md flex items-center justify-center shrink-0`}
                        >
                            <Icon size={24} className="text-white" />
                        </div>
                        <div className="flex flex-col">
                            <span
                                className={`text-lg md:text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-stone-800'}`}
                            >
                                {ability.label[lang]}
                            </span>
                            <span
                                className={`text-[15px] md:text-base leading-7 ${theme === 'dark' ? 'text-slate-400' : 'text-stone-500'}`}
                            >
                                {ability.desc[lang]}
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    </section>
);
