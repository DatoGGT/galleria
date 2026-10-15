import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { LANGS } from '../i18n/dict';
import { prefixFor, stripLang, useLang } from '../i18n/LangContext';
import type { Key } from '../i18n/dict';
import { Icon } from './Icon';
import { Logo } from './Logo';
import { OpenStatus } from './OpenStatus';

const MAIN: { path: string; key: Key; color: string }[] = [
  { path: '/shops', key: 'nav.shops', color: 'var(--teal)' },
  { path: '/food', key: 'nav.food', color: 'var(--blue)' },
  { path: '/entertainment', key: 'nav.entertainment', color: 'var(--violet)' },
  { path: '/services', key: 'nav.services', color: 'var(--pink)' },
  { path: '/offers', key: 'nav.offers', color: 'var(--orange)' },
  { path: '/floors', key: 'nav.floors', color: 'var(--violet)' },
];

const SECONDARY: { path: string; key: Key }[] = [
  { path: '/news', key: 'nav.news' },
  { path: '/visit', key: 'nav.visit' },
  { path: '/loyal', key: 'nav.loyal' },
  { path: '/gift-card', key: 'nav.giftCard' },
];

/**
 * The header is three white tabs cut into the top edge of the canvas — logo and
 * socials on the left, the main nav centred, tools on the right. Once the page
 * scrolls they detach and float as pills.
 */
export function Header({ onSearch }: { onSearch: () => void }) {
  const { t, to, lang } = useLang();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
  }, [menuOpen]);

  const bare = stripLang(pathname);

  return (
    <header className={`site-header${scrolled ? ' is-scrolled' : ''}${menuOpen ? ' is-menu' : ''}`}>
      <div className="header-row">
        <div className="tab tab-left">
          <Link to={to('/')} className="header-logo" aria-label={t('brand.name')}>
            <Logo height={lang === 'ka' ? 24 : 27} />
          </Link>
          <span className="header-socials">
            <a href="https://www.instagram.com/galleria_tbilisi/" aria-label="Instagram" target="_blank" rel="noreferrer">
              <Icon name="instagram" size={16} />
            </a>
            <a href="https://www.facebook.com/453506198340757" aria-label="Facebook" target="_blank" rel="noreferrer">
              <Icon name="facebook" size={16} />
            </a>
            <a href="https://allgeorgia.com/pano/galleria/" aria-label={t('footer.tour')} target="_blank" rel="noreferrer">
              <Icon name="view360" size={16} />
            </a>
          </span>
        </div>

        <nav className="tab tab-center header-nav" aria-label="Main">
          <NavLink to={to('/')} end className="nav-link">
            {lang === 'ka' ? 'მთავარი' : lang === 'ru' ? 'Главная' : 'Home'}
          </NavLink>
          {MAIN.map((item) => (
            <NavLink key={item.path} to={to(item.path)} className="nav-link">
              {t(item.key)}
            </NavLink>
          ))}
        </nav>

        <div className="tab tab-right header-tools">
          <button className="tool-btn" onClick={onSearch} aria-label={t('nav.search')}>
            <Icon name="search" size={17} />
          </button>
          <div className="lang-switch" role="group" aria-label="Language">
            {LANGS.map((l) => (
              <Link
                key={l}
                to={prefixFor(l) + (bare === '/' ? '' : bare) || '/'}
                className={l === lang ? 'is-active' : ''}
                hrefLang={l}
                lang={l}
              >
                {l === 'ka' ? 'ქა' : l.toUpperCase()}
              </Link>
            ))}
          </div>
          <Link to={to('/visit')} className="btn btn-dark btn-sm header-cta">
            {t('nav.visit')}
          </Link>
          <button
            className="tool-btn menu-btn"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? t('nav.close') : t('nav.menu')}
          >
            <Icon name={menuOpen ? 'close' : 'menu'} size={18} />
          </button>
        </div>
      </div>

      <div className="mobile-menu" hidden={!menuOpen}>
        <nav className="mobile-nav">
          {MAIN.map((item, i) => (
            <NavLink key={item.path} to={to(item.path)} style={{ '--accent': item.color, '--i': i } as React.CSSProperties}>
              <span className="mobile-nav-num">{String(i + 1).padStart(2, '0')}</span>
              {t(item.key)}
              <Icon name="arrow" size={20} />
            </NavLink>
          ))}
        </nav>
        <div className="mobile-secondary">
          {SECONDARY.map((item) => (
            <NavLink key={item.path} to={to(item.path)}>
              {t(item.key)}
            </NavLink>
          ))}
        </div>
        <OpenStatus />
      </div>
    </header>
  );
}
