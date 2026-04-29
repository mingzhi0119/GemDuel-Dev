import React from 'react';
import { translate, type AppLocale } from '@gemduel/shared';
import { ABILITIES } from './cardAnatomyData';
import { LexiconTerm } from '../../lexicon/LexiconTerm';
import { LexiconText } from '../../lexicon/LexiconText';

type Theme = 'light' | 'dark';
type Lang = AppLocale;

interface CardAnatomyGlossaryProps {
    theme: Theme;
    lang: Lang;
}

export const CardAnatomyGlossary: React.FC<CardAnatomyGlossaryProps> = ({ lang }) => (
    <section>
        <h4 className="mb-6 text-[22px] font-black uppercase tracking-[0.18em] text-amber-100 md:text-[25px]">
            {translate(lang, 'anatomy.glossaryTitle')}
        </h4>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {ABILITIES.map((ability) => (
                <div
                    key={ability.id}
                    data-card-anatomy-ability-icon={ability.id}
                    className="flex items-start gap-6 rounded border border-white/10 bg-white/[0.045] p-6"
                >
                    <div className="flex h-[128px] w-[128px] shrink-0 items-center justify-center rounded bg-slate-950/60 shadow-[0_12px_28px_rgba(0,0,0,0.32)]">
                        <img
                            src={ability.iconPath}
                            alt=""
                            aria-hidden="true"
                            draggable={false}
                            className="h-full w-full object-contain"
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[25px] font-black uppercase tracking-[0.08em] text-slate-100 md:text-[28px]">
                            <LexiconTerm termId={ability.termId}>{ability.label[lang]}</LexiconTerm>
                        </span>
                        <span className="text-[25px] font-semibold leading-[1.5] text-slate-200/[0.82] md:text-[28px] md:leading-[1.48]">
                            <LexiconText text={ability.desc[lang]} />
                        </span>
                    </div>
                </div>
            ))}
        </div>
    </section>
);
