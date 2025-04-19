import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Start with the current match state on client
    if (typeof window !== 'undefined') {
      const media = window.matchMedia(query);
      if (media.matches !== matches) {
        setMatches(media.matches);
      }
      
      // Add listener for changes
      const listener = () => {
        setMatches(media.matches);
      };
      
      // Modern approach using addEventListener
      media.addEventListener("change", listener);
      return () => media.removeEventListener("change", listener);
    }
    
    // Default to false on server
    return () => {};
  }, [matches, query]);

  return matches;
} 