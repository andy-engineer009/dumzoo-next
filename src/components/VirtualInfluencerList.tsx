'use client';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useInfiniteQuery } from '@tanstack/react-query';
import React, { useState, useEffect, useCallback } from 'react';
import InfluencerCard from "@/components/influencer/InfulancerCard";
import { influencerApi } from '@/services/infiniteScrollApi';

interface VirtualInfluencerListProps {
  filters?: any;
}

export default function VirtualInfluencerList({ filters = {} }: VirtualInfluencerListProps) {
  // The scrollable element for your list
  const parentRef = React.useRef<HTMLDivElement>(null);
  const [scrollPos, setScrollPos] = useState(0); // ✅ Track scroll position

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
      console.log('🔄 API Call - Page:', pageParam, 'Filters:', filters);
      return influencerApi.fetchInfluencers(pageParam, 15, filters);
    },
    getNextPageParam: (lastPage: any, allPages: any[]) => {
      // Return next page number if there are more pages
      return lastPage.hasMore ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  // Flatten all pages into a single array for virtual scrolling
  const influencers = data?.pages.flatMap((page: any) => page.data) || [];

  // Debug logging
  useEffect(() => {
    console.log('📊 Data Status:', {
      hasData: !!data,
      pagesCount: data?.pages?.length || 0,
      totalInfluencers: influencers.length,
      hasNextPage,
      isFetchingNextPage,
      isLoading,
      lastPage: data?.pages?.[data?.pages?.length - 1]
    });
  }, [data, influencers.length, hasNextPage, isFetchingNextPage, isLoading]);

  // The virtualizer - handles virtual scrolling
  const rowVirtualizer = useVirtualizer({
    count: hasNextPage ? influencers.length + 1 : influencers.length, // Add 1 for loader row
    getScrollElement: () => parentRef.current,
    estimateSize: () => 130, // Height of each influencer card
    overscan: 5, // Render extra items for smooth scrolling
  });

  // ✅ Listen for scroll events and update scrollPos
  useEffect(() => {
    const el = parentRef.current;
    if (!el) return;

    const handleScroll = () => {
      // TanStack's internal offset is most accurate
      setScrollPos(rowVirtualizer.scrollOffset || 0);
    };

    el.addEventListener('scroll', handleScroll);
    return () => el.removeEventListener('scroll', handleScroll);
  }, [rowVirtualizer]);

  // 🔄 Infinite scroll logic - following TanStack official pattern
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
      console.log('🔄 Fetching next page (TanStack pattern)...');
      fetchNextPage();
    }
  }, [
    hasNextPage,
    fetchNextPage,
    influencers.length,
    isFetchingNextPage,
    rowVirtualizer.getVirtualItems(),
  ]);

  useEffect(() => {
    console.log('Current scroll position:', scrollPos);
  }, [scrollPos]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1fb036]"></div>
      </div>
    );
  }

  // Error state
  if (isError) {
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
          height: `130px`,
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
