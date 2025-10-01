import { configureStore } from '@reduxjs/toolkit';
import userRoleReducer from './userRoleSlice';
import apiDataReducer from './apiDataSlice';
import influencerCacheReducer from './influencerCacheSlice';
import campaignCacheReducer from './campaignCacheSlice';

// Configure the Redux store
export const store = configureStore({
  reducer: {
    // Add userRole reducer to the store
    userRole: userRoleReducer,
    apiData: apiDataReducer,
    // New dedicated influencer management
    // New dedicated campaign management
    // Influencer cache for VirtualInfluencerList
    influencerCache: influencerCacheReducer,
    // Campaign cache for VirtualCampaignList
    campaignCache: campaignCacheReducer,
  },
  // Enable Redux DevTools in development
  devTools: process.env.NODE_ENV !== 'production',
});

// Export types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 