'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import AwarePopup from '../aware-popup';
import Link from 'next/link';

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
      <div className="min-h-screen bg-white">
        {/* Main Content */}
        <main className="pb-24">
          {/* Header with Back Button */}
              {/* Header */}
              <div className="w-full px-2 py-3 border-b border-gray-200 sticky top-0 z-[100] bg-white">
          <div className="relative">
            <Link
              href="/discover"
              className="mr-2 p-2 hover:bg-gray-100 rounded-full transition-colors absolute left-0 top-1/2 -translate-y-1/2"
            >
               <svg className="w-6 h-6 text-gray-600 hover:text-gray-900 " fill="none" stroke="#ccc" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            </Link>
            <h1 className="text-lg font-medium text-gray-900 text-center">Edit Basic Details</h1>
          </div>
        </div>

          {/* Top Banner Image */}
          <section className="relative">
            <div className="relative h-[200px] bg-gradient-to-br from-blue-100 to-purple-100">
              <img
              // image ||
                src={"/images/offer-1.jpg"}
                alt={name}
                className="w-full h-full object-cover"
              />
              {/* Carousel Dots */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
          </section>

          {/* Service Information */}
          <section className="px-4 py-6">
            {/* Main Title */}
            <h1 className="text-2xl font-bold text-black mb-3">
              {name} {isVerified && (
                <svg className="inline w-5 h-5 text-blue-400 ml-2" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd"/>
                </svg>
              )}
            </h1>

            {/* Posted Date and Views */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-500">@{username}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">{formatFollowers(followers)} Followers</span>
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>

            {/* Price */}
            <div className="mb-6">
              <span className="inline-block bg-gray-200 text-black font-semibold px-4 py-2 rounded-lg">
                {formatCurrency(startingPrice)}
              </span>
            </div>

            {/* Service Details Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm font-semibold text-black mb-1">Location</p>
                <p className="text-sm text-black">{location}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-black mb-1">Age</p>
                <p className="text-sm text-black">{age} years</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-black mb-1">Gender</p>
                <p className="text-sm text-black">{gender}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-black mb-1">Languages</p>
                <p className="text-sm text-black">{languages.join(', ')}</p>
              </div>
            </div>

            {/* Description */}
            {overview && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-black mb-2">Overview</h3>
                <p className="text-sm text-black leading-relaxed">
                  {overview}
                </p>
              </div>
            )}

            {/* Categories */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-black mb-3">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {category.split(",").map((cat, index) => (
                  <span key={index} className="px-3 py-2 bg-gray-200 text-black text-sm rounded-lg">
                    {cat.trim()}
                  </span>
                ))}
              </div>
            </div>

            {/* Audience Info */}
            {(audienceType || audienceAgeGroup) && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-black mb-3">Audience</h3>
                <div className="grid grid-cols-2 gap-4">
                  {audienceType && (
                    <div>
                      <p className="text-sm font-semibold text-black mb-1">Audience Type</p>
                      <p className="text-sm text-black">{audienceType}</p>
                    </div>
                  )}
                  {audienceAgeGroup && (
                    <div>
                      <p className="text-sm font-semibold text-black mb-1">Age Group</p>
                      <p className="text-sm text-black">{audienceAgeGroup}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Posts Section */}
            {posts && posts.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-black mb-3">Recent Posts</h3>
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

            {/* Offers Section */}
            {offers && offers.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-black mb-3">Collaboration Packages</h3>
                <div className="space-y-3">
                  {offers.map((offer: any, index: any) => (
                    <div key={offer.id} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-black text-sm">
                            {offer.type === 'combo' ? 'Combo Package' : 'Single Package'}
                          </h4>
                          <p className="text-xs text-gray-600">
                            {offer.items.length} items included
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-black">
                            {formatCurrency(offer.price)}
                          </div>
                        </div>
                      </div>
                      <div className="space-y-1">
                        {offer.items.map((item: any, itemIndex: any) => (
                          <div key={itemIndex} className="flex items-center gap-2 text-xs text-black">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                            <span>{item.quantity}x {item.contentType}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

       
          </section>
        </main>

        {/* Bottom Action Bar */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-4 px-6 z-30">
          <button 
            onClick={handleChat}
            className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
          >
            Hire Now
          </button>
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