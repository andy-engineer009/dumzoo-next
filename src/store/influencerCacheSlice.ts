import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface InfluencerCacheState {
  data: any[];
  lastPage: number;
  scrollPosition: number;
  hasData: boolean;
  lastFilters: any;
}

const initialState: InfluencerCacheState = {
  data: [],
  lastPage: 0,
  scrollPosition: 0,
  hasData: false,
  lastFilters: {},
};

const influencerCacheSlice = createSlice({
  name: 'influencerCache',
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<{ data: any[]; lastPage: number; filters?: any }>) => {
      state.data = action.payload.data;
      state.lastPage = action.payload.lastPage;
      state.hasData = true;
      if (action.payload.filters) {
        state.lastFilters = action.payload.filters;
      }
    },
    setScrollPosition: (state, action: PayloadAction<number>) => {
      state.scrollPosition = action.payload;
    },
    setFilters: (state, action: PayloadAction<any>) => {
      state.lastFilters = action.payload;
    },
    clearData: (state) => {
      state.data = [];
      state.lastPage = 0;
      state.scrollPosition = 0;
      state.hasData = false;
      state.lastFilters = {};
    },
  },
});

export const { setData, setScrollPosition, setFilters, clearData } = influencerCacheSlice.actions;
export default influencerCacheSlice.reducer;
