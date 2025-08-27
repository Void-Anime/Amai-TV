import { fetchNetworkContent } from "@/server/scraper";
import NewNavbar from "@/components/NewNavbar";
import NewBottomNav from "@/components/NewBottomNav";
import DesktopNav from "@/components/DesktopNav";
import AnimeGridCard from "@/components/AnimeGridCard";
import { notFound } from "next/navigation";

interface NetworkPageProps {
  params: { slug: string };
  searchParams: { page?: string; q?: string };
}

const networkInfo = {
  "crunchyroll": {
    name: "Crunchyroll",
    image: "https://animesalt.cc/wp-content/uploads/crunchyroll-193x193.png",
    description: "Premium anime streaming platform",
    color: "from-orange-500 to-red-600"
  },
  "disney": {
    name: "Disney+ Hotstar",
    image: "https://animesalt.cc/wp-content/uploads/hotstar-193x193.png",
    description: "Disney, Marvel, and Star content",
    color: "from-blue-600 to-purple-700"
  },
  "netflix": {
    name: "Netflix",
    image: "https://animesalt.cc/wp-content/uploads/netflix-193x193.png",
    description: "Global streaming entertainment",
    color: "from-red-600 to-red-800"
  },
  "prime-video": {
    name: "Prime Video",
    image: "https://animesalt.cc/wp-content/uploads/primevideo-193x193.png",
    description: "Amazon's streaming service",
    color: "from-blue-500 to-blue-700"
  },
  "cartoon-network": {
    name: "Cartoon Network",
    image: "https://animesalt.cc/wp-content/uploads/cartoonnetwork-193x193.png",
    description: "Kids and family entertainment",
    color: "from-green-500 to-blue-600"
  },
  "sony-yay": {
    name: "Sony Yay",
    image: "https://animesalt.cc/wp-content/uploads/sonyay-193x193.png",
    description: "Sony's kids entertainment channel",
    color: "from-yellow-500 to-orange-500"
  },
  "hungama-tv": {
    name: "Hungama TV",
    image: "https://animesalt.cc/wp-content/uploads/hungama-193x193.png",
    description: "Indian kids entertainment",
    color: "from-purple-500 to-pink-600"
  },
  "disney-channel": {
    name: "Disney Channel",
    image: "https://animesalt.cc/wp-content/uploads/disney-193x193.png",
    description: "Classic Disney channel content",
    color: "from-blue-400 to-purple-500"
  }
};

export default async function NetworkPage({ params, searchParams }: NetworkPageProps) {
  const { slug } = params;
  const page = Number(searchParams?.page || 1);
  const query = searchParams?.q || "";
  
  // Check if network exists
  if (!networkInfo[slug as keyof typeof networkInfo]) {
    notFound();
  }
  
  const network = networkInfo[slug as keyof typeof networkInfo];
  
  let data;
  let error = null;
  
  try {
    data = await fetchNetworkContent(slug, page, query);
    console.log(`${network.name} data:`, data); // Debug log
  } catch (err) {
    console.error(`Error fetching ${network.name} content:`, err);
    error = err instanceof Error ? err.message : 'Unknown error occurred';
  }
  
  const items = data?.items || [];

  // If there's an error, show it but don't crash the page
  if (error) {
    return (
      <div className="min-h-screen bg-black">
        <NewNavbar />
        <main className="mx-auto max-w-7xl px-4 md:px-6 py-6 space-y-6 pb-24">
          <div className="text-center space-y-4">
            <div className={`w-24 h-24 bg-gradient-to-br ${network.color} rounded-lg mx-auto mb-4 flex items-center justify-center`}>
              <img 
                src={network.image} 
                alt={network.name}
                className="w-16 h-16 object-contain"
              />
            </div>
            <h1 className="text-4xl font-bold text-white">{network.name}</h1>
            <p className="text-lg text-gray-300">{network.description}</p>
          </div>
          
          <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-6 text-center">
            <h3 className="text-xl font-bold text-red-400 mb-2">Error Loading Content</h3>
            <p className="text-red-300 mb-4">{error}</p>
            <p className="text-sm text-gray-400">Please try refreshing the page or check back later.</p>
          </div>
        </main>
        <NewBottomNav />
        <DesktopNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <NewNavbar />
      
      <main className="mx-auto max-w-7xl px-4 md:px-6 py-6 space-y-6 pb-24">
        <div className="text-center space-y-4">
          <div className={`w-24 h-24 bg-gradient-to-br ${network.color} rounded-lg mx-auto mb-4 flex items-center justify-center`}>
            <img 
              src={network.image} 
              alt={network.name}
              className="w-16 h-16 object-contain"
            />
          </div>
          <h1 className="text-4xl font-bold text-white">{network.name}</h1>
          <p className="text-lg text-gray-300">{network.description}</p>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto">
          <form method="get" className="relative">
            <input
              type="text"
              name="q"
              placeholder={`Search ${network.name} content...`}
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
          </div>
        )}

        {/* Debug Info */}
        <div className="text-center text-sm text-gray-500">
          <p>Page: {page} | Items found: {items.length}</p>
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

        {items.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M6 4h12M6 20h12M6 12h12M6 16h12" />
              </svg>
            </div>
            <p className="text-gray-400">
              {query ? `No ${network.name} content found for your search.` : `No ${network.name} content available at the moment.`}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              This might be due to a temporary issue. Please try again later.
            </p>
          </div>
        )}

        {/* Pagination */}
        {items.length > 0 && (
          <div className="flex justify-center items-center space-x-2">
            {page > 1 && (
              <a
                href={`/networks/${slug}?page=${page - 1}${query ? `&q=${encodeURIComponent(query)}` : ''}`}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Previous
              </a>
            )}
            <span className="px-4 py-2 text-gray-300">Page {page}</span>
            <a
              href={`/networks/${slug}?page=${page + 1}${query ? `&q=${encodeURIComponent(query)}` : ''}`}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Next
            </a>
          </div>
        )}
      </main>

      <NewBottomNav />
      <DesktopNav />
    </div>
  );
}
