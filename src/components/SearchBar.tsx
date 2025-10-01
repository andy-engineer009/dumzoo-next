'use client';

import { useState } from 'react';

interface SearchBarProps {
  onSearchClick: () => void;
}

export default function SearchBar({ onSearchClick }: SearchBarProps) {
  const handleSearchClick = () => {
    onSearchClick();
  };

  return (
    <div className=" search-bar-section">
      {/* Header with Back Arrow */}
      {/* <div className="flex items-center px-4 pt-4 pb-1">
        <button 
          onClick={() => router.back()}
          className="text-white text-2xl font-bold mr-1"
        >
         <svg className="w-6 h-6 text-gray-600 hover:text-gray-900 " fill="none" stroke="#ccc" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
        </button>
        <h1 className="text-white flex-1 text-sm">
          Try creators full name, handle or URL
        </h1>
      </div> */}

      {/* Search Input Container */}
      <div className="px-4 pb-0">
        <div className="relative">
          {/* Search Input Field */}
          <div 
            
            className="relative bg-white  p-2 cursor-pointer hover:border-gray-800 transition-all duration-200"
            style={{
              borderRadius:' 9px',
              margin: '15px 0 0',
              background: '#cccccc30',
              boxShadow: 'none',
              border: '1px solid #ccc',
            }}
          >
            <div className="flex items-center space-x-3">
              {/* Search Icon */}
              <div className="text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                         {/* <svg onClick={() => router.back()} className="w-6 h-6 text-gray-600 hover:text-gray-900 " fill="none" stroke="#ccc" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg> */}

              </div>
              
              {/* Placeholder Text */}
              <span onClick={handleSearchClick} className="text-gray-400 text-[14px]">
                Search creator's 'Username'
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 