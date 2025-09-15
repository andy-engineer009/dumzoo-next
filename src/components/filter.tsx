'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Select from 'react-select';
import citiesData from '@/data/cities.json';
// Import states and cities data
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

// Custom Select Styles
const customSelectStyles = {
  control: (provided: any, state: any) => ({
    ...provided,
    padding: '8px 12px',
    border: state.isFocused ? '2px solid #1fb036' : '1px solid #d1d5db',
    borderRadius: '8px',
    boxShadow: state.isFocused ? '0 0 0 2px rgba(31, 176, 54, 0.1)' : 'none',
    '&:hover': {
      border: state.isFocused ? '2px solid #1fb036' : '1px solid #9ca3af'
    }
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isSelected ? '#1fb036' : state.isFocused ? '#f3f4f6' : 'white',
    color: state.isSelected ? 'white' : '#000',
    padding: '12px 16px',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: state.isSelected ? '#1fb036' : '#f3f4f6'
    }
  }),
  multiValue: (provided: any) => ({
    ...provided,
    backgroundColor: '#1fb036',
    color: 'white'
  }),
  multiValueLabel: (provided: any) => ({
    ...provided,
    color: 'white'
  }),
  multiValueRemove: (provided: any) => ({
    ...provided,
    color: 'white',
    '&:hover': {
      backgroundColor: '#1fb036',
      color: 'white'
    }
  })
};

// Create cities options with state names included
const cities = citiesData;

interface FilterOption {
  value: any;
  label: string;
  default?: boolean;
}

