import { fetchAnimeDetails, fetchAnimeList } from "@/server/scraper";
import NewNavbar from "@/components/NewNavbar";
import NewBottomNav from "@/components/NewBottomNav";
import DesktopNav from "@/components/DesktopNav";
import Image from "next/image";
import SeasonSelector from "@/components/SeasonSelector";
import EpisodeCard from "@/components/EpisodeCard";
import EpisodesList from "@/components/EpisodesList";
import DetailsHeader from "@/components/DetailsHeader";
import ReadMore from "@/components/ReadMore";
import Tabs, { TabPanel } from "@/components/Tabs";
import RelatedSeriesCard from "@/components/RelatedSeriesCard";
import { notFound, redirect } from "next/navigation";
import { generateSlug } from "@/lib/utils";

type EpisodeItem = { number?: string | null; title?: string | null; url: string };
type SeasonItem = { season: number | string; label: string; nonRegional: boolean };
type AnimeDetailsResponse = {
  url: string;
  postId: number;
  season?: number | null;
  seasons: SeasonItem[];
  episodes: (EpisodeItem & { poster?: string | null })[];
  poster?: string | null;
  genres?: string[];
  year?: number | null;
  totalEpisodes?: number | null;
  duration?: string | null;
  languages?: string[];
  studio?: string | null;
  status?: string | null;
  rating?: number | null;
  related?: { url: string; title?: string | null; poster?: string | null; genres?: string[]; postId?: number }[];
  reviews?: { user?: string; stars?: number; comment?: string }[];
  smartButtons?: { url: string; actionText: string; episodeText: string; buttonClass: string }[];
};

// Function to find anime by slug
async function findAnimeBySlug(slug: string): Promise<{ url: string; postId?: number; isMovie: boolean } | null> {
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
        // Check if this is a movie
        const isMovieByUrl = /\/movies\//i.test(anime.url);
        const isMovieByTitle = /movie|film|ova|special|theatrical|cinema|journey|adventure|quest|tale|story|record|parallel|west|east|north|south|expedition|mission|chronicles|saga|legend|myth|epic/i.test(anime.title || '');
        const isMovie = isMovieByUrl || isMovieByTitle;
        
        return { url: anime.url, postId: anime.postId, isMovie };
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
        // Check if this is a movie
        const isMovieByUrl = /\/movies\//i.test(anime.url);
        const isMovieByTitle = /movie|film|ova|special|theatrical|cinema|journey|adventure|quest|tale|story|record|parallel|west|east|north|south|expedition|mission|chronicles|saga|legend|myth|epic/i.test(anime.title || '');
        const isMovie = isMovieByUrl || isMovieByTitle;
        
        return { url: anime.url, postId: anime.postId, isMovie };
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error finding anime by slug:', error);
    return null;
  }
}

async function getData(slug: string, postId?: number, season?: number) {
  const animeInfo = await findAnimeBySlug(slug);
  if (!animeInfo) {
    return null;
  }
  
  // If this is a movie, redirect to the movies route
  if (animeInfo.isMovie) {
    const title = decodeURIComponent(animeInfo.url.split('/').filter(Boolean).pop() || slug);
    const movieSlug = generateSlug(title);
    redirect(`/movies/${movieSlug}`);
  }
  
  return fetchAnimeDetails({ 
    url: animeInfo.url, 
    postId: postId || animeInfo.postId || 0, 
    season 
  });
}

export default async function TitlePage({ 
  params, 
  searchParams 
}: { 
  params: { slug: string }; 
  searchParams: { season?: string } 
}) {
  const { slug } = params;
  const selectedSeason = searchParams?.season ? Number(searchParams?.season) : undefined;
  
  console.log(`TitlePage: Processing slug: ${slug}, season: ${selectedSeason}`);

  const data: AnimeDetailsResponse | null = await getData(slug, undefined, selectedSeason);

  if (!data) {
    console.log(`TitlePage: No data found for slug: ${slug}, showing notFound()`);
    notFound();
  }

  console.log(`TitlePage: Successfully got data for: ${data.url}`);
  console.log(`TitlePage: Episodes count: ${data.episodes?.length || 0}, Seasons count: ${data.seasons?.length || 0}`);
  console.log(`TitlePage: Selected season: ${selectedSeason}, Available seasons:`, data.seasons?.map(s => s.season));

  const episodes = data?.episodes || [];
  const title = decodeURIComponent(data.url.split('/').filter(Boolean).pop() || slug);
  
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0f0f0f' }}>
      <NewNavbar />
      
      <div className="mx-auto max-w-screen-x1 px-10 md:px-10 py-10 space-y-10 pb-34">
        <DetailsHeader
          poster={data.poster || null}
          title={title}
          genres={data.genres}
          year={data.year || null}
          totalEpisodes={data.totalEpisodes || (data.episodes?.length || null)}
          duration={data.duration}
          languages={data.languages}
          studio={data.studio || null}
          status={data.status || null}
          rating={data.rating || null}
          smartButtons={data.smartButtons}
        />

        <ReadMore text={"Enjoy a modern, fast experience with AMAI TV. Episodes update season-wise below. Choose a season and start watching instantly."} />

        <Tabs
          tabs={[
            { id: 'episodes', label: 'Episodes' },
            { id: 'related', label: 'Related' },
            { id: 'reviews', label: 'Reviews' },
          ]}
          initial="episodes"
        >
          <TabPanel id="episodes">
            <div id="episodes" className="space-y-4">
              <SeasonSelector seasons={data.seasons || []} selected={selectedSeason} seriesUrl={data.url} postId={data.postId} />
              <EpisodesList
                episodes={episodes as any}
                seriesUrl={data.url}
                postId={data.postId}
                season={selectedSeason || 1}
                currentEpisodeUrl={null}
                seasons={data.seasons}
              />
            </div>
          </TabPanel>

          <TabPanel id="related">
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
              {(data.related || []).map((r: any) => (
                <RelatedSeriesCard
                  key={r.url}
                  url={r.url}
                  title={r.title}
                  poster={r.poster}
                  genres={r.genres}
                  postId={r.postId}
                />
              ))}
            </div>
          </TabPanel>

          <TabPanel id="reviews">
            <div className="space-y-4">
              {(data.reviews || []).map((review, idx) => (
                <div key={idx} className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">{review.user || `User ${idx + 1}`}</span>
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: 5 }, (_, i) => (
                        <svg key={i} className={`w-4 h-4 ${i < (review.stars || 0) ? 'text-yellow-400' : 'text-gray-600'}`} fill="currentColor" viewBox="0 0 24 24">
                          <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm">{review.comment || "Great anime! Highly recommended."}</p>
                </div>
              ))}
              
              {(!data.reviews || data.reviews.length === 0) && (
                <div className="text-center py-12">
                  <div className="text-gray-500 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <p className="text-gray-400">No reviews yet</p>
                  <p className="text-sm text-gray-500 mt-2">Be the first to review this anime!</p>
                  <button className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                    Write a Review
                  </button>
                </div>
              )}
            </div>
          </TabPanel>
        </Tabs>
      </div>

      <NewBottomNav />
      <DesktopNav />
    </div>
  );
}
