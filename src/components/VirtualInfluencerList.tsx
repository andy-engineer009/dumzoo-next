'use client';
import { useVirtualizer, elementScroll } from '@tanstack/react-virtual';
import { useInfiniteQuery } from '@tanstack/react-query';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import InfluencerCard from "@/components/influencer/InfulancerCard";
import { influencerApi } from '@/services/infiniteScrollApi';
import type { VirtualizerOptions } from '@tanstack/react-virtual';
import { setData, setScrollPosition, clearData } from '@/store/influencerCacheSlice';
import type { RootState } from '@/store/store';

interface VirtualInfluencerListProps {
  filters?: any;
}

// Redux selectors
const selectInfluencerCache = (state: RootState) => state.influencerCache;

// Smooth scroll easing function
function easeInOutQuint(t: number) {
  return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
}

export default function VirtualInfluencerList({ filters = {} }: VirtualInfluencerListProps) {
  // Redux
  const dispatch = useDispatch();
  const { data: cachedData, lastPage, scrollPosition, hasData } = useSelector(selectInfluencerCache);
  
  // The scrollable element for your list
  const parentRef = React.useRef<HTMLDivElement>(null);
  const scrollingRef = React.useRef<number | undefined>(undefined);
  const [scrollPos, setScrollPos] = useState(0);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isRestoringScroll = useRef(false);
  const hasRestoredScroll = useRef(false);
  const processedPagesRef = useRef<number>(0);

  // Custom smooth scroll function
  const scrollToFn: VirtualizerOptions<any, any>['scrollToFn'] =
    React.useCallback((offset, canSmooth, instance) => {
      const duration = 0;
      const start = parentRef.current?.scrollTop || 0;
      const startTime = (scrollingRef.current = Date.now());

      const run = () => {
        if (scrollingRef.current !== startTime) return;
        const now = Date.now();
        const elapsed = now - startTime;
        const progress = easeInOutQuint(Math.min(elapsed / duration, 1));
        const interpolated = start + (offset - start) * progress;

        if (elapsed < duration) {
          elementScroll(interpolated, canSmooth, instance);
          requestAnimationFrame(run);
        } else {
          elementScroll(interpolated, canSmooth, instance);
        }
      };

      requestAnimationFrame(run);
    }, []);

  // useInfiniteQuery for infinite scroll pagination
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error
  } = useInfiniteQuery({
    queryKey: ['influencers', filters],
    queryFn: ({ pageParam = 1 }: { pageParam: number }) => {
      // console.log('🔄 API Call - Page:', pageParam, 'Filters:', filters);
      return influencerApi.fetchInfluencers(pageParam, 15, filters);
    },
    getNextPageParam: (lastPage: any, allPages: any[]) => {
      return lastPage.hasMore ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    // Always enable - we'll handle data merging manually
  });

  // Merge cached data with new API data - prevent duplicates
  const influencers = React.useMemo(() => {
    if (hasData && data?.pages && data.pages.length > 0) {
      // We have cached data AND new API data - merge them carefully
      const newInfluencers = data.pages.flatMap((page: any) => page.data);
      
      // Create a Set of existing IDs to prevent duplicates
      const existingIds = new Set(cachedData.map((item: any) => item.id || item.uuid));
      const uniqueNewInfluencers = newInfluencers.filter((item: any) => 
        !existingIds.has(item.id || item.uuid)
      );
      
      return [...cachedData, ...uniqueNewInfluencers];
    } else if (hasData) {
      // Only cached data
      return cachedData;
    } else if (data?.pages && data.pages.length > 0) {
      // Only API data
      return data.pages.flatMap((page: any) => page.data);
    }
    return [];
  }, [hasData, cachedData, data]);

  // Save data when new data arrives
  useEffect(() => {
    if (data && data.pages.length > 0 && data.pages.length > processedPagesRef.current) {
      const allInfluencers = data.pages.flatMap((page: any) => page.data);
      const currentPage = data.pages.length;
      
      if (!hasData) {
        // First time - save to Redux
        dispatch(setData({ data: allInfluencers, lastPage: currentPage }));
        processedPagesRef.current = currentPage;
      } else {
        // We have cached data - merge and save (prevent duplicates)
        const existingIds = new Set(cachedData.map((item: any) => item.id || item.uuid));
        const uniqueNewInfluencers = allInfluencers.filter((item: any) => 
          !existingIds.has(item.id || item.uuid)
        );
        const mergedData = [...cachedData, ...uniqueNewInfluencers];
        
        // console.log('🔄 Merging data:', {
        //   cachedCount: cachedData.length,
        //   newCount: allInfluencers.length,
        //   uniqueNewCount: uniqueNewInfluencers.length,
        //   finalCount: mergedData.length,
        //   existingIds: Array.from(existingIds).slice(0, 5), // Show first 5 IDs
        //   newIds: allInfluencers.slice(0, 5).map((item: any) => item.id || item.uuid) // Show first 5 new IDs
        // });
        
        dispatch(setData({ data: mergedData, lastPage: currentPage }));
        processedPagesRef.current = currentPage;
      }
    }
  }, [data, hasData, cachedData, dispatch]);

  // The virtualizer - handles virtual scrolling with smooth scroll
  const rowVirtualizer = useVirtualizer({
    count: hasNextPage ? influencers.length + 1 : influencers.length, // Add 1 for loader row
    getScrollElement: () => parentRef.current,
    estimateSize: () => 130, // Height of each influencer card
    overscan: 5, // Render extra items for smooth scrolling
    scrollToFn, // Custom smooth scroll function
  });

  // Restore scroll position when data is loaded (only once)
  useEffect(() => {
    if (influencers.length > 0 && !hasRestoredScroll.current && scrollPosition > 0) {
      hasRestoredScroll.current = true;
      isRestoringScroll.current = true;
      // console.log('🔄 Restoring scroll position:', scrollPosition);
      setTimeout(() => {
        // Use useVirtualizer's scrollToOffset with smooth animation
        rowVirtualizer.scrollToOffset(scrollPosition, { align: 'start' });
        // console.log('✅ Scroll position restored to:', scrollPosition);
        isRestoringScroll.current = false;
      }, 100);
    }
  }, [influencers.length, rowVirtualizer, scrollPosition]);

  // Save scroll position with throttling
  useEffect(() => {
    const handleScroll = () => {
      if (isRestoringScroll.current) return;
      
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      
      scrollTimeoutRef.current = setTimeout(() => {
        if (!isRestoringScroll.current) {
          const position = rowVirtualizer.scrollOffset || 0;
          setScrollPos(position);
          dispatch(setScrollPosition(position));
          // console.log('💾 Saving scroll position to Redux:', position);
        }
      }, 300);
    };

    const element = parentRef.current;
    if (element) {
      element.addEventListener('scroll', handleScroll, { passive: true });
      return () => {
        element.removeEventListener('scroll', handleScroll);
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
      };
    }
  }, [influencers.length, rowVirtualizer, dispatch]);

  // 🔄 Infinite scroll logic - always enabled
  React.useEffect(() => {
    const [lastItem] = [...rowVirtualizer.getVirtualItems()].reverse();

    if (!lastItem) {
      return;
    }

    if (
      lastItem.index >= influencers.length - 1 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      // console.log('🔄 Fetching next page...');
      fetchNextPage();
    }
  }, [
    hasNextPage,
    fetchNextPage,
    influencers.length,
    isFetchingNextPage,
    rowVirtualizer.getVirtualItems(),
  ]);

  // Loading state - only show if no cached data
  if (isLoading && !hasData) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1fb036]"></div>
      </div>
    );
  }

  // Error state
  if (isError && !hasData) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-red-500">
          <p>Error loading influencers: {error?.message}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (influencers.length === 0) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-gray-500">
          <p>No influencers found</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={parentRef}
      style={{
        height: `80vh`,
        overflow: 'auto', // Make it scroll!
      }}
    >
      {/* The large inner element to hold all of the items */}
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {/* Only the visible items in the virtualizer, manually positioned to be in view */}
        {rowVirtualizer.getVirtualItems().map((virtualItem) => {
          const isLoaderRow = virtualItem.index > influencers.length - 1;
          const influencer = influencers[virtualItem.index];

          return (
            <div
              key={virtualItem.key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualItem.size}px`,
                transform: `translateY(${virtualItem.start}px)`,
              }}
              className="p-2"
            >
              {isLoaderRow ? (
                hasNextPage ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="flex items-center space-x-2 text-gray-500">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#1fb036]"></div>
                      <span>Loading more influencers...</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-gray-500 text-sm">
                      All caught up! No more influencers to load.
                    </div>
                  </div>
                )
              ) : influencer ? (
                <InfluencerCard data={influencer} />
              ) : (
                <div className="animate-pulse bg-gray-200 h-32 rounded"></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
