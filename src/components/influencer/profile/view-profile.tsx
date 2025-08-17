'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { selectIsLoggedIn } from '@/store/userRoleSlice';
import { api } from '@/common/services/rest-api/rest-api';
import { API_ROUTES } from '@/appApi';
import InfluencerCard from '../InfulancerCard';
import InfluencerDetail from '../InfulancerDetail';
import Loader from '../../loader';

// interface ProfileData {
//   id: any;
//   uuid: string;
//   user_id: number;
//   username: string;
//   image: string;
//   isVerified: boolean;
//   location: string;
//   category: string;
//   followers: number;
//   startingPrice: number;
//   instagramUrl?: string;
//   youtubeUrl?: string;
//   facebookUrl?: string;
//   isFeatured: boolean;
//   gender: string;
//   age: number;
//   languages: string[];
//   audienceType: string;
//   audienceAgeGroup: string;
//   overview: string;
//   posts: Array<{
//     id: string;
//     type: 'image' | 'video';
//     url: string;
//     thumbnail?: string;
//   }>;
//   offers: any[];
//   tags: string[];
// }

export default function ViewProfile() {
    const transformedData: any = {
    id: "1",
    name: "John Doe",
    username: "john_doe",
    image: "/images/offer-1.jpg",
    isVerified: true,
    location: "New York",
    category: "Fashion",
    followers: 1000,
    overview: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    posts: [],
    gender: "Male",
    age: 25,
    languages: ["English", "Spanish"],
    audienceType: "Male",
    audienceAgeGroup: "18-25",
    offers: [
      {
        id: "1",
        type: "single",
        name: "Single Post",
        price: 100,
        items: [{ contentType: "Post", quantity: 1 }]
      },
      {
        id: "2",
        type: "combo",
        name: "Combo Package",
        price: 200,
        items: [{ contentType: "Post", quantity: 1 }, { contentType: "Reel", quantity: 1 }]
      }
    ],
    instagramUrl: "https://www.instagram.com/john_doe",
    youtubeUrl: "https://www.youtube.com/john_doe",
    facebookUrl: "https://www.facebook.com/john_doe",
    startingPrice: 100
};
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState<any | null>(transformedData);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  
//   setProfileData(transformedData);
  // Fetch profile data
//   useEffect(() => {
//             // Transform API data to match our component interfaces
//             // Set a demo (dummy) data for profile
    

//     const fetchProfileData = async () => {
//       try {
//         setIsLoading(true);
//         const response = await api.get(API_ROUTES.getBasicDetails);
        
//         if (response.status === 1) {
//           const data = response.data;
          
//           // Transform API data to match our component interfaces
//         //   const transformedData: ProfileData = {
//         //     id: data.id || 1,
//         //     uuid: data.uuid || 'default-uuid',
//         //     user_id: data.user_id || 1,
//         //     username: data.username || 'Unknown',
//         //     image: data.profile_image || '/images/women.png',
//         //     isVerified: data.verified_profile === 1,
//         //     location: `${data.city_name || 'Unknown'}, ${data.state_name || 'Unknown'}`,
//         //     category: data.influencer_categories?.map((cat: any) => cat.category_name).join(', ') || 'General',
//         //     followers: data.follower_count || 0,
//         //     startingPrice: data.starting_price || 0,
//         //     instagramUrl: data.instagram_url || '',
//         //     youtubeUrl: data.youtube_url || '',
//         //     facebookUrl: data.facebook_url || '',
//         //     isFeatured: false, // You can set this based on your logic
//         //     gender: data.gender === '1' ? 'Male' : data.gender === '2' ? 'Female' : 'Other',
//         //     age: data.age || 25,
//         //     languages: data.influencer_languages?.map((lang: any) => lang.language_name) || ['English'],
//         //     audienceType: data.audience_type_name || 'General',
//         //     audienceAgeGroup: data.audience_age_group_name || '19-25',
//         //     overview: data.bio || 'No bio available',
//         //     posts: [], // You can fetch posts separately if needed
//         //     offers: data.offers || [],
//         //     tags: data.influencer_categories?.map((cat: any) => cat.category_name) || []
//         //   };
          
//         //   setProfileData(transformedData);
//         } else {
//           console.error('Failed to fetch profile data:', response.message);
//         }
//       } catch (error) {
//         console.error('Error fetching profile data:', error);
//       } finally {
//         setIsLoading(false);
//         setIsLoadingData(false);
//       }
//     };

//     if (isLoggedIn) {
//       fetchProfileData();
//     }
//   }, [isLoggedIn]);

  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No profile data found</p>
          <button 
            onClick={() => router.push('/profile/edit/basic')}
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Create Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {isLoading && <Loader />}
      <div className="min-h-screen bg-white text-gray-900 profile-view-wrapper">
        {/* Header - Same as Basic-details.tsx */}
        <div className="w-full px-2 py-3 border-b border-gray-200 sticky top-0 z-[100] bg-white">
          <div className="relative">
            <Link
              href="/profile"
              className="mr-2 p-2 hover:bg-gray-100 rounded-full transition-colors absolute left-0 top-1/2 -translate-y-1/2"
            >
              <svg className="w-6 h-6 text-gray-600 hover:text-gray-900" fill="none" stroke="#ccc" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-lg font-medium text-gray-900 text-center">View Profile</h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-4 py-6">
          {/* Profile Overview Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Overview</h2>
            <div className="bg-gray-50 rounded-xl p-0">
              <InfluencerCard
                id={profileData.id}
                uuid={profileData.uuid}
                user_id={profileData.user_id}
                name={profileData.username}
                username={profileData.username}
                image={profileData.image}
                isVerified={profileData.isVerified}
                location={profileData.location}
                category={profileData.category}
                followers={profileData.followers}
                startingPrice={profileData.startingPrice}
                instagramUrl={profileData.instagramUrl}
                youtubeUrl={profileData.youtubeUrl}
                facebookUrl={profileData.facebookUrl}
                isFeatured={profileData.isFeatured}
                tags={profileData.tags}
              />
            </div>
          </div>

          {/* Profile Details Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Details</h2>
            <div className="bg-gray-50 rounded-xl p-0">
              <InfluencerDetail
                id={profileData.uuid}
                name={profileData.username}
                username={profileData.username}
                image={profileData.image}
                isVerified={profileData.isVerified}
                location={profileData.location}
                category={profileData.category}
                followers={profileData.followers}
                overview={profileData.overview}
                instagramUrl={profileData.instagramUrl}
                youtubeUrl={profileData.youtubeUrl}
                facebookUrl={profileData.facebookUrl}
                gender={profileData.gender}
                age={profileData.age}
                languages={profileData.languages}
                audienceType={profileData.audienceType}
                audienceAgeGroup={profileData.audienceAgeGroup}
                posts={profileData.posts}
                offers={profileData.offers}
                startingPrice={profileData.startingPrice}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/profile/edit/basic')}
              className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              Edit Profile
            </button>
            <button
              onClick={() => router.push('/profile/edit/media')}
              className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Edit Media
            </button>
            <button
              onClick={() => router.push('/profile/edit/offers')}
              className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Edit Offers
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
