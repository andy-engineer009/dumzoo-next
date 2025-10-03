import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { selectIsLoggedIn } from "@/store/userRoleSlice";

// userRole 1 admin 2 influencer 3 Promoter or brand
export default function CampaignCard({campaign, userRole}: {campaign: any, userRole: any}) {    
    const router = useRouter();
    const isLoggedIn = useSelector(selectIsLoggedIn);
    const formatAppliedInfluencers = (count: any): string => {
        if (count >= 1000000) {
          return `${(count / 1000000).toFixed(1)}M`;
        } else if (count >= 1000) {
          return `${(count / 1000).toFixed(1)}K`;
        }
        return count.toString();
      };

    function getGenderPreferenceLabel(value: number) {
        switch (value) {
            case 0: return 'All';
            case 1: return 'Male';
            case 2: return 'Female';
            case 3: return 'Other';
            default: return 'Other';
        }
    }

    function getInfluencerCategoryByFollowers(followers: number) {
        if (typeof followers !== "number" || isNaN(followers)) return "Unknown";
        if (followers < 10000) {
            return "Nano";
        } else if (followers < 100000) {
            return "Micro";
        } else if (followers < 1000000) {
            return "Macro";
        } else if (followers < 10000000) {
            return "Mega";
        } else {
            return "Celebrity";
        }
    }

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

    function isCampaignExpired(expiresAt: string): boolean {
        if (!expiresAt) return false;
        const expiryDate = new Date(expiresAt);
        const currentDate = new Date();
        return expiryDate < currentDate;
    }

    const isExpired = isCampaignExpired(campaign.expires_at);

    return (
        <div 
            // href={isExpired ? '#' : ` ${userRole == 2 ? `/campaigns/${campaign.id}` : `/manage-campaigns/${campaign.id}`}`} 
            key={campaign.id} 
            className={`block bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden transition-all duration-200 relative ${isExpired ? 'cursor-not-allowed' : 'hover:shadow-lg'}`}
            onClick={isExpired ? (e) => e.preventDefault() : undefined}
        >
            {/* Expired Overlay */}
            {isExpired && (
                <div className="absolute inset-0 bg-[#ffffffa1] bg-opacity-70 flex items-center justify-center z-20">
                    <div className="text-center px-4 py-2 rounded-lg">
                        <Image src={'/images/expired-icon.png'} alt='expired' width={100} height={100} />
                    </div>
                </div>
            )}
            {/* Top Section - Product Image Area */}
            <div className="relative bg-[#ddd] h-[150px] flex items-center justify-center overflow-hidden">
                {/* Product Image */}
                {/* <h3>PAID</h3> */}
                {campaign.campaign_logo_url ? (
                <Image src={campaign.campaign_logo_url} alt='' width={100} height={100} />
                ):(
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500 text-lg">Campaign Image</span>
                  </div>
                )
            }
                {/* <Image src={campaign.image} alt={campaign.name} width={100} height={100} /> */}
                {/* Yellow Banner - Applied Count (only for non-expired campaigns) */}
                {(!isExpired && isLoggedIn) && (
                    campaign?.applied_campaign_status == 1 ? 
                    <div className="absolute top-3 right-3 bg-[#7DDF64] text-black text-xs font-bold px-2 py-1 rounded-r-full clip-path-arrow">
                    <div className="flex items-center">
                         <span>Applied</span>
                        {/* <svg className="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg> */}
                    </div>
                </div>
                 : 
                 <div className="absolute top-3 right-3  bg-[#E30B5C] text-black text-xs font-bold px-2 py-1 rounded-r-full clip-path-arrow">
                    {/* bg-yellow-400 */}
                 <div className="flex items-center">
                     <span className="text-white">{campaign?.applied_influencers_count ? formatAppliedInfluencers(campaign?.applied_influencers_count) : 0} Applied</span>
                     
                     
                     {/* <svg className="w-3 h-3 ml-1" fill="#fff" viewBox="0 0 20 20">
                         <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                     </svg> */}
                 </div>
             </div>
                )}
              
            </div>

            {/* Bottom Section - Campaign Details */}
            <div className="p-4">
                                  {/* Brand Name */}
                                  <h3 className="text-lg font-bold text-black mb-1">
                            {campaign.compaign_name || '--'}
                        </h3>
                <div className="flex justify-between items-start">
                    {/* Left Side - Campaign Info */}
                    <div className="flex-1">
                        
                        {/* Payout */}
                        <p className="text-sm text-black mb-1">
                            Payout - <span className="font-semibold">₹{campaign.total_budget || '--'}</span>
                        </p>
                        
                        <div className="flex">
      {/* Preference */}
      <p className="text-xs text-gray-500">
                            Preferred: {campaign.gender_preference != null ? getGenderPreferenceLabel(campaign.gender_preference) : '--'}
                        </p>

                        <div className="flex items-center space-x-1 pl-2">
                            <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                            </svg>
                            <span className="text-xs text-black font-medium">
                                {campaign.minimum_followers ? getInfluencerCategoryByFollowers(campaign.minimum_followers) : '--'}
                                {/* {campaign.minimum_followers ? formatAppliedInfluencers(campaign.minimum_followers) : '--'} */}
                            </span>
                        </div>
                        </div>
                  
                    </div>

                    {/* Right Side - Platform & Type */}
                    <div className="flex flex-col items-end space-y-1">
                        {/* Instagram Icon */}
                        <div className="flex gap-2">
      {campaign.is_instagram_enabled == 1 && <svg className="w-4 h-4" fill="#000" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>}

                  {campaign.is_youtube_enabled == 1 && 
                  <svg className="w-4 h-4" fill="#000" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                  }
                                    {campaign.is_facebook_enabled == 1 && 
                      <svg className="w-4 h-4" fill="#000" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  }
                        </div>
                        
                        {/* Micro Influencer Type */}
                   
                        
                        {/* Time Posted */}
                        <p className="text-xs text-gray-500">
                            {campaign.createdAt ? formatDateFromNow(campaign.createdAt) : '--'}
                        </p>
                    </div>

      

                </div>
                {
                    userRole == 3 &&
                <button
                    className="mt-2 px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded transition-colors mx-auto block"
                    onClick={() => router.push(`/manage-campaigns/${campaign.id}`)}
                >
                    See Applied Users
                </button>
                  }

            </div>
        </div>
    )
}