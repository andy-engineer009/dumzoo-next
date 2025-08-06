'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import AwarePopup from './aware-popup';

interface InfluencerDetailProps {
  id: string;
  name: string;
  username: string;
  image: string;
  isVerified: boolean;
  location: string;
  category: string;
  followers: number;
  overview: string;
  instagramUrl?: string;
  youtubeUrl?: string;
  facebookUrl?: string;
  gender: string;
  age: number;
  languages: string[];
  audienceType: string;
  audienceAgeGroup: string;
  posts: Array<{
    id: string;
    type: 'image' | 'video';
    url: string;
    thumbnail?: string;
  }>;
  offers: any;
  startingPrice: any;
}

const InfluencerDetail = ({
  id,
  name,
  username,
  image,
  isVerified,
  location,
  category,
  followers,
  overview,
  posts,
  offers,
  instagramUrl,
  youtubeUrl,
  facebookUrl,
  gender,
  age,
  languages,
  audienceType,
  audienceAgeGroup,
  startingPrice

}: InfluencerDetailProps) => {
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const [activeTab, setActiveTab] = useState<'posts' | 'pricing' | 'about'>('about');
  const [isFollowing, setIsFollowing] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const router = useRouter();

  //aware popup
  const [isAwareOpen, setIsAwareOpen] = useState(false);

  const formatFollowers = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const formatCurrency = (amount: number): string => {
    return `₹${amount.toLocaleString()}`;
  };

  const handleChat = () => {
    setIsAwareOpen(true);
  };

  const handleChatRedirection = () => {
    setIsAwareOpen(false);
    router.push('/chat/1');
    console.log('Opening chat with:', name);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Header with Back Button */}
        {/* <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-4 py-3">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => router.back()} 
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-lg font-semibold text-gray-900">Influencer Profile</h1>
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
             <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg> *
            </button>
          </div>
        </header> */}

        {/* Main Content */}
        <main className="pb-24">
          {/* Image Gallery Section */}
          <section className="bg-white">
            <div className="relative">
              {/* Main Profile Image */}
              <div className="relative h-[250px] bg-gradient-to-br from-purple-100 to-blue-100">
                <img
                  src="/images/offer-1.jpg"
                  alt={name}
                  className="w-full h-full object-cover"
                />
                {/* Overlay with gradient */}
                {/* <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div> */}
                
                {/* Featured Badge */}
                <div className="absolute top-4 right-4">
                  <div className="flex items-center gap-2 bg-purple-500 px-3 py-1.5 rounded-full">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                    </svg>
                    <span className="text-white font-medium text-sm">Featured</span>
                  </div>
                </div>

                {/* Back Button Overlay */}
                <button 
                  onClick={() => router.back()} 
                  className="absolute top-4 left-4 p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              </div>


            </div>

                          {/* Profile Info Overlay */}
                          <div className=" left-0 right-0 px-6 pt-6 bg-[#fff]"        style={{
                marginTop: '-46px',
                position: 'relative',
                borderRadius: '28px 28px 0 0',
                zIndex: 8,
              }}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h1 className="text-2xl font-bold text-black">{name}</h1>
                      {isVerified && (
                        <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                          <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd"/>
                        </svg>
                      )}
                    </div>
                    <p className="text-black/80 text-sm">@{username}</p>
                  </div>
                  
                  {/* Social Icons */}
                  <div className="flex gap-2">
                    {youtubeUrl && (
                      <a href={youtubeUrl} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors">
                        <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        </svg>
                      </a>
                    )}
                    {instagramUrl && (
                      <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors">
                        <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                        </svg>
                      </a>
                    )}
                    {facebookUrl && (
                      <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors">
                        <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              </div>

            {/* Quick Stats Bar */}
            <div
              className="px-6 py-4 bg-white border-b border-gray-100"
       
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{formatFollowers(followers)}</p>
                    <p className="text-xs text-black-500 font-[600]">Followers</p>
                  </div>
                  {/* <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{posts.length}</p>
                    <p className="text-xs text-black-500">Posts</p>
                  </div> */}
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(startingPrice)}</p>
                    <p className="text-xs text-black-500 font-[600]">Starting Price</p>
                  </div>
                </div>
                
                {/* <button 
                  onClick={() => setIsFollowing(!isFollowing)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    isFollowing 
                      ? 'bg-gray-100 text-gray-700' 
                      : 'bg-purple-600 text-white hover:bg-purple-700'
                  }`}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </button> */}
              </div>
            </div>
          </section>

          {/* Location & Category */}
          <section className="bg-white px-6 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-600">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <span className="text-sm">{location}</span>
              </div>
              <div className="flex gap-2">
                {category.split(",").slice(0, 2).map((cat, index) => (
                  <span key={index} className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-medium">
                    {cat.trim()}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* Tab Navigation */}
          <section className="sticky top-0 z-20 bg-white border-b border-gray-100">
            <div className="flex">
              {[
                { id: 'about', label: 'About', icon: 'user' },
                { id: 'pricing', label: 'Packages', icon: 'tag' },
                { id: 'posts', label: 'Posts', icon: 'grid' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 py-4 font-medium text-sm relative flex items-center justify-center gap-2 ${
                    activeTab === tab.id 
                      ? 'text-purple-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-purple-600' 
                      : 'text-black-500 hover:text-gray-700'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {tab.icon === 'grid' && (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    )}
                    {tab.icon === 'tag' && (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7a2 2 0 010-2.828l7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    )}
                    {tab.icon === 'user' && (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    )}
                  </svg>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Tab Content */}
          <section className="bg-white">
            {activeTab === 'posts' && (
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Posts</h2>
                <div className="grid grid-cols-3 gap-2">
                  {posts.map((post) => (
                    <div
                      key={post.id}
                      className="aspect-square relative group cursor-pointer rounded-lg overflow-hidden"
                      onClick={() => setSelectedPost(selectedPost === post.id ? null : post.id)}
                    >
                      <Image
                        src={post.thumbnail || post.url}
                        alt={`Post by ${name}`}
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
            )}

            {activeTab === 'pricing' && (
              <div className="p-4">
                {/* <h2 className="text-lg font-semibold text-gray-900 mb-4">Collaboration Packages</h2> */}
                
                <div className="space-y-4">
                  {offers.map((offer: any, index: any) => (
                    <div key={offer.id} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                      {/* Package Header */}
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {offer.type === 'combo' ? 'Combo Package' : 'Single Package'}
                          </h3>
                          <p className="text-sm text-black-500 mt-1">
                            {offer.items.length} items included
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900">
                            {formatCurrency(offer.price)}
                          </div>
                          <div className="text-sm text-black-500">per package</div>
                        </div>
                      </div>

                      {/* Package Items */}
                      <div className="space-y-2">
                        {offer.items.map((item: any, itemIndex: any) => (
                          <div key={itemIndex} className="flex items-center justify-between py-2 px-3 bg-white rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-gray-700">
                                {item.quantity}x {item.contentType}
                              </span>
                            </div>
                            <span className="text-sm text-black-500">
                              {itemIndex < offer.items.length - 1 && '+'}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Package Features */}
                      {/* <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Delivery Time</span>
                          <span className="font-medium text-gray-900">3-5 days</span>
                        </div>
                        <div className="flex items-center justify-between text-sm mt-2">
                          <span className="text-gray-600">Revisions</span>
                          <span className="font-medium text-gray-900">2 included</span>
                        </div>
                      </div> */}
                    </div>
                  ))}
                </div>

                {offers.length === 0 && (
                  <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <p className="text-black-500">No packages available at the moment</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'about' && (
              <div className="p-4">
                {/* <h2 className="text-lg font-semibold text-gray-900 mb-4">About {name}</h2> */}
                
                {/* Overview */}
                {/* <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <h3 className="font-medium text-gray-900 mb-2">Overview</h3>
                  <p className="text-gray-700 leading-relaxed">{overview}</p>
                </div> */}

                {/* Additional Info Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {gender && (
                    <div className="bg-blue-50 rounded-xl p-4">
                      <p className="text-sm text-black-500 mb-1">Gender</p>
                      <p className="font-medium text-blue-700">{gender}</p>
                    </div>
                  )}
                  {age && (
                    <div className="bg-green-50 rounded-xl p-4">
                      <p className="text-sm text-black-500 mb-1">Age</p>
                      <p className="font-medium text-green-700">{age} years</p>
                    </div>
                  )}
                </div>

                {/* Languages */}
                {languages && languages.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-medium text-gray-900 mb-3">Languages</h3>
                    <div className="flex flex-wrap gap-2">
                      {languages.map((lang, index) => (
                        <span key={index} className="px-3 py-2 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Audience Info */}
                {(audienceType || audienceAgeGroup) && (
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900">Audience</h3>
                    {audienceType && (
                      <div className="bg-orange-50 rounded-xl p-4">
                        <p className="text-sm text-black-500 mb-1">Audience Type</p>
                        <p className="font-medium text-orange-700">{audienceType}</p>
                      </div>
                    )}
                    {audienceAgeGroup && (
                      <div className="bg-purple-50 rounded-xl p-4">
                        <p className="text-sm text-black-500 mb-1">Age Group</p>
                        <p className="font-medium text-purple-700">{audienceAgeGroup}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </section>
        </main>

        {/* Bottom Action Bar */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-4 px-6 z-30">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs text-black-500">Starting Price</span>
              <span className="text-xl font-bold text-gray-900">{formatCurrency(startingPrice)}</span>
            </div>
            
            <button 
              onClick={handleChat}
              className="px-4 ml-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors"
            >
              Chat Now
            </button>
          </div>
        </nav>
      </div>

      <AwarePopup
        isOpen={isAwareOpen}
        onClose={() => setIsAwareOpen(false)}
        onProceed={() => handleChatRedirection()}
        influencerName={name}
      />
    </>
  );
};

export default InfluencerDetail;