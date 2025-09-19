'use client';

import { useMemoryManager } from '@/hooks/useMemoryManager';

export const MemoryManager = () => {
  useMemoryManager({
    maxMemoryMB: 150, // Allow up to 150MB on mobile
    cleanupInterval: 30000, // Check every 30 seconds
    onMemoryWarning: () => {
      console.warn('Memory usage high - triggering cleanup');
      // Could dispatch a Redux action to clear old data
    }
  });

  // This component doesn't render anything
  return null;
};
