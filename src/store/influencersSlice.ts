import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Influencer {
  uuid: string;
  username: string;
  verified_profile: number;
  follower_count: number;
  starting_price: number;
  influencer_city?: {
    name: string;
  };
  influencer_state?: {
    short_name: string;
  };
  instagram_url?: string;
  facebook_url?: string;
  youtube_url?: string;
  [key: string]: any;
}

interface InfluencersState {
  items: Influencer[];
  nextPage: number;
  loading: boolean;
  scrollY: number;
  hasMore: boolean;
  filters: Record<string, any>;
}

const initialState: InfluencersState = {
  items: [],
  nextPage: 0,
  loading: false,
  scrollY: 0,
  hasMore: true,
  filters: {}
};

const influencersSlice = createSlice({
  name: 'influencers',
  initialState,
  reducers: {
    setItems: (state, action: PayloadAction<Influencer[]>) => {
      state.items = action.payload;
    },
    addItems: (state, action: PayloadAction<Influencer[]>) => {
      // Avoid duplicates by checking UUID
      const existingIds = new Set(state.items.map(item => item.uuid));
      const newItems = action.payload.filter(item => !existingIds.has(item.uuid));
      state.items = [...state.items, ...newItems];
    },
    setNextPage: (state, action: PayloadAction<number>) => {
      state.nextPage = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setScrollY: (state, action: PayloadAction<number>) => {
      state.scrollY = action.payload;
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
      // Don't reset scrollY - preserve scroll position
      // state.scrollY = 0;
      state.filters = {};
    }
  }
});

// Export actions
export const {
  setItems,
  addItems,
  setNextPage,
  setLoading,
  setScrollY,
  setHasMore,
  setFilters,
  resetInfluencers
} = influencersSlice.actions;

// Selectors
export const selectInfluencersItems = (state: { influencers: InfluencersState }) => state.influencers.items;
export const selectInfluencersNextPage = (state: { influencers: InfluencersState }) => state.influencers.nextPage;
export const selectInfluencersLoading = (state: { influencers: InfluencersState }) => state.influencers.loading;
export const selectInfluencersScrollY = (state: { influencers: InfluencersState }) => state.influencers.scrollY;
export const selectInfluencersHasMore = (state: { influencers: InfluencersState }) => state.influencers.hasMore;
export const selectInfluencersFilters = (state: { influencers: InfluencersState }) => state.influencers.filters;

// Export reducer
export default influencersSlice.reducer;
