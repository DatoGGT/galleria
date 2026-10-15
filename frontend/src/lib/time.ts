import { useSyncExternalStore } from 'react';
import type { Hours } from '../api/types';

export const MALL_HOURS: Hours = { from: '10:00', to: '22:00' };

export const toMinutes =(hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

/** Minutes past midnight in Tbilisi, whatever the visitor's time zone. */
export function tbilisiMinutes(now: Date) {
  const [h, m] = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Tbilisi',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  })
    .format(now)
    .split(':')
    .map(Number);
  return h * 60 + m;
}

export function isOpen(hours: Hours, now: Date) {
  const t = tbilisiMinutes(now);
  const from = toMinutes(hours.from);
  const to = toMinutes(hours.to);
  return to > from ? t >= from && t < to : t >= from || t < to;
}

// One shared minute clock, so a grid of 160 store cards doesn't start 160 timers.
let now = new Date();
const listeners = new Set<() => void>();
let timer: ReturnType<typeof setInterval> | undefined;

function subscribe(listener: () => void) {
  listeners.add(listener);
  timer ??= setInterval(() => {
    now = new Date();
    listeners.forEach((l) => l());
  }, 60_000);
  return () => {
    listeners.delete(listener);
    if (!listeners.size) {
      clearInterval(timer);
      timer = undefined;
    }
  };
}

/** Current time, refreshed every minute so open/closed labels stay correct. */
export const useNow = () => useSyncExternalStore(subscribe, () => now);

// Chrome ships without Georgian locale data and silently falls back to English,
// so Georgian dates are formatted by hand.
const KA_MONTHS = ['იანვარი', 'თებერვალი', 'მარტი', 'აპრილი', 'მაისი', 'ივნისი', 'ივლისი', 'აგვისტო', 'სექტემბერი', 'ოქტომბერი', 'ნოემბერი', 'დეკემბერი'];

export function formatDate(iso: string, locale: string, opts?: Intl.DateTimeFormatOptions) {
  if (locale.startsWith('ka')) {
    const [y, m, d] = iso.split('-').map(Number);
    return `${d} ${KA_MONTHS[m - 1]}${opts && 'year' in opts && !opts.year ? '' : `, ${y}`}`;
  }
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    ...opts,
  }).format(new Date(iso + 'T12:00:00'));
}
