import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { moviesApi, normalizePitBoxMovie } from '@/lib/pitbox';
import { Star, ArrowLeft } from 'lucide-react';
import MediaCard from '@/components/MediaCard';
import { useMemo } from 'react';
import { MovieDetailSkeleton } from '@/components/skeletons';
import Navbar from '@/components/Navbar';
import SEO from '@/components/SEO';
import ArtPlayerComponent from '@/components/ArtPlayerComponent';
import { queryKeys } from '@/lib/api/query-keys';

/**
 * MOVIE DETAIL PAGE - PRODUCTION READY
 */
export default function MovieDetail() {
  const { id } = useParams();
  const movieId = id || "";

  // Use Centralized Query Keys
  const { data: movie, isLoading } = useQuery({
    queryKey: queryKeys.movies.detail(movieId),
    queryFn: () => moviesApi.getMovie(Number(movieId)),
    enabled: !!movieId,
  });

  const { data: allMovies } = useQuery({
    queryKey: queryKeys.movies.all,
    queryFn: () => moviesApi.getMovies(200, 0),
    enabled: !!movie,
  });

  const similarMovies = useMemo(() => {
    if (!movie || !allMovies) return [];
    return allMovies
      .filter((m) => m.genre === movie.genre && m.id !== movie.id)
      .slice(0, 12)
      .map(normalizePitBoxMovie);
  }, [movie, allMovies]);

  if (isLoading) return <MovieDetailSkeleton />;
  if (!movie) return null;

  return (
    <div className="min-h-screen bg-black text-white relative pb-20 font-sans">
      {/* Dynamic SEO Metadata */}
      <SEO
        title={movie.name}
        description={movie.description || `Watch ${movie.name} on PitBox. Stream in premium quality.`}
        image={movie.poster_url || ''}
        type="video.movie"
        canonicalPath={`/movie/${movieId}`}
        keywords={`${movie.name}, ${movie.genre || 'movie'}, watch online, PitBox, stream, Ugandan movies`}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Movie',
          name: movie.name,
          description: movie.description || '',
          image: movie.poster_url || '',
          datePublished: movie.release_date || '',
          genre: movie.genre || '',
          aggregateRating: movie.stars > 0 ? {
            '@type': 'AggregateRating',
            ratingValue: movie.stars.toFixed(1),
            bestRating: '10',
            worstRating: '0',
          } : undefined,
          url: `https://pitbox.fun/movie/${movieId}`,
        }}
      />

      <Navbar />

      <div className="max-w-6xl mx-auto px-4 pt-24 md:pt-28">
        {/* Navigation */}
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-bold text-[#888] hover:text-white transition-colors">
            <ArrowLeft className="w-3 h-3" /> BACK
          </Link>
        </div>

        {/* Enhanced Player Section */}
        <div className="w-full bg-[#0a0a0a] mb-12 shadow-2xl">
          <ArtPlayerComponent
            url={movie.video_url}
            poster={movie.poster_url || ''}
            title={movie.name}
            showSkipIntro={true}
          />
        </div>

        {/* Content Section */}
        <div className="space-y-12">
          <div className="space-y-6">
            <h1 className="text-2xl md:text-3xl uppercase font-bold tracking-tight text-white mb-4">
              {movie.name}
            </h1>

            <div className="flex items-center gap-3 flex-row justify-between">
              <div className="flex items-center gap-3">
                {movie.release_date && (
                  <div className="bg-[#1a1a1a] px-3 py-1.5 text-xs font-bold text-[#888]">
                    {movie.release_date.slice(0, 4)}
                  </div>
                )}
                {movie.stars > 0 && (
                  <div className="bg-[#1a1a1a] px-3 py-1.5 text-xs font-bold text-[#888] flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 fill-primary text-primary" />
                    <span>{movie.stars.toFixed(1)}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <div className="inline-block bg-primary text-black px-4 py-1 text-[10px] font-bold tracking-wider uppercase">
                  {movie.genre?.split(',')[0].trim() || 'MOVIE'}
                </div>
                <div className="hidden sm:block">
                  <h2 className="text-[11px] font-bold text-primary uppercase">Translated By</h2>
                  <p className="text-[#888] text-[12px] leading-relaxed">{movie.vj_name || 'PitBox VJ'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="h-px bg-white/10 w-full" />
            <div className="space-y-2">
              <h2 className="text-[11px] font-bold text-primary uppercase">Synopsis</h2>
              <p className="text-[#888] text-[12px] leading-relaxed max-w-4xl">{movie.description}</p>
            </div>
            <div className="h-px bg-white/10 w-full" />

            {/* Recommendations */}
            {similarMovies.length > 0 && (
              <div className="pt-12 ">
                <h2 className="text-[11px] font-bold pb-4 text-primary uppercase">Recommended For You</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                  {similarMovies.slice(0, 6).map((m) => (
                    <div key={m.id}>
                      <MediaCard item={m} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}