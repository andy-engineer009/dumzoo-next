import { useState, useEffect, useRef, useCallback } from 'react';

interface ScrollData {
  position: number;
  direction: 'up' | 'down';
  isAtTop: boolean;
  isAtBottom: boolean;
  velocity: number;
}

interface UseOptimizedScrollOptions {
  throttleMs?: number;
  onScroll?: (scrollData: ScrollData) => void;
  savePosition?: boolean;
}

export const useOptimizedScroll = (options: UseOptimizedScrollOptions = {}) => {
  const { throttleMs = 100, onScroll, savePosition = false } = options;
  
  const [scrollData, setScrollData] = useState<ScrollData>({
    position: 0,
    direction: 'down',
    isAtTop: true,
    isAtBottom: false,
    velocity: 0
  });
  
  const lastPositionRef = useRef(0);
  const lastTimeRef = useRef(Date.now());
  const throttleRef = useRef<NodeJS.Timeout>();
  const isThrottlingRef = useRef(false);

  const updateScrollData = useCallback(() => {
    const currentTime = Date.now();
    const currentPosition = window.scrollY;
    const timeDiff = currentTime - lastTimeRef.current;
    const positionDiff = currentPosition - lastPositionRef.current;
    
    // Only update if position actually changed to prevent unnecessary re-renders
    if (Math.abs(positionDiff) < 1) {
      isThrottlingRef.current = false;
      return;
    }
    
    // Calculate velocity (pixels per second)
    const velocity = timeDiff > 0 ? Math.abs(positionDiff) / (timeDiff / 1000) : 0;
    
    const newScrollData: ScrollData = {
      position: currentPosition,
      direction: currentPosition > lastPositionRef.current ? 'down' : 'up',
      isAtTop: currentPosition < 100,
      isAtBottom: currentPosition + window.innerHeight >= document.body.scrollHeight - 100,
      velocity
    };
    
    setScrollData(newScrollData);
    
    // Call optional callback
    if (onScroll) {
      onScroll(newScrollData);
    }
    
    // Save position to sessionStorage if requested (lightweight alternative to Redux)
    if (savePosition) {
      sessionStorage.setItem('scrollPosition', currentPosition.toString());
    }
    
    lastPositionRef.current = currentPosition;
    lastTimeRef.current = currentTime;
    isThrottlingRef.current = false;
  }, [onScroll, savePosition]);

  const handleScroll = useCallback(() => {
    if (isThrottlingRef.current) return;
    
    isThrottlingRef.current = true;
    throttleRef.current = setTimeout(updateScrollData, throttleMs);
  }, [updateScrollData, throttleMs]);

  useEffect(() => {
    // Use passive listener for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Restore scroll position if requested
    if (savePosition) {
      const savedPosition = sessionStorage.getItem('scrollPosition');
      if (savedPosition && parseInt(savedPosition) > 0) {
        // Use requestAnimationFrame to ensure DOM is ready
        requestAnimationFrame(() => {
          window.scrollTo(0, parseInt(savedPosition));
        });
      }
    }
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (throttleRef.current) {
        clearTimeout(throttleRef.current);
      }
    };
  }, [handleScroll, savePosition]);

  return scrollData;
};
