'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import AwarePopup from '../aware-popup';
import Link from 'next/link';

const CampaignDetails = ({
  id,
  title,
  description,
  budget,
  image,
  categories,
  languages,
  gender,
  minimumFollowers,
  platforms,
  genderPreferences,
  ageGroups,
  brand = 'Brand Name',
  postedDate = '2 days ago'
}: any) => {
  const [isAwareOpen, setIsAwareOpen] = useState(false);
  const router = useRouter();

  const formatCurrency = (amount: number): string => {
    if(amount === 0 && amount === null) {
      return 'Free';
    }
    return `₹${amount.toLocaleString()}`;
  };

  const formatFollowers = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const handleApply = () => {
    setIsAwareOpen(true);
  };

  const handleApplyRedirection = () => {
    setIsAwareOpen(false);
    // Redirect to application form or chat
    router.push(`/campaigns/${id}/apply`);
    console.log('Applying to campaign:', title);
  };

  return (
    <>
      <div className="min-h-screen bg-white">
        {/* Main Content */}
        <main className="pb-24">
          {/* Top Banner Image */}
          <section className="relative">
            <div className="relative h-[200px] bg-gradient-to-br from-blue-100 to-purple-100">
              {/* Back Icon - absolute left */}
              <button
                onClick={() => router.back()}
                className="absolute top-4 left-4 z-10 p-2 bg-white/80 rounded-full shadow hover:bg-white transition-colors"
                aria-label="Go back"
                type="button"
              >
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              {/* Campaign Image */}
              <div className="w-full h-full flex items-center justify-center">
                {image ? (
                  <Image
                    src={image}
                    alt={title}
                    width={400}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500 text-lg">Campaign Image</span>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Campaign Information */}
          <section className="px-4 py-6">
            {/* Main Title */}
            <h1 className="text-2xl font-bold text-black mb-3">
              {title}
            </h1>

            {/* Posted Date and Brand */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-500">by {brand}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">{postedDate}</span>
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>

            {/* Budget */}
            <div className="mb-6 flex items-center justify-between">
              <span className="inline-block bg-blue-100 text-blue-800 font-semibold px-4 py-2 rounded-lg">
                Budget: {formatCurrency(budget)}
              </span>
              <div className="flex items-center gap-2">
                {/* Platform Icons */}
                {platforms.map((platform: any, index: any) => (
                  <div key={index} className="w-6 h-6 border-2 border-black rounded-lg flex items-center justify-center">
                    {platform.toLowerCase() === 'instagram' && (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    )}
                    {platform.toLowerCase() === 'youtube' && (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M21.8 8.001a2.75 2.75 0 0 0-1.94-1.94C18.1 6 12 6 12 6s-6.1 0-7.86.06a2.75 2.75 0 0 0-1.94 1.94A28.6 28.6 0 0 0 2 12a28.6 28.6 0 0 0 .2 3.999 2.75 2.75 0 0 0 1.94 1.94C5.9 18 12 18 12 18s6.1 0 7.86-.06a2.75 2.75 0 0 0 1.94-1.94A28.6 28.6 0 0 0 22 12a28.6 28.6 0 0 0-.2-3.999zM10 15.5v-7l6 3.5-6 3.5z"/>
                      </svg>
                    )}
                    {platform.toLowerCase() === 'facebook' && (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M22 12c0-5.522-4.477-10-10-10S2 6.478 2 12c0 5 3.657 9.127 8.438 9.877v-6.987h-2.54v-2.89h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.242 0-1.63.771-1.63 1.562v1.875h2.773l-.443 2.89h-2.33v6.987C18.343 21.127 22 17 22 12"/>
                      </svg>
                    )}
                    {platform.toLowerCase() === 'tiktok' && (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-.88-.05A6.33 6.33 0 0 0 4 15.22a6.34 6.34 0 0 0 10.12 5.04 6.34 6.34 0 0 0 5.47-13.57z"/>
                      </svg>
                    )}
                    {platform.toLowerCase() === 'twitter' && (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Campaign Details Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm font-bold text-black mb-1">Minimum Followers</p>
                <p className="text-sm text-black">{formatFollowers(minimumFollowers)}</p>
              </div>
              <div>
                <p className="text-sm font-bold text-black mb-1">Gender</p>
                <p className="text-sm text-black">{gender}</p>
              </div>
              <div>
                <p className="text-sm font-bold text-black mb-1">Gender Preferences</p>
                <p className="text-sm text-black">{genderPreferences.join(', ')}</p>
              </div>
              <div>
                <p className="text-sm font-bold text-black mb-1">Age Groups</p>
                <p className="text-sm text-black">{ageGroups.join(', ')}</p>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-sm font-bold text-black mb-2">Description</h3>
              <p className="text-sm text-black leading-relaxed">
                {description}
              </p>
            </div>

            {/* Categories */}
            <div className="mb-6">
              <h3 className="text-sm font-bold text-black mb-3">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat: any, index: any) => (
                  <span key={index} className="px-3 py-2 bg-gray-200 text-black text-sm rounded-lg">
                    {cat.trim()}
                  </span>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div className="mb-6">
              <h3 className="text-sm font-bold text-black mb-3">Languages</h3>
              <div className="flex flex-wrap gap-2">
                {languages.map((lang: any, index: any) => (
                  <span key={index} className="px-3 py-2 bg-blue-100 text-blue-800 text-sm rounded-lg">
                    {lang.trim()}
                  </span>
                ))}
              </div>
            </div>

            {/* Platforms */}
            {/* <div className="mb-6">
              <h3 className="text-sm font-semibold text-black mb-3">Platforms</h3>
              <div className="flex flex-wrap gap-2">
                {platforms.map((platform: any, index: any) => (
                  <span key={index} className="px-3 py-2 bg-green-100 text-green-800 text-sm rounded-lg">
                    {platform}
                  </span>
                ))}
              </div>
            </div> */}
          </section>
        </main>

        {/* Bottom Action Bar */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-4 px-6 z-30">
          <button 
            onClick={handleApply}
            className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
          >
            Apply Now
          </button>
        </nav>
      </div>

      <AwarePopup
        isOpen={isAwareOpen}
        onClose={() => setIsAwareOpen(false)}
        onProceed={() => handleApplyRedirection()}
        influencerName={title}
      />
    </>
  );
};

export default CampaignDetails;
