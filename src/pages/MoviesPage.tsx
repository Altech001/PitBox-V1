import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { moviesApi, normalizePitBoxMovie } from '@/lib/pitbox';
import Navbar from '@/components/Navbar';
import SEO from '@/components/SEO';
import VirtualGrid from '@/components/VirtualGrid';
import { useMemo, useRef, useEffect, useState } from 'react';
import { Loader2, Film } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function MoviesPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const selectedGenre = searchParams.get('genre') || 'All';
    const loaderRef = useRef<HTMLDivElement>(null);

    // Responsive Columns
    const [columnCount, setColumnCount] = useState(6);
    useEffect(() => {
        const updateColumns = () => {
            const width = window.innerWidth;
            if (width < 640) setColumnCount(2);
            else if (width < 768) setColumnCount(3);
            else if (width < 1024) setColumnCount(4);
            else setColumnCount(6);
        };
        updateColumns();
        window.addEventListener('resize', updateColumns);
        return () => window.removeEventListener('resize', updateColumns);
    }, []);

    // 1. Fetch Genres
    const { data: initialMovies } = useQuery({
        queryKey: ['pitbox-movie-genres'],
        queryFn: () => moviesApi.getMovies(100, 0),
        staleTime: 10 * 60 * 1000,
    });

    const uniqueGenres = useMemo(() => {
        const genres = new Set<string>();
        initialMovies?.forEach(m => {
            if (m.genre) {
                m.genre.split(',').forEach(g => genres.add(g.trim()));
            }
        });
        return ['All', ...Array.from(genres).sort()];
    }, [initialMovies]);

    // 2. Infinite Query
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useInfiniteQuery({
        queryKey: ['movies-infinite', selectedGenre],
        queryFn: async ({ pageParam = 0 }) => {
            return moviesApi.getMovies(50, pageParam * 50);
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage, _, lastPageParam) => {
            return lastPage.length === 50 ? lastPageParam + 1 : undefined;
        },
        staleTime: 5 * 60 * 1000,
    });

    // 3. Process Data
    const filteredMovies = useMemo(() => {
        const all = data?.pages.flatMap(p => p.map(normalizePitBoxMovie)) || [];
        const seen = new Set<number>();
        const unique = all.filter(item => {
            if (seen.has(item.id)) return false;
            seen.add(item.id);
            return true;
        });

        if (selectedGenre === 'All') return unique;
        return unique.filter(m => m.genre && m.genre.includes(selectedGenre));
    }, [data, selectedGenre]);

    // 4. Observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                }
            },
            { rootMargin: '800px' }
        );
        if (loaderRef.current) observer.observe(loaderRef.current);
        return () => observer.disconnect();
    }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

    const handleGenreChange = (genre: string) => {
        setSearchParams(genre === 'All' ? {} : { genre });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-background">
            <SEO
                title="Movies"
                description="Browse and stream the latest Ugandan movies, Hollywood blockbusters, and African films in premium quality on PitBox."
                canonicalPath="/movies"
                keywords="movies, Ugandan movies, Hollywood movies, African films, action movies, drama, comedy, streaming"
            />
            <Navbar />
            <div className="pt-24 md:pt-32 pb-1">

                <div className="px-4 md:px-6 max-w-7xl mx-auto mb-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                        <div>
                            <h1 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter mb-2">
                                Movie Library
                            </h1>
                            <p className="text-[10px] md:text-xs text-muted-foreground font-bold uppercase tracking-widest opacity-60">
                                {selectedGenre === 'All' ? 'Browsing All' : `Genre: ${selectedGenre}`}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2">
                        <Film className="w-4 h-4 text-primary shrink-0 mr-2" />
                        {uniqueGenres.map(genre => (
                            <Button
                                key={genre}
                                variant="outline"
                                size="sm"
                                onClick={() => handleGenreChange(genre)}
                                className={cn(
                                    "rounded-full text-[10px] font-bold uppercase tracking-wider border-white/10 h-8 shrink-0",
                                    selectedGenre === genre
                                        ? "bg-primary text-black border-primary hover:bg-primary/90"
                                        : "bg-transparent text-muted-foreground hover:text-white hover:border-white/30"
                                )}
                            >
                                {genre}
                            </Button>
                        ))}
                    </div>
                </div>

                <div className="px-4 md:px-6 max-w-7xl mx-auto min-h-[50vh]">
                    {isLoading ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {Array.from({ length: 12 }).map((_, i) => (
                                <div key={i} className="aspect-[2/3] bg-white/5 animate-pulse" />
                            ))}
                        </div>
                    ) : filteredMovies.length > 0 ? (
                        <VirtualGrid items={filteredMovies} columns={columnCount} />
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 opacity-50">
                            <p className="text-sm font-bold uppercase">No movies found in this genre</p>
                            <Button
                                variant="link"
                                className="text-primary text-xs"
                                onClick={() => handleGenreChange('All')}
                            >
                                Clear Filters
                            </Button>
                        </div>
                    )}

                    <div ref={loaderRef} className="flex items-center justify-center py-12">
                        {isFetchingNextPage && (
                            <div className="flex flex-col items-center gap-2">
                                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                                <span className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.3em]">
                                    Loading More
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}