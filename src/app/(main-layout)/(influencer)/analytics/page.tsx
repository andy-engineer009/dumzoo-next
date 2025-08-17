'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState('today');

  // Mock data for profile views
  const profileViews = {
    today: 24,
    week: 156,
    month: 642
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
    {/* Header */}
    <div className="w-full px-6 py-3 border-b border-gray-200">
            <div className="flex items-center justify-center">
              <Link
                href="/profile"
                className="absolute left-4"
              >
                <svg className="w-6 h-6 text-gray-600 hover:text-gray-900" fill="none" stroke="#ccc" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <h1 className="text-lg font-medium text-gray-900">Analytics</h1>
            </div>
          </div>

      <div className="p-6 space-y-6">
        {/* Today Views Card - Colorful Design */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-3xl blur-xl"></div>
          <div className="relative bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-8 shadow-2xl border border-blue-300/30">
            <div className="text-center text-white">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">👁️</span>
              </div>
              <h2 className="text-xl font-semibold mb-4">Today's Views</h2>
              <div className="text-6xl font-bold mb-2 text-white">
                {profileViews.today}
              </div>
              <p className="text-blue-100 text-lg">Profile views today</p>
            </div>
          </div>
        </div>

        {/* Total Past Views - Colorful Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Last 7 Days Card */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-400/20 rounded-2xl blur-lg"></div>
            <div className="relative bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 shadow-xl border border-green-300/30">
              <div className="text-center text-white">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">📅</span>
                </div>
                <div className="text-3xl font-bold mb-2">{profileViews.week}</div>
                <p className="text-green-100 font-medium">Last 7 days</p>
              </div>
            </div>
          </div>

          {/* Last 30 Days Card */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-2xl blur-lg"></div>
            <div className="relative bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 shadow-xl border border-purple-300/30">
              <div className="text-center text-white">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">📈</span>
                </div>
                <div className="text-3xl font-bold mb-2">{profileViews.month}</div>
                <p className="text-purple-100 font-medium">Last 30 days</p>
              </div>
            </div>
          </div>
        </div>

        {/* Views Trend Graph - Colorful Design */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/20 to-cyan-400/20 rounded-3xl blur-xl"></div>
          <div className="relative bg-gradient-to-br from-indigo-500 to-cyan-600 rounded-3xl p-8 shadow-2xl border border-indigo-300/30">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">📊 Views Trend</h2>
            
            {/* Colorful Bar Chart */}
            <div className="h-48 bg-white/10 rounded-2xl p-6 flex items-end justify-center space-x-3 backdrop-blur-sm">
              <div className="w-10 bg-gradient-to-t from-yellow-400 to-orange-500 rounded-t-lg shadow-lg" style={{ height: '60%' }}></div>
              <div className="w-10 bg-gradient-to-t from-green-400 to-emerald-500 rounded-t-lg shadow-lg" style={{ height: '80%' }}></div>
              <div className="w-10 bg-gradient-to-t from-blue-400 to-blue-500 rounded-t-lg shadow-lg" style={{ height: '45%' }}></div>
              <div className="w-10 bg-gradient-to-t from-purple-400 to-purple-500 rounded-t-lg shadow-lg" style={{ height: '90%' }}></div>
              <div className="w-10 bg-gradient-to-t from-pink-400 to-pink-500 rounded-t-lg shadow-lg" style={{ height: '70%' }}></div>
              <div className="w-10 bg-gradient-to-t from-indigo-400 to-indigo-500 rounded-t-lg shadow-lg" style={{ height: '85%' }}></div>
              <div className="w-10 bg-gradient-to-t from-cyan-400 to-cyan-500 rounded-t-lg shadow-lg" style={{ height: '75%' }}></div>
            </div>
            
            <p className="text-center text-white/80 mt-4 text-lg">Last 7 days performance</p>
          </div>
        </div>

        {/* Profile Boost - Ultra Colorful */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-400/20 via-purple-400/20 to-blue-400/20 rounded-3xl blur-2xl"></div>
          <div className="relative bg-gradient-to-br from-pink-500 via-purple-600 to-blue-600 rounded-3xl p-8 shadow-2xl border border-white/20 overflow-hidden">
            {/* Floating Elements */}
            <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-yellow-400/30 to-orange-500/30 rounded-full blur-xl animate-bounce"></div>
            <div className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-br from-green-400/30 to-emerald-500/30 rounded-full blur-xl animate-bounce" style={{ animationDelay: '1s' }}></div>
            
            <div className="relative z-10 text-center">
              <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-white/30">
                <span className="text-4xl">🚀</span>
              </div>
              
              <h2 className="text-3xl font-bold text-white mb-4">Boost Your Profile</h2>
              <p className="text-white/90 text-lg mb-8 max-w-md mx-auto">
                Get more visibility and increase your profile views with our powerful tools
              </p>
              
              <button className="group relative bg-white text-purple-600 py-4 px-8 rounded-2xl font-bold text-lg hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-white/25">
                <span className="relative z-10">✨ Activate Boost Now</span>
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
