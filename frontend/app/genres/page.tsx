import NewNavbar from "@/components/NewNavbar";
import NewBottomNav from "@/components/NewBottomNav";

export default function GenresPage() {
  const genres = [
    { name: "Action", color: "from-red-500 to-orange-500", count: 150 },
    { name: "Adventure", color: "from-blue-500 to-cyan-500", count: 120 },
    { name: "Comedy", color: "from-yellow-500 to-orange-500", count: 200 },
    { name: "Drama", color: "from-purple-500 to-pink-500", count: 180 },
    { name: "Fantasy", color: "from-indigo-500 to-purple-500", count: 160 },
    { name: "Horror", color: "from-gray-700 to-red-900", count: 80 },
    { name: "Mystery", color: "from-gray-600 to-blue-900", count: 90 },
    { name: "Romance", color: "from-pink-500 to-red-500", count: 140 },
    { name: "Sci-Fi", color: "from-cyan-500 to-blue-600", count: 110 },
    { name: "Slice of Life", color: "from-green-500 to-teal-500", count: 130 },
    { name: "Sports", color: "from-green-600 to-emerald-600", count: 70 },
    { name: "Thriller", color: "from-red-600 to-purple-900", count: 100 },
  ];

  return (
    <div className="min-h-screen bg-black">
      <NewNavbar />
      
      <main className="mx-auto max-w-7xl px-4 md:px-6 py-6 space-y-6 pb-24">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-white">Browse by Genre</h1>
          <p className="text-lg text-gray-300">Discover anime by your favorite genres</p>
        </div>

        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {genres.map((genre) => (
            <a
              key={genre.name}
              href={`/genres/${genre.name.toLowerCase().replace(/\s+/g, '-')}`}
              className="group p-6 bg-gray-900 border border-gray-800 rounded-xl hover:border-purple-500/50 hover:bg-gray-800/50 transition-all duration-300 text-center"
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${genre.color} rounded-lg mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <span className="text-white font-bold text-xl">{genre.name.charAt(0)}</span>
              </div>
              <h3 className="text-white font-semibold text-sm group-hover:text-purple-300 transition-colors mb-2">
                {genre.name}
              </h3>
              <p className="text-gray-400 text-xs">
                {genre.count} titles
              </p>
            </a>
          ))}
        </div>

        <div className="text-center py-8">
          <p className="text-gray-400 text-sm">
            Can't find what you're looking for? Try our search feature!
          </p>
          <a
            href="/search"
            className="inline-block mt-4 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Search Anime
          </a>
        </div>
      </main>

      <NewBottomNav />
    </div>
  );
}
