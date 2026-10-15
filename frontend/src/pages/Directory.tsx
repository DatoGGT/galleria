import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { stores } from '../api';
import { PageHero, StoreCard } from '../components/Cards';
import { Icon } from '../components/Icon';
import { useLang } from '../i18n/LangContext';
import { FLOORS, floorLabel, SECTION_COLOR, SUBCATEGORIES, type Category } from '../lib/categories';

const AUDIENCES = ['female', 'male', 'kids'] as const;

export function Directory({ category }: { category: Category }) {
  const { t, lang } = useLang();
  // Filters live in the URL so a filtered view can be shared or bookmarked.
  const [params, setParams] = useSearchParams();
  const q = params.get('q') ?? '';
  const sub = params.get('type') ? Number(params.get('type')) : null;
  const floor = params.get('floor') ? Number(params.get('floor')) : null;
  const audience = params.get('for');

  const set = (key: string, value: string | number | null) => {
    const next = new URLSearchParams(params);
    if (value == null || value === '') next.delete(key);
    else next.set(key, String(value));
    setParams(next, { replace: true });
  };

  const all = useMemo(() => stores.filter((s) => s.category === category), [category]);
  // Floors that have something in this category; the others are shown but disabled.
  const floorsInUse = useMemo(() => new Set(all.map((s) => s.floor)), [all]);
  const subs = SUBCATEGORIES[category].filter((s) => all.some((x) => x.subcategories.includes(s.id)));

  const list = all.filter(
    (s) =>
      (!q || s.name.toLowerCase().includes(q.toLowerCase())) &&
      (sub == null || s.subcategories.includes(sub)) &&
      (floor == null || s.floor === floor) &&
      (!audience || s.audience.includes(audience as (typeof AUDIENCES)[number])),
  );

  const filtered = q || sub != null || floor != null || audience;

  return (
    <div style={{ '--accent': SECTION_COLOR[category] } as React.CSSProperties}>
      <PageHero title={t(`cat.${category}.title`)} lead={t(`cat.${category}.lead`)} color={SECTION_COLOR[category]} />

      <div className="filter-bar">
        <div className="container filter-row">
          <label className="filter-search">
            <Icon name="search" size={18} />
            <input value={q} onChange={(e) => set('q', e.target.value)} placeholder={t('dir.search')} type="search" />
          </label>

          <div className="segmented" role="group" aria-label={t('common.floor')}>
            <button className={floor == null ? 'is-active' : ''} onClick={() => set('floor', null)}>
              {t('common.allFloors')}
            </button>
            {FLOORS.map((f) => (
              <button
                key={f}
                className={floor === f ? 'is-active' : ''}
                onClick={() => set('floor', floor === f ? null : f)}
                disabled={!floorsInUse.has(f) && floor !== f}
                aria-label={t('common.floorN', { n: floorLabel(f) })}
              >
                {floorLabel(f)}
              </button>
            ))}
          </div>

          {category === 'shops' && (
            <div className="segmented" role="group">
              {AUDIENCES.map((a) => (
                <button key={a} className={audience === a ? 'is-active' : ''} onClick={() => set('for', audience === a ? null : a)}>
                  {t(`aud.${a}`)}
                </button>
              ))}
            </div>
          )}
        </div>

        {subs.length > 1 && (
          <div className="container chips" role="group">
            <button className={`chip${sub == null ? ' is-active' : ''}`} onClick={() => set('type', null)}>
              {t('common.all')}
            </button>
            {subs.map((s) => (
              <button key={s.id} className={`chip${sub === s.id ? ' is-active' : ''}`} onClick={() => set('type', sub === s.id ? null : s.id)}>
                {s.label[lang]}
              </button>
            ))}
          </div>
        )}
      </div>

      <section className="container directory">
        <p className="result-count">
          {t('common.places', { n: list.length })}
          {filtered && (
            <button className="text-link" onClick={() => setParams({}, { replace: true })}>
              {t('dir.clear')}
            </button>
          )}
        </p>
        {list.length ? (
          <div className="store-grid">
            {list.map((s) => (
              <StoreCard key={s.slug} store={s} />
            ))}
          </div>
        ) : (
          <p className="empty">{t('dir.empty')}</p>
        )}
      </section>
    </div>
  );
}
