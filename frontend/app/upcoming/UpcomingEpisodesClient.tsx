"use client";
import { useEffect, useState } from "react";
import AnimeLink from "@/components/AnimeLink";

interface UpcomingEpisode {
  id: string;
  title: string;
  image: string;
  episode: string;
  countdown: number;
  url: string;
}

export default function UpcomingEpisodesClient() {
  const [episodes, setEpisodes] = useState<UpcomingEpisode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUpcomingEpisodes = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/upcoming');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setEpisodes(data.episodes || []);
        setError(null);
      } catch (err) {
        console.error('Error loading upcoming episodes:', err);
        setError(err instanceof Error ? err.message : 'Failed to load upcoming episodes');
      } finally {
        setLoading(false);
      }
    };

    loadUpcomingEpisodes();
  }, []);

  useEffect(() => {
    function updateCountdowns() {
      setEpisodes(prevEpisodes => 
        prevEpisodes.map(episode => ({
          ...episode,
          countdown: episode.countdown
        }))
      );
    }

    updateCountdowns();
    const interval = setInterval(updateCountdowns, 30000);

    return () => clearInterval(interval);
  }, []);

  const formatCountdown = (timestamp: number) => {
    const now = Math.floor(Date.now() / 1000);
    const diff = timestamp - now;
    const absDiff = Math.abs(diff);
    const isPast = diff <= 0;
    const days = Math.floor(absDiff / (24 * 60 * 60));
    const hours = Math.floor((absDiff % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((absDiff % (60 * 60)) / 60);
    let timeText = '';
    if (days > 0) {
      timeText = `${days}d ${hours}h`;
    } else if (hours > 0) {
      timeText = `${hours}h ${minutes}m`;
    } else {
      timeText = `${minutes}m`;
    }
    return { timeText, isPast };
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="w-48 h-64 bg-gray-800 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-6 text-center">
        <h3 className="text-xl font-bold text-red-400 mb-2">Error Loading Upcoming Episodes</h3>
        <p className="text-red-300 mb-4">{error}</p>
        <p className="text-sm text-gray-400">Please try refreshing the page or check back later.</p>
      </div>
    );
  }

  if (episodes.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M6 4h12M6 20h12M6 12h12M6 16h12" />
          </svg>
        </div>
        <p className="text-gray-400">No upcoming episodes available at the moment.</p>
        <p className="text-sm text-gray-500 mt-2">This might be due to a temporary issue. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {episodes.map((episode) => {
          const { timeText, isPast } = formatCountdown(episode.countdown);
          const imageSrc = episode.image.startsWith('data:') ? episode.image : `/api/image?src=${encodeURIComponent(episode.image.startsWith('//') ? `https:${episode.image}` : episode.image)}`;
          return (
            <div key={episode.id} className="flex-shrink-0">
              <AnimeLink seriesUrl={episode.url} className="block group">
                <div className="relative bg-gray-800 rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300">
                  <div className="relative h-64">
                    <img
                      src={imageSrc}
                      alt={episode.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjwvc3ZnPg==';
                      }}
                    />
                    <span className="absolute bottom-2 left-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                      {episode.episode}
                    </span>
                    <span 
                      className={`absolute top-2 right-2 text-white text-xs px-2 py-1 rounded font-bold transition-colors duration-300 ${
                        isPast ? 'bg-red-500' : 'bg-green-500'
                      }`}
                    >
                      {timeText}
                    </span>
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="text-white text-sm font-medium line-clamp-2 group-hover:text-purple-300 transition-colors">
                      {episode.title}
                    </h3>
                  </div>
                </div>
              </AnimeLink>
            </div>
          );
        })}
      </div>

      <div className="text-center py-8">
        <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6 max-w-2xl mx-auto">
          <h3 className="text-xl font-bold text-white mb-4">About Upcoming Episodes</h3>
          <div className="space-y-3 text-gray-300 text-sm">
            <div className="flex items-center justify-center space-x-4">
              <span className="flex items-center">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                Upcoming (Green)
              </span>
              <span className="flex items-center">
                <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                Past (Red)
              </span>
            </div>
            <p>Countdown timers update every 30 seconds to show when new episodes will be available.</p>
            <p>Click on any episode to view the series details and watch previous episodes.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
