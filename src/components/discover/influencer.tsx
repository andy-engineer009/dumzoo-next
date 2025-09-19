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
import { useScrollManager } from "@/hooks/useScrollManager";


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
    console.log('🔄 useEffect: Updating filtersRef from filters state', { 
      oldFiltersRef: filtersRef.current, 
      newFilters: filters 
    });
    filtersRef.current = filters;
    console.log('🔄 useEffect: Updated filtersRef', filtersRef.current);
  }, [filters]);

  const ITEMS_PER_PAGE = 20;

  // Check if we should use cached data
  const shouldUseCache = () => {
    // Don't use cache if filters have been cleared (empty filters)
    const hasEmptyFilters = !filters || Object.keys(filters).length === 0 || 
      Object.values(filters).every(value => {
        if (Array.isArray(value)) return value.length === 0;
        if (typeof value === 'string') return value === '';
        if (typeof value === 'number') return value === 0 || value === 100000 || value === 250000;
        return value === null || value === undefined;
      });
    
    // Don't use cache if filters don't match
    const filtersMatch = JSON.stringify(filters) === JSON.stringify(cachedData.appliedFilters);
    
    const shouldUse = cachedData.influencers.length > 0 && !hasEmptyFilters && filtersMatch;
    
    console.log('📋 shouldUseCache:', { 
      hasInfluencers: cachedData.influencers.length > 0,
      hasEmptyFilters,
      filtersMatch,
      currentFilters: filters,
      cachedFilters: cachedData.appliedFilters,
      shouldUse
    });
    
    return shouldUse;
  };

  // API call function
  const fetchInfluencers = async (start: number, searchFilters = {}) => {
    try {
      // Convert start index to page number (0-based)
      const pageNumber = Math.floor(start / ITEMS_PER_PAGE);
      
      console.log('🔍 fetchInfluencers: Making API call', { start, pageNumber, limit: ITEMS_PER_PAGE, searchFilters });
      
      const res = await api.post(API_ROUTES.influencerList, {
        page: pageNumber,
        limit: ITEMS_PER_PAGE,
        ...searchFilters
      });

      console.log('🔍 fetchInfluencers: API response', res);

      if (res.status === 1) {
        const totalRecords = res.data?.count || 0;
        const hasMore = start + ITEMS_PER_PAGE < totalRecords;
        
        console.log('🔍 fetchInfluencers: Processing response', {
          totalRecords,
          hasMore,
          dataRows: res.data?.rows?.length || 0,
          nextStart: start + ITEMS_PER_PAGE
        });
        
        return {
          data: res.data || [],
          totalRecords,
          hasMore
        };
      } else {
        console.log('🔍 fetchInfluencers: API error status', res.status, res.message);
        return {
          data: [],
          totalRecords: 0,
          hasMore: false
        };
      }
    } catch (error) {
      console.error('🔍 fetchInfluencers: API error', error);
      return {
        data: [],
        totalRecords: 0,
        hasMore: false
      };
    }
  };

  // Function to clean filters - remove empty values and unwanted parameters (optimized)
  const cleanFilters = useCallback((filters: any) => {
    console.log('🧹 cleanFilters: Input filters', filters);
    
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
    
    console.log('🧹 cleanFilters: Output cleaned filters', cleaned);
    return cleaned;
  }, []);

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
      // URGENT FIX: Use filters state directly, not ref
      const currentFilters = filters;
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
  }, [cachedData, dispatch, filters, cleanFilters, fetchInfluencers]);

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

  // Use centralized scroll manager for optimal performance
  const scrollData = useScrollManager({
    savePosition: true, // Save to sessionStorage instead of Redux
    priority: 1 // High priority for main content scroll
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
    console.log('🚀 InfluencerDiscover: loadMore called', { isLoading, hasMore, startIndex });
    if (isLoading || !hasMore) {
      console.log('🚀 InfluencerDiscover: Not loading more', { isLoading, hasMore });
      return;
    }

    setIsLoading(true);
    
    try {
      const nextStartIndex = startIndex + ITEMS_PER_PAGE;
      
      // BULLETPROOF FIX: Check if filters are actually empty and force clean state
      const isEmptyFilters = !filters || Object.keys(filters).length === 0 || 
        Object.values(filters).every(value => {
          if (Array.isArray(value)) return value.length === 0;
          if (typeof value === 'string') return value === '';
          if (typeof value === 'number') return value === 0 || value === 100000 || value === 250000;
          return value === null || value === undefined;
        });
      
      if (isEmptyFilters) {
        console.log('🧹 BULLETPROOF LOADMORE: Filters are empty, using clean filters');
        const emptyFilters = {
          sortBy: '',
          platform: [],
          gender: '',
          budgetMin: 0,
          budgetMax: 100000,
          followerMin: 0,
          followerMax: 250000,
          categories: [],
          languages: [],
          audienceType: [],
          audienceAgeGroup: [],
          city_id: '',
        };
        const cleanedFilters = cleanFilters(emptyFilters);
        console.log('🧹 BULLETPROOF LOADMORE: Clean filters result', cleanedFilters);
        
        const result: any = await fetchInfluencers(nextStartIndex, cleanedFilters);
        
        if (result?.data?.rows?.length > 0) {
          const newInfluencers = [...influencers, ...result?.data?.rows];
          setInfluencers(newInfluencers);
          setStartIndex(nextStartIndex);
          setHasMore(result.hasMore);
          
          dispatch(discoverData({
            influencers: newInfluencers,
            startIndex: nextStartIndex,
            hasMore: result.hasMore,
            appliedFilters: {} // Keep empty filters
          }));
        } else {
          setHasMore(false);
          dispatch(discoverData({ hasMore: false }));
        }
        
        return;
      }
      
      // Normal case: use current filters
      console.log('🚀 InfluencerDiscover: Using filters state directly', filters);
      const cleanedFilters = cleanFilters(filters); // Use filters state directly
      
      console.log('🚀 InfluencerDiscover: Fetching data', { nextStartIndex, cleanedFilters });
      console.log('🚀 InfluencerDiscover: Current filtersRef', filtersRef.current);
      console.log('🚀 InfluencerDiscover: Current Redux appliedFilters', cachedData.appliedFilters);
      console.log('🚀 InfluencerDiscover: Current local filters state', filters);
      const result: any = await fetchInfluencers(nextStartIndex, cleanedFilters);
      console.log('🚀 InfluencerDiscover: API result', result);
      
      if (result?.data?.rows?.length > 0) {
        const newInfluencers = [...influencers, ...result?.data?.rows];
        console.log('🚀 InfluencerDiscover: Adding new influencers', { 
          oldCount: influencers.length, 
          newCount: newInfluencers.length,
          hasMore: result.hasMore 
        });
        
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
        console.log('🚀 InfluencerDiscover: No more data, setting hasMore to false');
        setHasMore(false);
        dispatch(discoverData({ hasMore: false }));
      }
    } catch (error) {
      console.error('🚀 InfluencerDiscover: Error loading more data:', error);
    } finally {
      console.log('🚀 InfluencerDiscover: Setting isLoading to false');
      setIsLoading(false);
    }
  }, [startIndex, isLoading, hasMore, influencers, dispatch, cleanFilters, fetchInfluencers, filters]);

  const handleFilterChange = useCallback((newFilters: any) => {
    console.log('🔄 handleFilterChange: New filters received', newFilters);
    console.log('🔄 handleFilterChange: Previous filtersRef', filtersRef.current);
    
    // Check if filters are being cleared
    const isEmptyFilters = Object.values(newFilters).every(value => {
      if (Array.isArray(value)) return value.length === 0;
      if (typeof value === 'string') return value === '';
      if (typeof value === 'number') return value === 0 || value === 100000 || value === 250000;
      return value === null || value === undefined;
    });
    
    console.log('🔄 handleFilterChange: Is clearing filters?', isEmptyFilters);
    
    // BULLETPROOF FIX: If clearing filters, completely reset ALL state
    if (isEmptyFilters) {
      console.log('🧹 BULLETPROOF CLEAR: Completely resetting all filter state');
      
      // 1. Reset local state
      const emptyFilters = {
        sortBy: '',
        platform: [],
        gender: '',
        budgetMin: 0,
        budgetMax: 100000,
        followerMin: 0,
        followerMax: 250000,
        categories: [],
        languages: [],
        audienceType: [],
        audienceAgeGroup: [],
        city_id: '',
      };
      
      // 2. Update filters state
      setFilters(emptyFilters);
      
      // 3. Update filtersRef immediately
      filtersRef.current = emptyFilters;
      
      // 4. Reset pagination
      setStartIndex(0);
      setHasMore(true);
      setInfluencers([]);
      setIsInitialLoading(true);
      
      // 5. Clear Redux cache completely
      dispatch(clearDiscoverData());
      
      // 6. Set empty filters in Redux
      dispatch(discoverData({ appliedFilters: {} }));
      
      console.log('🧹 BULLETPROOF CLEAR: All state reset complete');
      
      // Proceed with API call using clean filters
    }
    
    // Normal filter application (not clearing) - only if not already handled above
    if (!isEmptyFilters) {
      filtersRef.current = newFilters;
    setFilters(newFilters);
      
    // Reset pagination when filters change
    setStartIndex(0);
    setHasMore(true);
    setInfluencers([]);
    setIsInitialLoading(true);
    
    // Clear cache when filters change
    dispatch(clearDiscoverData());
    }
    
    // Clean the filters before sending to API (use the current state)
    const currentFilters = isEmptyFilters ? {
      sortBy: '',
      platform: [],
      gender: '',
      budgetMin: 0,
      budgetMax: 100000,
      followerMin: 0,
      followerMax: 250000,
      categories: [],
      languages: [],
      audienceType: [],
      audienceAgeGroup: [],
      city_id: '',
    } : newFilters;
    
    const cleanedFilters = cleanFilters(currentFilters);
    
    // Reload with new filters
    const reloadWithFilters = async () => {
      try {
        const result: any = await fetchInfluencers(0, cleanedFilters);
        
        setInfluencers(result?.data?.rows);
        setTotalRecords(result.totalRecords);
        setHasMore(result.hasMore);
        setStartIndex(0);
        
        // Update Redux cache with filtered data
        const reduxData = {
          influencers: result?.data?.rows,
          totalRecords: result.totalRecords,
          hasMore: result.hasMore,
          startIndex: 0,
          appliedFilters: isEmptyFilters ? {} : newFilters // Save empty filters if cleared
        };
        
        dispatch(discoverData(reduxData));
        
      } catch (error) {
        console.error('❌ InfluencerDiscover: Error reloading with filters:', error);
      } finally {
        setIsInitialLoading(false);
      }
    };

    reloadWithFilters();
  }, [dispatch, cleanFilters, fetchInfluencers]);

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
        appliedFilters={filters}
      />

      <FilterRow onFilterChange={handleFilterChange} appliedFilters={filters} />

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