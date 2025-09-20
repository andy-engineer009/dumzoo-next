'use client';
import FilterModal from "@/components/filter";
import FilterRow from "@/components/FilterRow";
import SearchBar from "@/components/SearchBar";
import InfiniteScrollGridWithStore from "@/components/common/InfiniteScrollGridWithStore";
import InfluencerCard from "@/components/influencer/InfulancerCard";
import InfluencerSkeleton from "./InfluencerSkeleton";
import { useState, useCallback, useEffect } from "react";
import { useInfluencersStore } from "@/hooks/useInfluencersStore";

export default function InfluencerDiscover() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Use the Redux store
  const { filters, updateFilters } = useInfluencersStore();

  // Render function for each influencer item
  const renderInfluencer = useCallback((influencer: any, index: number) => (
    <InfluencerCard
      key={influencer.uuid || index}
      data={influencer}
    />
  ), []);

  // Render function for influencer skeleton
  const renderInfluencerSkeleton = useCallback((index: number) => (
    <InfluencerSkeleton key={`skeleton-${index}`} />
  ), []);

  const handleFilterChange = (newFilters: any) => {
    updateFilters(newFilters);
  };

  return (
    <div className="bg-[#f5f5f5]">
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
          <InfiniteScrollGridWithStore
            renderItem={renderInfluencer}
            renderSkeleton={renderInfluencerSkeleton}
            pageSize={15}
            threshold={0.1}
            rootMargin="0px 0px 200px 0px"
            gridClassName="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-6 pb-20 md:pb-0"
          />
        </div>
      </div>
    </div>
  );
}   