'use client';

import Filters from "@/components/Filters";
import InfluencerGrid from "@/components/InfluencerGrid";
import InfluencerCard from "@/components/InfulancerCard";
import SearchAndFilter from "@/components/searchAndFilter";
import UserRolePopup from "@/components/userRolePopup";
import ProfileSwitcher from "@/components/profile-switcher";
import Image from "next/image";
import { motion } from 'framer-motion';

//theme color image
// https://dribbble.com/shots/20245319-fenzy-for-Sellers-Visual-Design

const influencers = [ 
  {
    id:1,
    name: "John Doe",
    image: "/images/women.png",
    isVerified: true,
    location: "New York",
    category: "Fashion",
    followers: 1000,
    startingPrice: 1000,
    instagramUrl: "https://www.instagram.com/john_doe",
    youtubeUrl: "https://www.youtube.com/john_doe", 
    facebookUrl: "https://www.facebook.com/john_doe",
    isFeatured: true,
  },
  {
    id: 2,
    name: "Andrii",
    image: "/images/men.png",
    isVerified: true,
    location: "New York",
    category: "Fashion",
    followers: 1000,
    startingPrice: 1000,
    isFeatured: true,
  },
  {
    id: 3,
    name: "mak",
    image: "/images/men.png",
    isVerified: true,
    location: "New York",
    category: "Fashion",
    followers: 1000,
    startingPrice: 1000,
  },
  {
    id: 4,
    name: "Sasha",
    image: "/images/women.png",
    isVerified: true,
    location: "New York",
    category: "Fashion",
    followers: 1000,
    startingPrice: 1000,
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Scattered dots background pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-2 h-2 bg-gray-400 rounded-full opacity-30"></div>
        <div className="absolute top-32 right-20 w-1 h-1 bg-gray-400 rounded-full opacity-40"></div>
        <div className="absolute top-48 left-1/4 w-1.5 h-1.5 bg-gray-400 rounded-full opacity-25"></div>
        <div className="absolute top-64 right-1/3 w-1 h-1 bg-gray-400 rounded-full opacity-35"></div>
        <div className="absolute top-80 left-16 w-2 h-2 bg-gray-400 rounded-full opacity-20"></div>
        <div className="absolute top-96 right-8 w-1.5 h-1.5 bg-gray-400 rounded-full opacity-30"></div>
        <div className="absolute top-[28rem] left-1/2 w-1 h-1 bg-gray-400 rounded-full opacity-25"></div>
        <div className="absolute top-[32rem] right-1/4 w-2 h-2 bg-gray-400 rounded-full opacity-20"></div>
        <div className="absolute top-[36rem] left-8 w-1.5 h-1.5 bg-gray-400 rounded-full opacity-35"></div>
        <div className="absolute top-[40rem] right-16 w-1 h-1 bg-gray-400 rounded-full opacity-30"></div>
        <div className="absolute top-[44rem] left-1/3 w-2 h-2 bg-gray-400 rounded-full opacity-25"></div>
        <div className="absolute top-[48rem] right-1/2 w-1.5 h-1.5 bg-gray-400 rounded-full opacity-20"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-6 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className=" font-bold text-white mb-2 text-[40px]"
          >
            Find the Right Creator.
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4 flex items-center justify-center"
          >
            Fast. 
            <span className="ml-0 text-yellow-400">⚡</span>
          </motion.div>
          <motion.p 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg text-gray-300 font-normal"
          >
            Put up a request — or just browse.
          </motion.p>
        </div>

        {/* Cards Grid */}
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-4 gap-3 md:gap-6">
            {/* Browse Influencers Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="relative bg-gradient-to-b from-green-600 to-green-500 rounded-2xl p-3 md:p-6 h-48 md:h-72 cursor-pointer hover:scale-105 transition-transform duration-300"
            >
              {/* Star accents */}
              <div className="absolute top-2 right-3 w-1.5 h-1.5 bg-yellow-400 rounded-full opacity-80"></div>
              <div className="absolute top-4 left-4 w-1 h-1 bg-yellow-400 rounded-full opacity-60"></div>
              <div className="absolute bottom-12 right-4 w-0.5 h-0.5 bg-yellow-400 rounded-full opacity-70"></div>
              
              <h3 className="text-sm md:text-xl font-bold text-white mb-3 md:mb-6">Browse Influencers</h3>
              
              {/* Influencers illustration */}
              <div className="absolute bottom-3 left-3 right-3 flex justify-center">
                <div className="flex space-x-1 md:space-x-3">
                  {/* Person 1 */}
                  <div className="w-5 h-5 md:w-10 md:h-10 bg-purple-400 rounded-full flex items-center justify-center">
                    <div className="w-2.5 h-2.5 md:w-5 md:h-5 bg-white rounded-full"></div>
                  </div>
                  {/* Person 2 */}
                  <div className="w-5 h-5 md:w-10 md:h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                    <div className="w-2.5 h-2.5 md:w-5 md:h-5 bg-white rounded-full"></div>
                  </div>
                  {/* Person 3 */}
                  <div className="w-5 h-5 md:w-10 md:h-10 bg-blue-400 rounded-full flex items-center justify-center">
                    <div className="w-2.5 h-2.5 md:w-5 md:h-5 bg-white rounded-full"></div>
                  </div>
                  {/* Person 4 */}
                  <div className="w-5 h-5 md:w-10 md:h-10 bg-pink-400 rounded-full flex items-center justify-center">
                    <div className="w-2.5 h-2.5 md:w-5 md:h-5 bg-white rounded-full"></div>
                  </div>
                  {/* Person 5 */}
                  <div className="w-5 h-5 md:w-10 md:h-10 bg-orange-400 rounded-full flex items-center justify-center">
                    <div className="w-2.5 h-2.5 md:w-5 md:h-5 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Celeb/Talent Managers Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="relative bg-gradient-to-b from-blue-600 to-blue-500 rounded-2xl p-3 md:p-6 h-48 md:h-72 cursor-pointer hover:scale-105 transition-transform duration-300"
            >
              {/* Star accents */}
              <div className="absolute top-2 right-3 w-1.5 h-1.5 bg-yellow-400 rounded-full opacity-80"></div>
              <div className="absolute top-4 left-4 w-1 h-1 bg-yellow-400 rounded-full opacity-60"></div>
              <div className="absolute bottom-12 right-4 w-0.5 h-0.5 bg-yellow-400 rounded-full opacity-70"></div>
              
              <h3 className="text-sm md:text-xl font-bold text-white mb-3 md:mb-6">Celeb/Talent Managers</h3>
              
              {/* Manager illustration */}
              <div className="absolute bottom-3 left-3 right-3 flex justify-center">
                <div className="w-8 h-8 md:w-16 md:h-16 bg-purple-500 rounded-full flex items-center justify-center relative">
                  <div className="w-5 h-5 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center">
                    <div className="w-2.5 h-2.5 md:w-5 md:h-5 bg-purple-500 rounded-full"></div>
                  </div>
                  {/* Document */}
                  <div className="absolute -right-1 -top-1 md:-right-3 md:-top-3 w-4 h-5 md:w-8 md:h-10 bg-white rounded-sm transform rotate-12"></div>
                </div>
              </div>
            </motion.div>

            {/* Post Your Requirement Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="relative bg-gradient-to-b from-red-600 to-red-500 rounded-2xl p-3 md:p-6 h-48 md:h-72 cursor-pointer hover:scale-105 transition-transform duration-300"
            >
              {/* Star accents */}
              <div className="absolute top-2 right-3 w-1.5 h-1.5 bg-yellow-400 rounded-full opacity-80"></div>
              <div className="absolute top-4 left-4 w-1 h-1 bg-yellow-400 rounded-full opacity-60"></div>
              <div className="absolute bottom-12 right-4 w-0.5 h-0.5 bg-yellow-400 rounded-full opacity-70"></div>
              
              <h3 className="text-sm md:text-xl font-bold text-white mb-3 md:mb-6">Post Your Requirement</h3>
              
              {/* Megaphone illustration */}
              <div className="absolute bottom-3 left-3 right-3 flex justify-center">
                <div className="relative">
                  <div className="w-8 h-5 md:w-16 md:h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <div className="w-5 h-2.5 md:w-10 md:h-5 bg-white rounded-full"></div>
                  </div>
                  {/* Sound waves */}
                  <div className="absolute -right-1 top-1 md:-right-3 md:top-2 w-2 h-0.5 md:w-4 md:h-1 bg-white rounded-full opacity-80"></div>
                  <div className="absolute -right-2 top-0.5 md:-right-6 md:top-1 w-3 h-0.5 md:w-6 md:h-1 bg-white rounded-full opacity-60"></div>
                  <div className="absolute -right-3 top-1.5 md:-right-9 md:top-3 w-4 h-0.5 md:w-8 md:h-1 bg-white rounded-full opacity-40"></div>
                </div>
              </div>
            </motion.div>

            {/* Services For You Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="relative bg-gradient-to-b from-orange-600 to-orange-500 rounded-2xl p-3 md:p-6 h-48 md:h-72 cursor-pointer hover:scale-105 transition-transform duration-300"
            >
              {/* Star accents */}
              <div className="absolute top-2 right-3 w-1.5 h-1.5 bg-yellow-400 rounded-full opacity-80"></div>
              <div className="absolute top-4 left-4 w-1 h-1 bg-yellow-400 rounded-full opacity-60"></div>
              <div className="absolute bottom-12 right-4 w-0.5 h-0.5 bg-yellow-400 rounded-full opacity-70"></div>
              
              <h3 className="text-sm md:text-xl font-bold text-white mb-3 md:mb-6">Services For You</h3>
              
              {/* Creative tools illustration */}
              <div className="absolute bottom-3 left-3 right-3 flex justify-center space-x-2 md:space-x-4">
                {/* Clapperboard */}
                <div className="w-5 h-4 md:w-10 md:h-8 bg-black rounded-sm flex items-center justify-center">
                  <div className="w-3.5 h-2.5 md:w-7 md:h-5 bg-white rounded-sm"></div>
                </div>
                {/* Notebook */}
                <div className="w-4 h-5 md:w-8 md:h-10 bg-yellow-400 rounded-sm flex items-center justify-center">
                  <div className="w-2.5 h-3.5 md:w-5 md:h-7 bg-white rounded-sm"></div>
                </div>
                {/* Tablet */}
                <div className="w-5 h-4 md:w-10 md:h-8 bg-blue-500 rounded-sm flex items-center justify-center">
                  <div className="w-3.5 h-2.5 md:w-7 md:h-5 bg-blue-300 rounded-sm"></div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
