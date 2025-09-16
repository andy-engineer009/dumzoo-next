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



      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <div className="text-gray-500">Loading campaigns...</div>
        </div>
      ) : campaigns.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Campaigns Listed</h3>
          <p className="text-gray-500 text-center mb-6">You haven't created any campaigns yet. Start by creating your first campaign!</p>
          <Link
            href="/create-campaign"
            className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
          >
            Create Your First Campaign
          </Link>
        </div>
      ) : (
        campaigns.map((campaign: any) => ( 
          <CampaignCard key={campaign.id} campaign={campaign} userRole={3} />
        ))
      )}
    </div>


       {/* Bottom Action Bar */}
       {campaigns.length > 0 && (
         <nav className="hire-now fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-4 px-6 z-30">
            <Link  
              href="/create-campaign"
              className="block w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors text-center"
            >
              Create Campaign
            </Link>
         </nav>
       )}
        </>
        
  );
}
