import { fetchMovieDetails, fetchAnimeList } from "@/server/scraper";
import NewNavbar from "@/components/NewNavbar";
import NewBottomNav from "@/components/NewBottomNav";
import Image from "next/image";
import { notFound } from "next/navigation";
import { generateSlug } from "@/lib/utils";

// Function to find movie by slug (searches fetchAnimeList)
async function findMovieBySlug(slug: string): Promise<{ url: string; postId?: number } | null> {
  try {
    console.log(`Searching for movie with slug: ${slug}`);
    
    // Debug: Dump first few pages to see what's available
    console.log('=== DEBUG: Available items on first 3 pages ===');
    for (let page = 1; page <= 3; page++) {
      try {
        const allData = await fetchAnimeList(page);
        console.log(`Page ${page}:`);
        allData.items.slice(0, 5).forEach((item, idx) => {
          const title = item.title || decodeURIComponent(item.url.split('/').filter(Boolean).pop() || '');
          const itemSlug = generateSlug(title);
          console.log(`  ${idx + 1}. "${title}" -> slug: "${itemSlug}" (URL: ${item.url})`);
        });
        
        // Look specifically for Doraemon items
        const doraemonItems = allData.items.filter(item => {
          const title = item.title || decodeURIComponent(item.url.split('/').filter(Boolean).pop() || '');
          return title.toLowerCase().includes('doraemon');
        });
        if (doraemonItems.length > 0) {
          console.log(`Found ${doraemonItems.length} Doraemon items on page ${page}:`);
          doraemonItems.forEach((item, idx) => {
            const title = item.title || decodeURIComponent(item.url.split('/').filter(Boolean).pop() || '');
            const itemSlug = generateSlug(title);
            console.log(`  Doraemon ${idx + 1}: "${title}" -> slug: "${itemSlug}" (URL: ${item.url})`);
          });
        }
      } catch (err) {
        console.log(`Error fetching page ${page}:`, err);
      }
    }
    console.log('=== END DEBUG ===');
    
    // Search through multiple pages to find the movie
    for (let page = 1; page <= 5; page++) {
      console.log(`Searching page ${page} for movie: ${slug}`);
      const allData = await fetchAnimeList(page);
      
      // Search through ALL items, not just those with /movies/ in URL
      // Use comprehensive movie detection based on title content
      const allItems = allData.items;
      console.log(`Page ${page} has ${allItems.length} total items`);
      
      for (const item of allItems) {
        const title = item.title || decodeURIComponent(item.url.split('/').filter(Boolean).pop() || '');
        const itemSlug = generateSlug(title);
        
        console.log(`Checking item: "${title}" -> slug: "${itemSlug}" vs target: "${slug}"`);
        
        if (itemSlug === slug) {
          // Check if this item is actually a movie based on content
          const isMovieByUrl = /\/movies\//i.test(item.url);
          const isMovieByTitle = /movie|film|ova|special|theatrical|cinema|journey|adventure|quest|tale|story|record|parallel|west|east|north|south|expedition|mission|chronicles|saga|legend|myth|epic|doraemon/i.test(title);
          const isMovie = isMovieByUrl || isMovieByTitle;
          
          console.log(`Found matching item: "${title}" at ${item.url}`);
          console.log(`isMovieByUrl: ${isMovieByUrl}, isMovieByTitle: ${isMovieByTitle}, isMovie: ${isMovie}`);
          console.log(`Title contains movie keywords: ${/movie|film|ova|special|theatrical|cinema|journey|adventure|quest|tale|story|record|parallel|west|east|north|south|expedition|mission|chronicles|saga|legend|myth|epic|doraemon/i.test(title)}`);
          
          if (isMovie) {
            console.log(`Confirmed movie: ${title} at ${item.url}`);
            return { url: item.url, postId: item.postId };
          } else {
            console.log(`Item found but not a movie: ${title}`);
            // For debugging: let's see what keywords are missing
            const keywords = ['movie', 'film', 'ova', 'special', 'theatrical', 'cinema', 'journey', 'adventure', 'quest', 'tale', 'story', 'record', 'parallel', 'west', 'east', 'north', 'south', 'expedition', 'mission', 'chronicles', 'saga', 'legend', 'myth', 'epic', 'doraemon'];
            const foundKeywords = keywords.filter(keyword => title.toLowerCase().includes(keyword));
            console.log(`Found keywords in title: ${foundKeywords.join(', ')}`);
          }
        }
      }
    }
    
    // Fallback: Try to find by partial title match
    console.log(`Exact slug match failed, trying partial title match for: ${slug}`);
    const searchTerms = slug.split('-').filter(term => term.length > 2); // Get meaningful search terms
    
    for (let page = 1; page <= 3; page++) {
      const allData = await fetchAnimeList(page);
      
      for (const item of allData.items) {
        const title = item.title || decodeURIComponent(item.url.split('/').filter(Boolean).pop() || '');
        const titleLower = title.toLowerCase();
        
        // Check if search terms appear in the title
        const matches = searchTerms.filter(term => titleLower.includes(term));
        if (matches.length >= 2) { // At least 2 terms should match
          const isMovieByUrl = /\/movies\//i.test(item.url);
          const isMovieByTitle = /movie|film|ova|special|theatrical|cinema|journey|adventure|quest|tale|story|record|parallel|west|east|north|south|expedition|mission|chronicles|saga|legend|myth|epic/i.test(title);
          const isMovie = isMovieByUrl || isMovieByTitle;
          
          console.log(`Partial match found: "${title}" with terms: ${matches.join(', ')}`);
          console.log(`isMovie: ${isMovie}`);
          
          if (isMovie) {
            console.log(`Confirmed movie by partial match: ${title} at ${item.url}`);
            return { url: item.url, postId: item.postId };
          }
        }
      }
    }
    
    console.log(`Movie with slug "${slug}" not found after searching 5 pages and partial matching`);
    return null;
  } catch (error) {
    console.error('Error finding movie by slug:', error);
    return null;
  }
}

