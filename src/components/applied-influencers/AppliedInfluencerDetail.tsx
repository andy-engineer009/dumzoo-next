'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { api } from '@/common/services/rest-api/rest-api';
import { API_ROUTES } from '@/appApi';

interface AppliedInfluencerDetailProps {
  data?: any;
  onClose?: () => void;
}

const AppliedInfluencerDetail = ({ data, onClose }: AppliedInfluencerDetailProps) => {
  const router = useRouter();
  const [influencerDetail, setInfluencerDetail] = useState<any>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const hasLoadedRef = useRef<string | null>(null);

  const loadInfluencerDetail = useCallback(async () => {
    if (!data?.uuid) return;
    
    // Prevent duplicate calls for the same UUID
    if (hasLoadedRef.current === data.uuid) {
    //   console.log('⏭️ Skipping API call - already loaded for UUID:', data.uuid);
      return;
    }
    
    // console.log('🔄 Loading influencer detail for UUID:', data.uuid);
    hasLoadedRef.current = data.uuid;
    setIsLoadingDetail(true);
    
    try {
      const res = await api.post(API_ROUTES.getBasicDetails, {
        uuid: data.uuid
      });
    //   console.log('📊 Influencer detail response:', res);
      
      if (res.status == 1) {
        setInfluencerDetail(res.data);
      }
    } catch (err) {
      console.log('Error fetching influencer detail:', err);
      // Reset the ref on error so it can be retried
      hasLoadedRef.current = null;
    } finally {
      setIsLoadingDetail(false);
    }
  }, [data?.uuid]);

  // Load influencer detail when component mounts
  useEffect(() => {
    loadInfluencerDetail();
  }, [loadInfluencerDetail]);

  const formatFollowers = (count: number): string => {
    if (!count || count === 0) return '0';
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const formatCurrency = (amount: number | undefined | null): string => {
    if (!amount || amount === 0) return '₹0';
    return `₹${amount.toLocaleString()}`;
  };

  const getGender = (gender: number): string => {
    switch (gender) {
      case 1: return 'Male';
      case 2: return 'Female';
      case 3: return 'Other';
      default: return 'Not specified';
    }
  };

  const getAgeGroup = (age: number): string => {
    if (age <= 18) return '13-18';
    if (age <= 25) return '19-25';
    if (age <= 35) return '26-35';
    if (age <= 45) return '36-45';
    if (age <= 55) return '46-55';
    return '56+';
  };

  // Show loading state if data is not yet loaded
  if (isLoadingDetail || !data) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1fb036]"></div>
      </div>
    );
  }

  const displayData = influencerDetail || data;

  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <main className="pb-24">
        {/* Top Banner Image */}
        <section className="relative">
          <div className="relative h-[200px] bg-gradient-to-br from-blue-100 to-purple-100">
            {/* Back Icon */}
            <button 
              onClick={onClose || (() => router.back())} 
              className="absolute top-4 left-4 z-10 p-2 bg-white/80 rounded-full shadow hover:bg-white transition-colors"
              aria-label="Go back"
              type="button"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            {/* Influencer Images */}
            {displayData?.influencer_media_detail?.length > 0 ? (
              displayData.influencer_media_detail.map((image: any, index: any) => (
                <Image
                  key={index}
                  src={image?.image_url}
                  alt={displayData?.username || 'Influencer'}
                  width={400}
                  height={200}
                  className="w-full h-full object-cover"
                />
              ))
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            )}
          </div>
        </section>

        {/* Influencer Information */}
        <section className="px-4 py-6">
          {/* Main Title */}
          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-2xl font-bold text-black">
              {displayData?.user?.name || displayData?.username || 'Influencer'}
            </h1>
            {displayData?.verified_profile === 1 && (
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>

          {/* Username */}
          <p className="text-sm text-gray-600 mb-4">@{displayData?.username}</p>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-600">Followers</p>
              <p className="text-xl font-bold text-black">{formatFollowers(displayData?.follower_count || 0)}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-600">Starting Price</p>
              <p className="text-xl font-bold text-black">{formatCurrency(displayData?.starting_price)}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-600">Gender</p>
              <p className="text-lg font-semibold text-black">{getGender(displayData?.gender)}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-600">Age</p>
              <p className="text-lg font-semibold text-black">{displayData?.age ? getAgeGroup(displayData.age) : 'Not specified'}</p>
            </div>
          </div>

          {/* Location */}
          <div className="mb-6">
            <h3 className="text-sm font-bold text-black mb-2">Location</h3>
            <p className="text-sm text-black">
              {displayData?.influencer_city?.name && displayData?.influencer_state?.name 
                ? `${displayData.influencer_city.name}, ${displayData.influencer_state.name}`
                : 'Location not specified'
              }
            </p>
          </div>

          {/* Platform Links */}
          <div className="mb-6">
            <h3 className="text-sm font-bold text-black mb-3">Social Platforms</h3>
            <div className="flex gap-4">
              {displayData?.is_instagram_enabled === 1 && displayData?.instagram_url && (
                <a 
                  href={displayData.instagram_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-pink-100 text-pink-800 rounded-lg hover:bg-pink-200 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  Instagram
                </a>
              )}
              {displayData?.is_youtube_enabled === 1 && displayData?.youtube_url && (
                <a 
                  href={displayData.youtube_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21.8 8.001a2.75 2.75 0 0 0-1.94-1.94C18.1 6 12 6 12 6s-6.1 0-7.86.06a2.75 2.75 0 0 0-1.94 1.94A28.6 28.6 0 0 0 2 12a28.6 28.6 0 0 0 .2 3.999 2.75 2.75 0 0 0 1.94 1.94C5.9 18 12 18 12 18s6.1 0 7.86-.06a2.75 2.75 0 0 0 1.94-1.94A28.6 28.6 0 0 0 22 12a28.6 28.6 0 0 0-.2-3.999zM10 15.5v-7l6 3.5-6 3.5z"/>
                  </svg>
                  YouTube
                </a>
              )}
              {displayData?.is_facebook_enabled === 1 && displayData?.facebook_url && (
                <a 
                  href={displayData.facebook_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.522-4.477-10-10-10S2 6.478 2 12c0 5 3.657 9.127 8.438 9.877v-6.987h-2.54v-2.89h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.242 0-1.63.771-1.63 1.562v1.875h2.773l-.443 2.89h-2.33v6.987C18.343 21.127 22 17 22 12"/>
                  </svg>
                  Facebook
                </a>
              )}
            </div>
          </div>

          {/* Categories */}
          {displayData?.influencer_categories?.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-bold text-black mb-3">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {displayData.influencer_categories.map((category: any, index: any) => (
                  <span key={index} className="px-3 py-2 bg-gray-200 text-black text-sm rounded-lg">
                    {category?.name || category?.category?.name || 'Unknown'}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {displayData?.influencer_languages?.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-bold text-black mb-3">Languages</h3>
              <div className="flex flex-wrap gap-2">
                {displayData.influencer_languages.map((languageItem: any, index: any) => (
                  <span key={index} className="px-3 py-2 bg-blue-100 text-blue-800 text-sm rounded-lg">
                    {languageItem?.language?.name || languageItem?.name || 'Unknown'}
                  </span>
                ))}
              </div>
            </div>
          )}
          </section>
        </main>

      </div>
    );
};

export default AppliedInfluencerDetail;
