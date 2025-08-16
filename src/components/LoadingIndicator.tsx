import React from 'react';
import InfluencerSkeleton from './discover/InfluencerSkeleton';

interface LoadingIndicatorProps {
  count?: number;
}

const LoadingIndicator = ({ count = 10 }: LoadingIndicatorProps) => {
  // Generate skeleton items
  const skeletonItems = Array.from({ length: count }, (_, index) => (
    <InfluencerSkeleton key={`loading-skeleton-${index}`} />
  ));

  return (
    <>
      {skeletonItems}
    </>
  );
};

export default LoadingIndicator;
