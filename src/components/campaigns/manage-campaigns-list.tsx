'use client'

import { api } from "@/common/services/rest-api/rest-api";
import { useEffect } from "react";
import { API_ROUTES } from "@/appApi";

import { useState } from "react";
import CampaignCard from "./campaign-card";
import Link from "next/link";
import { useToast } from "@/components/toast";
import { useRouter } from "next/router";

export default function CampaignsList() {
    const [campaigns, setCampaigns] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const { showError } = useToast();
    // const router = useRouter();
    
    useEffect(() => {
        setIsLoading(true);   
        api.post(API_ROUTES.campaignList, {
            start: 0,
            length: 10
        }).then((res) => {
            setIsLoading(false);   
            if(res.status == 1){
              setCampaigns(res.data);
            }
            else{
              showError(res.message, 2000);
            }
            console.log(res.data);
        })
        
    },[])
    
  return (
    <>
    <div className="promotoradded_campaigns_list pb-[100px]">
      
        {/* Header */}
        <div className="w-full px-2 py-3 border-b border-gray-200 sticky top-0 z-[100] bg-white">
          <div className="relative">
            <Link
              href="/profile"
              className="mr-2 p-2 hover:bg-gray-100 rounded-full transition-colors absolute left-0 top-1/2 -translate-y-1/2"
            >
               <svg className="w-6 h-6 text-gray-600 hover:text-gray-900 " fill="none" stroke="#ccc" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            </Link>
            <h1 className="text-lg font-medium text-gray-900 text-center">Manage Campaigns</h1>
          </div>
        </div>
      {
        campaigns.map((campaign: any) => ( 
          <CampaignCard key={campaign.id} campaign={campaign} userRole={3} />
        ))
      }
    </div>


       {/* Bottom Action Bar */}
       <nav className="hire-now fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-4 px-6 z-30">
            <Link  
              href="/create-campaign"
            className="block w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors text-center"
            >
            Create Campaign
            </Link>
        </nav>
        </>
        
  );
}
