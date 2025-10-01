'use client';
import Link from "next/link";
import { useState, useCallback } from "react";
import ScrollToTop from "@/components/ScrollToTop";
// import { CampaignGrid } from "@/components/manage-campaign-list";
// import { useCampaignStore } from "@/components/manage-campaign-list";
import CampaignCard from "@/components/campaigns/campaign-card";
import CampaignSkeleton from "./CampaignSkeleton";

export default function CampaignsDiscover() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Use the Redux store
  // const { filters, updateFilters } = useCampaignStore();

  // Render function for each campaign item
  const renderCampaign = useCallback((campaign: any, index: number) => (
    <CampaignCard
      campaign={campaign}
      userRole={2}
    />
  ), []);

  // Render function for campaign skeleton
  const renderCampaignSkeleton = useCallback((index: number) => (
    <CampaignSkeleton />
  ), []);

  const handleFilterChange = (newFilters: any) => {
    console.log("🎯 [CAMPAIGN FILTER COMPONENT] handleFilterChange called with:", newFilters);
    // updateFilters(newFilters);
  };

  return (
    <>
  
      <header className="sticky top-0 z-20 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-center relative">
          <h1 className="text-lg font-medium text-gray-900"> Find Promotions</h1>
        </div>
      </header>

      <div className="flex mt-3 px-3 md:p-8 items-start">
        <div className="md:pl-9" style={{flex: 1}}>
          {/* <CampaignGrid
            renderItem={renderCampaign}
            renderSkeleton={renderCampaignSkeleton}
            pageSize={15}
            threshold={0.1}
            rootMargin="0px 0px 200px 0px"
            gridClassName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 pb-20 md:pb-0"
          /> */}
        </div>
      </div>
      
      <ScrollToTop />
    </>
  );
}
