import { useId } from 'react';

// A calm, vector take on the old site's WebGL kaleidoscope: one animated
// "seed" of brand-coloured shapes, clipped to a 30° wedge and mirrored 12 times.

const R = 520;
const WEDGE = `M0 0L${R} 0A${R} ${R} 0 0 1 ${R * Math.cos(Math.PI / 6)} ${R * Math.sin(Math.PI / 6)}Z`;

const SHAPES = [
  { cx: 120, cy: 40, r: 70, c: 'var(--teal)' },
  { cx: 260, cy: 110, r: 110, c: 'var(--violet)' },
  { cx: 400, cy: 60, r: 80, c: 'var(--pink)' },
  { cx: 330, cy: 210, r: 60, c: 'var(--orange)' },
  { cx: 180, cy: 170, r: 46, c: 'var(--mint)' },
  { cx: 470, cy: 170, r: 90, c: 'var(--blue)' },
  { cx: 60, cy: 10, r: 30, c: '#ffffff' },
];

const reduceMotion =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function Kaleidoscope({ className }: { className?: string }) {
  const id = useId().replace(/:/g, '');
  return (
    <svg className={className} viewBox={`${-R} ${-R} ${R * 2} ${R * 2}`} aria-hidden="true">
      <defs>
        <clipPath id={`w${id}`}>
          <path d={WEDGE} />
        </clipPath>
        <g id={`s${id}`} clipPath={`url(#w${id})`}>
          <g>
            {!reduceMotion && (
              <animateTransform
                attributeName="transform"
                type="rotate"
                values="0 260 120; 360 260 120"
                dur="60s"
                repeatCount="indefinite"
              />
            )}
            {SHAPES.map((s, i) => (
              <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill={s.c} opacity={0.88}>
                {!reduceMotion && (
                  <animate
                    attributeName="r"
                    values={`${s.r};${s.r * 1.35};${s.r}`}
                    dur={`${11 + i * 3}s`}
                    repeatCount="indefinite"
                  />
                )}
              </circle>
            ))}
            <rect x="200" y="-40" width="60" height="320" fill="var(--ink)" opacity="0.55" transform="rotate(24 230 120)" />
          </g>
        </g>
      </defs>
      <g style={{ mixBlendMode: 'screen' }}>
        {Array.from({ length: 12 }, (_, i) => (
          <use
            key={i}
            href={`#s${id}`}
            transform={i % 2 ? `rotate(${(i + 1) * 30}) scale(1,-1)` : `rotate(${i * 30})`}
          />
        ))}
      </g>
    </svg>
  );
}
