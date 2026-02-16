import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Film } from 'lucide-react';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackText?: string;
}

/**
 * SafeImage Component
 * Handles image loading states, provides a blur placeholder, and 
 * renders a consistent fallback if the source fails to load.
 */
export default function SafeImage({ src, alt, className, fallbackText, ...props }: SafeImageProps) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (!src || error) {
    return (
      <div className={cn(
        "w-full h-full flex flex-col items-center justify-center bg-secondary/50 text-muted-foreground gap-2 p-4",
        className
      )}>
        <Film className="w-8 h-8 opacity-20" />
        <span className="text-[10px] font-black uppercase tracking-widest text-center">
          {fallbackText || "No Preview Available"}
        </span>
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden bg-muted/20", className)}>
      {/* Placeholder Blur Box */}
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-white/5 backdrop-blur-sm" />
      )}
      <img
        src={src}
        alt={alt}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-500",
          loaded ? "opacity-100" : "opacity-0"
        )}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        loading="lazy"
        {...props}
      />
    </div>
  );
}