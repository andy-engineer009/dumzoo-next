'use client';
import Link from "next/link";
import { useState } from "react";
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 pb-20 md:pb-0">
            {/* Campaigns will be loaded here */}
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600">Campaigns loading...</p>
            </div>
          </div>
        </div>
      </div>
      
      <ScrollToTop />
    </>
  );
}
