"use client";
import EpisodeCard from "@/components/EpisodeCard";
import { useProgress } from "@/components/useProgress";

type Episode = { url: string; title?: string | null; number?: string | null; poster?: string | null };

export default function EpisodesList({
  episodes,
  seriesUrl,
  postId,
  season,
  currentEpisodeUrl,
  seasons,
}: {
  episodes: Episode[];
  seriesUrl: string;
  postId?: number;
  season: number;
  currentEpisodeUrl?: string | null;
  seasons?: { season: number | string; label: string; nonRegional: boolean; regionalLanguageInfo?: { isNonRegional: boolean; isSubbed: boolean; isDubbed: boolean; languageType: 'dubbed' | 'subbed' | 'unknown' } }[];
}) {
  const { ratio, isCompleted } = useProgress();

  // Check if current season has non-regional episodes
  const currentSeasonInfo = seasons?.find(s => Number(s.season) === season);
  const hasNonRegionalEpisodes = currentSeasonInfo?.nonRegional || 
    currentSeasonInfo?.regionalLanguageInfo?.isNonRegional || 
    currentSeasonInfo?.regionalLanguageInfo?.isSubbed;

  // Show empty state if no episodes
  if (!episodes || episodes.length === 0) {
    return (
      <div className="relative">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800 rounded-2xl"></div>
        
        <div className="relative text-center py-16 px-6">
          <div className="text-gray-400 mb-6">
            <svg className="w-20 h-20 mx-auto opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No Episodes Available</h3>
          <p className="text-gray-400 mb-1">This season doesn't have any episodes yet</p>
          <p className="text-sm text-gray-500">Please try a different season</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        {episodes.map((ep, index) => (
          <EpisodeCard
            key={ep.url}
            url={ep.url}
            title={ep.title || `Episode ${ep.number || index + 1}`}
            number={ep.number || String(index + 1)}
            poster={ep.poster}
            seriesUrl={seriesUrl}
            postId={postId}
            season={season}
            progress={ratio(ep.url)}
            completed={isCompleted(ep.url)}
            isCurrentEpisode={currentEpisodeUrl ? currentEpisodeUrl === ep.url : false}
          />
        ))}
      </div>
      
      {/* Regional Language Notice - Only show if current season has non-regional episodes */}
      {hasNonRegionalEpisodes && (
        <div className="mt-8">
        <div 
          className="p-4 text-center relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.08), rgba(236, 72, 153, 0.08))',
            border: '1px solid rgba(147, 51, 234, 0.15)',
            borderRadius: '12px',
            animation: 'fadeInSeparator 0.6s ease-out'
          }}
        >
          {/* Top gradient line */}
          <div 
            className="absolute top-0 left-0 right-0 h-0.5"
            style={{
              background: 'linear-gradient(90deg, rgba(147, 51, 234, 0.3), rgba(236, 72, 153, 0.3), rgba(147, 51, 234, 0.3))',
              borderRadius: '12px 12px 0 0'
            }}
          />
          
          {/* Content */}
          <div className="flex items-center justify-center gap-3 relative z-10">
            {/* Left decorative line */}
            <div 
              className="w-10 h-px"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(147, 51, 234, 0.3), transparent)'
              }}
            />
            
            {/* Main content */}
            <div className="flex items-center gap-2" style={{ color: 'rgba(147, 51, 234, 0.9)', fontSize: '14px', fontWeight: '500' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ opacity: 0.9 }}>
                <path d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              <span>Below episodes aren't dubbed in regional languages</span>
            </div>
            
            {/* Right decorative line */}
            <div 
              className="w-10 h-px"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(147, 51, 234, 0.3), transparent)'
              }}
            />
          </div>
        </div>
        
        {/* CSS Animation */}
        <style jsx>{`
          @keyframes fadeInSeparator {
            0% { 
              opacity: 0; 
              transform: translateY(-10px); 
            }
            100% { 
              opacity: 1; 
              transform: translateY(0); 
            }
          }
        `}</style>
        </div>
      )}
    </div>
  );
}


