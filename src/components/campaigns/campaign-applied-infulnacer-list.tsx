'use client'

import { useCallback } from "react";
import { API_ROUTES } from "@/appApi";
import { api } from "@/common/services/rest-api/rest-api";

import Link from "next/link";
import InfiniteScrollGrid from "@/components/common/InfiniteScrollGrid";
import InfluencerCard from "@/components/influencer/InfulancerCard";
import { useParams } from "next/navigation";
import InfluencerSkeleton from "../discover/InfluencerSkeleton";

export default function CampaignsList() {
  const params = useParams();
  const campaign_id = params.id;

  console.log(campaign_id);

  // Fetch function for infinite scroll
  const fetchInfluencers = useCallback(async (page: number, limit: number = 3) => {
    try {
      const res = await api.post(API_ROUTES.appliedCampaingsInfluencerList, {
        campaign_id,
        start: page * limit,
        length: limit
      });

      if (res.status === 1) {
        const data = res.data || [];
        const totalRecords = res.recordsTotal || 0;
        const totalPages = Math.ceil(totalRecords / limit);
        
        return {
          data,
          hasMore: page < totalPages - 1,
          totalPages
        };
      } else {
        return {
          data: [],
          hasMore: false,
          totalPages: 0
        };
      }
    } catch (error) {
      console.error('Error fetching influencers:', error);
      throw new Error('Failed to fetch influencers');
    }
  }, [campaign_id]);

  // Render function for each influencer item
  const renderInfluencer = useCallback((influencer: any, index: number) => (
    <InfluencerCard
      key={index}
      data={influencer}
    />
  ), []);

  // Render function for influencer skeleton
  const renderInfluencerSkeleton = useCallback((index: number) => (
    <InfluencerSkeleton key={`skeleton-${index}`} />
  ), []);

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
          <InfiniteScrollGrid
            fetchFunction={fetchInfluencers}
            renderItem={renderInfluencer}
            renderSkeleton={renderInfluencerSkeleton}
            pageSize={3}
            maxItems={200}
            threshold={0.1}
            rootMargin="0px 0px 200px 0px"
            prefetchDistance={5}
            gridClassName="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-6 pb-20 md:pb-0"
          />
        </div>
      </div>
    </div>
  );
}