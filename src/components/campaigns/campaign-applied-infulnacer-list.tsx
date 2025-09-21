'use client'

import { useParams } from "next/navigation";
import Link from "next/link";

export default function CampaignsList() {
  const params = useParams();
  const campaign_id = params.id;

  console.log(campaign_id);


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

      <div className="flex mt-0 px-4 md:p-8 items-start pt-[10px]">
        <div className="md:pl-9" style={{flex: 1}}>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-6 pb-20 md:pb-0">
            {/* Applied influencers will be loaded here */}
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600">Applied influencers loading...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}