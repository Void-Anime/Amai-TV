import { NextRequest, NextResponse } from 'next/server';
import { parseAnimeListFromHtml } from '@/server/scraper';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get('q') || '').trim();
  if (!q) return NextResponse.json({ error: true, message: 'Missing q' }, { status: 400 });
  try {
    const axios = (await import('axios')).default;
    const { data: html } = await axios.get(`https://animesalt.cc/?s=${encodeURIComponent(q)}`, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      timeout: 20000,
    });
    const items = parseAnimeListFromHtml(String(html));
    return NextResponse.json({ q, items }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: true, message: e?.message || 'Failed to search' }, { status: 500 });
  }
}


