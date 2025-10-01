'use client';
import { useVirtualizer, elementScroll } from '@tanstack/react-virtual';
import { useInfiniteQuery } from '@tanstack/react-query';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import InfluencerCard from "@/components/influencer/InfulancerCard";
import InfluencerDetail from "@/components/influencer/InfulancerDetail";
import { influencerApi } from '@/services/infiniteScrollApi';
import type { VirtualizerOptions } from '@tanstack/react-virtual';
import { setData, setScrollPosition, setFilters, clearData } from '@/store/influencerCacheSlice';
import type { RootState } from '@/store/store';
import { API_ROUTES } from '@/appApi';
import { api } from '@/common/services/rest-api/rest-api';

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
  const { data: cachedData, lastPage, scrollPosition, hasData, lastFilters } = useSelector(selectInfluencerCache);
  
  // Overlay state
  const [selectedInfluencer, setSelectedInfluencer] = useState<any>(null);
  const [influencerDetail, setInfluencerDetail] = useState<any>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  
  // Filter loading state
  const [isFilterLoading, setIsFilterLoading] = useState(false);
  const [showSkeletons, setShowSkeletons] = useState(false);
  
  // Handle influencer click - show overlay (from list or search)
  const handleInfluencerClick = async (influencer: any) => {
    setSelectedInfluencer(influencer);
    setIsLoadingDetail(true);
    
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
  };
  
  // Debug Redux state
  useEffect(() => {
    console.log('📊 Redux State:', {
      hasData,
      dataLength: cachedData?.length || 0,
      lastPage,
      scrollPosition,
      lastFilters
    });
  }, [hasData, cachedData?.length, lastPage, scrollPosition, lastFilters]);
  
  // The scrollable element for your list
  const parentRef = React.useRef<HTMLDivElement>(null);
  const scrollingRef = React.useRef<number | undefined>(undefined);
  const [scrollPos, setScrollPos] = useState(0);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isRestoringScroll = useRef(false);
  const hasRestoredScroll = useRef(false);
  const processedPagesRef = useRef<number>(0);

  // Use saved filters from Redux if no current filters provided
  const effectiveFilters = Object.keys(filters).length > 0 ? filters : lastFilters;
  console.log(effectiveFilters, 'effectiveFilters top line 51')

  // Check if filters have changed
  const filtersChanged = JSON.stringify(filters) !== JSON.stringify(lastFilters);
  
  // Only clear data and save filters when filters actually change
  useEffect(() => {
    if (filtersChanged) {
      console.log('🔄 Filter change detected, clearing cached data');
      
      // Set loading state and show skeletons
      setIsFilterLoading(true);
      setShowSkeletons(true);
      
      // Clear data immediately
      dispatch(clearData());
      processedPagesRef.current = 0;
      hasRestoredScroll.current = false;
      
      // Scroll to top when filters change (separate from other scroll logic)
      setTimeout(() => {
        if (parentRef.current) {
          parentRef.current.scrollTop = 0;
        }
      }, 50);
      
      console.log('💾 Saving new filters:', filters);
      dispatch(setFilters(filters));
    }
  }, [filters, lastFilters, dispatch, filtersChanged]);

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

  // Only call API when needed
  const shouldFetch = !hasData || filtersChanged;
  
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
    queryKey: ['influencers', effectiveFilters],
    queryFn: ({ pageParam = 0 }: { pageParam: number }) => {
      console.log('🔄 API Call - Page:', pageParam, 'Filters:', effectiveFilters, 'Should fetch:', shouldFetch);
      return influencerApi.fetchInfluencers(pageParam, 15, effectiveFilters);
    },
    getNextPageParam: (lastPage: any, allPages: any[]) => {
      return lastPage.hasMore ? allPages.length + 1 : undefined;
    },
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    refetchOnWindowFocus: false,
    enabled: shouldFetch, // Only call API when needed
  });

  // Use Redux cache if available, otherwise API data
  const influencers = React.useMemo(() => {
    // If showing skeletons, return empty array
    if (showSkeletons) {
      return [];
    }
    
    if (hasData && !isLoading) {
      return cachedData; // Use Redux cache
    }
    if (data?.pages && data.pages.length > 0) {
      return data.pages.flatMap((page: any) => page.data); // Use API data
    }
    return [];
  }, [hasData, cachedData, data, isLoading, showSkeletons]);

  // Save data when new data arrives with 500ms buffer
  useEffect(() => {
    if (data && data.pages.length > 0) {
      const allInfluencers = data.pages.flatMap((page: any) => page.data);
      const currentPage = data.pages.length;
      
      console.log(allInfluencers,'all setData line 130')
      
      // If filter loading, wait 500ms before setting data
      if (isFilterLoading) {
        setTimeout(() => {
          dispatch(setData({ data: allInfluencers, lastPage: currentPage, filters: effectiveFilters }));
          processedPagesRef.current = currentPage;
          setIsFilterLoading(false);
          setShowSkeletons(false);
        }, 500);
      } else if (data.pages.length > processedPagesRef.current) {
        // Normal data save (not filter change) - only if new pages
        dispatch(setData({ data: allInfluencers, lastPage: currentPage, filters: effectiveFilters }));
        processedPagesRef.current = currentPage;
      }
    }
  }, [data, dispatch, effectiveFilters, isFilterLoading]);

  // Generate skeleton data for loading state
  const skeletonCount = 10; // Show 10 skeleton cards
  const skeletonData = Array.from({ length: skeletonCount }, (_, index) => ({ 
    id: `skeleton-${index}`, 
    isSkeleton: true 
  }));
  
  // Use skeleton data when showing skeletons, otherwise use influencers
  const displayData = showSkeletons ? skeletonData : influencers;
  
  // The virtualizer - handles virtual scrolling with smooth scroll
  const rowVirtualizer = useVirtualizer({
    count: showSkeletons ? skeletonCount : (hasNextPage ? influencers.length + 1 : influencers.length),
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
      }, 100);
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

  // Loading state - only show if no cached data AND not showing skeletons
  if (isLoading && !hasData && !showSkeletons) {
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

  // Empty state - only show if not loading and not showing skeletons
  if (influencers.length === 0 && !isLoading && !showSkeletons) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-gray-500">
          <p>No influencers found</p>
        </div>
      </div>
    );
  }

  return (
    <>
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
            const isLoaderRow = !showSkeletons && virtualItem.index > influencers.length - 1;
            const item = displayData[virtualItem.index];

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
                ) : item?.isSkeleton ? (
                  <div className="bg-white rounded-2xl shadow-sm p-4 w-full">
                    <div className="flex items-center space-x-4">
                      {/* Skeleton Profile Picture */}
                      <div className="flex-shrink-0">
                        <div className="w-[90px] h-[90px] rounded-full bg-gray-200 animate-pulse"></div>
                      </div>
                      {/* Skeleton Content */}
                      <div className="flex-1 min-w-0">
                        <div className="h-4 bg-gray-200 rounded animate-pulse mb-2 w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded animate-pulse mb-1 w-1/2"></div>
                        <div className="h-3 bg-gray-200 rounded animate-pulse mb-1 w-2/3"></div>
                        <div className="h-3 bg-gray-200 rounded animate-pulse w-1/3"></div>
                      </div>
                    </div>
                  </div>
                ) : item ? (
                  <div onClick={() => handleInfluencerClick(item)}>
                    <InfluencerCard data={item} />
                  </div>
                ) : (
                  <div className="animate-pulse bg-gray-200 h-32 rounded"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Full Screen Overlay - Influencer Detail */}
      {selectedInfluencer && (
        <div className="fixed inset-0 z-50 bg-white">
          <InfluencerDetail 
            data={influencerDetail} 
            onClose={closeOverlay}
          />
        </div>
      )}
    </>
  );
}
