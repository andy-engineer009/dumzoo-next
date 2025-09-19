'use client';
import CampaignsGrid from "./CampaignsGrid";
import Link from "next/link";
import { useState, useEffect } from "react";
import { API_ROUTES } from "@/appApi";
import { api } from "@/common/services/rest-api/rest-api";
import ScrollToTop from "@/components/ScrollToTop";

export default function CampaignsDiscover() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [totalRecords, setTotalRecords] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // API call function for campaigns
  const fetchCampaigns = async (searchFilters = {}) => {
    try {
      const res = await api.post(API_ROUTES.influencerCampaignList, {
        limit: 3,
        page:0,
        ...searchFilters
      });

      if (res.status === 1) {
        return {
          data: res.data || [],
          totalRecords: res.recordsTotal || 0
        };
      } else {
        return {
          data: [],
          totalRecords: 0
        };
      }
    } catch (error) {
      console.error('❌ Error fetching campaigns:', error);
      throw new Error('Failed to fetch campaigns. Please try again.');
    }
  };

  // Load data from API
  const loadData = async () => {
    setIsInitialLoading(true);
    setError(null);
    
    try {
      const result = await fetchCampaigns({});
      setCampaigns(result.data);
      setTotalRecords(result.totalRecords);
    } catch (error: any) {
      setError(error.message || 'Failed to load campaigns');
      console.error('❌ Error loading initial campaigns data:', error);
    } finally {
      setIsInitialLoading(false);
    }
  };

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="campaigns-discover-screen">
        {/* Header */}
        <header className=" top-0 z-20 bg-white border-b border-gray-200 pr-4 py-3">
        <div className="flex items-center justify-center relative">
          {/* <Link 
            href="/"
            className="p-2 rounded-full hover:bg-gray-100 absolute left-0 top-1/2 -translate-y-1/2"
          >
            <svg className="w-5 h-5" fill="none" stroke="#ccc" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link> */}
          <h1 className="text-lg font-medium text-gray-900"> Find Promotions</h1>
        </div>
      </header>

      {/* Cache Status Indicator */}
      {/* {!isInitialLoading && campaigns.length > 0 && (
        <div className="px-3 md:px-8 md:pl-9 mb-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            {shouldUseCache() ? (
              <>
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Showing cached campaigns data</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span>Showing fresh campaigns data from API</span>
              </>
            )}
          </div>
        </div>
      )} */}

      <div className="flex mt-3 px-3 md:p-8 items-start">
        <div className="md:pl-9" style={{flex: 1}}>
          <CampaignsGrid 
            campaigns={campaigns}
            error={error}
            isInitialLoad={isInitialLoading}
          />
        </div>
      </div>
      
      <ScrollToTop />
    </div>
  );
}
