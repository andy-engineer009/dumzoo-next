'use client';
import FilterModal from "@/components/filter";
import FilterRow from "@/components/FilterRow";
import SearchBar from "@/components/SearchBar";
import InfiniteScrollGrid from "@/components/common/InfiniteScrollGrid";
import InfluencerCard from "@/components/influencer/InfulancerCard";
import InfluencerSkeleton from "./InfluencerSkeleton";
import { useState, useCallback } from "react";
import { influencerApi } from "@/services/infiniteScrollApi";

export default function InfluencerDiscover() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({});

  // Helper function to clean filters
  const cleanFilters = (filters: any) => {
    const cleaned: any = {};
    
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
  };

  // Fetch function for infinite scroll
  const fetchInfluencers = useCallback(async (page: number, limit?: number) => {
    const cleanedFilters = cleanFilters(filters);
    return await influencerApi.fetchInfluencers(page, limit, cleanedFilters);
  }, [filters]);

  // Render function for each influencer item
  const renderInfluencer = useCallback((influencer: any, index: number) => (
    <InfluencerCard
      key={index}
      data={influencer}
    />
  ), []);

  // Render function for influencer skeleton
  const renderInfluencerSkeleton = useCallback((index: number) => (
    <InfluencerSkeleton key={`skeleton-${index}`} />
  ), []);

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

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
          <InfiniteScrollGrid
            fetchFunction={fetchInfluencers}
            renderItem={renderInfluencer}
            renderSkeleton={renderInfluencerSkeleton}
            pageSize={15}
            maxItems={200}
            threshold={0.1}
            rootMargin="0px 0px 200px 0px"
            prefetchDistance={5}
            gridClassName="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-6 pb-20 md:pb-0"
          />
        </div>
      </div>
    </>
  );
}   