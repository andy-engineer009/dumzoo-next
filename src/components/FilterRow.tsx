'use client';

import { useState, useEffect } from 'react';
import FilterModal from './filter';
import { platform } from 'os';

interface FilterRowProps {
  onFilterChange: (filters: any) => void;
  appliedFilters?: any; // Add this to receive the last applied filters
}

export default function FilterRow({ onFilterChange, appliedFilters }: FilterRowProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Helper functions to get state and city names
  const getStateName = (stateId: string | number) => {
    const states = [
      { id: 1, name: "Andhra Pradesh", short_name: "AP" },
      { id: 2, name: "Arunachal Pradesh", short_name: "AR" },
      { id: 3, name: "Assam", short_name: "AS" },
      { id: 4, name: "Bihar", short_name: "BR" },
      { id: 5, name: "Chhattisgarh", short_name: "CG" },
      { id: 6, name: "Goa", short_name: "GA" },
      { id: 7, name: "Gujarat", short_name: "GJ" },
      { id: 8, name: "Haryana", short_name: "HR" },
      { id: 9, name: "Himachal Pradesh", short_name: "HP" },
      { id: 10, name: "Jharkhand", short_name: "JH" },
      { id: 11, name: "Karnataka", short_name: "KA" },
      { id: 12, name: "Kerala", short_name: "KL" },
      { id: 13, name: "Madhya Pradesh", short_name: "MP" },
      { id: 14, name: "Maharashtra", short_name: "MH" },
      { id: 15, name: "Manipur", short_name: "MN" },
      { id: 16, name: "Meghalaya", short_name: "ML" },
      { id: 17, name: "Mizoram", short_name: "MZ" },
      { id: 18, name: "Nagaland", short_name: "NL" },
      { id: 19, name: "Odisha", short_name: "OR" },
      { id: 20, name: "Punjab", short_name: "PB" },
      { id: 21, name: "Rajasthan", short_name: "RJ" },
      { id: 22, name: "Sikkim", short_name: "SK" },
      { id: 23, name: "Tamil Nadu", short_name: "TN" },
      { id: 24, name: "Telangana", short_name: "TG" },
      { id: 25, name: "Tripura", short_name: "TR" },
      { id: 26, name: "Uttar Pradesh", short_name: "UP" },
      { id: 27, name: "Uttarakhand", short_name: "UK" },
      { id: 28, name: "West Bengal", short_name: "WB" },
      { id: 29, name: "Andaman and Nicobar Islands", short_name: "AN" },
      { id: 30, name: "Chandigarh", short_name: "CH" },
      { id: 31, name: "Dadra and Nagar Haveli and Daman and Diu", short_name: "DN" },
      { id: 32, name: "Delhi", short_name: "DL" },
      { id: 33, name: "Jammu and Kashmir", short_name: "JK" },
      { id: 34, name: "Ladakh", short_name: "LA" },
      { id: 35, name: "Lakshadweep", short_name: "LD" },
      { id: 36, name: "Puducherry", short_name: "PY" }
    ];
    const state = states.find(s => s.id === parseInt(stateId.toString()));
    return state ? state.name : stateId;
  };

  const getCityName = (cityId: string | number) => {
    const cities = [
      { id: 1, name: "Bilaspur", state_id: 9 },
      { id: 2, name: "Chamba", state_id: 9 },
      { id: 3, name: "Hamirpur", state_id: 9 },
      { id: 4, name: "Kangra", state_id: 9 },
      { id: 5, name: "Kinnaur", state_id: 9 },
      { id: 6, name: "Kullu", state_id: 9 },
      { id: 7, name: "Lahaul and Spiti", state_id: 9 },
      { id: 8, name: "Mandi", state_id: 9 },
      { id: 9, name: "Shimla", state_id: 9 },
      { id: 10, name: "Sirmaur", state_id: 9 },
      { id: 11, name: "Solan", state_id: 9 },
      { id: 12, name: "Una", state_id: 9 },
      { id: 13, name: "Mumbai", state_id: 14 },
      { id: 14, name: "Pune", state_id: 14 },
      { id: 15, name: "Nagpur", state_id: 14 },
      { id: 16, name: "Thane", state_id: 14 },
      { id: 17, name: "Nashik", state_id: 14 },
      { id: 18, name: "Aurangabad", state_id: 14 },
      { id: 19, name: "New Delhi", state_id: 32 },
      { id: 20, name: "Delhi", state_id: 32 },
      { id: 21, name: "Bangalore", state_id: 11 },
      { id: 22, name: "Mysore", state_id: 11 },
      { id: 23, name: "Mangalore", state_id: 11 },
      { id: 24, name: "Chennai", state_id: 23 },
      { id: 25, name: "Coimbatore", state_id: 23 },
      { id: 26, name: "Madurai", state_id: 23 },
      { id: 27, name: "Hyderabad", state_id: 24 },
      { id: 28, name: "Warangal", state_id: 24 },
      { id: 29, name: "Ahmedabad", state_id: 7 },
      { id: 30, name: "Surat", state_id: 7 },
      { id: 31, name: "Vadodara", state_id: 7 },
      { id: 32, name: "Lucknow", state_id: 26 },
      { id: 33, name: "Kanpur", state_id: 26 },
      { id: 34, name: "Varanasi", state_id: 26 },
      { id: 35, name: "Kolkata", state_id: 28 },
      { id: 36, name: "Howrah", state_id: 28 },
      { id: 37, name: "Thiruvananthapuram", state_id: 12 },
      { id: 38, name: "Kochi", state_id: 12 },
      { id: 39, name: "Kozhikode", state_id: 12 },
      { id: 40, name: "Chandigarh", state_id: 20 },
      { id: 41, name: "Ludhiana", state_id: 20 },
      { id: 42, name: "Amritsar", state_id: 20 },
      { id: 43, name: "Gurgaon", state_id: 8 },
      { id: 44, name: "Faridabad", state_id: 8 },
      { id: 45, name: "Panipat", state_id: 8 },
      { id: 46, name: "Jaipur", state_id: 21 },
      { id: 47, name: "Jodhpur", state_id: 21 },
      { id: 48, name: "Udaipur", state_id: 21 },
      { id: 49, name: "Bhopal", state_id: 13 },
      { id: 50, name: "Indore", state_id: 13 },
      { id: 51, name: "Jabalpur", state_id: 13 },
      { id: 52, name: "Patna", state_id: 4 },
      { id: 53, name: "Gaya", state_id: 4 },
      { id: 54, name: "Bhubaneswar", state_id: 19 },
      { id: 55, name: "Cuttack", state_id: 19 },
      { id: 56, name: "Guwahati", state_id: 3 },
      { id: 57, name: "Dibrugarh", state_id: 3 },
      { id: 58, name: "Ranchi", state_id: 10 },
      { id: 59, name: "Jamshedpur", state_id: 10 },
      { id: 60, name: "Raipur", state_id: 5 },
      { id: 61, name: "Bhilai", state_id: 5 },
      { id: 62, name: "Dehradun", state_id: 27 },
      { id: 63, name: "Haridwar", state_id: 27 },
      { id: 64, name: "Panaji", state_id: 6 },
      { id: 65, name: "Margao", state_id: 6 }
    ];
    const city = cities.find(c => c.id === parseInt(cityId.toString()));
    return city ? city.name : cityId;
  };

  const [activeFilters, setActiveFilters] = useState<any>({
    sortBy: appliedFilters?.sortBy || '',
    budgetMin: appliedFilters?.budgetMin || 0,
    budgetMax: appliedFilters?.budgetMax || 100000,
    platform: appliedFilters?.platform || [],
    categories: appliedFilters?.categories || [],
    followerMin: appliedFilters?.followerMin || 0,
    followerMax: appliedFilters?.followerMax || 250000,
    audienceType: appliedFilters?.audienceType || [],
    audienceAgeGroup: appliedFilters?.audienceAgeGroup || [],
    gender: appliedFilters?.gender || '',
    languages: appliedFilters?.languages || [],
    city_id: appliedFilters?.city_id || '',
    // contentQuality: '',
    // creatorType: [],
  });

  // Sync activeFilters when appliedFilters prop changes
  useEffect(() => {
    if (appliedFilters) {
      const newActiveFilters = {
        sortBy: appliedFilters.sortBy || '',
        // location: { state: appliedFilters.location?.state || '', city: appliedFilters.location?.city || '' },
        budgetMin: appliedFilters.budgetMin || 0,
        budgetMax: appliedFilters.budgetMax || 100000,
        platform: appliedFilters.platform || [],
        categories: appliedFilters.categories || [],
        followerMin: appliedFilters.followerMin || 0,
        followerMax: appliedFilters.followerMax || 250000,
        audienceType: appliedFilters.audienceType || [],
        audienceAgeGroup: appliedFilters.audienceAgeGroup || [],
        gender: appliedFilters.gender || '',
        languages: appliedFilters.languages || [],
        city_id: appliedFilters.city_id || '',
      };
      
      console.log('🔄 FilterRow: setting activeFilters to:', newActiveFilters);
      setActiveFilters(newActiveFilters);
    }
  }, [appliedFilters]);

  // Function to count applied filters
  const getAppliedFiltersCount = () => {
    let count = 0;
    
    
    // Check sortBy (only if actually applied)
    if (activeFilters.sortBy && activeFilters.sortBy !== '') {
      count++;
    }
    
    // Check platform
    if (activeFilters.platform && activeFilters.platform.length > 0) {
      count++;
    }
    
    // Check categories
    if (activeFilters.categories && activeFilters.categories.length > 0) {
      count++;
    }
    
    // Check location
    if (activeFilters.city_id || (activeFilters.location && (activeFilters.location.state || activeFilters.location.city))) {
      count++;
    }
    
    // Check budget
    if (activeFilters.budgetMin > 0 || activeFilters.budgetMax < 100000) {
      count++;
    }
    
    // Check followers
    if (activeFilters.followerMin > 0 || activeFilters.followerMax < 250000) {
      count++;
    }
    
    // Check gender
    if (activeFilters.gender && activeFilters.gender !== '') {
      count++;
    }
    
    // Check languages
    if (activeFilters.languages && activeFilters.languages.length > 0) {
      count++;
    }
    
    // Check audience type
    if (activeFilters.audienceType && activeFilters.audienceType.length > 0) {
      count++;
    }
    
    // Check audience age group
    if (activeFilters.audienceAgeGroup && activeFilters.audienceAgeGroup.length > 0) {
      count++;
    }
    
    return count;
  };

  const appliedFiltersCount = getAppliedFiltersCount();

  const filterChips = [
    {
      id: 'filter',
      label: appliedFiltersCount > 0 ? `Filter` : 'Filter',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
        </svg>
      ),
      hasValue: appliedFiltersCount > 0,
      value:  null,
    },
    {
      id: 'sortBy',
      label: 'Sort by',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
        </svg>
      ),
      hasValue: activeFilters.sortBy && activeFilters.sortBy !== '',
      value: activeFilters.sortBy ? getSortByLabel(activeFilters.sortBy) : null,
    },
    // {
    //   id: 'instagram',
    //   label: 'Instagram',
    //   icon: (
    //     <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    //       <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    //     </svg>
    //   ),
    //   hasValue: activeFilters.platform.includes('instagram'),
    //   value: activeFilters.platform.includes('instagram') ? 'Instagram' : null,
    // },
    {
      id: 'location',
      label: 'Location',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      hasValue: !!(activeFilters.location?.state || activeFilters.location?.city),
      value: activeFilters.location?.state || activeFilters.location?.city ? 
        (() => {
          if (activeFilters.location?.state && activeFilters.location?.city) {
            // Get state and city names from the filter data
            const stateName = getStateName(activeFilters.location.state);
            const cityName = getCityName(activeFilters.location.city);
            return `${cityName}, ${stateName}`;
          } else if (activeFilters.location?.state) {
            return getStateName(activeFilters.location.state);
          } else if (activeFilters.location?.city) {
            return getCityName(activeFilters.location.city);
          }
          return '';
        })() : null,
    },
    {
      id: 'budget',
      label: 'Budget',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      ),
      hasValue: activeFilters.budgetMin > 0 || activeFilters.budgetMax < 100000,
      value: activeFilters.budgetMin > 0 || activeFilters.budgetMax < 100000 
        ? `₹${activeFilters.budgetMin.toLocaleString()} - ₹${activeFilters.budgetMax.toLocaleString()}`
        : null,
    },
    {
      id: 'followers',
      label: 'Followers',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      hasValue: !!activeFilters.followers,
      value: activeFilters.followers ? getFollowersLabel(activeFilters.followers) : null,
    },
    {
      id: 'categories',
      label: 'Categories',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
      ),
      hasValue: activeFilters.categories.length > 0,
      value: activeFilters.categories.length > 0 ? `${activeFilters.categories.length} selected` : null,
    },
    {
      id: 'platform',
      label: 'Platform',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      hasValue: activeFilters.platform.length > 0,
      value: activeFilters.platform.length > 0 ? `${activeFilters.platform.length} selected` : null,
    },
    {
      id: 'audienceType',
      label: 'Audience',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      hasValue: activeFilters.audienceType.length > 0,
      value: activeFilters.audienceType.length > 0 ? `${activeFilters.audienceType.length} selected` : null,
    },
    {
      id: 'gender',
      label: 'Gender',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      hasValue: !!activeFilters.gender,
      value: activeFilters.gender ? getGenderLabel(activeFilters.gender) : null,
    },
  ];

  function getSortByLabel(value: string | number): string {
    const labels: { [key: string]: string } = {
      '1': 'Followers: High to Low',
      '2': 'Followers: Low to High',
      '3': 'Price: High to Low',
      '4': 'Price: Low to High',
      'popularity': 'Popularity',
      'followersHigh': 'Followers: High to Low',
      'followersLow': 'Followers: Low to High',
      'nameAZ': 'Name: A to Z',
      'nameZA': 'Name: Z to A',
    };
    return labels[value.toString()] || value.toString();
  }

  function getFollowersLabel(value: string): string {
    const labels: { [key: string]: string } = {
      '0-1k': '0 to 1K',
      '1k-5k': '1K to 5K',
      '5k-10k': '5K to 10K',
      '10k-30k': '10K to 30K',
      '30k-50k': '30K to 50K',
      '50k-1m': '50K to 1M',
      '1m+': '1M+',
    };
    return labels[value] || value;
  }

  function getGenderLabel(value: string): string {
    const labels: { [key: string]: string } = {
      'male': 'Male',
      'female': 'Female',
      'other': 'Other',
    };
    return labels[value] || value;
  }

  const handleFilterClick = (filterId: string) => {
    // Map filter chip IDs to their corresponding category IDs in the filter modal
    const categoryMapping: { [key: string]: string } = {
      'filter': 'sortBy', // General filter button
      'sortBy': 'sortBy',
      // 'instagram': 'platform',
      'location': 'location',
      'budget': 'budget',
      'followers': 'followers',
      'categories': 'categories',
      'platform': 'platform',
      'audienceType': 'audienceType',
      'gender': 'gender',
    };
    
    // Set the active category based on the clicked filter
    const activeCategory = categoryMapping[filterId] || 'sortBy';
    
    // Store the active category in a way that the FilterModal can access it
    // We'll pass this as a prop to the FilterModal
    setActiveFilters((prev: any) => ({
      ...prev,
      _activeCategory: activeCategory
    }));
    
    setIsFilterOpen(true);
  };

  const handleFilterChange = (filters: any) => {
    // Remove the internal _activeCategory property before passing to parent
    const { _activeCategory, ...cleanFilters } = filters;
    setActiveFilters(cleanFilters);
    onFilterChange(cleanFilters);
  };

  const handleClearFilter = (filterId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Scroll to top when clearing filters (instant, no animation)
    window.scrollTo(0, 0);
    
    if (filterId === 'filter') {
      // Clear ALL filters when clicking the main Filter button
      const clearedFilters = {
        sortBy: '',
        platform: [],
        categories: [],
        city_id: '',
        followerMin: 0,
        followerMax: 250000,
        budgetMin: 0,
        budgetMax: 100000,
        audienceType: [],
        audienceAgeGroup: [],
        gender: '',
        languages: [],
      };
      setActiveFilters(clearedFilters);
      onFilterChange(clearedFilters);
    } else {
      // Clear specific filter
      const newFilters = { ...activeFilters };
      
      if (filterId === 'budget') {
        newFilters.budgetMin = 0;
        newFilters.budgetMax = 100000;
      } else if (filterId === 'followers') {
        newFilters.followerMin = 0;
        newFilters.followerMax = 250000;
      } else if (filterId === 'location') {
        newFilters.city_id = '';
      } else if (Array.isArray(newFilters[filterId])) {
        newFilters[filterId] = [];
      } else {
        newFilters[filterId] = '';
      }
      
      setActiveFilters(newFilters);
      onFilterChange(newFilters);
    }
  };

  return (
    <>
      {/* Filter Row */}
      <div className="bg-white sticky top-0 z-[9]">
        <div className="px-4 py-3">
          <div className="flex space-x-2 overflow-x-auto hide-scrollbar">
            {filterChips.map((chip) => (
              <button
                key={chip.id}
                onClick={() => handleFilterClick(chip.id)}
                className={`flex items-center space-x-2 px-3 py-[6px] rounded-full border-1 transition-all duration-200 whitespace-nowrap ${
                  chip.hasValue
                    ? chip.id === 'instagram' 
                      ? 'border-purple-600 bg-purple-50 text-purple-700'
                      : 'border-[#1fb036] bg-[#fff] text-[#1fb036]'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-purple-300 hover:bg-purple-50'
                }`}
              >
                {/* <div className="text-gray-700">
                  {chip.icon}
                </div> */}
                <span className="text-xs font-medium flex text-[#000]">{chip.label} {appliedFiltersCount > 0 && chip.id === 'filter' && <span className="text-xs text-white bg-[#1fb036] w-4 h-4 rounded-full block ms-1">{appliedFiltersCount}</span>}</span>
                
                {chip.hasValue && chip.value && (
                  <>
                    <span className="text-xs text-[#1fb036]">•</span>
                    <span className="text-xs text-[#1fb036] max-w-20 truncate">
                      {chip.value}
                    </span>
                    <button
                      onClick={(e) => handleClearFilter(chip.id, e)}
                      className="ml-1 text-[#000] hover:text-purple-800"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="#000" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </>
                )}
                
                {/* Show X button for main Filter button when filters are applied */}
                {chip.id === 'filter' && appliedFiltersCount > 0 && (
                  <button
                    onClick={(e) => handleClearFilter('filter', e)}
                    className="ml-1 text-[#000] hover:text-purple-800"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
                
                {/* {!chip.hasValue && (
                  <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7 7" />
                  </svg>
                )} */}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filter Modal */}
      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onFilterChange={handleFilterChange}
        initialActiveCategory={activeFilters._activeCategory}
        appliedFilters={activeFilters}
      />

      {/* Hide scrollbar styles */}
      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
} 