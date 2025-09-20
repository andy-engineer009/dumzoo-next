'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const InfluencerCard = ({data}: any) => {
  const [imageError, setImageError] = useState(false);
  const router = useRouter();

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

  const getgender = (gender: any) => {
    if (gender == 1) {
      return 'Male';
    } else if (gender == 2) {
      return 'Female';
    } else if (gender == 3) {
      return 'Other';
    }
  }

  return (
    <div 
      key={data?.uuid}
      className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer p-4 w-full"
      onClick={() => router.push(`/discover/${data?.uuid}`)}
    >
      <div
        className="flex items-center space-x-4 relative"
        style={{
          fontFamily: "'Open Sans', sans-serif",
        }}
      >
        {/* Left Side - Circular Profile Picture */}
        <div className="flex-shrink-0">
          <div className="relative w-[90px] h-[90px] rounded-full overflow-hidden bg-gray-100">
            {
    <Image
    src={'/images/login/w6.jpg'}
    alt={'Influencer profile'}
    width={64}
    height={64}
    className="w-full h-full object-cover"
    onError={() => setImageError(true)}
  />
            }
        
          </div>
        </div>

        {/* Center - Influencer Details */}
        <div className="flex-1 min-w-0">
          {/* Name with Verification Badge */}
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="font-bold text-gray-900 text-base truncate" style={{
              textTransform: "none",
              fontSize: 14,
            }}>
              @{data?.username || 'N/A'}
            </h3>
            {data?.verified_profile == 1 && (
              <div className="flex-shrink-0">
                <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>

          {/* Location */}
          <div className="text-[12px] text-stone-600 font-[500] mb-1 truncate flex items-center">
          <Image
              src="/images/pin.png"
              alt="Followers"
              width={16}
              height={16}
              className="mr-1 opacity-50"
            />
            {`${data?.influencer_city?.name || '--'}, ${data?.influencer_state?.short_name || '--'}`}
          </div>

          {/* Followers */}
          <div className="text-[12px] text-stone-600 font-[500] mb-1 flex items-center">
            <Image
              src="/images/followers.png"
              alt="Followers"
              width={16}
              height={16}
              className="mr-1 opacity-50"
            />
            {formatFollowers(data?.follower_count || 0)} Followers
          </div>

          {/* Price */}
          <div className="text-[12px]  text-stone-600 font-[500] flex items-center">
            <Image
              src="/images/money.png"
              alt="Followers"
              width={16}
              height={16}
              className="mr-1 opacity-50"
            />
            Price: {formatCurrency(data?.starting_price || 0)}
          </div>
        </div>

        {/* Right Side - Social Media Icons */}
        <div className="flex-shrink-0 flex space-x-2 absolute right-0 bottom-0">
          {data?.instagram_url && (
            <Image src="/images/ig-logo.png" alt="Instagram" width={20} height={20} />
           )} 
                {data?.facebook_url && ( 
            <Image src="/images/facebook-logo.png" alt="Youtube" width={20} height={20} />
           )} 
         {data?.youtube_url && ( 
                      <Image src="/images/youtube_logo.png" alt="Youtube" width={20} height={20} />
           )} 
        </div>
      </div>
    </div>
  );
};

export default InfluencerCard;