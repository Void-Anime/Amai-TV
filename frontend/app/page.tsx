import { fetchAnimeList } from "@/server/scraper";
import NewNavbar from "@/components/NewNavbar";
import NewBottomNav from "@/components/NewBottomNav";
import NewHeroSlider from "@/components/NewHeroSlider";
import NewCarousel from "@/components/NewCarousel";
import NewAnimeCard from "@/components/NewAnimeCard";

export default async function HomePage() {
  // Fetch trending anime for hero slider
  const trendingData = await fetchAnimeList(1);
  const trendingAnime = trendingData.items?.slice(0, 5) || [];

  // Fetch latest episodes
  const latestData = await fetchAnimeList(2);
  const latestAnime = latestData.items?.slice(0, 10) || [];

  // Fetch popular anime
  const popularData = await fetchAnimeList(3);
  const popularAnime = popularData.items?.slice(0, 10) || [];

  // Prepare hero slider data
  const heroSlides = trendingAnime.map((anime) => ({
    title: anime.title,
    image: anime.image,
    url: anime.url,
    postId: anime.postId,
    genres: [], // Default empty array since SeriesListItem doesn't have genres
    tagline: `Experience the latest episodes of ${anime.title} on AMAI TV`,
    rating: Math.floor(Math.random() * 2) + 4, // Random rating for demo
    year: 2024,
  }));

  return (
    <div className="min-h-screen bg-black">
      <NewNavbar />
      
      <main className="space-y-8 pb-24">
        {/* Hero Slider */}
        <NewHeroSlider slides={heroSlides} />

        {/* Trending Now */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <NewCarousel title="Trending Now" subtitle="Most popular anime this week">
            {trendingAnime.map((anime, index) => (
              <div key={anime.url} className="flex-shrink-0 w-48">
                <NewAnimeCard
                  url={anime.url}
                  title={anime.title}
                  image={anime.image}
                  postId={anime.postId}
                  genres={[]} // Default empty array
                  rating={Math.floor(Math.random() * 2) + 4}
                  year={2024}
                  episodeCount={24}
                  isPopular={index < 3}
                />
              </div>
            ))}
          </NewCarousel>
        </section>

        {/* Latest Episodes */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <NewCarousel title="Latest Episodes" subtitle="New episodes added recently" showViewAll viewAllHref="/anime">
            {latestAnime.map((anime, index) => (
              <div key={anime.url} className="flex-shrink-0 w-48">
                <NewAnimeCard
                  url={anime.url}
                  title={anime.title}
                  image={anime.image}
                  postId={anime.postId}
                  genres={[]} // Default empty array
                  rating={Math.floor(Math.random() * 2) + 3}
                  year={2024}
                  episodeCount={12}
                  isNew={index < 5}
                />
              </div>
            ))}
          </NewCarousel>
        </section>

        {/* Popular Series */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <NewCarousel title="Popular Series" subtitle="Fan favorites and classics" showViewAll viewAllHref="/anime">
            {popularAnime.map((anime, index) => (
              <div key={anime.url} className="flex-shrink-0 w-48">
                <NewAnimeCard
                  url={anime.url}
                  title={anime.title}
                  image={anime.image}
                  postId={anime.postId}
                  genres={[]} // Default empty array
                  rating={Math.floor(Math.random() * 2) + 4}
                  year={2023}
                  episodeCount={24}
                  isPopular={true}
                />
              </div>
            ))}
          </NewCarousel>
        </section>

        {/* Continue Watching Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Continue Watching</h2>
                <p className="text-gray-400 text-sm mt-1">Pick up where you left off</p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {trendingAnime.slice(0, 6).map((anime, index) => (
                <div key={anime.url} className="w-full">
                  <NewAnimeCard
                    url={anime.url}
                    title={anime.title}
                    image={anime.image}
                    postId={anime.postId}
                    genres={[]} // Default empty array
                    rating={Math.floor(Math.random() * 2) + 4}
                    year={2024}
                    episodeCount={24}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Genres Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-white">Browse by Genre</h2>
              <p className="text-gray-400 text-sm mt-1">Discover anime by your favorite genres</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[
                "Action", "Adventure", "Comedy", "Drama", "Fantasy", "Horror",
                "Mystery", "Romance", "Sci-Fi", "Slice of Life", "Sports", "Thriller"
              ].map((genre) => (
                <a
                  key={genre}
                  href={`/genres/${genre.toLowerCase()}`}
                  className="group p-4 bg-gray-900 border border-gray-800 rounded-xl hover:border-purple-500/50 hover:bg-gray-800/50 transition-all duration-300 text-center"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg mx-auto mb-3 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white font-bold text-lg">{genre.charAt(0)}</span>
                  </div>
                  <span className="text-white font-medium text-sm group-hover:text-purple-300 transition-colors">
                    {genre}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>

      <NewBottomNav />
    </div>
  );
}


