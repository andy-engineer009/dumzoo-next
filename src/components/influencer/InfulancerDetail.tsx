'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import AwarePopup from '../aware-popup';
import { selectIsLoggedIn } from '@/store/userRoleSlice';

import InfluencerDetailSkeleton from "@/components/influencer/influencerDetailSkeleton";
import { API_ROUTES } from '@/appApi';
import { api } from '@/common/services/rest-api/rest-api';
import { useSelector } from 'react-redux';

const InfluencerDetail = ({
  data,
  onClose
}: any) => {
  const router = useRouter();
  const [isAwareOpen, setIsAwareOpen] = useState(false);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  // Show loading state if data is not yet loaded
  if (!data) {
    return (
<InfluencerDetailSkeleton />
    );
  }

  const formatFollowers = (count: number): string => {
    if (!count || count === 0) return '0';
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const formatCurrency = (amount: number | undefined | null): string => {
    if (!amount || amount === 0) return '₹0';
    return `₹${amount.toLocaleString()}`;
  };

  const handleChat = () => {
    setIsAwareOpen(true);
  };

  const handleChatRedirection = () => {
    if(!isLoggedIn){
      setShowLoginPopup(true);
      return;
    }
    const activeUserId = JSON.parse(localStorage.getItem('activeUser') || '{}').id;
    api.post(API_ROUTES.createNewConversation, {
      user1Id: activeUserId,
      user2Id: data?.user_id
    }).then((res) => {
      if(res.status == 1){
        router.push(`/chat/${res.data.id}`);
      }
    });
    // setIsAwareOpen(false);
    // router.push('/chat/1');
    // console.log('Opening chat with:', name);
  };

  const getgender = (gender: any) => {
    if (gender == 1) {
      return 'Male';
    } else if (gender == 2) {
      return 'Female';
    } else if (gender == 3) {
      return 'Other';
    }
  }

  const getaudienceType = (audienceType: any) => {
    if (audienceType == 0) {
      return 'all';
    } else if (audienceType == 1) {
      return 'General';
    } else if (audienceType == 2) {
      return 'Niche';
    } else if (audienceType == 3) {
      return 'Specific';
    }
  }

  const getaudienceAgeGroup = (audienceAgeGroup: any) => {
    if (audienceAgeGroup == 0) {
      return 'all';
    } else if (audienceAgeGroup == 1) {
      return '13-18';
    } else if (audienceAgeGroup == 2) {
      return '19-25';
    } else if (audienceAgeGroup == 3) {
      return '26-35';
    } else if (audienceAgeGroup == 4) {
      return '36-45';
    } else if (audienceAgeGroup == 5) {
      return '46-55';
    } else if (audienceAgeGroup == 6) {
      return '56+';
    }
  }

  const loginPopup = () => {
    return (
      <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden border border-gray-100"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={() => {setShowLoginPopup(false)}}
            className="absolute top-3 right-3 z-10 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Content */}
          <div className="p-6 text-center">
            {/* Icon */}
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
              className="w-16 h-16 bg-[#C4E729] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
            >
              <svg className="w-8 h-8 text-[#000]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </motion.div>

            {/* Title */}
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl font-bold text-gray-900 mb-2"
            >
              Login Required
            </motion.h2>

            {/* Description */}
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-sm text-gray-600 mb-6"
            >
              Please login to continue
            </motion.p>

            {/* Login Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <button
                onClick={() => {
                  setShowLoginPopup(false);
                  router.push('/login');
                }}
                className="w-full bg-[#592C93] text-[#fff] py-3 px-6 rounded-2xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                <span>Login Now</span>
              </button>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
    )
  }

  return (
    <>
    {!isLoggedIn && showLoginPopup && loginPopup()}
      <div className="min-h-screen bg-white">
        {/* Main Content */}
        {data && (
        <main className="pb-24">
          {/* Top Banner Image */}
          <section className="relative">
            <div className="relative h-[200px] bg-gradient-to-br from-blue-100 to-purple-100">
              {/* Back Icon */}
              <button 
                onClick={onClose || (() => router.back())} 
                className="absolute top-4 left-4 z-10 p-2 bg-white/80 rounded-full shadow hover:bg-white transition-colors"
                aria-label="Go back"
                type="button"
              >
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              {/* Influencer Images */}
              {data?.influencer_media_detail?.length > 0 ? (
                data.influencer_media_detail.map((image: any, index: any) => (
                  <Image
                    key={index}
                    src={image?.image_url}
                    alt={data?.username || 'Influencer'}
                    width={400}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                ))
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
            </div>
          </section>

          {/* Influencer Information */}
          <section className="px-4 py-6" style={{ overflow: 'scroll', height: 'calc(100vh - 280px)' }}>
            {/* Main Title */}
            <div className="flex items-center gap-3 mb-3">
              <h1 className="text-2xl font-bold text-black">
                {data?.username}
              </h1>
              {data?.verified_profile == 1 && (
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>

            {/* Username */}
            <p className="text-sm text-gray-600 mb-4">@{data?.username}</p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-600">Followers</p>
                <p className="text-xl font-bold text-black">{formatFollowers(data?.follower_count || 0)}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-600">Starting Price</p>
                <p className="text-xl font-bold text-black">{formatCurrency(data?.starting_price)}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-600">Gender</p>
                <p className="text-lg font-semibold text-black">{getgender(data?.gender)}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-600">Age</p>
                <p className="text-lg font-semibold text-black">{data?.age || 'Not specified'}</p>
              </div>
            </div>

            {/* Location */}
            <div className="mb-6">
              <h3 className="text-sm font-bold text-black mb-2">Location</h3>
              <p className="text-sm text-black">
                {data?.influencer_city?.name && data?.influencer_state?.name 
                  ? `${data.influencer_city.name}, ${data.influencer_state.name}`
                  : 'Location not specified'
                }
              </p>
            </div>

            {/* Platform Links */}
            <div className="mb-6">
              <h3 className="text-sm font-bold text-black mb-3">Social Platforms</h3>
              <div className="flex gap-4">
                {data?.is_instagram_enabled == 1 && data?.instagram_url && (
                  <a 
                    href={data.instagram_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-pink-100 text-pink-800 rounded-lg hover:bg-pink-200 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                    Instagram
                  </a>
                )}
                {data?.is_youtube_enabled == 1 && data?.youtube_url && (
                  <a 
                    href={data.youtube_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M21.8 8.001a2.75 2.75 0 0 0-1.94-1.94C18.1 6 12 6 12 6s-6.1 0-7.86.06a2.75 2.75 0 0 0-1.94 1.94A28.6 28.6 0 0 0 2 12a28.6 28.6 0 0 0 .2 3.999 2.75 2.75 0 0 0 1.94 1.94C5.9 18 12 18 12 18s6.1 0 7.86-.06a2.75 2.75 0 0 0 1.94-1.94A28.6 28.6 0 0 0 22 12a28.6 28.6 0 0 0-.2-3.999zM10 15.5v-7l6 3.5-6 3.5z"/>
                    </svg>
                    YouTube
                  </a>
                )}
                {data?.is_facebook_enabled == 1 && data?.facebook_url && (
                  <a 
                    href={data.facebook_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22 12c0-5.522-4.477-10-10-10S2 6.478 2 12c0 5 3.657 9.127 8.438 9.877v-6.987h-2.54v-2.89h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.242 0-1.63.771-1.63 1.562v1.875h2.773l-.443 2.89h-2.33v6.987C18.343 21.127 22 17 22 12"/>
                    </svg>
                    Facebook
                  </a>
                )}
              </div>
            </div>

            {/* Categories */}
            {data?.influencer_categories?.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-bold text-black mb-3">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {data.influencer_categories.map((category: any, index: any) => (
                    <span key={index} className="px-3 py-2 bg-gray-200 text-black text-sm rounded-lg">
                      {category?.category?.name || 'Unknown'}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Languages */}
            {data?.influencer_languages?.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-bold text-black mb-3">Languages</h3>
                <div className="flex flex-wrap gap-2">
                  {data.influencer_languages.map((languageItem: any, index: any) => (
                    <span key={index} className="px-3 py-2 bg-blue-100 text-blue-800 text-sm rounded-lg">
                      {languageItem?.language?.name || 'Unknown'}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Description/Overview */}
            {data?.overview && (
              <div className="mb-6">
                <h3 className="text-sm font-bold text-black mb-2">Overview</h3>
                <p className="text-sm text-black leading-relaxed">
                  {data?.overview}
                </p>
              </div>
            )}

            {/* Audience Info */}
            {(data?.audience_type != null || data?.audience_age_group) && (
              <div className="mb-6">
                <h3 className="text-sm font-bold text-black mb-3">Audience</h3>
                <div className="grid grid-cols-2 gap-4">
                  {data?.audience_type != null && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm font-medium text-gray-600">Audience Type</p>
                      <p className="text-lg font-semibold text-black">{getaudienceType(data?.audience_type)}</p>
                    </div>
                  )}
                  {data?.audience_age_group && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm font-medium text-gray-600">Age Group</p>
                      <p className="text-lg font-semibold text-black">{getaudienceAgeGroup(data?.audience_age_group)}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Posts Section */}
            {/* {data?.posts && data?.posts.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-black mb-3">Recent Posts</h3>
                <div className="grid grid-cols-3 gap-2">
                  {data?.posts.map((post: any) => (
                    <div
                      key={post.id}
                      className="aspect-square relative group cursor-pointer rounded-lg overflow-hidden"
                      onClick={() => setSelectedPost(selectedPost === post.id ? null : post.id)}
                    >
                      <Image
                        src={post.thumbnail || post.url}
                        alt={`Post by ${data?.name}`}
                        width={300}
                        height={300}
                        className="w-full h-full object-cover"
                      />
                      {post.type === 'video' && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )} */}

            {/* Offers Section */}
            {data?.influencer_offer_detail && data?.influencer_offer_detail.length > 0 && (
              <div className="">
                <h3 className="text-sm font-semibold text-black mb-3">Collaboration Packages</h3>
                <div className="space-y-3">
                  {data.influencer_offer_detail.map((offer: any, index: any) => {
                    let items = [];
                    try {
                      if (offer.items) {
                        items = JSON.parse(offer.items);
                      }
                    } catch (error) {
                      console.error('Error parsing offer items:', error);
                      items = [];
                    }
                    
                    return (
                      <div key={offer?.id || index} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                        <div className="flex justify-between items-start mb-2">
                        <div>
                            <h4 className="font-semibold text-black text-sm">
                              {offer?.offer_name || '--'}
                            </h4>
                            <p className="text-xs text-gray-600">
                              {Array.isArray(items) ? items.length : 0} items included
                          </p>
                        </div>
                        <div className="text-right">
                            <div className="font-bold text-black">
                              {formatCurrency(offer?.offer_price)}
                          </div>
                        </div>
                      </div>
                        <div className="space-y-1">
                          {Array.isArray(items) && items.map((item: any, itemIndex: any) => (
                            <div key={itemIndex} className="flex items-center gap-2 text-xs text-black">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                              <span>{item?.quantity || 0}x {item?.name || 'Unknown'}</span>
                          </div>
                        ))}
                      </div>
                        </div>
                    );
                  })}
                    </div>
                  </div>
                )}

    
          </section>
        </main>
        )}

        {/* Bottom Action Bar */}
        <nav className="hire-now fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-4 px-6 z-30">
            <button 
              // onClick={handleChat}
              onClick={handleChatRedirection}
            className="w-full bg-[#000] text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
            >
            Send Message
            </button>
        </nav>
      </div>

      <AwarePopup
        isOpen={isAwareOpen}
        onClose={() => setIsAwareOpen(false)}
        onProceed={() => handleChatRedirection()}
        influencerName={data?.name || 'Influencer'}
      />
    </>
  );


};

export default InfluencerDetail;