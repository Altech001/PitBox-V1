import type { Movie } from '@/lib/tmdb';
import MediaCard from './MediaCard';
import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  title: string;
  items: Movie[];
}

export default function MediaRow({ title, items }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!items.length) return null;

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left'
        ? scrollLeft - clientWidth * 0.8
        : scrollLeft + clientWidth * 0.8;

      scrollRef.current.scrollTo({
        left: scrollTo,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="mb-8 md:mb-12 group/row relative">
      <div className="flex items-center justify-between mb-4 md:mb-6 px-1">
        <div className="flex items-center gap-3 group/title cursor-default">
          <div className="w-1 h-6 bg-primary rounded-none" />
          <h2 className="text-display text-sm md:text-md font-bold text-white">
            {title}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <div className="md:flex items-center gap-1 bg-secondary/50 p-1 rounded-full border border-white/5">
            <button
              onClick={() => scroll('left')}
              className="p-1 px-2 hover:text-primary transition-colors text-muted-foreground border-r border-white/5"
              aria-label="Previous"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-1 px-2 hover:text-primary transition-colors text-muted-foreground"
              aria-label="Next"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          {/* <button className="text-[10px] md:text-xs text-primary font-bold px-3 py-1 uppercase tracking-widest hover:bg-primary/10 transition-colors border border-primary/20">
            See All
          </button> */}
        </div>
      </div>

      <div className="relative group/row-content -mx-4 md:mx-0">
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-0 bottom-4 z-20 w-16 bg-gradient-to-r from-background to-transparent hidden md:flex items-center justify-start pl-4 opacity-0 group-hover/row-content:opacity-100 transition-opacity"
          aria-label="Scroll left"
        >
          <div className="bg-black/80 backdrop-blur-xl p-3 rounded-full border border-white/10 text-white hover:scale-110 hover:border-primary/50 hover:text-primary transition-all shadow-2xl">
            <ChevronLeft className="w-5 h-5" />
          </div>
        </button>

        <div
          ref={scrollRef}
          className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide pb-6 scroll-smooth px-4 md:px-1"
        >
          {items.map((item) => (
            <div key={item.id} className="w-32 sm:w-40 md:w-48 shrink-0">
              <MediaCard item={item} />
            </div>
          ))}
        </div>

        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-0 bottom-4 z-20 w-16 bg-gradient-to-l from-background to-transparent hidden md:flex items-center justify-end pr-4 opacity-0 group-hover/row-content:opacity-100 transition-opacity"
          aria-label="Scroll right"
        >
          <div className="bg-black/80 backdrop-blur-xl p-3 rounded-full border border-white/10 text-white hover:scale-110 hover:border-primary/50 hover:text-primary transition-all shadow-2xl">
            <ChevronRight className="w-5 h-5" />
          </div>
        </button>
      </div>
    </section>
  );
}
