import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ScrollPositionState {
  positions: Record<string, number>; // pageId -> scrollY position
}

const initialState: ScrollPositionState = {
  positions: {}
};

const scrollPositionSlice = createSlice({
  name: 'campaignScrollPosition',
  initialState,
  reducers: {
    saveScrollPosition: (state, action: PayloadAction<{ pageId: string; scrollY: number }>) => {
      const { pageId, scrollY } = action.payload;
      console.log(`📍 [CAMPAIGN SCROLL POSITION] Saving position for ${pageId}: ${scrollY}px`);
      state.positions[pageId] = scrollY;
    },

    restoreScrollPosition: (state, action: PayloadAction<string>) => {
      const pageId = action.payload;
      const scrollY = state.positions[pageId];

      if (scrollY !== undefined) {
        console.log(`🔄 [CAMPAIGN SCROLL POSITION] Restoring position for ${pageId}: ${scrollY}px`);
        if (typeof window !== 'undefined') {
          window.scrollTo({
            top: scrollY,
            behavior: 'instant'
          });
        }
      }
    },

    clearScrollPosition: (state, action: PayloadAction<string>) => {
      const pageId = action.payload;
      console.log(`🗑️ [CAMPAIGN SCROLL POSITION] Clearing position for ${pageId}`);
      delete state.positions[pageId];
    }
  }
});

export const { saveScrollPosition, restoreScrollPosition, clearScrollPosition } = scrollPositionSlice.actions;
export default scrollPositionSlice.reducer;
