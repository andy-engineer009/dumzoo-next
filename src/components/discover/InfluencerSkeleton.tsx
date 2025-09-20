import React from 'react';

const InfluencerSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 w-full animate-pulse">
      <div className="flex items-center space-x-4 relative">
        {/* Left Side - Circular Profile Picture Skeleton */}
        <div className="flex-shrink-0">
          <div className="relative w-[90px] h-[90px] rounded-full overflow-hidden bg-gray-200"></div>
        </div>

        {/* Center - Influencer Details Skeleton */}
        <div className="flex-1 min-w-0">
          {/* Name with Verification Badge Skeleton */}
          <div className="flex items-center space-x-2 mb-1">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
          </div>
          {/* Location Skeleton */}
          <div className="flex items-center mb-1">
            <div className="w-4 h-4 bg-gray-200 rounded mr-1"></div>
            <div className="h-3 bg-gray-200 rounded w-20"></div>
          </div>
          {/* Followers Skeleton */}
          <div className="flex items-center mb-1">
            <div className="w-4 h-4 bg-gray-200 rounded mr-1"></div>
            <div className="h-3 bg-gray-200 rounded w-24"></div>
          </div>
          {/* Price Skeleton */}
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-200 rounded mr-1"></div>
            <div className="h-3 bg-gray-200 rounded w-20"></div>
          </div>
        </div>

        {/* Right Side - Social Media Icons Skeleton */}
        <div className="flex-shrink-0 flex space-x-2 absolute right-0 bottom-0">
          <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
          <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
          <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default InfluencerSkeleton;
