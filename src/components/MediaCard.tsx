import { IMG_BASE, type Movie } from '@/lib/tmdb';
import { Star, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Props {
  item: Movie & { poster_url?: string | null; category_name?: string };
  size?: 'sm' | 'md';
  locked?: boolean;
}

/**
 * Resolves the poster image URL.
 */
function getPosterUrl(item: Props['item']): string | null {
  if (item.poster_url && item.poster_url.startsWith('http')) {
    return item.poster_url;
  }
  if (item.poster_path && item.poster_path.startsWith('/')) {
    return `${IMG_BASE}/w342${item.poster_path}`;
  }
  if (item.poster_path && item.poster_path.startsWith('http')) {
    return item.poster_path;
  }
  return null;
}

export default function MediaCard({ item, size = 'md', locked }: Props) {
  const title = item.title || item.name || 'Untitled';

  const isSeries = item.media_type === 'tv' ||
    item.category_name?.toLowerCase().includes('serie') ||
    'episodes' in item;

  const type = isSeries ? 'series' : 'movie';
  const year = (item.release_date || item.first_air_date || '').slice(0, 4);
  const posterUrl = getPosterUrl(item);

  return (
    <Link to={`/${type}/${item.id}`} className="group block w-full transition-transform duration-300 hover:scale-[1.02]">
      <div className="relative aspect-[2/3] overflow-hidden bg-secondary border-white/5 mb-3 transition-colors group-hover:border-primary/50">
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-[10px] font-bold uppercase bg-secondary/50">
            No Poster
          </div>
        )}

        {isSeries && (
          <div className="absolute top-2 left-2 z-20">
            <div className="bg-primary px-2 py-0.5 text-black text-[10px] font-bold uppercase tracking-tighter">
              Series
            </div>
          </div>
        )}

        {locked && (
          <div className="absolute top-2 right-2 z-20">
            <div className="bg-black/80 backdrop-blur-md p-1.5 rounded-full border border-white/20 shadow-xl">
              <Lock className="w-3 h-3 text-primary shadow-sm" />
            </div>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
      </div>

      <div className="space-y-1">
        {/* <h3 className="text-[13px] md:text-sm font-bold text-white truncate group-hover:text-primary transition-colors leading-tight">
          {title}
        </h3> */}
        <div className="flex items-center gap-3 text-[10px] md:text-xs font-medium text-muted-foreground">
          {year && <span className="opacity-60">{year}</span>}
          {item.vote_average > 0 && (
            <span className="flex items-center gap-1 text-primary/80">
              <Star className="w-3 h-3 fill-primary" />
              <span>{item.vote_average.toFixed(1)}</span>
            </span>
          )}
          {isSeries && 'episodes' in item && (
            <span className="ml-auto bg-primary/10 text-primary text-[9px] px-1 font-black">
              {(item as any).episodes?.length || 0} EP
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
