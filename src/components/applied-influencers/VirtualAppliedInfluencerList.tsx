'use client';

import { useVirtualizer, elementScroll } from '@tanstack/react-virtual';
import { useInfiniteQuery } from '@tanstack/react-query';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import InfluencerCard from "@/components/influencer/InfulancerCard";
import InfluencerSkeleton from "@/components/discover/InfluencerSkeleton";
import AppliedInfluencerDetail from "./AppliedInfluencerDetail";
import { appliedInfluencersApi } from '@/services/appliedInfluencersApi';
import type { VirtualizerOptions } from '@tanstack/react-virtual';

// Smooth scroll easing function
function easeInOutQuint(t: number) {
  return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
}

export default function VirtualAppliedInfluencerList() {
  // Get campaign ID from URL params
  const params = useParams();
  const router = useRouter();
  const campaignId = params.id as string;
  
  // Overlay state
  const [selectedInfluencer, setSelectedInfluencer] = useState<any>(null);
  
  // History state for mobile back button handling
  const [historyStatePushed, setHistoryStatePushed] = useState(false);
  
  // Handle influencer click - show overlay
  const handleInfluencerClick = async (influencer: any) => {
    setSelectedInfluencer(influencer);
    
    // Push history state for mobile back button handling
    if (!historyStatePushed) {
      // Create a unique state object to identify this overlay
      const overlayState = { overlayOpen: true, influencerId: influencer.id, timestamp: Date.now() };
      window.history.pushState(overlayState, '', window.location.href);
      setHistoryStatePushed(true);
    }
  };
  
  // Close overlay
  const closeOverlay = () => {
    setSelectedInfluencer(null);
    
    // Clean up history state if we pushed one
    if (historyStatePushed) {
      // Go back to remove the overlay state from history
      window.history.back();
      setHistoryStatePushed(false);
    }
  };
  
  // Handle browser back button for applied influencer overlay
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      // If overlay is open and back button is pressed, close the overlay
      if (selectedInfluencer && historyStatePushed) {
        // Close the overlay without calling history.back() again
        // to avoid the double navigation issue
        setSelectedInfluencer(null);
        setHistoryStatePushed(false);
      }
    };

    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [selectedInfluencer, historyStatePushed]);

  // Debug campaign ID
  useEffect(() => {
    // console.log('🎯 Campaign ID from URL:', campaignId);
  }, [campaignId]);
  
  // The scrollable element for your list
  const parentRef = React.useRef<HTMLDivElement>(null);
  const scrollingRef = React.useRef<number | undefined>(undefined);

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
    queryKey: ['applied-influencers', campaignId],
    queryFn: ({ pageParam = 0 }: { pageParam: number }) => {
      // console.log('🔄 Applied Influencers API Call - Page:', pageParam, 'Campaign:', campaignId);
      return appliedInfluencersApi.fetchAppliedInfluencers(pageParam, 15, campaignId);
    },
    getNextPageParam: (lastPage: any, allPages: any[]) => {
      return lastPage.hasMore ? allPages.length + 1 : undefined;
    },
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    refetchOnWindowFocus: false,
    enabled: !!campaignId, // Only call API when campaignId is available
  });

  // Flatten all pages data
  const influencers = React.useMemo(() => {
    if (data?.pages && data.pages.length > 0) {
      const allInfluencers = data.pages.flatMap((page: any) => page.data);
      // console.log('📊 All influencers data:', allInfluencers);
      return allInfluencers;
    }
    return [];
  }, [data]);

  // The virtualizer - handles virtual scrolling with smooth scroll
  const rowVirtualizer = useVirtualizer({
    count: hasNextPage ? influencers.length + 1 : influencers.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 130, // Height of each influencer card
    overscan: 5, // Render extra items for smooth scrolling
    scrollToFn, // Custom smooth scroll function
  });

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
      // console.log('🔄 Fetching next applied influencers page...');
      fetchNextPage();
    }
  }, [
    hasNextPage,
    fetchNextPage,
    influencers.length,
    isFetchingNextPage,
    rowVirtualizer.getVirtualItems(),
  ]);

  // Loading state - initial load
  if (isLoading && influencers.length === 0) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1fb036]"></div>
      </div>
    );
  }

  // Error state
  if (isError && influencers.length === 0) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-red-500">
          <p>Error loading applied influencers: {error?.message}</p>
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
  if (influencers.length === 0 && !isLoading) {
    return (
      <>
            {/* Header - Only show when list is displayed */}
            <header className="sticky top-0 z-20 bg-white border-b border-gray-200 pr-4 py-3">
        <div className="flex items-center justify-center relative">
          <button 
            onClick={() => router.back()}
            className="p-2 rounded-full hover:bg-gray-100 absolute left-0 top-1/2 -translate-y-1/2"
          >
            <svg className="w-5 h-5" fill="none" stroke="#ccc" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-medium text-gray-900">Applied Influencers</h1>
        </div>
      </header>
      <div className="flex justify-center items-center h-96">
        <div className="text-gray-500">
          <p>No applied influencers found for this campaign.</p>
        </div>
      </div>
      </>
    );
  }

  return (
    <>
      {/* Header - Only show when list is displayed */}
      <header className="sticky top-0 z-20 bg-white border-b border-gray-200 pr-4 py-3">
        <div className="flex items-center justify-center relative">
          <button 
            onClick={() => router.back()}
            className="p-2 rounded-full hover:bg-gray-100 absolute left-0 top-1/2 -translate-y-1/2"
          >
            <svg className="w-5 h-5" fill="none" stroke="#ccc" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-medium text-gray-900">Applied Influencers</h1>
        </div>
      </header>

      <div
        ref={parentRef}
        style={{
          height: `calc(80vh - 60px)`, // Subtract header height
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
            
            // console.log('🎯 Virtual Item:', { 
            //   index: virtualItem.index, 
            //   isLoaderRow, 
            //   influencerId: influencer?.id,
            //   totalInfluencers: influencers.length 
            // });

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
                        <span>Loading more applied influencers...</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-gray-500 text-sm">
                        All caught up! No more applied influencers to load.
                      </div>
                    </div>
                  )
                ) : influencer ? (
                  <div key={`influencer-${influencer.id}-${virtualItem.index}`} onClick={() => handleInfluencerClick(influencer)}>
                    <InfluencerCard data={influencer} />
                  </div>
                ) : (
                  <div className="animate-pulse bg-gray-200 h-32 rounded"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Full Screen Overlay - Applied Influencer Detail */}
      {selectedInfluencer && (
        <div className="fixed inset-0 z-50 bg-white">
          <AppliedInfluencerDetail 
            data={selectedInfluencer} 
            onClose={closeOverlay}
          />
        </div>
      )}
    </>
  );
}
