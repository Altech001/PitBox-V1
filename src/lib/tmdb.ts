const TMDB_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxODYzODYzZjg5MWNjY2I1ZDYzYzA0ODMwYmI2ODU3NiIsIm5iZiI6MTY5ODI4NDE5NS4yNzMsInN1YiI6IjY1MzljMmEzOTU1YzY1MDEzOGJjMjJmZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ADxEh9Z7nfa_WPklA8ASlN3qPO_hR0m4Ebz_0HoOwPI';
const BASE_URL = 'https://api.themoviedb.org/3';
export const IMG_BASE = 'https://image.tmdb.org/t/p';

const headers = {
  Authorization: `Bearer ${TMDB_TOKEN}`,
  'Content-Type': 'application/json',
};

async function fetcher<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, { headers });
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.status_message || `TMDB Error: ${res.status}`);
  }
  
  return res.json();
}

export interface Movie {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  genre_ids: number[];
  media_type?: string;
}

interface ListResponse {
  results: Movie[];
  total_pages: number;
}

export interface MovieDetail extends Movie {
  runtime?: number;
  number_of_seasons?: number;
  genres: { id: number; name: string }[];
  tagline?: string;
  status: string;
  credits?: { cast: Cast[] };
  similar?: { results: Movie[] };
}

export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export const tmdb = {
  trending: (page = 1) => fetcher<ListResponse>(`/trending/all/week?page=${page}`),
  popularMovies: (page = 1) => fetcher<ListResponse>(`/movie/popular?page=${page}`),
  topRatedMovies: (page = 1) => fetcher<ListResponse>(`/movie/top_rated?page=${page}`),
  popularSeries: (page = 1) => fetcher<ListResponse>(`/tv/popular?page=${page}`),
  topRatedSeries: (page = 1) => fetcher<ListResponse>(`/tv/top_rated?page=${page}`),
  movieDetail: (id: number) =>
    fetcher<MovieDetail>(`/movie/${id}?append_to_response=credits,similar`),
  seriesDetail: (id: number) =>
    fetcher<MovieDetail>(`/tv/${id}?append_to_response=credits,similar`),
  search: (query: string, page = 1) =>
    fetcher<ListResponse>(`/search/multi?query=${encodeURIComponent(query)}&page=${page}`),
};
