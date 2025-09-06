'use client'

import { useState, useEffect } from 'react';

export default function AnalyticsDashboard() {
  const [profileViews, setProfileViews] = useState(1200);
  const [timesShortlisted, setTimesShortlisted] = useState(32);
  const [appearedInSearches, setAppearedInSearches] = useState(210);
  const [totalCampaigns, setTotalCampaigns] = useState(28);
  const [successRate, setSuccessRate] = useState(45);
  const [pendingApplications, setPendingApplications] = useState(6);

  // Count-up animation for numbers
  useEffect(() => {
    const animateValue = (start: number, end: number, duration: number, setter: (value: number) => void) => {
      const startTimestamp = performance.now();
      const step = (timestamp: number) => {
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const current = Math.floor(progress * (end - start) + start);
        setter(current);
        if (progress < 1) {
          requestAnimationFrame(step);
        }
      };
      requestAnimationFrame(step);
    };

    // Animate numbers on component mount
    setTimeout(() => {
      animateValue(0, profileViews, 2000, setProfileViews);
      animateValue(0, timesShortlisted, 1500, setTimesShortlisted);
      animateValue(0, appearedInSearches, 1500, setAppearedInSearches);
      animateValue(0, totalCampaigns, 1500, setTotalCampaigns);
      animateValue(0, successRate, 2000, setSuccessRate);
      animateValue(0, pendingApplications, 1000, setPendingApplications);
    }, 500);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-24">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Creator Analytics</h1>
          <p className="text-gray-600">Track your performance and grow your influence</p>
        </div>

        {/* Section 1: Profile Visibility (Free) */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-black">Profile Visibility</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Profile Views - Big Card */}
            <div className="md:col-span-1 bg-[#1fb036]/10 rounded-xl p-6 border border-[#1fb036]/20 relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-[#1fb036] rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <div className="flex items-center text-[#1fb036] text-sm">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12 7a1 1 0 01-1-1V5.414l-4.293 4.293a1 1 0 01-1.414-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L13 5.414V6a1 1 0 01-1 1z" clipRule="evenodd" />
                  </svg>
                  +12.5%
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">Profile Views</h3>
              <div className="text-4xl font-bold text-black mb-4">{profileViews.toLocaleString()}</div>
              
              {/* Boost Profile Button inside card */}
              <button className="w-full bg-[#1fb036] text-white px-4 py-3 rounded-lg font-medium flex items-center justify-center space-x-2 hover:bg-[#1fb036]/90 transition-all">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>🚀 Boost Profile</span>
              </button>
            </div>

            {/* Times Shortlisted - Small Card */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-[#1fb036] rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex items-center text-[#1fb036] text-sm">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12 7a1 1 0 01-1-1V5.414l-4.293 4.293a1 1 0 01-1.414-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L13 5.414V6a1 1 0 01-1 1z" clipRule="evenodd" />
                  </svg>
                  +8.2%
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">Shortlisted</h3>
              <div className="text-3xl font-bold text-black">{timesShortlisted}</div>
            </div>

            {/* Appeared in Searches - Small Card */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-[#1fb036] rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <div className="flex items-center text-[#1fb036] text-sm">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12 7a1 1 0 01-1-1V5.414l-4.293 4.293a1 1 0 01-1.414-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L13 5.414V6a1 1 0 01-1 1z" clipRule="evenodd" />
                  </svg>
                  +15.3%
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">Appeared in Search</h3>
              <div className="text-3xl font-bold text-black">{appearedInSearches}</div>
            </div>
          </div>
        </div>

        {/* Section 2: Promotion Applications (Free) */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-black">Promotion Applications</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Applied */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-[#1fb036] rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div className="flex items-center text-[#1fb036] text-sm">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12 7a1 1 0 01-1-1V5.414l-4.293 4.293a1 1 0 01-1.414-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L13 5.414V6a1 1 0 01-1 1z" clipRule="evenodd" />
                  </svg>
                  +5.2%
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">Total Applied</h3>
              <div className="text-3xl font-bold text-black">{totalCampaigns}</div>
            </div>

            {/* Success Rate */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-[#1fb036] rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">Success Rate</h3>
              <div className="flex items-center space-x-4">
                <div className="relative w-16 h-16">
                  <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-gray-200"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-[#1fb036]"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      fill="none"
                      strokeDasharray={`${successRate}, 100`}
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold text-black">{successRate}%</span>
                  </div>
                </div>
                <div className="text-2xl font-bold text-black">{successRate}%</div>
              </div>
            </div>

            {/* Pending Applications */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-[#1fb036] rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="w-3 h-3 bg-[#1fb036] rounded-full"></div>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">Pending Applications</h3>
              <div className="text-3xl font-bold text-black">{pendingApplications}</div>
            </div>
          </div>
        </div>

        {/* Section 3: Audience Insights (Premium Teaser) */}
        <div className="bg-white rounded-2xl shadow-lg p-6 relative overflow-hidden">
          {/* Blur overlay */}
          <div className="absolute inset-0 backdrop-blur-sm z-10 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#1fb036] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-black mb-2">Unlock detailed Audience Insights</h3>
              <p className="text-gray-600 mb-6">See who views your profile, audience details & get more campaigns 🚀</p>
              <button className="bg-[#1fb036] text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 mx-auto hover:bg-[#1fb036]/90 transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                <span>👑 Upgrade to Premium</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-black">Audience Insights</h2>
            <div className="flex items-center space-x-2 text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="text-sm">Premium</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Gender Split - Blurred */}
            <div className="space-y-6 filter blur-sm">
              <h3 className="text-lg font-semibold text-gray-900">Gender Split</h3>
              <div className="flex items-center justify-center">
                <div className="relative w-48 h-48">
                  <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      className="text-blue-200"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      cx="50"
                      cy="50"
                      r="40"
                    />
                    <circle
                      className="text-[#1fb036]"
                      stroke="currentColor"
                      strokeWidth="8"
                      strokeLinecap="round"
                      fill="none"
                      strokeDasharray="110, 251"
                      cx="50"
                      cy="50"
                      r="40"
                    />
                    <circle
                      className="text-gray-400"
                      stroke="currentColor"
                      strokeWidth="8"
                      strokeLinecap="round"
                      fill="none"
                      strokeDasharray="141, 251"
                      strokeDashoffset="-110"
                      cx="50"
                      cy="50"
                      r="40"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Age Groups - Blurred */}
            <div className="space-y-6 filter blur-sm">
              <h3 className="text-lg font-semibold text-gray-900">Age Groups</h3>
              <div className="space-y-4">
                {['13-17', '18-24', '25-34', '35-44', '45+'].map((age, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">{age}</span>
                      <span className="text-sm text-gray-500">--%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-[#1fb036] h-3 rounded-full"
                        style={{ width: `${20 + (index * 15)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            {/* Top Cities - Blurred */}
            <div className="space-y-6 filter blur-sm">
              <h3 className="text-lg font-semibold text-gray-900">Top Cities</h3>
              <div className="space-y-4">
                {['Delhi', 'Mumbai', 'Bangalore'].map((city, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{city}</span>
                    <div className="flex items-center space-x-3">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-[#1fb036] h-2 rounded-full"
                          style={{ width: `${30 - (index * 5)}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-500 w-8">--%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Languages - Blurred */}
            <div className="space-y-6 filter blur-sm">
              <h3 className="text-lg font-semibold text-gray-900">Top Languages</h3>
              <div className="flex flex-wrap gap-3">
                {['Hindi', 'English', 'Tamil', 'Telugu'].map((lang, index) => (
                  <div key={index} className="bg-[#1fb036] text-white px-4 py-2 rounded-full text-sm font-medium">
                    {lang} --%
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Sticky Banner */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#1fb036] text-white p-4 shadow-lg z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium">See who views your profile, audience details & get more campaigns</p>
          </div>
          <button className="bg-white text-[#1fb036] px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors ml-4">
            Upgrade Now
          </button>
        </div>
      </div>
    </div>
  );
}