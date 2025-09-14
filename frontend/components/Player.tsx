"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useProgress } from "@/components/useProgress";
import { useWatchHistory } from "@/hooks/useWatchHistory";

type PlayerSourceItem = { src: string; kind: "iframe" | "video"; label?: string | null; quality?: string | null };

interface PlayerProps {
  sources: PlayerSourceItem[];
  episodeData?: {
    id: string;
    title: string;
    episode: string;
    season?: string;
    poster?: string;
    url: string;
  };
}

export default function Player({ sources, episodeData }: PlayerProps) {
  const safeSources = useMemo(() => {
    const seen = new Set<string>();
    return (sources || []).filter((s) => (s?.src && !seen.has(s.src) ? (seen.add(s.src), true) : false));
  }, [sources]);

  const [idx, setIdx] = useState(0);
  const current = safeSources[idx] || null;
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { set: setProgress, get: getProgress } = useProgress();
  const { addToWatchHistory } = useWatchHistory();
  const [hasAddedToHistory, setHasAddedToHistory] = useState(false);

  // Add to watch history when user starts watching
  useEffect(() => {
    if (!episodeData || hasAddedToHistory) return;
    
    console.log('Player: Adding to watch history:', episodeData);
    
    // Add to history after a short delay to ensure the player is loaded
    const timer = setTimeout(() => {
      if (episodeData) {
        console.log('Player: Calling addToWatchHistory with:', {
          id: episodeData.id,
          title: episodeData.title,
          episode: episodeData.episode,
          season: episodeData.season,
          poster: episodeData.poster,
          url: episodeData.url
        });
        
        addToWatchHistory({
          id: episodeData.id,
          title: episodeData.title,
          episode: episodeData.episode,
          season: episodeData.season,
          poster: episodeData.poster,
          url: episodeData.url
        });
        setHasAddedToHistory(true);
      }
    }, 2000); // 2 second delay

    return () => clearTimeout(timer);
  }, [episodeData, hasAddedToHistory, addToWatchHistory]);

  // Resume time for HTML5 video
  useEffect(() => {
    if (!current || current.kind !== "video") return;
    const v = videoRef.current;
    if (!v) return;
    try {
      const p = getProgress(current.src);
      if (p && p.position > 0 && p.duration > 0 && p.position < p.duration - 2) {
        v.currentTime = p.position;
      }
    } catch {}

    const onTime = () => {
      try {
        if (!v.duration || isNaN(v.duration)) return;
        setProgress(current.src, v.currentTime || 0, v.duration || 0);
      } catch {}
    };
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("ended", onTime);
    return () => {
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("ended", onTime);
    };
  }, [current?.src, current?.kind]);

  return (
    <div className="space-y-4">
      <div className="bg-black rounded-xl overflow-hidden border border-white/10 shadow">
        <div className="aspect-video w-full">
          {current ? (
            current.kind === "iframe" ? (
              <iframe
                key={current.src}
                src={current.src}
                className="w-full h-full"
                frameBorder={0}
                allowFullScreen
                allow="autoplay; encrypted-media"
                referrerPolicy="no-referrer"
                sandbox="allow-scripts allow-same-origin allow-forms"
              />
            ) : (
              <video
                key={current.src}
                ref={videoRef as any}
                controls
                className="w-full h-full"
                autoPlay
              >
                <source src={current.src} />
                Your browser does not support the video tag.
              </video>
            )
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">No sources</div>
          )}
        </div>
      </div>

      {safeSources.length > 1 && (
        <div className="flex items-center justify-between bg-black rounded-xl p-3 border border-white/10">
          <div className="text-sm text-gray-300">Select server:</div>
          <select
            value={idx}
            onChange={(e) => setIdx(Number(e.target.value))}
            className="bg-black text-white px-3 py-2 rounded border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
          >
            {safeSources.map((s, i) => (
              <option key={s.src} value={i}>
                {s.label || s.quality || `Server ${i + 1}`}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}


