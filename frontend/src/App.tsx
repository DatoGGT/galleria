import { useEffect, useState } from 'react';
import { Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { SearchOverlay } from './components/SearchOverlay';
import type { Lang } from './i18n/dict';
import { LangProvider } from './i18n/LangContext';
import { Directory } from './pages/Directory';
import { Floors } from './pages/Floors';
import { GiftCard } from './pages/GiftCard';
import { Home } from './pages/Home';
import { Loyal } from './pages/Loyal';
import { NewsDetail, NewsList } from './pages/News';
import { NotFound } from './pages/NotFound';
import { Offers } from './pages/Offers';
import { StorePage } from './pages/Store';
import { Visit } from './pages/Visit';

function Layout({ lang }: { lang: Lang }) {
  const { pathname } = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <LangProvider lang={lang}>
      <div className={`app lang-${lang}`}>
        <div className="frame">
          <Header onSearch={() => setSearchOpen(true)} />
          <main className="canvas">
            <Outlet />
          </main>
          <Footer />
        </div>
        <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      </div>
    </LangProvider>
  );
}

const pages = (
  <>
    <Route index element={<Home />} />
    <Route path="shops" element={<Directory category="shops" />} />
    <Route path="food" element={<Directory category="food" />} />
    <Route path="entertainment" element={<Directory category="entertainment" />} />
    <Route path="services" element={<Directory category="services" />} />
    <Route path="store/:slug" element={<StorePage />} />
    <Route path="offers" element={<Offers />} />
    <Route path="news" element={<NewsList />} />
    <Route path="news/:slug" element={<NewsDetail />} />
    <Route path="floors" element={<Floors />} />
    <Route path="visit" element={<Visit />} />
    <Route path="loyal" element={<Loyal />} />
    <Route path="gift-card" element={<GiftCard />} />
    <Route path="*" element={<NotFound />} />
  </>
);

export function App() {
  return (
    <Routes>
      <Route path="/en" element={<Layout lang="en" />}>{pages}</Route>
      <Route path="/ru" element={<Layout lang="ru" />}>{pages}</Route>
      <Route path="/" element={<Layout lang="ka" />}>{pages}</Route>
    </Routes>
  );
}
