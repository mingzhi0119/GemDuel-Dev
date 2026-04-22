import { useMemo } from 'react';
import { segmentLexiconText } from '@gemduel/shared';
import { useLocale } from '../i18n/LocaleProvider';
import { LexiconTerm } from './LexiconTerm';

interface LexiconTextProps {
    text: string;
}

export function LexiconText({ text }: LexiconTextProps) {
    const { locale } = useLocale();
    const segments = useMemo(() => segmentLexiconText(text, locale), [locale, text]);

    return (
        <>
            {segments.map((segment, index) =>
                segment.type === 'text' ? (
                    <span key={`text-${index}`}>{segment.value}</span>
                ) : (
                    <LexiconTerm key={`term-${segment.termId}-${index}`} termId={segment.termId}>
                        {segment.value}
                    </LexiconTerm>
                )
            )}
        </>
    );
}
