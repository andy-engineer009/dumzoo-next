'use client'

import { api } from "@/common/services/rest-api/rest-api";
import { useState, useEffect, useCallback } from "react";
import { API_ROUTES } from "@/appApi";

import Link from "next/link";
import InfluencerGrid from "@/components/influencer/InfluencerGrid";
import { useParams } from "next/navigation";
import InfluencerSkeleton from "../discover/InfluencerSkeleton";

export default function CampaignsList() {
  const params = useParams();
  const campaign_id = params.id;

  console.log(campaign_id);

  const [influencers, setInfluencers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [startIndex, setStartIndex] = useState(0);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [totalRecords, setTotalRecords] = useState(0);


  const ITEMS_PER_PAGE = 3;

  // API call function
  const fetchInfluencers = async (start: number, searchFilters = {}) => {
    try {
      const res = await api.post(API_ROUTES.appliedCampaingsInfluencerList, {
        start: start,
        length: ITEMS_PER_PAGE,
        campaign_id: campaign_id
      });

      if (res.status === 1) {
        return {
          data: res.data || [],
          totalRecords: res.recordsTotal || 0,
          hasMore: (start + ITEMS_PER_PAGE) < (res.recordsTotal || 0)
        };
      } else {
        return {
          data: [],
          totalRecords: 0,
          hasMore: false
        };
      }
    } catch (error) {
      return {
        data: [],
        totalRecords: 0,
        hasMore: false
      };
    }
  };

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      setIsInitialLoading(true);
      try {
        const result:any = await fetchInfluencers(0);
        console.log(result, 'result');
        setInfluencers(result.data);
        setTotalRecords(result.totalRecords);
        setHasMore(result.hasMore);
        setStartIndex(0);
      } catch (error) {
        console.error('Error loading initial data:', error);
      } finally {
        setIsInitialLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Load more data function
  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    
    try {
      const nextStartIndex = startIndex + ITEMS_PER_PAGE;
      const result:any = await fetchInfluencers(nextStartIndex);
      
      if (result.data.length > 0) {
        setInfluencers(prev => [...prev, ...result.data]);
        setStartIndex(nextStartIndex);
        setHasMore(result.hasMore);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading more data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [startIndex, isLoading, hasMore]);


    
    // Show loading skeleton for initial load
    if (isInitialLoading) {
      return (
        <>
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

          <div className="flex mt-0 px-4 md:p-8 items-start pt-[10px] ">
            <div className="md:pl-9" style={{flex: 1}}>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-6 pb-20 md:pb-0">
                {Array.from({ length: 20 }, (_, index) => (
                  <InfluencerSkeleton key={`initial-skeleton-${index}`} />
                ))}
              </div>
            </div>
          </div>
        </>
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
            <h1 className="text-lg font-medium text-gray-900 text-center">Applied Influencers </h1>
          </div>
        </div>

        <div className="md:pl-9 pt-[10px] px-4" style={{flex: 1}}>
          <InfluencerGrid 
            influencers={influencers} 
            onLoadMore={loadMore}
            isLoading={isLoading}
            hasMore={hasMore}
          />
        </div>

    </div>
  );
}
