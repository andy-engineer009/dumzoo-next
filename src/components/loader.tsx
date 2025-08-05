'use client';

import React from 'react';

interface LoaderProps {
  message?: string;
  show?: boolean;
}

const Loader: React.FC<LoaderProps> = ({ 
  message = "Loading...", 
  show = true 
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-md">
      <div className="flex flex-col items-center space-y-6">
        {/* Main spinner */}
        <div className="relative">
          {/* Outer ring */}
          <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
          
          {/* Inner pulse */}
          <div className="absolute inset-2 bg-blue-500 rounded-full animate-pulse opacity-75"></div>
        </div>

        {/* Loading text */}
        <div className="text-center">
          <p className="text-lg font-medium text-gray-700 animate-pulse">
            {message}
          </p>
          
          {/* Dots animation */}
          <div className="flex space-x-1 mt-2 justify-center">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loader;