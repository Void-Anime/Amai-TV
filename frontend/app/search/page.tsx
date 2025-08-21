import Image from "next/image";
import AnimeLink from "@/components/AnimeLink";
import { parseAnimeListFromHtml } from "@/server/scraper";

type SeriesListItem = { title: string | null; url: string; image?: string | null; postId?: number };

async function getData(q: string): Promise<{ q: string; items: SeriesListItem[] }> {
  const axios = (await import("axios")).default;
  const { data: html } = await axios.get(`https://animesalt.cc/?s=${encodeURIComponent(q)}`, {
    headers: { "User-Agent": "Mozilla/5.0" },
    timeout: 20_000,
  });
  const items = parseAnimeListFromHtml(String(html));
  return { q, items };
}

export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const q = searchParams?.q || "";
  const data = q ? await getData(q) : { q: "", items: [] };
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-6">
      <h1 className="text-xl font-semibold">Search results for “{q}”</h1>
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
        {data.items.map((it, idx) => (
          <AnimeLink key={it.url + idx} seriesUrl={it.url} postId={it.postId} className="group block">
            <div className="aspect-[2/3] overflow-hidden rounded-md bg-white/5 border border-white/10">
              {it.image ? (
                <Image unoptimized className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" src={it.image.startsWith('data:') ? it.image : `/api/image?src=${encodeURIComponent(it.image)}`} alt={it.title || "Anime"} width={300} height={450} />
              ) : (
                <div className="h-full w-full grid place-items-center text-xs text-gray-400">No Image</div>
              )}
            </div>
            <div className="mt-2 line-clamp-2 text-sm text-gray-200 group-hover:text-white">{it.title || "Untitled"}</div>
          </AnimeLink>
        ))}
      </div>
    </div>
  );
}


