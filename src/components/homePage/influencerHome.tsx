'use client'

import Image from "next/image";
import { motion } from 'framer-motion';
import { selectUserRole, selectIsLoggedIn } from '@/store/userRoleSlice';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import Link from 'next/link';

interface Campaign {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  dueDate: string;
  status: 'new' | 'approved' | 'pending';
  statusText: string;
  statusColor: string;
}

export default function InfluencerHome() {
    const router = useRouter();
    const userRole = useSelector(selectUserRole);
    const isLoggedIn = useSelector(selectIsLoggedIn);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [expandedCampaigns, setExpandedCampaigns] = useState<Set<string>>(new Set());

    // Campaign data array
    const campaigns: Campaign[] = [
      {
        id: 'summer-fashion',
        title: 'Summer Fashion Collection',
        description: 'Create an engaging Instagram Reel showcasing our latest summer fashion line with a focus on beachwear and accessories.',
        fullDescription: 'We are looking for creative content that highlights the versatility and style of our collection.',
        dueDate: 'Due in 3 days',
        status: 'new',
        statusText: 'New',
        statusColor: 'bg-blue-100 text-blue-700'
      },
      {
        id: 'fitness-product',
        title: 'Fitness Product Launch',
        description: 'Professional photo shoot featuring our new fitness equipment line. Looking for lifestyle and action shots.',
        fullDescription: 'Must include both indoor and outdoor settings that demonstrate proper form and the effectiveness of our equipment.',
        dueDate: 'Due in 5 days',
        status: 'approved',
        statusText: 'Approved',
        statusColor: 'bg-green-100 text-green-700'
      },
      {
        id: 'tech-gadget',
        title: 'Tech Gadget Review',
        description: 'Create an in-depth YouTube review of our latest smart home device. Focus on features, usability and setup process.',
        fullDescription: 'Video should be 10-15 minutes long with detailed demonstrations of key features and real-world usage scenarios.',
        dueDate: 'Due in 7 days',
        status: 'new',
        statusText: 'New',
        statusColor: 'bg-blue-100 text-blue-700'
      }
    ];

    const toggleCampaignExpansion = (campaignId: string) => {
      const newExpanded = new Set(expandedCampaigns);
      if (newExpanded.has(campaignId)) {
        newExpanded.delete(campaignId);
      } else {
        newExpanded.add(campaignId);
      }
      setExpandedCampaigns(newExpanded);
    };

    const isExpanded = (campaignId: string) => expandedCampaigns.has(campaignId);

    console.log(isLoggedIn, 'isLoggedIn',userRole);
    useEffect(() => {
        if(isLoggedIn) {    
            setIsLoadingData(false);
        }
    }, [isLoggedIn]);

  return (
    <>
 {(isLoggedIn && userRole === '2') && <>
    <div className="home-wrapper pb-[80px]">
      {/* Welcome Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 py-3 px-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Welcome back, Andy! 👋</h1>
              {/* <p className="text-sm text-gray-500">Ready to create amazing content?</p> */}
            </div>
          </div>
          {/* <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
              </svg>
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
              </svg>
            </button>
          </div> */}
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-20 px-4">
        {/* Quick Stats Section */}
        {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-0">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">2.4K</p>
                <p className="text-xs text-gray-500">Followers</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">₹15K</p>
                <p className="text-xs text-gray-500">Earnings</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">8</p>
                <p className="text-xs text-gray-500">Active Offers</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">4.8</p>
                <p className="text-xs text-gray-500">Rating</p>
              </div>
            </div>
          </motion.div>
        </div> */}

        {/* Quick Actions Section */}
        <div className="mb-8 mt-2">
          {/* <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2> */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div 
              className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white cursor-pointer hover:scale-105 transition-transform duration-200"
              onClick={() => router.push('/profile/edit/offers')}
            >
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Create Offer</h3>
              <p className="text-blue-100 text-sm">Add new service packages</p>
            </div>

            <div 
              className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white cursor-pointer hover:scale-105 transition-transform duration-200"
              onClick={() => router.push('/profile/edit')}
            >
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Edit Profile</h3>
              <p className="text-green-100 text-sm">Update your information</p>
            </div>

            <div 
              className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white cursor-pointer hover:scale-105 transition-transform duration-200"
              onClick={() => router.push('/analytics')}
            >
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Analytics</h3>
              <p className="text-purple-100 text-sm">View your performance</p>
            </div>
          </div>
        </div>

        {/* Available Campaigns Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4"> Newly Campaigns</h2>
          <div className="bg-white rounded-2xl shadow-sm">
            <div className="space-y-6">
              {campaigns.map((campaign) => (
                <div key={campaign.id} className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-semibold text-gray-900">{campaign.title}</h3>

                  </div>
                  <div>
                    <p className="text-gray-600 mb-3">
                      {campaign.description}
                      {isExpanded(campaign.id) && (
                        <span className="block mt-2">{campaign.fullDescription}</span>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {campaign.dueDate}
                  </div>
                  <div className="flex justify-between items-center">
                    <button 
                      className="text-blue-600 hover:text-blue-700 font-medium"
                      onClick={() => toggleCampaignExpansion(campaign.id)}
                    >
                      {isExpanded(campaign.id) ? 'See Less' : 'See More'}
                    </button>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                      Apply Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">New booking received</p>
                  <p className="text-sm text-gray-500">Instagram Post package - ₹2,500</p>
                </div>
                <span className="text-xs text-gray-400">2h ago</span>
              </div>

              <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Profile viewed 15 times</p>
                  <p className="text-sm text-gray-500">Your profile is getting attention!</p>
                </div>
                <span className="text-xs text-gray-400">5h ago</span>
              </div>

              <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Payment received</p>
                  <p className="text-sm text-gray-500">YouTube Video project - ₹5,000</p>
                </div>
                <span className="text-xs text-gray-400">1d ago</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tips & Resources Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Tips & Resources</h2>
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 border border-purple-100">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Boost Your Visibility</h3>
                <p className="text-gray-600 text-sm mb-3">Complete your profile, add high-quality portfolio images, and respond quickly to brand inquiries to increase your chances of getting hired.</p>
                <button className="text-purple-600 font-medium text-sm hover:text-purple-700">Learn More →</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>}
    </>
  );
}