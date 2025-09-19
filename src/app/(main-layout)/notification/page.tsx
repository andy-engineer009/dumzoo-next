'use client';

import {useRouter} from 'next/navigation';
import React from 'react';

export default function NotificationPage() {
const router = useRouter();
  return (
    <>
    <header className="sticky top-0 z-20 bg-white border-b border-gray-200 pr-4 py-3">
    <div className="flex items-center justify-center relative">
      <button 
        onClick={() => router.back()}
        className="p-2 rounded-full hover:bg-gray-100 absolute left-0 top-1/2 -translate-y-1/2"
      >
        <svg className="w-5 h-5" fill="none" stroke="#ccc" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <h1 className="text-lg font-medium text-gray-900"> Notification</h1>
    </div>
  </header>
    <div className="mt-10 bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        {/* Notification Icon */}
        <div className="mb-6">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto">
            <svg 
              className="w-10 h-10 text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M15 17h5l-5 5v-5zM4.828 7l2.586 2.586a2 2 0 002.828 0L15 4.828V2H4.828zM4.828 17H2v-2l5.414-5.414a2 2 0 012.828 0L15 12.172V15l-5.414 5.414a2 2 0 01-2.828 0L4.828 17z" 
              />
            </svg>
          </div>
        </div>

        {/* No Notifications Message */}
        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          No Notifications
        </h2>
        
        <p className="text-gray-500 text-base max-w-sm mx-auto leading-relaxed">
          You're all caught up! When you receive notifications about campaigns, messages, or updates, they'll appear here.
        </p>

        {/* Optional: Add a subtle background pattern */}
        <div className="absolute inset-0 -z-10 opacity-5">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gray-300 rounded-full"></div>
          <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-gray-300 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    </div>
    </>
  );
}
