import { offers } from '../api';
import { OfferCard, PageHero } from '../components/Cards';
import { useLang } from '../i18n/LangContext';
import { SECTION_COLOR } from '../lib/categories';

export function Offers() {
  const { t } = useLang();
  return (
    <>
      <PageHero title={t('offers.title')} lead={t('offers.lead')} color={SECTION_COLOR.offers} />
      <section className="container section-sm">
        <div className="offer-grid">
          {offers.map((o) => (
            <OfferCard key={o.id} offer={o} />
          ))}
        </div>
      </section>
    </>
  );
}
