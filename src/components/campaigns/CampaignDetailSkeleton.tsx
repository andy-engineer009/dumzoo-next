import React from 'react';

export default function CampaignDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 animate-pulse">
      {/* Header Section Skeleton */}
      <div className="bg-white shadow-sm ">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-4">
            {/* Back Button Skeleton */}
            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
            
            {/* Title Skeleton */}
            <div className="flex-1">
              <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-48"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Campaign Image and Basic Info */}
          <div className="lg:col-span-1">
            {/* Campaign Image Skeleton */}
            <div className="bg-gray-200 rounded-lg h-64 mb-6"></div>
            
            {/* Basic Info Skeleton */}
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded w-32"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-4 bg-gray-200 rounded w-28"></div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
            </div>
            
            {/* Apply Button Skeleton */}
            <div className="mt-6">
              <div className="h-12 bg-gray-200 rounded-lg w-full"></div>
            </div>
          </div>

          {/* Right Column - Campaign Details */}
          <div className="lg:col-span-2">
            {/* Campaign Title Skeleton */}
            <div className="mb-6">
              <div className="h-8 bg-gray-200 rounded w-full mb-3"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            </div>

            {/* Description Skeleton */}
            <div className="mb-8">
              <div className="h-5 bg-gray-200 rounded w-24 mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>

            {/* Categories Section Skeleton */}
            <div className="mb-8">
              <div className="h-5 bg-gray-200 rounded w-20 mb-4"></div>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-8 bg-gray-200 rounded-full w-20"></div>
                ))}
              </div>
            </div>

            {/* Requirements Section Skeleton */}
            <div className="mb-8">
              <div className="h-5 bg-gray-200 rounded w-28 mb-4"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Platform Section Skeleton */}
            <div className="mb-8">
              <div className="h-5 bg-gray-200 rounded w-16 mb-4"></div>
              <div className="flex space-x-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Info Skeleton */}
            <div className="mb-8">
              <div className="h-5 bg-gray-200 rounded w-24 mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-40"></div>
                <div className="h-4 bg-gray-200 rounded w-36"></div>
                <div className="h-4 bg-gray-200 rounded w-44"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
