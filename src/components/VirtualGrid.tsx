import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useWindowVirtualizer } from '@tanstack/react-virtual';
import MediaCard from './MediaCard';

interface VirtualGridProps {
  items: any[];
  columns?: number;
}

/**
 * VirtualGrid - Uses measureElement for pixel-perfect row heights.
 * No guessing or estimation — the virtualizer measures each row from the DOM.
 */
export default function VirtualGrid({ items, columns = 6 }: VirtualGridProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  const [offsetTop, setOffsetTop] = useState(0);

  // Measure the grid's offset from the top of the page
  useEffect(() => {
    const measureOffset = () => {
      if (parentRef.current) {
        const rect = parentRef.current.getBoundingClientRect();
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        setOffsetTop(rect.top + scrollTop);
      }
    };

    measureOffset();

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

  // Quick initial estimate based on viewport (only used before measurement)
  const estimateRowHeight = useCallback(() => {
    const vw = typeof window !== 'undefined' ? window.innerWidth : 1024;
    const containerWidth = Math.min(vw - 32, 1280);
    const gap = 16;
    const cardWidth = (containerWidth - gap * (columns - 1)) / columns;
    return cardWidth * 1.5 + 26; // aspect-[2/3] + text + small gap
  }, [columns]);

  const rowCount = Math.ceil(items.length / columns);

  const rowVirtualizer = useWindowVirtualizer({
    count: rowCount,
    estimateSize: estimateRowHeight,
    overscan: 3,
    scrollMargin: offsetTop,
  });

  const virtualItems = rowVirtualizer.getVirtualItems();

  return (
    <div ref={parentRef} className="w-full">
      <div
        className="relative w-full"
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          minHeight: '200px',
        }}
      >
        {virtualItems.map((virtualRow) => {
          const startIndex = virtualRow.index * columns;
          const rowItems = items.slice(startIndex, startIndex + columns);

          if (rowItems.length === 0) return null;

          return (
            <div
              key={virtualRow.key}
              ref={rowVirtualizer.measureElement}
              data-index={virtualRow.index}
              className="absolute top-0 left-0 w-full pb-6"
              style={{
                transform: `translateY(${virtualRow.start - rowVirtualizer.options.scrollMargin}px)`,
              }}
            >
              <div
                className="grid gap-x-3 md:gap-x-4"
                style={{
                  gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                }}
              >
                {rowItems.map((item) => (
                  <div key={item.id} data-card>
                    <MediaCard item={item} />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}