'use client';
import Link from "next/link";
import InfiniteScrollGrid from "@/components/common/InfiniteScrollGrid";
import CampaignCard from "@/components/campaigns/campaign-card";
import CampaignSkeleton from "./CampaignSkeleton";
import { useState, useCallback } from "react";
import { campaignApi } from "@/services/infiniteScrollApi";
import ScrollToTop from "@/components/ScrollToTop";

export default function CampaignsDiscover() {
  const [filters, setFilters] = useState({});

  // Helper function to clean filters
  const cleanFilters = (filters: any) => {
    const cleaned: any = {};
    
    Object.keys(filters).forEach(key => {
      const value = filters[key];
      if (value !== null && value !== undefined && value !== '' && value !== 'all') {
        cleaned[key] = value;
      }
    });
    
    return cleaned;
  };

  // Fetch function for infinite scroll
  const fetchCampaigns = useCallback(async (page: number, limit?: number) => {
    const cleanedFilters = cleanFilters(filters);
    return await campaignApi.fetchCampaigns(page, limit, cleanedFilters);
  }, [filters]);

  // Render function for each campaign item
  const renderCampaign = useCallback((campaign: any, index: number) => (
    <CampaignCard 
      key={index}
      campaign={campaign} 
      userRole={2} 
    />
  ), []);

  // Render function for campaign skeleton
  const renderCampaignSkeleton = useCallback((index: number) => (
    <CampaignSkeleton key={`skeleton-${index}`} />
  ), []);

  return (
    <>
      <div className="flex justify-between items-center px-3 md:px-8 pt-4">
        <h1 className="text-2xl font-bold text-gray-900">Campaigns</h1>
        <Link 
          href="/campaigns/create" 
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Create Campaign
        </Link>
        </div>

      <div className="flex mt-3 px-3 md:p-8 items-start">
        <div className="md:pl-9" style={{flex: 1}}>
          <InfiniteScrollGrid
            fetchFunction={fetchCampaigns}
            renderItem={renderCampaign}
            renderSkeleton={renderCampaignSkeleton}
            pageSize={12}
            maxItems={200}
            threshold={0.1}
            rootMargin="0px 0px 200px 0px"
            prefetchDistance={5}
            gridClassName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 pb-20 md:pb-0"
          />
        </div>
      </div>
      
      <ScrollToTop />
    </>
  );
}