import { useQuery } from '@tanstack/react-query';
import { moviesApi, normalizePitBoxMovie } from '@/lib/pitbox';
import MediaCard from '@/components/MediaCard';
import Navbar from '@/components/Navbar';
import { useMemo } from 'react';
import { MediaGridSkeleton } from '@/components/skeletons';

export default function MoviesPage() {
    const { data: movies, isLoading } = useQuery({
        queryKey: ['pitbox-all-movies'],
        queryFn: () => moviesApi.getMovies(500, 0),
        staleTime: 5 * 60 * 1000,
    });

    const { normalized, genres } = useMemo(() => {
        const norm = (movies || []).map(normalizePitBoxMovie);
        const genreMap = new Map<string, typeof norm>();
        for (const m of norm) {
            if (m.genre) {
                const existing = genreMap.get(m.genre) || [];
                existing.push(m);
                genreMap.set(m.genre, existing);
            }
        }
        return {
            normalized: norm,
            genres: Array.from(genreMap.entries()).sort(([, a], [, b]) => b.length - a.length)
        };
    }, [movies]);

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="px-4 md:px-6 max-w-7xl mx-auto pt-24 md:pt-32 pb-16">
                {isLoading ? (
                    <div className="space-y-12">
                        <div>
                            <div className="h-4 w-40 bg-muted/20 animate-pulse mb-6" />
                            <MediaGridSkeleton count={14} />
                        </div>
                        <div>
                            <div className="h-4 w-40 bg-muted/20 animate-pulse mb-6" />
                            <MediaGridSkeleton count={7} />
                        </div>
                    </div>
                ) : (
                    <>
                        {/* All Movies Grid */}
                        <section className="mb-12">
                            <h2 className="text-display text-xs md:text-sm font-bold text-muted-foreground mb-6">
                                All Movies ({normalized.length})
                            </h2>
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 md:gap-8 gap-4">
                                {normalized.slice(0, 42).map((item) => (
                                    <MediaCard key={item.id} item={item} />
                                ))}
                            </div>
                        </section>

                        {/* Genre Sections */}
                        {genres.map(([genre, items]) => (
                            <section key={genre} className="mb-12">
                                <h2 className="text-display text-xs md:text-sm font-bold text-muted-foreground mb-6">
                                    {genre} ({items.length})
                                </h2>
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 md:gap-8 gap-4">
                                    {items.slice(0, 21).map((item) => (
                                        <MediaCard key={item.id} item={item} />
                                    ))}
                                </div>
                            </section>
                        ))}
                    </>
                )}
            </div>
        </div>
    );
}
