import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { findStore, stores } from '../api';
import { PageMeta } from '../components/Cards';
import { Icon } from '../components/Icon';
import { Logo } from '../components/Logo';
import { floorOfPlace, OVERVIEW, WayfinderMap } from '../components/WayfinderMap';
import { useLang } from '../i18n/LangContext';
import { CATEGORIES, floorLabel, MAP_FLOORS, SECTION_COLOR, subcategoryLabel, type Category } from '../lib/categories';

const onFloor = (f: number) => stores.filter((s) => s.places.some((p) => floorOfPlace(p) === f));

export function Floors() {
  const { t, to, lang } = useLang();
  // ?floor=2&store=lacoste&cats=shops,food — shareable, and what store pages link to.
  const [params, setParams] = useSearchParams();
  const selected = params.get('store');
  const selectedStore = selected ? findStore(selected) : undefined;
  const floor = params.has('floor')
    ? Number(params.get('floor'))
    : selectedStore?.places[0]
      ? floorOfPlace(selectedStore.places[0])
      : 0;
  const cats = useMemo(
    () => new Set((params.get('cats')?.split(',') ?? CATEGORIES).filter((c): c is Category => CATEGORIES.includes(c as Category))),
    [params],
  );
  const [hovered, setHovered] = useState<string | null>(null);
  const [q, setQ] = useState('');

  const update = (next: Record<string, string | null>) => {
    const p = new URLSearchParams(params);
    for (const [k, v] of Object.entries(next)) v == null ? p.delete(k) : p.set(k, v);
    setParams(p, { replace: true });
  };
  const toggleCat = (c: Category) => {
    const next = new Set(cats);
    next.has(c) ? next.delete(c) : next.add(c);
    update({ cats: next.size === CATEGORIES.length ? null : [...next].join(',') });
  };

  const isOverview = floor === OVERVIEW;
  const list = (isOverview ? stores.filter((s) => s.places.length) : onFloor(floor)).filter(
    (s) => cats.has(s.category) && s.name.toLowerCase().includes(q.toLowerCase()),
  );
  const focusStore = selectedStore && (isOverview || selectedStore.places.some((p) => floorOfPlace(p) === floor)) ? selectedStore : undefined;

  return (
    <section className="container wf-page">
      <header className="wf-head">
        <div>
          <PageMeta />
          <h1 className="h-display">
            <span className="mark">{t('floors.title')}</span>
          </h1>
        </div>
        <p className="lead">{t('floors.lead')}</p>
      </header>

      <div className="wf-layout">
        {/* Left: categories + stores on this floor */}
        <aside className="wf-side">
          <div className="wf-cats" role="group" aria-label={t('floors.categories')}>
            {CATEGORIES.map((c) => (
              <button
                key={c}
                className={`wf-cat${cats.has(c) ? ' is-on' : ''}`}
                style={{ '--accent': SECTION_COLOR[c] } as React.CSSProperties}
                onClick={() => toggleCat(c)}
                aria-pressed={cats.has(c)}
              >
                <span className="wf-check">
                  <svg viewBox="0 0 16 16" aria-hidden="true">
                    <path d="m4 8.5 2.5 2.5L12 5.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                {t(`nav.${c}`)}
              </button>
            ))}
          </div>

          <label className="filter-search">
            <Icon name="search" size={18} />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('floors.find')} type="search" />
          </label>

          <ul className="wf-list">
            {list.map((s) => (
              <li key={s.slug}>
                <button
                  className={s.slug === (hovered ?? selected) ? 'is-active' : ''}
                  onMouseEnter={() => setHovered(s.slug)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => {
                    const own = s.places.find((p) => floorOfPlace(p) === floor) ?? s.places[0];
                    update({ store: s.slug, floor: String(floorOfPlace(own)) });
                  }}
                  style={{ '--accent': SECTION_COLOR[s.category] } as React.CSSProperties}
                >
                  <span className="wf-list-logo">
                    <img src={s.logo} alt="" loading="lazy" />
                  </span>
                  <span className="wf-list-text">
                    <strong>{s.name}</strong>
                    <small>
                      {subcategoryLabel(s.subcategories[0], lang)}
                      {isOverview && ` · ${t('common.floorN', { n: [...new Set(s.places.map(floorOfPlace))].map(floorLabel).join(', ') })}`}
                    </small>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Centre: the map */}
        <div className="wf-stage">
          <div className="wf-stage-head">
            <h2>{isOverview ? t('floors.overview') : t('common.floorN', { n: floorLabel(floor) })}</h2>
            <p>{isOverview ? t('common.places', { n: list.length }) : `${t(`floor.${floor}` as 'floor.0')} · ${t('common.places', { n: list.length })}`}</p>
          </div>

          <WayfinderMap
            stores={stores}
            floor={floor}
            categories={cats}
            selected={selected}
            hovered={hovered}
            onHover={setHovered}
            onSelect={(slug, f) => update({ store: slug, floor: String(f) })}
          />

          {focusStore ? (
            <div className="plan-selected">
              <img src={focusStore.logo} alt="" />
              <div>
                <strong>{focusStore.name}</strong>
                <small>
                  {subcategoryLabel(focusStore.subcategories[0], lang)} ·{' '}
                  {t('common.floorN', { n: [...new Set(focusStore.places.map(floorOfPlace))].map(floorLabel).join(', ') })}
                </small>
              </div>
              <Link to={to(`/store/${focusStore.slug}`)} className="btn btn-dark btn-sm">
                {t('common.readMore')} <Icon name="arrow" size={16} />
              </Link>
              <button className="icon-btn" onClick={() => update({ store: null })} aria-label={t('nav.close')}>
                <Icon name="close" size={18} />
              </button>
            </div>
          ) : (
            !isOverview && <p className="wf-hint">{t('floors.hint')}</p>
          )}
        </div>

        {/* Right: floor picker */}
        <nav className="wf-floors" aria-label={t('common.floor')}>
          <button className={`wf-floor wf-floor-all${isOverview ? ' is-active' : ''}`} onClick={() => update({ floor: String(OVERVIEW), store: null })}>
            <Logo height={30} />
            <small>{t('floors.overview')}</small>
          </button>
          {MAP_FLOORS.map((f) => {
            const here = new Set(onFloor(f).map((s) => s.category));
            return (
              <button
                key={f}
                className={`wf-floor${f === floor ? ' is-active' : ''}`}
                onClick={() => {
                  setQ('');
                  update({ floor: String(f), store: null });
                }}
                aria-current={f === floor}
              >
                <span className="wf-floor-num">{floorLabel(f)}</span>
                <span className="wf-floor-label">{t(`floor.${f}` as 'floor.0')}</span>
                <span className="wf-floor-dots" aria-hidden="true">
                  {CATEGORIES.map((c) => (
                    <i key={c} className={here.has(c) && cats.has(c) ? 'is-on' : ''} style={{ '--accent': SECTION_COLOR[c] } as React.CSSProperties} />
                  ))}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </section>
  );
}
