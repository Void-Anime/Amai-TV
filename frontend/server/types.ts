export interface EpisodeItem {
  number?: string | null;
  title?: string | null;
  url: string;
  poster?: string | null;
}

export interface SeasonItem {
  season: number | string;
  label: string;
  nonRegional: boolean;
}

export interface AnimeDetailsResponse {
  url: string;
  postId: number;
  season?: number | null;
  seasons: SeasonItem[];
  episodes: EpisodeItem[];
  poster?: string | null;
  genres?: string[];
  year?: number | null;
  totalEpisodes?: number | null;
  duration?: string | null;
  languages?: string[];
  synopsis?: string | null;
  status?: string | null;
}

export interface SeriesListItem {
  title: string | null;
  url: string;
  image?: string | null;
  postId?: number;
}

export interface AnimeListResponse {
  page: number;
  items: SeriesListItem[];
}