interface FilterCategory {
  id: string;
  label: string;
  type: 'radio' | 'checkbox' | 'range' | 'text' | 'location';
  options?: FilterOption[];
}

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFilterChange: (filters: any) => void;
  initialActiveCategory?: string;
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
    id: 'platform',
    label: 'Social Platform',
    type: 'checkbox',
    options: [
      { value: 'instagram', label: 'Instagram' },
      { value: 'youtube', label: 'YouTube' },
      { value: 'facebook', label: 'Facebook' },
    ]
  },
  {
    id: 'categories',
    label: 'Categories',
    type: 'checkbox',
    options: [
        { value: 1, label: 'Art' },
        { value: 2, label: 'Acting' },
        { value: 3, label: 'Adventure' },
        { value: 4, label: 'Animals & Pets' },
        { value: 5, label: 'Automotive' },
        { value: 6, label: 'Beauty' },
        { value: 7, label: 'Blogging' },
        { value: 8, label: 'Books' },
        { value: 9, label: 'Business & Entrepreneurship' },
        { value: 10, label: 'Comedy' },
        { value: 11, label: 'Cooking' },
        { value: 12, label: 'Crafts' },
        { value: 13, label: 'Culture' },
        { value: 14, label: 'Career & Jobs' },
        { value: 15, label: 'Dance' },
        { value: 16, label: 'DIY (Do It Yourself)' },
        { value: 17, label: 'Design' },
        { value: 18, label: 'Digital Marketing' },
        { value: 19, label: 'Education' },
        { value: 20, label: 'Entertainment' },
        { value: 21, label: 'Environment' },
        { value: 22, label: 'Events' },
        { value: 23, label: 'Fashion' },
        { value: 24, label: 'Finance' },
        { value: 25, label: 'Fitness' },
        { value: 26, label: 'Food' },
        { value: 27, label: 'Family & Parenting' },
        { value: 28, label: 'Gaming' },
        { value: 29, label: 'Gardening' },
        { value: 30, label: 'Graphic Design' },
        { value: 31, label: 'Gadgets & Tech Reviews' },
        { value: 32, label: 'Health' },
        { value: 33, label: 'Home Decor' },
        { value: 34, label: 'Hiking' },
        { value: 35, label: 'History' },
        { value: 36, label: 'Inspiration & Motivation' },
        { value: 37, label: 'Interior Design' },
        { value: 38, label: 'Investments' },
        { value: 39, label: 'Illustration' },
        { value: 40, label: 'Jewellery' },
        { value: 41, label: 'Journalism' },
        { value: 42, label: 'Jobs & Career Tips' },
        { value: 43, label: 'Kids & Parenting' },
        { value: 44, label: 'Kitchen Hacks' },
        { value: 45, label: 'Knowledge Sharing' },
        { value: 46, label: 'Lifestyle' },
        { value: 47, label: 'Luxury' },
        { value: 48, label: 'Literature' },
        { value: 49, label: 'Language Learning' },
        { value: 50, label: 'Makeup' },
        { value: 51, label: 'Motivation' },
        { value: 52, label: 'Mental Health' },
        { value: 53, label: 'Movies & TV' },
        { value: 54, label: 'Nature' },
        { value: 55, label: 'Nutrition' },
        { value: 56, label: 'News & Politics' },
        { value: 57, label: 'Non-profits & Causes' },
        { value: 58, label: 'Outdoors' },
        { value: 59, label: 'Online Business' },
        { value: 60, label: 'Organic Living' },
        { value: 61, label: 'Photography' },
        { value: 62, label: 'Personal Development' },
        { value: 63, label: 'Pets' },
        { value: 64, label: 'Podcasts' },
        { value: 65, label: 'Productivity' },
        { value: 66, label: 'Quotes & Motivation' },
        { value: 67, label: 'Quick Recipes' },
        { value: 68, label: 'Recipes' },
        { value: 69, label: 'Reviews' },
        { value: 70, label: 'Relationships' },
        { value: 71, label: 'Road Trips' },
        { value: 72, label: 'Real Estate' },
        { value: 73, label: 'Sports' },
        { value: 74, label: 'Spirituality' },
        { value: 75, label: 'Science' },
        { value: 76, label: 'Singing' },
        { value: 77, label: 'Skincare' },
        { value: 78, label: 'Startups' },
        { value: 79, label: 'Travel' },
        { value: 80, label: 'Technology' },
        { value: 81, label: 'Theatre' },
        { value: 82, label: 'Tutorials' },
        { value: 83, label: 'Training & Coaching' },
        { value: 84, label: 'Urban Exploration' },
        { value: 85, label: 'Upcycling' },
        { value: 86, label: 'UI/UX Design' },
        { value: 87, label: 'Vlogging' },
        { value: 88, label: 'Vegan Lifestyle' },
        { value: 89, label: 'Visual Arts' },
        { value: 90, label: 'Volunteering' },
        { value: 91, label: 'Wellness' },
        { value: 92, label: 'Wildlife' },
        { value: 93, label: 'Writing' },
        { value: 94, label: 'Wedding Planning' },
        { value: 95, label: 'Workout' },
        { value: 96, label: 'Extreme Sports' },
        { value: 97, label: 'Experiential Travel' },
        { value: 98, label: 'Exhibitions' },
        { value: 99, label: 'Yoga' },
        { value: 100, label: 'Youth Lifestyle' },
        { value: 101, label: 'YouTube Tutorials' },
        { value: 102, label: 'Zero Waste Lifestyle' },
        { value: 103, label: 'Zoology Awareness' }
      ]
  },
  {
    id: 'location',
    label: 'Location',
    type: 'location',
  },
  {
    id: 'followers',
    label: 'Followers',
    type: 'range',
  },
  {
    id: 'budget',
    label: 'Budget',
    type: 'range',
  },
  {
    id: 'gender',
    label: 'Gender',
    type: 'radio',
    options: [
      { value: 0, label: 'All' },
      { value: 1, label: 'Male' },
      { value: 2, label: 'Female' },
      { value: 3, label: 'Other' },
    ]
  },
  {
    id: 'languages',
    label: 'Language',
    type: 'checkbox',
    options: [
      { value: 0, label: 'All' },
      { value: 1, label: 'Hindi' },
      { value: 2, label: 'English' },
      { value: 3, label: 'Punjabi' },
      { value: 4, label: 'Marathi' },
      { value: 5, label: 'Haryanvi' },
      { value: 6, label: 'Bhojpuri' },
      { value: 7, label: 'Rajasthani' },
      { value: 8, label: 'Tamil' },
      { value: 9, label: 'Telugu' },
      { value: 10, label: 'Urdu' },
      { value: 11, label: 'Kannada' },
      { value: 12, label: 'Malayalam' },
      { value: 13, label: 'Nepali' },
      { value: 14, label: 'Sanskrit' },
      { value: 15, label: 'Bengali' },
      { value: 16, label: 'Assamese' }
    ]
  },
  {
    id: 'audienceType',
    label: 'Audience Type',
    type: 'checkbox',
    options: [
      { value: 0, label: 'All' },
      { value: 1, label: 'General' },
      { value: 2, label: 'Niche' },
      { value: 3, label: 'Specific' },
    ]
  },
  {
    id: 'audienceAgeGroup',
    label: 'Audience Age Group',
    type: 'checkbox',
    options: [
      { value: 0  , label: 'All' },
      { value: 1, label: '13-18 years' },
      { value: 2, label: '19-25 years' },
      { value: 3, label: '26-35 years' },
      { value: 4, label: '36-45 years' },
      { value: 5, label: '46-55 years' },
      { value: 6, label: '56+ years' },
    ]
  },

  // {
  //   id: 'contentQuality',
  //   label: 'Content Quality',
  //   type: 'radio',
  //   options: [
  //     { value: 'high', label: 'High Quality' },
  //     { value: 'medium', label: 'Medium Quality' },
  //     { value: 'low', label: 'Low Quality' },
  //   ]
  // },
  // {
  //   id: 'creatorType',
  //   label: 'Creator Type',
  //   type: 'checkbox',
  //   options: [
  //     { value: 'influencer', label: 'Influencer' },
  //     { value: 'celebrity', label: 'Celebrity' },
  //     { value: 'micro', label: 'Micro Creator' },
  //     { value: 'nano', label: 'Nano Creator' },
  //   ]
  // },
];

