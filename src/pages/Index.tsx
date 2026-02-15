import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { moviesApi, normalizePitBoxMovie } from '@/lib/pitbox';
import HeroCarousel from '@/components/HeroCarousel';
import MediaRow from '@/components/MediaRow';
import MediaCard from '@/components/MediaCard';
import Navbar from '@/components/Navbar';
import { useRef, useEffect, useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import { IndexPageSkeleton, DiscoverGridSkeleton } from '@/components/skeletons';

const Index = () => {
  const loaderRef = useRef<HTMLDivElement>(null);

  // Fetch movies from PitBox API with proper caching
  const { data: allMovies, isLoading: isMoviesLoading } = useQuery({
    queryKey: ['pitbox-movies'],
    queryFn: () => moviesApi.getMovies(200, 0),
    staleTime: 5 * 60 * 1000, // 5 min cache
    gcTime: 10 * 60 * 1000, // 10 min garbage collection
    refetchOnWindowFocus: false,
  });

  // Memoize normalized + sections to avoid recalculating on every render
  const { heroMovies, trending, popular, latest, topRated, genreRows } = useMemo(() => {
    const normalized = (allMovies || []).map(normalizePitBoxMovie);

    return {
      heroMovies: normalized.filter(m => m.poster_url).slice(0, 8),
      trending: normalized.slice(0, 20),
      popular: normalized.slice(20, 40),
      latest: [...normalized].sort((a, b) =>
        (b.release_date || '').localeCompare(a.release_date || '')
      ).slice(0, 20),
      topRated: [...normalized].sort((a, b) => b.vote_average - a.vote_average).slice(0, 20),
      genreRows: (() => {
        const genreMap = new Map<string, typeof normalized>();
        for (const m of normalized) {
          if (m.genre) {
            const existing = genreMap.get(m.genre) || [];
            existing.push(m);
            genreMap.set(m.genre, existing);
          }
        }
        return Array.from(genreMap.entries())
          .filter(([, movies]) => movies.length >= 5)
          .slice(0, 6);
      })(),
    };
  }, [allMovies]);

  // Infinite scroll discover grid
  const {
    data: discoverData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isDiscoverLoading,
  } = useInfiniteQuery({
    queryKey: ['discover-pitbox'],
    queryFn: ({ pageParam }) => moviesApi.getMovies(50, pageParam * 50),
    initialPageParam: 0,
    getNextPageParam: (lastPage, _, lastPageParam) =>
      lastPage.length === 50 ? lastPageParam + 1 : undefined,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: '600px' }
    );
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const uniqueDiscover = useMemo(() => {
    const all = discoverData?.pages.flatMap((p) => p.map(normalizePitBoxMovie)) || [];
    const seen = new Set<number>();
    return all.filter((m) => {
      if (seen.has(m.id)) return false;
      seen.add(m.id);
      return true;
    });
  }, [discoverData]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="px-4 md:px-6 max-w-7xl mx-auto pt-24">
        {isMoviesLoading ? (
          <IndexPageSkeleton />
        ) : (
          <>
            {heroMovies.length > 0 && <HeroCarousel items={heroMovies} />}
            <MediaRow title="Trending Now" items={trending} />
            {/* <MediaRow title="Popular Movies" items={popular} /> */}
            {/* <MediaRow title="Top Rated" items={topRated} /> */}
            <MediaRow title="Latest Releases" items={latest} />

            {/* Genre-based rows */}
            {genreRows.map(([genre, movies]) => (
              <MediaRow key={genre} title={genre} items={movies.slice(0, 30)} />
            ))}
          </>
        )}
      </div>

      {/* Discover Grid */}
      <div className="px-4 md:px-6 max-w-7xl mx-auto mt-4 pb-10">
        <h2 className="text-display text-xs md:text-sm font-bold text-foreground mb-4 opacity-80">
          Discover Movies
        </h2>
        {isDiscoverLoading ? (
          <DiscoverGridSkeleton />
        ) : (
          <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-4">
            {uniqueDiscover.map((movie) => (
              <div className="p-0.1" key={movie.id}>
                <MediaCard item={movie} size="sm" />
              </div>
            ))}
          </div>
        )}
        <div ref={loaderRef} className="flex items-center justify-center py-10">
          {isFetchingNextPage && <Loader2 className="w-6 h-6 animate-spin text-primary" />}
        </div>
      </div>
    </div>
  );
};

export default Index;
