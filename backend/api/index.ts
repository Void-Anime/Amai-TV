import type { VercelRequest, VercelResponse } from '@vercel/node';
import { applyCors } from './_utils';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (applyCors(req, res)) return;
  res.status(200).json({
    ok: true,
    message: 'AMAI TV Backend is running. Use /api/* endpoints.',
    endpoints: {
      health: '/api/health',
      list: '/api/anime_list?page=1',
      details: '/api/anime_details?url=<page_url>&post_id=<id>&season=<n>',
      search: '/api/search?q=naruto',
    },
  });
}


