import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Influencer {
  id: number;
  name: string;
  username: string;
  profile_image: string;
  followers_count: number;
  engagement_rate: number;
  category: string;
  location: string;
  verified: boolean;
  // Add other influencer properties as needed
}

interface InfluencerState {
  items: Influencer[];
  nextPage: number;
  loading: boolean;
  hasMore: boolean;
  filters: Record<string, any>;
}

const initialState: InfluencerState = {
  items: [],
  nextPage: 0,
  loading: false,
  hasMore: true,
  filters: {}
};

const influencerSlice = createSlice({
  name: 'influencer',
  initialState,
  reducers: {
    setItems: (state, action: PayloadAction<Influencer[]>) => {
      state.items = action.payload;
    },
    
    addItems: (state, action: PayloadAction<Influencer[]>) => {
      state.items = [...state.items, ...action.payload];
    },
    
    setNextPage: (state, action: PayloadAction<number>) => {
      state.nextPage = action.payload;
    },
    
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    
    setHasMore: (state, action: PayloadAction<boolean>) => {
      state.hasMore = action.payload;
    },
    
    setFilters: (state, action: PayloadAction<Record<string, any>>) => {
      state.filters = action.payload;
    },
    
    resetInfluencers: (state) => {
      state.items = [];
      state.nextPage = 0;
      state.loading = false;
      state.hasMore = true;
      // Don't clear filters - they should persist
    }
  }
});

export const {
  setItems,
  addItems,
  setNextPage,
  setLoading,
  setHasMore,
  setFilters,
  resetInfluencers
} = influencerSlice.actions;

// Selectors
export const selectInfluencerItems = (state: { influencer: InfluencerState }) => state.influencer.items;
export const selectInfluencerNextPage = (state: { influencer: InfluencerState }) => state.influencer.nextPage;
export const selectInfluencerLoading = (state: { influencer: InfluencerState }) => state.influencer.loading;
export const selectInfluencerHasMore = (state: { influencer: InfluencerState }) => state.influencer.hasMore;
export const selectInfluencerFilters = (state: { influencer: InfluencerState }) => state.influencer.filters;

export default influencerSlice.reducer;
