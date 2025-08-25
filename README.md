## Anime Streaming App (Next.js 14 + TypeScript)

Full-stack app using Next.js App Router. Scraping is implemented in server-side routes with Axios + Cheerio (ported and expanded from `live_scraper.py`).

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
- `GET /api/search?q=<query>` — search
- `GET /api/image?src=<image_url>` — image proxy

Notes:
- `post_id` improves season switching when provided; direct scraping works without it for default season.
- Selectors depend on `animesalt.cc` markup; adjust in `frontend/server/scraper.ts` if the site changes.

### Frontend Pages
- `/` Trending, Latest, Popular grids (responsive, SSR)
- `/search?q=...` Search results
- `/title/<slug>` or `/anime/...` Details with seasons and episodes
- `/watch?src=...` HLS-capable player with subtitles support

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

### Deployment (Vercel)
1. Set project root to `frontend`
2. Build Command: `npm run build`
3. Output Directory: `.next`
4. Env (optional): `NEXT_PUBLIC_SITE_BASE`

### Troubleshooting
- Empty lists/details: check Network tab for API responses; site markup may have changed → update selectors in `scraper.ts`.
- 500 errors from API routes: run `npm run dev` inside `frontend` and check server logs.
- HLS not playing: ensure the `watch` page loads `hls.js` and the source URL ends with `.m3u8`.

