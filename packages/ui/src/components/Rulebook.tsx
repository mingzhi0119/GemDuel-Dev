import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import { RULEBOOK_CONTENT } from './RulebookContent';
import { CardAnatomyPage } from './CardAnatomyPage';
import { useLocale, useT } from '../i18n/LocaleProvider';

interface RulebookProps {
    onClose: () => void;
    theme: 'light' | 'dark';
}

export const Rulebook: React.FC<RulebookProps> = ({ onClose, theme }) => {
    const [page, setPage] = useState(0);
    const { locale } = useLocale();
    const t = useT();

    const content = RULEBOOK_CONTENT[page];
    const totalPages = RULEBOOK_CONTENT.length;

    const renderInlineFormatting = (text: string) => {
        const segments = text.split(/(\*\*.*?\*\*)/g);
        return segments.map((segment, index) => {
            if (segment.startsWith('**') && segment.endsWith('**') && segment.length > 4) {
                return <strong key={`${segment}-${index}`}>{segment.slice(2, -2)}</strong>;
            }

            return <React.Fragment key={`${segment}-${index}`}>{segment}</React.Fragment>;
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

    // Render custom component pages
    const renderContent = () => {
        if (!content) return null;

        if (content.isCustom === 'card_anatomy') {
            return <CardAnatomyPage theme={theme} lang={locale} />;
        }

        // Default text-based page
        return (
            <>
                <h3
                    className={`text-3xl font-black uppercase tracking-tight mb-7 pb-4 border-b transition-colors duration-500 ${theme === 'dark' ? 'text-white border-slate-800' : 'text-stone-800 border-stone-100'}`}
                >
                    {content.title?.[locale] || t('rulebook.untitled')}
                </h3>
                <div
                    className={`leading-8 whitespace-pre-wrap text-base md:text-[18px] ${theme === 'dark' ? 'text-slate-300' : 'text-stone-600 font-medium'}`}
                >
                    {renderFormattedBody(content.body?.[locale] || t('rulebook.noContent'))}
                </div>
            </>
        );
    };

    return (
        <div
            className="absolute inset-0 z-[200] bg-black/80 flex items-center justify-center animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className={`rounded-[2rem] w-[94%] max-w-5xl h-[84%] flex flex-col shadow-2xl relative overflow-hidden transition-all duration-500
                ${theme === 'dark' ? 'bg-slate-900 border border-slate-700' : 'bg-white border border-stone-200'}`}
            >
                {/* Header */}
                <div
                    className={`flex items-center justify-between p-6 border-b transition-colors duration-500 ${theme === 'dark' ? 'border-slate-800 bg-slate-950/50' : 'border-stone-100 bg-[#fdfbf7]'}`}
                >
                    <div className="flex items-center gap-2 text-emerald-600">
                        <BookOpen size={24} />
                        <h2 className="font-black uppercase tracking-wider text-base">
                            {t('rulebook.title')}
                        </h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={onClose}
                            aria-label={t('rulebook.close')}
                            className={`${theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-stone-400 hover:text-stone-800'} transition-colors`}
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-10 md:p-12">
                    {content && (
                        <>
                            {/* Title for custom pages */}
                            {content.isCustom && (
                                <h3
                                    className={`text-3xl font-black uppercase tracking-tight mb-7 pb-4 border-b transition-colors duration-500 ${theme === 'dark' ? 'text-white border-slate-800' : 'text-stone-800 border-stone-100'}`}
                                >
                                    {content.title?.[locale] || t('rulebook.untitled')}
                                </h3>
                            )}
                            {renderContent()}
                        </>
                    )}
                </div>

                {/* Footer / Pagination */}
                <div
                    className={`p-6 border-t flex items-center justify-between transition-colors duration-500 ${theme === 'dark' ? 'border-slate-800 bg-slate-950/50' : 'border-stone-100 bg-[#fdfbf7]'}`}
                >
                    <button
                        onClick={() => setPage((p) => Math.max(0, p - 1))}
                        disabled={page === 0}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm font-black uppercase tracking-widest
                            ${theme === 'dark' ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' : 'bg-white border border-stone-300 text-stone-700 hover:border-stone-400 shadow-sm active:bg-stone-100'}`}
                    >
                        <ChevronLeft size={16} />
                        {t('rulebook.prev')}
                    </button>

                    <span className="text-stone-400 font-mono font-bold text-xs tracking-widest">
                        {t('rulebook.page')} {page + 1} / {totalPages}
                    </span>

                    <button
                        onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                        disabled={page === totalPages - 1}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm font-black uppercase tracking-widest
                            ${theme === 'dark' ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' : 'bg-white border border-stone-300 text-stone-700 hover:border-stone-400 shadow-sm active:bg-stone-100'}`}
                    >
                        {t('rulebook.next')}
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};
