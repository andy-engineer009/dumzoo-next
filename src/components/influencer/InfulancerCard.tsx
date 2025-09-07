'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const InfluencerCard = ({data}: any) => {
  const [imageError, setImageError] = useState(false);
  const router = useRouter();

  const formatFollowers = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const formatCurrency = (amount: number): string => {
    return `₹${amount.toLocaleString()}`;
  };

  const getgender = (gender: any) => {
    if (gender == 1) {
      return 'Male';
    } else if (gender == 2) {
      return 'Female';
    } else if (gender == 3) {
      return 'Other';
    }
  }

  return (
    <div 
      key={data?.uuid}
      className="relative bg-white rounded-xl overflow-hidden transition-all duration-200 shadow-sm hover:shadow-md border border-gray-100 cursor-pointer w-full max-w-[100%]"
      onClick={() => router.push(`/discover/${data?.uuid}`)}
    >
      {/* Featured Badge */}
      {data?.isFeatured && (
        <div className="absolute top-3 left-3 z-10">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md flex items-center">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            Featured
          </div>
        </div>
      )}

      {/* Main Card Layout - 40-60 Split */}
      <div className="flex">
        {/* Left Side - Image (40%) */}
        <div className="w-2/5 relative">
          <div className="relative w-full h-[168px] bg-gray-100">
            {data?.influencer_media_detail?.map((image:any, index:any) => (
              <Image
                key={index}
                src={image?.image_url || '/images/default-profile.jpg'}
                alt={image?.image_url || 'Influencer profile'}
                width={400}
                height={400}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ))}
          </div>
        </div>

        {/* Right Side - Creator Details (60%) */}
        <div className="w-3/5 p-3 space-y-1.5">
          {/* Row 1: Name and Verification */}
          <div className="flex items-center space-x-1.5">
            <h3 className="font-bold text-gray-900 text-base">
              {data?.username || 'N/A'}
            </h3>
            {data?.verified_profile == 1 && (
              <div className="bg-white p-0.5 rounded-full shadow-sm border border-gray-200">
                <svg className="w-3 h-3 text-gray-800" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>

          {/* Row 2: Location */}
          <div className="text-sm text-gray-600 truncate w-full" style={{ maxWidth: 160 }} title={`${data?.influencer_city?.name || '--'}, ${data?.influencer_state?.short_name || '--'}`}>
            {`${data?.influencer_city?.name || '--'}, ${data?.influencer_state?.short_name || '--'}`}
          </div>

          {/* Row 3: Followers */}
          <div className="flex items-center space-x-1.5">
            <div className="font-bold text-gray-900 text-base">
              {formatFollowers(data?.follower_count || 0)}
            </div>
            <div className="text-xs text-gray-500">Followers</div>
          </div>

          {/* Row 4: Social Media Icons */}
          <div className="flex space-x-1.5">
            {data?.instagram_url && (
              <div className="w-6 h-6 bg-white rounded-full border border-gray-200 flex items-center justify-center shadow-sm">
                <svg className="w-3 h-3 text-gray-800" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </div>
            )}
            {data?.youtube_url && (
              <div className="w-6 h-6 bg-white rounded-full border border-gray-200 flex items-center justify-center shadow-sm">
                <svg className="w-3 h-3 text-gray-800" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </div>
            )}
            {data?.facebook_url && (
              <div className="w-6 h-6 bg-white rounded-full border border-gray-200 flex items-center justify-center shadow-sm">
                <svg className="w-3 h-3 text-gray-800" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </div>
            )}
          </div>

          {/* Row 5: Category Tag */}
          {data?.tags?.length > 0 && (
            <div className="bg-green-400 text-white text-xs font-medium px-3 py-1 rounded-full inline-block">
              {data.tags[0]}
            </div>
          )}

          {/* Row 6: Advertising Price */}
          <div className="flex items-center space-x-1.5">
            <div className="text-xs text-gray-500">Advertising Price</div>
            <div className="font-bold text-gray-900 text-lg">
              {formatCurrency(data?.starting_price || 0)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfluencerCard;