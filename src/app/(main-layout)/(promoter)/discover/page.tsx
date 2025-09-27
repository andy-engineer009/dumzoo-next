'use client';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import VirtualInfluencerList from "@/components/VirtualInfluencerList";
import FilterModal from "@/components/filter";
import FilterRow from "@/components/FilterRow";
import { RootState } from '@/store/store';

export default function Discover() {
  // Get saved filters from Redux
  const { lastFilters } = useSelector((state: RootState) => state.influencerCache);
  
  // State for filters - initialize with saved filters
  const [filters, setFilters] = useState<Record<string, any>>(lastFilters || {});
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Update local filters when Redux filters change (when returning to page)
  useEffect(() => {
    console.log('🔍 Discover Page - Filter State:', {
      lastFilters,
      hasLastFilters: lastFilters && Object.keys(lastFilters).length > 0,
      currentFilters: filters
    });
    
    if (lastFilters && Object.keys(lastFilters).length > 0) {
      // Only update if the filters are actually different to prevent loops
      const filtersChanged = JSON.stringify(lastFilters) !== JSON.stringify(filters);
      if (filtersChanged) {
        console.log('🔄 Restoring saved filters:', lastFilters);
        setFilters(lastFilters);
      }
    }
  }, [lastFilters]);

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