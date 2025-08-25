'use client';
import FilterModal from "@/components/filter";
import FilterRow from "@/components/FilterRow";
import InfluencerGrid from "@/components/influencer/InfluencerGrid";
import SearchBar from "@/components/SearchBar";
import ScrollToTop from "@/components/ScrollToTop";
import { useState, useEffect, useCallback } from "react";
import { API_ROUTES } from "@/appApi";
import { api } from "@/common/services/rest-api/rest-api";

export default function InfluencerDiscover() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({});
  const [influencers, setInfluencers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [startIndex, setStartIndex] = useState(0);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [totalRecords, setTotalRecords] = useState(0);

  const ITEMS_PER_PAGE = 3;

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

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      setIsInitialLoading(true);
      try {
        const result:any = await fetchInfluencers(0, filters);
        console.log(result, 'result');
        setInfluencers(result.data);
        setTotalRecords(result.totalRecords);
        setHasMore(result.hasMore);
        setStartIndex(0);
      } catch (error) {
        console.error('Error loading initial data:', error);
      } finally {
        setIsInitialLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Load more data function
  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    
    try {
      const nextStartIndex = startIndex + ITEMS_PER_PAGE;
      const result:any = await fetchInfluencers(nextStartIndex, filters);
      
      if (result.data.length > 0) {
        setInfluencers(prev => [...prev, ...result.data]);
        setStartIndex(nextStartIndex);
        setHasMore(result.hasMore);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading more data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [startIndex, isLoading, hasMore, filters]);

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    // Reset pagination when filters change
    setStartIndex(0);
    setHasMore(true);
    setInfluencers([]);
    setIsInitialLoading(true);
    
    // Reload with new filters
    const reloadWithFilters = async () => {
      try {
        const result:any = await fetchInfluencers(0, newFilters);
        setInfluencers(result.data);
        setTotalRecords(result.totalRecords);
        setHasMore(result.hasMore);
        setStartIndex(0);
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
        <div className="flex mt-0 px-4 md:p-8 items-start pt-[10px]">
          <div className="md:pl-9" style={{flex: 1}}>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-6 pb-20 md:pb-0">
              {Array.from({ length: 20 }, (_, index) => (
                <div key={`initial-skeleton-${index}`} className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 animate-pulse">
                  <div className="w-full aspect-square bg-gray-200 rounded-lg mb-3"></div>
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
      
      <ScrollToTop />
    </>
  );
}   