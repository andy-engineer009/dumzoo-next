'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import VirtualInfluencerList from '@/components/manage-influencer-list/VirtualInfluencerList';
import VirtualCampaignList from '@/components/manage-campaign-list/VirtualCampaignList';
export default function Finder() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'creators' | 'promotions'>('creators');

  return (
    <div className="bg-gray-50 finder-screen " style={{height: '100vh',overflow: 'hidden'}}>
      <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 pb-8">
      {/* <header className="sticky top-0 z-20 bg-white border-b border-gray-200 pr-4 py-3">
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
      </header> */}

        {/* Tab Navigation */}
        <div className="mt-4  px-2">
          <nav className="flex bg-gray-100 rounded-lg p-1">
          {/* <svg onClick={() => router.back()} className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg> */}
            <button
              onClick={() => setActiveTab('creators')}
              className={`flex-1 py-3 px-4 rounded-xl font-medium text-sm transition-all duration-200 ${
                activeTab === 'creators'
                  ? 'bg-[#000] text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>Find Creators</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('promotions')}
              className={`flex-1 py-3 px-4 rounded-xl font-medium text-sm transition-all duration-200 ${
                activeTab === 'promotions'
                  ? 'bg-[#000] text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
                <span>Find Promotions</span>
              </div>
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white">
          {activeTab === 'creators' && (
            <div>
                  <VirtualInfluencerList />

              {/* Add your creators content here */}
            </div>
          )}

          {activeTab === 'promotions' && (
            <div>
        <VirtualCampaignList isPublic={true} />
            
              {/* Add your promotions content here */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
