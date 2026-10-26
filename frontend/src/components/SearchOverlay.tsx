import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { news, offers, stores } from '../api';
import { useLang } from '../i18n/LangContext';
import { floorLabel, SECTION_COLOR, SUBCATEGORIES } from '../lib/categories';
import { Icon } from './Icon';

type Result = { key: string; group: 'stores' | 'offers' | 'news'; title: string; meta: string; href: string; img?: string | null; color: string };

const norm = (s: string) => s.toLocaleLowerCase().normalize('NFKD').replace(/\p{M}/gu, '');

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t, to, lang } = useLang();
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQ('');
      setActive(0);
      requestAnimationFrame(() => input.current?.focus());
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [open]);

  const results = useMemo<Result[]>(() => {
    const n = norm(q.trim());
    if (!n) return [];
    // A store matches by its name or by any of its subcategory labels, in every language.
    const subMatch = new Set(
      Object.values(SUBCATEGORIES)
        .flat()
        .filter((s) => Object.values(s.label).some((l) => norm(l).includes(n)))
        .map((s) => s.id),
    );
    const s: Result[] = stores
      .filter((x) => norm(x.name).includes(n) || x.subcategories.some((c) => subMatch.has(c)))
      .slice(0, 8)
      .map((x) => ({
        key: 's' + x.slug,
        group: 'stores',
        title: x.name,
        meta: `${t(`nav.${x.category}`)}${x.floor != null ? ' · ' + t('common.floorN', { n: floorLabel(x.floor) }) : ''}`,
        href: to(`/store/${x.slug}`),
        img: x.logo,
        color: SECTION_COLOR[x.category],
      }));
    const o: Result[] = offers
      .filter((x) => norm(x.storeName + ' ' + x.description).includes(n))
      .slice(0, 4)
      .map((x) => ({
        key: 'o' + x.id,
        group: 'offers',
        title: `${x.storeName} — ${x.badge ?? ''}`,
        meta: x.description,
        href: to(`/store/${x.store}`),
        img: x.logo,
        color: SECTION_COLOR.offers,
      }));
    const w: Result[] = news
      .filter((x) => norm(x.title + ' ' + x.excerpt).includes(n))
      .slice(0, 4)
      .map((x) => ({
        key: 'n' + x.slug,
        group: 'news',
        title: x.title,
        meta: x.excerpt,
        href: to(`/news/${x.slug}`),
        img: x.cover,
        color: SECTION_COLOR.news,
      }));
    return [...s, ...o, ...w];
  }, [q, t, to]);

  useEffect(() => {
    setActive(0);
  }, [q]);

  if (!open) return null;

  const go = (r: Result) => {
    onClose();
    navigate(r.href);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === 'Enter' && results[active]) {
      go(results[active]);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const groups = (['stores', 'offers', 'news'] as const).filter((g) => results.some((r) => r.group === g));

  return (
    <div className="search-overlay" role="dialog" aria-modal="true" aria-label={t('nav.search')} onMouseDown={onClose}>
      <div className="search-panel win" data-title={t('nav.search')} onMouseDown={(e) => e.stopPropagation()} onKeyDown={onKey}>
        <div className="search-field">
          <Icon name="search" size={22} />
          <input
            ref={input}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t('search.placeholder')}
            aria-label={t('search.placeholder')}
            lang={lang}
          />
          <button className="icon-btn" onClick={onClose} aria-label={t('nav.close')}>
            <Icon name="close" />
          </button>
        </div>

        <div className="search-results">
          {!q.trim() && <p className="search-hint">{t('search.hint')}</p>}
          {q.trim() && results.length === 0 && <p className="search-hint">{t('search.empty', { q })}</p>}
          {groups.map((g) => (
            <section key={g}>
              <h3>{t(`search.${g}`)}</h3>
              <ul>
                {results.map((r, i) =>
                  r.group !== g ? null : (
                    <li key={r.key}>
                      <button
                        className={`search-item${i === active ? ' is-active' : ''}`}
                        onMouseEnter={() => setActive(i)}
                        onClick={() => go(r)}
                        style={{ '--accent': r.color } as React.CSSProperties}
                      >
                        <span className="search-thumb">{r.img && <img src={r.img} alt="" loading="lazy" />}</span>
                        <span className="search-text">
                          <strong>{r.title}</strong>
                          <small>{r.meta}</small>
                        </span>
                        <Icon name="arrow" size={18} />
                      </button>
                    </li>
                  ),
                )}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
