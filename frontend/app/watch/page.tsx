import { fetchEpisodePlayers, fetchAnimeDetails, fetchAnimeList } from "@/server/scraper";
import NewNavbar from "@/components/NewNavbar";
import NewBottomNav from "@/components/NewBottomNav";
import DesktopNav from "@/components/DesktopNav";
import Image from "next/image";
import Player from "@/components/Player";
import Link from "next/link";
import SeasonSelector from "@/components/SeasonSelector";
import EpisodeCard from "@/components/EpisodeCard";
import { generateSlug } from "@/lib/utils";

type PlayerSourceItem = { src: string; kind: 'iframe' | 'video'; label?: string | null; quality?: string | null };

async function getData(episodeUrl: string) {
  return fetchEpisodePlayers(episodeUrl);
}

async function getAnimeDetails(seriesUrl: string, postId: number, season: number) {
  try {
    return await fetchAnimeDetails({ url: seriesUrl, postId, season });
  } catch (error) {
    console.error('Error fetching anime details:', error);
    return null;
  }
}

// Function to find anime by slug and return full URL
async function findAnimeBySlug(slug: string): Promise<{ url: string; postId?: number } | null> {
  try {
    // Search through multiple pages to find the anime
    for (let page = 1; page <= 3; page++) {
      const response = await fetchAnimeList(page);
      const anime = response.items.find(item => {
        if (!item.title) return false;
        const itemSlug = item.title.toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
          .replace(/\s+/g, '-') // Replace spaces with hyphens
          .replace(/-+/g, '-') // Replace multiple hyphens with single
          .trim();
        return itemSlug === slug.toLowerCase();
      });
      
      if (anime) {
        return { url: anime.url, postId: anime.postId };
      }
    }
    
    // If not found in series, try movies
    for (let page = 1; page <= 2; page++) {
      const response = await fetchAnimeList(page);
      const anime = response.items.find(item => {
        if (!item.title) return false;
        const itemSlug = item.title.toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim();
        return itemSlug === slug.toLowerCase();
      });
      
      if (anime) {
        return { url: anime.url, postId: anime.postId };
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error finding anime by slug:', error);
    return null;
  }
}

function parseSeasonFromEpisodeParam(raw: string): number | null {
  try {
    const decoded = decodeURIComponent(raw || '').trim();
    // From full URL
    if (/^https?:\/\//i.test(decoded) && decoded.includes('/episode/')) {
      const ep = decoded.split('/episode/')[1]?.split('/')[0] || '';
      const m = ep.match(/-(\d+)x(\d+)$/i);
      if (m && m[1]) return Number(m[1]);
    }
    // From bare identifier like yaiba-samurai-legend-11x4
    const m2 = decoded.match(/-(\d+)x(\d+)$/i);
    if (m2 && m2[1]) return Number(m2[1]);
  } catch {}
  return null;
}

export default async function WatchPage({ searchParams }: { searchParams: { episode?: string; url?: string; post_id?: string; season?: string; server?: string } }) {
  const episodeParam = searchParams?.episode || "";
  const seriesUrlParam = searchParams?.url || "";
  const postIdParam = Number(searchParams?.post_id || 0);
  const requestedSeason = Number(searchParams?.season || 0);
  const serverParam = searchParams?.server || "";
  
  if (!episodeParam) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-2xl font-bold mb-4">No episode selected</h1>
          <Link href="/" className="text-purple-400 hover:text-purple-300 transition-colors">
            Go back home
          </Link>
        </div>
      </div>
    );
  }

  // Determine full episode URL and series information
  let episodeUrl = episodeParam;
  let seriesUrl = seriesUrlParam;
  let resolvedPostId = postIdParam;
  let isMovie = false;

  // Check if this is a movie (URL contains /movies/ or the episode parameter is a movie URL)
  if (episodeParam.includes('/movies/') || (seriesUrlParam && seriesUrlParam.startsWith('/movies/'))) {
    isMovie = true;
  }
  
  // Additional movie detection for any movie-like content
  if (episodeParam.includes('movie') || episodeParam.includes('film') || episodeParam.includes('ova') || episodeParam.includes('special')) {
    isMovie = true;
  }

  // Derive season from episode slug if present (only for anime series, not movies)
  const seasonFromEpisode = isMovie ? null : parseSeasonFromEpisodeParam(episodeParam);
  const effectiveSeason = isMovie ? 1 : (requestedSeason > 0 ? requestedSeason : (seasonFromEpisode || 1));

  try {
    const decoded = decodeURIComponent(episodeParam).trim();
    // If the episode is a bare identifier like yaiba-samurai-legend-11x4, build full URL
    if (!/^https?:\/\//i.test(decoded)) {
      if (isMovie) {
        // For movies, the episode parameter is actually the movie URL
        episodeUrl = decoded;
      } else {
        episodeUrl = `https://animesalt.cc/episode/${decoded}/`;
        // If series URL isn't provided, infer series slug from the episode identifier
        if (!seriesUrl) {
          const seriesSlug = decoded.replace(/-\d+x\d+$/i, '');
          const info = await findAnimeBySlug(seriesSlug);
          if (info) {
            seriesUrl = info.url;
            if (!resolvedPostId && info.postId) resolvedPostId = info.postId;
          }
        }
      }
    }
  } catch {}

  // If the URL looks like a slug-based URL (starts with /title/ or /movies/), extract the slug
  if (seriesUrl && (seriesUrl.startsWith('/title/') || seriesUrl.startsWith('/movies/'))) {
    const slug = seriesUrl.replace('/title/', '').replace('/movies/', '').split('?')[0];
    const info = await findAnimeBySlug(slug);
    if (info) {
      seriesUrl = info.url;
      if (!resolvedPostId && info.postId) resolvedPostId = info.postId;
      // Update movie detection based on the resolved URL
      isMovie = /\/movies\//i.test(info.url);
    }
  }

  const sources = await getData(episodeUrl);
  const episodeTitle = isMovie ? 'Full Movie' : decodeURIComponent(episodeUrl.split('/').filter(Boolean).pop() || 'Episode');
  const seriesTitle = seriesUrl ? decodeURIComponent(seriesUrl.split('/').filter(Boolean).pop() || 'Series') : 'Unknown Series';

  // For movies, we don't need to fetch anime details with seasons/episodes
  let animeDetails = null;
  let episodes: any[] = [];
  let seasons: any[] = [];
  
  if (!isMovie) {
    // Fetch anime details for episodes and seasons (use effectiveSeason)
    animeDetails = seriesUrl ? await getAnimeDetails(seriesUrl, resolvedPostId, effectiveSeason) : null;
    episodes = animeDetails?.episodes || [];
    seasons = animeDetails?.seasons || [];
  }

  // Find current episode index and next episode (only for anime series)
  let currentEpisodeIndex = -1;
  let currentEpisode = null;
  let nextEpisode = null;
  
  if (!isMovie) {
    currentEpisodeIndex = episodes.findIndex(ep => ep.url === episodeUrl);
    currentEpisode = currentEpisodeIndex >= 0 ? episodes[currentEpisodeIndex] : null;
    nextEpisode = currentEpisodeIndex >= 0 && currentEpisodeIndex < episodes.length - 1 ? episodes[currentEpisodeIndex + 1] : null;
  }

  // Debug information (remove in production)
  console.log('Content Details:', {
    isMovie,
    episodeUrl,
    seriesUrl,
    resolvedPostId,
    requestedSeason,
    seasonFromEpisode,
    effectiveSeason,
    episodesCount: episodes.length,
    seasonsCount: seasons.length,
    currentEpisodeIndex,
    currentEpisode,
    nextEpisode,
    poster: animeDetails?.poster
  });

  return (
    <div className="min-h-screen bg-black">
      <NewNavbar />
      
      <main className="mx-auto max-w-6xl px-4 md:px-6 py-6 space-y-6 pb-24">
        {/* Episode/Movie Info */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-white">{seriesTitle}</h1>
          <p className="text-lg text-gray-300">
            {isMovie ? 'Full Movie' : (currentEpisode?.title || episodeTitle)}
            {!isMovie && currentEpisode?.number && ` - Episode ${currentEpisode.number}`}
          </p>
        </div>

        {/* Video Player with server selection */}
        <Player sources={sources as any} />

        {/* Extra controls (optional) removed; server selection now inside Player */}

        {/* Next Episode Card - Only show for anime series */}
        {!isMovie && nextEpisode && (
          <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-xl p-6 border border-purple-500/30 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-4">
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-800">
                  {nextEpisode.poster || animeDetails?.poster ? (
                    <Image 
                      src={nextEpisode.poster || animeDetails?.poster || ''} 
                      alt={nextEpisode.title || 'Next Episode'} 
                      width={80} 
                      height={80} 
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                      No Image
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Next Episode</h3>
                  <p className="text-gray-300">
                    {nextEpisode.title || `Episode ${nextEpisode.number || 'Unknown'}`}
                  </p>
                  <p className="text-sm text-gray-400">
                    {nextEpisode.number && `Episode ${nextEpisode.number}`}
                  </p>
                </div>
              </div>
              <Link
                href={`/watch?episode=${encodeURIComponent(nextEpisode.url)}&url=${encodeURIComponent(seriesUrl)}&season=${effectiveSeason}`}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Next Episode
              </Link>
            </div>
          </div>
        )}

        {/* Episodes List - Only show for anime series */}
        {!isMovie && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Episodes</h2>
              {seriesUrl && seasons.length > 0 && (
                <SeasonSelector 
                  seasons={seasons} 
                  selected={effectiveSeason} 
                  seriesUrl={seriesUrl} 
                  postId={resolvedPostId} 
                />
              )}
            </div>
            
            {episodes.length > 0 ? (
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {episodes.map((episode, index) => {
                  const isCurrentEpisode = episode.url === episodeUrl;
                  return (
                    <EpisodeCard
                      key={episode.url}
                      url={episode.url}
                      title={episode.title || `Episode ${episode.number || index + 1}`}
                      number={episode.number || String(index + 1)}
                      poster={episode.poster || animeDetails?.poster || null}
                      seriesUrl={seriesUrl}
                      postId={resolvedPostId}
                      season={effectiveSeason}
                      progress={index % 3 === 0 ? 0.42 : 0}
                      completed={index % 7 === 0}
                      isCurrentEpisode={isCurrentEpisode}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-500 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <p className="text-gray-400">No episodes available for this season</p>
                <p className="text-sm text-gray-500 mt-2">Please try a different season</p>
              </div>
            )}
          </div>
        )}

        {/* Additional Info - Show different content for movies vs episodes */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h3 className="text-xl font-bold text-white mb-4">
            {isMovie ? 'Movie Information' : 'Episode Information'}
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="text-lg font-semibold text-gray-200 mb-2">
                {isMovie ? 'About this Movie' : 'About this Episode'}
              </h4>
              <p className="text-gray-300 text-sm leading-relaxed">
                {isMovie 
                  ? "This movie features stunning animation, compelling storytelling, and unforgettable characters. Experience the complete story in one epic viewing session."
                  : (currentEpisode?.title || "This episode continues the story with amazing animation and engaging plot development.") + " Watch as the characters face new challenges and discover hidden truths."
                }
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-200 mb-2">
                {isMovie ? 'Movie Details' : 'Episode Details'}
              </h4>
              <div className="space-y-2 text-sm text-gray-300">
                {!isMovie && (
                  <div className="flex justify-between">
                    <span>Episode:</span>
                    <span className="text-white">
                      {currentEpisode?.number || 'Unknown'}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span className="text-white">
                    {isMovie ? 'Full Movie' : '24 minutes'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Quality:</span>
                  <span className="text-white">HD</span>
                </div>
                <div className="flex justify-between">
                  <span>Language:</span>
                  <span className="text-white">Japanese</span>
                </div>
                <div className="flex justify-between">
                  <span>Subtitles:</span>
                  <span className="text-white">English</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <NewBottomNav />
      <DesktopNav />
    </div>
  );
}


