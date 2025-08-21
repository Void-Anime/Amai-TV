import AnimeGridCard from '@/components/AnimeGridCard'
import { fetchAnimeList } from '@/server/scraper'

type SeriesListItem = { title: string | null; url: string; image?: string | null; postId?: number }

export default async function AnimePage({ searchParams }: { searchParams: { page?: string } }) {
  const page = Number(searchParams?.page || '1')
  const data = await fetchAnimeList(Number.isFinite(page) ? page : 1)
  const items: SeriesListItem[] = data.items || []
  const prev = Math.max(1, page - 1)
  const next = page + 1
  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6 pb-24 pt-6 space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-semibold">All Anime</h1>
        <p className="text-text-dim">Explore the catalog</p>
      </header>

      <div className="grid gap-3 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {items.map((it) => (
          <AnimeGridCard key={it.url} url={it.url} title={it.title} image={it.image || undefined} postId={it.postId} />
        ))}
      </div>

      <div className="flex items-center justify-end gap-2">
        <a href={`/anime?page=${prev}`} className="btn btn-outline">Prev</a>
        <span className="text-sm text-text-dim">Page {page}</span>
        <a href={`/anime?page=${next}`} className="btn btn-primary">Next</a>
      </div>
    </div>
  )
}


