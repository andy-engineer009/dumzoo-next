import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DiscoverData {
  influencers: any[];
  totalRecords: number;
  scrollPosition: number;
  hasMore: boolean;
  startIndex: number;
}

interface CampaignsData {
  campaigns: any[];
  totalRecords: number;
  scrollPosition: number;
  hasMore: boolean;
  startIndex: number;
}

const apiDataSlice = createSlice({
    name: 'apiData',
    initialState: {
        influencerDropdownData: null,
        dashboardData: null,
        discoverData: {
          influencers: [],
          totalRecords: 0,
          scrollPosition: 0,
          hasMore: true,
          startIndex: 0
        } as DiscoverData,
        campaignsData: {
          campaigns: [],
          totalRecords: 0,
          scrollPosition: 0,
          hasMore: true,
          startIndex: 0
        } as CampaignsData,
        chatUsers: [] as any[],
        // loading: false,
        // error: null
    },
    reducers: {
        influencerDropodownData: (state, action: PayloadAction<any>) => {
            state.influencerDropdownData = action.payload;
        },

        dashboardData: (state, action: PayloadAction<any>) => {
            state.dashboardData = action.payload;
        },

        discoverData: (state, action: PayloadAction<Partial<DiscoverData>>) => {
            state.discoverData = { ...state.discoverData, ...action.payload };
        },

        updateDiscoverScrollPosition: (state, action: PayloadAction<number>) => {
            state.discoverData.scrollPosition = action.payload;
        },

        clearDiscoverData: (state) => {
            state.discoverData = {
                influencers: [],
                totalRecords: 0,
                scrollPosition: 0,
                hasMore: true,
                startIndex: 0
            };
        },

        campaignsData: (state, action: PayloadAction<Partial<CampaignsData>>) => {
            state.campaignsData = { ...state.campaignsData, ...action.payload };
        },

        updateCampaignsScrollPosition: (state, action: PayloadAction<number>) => {
            state.campaignsData.scrollPosition = action.payload;
        },

        clearCampaignsData: (state) => {
            state.campaignsData = {
                campaigns: [],
                totalRecords: 0,
                scrollPosition: 0,
                hasMore: true,
                startIndex: 0
            };
        },

        // Simple chat users actions
        setChatUsers: (state, action: PayloadAction<any[]>) => {
            state.chatUsers = action.payload;
        },

        clearChatUsers: (state) => {
            state.chatUsers = [];
        },

        // Update campaign applied status by ID
        updateCampaignAppliedStatus: (state, action: PayloadAction<{ campaignId: number; appliedStatus: number }>) => {
            const { campaignId, appliedStatus } = action.payload;
            const campaign = state.campaignsData.campaigns.find(c => c.id === campaignId);
            if (campaign) {
                campaign.applied_campaign_status = appliedStatus;
                campaign.isApplied = appliedStatus === 1;
            }
        }
    }
})

// Export actions
export const { 
    influencerDropodownData, 
    dashboardData,
    discoverData,
    updateDiscoverScrollPosition,
    clearDiscoverData,
    campaignsData,
    updateCampaignsScrollPosition,
    clearCampaignsData,
    setChatUsers,
    clearChatUsers,
    updateCampaignAppliedStatus
  } = apiDataSlice.actions;

  export const selectInfluencerDropdownData = (state: { apiData: any }) => state.apiData.influencerDropdownData;
  export const selectDashboardData = (state: { apiData: any }) => state.apiData.dashboardData;
  export const selectDiscoverData = (state: { apiData: any }) => state.apiData.discoverData;
  export const selectCampaignsData = (state: { apiData: any }) => state.apiData.campaignsData;
  export const selectChatUsers = (state: { apiData: any }) => state.apiData.chatUsers;
// Export reducer
export default apiDataSlice.reducer;