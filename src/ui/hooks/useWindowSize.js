import { useState, useEffect } from 'react';

/**
 * Hook to track terminal window size
 *
 * Returns: { width, height, isMobile, isSmall, isMedium, isLarge }
 *
 * Breakpoints:
 * - Mobile: < 60 cols
 * - Small: 60-80 cols
 * - Medium: 80-120 cols
 * - Large: > 120 cols
 */
export function useWindowSize() {
  const [size, setSize] = useState({
    width: process.stdout.columns || 80,
    height: process.stdout.rows || 24
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: process.stdout.columns || 80,
        height: process.stdout.rows || 24
      });
    };

    process.stdout.on('resize', handleResize);

    return () => {
      process.stdout.off('resize', handleResize);
    };
  }, []);

  const isMobile = size.width < 60;
  const isSmall = size.width >= 60 && size.width < 80;
  const isMedium = size.width >= 80 && size.width < 120;
  const isLarge = size.width >= 120;

  return {
    width: size.width,
    height: size.height,
    isMobile,
    isSmall,
    isMedium,
    isLarge
  };
}

export default useWindowSize;
