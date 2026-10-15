import { Link, useParams } from 'react-router-dom';
import { findStore, offers, stores } from '../api';
import { OfferCard, SectionHead, StoreCard } from '../components/Cards';
import { Icon } from '../components/Icon';
import { OpenStatus } from '../components/OpenStatus';
import { useLang } from '../i18n/LangContext';
import { floorLabel, SECTION_COLOR, subcategoryLabel } from '../lib/categories';
import { MALL_HOURS } from '../lib/time';
import { NotFound } from './NotFound';

export function StorePage() {
  const { slug = '' } = useParams();
  const { t, to, lang } = useLang();
  const store = findStore(slug);
  if (!store) return <NotFound />;

  const hours = store.hours ?? MALL_HOURS;
  const accent = SECTION_COLOR[store.category];
  const storeOffers = offers.filter((o) => o.store === store.slug);
  const similar = stores
    .filter((s) => s.slug !== store.slug && s.category === store.category && s.subcategories[0] === store.subcategories[0])
    .slice(0, 4);

  return (
    <div className="store-page" style={{ '--accent': accent } as React.CSSProperties}>
      <div className="container">
        <Link to={to(`/${store.category}`)} className="back-link">
          <Icon name="arrowLeft" size={18} /> {t(`cat.${store.category}.title`)}
        </Link>

        <div className="store-hero">
          <div className="store-hero-logo">
            <img src={store.logo} alt={store.name} />
          </div>

          <div className="store-hero-info">
            <div className="store-tags">
              {store.subcategories.map((id) => (
                <span key={id} className="tag">
                  {subcategoryLabel(id, lang)}
                </span>
              ))}
            </div>
            <h1 className="h-display">{store.name}</h1>
            <OpenStatus hours={hours} />

            <dl className="info-list">
              {store.floor != null && (
                <div>
                  <dt>
                    <Icon name="layers" /> {t('store.location')}
                  </dt>
                  <dd>
                    {t('common.floorN', { n: floorLabel(store.floor) })}
                    <small>{t(`floor.${store.floor}` as 'floor.0')}</small>
                  </dd>
                </div>
              )}
              <div>
                <dt>
                  <Icon name="clock" /> {store.hours ? t('store.hours') : t('store.mallHours')}
                </dt>
                <dd>
                  {t('visit.everyDay')}, {hours.from} – {hours.to}
                </dd>
              </div>
              {store.phone && (
                <div>
                  <dt>
                    <Icon name="phone" /> {t('store.phone')}
                  </dt>
                  <dd>
                    <a href={`tel:${store.phone.replace(/\s/g, '')}`}>{store.phone}</a>
                  </dd>
                </div>
              )}
            </dl>

            <div className="store-actions">
              {store.places.length > 0 && (
                <Link to={to(`/floors?store=${store.slug}`)} className="btn btn-dark">
                  <Icon name="layers" size={18} /> {t('store.onPlan')}
                </Link>
              )}
              {store.phone && (
                <a href={`tel:${store.phone.replace(/\s/g, '')}`} className="btn btn-ghost">
                  <Icon name="phone" size={18} /> {t('store.call')}
                </a>
              )}
            </div>
          </div>
        </div>

        {storeOffers.length > 0 && (
          <section className="section-sm">
            <SectionHead title={t('store.offers', { name: store.name })} />
            <div className="offer-grid">
              {storeOffers.map((o) => (
                <OfferCard key={o.id} offer={o} />
              ))}
            </div>
          </section>
        )}

        {similar.length > 0 && (
          <section className="section-sm">
            <SectionHead
              title={t('store.more', { cat: subcategoryLabel(store.subcategories[0], lang) })}
              link={to(`/${store.category}?type=${store.subcategories[0]}`)}
              linkLabel={t('common.viewAll')}
            />
            <div className="store-grid">
              {similar.map((s) => (
                <StoreCard key={s.slug} store={s} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
