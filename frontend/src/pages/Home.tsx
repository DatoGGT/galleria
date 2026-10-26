import { useState } from 'react';
import { Link } from 'react-router-dom';
import { news, offers, stores } from '../api';
import { NewsCard, OfferCard, SectionHead } from '../components/Cards';
import { Icon, type IconName } from '../components/Icon';
import { Kaleidoscope } from '../components/Kaleidoscope';
import { OpenStatus } from '../components/OpenStatus';
import { useLang } from '../i18n/LangContext';
import { CATEGORIES, FLOORS, floorLabel, SECTION_COLOR } from '../lib/categories';
import { formatDate, MALL_HOURS, tbilisiMinutes, toMinutes, useNow } from '../lib/time';
import { useReveal } from '../lib/useReveal';

const FEATURED = [
  'H&M', 'Armani Exchange', 'Lacoste', 'Calvin Klein Jeans', 'Pandora', 'Karl Lagerfeld', 'Tommy hilfiger',
  'The North Face', 'Furla', 'Guess', 'Levi\'s', 'Timberland', 'Bang & Olufsen', 'M·A·C Cosmetics',
  'L\'OCCITANE', 'Pinko', 'Superdry', 'Samsonite', 'Gant', 'DKNY', 'United Colors of Benetton', 'Trussardi',
  'Calzedonia', 'JBL',
];
const featured = FEATURED.map((n) => stores.find((s) => s.name === n)).filter((s) => s != null);

/** Callouts around the hero object: a dot on the object, a dotted leader, a pill. Coordinates in % of the object box. */
const PINS: { dot: [number, number]; at: [number, number]; path: string; icon: IconName }[] = [
  { dot: [61, 26], at: [64, 5], path: '/shops', icon: 'sparkle' },
  { dot: [36, 64], at: [16, 88], path: '/floors', icon: 'layers' },
  { dot: [68, 62], at: [44, 99], path: '/visit', icon: 'clock' },
];

type Accent = React.CSSProperties & { '--accent'?: string; '--i'?: number };

function Reveal({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className={`reveal ${className}`}>
      {children}
    </div>
  );
}

/** Splits the headline at its last comma so the tail can get the lime marker. */
function splitTitle(title: string) {
  const i = title.lastIndexOf(',');
  if (i < 0) return ['', title];
  return [title.slice(0, i + 1), title.slice(i + 1).replace(/^[\s—–-]+/, '')];
}

/** Offer card styled like a little media player: prev / open / next, plus how much of today's opening hours is left. */
function HeroOffers() {
  const { t, to } = useLang();
  const [i, setI] = useState(0);
  const now = useNow();
  const list = offers.slice(0, 8);
  const o = list[i];
  if (!o) return null;

  const from = toMinutes(MALL_HOURS.from);
  const span = toMinutes(MALL_HOURS.to) - from;
  const day = Math.min(1, Math.max(0, (tbilisiMinutes(now) - from) / span));
  const step = (d: number) => setI((v) => (v + d + list.length) % list.length);

  return (
    <aside className="hero-offers">
      <h2 className="h-display">{t('home.offers')}</h2>
      <p className="hero-offers-lead">
        <span className="hero-offers-store">{o.storeName}</span> — {o.description}
      </p>
      <Link to={to(`/store/${o.store}`)} className="hero-offers-img" key={o.id}>
        <img src={o.logo} alt={o.storeName} />
        <span className="hero-offers-badge">{o.badge}</span>
      </Link>
      <p className="hero-offers-now mono">
        <span className="hero-offers-thumb">
          <img src={o.logo} alt="" />
        </span>
        {t('status.today')} · {MALL_HOURS.from}–{MALL_HOURS.to}
      </p>
      <div className="hero-offers-player">
        <span className="hero-offers-track">
          <span style={{ width: `${day * 100}%` }} />
        </span>
        <div className="hero-offers-controls">
          <span className="mono">
            {String(i + 1).padStart(2, '0')}/{String(list.length).padStart(2, '0')}
          </span>
          <button onClick={() => step(-1)} aria-label="Previous">
            <Icon name="arrowLeft" size={16} />
          </button>
          <Link to={to(`/store/${o.store}`)} className="hero-offers-go" aria-label={o.storeName}>
            <Icon name="arrowUpRight" size={16} />
          </Link>
          <button onClick={() => step(1)} aria-label="Next">
            <Icon name="arrow" size={16} />
          </button>
          <Link to={to('/offers')} className="mono hero-offers-all">
            {t('common.viewAll')}
          </Link>
        </div>
      </div>
    </aside>
  );
}

