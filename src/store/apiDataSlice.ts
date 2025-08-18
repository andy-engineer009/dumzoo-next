import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const apiDataSlice = createSlice({
    name: 'apiData',
    initialState: {
        influencerDropdownData: null,
        dashboardData: null,
        // loading: false,
        // error: null
    },
    reducers: {
        influencerDropodownData: (state, action: PayloadAction<any>) => {
            state.influencerDropdownData = action.payload;
        },

        dashboardData: (state, action: PayloadAction<any>) => {
            state.dashboardData = action.payload;
        }
    }
})

// Export actions
export const { 
    influencerDropodownData, 
    dashboardData
  } = apiDataSlice.actions;

  export const selectInfluencerDropdownData = (state: { apiData: any }) => state.apiData.influencerDropdownData;
  export const selectDashboardData = (state: { apiData: any }) => state.apiData.dashboardData;
// Export reducer
export default apiDataSlice.reducer;