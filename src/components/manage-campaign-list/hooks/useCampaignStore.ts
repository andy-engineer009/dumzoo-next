import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect, useRef } from 'react';
import { RootState } from '@/store/store';
import { store } from '@/store/store';
import {
  setItems,
  addItems,
  setNextPage,
  setLoading,
  setHasMore,
  setFilters,
  resetCampaigns,
  selectCampaignItems,
  selectCampaignNextPage,
  selectCampaignLoading,
  selectCampaignHasMore,
  selectCampaignFilters
} from '../store/campaignStore';
import { saveScrollPosition, restoreScrollPosition, clearScrollPosition } from '../store/scrollPositionStore';
import { campaignApi } from '@/services/infiniteScrollApi';

export const useCampaignStore = () => {
  const dispatch = useDispatch();
  const hasLoadedInitialData = useRef(false);
  const scrollPosRef = useRef(0);

  // Selectors
  const items = useSelector(selectCampaignItems);
  const nextPage = useSelector(selectCampaignNextPage);
  const loading = useSelector(selectCampaignLoading);
  const hasMore = useSelector(selectCampaignHasMore);
  const filters = useSelector(selectCampaignFilters);

  // Actions
  const actions = {
    setItems: useCallback((items: any[]) => dispatch(setItems(items)), [dispatch]),
    addItems: useCallback((items: any[]) => dispatch(addItems(items)), [dispatch]),
    setNextPage: useCallback((page: number) => dispatch(setNextPage(page)), [dispatch]),
    setLoading: useCallback((loading: boolean) => dispatch(setLoading(loading)), [dispatch]),
    setHasMore: useCallback((hasMore: boolean) => dispatch(setHasMore(hasMore)), [dispatch]),
    setFilters: useCallback((filters: Record<string, any>) => dispatch(setFilters(filters)), [dispatch]),
    resetCampaigns: useCallback(() => dispatch(resetCampaigns()), [dispatch])
  };

  // Clean filters function
  const cleanFilters = useCallback((filters: Record<string, any>) => {
    const cleaned: Record<string, any> = {};
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '' && value !== 'All') {
        cleaned[key] = value;
      }
    });
    
    return cleaned;
  }, []);

  // Fetch campaigns function
  const fetchCampaigns = useCallback(async (page: number, limit: number = 15) => {
    const cleanedFilters = cleanFilters(filters);
    return await campaignApi.fetchCampaigns(page, limit, cleanedFilters);
  }, [filters, cleanFilters]);

  // Load initial data only if no items exist
  const loadInitialData = useCallback(async () => {
    const currentState = store.getState();
    const currentItems = currentState.campaign.items;

    if (currentItems.length > 0) {
      return;
    }

    if (hasLoadedInitialData.current) {
      return;
    }
    hasLoadedInitialData.current = true;

    actions.setLoading(true);
    try {
      const result = await fetchCampaigns(0, 15);
      actions.setItems(result.data);
      actions.setNextPage(1);
      actions.setHasMore(result.hasMore);
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      actions.setLoading(false);
    }
  }, [fetchCampaigns, actions]);

  // Load more data
  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    actions.setLoading(true);
    try {
      const result = await fetchCampaigns(nextPage, 15);
      actions.addItems(result.data);
      actions.setNextPage(nextPage + 1);
      actions.setHasMore(result.hasMore);
    } catch (error) {
      console.error('Error loading more data:', error);
    } finally {
      actions.setLoading(false);
    }
  }, [loading, hasMore, nextPage, fetchCampaigns, actions]);

  // Reset when filters change
  const updateFilters = useCallback((newFilters: Record<string, any>) => {
    hasLoadedInitialData.current = false;
    actions.setFilters(newFilters);
    actions.resetCampaigns();
    dispatch(clearScrollPosition('campaigns'));
  }, [actions, dispatch]);

  const resetLoadFlag = useCallback(() => {
    hasLoadedInitialData.current = false;
  }, []);

  // Check and apply saved scroll position immediately when page loads
  const checkAndApplyScrollPosition = useCallback(() => {
    const currentState = store.getState();
    const savedScrollY = currentState.campaignScrollPosition.positions['campaigns'];

    if (savedScrollY !== undefined && savedScrollY > 0) {
      window.scrollTo({
        top: savedScrollY,
        behavior: 'instant'
      });
    }
  }, []);

  // Setup scroll tracking - optimized for mobile performance
  const setupScrollTracking = useCallback(() => {
    let scrollTimeout: NodeJS.Timeout | null = null;
    let lastKnownScrollPosition = 0;

    // Highly optimized scroll handler with multiple performance optimizations
    const handleScroll = () => {
      // Clear existing timeout
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      
      // Update position after 200ms of no scrolling (increased throttling for better performance)
      scrollTimeout = setTimeout(() => {
        const currentScrollPosition = window.scrollY || window.pageYOffset;
        
        // Only update if position changed significantly (>50px) to reduce unnecessary updates
        const positionDifference = Math.abs(currentScrollPosition - lastKnownScrollPosition);
        if (positionDifference > 50) {
          scrollPosRef.current = currentScrollPosition;
          lastKnownScrollPosition = currentScrollPosition;
        }
      }, 200); // Increased from 100ms to 200ms for better battery life
    };

    // Add passive scroll listener for better performance (doesn't block scrolling)
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      // Clear timeout on cleanup
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      
      // Save current scroll position when component unmounts
      const finalPosition = scrollPosRef.current;
      dispatch(saveScrollPosition({ pageId: 'campaigns', scrollY: finalPosition }));
      
      window.removeEventListener("scroll", handleScroll);
    };
  }, [dispatch]);

  return {
    items,
    nextPage,
    loading,
    hasMore,
    filters,
    ...actions,
    fetchCampaigns,
    loadInitialData,
    loadMore,
    updateFilters,
    cleanFilters,
    resetLoadFlag,
    checkAndApplyScrollPosition,
    setupScrollTracking
  };
};