export function Home() {
  const { t, to, locale } = useLang();
  const count = (c: string) => stores.filter((s) => s.category === c).length;
  const half = Math.ceil(featured.length / 2);
  const [titleA, titleB] = splitTitle(t('home.title'));
  const pinLabels = [
    `${count('shops')} ${t('nav.shops')}`,
    `${FLOORS.length} ${t('home.floors')}`,
    `${MALL_HOURS.from}–${MALL_HOURS.to}`,
  ];

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="hero-stage container">
          <div className="hero-meta mono">
            <span>{t('home.eyebrow')}</span>
            <span className="hero-meta-rule" />
            <OpenStatus compact />
          </div>

          <div className="hero-copy">
            <h1 className="display hero-title">
              {titleA && (
                <>
                  {titleA}
                  <br />
                </>
              )}
              <span className="mark">{titleB}</span>
            </h1>
            <p className="hero-rating mono">
              <span aria-hidden="true">★★★★★</span> {stores.length} {t('home.places')} · {FLOORS.length} {t('home.floors')}
            </p>
          </div>

          <div className="hero-object">
            <span className="hero-floor-shadow" aria-hidden="true" />
            <div className="hero-disc" aria-hidden="true">
              <Kaleidoscope className="kaleidoscope" />
            </div>
            <svg className="hero-leaders" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              {PINS.map((p, i) => (
                <line key={i} x1={p.dot[0]} y1={p.dot[1]} x2={p.at[0]} y2={p.at[1]} vectorEffect="non-scaling-stroke" />
              ))}
            </svg>
            {PINS.map((p, i) => (
              <span key={i} className="hero-dot" style={{ left: `${p.dot[0]}%`, top: `${p.dot[1]}%` }} aria-hidden="true" />
            ))}
            {PINS.map((p, i) => (
              <Link key={i} to={to(p.path)} className="callout hero-pin" style={{ left: `${p.at[0]}%`, top: `${p.at[1]}%` }}>
                <span className="callout-icon">
                  <Icon name={p.icon} size={15} />
                </span>
                {pinLabels[i]}
              </Link>
            ))}
          </div>

          <HeroOffers />

          {news[0] && (
            <Link to={to(`/news/${news[0].slug}`)} className="hero-story">
              <span className="hero-story-img">
                {news[0].cover && <img src={news[0].cover} alt="" />}
                <span className="hero-story-date mono">{formatDate(news[0].date, locale, { year: undefined })}</span>
                <span className="hero-story-play">
                  <Icon name="arrowUpRight" size={20} />
                </span>
              </span>
              <span className="hero-story-text">
                <strong>{t('home.news')}.</strong> {news[0].title}
              </span>
            </Link>
          )}
        </div>

        <div className="hero-notch">
          <span className="hero-notch-cut hero-notch-cut-a" />
          <span className="hero-notch-cut hero-notch-cut-b" />
          <p>{t('home.lead')}</p>
          <Link to={to('/shops')} className="btn btn-lime">
            {t('home.ctaStores')} <Icon name="arrow" size={16} />
          </Link>
        </div>
      </section>
      <div className="canvas-break" aria-hidden="true" />

      {/* Categories */}
      <section className="section">
        <div className="container">
          <Reveal>
            <SectionHead eyebrow={t('home.discover')} title={t('brand.name')} />
          </Reveal>
          <div className="cat-grid">
            {CATEGORIES.map((c, i) => (
              <Reveal key={c}>
                <Link
                  to={to(`/${c}`)}
                  className="cat-tile"
                  style={{ '--accent': SECTION_COLOR[c], '--i': i } as Accent}
                >
                  <span className="cat-tile-count">{count(c)}</span>
                  <span className="cat-tile-orb" aria-hidden="true" />
                  <span className="cat-tile-text">
                    <strong>{t(`cat.${c}.title`)}</strong>
                    <small>{t(`cat.${c}.lead`)}</small>
                  </span>
                  <span className="cat-tile-arrow">
                    <Icon name="arrow" size={20} />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Offers */}
      <section className="section section-tint">
        <div className="container">
          <Reveal>
            <SectionHead title={t('home.offers')} link={to('/offers')} linkLabel={t('common.viewAll')} />
          </Reveal>
        </div>
        <div className="rail" tabIndex={0} aria-label={t('home.offers')}>
          {offers.slice(0, 10).map((o) => (
            <OfferCard key={o.id} offer={o} />
          ))}
        </div>
      </section>

      {/* Brands */}
      <section className="section brands">
        <div className="container">
          <Reveal>
            <SectionHead title={t('home.brands')} link={to('/shops')} linkLabel={t('common.viewAll')} />
          </Reveal>
        </div>
        {[featured.slice(0, half), featured.slice(half)].map((row, r) => (
          <div className={`marquee${r ? ' is-reverse' : ''}`} key={r}>
            <div className="marquee-track">
              {[...row, ...row].map((s, i) => (
                <Link key={i} to={to(`/store/${s.slug}`)} className="brand-logo" aria-hidden={i >= row.length} tabIndex={i >= row.length ? -1 : 0}>
                  <img src={s.logo} alt={s.name} loading="lazy" />
                </Link>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Floors teaser */}
      <section className="section">
        <div className="container">
          <Reveal>
            <div className="floors-teaser">
              <div className="floors-teaser-copy">
                <p className="eyebrow">{t('nav.floors')}</p>
                <h2 className="h-display">{t('home.floorsTitle')}</h2>
                <p className="lead">{t('home.floorsLead')}</p>
                <Link to={to('/floors')} className="btn btn-light">
                  {t('home.floorsCta')} <Icon name="arrow" size={18} />
                </Link>
              </div>
              <div className="floor-stack" aria-hidden="true">
                {FLOORS.map((f, i) => (
                  <Link
                    key={f}
                    to={to(`/floors?floor=${f}`)}
                    className="floor-slab"
                    tabIndex={-1}
                    style={{ '--i': i } as Accent}
                  >
                    <span className="floor-slab-num">{floorLabel(f)}</span>
                    <span className="floor-slab-label">{t(`floor.${f}`)}</span>
                  </Link>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Loyal + Gift card */}
      <section className="section">
        <div className="container duo">
          <Reveal>
            <Link to={to('/loyal')} className="promo promo-loyal">
              <div className="promo-art" aria-hidden="true">
                <div className="phone">
                  <div className="phone-screen">
                    <span className="phone-label">Loyal</span>
                    <span className="phone-points">248.50</span>
                    <span className="phone-sub">{t('loyal.point')}</span>
                    <span className="phone-qr">
                      <Icon name="qr" size={44} />
                    </span>
                  </div>
                </div>
              </div>
              <div className="promo-copy">
                <h2>{t('home.loyalTitle')}</h2>
                <p>{t('home.loyalLead')}</p>
                <span className="text-link">
                  {t('home.loyalCta')} <Icon name="arrow" size={18} />
                </span>
              </div>
            </Link>
          </Reveal>
          <Reveal>
            <Link to={to('/gift-card')} className="promo promo-gift">
              <div className="promo-art" aria-hidden="true">
                <div className="gift-card-visual">
                  <span className="gc-brand">Galleria Tbilisi</span>
                  <span className="gc-amount">50–500 ₾</span>
                  <span className="gc-chip" />
                </div>
              </div>
              <div className="promo-copy">
                <h2>{t('home.giftTitle')}</h2>
                <p>{t('home.giftLead')}</p>
                <span className="text-link">
                  {t('home.giftCta')} <Icon name="arrow" size={18} />
                </span>
              </div>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* News */}
      <section className="section">
        <div className="container">
          <Reveal>
            <SectionHead title={t('home.news')} link={to('/news')} linkLabel={t('common.viewAll')} />
          </Reveal>
          <div className="news-grid">
            {news.slice(0, 5).map((n, i) => (
              <Reveal key={n.slug} className={i === 0 ? 'span-2' : ''}>
                <NewsCard item={n} large={i === 0} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Visit strip */}
      <section className="section section-last">
        <div className="container">
          <Reveal>
            <div className="visit-strip">
              <div>
                <Icon name="clock" />
                <span>
                  <small>{t('visit.everyDay')}</small>
                  <strong>
                    {MALL_HOURS.from} – {MALL_HOURS.to}
                  </strong>
                </span>
              </div>
              <div>
                <Icon name="pin" />
                <span>
                  <small>{t('visit.address')}</small>
                  <strong>{t('brand.address')}</strong>
                </span>
              </div>
              <div>
                <Icon name="metro" />
                <span>
                  <small>{t('visit.metro')}</small>
                  <strong>{t('visit.metroStation')}</strong>
                </span>
              </div>
              <Link to={to('/visit')} className="btn btn-dark">
                {t('nav.visit')} <Icon name="arrow" size={18} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
