import React, { useRef, useEffect, useState } from 'react';
import { useWindowVirtualizer } from '@tanstack/react-virtual';
import MediaCard from './MediaCard';

interface VirtualGridProps {
  items: any[];
  columns?: number;
}

/**
 * VirtualGrid - Optimized Window Scroll Version
 * 
 * Key improvements:
 * - Proper gap handling in size calculations
 * - More accurate height estimation
 * - Better positioning with measurement tracking
 * - Defensive rendering to prevent layout breaks
 */
export default function VirtualGrid({ items, columns = 6 }: VirtualGridProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  const [offsetTop, setOffsetTop] = useState(0);
  const [cardHeight, setCardHeight] = useState(350); // Will be measured

  // Measure the grid's position from viewport top
  useEffect(() => {
    const measureOffset = () => {
      if (parentRef.current) {
        const rect = parentRef.current.getBoundingClientRect();
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        setOffsetTop(rect.top + scrollTop);
      }
    };

    measureOffset();
    
    // Remeasure on window resize (debounced)
    let timeoutId: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(measureOffset, 100);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  // Measure actual card height from first rendered card
  useEffect(() => {
    const measureCardHeight = () => {
      if (parentRef.current) {
        const firstCard = parentRef.current.querySelector('[data-card]');
        if (firstCard) {
          const height = firstCard.getBoundingClientRect().height;
          // Add gap (3 or 4 based on breakpoint - use average)
          const estimatedGap = 14; // Between md:gap-4 (16px) and gap-3 (12px)
          setCardHeight(height + estimatedGap);
        }
      }
    };

    // Measure after initial render
    const timeoutId = setTimeout(measureCardHeight, 100);
    return () => clearTimeout(timeoutId);
  }, [columns]);

  const rowCount = Math.ceil(items.length / columns);

  const rowVirtualizer = useWindowVirtualizer({
    count: rowCount,
    estimateSize: () => cardHeight,
    overscan: 3, // Reduced from 5 for better performance
    scrollMargin: offsetTop,
  });

  const virtualItems = rowVirtualizer.getVirtualItems();

  return (
    <div ref={parentRef} className="w-full">
      <div
        className="relative w-full"
        style={{ 
          height: `${rowVirtualizer.getTotalSize()}px`,
          minHeight: '350px' // Prevent collapse during initial render
        }}
      >
        {virtualItems.map((virtualRow) => {
          const startIndex = virtualRow.index * columns;
          const rowItems = items.slice(startIndex, startIndex + columns);

          // Don't render empty rows
          if (rowItems.length === 0) return null;

          return (
            <div
              key={virtualRow.key}
              className="absolute top-0 left-0 w-full grid gap-3 md:gap-4"
              style={{
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start - rowVirtualizer.options.scrollMargin}px)`,
                gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
              }}
            >
              {rowItems.map((item) => (
                <div key={item.id} className="h-full" data-card>
                  <MediaCard item={item} size="sm" />
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}