import Image from 'next/image'
import SmartButtons from './SmartButtons'

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
  smartButtons,
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
  smartButtons?: { url: string; actionText: string; episodeText: string; buttonClass: string }[]
}) {
  const { w, h } = getPosterSize(poster);
  return (
    <section className="relative overflow-hidden" style={{ backgroundColor: '#1a1a1a' }}>
      {poster && (
        <div className="absolute inset-0 opacity-20 blur-md">
          <Image unoptimized src={poster} alt="" fill sizes="100vw" className="object-cover" />
        </div>
      )}
      <div className="relative grid gap-6 p-6 md:grid-cols-[auto_1fr] items-start">
        <div className="flex md:block items-start justify-center">
          {poster ? (
            <Image
              unoptimized
              src={poster}
              alt={title}
              width={w}
              height={h}
              className="border border-white/15 object-contain"
            />
          ) : (
            <div className="h-[280px] w-[200px] grid place-items-center text-gray-300 border border-white/15" style={{ backgroundColor: '#1a1a1a' }}>No Poster</div>
          )}
        </div>
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white">{title}</h1>
          
          {/* Smart Buttons */}
          {smartButtons && smartButtons.length > 0 && (
            <SmartButtons buttons={smartButtons} />
          )}
          
          {/* Genres Section */}
          {genres.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <span className="text-gray-400 text-sm font-medium">Genres:</span>
              {genres.slice(0, 6).map((g) => (
                <span key={g} className="px-3 py-1 bg-purple-700 text-white text-sm">{g}</span>
              ))}
            </div>
          )}
          
          {/* Languages Section */}
          {languages.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <span className="text-gray-400 text-sm font-medium">Languages:</span>
              {languages.map((l) => (
                <span key={l} className="px-2 py-1 border border-gray-600 text-gray-300 text-xs hover:bg-gray-700 transition-colors">{l}</span>
              ))}
            </div>
          )}
          
          {/* Additional Info */}
          <div className="flex flex-wrap gap-2 text-sm text-gray-300">
            {year && <span className="px-2 py-1 border border-gray-600">{year}</span>}
            {studio && <span className="px-2 py-1 border border-gray-600">{studio}</span>}
            {status && <span className="px-2 py-1 border border-gray-600">{status}</span>}
            {totalEpisodes && <span className="px-2 py-1 border border-gray-600">{totalEpisodes} episodes</span>}
            {duration && <span className="px-2 py-1 border border-gray-600">{duration}</span>}
            {typeof rating === 'number' && <span className="px-2 py-1 border border-gray-600">★ {rating.toFixed(1)}</span>}
          </div>
          
        </div>
      </div>
    </section>
  )
}


