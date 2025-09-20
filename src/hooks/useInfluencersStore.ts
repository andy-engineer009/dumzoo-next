import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect, useRef } from 'react';
import { RootState } from '@/store/store';
import { store } from '@/store/store';
import {
  setItems,
  addItems,
  setNextPage,
  setLoading,
  setScrollY,
  setHasMore,
  setFilters,
  resetInfluencers,
  selectInfluencersItems,
  selectInfluencersNextPage,
  selectInfluencersLoading,
  selectInfluencersScrollY,
  selectInfluencersHasMore,
  selectInfluencersFilters
} from '@/store/influencersSlice';
import { influencerApi } from '@/services/infiniteScrollApi';

export const useInfluencersStore = () => {
  const dispatch = useDispatch();
  const hasLoadedInitialData = useRef(false);
  
  // Selectors
  const items = useSelector(selectInfluencersItems);
  const nextPage = useSelector(selectInfluencersNextPage);
  const loading = useSelector(selectInfluencersLoading);
  const scrollY = useSelector(selectInfluencersScrollY);
  const hasMore = useSelector(selectInfluencersHasMore);
  const filters = useSelector(selectInfluencersFilters);

  // Actions
  const actions = {
    setItems: useCallback((items: any[]) => dispatch(setItems(items)), [dispatch]),
    addItems: useCallback((items: any[]) => dispatch(addItems(items)), [dispatch]),
    setNextPage: useCallback((page: number) => dispatch(setNextPage(page)), [dispatch]),
    setLoading: useCallback((loading: boolean) => dispatch(setLoading(loading)), [dispatch]),
    setScrollY: useCallback((scrollY: number) => dispatch(setScrollY(scrollY)), [dispatch]),
    setHasMore: useCallback((hasMore: boolean) => dispatch(setHasMore(hasMore)), [dispatch]),
    setFilters: useCallback((filters: Record<string, any>) => dispatch(setFilters(filters)), [dispatch]),
    resetInfluencers: useCallback(() => dispatch(resetInfluencers()), [dispatch])
  };

  // Helper function to clean filters
  const cleanFilters = useCallback((filters: any) => {
    const cleaned: any = {};
    
    Object.keys(filters).forEach(key => {
      const value = filters[key];
      
      // Skip the "filter" parameter
      if (key === 'filter') {
        return;
      }
      
      if (Array.isArray(value)) {
        if (value.length > 0) {
          cleaned[key] = value;
        }
      } else if (typeof value === 'string') {
        if (value !== '') {
          cleaned[key] = value;
        }
      } else if (typeof value === 'number') {
        // For numbers, include if they're not default values
        if (key === 'budgetMin' && value > 0) cleaned[key] = value;
        else if (key === 'budgetMax' && value < 100000) cleaned[key] = value;
        else if (key === 'followerMin' && value > 0) cleaned[key] = value;
        else if (key === 'followerMax' && value < 250000) cleaned[key] = value;
        else if (!['budgetMin', 'budgetMax', 'followerMin', 'followerMax'].includes(key)) {
          cleaned[key] = value;
        }
      } else if (value !== null && value !== undefined) {
        cleaned[key] = value;
      }
    });
    
    return cleaned;
  }, []);

  // Fetch function for infinite scroll
  const fetchInfluencers = useCallback(async (page: number, limit?: number) => {
    const cleanedFilters = cleanFilters(filters);
    return await influencerApi.fetchInfluencers(page, limit, cleanedFilters);
  }, [filters, cleanFilters]);

  // Save scroll position
  const saveScrollPosition = useCallback(() => {
    if (typeof window !== 'undefined') {
      actions.setScrollY(window.scrollY);
    }
  }, [actions]);

  // Restore scroll position
  const restoreScrollPosition = useCallback(() => {
    if (typeof window !== 'undefined' && scrollY > 0) {
      window.scrollTo({ top: scrollY, behavior: 'instant' });
    }
  }, [scrollY]);

  // Load initial data only if no items exist
  const loadInitialData = useCallback(async () => {
    // Get current state from Redux store directly (not from selector to avoid dependency)
    const currentState = store.getState();
    const currentItems = currentState.influencers.items;

    // Check if data already exists in Redux store
    if (currentItems.length > 0) {
      // Data already exists, restore scroll position
      restoreScrollPosition();
      return;
    }

    // Check if we've already loaded data (prevent multiple calls)
    if (hasLoadedInitialData.current) {
      return;
    }

    hasLoadedInitialData.current = true;
    actions.setLoading(true);
    try {
      const result = await fetchInfluencers(0, 15);
      actions.setItems(result.data);
      actions.setNextPage(1);
      actions.setHasMore(result.hasMore);
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      actions.setLoading(false);
    }
  }, [fetchInfluencers, actions, restoreScrollPosition]);

  // Load more data
  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    actions.setLoading(true);
    try {
      const result = await fetchInfluencers(nextPage, 15);
      actions.addItems(result.data);
      actions.setNextPage(nextPage + 1);
      actions.setHasMore(result.hasMore);
    } catch (error) {
      console.error('Error loading more data:', error);
    } finally {
      actions.setLoading(false);
    }
  }, [loading, hasMore, nextPage, fetchInfluencers, actions]);

  // Reset when filters change
  const updateFilters = useCallback((newFilters: Record<string, any>) => {
    hasLoadedInitialData.current = false;
    actions.setFilters(newFilters);
    actions.resetInfluencers();
  }, [actions]);

  // Reset ref when component unmounts (this will be called from the component)
  const resetLoadFlag = useCallback(() => {
    hasLoadedInitialData.current = false;
  }, []);

  return {
    // State
    items,
    nextPage,
    loading,
    scrollY,
    hasMore,
    filters,
    
    // Actions
    ...actions,
    
    // Helper functions
    fetchInfluencers,
    saveScrollPosition,
    restoreScrollPosition,
    loadInitialData,
    loadMore,
    updateFilters,
    cleanFilters,
    resetLoadFlag
  };
};
