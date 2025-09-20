'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface InfiniteScrollOptions {
  threshold?: number;
  rootMargin?: string;
  pageSize?: number;
  maxItems?: number;
  prefetchDistance?: number;
}

interface InfiniteScrollResult<T> {
  items: T[];
  isLoading: boolean;
  isInitialLoading: boolean;
  hasMore: boolean;
  error: string | null;
  loadMore: () => void;
  reset: () => void;
  observerRef: React.RefObject<HTMLDivElement | null>;
  currentPage: number;
}

export function useInfiniteScroll<T>(
  fetchFunction: (page: number, limit?: number) => Promise<{
    data: T[];
    hasMore: boolean;
    totalPages?: number;
  }>,
  options: InfiniteScrollOptions = {}
): InfiniteScrollResult<T> {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px 200px 0px',
    pageSize = 10,
    maxItems = 200,
    prefetchDistance = 5
  } = options;

  // State management
  const [items, setItems] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isPrefetching, setIsPrefetching] = useState(false);

  // Refs
  const observerRef = useRef<HTMLDivElement | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  const prefetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const loadMoreRef = useRef<() => void>(() => {});

  // Load initial data
  const loadInitialData = useCallback(async () => {
    setIsInitialLoading(true);
    setError(null);

    try {
      const result = await fetchFunction(0, pageSize);
      setItems(result.data);
      setHasMore(result.hasMore);
      setCurrentPage(0);
    } catch (err: any) {
      console.error('Error loading initial data:', err);
      setError(err.message || 'Failed to load data');
    } finally {
      setIsInitialLoading(false);
    }
  }, [fetchFunction, pageSize]);

  // Load more data
  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const nextPage = currentPage + 1;
      const result = await fetchFunction(nextPage, pageSize);
      
      setItems(prevItems => {
        const newItems = [...prevItems, ...result.data];
        return newItems;
      });
      
      setCurrentPage(nextPage);
      setHasMore(result.hasMore);
    } catch (err: any) {
      console.error('Error loading more data:', err);
      setError(err.message || 'Failed to load more data');
    } finally {
      setIsLoading(false);
    }
  }, [fetchFunction, currentPage, pageSize, maxItems, isLoading, hasMore]);

  // Update ref to latest loadMore function
  loadMoreRef.current = loadMore;


  // Prefetch next batch when user is close to bottom
  const prefetchNextBatch = useCallback(async () => {
    if (isPrefetching || !hasMore) return;

    setIsPrefetching(true);
    
    try {
      const nextPage = currentPage + 1;
      const result = await fetchFunction(nextPage, pageSize);
      
      setItems(prevItems => {
        const newItems = [...prevItems, ...result.data];
        return newItems;
      });
      
      setCurrentPage(nextPage);
      setHasMore(result.hasMore);
    } catch (err) {
      console.error('Error prefetching data:', err);
    } finally {
      setIsPrefetching(false);
    }
  }, [fetchFunction, currentPage, pageSize, maxItems, isPrefetching, hasMore]);

  // Reset function
  const reset = useCallback(() => {
    setItems([]);
    setCurrentPage(0);
    setHasMore(true);
    setIsLoading(false);
    setIsInitialLoading(true);
    setIsPrefetching(false);
    setError(null);
    
    if (prefetchTimeoutRef.current) {
      clearTimeout(prefetchTimeoutRef.current);
    }
  }, []);

  // Intersection Observer setup - Primary method
  useEffect(() => {
    // Clean up previous observer
    if (observer.current) {
      observer.current.disconnect();
      observer.current = null;
    }

    // Only set up observer if we have a target element and should load more
    if (!observerRef.current || !hasMore || isLoading || isPrefetching) {
      return;
    }

    observer.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        
        if (entry.isIntersecting && hasMore && !isLoading && !isPrefetching) {
          loadMoreRef.current?.();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px 200px 0px'
      }
    );

    observer.current.observe(observerRef.current);

    return () => {
      if (observer.current) {
        observer.current.disconnect();
        observer.current = null;
      }
    };
  }, [hasMore, isLoading, isPrefetching, observerRef.current]);

  // Fallback: Manual scroll detection if Intersection Observer fails
  useEffect(() => {
    const handleScroll = () => {
      if (isLoading || !hasMore || !observerRef.current) return;

      const rect = observerRef.current.getBoundingClientRect();
      const isVisible = rect.top <= window.innerHeight && rect.bottom >= 0;
      
      if (isVisible) {
        loadMoreRef.current?.();
      }
    };

    // Only add fallback if Intersection Observer is not working
    const timeoutId = setTimeout(() => {
      if (!observer.current && hasMore && !isLoading) {
        window.addEventListener('scroll', handleScroll, { passive: true });
      }
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [hasMore, isLoading, observerRef.current]);

  // Load initial data on mount and when fetchFunction changes
  useEffect(() => {
    // Reset items when fetchFunction changes (e.g., when filters change)
    setItems([]);
    setCurrentPage(0);
    setHasMore(true);
    setIsInitialLoading(true);
    setIsLoading(false);
    setError(null);
    
    // Scroll to top when filters change (instant, no animation)
    window.scrollTo(0, 0);
    
    loadInitialData();
  }, [loadInitialData]);


  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (prefetchTimeoutRef.current) {
        clearTimeout(prefetchTimeoutRef.current);
      }
    };
  }, []);

  return {
    items,
    isLoading: isLoading || isPrefetching,
    isInitialLoading,
    hasMore,
    error,
    loadMore,
    reset,
    observerRef,
    currentPage
  };
}
