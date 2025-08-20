## Anime Streaming Monorepo (TypeScript)

A full-stack TypeScript project:
- Backend: Express + Axios + Cheerio scraper (ported from `live_scraper.py`)
- Frontend: Next.js 14 + Tailwind CSS (SSR, responsive UI)

### Prerequisites
- Node.js 18+

### Install
```bash
npm install
npm --workspace backend install
npm --workspace frontend install
```

### Development
```bash
# Start API on :4000 and Web on :3000
npm run dev
```

If you want to run separately:
```bash
npm -w backend run dev
npm -w frontend run dev
```

Frontend expects `NEXT_PUBLIC_API_URL` (defaults to `http://localhost:4000`).

### Backend API
- `GET /api/anime_list?page=1`
- `GET /api/anime_details?url=<page_url>&post_id=<id>&season=<optional_int>`
- `GET /api/search?q=<query>`

### Frontend Pages
- `/` Trending + Latest grid, SSR, responsive
- `/search?q=...` Server-rendered search results
- `/title?url=...&post_id=<id>&season=<n>` Details + seasons + episodes
- `/watch?src=...` HLS-capable player with speed controls

### Notes
- Selectors and endpoints depend on `animesalt.cc` and may need updates if the site changes.

