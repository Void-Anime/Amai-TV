import Image from "next/image";
import HeroSlider from "@/components/HeroSlider";
import { fetchAnimeList } from "@/server/scraper";
import Carousel from "@/components/ui/Carousel";
import AnimeTile from "@/components/AnimeTile";

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

  const heroSlides = trending.slice(0, 5).map((s) => ({
    title: s.title,
    image: s.image || undefined,
    url: s.url,
    postId: s.postId,
    genres: [],
    tagline: 'Trending now on AMAI TV',
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6 pb-24 pt-6 md:py-8 space-y-10">
      <HeroSlider slides={heroSlides} />

      <div className="space-y-8">
        <Carousel title="Trending">
          {trending.map((it, idx) => (
            <AnimeTile key={it.url + idx} url={it.url} title={it.title} image={it.image || undefined} postId={it.postId} priority={idx===0} />
          ))}
        </Carousel>

        <Carousel title="Latest Episodes">
          {latest.map((it, idx) => (
            <AnimeTile key={it.url + idx} url={it.url} title={it.title} image={it.image || undefined} postId={it.postId} />
          ))}
        </Carousel>
      </div>
    </div>
  );
}

// Card component replaced by AnimeTile in carousels


