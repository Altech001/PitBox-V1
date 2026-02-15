import { useQuery } from '@tanstack/react-query';
import { moviesApi, normalizePitBoxSeries } from '@/lib/pitbox';
import MediaCard from '@/components/MediaCard';
import Navbar from '@/components/Navbar';
import { useMemo } from 'react';
import { MediaGridSkeleton } from '@/components/skeletons';

export default function SeriesPage() {
    const { data: series, isLoading } = useQuery({
        queryKey: ['pitbox-all-series'],
        queryFn: () => moviesApi.getSeries(500, 0),
        staleTime: 5 * 60 * 1000,
    });

    const { normalized, genres } = useMemo(() => {
        const norm = (series || []).map(normalizePitBoxSeries);
        const genreMap = new Map<string, typeof norm>();
        for (const s of norm) {
            if (s.genre) {
                // Split by comma if multiple genres
                const parts = s.genre.split(',').map(p => p.trim());
                for (const genre of parts) {
                    const existing = genreMap.get(genre) || [];
                    existing.push(s);
                    genreMap.set(genre, existing);
                }
            }
        }
        return {
            normalized: norm,
            genres: Array.from(genreMap.entries()).sort(([, a], [, b]) => b.length - a.length)
        };
    }, [series]);

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="px-4 md:px-6 max-w-7xl mx-auto pt-24 md:pt-28 pb-1">
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
                        {/* Featured Series Header */}
                        <div className="mb-12">
                            {/* <h1 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter mb-2">Series</h1> */}
                            <p className="text-[10px] md:text-sm text-muted-foreground font-bold opacity-50">
                                {normalized.length} Titles Available
                            </p>
                        </div>

                        {/* All Series Grid */}
                        <section className="mb-10">
                            <h2 className="text-[10px] font-black text-primary uppercase mb-8 border-b border-white/5 pb-4">
                                All Collections
                            </h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-10">
                                {normalized.map((item) => (
                                    <div key={item.id} className="space-y-2">
                                        <MediaCard item={item} />
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Genre Sections */}
                        {genres.length > 0 && (
                            <div className="space-y-20">
                                {genres.map(([genre, items]) => (
                                    <section key={genre}>
                                        <h2 className="text-[10px] font-black text-primary uppercase  mb-8 border-b border-white/5 pb-4">
                                            {genre}
                                        </h2>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-10 md:gap-x-8 md:gap-y-12">
                                            {items.slice(0, 12).map((item) => (
                                                <MediaCard key={`${genre}-${item.id}`} item={item} />
                                            ))}
                                        </div>
                                    </section>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
