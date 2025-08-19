'use client'

import Image from "next/image";
import { motion } from 'framer-motion';
import { selectUserRole, selectIsLoggedIn } from '@/store/userRoleSlice';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
// const influencers = [ 
//   {
//     id:1,
//     name: "John Doe",
//     image: "/images/women.png",
//     isVerified: true,
//     location: "New York",
//     category: "Fashion",
//     followers: 1000,
//     startingPrice: 1000,
//     instagramUrl: "https://www.instagram.com/john_doe",
//     youtubeUrl: "https://www.youtube.com/john_doe", 
//     facebookUrl: "https://www.facebook.com/john_doe",
//     isFeatured: true,
//   },
//   {
//     id: 2,
//     name: "Andrii",
//     image: "/images/men.png",
//     isVerified: true,
//     location: "New York",
//     category: "Fashion",
//     followers: 1000,
//     startingPrice: 1000,
//     isFeatured: true,
//   },
//   {
//     id: 3,
//     name: "mak",
//     image: "/images/men.png",
//     isVerified: true,
//     location: "New York",
//     category: "Fashion",
//     followers: 1000,
//     startingPrice: 1000,
//   },
//   {
//     id: 4,
//     name: "Sasha",
//     image: "/images/women.png",
//     isVerified: true,
//     location: "New York",
//     category: "Fashion",
//     followers: 1000,
//     startingPrice: 1000,
//   },
// ];

