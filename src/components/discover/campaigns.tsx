'use client';
import CampaignCard from "@/components/campaigns/campaign-card";
import Link from "next/link";
import { useState } from "react";

export default function CampaignsDiscover() {
    const [expandedCampaigns, setExpandedCampaigns] = useState<Set<string>>(new Set());

    const isExpanded = (id: string) => expandedCampaigns.has(id);
    const toggleCampaignExpansion = (id: string) => {
        const newExpandedCampaigns = new Set(expandedCampaigns);
        newExpandedCampaigns.has(id) ? newExpandedCampaigns.delete(id) : newExpandedCampaigns.add(id);
        setExpandedCampaigns(newExpandedCampaigns);
    };

    const campaignList = [
        {
            id: '1',
            title: 'Campaign 1',
            description: 'This is the first campaign',
            fullDescription: 'This is the full description of the first campaign',
            status: 'active',
            statusColor: 'bg-green-500',
            statusText: 'Active',
            dueDate: '2025-01-01',
            createdAt: '2025-01-01',
            updatedAt: '2025-01-01',
        },
        {
            id: '2',
            title: 'Campaign 1',
            description: 'This is the first campaign',
            fullDescription: 'This is the full description of the first campaign',
            status: 'active',
            statusColor: 'bg-green-500',
            statusText: 'Active',
            dueDate: '2025-01-01',
            createdAt: '2025-01-01',
            updatedAt: '2025-01-01',
        }
    ]

    return (
        <>
             <div className="flex items-center py-3">
          <Link href="/" className="absolute left-4">
          <svg className="w-6 h-6 text-gray-600 hover:text-gray-900 " fill="none" stroke="#ccc" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div className="flex-1 text-center">
            <h1 className="text-lg font-medium text-gray-900">Campaigns</h1>
            {/* <p className="text-sm text-gray-500">Upload your profile picture</p> */}
          </div>
        </div>
        {campaignList.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} isExpanded={isExpanded} toggleCampaignExpansion={toggleCampaignExpansion} />  
        ))}
        </>
    )
}
