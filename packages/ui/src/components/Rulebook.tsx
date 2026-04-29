import React, { useEffect, useState } from 'react';
import { BookOpen, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { RULEBOOK_CONTENT, type RulebookBlock } from './RulebookContent';
import { CardAnatomyPage } from './CardAnatomyPage';
import { RulebookAreaGuidePage } from './rulebook/RulebookAreaGuidePage';
import { useLocale, useT } from '../i18n/LocaleProvider';
import { LexiconText } from '../lexicon/LexiconText';

interface RulebookProps {
    onClose: () => void;
    theme: 'light' | 'dark';
}

const ACTION_BUTTON_CLASS =
    'min-w-[184px] rounded border border-amber-200/70 bg-amber-400 px-8 py-3 text-xl font-black uppercase tracking-[0.16em] text-slate-950 shadow-[0_10px_28px_rgba(251,191,36,0.24)] transition-colors hover:bg-amber-300 disabled:cursor-not-allowed disabled:border-slate-600 disabled:bg-slate-800 disabled:text-slate-400 disabled:shadow-none';

export const Rulebook: React.FC<RulebookProps> = ({ onClose, theme }) => {
    const [page, setPage] = useState(0);
    const { locale } = useLocale();
    const t = useT();

    const content = RULEBOOK_CONTENT[page];
    const totalPages = RULEBOOK_CONTENT.length;
    const isDark = theme === 'dark';

    useEffect(() => {
        if (typeof window === 'undefined') {
            return undefined;
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    const renderInlineFormatting = (text: string) => {
        const segments = text.split(/(\*\*.*?\*\*)/g);
        return segments.map((segment, index) => {
            if (segment.startsWith('**') && segment.endsWith('**') && segment.length > 4) {
                return (
                    <strong key={`${segment}-${index}`} className="text-amber-100">
                        <LexiconText text={segment.slice(2, -2)} interaction="click" />
                    </strong>
                );
            }

            return (
                <React.Fragment key={`${segment}-${index}`}>
                    <LexiconText text={segment} interaction="click" />
                </React.Fragment>
            );
        });
    };

    const renderFormattedBody = (body: string) => {
        const lines = body.split('\n');
        return lines.map((line, index) => (
            <React.Fragment key={`line-${index}`}>
                {renderInlineFormatting(line)}
                {index < lines.length - 1 && <br />}
            </React.Fragment>
        ));
    };

    const renderBodyText = (body: string) => {
        const normalizedBody = body.trim();
        if (!normalizedBody) {
            return null;
        }

        return (
            <div
                data-rulebook-body="true"
                className="space-y-6 text-[25px] font-semibold leading-[1.5] text-slate-200/[0.88] md:text-[28px] md:leading-[1.48] xl:columns-2 xl:gap-12 [&>p]:break-inside-avoid"
            >
                {normalizedBody.split(/\n{2,}/).map((paragraph, index) => (
                    <p key={`paragraph-${index}`}>{renderFormattedBody(paragraph.trim())}</p>
                ))}
            </div>
        );
    };

    const renderBlock = (block: RulebookBlock, index: number) => {
        if (block.type === 'lead') {
            return (
                <p
                    key={`lead-${index}`}
                    className="text-[28px] font-bold leading-[1.45] text-slate-100 md:text-[34px] md:leading-[1.42]"
                >
                    {renderInlineFormatting(block.text[locale])}
                </p>
            );
        }

        if (block.type === 'callout') {
            return (
                <div
                    key={`callout-${index}`}
                    data-rulebook-callout="true"
                    className="rounded-lg border border-amber-200/[0.35] bg-amber-300/10 px-5 py-4 shadow-[0_12px_32px_rgba(0,0,0,0.22)]"
                >
                    {block.title && (
                        <h4 className="mb-3 text-xl font-black uppercase tracking-[0.18em] text-amber-100 md:text-[22px]">
                            {renderInlineFormatting(block.title[locale])}
                        </h4>
                    )}
                    <p className="text-[25px] font-semibold leading-[1.5] text-slate-100/90 md:text-[28px] md:leading-[1.48]">
                        {renderInlineFormatting(block.text[locale])}
                    </p>
                </div>
            );
        }

        return (
            <section
                key={`section-${index}`}
                data-rulebook-section="true"
                className="rounded-lg border border-white/10 bg-white/[0.045] px-8 py-7"
            >
                <h4 className="mb-5 text-[22px] font-black uppercase tracking-[0.18em] text-amber-100 md:text-[25px]">
                    {renderInlineFormatting(block.title[locale])}
                </h4>
                {block.text && (
                    <p className="mb-5 text-[25px] font-semibold leading-[1.5] text-slate-200/[0.88] md:text-[28px] md:leading-[1.48]">
                        {renderInlineFormatting(block.text[locale])}
                    </p>
                )}
                <ul className="space-y-2">
                    {block.items.map((item, itemIndex) => (
                        <li
                            key={`item-${itemIndex}`}
                            className="flex gap-4 text-[25px] font-semibold leading-[1.5] text-slate-200/[0.88] md:text-[28px] md:leading-[1.48]"
                        >
                            <span
                                aria-hidden="true"
                                className="mt-[0.72em] h-2.5 w-2.5 shrink-0 rounded-full bg-amber-300"
                            />
                            <span>{renderInlineFormatting(item[locale])}</span>
                        </li>
                    ))}
                </ul>
            </section>
        );
    };

    const renderContent = () => {
        if (!content) {
            return <p className="text-base font-bold text-slate-300">{t('rulebook.noContent')}</p>;
        }

        return (
            <div className="space-y-6">
                <header className="border-b border-white/10 pb-5">
                    <p className="mb-2 text-[17px] font-black uppercase tracking-[0.22em] text-amber-100/70">
                        {t('rulebook.page')} {page + 1} / {totalPages}
                    </p>
                    <h3 className="text-[50px] font-black uppercase tracking-[0.12em] text-amber-100 drop-shadow-[0_2px_8px_rgba(0,0,0,0.55)]">
                        {content.title?.[locale] || t('rulebook.untitled')}
                    </h3>
                    {content.summary && (
                        <p className="mt-5 text-[25px] font-semibold leading-[1.5] text-slate-200/[0.88] md:text-[34px] md:leading-[1.42]">
                            {renderInlineFormatting(content.summary[locale])}
                        </p>
                    )}
                </header>

                {content.isCustom === 'card_anatomy' && (
                    <CardAnatomyPage theme={theme} lang={locale} />
                )}
                {content.isCustom === 'player_zone' && (
                    <RulebookAreaGuidePage kind="player_zone" lang={locale} />
                )}
                {content.isCustom === 'center_area' && (
                    <RulebookAreaGuidePage kind="center_area" lang={locale} />
                )}
                {content.isCustom === 'topbar' && (
                    <RulebookAreaGuidePage kind="topbar" lang={locale} theme={theme} />
                )}
                {content.isCustom !== 'card_anatomy' && (
                    <>
                        {content.blocks?.map(renderBlock)}
                        {content.body && renderBodyText(content.body[locale])}
                    </>
                )}
            </div>
        );
    };

    return (
        <div
            data-rulebook-overlay="true"
            className="absolute inset-0 z-[200] flex items-center justify-center overflow-hidden bg-black/[0.82] p-4 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-label={t('rulebook.title')}
                data-rulebook-panel="preview-style"
                data-rulebook-theme={theme}
                data-rulebook-page-count={totalPages}
                data-rulebook-wide-body-layout="columns"
                data-rulebook-type-scale="140"
                onClick={(event) => event.stopPropagation()}
                className={`relative flex h-[88%] max-h-[calc(100%-32px)] w-[96%] max-w-[1880px] flex-col overflow-hidden rounded-2xl border shadow-[0_30px_90px_rgba(0,0,0,0.52)] transition-colors duration-300 ${
                    isDark
                        ? 'border-white/[0.12] bg-slate-950/95 text-slate-100'
                        : 'border-amber-100/25 bg-slate-950/[0.94] text-slate-100'
                }`}
            >
                <div className="flex items-center justify-between border-b border-white/10 bg-slate-950/[0.76] px-6 py-5">
                    <div className="flex items-center gap-3 text-amber-100">
                        <div className="rounded-full border border-amber-200/40 bg-amber-300/[0.12] p-2">
                            <BookOpen size={22} />
                        </div>
                        <div>
                            <h2 className="text-[25px] font-black uppercase tracking-[0.18em]">
                                {t('rulebook.title')}
                            </h2>
                            <p className="mt-1 text-base font-black uppercase tracking-[0.2em] text-amber-100/[0.58]">
                                {locale === 'zh' ? '目录' : 'Contents'}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label={t('rulebook.close')}
                        className="rounded-full border border-white/20 bg-slate-950/75 p-3 text-slate-100 shadow-xl transition-colors hover:bg-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-300"
                    >
                        <X size={22} />
                    </button>
                </div>

                <nav
                    data-rulebook-nav="true"
                    className="flex gap-2 overflow-x-auto border-b border-white/10 bg-slate-950/[0.62] px-5 py-3"
                    aria-label={locale === 'zh' ? '说明书章节' : 'Rulebook chapters'}
                >
                    {RULEBOOK_CONTENT.map((entry, index) => (
                        <button
                            key={entry.title.en}
                            type="button"
                            data-rulebook-nav-item={index}
                            aria-current={index === page ? 'page' : undefined}
                            onClick={() => setPage(index)}
                            className={`shrink-0 rounded border px-5 py-3 text-xl font-black uppercase tracking-[0.12em] transition-colors ${
                                index === page
                                    ? 'border-amber-200/70 bg-amber-300 text-slate-950 shadow-[0_8px_22px_rgba(251,191,36,0.22)]'
                                    : 'border-white/10 bg-white/[0.035] text-slate-300 hover:border-amber-200/40 hover:text-amber-100'
                            }`}
                        >
                            {index + 1}. {entry.title[locale]}
                        </button>
                    ))}
                </nav>

                <div className="flex-1 overflow-y-auto px-8 py-8 md:px-12 md:py-10">
                    {renderContent()}
                </div>

                <div className="flex items-center justify-between border-t border-white/10 bg-slate-950/[0.76] px-6 py-5">
                    <button
                        type="button"
                        onClick={() => setPage((currentPage) => Math.max(0, currentPage - 1))}
                        disabled={page === 0}
                        className={ACTION_BUTTON_CLASS}
                    >
                        <span className="inline-flex items-center gap-2">
                            <ChevronLeft size={16} />
                            {t('rulebook.prev')}
                        </span>
                    </button>

                    <span className="font-mono text-xl font-black uppercase tracking-[0.2em] text-amber-100/70">
                        {t('rulebook.page')} {page + 1} / {totalPages}
                    </span>

                    <button
                        type="button"
                        onClick={() =>
                            setPage((currentPage) => Math.min(totalPages - 1, currentPage + 1))
                        }
                        disabled={page === totalPages - 1}
                        className={ACTION_BUTTON_CLASS}
                    >
                        <span className="inline-flex items-center gap-2">
                            {t('rulebook.next')}
                            <ChevronRight size={16} />
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
};
