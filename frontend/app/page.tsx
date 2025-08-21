import Image from "next/image";
import AnimeLink from "@/components/AnimeLink";
import Hero from "@/components/Hero";
import { fetchAnimeList } from "@/server/scraper";

type SeriesListItem = { title: string | null; url: string; image?: string | null; postId?: number };
type AnimeListResponse = { page: number; items: SeriesListItem[] };

async function getData(page: number): Promise<AnimeListResponse> {
  return fetchAnimeList(page);
}

export default async function Home({ searchParams }: { searchParams: { page?: string } }) {
  const page = Number(searchParams?.page || 1);
  const data = await getData(Number.isFinite(page) ? page : 1);
  const items = data.items || [];
  const trending = items.slice(0, 6);
  const latest = items.slice(6, 12);

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6 pb-24 pt-6 md:py-8 space-y-10">
      <Hero />

      <section id="trending" className="space-y-4">
        <h2 className="text-lg md:text-xl font-semibold">Trending</h2>
        <div className="grid gap-4 md:gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
          {trending.map((it, idx) => (
            <Card key={it.url + idx} item={it} priority={idx === 0} />
          ))}
        </div>
      </section>

      <section id="latest" className="space-y-4">
        <h2 className="text-lg md:text-xl font-semibold">Latest Episodes</h2>
        <div className="grid gap-4 md:gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
          {latest.map((it, idx) => (
            <Card key={it.url + idx} item={it} />
          ))}
        </div>
        <div className="flex items-center gap-2 justify-end">
          <a href={`/?page=${Math.max(1, page - 1)}`} className="btn btn-outline">Prev</a>
          <span className="text-sm text-text-dim">Page {page}</span>
          <a href={`/?page=${page + 1}`} className="btn btn-primary">Next</a>
        </div>
      </section>
    </div>
  );
}

function Card({ item, priority = false }: { item: SeriesListItem; priority?: boolean }) {
  return (
    <AnimeLink seriesUrl={item.url} postId={item.postId} className="group block">
      <div className="aspect-[2/3] overflow-hidden rounded-lg bg-surface border border-stroke shadow-sm">
        {item.image ? (
          <Image
            priority={priority}
            unoptimized
            className="h-full w-full object-cover transition-transform duration-200 ease-in-out group-hover:scale-[1.02]"
            src={item.image.startsWith('data:') ? item.image : `/api/image?src=${encodeURIComponent(item.image)}`}
            alt={item.title || "Anime"}
            width={300}
            height={450}
          />
        ) : (
          <div className="h-full w-full grid place-items-center text-xs text-gray-400">No Image</div>
        )}
      </div>
      <div className="mt-2 line-clamp-2 text-sm text-text-high group-hover:text-text-high">{item.title || "Untitled"}</div>
    </AnimeLink>
  );
}


