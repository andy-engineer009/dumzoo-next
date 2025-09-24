import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface InfluencerData {
  uuid: string;
  username: string;
  follower_count: number;
  starting_price: number;
  verified_profile: number;
  influencer_city: { name: string };
  influencer_state: { short_name: string };
  instagram_url?: string;
  facebook_url?: string;
  youtube_url?: string;
}

interface NewPageState {
  data: InfluencerData[];
  hasData: boolean;
  lastPage: number;
  lastScrollPosition: number;
}

const initialState: NewPageState = {
  data: [],
  hasData: false,
  lastPage: 0,
  lastScrollPosition: 0,
};

const newPageSlice = createSlice({
  name: 'newPage',
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<InfluencerData[]>) => {
      state.data = action.payload;
      state.hasData = true;
    },
    setLastPage: (state, action: PayloadAction<number>) => {
      state.lastPage = action.payload;
    },
    setLastScrollPosition: (state, action: PayloadAction<number>) => {
      state.lastScrollPosition = action.payload;
    },
    clearData: (state) => {
      state.data = [];
      state.hasData = false;
      state.lastPage = 0;
      state.lastScrollPosition = 0;
    },
  },
});

export const { setData, setLastPage, setLastScrollPosition, clearData } = newPageSlice.actions;
export default newPageSlice.reducer;
