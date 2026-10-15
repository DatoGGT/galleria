// Cleans the legacy wayfinder SVG (scripts/raw/floors-map.svg, taken from
// galleria.ge/api/get-template/sartulebi) into src/assets/floors-map.svg.
// Keeps the structure the map component relies on:
//   .floor-container[data-floor]  one group per level, -1..7 (7 = roof)
//   .shop-area[data-shop-area-id] one polygon per unit, e.g. "2.14"
//   .text-trans.{ka,en,ru}        labels per language
//   #stair, #stair-icons          shown depending on the active floor
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
let svg = readFileSync(join(root, 'scripts/raw/floors-map.svg'), 'utf8');
const before = svg.length;

// The template dump continues with page HTML after the map; keep only the <svg>.
svg = svg.slice(0, svg.lastIndexOf('</svg>', svg.indexOf('<div')) + '</svg>'.length);
svg = svg.replace(/<!--[\s\S]*?-->/g, '');
// Drop Illustrator ids nothing points to (gradients referenced via url(#...) stay).
const used = new Set([...svg.matchAll(/(?:url\(#|href="#)([^)"]+)/g)].map((m) => m[1]));
svg = svg.replace(/\s+id="(XMLID_[^"]+)"/g, (all, id) => (used.has(id) ? all : ''));
svg = svg
  .replace(/\s+xml:space="preserve"/, '')
  .replace(/\s+x="0px" y="0px"/, '')
  .replace(/\s+stroke-miterlimit="10"/g, '')
  .replace(/>\s+</g, '><')
  .replace(/\s{2,}/g, ' ')
  .trim();

writeFileSync(join(root, 'src/assets/floors-map.svg'), svg);
console.log(`floors-map.svg ${Math.round(before / 1024)} KB -> ${Math.round(svg.length / 1024)} KB`);
