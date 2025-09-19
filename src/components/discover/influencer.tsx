'use client';
import FilterModal from "@/components/filter";
import FilterRow from "@/components/FilterRow";
import InfluencerGrid from "@/components/influencer/InfluencerGrid";
import SearchBar from "@/components/SearchBar";
import { useState, useEffect } from "react";
import { API_ROUTES } from "@/appApi";
import { api } from "@/common/services/rest-api/rest-api";
import InfluencerSkeleton from "./InfluencerSkeleton";


export default function InfluencerDiscover() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({});
  const [influencers, setInfluencers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [totalRecords, setTotalRecords] = useState(0);

  // API call function
  const fetchInfluencers = async (searchFilters = {}) => {
    try {
      const res = await api.post(API_ROUTES.influencerList, {
        ...searchFilters
      });

      if (res.status === 1) {
        return {
          data: res.data || [],
          totalRecords: res.data.count || 0
        };
      } else {
        return {
          data: [],
          totalRecords: 0
        };
      }
    } catch (error) {
      return {
        data: [],
        totalRecords: 0
      };
    }
  };

  // Load data from API
  const loadData = async () => {
    setIsInitialLoading(true);
    try {
      const cleanedFilters = cleanFilters(filters);
      const result: any = await fetchInfluencers(cleanedFilters);
      setInfluencers(result.data?.rows || []);
      setTotalRecords(result.totalRecords);
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


  // Function to clean filters - remove empty values and unwanted parameters
  const cleanFilters = (filters: any) => {
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
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    setInfluencers([]);
    setIsInitialLoading(true);
    
    // Clean the filters before sending to API
    const cleanedFilters = cleanFilters(newFilters);
    
    // Reload with new filters
    const reloadWithFilters = async () => {
      try {
        const result: any = await fetchInfluencers(cleanedFilters);
        setInfluencers(result?.data?.rows);
        setTotalRecords(result.totalRecords);
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
          appliedFilters={filters}
        />
        <FilterRow onFilterChange={handleFilterChange} appliedFilters={filters} />
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
          />
        </div>
      </div>
      
      {/* <ScrollToTop /> */}
    </>
  );
}   