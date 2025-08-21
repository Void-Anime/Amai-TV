import axios, { AxiosInstance } from 'axios';
import * as cheerio from 'cheerio';
import { AnimeDetailsResponse, AnimeListResponse, EpisodeItem, SeasonItem, SeriesListItem, PlayerSourceItem } from './types';

const BASE = 'https://animesalt.cc';
const AJAX = `${BASE}/wp-admin/admin-ajax.php`;

function createHttpClient(): AxiosInstance {
  const instance = axios.create({
    withCredentials: true,
    headers: {
      'User-Agent': 'Mozilla/5.0',
      Referer: BASE,
      Origin: BASE,
      'X-Requested-With': 'XMLHttpRequest',
    },
    timeout: 20_000,
  });
  return instance;
}

const http = createHttpClient();

export function extractNonceFromHtml(html: string): string | null {
  const m = html.match(/"nonce"\s*:\s*"([a-f0-9]+)"/i);
  return m ? m[1] : null;
}

export function extractPostIdFromHtml(html: string): number | null {
  const patterns: RegExp[] = [
    /postid-(\d+)/i,
    /"post"\s*:\s*"?(\d+)"?/i,
    /data-post(?:-id)?\s*=\s*"?(\d+)"?/i,
    /post_id\s*=\s*"?(\d+)"?/i,
    /var\s+post(?:Id|_id)\s*=\s*(\d+)/i,
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (m && m[1]) {
      const n = Number(m[1]);
      if (Number.isFinite(n)) return n;
    }
  }
  return null;
}

export function parseEpisodesFromHtml(html: string): EpisodeItem[] {
  const $ = cheerio.load(html);
  const episodes: EpisodeItem[] = [];
  $('article.post.episodes').each((_, el) => {
    const link = $(el).find('a[href*="/episode"]').first();
    const href = link.attr('href');
    const titleEl = $(el).find('h2.entry-title').first();
    const titleText = titleEl.text().trim() || link.text().trim() || null;
    const numberText = $(el).find('.num-epi').first().text().trim() || null;
    // try poster inside article
    let epPoster: string | null = null;
    const imgEl = $(el).find('img').first();
    if (imgEl && imgEl.length) {
      epPoster = imgEl.attr('src') || imgEl.attr('data-src') || null;
      if (epPoster) { try { epPoster = new URL(epPoster, BASE).toString(); } catch {} }
    }
    if (href) episodes.push({ number: numberText, title: titleText || null, url: new URL(href, BASE).toString(), poster: epPoster });
  });
  if (episodes.length === 0) {
    $('a[href*="/episode"]').each((_, a) => {
      const href = $(a).attr('href');
      if (!href) return;
      episodes.push({ title: $(a).text().trim() || null, url: new URL(href, BASE).toString(), poster: null });
    });
  }
  return episodes;
}

export function parseSeasonsFromHtml(html: string): SeasonItem[] {
  const $ = cheerio.load(html);
  const seasons: SeasonItem[] = [];
  $('a.season-btn').each((_, a) => {
    const seasonRaw = $(a).attr('data-season');
    const label = $(a).text().trim();
    const classes = ($(a).attr('class') || '').split(/\s+/);
    const isNonRegional = classes.includes('non-regional');
    if (seasonRaw) {
      const maybeNum = Number(seasonRaw);
      seasons.push({ season: Number.isFinite(maybeNum) ? maybeNum : seasonRaw, label, nonRegional: isNonRegional });
    }
  });
  return seasons;
}

