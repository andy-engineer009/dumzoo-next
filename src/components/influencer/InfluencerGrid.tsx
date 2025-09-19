'use client';

import InfluencerCard from './InfulancerCard';
import InfluencerSkeleton from '../discover/InfluencerSkeleton';
import LoadingIndicator from '../LoadingIndicator';
import VirtualScrollList from '../VirtualScrollList';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';

interface InfluencerGridProps {
  influencers: any[];
  onLoadMore: () => void;
  isLoading: boolean;
  hasMore: boolean;
  error?: string | null;
  isInitialLoad?: boolean;
}

const InfluencerGrid = ({ 
  influencers, 
  onLoadMore, 
  isLoading, 
  hasMore, 
  error,
  isInitialLoad = false 
}: InfluencerGridProps) => {

  // Show error state
  if (error) {
    return (
      <div className="col-span-full text-center py-12">
        <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
          <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
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

  // Show loading state for initial load
  if (isInitialLoad && isLoading) {
    return (
      
      <div className="grid grid-cols-1 gap-2 pb-20 md:pb-0">
        <LoadingIndicator count={10} />
      </div>
    );
  }

  // Show empty state when no influencers found
  if (!isLoading && (influencers?.length === 0 || influencers === null)) {
    return (
      <div className="col-span-full text-center py-12">
        <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
          <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No influencers found</h3>
        <p className="text-gray-600 mb-4">We couldn't find any influencers matching your criteria.</p>
      </div>
    );
  }

  // Use virtual scrolling for large lists (1000+ items)
  const shouldUseVirtualScrolling = influencers.length > 1000;
  const itemHeight = 400; // Approximate height of influencer card

  if (shouldUseVirtualScrolling) {
    return (
      <VirtualScrollList
        items={influencers}
        itemHeight={itemHeight}
        containerHeight={window.innerHeight - 200} // Adjust based on your layout
        renderItem={(influencer, index) => (
          <InfluencerCard
            key={influencer.id || index}
            data={influencer}
          />
        )}
        onLoadMore={onLoadMore}
        hasMore={hasMore}
        isLoading={isLoading}
        className="pb-20 md:pb-0"
      />
    );
  }

  // Regular grid for smaller lists with infinite scroll
  const { ref } = useInfiniteScroll(() => {
    console.log('🎯 InfluencerGrid: Infinite scroll triggered', { hasMore, isLoading });
    if (hasMore && !isLoading) {
      console.log('🎯 InfluencerGrid: Calling onLoadMore');
      onLoadMore();
    } else {
      console.log('🎯 InfluencerGrid: Not loading more', { hasMore, isLoading });
    }
  }, { threshold: 0.1, rootMargin: '200px' });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-y-4 md:gap-6 pb-20 md:pb-0">
      {influencers?.map((influencer, index) => (
        <InfluencerCard
          key={influencer.id || index}
          data={influencer}
        />
      ))}
      
      {/* Show skeleton cards while loading more data */}
      {isLoading && hasMore && <LoadingIndicator count={10} />}
      
      {/* Show "No more results" message */}
      {!hasMore && influencers?.length > 0 && (
        <div className="col-span-full text-center py-8">
          <div className="text-gray-500 text-sm">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="font-medium text-gray-600">All caught up!</p>
            <p className="text-gray-500">You've seen all available influencers.</p>
          </div>
        </div>
      )}
      
      {/* Intersection observer target for infinite scroll */}
      <div 
        ref={ref} 
        className="col-span-full h-20 bg-red-100 border-2 border-red-300 flex items-center justify-center"
        style={{ minHeight: '80px' }}
      >
        <span className="text-red-600 text-sm font-medium">
          SCROLL TARGET - hasMore: {hasMore ? 'true' : 'false'}, isLoading: {isLoading ? 'true' : 'false'}, influencers: {influencers?.length || 0}
        </span>
      </div>
    </div>
  );
};

export default InfluencerGrid; 