'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { FixedSizeGrid } from 'react-window';
import FilterModal from "@/components/filter";
import FilterRow from "@/components/FilterRow";
import SearchBar from "@/components/SearchBar";
import InfluencerCard from "@/components/influencer/InfulancerCard";
import InfluencerSkeleton from "@/components/discover/InfluencerSkeleton";
import { influencerApi } from '@/services/infiniteScrollApi';

export default function Discover() {
  // Basic state
  const [influencers, setInfluencers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState<Record<string, any>>({});
  
  // Refs
  const gridRef = useRef<any>(null);
  const isLoadingRef = useRef(false);

  // Clean filters
  const cleanFilters = (filters: Record<string, any>) => {
    const cleaned: Record<string, any> = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '' && value !== 'All') {
        cleaned[key] = value;
      }
    });
    return cleaned;
  };

  // Load data
  const loadData = async (pageNum: number, filtersToUse?: Record<string, any>) => {
    if (isLoadingRef.current) return;
    
    isLoadingRef.current = true;
    setLoading(true);
    
    try {
      const filtersToClean = filtersToUse || filters;
      const cleanedFilters = cleanFilters(filtersToClean);
      console.log('🔍 [DISCOVER PAGE] API call with filters:', cleanedFilters);
      const result = await influencerApi.fetchInfluencers(pageNum, 20, cleanedFilters);
      
      if (pageNum === 0) {
        setInfluencers(result.data);
      } else {
        setInfluencers(prev => [...prev, ...result.data]);
      }
      
      setPage(pageNum + 1);
      setHasMore(result.hasMore);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  };

  // Handle filter changes
  const handleFilterChange = (newFilters: any) => {
    console.log('🎯 [DISCOVER PAGE] handleFilterChange called with:', newFilters);
    setFilters(newFilters);
    setInfluencers([]);
    setPage(0);
    setHasMore(true);
    loadData(0, newFilters); // Pass filters directly
  };

  // Load initial data
  useEffect(() => {
    loadData(0);
  }, []);

  // Handle scroll - load more when near bottom
  const handleItemsRendered = ({ visibleRowStopIndex }: any) => {
    const totalRows = influencers.length;
    
    if (visibleRowStopIndex >= totalRows - 2 && hasMore && !loading) {
      console.log('Loading more...');
      loadData(page);
    }
  };

  // Render item
  const ItemRenderer = ({ columnIndex, rowIndex, style }: any) => {
    const index = rowIndex;
    const influencer = influencers[index];
    
    if (!influencer) {
      return (
        <div style={style} className="p-2">
          <InfluencerSkeleton />
        </div>
      );
    }

    return (
      <div style={style} className="p-2">
        <InfluencerCard data={influencer} />
      </div>
    );
  };

  // Show loading skeletons when no data - using virtual scrolling
  if (influencers.length === 0) {
    const skeletonCount = 6; // Show 6 skeleton items
    
    return (
      <div className="bg-[#f5f5f5]">
        <SearchBar /> 
        <FilterModal 
          isOpen={false}
          onClose={() => {}}
          onFilterChange={handleFilterChange}
          appliedFilters={filters}
        />

        <FilterRow onFilterChange={handleFilterChange} appliedFilters={filters} />

        <div className="px-3 pt-[10px]">
          <div className="w-full">
            <FixedSizeGrid
              height={typeof window !== 'undefined' ? window.innerHeight - 220 : 600}
              width={typeof window !== 'undefined' ? window.innerWidth - 24 : 400}
              columnCount={1}
              rowCount={skeletonCount}
              columnWidth={typeof window !== 'undefined' ? window.innerWidth - 24 : 400}
              rowHeight={130}
            >
              {({ columnIndex, rowIndex, style }: any) => (
                <div style={style} className="p-2">
                  <InfluencerSkeleton />
                </div>
              )}
            </FixedSizeGrid>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f5f5f5]">
      <SearchBar /> 
      <FilterModal 
        isOpen={false}
        onClose={() => {}}
        onFilterChange={handleFilterChange}
        appliedFilters={filters}
      />

      <FilterRow onFilterChange={handleFilterChange} appliedFilters={filters} />

      <div className="px-3 pt-[10px]">
        <div className="w-full">
          <FixedSizeGrid
            ref={gridRef}
            height={typeof window !== 'undefined' ? window.innerHeight - 220 : 600}
            width={typeof window !== 'undefined' ? window.innerWidth - 24 : 400}
            columnCount={1}
            rowCount={influencers.length}
            columnWidth={typeof window !== 'undefined' ? window.innerWidth - 24 : 400}
            rowHeight={130}
            onItemsRendered={handleItemsRendered}
          >
            {ItemRenderer}
          </FixedSizeGrid>
        </div>
        
        {/* Bottom loader when loading more data */}
        {loading && influencers.length > 0 && (
          <div className="flex justify-center py-4">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#1fb036]"></div>
              <span className="text-sm text-gray-600">Loading more...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


// return <>
// <InfluencerDiscover />
// </>;