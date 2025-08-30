'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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

const cities = [
  // Himachal Pradesh
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
  
  // Maharashtra
  { id: 13, name: "Mumbai", state_id: 14 },
  { id: 14, name: "Pune", state_id: 14 },
  { id: 15, name: "Nagpur", state_id: 14 },
  { id: 16, name: "Thane", state_id: 14 },
  { id: 17, name: "Nashik", state_id: 14 },
  { id: 18, name: "Aurangabad", state_id: 14 },
  
  // Delhi
  { id: 19, name: "New Delhi", state_id: 32 },
  { id: 20, name: "Delhi", state_id: 32 },
  
  // Karnataka
  { id: 21, name: "Bangalore", state_id: 11 },
  { id: 22, name: "Mysore", state_id: 11 },
  { id: 23, name: "Mangalore", state_id: 11 },
  
  // Tamil Nadu
  { id: 24, name: "Chennai", state_id: 23 },
  { id: 25, name: "Coimbatore", state_id: 23 },
  { id: 26, name: "Madurai", state_id: 23 },
  
  // Telangana
  { id: 27, name: "Hyderabad", state_id: 24 },
  { id: 28, name: "Warangal", state_id: 24 },
  
  // Gujarat
  { id: 29, name: "Ahmedabad", state_id: 7 },
  { id: 30, name: "Surat", state_id: 7 },
  { id: 31, name: "Vadodara", state_id: 7 },
  
  // Uttar Pradesh
  { id: 32, name: "Lucknow", state_id: 26 },
  { id: 33, name: "Kanpur", state_id: 26 },
  { id: 34, name: "Varanasi", state_id: 26 },
  
  // West Bengal
  { id: 35, name: "Kolkata", state_id: 28 },
  { id: 36, name: "Howrah", state_id: 28 },
  
  // Kerala
  { id: 37, name: "Thiruvananthapuram", state_id: 12 },
  { id: 38, name: "Kochi", state_id: 12 },
  { id: 39, name: "Kozhikode", state_id: 12 },
  
  // Punjab
  { id: 40, name: "Chandigarh", state_id: 20 },
  { id: 41, name: "Ludhiana", state_id: 20 },
  { id: 42, name: "Amritsar", state_id: 20 },
  
  // Haryana
  { id: 43, name: "Gurgaon", state_id: 8 },
  { id: 44, name: "Faridabad", state_id: 8 },
  { id: 45, name: "Panipat", state_id: 8 },
  
  // Rajasthan
  { id: 46, name: "Jaipur", state_id: 21 },
  { id: 47, name: "Jodhpur", state_id: 21 },
  { id: 48, name: "Udaipur", state_id: 21 },
  
  // Madhya Pradesh
  { id: 49, name: "Bhopal", state_id: 13 },
  { id: 50, name: "Indore", state_id: 13 },
  { id: 51, name: "Jabalpur", state_id: 13 },
  
  // Bihar
  { id: 52, name: "Patna", state_id: 4 },
  { id: 53, name: "Gaya", state_id: 4 },
  
  // Odisha
  { id: 54, name: "Bhubaneswar", state_id: 19 },
  { id: 55, name: "Cuttack", state_id: 19 },
  
  // Assam
  { id: 56, name: "Guwahati", state_id: 3 },
  { id: 57, name: "Dibrugarh", state_id: 3 },
  
  // Jharkhand
  { id: 58, name: "Ranchi", state_id: 10 },
  { id: 59, name: "Jamshedpur", state_id: 10 },
  
  // Chhattisgarh
  { id: 60, name: "Raipur", state_id: 5 },
  { id: 61, name: "Bhilai", state_id: 5 },
  
  // Uttarakhand
  { id: 62, name: "Dehradun", state_id: 27 },
  { id: 63, name: "Haridwar", state_id: 27 },
  
  // Goa
  { id: 64, name: "Panaji", state_id: 6 },
  { id: 65, name: "Margao", state_id: 6 }
];

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
      // { value: 'tiktok', label: 'TikTok' },
      { value: 'facebook', label: 'Facebook' },
      // { value: 'twitter', label: 'Twitter' },
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
    id: 'contentLanguage',
    label: 'Content Language',
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

export default function FilterModal({ isOpen, onClose, onFilterChange }: FilterModalProps) {
  const [activeCategory, setActiveCategory] = useState('sortBy');
  const [selectedFilters, setSelectedFilters] = useState<any>({
    sortBy: 'popularity',
    socialPlatform: [],
    categories: [],
    location: { state: '', city: '' },
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
    console.log(newFilters);
    
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
      location: { state: '', city: '' },
      followers: '',
      budget: { min: 0, max: 100000 },
      audienceType: [],
      audienceAgeGroup: [],
      gender: '',
      contentLanguage: [],
      // contentQuality: '',
      // creatorType: [],
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

        case 'location':
          return (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">{currentCategory.label}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                  <select
                    value={selectedFilters['location']?.state || ''}
                    onChange={(e) => {
                      const newState = e.target.value;
                      handleFilterChange('location', { 
                        state: newState, 
                        city: '' // Clear city when state changes
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Select State</option>
                    {states.map((state) => (
                      <option key={state.id} value={state.id}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <select
                    value={selectedFilters['location']?.city || ''}
                    onChange={(e) => handleFilterChange('location', { ...selectedFilters['location'], city: e.target.value })}
                    disabled={!selectedFilters['location']?.state}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      !selectedFilters['location']?.state ? 'bg-gray-100 cursor-not-allowed' : ''
                    }`}
                  >
                    <option value="">Select City</option>
                    {selectedFilters['location']?.state && cities
                      .filter(city => city.state_id == selectedFilters['location'].state)
                      .map((city) => (
                        <option key={city.id} value={city.id}>
                          {city.name}
                        </option>
                      ))}
                  </select>
                </div>
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
