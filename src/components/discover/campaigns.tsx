'use client';
import CampaignsGrid from "./CampaignsGrid";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { API_ROUTES } from "@/appApi";
import { api } from "@/common/services/rest-api/rest-api";
import ScrollToTop from "@/components/ScrollToTop";

export default function CampaignsDiscover() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [startIndex, setStartIndex] = useState(0);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [totalRecords, setTotalRecords] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const ITEMS_PER_PAGE = 3;

  // API call function for campaigns
  const fetchCampaigns = async (start: number, searchFilters = {}) => {
    try {
      console.log('🔍 Fetching campaigns with start:', start, 'length:', ITEMS_PER_PAGE);
      
      const res = await api.post(API_ROUTES.influencerCampaignList, {
        start: start,
        length: ITEMS_PER_PAGE,
      });

      console.log('📡 API Response:', res);

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
      console.error('❌ Error fetching campaigns:', error);
      throw new Error('Failed to fetch campaigns. Please try again.');
    }
  };

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      setIsInitialLoading(true);
      setError(null);
      
      try {
        const result = await fetchCampaigns(0, {});
        console.log('🚀 Initial data loaded:', result);
        setCampaigns(result.data);
        setTotalRecords(result.totalRecords);
        setHasMore(result.hasMore);
        setStartIndex(0);
      } catch (error: any) {
        setError(error.message || 'Failed to load campaigns');
        console.error('❌ Error loading initial data:', error);
      } finally {
        setIsInitialLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Load more data function
  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) {
      console.log('⏸️ Skipping loadMore:', { isLoading, hasMore });
      return;
    }

    console.log('📥 Loading more campaigns...', { startIndex, hasMore });
    setIsLoading(true);
    
    try {
      const nextStartIndex = startIndex + ITEMS_PER_PAGE;
      const result = await fetchCampaigns(nextStartIndex, {});
      
      console.log('📦 More data loaded:', result);
      
      if (result.data.length > 0) {
        setCampaigns(prev => [...prev, ...result.data]);
        setStartIndex(nextStartIndex);
        setHasMore(result.hasMore);
        console.log('✅ Campaigns updated, new total:', campaigns.length + result.data.length);
      } else {
        setHasMore(false);
        console.log('🏁 No more campaigns to load');
      }
    } catch (error: any) {
      setError(error.message || 'Failed to load more campaigns');
      console.error('❌ Error loading more data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [startIndex, isLoading, hasMore, campaigns.length]);

  // Handle search/filter changes
  const handleSearchOrFilter = useCallback(async (searchTerm: string = '', filters: any = {}) => {
    setIsInitialLoading(true);
    setError(null);
    setStartIndex(0);
    setHasMore(true);
    setCampaigns([]);
    
    try {
      const searchFilters = {
        search: searchTerm,
        ...filters
      };
      
      const result = await fetchCampaigns(0, searchFilters);
      setCampaigns(result.data);
      setTotalRecords(result.totalRecords);
      setHasMore(result.hasMore);
    } catch (error: any) {
      setError(error.message || 'Failed to search campaigns');
      console.error('Error searching campaigns:', error);
    } finally {
      setIsInitialLoading(false);
    }
  }, []);

  return (
    <>
      <div className="flex items-center py-3">
        <Link href="/" className="absolute left-4">
          <svg className="w-6 h-6 text-gray-600 hover:text-gray-900" fill="none" stroke="#ccc" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div className="flex-1 text-center">
          <h1 className="text-lg font-medium text-gray-900">Campaigns</h1>
        </div>
      </div>

      <div className="flex mt-0 px-0 md:p-8 items-start pt-[10px]">
        <div className="md:pl-9" style={{flex: 1}}>
          <CampaignsGrid 
            campaigns={campaigns}
            onLoadMore={loadMore}
            isLoading={isLoading}
            hasMore={hasMore}
            error={error}
            isInitialLoad={isInitialLoading}
          />
        </div>
      </div>
      
      <ScrollToTop />
    </>
  );
}
