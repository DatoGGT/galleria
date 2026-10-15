import { PageHero } from '../components/Cards';
import { Icon, type IconName } from '../components/Icon';
import { useLang } from '../i18n/LangContext';
import type { Key } from '../i18n/dict';

const STEPS: { icon: IconName; title: Key; text: Key }[] = [
  { icon: 'user', title: 'loyal.s1t', text: 'loyal.s1' },
  { icon: 'card', title: 'loyal.s2t', text: 'loyal.s2' },
  { icon: 'qr', title: 'loyal.s3t', text: 'loyal.s3' },
  { icon: 'sparkle', title: 'loyal.s4t', text: 'loyal.s4' },
];

// Cashback rates from the current Loyal terms on galleria.ge.
const LEVELS = [
  { stores: '3–6%', ria: '20%' },
  { stores: '5–10%', ria: '30%' },
  { stores: '10–20%', ria: '40%' },
];

export function Loyal() {
  const { t } = useLang();
  return (
    <>
      <PageHero title={t('loyal.title')} lead={t('loyal.lead')} color="var(--teal)">
        <p className="hero-pill">
          <Icon name="sparkle" size={16} /> {t('loyal.point')}
        </p>
      </PageHero>

      <section className="container section-sm">
        <h2 className="h2">{t('loyal.steps')}</h2>
        <ol className="steps">
          {STEPS.map((s, i) => (
            <li key={s.title}>
              <span className="step-num">{String(i + 1).padStart(2, '0')}</span>
              <Icon name={s.icon} size={26} />
              <h3>{t(s.title)}</h3>
              <p>{t(s.text)}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="container section-sm">
        <h2 className="h2">{t('loyal.levels')}</h2>
        <div className="levels">
          {LEVELS.map((l, i) => (
            <div key={i} className={`level level-${i + 1}`}>
              <span className="level-name">{t('loyal.level', { n: i + 1 })}</span>
              <div>
                <small>{t('loyal.stores')}</small>
                <strong>{l.stores}</strong>
              </div>
              <div>
                <small>{t('loyal.riaParking')}</small>
                <strong>{l.ria}</strong>
              </div>
            </div>
          ))}
        </div>
        <p className="note">
          <Icon name="car" size={18} /> {t('loyal.extra')}
        </p>
      </section>
    </>
  );
}
