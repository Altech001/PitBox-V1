import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { moviesApi, normalizePitBoxSeries } from '@/lib/pitbox';
import { Star, ArrowLeft, ListVideo } from 'lucide-react';
import MediaCard from '@/components/MediaCard';
import { useMemo } from 'react';
import { MovieDetailSkeleton } from '@/components/skeletons';
import { cn } from '@/lib/utils';
import Navbar from '@/components/Navbar';
import SEO from '@/components/SEO';
import ArtPlayerComponent from '@/components/ArtPlayerComponent';
import { queryKeys } from '@/lib/api/query-keys';
import { useSeriesStore } from '@/hooks/use-store';

export default function SeriesDetail() {
  const { id } = useParams();
  const seriesId = id || "";
  
  // Phase 2: Use global store for episode progress
  const { progress, saveProgress } = useSeriesStore();
  const episodeIndex = progress[seriesId] || 0;

  const { data: series, isLoading } = useQuery({
    queryKey: queryKeys.series.detail(seriesId),
    queryFn: () => moviesApi.getSerieById(Number(seriesId)),
    enabled: !!seriesId,
  });

  const { data: allSeries } = useQuery({
    queryKey: queryKeys.series.list(200, 0),
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
      {/* Phase 4: Dynamic Metadata */}
      <SEO 
        title={series.name} 
        description={series.description} 
        image={series.poster_url || ''} 
        type="video.tv_show" 
      />

      <Navbar />

      <div className="max-w-6xl mx-auto px-4 pt-24 md:pt-28">
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-bold text-[#888] hover:text-white transition-colors">
            <ArrowLeft className="w-3 h-3" /> BACK
          </Link>
        </div>

        {/* Phase 4: Enhanced Player */}
        <div className="w-full bg-[#0a0a0a] mb-8 shadow-2xl">
          <ArtPlayerComponent 
            url={ep?.video_url || ''} 
            poster={ep?.poster_url || series.poster_url || ''} 
            title={`${series.name} - ${ep?.name}`} 
            onEnded={() => {
              if (episodeIndex < (series.episodes?.length || 0) - 1) {
                saveProgress(seriesId, episodeIndex + 1);
              }
            }}
          />
        </div>

        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-2xl md:text-3xl uppercase font-bold tracking-tight text-white mb-2">
              {series.name} {ep && ` - ${ep.name}`}
            </h1>
            
            <div className="flex items-center gap-3 flex-wrap">
              <div className="bg-[#1a1a1a] px-3 py-1.5 text-xs font-bold text-[#888]">
                {series.release_date?.slice(0, 4)} [cite: 857]
              </div>
              <div className="bg-[#1a1a1a] px-3 py-1.5 text-xs font-bold text-primary uppercase">
                {series.episodes?.length || 0} EPISODES [cite: 859]
              </div>
              <div className="bg-primary text-black px-4 py-1.5 text-[10px] font-bold tracking-wider uppercase">
                {series.genre?.split(',')[0].trim()} [cite: 860]
              </div>
            </div>
          </div>

          {/* Episode Selection */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <ListVideo className="w-4 h-4 text-primary" />
              <h2 className="text-[11px] font-bold text-primary uppercase">Episode Selection</h2>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {series.episodes?.map((e, i) => (
                <button
                  key={e.id}
                  onClick={() => saveProgress(seriesId, i)}
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
                    <div className="absolute bottom-1 right-1 bg-black/80 px-1.5 py-0.5 text-[8px] font-bold text-white">
                      PART {i + 1} [cite: 871]
                    </div>
                  </div>
                  <div className="text-left">
                    <p className={cn("text-[10px] font-bold truncate", episodeIndex === i ? "text-primary" : "text-white")}>
                      {e.name} [cite: 873]
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          {similarSeries.length > 0 && (
            <div className="pt-6">
              <h2 className="text-[11px] font-bold pb-4 text-primary uppercase border-b border-white/5 mb-6">
                Recommended For You
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {similarSeries.slice(0, 6).map((s) => (
                  <MediaCard key={s.id} item={s} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}