async function getData(slug: string) {
  const movieInfo = await findMovieBySlug(slug);
  if (!movieInfo) {
    return null;
  }
  return fetchMovieDetails(movieInfo.url);
}

export default async function MovieDetailsPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  console.log(`MovieDetailsPage received slug: ${slug}`);
  
  const data = await getData(slug);
  console.log(`getData result:`, data);

  if (!data) {
    console.log(`No data found for slug: ${slug}, showing notFound()`);
    notFound();
  }

  const title = decodeURIComponent(data.url.split('/').filter(Boolean).pop() || slug);
  console.log(`Extracted title: ${title}`);

  return (
    <div className="min-h-screen bg-black">
      <NewNavbar />
      
      <main className="mx-auto max-w-7xl px-4 md:px-6 py-6 space-y-6 pb-24">
        {/* Hero Section */}
        <div className="relative rounded-2xl overflow-hidden">
          {data.poster && (
            <div className="absolute inset-0">
              <Image
                unoptimized
                src={data.poster.startsWith('data:') ? data.poster : `/api/image?src=${encodeURIComponent(data.poster)}`}
                alt={title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
            </div>
          )}
          
          <div className="relative z-10 p-8 md:p-12 flex flex-col justify-end min-h-[400px] md:min-h-[500px]">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
              
              {/* Metadata */}
              <div className="flex flex-wrap gap-3 mb-6">
                {data.year && (
                  <span className="px-3 py-1 bg-purple-600/20 border border-purple-500/30 rounded-full text-purple-300 text-sm">
                    {data.year}
                  </span>
                )}
                {data.genres && data.genres.length > 0 && (
                  data.genres.map((genre, index) => (
                    <span key={index} className="px-3 py-1 bg-gray-800/50 border border-gray-600/30 rounded-full text-gray-300 text-sm">
                      {genre}
                    </span>
                  ))
                )}
                {data.duration && (
                  <span className="px-3 py-1 bg-amber-600/20 border border-amber-500/30 rounded-full text-amber-300 text-sm">
                    {data.duration}
                  </span>
                )}
                {data.languages && data.languages.length > 0 && (
                  <span className="px-3 py-1 bg-blue-600/20 border border-blue-500/30 rounded-full text-blue-300 text-sm">
                    {data.languages.join(', ')}
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                <a
                  href={`/watch?episode=${encodeURIComponent(data.url)}&url=${encodeURIComponent(`/movies/${slug}`)}`}
                  className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Watch Movie
                </a>
                <button className="px-8 py-3 border border-gray-600 hover:border-gray-500 text-white font-semibold rounded-lg transition-colors">
                  Add to Watchlist
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Poster */}
          <div className="lg:col-span-1">
            {data.poster && (
              <div className="sticky top-6">
                <div className="rounded-xl overflow-hidden shadow-2xl">
                  <Image
                    unoptimized
                    src={data.poster.startsWith('data:') ? data.poster : `/api/image?src=${encodeURIComponent(data.poster)}`}
                    alt={title}
                    width={400}
                    height={600}
                    className="w-full h-auto"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Synopsis */}
            {data.synopsis && (
              <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
                <h2 className="text-2xl font-bold text-white mb-4">Synopsis</h2>
                <p className="text-gray-300 leading-relaxed">{data.synopsis}</p>
              </div>
            )}

            {/* Additional Info */}
            <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
              <h2 className="text-2xl font-bold text-white mb-4">Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.status && (
                  <div>
                    <span className="text-gray-400">Status:</span>
                    <span className="text-white ml-2">{data.status}</span>
                  </div>
                )}
                {data.totalEpisodes && (
                  <div>
                    <span className="text-gray-400">Type:</span>
                    <span className="text-white ml-2">Movie</span>
                  </div>
                )}
              </div>
            </div>

            {/* Watch Section */}
            <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
              <h2 className="text-2xl font-bold text-white mb-4">Watch</h2>
              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white">Full Movie</h3>
                    <p className="text-gray-400 text-sm">Complete movie available for streaming</p>
                  </div>
                  <a
                    href={`/watch?episode=${encodeURIComponent(data.url)}&url=${encodeURIComponent(`/movies/${slug}`)}`}
                    className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
                  >
                    Play
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <NewBottomNav />
    </div>
  );
}
