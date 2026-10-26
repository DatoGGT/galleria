import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../i18n/LangContext';
import { MALL_HOURS } from '../lib/time';
import { Icon } from './Icon';
import { Logo } from './Logo';
import { OpenStatus } from './OpenStatus';

export function Footer() {
  const { t, to } = useLang();
  const [done, setDone] = useState(false);

  const subscribe = (e: FormEvent) => {
    e.preventDefault();
    // TODO: POST to /api/newsletter/ once the Django backend exists.
    setDone(true);
  };

  return (
    <footer className="site-footer win" data-title={`${t('brand.name')} — ${t('visit.contact')}`}>
      <div className="container">
        <div className="footer-meta mono">
          <span>{t('brand.address')}</span>
          <span className="footer-rule" />
          <span>
            {MALL_HOURS.from}–{MALL_HOURS.to}
          </span>
        </div>

        <div className="footer-top">
          <div className="footer-newsletter">
            <h2 className="h-display">{t('footer.newsletter')}</h2>
            <p>{t('footer.newsletterLead')}</p>
            {done ? (
              <p className="footer-done">
                <Icon name="sparkle" size={18} /> {t('footer.subscribed')}
              </p>
            ) : (
              <form className="newsletter-form" onSubmit={subscribe}>
                <input type="email" required placeholder={t('footer.email')} aria-label={t('footer.email')} />
                <button className="btn btn-lime btn-sm" type="submit">
                  {t('footer.subscribe')} <Icon name="arrow" size={16} />
                </button>
              </form>
            )}
          </div>

          <div className="footer-cols">
            <div>
              <h3 className="mono">{t('footer.explore')}</h3>
              <Link to={to('/shops')}>{t('nav.shops')}</Link>
              <Link to={to('/food')}>{t('nav.food')}</Link>
              <Link to={to('/entertainment')}>{t('nav.entertainment')}</Link>
              <Link to={to('/services')}>{t('nav.services')}</Link>
              <Link to={to('/offers')}>{t('nav.offers')}</Link>
            </div>
            <div>
              <h3 className="mono">{t('footer.info')}</h3>
              <Link to={to('/visit')}>{t('nav.visit')}</Link>
              <Link to={to('/floors')}>{t('nav.floors')}</Link>
              <Link to={to('/news')}>{t('nav.news')}</Link>
              <Link to={to('/loyal')}>{t('nav.loyal')}</Link>
              <Link to={to('/gift-card')}>{t('nav.giftCard')}</Link>
            </div>
            <div>
              <h3 className="mono">{t('visit.contact')}</h3>
              <OpenStatus />
              <a href="mailto:office@galleria.ge">office@galleria.ge</a>
              <a href="https://allgeorgia.com/pano/galleria/" target="_blank" rel="noreferrer">
                {t('footer.tour')}
              </a>
              <div className="socials">
                <a href="https://www.facebook.com/453506198340757" aria-label="Facebook" target="_blank" rel="noreferrer">
                  <Icon name="facebook" size={18} />
                </a>
                <a href="https://www.instagram.com/galleria_tbilisi/" aria-label="Instagram" target="_blank" rel="noreferrer">
                  <Icon name="instagram" size={18} />
                </a>
                <a href="https://m.me/453506198340757" aria-label="Messenger" target="_blank" rel="noreferrer">
                  <Icon name="messenger" size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>

        <p className="footer-word" aria-hidden="true">
          {t('brand.name')}
        </p>

        <div className="footer-bottom">
          <Logo height={24} />
          <span className="mono">
            © {new Date().getFullYear()} {t('brand.name')}. {t('footer.rights')}
          </span>
        </div>
      </div>
    </footer>
  );
}
