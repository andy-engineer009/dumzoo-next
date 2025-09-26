'use client';
import React, { useState } from 'react';
import VirtualInfluencerList from "@/components/VirtualInfluencerList";
import FilterModal from "@/components/filter";
import FilterRow from "@/components/FilterRow";

export default function Discover() {
  // State for filters
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Handle filter changes
  const handleFilterChange = (newFilters: any) => {
    console.log('Filter changed:', newFilters);
    setFilters(newFilters);
  };

  return (
    <>
      {/* Filter Modal */}
      <FilterModal 
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onFilterChange={handleFilterChange}
        appliedFilters={filters}
      />

      {/* Filter Row */}
      <FilterRow 
        onFilterChange={handleFilterChange} 
        appliedFilters={filters}
      />

      {/* Virtual Influencer List Component with useInfiniteQuery */}
      <VirtualInfluencerList 
        filters={filters}
      />
    </>
  );
}