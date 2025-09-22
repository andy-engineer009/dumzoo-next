import React from 'react';

const InfluencerDetailSkeleton = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <main className="pb-24">
        {/* Top Banner Image Skeleton */}
        <section className="relative">
          <div className="relative h-[200px] bg-gradient-to-br from-gray-200 to-gray-300">
            {/* Back Icon Skeleton */}
            {/* <div className="absolute top-4 left-4 z-10 p-2 bg-white/80 rounded-full shadow animate-pulse">
              <div className="w-6 h-6 bg-gray-300 rounded"></div>
            </div> */}
            {/* Banner Image Skeleton */}
            <div className="w-full h-full bg-gray-300 animate-pulse flex items-center justify-center">
              {/* <div className="w-16 h-16 bg-gray-400 rounded-full"></div> */}
            </div>
          </div>
        </section>

        {/* Service Information Skeleton */}
        <section className="px-4 py-6">
          {/* Main Title Skeleton */}
          <div className="flex items-center mb-3">
            <div className="h-8 bg-gray-300 rounded w-48 animate-pulse"></div>
            <div className="w-5 h-5 bg-gray-300 rounded-full ml-2 animate-pulse"></div>
          </div>

          {/* Posted Date and Views Skeleton */}
          <div className="flex items-center justify-between mb-4">
            <div className="h-4 bg-gray-300 rounded w-24 animate-pulse"></div>
            <div className="flex items-center gap-2">
              <div className="h-4 bg-gray-300 rounded w-20 animate-pulse"></div>
              <div className="w-4 h-4 bg-gray-300 rounded animate-pulse"></div>
            </div>
          </div>
          
          {/* Price Skeleton */}
          <div className="mb-6 flex items-center justify-between">
            <div className="h-10 bg-gray-300 rounded-lg w-24 animate-pulse"></div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gray-300 rounded animate-pulse"></div>
              <div className="w-6 h-6 bg-gray-300 rounded animate-pulse"></div>
              <div className="w-6 h-6 bg-gray-300 rounded animate-pulse"></div>
            </div>
          </div>

          {/* Service Details Grid Skeleton */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <div className="h-4 bg-gray-300 rounded w-16 mb-1 animate-pulse"></div>
              <div className="h-4 bg-gray-300 rounded w-20 animate-pulse"></div>
            </div>
            <div>
              <div className="h-4 bg-gray-300 rounded w-8 mb-1 animate-pulse"></div>
              <div className="h-4 bg-gray-300 rounded w-12 animate-pulse"></div>
            </div>
            <div>
              <div className="h-4 bg-gray-300 rounded w-12 mb-1 animate-pulse"></div>
              <div className="h-4 bg-gray-300 rounded w-16 animate-pulse"></div>
            </div>
            <div>
              <div className="h-4 bg-gray-300 rounded w-16 mb-1 animate-pulse"></div>
              <div className="h-4 bg-gray-300 rounded w-24 animate-pulse"></div>
            </div>
          </div>
          
          {/* Description Skeleton */}
          <div className="mb-6">
            <div className="h-4 bg-gray-300 rounded w-16 mb-2 animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4 animate-pulse"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2 animate-pulse"></div>
            </div>
          </div>

          {/* Categories Skeleton */}
          <div className="mb-6">
            <div className="h-4 bg-gray-300 rounded w-20 mb-3 animate-pulse"></div>
            <div className="flex flex-wrap gap-2">
              <div className="h-8 bg-gray-300 rounded-lg w-16 animate-pulse"></div>
              <div className="h-8 bg-gray-300 rounded-lg w-20 animate-pulse"></div>
              <div className="h-8 bg-gray-300 rounded-lg w-14 animate-pulse"></div>
              <div className="h-8 bg-gray-300 rounded-lg w-18 animate-pulse"></div>
            </div>
          </div>

          {/* Audience Info Skeleton */}
          <div className="mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="h-4 bg-gray-300 rounded w-20 mb-1 animate-pulse"></div>
                <div className="h-4 bg-gray-300 rounded w-16 animate-pulse"></div>
              </div>
              <div>
                <div className="h-4 bg-gray-300 rounded w-16 mb-1 animate-pulse"></div>
                <div className="h-4 bg-gray-300 rounded w-20 animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Offers Section Skeleton */}
          <div className="">
            <div className="h-4 bg-gray-300 rounded w-32 mb-3 animate-pulse"></div>
            <div className="space-y-3">
              {/* Offer 1 */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="h-4 bg-gray-300 rounded w-24 mb-1 animate-pulse"></div>
                    <div className="h-3 bg-gray-300 rounded w-20 animate-pulse"></div>
                  </div>
                  <div className="h-4 bg-gray-300 rounded w-16 animate-pulse"></div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-pulse"></div>
                    <div className="h-3 bg-gray-300 rounded w-24 animate-pulse"></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-pulse"></div>
                    <div className="h-3 bg-gray-300 rounded w-20 animate-pulse"></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-pulse"></div>
                    <div className="h-3 bg-gray-300 rounded w-28 animate-pulse"></div>
                  </div>
                </div>
              </div>
              
              {/* Offer 2 */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="h-4 bg-gray-300 rounded w-28 mb-1 animate-pulse"></div>
                    <div className="h-3 bg-gray-300 rounded w-16 animate-pulse"></div>
                  </div>
                  <div className="h-4 bg-gray-300 rounded w-20 animate-pulse"></div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-pulse"></div>
                    <div className="h-3 bg-gray-300 rounded w-22 animate-pulse"></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-pulse"></div>
                    <div className="h-3 bg-gray-300 rounded w-18 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Bottom Action Bar Skeleton */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-4 px-6 z-30">
        <div className="w-full bg-gray-300 h-12 rounded-lg animate-pulse"></div>
      </nav>
    </div>
  );
};

export default InfluencerDetailSkeleton;
