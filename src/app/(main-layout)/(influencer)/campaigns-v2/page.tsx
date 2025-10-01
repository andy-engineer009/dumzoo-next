'use client';
import React from 'react';
import VirtualCampaignList from "@/components/manage-campaign-list/VirtualCampaignList";

export default function CampaignsV2() {
  return (
    <>
      {/* Virtual Campaign List Component with useInfiniteQuery */}
      <VirtualCampaignList userRole="2" />
    </>
  );
}

