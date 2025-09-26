import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface InfluencerCacheState {
  data: any[];
  lastPage: number;
  scrollPosition: number;
  hasData: boolean;
}

const initialState: InfluencerCacheState = {
  data: [],
  lastPage: 0,
  scrollPosition: 0,
  hasData: false,
};

const influencerCacheSlice = createSlice({
  name: 'influencerCache',
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<{ data: any[]; lastPage: number }>) => {
      state.data = action.payload.data;
      state.lastPage = action.payload.lastPage;
      state.hasData = true;
    },
    setScrollPosition: (state, action: PayloadAction<number>) => {
      state.scrollPosition = action.payload;
    },
    clearData: (state) => {
      state.data = [];
      state.lastPage = 0;
      state.scrollPosition = 0;
      state.hasData = false;
    },
  },
});

export const { setData, setScrollPosition, clearData } = influencerCacheSlice.actions;
export default influencerCacheSlice.reducer;
