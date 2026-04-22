import { useMemo } from 'react';
import { segmentLexiconText } from '@gemduel/shared';
import { useLocale } from '../i18n/LocaleProvider';
import { LexiconTerm } from './LexiconTerm';

interface LexiconTextProps {
    text: string;
    interaction?: 'click' | 'hover';
    underline?: boolean;
    as?: 'button' | 'span';
}

export function LexiconText({
    text,
    interaction = 'hover',
    underline = true,
    as = 'button',
}: LexiconTextProps) {
    const { locale } = useLocale();
    const segments = useMemo(() => segmentLexiconText(text, locale), [locale, text]);

    return (
        <>
            {segments.map((segment, index) =>
                segment.type === 'text' ? (
                    <span key={`text-${index}`}>{segment.value}</span>
                ) : (
                    <LexiconTerm
                        key={`term-${segment.termId}-${index}`}
                        termId={segment.termId}
                        interaction={interaction}
                        underline={underline}
                        as={as}
                    >
                        {segment.value}
                    </LexiconTerm>
                )
            )}
        </>
    );
}
