/**
 * PitBox Movies API
 * Fetches movies from the PitBox backend at mintos-vd.vercel.app
 */

const PITBOX_API = 'https://mintos-vd.vercel.app';

export interface PitBoxMovie {
  id: number;
  name: string;
  description: string;
  poster_url: string | null;
  genre: string;
  vj_name: string | null;
  directors: string | null;
  duration: string | null;
  release_date: string | null;
  category_name: string;
  stars: number;
  video_url: string;
  created_at: string;
}

export interface PitBoxMovieDetail extends PitBoxMovie {
  // Same fields — single movie by id
}

/**
 * Normalize a PitBox movie into the common Movie shape used by MediaCard, HeroCarousel, MediaRow
 */
export function normalizePitBoxMovie(m: PitBoxMovie) {
  return {
    id: m.id,
    title: m.name,
    name: m.name,
    overview: m.description || '',
    poster_path: m.poster_url, // already a full URL, not a TMDB path
    backdrop_path: m.poster_url, // use poster as backdrop fallback
    vote_average: m.stars || 0,
    release_date: m.release_date || '',
    first_air_date: undefined as string | undefined,
    genre_ids: [] as number[],
    media_type: 'movie' as const,
    // PitBox-specific fields carried along
    genre: m.genre,
    vj_name: m.vj_name,
    directors: m.directors,
    duration: m.duration,
    category_name: m.category_name,
    video_url: m.video_url,
    poster_url: m.poster_url,
  };
}

export type NormalizedMovie = ReturnType<typeof normalizePitBoxMovie>;

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { headers: { accept: 'application/json' } });
  if (!res.ok) throw new Error(`PitBox API Error: ${res.status}`);
  return res.json();
}

export interface PitBoxSearchItem extends PitBoxMovie {
  episodes?: any[]; // For series
}

export interface SearchResult {
  type: 'movie' | 'serie';
  score: number;
  item: PitBoxSearchItem;
}

export interface SuggestResult {
  name: string;
  score: number;
}

/**
 * Normalize a PitBox search item into the common Movie shape
 */
export function normalizeSearchItem(result: SearchResult) {
  const m = result.item;
  const type = result.type === 'serie' ? 'tv' : 'movie';
  
  return {
    id: m.id,
    title: m.name,
    name: m.name,
    overview: m.description || '',
    poster_path: m.poster_url,
    backdrop_path: m.poster_url,
    vote_average: m.stars || 0,
    release_date: m.release_date || '',
    first_air_date: result.type === 'serie' ? m.release_date : undefined,
    genre_ids: [] as number[],
    media_type: type as 'movie' | 'tv',
    // PitBox-specific fields
    genre: m.genre,
    vj_name: m.vj_name,
    directors: m.directors,
    duration: m.duration,
    category_name: m.category_name,
    video_url: m.video_url,
    poster_url: m.poster_url,
    type: result.type,
  };
}

export interface PitBoxEpisode {
  id: number;
  name: string;
  video_url: string;
  poster_url: string | null;
  genre: string;
  stars: number;
  vj_name: string | null;
  created_at: string;
  serie_id: number;
}

export interface PitBoxSeries {
  id: number;
  name: string;
  description: string;
  poster_url: string | null;
  genre: string;
  vj_name: string | null;
  duration: string | null;
  release_date: string | null;
  category_name: string;
  stars: number;
  created_at: string;
  episodes: PitBoxEpisode[];
}

/**
 * Normalize a PitBox series into the common Movie shape
 */
export function normalizePitBoxSeries(s: PitBoxSeries) {
  return {
    id: s.id,
    title: s.name,
    name: s.name,
    overview: s.description || '',
    poster_path: s.poster_url,
    backdrop_path: s.poster_url,
    vote_average: s.stars || 0,
    release_date: s.release_date || '',
    first_air_date: s.release_date || '',
    genre_ids: [] as number[],
    media_type: 'tv' as const,
    // PitBox-specific fields
    genre: s.genre,
    vj_name: s.vj_name,
    duration: s.duration,
    category_name: s.category_name,
    poster_url: s.poster_url,
    episodes: s.episodes,
  };
}

export const moviesApi = {
  /**
   * Get all movies (paginated via skip/limit)
   */
  getMovies: async (limit = 50, skip = 0): Promise<PitBoxMovie[]> => {
    return fetchJson<PitBoxMovie[]>(
      `${PITBOX_API}/movies/?limit=${limit}&skip=${skip}`
    );
  },

  /**
   * Get all series
   */
  getSeries: async (limit = 50, skip = 0): Promise<PitBoxSeries[]> => {
    return fetchJson<PitBoxSeries[]>(
      `${PITBOX_API}/series/?limit=${limit}&skip=${skip}`
    );
  },

  /**
   * Get a single series by ID
   */
  getSerieById: async (id: number): Promise<PitBoxSeries> => {
    return fetchJson<PitBoxSeries>(`${PITBOX_API}/series/${id}`);
  },

  /**
   * Get a single movie by ID
   */
  getMovie: async (id: number): Promise<PitBoxMovie> => {
    return fetchJson<PitBoxMovie>(`${PITBOX_API}/movies/${id}`);
  },

  /**
   * Ultimate Search (Movies + Series)
   */
  search: async (query: string, limit = 20): Promise<SearchResult[]> => {
    return fetchJson<SearchResult[]>(
      `${PITBOX_API}/search/?q=${encodeURIComponent(query)}&limit=${limit}`
    );
  },

  /**
   * Search Suggestions
   */
  suggest: async (query: string): Promise<SuggestResult[]> => {
    return fetchJson<SuggestResult[]>(
      `${PITBOX_API}/search/suggest?q=${encodeURIComponent(query)}`
    );
  },

  /**
   * Search movies only (Legacy)
   */
  searchMovies: async (query: string): Promise<PitBoxMovie[]> => {
    return fetchJson<PitBoxMovie[]>(
      `${PITBOX_API}/movies/search/?query=${encodeURIComponent(query)}`
    );
  },
};
