import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { moviesApi, normalizePitBoxSeries, type PitBoxSeries, type PitBoxEpisode } from '@/lib/pitbox';
import { Star, Clock, ArrowLeft, ListVideo, Play } from 'lucide-react';
import MediaCard from '@/components/MediaCard';
import { useEffect, useRef, useState, useMemo } from 'react';
import Artplayer from 'artplayer';
import { MovieDetailSkeleton } from '@/components/skeletons';
import { cn } from '@/lib/utils';
import Navbar from '@/components/Navbar';

/**
 * SERIES DETAIL PAGE - SLEEK PITBOX DESIGN
 */
export default function SeriesDetail() {
  const { id } = useParams();
  const [episodeIndex, setEpisodeIndex] = useState(0);

  useEffect(() => {
    setEpisodeIndex(0);
  }, [id]);

  const { data: series, isLoading } = useQuery({
    queryKey: ['pitbox-series', id],
    queryFn: () => moviesApi.getSerieById(Number(id)),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });

  const { data: allSeries } = useQuery({
    queryKey: ['pitbox-all-series'],
    queryFn: () => moviesApi.getSeries(200, 0),
    enabled: !!series,
  });

  const similarSeries = useMemo(() => {
    if (!series || !allSeries) return [];
    const firstGenre = series.genre?.split(',')[0].trim();
    return allSeries
      .filter((s) => s.genre?.includes(firstGenre) && s.id !== series.id)
      .slice(0, 12)
      .map(normalizePitBoxSeries);
  }, [series, allSeries]);

  if (isLoading) return <MovieDetailSkeleton />;
  if (!series) return null;

  const ep = series.episodes?.[episodeIndex];

  return (
    <div className="min-h-screen bg-black text-white relative pb-20 font-sans">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 pt-24 md:pt-28">
        {/* Back Link */}
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-bold text-[#888] hover:text-white transition-colors">
            <ArrowLeft className="w-3 h-3" /> BACK
          </Link>
        </div>

        {/* Player Section */}
        <div className="w-full bg-[#0a0a0a] mb-8 shadow-2xl">
          <ArtPlayerComponent 
            url={ep?.video_url || ''} 
            poster={ep?.poster_url || series.poster_url || ''} 
            title={`${series.name} - ${ep?.name}`} 
            onEnded={() => episodeIndex < (series.episodes?.length || 0) - 1 && setEpisodeIndex(i => i + 1)}
          />
        </div>

        {/* Content Section */}
        <div className="space-y-8">
          {/* Header Info */}
          <div className="space-y-4">
            <h1 className="text-2xl md:text-3xl uppercase font-bold tracking-tight text-white mb-2">
              {series.name} {ep && ` - ${ep.name}`}
            </h1>
            
            <div className="flex items-center gap-3 flex-row justify-between flex-wrap">
              <div className="flex items-center gap-3">
                {series.release_date && (
                  <div className="bg-[#1a1a1a] px-3 py-1.5 text-xs font-bold text-[#888]">
                    {series.release_date.slice(0, 4)}
                  </div>
                )}
                {series.stars > 0 && (
                  <div className="bg-[#1a1a1a] px-3 py-1.5 text-xs font-bold text-[#888] flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 fill-primary text-primary" />
                    <span>{series.stars.toFixed(1)}</span>
                  </div>
                )}
                <div className="bg-[#1a1a1a] px-3 py-1.5 text-xs font-bold text-primary">
                  {series.episodes?.length || 0} EPISODES
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="inline-block bg-primary text-black px-4 py-1 text-[10px] font-bold">
                  {series.genre?.split(',')[0].trim() || 'SERIES'}
                </div>
                {series.vj_name && (
                  <div>
                    <h2 className="text-[11px] font-bold text-primary">Translated By</h2>
                    <p className="text-[#888] text-[12px] leading-relaxed">{series.vj_name}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Episodes Selection with Thumbnails */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <ListVideo className="w-4 h-4 text-primary" />
              <h2 className="text-[11px] font-bold text-primary">EPISODE SELECTION</h2>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {series.episodes?.map((e, i) => (
                <button
                  key={e.id}
                  onClick={() => setEpisodeIndex(i)}
                  className={cn(
                    "group relative flex flex-col gap-2 transition-all p-2 rounded border",
                    episodeIndex === i 
                      ? "bg-primary/5 border-primary/50" 
                      : "bg-[#0a0a0a] border-white/5 hover:border-white/20"
                  )}
                >
                  <div className="relative aspect-video overflow-hidden bg-secondary">
                    <img 
                      src={e.poster_url || series.poster_url || ''} 
                      alt="" 
                      className={cn(
                        "w-full h-full object-cover transition-transform duration-500",
                        episodeIndex === i ? "scale-105" : "group-hover:scale-105 opacity-60"
                      )} 
                    />
                    {episodeIndex === i && (
                      <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                        <Play className="w-6 h-6 text-primary fill-primary" />
                      </div>
                    )}
                    <div className="absolute bottom-1 right-1 bg-black/80 px-1.5 py-0.5 text-[8px] font-bold text-white">
                      PART {i + 1}
                    </div>
                  </div>
                  <div className="text-left">
                    <p className={cn(
                      "text-[10px] md:text-[11px] font-bold truncate",
                      episodeIndex === i ? "text-primary" : "text-white"
                    )}>
                      {e.name}
                    </p>
                    <p className="text-[8px] text-[#555] font-bold uppercase">Pitbox Original</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Synopsis Section */}
          <div className="space-y-4 pt-4">
            <div className="h-px bg-white/10 w-full" />
            <div className="space-y-2">
              <h2 className="text-[11px] font-bold text-primary">Synopsis</h2>
              <p className="text-[#888] text-[12px] leading-relaxed max-w-4xl">
                {series.description}
              </p>
            </div>
            <div className="h-px bg-white/10 w-full" />
          </div>

          {/* Recommendations At Bottom */}
          {similarSeries.length > 0 && (
            <div className="pt-6">
              <h2 className="text-[11px] font-bold pb-4 text-primary">
                Recomended For You
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {similarSeries.slice(0, 6).map((s) => (
                  <div key={s.id} className="space-y-2">
                    <MediaCard item={s} />
                  </div>
                ))}
              </div>
            </div>
          )}
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
      theme: '#eab308',
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
