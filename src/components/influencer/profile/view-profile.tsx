'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { selectIsLoggedIn, selectIsInfluencerRegistered } from '@/store/userRoleSlice';
import { api } from '@/common/services/rest-api/rest-api';
import { API_ROUTES } from '@/appApi';
import InfluencerCard from '../InfulancerCard';
import InfluencerDetail from '../InfulancerDetail';
import Loader from '../../loader';
import { useToast } from '@/components/toast';
import CreateProfilePopup from '@/components/influencer/create-profile-popup';
import InfluencerSkeleton from '@/components/discover/InfluencerSkeleton';

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
    
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState<any | null>();
  const [isLoadingData, setIsLoadingData] = useState(false);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const isInfluencerRegistered = useSelector(selectIsInfluencerRegistered);
  const {showError} = useToast();
  const [isProfileCreatePopupOpen, setIsProfileCreatePopupOpen] = useState(false);

  useEffect(() => {
    console.log(isInfluencerRegistered)
    if(isInfluencerRegistered) {
      api.post(API_ROUTES.influencerProfilePreview).then((res)=>{
        if(res.status == 1) {
          setProfileData(res.data);
        }else {
          showError(res.message)
        }
      });
    }else {

      setIsProfileCreatePopupOpen(true)
    }
    // const fetchProfileData = async () => {
    //   const response = await api.get(API_ROUTES.influencerProfilePreview);
    //   setProfileData(response.data);
    // };
    // fetchProfileData();
  }, []);

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
      <>
            <InfluencerSkeleton></InfluencerSkeleton>
      <CreateProfilePopup 
      showProfilePopup={isProfileCreatePopupOpen} 
      onClose={() => setIsProfileCreatePopupOpen(false)}
    />
      </>

    );
  }

  return (
    <>
      {isLoading && <Loader />}
      <div className="min-h-screen bg-white text-gray-900 profile-view-wrapper">
        {/* Header - Same as Basic-details.tsx */}
        <header className="sticky top-0 z-20 bg-white border-b border-gray-200 pr-4 py-3">
        <div className="flex items-center justify-center relative">
          <Link 
            href="/profile"
            className="p-2 rounded-full hover:bg-gray-100 absolute left-0 top-1/2 -translate-y-1/2"
          >
            <svg className="w-5 h-5" fill="none" stroke="#ccc" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-lg font-medium text-gray-900"> View Profile</h1>
        </div>
      </header>

        {/* Main Content */}
        <div className="px-4 py-6">
          {/* Profile Overview Section */}
          <div className="mb-8">
            <div className="bg-gray-50 rounded-xl p-0">
              <InfluencerCard
                 data={profileData}
              />
            </div>
          </div>

          {/* Profile Details Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Details</h2>
            <div className="bg-gray-50 rounded-xl p-0">
              <InfluencerDetail
                data={profileData}
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

      {/* <CreateProfilePopup 
          showProfilePopup={isProfileCreatePopupOpen} 
          onClose={() => setIsProfileCreatePopupOpen(false)}
        /> */}
    </>
  );
}
