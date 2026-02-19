import { IMG_BASE, type Movie } from '@/lib/tmdb';
import { Star, Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { Button } from './ui/button';

interface Props {
  items: (Movie & { poster_url?: string | null })[];
}

function getBackdropUrl(item: Props['items'][0]): string | null {
  // PitBox: use poster_url directly
  if (item.poster_url && item.poster_url.startsWith('http')) {
    return item.poster_url;
  }
  // TMDB: backdrop_path or poster_path
  if (item.backdrop_path && item.backdrop_path.startsWith('/')) {
    return `${IMG_BASE}/original${item.backdrop_path}`;
  }
  // Full URL in backdrop_path (normalized PitBox)
  if (item.backdrop_path && item.backdrop_path.startsWith('http')) {
    return item.backdrop_path;
  }
  return null;
}

export default function HeroCarousel({ items }: Props) {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const heroes = items.filter((m) => getBackdropUrl(m)).slice(0, 6);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % heroes.length);
  }, [heroes.length]);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + heroes.length) % heroes.length);
  }, [heroes.length]);

  useEffect(() => {
    if (heroes.length <= 1) return;
    const interval = setInterval(next, 6000);
    return () => clearInterval(interval);
  }, [next, heroes.length]);

  if (!heroes.length) return null;

  const item = heroes[current];
  const title = item.title || item.name || '';
  const type = item.media_type === 'tv' || item.first_air_date ? 'series' : 'movie';
  const backdropUrl = getBackdropUrl(item);

  return (
    <div className="relative h-[55vh] md:h-[60vh] min-h-[380px] mb-12 overflow-hidden bg-black/90">
      {/* Blurred background fill — creates cinematic atmosphere */}
      {heroes.map((hero, i) => (
        <img
          key={`bg-${hero.id}`}
          src={getBackdropUrl(hero) || ''}
          alt={`Background for ${hero.title || hero.name || 'featured movie'}`}
          className={`absolute inset-0 w-full h-full object-cover scale-110 brightness-[0.2] transition-opacity duration-700 ${i === current ? 'opacity-100' : 'opacity-0'
            }`}
        />
      ))}

      {/* Main layout: content left, poster right */}
      <div className="relative h-full flex items-end md:items-center">
        {/* Full poster image — fixed position on the right */}
        <div className="absolute right-4 md:right-12 top-0 h-full w-[50%] md:w-[35%]">
          {heroes.map((hero, i) => (
            <img
              key={`poster-${hero.id}`}
              src={getBackdropUrl(hero) || ''}
              alt={`${hero.title || hero.name || 'Movie'} poster`}
              className={`absolute top-1/2 right-0 -translate-y-1/2 h-[85%] md:h-[90%] w-auto max-w-full object-contain rounded-lg shadow-2xl shadow-black/50 transition-opacity duration-700 ${i === current ? 'opacity-100' : 'opacity-0'
                }`}
            />
          ))}
        </div>

        {/* Gradient over poster area for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent md:hidden" />

        {/* Content — left side */}
        <div className="relative z-10 flex flex-col justify-end md:justify-center p-6 pb-10 md:p-12 max-w-[60%] md:max-w-lg">
          <h1
            key={item.id}
            className="text-2xl font-rye md:text-5xl font-normal not-italic uppercase text-foreground mb-3 tracking-tightest animate-fade-in drop-shadow-lg"
          >
            {title}
          </h1>
          <div className="flex items-center gap-3 mb-3 text-sm text-muted-foreground">
            {item.vote_average > 0 && (
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 text-primary fill-primary" />
                {item.vote_average.toFixed(1)}
              </span>
            )}
            <span>{(item.release_date || item.first_air_date || '').slice(0, 4)}</span>
          </div>
          <p key={`ov-${item.id}`} className="text-sm text-secondary-foreground/90 leading-relaxed line-clamp-2 md:line-clamp-3 mb-5 animate-fade-in hidden md:block">
            {(item.overview || '').slice(0, 120)}
          </p>
          <div className="flex gap-2">
            <Link
              to={`/${type}/${item.id}`}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground p-3 rounded-full font-bold text-xs uppercase tracking-widest w-fit hover:opacity-90 transition-opacity"
            >
              <Play className="w-5 h-5 fill-current" />
            </Link>
            <Button className="rounded-none hidden md:flex" onClick={() => navigate(`/${type}/${item.id}`)}>
              Watch Now
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation arrows */}
      {heroes.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-background/40 backdrop-blur-sm flex items-center justify-center text-foreground/70 hover:text-foreground hover:bg-background/60 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-background/40 backdrop-blur-sm flex items-center justify-center text-foreground/70 hover:text-foreground hover:bg-background/60 transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Indicators */}
      {heroes.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
          {heroes.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1 rounded-full transition-all duration-300 ${i === current ? 'w-6 bg-primary' : 'w-2 bg-foreground/30'
                }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
