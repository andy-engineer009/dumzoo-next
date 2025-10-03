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
              {/* Back Icon - absolute left */}
            <button 
              onClick={onClose || (() => router.back())} 
                className="back-icon-d absolute top-4 left-4 z-10 p-2 bg-white/80 rounded-full shadow hover:bg-white transition-colors"
                aria-label="Go back"
                type="button"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
              {data?.influencer_media_detail?.length > 0 ? (
                data.influencer_media_detail.map((image: any, index: any) => (
                  <Image
                    key={index}
                    src={image?.image_url}
                    alt={data?.username || 'Influencer'}
                    width={400}
                    height={400}
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

          {/* Service Information */}
          <section className="px-4 py-6">
            {/* Main Title */}
            <h1 className="text-2xl font-bold text-black mb-3">
              {data?.username}
               {data?.verified_profile == 1 && (
                <svg className="inline w-5 h-5 text-blue-400 ml-2" fill="currentColor" viewBox="0 0 24 24">
                          <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd"/>
                        </svg>
                      )}
            </h1>

            {/* Posted Date and Views */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-500">@{data?.username || 'username'}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">{formatFollowers(data?.follower_count)} Followers</span>
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                    </div>
                  </div>
                  
            {/* Price */}
            <div className="mb-6 flex items-center justify-between">
              <div className=''>
              <span className="inline-block bg-gray-200 text-black font-semibold px-4 py-2 rounded-lg">
              {formatCurrency(data?.starting_price)}
              </span>
              </div>
     
              <div className="flex items-center gap-2">
                {/* YouTube Icon */}
                {data?.is_youtube_enabled == 1 && (
                  <a href={data?.youtube_url} target="_blank" rel="noopener noreferrer">
                    <svg className="w-6 h-6 text-black hover:text-red-600 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M21.8 8.001a2.75 2.75 0 0 0-1.94-1.94C18.1 6 12 6 12 6s-6.1 0-7.86.06a2.75 2.75 0 0 0-1.94 1.94A28.6 28.6 0 0 0 2 12a28.6 28.6 0 0 0 .2 3.999 2.75 2.75 0 0 0 1.94 1.94C5.9 18 12 18 12 18s6.1 0 7.86-.06a2.75 2.75 0 0 0 1.94-1.94A28.6 28.6 0 0 0 22 12a28.6 28.6 0 0 0-.2-3.999zM10 15.5v-7l6 3.5-6 3.5z"/>
                        </svg>
                      </a>
                    )}
                {/* Instagram Icon */}
                {data?.is_instagram_enabled == 1 && (
                  <a href={data?.instagram_url} target="_blank" rel="noopener noreferrer">
                    <svg className="w-6 h-6 text-black hover:text-pink-600 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5zm4.25 3.25a5.25 5.25 0 1 1 0 10.5 5.25 5.25 0 0 1 0-10.5zm0 1.5a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5zm5.25.75a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                        </svg>
                      </a>
                    )}
                {/* Facebook Icon */}
                {data?.is_facebook_enabled == 1 && (
                  <a href={data?.facebook_url} target="_blank" rel="noopener noreferrer">
                    <svg className="w-6 h-6 text-black hover:text-blue-600 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22 12c0-5.522-4.477-10-10-10S2 6.478 2 12c0 5 3.657 9.127 8.438 9.877v-6.987h-2.54v-2.89h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.242 0-1.63.771-1.63 1.562v1.875h2.773l-.443 2.89h-2.33v6.987C18.343 21.127 22 17 22 12"/>
                        </svg>
                      </a>
                    )}
                  </div>
                </div>

            {/* Service Details Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm font-semibold text-black mb-1">Location</p>
                <p className="text-sm text-black">{data?.influencer_city?.name} {data?.influencer_state?.short_name}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-black mb-1">Age</p>
                <p className="text-sm text-black">{data?.age} years</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-black mb-1">Gender</p>
                <p className="text-sm text-black">{getgender(data?.gender)}</p>
                  </div>
              <div>
                <p className="text-sm font-semibold text-black mb-1">Languages</p>
                {data?.influencer_languages && data?.influencer_languages.length > 0 ? (
                  <p className="text-sm text-black">
                    {data.influencer_languages.map((language: any) => language?.language?.name || 'Unknown').join(', ')}
                  </p>
                ) : (
                  <p className="text-sm text-black">--</p>
                )}
                  </div>
                </div>
                
            {/* Description */}
            {data?.overview && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-black mb-2">Overview</h3>
                <p className="text-sm text-black leading-relaxed">
                  {data?.overview}
                </p>
              </div>
            )}

            {/* Categories */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-black mb-3">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {data?.influencer_categories && data?.influencer_categories.length > 0 ? (
                  data.influencer_categories.map((category: any) => (
                    <span key={category?.id || Math.random()} className="px-3 py-2 bg-gray-200 text-black text-sm rounded-lg">
                      {category?.category?.name || 'Unknown'}
                  </span>
                  ))
                ) : (
                  <span className="px-3 py-2 bg-gray-200 text-black text-sm rounded-lg">--</span>
                )}
              </div>
            </div>

            {/* Audience Info */}
            {(data?.audience_type || data?.audience_age_group) && (
              <div className="mb-6">
                {/* <h3 className="text-sm font-semibold text-black mb-3">Audience</h3> */}
                <div className="grid grid-cols-2 gap-4">
                  {data?.audience_type != null && (
                    <div>
                      <p className="text-sm font-semibold text-black mb-1">Audience Type</p>
                      <p className="text-sm text-black">{getaudienceType(data?.audience_type)}</p>
                    </div>
                  )}
                  {data?.audience_age_group && (
                    <div>
                      <p className="text-sm font-semibold text-black mb-1">Age Group</p>
                      <p className="text-sm text-black">{getaudienceAgeGroup(data?.audience_age_group)}</p>
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