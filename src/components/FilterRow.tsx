'use client';

import { useState } from 'react';
import FilterModal from './filter';

interface FilterRowProps {
  onFilterChange: (filters: any) => void;
}

export default function FilterRow({ onFilterChange }: FilterRowProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<any>({
    sortBy: '',
    location: '',
    budget: { min: 0, max: 100000 },
    socialPlatform: [],
    categories: [],
    followers: '',
    audienceType: [],
    audienceAgeGroup: [],
    gender: '',
    contentLanguage: [],
    contentQuality: '',
    creatorType: [],
  });

  const filterChips = [
    {
      id: 'filter',
      label: 'Filter',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
        </svg>
      ),
      hasValue: false,
      value: null,
    },
    {
      id: 'sortBy',
      label: 'Sort by',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7 7" />
        </svg>
      ),
      hasValue: !!activeFilters.sortBy,
      value: activeFilters.sortBy ? getSortByLabel(activeFilters.sortBy) : null,
    },
    {
      id: 'instagram',
      label: 'Instagram',
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      ),
      hasValue: activeFilters.socialPlatform.includes('instagram'),
      value: activeFilters.socialPlatform.includes('instagram') ? 'Instagram' : null,
    },
    {
      id: 'location',
      label: 'Location',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      hasValue: !!activeFilters.location,
      value: activeFilters.location,
    },
    {
      id: 'budget',
      label: 'Budget',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      ),
      hasValue: activeFilters.budget.min > 0 || activeFilters.budget.max < 100000,
      value: activeFilters.budget.min > 0 || activeFilters.budget.max < 100000 
        ? `₹${activeFilters.budget.min.toLocaleString()} - ₹${activeFilters.budget.max.toLocaleString()}`
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
      id: 'socialPlatform',
      label: 'Platform',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      hasValue: activeFilters.socialPlatform.length > 0,
      value: activeFilters.socialPlatform.length > 0 ? `${activeFilters.socialPlatform.length} selected` : null,
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

  function getSortByLabel(value: string): string {
    const labels: { [key: string]: string } = {
      'popularity': 'Popularity',
      'followersHigh': 'Followers: High to Low',
      'followersLow': 'Followers: Low to High',
      'nameAZ': 'Name: A to Z',
      'nameZA': 'Name: Z to A',
    };
    return labels[value] || value;
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
    setIsFilterOpen(true);
  };

  const handleFilterChange = (filters: any) => {
    setActiveFilters(filters);
    onFilterChange(filters);
  };

  const handleClearFilter = (filterId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newFilters = { ...activeFilters };
    
    if (filterId === 'budget') {
      newFilters.budget = { min: 0, max: 100000 };
    } else if (Array.isArray(newFilters[filterId])) {
      newFilters[filterId] = [];
    } else {
      newFilters[filterId] = '';
    }
    
    setActiveFilters(newFilters);
    onFilterChange(newFilters);
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
                className={`flex items-center space-x-2 px-3 py-2 rounded-full border-1 transition-all duration-200 whitespace-nowrap ${
                  chip.hasValue
                    ? chip.id === 'instagram' 
                      ? 'border-purple-600 bg-purple-50 text-purple-700'
                      : 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-purple-300 hover:bg-purple-50'
                }`}
              >
                <div className="text-gray-700">
                  {chip.icon}
                </div>
                <span className="text-sm font-medium">{chip.label}</span>
                
                {chip.hasValue && chip.value && (
                  <>
                    <span className="text-xs text-purple-600">•</span>
                    <span className="text-xs text-purple-600 max-w-20 truncate">
                      {chip.value}
                    </span>
                    <button
                      onClick={(e) => handleClearFilter(chip.id, e)}
                      className="ml-1 text-purple-600 hover:text-purple-800"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </>
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