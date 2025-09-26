<!-- 'use client';
import { useVirtualizer } from '@tanstack/react-virtual';
import React, { useState, useEffect } from 'react';
import InfluencerCard from "@/components/influencer/InfulancerCard";
import { influencerApi } from '@/services/infiniteScrollApi';

export default function Discover() {
  // The scrollable element for your list
  const parentRef = React.useRef(null);
  
  // State for API data
  const [influencers, setInfluencers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [scrollPos, setScrollPos] = useState(0); // ✅ Track scroll position


  // Load data from API with limit 500
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const result = await influencerApi.fetchInfluencers(0, 200, {});
        setInfluencers(result.data);
        console.log('Loaded influencers:', result.data.length);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  // The virtualizer
  const rowVirtualizer = useVirtualizer({
    count: influencers.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 130, // Height of each influencer card
  });

    // ✅ Listen for scroll events and update scrollPos
    useEffect(() => {
      const el = parentRef.current as unknown as HTMLElement;
      if (!el) return;
  
      const handleScroll = () => {
        // TanStack’s internal offset is most accurate
        setScrollPos(rowVirtualizer.scrollOffset || 0);
      };
  
      el.addEventListener('scroll', handleScroll);
      return () => el.removeEventListener('scroll', handleScroll);
    }, [rowVirtualizer]);
  
    useEffect(() => {
      console.log('Current scroll position:', scrollPos);
    }, [scrollPos]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1fb036]"></div>
      </div>
    );
  }

  return (
    <>
      {/* The scrollable element for your list */}
      <div
        ref={parentRef}
        style={{
          height: `87vh`,
          overflow: 'auto', // Make it scroll!
        }}
      >
        {/* The large inner element to hold all of the items */}
        <div
          style={{
            height: `130px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {/* Only the visible items in the virtualizer, manually positioned to be in view */}
          {rowVirtualizer.getVirtualItems().map((virtualItem) => {
            const influencer = influencers[virtualItem.index];
            return (
              <div
                key={virtualItem.key}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `100%`,
                  transform: `translateY(${virtualItem.start}px)`,
                }}
                className="p-2"
              >
                {influencer ? (
                  <InfluencerCard data={influencer} />
                ) : (
                  <div>Loading...</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
} -->