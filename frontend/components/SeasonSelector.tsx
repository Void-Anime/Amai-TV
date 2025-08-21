import Link from "next/link";

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
  return (
    <div className="w-full">
      {/* Mobile dropdown */}
      <div className="sm:hidden">
        <form action="/title" method="get" className="flex gap-2 items-center">
          <input type="hidden" name="url" value={seriesUrl} />
          {postId ? <input type="hidden" name="post_id" value={String(postId)} /> : null}
          <select name="season" defaultValue={selected || seasons[0]?.season as any} className="w-full rounded-md bg-bg-800 border border-stroke px-3 py-2">
            {seasons.map((s) => (
              <option key={String(s.season)} value={String(s.season)}>{s.label}</option>
            ))}
          </select>
          <button className="btn btn-primary">Go</button>
        </form>
      </div>

      {/* Desktop horizontal scroll */}
      <div className="hidden sm:flex overflow-x-auto gap-2 pb-1">
        {seasons.map((s) => {
          const href = `/title?url=${encodeURIComponent(seriesUrl)}${postId ? `&post_id=${postId}` : ''}&season=${s.season}`;
          const isActive = selected === Number(s.season);
          return (
            <a key={String(s.season)} href={href} className={`px-3 py-1 rounded-full border whitespace-nowrap ${isActive ? 'border-primary bg-primary/10 text-text-high' : 'border-stroke text-text-dim hover:text-text-high'}`}>{s.label}</a>
          );
        })}
      </div>
    </div>
  );
}


