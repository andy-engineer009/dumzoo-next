'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useOptimizedScroll } from '@/hooks/useOptimizedScroll';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Use optimized scroll hook instead of direct scroll listener
  const onScrollCallback = useCallback((scrollData: any) => {
    setIsVisible(scrollData.position > 300);
  }, []);

  useOptimizedScroll({
    throttleMs: 150,
    onScroll: onScrollCallback
  });

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110"
      aria-label="Scroll to top"
    >
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 10l7-7m0 0l7 7m-7-7v18"
        />
      </svg>
    </button>
  );
};

export default ScrollToTop;
