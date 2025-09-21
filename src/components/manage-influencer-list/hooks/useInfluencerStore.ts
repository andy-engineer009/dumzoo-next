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
  resetInfluencers,
  selectInfluencerItems,
  selectInfluencerNextPage,
  selectInfluencerLoading,
  selectInfluencerHasMore,
  selectInfluencerFilters
} from '../store/influencerStore';
import { saveScrollPosition, restoreScrollPosition, clearScrollPosition } from '../store/scrollPositionStore';
import { influencerApi } from '@/services/infiniteScrollApi';

export const useInfluencerStore = () => {
  const dispatch = useDispatch();
  const hasLoadedInitialData = useRef(false);
  const scrollPosRef = useRef(0);

  // Selectors
  const items = useSelector(selectInfluencerItems);
  const nextPage = useSelector(selectInfluencerNextPage);
  const loading = useSelector(selectInfluencerLoading);
  const hasMore = useSelector(selectInfluencerHasMore);
  const filters = useSelector(selectInfluencerFilters);

  // Actions
  const actions = {
    setItems: useCallback((items: any[]) => dispatch(setItems(items)), [dispatch]),
    addItems: useCallback((items: any[]) => dispatch(addItems(items)), [dispatch]),
    setNextPage: useCallback((page: number) => dispatch(setNextPage(page)), [dispatch]),
    setLoading: useCallback((loading: boolean) => dispatch(setLoading(loading)), [dispatch]),
    setHasMore: useCallback((hasMore: boolean) => dispatch(setHasMore(hasMore)), [dispatch]),
    setFilters: useCallback((filters: Record<string, any>) => dispatch(setFilters(filters)), [dispatch]),
    resetInfluencers: useCallback(() => dispatch(resetInfluencers()), [dispatch])
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

  // Fetch influencers function
  const fetchInfluencers = useCallback(async (page: number, limit: number = 15) => {
    const cleanedFilters = cleanFilters(filters);
    return await influencerApi.fetchInfluencers(page, limit, cleanedFilters);
  }, [filters, cleanFilters]);

  // Load initial data only if no items exist
  const loadInitialData = useCallback(async () => {
    const currentState = store.getState();
    const currentItems = currentState.influencer.items;

    if (currentItems.length > 0) {
      return;
    }

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
  }, [fetchInfluencers, actions]);

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
    dispatch(clearScrollPosition('influencers'));
    
    // Check the state immediately after setting
    setTimeout(() => {
      const currentState = store.getState();
    }, 0);
    
  }, [actions, dispatch]);

  const resetLoadFlag = useCallback(() => {
    hasLoadedInitialData.current = false;
  }, []);

  // Check and apply saved scroll position immediately when page loads
  const checkAndApplyScrollPosition = useCallback(() => {
    const currentState = store.getState();
    const savedScrollY = currentState.scrollPosition.positions['influencers'];

    if (savedScrollY !== undefined && savedScrollY > 0) {
      window.scrollTo({
        top: savedScrollY,
        behavior: 'instant'
      });
    } else {
      // console.log(`📍 [SCROLL POSITION] No saved position found, staying at top`);
    }
  }, []);

  // Find the actual scrollable element
  const findScrollableElement = useCallback(() => {
    const elements = [
      { name: 'window', element: window, scrollTop: window.scrollY || window.pageYOffset },
      { name: 'documentElement', element: document.documentElement, scrollTop: document.documentElement.scrollTop },
      { name: 'body', element: document.body, scrollTop: document.body.scrollTop }
    ];

    // Also check for any elements with overflow scroll
    const scrollableDivs = Array.from(document.querySelectorAll('*')).filter(el => {
      const style = window.getComputedStyle(el);
      return style.overflowY === 'scroll' || style.overflowY === 'auto' || style.overflow === 'scroll' || style.overflow === 'auto';
    });

    // Find the element with the highest scroll position
    const scrollableElement = elements.reduce((max, current) => 
      current.scrollTop > max.scrollTop ? current : max
    );

    return scrollableElement;
  }, []);

  // Setup scroll tracking - optimized for mobile performance
  const setupScrollTracking = useCallback(() => {
    let scrollTimeout: NodeJS.Timeout | null = null;
    let lastSavedPosition = 0;

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
        const positionDifference = Math.abs(currentScrollPosition - lastSavedPosition);
        if (positionDifference > 50) {
          scrollPosRef.current = currentScrollPosition;
          lastSavedPosition = currentScrollPosition;
          
          // Only log occasionally to avoid console spam
          if (Math.random() < 0.0005) { // 0.05% chance (reduced logging)
          }
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
      dispatch(saveScrollPosition({ pageId: 'influencers', scrollY: finalPosition }));
      
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
    fetchInfluencers,
    loadInitialData,
    loadMore,
    updateFilters,
    cleanFilters,
    resetLoadFlag,
    checkAndApplyScrollPosition,
    setupScrollTracking
  };
};
