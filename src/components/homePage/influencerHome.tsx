'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { selectUserRole, selectIsLoggedIn } from '@/store/userRoleSlice';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';

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

    // Sample data for newly added campaigns
    const newlyAddedCampaigns = [
      {
        id: 1,
        title: "Fashion Brand Collaboration",
        budget: 1000,
        image: "/images/logos/zaomato-logo.png"
      },
      {
        id: 2,
        title: "Tech Product Review",
        budget: 5000,
        image: "/images/logos/Starbucks-logo.png"
      },
      {
        id: 3,
        title: "Food & Beverage Promotion",
        budget: 1000,
        image: "/images/logos/subway.webp"
      },
      {
        id: 4,
        title: "Travel Destination Showcase",
        budget: 3000,
        image: "/images/offer.jpg"
      },
      {
        id: 5,
        title: "Fitness & Wellness Campaign",
        budget: 18000,
        image: "/images/offer-1.jpg"
      },
      {
        id: 6,
        title: "Educational Content Creation",
        budget: 22000,
        image: "/images/offer.jpg"
      }
    ];

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
      <div className="hidden h-[195px] bg-[#000] rounded-b-[32px] border-gray-200  px-4 pt-4 pb-0 shadow-sm">
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

      <div className="top-0 z-30 bg-[#d0d2ff] flex items-center justify-between px-4 pt-2">
        {/* Logo (left) */}
        <div className="flex items-center gap-2">
  
          <span className="font-bold text-lg text-black">Hi   Andy</span>
        </div>
        {/* Username (center) */}
        {/* Profile Icon (right) */}
        <div>
          <Link href="/profile">
            <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200 hover:shadow transition">
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A9 9 0 1112 21a9 9 0 01-6.879-3.196z" />
                <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" fill="none"/>
              </svg>
            </div>
          </Link>
        </div>
      </div>

      {/* banner */}
      <div className="bg-[#d0d2fe] w-full h-[200px] relative flex items-center justify-center rounded-b-[36px]">
        <Image
          src="/images/banner-top.png"
          alt="Banner"
          layout="fill"
          objectFit="contain"
          className="rounded-2xl"
          priority
        />
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

  

        {/* Newly Added Campaigns Section */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-gray-900 ">Newly Campaigns</h2>
            {/* <Link href="/campaigns" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View All
            </Link> */}
          </div>
          
          {/* Horizontal Scroll Campaign Cards */}
          <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
            {newlyAddedCampaigns.map((campaign: any) => (
              <div key={campaign.id} className="flex-shrink-0 w-[160px] bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-200">
                {/* Campaign Image */}
                <div className="relative h-32 bg-[#ebe6e79e]">
                  {campaign.image ? (
                    <Image
                      src={campaign.image}
                      alt={campaign.title}
                      width={256}
                      height={128}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                      <span className="text-gray-500 text-sm">Campaign Image</span>
                    </div>
                  )}
                </div>
                
                {/* Campaign Info */}
                <div className="p-3">
                  <div className="flex items-start justify-between">
                    {/* Left Side - Title and Budget */}
                    <div className="flex-1 pr-2 overflow-hidden">
                      <h3 className="text-sm font-semibold text-black leading-tight line-clamp-2 mb-1" style={{overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                        {campaign.title?.slice(0, 13)}
                      </h3>

                      <div className="flex items-center justify-between">
                        {/* Budget - left, light color */}
                        <p className="text-sm font-medium text-[#958d8d]">
                          ₹{campaign.budget?.toLocaleString() || '0'}
                        </p>
                        {/* Influencer type - right, static "Micro" with icon, light color */}
                        <span className="flex items-center gap-1 text-xs text-[#958d8d] font-medium">
                          Micro
                        </span>
                      </div>
                      {/* <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg> */}
                    </div>
                    
                
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-gray-900">Most Applied Campaigns</h2>
            {/* <Link href="/campaigns" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View All
            </Link> */}
          </div>
          
          {/* Horizontal Scroll Campaign Cards */}
          <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
          {newlyAddedCampaigns.map((campaign: any) => (
              <div key={campaign.id} className="flex-shrink-0 w-[160px] bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-200">
                {/* Campaign Image */}
                <div className="relative h-32 bg-[#ebe6e79e]">
                  {campaign.image ? (
                    <Image
                      src={campaign.image}
                      alt={campaign.title}
                      width={256}
                      height={128}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                      <span className="text-gray-500 text-sm">Campaign Image</span>
                    </div>
                  )}
                </div>
                
                {/* Campaign Info */}
                <div className="p-3">
                  <div className="flex items-start justify-between">
                    {/* Left Side - Title and Budget */}
                    <div className="flex-1 pr-2 overflow-hidden">
                      <h3 className="text-sm font-semibold text-black leading-tight line-clamp-2 mb-1" style={{overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                        {campaign.title?.slice(0, 13)}
                      </h3>

                      <div className="flex items-center justify-between">
                        {/* Budget - left, light color */}
                        <p className="text-sm font-medium text-[#958d8d]">
                          ₹{campaign.budget?.toLocaleString() || '0'}
                        </p>
                        {/* Influencer type - right, static "Micro" with icon, light color */}
                        <span className="flex items-center gap-1 text-xs text-[#958d8d] font-medium">
                          Micro
                        </span>
                      </div>
                      {/* <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg> */}
                    </div>
                    
                
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full mb-4">
          <Image
            src="/images/logos/refferal-banner.jpg"
            alt="Referral Banner"
            width={1200}
            height={150}
            className="w-full h-[100px] object-cover rounded-2xl shadow-md"
            priority
          />
        </div>

      {/* Quick Actions Section */}
      {/* <div className="mb-8 mt-2">
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
          </div>
        </div> */}

      </div>
      <footer className="bg-gray-900 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mr-3">
                <span className="text-gray-900 font-bold text-lg">D</span>
              </div>
              <h3 className="text-xl font-bold">Dumzoo</h3>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-3">
              Connect with the right creators. Fast. Put up a request or just browse through our curated network of influencers and content creators.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                </svg>
              </a>
            </div>
                    {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-6 pt-4 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 Dumzoo. All rights reserved. 
           <Link href="/login">Login</Link>
           <Link href="/signup">Signup</Link>

          </p>
          <div className="flex items-center space-x-4 mt-2 md:mt-0">
            <span className="text-gray-400 text-sm">Made with ❤️ in India</span>
          </div>
        </div>
          </div>

     
        </div>


      </div>
    </footer>
    </div>
    </>
    {/* } */}
    </>
  );
}