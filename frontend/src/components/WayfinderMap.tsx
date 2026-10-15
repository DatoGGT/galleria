import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { Store } from '../api';
import { useLang } from '../i18n/LangContext';
import type { Category } from '../lib/categories';

/** "2.14" -> 2, "-1.03" -> -1 */
export const floorOfPlace = (place: string) => Number(place.split('.')[0]);

/** Level 7 in the SVG is the roof: selecting it shows the whole building. */
export const OVERVIEW = 7;

type Props = {
  stores: Store[];
  floor: number;
  categories: Set<Category>;
  selected: string | null;
  hovered: string | null;
  onSelect: (slug: string, floor: number) => void;
  onHover: (slug: string | null) => void;
};

// The isometric plan is the legacy galleria.ge SVG (see scripts/build-map.mjs).
// It is injected once and then driven by toggling classes, so React never
// re-renders its ~3,700 nodes.
let svgCache: Promise<string> | null = null;
const loadSvg = () => (svgCache ??= import('../assets/floors-map.svg?raw').then((m) => m.default));

export function WayfinderMap({ stores, floor, categories, selected, hovered, onSelect, onHover }: Props) {
  const { lang } = useLang();
  const host = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [bubble, setBubble] = useState<{ x: number; y: number; store: Store } | null>(null);
  const byPlace = useRef(new Map<string, Store>());
  const lastFloor = useRef<number | null>(null);

  // Inject the SVG and tag every unit with its store and category.
  useEffect(() => {
    let live = true;
    loadSvg().then((svg) => {
      if (!live || !host.current) return;
      host.current.innerHTML = svg;
      byPlace.current.clear();
      for (const s of stores) for (const p of s.places) byPlace.current.set(p, s);
      host.current.querySelectorAll<SVGElement>('.shop-area').forEach((el) => {
        const s = byPlace.current.get(el.dataset.shopAreaId ?? '');
        if (s) {
          el.dataset.slug = s.slug;
          el.dataset.cat = s.category;
        }
      });
      setReady(true);
    });
    return () => {
      live = false;
    };
  }, [stores]);

  // Floors at or below the active one stay; higher ones lift away, top first.
  useLayoutEffect(() => {
    if (!ready || !host.current) return;
    const rising = lastFloor.current !== null && floor > lastFloor.current;
    host.current.querySelectorAll<SVGGElement>('.floor-container').forEach((g) => {
      const f = Number(g.dataset.floor);
      g.classList.toggle('visible', f <= floor);
      g.classList.toggle('active', f === floor);
      // Stagger: lifting floors leave from the top down, landing floors arrive bottom up.
      g.style.transitionDelay = `${(rising ? f + 1 : 7 - f) * 70}ms`;
    });
    host.current.querySelector('#stair')?.classList.toggle('visible', floor !== -1);
    host.current.querySelector('#stair-icons')?.classList.toggle('visible', floor === 0);
    lastFloor.current = floor;
  }, [floor, ready]);

  // Category filter.
  useEffect(() => {
    if (!ready || !host.current) return;
    host.current.querySelectorAll<SVGElement>('.shop-area[data-cat]').forEach((el) => {
      el.classList.toggle('is-on', categories.has(el.dataset.cat as Category));
    });
  }, [categories, ready]);

  // Highlight the focused store (all of its units) and place the logo bubble.
  const focus = hovered ?? selected;
  useEffect(() => {
    const el = host.current;
    if (!ready || !el) return;
    el.classList.toggle('has-focus', !!focus);
    el.querySelectorAll('.shop-area.is-focus').forEach((a) => a.classList.remove('is-focus'));
    if (!focus) {
      setBubble(null);
      return;
    }
    const areas = [...el.querySelectorAll<SVGGraphicsElement>(`.shop-area[data-slug="${CSS.escape(focus)}"]`)];
    areas.forEach((a) => a.classList.add('is-focus'));
    const store = byPlace.current.get(areas[0]?.dataset.shopAreaId ?? '');
    const target = areas.find((a) => floorOfPlace(a.dataset.shopAreaId!) === floor);
    if (!store || !target) {
      setBubble(null);
      return;
    }
    const place = () => {
      const box = el.getBoundingClientRect();
      const r = target.getBoundingClientRect();
      setBubble({ x: r.left + r.width / 2 - box.left, y: r.top - box.top, store });
    };
    place();
    // Floors animate into place; follow the unit until they settle.
    const t = setTimeout(place, 900);
    window.addEventListener('resize', place);
    return () => {
      clearTimeout(t);
      window.removeEventListener('resize', place);
    };
  }, [focus, floor, ready]);

  const areaFrom = (e: React.MouseEvent) => {
    const a = (e.target as Element).closest<SVGElement>('.shop-area[data-slug]');
    if (!a) return null;
    const f = floorOfPlace(a.dataset.shopAreaId!);
    // Units on floors below the active one are only scenery.
    if (f !== floor) return null;
    return { slug: a.dataset.slug!, floor: f };
  };

  return (
    <div className={`wayfinder lang-${lang}${floor === OVERVIEW ? ' is-overview' : ''}`}>
      <div
        ref={host}
        className="wayfinder-svg"
        onMouseOver={(e) => onHover(areaFrom(e)?.slug ?? null)}
        onMouseLeave={() => onHover(null)}
        onClick={(e) => {
          const a = areaFrom(e);
          if (a) onSelect(a.slug, a.floor);
        }}
      />
      {!ready && <div className="wayfinder-loading" />}
      {bubble && (
        <div className="map-bubble" style={{ left: bubble.x, top: bubble.y }} key={bubble.store.slug}>
          <img src={bubble.store.logo} alt="" />
          <span>{bubble.store.name}</span>
        </div>
      )}
    </div>
  );
}
