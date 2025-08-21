import { fetchAnimeDetails } from "@/server/scraper";

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
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
      <h1 className="text-2xl font-semibold">Anime Details</h1>
      <div className="flex flex-wrap items-center gap-2">
        {(data?.seasons || []).map((s) => (
          <a key={String(s.season)} href={`/title?url=${encodeURIComponent(url)}&post_id=${data.postId || postId}&season=${s.season}`} className={`px-3 py-1 rounded-md border ${selectedSeason === Number(s.season) ? 'bg-primary-600' : 'border-white/10'}`}>
            {s.label}
          </a>
        ))}
      </div>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {episodes.map((ep) => (
          <EpisodeCard key={ep.url} ep={ep} seriesUrl={url} postId={data.postId || postId} season={selectedSeason || 1} />
        ))}
      </div>
    </div>
  );
}

function EpisodeCard({ ep, seriesUrl, postId, season }: { ep: EpisodeItem; seriesUrl: string; postId?: number; season: number }) {
  return (
    <a href={`/watch?episode=${encodeURIComponent(ep.url)}&url=${encodeURIComponent(seriesUrl)}${postId ? `&post_id=${postId}` : ''}&season=${season}`} className="block rounded-md border border-white/10 p-4 hover:bg-white/5">
      <div className="text-sm text-gray-400">{ep.number || "Episode"}</div>
      <div className="font-medium">{ep.title || "Untitled episode"}</div>
    </a>
  );
}


