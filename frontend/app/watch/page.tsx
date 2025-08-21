"use client";
import { useSearchParams } from "next/navigation";
import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
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
    <div className="mx-auto max-w-6xl px-4 md:px-6 pb-24 pt-4 space-y-4">
      <EpisodePlayer src={src} episodeUrl={episode} context={{ seriesUrl, postId, season }} />
    </div>
  );
}

function EpisodePlayer({ src, episodeUrl, context }: { src: string; episodeUrl?: string; context?: { seriesUrl?: string; postId?: number; season?: number } }) {
  const [players, setPlayers] = useState<PlayerSourceItem[] | null>(null);
  const [chosen, setChosen] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [episodeList, setEpisodeList] = useState<{ title?: string | null; url: string; poster?: string | null }[]>([]);
  const [seriesPoster, setSeriesPoster] = useState<string | null>(null);
  const [seasons, setSeasons] = useState<{ season: number | string; label: string; nonRegional: boolean }[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [autoplay, setAutoplay] = useState(true);
  const [trackType, setTrackType] = useState<'sub' | 'dub'>('sub');
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
          const list: { title?: string | null; url: string; poster?: string | null }[] = data.episodes || [];
          setEpisodeList(list);
          setSeriesPoster((data.poster as string) || null);
          setSeasons((data.seasons as any[]) || []);
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

  // Auto-next when video ends
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const onEnded = () => {
      if (!autoplay) return;
      if (currentIndex >= 0 && currentIndex < episodeList.length - 1) {
        const next = episodeList[currentIndex + 1];
        const href = `/watch?episode=${encodeURIComponent(next.url)}${context?.seriesUrl ? `&url=${encodeURIComponent(context.seriesUrl)}` : ''}${context?.postId ? `&post_id=${context.postId}` : ''}${context?.season ? `&season=${context.season}` : ''}`;
        window.location.assign(href);
      }
    };
    el.addEventListener('ended', onEnded);
    return () => el.removeEventListener('ended', onEnded);
  }, [autoplay, currentIndex, episodeList, context?.seriesUrl, context?.postId, context?.season]);

  const currentTitle = currentIndex >= 0 ? (episodeList[currentIndex]?.title || `Episode ${currentIndex + 1}`) : 'Episode';

  return (
    <div className="space-y-5">
      <div className="rounded-2xl overflow-hidden border border-stroke bg-black shadow-md">
        <div className="aspect-video w-full">
          {iframe ? (
            <iframe src={iframe.src} allow="autoplay; encrypted-media" allowFullScreen className="h-full w-full" />
          ) : (
            <video ref={videoRef} controls className="h-full w-full" />
          )}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 border-t border-stroke bg-bg-900/60">
          <div>
            <div className="text-sm text-text-dim">Season {context?.season || 1} · Episode {currentIndex >= 0 ? currentIndex + 1 : ''}</div>
            <div className="font-medium">{currentTitle}</div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <label className="flex items-center gap-2"><input type="checkbox" checked={autoplay} onChange={(e) => setAutoplay(e.target.checked)} /> Autoplay</label>
            <div className="hidden sm:flex items-center gap-2">
              <button className={`btn ${trackType==='sub' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setTrackType('sub')}>Sub</button>
              <button className={`btn ${trackType==='dub' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setTrackType('dub')}>Dub</button>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-text-dim">Speed</label>
              <select value={playbackRate} onChange={(e) => setPlaybackRate(Number(e.target.value))} className="rounded-md bg-white/5 px-2 py-1 border border-white/10">
                {[0.5, 0.75, 1, 1.25, 1.5, 2].map((v) => (
                  <option key={v} value={v}>{v}x</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Season Selector */}
      {seasons.length > 0 && (
        <div className="space-y-2">
          {/* Mobile dropdown */}
          <div className="sm:hidden">
            <select
              className="w-full rounded-md bg-bg-800 border border-stroke px-3 py-2"
              defaultValue={String(context?.season || seasons[0]?.season)}
              onChange={(e) => {
                const s = e.target.value;
                const href = `/title?url=${encodeURIComponent(context?.seriesUrl || '')}${context?.postId ? `&post_id=${context.postId}` : ''}&season=${s}`;
                window.location.assign(href);
              }}
            >
              {seasons.map((s) => (
                <option key={String(s.season)} value={String(s.season)}>{s.label}</option>
              ))}
            </select>
          </div>
          {/* Desktop pills */}
          <div className="hidden sm:flex overflow-x-auto gap-2 pb-1">
            {seasons.map((s) => {
              const isActive = Number(s.season) === (context?.season || 1);
              const href = `/title?url=${encodeURIComponent(context?.seriesUrl || '')}${context?.postId ? `&post_id=${context.postId}` : ''}&season=${s.season}`;
              return (
                <a key={String(s.season)} href={href} className={`px-3 py-1 rounded-full border whitespace-nowrap ${isActive ? 'border-primary bg-primary/10 text-text-high' : 'border-stroke text-text-dim hover:text-text-high'}`}>{s.label}</a>
              );
            })}
          </div>
        </div>
      )}

      {episodeList.length > 0 && currentIndex >= 0 && currentIndex < episodeList.length - 1 && (
        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="font-medium">Next Episode</div>
            <a className="btn btn-primary" href={`/watch?episode=${encodeURIComponent(episodeList[currentIndex + 1].url)}${context?.seriesUrl ? `&url=${encodeURIComponent(context.seriesUrl)}` : ''}${context?.postId ? `&post_id=${context.postId}` : ''}${context?.season ? `&season=${context.season}` : ''}`}>Play</a>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative h-16 w-28 overflow-hidden rounded-md border border-stroke bg-bg-800">
              {episodeList[currentIndex + 1]?.poster || seriesPoster ? (
                <Image
                  unoptimized
                  src={(episodeList[currentIndex + 1].poster || seriesPoster) as string}
                  alt="Next preview"
                  fill
                  sizes="112px"
                  className="object-cover"
                />
              ) : (
                <div className="h-full w-full grid place-items-center text-[11px] text-text-dim">Preview</div>
              )}
            </div>
            <div className="text-sm">
              {episodeList[currentIndex + 1].title || `Episode ${currentIndex + 2}`}
            </div>
          </div>
        </div>
      )}

      {episodeList.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm text-text-dim">Episodes</div>
          <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2">
            {episodeList.map((e, idx) => {
              const href = `/watch?episode=${encodeURIComponent(e.url)}${context?.seriesUrl ? `&url=${encodeURIComponent(context.seriesUrl)}` : ''}${context?.postId ? `&post_id=${context.postId}` : ''}${context?.season ? `&season=${context?.season}` : ''}`;
              const isActive = idx === currentIndex;
              return (
                <a key={e.url} href={href} className={`group relative snap-start shrink-0 w-44 rounded-xl overflow-hidden border ${isActive ? 'border-primary ring-2 ring-primary/40' : 'border-stroke'} bg-surface transition-shadow hover:shadow-lg hover:shadow-primary/20`}>
                  <div className="relative h-24 w-full bg-bg-800">
                    {e.poster || seriesPoster ? (
                      <Image
                        unoptimized
                        src={(e.poster || seriesPoster) as string}
                        alt={e.title || `Episode ${idx + 1}`}
                        fill
                        sizes="176px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 grid place-items-center text-[11px] text-text-dim">Episode {idx + 1}</div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                      <span className="rounded-full bg-primary text-[10px] px-2 py-1">Play</span>
                    </div>
                  </div>
                  <div className="p-2">
                    <div className="text-[11px] text-text-dim">E{idx + 1}</div>
                    <div className="text-[12px] line-clamp-2">{e.title || `Episode ${idx + 1}`}</div>
                    <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-bg-800">
                      <div className="h-full bg-primary" style={{ width: `${(idx % 3 === 0 ? 42 : 0)}%` }} />
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      )}

      {autoplay && episodeList.length > 0 && currentIndex >= 0 && currentIndex < episodeList.length - 1 && (
        <a href={`/watch?episode=${encodeURIComponent(episodeList[currentIndex + 1].url)}${context?.seriesUrl ? `&url=${encodeURIComponent(context.seriesUrl)}` : ''}${context?.postId ? `&post_id=${context.postId}` : ''}${context?.season ? `&season=${context?.season}` : ''}`} className="sm:hidden fixed bottom-20 right-4 left-4 z-40 btn btn-primary text-center">Next Episode</a>
      )}
    </div>
  );
}


