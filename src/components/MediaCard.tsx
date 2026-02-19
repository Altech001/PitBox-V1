import { type Movie } from '@/lib/tmdb';
import { Star, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import SafeImage from './SafeImage';

interface Props {
  item: Movie & { poster_url?: string | null; category_name?: string };
  size?: 'sm' | 'md';
  locked?: boolean;
}

export default function MediaCard({ item, locked }: Props) {
  const title = item.title || item.name || 'Untitled';
  const isSeries = item.media_type === 'tv' || item.category_name?.toLowerCase().includes('serie') || 'episodes' in item;
  const type = isSeries ? 'series' : 'movie';
  const year = (item.release_date || item.first_air_date || '').slice(0, 4);

  // Determine poster source
  const posterUrl = item.poster_url || (item.poster_path?.startsWith('/') ? `https://image.tmdb.org/t/p/w342${item.poster_path}` : item.poster_path);

  return (
    <Link to={`/${type}/${item.id}`} className="group block w-full transition-transform duration-300 hover:scale-[1.02]">
      <div className="relative aspect-[2/3] overflow-hidden bg-secondary border-white/5 mb-1 group-hover:border-primary/50">
        <SafeImage
          src={posterUrl || ''}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          fallbackText={title}
        />

        {isSeries && (
          <div className="absolute top-2 left-2 z-20">
            <div className="bg-primary px-2 py-0.5 text-black text-[10px] font-bold uppercase tracking-tighter">Series</div>
          </div>
        )}

        {locked && (
          <div className="absolute top-2 right-2 z-20">
            <div className="bg-black/80 backdrop-blur-md p-1.5 rounded-full border border-white/20 shadow-xl">
              <Lock className="w-3 h-3 text-primary" />
            </div>
          </div>
        )}
      </div>

      <div className="space-y-0">
        <div className="flex items-center gap-3 text-[10px] md:text-xs font-medium text-muted-foreground">
          {year && <span className="opacity-60">{year}</span>}
          {item.vote_average > 0 && (
            <span className="flex items-center gap-1 text-primary/80">
              <Star className="w-3 h-3 fill-primary" />
              <span>{item.vote_average.toFixed(1)}</span>
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}