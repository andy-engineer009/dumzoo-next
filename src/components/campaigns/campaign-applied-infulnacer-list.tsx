'use client'

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { appliedInfluencersApi } from "@/services/infiniteScrollApi";
import InfluencerCard from "@/components/influencer/InfulancerCard";
import InfluencerSkeleton from "@/components/discover/InfluencerSkeleton";

export default function CampaignAppliedInfluencerList() {
  const params = useParams();
  const campaign_id = params.id as string;

  // State management
  const [influencers, setInfluencers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [initialLoading, setInitialLoading] = useState(true);

  const ITEMS_PER_PAGE = 15;

  console.log('🎯 Campaign ID:', campaign_id);

  // Load initial data
  const loadInitialData = useCallback(async () => {
    if (!campaign_id) return;
    
    console.log('🚀 Loading initial applied influencers data...');
    setInitialLoading(true);
    setPage(0);
    
    try {
      const result = await appliedInfluencersApi.fetchAppliedInfluencers(0, ITEMS_PER_PAGE, campaign_id);
      
      console.log('📊 Initial data result:', result);
      
      setInfluencers(result.data);
      setHasMore(result.hasMore);
      setPage(0);
      
    } catch (error) {
      console.error('❌ Error loading initial applied influencers:', error);
      setInfluencers([]);
      setHasMore(false);
    } finally {
      setInitialLoading(false);
    }
  }, [campaign_id]);

  // Load more data
  const loadMore = useCallback(async () => {
    if (loading || !hasMore || !campaign_id) return;
    
    console.log('🔄 Loading more applied influencers...');
    setLoading(true);
    
    try {
      const nextPage = page + 1;
      const result = await appliedInfluencersApi.fetchAppliedInfluencers(nextPage, ITEMS_PER_PAGE, campaign_id);
      
      console.log('📊 Load more result:', result);
      
      if (result.data.length > 0) {
        setInfluencers(prev => [...prev, ...result.data]);
        setPage(nextPage);
        setHasMore(result.hasMore);
      } else {
        setHasMore(false);
      }
      
    } catch (error) {
      console.error('❌ Error loading more applied influencers:', error);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page, campaign_id]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px 200px 0px'
      }
    );

    const observerElement = document.getElementById('scroll-observer');
    if (observerElement) {
      observer.observe(observerElement);
    }

    return () => {
      if (observerElement) {
        observer.unobserve(observerElement);
      }
    };
  }, [hasMore, loading, loadMore]);

  // Load initial data when component mounts
  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Render function for each influencer item
  const renderInfluencer = useCallback((influencer: any, index: number) => (
    <InfluencerCard
      key={influencer.id || index}
      data={influencer}
    />
  ), []);

  // Render function for influencer skeleton
  const renderInfluencerSkeleton = useCallback((index: number) => (
    <InfluencerSkeleton key={`skeleton-${index}`} />
  ), []);

  // Show loading skeleton for initial load
  if (initialLoading) {
    return (
      <div className="promotoradded_campaigns_list">
        {/* Header */}
        <div className="w-full px-2 py-3 border-b border-gray-200 sticky top-0 z-[100] bg-white">
          <div className="relative">
            <Link
              href="/manage-campaigns"
              className="mr-2 p-2 hover:bg-gray-100 rounded-full transition-colors absolute left-0 top-1/2 -translate-y-1/2"
            >
              <svg className="w-6 h-6 text-gray-600 hover:text-gray-900 " fill="none" stroke="#ccc" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-lg font-medium text-gray-900 text-center">Applied Influencers </h1>
          </div>
        </div>

        <div className="flex mt-0 px-4 md:p-8 items-start pt-[10px]">
          <div className="md:pl-9" style={{flex: 1}}>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-6 pb-20 md:pb-0">
              {Array.from({ length: 10 }).map((_, index) => renderInfluencerSkeleton(index))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="promotoradded_campaigns_list">
      {/* Header */}
      <div className="w-full px-2 py-3 border-b border-gray-200 sticky top-0 z-[100] bg-white">
        <div className="relative">
          <Link
            href="/manage-campaigns"
            className="mr-2 p-2 hover:bg-gray-100 rounded-full transition-colors absolute left-0 top-1/2 -translate-y-1/2"
          >
            <svg className="w-6 h-6 text-gray-600 hover:text-gray-900 " fill="none" stroke="#ccc" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-lg font-medium text-gray-900 text-center">Applied Influencers ({influencers.length})</h1>
        </div>
      </div>

      <div className="flex mt-0 px-4 md:p-8 items-start pt-[10px]">
        <div className="md:pl-9" style={{flex: 1}}>
          {influencers.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600">No influencers have applied to this campaign yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-6 pb-20 md:pb-0">
              {influencers.map((influencer, index) => renderInfluencer(influencer, index))}
              
              {/* Loading skeletons for load more */}
              {loading && Array.from({ length: 5 }).map((_, index) => renderInfluencerSkeleton(index))}
              
              {/* Intersection observer element */}
              <div id="scroll-observer" className="col-span-full h-10" />
              
              {/* End message */}
              {!hasMore && influencers.length > 0 && (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-500">No more applied influencers to load.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}