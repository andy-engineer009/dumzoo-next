'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FilterOption {
  value: string;
  label: string;
  default?: boolean;
}

interface FilterCategory {
  id: string;
  label: string;
  type: 'radio' | 'checkbox' | 'range' | 'text';
  options?: FilterOption[];
}

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFilterChange: (filters: any) => void;
}

const filterCategories: FilterCategory[] = [
  {
    id: 'sortBy',
    label: 'Sort by',
    type: 'radio',
    options: [
      { value: 'popularity', label: 'Popularity (Default)', default: true },
      { value: 'followersHigh', label: 'Followers: High to Low' },
      { value: 'followersLow', label: 'Followers: Low to High' },
      { value: 'nameAZ', label: 'Name: A to Z' },
      { value: 'nameZA', label: 'Name: Z to A' },
    ]
  },
  {
    id: 'socialPlatform',
    label: 'Social Platform',
    type: 'checkbox',
    options: [
      { value: 'instagram', label: 'Instagram' },
      { value: 'youtube', label: 'YouTube' },
      { value: 'tiktok', label: 'TikTok' },
      { value: 'facebook', label: 'Facebook' },
      { value: 'twitter', label: 'Twitter' },
    ]
  },
  {
    id: 'categories',
    label: 'Categories',
    type: 'checkbox',
    options: [
      { value: 'fashion', label: 'Fashion' },
      { value: 'beauty', label: 'Beauty' },
      { value: 'lifestyle', label: 'Lifestyle' },
      { value: 'food', label: 'Food' },
      { value: 'travel', label: 'Travel' },
      { value: 'fitness', label: 'Fitness' },
      { value: 'technology', label: 'Technology' },
      { value: 'education', label: 'Education' },
    ]
  },
  {
    id: 'location',
    label: 'Location',
    type: 'text',
  },
  {
    id: 'followers',
    label: 'Followers',
    type: 'radio',
    options: [
      { value: '0-1k', label: '0 to 1K' },
      { value: '1k-5k', label: '1K to 5K' },
      { value: '5k-10k', label: '5K to 10K' },
      { value: '10k-30k', label: '10K to 30K' },
      { value: '30k-50k', label: '30K to 50K' },
      { value: '50k-1m', label: '50K to 1M' },
      { value: '1m+', label: 'Greater than 1M' },
    ]
  },
  {
    id: 'budget',
    label: 'Budget',
    type: 'range',
  },
  {
    id: 'audienceType',
    label: 'Audience Type',
    type: 'checkbox',
    options: [
      { value: 'local', label: 'Local' },
      { value: 'national', label: 'National' },
      { value: 'international', label: 'International' },
      { value: 'niche', label: 'Niche' },
      { value: 'mass', label: 'Mass Market' },
    ]
  },
  {
    id: 'audienceAgeGroup',
    label: 'Audience Age Group',
    type: 'checkbox',
    options: [
      { value: '13-17', label: '13-17 years' },
      { value: '18-24', label: '18-24 years' },
      { value: '25-34', label: '25-34 years' },
      { value: '35-44', label: '35-44 years' },
      { value: '45-54', label: '45-54 years' },
      { value: '55+', label: '55+ years' },
    ]
  },
  {
    id: 'gender',
    label: 'Gender',
    type: 'radio',
    options: [
      { value: 'male', label: 'Male' },
      { value: 'female', label: 'Female' },
      { value: 'other', label: 'Other' },
    ]
  },
  {
    id: 'contentLanguage',
    label: 'Content Language',
    type: 'checkbox',
    options: [
      { value: 'english', label: 'English' },
      { value: 'hindi', label: 'Hindi' },
      { value: 'spanish', label: 'Spanish' },
      { value: 'french', label: 'French' },
    ]
  },
  {
    id: 'contentQuality',
    label: 'Content Quality',
    type: 'radio',
    options: [
      { value: 'high', label: 'High Quality' },
      { value: 'medium', label: 'Medium Quality' },
      { value: 'low', label: 'Low Quality' },
    ]
  },
  {
    id: 'creatorType',
    label: 'Creator Type',
    type: 'checkbox',
    options: [
      { value: 'influencer', label: 'Influencer' },
      { value: 'celebrity', label: 'Celebrity' },
      { value: 'micro', label: 'Micro Creator' },
      { value: 'nano', label: 'Nano Creator' },
    ]
  },
];

