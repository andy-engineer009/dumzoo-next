import React from 'react';

export default function CampaignSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden animate-pulse">
      {/* Top Section - Product Image Area */}
      <div className="relative bg-gray-200 h-[150px] flex items-center justify-center">
        {/* Placeholder for product image */}
        <div className="w-20 h-20 bg-gray-300 rounded-lg"></div>
        
        {/* Yellow Banner - Applied Count Skeleton */}
        <div className="absolute top-3 right-3 bg-gray-300 text-transparent text-xs font-bold px-2 py-1 rounded-r-full">
          <div className="flex items-center">
            <span>-- Applied</span>
            <div className="w-3 h-3 ml-1 bg-gray-400 rounded"></div>
          </div>
        </div>
      </div>

      {/* Bottom Section - Campaign Details */}
      <div className="p-4">
        <div className="flex justify-between items-start">
          {/* Left Side - Campaign Info */}
          <div className="flex-1">
            {/* Brand Name Skeleton */}
            <div className="h-5 bg-gray-200 rounded w-24 mb-1"></div>
            
            {/* Payout Skeleton */}
            <div className="h-4 bg-gray-200 rounded w-32 mb-1"></div>
            
            {/* Preference Skeleton */}
            <div className="h-3 bg-gray-200 rounded w-28"></div>
          </div>

          {/* Right Side - Platform & Type */}
          <div className="flex flex-col items-end space-y-1">
            {/* Platform Icons Skeleton */}
            <div className="flex gap-2">
              <div className="w-4 h-4 bg-gray-200 rounded"></div>
              <div className="w-4 h-4 bg-gray-200 rounded"></div>
              <div className="w-4 h-4 bg-gray-200 rounded"></div>
            </div>
            
            {/* Micro Influencer Type Skeleton */}
            <div className="flex items-center space-x-1">
              <div className="w-4 h-4 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded w-16"></div>
            </div>
            
            {/* Time Posted Skeleton */}
            <div className="h-3 bg-gray-200 rounded w-20"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
