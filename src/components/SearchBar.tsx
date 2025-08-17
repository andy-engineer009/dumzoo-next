'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchBar() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchClick = () => {
    router.push('/search');
  };

  return (
    <div className="bg-gradient-to-b from-black via-black to-white">
      {/* Header with Back Arrow */}
      <div className="flex items-center px-4 pt-4 pb-1">
        <button 
          onClick={() => router.back()}
          className="text-white text-2xl font-bold mr-1"
        >
         <svg className="w-6 h-6 text-gray-600 hover:text-gray-900 " fill="none" stroke="#ccc" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
        </button>
        <h1 className="text-white flex-1 text-sm">
          Try creators full name, handle or URL
        </h1>
      </div>

      {/* Search Input Container */}
      <div className="px-4 pb-6">
        <div className="relative">
          {/* Search Input Field */}
          <div 
            onClick={handleSearchClick}
            className="relative bg-white rounded-xl p-2 shadow-lg cursor-pointer border-2 border-black hover:border-gray-800 transition-all duration-200"
            style={{
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(0, 0, 0, 0.1)'
            }}
          >
            <div className="flex items-center space-x-3">
              {/* Search Icon */}
              <div className="text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              
              {/* Placeholder Text */}
              <span className="text-gray-400 text-base">
                Try creator's 'Username'
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 