export default function FilterModal({ isOpen, onClose, onFilterChange, initialActiveCategory }: FilterModalProps) {
  // Add custom styles for range slider
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      input[type="range"] {
        -webkit-appearance: none;
        appearance: none;
        height: 8px;
        border-radius: 4px;
        outline: none;
      }
      
      input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: #1fb036;
        cursor: pointer;
        border: 3px solid #ffffff;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        margin-top: -8px;
      }
      
      input[type="range"]::-moz-range-thumb {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: #1fb036;
        cursor: pointer;
        border: 3px solid #ffffff;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        border: none;
      }
      
      input[type="range"]::-webkit-slider-track {
        height: 8px;
        border-radius: 4px;
        background: transparent;
      }
      
      input[type="range"]::-moz-range-track {
        height: 8px;
        border-radius: 4px;
        background: transparent;
      }
      
      input[type="range"]:focus::-webkit-slider-thumb {
        box-shadow: 0 0 0 4px rgba(31, 176, 54, 0.3);
      }
      
      input[type="range"]:focus::-moz-range-thumb {
        box-shadow: 0 0 0 4px rgba(31, 176, 54, 0.3);
      }
      
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  const [activeCategory, setActiveCategory] = useState(initialActiveCategory || 'sortBy');
  
  // Update active category when initialActiveCategory prop changes
  useEffect(() => {
    if (initialActiveCategory) {
      setActiveCategory(initialActiveCategory);
    }
  }, [initialActiveCategory]);
  
  const [selectedFilters, setSelectedFilters] = useState<any>({
    sortBy: 'popularity',
    platform: [],
    gender: '',
    budgetMin: 0,
    budgetMax: 100000,
    followerMin: 0,
    followerMax: 250000,
    categories: [],
    langenceType: [],
    audiuages: [],
    audienceAgeGroup: [],

    location: { state: '', city: '' },
    contentQuality: '',
    creatorType: [],
  });

  // Get current category data
  const currentCategory = filterCategories.find(cat => cat.id === activeCategory);

  // Handle filter changes without triggering API call
  const handleFilterChange = (categoryId: string, value: any) => {
    const newFilters = {
      ...selectedFilters,
      [categoryId]: value
    };
    
    setSelectedFilters(newFilters);
    console.log(newFilters);
    
    // Don't trigger API call immediately - wait for Apply button
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

  // Handle range slider for budget
  const handleBudgetRangeChange = (min: number, max: number) => {
    const newFilters = {
      ...selectedFilters,
      budgetMin: min,
      budgetMax: max
    };
    
    setSelectedFilters(newFilters);
    // Don't trigger API call immediately - wait for Apply button
  };

  // Handle range slider for followers
  const handleFollowerRangeChange = (min: number, max: number) => {
    const newFilters = {
      ...selectedFilters,
      followerMin: min,
      followerMax: max
    };
    
    setSelectedFilters(newFilters);
    // Don't trigger API call immediately - wait for Apply button
  };

  // Handle text input
  const handleTextChange = (value: string) => {
    handleFilterChange(activeCategory, value);
  };

  // Clear all filters
  const handleClearFilters = () => {
    const defaultFilters = {
      sortBy: 'popularity',
      platform: [],
      categories: [],
      location: { state: '', city: '' },
      followerMin: 0,
      followerMax: 250000,
      budgetMin: 0,
      budgetMax: 100000,
      audienceType: [],
      audienceAgeGroup: [],
      gender: '',
      languages: [],
      // contentQuality: '',
      // creatorType: [],
    };
    
    setSelectedFilters(defaultFilters);
    // Don't trigger API call immediately - wait for Apply button
  };

  // Apply filters and trigger API call
  const handleApplyFilters = () => {
    console.log(selectedFilters);
    onFilterChange(selectedFilters);
    onClose(); // Close the modal after applying
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
                  className="w-4 h-4 text-[#1fb036] bg-gray-100 border-gray-300 focus:ring-[#1fb036]"
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
                  className="w-4 h-4 text-[#1fb036] bg-gray-100 border-gray-300 rounded focus:ring-[#1fb036]"
                />
                <span className="text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        );

      case 'range':
        const isBudget = currentCategory.id === 'budget';
        const isFollowers = currentCategory.id === 'followers';
        
        if (isBudget) {
          return (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">{currentCategory.label}</h3>
              <div className="space-y-6">
                {/* Range Slider */}
                <div className="relative">
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-4">
                      <span>Min: ₹{selectedFilters.budgetMin?.toLocaleString() || 0}</span>
                      <span>Max: ₹{selectedFilters.budgetMax?.toLocaleString() || 100000}</span>
                </div>
                    
                    {/* Single Dual-Handle Range Slider */}
                    <div className="relative budget-slider">
                      {/* Track Background */}
                      <div className="w-full h-2 bg-gray-200 rounded-lg"></div>
                      
                      {/* Active Range */}
                      <div 
                        className="absolute top-0 h-2 bg-[#000] rounded-lg"
                        style={{
                          left: `${(selectedFilters.budgetMin / 100000) * 100}%`,
                          width: `${((selectedFilters.budgetMax - selectedFilters.budgetMin) / 100000) * 100}%`
                        }}
                      ></div>
                      
                      {/* Min Handle */}
                      <div 
                        className="absolute w-6 h-6 bg-[#fff] border-[#000] rounded-full border-2 shadow-lg cursor-pointer transform -translate-y-[17px] select-none"
                        style={{
                          left: `calc(${(selectedFilters.budgetMin / 100000) * 100}% - 12px)`
                        }}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          
                          const handleMouseMove = (e: MouseEvent) => {
                            const slider = document.querySelector('.budget-slider') as HTMLElement;
                            if (!slider) return;
                            
                            const rect = slider.getBoundingClientRect();
                            const percentage = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
                            const newValue = Math.round((percentage / 100) * 100000 / 100) * 100;
                            const maxValue = selectedFilters.budgetMax;
                            
                            if (newValue < maxValue && newValue >= 0) {
                              handleBudgetRangeChange(newValue, maxValue);
                            }
                          };
                          
                          const handleMouseUp = () => {
                            document.removeEventListener('mousemove', handleMouseMove);
                            document.removeEventListener('mouseup', handleMouseUp);
                          };
                          
                          document.addEventListener('mousemove', handleMouseMove);
                          document.addEventListener('mouseup', handleMouseUp);
                        }}
                        onTouchStart={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          
                          const handleTouchMove = (e: TouchEvent) => {
                            const slider = document.querySelector('.budget-slider') as HTMLElement;
                            if (!slider || !e.touches[0]) return;
                            
                            const rect = slider.getBoundingClientRect();
                            const percentage = Math.max(0, Math.min(100, ((e.touches[0].clientX - rect.left) / rect.width) * 100));
                            const newValue = Math.round((percentage / 100) * 100000 / 100) * 100;
                            const maxValue = selectedFilters.budgetMax;
                            
                            if (newValue < maxValue && newValue >= 0) {
                              handleBudgetRangeChange(newValue, maxValue);
                            }
                          };
                          
                          const handleTouchEnd = () => {
                            document.removeEventListener('touchmove', handleTouchMove);
                            document.removeEventListener('touchend', handleTouchEnd);
                          };
                          
                          document.addEventListener('touchmove', handleTouchMove);
                          document.addEventListener('touchend', handleTouchEnd);
                        }}
                      ></div>
                      
                      {/* Max Handle */}
                      <div 
                        className="absolute w-6 h-6 bg-[#fff] border-[#000] rounded-full border-2 shadow-lg cursor-pointer transform -translate-y-[17px] select-none"
                        style={{
                          left: `calc(${(selectedFilters.budgetMax / 100000) * 100}% - 12px)`
                        }}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          
                          const handleMouseMove = (e: MouseEvent) => {
                            const slider = document.querySelector('.budget-slider') as HTMLElement;
                            if (!slider) return;
                            
                            const rect = slider.getBoundingClientRect();
                            const percentage = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
                            const newValue = Math.round((percentage / 100) * 100000 / 100) * 100;
                            const minValue = selectedFilters.budgetMin;
                            
                            if (newValue > minValue && newValue <= 100000) {
                              handleBudgetRangeChange(minValue, newValue);
                            }
                          };
                          
                          const handleMouseUp = () => {
                            document.removeEventListener('mousemove', handleMouseMove);
                            document.removeEventListener('mouseup', handleMouseUp);
                          };
                          
                          document.addEventListener('mousemove', handleMouseMove);
                          document.addEventListener('mouseup', handleMouseUp);
                        }}
                        onTouchStart={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          
                          const handleTouchMove = (e: TouchEvent) => {
                            const slider = document.querySelector('.budget-slider') as HTMLElement;
                            if (!slider || !e.touches[0]) return;
                            
                            const rect = slider.getBoundingClientRect();
                            const percentage = Math.max(0, Math.min(100, ((e.touches[0].clientX - rect.left) / rect.width) * 100));
                            const newValue = Math.round((percentage / 100) * 100000 / 100) * 100;
                            const minValue = selectedFilters.budgetMin;
                            
                            if (newValue > minValue && newValue <= 100000) {
                              handleBudgetRangeChange(minValue, newValue);
                            }
                          };
                          
                          const handleTouchEnd = () => {
                            document.removeEventListener('touchmove', handleTouchMove);
                            document.removeEventListener('touchend', handleTouchEnd);
                          };
                          
                          document.addEventListener('touchmove', handleTouchMove);
                          document.addEventListener('touchend', handleTouchEnd);
                        }}
                      ></div>
                      
                    {/* Value Display */}
                    {/* <div className="flex justify-between text-sm text-gray-600 mt-6">
                      <span>Minss: ₹{selectedFilters.budgetMin?.toLocaleString() || 0}</span>
                      <span>Max: ₹{selectedFilters.budgetMax?.toLocaleString() || 100000}</span>
                    </div> */}
                    
                    {/* Manual Input Fields */}
                    <div className="grid grid-cols-2 gap-4 mt-7">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Min Budget (₹)</label>
                        <input
                          type="number"
                          min="0"
                          max="100000"
                          step="100"
                          value={selectedFilters.budgetMin || 0}
                          onChange={(e) => {
                            const value = Math.max(0, Math.min(100000, parseInt(e.target.value) || 0));
                            const maxValue = selectedFilters.budgetMax;
                            if (value <= maxValue) {
                              handleBudgetRangeChange(value, maxValue);
                            }
                          }}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1fb036] focus:border-[#1fb036]"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Max Budget (₹)</label>
                        <input
                          type="number"
                          min="0"
                          max="100000"
                          step="100"
                          value={selectedFilters.budgetMax || 100000}
                          onChange={(e) => {
                            const value = Math.max(0, Math.min(100000, parseInt(e.target.value) || 100000));
                            const minValue = selectedFilters.budgetMin;
                            if (value >= minValue) {
                              handleBudgetRangeChange(minValue, value);
                            }
                          }}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1fb036] focus:border-[#1fb036]"
                          placeholder="100000"
                        />
                      </div>
                    </div>
                    </div>
                    
                    {/* Range Labels */}
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>₹0</span>
                      <span>₹1L</span>
                    </div>
                  </div>
                </div>
                
                {/* Quick Select Buttons */}
                {/* <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleBudgetRangeChange(0, 10000)}
                    className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    ₹0 - ₹10K
                  </button>
                  <button
                    onClick={() => handleBudgetRangeChange(10000, 25000)}
                    className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    ₹10K - ₹25K
                  </button>
                  <button
                    onClick={() => handleBudgetRangeChange(25000, 50000)}
                    className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    ₹25K - ₹50K
                  </button>
                  <button
                    onClick={() => handleBudgetRangeChange(50000, 75000)}
                    className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    ₹50K - ₹75K
                  </button>
                  <button
                    onClick={() => handleBudgetRangeChange(75000, 100000)}
                    className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    ₹75K - ₹1L
                  </button>
                  <button
                    onClick={() => handleBudgetRangeChange(0, 100000)}
                    className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    All Ranges
                  </button>
                </div> */}
              </div>
            </div>
          );
        }
        
        if (isFollowers) {
          return (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">{currentCategory.label}</h3>
              <div className="space-y-6">
                {/* Range Slider */}
                <div className="relative">
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-4">
                      <span>Min: {selectedFilters.followerMin?.toLocaleString() || 0}</span>
                      <span>Max: {selectedFilters.followerMax?.toLocaleString() || 250000}</span>
                </div>
                    
                    {/* Single Dual-Handle Range Slider */}
                    <div className="relative followers-slider">
                      {/* Track Background */}
                      <div className="w-full h-2 bg-gray-200 rounded-lg"></div>
                      
                      {/* Active Range */}
                      <div 
                        className="absolute top-0 h-2 bg-[#000] rounded-lg"
                        style={{
                          left: `${(selectedFilters.followerMin / 250000) * 100}%`,
                          width: `${((selectedFilters.followerMax - selectedFilters.followerMin) / 250000) * 100}%`
                        }}
                      ></div>
                      
                      {/* Min Handle */}
                      <div 
                        className="absolute w-6 h-6 bg-[#fff] border-[#000] rounded-full border-2 shadow-lg cursor-pointer transform -translate-y-[17px] select-none"
                        style={{
                          left: `calc(${(selectedFilters.followerMin / 250000) * 100}% - 12px)`
                        }}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          
                          const handleMouseMove = (e: MouseEvent) => {
                            const slider = document.querySelector('.followers-slider') as HTMLElement;
                            if (!slider) return;
                            
                            const rect = slider.getBoundingClientRect();
                            const percentage = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
                            const newValue = Math.round((percentage / 100) * 250000 / 1000) * 1000;
                            const maxValue = selectedFilters.followerMax;
                            
                            if (newValue < maxValue && newValue >= 0) {
                              handleFollowerRangeChange(newValue, maxValue);
                            }
                          };
                          
                          const handleMouseUp = () => {
                            document.removeEventListener('mousemove', handleMouseMove);
                            document.removeEventListener('mouseup', handleMouseUp);
                          };
                          
                          document.addEventListener('mousemove', handleMouseMove);
                          document.addEventListener('mouseup', handleMouseUp);
                        }}
                        onTouchStart={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          
                          const handleTouchMove = (e: TouchEvent) => {
                            const slider = document.querySelector('.followers-slider') as HTMLElement;
                            if (!slider || !e.touches[0]) return;
                            
                            const rect = slider.getBoundingClientRect();
                            const percentage = Math.max(0, Math.min(100, ((e.touches[0].clientX - rect.left) / rect.width) * 100));
                            const newValue = Math.round((percentage / 100) * 250000 / 1000) * 1000;
                            const maxValue = selectedFilters.followerMax;
                            
                            if (newValue < maxValue && newValue >= 0) {
                              handleFollowerRangeChange(newValue, maxValue);
                            }
                          };
                          
                          const handleTouchEnd = () => {
                            document.removeEventListener('touchmove', handleTouchMove);
                            document.removeEventListener('touchend', handleTouchEnd);
                          };
                          
                          document.addEventListener('touchmove', handleTouchMove);
                          document.addEventListener('touchend', handleTouchEnd);
                        }}
                      ></div>
                      
                      {/* Max Handle */}
                      <div 
                        className="absolute w-6 h-6 bg-[#fff] border-[#000] rounded-full border-2 shadow-lg cursor-pointer transform -translate-y-[17px] select-none"
                        style={{
                          left: `calc(${(selectedFilters.followerMax / 250000) * 100}% - 12px)`
                        }}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          
                          const handleMouseMove = (e: MouseEvent) => {
                            const slider = document.querySelector('.followers-slider') as HTMLElement;
                            if (!slider) return;
                            
                            const rect = slider.getBoundingClientRect();
                            const percentage = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
                            const newValue = Math.round((percentage / 100) * 250000 / 1000) * 1000;
                            const minValue = selectedFilters.followerMin;
                            
                            if (newValue > minValue && newValue <= 250000) {
                              handleFollowerRangeChange(minValue, newValue);
                            }
                          };
                          
                          const handleMouseUp = () => {
                            document.removeEventListener('mousemove', handleMouseMove);
                            document.removeEventListener('mouseup', handleMouseUp);
                          };
                          
                          document.addEventListener('mousemove', handleMouseMove);
                          document.addEventListener('mouseup', handleMouseUp);
                        }}
                        onTouchStart={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          
                          const handleTouchMove = (e: TouchEvent) => {
                            const slider = document.querySelector('.followers-slider') as HTMLElement;
                            if (!slider || !e.touches[0]) return;
                            
                            const rect = slider.getBoundingClientRect();
                            const percentage = Math.max(0, Math.min(100, ((e.touches[0].clientX - rect.left) / rect.width) * 100));
                            const newValue = Math.round((percentage / 100) * 250000 / 1000) * 1000;
                            const minValue = selectedFilters.followerMin;
                            
                            if (newValue > minValue && newValue <= 250000) {
                              handleFollowerRangeChange(minValue, newValue);
                            }
                          };
                          
                          const handleTouchEnd = () => {
                            document.removeEventListener('touchmove', handleTouchMove);
                            document.removeEventListener('touchend', handleTouchEnd);
                          };
                          
                          document.addEventListener('touchmove', handleTouchMove);
                          document.addEventListener('touchend', handleTouchEnd);
                        }}
                      ></div>
                      
                      {/* Value Display */}
                      {/* <div className="flex justify-between text-sm text-gray-600 mt-6">
                        <span>Min: {selectedFilters.followerMin?.toLocaleString() || 0}</span>
                        <span>Max: {selectedFilters.followerMax?.toLocaleString() || 250000}</span>
                      </div> */}
                      
                      {/* Manual Input Fields */}
                      <div className="grid grid-cols-2 gap-4 mt-7">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Min Followers</label>
                          <input
                            type="number"
                            min="0"
                            max="250000"
                            step="1000"
                            value={selectedFilters.followerMin || 0}
                            onChange={(e) => {
                              const value = Math.max(0, Math.min(250000, parseInt(e.target.value) || 0));
                              const maxValue = selectedFilters.followerMax;
                              if (value <= maxValue) {
                                handleFollowerRangeChange(value, maxValue);
                              }
                            }}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1fb036] focus:border-[#1fb036]"
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Max Followers</label>
                          <input
                            type="number"
                            min="0"
                            max="250000"
                            step="1000"
                            value={selectedFilters.followerMax || 250000}
                            onChange={(e) => {
                              const value = Math.max(0, Math.min(250000, parseInt(e.target.value) || 250000));
                              const minValue = selectedFilters.followerMin;
                              if (value >= minValue) {
                                handleFollowerRangeChange(minValue, value);
                              }
                            }}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1fb036] focus:border-[#1fb036]"
                            placeholder="250000"
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Range Labels */}
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>0</span>
                      <span>250K</span>
                    </div>
                  </div>
                </div>
                
                {/* Quick Select Buttons */}
                {/* <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleFollowerRangeChange(0, 10000)}
                    className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    0 - 10K
                  </button>
                  <button
                    onClick={() => handleFollowerRangeChange(10000, 25000)}
                    className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    10K - 25K
                  </button>
                  <button
                    onClick={() => handleFollowerRangeChange(25000, 50000)}
                    className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    25K - 50K
                  </button>
                  <button
                    onClick={() => handleFollowerRangeChange(50000, 100000)}
                    className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    50K - 100K
                  </button>
                  <button
                    onClick={() => handleFollowerRangeChange(100000, 250000)}
                    className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    100K - 250K
                  </button>
                  <button
                    onClick={() => handleFollowerRangeChange(0, 250000)}
                    className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    All Ranges
                  </button>
                </div> */}
              </div>
            </div>
          );
        }
        
        return null;

      case 'text':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{currentCategory.label}</h3>
            <input
              type="text"
              value={selectedFilters[currentCategory.id] || ''}
              onChange={(e) => handleTextChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1fb036]"
              placeholder={`Enter ${currentCategory.label.toLowerCase()}`}
            />
          </div>
        );

        case 'location':
          // Convert cities to React Select options format
          const cityOptions = cities.map(city => ({
            value: city.city_id,
            label: city.name,
            state_id: city.state_id,
            state_name: city.state_name
          }));

          // Find selected city option
          const selectedCityOption = cityOptions.find(
            option => option.value === selectedFilters['location']?.city
          );

          return (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">{currentCategory.label}</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <Select
                  options={cityOptions}
                  value={selectedCityOption || null}
                  onChange={(selectedOption) => {
                    if (selectedOption) {
                      handleFilterChange('location', {
                        state: selectedOption.state_name,
                        city: selectedOption.value
                      });
                    } else {
                      handleFilterChange('location', {
                        state: '',
                        city: ''
                      });
                    }
                  }}
                  placeholder="Search and select location..."
                  isSearchable
                  isClearable
                  styles={customSelectStyles}
                  className="text-sm"
                  noOptionsMessage={() => "No locations found"}
                  components={{
                    IndicatorSeparator: () => null,
                    DropdownIndicator: () => null,
                  }}
                />
              </div>
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
              <svg onClick={onClose} className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </div>

            {/* Content */}
            <div className="flex h-[calc(90vh-140px)]">
              {/* Left Panel - Filter Categories */}
              <div className="w-1/3 bg-gray-50 border-r border-gray-200 overflow-y-auto">
                {filterCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full text-left px-4 py-3 border-l-4 transition-colors text-[14px] ${
                      activeCategory === category.id
                        ? 'bg-[#1fb0361c] border-[#1fb036] text-[#1fb036]'
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
                onClick={handleApplyFilters}
                className="flex-1 px-4 py-3 bg-[#1fb036] text-white rounded-lg font-medium hover:bg-[#1fb036]/90 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
