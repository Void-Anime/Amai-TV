import Image from 'next/image'

function getPosterSize(url?: string | null): { w: number; h: number } {
  const fallbackW = 342;
  const wMatch = url?.match(/\/w(\d+)\//);
  const w = wMatch ? Math.max(120, Number(wMatch[1])) : fallbackW;
  // TMDB posters are 2:3 ratio typically
  const h = Math.round(w * 1.5);
  return { w, h };
}

export default function DetailsHeader({
  poster,
  title,
  genres = [],
  year,
  totalEpisodes,
  duration,
  languages = [],
}: {
  poster?: string | null
  title: string
  genres?: string[]
  year?: number | null
  totalEpisodes?: number | null
  duration?: string | null
  languages?: string[]
}) {
  const { w, h } = getPosterSize(poster);
  return (
    <section className="relative overflow-hidden rounded-2xl border border-stroke bg-surface">
      {poster && (
        <div className="absolute inset-0 opacity-20 blur-md">
          <Image unoptimized src={poster} alt="" fill sizes="100vw" className="object-cover" />
        </div>
      )}
      <div className="relative grid gap-6 p-4 md:p-6 md:grid-cols-[auto_1fr] items-start">
        <div className="flex md:block items-start justify-center">
          {poster ? (
            <Image
              unoptimized
              src={poster}
              alt={title}
              width={w}
              height={h}
              className="rounded-xl border border-stroke shadow-md shadow-primary/20 object-contain"
            />
          ) : (
            <div className="h-[280px] w-[200px] grid place-items-center text-text-dim rounded-xl border border-stroke">No Poster</div>
          )}
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-semibold">{title}</h1>
          <div className="flex flex-wrap gap-2 text-[12px] text-text-dim">
            {year && <span className="px-2 py-0.5 rounded-full border border-stroke">{year}</span>}
            {totalEpisodes && <span className="px-2 py-0.5 rounded-full border border-stroke">{totalEpisodes} eps</span>}
            {duration && <span className="px-2 py-0.5 rounded-full border border-stroke">{duration}</span>}
            {languages.map((l) => (
              <span key={l} className="px-2 py-0.5 rounded-full border border-stroke">{l}</span>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {genres.slice(0, 6).map((g) => (
              <span key={g} className="chip">{g}</span>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            <a href="#episodes" className="btn btn-primary">Play Latest</a>
            <a href="#episodes" className="btn btn-outline">Start Episode 1</a>
            <button className="btn btn-outline">Add to Watchlist</button>
          </div>
        </div>
      </div>
    </section>
  )
}


