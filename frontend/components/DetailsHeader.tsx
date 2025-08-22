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
  studio,
  status,
  rating,
}: {
  poster?: string | null
  title: string
  genres?: string[]
  year?: number | null
  totalEpisodes?: number | null
  duration?: string | null
  languages?: string[]
  studio?: string | null
  status?: string | null
  rating?: number | null
}) {
  const { w, h } = getPosterSize(poster);
  return (
    <section className="relative overflow-hidden rounded-2xl border border-gray-800 bg-gray-900">
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
              className="rounded-xl border border-gray-700 shadow-md shadow-purple-500/20 object-contain"
            />
          ) : (
            <div className="h-[280px] w-[200px] grid place-items-center text-gray-400 rounded-xl border border-gray-700 bg-gray-800">No Poster</div>
          )}
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-semibold text-white">{title}</h1>
          <div className="flex flex-wrap gap-2 text-[12px] text-gray-300">
            {year && <span className="px-2 py-0.5 rounded-full border border-gray-600 bg-gray-800 text-white">{year}</span>}
            {studio && <span className="px-2 py-0.5 rounded-full border border-gray-600 bg-gray-800 text-white">{studio}</span>}
            {status && <span className="px-2 py-0.5 rounded-full border border-gray-600 bg-gray-800 text-white">{status}</span>}
            {totalEpisodes && <span className="px-2 py-0.5 rounded-full border border-gray-600 bg-gray-800 text-white">{totalEpisodes} eps</span>}
            {duration && <span className="px-2 py-0.5 rounded-full border border-gray-600 bg-gray-800 text-white">{duration}</span>}
            {typeof rating === 'number' && <span className="px-2 py-0.5 rounded-full border border-gray-600 bg-gray-800 text-white">★ {rating.toFixed(1)}</span>}
            {languages.map((l) => (
              <span key={l} className="px-2 py-0.5 rounded-full border border-gray-600 bg-gray-800 text-white">{l}</span>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {genres.slice(0, 6).map((g) => (
              <span key={g} className="px-3 py-1 bg-gray-800 text-gray-300 text-sm rounded-full border border-gray-700">{g}</span>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            <a href="#episodes" className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">Play Latest</a>
            <a href="#episodes" className="px-4 py-2 bg-transparent border border-gray-600 text-white rounded-lg hover:bg-gray-800 transition-colors">Start Episode 1</a>
            <button className="px-4 py-2 bg-transparent border border-gray-600 text-white rounded-lg hover:bg-gray-800 transition-colors">Add to Watchlist</button>
          </div>
        </div>
      </div>
    </section>
  )
}


