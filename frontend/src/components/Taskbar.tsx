import { NavLink } from 'react-router-dom';
import { useLang } from '../i18n/LangContext';
import { tbilisiMinutes, useNow } from '../lib/time';
import { Icon, type IconName } from './Icon';
import { OpenStatus } from './OpenStatus';

const TASKS: { path: string; icon: IconName; key: 'nav.shops' | 'nav.floors' | 'nav.offers' | 'nav.visit' }[] = [
  { path: '/shops', icon: 'card', key: 'nav.shops' },
  { path: '/floors', icon: 'layers', key: 'nav.floors' },
  { path: '/offers', icon: 'sparkle', key: 'nav.offers' },
  { path: '/visit', icon: 'pin', key: 'nav.visit' },
];

/** A Windows-98 style taskbar pinned to the bottom of the screen. */
export function Taskbar({ onStart }: { onStart: () => void }) {
  const { t, to } = useLang();
  const m = tbilisiMinutes(useNow());
  const clock = `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;

  return (
    <nav className="taskbar" aria-label="Taskbar">
      <button className="taskbar-start" onClick={onStart}>
        <span className="taskbar-flag" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
        </span>
        {t('nav.search')}
      </button>
      <span className="taskbar-divider" aria-hidden="true" />
      <div className="taskbar-tasks">
        {TASKS.map((task) => (
          <NavLink key={task.path} to={to(task.path)} className="taskbar-task">
            <Icon name={task.icon} size={15} />
            <span>{t(task.key)}</span>
          </NavLink>
        ))}
      </div>
      <div className="taskbar-tray">
        <OpenStatus compact />
        <time className="taskbar-clock">{clock}</time>
      </div>
    </nav>
  );
}
