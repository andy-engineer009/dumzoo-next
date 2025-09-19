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
      
      // Trigger callback when element becomes visible and hasn't been triggered recently
      if (isNowIntersecting && !isTriggeredRef.current) {
        console.log('🎯 useInfiniteScroll: Triggering callback', { isNowIntersecting, wasIntersecting, isTriggered: isTriggeredRef.current });
        isTriggeredRef.current = true;
        callbackRef.current();
      }
      
      // Reset trigger flag when element is no longer intersecting
      if (!isNowIntersecting) {
        console.log('🎯 useInfiniteScroll: Resetting trigger flag', { isNowIntersecting });
        isTriggeredRef.current = false;
      }
    },
    [isIntersecting]
  );

  useEffect(() => {
    console.log('🎯 useInfiniteScroll: Creating observer', { threshold, rootMargin });
    
    const observer = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin,
    });

    const currentRef = ref.current;
    if (currentRef) {
      console.log('🎯 useInfiniteScroll: Observing element', { element: currentRef, rect: currentRef.getBoundingClientRect() });
      observer.observe(currentRef);
    } else {
      console.log('🎯 useInfiniteScroll: No ref found, will retry');
      // Retry when ref becomes available
      const checkRef = () => {
        if (ref.current) {
          console.log('🎯 useInfiniteScroll: Ref now available, observing');
          observer.observe(ref.current);
        } else {
          setTimeout(checkRef, 100);
        }
      };
      setTimeout(checkRef, 100);
    }

    return () => {
      console.log('🎯 useInfiniteScroll: Cleaning up observer');
      if (currentRef) {
        observer.unobserve(currentRef);
      }
      observer.disconnect();
    };
  }, [threshold, rootMargin]);

  return { isIntersecting, ref };
};
