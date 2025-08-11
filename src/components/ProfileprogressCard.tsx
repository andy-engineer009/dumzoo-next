'use client';

import React from 'react';

const ProfileProgressCard: React.FC<any> = ({ data }) => {
  const { completedSteps, totalSteps, progressPercentage, title = 'Profile Progress' } = data;

  return (
    <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-gray-700">{title}</span>
        <span className="text-sm font-bold text-blue-600">{Math.round(progressPercentage)}%</span>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
        <div 
          className="h-full bg-blue-500 rounded-full transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      
      {/* Progress Text */}
      <div className="text-xs text-gray-500">
        {completedSteps} of {totalSteps} completed
      </div>
    </div>
  );
};

export default ProfileProgressCard;
