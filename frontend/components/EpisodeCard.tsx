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
    <a href={watchHref} className={`group relative block transition-all duration-300 hover:scale-105 ${
      isCurrentEpisode ? 'ring-2 ring-purple-500' : ''
    }`}>
      {/* Episode Card Container */}
      <div className="relative overflow-hidden shadow-md hover:shadow-lg transition-all duration-300" style={{ backgroundColor: '#1a1a1a' }}>
        {/* Thumbnail Container - 16:9 Aspect Ratio */}
        <div className="relative aspect-video bg-gradient-to-br from-gray-800 to-gray-900">
          {poster ? (
            <Image 
              unoptimized 
              src={poster.startsWith('data:') ? poster : `/api/image?src=${encodeURIComponent(poster)}`} 
              alt={title || 'Episode'} 
              fill 
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" 
              className="object-cover transition-transform duration-300 group-hover:scale-110" 
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mb-2">
                  <span className="text-white font-bold text-lg">{number || '?'}</span>
                </div>
                <div className="text-white text-xs font-medium">Episode</div>
              </div>
            </div>
          )}
          
          {/* Episode Number Badge - Top Left */}
          <div className="absolute top-3 left-3 w-8 h-8 bg-black rounded-full flex items-center justify-center border border-white/20">
            <span className="text-white text-sm font-bold">{number || '?'}</span>
          </div>
          
          {/* Status Badges - Top Right */}
          <div className="absolute top-3 right-3 flex gap-1">
            {isCurrentEpisode && (
              <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            )}
            {completed && !isCurrentEpisode && (
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
              </div>
            )}
          </div>
          
          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40">
            <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-black ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>
          
          {/* Progress Bar */}
          {progress > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/50">
              <div 
                className="h-full bg-purple-500 transition-all duration-300" 
                style={{ width: `${Math.min(100, Math.round(progress * 100))}%` }} 
              />
            </div>
          )}
        </div>
        
        {/* Episode Info */}
        <div className="p-4" style={{ backgroundColor: '#1a1a1a' }}>
          <h3 className="text-white font-bold text-sm leading-tight mb-1 line-clamp-2">
            {title || `Episode ${number || 'Unknown'}`}
          </h3>
          
          {/* Episode Details */}
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Episode {number || '?'}</span>
            {completed && !isCurrentEpisode && (
              <span className="text-green-400 font-medium">Watched</span>
            )}
            {isCurrentEpisode && (
              <span className="text-purple-400 font-medium">Now Playing</span>
            )}
          </div>
        </div>
      </div>
    </a>
  )
}


