'use client';
import { useVirtualizer, elementScroll } from '@tanstack/react-virtual';
import { useInfiniteQuery } from '@tanstack/react-query';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CampaignCard from "@/components/campaigns/campaign-card";
import CampaignSkeleton from "@/components/discover/CampaignSkeleton";
import CampaignDetails from "@/components/campaigns/campaignsDetails";
import { campaignApi, type CampaignData } from '@/services/campaignApi';
import type { VirtualizerOptions } from '@tanstack/react-virtual';
import { setData, setScrollPosition, clearData } from '@/store/campaignCacheSlice';
import type { RootState } from '@/store/store';
import Image from 'next/image';

interface VirtualCampaignListProps {
  userRole?: string;
  isPublic?: boolean; // Flag to determine if using public API (for finder page)
}

// Redux selectors
const selectCampaignCache = (state: RootState) => state.campaignCache;

// Smooth scroll easing function
function easeInOutQuint(t: number) {
  return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
}

export default function VirtualCampaignList({ userRole = '2', isPublic = false }: VirtualCampaignListProps) {
  // Redux
  const dispatch = useDispatch();
  const { data: cachedData, lastPage, scrollPosition, hasData } = useSelector(selectCampaignCache);
  
  // Loading state
  const [showSkeletons, setShowSkeletons] = useState(false);
  
  // Scroll restoration loading state
  const [isRestoringScrollLoader, setIsRestoringScrollLoader] = useState(false);
  
  // Overlay state
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
  
  // History state for mobile back button handling
  const [historyStatePushed, setHistoryStatePushed] = useState(false);
  
  // Handle campaign click - show overlay
  const handleCampaignClick = async (campaign: any) => {
    setSelectedCampaign(campaign);
    
    // Push history state for mobile back button handling
    if (!historyStatePushed) {
      // Create a unique state object to identify this overlay
      const overlayState = { overlayOpen: true, campaignId: campaign.id, timestamp: Date.now() };
      window.history.pushState(overlayState, '', window.location.href);
      setHistoryStatePushed(true);
    }
  };
  
  // Close overlay
  const closeOverlay = () => {
    setSelectedCampaign(null);
    
    // Clean up history state if we pushed one
    if (historyStatePushed) {
      // Go back to remove the overlay state from history
      window.history.back();
      setHistoryStatePushed(false);
    }
  };
  
  // Handle browser back button for campaign overlay
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      // If overlay is open and back button is pressed, close the overlay
      if (selectedCampaign && historyStatePushed) {
        // Close the overlay without calling history.back() again
        // to avoid the double navigation issue
        setSelectedCampaign(null);
        setHistoryStatePushed(false);
      }
    };

    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [selectedCampaign, historyStatePushed]);

  // Debug Redux state
  useEffect(() => {
    // console.log('📊 Campaign Redux State:', {
    //   hasData,
    //   dataLength: cachedData?.length || 0,
    //   lastPage,
    //   scrollPosition
    // });
  }, [hasData, cachedData?.length, lastPage, scrollPosition]);
  
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

  // Only call API when needed
  const shouldFetch = !hasData;
  
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
    queryKey: ['campaigns', isPublic ? 'public' : 'private'], // Different cache keys for public/private
    queryFn: ({ pageParam = 0 }: { pageParam: number }) => {
      // console.log('🔄 Campaign API Call - Page:', pageParam, 'Should fetch:', shouldFetch, 'IsPublic:', isPublic);
      return campaignApi.fetchCampaigns(pageParam, 15, isPublic);
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
  const campaigns = React.useMemo(() => {
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

  // Save data when new data arrives
  useEffect(() => {
    if (data && data.pages.length > 0) {
      const allCampaigns = data.pages.flatMap((page: any) => page.data);
      const currentPage = data.pages.length;
      
      // console.log(allCampaigns,'all setData campaigns line 130')
      
      if (data.pages.length > processedPagesRef.current) {
        // Normal data save - only if new pages
        dispatch(setData({ data: allCampaigns, lastPage: currentPage, filters: {} }));
        processedPagesRef.current = currentPage;
      }
    }
  }, [data, dispatch]);

  // Generate skeleton data for loading state
  const skeletonCount = 10; // Show 10 skeleton cards
  const skeletonData = Array.from({ length: skeletonCount }, (_, index) => ({ 
    id: `skeleton-${index}`, 
    isSkeleton: true 
  }));
  
  // Use skeleton data when showing skeletons, otherwise use campaigns
  const displayData = showSkeletons ? skeletonData : campaigns;
  
  // The virtualizer - handles virtual scrolling with smooth scroll
  const rowVirtualizer = useVirtualizer({
    count: showSkeletons ? skeletonCount : (hasNextPage ? campaigns.length + 1 : campaigns.length),
    getScrollElement: () => parentRef.current,
    estimateSize: () => 280, // Height of each campaign card
    overscan: 5, // Render extra items for smooth scrolling
    scrollToFn, // Custom smooth scroll function
  });

  // Restore scroll position when data is loaded (only once)
  useEffect(() => {
    if (campaigns.length > 0 && !hasRestoredScroll.current && scrollPosition > 0) {
      hasRestoredScroll.current = true;
      isRestoringScroll.current = true;
      
      // Show full page loader
      setIsRestoringScrollLoader(true);
      
      // console.log('🔄 Restoring campaign scroll position:', scrollPosition);
      
      // Restore scroll position after 100ms
      setTimeout(() => {
        // Use useVirtualizer's scrollToOffset with smooth animation
        rowVirtualizer.scrollToOffset(scrollPosition, { align: 'start' });
        // console.log('✅ Campaign scroll position restored to:', scrollPosition);
        isRestoringScroll.current = false;
      }, 100);
      
      // Hide loader after 1 second to mask the jerk
      setTimeout(() => {
        setIsRestoringScrollLoader(false);
      }, 1000);
    }
  }, [campaigns.length, rowVirtualizer, scrollPosition]);

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
          // console.log('💾 Saving campaign scroll position to Redux:', position);
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
  }, [campaigns.length, rowVirtualizer, dispatch]);

  // 🔄 Infinite scroll logic - always enabled
  React.useEffect(() => {
    const [lastItem] = [...rowVirtualizer.getVirtualItems()].reverse();

    if (!lastItem) {
      return;
    }

    if (
      lastItem.index >= campaigns.length - 1 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      // console.log('🔄 Fetching next campaign page...');
      fetchNextPage();
    }
  }, [
    hasNextPage,
    fetchNextPage,
    campaigns.length,
    isFetchingNextPage,
    rowVirtualizer.getVirtualItems(),
  ]);

  // Loading state - only show if no cached data AND not showing skeletons
  if (isLoading && !hasData && !showSkeletons) {
    return (
      <div className="space-y-4 p-2">
        {Array.from({ length: 5 }, (_, index) => (
          <div key={index}>
            <CampaignSkeleton />
          </div>
        ))}
      </div>
    );
  }

  // Error state
  if (isError && !hasData) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-red-500">
          <p>Error loading campaigns: {error?.message}</p>
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
  if (campaigns.length === 0 && !isLoading && !showSkeletons) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-gray-500">
          <p>No campaigns found</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        ref={parentRef}
        style={{
          height: `86vh`,
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
            const isLoaderRow = !showSkeletons && virtualItem.index > campaigns.length - 1;
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
                    <CampaignSkeleton />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-gray-500 text-sm">
                        All caught up! No more campaigns to load.
                      </div>
                    </div>
                  )
                ) : item?.isSkeleton ? (
                  <CampaignSkeleton />
                ) : item ? (
                  <div onClick={() => handleCampaignClick(item)}>
                    <CampaignCard campaign={item} userRole={userRole} />
                  </div>
                ) : (
                  <div className="animate-pulse bg-gray-200 h-32 rounded"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Full Screen Overlay - Campaign Detail */}
      {selectedCampaign && (
        <div className="fixed inset-0 z-[100] bg-white">
          <CampaignDetails 
            {...selectedCampaign}
            onClose={closeOverlay}
          />
        </div>
      )}

      {/* Full Page Loader - Scroll Restoration */}
      {isRestoringScrollLoader && (
        <div className="fixed inset-0 z-[60] bg-white/90 backdrop-blur-sm flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <Image src="/images/loader.gif" alt="Loading" width={64} height={64} />
            {/* <p className="text-gray-600 text-lg font-medium">Restoring your position...</p> */}
          </div>
        </div>
      )}
    </>
  );
}
