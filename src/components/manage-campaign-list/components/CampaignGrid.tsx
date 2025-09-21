'use client';

import React, { memo, useCallback, useEffect, useRef } from 'react';
import { useCampaignStore } from '../hooks/useCampaignStore';

interface CampaignGridProps {
  renderItem: (item: any, index: number) => React.ReactNode;
  renderSkeleton: (index: number) => React.ReactNode;
  gridClassName?: string;
  loadingComponent?: React.ReactNode;
  emptyComponent?: React.ReactNode;
  endComponent?: React.ReactNode;
  pageSize?: number;
  threshold?: number;
  rootMargin?: string;
}

function CampaignGrid({
  renderItem,
  renderSkeleton,
  gridClassName = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 pb-20 md:pb-0",
  loadingComponent,
  emptyComponent,
  endComponent,
  pageSize = 15,
  threshold = 0.1,
  rootMargin = '0px 0px 200px 0px'
}: CampaignGridProps) {
  const {
    items,
    loading,
    hasMore,
    filters,
    loadInitialData,
    loadMore,
    resetLoadFlag,
    checkAndApplyScrollPosition,
    setupScrollTracking
  } = useCampaignStore();

  // Refs
  const observerRef = useRef<HTMLDivElement | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced load more function
  const debouncedLoadMore = useCallback(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    debounceTimeoutRef.current = setTimeout(() => {
      loadMore();
    }, 200);
  }, [loadMore]);

  // Setup intersection observer
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const setupObserver = () => {
      if (observer.current) {
        observer.current.disconnect();
      }

      observer.current = new IntersectionObserver(
        (entries) => {
          const [entry] = entries;
          if (entry.isIntersecting && hasMore && !loading) {
            debouncedLoadMore();
          }
        },
        {
          threshold,
          rootMargin,
        }
      );

      if (observerRef.current) {
        observer.current.observe(observerRef.current);
      }
    };

    setupObserver();

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [hasMore, loading, threshold, rootMargin, debouncedLoadMore]);

  // Load initial data on mount and restore scroll position
  useEffect(() => {
    loadInitialData();
    checkAndApplyScrollPosition();
  }, [loadInitialData, checkAndApplyScrollPosition]);

  // Watch for filter changes and reload data
  useEffect(() => {
    // If filters changed and we have no items, reload data
    if (items.length === 0 && !loading) {
      loadInitialData();
    }
  }, [filters, items.length, loading, loadInitialData]);

  // Setup scroll tracking and save position when user leaves
  useEffect(() => {
    const cleanup = setupScrollTracking();
    return () => {
      cleanup();
      resetLoadFlag();
    };
  }, [resetLoadFlag, setupScrollTracking]);

  // Default loading component with skeletons
  const defaultLoadingComponent = (
    <div className="col-span-full">
      <div className="flex items-center justify-center py-4 mb-4">
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span>Loading more campaigns...</span>
        </div>
      </div>
      <div className={gridClassName}>
        {Array.from({ length: pageSize }, (_, index) => renderSkeleton(index))}
      </div>
    </div>
  );

  // Default empty component
  const defaultEmptyComponent = (
    <div className="col-span-full text-center py-12">
      <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
        <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">No campaigns found</h3>
      <p className="text-gray-600 mb-4">We couldn't find any campaigns matching your criteria.</p>
    </div>
  );

  // Default end component
  const defaultEndComponent = (
    <div className="col-span-full text-center py-8">
      <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full">
        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        All caught up! No more campaigns to load.
      </div>
    </div>
  );

  // Show initial loading skeletons if no items
  if (items.length === 0 && loading) {
    return (
      <div className={gridClassName}>
        {Array.from({ length: pageSize * 2 }, (_, index) => (
          <React.Fragment key={`skeleton-${index}`}>
            {renderSkeleton(index)}
          </React.Fragment>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className={gridClassName}>
        {items.map((item, index) => (
          <React.Fragment key={item.id || `campaign-${index}`}>
            {renderItem(item, index)}
          </React.Fragment>
        ))}
        
        {/* Loading indicator with skeletons */}
        {loading && (loadingComponent || defaultLoadingComponent)}
        
        {/* Empty state */}
        {!loading && items.length === 0 && (emptyComponent || defaultEmptyComponent)}
        
        {/* End of results */}
        {!hasMore && items.length > 0 && (endComponent || defaultEndComponent)}
      </div>
      
      {/* Intersection observer target */}
      {hasMore && !loading && (
        <div 
          ref={observerRef} 
          className="w-full h-4 flex justify-center items-center"
          style={{ minHeight: '16px' }}
        >
          <div className="w-1 h-1 bg-transparent"></div>
        </div>
      )}
    </div>
  );
}

// Memoize the component to prevent unnecessary re-renders
export default memo(CampaignGrid);
