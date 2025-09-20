'use client';

import React, { memo } from 'react';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';

interface InfiniteScrollGridProps<T> {
  fetchFunction: (page: number, limit?: number) => Promise<{
    data: T[];
    hasMore: boolean;
    totalPages?: number;
  }>;
  renderItem: (item: T, index: number) => React.ReactNode;
  renderSkeleton: (index: number) => React.ReactNode;
  gridClassName?: string;
  loadingComponent?: React.ReactNode;
  emptyComponent?: React.ReactNode;
  endComponent?: React.ReactNode;
  pageSize?: number;
  maxItems?: number;
  threshold?: number;
  rootMargin?: string;
  prefetchDistance?: number;
}

function InfiniteScrollGrid<T>({
  fetchFunction,
  renderItem,
  renderSkeleton,
  gridClassName = "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-6 pb-20 md:pb-0",
  loadingComponent,
  emptyComponent,
  endComponent,
  pageSize = 10,
  maxItems = 200,
  threshold = 0.1,
  rootMargin = '0px 0px 200px 0px',
  prefetchDistance = 5
}: InfiniteScrollGridProps<T>) {
  const {
    items,
    isLoading,
    isInitialLoading,
    hasMore,
    error,
    observerRef
  } = useInfiniteScroll(fetchFunction, {
    pageSize,
    maxItems,
    threshold,
    rootMargin,
    prefetchDistance
  });

  // Default loading component with skeletons - IMMEDIATE display
  const defaultLoadingComponent = (
    <div className="col-span-full">
      <div className="flex items-center justify-center py-4 mb-4">
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span>Loading more content...</span>
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
      <h3 className="text-lg font-semibold text-gray-900 mb-2">No items found</h3>
      <p className="text-gray-600 mb-4">We couldn't find any items matching your criteria.</p>
    </div>
  );

  // Default end component
  const defaultEndComponent = (
    <div className="col-span-full text-center py-8">
      <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full">
        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        All caught up! No more items to load.
      </div>
    </div>
  );

  // Show initial loading skeletons
  if (isInitialLoading) {
    return (
      <div className={gridClassName}>
        {Array.from({ length: pageSize * 2 }, (_, index) => renderSkeleton(index))}
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="col-span-full text-center py-12">
        <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
          <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Something went wrong</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className={gridClassName}>
        {items.map((item, index) => renderItem(item, index))}
        
        {/* Loading indicator with skeletons - IMMEDIATE display */}
        {isLoading && (loadingComponent || defaultLoadingComponent)}
        
        {/* Empty state */}
        {!isLoading && items.length === 0 && (emptyComponent || defaultEmptyComponent)}
        
        {/* End of results */}
        {!hasMore && items.length > 0 && (endComponent || defaultEndComponent)}
      </div>
      
      {/* Intersection observer target - OUTSIDE the grid */}
      {hasMore && !isLoading && (
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
export default memo(InfiniteScrollGrid) as <T>(props: InfiniteScrollGridProps<T>) => React.JSX.Element;
