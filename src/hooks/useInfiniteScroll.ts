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
  const { threshold = 0.1, rootMargin = '100px' } = options;
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      const wasIntersecting = isIntersecting;
      const isNowIntersecting = entry.isIntersecting;
      
      setIsIntersecting(isNowIntersecting);
      
      // Only trigger callback when element becomes visible (not when it becomes hidden)
      if (isNowIntersecting && !wasIntersecting) {
        callback();
      }
    },
    [callback, isIntersecting]
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
