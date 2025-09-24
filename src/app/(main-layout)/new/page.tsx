"use client";
import InfluencerCard from "@/components/influencer/InfulancerCard";
import { FixedSizeList, ListChildComponentProps } from "react-window";
import { useEffect, useRef, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { influencerApi } from "@/services/infiniteScrollApi";
import { setData, setLastPage, setLastScrollPosition } from "@/store/newPageSlice";

interface InfluencerData {
  uuid: string;
  username: string;
  follower_count: number;
  starting_price: number;
  verified_profile: number;
  influencer_city: { name: string };
  influencer_state: { short_name: string };
  instagram_url?: string;
  facebook_url?: string;
  youtube_url?: string;
}

export default function NotificationPage() {
  const dispatch = useDispatch();
  const { data: reduxData, hasData, lastPage, lastScrollPosition } = useSelector((state: any) => state.newPage);
  
  const [items, setItems] = useState<InfluencerData[]>(reduxData || []);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(lastPage || 0);
  const listRef = useRef<FixedSizeList>(null);

  // Apply scroll position function
  const applyScrollPosition = useCallback(() => {
    if (listRef.current && lastScrollPosition > 0) {
      console.log('📍 Applying scroll position:', lastScrollPosition);
      isProgrammaticScrollRef.current = true; // Mark as programmatic scroll
      listRef.current.scrollTo(lastScrollPosition);
      
      // Reset flag after scroll completes
      setTimeout(() => {
        isProgrammaticScrollRef.current = false;
      }, 100);
    }
  }, [lastScrollPosition]);

  // Load initial data
  const loadInitialData = useCallback(async () => {
    // Use Redux data if available
    if (hasData && reduxData.length > 0) {
      setItems(reduxData);
      setCurrentPage(lastPage);
      setHasMore(true);
      
      // Apply scroll position instantly if saved
      if (lastScrollPosition > 0) {
        console.log('🔄 Data loaded from Redux, applying saved scroll position:', lastScrollPosition);
        setTimeout(() => {
          applyScrollPosition();
        }, 50); // Shorter delay for instant apply
      }
      return;
    }

    if (items.length > 0) return; // Don't reload if we already have data
    
    setLoading(true);
    try {
      const result = await influencerApi.fetchInfluencers(0, 20);
      setItems(result.data);
      setCurrentPage(1);
      setHasMore(result.hasMore);
      
      // Save to Redux store
      dispatch(setData(result.data));
      dispatch(setLastPage(1));
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      setLoading(false);
    }
  }, [hasData, reduxData, items.length, dispatch, lastScrollPosition, applyScrollPosition]);

  // Load more data
  const loadMoreItems = useCallback(async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    try {
      const result = await influencerApi.fetchInfluencers(currentPage, 20);
      const newItems = [...items, ...result.data];
      const nextPage = currentPage + 1;
      setItems(newItems);
      setCurrentPage(nextPage);
      setHasMore(result.hasMore);
      
      // Update Redux store with new data and page count
      dispatch(setData(newItems));
      dispatch(setLastPage(nextPage));
    } catch (error) {
      console.error('Error loading more data:', error);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, currentPage, items, dispatch]);

  // Handle scroll to bottom
  const handleItemsRendered = useCallback(({ visibleStopIndex }: { visibleStopIndex: number }) => {
    // If we're near the end of the list, load more items
    if (visibleStopIndex >= items.length - 5 && !loading && hasMore) {
      loadMoreItems();
    }
  }, [items.length, loading, hasMore, loadMoreItems]);

  // Optimized save scroll position function for mobile
  const throttledSaveRef = useRef<NodeJS.Timeout | null>(null);
  const isProgrammaticScrollRef = useRef(false);
  const lastSavedPositionRef = useRef(0);
  
  const saveScrollPosition = useCallback(() => {
    // Don't save if it's programmatic scroll
    if (isProgrammaticScrollRef.current) {
      console.log('🚫 Skipping scroll save - programmatic scroll detected');
      return;
    }
    
    if (throttledSaveRef.current) return;
    
    throttledSaveRef.current = setTimeout(() => {
      if (listRef.current) {
        const scrollOffset = (listRef.current as any).state?.scrollOffset || 0;
        
        // Only save if position changed significantly (mobile optimization)
        const positionDiff = Math.abs(scrollOffset - lastSavedPositionRef.current);
        if (positionDiff > 100) { // Only save if moved more than 100px
          console.log('💾 Saving scroll position (user scroll):', scrollOffset);
          dispatch(setLastScrollPosition(scrollOffset));
          lastSavedPositionRef.current = scrollOffset;
        }
      }
      throttledSaveRef.current = null;
    }, 500); // Increased to 500ms for better mobile performance
  }, [dispatch]);

  // Load initial data on mount
  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Add robust scroll listener that won't stop automatically
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isScrollingRef = useRef(false);
  
  useEffect(() => {
    
    // More robust scroll handler
    const handleScroll = () => {
      isScrollingRef.current = true;
      
      // Clear existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      
      // Set new timeout
      scrollTimeoutRef.current = setTimeout(() => {
        console.log('🔄 Scroll stopped, saving position...');
        saveScrollPosition();
        isScrollingRef.current = false;
        scrollTimeoutRef.current = null;
      }, 150); // Slightly longer debounce for reliability
    };

    // Save scroll position on page leave
    const handleBeforeUnload = () => {
      console.log('🚪 Page unloading - saving scroll position');
      // Force immediate save on page leave
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
        scrollTimeoutRef.current = null;
      }
      saveScrollPosition();
    };

    // Handle visibility change (when user switches tabs)
    const handleVisibilityChange = () => {
      if (document.hidden && isScrollingRef.current) {
        console.log('👁️ Page hidden while scrolling - saving position');
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
          scrollTimeoutRef.current = null;
        }
        saveScrollPosition();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Add scroll listener with passive option for better mobile performance
    const addScrollListener = () => {
      if (listRef.current) {
        const listElement = (listRef.current as any)._outerRef;
        if (listElement) {
          listElement.addEventListener('scroll', handleScroll, { passive: true });
          return listElement;
        }
      }
      return null;
    };

    const scrollElement = addScrollListener();

    return () => {
      // Cleanup
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
        scrollTimeoutRef.current = null;
      }
      if (throttledSaveRef.current) {
        clearTimeout(throttledSaveRef.current);
        throttledSaveRef.current = null;
      }
      
      if (scrollElement) {
        scrollElement.removeEventListener('scroll', handleScroll);
      }
      
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      
      // Final save on unmount
      console.log('🧹 Component unmounting - final save');
      saveScrollPosition();
    };
  }, [saveScrollPosition, items.length]); // Re-run when items change to attach to new list

  const Row = ({ index, style }: ListChildComponentProps) => {
    // Show loading indicator for the last few items when loading
    if (loading && index >= items.length - 3) {
      return (
        <div style={style} className="flex items-center justify-center p-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    // Show end message when no more items
    if (!hasMore && index === items.length) {
      return (
        <div style={style} className="flex items-center justify-center p-8">
          <div className="text-gray-500 text-sm">All caught up! No more influencers to load.</div>
        </div>
      );
    }

    const item = items[index];
    if (!item) {
      return <div style={style}></div>;
    }

    return (
      <div style={style} className="p-2">
        <InfluencerCard data={item} />
      </div>
    );
  };

  const totalItems = items.length + (loading ? 3 : 0) + (!hasMore && items.length > 0 ? 1 : 0);

  return (
    <div className="w-full h-full">
      {items.length === 0 && loading ? (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <FixedSizeList
          ref={listRef}
          height={600}      // viewport height
          itemCount={totalItems} 
          itemSize={160}    // height of each row
          width={"100%"}    // width of list
          onItemsRendered={handleItemsRendered}
          overscanCount={5} // Render extra items for smooth scrolling
        >
          {Row}
        </FixedSizeList>
      )}
    </div>
  );
}
