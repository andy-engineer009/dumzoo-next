'use client';

import { useState, useEffect, useRef } from 'react';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import { motion, AnimatePresence } from 'framer-motion';
import Filters from './Filters';

interface SearchValues {
  searchQuery: string;
}

const initialSearchValues: SearchValues = {
  searchQuery: '',
};

interface SearchAndFilterProps {
  onSearch?: (values: SearchValues) => void;
  onApplyFilters?: (values: any) => void;
  placeholder?: string;
  className?: string;
}

const SearchAndFilter = ({ 
  onSearch, 
  onApplyFilters,
  placeholder = "Search for influencers, brands, or campaigns...",
  className = ""
}: SearchAndFilterProps) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (values: SearchValues) => {
    onSearch?.(values);
    console.log('Search submitted:', values);
  };

  const handleFilterClose = () => {
    setIsFilterOpen(false);
  };

  const handleApplyFilters = (values: any) => {
    onApplyFilters?.(values);
    console.log('Filters applied:', values);
    setIsFilterOpen(false);
  };

  const SearchForm = () => (
    <Formik
      initialValues={initialSearchValues}
      onSubmit={handleSearchSubmit}
    >
      {({ values, handleSubmit }) => (
        <Form onSubmit={handleSubmit} className="w-full">
          <div className="relative">
            {/* Search Input with Filter Icon */}
            <div ref={searchRef} className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg 
                  className="h-5 w-5 text-gray-400" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                  />
                </svg>
              </div>
              
              {/* Filter Icon Button */}
              <button
                type="button"
                onClick={() => setIsFilterOpen(true)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center hover:bg-gray-50 rounded-r-xl transition-colors"
              >
                <svg 
                  className="h-5 w-5 text-gray-400 hover:text-gray-600" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" 
                  />
                </svg>
              </button>

              <Field
                name="searchQuery"
                type="text"
                placeholder={placeholder}
                className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white transition-all duration-200 shadow-sm hover:shadow-md"
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />

              {/* Search Suggestions Dropdown */}
              {isSearchFocused && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 p-2"
                >
                  <div className="text-sm text-gray-500 p-2">
                    Popular searches: "Fashion influencers", "Tech bloggers", "Fitness coaches"
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );

  return (
    <div className={`w-full ${className}`}>
      {/* Search Input */}
      <div className="bg-white p-0 lg:p-6 fixed top-0 left-0 right-0 z-50 p-4">
        <SearchForm />
      </div>

      {/* Filters Component */}
      <Filters 
        onClose={handleFilterClose}
        isOpen={isFilterOpen}
        onApplyFilters={handleApplyFilters}
      />
    </div>
  );
};

export default SearchAndFilter;
