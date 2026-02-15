import { Search, X } from 'lucide-react';
import { useState } from 'react';

interface Props {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: Props) {
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(value.trim());
  };

  const clear = () => {
    setValue('');
    onSearch('');
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-md">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search movies & series..."
        className="w-full bg-secondary text-foreground text-sm pl-10 pr-10 py-2.5 rounded-lg border border-border focus:border-primary focus:outline-none placeholder:text-muted-foreground transition-colors"
      />
      {value && (
        <button type="button" onClick={clear} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
          <X className="w-4 h-4" />
        </button>
      )}
    </form>
  );
}
