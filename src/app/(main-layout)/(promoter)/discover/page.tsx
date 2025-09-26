'use client';
import React, { useState, useEffect } from 'react';
import VirtualInfluencerList from "@/components/VirtualInfluencerList";
import FilterModal from "@/components/filter";
import FilterRow from "@/components/FilterRow";
import { influencerApi } from '@/services/infiniteScrollApi';

export default function Discover() {
  // State for API data
  const [influencers, setInfluencers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);


  // Clean filters function
  const cleanFilters = (filters: Record<string, any>) => {
    const cleaned: Record<string, any> = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '' && value !== 'All') {
        cleaned[key] = value;
      }
    });
    return cleaned;
  };

  // Load data from API with filters
  const loadData = async (filtersToUse?: Record<string, any>) => {
    setLoading(true);
    try {
      const cleanedFilters = cleanFilters(filtersToUse || filters);
      console.log('Loading with filters:', cleanedFilters);
      const result = await influencerApi.fetchInfluencers(0, 15, cleanedFilters);
      setInfluencers(result.data);
      console.log('Loaded influencers:', result.data.length);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  // Handle filter changes
  const handleFilterChange = (newFilters: any) => {
    console.log('Filter changed:', newFilters);
    setFilters(newFilters);
    loadData(newFilters);
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

      {/* Virtual Influencer List Component */}
      <VirtualInfluencerList 
        influencers={influencers}
        loading={loading}
      />
    </>
  );
}