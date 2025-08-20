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
- `GET /api/health` - Health check
- `GET /api/anime_list?page=1` - Anime list
- `GET /api/anime_details?url=<page_url>&post_id=<id>&season=<optional_int>` - Anime details
- `GET /api/search?q=<query>` - Search anime
- `GET /api/episode_players?url=<episode_url>` - Episode player sources
- `GET /api/image?src=<image_url>` - Image proxy
- `GET /api/logo` - Logo file

### Frontend Pages
- `/` Trending + Latest grid, SSR, responsive
- `/search?q=...` Server-rendered search results
- `/title?url=...&post_id=<id>&season=<n>` Details + seasons + episodes
- `/watch?src=...` HLS-capable player with speed controls

### Vercel Deployment

#### Backend Deployment
1. Deploy backend to a platform that supports Node.js (Railway, Render, Heroku, etc.)
2. Set environment variables:
   - `PORT` (optional, defaults to 4000)

#### Frontend Deployment
1. Connect your GitHub repo to Vercel
2. Set build settings:
   - Framework Preset: Next.js
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `.next`
3. Set environment variables:
   - `NEXT_PUBLIC_API_URL` = `https://your-backend-domain.com`
4. Deploy

The frontend will automatically proxy API calls to your backend using Next.js rewrites.

### Notes
- Selectors and endpoints depend on `animesalt.cc` and may need updates if the site changes.
- The frontend uses Next.js rewrites to proxy API calls, so no code changes are needed for deployment.

