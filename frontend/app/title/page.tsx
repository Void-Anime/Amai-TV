import { fetchAnimeDetails } from "@/server/scraper";
import Image from "next/image";
import SeasonSelector from "@/components/SeasonSelector";
import EpisodeCard from "@/components/EpisodeCard";
import DetailsHeader from "@/components/DetailsHeader";
import ReadMore from "@/components/ReadMore";

type EpisodeItem = { number?: string | null; title?: string | null; url: string };
type SeasonItem = { season: number | string; label: string; nonRegional: boolean };
type AnimeDetailsResponse = { url: string; postId: number; season?: number | null; seasons: SeasonItem[]; episodes: EpisodeItem[] };

async function getData(params: { url: string; post_id?: number; season?: number }) {
  return fetchAnimeDetails({ url: params.url, postId: params.post_id || 0, season: params.season });
}

export default async function TitlePage({ searchParams }: { searchParams: { url?: string; post_id?: string; season?: string } }) {
  const url = searchParams?.url || "";
  const postId = Number(searchParams?.post_id || 0);
  const selectedSeason = searchParams?.season ? Number(searchParams.season) : undefined;
  const data: AnimeDetailsResponse = url ? await getData({ url, post_id: postId, season: selectedSeason }) : { url: "", postId: 0, seasons: [], episodes: [] } as any;
  const episodes = data?.episodes || [];
  return (
    <div className="mx-auto max-w-6xl px-4 md:px-6 py-6 space-y-6">
      <DetailsHeader
        poster={data.poster || null}
        title={decodeURIComponent(url.split('/').filter(Boolean).pop() || 'Anime')}
        genres={data.genres}
        year={data.year || null}
        totalEpisodes={data.totalEpisodes || (data.episodes?.length || null)}
        duration={data.duration}
        languages={data.languages}
      />

      <ReadMore text={"Enjoy a modern, fast experience with AMAI TV. Episodes update season-wise below. Choose a season and start watching instantly."} />

      {/* Season Selector */}
      <SeasonSelector seasons={data.seasons || []} selected={selectedSeason} seriesUrl={url} postId={data.postId || postId} />

      {/* Episodes */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {episodes.map((ep, idx) => (
          <EpisodeCard key={ep.url} url={ep.url} title={ep.title} number={ep.number} poster={ep.poster || data.poster} seriesUrl={url} postId={data.postId || postId} season={selectedSeason || 1} progress={idx % 3 === 0 ? 0.42 : 0} completed={idx % 7 === 0} />
        ))}
      </div>
    </div>
  );
}

// Inline EpisodeCard replaced by component


