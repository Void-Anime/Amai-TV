"use client";
import { useMemo } from "react";
import { useProgress } from "@/components/useProgress";

function extractEpisodeId(url: string): string {
  try {
    const decoded = decodeURIComponent(url);
    if (/^https?:\/\//i.test(decoded) && decoded.includes('/episode/')) {
      return decoded.split('/episode/')[1]?.split('/')[0] || decoded;
    }
    return decoded;
  } catch {
    return url;
  }
}

export default function ContinueWatchingHome() {
  const { ratio } = useProgress();

  // Read raw map from localStorage via hook internals
  const entries = useMemo(() => {
    try {
      const raw = localStorage.getItem('amai:progress:v1');
      const map = raw ? JSON.parse(raw) as Record<string, { position: number; duration: number; completed?: boolean }> : {};
      return Object.entries(map)
        .filter(([, v]) => v && v.duration > 0 && (v.position || 0) > 0 && (v.position / v.duration) < 0.98)
        .sort((a, b) => (b[1].position / b[1].duration) - (a[1].position / a[1].duration))
        .slice(0, 12);
    } catch {
      return [] as Array<[string, { position: number; duration: number }]>;
    }
  }, []);

  if (!entries.length) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Continue Watching</h2>
            <p className="text-gray-400 text-sm mt-1">Pick up where you left off</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {entries.map(([epUrl]) => {
            const epId = extractEpisodeId(epUrl);
            const p = ratio(epUrl);
            const title = decodeURIComponent(epId.split('/').filter(Boolean).pop() || 'Episode');
            return (
              <a key={epUrl} href={`/watch?episode=${encodeURIComponent(epId)}`} className="group relative block rounded-xl overflow-hidden border border-white/10 bg-black hover:border-white/25 transition">
                <div className="aspect-video w-full bg-[linear-gradient(to_bottom,transparent,rgba(0,0,0,.6))] flex items-end p-3">
                  <div className="text-white text-sm font-medium line-clamp-2">{title}</div>
                </div>
                <div className="p-3">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Progress</span>
                    <span>{Math.round(p * 100)}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                    <div className="h-full bg-white transition-all duration-300" style={{ width: `${Math.min(100, Math.round(p * 100))}%` }} />
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}


