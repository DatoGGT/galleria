# Galleria Tbilisi — new front end

React 19 + TypeScript + Vite. Georgian at `/`, English at `/en`, Russian at `/ru`.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
```

## Structure

- `src/styles/tokens.css` — colours, radii, shadows (brand palette, slightly refined)
- `src/i18n/dict.ts` — all UI text in ka / en / ru
- `src/api/` — data layer. Currently reads `src/data/*.json`, taken from the old galleria.ge API
  by `npm run data`. Replace with `fetch('/api/...')` calls to the Django backend
  (Vite proxies `/api` to `127.0.0.1:8000`).
- `src/pages/` — Home, Directory (shops/food/entertainment/services), Store, Offers, News,
  Floors, Visit, Loyal, Gift card
- `src/components/` — Header, Footer, search (Ctrl/⌘ K), cards, kaleidoscope, logo
- `src/components/WayfinderMap.tsx` — the isometric floor plan. The SVG (`src/assets/floors-map.svg`)
  is the original galleria.ge wayfinder, cleaned by `scripts/build-map.mjs`. Each unit is a
  `.shop-area[data-shop-area-id="2.14"]`; stores point to units through `places` in `stores.json`.
  The SVG loads only on the floor-plan page (66 KB gzipped).

## Still to do

- Django backend + admin: stores, categories, offers, news, floors (real SVG plans), newsletter, gift-card orders
- Server-side rendering or prerendering for SEO
- 301 redirects from old URLs (`/magaziebi` → `/shops`, `/<brand>` → `/store/<brand>`, …)
