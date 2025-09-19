import { useState, useEffect, useRef, useCallback } from 'react';

interface UseHeaderScrollOptions {
  threshold?: number;
  hideAfterPx?: number;
}

export const useHeaderScroll = (options: UseHeaderScrollOptions = {}) => {
  const { threshold = 10, hideAfterPx = 50 } = options;
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollYRef = useRef(0);
  const tickingRef = useRef(false);

  const handleScroll = useCallback(() => {
    if (tickingRef.current) return;
    
    tickingRef.current = true;
    
    requestAnimationFrame(() => {
      const currentScrollY = window.scrollY;
      const lastScrollY = lastScrollYRef.current;
      
      // Only process if scroll position changed significantly
      if (Math.abs(currentScrollY - lastScrollY) < threshold) {
        tickingRef.current = false;
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
      tickingRef.current = false;
    });
  }, [threshold, hideAfterPx]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  return isVisible;
};
