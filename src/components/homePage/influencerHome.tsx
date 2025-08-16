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
 {/* {(isLoggedIn && userRole === '2') &&  */}
 <>
    <div className="home-wrapper pb-[80px]">
      {/* Welcome Header */}
      <div className="h-[195px] bg-[#000] rounded-b-[32px] border-gray-200  px-4 pt-4 pb-0 shadow-sm">
        <div className="flex items-start">
          {/* User Image */}
          <div className="w-[60px] h-[64px] rounded-[10px] overflow-hidden flex-shrink-0 bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
            {/* Replace with <img src={userImageUrl} ... /> if available */}
            <span className="text-white font-bold text-2xl">A</span>
          </div>
          {/* Right Side Content */}
          <div className="flex-1 ml-4 flex flex-col justify-center">
            {/* Name and Hey Icon */}
            <div className="flex items-center space-x-2">
              <span className="text-xl font-semibold text-[#fff]">Hi Andy</span>
              {/* Hey SVG Icon */}
         
            </div>
            {/* Badges Row */}
            <div className="flex items-center space-x-2 mt-2 ">
              {/* Trust Score Badge */}
              <span className="inline-flex items-center px-2 py-1 rounded-[6px] text-xs font-medium bg-[#3e6315] text-[#7bc005]">
                <svg className="w-4 h-4 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a1 1 0 01.894.553l7 14A1 1 0 0117 18H3a1 1 0 01-.894-1.447l7-14A1 1 0 0110 2zm0 3.618L4.618 16h10.764L10 5.618z" />
                </svg>
                87% Trust 
              </span>
              {/* Pro Member Badge */}
              <span className="inline-flex items-center px-2 py-1 rounded-[6px] text-xs font-medium bg-[#814900] text-[#fff]">
                <svg className="w-4 h-4 mr-1 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2l2.39 4.84 5.34.78-3.87 3.77.91 5.33L10 13.25l-4.77 2.51.91-5.33-3.87-3.77 5.34-.78L10 2z" />
                </svg>
                Pro Member
              </span>
            </div>
          </div>
        </div>
        <Image src="/images/hero.png" alt="hero" width={1000} height={1000} className="opacity-20" />
      </div>

      {/* Main Content */}
      <div className="pt-4 px-4">
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
              <h3 className="font-semibold text-lg mb-2">View Profile</h3>
              <p className="text-blue-100 text-sm">Update your information</p>
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

            {/* <div 
              className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white cursor-pointer hover:scale-105 transition-transform duration-200"
              onClick={() => router.push('/profile/edit')}
            >
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">View Profile</h3>
              <p className="text-green-100 text-sm">Update your information</p>
            </div> */}
          </div>
        </div>

        {/* Available Campaigns Section */}
        <div className="mb-6">
          <h2 className="text-base font-semibold text-gray-900 mb-3">Newly Campaigns</h2>
          <div className="space-y-3">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="bg-[#cccccc3d] rounded-xl shadow-md border border-gray-100 p-4 hover:shadow-lg transition-all duration-200 relative">
                {/* Title Row */}
                <div className="flex items-start justify-between mb-1">
                  <h3 className="text-md font-semibold text-gray-900 leading-tight pr-2 flex-1">
                    {campaign.title}
                  </h3>
                </div>
                
                {/* Description - Limited to 2 lines initially */}
                <div className="mb-3">
                  <p className={`text-xs text-gray-600 leading-relaxed ${!isExpanded(campaign.id) ? 'line-clamp-2' : ''}`}>
                    {campaign.description}
                  </p>
                  {isExpanded(campaign.id) && (
                    <p className="text-xs text-gray-600 leading-relaxed mt-2">
                      {campaign.fullDescription}
                    </p>
                  )}
                </div>
                
                {/* Due Date and Actions Row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-xs text-gray-500">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {campaign.dueDate}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button 
                      className="text-blue-600 hover:text-blue-700 font-medium text-xs px-2 py-1 rounded-xl hover:bg-blue-50 transition-colors "
                      onClick={() => toggleCampaignExpansion(campaign.id)}
                    >
                      {isExpanded(campaign.id) ? 'See Less' : 'See More'}
                    </button>
                    <button className="bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 text-xs font-medium transition-colors shadow-sm hover:shadow-md">
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            ))}
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
    </>
    {/* } */}
    </>
  );
}