export default function FilterModal({ isOpen, onClose, onFilterChange }: FilterModalProps) {
  const [activeCategory, setActiveCategory] = useState('sortBy');
  const [selectedFilters, setSelectedFilters] = useState<any>({
    sortBy: 'popularity',
    socialPlatform: [],
    categories: [],
    location: '',
    followers: '',
    budget: { min: 0, max: 100000 },
    audienceType: [],
    audienceAgeGroup: [],
    gender: '',
    contentLanguage: [],
    contentQuality: '',
    creatorType: [],
  });

  // Get current category data
  const currentCategory = filterCategories.find(cat => cat.id === activeCategory);

  // Handle filter changes and trigger API call
  const handleFilterChange = (categoryId: string, value: any) => {
    const newFilters = {
      ...selectedFilters,
      [categoryId]: value
    };
    
    setSelectedFilters(newFilters);
    
    // Trigger API call immediately
    onFilterChange(newFilters);
  };

  // Handle radio button selection
  const handleRadioChange = (value: string) => {
    handleFilterChange(activeCategory, value);
  };

  // Handle checkbox selection
  const handleCheckboxChange = (value: string, checked: boolean) => {
    const currentValues = selectedFilters[activeCategory] || [];
    let newValues;
    
    if (checked) {
      newValues = [...currentValues, value];
    } else {
      newValues = currentValues.filter((v: string) => v !== value);
    }
    
    handleFilterChange(activeCategory, newValues);
  };

  // Handle range slider
  const handleRangeChange = (type: 'min' | 'max', value: number) => {
    const currentRange = selectedFilters[activeCategory] || { min: 0, max: 100000 };
    let newRange = { ...currentRange, [type]: value };
    
    // Budget validation: ensure max is not less than min
    if (activeCategory === 'budget') {
      if (type === 'min' && value > newRange.max) {
        newRange = { min: value, max: value };
      } else if (type === 'max' && value < newRange.min) {
        newRange = { min: newRange.min, max: newRange.min };
      }
    }
    
    handleFilterChange(activeCategory, newRange);
  };

  // Handle text input
  const handleTextChange = (value: string) => {
    handleFilterChange(activeCategory, value);
  };

  // Clear all filters
  const handleClearFilters = () => {
    const defaultFilters = {
      sortBy: 'popularity',
      socialPlatform: [],
      categories: [],
      location: '',
      followers: '',
      budget: { min: 0, max: 100000 },
      audienceType: [],
      audienceAgeGroup: [],
      gender: '',
      contentLanguage: [],
      contentQuality: '',
      creatorType: [],
    };
    
    setSelectedFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  // Render filter options based on type
  const renderFilterOptions = () => {
    if (!currentCategory) return null;

    switch (currentCategory.type) {
      case 'radio':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{currentCategory.label}</h3>
            {currentCategory.options?.map((option) => (
              <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name={currentCategory.id}
                  value={option.value}
                  checked={selectedFilters[currentCategory.id] === option.value}
                  onChange={() => handleRadioChange(option.value)}
                  className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 focus:ring-purple-500"
                />
                <span className="text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{currentCategory.label}</h3>
            {currentCategory.options?.map((option) => (
              <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  value={option.value}
                  checked={selectedFilters[currentCategory.id]?.includes(option.value)}
                  onChange={(e) => handleCheckboxChange(option.value, e.target.checked)}
                  className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                />
                <span className="text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        );

      case 'range':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{currentCategory.label}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {currentCategory.id === 'budget' ? 'Min Budget (₹)' : 'Min Followers'}
                </label>
                <input
                  type="number"
                  value={selectedFilters[currentCategory.id]?.min || 0}
                  onChange={(e) => handleRangeChange('min', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder={currentCategory.id === 'budget' ? '0' : '0'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {currentCategory.id === 'budget' ? 'Max Budget (₹)' : 'Max Followers'}
                </label>
                <input
                  type="number"
                  value={selectedFilters[currentCategory.id]?.max || (currentCategory.id === 'budget' ? 100000 : 1000000)}
                  onChange={(e) => handleRangeChange('max', parseInt(e.target.value) || (currentCategory.id === 'budget' ? 100000 : 1000000))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder={currentCategory.id === 'budget' ? '100000' : '1000000'}
                />
                {currentCategory.id === 'budget' && selectedFilters[currentCategory.id]?.max < selectedFilters[currentCategory.id]?.min && (
                  <p className="text-red-500 text-sm mt-1">Max amount cannot be less than min amount</p>
                )}
              </div>
            </div>
          </div>
        );

      case 'text':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{currentCategory.label}</h3>
            <input
              type="text"
              value={selectedFilters[currentCategory.id] || ''}
              onChange={(e) => handleTextChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder={`Enter ${currentCategory.label.toLowerCase()}`}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                </svg>
                <h2 className="text-xl font-bold text-gray-800">All Filters</h2>
              </div>
            </div>

            {/* Content */}
            <div className="flex h-[calc(90vh-140px)]">
              {/* Left Panel - Filter Categories */}
              <div className="w-1/3 bg-gray-50 border-r border-gray-200 overflow-y-auto">
                {filterCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full text-left px-4 py-3 border-l-4 transition-colors ${
                      activeCategory === category.id
                        ? 'bg-purple-100 border-purple-500 text-purple-700'
                        : 'border-transparent text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>

              {/* Right Panel - Filter Options */}
              <div className="w-2/3 p-4 overflow-y-auto">
                {renderFilterOptions()}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 p-4 border-t border-gray-200">
              <button
                onClick={handleClearFilters}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Clear Filters
              </button>
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900 transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
