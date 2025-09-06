'use client';

import CampaignsDiscover from '@/components/discover/campaigns';
import InfluencerDiscover from '@/components/discover/influencer';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Finder() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'creators' | 'promotions'>('creators');

  return (
    <div className="min-h-screen bg-gray-50 finder-screen">
      <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 pb-8">
      <header className="sticky top-0 z-20 bg-white border-b border-gray-200 pr-4 py-3">
        <div className="flex items-center justify-center relative">
          <button 
            onClick={() => router.push('/')}
            className="p-2 rounded-full hover:bg-gray-100 absolute left-0 top-1/2 -translate-y-1/2"
          >
            <svg className="w-5 h-5" fill="none" stroke="#ccc" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-medium text-gray-900">Discover</h1>
        </div>
      </header>

        {/* Tab Navigation */}
        <div className="my-4 px-4">
          <nav className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('creators')}
              className={`flex-1 py-3 px-4 rounded-2xl font-medium text-sm transition-all duration-200 ${
                activeTab === 'creators'
                  ? 'bg-[#1fb036] text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'
              }`}
            >
             Find Creators
            </button>
            <button
              onClick={() => setActiveTab('promotions')}
              className={`flex-1 py-3 px-4 rounded-2xl font-medium text-sm transition-all duration-200 ${
                activeTab === 'promotions'
                  ? 'bg-[#1fb036] text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'
              }`}
            >
             Find Promotions
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white">
          {activeTab === 'creators' && (
            <div>
                  <InfluencerDiscover />

              {/* Add your creators content here */}
            </div>
          )}

          {activeTab === 'promotions' && (
            <div>
        <CampaignsDiscover />
            
              {/* Add your promotions content here */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
