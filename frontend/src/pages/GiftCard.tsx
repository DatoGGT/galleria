import { useState, type FormEvent } from 'react';
import { PageHero } from '../components/Cards';
import { Icon } from '../components/Icon';
import { useLang } from '../i18n/LangContext';
import type { Key } from '../i18n/dict';

const PRESETS = [50, 100, 200, 300, 500];
const RULES: Key[] = ['gift.r1', 'gift.r2', 'gift.r3', 'gift.r4'];

export function GiftCard() {
  const { t } = useLang();
  const [amount, setAmount] = useState(100);
  const [other, setOther] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    // TODO: create the order in Django and redirect to the bank payment page.
    setSent(true);
  };

  return (
    <>
      <PageHero title={t('gift.title')} lead={t('gift.lead')} color="var(--orange)" />
      <section className="container gift">
        <div className="gift-side">
          <div className="gift-card-visual is-large">
            <span className="gc-brand">Galleria Tbilisi</span>
            <span className="gc-amount">{amount} ₾</span>
            <span className="gc-chip" />
          </div>
          <div className="gift-info">
            <h3>
              <Icon name="gift" size={20} /> {t('gift.delivery')}
            </h3>
            <p>{t('gift.deliveryText')}</p>
            <h3>{t('gift.rules')}</h3>
            <ul>
              {RULES.map((r) => (
                <li key={r}>{t(r)}</li>
              ))}
            </ul>
          </div>
        </div>

        <form className="form-card" onSubmit={submit}>
          <h2>{t('gift.form')}</h2>

          <fieldset>
            <legend>
              {t('gift.amount')} <small>{t('gift.amountHint')}</small>
            </legend>
            <div className="amounts">
              {PRESETS.map((p) => (
                <button type="button" key={p} className={`chip${amount === p ? ' is-active' : ''}`} onClick={() => setAmount(p)}>
                  {p} ₾
                </button>
              ))}
              <input
                type="number"
                min={50}
                max={500}
                step={10}
                value={amount}
                onChange={(e) => setAmount(Math.min(500, Math.max(0, Number(e.target.value))))}
                aria-label={t('gift.amount')}
              />
            </div>
          </fieldset>

          <div className="field-row">
            <label className="field">
              <span>{t('gift.firstName')}</span>
              <input required autoComplete="given-name" />
            </label>
            <label className="field">
              <span>{t('gift.lastName')}</span>
              <input required autoComplete="family-name" />
            </label>
          </div>
          <div className="field-row">
            <label className="field">
              <span>{t('gift.phone')}</span>
              <input required type="tel" autoComplete="tel" placeholder="+995" />
            </label>
            <label className="field">
              <span>{t('gift.email')}</span>
              <input required type="email" autoComplete="email" />
            </label>
          </div>
          <label className="field">
            <span>{t('gift.addressField')}</span>
            <input required autoComplete="street-address" />
          </label>

          <label className="check">
            <input type="checkbox" checked={other} onChange={(e) => setOther(e.target.checked)} />
            <span>{t('gift.otherRecipient')}</span>
          </label>
          {other && (
            <div className="field-row">
              <label className="field">
                <span>{t('gift.firstName')}</span>
                <input required />
              </label>
              <label className="field">
                <span>{t('gift.phone')}</span>
                <input required type="tel" placeholder="+995" />
              </label>
            </div>
          )}

          <label className="check">
            <input type="checkbox" required />
            <span>{t('gift.terms')}</span>
          </label>

          <button className="btn btn-dark btn-block" type="submit" disabled={amount < 50}>
            {t('gift.pay')} · {amount} ₾ <Icon name="arrow" size={18} />
          </button>
          {sent && <p className="form-note">{t('gift.preview')}</p>}
        </form>
      </section>
    </>
  );
}
