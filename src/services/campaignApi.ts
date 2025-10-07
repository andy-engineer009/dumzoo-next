import { api } from '@/common/services/rest-api/rest-api';
import { API_ROUTES } from '@/appApi';

export interface CampaignData {
  id: number;
  user_id: number;
  compaign_name: string;
  compaign_description: string;
  minimum_followers: number;
  campaign_logo_url: string | null;
  is_youtube_enabled: number;
  is_facebook_enabled: number;
  is_instagram_enabled: number;
  total_budget: number;
  gender_preference: number;
  age_group: number;
  expires_at: string;
  deleted_at: string | null;
  createdAt: string;
  updatedAt: string;
  applied_influencers_count: string;
}

export interface CampaignResponse {
  status: number;
  data: CampaignData[];
  hasMore: boolean;
  total: number;
}

export const campaignApi = {
  async fetchCampaigns(page: number = 0, limit: number = 15, isPublic: boolean = false): Promise<CampaignResponse> {
    try {
      // Use public API for finder page, private API for other pages
      const endpoint = isPublic ? API_ROUTES.publicCampaignList : API_ROUTES.influencerCampaignList;
      
      const response = await api.post(endpoint, {
        page,
        limit,
        // Add campaign-specific filters if needed
      });

      if (response.status === 1) {
        return {
          status: 1,
          data: response.data || [],
          hasMore: response.data?.length === limit,
          total: response.data.recordsTotal || 0
        };
      } else {
        throw new Error(response.message || 'Failed to fetch campaigns');
      }
    } catch (error) {
      console.error('Campaign API Error:', error);
      throw error;
    }
  }
};
