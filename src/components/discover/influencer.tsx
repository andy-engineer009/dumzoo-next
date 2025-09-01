'use client';
import FilterModal from "@/components/filter";
import FilterRow from "@/components/FilterRow";
import InfluencerGrid from "@/components/influencer/InfluencerGrid";
import SearchBar from "@/components/SearchBar";
import ScrollToTop from "@/components/ScrollToTop";
import { useState, useEffect, useCallback } from "react";
import { API_ROUTES } from "@/appApi";
import { api } from "@/common/services/rest-api/rest-api";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { 
  selectDiscoverData, 
  discoverData, 
  updateDiscoverScrollPosition,
  clearDiscoverData 
} from "@/store/apiDataSlice";


export default function InfluencerDiscover() {
  const dispatch = useAppDispatch();
  const cachedData = useAppSelector(selectDiscoverData);
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({});
  const [influencers, setInfluencers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [startIndex, setStartIndex] = useState(0);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [totalRecords, setTotalRecords] = useState(0);

  const ITEMS_PER_PAGE = 3;

  // Check if we should use cached data
  const shouldUseCache = () => {
    return cachedData.influencers.length > 0;
  };

  // API call function
  const fetchInfluencers = async (start: number, searchFilters = {}) => {
    try {
      const res = await api.post(API_ROUTES.influencerList, {
        start: start,
        length: ITEMS_PER_PAGE,
      });

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
      return {
        data: [],
        totalRecords: 0,
        hasMore: false
      };
    }
  };

  // Load data from cache or API
  const loadData = async () => {
    if (shouldUseCache()) {
      // Use cached data
      console.log('🚀 Using cached data from Redux');
      setInfluencers(cachedData.influencers);
      setTotalRecords(cachedData.totalRecords);
      setHasMore(cachedData.hasMore);
      setStartIndex(cachedData.startIndex);
      setIsInitialLoading(false);
      
      // Restore scroll position after component mounts
      setTimeout(() => {
        if (cachedData.scrollPosition > 0) {
          console.log('📍 Restoring scroll position:', cachedData.scrollPosition);
          window.scrollTo(0, cachedData.scrollPosition);
        }
      }, 100);
      
      return;
    }

    // Fetch fresh data from API
    console.log('🔄 Fetching fresh data from API (no cache available)');
    setIsInitialLoading(true);
    try {
      const result: any = await fetchInfluencers(0, filters);
      setInfluencers(result.data);
      setTotalRecords(result.totalRecords);
      setHasMore(result.hasMore);
      setStartIndex(0);
      
      // Update Redux cache
      dispatch(discoverData({
        influencers: result.data,
        totalRecords: result.totalRecords,
        hasMore: result.hasMore,
        startIndex: 0,
        scrollPosition: 0
      }));
    } catch (error) {
      console.error('Error loading initial data:', error);
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
      dispatch(updateDiscoverScrollPosition(scrollPos));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [dispatch]);

  // Save current state when component unmounts
  useEffect(() => {
    return () => {
      // Save current state to Redux before leaving
      if (influencers.length > 0) {
        dispatch(discoverData({
          influencers,
          totalRecords,
          hasMore,
          startIndex,
          scrollPosition: window.scrollY
        }));
      }
    };
  }, [influencers, totalRecords, hasMore, startIndex, dispatch]);

  // Load more data function
  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    
    try {
      const nextStartIndex = startIndex + ITEMS_PER_PAGE;
      const result: any = await fetchInfluencers(nextStartIndex, filters);
      
      if (result.data.length > 0) {
        const newInfluencers = [...influencers, ...result.data];
        setInfluencers(newInfluencers);
        setStartIndex(nextStartIndex);
        setHasMore(result.hasMore);
        
        // Update Redux cache with new data
        dispatch(discoverData({
          influencers: newInfluencers,
          startIndex: nextStartIndex,
          hasMore: result.hasMore
        }));
      } else {
        setHasMore(false);
        dispatch(discoverData({ hasMore: false }));
      }
    } catch (error) {
      console.error('Error loading more data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [startIndex, isLoading, hasMore, filters, influencers, dispatch]);

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    // Reset pagination when filters change
    setStartIndex(0);
    setHasMore(true);
    setInfluencers([]);
    setIsInitialLoading(true);
    
    // Clear cache when filters change
    dispatch(clearDiscoverData());
    
    // Reload with new filters
    const reloadWithFilters = async () => {
      try {
        const result: any = await fetchInfluencers(0, newFilters);
        setInfluencers(result.data);
        setTotalRecords(result.totalRecords);
        setHasMore(result.hasMore);
        setStartIndex(0);
        
        // Update Redux cache with filtered data
        dispatch(discoverData({
          influencers: result.data,
          totalRecords: result.totalRecords,
          hasMore: result.hasMore,
          startIndex: 0,
          scrollPosition: 0
        }));
      } catch (error) {
        console.error('Error reloading with filters:', error);
      } finally {
        setIsInitialLoading(false);
      }
    };

    reloadWithFilters();
  };

  // Show loading skeleton for initial load
  if (isInitialLoading) {
    return (
      <>
        <SearchBar />
        <FilterModal 
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          onFilterChange={handleFilterChange}
        />
        <FilterRow onFilterChange={handleFilterChange} />
        <div className="flex mt-0 px-4 md:p-8 items-start pt-[10px] influencer-discover-screen">
          <div className="md:pl-9" style={{flex: 1}}>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-6 pb-20 md:pb-0">
              {Array.from({ length: 20 }, (_, index) => (
                <div key={`initial-skeleton-${index}`} className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 animate-pulse">
                  <div className="w-full aspect-square bg-gray-200 rounded-lg mb-3 h-[200px]"></div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                      <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
                    </div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                    <div className="h-3 bg-gray-200 rounded w-28"></div>
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SearchBar /> 
      <FilterModal 
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onFilterChange={handleFilterChange}
      />

      <FilterRow onFilterChange={handleFilterChange} />

      <div className="flex mt-0 px-3 md:p-8 items-start pt-[10px]">
        <div className="md:pl-9" style={{flex: 1}}>
          <InfluencerGrid 
            influencers={influencers} 
            onLoadMore={loadMore}
            isLoading={isLoading}
            hasMore={hasMore}
          />
        </div>
      </div>
      
      {/* <ScrollToTop /> */}
    </>
  );
}   