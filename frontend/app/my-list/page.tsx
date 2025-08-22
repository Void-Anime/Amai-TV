import NewNavbar from "@/components/NewNavbar";
import NewBottomNav from "@/components/NewBottomNav";
import NewAnimeCard from "@/components/NewAnimeCard";

export default function MyListPage() {
  // This would typically fetch from localStorage or a backend
  const myList: any[] = []; // Empty for now

  return (
    <div className="min-h-screen bg-black">
      <NewNavbar />
      
      <main className="mx-auto max-w-7xl px-4 md:px-6 py-6 space-y-6 pb-24">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-white">My List</h1>
          <p className="text-lg text-gray-300">Your saved anime and watchlist</p>
        </div>

        {myList.length > 0 ? (
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {myList.map((item) => (
              <div key={item.url} className="w-full">
                <NewAnimeCard
                  url={item.url}
                  title={item.title}
                  image={item.image}
                  postId={item.postId}
                  genres={item.genres || []}
                  rating={item.rating}
                  year={item.year}
                  episodeCount={item.episodeCount}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <p className="text-gray-400">Your list is empty</p>
            <p className="text-sm text-gray-500 mt-2">Start adding anime to your watchlist</p>
            <a
              href="/"
              className="inline-block mt-4 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Browse Anime
            </a>
          </div>
        )}
      </main>

      <NewBottomNav />
    </div>
  );
}
