import { useState, useEffect, useRef } from 'react';
import { useScrollManager } from './useScrollManager';

interface UseHeaderScrollOptions {
  threshold?: number;
  hideAfterPx?: number;
}

export const useHeaderScroll = (options: UseHeaderScrollOptions = {}) => {
  const { threshold = 10, hideAfterPx = 50 } = options;
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollYRef = useRef(0);

  // Use the centralized scroll manager
  const scrollData = useScrollManager({
    onScroll: (data) => {
      const currentScrollY = data.position;
      const lastScrollY = lastScrollYRef.current;
      
      // Only process if scroll position changed significantly
      if (Math.abs(currentScrollY - lastScrollY) < threshold) {
        return;
      }
      
      // Hide header when scrolling down and past hideAfterPx
      if (currentScrollY > lastScrollY && currentScrollY > hideAfterPx) {
        setIsVisible(false);
      } 
      // Show header when scrolling up
      else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }
      
      lastScrollYRef.current = currentScrollY;
    },
    priority: 2 // Lower priority than main scroll
  });

  return isVisible;
};
