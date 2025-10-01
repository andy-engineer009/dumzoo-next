import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { CampaignData } from '@/services/campaignApi';

interface CampaignCacheState {
  data: CampaignData[];
  lastPage: number;
  scrollPosition: number;
  hasData: boolean;
  lastFilters: Record<string, any>;
}

const initialState: CampaignCacheState = {
  data: [],
  lastPage: 0,
  scrollPosition: 0,
  hasData: false,
  lastFilters: {},
};

const campaignCacheSlice = createSlice({
  name: 'campaignCache',
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<{ data: CampaignData[]; lastPage: number; filters: Record<string, any> }>) => {
      state.data = action.payload.data;
      state.lastPage = action.payload.lastPage;
      state.hasData = true;
      state.lastFilters = action.payload.filters;
    },
    setScrollPosition: (state, action: PayloadAction<number>) => {
      state.scrollPosition = action.payload;
    },
    setFilters: (state, action: PayloadAction<Record<string, any>>) => {
      state.lastFilters = action.payload;
    },
    clearData: (state) => {
      state.data = [];
      state.lastPage = 0;
      state.hasData = false;
      state.scrollPosition = 0;
    },
    resetCache: () => initialState,
  },
});

export const { setData, setScrollPosition, setFilters, clearData, resetCache } = campaignCacheSlice.actions;
export default campaignCacheSlice.reducer;

