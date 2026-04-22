import React from 'react';
import type { AppLocale } from '@gemduel/shared';
import { CardAnatomyDiagram } from './cardAnatomy/CardAnatomyDiagram';
import { CardAnatomyGlossary } from './cardAnatomy/CardAnatomyGlossary';

interface CardAnatomyPageProps {
    theme: 'light' | 'dark';
    lang: AppLocale;
}

export const CardAnatomyPage: React.FC<CardAnatomyPageProps> = ({ theme, lang }) => (
    <div className="flex flex-col gap-10">
        <CardAnatomyDiagram theme={theme} lang={lang} />
        <CardAnatomyGlossary theme={theme} lang={lang} />
    </div>
);
