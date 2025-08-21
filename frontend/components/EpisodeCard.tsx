import Image from 'next/image'

type Props = {
  url: string
  title?: string | null
  number?: string | null
  poster?: string | null
  seriesUrl: string
  postId?: number
  season: number
  progress?: number // 0..1
  completed?: boolean
}

export default function EpisodeCard({ url, title, number, poster, seriesUrl, postId, season, progress = 0, completed = false }: Props) {
  const watchHref = `/watch?episode=${encodeURIComponent(url)}&url=${encodeURIComponent(seriesUrl)}${postId ? `&post_id=${postId}` : ''}&season=${season}`
  return (
    <a href={watchHref} className="group relative rounded-xl overflow-hidden border border-stroke bg-surface shadow-sm transition-[box-shadow,transform] duration-200 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-[1px]">
      <div className="relative aspect-video">
        {poster ? (
          <Image unoptimized src={poster.startsWith('data:') ? poster : `/api/image?src=${encodeURIComponent(poster)}`} alt={title || 'Episode'} fill sizes="(max-width:768px) 100vw, 50vw" className="object-cover" />
        ) : (
          <div className="h-full w-full grid place-items-center text-xs text-text-dim">No Image</div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div className="pointer-events-none absolute inset-0 ring-0 ring-primary/30 group-hover:ring-2 rounded-xl transition"></div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
          <span className="rounded-full bg-primary text-[11px] px-3 py-1">Play</span>
        </div>
      </div>
      <div className="p-3">
        <div className="text-[11px] text-text-dim">{number || 'Episode'}</div>
        <div className="text-sm font-medium line-clamp-2">{title || 'Untitled episode'}</div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-bg-800">
          <div className="h-full bg-primary" style={{ width: `${Math.min(100, Math.round(progress * 100))}%` }} />
        </div>
        {completed && <div className="mt-2 text-[11px] text-success">✓ Completed</div>}
      </div>
    </a>
  )
}