export function parseAnimeListFromHtml(html: string): SeriesListItem[] {
  const $ = cheerio.load(html);
  const items: SeriesListItem[] = [];
  const seen = new Set<string>();
  $('article.post').each((_, el) => {
    let href = $(el).find('a[href*="/series/"]').first().attr('href');
    if (!href) href = $(el).find('a').first().attr('href') || undefined;
    if (!href) return;
    const abs = new URL(href, BASE).toString();
    if (seen.has(abs)) return;
    seen.add(abs);
    const title = $(el).find('h2.entry-title').first().text().trim() || $(el).find('a').first().text().trim() || null;
    let postId: number | undefined;
    const idAttr = $(el).attr('id') || '';
    const classAttr = $(el).attr('class') || '';
    const idMatch = idAttr.match(/post-(\d+)/) || classAttr.match(/post-(\d+)/);
    if (idMatch && idMatch[1]) { const n = Number(idMatch[1]); if (Number.isFinite(n)) postId = n; }
    // image
    let img: string | null = null;
    const imgEl = $(el).find('img').first();
    if (imgEl && imgEl.length) {
      img = imgEl.attr('data-src') || imgEl.attr('data-lazy-src') || imgEl.attr('data-img') || imgEl.attr('data-original') || imgEl.attr('data-thumb') || imgEl.attr('data-thumbnail') || imgEl.attr('src') || null;
      if (img && /^data:/i.test(img)) img = null;
      if (!img) {
        const srcset = imgEl.attr('srcset') || imgEl.attr('data-srcset') || imgEl.attr('data-lazy-srcset') || '';
        const candidates = srcset.split(',').map(s => s.trim().split(' ')[0]).filter(Boolean).filter(u => !/^data:/i.test(u));
        const pick = candidates[candidates.length - 1] || candidates[0];
        if (pick) img = pick;
      }
    }
    if (!img) {
      const styleEl = $(el).find('[style*="background-image"]').first();
      const style = styleEl.attr('style') || '';
      const m = style.match(/background-image\s*:\s*url\((['\"]?)([^)\'\"]+)\1\)/i);
      if (m && m[2]) img = m[2];
    }
    if (img) { try { img = new URL(img, abs).toString(); } catch {} }
    items.push({ title, url: abs, image: img || undefined, postId });
  });
  if (items.length === 0) {
    $('a[href*="/series/"]').each((_, a) => {
      const href = $(a).attr('href');
      if (!href) return;
      const abs = new URL(href, BASE).toString();
      if (seen.has(abs)) return;
      seen.add(abs);
      const title = $(a).text().trim() || null;
      items.push({ title, url: abs });
    });
  }
  return items;
}

export async function fetchAnimeList(page: number): Promise<AnimeListResponse> {
  const payload = new URLSearchParams({ action: 'torofilm_infinite_scroll', page: String(page), per_page: '12', query_type: 'archive', post_type: 'series' });
  let items: SeriesListItem[] = [];
  try {
    const { data } = await http.post(AJAX, payload, { responseType: 'text' });
    let html: string | undefined;
    if (typeof data === 'object' && data) {
      const anyData = data as any;
      if (typeof anyData.html === 'string') html = anyData.html;
      else if (typeof anyData.data === 'string') html = anyData.data;
      else if (typeof anyData.content === 'string') html = anyData.content;
    } else if (typeof data === 'string') {
      html = data;
      try { const parsed = JSON.parse(data); if (parsed && typeof parsed === 'object') { if (typeof parsed.html === 'string') html = parsed.html; else if (typeof parsed.data === 'string') html = parsed.data; else if (typeof parsed.content === 'string') html = parsed.content; } } catch {}
    }
    if (html) items = parseAnimeListFromHtml(html);
  } catch {}
  if (items.length === 0) {
    const candidates: string[] = [];
    if (page <= 1) { candidates.push(`${BASE}/series/`); candidates.push(`${BASE}/`); }
    candidates.push(`${BASE}/series/page/${page}/`);
    candidates.push(`${BASE}/series/?_page=${page}`);
    candidates.push(`${BASE}/?post_type=series&_page=${page}`);
    for (const url of candidates) {
      try {
        const resp = await http.get(url, { responseType: 'text' });
        const html = String(resp.data || '');
        const parsed = parseAnimeListFromHtml(html);
        if (parsed.length > 0) { items = parsed; break; }
      } catch {}
    }
  }
  // Enrich missing/placeholder images by scraping poster from the series page
  items = await enrichSeriesPosters(items);
  return { page, items };
}

export function parsePosterFromHtml(html: string, baseUrl: string): string | null {
  const $ = cheerio.load(html);
  let img: string | null = null;
  const og = $('meta[property="og:image"]').attr('content') || $('meta[name="twitter:image"]').attr('content');
  if (og) img = og;
  if (!img) {
    const cover = $('.cover img, .poster img, .entry-thumb img').first();
    const src = cover.attr('src') || cover.attr('data-src') || cover.attr('data-original');
    if (src) img = src;
  }
  // Fallback: scan any <img> tags, prefer image.tmdb.org or larger sizes
  if (!img) {
    const candidates: string[] = [];
    $('img').each((_, el) => {
      const s = $(el).attr('data-src') || $(el).attr('src');
      if (!s) return;
      candidates.push(s);
    });
    // Rank by host preference and size token
    const scored = candidates.map((u) => {
      const urlStr = (() => { try { return new URL(u, baseUrl).toString(); } catch { return u; } })();
      const hostScore = /image\.tmdb\.org/i.test(urlStr) ? 2 : 0;
      const sizeScore = /(original|w780|w500|w342|w300|w185)/i.test(urlStr) ? 1 : 0;
      return { urlStr, score: hostScore + sizeScore };
    }).sort((a, b) => b.score - a.score);
    if (scored.length) img = scored[0].urlStr;
  }
  if (img) { try { img = new URL(img, baseUrl).toString(); } catch {} }
  return img;
}

function parseMetaFromHtml(html: string): { genres?: string[]; year?: number | null; totalEpisodes?: number | null; duration?: string | null; languages?: string[]; synopsis?: string | null; status?: string | null } {
  const $ = cheerio.load(html);
  const out: any = {};
  // Genres: common selectors
  const genreTexts = $("a[rel='tag'], .genres a, .genre a").map((_, el) => $(el).text().trim()).get().filter(Boolean);
  if (genreTexts.length) out.genres = Array.from(new Set(genreTexts));
  // Year: look for patterns
  const text = $('body').text();
  const ym = text.match(/\b(19|20)\d{2}\b/);
  if (ym) out.year = Number(ym[0]);
  // Total episodes: search numeric near 'Episodes'
  const epm = text.match(/Episodes?\s*[:|-]?\s*(\d+)/i);
  if (epm) out.totalEpisodes = Number(epm[1]);
  // Duration
  const durm = text.match(/(\d+\s*(min|minutes|mins))/i);
  if (durm) out.duration = durm[0];
  // Languages
  const langs: string[] = [];
  if (/subbed/i.test(text)) langs.push('Sub');
  if (/dubbed|dub/i.test(text)) langs.push('Dub');
  if (langs.length) out.languages = Array.from(new Set(langs));
  // Synopsis block
  const synopsis = $('.entry-content p, .synopsis, .description').first().text().trim();
  if (synopsis) out.synopsis = synopsis;
  // Status
  const statusMatch = text.match(/Status\s*[:|-]?\s*(Ongoing|Completed|Finished|Airing)/i);
  if (statusMatch) out.status = statusMatch[1];
  return out;
}

export async function fetchAnimeDetails(params: { url: string; postId: number; season?: number | null; }): Promise<AnimeDetailsResponse> {
  const { url, postId, season } = params;
  // Movies use a different structure; delegate to movie details
  if (/\/movies\//i.test(url)) {
    return await fetchMovieDetails(url);
  }
  const pageResp = await http.get(url);
  const html = pageResp.data as string;
  const nonce = extractNonceFromHtml(html);
  const seasons = parseSeasonsFromHtml(html);
  const poster = parsePosterFromHtml(html, url);
  const meta = parseMetaFromHtml(html);
  const resolvedPostId = Number.isFinite(postId) && postId > 0 ? postId : (extractPostIdFromHtml(html) ?? 0);
  let episodes: EpisodeItem[] = [];
  if (typeof season === 'number' && Number.isFinite(season)) {
    const payload = new URLSearchParams({ action: 'action_select_season', season: String(season), post: String(resolvedPostId) });
    const resp = await http.post(AJAX, payload, { headers: { Referer: url } });
    const text = typeof resp.data === 'string' ? resp.data : JSON.stringify(resp.data);
    episodes = parseEpisodesFromHtml(text);
  } else {
    if (Number.isFinite(resolvedPostId) && resolvedPostId > 0) {
      try {
        const payload = new URLSearchParams({ action: 'torofilm_get_episodes', id: String(resolvedPostId), nonce: nonce || '' });
        const resp = await http.post(AJAX, payload, { headers: { Referer: url } });
        const body = resp.data;
        if (typeof body === 'string') {
          const trimmed = body.trim();
          if (trimmed !== '' && trimmed !== '0') {
            try { const parsed = JSON.parse(body); if (parsed && typeof parsed === 'object' && 'html' in parsed) { episodes = parseEpisodesFromHtml(parsed.html); } }
            catch { episodes = parseEpisodesFromHtml(body); }
          }
        } else if (typeof body === 'object' && body && 'html' in body) {
          episodes = parseEpisodesFromHtml((body as any).html as string);
        }
      } catch {
        // Ignore AJAX failures, we'll fall back to HTML parse below
      }
    }
  }
  if (episodes.length === 0) episodes = parseEpisodesFromHtml(html);
  return { url, postId: resolvedPostId, season: season ?? null, seasons, episodes, poster, ...meta };
}

export async function fetchEpisodePlayers(episodeUrl: string) {
  const resp = await http.get(episodeUrl, { responseType: 'text' });
  const html = String(resp.data || '');
  const $ = cheerio.load(html);
  const sources: { src: string; label?: string | null; quality?: string | null; kind: 'iframe' | 'video' }[] = [];
  $('iframe').each((_, el) => { const src = $(el).attr('data-src') || $(el).attr('src'); if (!src) return; sources.push({ src: new URL(src, episodeUrl).toString(), kind: 'iframe' }); });
  $('video source').each((_, el) => { const src = $(el).attr('src'); if (!src) return; sources.push({ src: new URL(src, episodeUrl).toString(), label: $(el).attr('label') || $(el).attr('data-label') || null, quality: $(el).attr('res') || $(el).attr('data-res') || null, kind: 'video' }); });
  const m3u8Match = html.match(/https?:[^"'\s]+\.m3u8/); if (m3u8Match) { try { sources.push({ src: new URL(m3u8Match[0], episodeUrl).toString(), kind: 'video', label: 'HLS' }); } catch {} }
  const seen = new Set<string>();
  return sources.filter(s => (seen.has(s.src) ? false : (seen.add(s.src), true)));
}

export async function enrichSeriesPosters(items: SeriesListItem[]): Promise<SeriesListItem[]> {
  // Only fetch when image is missing or a data URI
  const targets = items.map((it, idx) => ({ it, idx })).filter(({ it }) => !it.image || it.image.startsWith('data:'));
  if (targets.length === 0) return items;

  await Promise.allSettled(
    targets.map(async ({ it, idx }) => {
      try {
        const resp = await http.get(it.url, { responseType: 'text' });
        const html = String(resp.data || '');
        const poster = parsePosterFromHtml(html, it.url);
        if (poster) items[idx] = { ...it, image: poster };
      } catch {}
    })
  );
  return items;
}

export async function fetchMoviesList(page: number, query?: string): Promise<AnimeListResponse> {
  let items: SeriesListItem[] = [];
  try {
    if (query && query.trim().length > 0) {
      const axios = (await import('axios')).default;
      const { data: html } = await axios.get(`${BASE}/?s=${encodeURIComponent(query)}`, {
        headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 20000,
      });
      const all = parseAnimeListFromHtml(String(html));
      items = all.filter((i) => /\/movies\//i.test(i.url));
    } else {
      const candidates: string[] = [];
      if (page <= 1) candidates.push(`${BASE}/movies/`);
      candidates.push(`${BASE}/movies/page/${page}/`);
      for (const url of candidates) {
        try {
          const resp = await http.get(url, { responseType: 'text' });
          const html = String(resp.data || '');
          const parsed = parseAnimeListFromHtml(html).filter((i) => /\/movies\//i.test(i.url));
          if (parsed.length) { items = parsed; break; }
        } catch {}
      }
    }
  } catch {}
  items = await enrichSeriesPosters(items);
  return { page, items };
}

export async function fetchMovieDetails(url: string): Promise<AnimeDetailsResponse> {
  const pageResp = await http.get(url);
  const html = pageResp.data as string;
  const poster = parsePosterFromHtml(html, url);
  const meta = parseMetaFromHtml(html);
  // Try to extract players directly from movie page
  const players = extractPlayersFromHtml(html, url);
  const episodes: EpisodeItem[] = [{ title: 'Full Movie', url, number: null, poster }];
  return {
    url,
    postId: 0,
    season: null,
    seasons: [],
    episodes,
    poster,
    ...meta,
    players,
  };
}

function extractPlayersFromHtml(html: string, baseUrl: string): PlayerSourceItem[] {
  const $ = cheerio.load(html);
  const sources: PlayerSourceItem[] = [];
  $('iframe').each((_, el) => {
    const src = $(el).attr('data-src') || $(el).attr('src');
    if (!src) return;
    try { sources.push({ src: new URL(src, baseUrl).toString(), kind: 'iframe' }); } catch {}
  });
  $('video source').each((_, el) => {
    const src = $(el).attr('src'); if (!src) return;
    try { sources.push({ src: new URL(src, baseUrl).toString(), kind: 'video', label: $(el).attr('label') || null, quality: $(el).attr('res') || null }); } catch {}
  });
  const m3u8 = html.match(/https?:[^"'\s]+\.m3u8/);
  if (m3u8) { try { sources.push({ src: new URL(m3u8[0], baseUrl).toString(), kind: 'video', label: 'HLS' }); } catch {} }
  const seen = new Set<string>();
  return sources.filter((s) => (seen.has(s.src) ? false : (seen.add(s.src), true)));
}


