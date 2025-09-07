import React from 'react';

const InfluencerSkeleton = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
      {/* Main Card Layout - 40-60 Split */}
      <div className="flex">
        {/* Left Side - Image (40%) */}
        <div className="w-2/5 relative">
          <div className="relative w-full h-[168px] bg-gray-200"></div>
        </div>

        {/* Right Side - Creator Details (60%) */}
        <div className="w-3/5 p-3 space-y-1.5">
          {/* Row 1: Name and Verification */}
          <div className="flex items-center space-x-1.5">
            <div className="h-4 bg-gray-200 rounded w-20"></div>
            <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
          </div>
          
          {/* Row 2: Location */}
          <div className="h-3 bg-gray-200 rounded w-16"></div>
          
          {/* Row 3: Followers */}
          <div className="flex items-center space-x-1.5">
            <div className="h-4 bg-gray-200 rounded w-12"></div>
            <div className="h-3 bg-gray-200 rounded w-16"></div>
          </div>
          
          {/* Row 4: Social Media Icons */}
          <div className="flex space-x-1.5">
            <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
            <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
            <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
          </div>
          
          {/* Row 5: Category Tag */}
          <div className="h-5 bg-gray-200 rounded-full w-20"></div>
          
          {/* Row 6: Advertising Price */}
          <div className="flex items-center space-x-1.5">
            <div className="h-3 bg-gray-200 rounded w-20"></div>
            <div className="h-5 bg-gray-200 rounded w-16"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfluencerSkeleton;
