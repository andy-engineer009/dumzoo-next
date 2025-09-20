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
    console.log('🚀 Loading initial data...', { pageSize });
    setIsInitialLoading(true);
    setError(null);

    try {
      console.log('📞 Calling fetchFunction with page 0, limit:', pageSize);
      const result = await fetchFunction(0, pageSize);
      console.log('✅ Initial data loaded:', { 
        dataLength: result.data.length, 
        hasMore: result.hasMore,
        result 
      });
      setItems(result.data);
      setHasMore(result.hasMore);
      setCurrentPage(0);
    } catch (err: any) {
      console.error('💥 Error loading initial data:', err);
      setError(err.message || 'Failed to load data');
    } finally {
      setIsInitialLoading(false);
    }
  }, [fetchFunction, pageSize]);

  // Load more data
  const loadMore = useCallback(async () => {
    console.log('🔄 loadMore called', { isLoading, hasMore, currentPage });
    
    if (isLoading || !hasMore) {
      console.log('🚫 loadMore blocked', { isLoading, hasMore });
      return;
    }

    // IMMEDIATE loading state - no delays
    setIsLoading(true);
    setError(null);
    console.log('⏳ Starting to load more data...');

    try {
      const nextPage = currentPage + 1;
      console.log('📞 Fetching page:', nextPage, 'with limit:', pageSize);
      const result = await fetchFunction(nextPage, pageSize);
      console.log('✅ Fetch result:', { 
        dataLength: result.data.length, 
        hasMore: result.hasMore,
        result 
      });
      
      setItems(prevItems => {
        const newItems = [...prevItems, ...result.data];
        console.log('📊 Updated items count:', newItems.length);
        
        // Keep all items - no auto-cleanup
        return newItems;
      });
      
      setCurrentPage(nextPage);
      setHasMore(result.hasMore);
      console.log('✅ Load more completed successfully');
    } catch (err: any) {
      console.error('💥 Error loading more data:', err);
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

    // IMMEDIATE prefetching state - no delays
    setIsPrefetching(true);
    
    try {
      const nextPage = currentPage + 1;
      const result = await fetchFunction(nextPage, pageSize);
      
      // Store prefetched data for immediate use
      setItems(prevItems => {
        const newItems = [...prevItems, ...result.data];
        
        // Keep all items - no auto-cleanup
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

  // Simple scroll listener instead of Intersection Observer
  useEffect(() => {
    const handleScroll = () => {
      if (isLoading || !hasMore) return;

      const scrollTop = window.pageYOffset;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Load more when user is 200px from bottom
      if (scrollTop + windowHeight >= documentHeight - 200) {
        console.log('🔄 Scroll detected - loading more data');
        loadMoreRef.current?.();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoading, hasMore]);

  // Intersection Observer setup - Fallback
  useEffect(() => {
    if (!observerRef.current) return;

    observer.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMore && !isLoading && !isPrefetching) {
          console.log('🔄 Intersection Observer - loading more data');
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
      }
    };
  }, [hasMore, isLoading, isPrefetching]);

  // Load initial data on mount
  useEffect(() => {
    loadInitialData();
  }, []);


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
