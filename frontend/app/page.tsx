import { fetchAnimeList } from "@/server/scraper";
import NewNavbar from "@/components/NewNavbar";
import NewBottomNav from "@/components/NewBottomNav";
import DesktopNav from "@/components/DesktopNav";
import NewCarousel from "@/components/NewCarousel";
import NewAnimeCard from "@/components/NewAnimeCard";
import OngoingSeriesGrid from "@/components/OngoingSeriesGrid";
import UpcomingEpisodesGrid from "@/components/UpcomingEpisodesGrid";

export default async function HomePage() {
  // Fetch trending anime
  const trendingData = await fetchAnimeList(1);
  const trendingAnime = trendingData.items?.slice(0, 5) || [];

  // Fetch latest episodes
  const latestData = await fetchAnimeList(2);
  const latestAnime = latestData.items?.slice(0, 10) || [];

  // Fetch popular anime
  const popularData = await fetchAnimeList(3);
  const popularAnime = popularData.items?.slice(0, 10) || [];

  // Franchise logos (used in carousel)
  const franchises = [
    { name: 'Iron Man', img: 'https://www.rareanimes.co/wp-content/uploads/2021/08/Ironman.png' },
    { name: 'Slugterra', img: 'https://www.rareanimes.co/wp-content/uploads/2021/08/Slugterra.png' },
    { name: 'Miraculous', img: 'https://www.rareanimes.co/wp-content/uploads/2021/08/Miraclous.png' },
    { name: 'Transformers', img: 'https://www.rareanimes.co/wp-content/uploads/2025/04/Transformers.png' },
    { name: 'Naruto', img: 'https://www.rareanimes.co/wp-content/uploads/2025/04/Naruto.png' },
    { name: 'Spider Man', img: 'https://www.rareanimes.co/wp-content/uploads/2021/08/Spiderman.png' },
    { name: 'Pokemon', img: 'https://www.rareanimes.co/wp-content/uploads/2021/08/Pokemon.png' },
    { name: 'Shin Chan', img: 'https://www.rareanimes.co/wp-content/uploads/2021/08/Shinchan.png' },
    { name: 'Doraemon', img: 'https://www.rareanimes.co/wp-content/uploads/2021/08/Doraemon.png' },
    { name: 'Beyblade', img: 'https://www.rareanimes.co/wp-content/uploads/2021/08/Beyblade.png' },
    { name: 'Ben 10', img: 'https://www.rareanimes.co/wp-content/uploads/2021/08/Ben-10.png' },
    { name: 'Dragon Ball', img: 'https://www.rareanimes.co/wp-content/uploads/2021/08/Dragonball.png' },
  ];

  return (
    <div className="min-h-screen bg-black">
      <NewNavbar />
      
      <main className="space-y-8 pb-24">
        {/* Franchises (replaces Hero Slider) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          {/* Franchise Logos Slider (loop feel, larger size, no background) */}
          <div className="mt-2">
            <NewCarousel title="Franchises" subtitle="Tap a logo to search" autoplay loop autoplayIntervalMs={2200}>
              {[...franchises, ...franchises].map(({ name, img }, idx) => (
                <a
                  key={`${name}-${idx}`}
                  href={`/search?q=${encodeURIComponent(name)}`}
                  className="group flex-shrink-0 basis-1/3 sm:basis-1/3 md:basis-1/3 lg:basis-1/5 xl:basis-1/6"
                  title={`Search ${name}`}
                >
                  <img
                    src={`/api/image?src=${encodeURIComponent(img)}`}
                    alt={name}
                    className="h-40 sm:h-48 md:h-60 lg:h-72 w-full object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="mt-2 text-center text-xs text-gray-300 group-hover:text-white transition-colors">{name}</div>
                </a>
              ))}
            </NewCarousel>
          </div>
        </section>

        {/* Networks Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Networks</h2>
            <p className="text-gray-400">Watch content from your favorite streaming platforms</p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-8 gap-6 justify-items-center">
            {/* Crunchyroll */}
            <a href="/networks/crunchyroll" className="group">
              <img 
                src={`/api/image?src=${encodeURIComponent('https://animesalt.cc/wp-content/uploads/crunchyroll-193x193.png')}`} 
                alt="Crunchyroll" 
                title="Crunchyroll"
                className="h-24 w-auto object-contain transition-transform duration-300 group-hover:scale-110"
              />
            </a>

            {/* Disney+ Hotstar */}
            <a href="/networks/disney" className="group">
              <img 
                src={`/api/image?src=${encodeURIComponent('https://animesalt.cc/wp-content/uploads/hotstar-193x193.png')}`} 
                alt="Disney+ Hotstar" 
                title="Disney+ Hotstar"
                className="h-24 w-auto object-contain transition-transform duration-300 group-hover:scale-110"
              />
            </a>

            {/* Netflix */}
            <a href="/networks/netflix" className="group">
              <img 
                src={`/api/image?src=${encodeURIComponent('https://animesalt.cc/wp-content/uploads/netflix-193x193.png')}`} 
                alt="Netflix" 
                title="Netflix"
                className="h-24 w-auto object-contain transition-transform duration-300 group-hover:scale-110"
              />
            </a>

            {/* Prime Video */}
            <a href="/networks/prime-video" className="group">
              <img 
                src={`/api/image?src=${encodeURIComponent('https://animesalt.cc/wp-content/uploads/primevideo-193x193.png')}`} 
                alt="Prime Video" 
                title="Prime Video"
                className="h-24 w-auto object-contain transition-transform duration-300 group-hover:scale-110"
              />
            </a>

            {/* Cartoon Network */}
            <a href="/networks/cartoon-network" className="group">
              <img 
                src={`/api/image?src=${encodeURIComponent('https://animesalt.cc/wp-content/uploads/cartoonnetwork-193x193.png')}`} 
                alt="Cartoon Network" 
                title="Cartoon Network"
                className="h-24 w-auto object-contain transition-transform duration-300 group-hover:scale-110"
              />
            </a>

            {/* Sony Yay */}
            <a href="/networks/sony-yay" className="group">
              <img 
                src={`/api/image?src=${encodeURIComponent('https://animesalt.cc/wp-content/uploads/sonyay-193x193.png')}`} 
                alt="Sony Yay" 
                title="Sony Yay"
                className="h-24 w-auto object-contain transition-transform duration-300 group-hover:scale-110"
              />
            </a>

            {/* Hungama TV */}
            <a href="/networks/hungama-tv" className="group">
              <img 
                src={`/api/image?src=${encodeURIComponent('https://animesalt.cc/wp-content/uploads/hungama-193x193.png')}`} 
                alt="Hungama TV" 
                title="Hungama TV"
                className="h-24 w-auto object-contain transition-transform duration-300 group-hover:scale-110"
              />
            </a>

            {/* Disney Channel */}
            <a href="/networks/disney-channel" className="group">
              <img 
                src={`/api/image?src=${encodeURIComponent('https://animesalt.cc/wp-content/uploads/disney-193x193.png')}`} 
                alt="Disney Channel" 
                title="Disney Channel"
                className="h-24 w-auto object-contain transition-transform duration-300 group-hover:scale-110"
              />
            </a>
          </div>
        </section>

        {/* Ongoing Series Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Ongoing Series</h2>
            <p className="text-gray-400">Currently airing anime series and ongoing shows</p>
          </div>
          
          <OngoingSeriesGrid />
        </section>

        {/* Upcoming Episodes Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Upcoming Episodes</h2>
            <p className="text-gray-400">New episodes coming soon with countdown timers</p>
          </div>
          
          <UpcomingEpisodesGrid />
        </section>

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
      <DesktopNav />
    </div>
  );
}


