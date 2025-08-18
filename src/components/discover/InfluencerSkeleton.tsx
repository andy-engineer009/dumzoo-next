import React from 'react';

const InfluencerSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 animate-pulse">
      {/* Image skeleton */}
      <div className="w-full aspect-square bg-gray-200 rounded-lg mb-3"></div>
      
      {/* Content skeleton */}
      <div className="space-y-2">
        {/* Name skeleton */}
        <div className="flex items-center gap-2">
          <div className="h-4 bg-gray-200 rounded w-20"></div>
          <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
        </div>
        
        {/* Location skeleton */}
        <div className="h-3 bg-gray-200 rounded w-16"></div>
        
        {/* Category skeleton */}
        <div className="h-3 bg-gray-200 rounded w-24"></div>
        
        {/* Followers skeleton */}
        <div className="h-3 bg-gray-200 rounded w-28"></div>
        
        {/* Price skeleton */}
        <div className="h-4 bg-gray-200 rounded w-20"></div>
      </div>
    </div>
  );
};

export default InfluencerSkeleton;
