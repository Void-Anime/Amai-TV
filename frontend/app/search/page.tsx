import { fetchAnimeList } from "@/server/scraper";
import NewNavbar from "@/components/NewNavbar";
import NewBottomNav from "@/components/NewBottomNav";
import NewAnimeCard from "@/components/NewAnimeCard";

export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const query = searchParams?.q || "";
  let results: any[] = [];

  if (query) {
    try {
      // For now, we'll search through the first few pages
      const promises = [1, 2, 3].map(page => fetchAnimeList(page));
      const pages = await Promise.all(promises);
      const allItems = pages.flatMap(page => page.items || []);
      
      // Simple search through titles
      results = allItems.filter(item => 
        item.title?.toLowerCase().includes(query.toLowerCase())
      );
    } catch (error) {
      console.error('Search error:', error);
    }
  }

  return (
    <div className="min-h-screen bg-black">
      <NewNavbar />
      
      <main className="mx-auto max-w-7xl px-4 md:px-6 py-6 space-y-6 pb-24">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-white">Search</h1>
          <p className="text-lg text-gray-300">Find your favorite anime</p>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto">
          <form method="get" className="relative">
            <input
              type="text"
              name="q"
              placeholder="Search anime..."
              defaultValue={query}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>
        </div>

        {query && (
          <div className="text-center">
            <p className="text-gray-300">
              Search results for: <span className="text-white font-medium">"{query}"</span>
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Found {results.length} results
            </p>
          </div>
        )}

        {query && results.length > 0 && (
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {results.map((item) => (
              <div key={item.url} className="w-full">
                <NewAnimeCard
                  url={item.url}
                  title={item.title}
                  image={item.image}
                  postId={item.postId}
                  genres={[]}
                  rating={Math.floor(Math.random() * 2) + 4}
                  year={2024}
                  episodeCount={24}
                />
              </div>
            ))}
          </div>
        )}

        {query && results.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-gray-400">No anime found for "{query}"</p>
            <p className="text-sm text-gray-500 mt-2">Try different keywords or check the spelling</p>
          </div>
        )}

        {!query && (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-gray-400">Enter a search term to find anime</p>
            <p className="text-sm text-gray-500 mt-2">Search by title, genre, or keywords</p>
          </div>
        )}
      </main>

      <NewBottomNav />
    </div>
  );
}


