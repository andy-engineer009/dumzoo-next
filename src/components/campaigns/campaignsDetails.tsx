'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useToast } from '../toast';

import { API_ROUTES } from "@/appApi";
import { api } from "@/common/services/rest-api/rest-api";

import { selectIsInfluencerRegistered, selectIsLoggedIn } from '@/store/userRoleSlice';
import { useSelector, useDispatch } from 'react-redux';
import { updateCampaignAppliedStatus } from '@/store/apiDataSlice';
import CreateProfilePopup from '../influencer/create-profile-popup';
import LoginPopup from '../login-popup';

interface CampaignDetailsProps {
  onClose?: () => void;
  [key: string]: any;
}

const CampaignDetails = ({ onClose, ...data }: CampaignDetailsProps) => {
  const [loading, setLoading] = useState(false);
  const [applied, setApplied] = useState(false);
  const isInfluencerRegistered = useSelector(selectIsInfluencerRegistered);
  const [isProfileCreatePopupOpen, setIsProfileCreatePopupOpen] = useState(false);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const dispatch = useDispatch();
  
  // Debug useEffect to track state changes
  useEffect(() => {
    console.log('isProfileCreatePopupOpen state changed to:', isProfileCreatePopupOpen);
  }, [isProfileCreatePopupOpen]);

  const router = useRouter();
  const { showSuccess } = useToast();

  const formatCurrency = (amount: number): string => {
    if(amount === 0 && amount === null) {
      return 'Free';
    }
    return `₹${amount.toLocaleString()}`;
  };

  const formatFollowers = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const handleApply = () => {
    if(!isLoggedIn){
      setShowLoginPopup(true);
      return;
    }
    if(!isInfluencerRegistered){
      setIsProfileCreatePopupOpen(true);
      console.log('User not registered, showing profile popup');
      console.log('isProfileCreatePopupOpen state:', isProfileCreatePopupOpen);
      return;
    }

    
    // if(!isLoggedIn){
    //   setShowLoginPopup(true);
    //   return;
    // }
    
    setLoading(true);
    api.post(API_ROUTES.influencerCampaignApplied, {
      campaign_id: data.id
  }).then((res: any) => {
      setLoading(false);
      if(res.status == 1) {
        showSuccess('Applied successfully',2000)
        
        setApplied(true);
        
        // Update Redux store to reflect the applied status
        dispatch(updateCampaignAppliedStatus({
          campaignId: data.id,
          appliedStatus: 1
        }));
      } else {
          // showError(res.message, 2000);
      }
  })
    // setIsAwareOpen(true);
  };

  // const handleApplyRedirection = () => {
  //   setIsAwareOpen(false);
  //   // Redirect to application form or chat
  //   router.push(`/campaigns/${data.id}/apply`);
  //   console.log('Applying to campaign:', data.title);
  // };

  function formatDateFromNow(dateString: string): string {
    if (!dateString) return '--';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (years > 0) {
        return years === 1 ? '1 year ago' : `${years} years ago`;
    } else if (months > 0) {
        return months === 1 ? '1 month ago' : `${months} months ago`;
    } else if (days > 0) {
        return days === 1 ? '1 day ago' : `${days} days ago`;
    } else if (hours > 0) {
        return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
    } else if (minutes > 0) {
        return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`;
    } else {
        return 'just now';
    }
}
function getGender(value: number) {
  switch (value) {
      case 0: return 'All';
      case 1: return 'Male';
      case 2: return 'Female';
      case 3: return 'Other';
      default: return 'Other';
  }
}
  function getAgeGroup(value: number) {
    switch (value) {
      case 0: return 'All';
      case 1: return '13-18';
      case 2: return '19-25';
      case 3: return '26-35';
      case 4: return '36-45';
      case 5: return '46-55';
      case 6: return '56+';
      default: return '--';
    }
  }


  return (
    <>
      <div className="min-h-screen bg-white">
        {/* Main Content */}
        <main className="pb-24">
          {/* Top Banner Image */}
          <section className="relative">
            <div className="relative h-[200px] bg-gradient-to-br from-blue-100 to-purple-100">
              {/* Back Icon - absolute left */}
              <button
                onClick={() => onClose ? onClose() : router.back()}
                className="absolute top-4 left-4 z-10 p-2 bg-white/80 rounded-full shadow hover:bg-white transition-colors"
                aria-label="Go back"
                type="button"
              >
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              {/* Campaign Image */}
              <div className="w-full h-full flex items-center justify-center">
                {data.campaign_logo_url ? (
                  <Image
                    src={data.campaign_logo_url}
                    alt={data.compaign_name}
                    width={400}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500 text-lg">No Image</span>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Campaign Information */}
          <section className="px-4 py-6">
            {/* Main Title */}
            <h1 className="text-2xl font-bold text-black mb-3">
              {data?.compaign_name || '--'}
            </h1>

            {/* Posted Date and Brand */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-500">by dumzoo</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">{data?.createdAt ? formatDateFromNow(data.createdAt) : '--'}</span>
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>

            {/* Budget */}
            <div className="mb-6 flex items-center justify-between">
              <span className="inline-block bg-blue-100 text-blue-800 font-semibold px-4 py-2 rounded-lg">
                Budget: {data?.total_budget ? formatCurrency(data.total_budget) : '--'}
              </span>
              <div className="flex items-center gap-2">
                {/* Platform Icons */}
                    { data.is_instagram_enabled == 1 && (
                  <div className="w-6 h-6 border-2 border-black rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                  </div>
                    )}

                    {data.is_youtube_enabled == 1 && (
                     <div className="w-6 h-6 border-2 border-black rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M21.8 8.001a2.75 2.75 0 0 0-1.94-1.94C18.1 6 12 6 12 6s-6.1 0-7.86.06a2.75 2.75 0 0 0-1.94 1.94A28.6 28.6 0 0 0 2 12a28.6 28.6 0 0 0 .2 3.999 2.75 2.75 0 0 0 1.94 1.94C5.9 18 12 18 12 18s6.1 0 7.86-.06a2.75 2.75 0 0 0 1.94-1.94A28.6 28.6 0 0 0 22 12a28.6 28.6 0 0 0-.2-3.999zM10 15.5v-7l6 3.5-6 3.5z"/>
                      </svg>
                      </div>
                    )}
                    {data.is_facebook_enabled == 1 && (
                      <div className="w-6 h-6 border-2 border-black rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M22 12c0-5.522-4.477-10-10-10S2 6.478 2 12c0 5 3.657 9.127 8.438 9.877v-6.987h-2.54v-2.89h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.242 0-1.63.771-1.63 1.562v1.875h2.773l-.443 2.89h-2.33v6.987C18.343 21.127 22 17 22 12"/>
                      </svg>
                      </div>
                    )}
              </div>
            </div>

            {/* Campaign Details Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm font-bold text-black mb-1">Minimum Followers</p>
                <p className="text-sm text-black">{data?.minimum_followers ? formatFollowers(data.minimum_followers) : '--'}</p>
              </div>
              <div>
                <p className="text-sm font-bold text-black mb-1">Gender Preferences</p>
                <p className="text-sm text-black">{data?.gender_preference != null ? getGender(data.gender_preference) : '--'}</p>
              </div>
              {/* <div>
                <p className="text-sm font-bold text-black mb-1">Gender Preferences</p>
                <p className="text-sm text-black">{data?.genderPreferences?.join(', ')}</p>
              </div> */}
              <div>
                <p className="text-sm font-bold text-black mb-1">Age Groups</p>
                <p className="text-sm text-black">{data?.age_group != null ? getAgeGroup(data.age_group) : '--'}</p>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-sm font-bold text-black mb-2">Description</h3>
              <p className="text-sm text-black leading-relaxed">
                {data?.compaign_description || '--'}
              </p>
            </div>

            {/* Categories */}
            {/* <div className="mb-6">
              <h3 className="text-sm font-bold text-black mb-3">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {data?.categories?.map((cat: any, index: any) => (
                  <span key={index} className="px-3 py-2 bg-gray-200 text-black text-sm rounded-lg">
                    {cat.trim()}
                  </span>
                ))}
              </div>
            </div> */}

            {/* Languages */}
            <div className="mb-6">
              <h3 className="text-sm font-bold text-black mb-3">Languages</h3>
              <div className="flex flex-wrap gap-2">
                {data?.promoter_campaign_languages?.map((lang: any, index: any) => (
                  <span key={index} className="px-3 py-2 bg-blue-100 text-blue-800 text-sm rounded-lg">
                    {lang.campaign_language.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Platforms */}
            {/* <div className="mb-6">
              <h3 className="text-sm font-semibold text-black mb-3">Platforms</h3>
              <div className="flex flex-wrap gap-2">
                {platforms.map((platform: any, index: any) => (
                  <span key={index} className="px-3 py-2 bg-green-100 text-green-800 text-sm rounded-lg">
                    {platform}
                  </span>
                ))}
              </div>
            </div> */}
          </section>

        </main>

        {/* Bottom Action Bar */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-4 px-6 z-30">
          {applied  || data.applied_campaign_status == '1' ? (
            <button
              className="w-full bg-[#7DDF64] text-[#000] py-3 rounded-lg font-semibold cursor-default"
              disabled
            >
              Applied
            </button>
          ) : (
            <button 
              onClick={handleApply}
              className="w-full bg-[#E30B5C] text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
              ) : null}
              {loading ? "Applying..." : "Apply Now"}
            </button>
          )}
        </nav>
      </div>

      {/* <Loader show={loading}></Loader>    */}

      {/* <AwarePopup
        isOpen={isAwareOpen}
        onClose={() => setIsAwareOpen(false)}
        onProceed={() => handleApplyRedirection()}
        influencerName={data?.title}
      /> */}
    
    {
      isLoggedIn && (
      <CreateProfilePopup 
          showProfilePopup={isProfileCreatePopupOpen} 
          onClose={() => setIsProfileCreatePopupOpen(false)}
        />
      )
    }
    {
      showLoginPopup && (
        <LoginPopup />
      )
    }
    </>
  );
};

export default CampaignDetails;
