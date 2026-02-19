import { Search, X, ArrowLeft, Loader2 } from 'lucide-react';
import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { moviesApi, normalizeSearchItem } from '@/lib/pitbox';
import { useDebounce } from '@/hooks/use-debounce';
import MediaCard from '@/components/MediaCard';
import SEO from '@/components/SEO';
import { DiscoverGridSkeleton } from '@/components/skeletons';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [value, setValue] = useState(initialQuery);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debouncedQuery = useDebounce(value.trim(), 400);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (debouncedQuery) {
      setSearchParams({ q: debouncedQuery }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  }, [debouncedQuery, setSearchParams]);

  // Fetch suggestions while typing
  const { data: suggestions } = useQuery({
    queryKey: ['search-suggestions', value],
    queryFn: () => moviesApi.suggest(value),
    enabled: value.length > 1,
    staleTime: 1000 * 60,
  });

  // Fetch ultimate search results (Movies + Series)
  const { data: searchResults, isLoading } = useQuery({
    queryKey: ['ultimate-search', debouncedQuery],
    queryFn: () => moviesApi.search(debouncedQuery),
    enabled: debouncedQuery.length > 1,
  });

  const results = useMemo(() => {
    return (searchResults || []).map(normalizeSearchItem);
  }, [searchResults]);

  const handleSelectSuggestion = (suggestion: string) => {
    setValue(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Search"
        description="Search for movies, series, and content on PitBox. Find your next favorite film or TV show."
        canonicalPath="/search"
        noindex={true}
      />
      {/* Search header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="shrink-0 w-9 h-9 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              ref={inputRef}
              value={value}
              onFocus={() => setShowSuggestions(true)}
              onChange={(e) => {
                setValue(e.target.value);
                setShowSuggestions(true);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') setShowSuggestions(false);
              }}
              placeholder="Search movies & series..."
              className="w-full bg-secondary text-foreground text-sm pl-10 pr-10 py-2.5 rounded-lg border border-border focus:border-primary focus:outline-none placeholder:text-muted-foreground transition-colors"
            />
            {value && (
              <button
                onClick={() => setValue('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Suggestions dropdown */}
            {showSuggestions && suggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-secondary border border-border shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200 z-[100]">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelectSuggestion(s.name)}
                    className="w-full text-left px-4 py-3 text-sm hover:bg-primary/10 hover:text-primary transition-colors flex items-center gap-3 border-b border-white/5 last:border-0"
                  >
                    <Search className="w-3.5 h-3.5 opacity-50" />
                    <span className="font-bold uppercase tracking-widest text-[10px]">{s.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results */}
      <div
        className="pt-24 px-4 max-w-3xl mx-auto pb-16"
        onClick={() => setShowSuggestions(false)}
      >
        {isLoading && debouncedQuery.length > 1 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em] mb-6">
              <Loader2 className="w-3 h-3 animate-spin text-primary" />
              Scanning PitBox Database...
            </div>
            <DiscoverGridSkeleton count={12} />
          </div>
        )}

        {!isLoading && debouncedQuery.length > 1 && results.length === 0 && (
          <div className="text-center py-20 flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-secondary/50 flex items-center justify-center">
              <X className="w-6 h-6 text-muted-foreground" />
            </div>
            <div>
              <p className="text-foreground font-black uppercase tracking-[0.2em] text-[10px]">No Results Found</p>
              <p className="text-muted-foreground text-[9px] font-bold uppercase mt-2 tracking-widest opacity-50">Nothing matches "{debouncedQuery}"</p>
            </div>
          </div>
        )}

        {debouncedQuery.length <= 1 && !value && (
          <div className="text-center py-20">
            <Search className="w-10 h-10 text-muted-foreground/20 mx-auto mb-6" />
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/60">Search movies & series</p>
          </div>
        )}

        {results.length > 0 && (
          <div className="animate-in fade-in duration-500">
            <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
              <div>
                <h2 className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Search Results</h2>
                <p className="text-[9px] text-muted-foreground font-black uppercase mt-1 tracking-widest opacity-50">
                  {results.length} items found for "{debouncedQuery}"
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-8 md:gap-y-12">
              {results.map((item) => (
                <div key={`${item.type}-${item.id}`} className="space-y-3 group">
                  <MediaCard item={item} size="md" />
                  <div className="flex flex-col gap-1.5 px-0.5">
                    <div className="flex items-center gap-2">
                      {item.type === 'serie' ? (
                        <Badge className="bg-blue-600/10 text-blue-500 border border-blue-500/20">Series</Badge>
                      ) : (
                        <Badge className="bg-primary/10 text-primary border border-primary/20">Movie</Badge>
                      )}
                      <span className="text-[9px] font-black text-muted-foreground uppercase truncate tracking-widest opacity-60">
                        {item.release_date?.split('-')[0]}
                      </span>
                    </div>
                    {item.vj_name && (
                      <span className="text-[8px] font-black text-foreground/40 uppercase tracking-[0.15em] truncate">
                        VJ: {item.vj_name}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex items-center justify-center px-2 py-0.5 text-[8px] font-black uppercase tracking-tighter ${className}`}>
      {children}
    </div>
  );
}
