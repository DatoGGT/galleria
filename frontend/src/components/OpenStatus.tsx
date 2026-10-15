import type { Hours } from '../api/types';
import { useLang } from '../i18n/LangContext';
import { isOpen, MALL_HOURS, useNow } from '../lib/time';

/** "● Open now · until 22:00" for the mall or a single store. */
export function OpenStatus({ hours = MALL_HOURS, compact = false }: { hours?: Hours; compact?: boolean }) {
  const { t } = useLang();
  const open = isOpen(hours, useNow());
  return (
    <span className={`open-status ${open ? 'is-open' : 'is-closed'}`}>
      <span className="pulse" aria-hidden="true" />
      {open ? t('status.openNow') : t('status.closedNow')}
      {!compact && (
        <span className="open-status-time">
          {' · '}
          {open ? t('status.until', { t: hours.to }) : t('status.opensAt', { t: hours.from })}
        </span>
      )}
    </span>
  );
}
