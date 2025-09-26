'use client';
import { useVirtualizer } from '@tanstack/react-virtual';
import React, { useState, useEffect } from 'react';
import InfluencerCard from "@/components/influencer/InfulancerCard";

interface VirtualInfluencerListProps {
  influencers: any[];
  loading: boolean;
}

export default function VirtualInfluencerList({ influencers, loading }: VirtualInfluencerListProps) {
  // The scrollable element for your list
  const parentRef = React.useRef<HTMLDivElement>(null);
  const [scrollPos, setScrollPos] = useState(0); // ✅ Track scroll position

  // The virtualizer
  const rowVirtualizer = useVirtualizer({
    count: influencers.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 130, // Height of each influencer card
  });

  // ✅ Listen for scroll events and update scrollPos
  useEffect(() => {
    const el = parentRef.current;
    if (!el) return;

    const handleScroll = () => {
      // TanStack's internal offset is most accurate
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
  );
}
