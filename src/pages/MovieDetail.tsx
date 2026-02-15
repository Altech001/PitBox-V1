import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { moviesApi, normalizePitBoxMovie, type PitBoxMovie } from '@/lib/pitbox';
import { Star, Clock, ArrowLeft, Film, User, Info, Calendar } from 'lucide-react';
import MediaCard from '@/components/MediaCard';
import { useEffect, useRef, useMemo } from 'react';
import Artplayer from 'artplayer';
import { MovieDetailSkeleton } from '@/components/skeletons';
import Navbar from '@/components/Navbar';

/**
 * MOVIE DETAIL PAGE - REVERTED TO CLASSIC PITBOX DESIGN
 */
export default function MovieDetail() {
  const { id } = useParams();

  const { data: movie, isLoading } = useQuery({
    queryKey: ['pitbox-movie', id],
    queryFn: () => moviesApi.getMovie(Number(id)),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });

  const { data: allMovies } = useQuery({
    queryKey: ['pitbox-movies'],
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
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 pt-24 md:pt-28">
        {/* Back Link */}
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-bold   text-[#888] hover:text-white transition-colors">
            <ArrowLeft className="w-3 h-3" /> BACK
          </Link>
        </div>

        {/* Player Section */}
        <div className="w-full bg-[#0a0a0a] mb-12 shadow-2xl">
          <ArtPlayerComponent url={movie.video_url} poster={movie.poster_url || ''} title={movie.name} />
        </div>

        {/* Content Section */}
        <div className="space-y-12">
          {/* Header Info */}
          <div className="space-y-6">
            <h1 className="text-2xl md:text-3xl uppercase font-bold  tracking-tight text-white mb-4">
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
                <div className="inline-block bg-primary text-black px-4 py-1 text-[10px] font-bold  tracking-wider">
                  {movie.genre?.split(',')[0].trim() || 'MOVIE'}
                </div>
                <div>
                  <h2 className="text-[11px] font-bold   text-primary">
                    Translated By
                  </h2>
                  <p className="text-[#888] text-[12px] leading-relaxed max-w-4xl">
                    {movie.vj_name}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Dividers & Synopsis */}
          <div className="space-y-4">
            <div className="h-px bg-white/10 w-full" />

            <div className="space-y-2">
              <h2 className="text-[11px] font-bold   text-primary">
                Synopsis
              </h2>
              <p className="text-[#888] text-[12px] leading-relaxed max-w-4xl">
                {movie.description}
              </p>
            </div>

            <div className="h-px bg-white/10 w-full" />

            {/* Recommendations */}
            {similarMovies.length > 0 && (
              <div className="pt-12 ">
                <h2 className="text-[11px] font-bold pb-4  text-primary">
                  Recomended For You
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                  {similarMovies.slice(0, 6).map((m) => (
                    <div key={m.id} className="space-y-2">
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

/**
 * PLAYER COMPONENT
 */
const ArtPlayerComponent: React.FC<{ url: string; poster: string; title: string; onEnded?: () => void }> = ({ url, poster, title, onEnded }) => {
  const artRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!artRef.current) return;
    const art = new Artplayer({
      container: artRef.current,
      url,
      poster,
      volume: 0.5,
      autoplay: true,
      pip: true,
      autoSize: true,
      autoMini: true,
      screenshot: true,
      theme: '#eab308', // primary-yellow color for controls
      moreVideoAttr: {
        crossOrigin: 'anonymous',
        title: title
      },
    });
    if (onEnded) art.on('video:ended', onEnded);
    return () => { if (art && art.destroy) art.destroy(false); };
  }, [url, poster, title, onEnded]);

  return <div ref={artRef} className="w-full aspect-video bg-black" />;
};
