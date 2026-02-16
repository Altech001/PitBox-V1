import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { moviesApi, normalizePitBoxMovie } from '@/lib/pitbox';
import HeroCarousel from '@/components/HeroCarousel';
import MediaRow from '@/components/MediaRow';
import Navbar from '@/components/Navbar';
import SEO from '@/components/SEO';
import VirtualGrid from '@/components/VirtualGrid';
import { useRef, useEffect, useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import { IndexPageSkeleton } from '@/components/skeletons';
import { queryKeys } from '@/lib/api/query-keys';
import { useResponsiveColumns } from '@/hooks/Useresponsivecolumns';

const Index = () => {
  const loaderRef = useRef<HTMLDivElement>(null);

  // Centralized responsive column logic (custom hook)
  const columnCount = useResponsiveColumns();

  const { data: allMovies, isLoading: isMoviesLoading } = useQuery({
    queryKey: queryKeys.movies.all,
    queryFn: () => moviesApi.getMovies(200, 0),
    staleTime: 5 * 60 * 1000, 
  });

  const { heroMovies, latest, genreRows } = useMemo(() => {
    const normalized = (allMovies || []).map(normalizePitBoxMovie);

    return {
      heroMovies: normalized.filter(m => m.poster_url).slice(0, 8),
      latest: [...normalized].sort((a, b) =>
        (b.release_date || '').localeCompare(a.release_date || '')
      ).slice(0, 20),
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

  // Infinite Query for Discover section
  const {
    data: discoverData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isDiscoverLoading,
  } = useInfiniteQuery({
    queryKey: ['discover-infinite'],
    queryFn: ({ pageParam }) => moviesApi.getMovies(50, pageParam * 50),
    initialPageParam: 0,
    getNextPageParam: (lastPage, _, lastPageParam) =>
      lastPage.length === 50 ? lastPageParam + 1 : undefined,
    staleTime: 5 * 60 * 1000,
  });

  // Intersection Observer for infinite loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: '900px' } // Load next page when user is 900px away
    );
    
    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }
    
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  // Deduplicate movies across pages
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
      <SEO title="Home" />
      <Navbar />
      
      {/* Hero and Row Sections */}
      <div className="px-4 md:px-6 max-w-7xl mx-auto pt-24">
        {isMoviesLoading ? (
          <IndexPageSkeleton />
        ) : (
          <>
            {heroMovies.length > 0 && <HeroCarousel items={heroMovies} />}
            <MediaRow title="Latest Releases" items={latest} />
            {genreRows.map(([genre, movies]) => (
              <MediaRow key={genre} title={genre} items={movies.slice(0, 30)} />
            ))}
          </>
        )}
      </div>

      {/* Discover Section with Virtual Grid */}
      <div className="px-4 md:px-6 max-w-7xl mx-auto mt-8 pb-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-5 bg-primary" />
          <h2 className="text-display text-sm font-bold text-foreground uppercase tracking-widest opacity-80">
            Discover Library
          </h2>
        </div>
        
        {isDiscoverLoading ? (
          // Skeleton grid matching the actual grid exactly
          <div 
            className="grid gap-3 md:gap-4"
            style={{
              gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`
            }}
          >
            {Array.from({ length: columnCount * 4 }).map((_, i) => (
              <div 
                key={i} 
                className="aspect-[2/3] bg-white/5 rounded-md animate-pulse" 
              />
            ))}
          </div>
        ) : uniqueDiscover.length > 0 ? (
          <VirtualGrid items={uniqueDiscover} columns={columnCount} />
        ) : (
          <div className="flex items-center justify-center py-20">
            <p className="text-muted-foreground text-sm">No movies found</p>
          </div>
        )}

        {/* Loading Indicator */}
        <div ref={loaderRef} className="flex items-center justify-center py-12">
          {isFetchingNextPage && (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.3em]">
                Loading Content
              </span>
            </div>
          )}
          {!hasNextPage && uniqueDiscover.length > 0 && (
            <p className="text-xs text-muted-foreground">
              You've reached the end
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;