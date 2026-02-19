import { useState, useEffect } from 'react';

/**
 * Custom hook to manage responsive column count
 * Prevents hydration mismatches and centralizes breakpoint logic
 */
export function useResponsiveColumns() {
  // Start with a sensible default (desktop)
  // This matches the server-rendered state
  const [columnCount, setColumnCount] = useState(6);

  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth;
      
      if (width < 640) {
        // Mobile: 3 columns
        setColumnCount(3);
      } else if (width < 768) {
        // Small tablets: 4 columns (sm:grid-cols-4)
        setColumnCount(4);
      } else if (width < 1024) {
        // Medium tablets: 5 columns (md:grid-cols-5)
        setColumnCount(5);
      } else {
        // Desktop: 6 columns (lg:grid-cols-6)
        setColumnCount(6);
      }
    };

    // Initial measurement on mount
    updateColumns();

    // Debounced resize handler for performance
    let timeoutId: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateColumns, 150);
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  return columnCount;
}