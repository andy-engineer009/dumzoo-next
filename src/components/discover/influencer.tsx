'use client';
import FilterModal from "@/components/filter";
import FilterRow from "@/components/FilterRow";
import InfluencerGrid from "@/components/influencer/InfluencerGrid";
import SearchBar from "@/components/SearchBar";
import ScrollToTop from "@/components/ScrollToTop";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { API_ROUTES } from "@/appApi";
import { api } from "@/common/services/rest-api/rest-api";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { 
  selectDiscoverData, 
  discoverData, 
  clearDiscoverData 
} from "@/store/apiDataSlice";
import InfluencerSkeleton from "./InfluencerSkeleton";
import { useOptimizedScroll } from "@/hooks/useOptimizedScroll";


export default function InfluencerDiscover() {
  const dispatch = useAppDispatch();
  const cachedData = useAppSelector(selectDiscoverData);
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState(cachedData.appliedFilters || {});
  const [influencers, setInfluencers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [startIndex, setStartIndex] = useState(0);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [totalRecords, setTotalRecords] = useState(0);
  
  // Use ref to track current filters without causing re-renders
  const filtersRef = useRef(filters);
  
  // Update ref whenever filters change
  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  const ITEMS_PER_PAGE = 3;

  // Check if we should use cached data
  const shouldUseCache = () => {
    return cachedData.influencers.length > 0;
  };

  // API call function
  const fetchInfluencers = async (start: number, searchFilters = {}) => {
    try {
      const res = await api.post(API_ROUTES.influencerList, {
        page: start,
        limit: ITEMS_PER_PAGE,
        ...searchFilters
      });

      if (res.status === 1) {
        return {
          data: res.data || [],
          totalRecords: res.data.count || 0,
          hasMore: (start + ITEMS_PER_PAGE) < (res.data.count || 0)
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
  const loadData = useCallback(async () => {
    
    if (shouldUseCache()) {
      // Use cached data
      setInfluencers(cachedData.influencers);
      setTotalRecords(cachedData.totalRecords);
      setHasMore(cachedData.hasMore);
      setStartIndex(cachedData.startIndex);
      setIsInitialLoading(false);
      
      // Scroll position is now handled by useOptimizedScroll hook
      // No need for manual restoration
      return;
    }

    // Fetch fresh data from API
    setIsInitialLoading(true);
    try {
      const currentFilters = filtersRef.current;
      const cleanedFilters = cleanFilters(currentFilters);
      const result: any = await fetchInfluencers(0, cleanedFilters);
      
      setInfluencers(result.data?.rows || []);
      setTotalRecords(result.totalRecords);
      setHasMore(result.hasMore);
      setStartIndex(0);
      
      // Update Redux cache - save FULL filter state for UI
      // CRITICAL FIX: Only save meaningful filters to prevent old state restoration
      const hasMeaningfulFiltersInLoadData = Object.values(currentFilters).some(value => {
        if (Array.isArray(value)) return value.length > 0;
        if (typeof value === 'string') return value !== '';
        if (typeof value === 'number') return value !== 0 && value !== 100000 && value !== 250000;
        return value !== null && value !== undefined;
      });
      
      
      dispatch(discoverData({
        influencers: result.data?.rows || [],
        totalRecords: result.totalRecords,
        hasMore: result.hasMore,
        startIndex: 0,
        appliedFilters: hasMeaningfulFiltersInLoadData ? currentFilters : {} // Only save meaningful filters
      }));
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      setIsInitialLoading(false);
    }
  }, [cachedData, dispatch]);

  // Load initial data
  useEffect(() => {
    loadData();
  }, []); // Empty dependency array to run only once

  // Sync filters with cached data when component mounts
  useEffect(() => {
    
    // CRITICAL FIX: Only sync if we have meaningful cached filters
    // This prevents restoring old state when filters are being cleared
    const hasMeaningfulCachedFilters = cachedData.appliedFilters && 
      Object.keys(cachedData.appliedFilters).length > 0 &&
      Object.values(cachedData.appliedFilters).some(value => {
        if (Array.isArray(value)) return value.length > 0;
        if (typeof value === 'string') return value !== '';
        if (typeof value === 'number') return value !== 0 && value !== 100000 && value !== 250000;
        return value !== null && value !== undefined;
      });
    
    if (hasMeaningfulCachedFilters) {
      setFilters(cachedData.appliedFilters);
    }
  }, [cachedData.appliedFilters]);

  // Use optimized scroll hook instead of Redux for scroll position
  const scrollData = useOptimizedScroll({
    throttleMs: 150, // Reduced frequency for better performance
    savePosition: true // Save to sessionStorage instead of Redux
  });

  // Save current state when component unmounts (optimized)
  useEffect(() => {
    return () => {
      // Only save essential data to Redux, scroll position handled by hook
      if (influencers?.length > 0) {
        dispatch(discoverData({
          influencers,
          totalRecords,
          hasMore,
          startIndex,
          appliedFilters: cachedData.appliedFilters // Use current Redux state
        }));
      }
    };
  }, [influencers, totalRecords, hasMore, startIndex, dispatch]); // Removed cachedData.appliedFilters to prevent infinite loop

  // Load more data function
  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    
    try {
      const nextStartIndex = startIndex + ITEMS_PER_PAGE;
      const cleanedFilters = cleanFilters(filters);
      const result: any = await fetchInfluencers(nextStartIndex, cleanedFilters);
      
      if (result?.data?.rows?.length > 0) {
        const newInfluencers = [...influencers, ...result?.data?.rows];
        setInfluencers(newInfluencers);
        setStartIndex(nextStartIndex);
        setHasMore(result.hasMore);
        
        // Update Redux cache with new data - save FULL filter state for UI
        // CRITICAL FIX: Use current Redux state instead of old local filters state
        dispatch(discoverData({
          influencers: newInfluencers,
          startIndex: nextStartIndex,
          hasMore: result.hasMore,
          appliedFilters: cachedData.appliedFilters // Use current Redux state
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

  // Function to clean filters - remove empty values and unwanted parameters (optimized)
  const cleanFilters = useCallback((filters: any) => {
    const cleaned: any = {};
    
    // Only include non-empty values
    Object.keys(filters).forEach(key => {
      const value = filters[key];
      
      // Skip the "filter" parameter
      if (key === 'filter') {
        return;
      }
      
      if (Array.isArray(value)) {
        if (value.length > 0) {
          cleaned[key] = value;
        }
      } else if (typeof value === 'string') {
        if (value !== '') {
          cleaned[key] = value;
        }
      } else if (typeof value === 'number') {
        // For numbers, include if they're not default values
        if (key === 'budgetMin' && value > 0) cleaned[key] = value;
        else if (key === 'budgetMax' && value < 100000) cleaned[key] = value;
        else if (key === 'followerMin' && value > 0) cleaned[key] = value;
        else if (key === 'followerMax' && value < 250000) cleaned[key] = value;
        else if (!['budgetMin', 'budgetMax', 'followerMin', 'followerMax'].includes(key)) {
          cleaned[key] = value;
        }
      } else if (value !== null && value !== undefined) {
        cleaned[key] = value;
      }
    });
    
    return cleaned;
  }, []);

  const handleFilterChange = useCallback((newFilters: any) => {
    setFilters(newFilters);
    
    // Reset pagination when filters change
    setStartIndex(0);
    setHasMore(true);
    setInfluencers([]);
    setIsInitialLoading(true);
    
    // Clear cache when filters change
    dispatch(clearDiscoverData());
    
    // Clean the filters before sending to API
    const cleanedFilters = cleanFilters(newFilters);
    
    // Reload with new filters
    const reloadWithFilters = async () => {
      try {
        const result: any = await fetchInfluencers(0, cleanedFilters);
        
        setInfluencers(result?.data?.rows);
        setTotalRecords(result.totalRecords);
        setHasMore(result.hasMore);
        setStartIndex(0);
        
        // Update Redux cache with filtered data
        // CRITICAL FIX: Only save appliedFilters if they have meaningful content
        const hasMeaningfulFilters = Object.values(newFilters).some(value => {
          if (Array.isArray(value)) return value.length > 0;
          if (typeof value === 'string') return value !== '';
          if (typeof value === 'number') return value !== 0 && value !== 100000 && value !== 250000;
          return value !== null && value !== undefined;
        });
        
        const reduxData = {
          influencers: result?.data?.rows,
          totalRecords: result.totalRecords,
          hasMore: result.hasMore,
          startIndex: 0,
          appliedFilters: hasMeaningfulFilters ? newFilters : {} // Only save meaningful filters
        };
        
        dispatch(discoverData(reduxData));
        
      } catch (error) {
        console.error('❌ InfluencerDiscover: Error reloading with filters:', error);
      } finally {
        setIsInitialLoading(false);
      }
    };

    reloadWithFilters();
  }, [dispatch, cleanFilters]);

  // Show loading skeleton for initial load
  if (isInitialLoading) {
    return (
      <>
        <SearchBar />
        <FilterModal 
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          onFilterChange={handleFilterChange}
          appliedFilters={cachedData.appliedFilters}
        />
        <FilterRow onFilterChange={handleFilterChange} appliedFilters={cachedData.appliedFilters} />
        <div className="flex mt-0 px-4 md:p-8 items-start pt-[10px] influencer-discover-screen">
          <div className="md:pl-9" style={{flex: 1}}>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-6 pb-20 md:pb-0">
              {Array.from({ length: 20 }, (_, index) => (
                <InfluencerSkeleton key={`initial-skeleton-${index}`} />
                // <div key={`initial-skeleton-${index}`} className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 animate-pulse">
                //   <div className="w-full aspect-square bg-gray-200 rounded-lg mb-3 h-[200px]"></div>
                //   <div className="space-y-2">
                //     <div className="flex items-center gap-2">
                //       <div className="h-4 bg-gray-200 rounded w-20"></div>
                //       <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
                //     </div>
                //     <div className="h-3 bg-gray-200 rounded w-16"></div>
                //     <div className="h-3 bg-gray-200 rounded w-24"></div>
                //     <div className="h-3 bg-gray-200 rounded w-28"></div>
                //     <div className="h-4 bg-gray-200 rounded w-20"></div>
                //   </div>
                // </div>
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
        appliedFilters={cachedData.appliedFilters}
      />

      <FilterRow onFilterChange={handleFilterChange} appliedFilters={cachedData.appliedFilters} />

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