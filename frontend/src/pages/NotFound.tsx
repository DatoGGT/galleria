import { Link } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { Kaleidoscope } from '../components/Kaleidoscope';
import { useLang } from '../i18n/LangContext';

export function NotFound() {
  const { t, to } = useLang();
  return (
    <section className="container not-found">
      <div className="not-found-art">
        <Kaleidoscope className="kaleidoscope" />
      </div>
      <h1>{t('notFound.title')}</h1>
      <p className="lead">{t('notFound.lead')}</p>
      <Link to={to('/')} className="btn btn-dark">
        {t('notFound.home')} <Icon name="arrow" size={18} />
      </Link>
    </section>
  );
}
