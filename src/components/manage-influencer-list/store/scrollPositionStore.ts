import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ScrollPositionState {
  positions: Record<string, number>; // pageId -> scrollY position
}

const initialState: ScrollPositionState = {
  positions: {}
};

const scrollPositionSlice = createSlice({
  name: 'scrollPosition',
  initialState,
  reducers: {
    saveScrollPosition: (state, action: PayloadAction<{ pageId: string; scrollY: number }>) => {
      const { pageId, scrollY } = action.payload;
      state.positions[pageId] = scrollY;
    },

    restoreScrollPosition: (state, action: PayloadAction<string>) => {
      const pageId = action.payload;
      const scrollY = state.positions[pageId];

      if (scrollY !== undefined) {
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
      delete state.positions[pageId];
    }
  }
});

export const { saveScrollPosition, restoreScrollPosition, clearScrollPosition } = scrollPositionSlice.actions;
export default scrollPositionSlice.reducer;
