'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/common/services/rest-api/rest-api';
import { API_ROUTES } from '@/appApi';

interface SearchResult {
  id: string;
  name: string;
  username: string;
  profile_image: string;
  followers: number;
  category: string;
  is_verified: boolean;
}

export default function SearchPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Focus on input when component mounts
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  // Debounced search function
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        performSearch(searchQuery);
      } else {
        setSearchResults([]);
        setHasSearched(false);
      }
    }, 300); // 300ms delay

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Real API call function
  const performSearch = async (query: string) => {
    setIsLoading(true);
    setHasSearched(true);
    setError(null);
    
    try {
      const response = await api.post(API_ROUTES.influencerList, {
        page: 0,
        limit: 50,
        search: query.trim()
      });

      if (response.status === 1) {
        // Transform API response to match SearchResult interface
        const transformedResults: any = response.data.rows;
        
        setSearchResults(transformedResults);
        setError(null);
      } else {
        setError(response.message || 'Failed to search influencers');
        setSearchResults([]);
      }
    } catch (error: any) {
      console.error('Search error:', error);
      setError(error.message || 'Network error. Please try again.');
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleBackClick = () => {
    router.back();
  };

  const formatFollowers = (followers: number) => {
    if (followers >= 1000000) {
      return `${(followers / 1000000).toFixed(1)}M`;
    } else if (followers >= 1000) {
      return `${(followers / 1000).toFixed(1)}K`;
    }
    return followers.toString();
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 bg-white z-10 px-3">
        <div className="flex items-center px-4 py-2 bg-gray-100"     style={{
              borderRadius:' 9px',
              margin: '10px 0 0',
              background: '#cccccc30',
              boxShadow: 'none',
           
            }}>
          <button 
            onClick={handleBackClick}
            className="text-gray-600 text-xl font-bold mr-3"
          >
                     <svg className="w-5 h-5" fill="none" stroke="#ccc" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          {/* Search Input */}
          <div className="flex-1 relative">
            <div className="relative">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={handleInputChange}
                placeholder="Try creator's 'Username'"
                className="w-full pl-0 bg-gray-100 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-gray-100"
              />
              {/* <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div> */}
            </div>
          </div>
        </div>
      </div>

      {/* Search Results */}
      <div className="px-4 py-4">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center items-center py-8"
            >
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-purple-500 rounded-full animate-bounce"></div>
                <div className="w-4 h-4 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-4 h-4 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-8"
            >
              <div className="text-red-400 mb-2">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <p className="text-red-500 mb-2">{error}</p>
              <button
                onClick={() => performSearch(searchQuery)}
                className="text-purple-500 hover:text-purple-700 text-sm font-medium"
              >
                Try again
              </button>
            </motion.div>
          ) : hasSearched && searchQuery.trim() ? (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {/* <h1 className='text-end text-gray-500 text-sm'>{searchResults?.length || 0} results found</h1> */}
              {searchResults.length > 0 ? (
                searchResults.map((result) => (
                  <motion.div
                    key={result.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center space-x-3 bg-white cursor-pointer"
                    onClick={() => router.push(`/discover/${result.uuid}`)}
                  >
                    {/* Profile Image */}
                    <div className="relative">
                      <img
                        src={result.profile_image}
                        alt={result.name}
                        className="w-10 h-10 rounded-full object-cover"
                        onError={(e) => {
                          // Fallback to default image if profile image fails to load
                          (e.target as HTMLImageElement).src = '/images/men.png';
                        }}
                      />
                  
                    </div>

                    {/* User Info */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-900">{result.name} 
                      
                        </h3>
                        <span className="text-[#000] font-semibold text-sm flex items-center">{result.username}
                        {result.verified_profile == 1 && (
                        <div className=" w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center ms-1">
                          <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                        </span>
                      </div>
                      {/* <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span>{formatFollowers(result.followers)} followers</span>
                        <span>•</span>
                        <span>{result.category}</span>
                      </div> */}
                    </div>

                    {/* Arrow */}
                    {/* <div className="text-gray-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div> */}
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8"
                >
                  <div className="text-gray-400 mb-2">
                    <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-500">No creators found for "{searchQuery}"</p>
                  <p className="text-gray-400 text-sm mt-1">Try a different search term</p>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <div className="text-gray-300 mb-2">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <p className="text-gray-400">Search for creators by name, username, or URL</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
} 