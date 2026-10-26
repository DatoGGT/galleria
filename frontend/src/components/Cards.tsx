import { Link } from 'react-router-dom';
import type { NewsItem, Offer, Store } from '../api';
import { useLang } from '../i18n/LangContext';
import { floorLabel, SECTION_COLOR, subcategoryLabel } from '../lib/categories';
import { formatDate, isOpen, useNow } from '../lib/time';
import { Icon } from './Icon';

type Accent = React.CSSProperties & { '--accent'?: string };

export function StoreCard({ store }: { store: Store }) {
  const { t, to, lang } = useLang();
  const now = useNow();
  const open = store.hours ? isOpen(store.hours, now) : null;
  const sub = subcategoryLabel(store.subcategories[0], lang);
  return (
    <Link to={to(`/store/${store.slug}`)} className="store-card" style={{ '--accent': SECTION_COLOR[store.category] } as Accent}>
      <div className="store-card-logo">
        <img src={store.logo} alt="" loading="lazy" />
      </div>
      <div className="store-card-body">
        <h3>{store.name}</h3>
        <p>
          {sub}
          {store.floor != null && (
            <>
              <span className="sep" />
              {t('common.floorN', { n: floorLabel(store.floor) })}
            </>
          )}
        </p>
      </div>
      {open != null && <span className={`store-card-dot ${open ? 'is-open' : ''}`} title={open ? t('status.openNow') : t('status.closedNow')} />}
    </Link>
  );
}

export function OfferCard({ offer }: { offer: Offer }) {
  const { t, to, locale } = useLang();
  return (
    <Link to={to(`/store/${offer.store}`)} className="offer-card">
      <div className="offer-card-top">
        <span className="offer-badge">{offer.badge}</span>
        <span className="offer-logo">
          <img src={offer.logo} alt="" loading="lazy" />
        </span>
      </div>
      <div className="offer-card-body">
        <h3>{offer.storeName}</h3>
        <p>{offer.description}</p>
      </div>
      <div className="offer-card-foot">
        <span>{t('common.validFrom', { d: formatDate(offer.date, locale, { year: undefined }) })}</span>
        <Icon name="arrowUpRight" size={18} />
      </div>
    </Link>
  );
}

export function NewsCard({ item, large = false }: { item: NewsItem; large?: boolean }) {
  const { to, locale } = useLang();
  return (
    <Link to={to(`/news/${item.slug}`)} className={`news-card${large ? ' is-large' : ''}`}>
      <div className="news-card-img">{item.cover && <img src={item.cover} alt="" loading="lazy" />}</div>
      <div className="news-card-body">
        <time dateTime={item.date}>{formatDate(item.date, locale)}</time>
        <h3>{item.title}</h3>
        {large && <p>{item.excerpt}…</p>}
      </div>
    </Link>
  );
}

export function SectionHead({ eyebrow, title, link, linkLabel }: { eyebrow?: string; title: string; link?: string; linkLabel?: string }) {
  return (
    <div className="section-head">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2>{title}</h2>
      </div>
      {link && (
        <Link to={link} className="text-link">
          {linkLabel}
          <Icon name="arrow" size={18} />
        </Link>
      )}
    </div>
  );
}

/** Mono strip above inner-page titles: "● GALLERIA TBILISI ──── RUSTAVELI AVE. 2/4". */
export function PageMeta() {
  const { t } = useLang();
  return (
    <p className="page-meta mono">
      <span className="page-meta-dot" aria-hidden="true" />
      <span>{t('brand.name')}</span>
      <span className="page-meta-rule" />
      <span>{t('brand.address')}</span>
    </p>
  );
}

export function PageHero({ title, lead, color, children }: { title: string; lead?: string; color?: string; children?: React.ReactNode }) {
  return (
    <section className="page-hero" style={{ '--accent': color ?? 'var(--ink)' } as Accent}>
      <div className="container">
        <PageMeta />
        <h1>
          <span className="mark">{title}</span>
        </h1>
        {lead && <p className="lead">{lead}</p>}
        {children}
      </div>
    </section>
  );
}
