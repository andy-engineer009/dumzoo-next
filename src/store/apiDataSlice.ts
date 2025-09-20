import { createSlice, PayloadAction } from '@reduxjs/toolkit';


const apiDataSlice = createSlice({
    name: 'apiData',
    initialState: {
        influencerDropdownData: null,
        dashboardData: null,
        chatUsers: [] as any[],
        campaignAppliedStatus: {} as Record<string, number>,
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

        // Simple chat users actions
        setChatUsers: (state, action: PayloadAction<any[]>) => {
            state.chatUsers = action.payload;
        },

        clearChatUsers: (state) => {
            state.chatUsers = [];
        },

        // Campaign applied status actions
        updateCampaignAppliedStatus: (state, action: PayloadAction<{campaignId: string, appliedStatus: number}>) => {
            state.campaignAppliedStatus[action.payload.campaignId] = action.payload.appliedStatus;
        },

        clearCampaignAppliedStatus: (state) => {
            state.campaignAppliedStatus = {};
        },

    }
})

// Export actions
export const { 
    influencerDropodownData, 
    dashboardData,
    setChatUsers,
    clearChatUsers,
    updateCampaignAppliedStatus,
    clearCampaignAppliedStatus
  } = apiDataSlice.actions;

  export const selectInfluencerDropdownData = (state: { apiData: any }) => state.apiData.influencerDropdownData;
  export const selectDashboardData = (state: { apiData: any }) => state.apiData.dashboardData;
  export const selectChatUsers = (state: { apiData: any }) => state.apiData.chatUsers;
  export const selectCampaignAppliedStatus = (state: { apiData: any }) => state.apiData.campaignAppliedStatus;
// Export reducer
export default apiDataSlice.reducer;