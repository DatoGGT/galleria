import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react';
import { DICTS, LOCALE, type Key, type Lang } from './dict';

type Ctx = {
  lang: Lang;
  locale: string;
  t: (key: Key, vars?: Record<string, string | number>) => string;
  /** Prefixes an app path with the language segment ("/shops" -> "/en/shops"). */
  to: (path: string) => string;
};

const LangContext = createContext<Ctx | null>(null);

export const prefixFor = (lang: Lang) => (lang === 'ka' ? '' : `/${lang}`);

/** Strips a leading /en or /ru so the path can be re-prefixed for another language. */
export const stripLang = (pathname: string) => pathname.replace(/^\/(en|ru)(?=\/|$)/, '') || '/';

export function LangProvider({ lang, children }: { lang: Lang; children: ReactNode }) {
  const t = useCallback<Ctx['t']>(
    (key, vars) => {
      let s: string = DICTS[lang][key] ?? DICTS.en[key] ?? key;
      if (vars) for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, String(v));
      return s;
    },
    [lang],
  );
  const value = useMemo<Ctx>(
    () => ({
      lang,
      locale: LOCALE[lang],
      t,
      to: (path) => prefixFor(lang) + (path === '/' ? '' : path) || '/',
    }),
    [lang, t],
  );
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used inside LangProvider');
  return ctx;
}
