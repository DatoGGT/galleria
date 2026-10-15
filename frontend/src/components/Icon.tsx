const PATHS = {
  search: <><circle cx="11" cy="11" r="6.5" /><path d="m20 20-4.2-4.2" /></>,
  arrow: <path d="M5 12h14m-5-5 5 5-5 5" />,
  arrowLeft: <path d="M19 12H5m5-5-5 5 5 5" />,
  arrowUpRight: <path d="M7 17 17 7m-8 0h8v8" />,
  chevronDown: <path d="m6 9 6 6 6-6" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  menu: <path d="M4 8h16M4 16h16" />,
  clock: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>,
  pin: <><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" /><circle cx="12" cy="10" r="2.3" /></>,
  phone: <path d="M6.6 3.5h2.7l1.5 4-2 1.3a10.5 10.5 0 0 0 6.4 6.4l1.3-2 4 1.5v2.7a2 2 0 0 1-2.2 2A16.6 16.6 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2Z" />,
  layers: <><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="m3 13 9 5 9-5" /></>,
  metro: <><path d="M4 19 9 5l3 8 3-8 5 14" /></>,
  bus: <><rect x="5" y="3.5" width="14" height="14" rx="3" /><path d="M5 11h14M8 20.5v-3m8 3v-3" /><circle cx="8.5" cy="14.3" r=".6" /><circle cx="15.5" cy="14.3" r=".6" /></>,
  car: <><path d="M5 16.5V12l2-5h10l2 5v4.5" /><path d="M4 12h16v4.5H4z" /><path d="M7 19v-2.5m10 2.5v-2.5" /></>,
  mail: <><rect x="3.5" y="5.5" width="17" height="13" rx="2.5" /><path d="m4 7 8 6 8-6" /></>,
  gift: <><rect x="4" y="9" width="16" height="11" rx="2" /><path d="M3 9h18M12 9v11M12 9S10.5 4 8 4.6C5.5 5.2 7 9 12 9Zm0 0s1.5-5 4-4.4C18.5 5.2 17 9 12 9Z" /></>,
  sparkle: <path d="M12 3c.6 4.6 3.4 7.4 8 8-4.6.6-7.4 3.4-8 8-.6-4.6-3.4-7.4-8-8 4.6-.6 7.4-3.4 8-8Z" />,
  qr: <><rect x="4" y="4" width="6" height="6" rx="1" /><rect x="14" y="4" width="6" height="6" rx="1" /><rect x="4" y="14" width="6" height="6" rx="1" /><path d="M14 14h2v2h-2zM18 18h2v2h-2zM14 18h2M18 14h2" /></>,
  user: <><circle cx="12" cy="8.5" r="3.8" /><path d="M4.5 20a7.5 7.5 0 0 1 15 0" /></>,
  card: <><rect x="3" y="5.5" width="18" height="13" rx="2.5" /><path d="M3 10h18M7 15h4" /></>,
  globe: <><circle cx="12" cy="12" r="8.5" /><path d="M3.5 12h17M12 3.5c2.5 2.5 3.5 5.3 3.5 8.5s-1 6-3.5 8.5c-2.5-2.5-3.5-5.3-3.5-8.5s1-6 3.5-8.5Z" /></>,
  instagram: <><rect x="4" y="4" width="16" height="16" rx="5" /><circle cx="12" cy="12" r="3.6" /><circle cx="16.8" cy="7.2" r=".7" /></>,
  facebook: <path d="M14 8.5h2.5V5H14c-2.2 0-3.5 1.4-3.5 3.6V11H8v3.4h2.5V21H14v-6.6h2.4l.6-3.4h-3V9.3c0-.5.3-.8 1-.8Z" />,
  messenger: <><path d="M12 3.5c-4.8 0-8.5 3.5-8.5 8 0 2.5 1.2 4.7 3 6.2V21l3-1.6c.8.2 1.6.3 2.5.3 4.8 0 8.5-3.5 8.5-8s-3.7-8-8.5-8Z" /><path d="m7.5 13.5 3-3 2 2 3-3" /></>,
  view360: <><ellipse cx="12" cy="12" rx="8.5" ry="4" /><path d="M12 3.5v4M12 16.5v4" /></>,
} as const;

export type IconName = keyof typeof PATHS;

export function Icon({ name, size = 20, className }: { name: IconName; size?: number; className?: string }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {PATHS[name]}
    </svg>
  );
}
