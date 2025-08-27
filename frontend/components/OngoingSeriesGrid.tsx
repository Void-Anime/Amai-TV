"use client";
import { useEffect, useState } from "react";
import NewAnimeCard from "./NewAnimeCard";
import { SeriesListItem } from "@/server/types";

export default function OngoingSeriesGrid() {
  const [ongoingSeries, setOngoingSeries] = useState<SeriesListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOngoingSeries = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/ongoing?page=1');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setOngoingSeries(data.items || []);
        setError(null);
      } catch (err) {
        console.error('Error loading ongoing series:', err);
        setError(err instanceof Error ? err.message : 'Failed to load ongoing series');
      } finally {
        setLoading(false);
      }
    };

    loadOngoingSeries();
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="w-48 h-72 bg-gray-800 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-6">
          <h3 className="text-xl font-bold text-red-400 mb-2">Error Loading Ongoing Series</h3>
          <p className="text-red-300">{error}</p>
        </div>
      </div>
    );
  }

  if (ongoingSeries.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">No ongoing series available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {ongoingSeries.slice(0, 6).map((series, index) => (
          <div key={series.url} className="flex-shrink-0 w-48">
            <NewAnimeCard
              url={series.url}
              title={series.title || 'Unknown Title'}
              image={series.image}
              postId={series.postId}
              genres={[]}
              rating={Math.floor(Math.random() * 2) + 4}
              year={2024}
              episodeCount={24}
              isNew={true}
            />
          </div>
        ))}
      </div>
      
      {ongoingSeries.length > 6 && (
        <div className="text-center">
          <a
            href="/ongoing"
            className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            View All Ongoing Series
          </a>
        </div>
      )}
    </div>
  );
}
