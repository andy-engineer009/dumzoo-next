'use client';

import InfluencerCard from './InfulancerCard';
import InfluencerSkeleton from '../discover/InfluencerSkeleton';
import LoadingIndicator from '../LoadingIndicator';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';



interface InfluencerGridProps {
  influencers: any[];
  onLoadMore: () => void;
  isLoading: boolean;
  hasMore: boolean;
}

const InfluencerGrid = ({ influencers, onLoadMore, isLoading, hasMore }: InfluencerGridProps) => {
  const { ref } = useInfiniteScroll(() => {
    if (hasMore && !isLoading) {
      onLoadMore();
    }
  }, { threshold: 0.1, rootMargin: '200px' });

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-6 pb-20 md:pb-0">
      {influencers.map((influencer) => (
        <InfluencerCard
          key={influencer.id}
          id={influencer.id}
          uuid={influencer.uuid}
          user_id={influencer.user_id}
          name={influencer.name || influencer.username || 'Unknown'}
          username={influencer.username}
          image={influencer.image || '/images/women.png'}
          isVerified={influencer.isVerified || false}
          location={influencer.location || 'Unknown'}
          category={influencer.category || 'General'}
          followers={influencer.followers || 0}
          startingPrice={influencer.startingPrice || 0}
          instagramUrl={influencer.instagramUrl}
          youtubeUrl={influencer.youtubeUrl}
          facebookUrl={influencer.facebookUrl}
          isFeatured={influencer.isFeatured || false}
        />
      ))}
      
      {/* Show skeleton cards while loading more data */}
      {isLoading && hasMore && <LoadingIndicator count={10} />}
      
      {/* Show "No more results" message */}
      {!hasMore && influencers.length > 0 && (
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
      {hasMore && !isLoading && (
        <div ref={ref} className="col-span-full h-4" />
      )}
    </div>
  );
};

export default InfluencerGrid; 