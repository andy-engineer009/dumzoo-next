import React from 'react';
import CampaignCard from "@/components/campaigns/campaign-card";
import CampaignSkeleton from "./CampaignSkeleton";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";

interface Campaign {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  status: string;
  statusColor: string;
  statusText: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

interface CampaignsGridProps {
  campaigns: Campaign[];
  onLoadMore: () => void;
  isLoading: boolean;
  hasMore: boolean;
  error?: string | null;
  isInitialLoad?: boolean;
}

export default function CampaignsGrid({ 
  campaigns, 
  onLoadMore, 
  isLoading, 
  hasMore, 
  error, 
  isInitialLoad 
}: CampaignsGridProps) {
  const { ref, isIntersecting } = useInfiniteScroll(onLoadMore, {
    threshold: 0.1,
    rootMargin: '200px', // Trigger earlier to load more content
  });

  // Show loading skeleton for initial load
  if (isInitialLoad) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-6 pb-20 md:pb-0">
        {Array.from({ length: 20 }, (_, index) => (
          <CampaignSkeleton key={`initial-skeleton-${index}`} />
        ))}
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Something went wrong</h3>
        <p className="text-gray-500 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Show empty state
  if (campaigns.length === 0 && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No campaigns found</h3>
        <p className="text-gray-500 mb-4">Try adjusting your search or filters to find more campaigns.</p>
        <div className="flex space-x-3">
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Refresh
          </button>

        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-6 pb-20 md:pb-0">
        {campaigns.map((campaign) => (
          <CampaignCard key={campaign.id} campaign={campaign} userRole={2} />
        ))}
      </div>

      {/* Loading indicator for pagination */}
      {isLoading && hasMore && (
        <div className="flex justify-center py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-6 w-full">
            {Array.from({ length: 10 }, (index) => (
              <CampaignSkeleton key={`loading-skeleton-${index}`} />
            ))}
          </div>
        </div>
      )}

      {/* Intersection observer target for infinite scroll - Only show when there's more data */}
      {hasMore && !isLoading && (
        <div 
          ref={ref} 
          className="h-20 flex items-center justify-center"
          data-testid="infinite-scroll-trigger"
        >
          <div className="text-sm text-gray-500">Loading more campaigns...</div>
        </div>
      )}

      {/* End of results message */}
      {!hasMore && campaigns.length > 0 && (
        <div className="text-center py-8">
          <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            All caught up! No more campaigns to load.
          </div>
        </div>
      )}
    </>
  );
}
