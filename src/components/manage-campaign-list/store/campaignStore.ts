import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Campaign {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  status: string;
  statusColor: string;
  statusText: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  // Add other campaign properties as needed
}

interface CampaignState {
  items: Campaign[];
  nextPage: number;
  loading: boolean;
  hasMore: boolean;
  filters: Record<string, any>;
}

const initialState: CampaignState = {
  items: [],
  nextPage: 0,
  loading: false,
  hasMore: true,
  filters: {}
};

const campaignSlice = createSlice({
  name: 'campaign',
  initialState,
  reducers: {
    setItems: (state, action: PayloadAction<Campaign[]>) => {
      state.items = action.payload;
    },
    
    addItems: (state, action: PayloadAction<Campaign[]>) => {
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
    
    resetCampaigns: (state) => {
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
  resetCampaigns
} = campaignSlice.actions;

// Selectors
export const selectCampaignItems = (state: { campaign: CampaignState }) => state.campaign.items;
export const selectCampaignNextPage = (state: { campaign: CampaignState }) => state.campaign.nextPage;
export const selectCampaignLoading = (state: { campaign: CampaignState }) => state.campaign.loading;
export const selectCampaignHasMore = (state: { campaign: CampaignState }) => state.campaign.hasMore;
export const selectCampaignFilters = (state: { campaign: CampaignState }) => state.campaign.filters;

export default campaignSlice.reducer;
