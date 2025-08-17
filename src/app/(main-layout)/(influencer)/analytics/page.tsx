'use client'

import { useState, useEffect } from 'react';

export default function AnalyticsDashboard() {
  const [profileViews, setProfileViews] = useState(12974);
  const [followers, setFollowers] = useState(2455);
  const [earnings, setEarnings] = useState(2583);
  
  // Live counter effect for profile views
  useEffect(() => {
    // const interval = setInterval(() => {
    //   setProfileViews(prev => prev + Math.floor(Math.random() * 3) + 1);
    // }, 5000); // Update every 5 seconds
    
    // return () => clearInterval(interval);
  }, []);

  // Sample demographic data
  const ageGroupData = [
    { age: '13-18', count: 1250, percentage: 25.5 },
    { age: '19-25', count: 1850, percentage: 37.7 },
    { age: '26-35', count: 1200, percentage: 24.4 },
    { age: '36-45', count: 450, percentage: 9.2 },
    { age: '46+', count: 165, percentage: 3.2 }
  ];

  const genderData = [
    { gender: 'Male', count: 2150, percentage: 43.8 },
    { gender: 'Female', count: 2765, percentage: 56.2 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-teal-800 to-teal-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Analytics Dashboard</h1>
          <p className="text-teal-200 text-sm">Real-time performance metrics</p>
        </div>

        {/* Metrics Grid - 3x2 Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {/* Top Row - Left: Followers */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">FOLLOWERS</h3>
              <div className="flex items-center text-green-500 text-sm">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12 7a1 1 0 01-1-1V5.414l-4.293 4.293a1 1 0 01-1.414-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L13 5.414V6a1 1 0 01-1 1z" clipRule="evenodd" />
                </svg>
                +1.20%
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-4">{followers.toLocaleString()}</div>
            {/* Simple line chart */}
            <div className="h-16 bg-gray-50 rounded-lg p-2">
              <div className="h-full flex items-end space-x-1">
                {[20, 35, 25, 45, 30, 50, 40].map((height, index) => (
                  <div 
                    key={index} 
                    className="bg-teal-500 rounded-sm flex-1"
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
            </div>
            <div className="text-center text-xs text-gray-500 mt-2">Medium</div>
          </div>

          {/* Top Row - Right: Daily Profile Views (Live Counter) */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">VIEWS</h3>
              <div className="flex items-center text-green-500 text-sm">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12 7a1 1 0 01-1-1V5.414l-4.293 4.293a1 1 0 01-1.414-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L13 5.414V6a1 1 0 01-1 1z" clipRule="evenodd" />
                </svg>
                +4.73%
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-4">{profileViews.toLocaleString()}</div>
            {/* Bar chart for daily views */}
            <div className="h-16 bg-gray-50 rounded-lg p-2">
              <div className="h-full flex items-end space-x-1">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div 
                      className="bg-teal-500 rounded-sm w-full mb-1"
                      style={{ 
                        height: `${index === 4 ? 80 : index === 5 ? 90 : index === 6 ? 85 : 40 + (index * 5)}%` 
                      }}
                    />
                    <span className="text-xs text-gray-500">{day}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="text-center text-xs text-gray-500 mt-2">Medium</div>
          </div>

          {/* Middle Row - Left: Earnings */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">EARNED</h3>
              <div className="flex items-center text-red-500 text-sm">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12 13a1 1 0 100-2H5.414l4.293-4.293a1 1 0 00-1.414-1.414l-6 6a1 1 0 000 1.414l6 6a1 1 0 001.414-1.414L5.414 13H12z" clipRule="evenodd" />
                </svg>
                -5.34%
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-4">${earnings.toLocaleString()}</div>
            {/* Line chart for earnings */}
            <div className="h-16 bg-gray-50 rounded-lg p-2">
              <div className="h-full flex items-end space-x-1">
                {[30, 45, 35, 60, 40, 25, 35].map((height, index) => (
                  <div 
                    key={index} 
                    className="bg-pink-500 rounded-sm flex-1"
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
            </div>
            <div className="text-center text-xs text-gray-500 mt-2">Medium</div>
          </div>

          {/* Middle Row - Right: Stats Summary */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-800">Stats</h3>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              </div>
            </div>
            <div className="text-xs text-gray-500 mb-4">14 MARCH</div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Earned</span>
                <div className="flex items-center">
                  <span className="font-semibold text-gray-800">${earnings.toLocaleString()}</span>
                  <span className="text-red-500 text-xs ml-2">-5.34%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Followers</span>
                <div className="flex items-center">
                  <span className="font-semibold text-gray-800">{followers.toLocaleString()}</span>
                  <span className="text-green-500 text-xs ml-2">+1.20%</span>
                </div>
              </div>
            </div>
            <div className="text-center text-xs text-gray-500 mt-4">Medium</div>
          </div>

          {/* Bottom Row - Left: Age Group Demographics */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-800">Age Group Analytics</h3>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              </div>
            </div>
            <div className="space-y-3">
              {ageGroupData.map((age, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{age.age}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${age.percentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">{age.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center text-xs text-gray-500 mt-4">Medium</div>
          </div>

          {/* Bottom Row - Right: Gender Demographics */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-800">Gender Distribution</h3>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              </div>
            </div>
            <div className="space-y-4">
              {genderData.map((gender, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{gender.gender}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full ${gender.gender === 'Male' ? 'bg-blue-500' : 'bg-pink-500'}`}
                        style={{ width: `${gender.percentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">{gender.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center text-xs text-gray-500 mt-4">Medium</div>
          </div>
        </div>
      </div>
    </div>
  );
}