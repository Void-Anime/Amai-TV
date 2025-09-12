"use client";
import { useMemo, useState } from "react";

type PlayerSourceItem = { src: string; kind: "iframe" | "video"; label?: string | null; quality?: string | null };

export default function Player({ sources }: { sources: PlayerSourceItem[] }) {
  const safeSources = useMemo(() => {
    const seen = new Set<string>();
    return (sources || []).filter((s) => (s?.src && !seen.has(s.src) ? (seen.add(s.src), true) : false));
  }, [sources]);

  const [idx, setIdx] = useState(0);
  const current = safeSources[idx] || null;

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
              <video key={current.src} controls className="w-full h-full" autoPlay>
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


