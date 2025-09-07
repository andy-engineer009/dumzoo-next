'use client';
import CampaignsGrid from "./CampaignsGrid";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { API_ROUTES } from "@/appApi";
import { api } from "@/common/services/rest-api/rest-api";
import ScrollToTop from "@/components/ScrollToTop";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { 
  selectCampaignsData, 
  campaignsData, 
  updateCampaignsScrollPosition,
  clearCampaignsData 
} from "@/store/apiDataSlice";

export default function CampaignsDiscover() {
  const dispatch = useAppDispatch();
  const cachedData = useAppSelector(selectCampaignsData);
  
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [startIndex, setStartIndex] = useState(0);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [totalRecords, setTotalRecords] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const ITEMS_PER_PAGE = 3;

  // Check if we should use cached data
  const shouldUseCache = () => {
    return cachedData.campaigns.length > 0;
  };

  // API call function for campaigns
  const fetchCampaigns = async (start: number, searchFilters = {}) => {
    try {
      console.log('🔍 Fetching campaigns with start:', start, 'length:', ITEMS_PER_PAGE);
      
      const res = await api.post(API_ROUTES.influencerCampaignList, {
        start: start,
        length: ITEMS_PER_PAGE,
      });

      console.log('📡 API Response:', res);

      if (res.status === 1) {
        return {
          data: res.data || [],
          totalRecords: res.recordsTotal || 0,
          hasMore: (start + ITEMS_PER_PAGE) < (res.recordsTotal || 0)
        };
      } else {
        return {
          data: [],
          totalRecords: 0,
          hasMore: false
        };
      }
    } catch (error) {
      console.error('❌ Error fetching campaigns:', error);
      throw new Error('Failed to fetch campaigns. Please try again.');
    }
  };

  // Load data from cache or API
  const loadData = async () => {
    if (shouldUseCache()) {
      // Use cached data
      console.log('🚀 Using cached campaigns data from Redux');
      setCampaigns(cachedData.campaigns);
      setTotalRecords(cachedData.totalRecords);
      setHasMore(cachedData.hasMore);
      setStartIndex(cachedData.startIndex);
      setIsInitialLoading(false);
      
      // Restore scroll position after component mounts
      setTimeout(() => {
        if (cachedData.scrollPosition > 0) {
          console.log('📍 Restoring campaigns scroll position:', cachedData.scrollPosition);
          window.scrollTo(0, cachedData.scrollPosition);
        }
      }, 100);
      
      return;
    }

    // Fetch fresh data from API
    console.log('🔄 Fetching fresh campaigns data from API (no cache available)');
    setIsInitialLoading(true);
    setError(null);
    
    try {
      const result = await fetchCampaigns(0, {});
      console.log('🚀 Initial campaigns data loaded:', result);
      setCampaigns(result.data);
      setTotalRecords(result.totalRecords);
      setHasMore(result.hasMore);
      setStartIndex(0);
      
      // Update Redux cache
      dispatch(campaignsData({
        campaigns: result.data,
        totalRecords: result.totalRecords,
        hasMore: result.hasMore,
        startIndex: 0,
        scrollPosition: 0
      }));
    } catch (error: any) {
      setError(error.message || 'Failed to load campaigns');
      console.error('❌ Error loading initial campaigns data:', error);
    } finally {
      setIsInitialLoading(false);
    }
  };

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  // Save scroll position when user scrolls
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY;
      dispatch(updateCampaignsScrollPosition(scrollPos));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [dispatch]);

  // Save current state when component unmounts
  useEffect(() => {
    return () => {
      // Save current state to Redux before leaving
      if (campaigns.length > 0) {
        dispatch(campaignsData({
          campaigns,
          totalRecords,
          hasMore,
          startIndex,
          scrollPosition: window.scrollY
        }));
      }
    };
  }, [campaigns, totalRecords, hasMore, startIndex, dispatch]);

  // Load more data function
  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) {
      console.log('⏸️ Skipping loadMore:', { isLoading, hasMore });
      return;
    }

    console.log('📥 Loading more campaigns...', { startIndex, hasMore });
    setIsLoading(true);
    
    try {
      const nextStartIndex = startIndex + ITEMS_PER_PAGE;
      const result = await fetchCampaigns(nextStartIndex, {});
      
      console.log('📦 More campaigns data loaded:', result);
      
      if (result.data.length > 0) {
        const newCampaigns = [...campaigns, ...result.data];
        setCampaigns(newCampaigns);
        setStartIndex(nextStartIndex);
        setHasMore(result.hasMore);
        
        // Update Redux cache with new data
        dispatch(campaignsData({
          campaigns: newCampaigns,
          startIndex: nextStartIndex,
          hasMore: result.hasMore
        }));
        
        console.log('✅ Campaigns updated, new total:', newCampaigns.length);
      } else {
        setHasMore(false);
        dispatch(campaignsData({ hasMore: false }));
        console.log('🏁 No more campaigns to load');
      }
    } catch (error: any) {
      setError(error.message || 'Failed to load more campaigns');
      console.error('❌ Error loading more campaigns data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [startIndex, isLoading, hasMore, campaigns, dispatch]);

  // Handle search/filter changes
  const handleSearchOrFilter = useCallback(async (searchTerm: string = '', filters: any = {}) => {
    setIsInitialLoading(true);
    setError(null);
    setStartIndex(0);
    setHasMore(true);
    setCampaigns([]);
    
    // Clear cache when filters change
    dispatch(clearCampaignsData());
    
    try {
      const searchFilters = {
        search: searchTerm,
        ...filters
      };
      
      const result = await fetchCampaigns(0, searchFilters);
      setCampaigns(result.data);
      setTotalRecords(result.totalRecords);
      setHasMore(result.hasMore);
      
      // Update Redux cache with filtered data
      dispatch(campaignsData({
        campaigns: result.data,
        totalRecords: result.totalRecords,
        hasMore: result.hasMore,
        startIndex: 0,
        scrollPosition: 0
      }));
    } catch (error: any) {
      setError(error.message || 'Failed to search campaigns');
      console.error('Error searching campaigns:', error);
    } finally {
      setIsInitialLoading(false);
    }
  }, [dispatch]);

  return (
    <div className="campaigns-discover-screen">
        {/* Header */}
        <header className=" top-0 z-20 bg-white border-b border-gray-200 pr-4 py-3">
        <div className="flex items-center justify-center relative">
          {/* <Link 
            href="/"
            className="p-2 rounded-full hover:bg-gray-100 absolute left-0 top-1/2 -translate-y-1/2"
          >
            <svg className="w-5 h-5" fill="none" stroke="#ccc" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link> */}
          <h1 className="text-lg font-medium text-gray-900"> Find Promotions</h1>
        </div>
      </header>

      {/* Cache Status Indicator */}
      {/* {!isInitialLoading && campaigns.length > 0 && (
        <div className="px-3 md:px-8 md:pl-9 mb-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            {shouldUseCache() ? (
              <>
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Showing cached campaigns data</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span>Showing fresh campaigns data from API</span>
              </>
            )}
          </div>
        </div>
      )} */}

      <div className="flex mt-3 px-3 md:p-8 items-start">
        <div className="md:pl-9" style={{flex: 1}}>
          <CampaignsGrid 
            campaigns={campaigns}
            onLoadMore={loadMore}
            isLoading={isLoading}
            hasMore={hasMore}
            error={error}
            isInitialLoad={isInitialLoading}
          />
        </div>
      </div>
      
      <ScrollToTop />
    </div>
  );
}
