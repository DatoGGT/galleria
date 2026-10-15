import { PageHero } from '../components/Cards';
import { Icon, type IconName } from '../components/Icon';
import { OpenStatus } from '../components/OpenStatus';
import { useLang } from '../i18n/LangContext';
import { MALL_HOURS } from '../lib/time';

const BUSES = [6, 14, 31, 37, 42, 46, 52, 61, 87, 88, 124, 140, 150];
const MINIBUSES = [2, 4, 10, 31, 41, 72, 118, 131, 133, 137];
const MAPS = 'https://www.google.com/maps/search/?api=1&query=Galleria+Tbilisi';

function Block({ icon, title, children }: { icon: IconName; title: string; children: React.ReactNode }) {
  return (
    <div className="visit-block">
      <span className="visit-icon">
        <Icon name={icon} />
      </span>
      <h3>{title}</h3>
      {children}
    </div>
  );
}

export function Visit() {
  const { t, lang } = useLang();
  return (
    <>
      <PageHero title={t('visit.title')} lead={t('visit.lead')} />
      <section className="container visit">
        <div className="visit-map">
          <iframe
            title={t('brand.name')}
            src={`https://www.google.com/maps?q=Galleria+Tbilisi&hl=${lang}&z=16&output=embed`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <div className="visit-map-card glass">
            <OpenStatus />
            <strong>{t('visit.addressFull')}</strong>
            <a href={MAPS} target="_blank" rel="noreferrer" className="btn btn-dark btn-sm">
              {t('visit.directions')} <Icon name="arrowUpRight" size={16} />
            </a>
          </div>
        </div>

        <div className="visit-grid">
          <Block icon="clock" title={t('visit.hours')}>
            <p className="visit-big">
              {MALL_HOURS.from} – {MALL_HOURS.to}
            </p>
            <p>{t('visit.everyDay')}</p>
          </Block>
          <Block icon="metro" title={t('visit.metro')}>
            <p className="visit-big">{t('visit.metroStation')}</p>
          </Block>
          <Block icon="car" title={t('visit.parking')}>
            <p>{t('visit.parkingText')}</p>
          </Block>
          <Block icon="bus" title={t('visit.bus')}>
            <div className="route-list">
              {BUSES.map((n) => (
                <span key={n}>{n}</span>
              ))}
            </div>
          </Block>
          <Block icon="bus" title={t('visit.minibus')}>
            <div className="route-list">
              {MINIBUSES.map((n) => (
                <span key={n}>{n}</span>
              ))}
            </div>
          </Block>
          <Block icon="mail" title={t('visit.contact')}>
            <p>
              <a href="mailto:office@galleria.ge">office@galleria.ge</a>
            </p>
            <p>
              <a href="https://allgeorgia.com/pano/galleria/" target="_blank" rel="noreferrer">
                {t('footer.tour')} ↗
              </a>
            </p>
          </Block>
        </div>
      </section>
    </>
  );
}
