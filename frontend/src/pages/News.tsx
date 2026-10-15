import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { findNews, news } from '../api';
import { NewsCard, PageHero, SectionHead } from '../components/Cards';
import { Icon } from '../components/Icon';
import { useLang } from '../i18n/LangContext';
import { SECTION_COLOR } from '../lib/categories';
import { formatDate } from '../lib/time';
import { NotFound } from './NotFound';

const PAGE = 13;

export function NewsList() {
  const { t } = useLang();
  const [shown, setShown] = useState(PAGE);
  return (
    <>
      <PageHero title={t('news.title')} lead={t('news.lead')} color={SECTION_COLOR.news} />
      <section className="container section-sm">
        <div className="news-grid">
          {news.slice(0, shown).map((n, i) => (
            <div key={n.slug} className={i === 0 ? 'span-2' : ''}>
              <NewsCard item={n} large={i === 0} />
            </div>
          ))}
        </div>
        {shown < news.length && (
          <div className="load-more">
            <button className="btn btn-ghost" onClick={() => setShown((s) => s + 12)}>
              {t('common.loadMore')}
            </button>
          </div>
        )}
      </section>
    </>
  );
}

export function NewsDetail() {
  const { slug = '' } = useParams();
  const { t, to, locale } = useLang();
  const item = findNews(slug);
  if (!item) return <NotFound />;
  const more = news.filter((n) => n.slug !== slug).slice(0, 3);

  return (
    <article className="article">
      <div className="container article-narrow">
        <Link to={to('/news')} className="back-link">
          <Icon name="arrowLeft" size={18} /> {t('news.title')}
        </Link>
        <time dateTime={item.date} className="eyebrow">
          {formatDate(item.date, locale)}
        </time>
        <h1 className="h-display">{item.title}</h1>
      </div>
      {item.cover && (
        <div className="container article-cover">
          <img src={item.cover} alt="" />
        </div>
      )}
      <div className="container article-narrow article-body">
        {/* The legacy API only exposes a teaser; the full text will come from the Django CMS. */}
        <p className="lead">{item.excerpt}…</p>
      </div>
      <div className="container section-sm">
        <SectionHead title={t('home.news')} link={to('/news')} linkLabel={t('common.viewAll')} />
        <div className="news-grid">
          {more.map((n) => (
            <NewsCard key={n.slug} item={n} />
          ))}
        </div>
      </div>
    </article>
  );
}
