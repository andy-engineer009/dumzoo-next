'use client';
import { useVirtualizer, elementScroll } from '@tanstack/react-virtual';
import { useInfiniteQuery } from '@tanstack/react-query';
import React, { useState, useEffect, useRef } from 'react';
import InfluencerDetail from "@/components/influencer/InfulancerDetail";
import type { VirtualizerOptions } from '@tanstack/react-virtual';
import { API_ROUTES } from '@/appApi';
import { api } from '@/common/services/rest-api/rest-api';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface VirtualSearchInfluencerListProps {
  searchQuery: string;
}

// Search API function
const searchApi = {
  fetchSearchResults: async (page: number, limit: number, searchQuery: string) => {
    const response = await api.post(API_ROUTES.influencerList, {
      page: page,
      limit: limit,
      search: searchQuery.trim()
    });

    if (response.status === 1) {
      const total = response.data.count;
      const data = response.data.rows;
      const hasMore = (page + 1) * limit < total;
      
      return {
        data,
        hasMore,
        total,
        currentPage: page
      };
    }
    
    throw new Error(response.message || 'Failed to fetch search results');
  }
};

// Smooth scroll easing function
function easeInOutQuint(t: number) {
  return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
}

export default function VirtualSearchInfluencerList({ 
  searchQuery
}: VirtualSearchInfluencerListProps) {
  // Overlay state
  const [selectedInfluencer, setSelectedInfluencer] = useState<any>(null);
  const [influencerDetail, setInfluencerDetail] = useState<any>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  
  // History state for mobile back button handling
  const [historyStatePushed, setHistoryStatePushed] = useState(false);
  
  // Handle influencer click - show overlay (from search results)
  const handleInfluencerClick = async (influencer: any) => {
    setSelectedInfluencer(influencer);
    setIsLoadingDetail(true);
    
    // Push history state for mobile back button handling
    if (!historyStatePushed) {
      // Create a unique state object to identify this overlay
      const overlayState = { overlayOpen: true, influencerId: influencer.uuid, timestamp: Date.now() };
      window.history.pushState(overlayState, '', window.location.href);
      setHistoryStatePushed(true);
    }
    
    try {
      const res = await api.post(API_ROUTES.getBasicDetails, {
        uuid: influencer.uuid
      });
      if (res.status == 1) {
        setInfluencerDetail(res.data);
      }
    } catch (err) {
      console.log('Error fetching influencer detail:', err);
    } finally {
      setIsLoadingDetail(false);
    }
  };
  
  // Close overlay
  const closeOverlay = () => {
    setSelectedInfluencer(null);
    setInfluencerDetail(null);
    setIsLoadingDetail(false);
    
    // Clean up history state if we pushed one
    if (historyStatePushed) {
      // Go back to remove the overlay state from history
      window.history.back();
      setHistoryStatePushed(false);
    }
  };
  
  // Handle browser back button for overlay
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      // If overlay is open and back button is pressed, close the overlay
      if (selectedInfluencer && historyStatePushed) {
        // Close the overlay without calling history.back() again
        // to avoid the double navigation issue
        setSelectedInfluencer(null);
        setInfluencerDetail(null);
        setIsLoadingDetail(false);
        setHistoryStatePushed(false);
      }
    };

    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [selectedInfluencer, historyStatePushed]);

  // The scrollable element for your list
  const parentRef = React.useRef<HTMLDivElement>(null);
  const scrollingRef = React.useRef<number | undefined>(undefined);
  
  // useInfiniteQuery for infinite scroll pagination (same as VirtualInfluencerList)
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error
  } = useInfiniteQuery({
    queryKey: ['search-influencers', searchQuery],
    queryFn: ({ pageParam = 0 }: { pageParam: number }) => {
      return searchApi.fetchSearchResults(pageParam, 15, searchQuery);
    },
    getNextPageParam: (lastPage: any) => {
      return lastPage.hasMore ? lastPage.currentPage + 1 : undefined;
    },
    initialPageParam: 0,
    staleTime: 2 * 60 * 1000, // Cache for 2 minutes
    refetchOnWindowFocus: false,
    enabled: !!searchQuery.trim(), // Only call API when search query exists
  });

  // Flatten paginated data (same pattern as VirtualInfluencerList)
  const searchResults = React.useMemo(() => {
    if (data?.pages && data.pages.length > 0) {
      return data.pages.flatMap((page: any) => page.data);
    }
    return [];
  }, [data]);

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

  // The virtualizer - handles virtual scrolling with smooth scroll (same as VirtualInfluencerList)
  const rowVirtualizer = useVirtualizer({
    count: hasNextPage ? searchResults.length + 1 : searchResults.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 60, // Height of each search result item
    overscan: 5, // Render extra items for smooth scrolling
    scrollToFn, // Custom smooth scroll function
  });

  // 🔄 Infinite scroll logic - always enabled (same as VirtualInfluencerList)
  React.useEffect(() => {
    const [lastItem] = [...rowVirtualizer.getVirtualItems()].reverse();

    if (!lastItem) {
      return;
    }

    if (
      lastItem.index >= searchResults.length - 1 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [
    hasNextPage,
    fetchNextPage,
    searchResults.length,
    isFetchingNextPage,
    rowVirtualizer.getVirtualItems(),
  ]);

  // Loading state (same pattern as VirtualInfluencerList)
  if (isLoading) {
    return (
      <div className="space-y-3 py-4">
        {Array.from({ length: 8 }, (_, index) => (
          <div key={index} className="flex items-center space-x-3">
            {/* Skeleton Profile Picture */}
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
            </div>
            {/* Skeleton Content */}
            <div className="flex-1 min-w-0">
              <div className="h-4 bg-gray-200 rounded animate-pulse mb-1 w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Error state (same pattern as VirtualInfluencerList)
  if (isError) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-red-500">
          <p>Error loading search results: {(error as any)?.message}</p>
        </div>
      </div>
    );
  }

  // Empty state (same pattern as VirtualInfluencerList)
  if (searchResults.length === 0 && !isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-8"
      >
        <div className="text-gray-400 mb-2">
          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <p className="text-gray-500">No creators found</p>
      </motion.div>
    );
  }

  return (
    <>
      <div
        ref={parentRef}
        style={{
          height: `calc(100vh - 120px)`, // Full height minus header
          overflow: 'auto',
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
            const isLoaderRow = virtualItem.index > searchResults.length - 1;
            const result = searchResults[virtualItem.index];

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
              >
                {isLoaderRow ? (
                  hasNextPage ? (
                    <div className="flex items-center space-x-3 py-2">
                      {/* Skeleton Profile Picture */}
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
                      </div>
                      {/* Skeleton Content */}
                      <div className="flex-1 min-w-0">
                        <div className="h-4 bg-gray-200 rounded animate-pulse mb-1 w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center py-2">
                      <div className="text-gray-500 text-sm">
                        All results loaded
                      </div>
                    </div>
                  )
                ) : result ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center space-x-3 bg-white cursor-pointer py-2"
                    onClick={() => handleInfluencerClick(result)}
                  >
                    {/* Profile Image */}
                    <div className="relative">
                      <img
                        src={result.profile_image}
                        alt={result.name}
                        className="w-10 h-10 rounded-full object-cover"
                        onError={(e) => {
                          // Fallback to default image if profile image fails to load
                          (e.target as HTMLImageElement).src = '/images/men.png';
                        }}
                      />
                    </div>

                    {/* User Info */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-900">{result.name}</h3>
                        <span className="text-[#000] font-semibold text-sm flex items-center">
                          {result.username}
                          {result.verified_profile == 1 && (
                            <div className="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center ms-1">
                              <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      {/* Full Screen Overlay - Influencer Detail */}
      {selectedInfluencer && (
        <div className="fixed inset-0 z-[100] bg-white">
          <InfluencerDetail 
            data={influencerDetail} 
            onClose={closeOverlay}
          />
        </div>
      )}
    </>
  );
}

