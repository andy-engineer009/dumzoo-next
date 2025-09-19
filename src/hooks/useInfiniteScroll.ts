import { useState, useEffect, useCallback, useRef } from 'react';

interface UseInfiniteScrollOptions {
  threshold?: number;
  rootMargin?: string;
}

interface UseInfiniteScrollReturn {
  isIntersecting: boolean;
  ref: React.RefObject<HTMLDivElement | null>;
}

export const useInfiniteScroll = (
  callback: () => void,
  options: UseInfiniteScrollOptions = {}
): UseInfiniteScrollReturn => {
  const { threshold = 0.1, rootMargin = '200px' } = options;
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const callbackRef = useRef(callback);
  const isTriggeredRef = useRef(false);

  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      const wasIntersecting = isIntersecting;
      const isNowIntersecting = entry.isIntersecting;
      
      setIsIntersecting(isNowIntersecting);
      
      // Only trigger callback when element becomes visible and hasn't been triggered recently
      if (isNowIntersecting && !wasIntersecting && !isTriggeredRef.current) {
        isTriggeredRef.current = true;
        callbackRef.current();
        
        // Reset trigger flag after a short delay to prevent rapid firing
        setTimeout(() => {
          isTriggeredRef.current = false;
        }, 1000);
      }
    },
    [isIntersecting]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin,
    });

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [handleIntersection, threshold, rootMargin]);

  return { isIntersecting, ref };
};
