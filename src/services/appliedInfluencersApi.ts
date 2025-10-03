import { api } from '@/common/services/rest-api/rest-api';
import { API_ROUTES } from '@/appApi';

export interface AppliedInfluencer {
  id: number;
  uuid: string;
  user_id: number;
  name: string;
  username: string;
  is_youtube_enabled: number;
  is_instagram_enabled: number;
  is_facebook_enabled: number;
  youtube_url: string | null;
  instagram_url: string | null;
  facebook_url: string | null;
  gender: number;
  age: number;
  verified_profile: number;
  follower_count: number;
  state: number;
  city: number;
  locality: string | null;
  audience_type: string | null;
  audience_age_group: string | null;
  starting_price: number;
  verification_code: string | null;
  verification_response: string | null;
  deleted_at: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    name: string;
    email: string;
    phone: string | null;
  };
  influencer_offer_detail: any[];
  influencer_media_detail: any[];
  influencer_state: {
    id: number;
    name: string;
    short_name: string;
  };
  influencer_city: {
    id: number;
    name: string;
  };
  influencer_categories: any[];
  influencer_languages: any[];
}

export interface AppliedInfluencersResponse {
  data: AppliedInfluencer[];
  hasMore: boolean;
  totalPages: number;
}

export const appliedInfluencersApi = {
  // Fetch applied influencers for a campaign with page pagination
  fetchAppliedInfluencers: async (
    page: number, 
    limit: number = 15, 
    campaignId: string
  ): Promise<AppliedInfluencersResponse> => {
    try {
      const payload = {
        page,
        limit,
        campaign_id: campaignId
      };
      
    //   console.log('📡 Applied Influencers API Call:', { page, limit, campaignId });
      
      const response = await api.post(API_ROUTES.appliedCampaingsInfluencerList, payload);

    //   console.log('📡 Applied Influencers API Response:', response);

      if (response.status === 1) {
        const data = response.data || [];
        const totalCount = response.data.length || 0;
        const totalPages = Math.ceil(totalCount / limit);
        
        // Fix: hasMore should be false if current page has fewer items than limit
        const hasMore = data.length === limit;
        
        // console.log('📊 Pagination Debug:', { 
        //   page, 
        //   dataLength: data.length, 
        //   limit, 
        //   totalCount, 
        //   totalPages, 
        //   hasMore 
        // });
        
        return {
          data,
          hasMore,
          totalPages
        };
      } else {
        console.warn('⚠️ Applied Influencers API returned status 0:', response.message);
        return {
          data: [],
          hasMore: false,
          totalPages: 0
        };
      }
    } catch (error) {
      console.error('❌ Applied Influencers API Error:', error);
      return {
        data: [],
        hasMore: false,
        totalPages: 0
      };
    }
  }
};
