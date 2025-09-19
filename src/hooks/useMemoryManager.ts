import { useEffect, useRef } from 'react';

interface MemoryManagerOptions {
  maxMemoryMB?: number;
  cleanupInterval?: number;
  onMemoryWarning?: () => void;
}

export const useMemoryManager = (options: MemoryManagerOptions = {}) => {
  const {
    maxMemoryMB = 100,
    cleanupInterval = 30000, // 30 seconds
    onMemoryWarning
  } = options;

  const cleanupRef = useRef<NodeJS.Timeout>();

  const checkMemoryUsage = () => {
    // Check if performance.memory is available (Chrome/Edge)
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const usedMB = memory.usedJSHeapSize / 1024 / 1024;
      
      if (usedMB > maxMemoryMB) {
        console.warn(`Memory usage high: ${usedMB.toFixed(2)}MB`);
        onMemoryWarning?.();
        
        // Force garbage collection if available
        if ('gc' in window && typeof (window as any).gc === 'function') {
          (window as any).gc();
        }
      }
    }
  };

  const cleanupMemory = () => {
    // Clear any pending timeouts
    if (cleanupRef.current) {
      clearTimeout(cleanupRef.current);
    }

    // Clear sessionStorage of old data
    const keysToRemove: string[] = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && key.startsWith('scroll_') && Date.now() - parseInt(key.split('_')[1]) > 300000) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => sessionStorage.removeItem(key));

    // Force garbage collection if available
    if ('gc' in window && typeof (window as any).gc === 'function') {
      (window as any).gc();
    }
  };

  useEffect(() => {
    // Start memory monitoring
    const interval = setInterval(() => {
      checkMemoryUsage();
      cleanupMemory();
    }, cleanupInterval);

    // Cleanup on unmount
    return () => {
      clearInterval(interval);
      cleanupMemory();
    };
  }, [cleanupInterval, maxMemoryMB, onMemoryWarning]);

  return {
    checkMemoryUsage,
    cleanupMemory
  };
};
