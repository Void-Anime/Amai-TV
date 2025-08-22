import Link from "next/link";
import { createTitleUrl } from "@/lib/utils";

type SeasonItem = { season: number | string; label: string; nonRegional: boolean };

export default function SeasonSelector({
  seasons,
  selected,
  seriesUrl,
  postId,
}: {
  seasons: SeasonItem[];
  selected?: number;
  seriesUrl: string;
  postId?: number;
}) {
  // Extract title from URL to generate slug
  const title = decodeURIComponent(seriesUrl.split('/').filter(Boolean).pop() || '');
  
  return (
    <div className="w-full">
      <div className="flex overflow-x-auto gap-2 pb-1" role="tablist" aria-label="Seasons">
        {seasons.map((s) => {
          const href = `${createTitleUrl(title, postId)}&season=${s.season}`;
          const isActive = selected === Number(s.season);
          return (
            <a
              key={String(s.season)}
              href={href}
              role="tab"
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              className={`px-3 py-1 rounded-full border whitespace-nowrap transition-colors ${isActive ? 'border-purple-500 bg-purple-500/10 text-white' : 'border-gray-600 text-gray-300 hover:text-white hover:border-gray-500'}`}
            >
              {s.label}
            </a>
          );
        })}
      </div>
    </div>
  );
}


