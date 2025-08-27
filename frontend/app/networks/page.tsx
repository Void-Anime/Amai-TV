import NewNavbar from "@/components/NewNavbar";
import NewBottomNav from "@/components/NewBottomNav";
import DesktopNav from "@/components/DesktopNav";
import Link from "next/link";

export default function NetworksPage() {
  const networks = [
    {
      name: "Crunchyroll",
      slug: "crunchyroll",
      image: "https://animesalt.cc/wp-content/uploads/crunchyroll-193x193.png",
      description: "Premium anime streaming platform",
      color: "from-orange-500 to-red-600"
    },
    {
      name: "Disney+ Hotstar",
      slug: "disney",
      image: "https://animesalt.cc/wp-content/uploads/hotstar-193x193.png",
      description: "Disney, Marvel, and Star content",
      color: "from-blue-600 to-purple-700"
    },
    {
      name: "Netflix",
      slug: "netflix",
      image: "https://animesalt.cc/wp-content/uploads/netflix-193x193.png",
      description: "Global streaming entertainment",
      color: "from-red-600 to-red-800"
    },
    {
      name: "Prime Video",
      slug: "prime-video",
      image: "https://animesalt.cc/wp-content/uploads/primevideo-193x193.png",
      description: "Amazon's streaming service",
      color: "from-blue-500 to-blue-700"
    },
    {
      name: "Cartoon Network",
      slug: "cartoon-network",
      image: "https://animesalt.cc/wp-content/uploads/cartoonnetwork-193x193.png",
      description: "Kids and family entertainment",
      color: "from-green-500 to-blue-600"
    },
    {
      name: "Sony Yay",
      slug: "sony-yay",
      image: "https://animesalt.cc/wp-content/uploads/sonyay-193x193.png",
      description: "Sony's kids entertainment channel",
      color: "from-yellow-500 to-orange-500"
    },
    {
      name: "Hungama TV",
      slug: "hungama-tv",
      image: "https://animesalt.cc/wp-content/uploads/hungama-193x193.png",
      description: "Indian kids entertainment",
      color: "from-purple-500 to-pink-600"
    },
    {
      name: "Disney Channel",
      slug: "disney-channel",
      image: "https://animesalt.cc/wp-content/uploads/disney-193x193.png",
      description: "Classic Disney channel content",
      color: "from-blue-400 to-purple-500"
    }
  ];

  return (
    <div className="min-h-screen bg-black">
      <NewNavbar />
      
      <main className="mx-auto max-w-7xl px-4 md:px-6 py-6 space-y-6 pb-24">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-white">Networks</h1>
          <p className="text-lg text-gray-300">Browse content by streaming platform</p>
        </div>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {networks.map((network) => (
            <Link
              key={network.slug}
              href={`/networks/${network.slug}`}
              className="group block"
            >
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-purple-500/50 hover:bg-gray-800/50 transition-all duration-300 text-center">
                <div className={`w-20 h-20 bg-gradient-to-br ${network.color} rounded-lg mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <img 
                    src={network.image} 
                    alt={network.name}
                    className="w-12 h-12 object-contain"
                  />
                </div>
                <h3 className="text-white font-semibold text-lg group-hover:text-purple-300 transition-colors mb-2">
                  {network.name}
                </h3>
                <p className="text-gray-400 text-sm">
                  {network.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <NewBottomNav />
      <DesktopNav />
    </div>
  );
}
