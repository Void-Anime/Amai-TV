## AMAI TV – Anime Streaming App (Next.js 14 + TypeScript)

Full-stack app using Next.js App Router. Scraping is implemented in server-side API routes with Axios + Cheerio (ported and expanded from `live_scraper.py`). UI is fully black-themed with desktop bottom navigation.

### Prerequisites
- Node.js 18+

### Install & Run (Development)
```bash
# from repo root
cd frontend
npm install
npm run dev
# App runs on http://localhost:3000
```

### Environment Variables
- Optional: `NEXT_PUBLIC_SITE_BASE` (default: `https://animesalt.cc`)

### Serverless API Routes (Next.js)
- `GET /api/anime_list?page=1` — paginated list
- `GET /api/anime_details?url=<series_url>[&post_id=<id>][&season=<n>]` — details + seasons + episodes
- `GET /api/episode_players?url=<episode_url>` — video sources (HLS/iframe)
- `GET /api/search?q=<query>` — search (mirrors `animesalt` "?s=")
- `GET /api/image?src=<image_url>` — image proxy
- `GET /api/ongoing?page=<n>&q=<query>` — ongoing series (status: ongoing)
- `GET /api/upcoming` — upcoming episode tiles (with countdowns)

Notes:
- `post_id` improves season switching when provided; direct scraping works without it for default season.
- Selectors depend on `animesalt.cc` markup; adjust in `frontend/server/scraper.ts` if the site changes.

### Frontend Pages
- `/`
  - Franchises carousel (Iron Man, Naruto, Dragon Ball, etc.) – large logos, auto-sliding loop
  - Networks grid (Crunchyroll, Netflix, Prime Video, etc.) – internal links only
  - Ongoing Series section (scraped, paginated)
  - Upcoming Episodes section (live countdowns via scraper)
  - Trending, Latest, Popular carousels
- `/search?q=...` Search results (server-scraped via `/api/search`)
- `/title/<slug>` Details with seasons and episodes (black theme)
- `/watch?...` HLS/iframe player with seasons/episodes (black theme)
- `/cartoon` Cartoon listing (category scraper)
- `/series` Series listing (same structure as anime list)
- `/networks` and `/networks/[slug]` Network hubs and dynamic pages (internal content)
- `/ongoing` Full ongoing list (search + pagination)

### Code Layout
```
frontend/
  app/                 # App Router pages and API routes
    api/               # Serverless endpoints (scraper wrappers)
  server/              # Scraper logic (Axios + Cheerio)
  components/          # UI components (cards, sliders, navbar, etc.)
  lib/                 # Utilities (slugs, URLs)
```

Key files:
- `frontend/server/scraper.ts` — core scraping functions
- `frontend/app/api/*` — API endpoints using scraper
- `frontend/components/*` — UI building blocks

Notable Components:
- `DesktopNav.tsx` – desktop bottom navigation (visible on PC across pages)
- `NewCarousel.tsx` – smooth auto-sliding carousel with loop and 1-by-1 snap
- `NewAnimeCard.tsx` – black-themed, hover-zoom cards with internal routing
- `DetailsHeader.tsx` – black-themed details header with badges/chips

### Deployment (Vercel)
1. Set project root to `frontend`
2. Build Command: `npm run build`
3. Output Directory: `.next`
4. Env (optional): `NEXT_PUBLIC_SITE_BASE`

### Troubleshooting
- Search URL error (ERR_INVALID_URL): we build absolute API URLs using request headers; ensure you access via `http://localhost:3000`.
- CORS on scraper: all scraping is server-side via API routes; never call scraper from the client.
- Empty lists/details: check API responses; if animesalt markup changes, update parsers in `scraper.ts` (e.g., selectors, filters).
- HLS not playing: the default `<video>` plays HLS only with browser support; if needed, integrate `hls.js` for MSE playback.

### Theming
- Global black theme via CSS variables in `app/globals.css` (no purple accents)
- Cards, details, chips, and buttons use black backgrounds and subtle white borders.

---

Made by Void Anime

### UI Comparison (Before vs After)

| Old | New |
| --- | --- |
| ![Old UI](https://github.com/Void-Anime/Amai-TV/blob/main/Old.png) | ![New UI](https://github.com/Void-Anime/Amai-TV/blob/main/new.png) |


