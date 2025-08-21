import AnimeGridCard from '@/components/AnimeGridCard'
import { fetchMoviesList } from '@/server/scraper'

type MovieItem = { title: string | null; url: string; image?: string | null; postId?: number }

export default async function MoviesPage({ searchParams }: { searchParams: { page?: string; q?: string } }) {
  const page = Number(searchParams?.page || '1')
  const q = searchParams?.q || ''
  const data = await fetchMoviesList(Number.isFinite(page) ? page : 1, q)
  const items: MovieItem[] = data.items || []
  const prev = Math.max(1, page - 1)
  const next = page + 1
  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6 pb-24 pt-6 space-y-6">
      <header className="space-y-3">
        <h1 className="text-2xl md:text-3xl font-semibold">Movies</h1>
        <form action="/movies" className="grid gap-3 sm:grid-cols-[1fr_auto]">
          <input name="q" defaultValue={q} placeholder="Search movies..." className="w-full rounded-md bg-bg-800 border border-stroke px-4 py-2 outline-none focus:ring-2 focus:ring-primary" />
          <button className="btn btn-primary">Search</button>
        </form>
      </header>

      <div className="grid gap-3 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {items.map((it) => (
          <AnimeGridCard key={it.url} url={it.url} title={it.title} image={it.image || undefined} postId={it.postId} />
        ))}
      </div>

      <div className="flex items-center justify-end gap-2">
        <a href={`/movies?page=${prev}${q ? `&q=${encodeURIComponent(q)}` : ''}`} className="btn btn-outline">Prev</a>
        <span className="text-sm text-text-dim">Page {page}</span>
        <a href={`/movies?page=${next}${q ? `&q=${encodeURIComponent(q)}` : ''}`} className="btn btn-primary">Next</a>
      </div>
    </div>
  )
}


