import { IMG_BASE, type Movie } from '@/lib/tmdb';
import { Star, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Props {
  item: Movie;
}

export default function HeroBanner({ item }: Props) {
  const title = item.title || item.name || '';
  const type = item.media_type === 'tv' || item.first_air_date ? 'series' : 'movie';

  return (
    <div className="relative h-[40vh] min-h-[350px] mb-12 overflow-hidden bg-muted">
      {item.backdrop_path && (
        <img
          src={`${IMG_BASE}/original${item.backdrop_path}`}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />

      <div className="relative h-full flex flex-col justify-end p-8 md:p-12 max-w-2xl">
        <h1 className="text-display text-3xl md:text-5xl font-black uppercase text-foreground mb-3 tracking-tighter leading-tight">
          {title}
        </h1>
        <div className="flex items-center gap-3 mb-4 text-sm text-muted-foreground">
          {item.vote_average > 0 && (
            <span className="flex items-center gap-1">
              <Star className="w-4 h-4 text-primary fill-primary" />
              {item.vote_average.toFixed(1)}
            </span>
          )}
          <span>{(item.release_date || item.first_air_date || '').slice(0, 4)}</span>
        </div>
        <p className="text-sm text-secondary-foreground leading-relaxed line-clamp-3 mb-6">
          {item.overview}
        </p>
        <Link
          to={`/${type}/${item.id}`}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-bold text-xs uppercase tracking-widest w-fit hover:opacity-90 transition-opacity"
        >
          <Play className="w-4 h-4 fill-current" />
        </Link>
      </div>
    </div>
  );
}
