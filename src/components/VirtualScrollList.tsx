'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useScrollManager } from '@/hooks/useScrollManager';

interface VirtualScrollListProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  overscan?: number;
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoading?: boolean;
  className?: string;
}

function VirtualScrollList<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  overscan = 5,
  onLoadMore,
  hasMore = false,
  isLoading = false,
  className = ''
}: VirtualScrollListProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);

  // Use scroll manager for optimal performance
  const scrollData = useScrollManager({
    onScroll: useCallback((data) => {
      if (containerRef.current) {
        setScrollTop(containerRef.current.scrollTop);
      }
    }, []),
    priority: 1
  });

  // Calculate visible range
  const visibleRange = useMemo(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    );
    
    return { startIndex, endIndex };
  }, [scrollTop, itemHeight, containerHeight, items.length, overscan]);

  // Get visible items
  const visibleItems = useMemo(() => {
    const { startIndex, endIndex } = visibleRange;
    const result = [];
    
    for (let i = startIndex; i <= endIndex; i++) {
      if (items[i]) {
        result.push({
          item: items[i],
          index: i,
          top: i * itemHeight
        });
      }
    }
    
    return result;
  }, [items, visibleRange, itemHeight]);

  // Handle infinite scroll
  useEffect(() => {
    if (hasMore && !isLoading && scrollData.isAtBottom) {
      onLoadMore?.();
    }
  }, [scrollData.isAtBottom, hasMore, isLoading, onLoadMore]);

  // Total height for scrollbar
  const totalHeight = items.length * itemHeight;

  return (
    <div
      ref={containerRef}
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
      onScroll={(e) => {
        setScrollTop(e.currentTarget.scrollTop);
      }}
    >
      {/* Virtual spacer for total height */}
      <div style={{ height: totalHeight, position: 'relative' }}>
        {/* Render only visible items */}
        {visibleItems.map(({ item, index, top }) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              top,
              height: itemHeight,
              width: '100%'
            }}
          >
            {renderItem(item, index)}
          </div>
        ))}
        
        {/* Loading indicator at bottom */}
        {isLoading && hasMore && (
          <div
            style={{
              position: 'absolute',
              top: totalHeight,
              height: 60,
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>
    </div>
  );
}

export default VirtualScrollList;
