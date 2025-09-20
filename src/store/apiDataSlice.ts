import { createSlice, PayloadAction } from '@reduxjs/toolkit';


const apiDataSlice = createSlice({
    name: 'apiData',
    initialState: {
        influencerDropdownData: null,
        dashboardData: null,
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

        // Simple chat users actions
        setChatUsers: (state, action: PayloadAction<any[]>) => {
            state.chatUsers = action.payload;
        },

        clearChatUsers: (state) => {
            state.chatUsers = [];
        },

    }
})

// Export actions
export const { 
    influencerDropodownData, 
    dashboardData,
    setChatUsers,
    clearChatUsers
  } = apiDataSlice.actions;

  export const selectInfluencerDropdownData = (state: { apiData: any }) => state.apiData.influencerDropdownData;
  export const selectDashboardData = (state: { apiData: any }) => state.apiData.dashboardData;
  export const selectChatUsers = (state: { apiData: any }) => state.apiData.chatUsers;
// Export reducer
export default apiDataSlice.reducer;