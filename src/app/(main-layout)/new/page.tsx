"use client";
import InfluencerCard from "@/components/influencer/InfulancerCard";
import { FixedSizeList, ListChildComponentProps } from "react-window";
import { useEffect, useRef, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { influencerApi } from "@/services/infiniteScrollApi";
import { setData, setLastPage } from "@/store/newPageSlice";

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
  const { data: reduxData, hasData, lastPage } = useSelector((state: any) => state.newPage);
  
  const [items, setItems] = useState<InfluencerData[]>(reduxData || []);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(lastPage || 0);
  const listRef = useRef<FixedSizeList>(null);


  // Load initial data
  const loadInitialData = useCallback(async () => {
    // Use Redux data if available
    if (hasData && reduxData.length > 0) {
      setItems(reduxData);
      setCurrentPage(lastPage);
      setHasMore(true);
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
  }, [hasData, reduxData, items.length, dispatch]);

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


  // Load initial data on mount
  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);


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