export default function PromotorHome() {
    const router = useRouter();
    const userRole = useSelector(selectUserRole);
    const isLoggedIn = useSelector(selectIsLoggedIn);
    const [isLoadingData, setIsLoadingData] = useState(true);

    console.log(isLoggedIn, 'isLoggedIn',userRole);
    useEffect(() => {
        if(isLoggedIn) {    
            setIsLoadingData(false);
        }
    }, [isLoggedIn]);

    // useEffect(() => {
    //     console.log(userRole, 'userRole');
    // }, [userRole]);

  return (
    // {(!isLoggedIn || userRole === '3' || userRole === null) &&
    <>
    <div className="home-wrapper pb-[80px]">
    <div className="fixed top-0 left-0 right-0 z-50 bg-black py-3 px-4 flex items-center justify-between">
      <div className="text-white text-sm font-bold">
        Hi Andy 👋
      </div>
      <button
        className="text-white text-sm font-semibold bg-transparent border-1 border-white rounded-full px-4 py-1 hover:underline"
        onClick={() => router.push('/login')}
        style={{ background: 'none', outline: 'none', cursor: 'pointer' }}
      >
        Login
      </button>
    </div>
    {/* hero section */}
    <div className="min-h-[300px] rounded-b-[20px] bg-black relative overflow-hidden hero-section pt-8 flex items-center justify-center">
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
      <div className="relative z-10 px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-4">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className=" font-bold text-white mb-3 text-[28px]" style={{lineHeight: '26px'}}
          >
            Find the Right Creator.
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-[30px] font-bold text-white mb-1 flex items-center justify-center"
          >
            Fast. 
            <span className="ml-0 text-yellow-400">⚡</span>
          </motion.div>
          <motion.p 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-[16px] text-gray-300 font-normal"
          >
            Put up a request — or just browse.
          </motion.p>
        </div>

        {/* Cards Grid */}
        <div className="max-w-7xl mx-auto hidden">
          <div className="grid grid-cols-4 gap-2 md:gap-6">
            {/* Browse Influencers Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="relative bg-gradient-to-b from-green-600 to-green-500 rounded-[10px] p-2 md:p-6 h-[120px] cursor-pointer hover:scale-105 transition-transform duration-300"
            >
     
              
              <h3 className="text-[12px] font-medium text-white mb-3 md:mb-6">Browse Influencers</h3>
              
              {/* Influencers illustration */}
            
            </motion.div>

            {/* Celeb/Talent Managers Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="relative bg-gradient-to-b from-blue-600 to-blue-500 rounded-[10px] p-2 md:p-6  h-[120px] cursor-pointer hover:scale-105 transition-transform duration-300"
            >
              {/* Star accents */}
       
              
              <h3 className="text-[12px] font-medium text-white mb-3 md:mb-6">Celeb/Talent Managers</h3>
              
              {/* Manager illustration */}
           
            </motion.div>

            {/* Post Your Requirement Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="relative bg-gradient-to-b from-red-600 to-red-500 rounded-[10px] p-2 md:p-6  h-[120px] cursor-pointer hover:scale-105 transition-transform duration-300"
            >
        
              
              <h3 className="text-[12px] font-medium text-white mb-3 md:mb-6">Post Your Requirement</h3>
              
              {/* Megaphone illustration */}
       
            </motion.div>

            {/* Services For You Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="relative bg-gradient-to-b from-orange-600 to-orange-500 rounded-[10px] p-2 md:p-6  h-[120px] cursor-pointer hover:scale-105 transition-transform duration-300"
            >
              {/* Star accents */}

              
              <h3 className="text-[12px] font-medium text-white mb-3 md:mb-6">Services For You</h3>
              
              {/* Creative tools illustration */}
       
            </motion.div>
          </div>
        </div>
      </div>
      <div className="hero-bg-image"></div>
    </div>

    {!isLoggedIn && (
      <></>
      // <div className="influencer-cta-section py-12 px-4 bg-gradient-to-br from-purple-50 to-pink-50">
      //   <div className="max-w-4xl mx-auto">
      //     <motion.div
      //       initial={{ opacity: 0, y: 20 }}
      //       animate={{ opacity: 1, y: 0 }}
      //       transition={{ duration: 0.6 }}
      //       className="bg-white rounded-2xl p-8 shadow-xl border border-purple-100"
      //     >
      //       <div className="flex flex-col md:flex-row items-center justify-between gap-8">
      //         <div className="flex-1">
      //           <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
      //             Are you an <span className="text-purple-600">Influencer</span>?
      //           </h2>
      //           <p className="text-gray-600 mb-6">
      //             Have more than 500 followers? Join our platform and start earning through paid promotions!
      //           </p>
               
      //         </div>
              
      //         <div className="flex-shrink-0">
      //           <motion.button
      //             whileHover={{ scale: 1.05 }}
      //             whileTap={{ scale: 0.95 }}
      //             className="bg-purple-600 text-white px-8 py-4 rounded-full font-medium shadow-lg shadow-purple-200 hover:bg-purple-700 transition-colors duration-300"
      //             onClick={() => {
      //               router.push('/login');
      //             }}
      //           >
      //             Join as Influencer
      //           </motion.button>
      //         </div>
      //       </div>
      //     </motion.div>
      //   </div>
      // </div>
    )}

    {/* new on dumzoo */}
<div className="new-on-dumzoo mt-8">
<div className="text-center">
          <div className="flex items-center justify-center">
            <div className="border-b border-gray-300 h-[1px] w-[40px]"></div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="#5D22AC">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h2 className="text-[14px] font-medium text-gray-800 uppercase px-0" style={{letterSpacing: '3px'}}>NEW ON <span className="text-purple-600">DUMZOO</span></h2>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-3  text-gray-500" fill="none" viewBox="0 0 24 24" stroke="#5D22AC">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <div className="border-b border-gray-300 h-[1px] w-[40px]"></div>
        </div>
        </div>

        {/* Influencer Cards Horizontal Scroll */}
        <div className="mt-6 px-4">
          <div className="flex space-x-4 overflow-x-auto hide-scrollbar pb-4">
            {/* Card 1 */}
            <div className="flex-shrink-0 w-[130px] h-[130px] relative rounded-[20px] overflow-hidden shadow-lg">
              <div className="absolute inset-0 bg-black/60"></div>
              <img 
                src="/images/women.png" 
                alt="Influencer" 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4">
                <h3 className="text-white font-bold text-sm mb-1 drop-shadow-lg">Sarah Johnson</h3>
                <p className="text-gray-100 text-xs font-medium drop-shadow">Food</p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="flex-shrink-0 w-[130px] h-[130px] relative rounded-[20px] overflow-hidden shadow-lg">
              <div className="absolute inset-0 bg-black/60"></div>
              <img 
                src="/images/men.png" 
                alt="Influencer" 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4">
                <h3 className="text-white font-bold text-sm mb-1 drop-shadow-lg">Mike Chen</h3>
                <p className="text-gray-100 text-xs font-medium drop-shadow">Travel</p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="flex-shrink-0 w-[130px] h-[130px] relative rounded-[20px] overflow-hidden shadow-lg">
              <div className="absolute inset-0 bg-black/60"></div>
              <img 
                src="/images/women.png" 
                alt="Influencer" 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4">
                <h3 className="text-white font-bold text-sm mb-1 drop-shadow-lg">Emma Davis</h3>
                <p className="text-gray-100 text-xs font-medium drop-shadow">Fashion</p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="flex-shrink-0 w-[130px] h-[130px] relative rounded-[20px] overflow-hidden shadow-lg">
              <div className="absolute inset-0 bg-black/60"></div>
              <img 
                src="/images/men.png" 
                alt="Influencer" 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4">
                <h3 className="text-white font-bold text-sm mb-1 drop-shadow-lg">Alex Rodriguez</h3>
                <p className="text-gray-100 text-xs font-medium drop-shadow">Technology</p>
              </div>
            </div>

            {/* Card 5 */}
            <div className="flex-shrink-0 w-[130px] h-[130px] relative rounded-[20px] overflow-hidden shadow-lg">
              <div className="absolute inset-0 bg-black/60"></div>
              <img 
                src="/images/women.png" 
                alt="Influencer" 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4">
                <h3 className="text-white font-bold text-sm mb-1 drop-shadow-lg">Lisa Wang</h3>
                <p className="text-gray-100 text-xs font-medium drop-shadow">Beauty</p>
              </div>
            </div>

            {/* Card 6 */}
            <div className="flex-shrink-0 w-[130px] h-[130px] relative rounded-[20px] overflow-hidden shadow-lg">
              <div className="absolute inset-0 bg-black/60"></div>
              <img 
                src="/images/men.png" 
                alt="Influencer" 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4">
                <h3 className="text-white font-bold text-sm mb-1 drop-shadow-lg">David Kim</h3>
                <p className="text-gray-100 text-xs font-medium drop-shadow">Fitness</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* new on dumzoo */}
<div className="new-on-dumzoo mt-8">
<div className="text-center">
          <div className="flex items-center justify-center">
            <div className="border-b border-gray-300 h-[1px] w-[40px]"></div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="#5D22AC">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h2 className="text-[14px] font-medium text-gray-800 uppercase px-0" style={{letterSpacing: '3px'}}>Trending <span className="text-purple-600">DUMZOO</span></h2>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-3  text-gray-500" fill="none" viewBox="0 0 24 24" stroke="#5D22AC">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <div className="border-b border-gray-300 h-[1px] w-[40px]"></div>
        </div>
        </div>

        {/* Influencer Cards Horizontal Scroll */}
        <div className="mt-6 px-4">
          <div className="flex space-x-4 overflow-x-auto hide-scrollbar pb-4">
            {/* Card 1 */}
            <div className="flex-shrink-0 w-[130px] h-[130px] relative rounded-[20px] overflow-hidden shadow-lg">
              <div className="absolute inset-0 bg-black/60"></div>
              <img 
                src="/images/women.png" 
                alt="Influencer" 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4">
                <h3 className="text-white font-bold text-sm mb-1 drop-shadow-lg">Sarah Johnson</h3>
                <p className="text-gray-100 text-xs font-medium drop-shadow">Food</p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="flex-shrink-0 w-[130px] h-[130px] relative rounded-[20px] overflow-hidden shadow-lg">
              <div className="absolute inset-0 bg-black/60"></div>
              <img 
                src="/images/men.png" 
                alt="Influencer" 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4">
                <h3 className="text-white font-bold text-sm mb-1 drop-shadow-lg">Mike Chen</h3>
                <p className="text-gray-100 text-xs font-medium drop-shadow">Travel</p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="flex-shrink-0 w-[130px] h-[130px] relative rounded-[20px] overflow-hidden shadow-lg">
              <div className="absolute inset-0 bg-black/60"></div>
              <img 
                src="/images/women.png" 
                alt="Influencer" 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4">
                <h3 className="text-white font-bold text-sm mb-1 drop-shadow-lg">Emma Davis</h3>
                <p className="text-gray-100 text-xs font-medium drop-shadow">Fashion</p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="flex-shrink-0 w-[130px] h-[130px] relative rounded-[20px] overflow-hidden shadow-lg">
              <div className="absolute inset-0 bg-black/60"></div>
              <img 
                src="/images/men.png" 
                alt="Influencer" 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4">
                <h3 className="text-white font-bold text-sm mb-1 drop-shadow-lg">Alex Rodriguez</h3>
                <p className="text-gray-100 text-xs font-medium drop-shadow">Technology</p>
              </div>
            </div>

            {/* Card 5 */}
            <div className="flex-shrink-0 w-[130px] h-[130px] relative rounded-[20px] overflow-hidden shadow-lg">
              <div className="absolute inset-0 bg-black/60"></div>
              <img 
                src="/images/women.png" 
                alt="Influencer" 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4">
                <h3 className="text-white font-bold text-sm mb-1 drop-shadow-lg">Lisa Wang</h3>
                <p className="text-gray-100 text-xs font-medium drop-shadow">Beauty</p>
              </div>
              </div>
              
            {/* Card 6 */}
            <div className="flex-shrink-0 w-[130px] h-[130px] relative rounded-[20px] overflow-hidden shadow-lg">
              <div className="absolute inset-0 bg-black/60"></div>
              <img 
                src="/images/men.png" 
                alt="Influencer" 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4">
                <h3 className="text-white font-bold text-sm mb-1 drop-shadow-lg">David Kim</h3>
                <p className="text-gray-100 text-xs font-medium drop-shadow">Fitness</p>
              </div>
              </div>
            </div>
        </div>
      </div>

    {/* categories section */}
    <div className="categories-section pt-8">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <div className="flex items-center justify-center">
            <div className="border-b border-gray-300 h-[1px] w-[40px]"></div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="#5D22AC">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h2 className="text-[14px] font-medium text-gray-800 uppercase px-0" style={{letterSpacing: '3px'}}>Browse Creators</h2>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-3  text-gray-500" fill="none" viewBox="0 0 24 24" stroke="#5D22AC">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <div className="border-b border-gray-300 h-[1px] w-[40px]"></div>
        </div>

        </div>

        {/* Categories Grid */}
        <div className="mt-8">
          <div className="grid grid-cols-4 md:grid-cols-3 gap-4">
            {/* Row 1 */}
            {/* Arts */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-[#FAFAFA] rounded-[20px] flex items-center justify-center mb-2 shadow-sm border border-[#EDEDED]">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="#5D22AC" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="#5D22AC" strokeWidth="2"/>
                  <circle cx="12" cy="12" r="3" fill="#5D22AC"/>
                  <circle cx="8" cy="8" r="2" fill="#5D22AC"/>
                  <circle cx="16" cy="8" r="2" fill="#5D22AC"/>
                  <circle cx="8" cy="16" r="2" fill="#5D22AC"/>
                  <circle cx="16" cy="16" r="2" fill="#5D22AC"/>
                </svg>
              </div>
              <span className="text-[12px] text-black font-medium text-center">Arts</span>
            </div>

            {/* Beauty */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-[#FAFAFA] rounded-[20px] flex items-center justify-center mb-2 shadow-sm border border-[#EDEDED]">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="#5D22AC" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
                </svg>
              </div>
              <span className="text-[12px] text-black font-medium text-center">Beauty</span>
            </div>

            {/* Comedy & Memes */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-[#FAFAFA] rounded-[20px] flex items-center justify-center mb-2 shadow-sm border border-[#EDEDED]">
                <svg className="w-6 h-6 text-purple-600" fill="#5D22AC" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <span className="text-[12px] text-black font-medium text-center">Comedy & Memes</span>
            </div>

            {/* Education */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-[#FAFAFA] rounded-[20px] flex items-center justify-center mb-2 shadow-sm border border-[#EDEDED]">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="#5D22AC" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>
                </svg>
              </div>
              <span className="text-[12px] text-black font-medium text-center">Education</span>
            </div>

            {/* Row 2 */}
            {/* Automotive */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-[#FAFAFA] rounded-[20px] flex items-center justify-center mb-2 shadow-sm border border-[#EDEDED]">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="#5D22AC" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="#5D22AC" strokeWidth="2"/>
                  <circle cx="12" cy="12" r="3" stroke="#5D22AC" strokeWidth="2"/>
                </svg>
              </div>
              <span className="text-[12px] text-black font-medium text-center">Automotive</span>
            </div>

            {/* Business & Startups */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-[#FAFAFA] rounded-[20px] flex items-center justify-center mb-2 shadow-sm border border-[#EDEDED]">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="#5D22AC" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                </svg>
              </div>
              <span className="text-[12px] text-black font-medium text-center">Business & Startups</span>
            </div>

            {/* Travel & Places */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-[#FAFAFA] rounded-[20px] flex items-center justify-center mb-2 shadow-sm border border-[#EDEDED]">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="#5D22AC" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <span className="text-[12px] text-black font-medium text-center">Travel & Places</span>
            </div>

            {/* Entertainment */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-[#FAFAFA] rounded-[20px] flex items-center justify-center mb-2 shadow-sm border border-[#EDEDED]">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="#5D22AC" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2"/>
                </svg>
              </div>
              <span className="text-[12px] text-black font-medium text-center">Entertainment</span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center gap-1 cursor-pointer mt-8">
            <span className="text-purple-600 text-sm font-medium">See All</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="#5D22AC">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
      </div>
    </div>




      <div className="w-full mt-4 mb-6 px-4">
          <Image
            src={"/images/logos/refferal_banner.jpg"}
            alt="Referral Banner"
            width={1200}
            height={150}
            className="w-full h-[100px] object-cover rounded-2xl shadow-md"
          />
      </div>

          {/* popular cities */}
    <div className="popular-cities mt-4">
    <div className="text-center">
          <div className="flex items-center justify-center">
            <div className="border-b border-gray-300 h-[1px] w-[40px]"></div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="#5D22AC">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
              <h2 className="text-[14px] font-medium text-gray-800 uppercase px-0" style={{letterSpacing: '3px'}}>Popular Cities</h2>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-3  text-gray-500" fill="none" viewBox="0 0 24 24" stroke="#5D22AC">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <div className="border-b border-gray-300 h-[1px] w-[40px]"></div>
        </div>
        </div>

        {/* popular cities cards */}
        <div className="mt-8 px-4">
          <div className="grid grid-cols-4 gap-3 max-w-4xl mx-auto">
            {/* Bengaluru */}
            <div className="relative bg-gradient-to-b from-blue-100 to-blue-200 rounded-[10px] h-[120px] cursor-pointer hover:scale-105 transition-transform duration-300 overflow-hidden">

              <h3 className="text-[0.775rem] font-semibold text-black mb-2 px-2 pt-3 text-center">Bengaluru</h3>
             <div>
              <Image src={"/images/india_gate.png"} alt="Bengaluru" width={100} height={100} />
             </div>
            </div>

            {/* Chennai */}
            <div className="relative bg-gradient-to-b from-teal-100 to-teal-200 rounded-[10px] h-[120px] cursor-pointer hover:scale-105 transition-transform duration-300 overflow-hidden">
              <h3 className="text-[0.775rem] font-semibold text-black mb-2 px-2 pt-3 text-center">Chennai</h3>
              <div>
              <Image src="/images/india_gate.png" alt="Bengaluru" width={100} height={100} />
             </div>
            </div>

            {/* Hyderabad */}
            <div className="relative bg-gradient-to-b from-orange-100 to-orange-200 rounded-[10px] h-[120px] cursor-pointer hover:scale-105 transition-transform duration-300 overflow-hidden">
              <h3 className="text-[0.775rem] font-semibold text-black mb-2 px-2 pt-3 text-center">Hyderabad</h3>
              <div>
              <Image src="/images/india_gate.png" alt="Bengaluru" width={100} height={100} />
             </div>
            </div>
       
         

            {/* Mumbai */}
            <div className="relative bg-gradient-to-b from-blue-200 to-blue-300 rounded-[10px] h-[120px] cursor-pointer hover:scale-105 transition-transform duration-300 overflow-hidden">
              <h3 className="text-[0.775rem] font-semibold text-black mb-2 px-2 pt-3 text-center">Mumbai</h3>
              <div>
              <Image src="/images/india_gate.png" alt="Bengaluru" width={100} height={100} />
             </div>
            </div>

            {/* Gurgaon */}
            <div className="relative bg-gradient-to-b from-blue-300 to-blue-400 rounded-[10px]  h-[120px] cursor-pointer hover:scale-105 transition-transform duration-300 overflow-hidden">
              <h3 className="text-[0.775rem] font-semibold text-black mb-2 px-2 pt-3 text-center">Gurgaon</h3>
              <div>
              <Image src="/images/india_gate.png" alt="Bengaluru" width={100} height={100} />
             </div>
            
              </div>

            {/* Delhi */}
            <div className="relative bg-gradient-to-b from-orange-200 to-orange-300 rounded-[10px]  h-[120px] cursor-pointer hover:scale-105 transition-transform duration-300 overflow-hidden">
              <h3 className="text-[0.775rem] font-semibold text-black mb-2 px-2 pt-3 text-center">Delhi</h3>
              <div>
              <Image src="/images/india_gate.png" alt="Bengaluru" width={100} height={100} />
             </div>
          
              </div>
            
            {/* Kolkata */}
            <div className="relative bg-gradient-to-b from-teal-200 to-teal-300 rounded-[10px]  h-[120px] cursor-pointer hover:scale-105 transition-transform duration-300 overflow-hidden">
              <h3 className="text-[0.775rem] font-semibold text-black mb-2 px-2 pt-3 text-center">Kolkata</h3>
              <div>
              <Image src="/images/india_gate.png" alt="Bengaluru" width={100} height={100} />
             </div>
          
              </div>

            

            {/* Pune */}
            <div className="relative bg-gradient-to-b from-blue-400 to-blue-500 rounded-[10px]  h-[120px] cursor-pointer hover:scale-105 transition-transform duration-300 overflow-hidden">
              <h3 className="text-[0.775rem] font-semibold text-black mb-2 px-2 pt-3 text-center">Pune</h3>
              <div>
              <Image src="/images/india_gate.png" alt="Bengaluru" width={100} height={100} />
             </div>
                
              
            </div>
          </div>
        </div>
      </div>

      {/* footer  */}
       <div className="footer-section mt-8 bg-white pt-12 px-4">
         <div className="max-w-4xl mx-auto">
           {/* Main heading */}
           <div className="mb-6">
             <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
               Home of creator
             </h2>
             <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
               collaborations.
             </h2>
           </div>
           
           {/* Subtitle with target icon */}
           <div className="">
             <p className="text-lg md:text-xl text-gray-600 font-medium flex items-center gap-2">
               One place. Every Creator Need
               {/* <div className="relative inline-block">
                 <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                   <div className="w-3 h-3 bg-white rounded-full"></div>
                 </div>
                 <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
               </div> */}
             </p>
           </div>
           
           {/* Instagram follow button */}
           <div className="flex pb-4">
             <button className="bg-gray-100 hover:bg-gray-200 transition-colors duration-300 rounded-full px-6 py-3 flex items-center gap-3">
               <span className="text-black font-medium">Follow @dumzoo</span>
             
             </button>
           </div>
         </div>
       </div>
    </div>
    <style jsx>{`
    
      .hero-bg-image {
        background: #000 url('/images/hero.png') no-repeat center bottom;
        background-size: 100% 100px;
        background-position: bottom;
        background-repeat: no-repeat;
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 100px;
        z-index: 1;
        opacity: 0.1;
      }
        .footer-section {
          background: #e9c9c936 url('/images/footer.png') no-repeat center bottom;
          background-size: 100%;
          background-position: center bottom;
          background-repeat: no-repeat;
        padding-bottom: 150px;

        }
    `}</style>
    </>
  );
}
