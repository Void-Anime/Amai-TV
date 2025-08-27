import { fetchAnimeList } from "@/server/scraper";
import NewNavbar from "@/components/NewNavbar";
import NewBottomNav from "@/components/NewBottomNav";
import DesktopNav from "@/components/DesktopNav";
import AnimeGridCard from "@/components/AnimeGridCard";

export default async function AnimePage({ searchParams }: { searchParams: { page?: string } }) {
  const page = Number(searchParams?.page || 1);
  const data = await fetchAnimeList(page);
  const items = data.items || [];

  return (
    <div className="min-h-screen bg-black">
      <NewNavbar />
      
      <main className="mx-auto max-w-7xl px-4 md:px-6 py-6 space-y-6 pb-24">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-white">All Anime</h1>
          <p className="text-lg text-gray-300">Discover and watch your favorite anime series</p>
        </div>

        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {items.map((item) => (
            <AnimeGridCard
              key={item.url}
              url={item.url}
              title={item.title}
              image={item.image}
              postId={item.postId}
            />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center space-x-2">
          {page > 1 && (
            <a
              href={`/anime?page=${page - 1}`}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Previous
            </a>
          )}
          <span className="px-4 py-2 text-gray-300">Page {page}</span>
          <a
            href={`/anime?page=${page + 1}`}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Next
          </a>
        </div>
      </main>

      <NewBottomNav />
      <DesktopNav />
    </div>
  );
}


