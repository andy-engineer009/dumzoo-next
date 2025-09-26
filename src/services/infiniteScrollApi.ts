import { api } from '@/common/services/rest-api/rest-api';
import { API_ROUTES } from '@/appApi';

// Helper function to clean filters
const cleanFilters = (filters: any) => {
  const cleaned: any = {};
  
  Object.keys(filters).forEach(key => {
    const value = filters[key];
    if (value !== null && value !== undefined && value !== '' && value !== 'all') {
      cleaned[key] = value;
    }
  });
  
  return cleaned;
};

// Applied Campaign Influencers API
export const appliedInfluencersApi = {
  // Fetch applied influencers for a campaign with page pagination
  fetchAppliedInfluencers: async (page: number, limit: number = 10, campaignId: string) => {
    try {
      const payload = {
        page,
        limit,
        campaign_id: campaignId
      };
      
      const response = await api.post(API_ROUTES.appliedCampaingsInfluencerList, payload);

      console.log('📡 Applied Influencers API Response:', response);

      if (response.status === 1) {
        const data = response.data?.rows || [];
        const totalCount = response.data?.count || 0;
        const totalPages = Math.ceil(totalCount / limit);
        
        return {
          data,
          hasMore: page < totalPages,
          totalPages
        };
      } else {
       
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

// Influencer API with page pagination
export const influencerApi = {
  // Fetch influencers with page pagination
  fetchInfluencers: async (page: number, limit: number = 10, filters: any = {}) => {
    try {
      const cleanedFilters = cleanFilters(filters);
      
      const payload = {
        page,
        limit,
        ...cleanedFilters
      };
      
      const response = await api.post(API_ROUTES.influencerList, payload);

      // console.log('📡 Influencer API Response:', response);

      if (response.status === 1) {
        const data = response.data?.rows || [];
        const totalCount = response.data?.count || 0;
        const totalPages = Math.ceil(totalCount / limit);
        
        return {
          data,
          hasMore: page < totalPages,
          totalPages
        };
      } else {
       
        return {
          data: [],
          hasMore: false,
          totalPages: 0
        };
      }
    } catch (error) {
      console.error('💥 Error fetching influencers:', error);
      throw new Error('Failed to fetch influencers');
    }
  }
};

// Campaign API with page pagination
export const campaignApi = {
  // Fetch campaigns with page pagination
  fetchCampaigns: async (page: number, limit: number = 10, filters: any = {}) => {
    try {
     
      const cleanedFilters = cleanFilters(filters);
      
      const response = await api.post(API_ROUTES.influencerCampaignList, {
        page,
        limit,
        ...cleanedFilters
      });

      

      if (response.status === 1) {
        const data = response.data || [];
        const totalCount = response.recordsTotal || 0;
        const totalPages = Math.ceil(totalCount / limit);
        
        return {
          data,
          hasMore: page < totalPages,
          totalPages
        };
      } else {
        return {
          data: [],
          hasMore: false,
          totalPages: 0
        };
      }
    } catch (error) {
      console.error('💥 Error fetching campaigns:', error);
      throw new Error('Failed to fetch campaigns');
    }
  }
};

// Generic API wrapper for any endpoint
export const createInfiniteScrollApi = (endpoint: string) => {
  return {
    fetch: async (page: number, limit: number = 10, filters: any = {}) => {
      try {
        const cleanedFilters = cleanFilters(filters);
        
        const response = await api.post(endpoint, {
          page,
          limit,
          ...cleanedFilters
        });

        if (response.status === 1) {
          const data = response.data?.rows || response.data || [];
          const totalCount = response.data?.count || response.recordsTotal || 0;
          const totalPages = Math.ceil(totalCount / limit);
          
          return {
            data,
            hasMore: page < totalPages,
            totalPages
          };
        } else {
          return {
            data: [],
            hasMore: false,
            totalPages: 0
          };
        }
      } catch (error) {
        console.error(`Error fetching data from ${endpoint}:`, error);
        throw new Error(`Failed to fetch data from ${endpoint}`);
      }
    }
  };
};
