import {
    createContext,
    useContext,
    useMemo,
    type Dispatch,
    type PropsWithChildren,
    type SetStateAction,
} from 'react';
import type { AppLocale, TranslationKey, TranslationParams } from '@gemduel/shared';
import { DEFAULT_APP_LOCALE, translate } from '@gemduel/shared';

interface LocaleContextValue {
    locale: AppLocale;
    setLocale: Dispatch<SetStateAction<AppLocale>>;
    t: <K extends TranslationKey>(
        key: K,
        ...args: TranslationParams<K> extends never ? [] : [params: TranslationParams<K>]
    ) => string;
}

const noopSetLocale: Dispatch<SetStateAction<AppLocale>> = () => undefined;

const defaultLocaleContext: LocaleContextValue = {
    locale: DEFAULT_APP_LOCALE,
    setLocale: noopSetLocale,
    t: (key, ...args) =>
        translate(
            DEFAULT_APP_LOCALE,
            key,
            ...(args as TranslationParams<typeof key> extends never
                ? []
                : [params: TranslationParams<typeof key>])
        ),
};

const LocaleContext = createContext<LocaleContextValue>(defaultLocaleContext);

interface LocaleProviderProps extends PropsWithChildren {
    locale: AppLocale;
    setLocale: Dispatch<SetStateAction<AppLocale>>;
}

export function LocaleProvider({ locale, setLocale, children }: LocaleProviderProps) {
    const value = useMemo<LocaleContextValue>(
        () => ({
            locale,
            setLocale,
            t: (key, ...args) =>
                translate(
                    locale,
                    key,
                    ...(args as TranslationParams<typeof key> extends never
                        ? []
                        : [params: TranslationParams<typeof key>])
                ),
        }),
        [locale, setLocale]
    );

    return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export const useLocale = () => useContext(LocaleContext);

export const useT = () => useContext(LocaleContext).t;
