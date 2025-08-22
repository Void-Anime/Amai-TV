import Image from 'next/image'
import { createTitleUrl } from '@/lib/utils'

type Props = {
  url: string
  title?: string | null
  number?: string | null
  poster?: string | null
  seriesUrl: string
  postId?: number
  season: number
  progress?: number // 0..1
  completed?: boolean
  isCurrentEpisode?: boolean
}

export default function EpisodeCard({ url, title, number, poster, seriesUrl, postId, season, progress = 0, completed = false, isCurrentEpisode = false }: Props) {
  // Extract title from series URL to generate slug (kept for future use)
  const seriesTitle = decodeURIComponent(seriesUrl.split('/').filter(Boolean).pop() || '');
  
  // Extract episode identifier from the full episode URL
  let episodeId = '';
  try {
    const decoded = decodeURIComponent(url);
    if (/^https?:\/\//i.test(decoded) && decoded.includes('/episode/')) {
      episodeId = decoded.split('/episode/')[1]?.split('/')[0] || '';
    } else if (/^episode-/i.test(decoded)) {
      episodeId = decoded.replace(/^episode-/i, '');
    } else if (/-\d+x\d+$/i.test(decoded)) {
      episodeId = decoded;
    }
  } catch {}

  // Create clean watch URL (only episode parameter)
  const watchHref = episodeId ? `/watch?episode=${episodeId}` : `/watch?episode=${encodeURIComponent(url)}`
  
  return (
    <a href={watchHref} className={`group relative rounded-xl overflow-hidden border shadow-sm transition-[box-shadow,transform] duration-200 hover:shadow-lg hover:shadow-purple-500/20 hover:-translate-y-[1px] ${
      isCurrentEpisode 
        ? 'border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/30' 
        : 'border-gray-800 bg-gray-900'
    }`}>
      <div className="relative aspect-video">
        {poster ? (
          <Image unoptimized src={poster.startsWith('data:') ? poster : `/api/image?src=${encodeURIComponent(poster)}`} alt={title || 'Episode'} fill sizes="(max-width:768px) 100vw, 50vw" className="object-cover" />
        ) : (
          <div className="h-full w-full grid place-items-center text-xs text-gray-400 bg-gradient-to-br from-gray-800 to-gray-900 relative">
            {/* Episode Number Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mb-2">
                  <span className="text-white font-bold text-lg">{number || '?'}</span>
                </div>
                <div className="text-white text-xs font-medium">Episode</div>
              </div>
            </div>
            
            {/* Play Icon */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                <svg className="w-6 h-6 text-white ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        )}
        
        {/* Gradient Overlay for images */}
        {poster && (
          <>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="pointer-events-none absolute inset-0 ring-0 ring-purple-500/30 group-hover:ring-2 rounded-xl transition"></div>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                <svg className="w-6 h-6 text-white ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </>
        )}
        
        {/* Episode Number Badge */}
        <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1 border border-white/20">
          <span className="text-white text-xs font-bold">EP {number || '?'}</span>
        </div>
        
        {/* Current Episode Badge */}
        {isCurrentEpisode && (
          <div className="absolute top-2 right-2 bg-purple-500 rounded-full px-2 py-1">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
          </div>
        )}
        
        {/* Completed Badge */}
        {completed && !isCurrentEpisode && (
          <div className="absolute top-2 right-2 bg-green-500 rounded-full px-2 py-1">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        )}
      </div>
      
      <div className="p-3">
        <div className={`text-sm font-medium line-clamp-2 mb-2 ${
          isCurrentEpisode ? 'text-purple-300' : 'text-white'
        }`}>
          {title || `Episode ${number || 'Unknown'}`}
        </div>
        
        {/* Progress Bar */}
        {progress > 0 && (
          <div className="mb-2">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Progress</span>
              <span>{Math.round(progress * 100)}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-800">
              <div className="h-full bg-purple-600 transition-all duration-300" style={{ width: `${Math.min(100, Math.round(progress * 100))}%` }} />
            </div>
          </div>
        )}
        
        {/* Episode Info */}
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>Episode {number || '?'}</span>
          {completed && !isCurrentEpisode && <span className="text-green-500 font-medium">✓ Watched</span>}
          {isCurrentEpisode && <span className="text-purple-500 font-medium">▶ Now Playing</span>}
        </div>
      </div>
    </a>
  )
}


