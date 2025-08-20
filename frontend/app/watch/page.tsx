"use client";
import { useSearchParams } from "next/navigation";
import React, { useRef, useEffect, useState } from "react";
import Hls from "hls.js";
import { getApiBaseUrl } from "@/lib/api";

type PlayerSourceItem = { src: string; label?: string | null; quality?: string | null; kind: "iframe" | "video" };

export default function WatchPage() {
  const params = useSearchParams();
  const src = params.get("src") || "";
  const episode = params.get("episode") || "";
  const seriesUrl = params.get("url") || "";
  const postId = params.get("post_id") ? Number(params.get("post_id")) : undefined;
  const season = params.get("season") ? Number(params.get("season")) : undefined;
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-4">
      <h1 className="text-2xl font-semibold">Watch</h1>
      <EpisodePlayer src={src} episodeUrl={episode} context={{ seriesUrl, postId, season }} />
    </div>
  );
}

function EpisodePlayer({ src, episodeUrl, context }: { src: string; episodeUrl?: string; context?: { seriesUrl?: string; postId?: number; season?: number } }) {
  const [players, setPlayers] = useState<PlayerSourceItem[] | null>(null);
  const [chosen, setChosen] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [episodeList, setEpisodeList] = useState<{ title?: string | null; url: string }[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  useEffect(() => {
    (async () => {
      if (!episodeUrl) return;
      try {
        const base = getApiBaseUrl();
        const res = await fetch(`${base}/api/episode_players?url=${encodeURIComponent(episodeUrl)}`);
        if (res.ok) {
          const data = await res.json();
          const items: PlayerSourceItem[] = data.items || [];
          setPlayers(items);
          const preferred = items.find(i => i.kind === 'video' && i.src.endsWith('.m3u8')) || items.find(i => i.kind === 'video') || items[0];
          if (preferred) setChosen(preferred.src);
        }
      } catch {}
    })();
  }, [episodeUrl]);

  // Load episode list for navigation
  useEffect(() => {
    (async () => {
      if (!context?.seriesUrl) return;
      try {
        const base = getApiBaseUrl();
        const qs = new URLSearchParams({ url: context.seriesUrl, ...(context.postId ? { post_id: String(context.postId) } : {}), ...(context.season ? { season: String(context.season) } : {}) });
        const res = await fetch(`${base}/api/anime_details?${qs.toString()}`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          const list: { title?: string | null; url: string }[] = data.episodes || [];
          setEpisodeList(list);
          const idx = list.findIndex(e => e.url === episodeUrl);
          setCurrentIndex(idx);
        }
      } catch {}
    })();
  }, [context?.seriesUrl, context?.postId, context?.season, episodeUrl]);

  const finalSrc = chosen || src;
  const iframe = players?.find(p => p.kind === 'iframe' && p.src === finalSrc);

  useEffect(() => {
    if (!videoRef.current) return;
    if (Hls.isSupported() && finalSrc.endsWith(".m3u8")) {
      const hls = new Hls();
      hls.loadSource(finalSrc);
      hls.attachMedia(videoRef.current);
      return () => hls.destroy();
    } else {
      videoRef.current.src = finalSrc;
    }
  }, [finalSrc]);

  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = playbackRate;
  }, [playbackRate]);

  return (
    <div className="space-y-3">
      <div className="aspect-video w-full overflow-hidden rounded-md border border-white/10 bg-black">
        {iframe ? (
          <iframe src={iframe.src} allow="autoplay; encrypted-media" allowFullScreen className="h-full w-full" />
        ) : (
          <video ref={videoRef} controls className="h-full w-full" />
        )}
      </div>
      {episodeList.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-text-dim">Episode {currentIndex >= 0 ? currentIndex + 1 : ''} of {episodeList.length}</div>
          {currentIndex >= 0 && currentIndex < episodeList.length - 1 && (
            <a className="btn btn-primary" href={`/watch?episode=${encodeURIComponent(episodeList[currentIndex + 1].url)}${context?.seriesUrl ? `&url=${encodeURIComponent(context.seriesUrl)}` : ''}${context?.postId ? `&post_id=${context.postId}` : ''}${context?.season ? `&season=${context.season}` : ''}`}>Next Episode</a>
          )}
        </div>
      )}
      {episodeList.length > 0 && (
        <div className="grid gap-2 grid-cols-2 sm:grid-cols-3">
          {episodeList.map((e, idx) => (
            <a key={e.url} href={`/watch?episode=${encodeURIComponent(e.url)}${context?.seriesUrl ? `&url=${encodeURIComponent(context.seriesUrl)}` : ''}${context?.postId ? `&post_id=${context.postId}` : ''}${context?.season ? `&season=${context.season}` : ''}`} className={`rounded-md border px-3 py-2 text-sm ${idx === currentIndex ? 'border-primary' : 'border-white/10'}`}>{e.title || `Episode ${idx + 1}`}</a>
          ))}
        </div>
      )}
      <div className="flex items-center gap-3 text-sm">
        <label className="text-gray-400">Speed</label>
        <select value={playbackRate} onChange={(e) => setPlaybackRate(Number(e.target.value))} className="rounded-md bg-white/5 px-2 py-1 border border-white/10">
          {[0.5, 0.75, 1, 1.25, 1.5, 2].map((v) => (
            <option key={v} value={v}>{v}x</option>
          ))}
        </select>
      </div>
    </div>
  );
}


