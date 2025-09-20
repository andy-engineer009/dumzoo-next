'use client';

import { useEffect, useRef, useCallback } from 'react';

interface MemoryManagerOptions {
  memoryThreshold?: number; // MB
  cleanupInterval?: number; // milliseconds
  maxSessionStorageSize?: number; // MB
  maxCachedImages?: number;
  enableLogging?: boolean;
}

interface MemoryInfo {
  used: number;
  total: number;
  limit: number;
  percentage: number;
}

export function useMemoryManager(options: MemoryManagerOptions = {}) {
  const {
    memoryThreshold = 150, // 150MB default
    cleanupInterval = 30000, // 30 seconds
    maxSessionStorageSize = 10, // 10MB
    maxCachedImages = 50,
    enableLogging = true
  } = options;

  const cleanupTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isCleaningRef = useRef(false);

  // Get memory information
  const getMemoryInfo = useCallback((): MemoryInfo | null => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const used = memory.usedJSHeapSize / 1024 / 1024; // Convert to MB
      const total = memory.totalJSHeapSize / 1024 / 1024;
      const limit = memory.jsHeapSizeLimit / 1024 / 1024;
      
      return {
        used: Math.round(used),
        total: Math.round(total),
        limit: Math.round(limit),
        percentage: Math.round((used / limit) * 100)
      };
    }
    return null;
  }, []);

  // Clean up old sessionStorage data
  const cleanSessionStorage = useCallback(() => {
    try {
      const sessionKeys = Object.keys(sessionStorage);
      let cleanedCount = 0;
      let totalSize = 0;

      // Calculate current sessionStorage size
      sessionKeys.forEach(key => {
        const value = sessionStorage.getItem(key);
        if (value) {
          totalSize += key.length + value.length;
        }
      });

      const sizeInMB = totalSize / 1024 / 1024;

      if (enableLogging) {
        console.log(`🧹 SessionStorage: ${sessionKeys.length} items, ${sizeInMB.toFixed(2)}MB`);
      }

      // Clean up if size exceeds limit
      if (sizeInMB > maxSessionStorageSize) {
        // Sort by access time (oldest first)
        const sortedKeys = sessionKeys.sort((a, b) => {
          const aTime = sessionStorage.getItem(`_access_${a}`);
          const bTime = sessionStorage.getItem(`_access_${b}`);
          return (aTime ? parseInt(aTime) : 0) - (bTime ? parseInt(bTime) : 0);
        });

        // Remove oldest 30% of items
        const itemsToRemove = Math.floor(sortedKeys.length * 0.3);
        for (let i = 0; i < itemsToRemove; i++) {
          const key = sortedKeys[i];
          sessionStorage.removeItem(key);
          sessionStorage.removeItem(`_access_${key}`);
          cleanedCount++;
        }

        if (enableLogging) {
          console.log(`✅ Cleaned ${cleanedCount} old sessionStorage items`);
        }
      }
    } catch (error) {
      console.error('❌ Error cleaning sessionStorage:', error);
    }
  }, [maxSessionStorageSize, enableLogging]);

  // Clean up cached images that aren't visible
  const cleanCachedImages = useCallback(() => {
    try {
      const images = document.querySelectorAll('img');
      const visibleImages = new Set();
      
      // Find visible images
      images.forEach(img => {
        const rect = img.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        if (isVisible) {
          visibleImages.add(img.src);
        }
      });

      // Clean up non-visible images
      let cleanedCount = 0;
      images.forEach(img => {
        if (!visibleImages.has(img.src) && img.src.startsWith('blob:')) {
          // Remove blob URLs (cached images)
          URL.revokeObjectURL(img.src);
          cleanedCount++;
        }
      });

      if (enableLogging && cleanedCount > 0) {
        console.log(`✅ Cleaned ${cleanedCount} cached images`);
      }
    } catch (error) {
      console.error('❌ Error cleaning cached images:', error);
    }
  }, [enableLogging]);

  // Clean up unused JavaScript objects
  const cleanUnusedObjects = useCallback(() => {
    try {
      // Force garbage collection if available
      if (window.gc) {
        window.gc();
        if (enableLogging) {
          console.log('✅ Forced garbage collection');
        }
      }

      // Clean up any global caches or unused references
      // This is a placeholder for app-specific cleanup
      if (window.__APP_CACHE__) {
        const cache = window.__APP_CACHE__;
        const keys = Object.keys(cache);
        const now = Date.now();
        let cleanedCount = 0;

        keys.forEach(key => {
          const item = cache[key];
          if (item && item.timestamp && (now - item.timestamp) > 300000) { // 5 minutes
            delete cache[key];
            cleanedCount++;
          }
        });

        if (enableLogging && cleanedCount > 0) {
          console.log(`✅ Cleaned ${cleanedCount} unused cache objects`);
        }
      }
    } catch (error) {
      console.error('❌ Error cleaning unused objects:', error);
    }
  }, [enableLogging]);

  // Clean up browser cache data
  const cleanBrowserCache = useCallback(() => {
    try {
      // Clear old cache entries if service worker is available
      if ('serviceWorker' in navigator && 'caches' in window) {
        caches.keys().then(cacheNames => {
          const oldCaches = cacheNames.filter(name => {
            // Remove caches older than 1 hour
            return name.includes('old-') || name.includes('temp-');
          });

          oldCaches.forEach(cacheName => {
            caches.delete(cacheName);
            if (enableLogging) {
              console.log(`✅ Deleted old cache: ${cacheName}`);
            }
          });
        });
      }

      // Clear old IndexedDB data if needed
      if ('indexedDB' in window) {
        // This would be app-specific implementation
        // For now, just log that we could clean IndexedDB
        if (enableLogging) {
          console.log('🔍 IndexedDB cleanup available (app-specific)');
        }
      }
    } catch (error) {
      console.error('❌ Error cleaning browser cache:', error);
    }
  }, [enableLogging]);

  // Main cleanup function
  const performCleanup = useCallback(() => {
    if (isCleaningRef.current) return;
    
    isCleaningRef.current = true;
    
    try {
      const memoryInfo = getMemoryInfo();
      
      if (enableLogging) {
        console.log('🧹 Starting memory cleanup...', memoryInfo);
      }

      // Always clean sessionStorage
      cleanSessionStorage();

      // Clean cached images
      cleanCachedImages();

      // Clean unused objects
      cleanUnusedObjects();

      // Clean browser cache
      cleanBrowserCache();

      // Check if we need more aggressive cleanup
      if (memoryInfo && memoryInfo.percentage > 80) {
        if (enableLogging) {
          console.log('⚠️ High memory usage detected, performing aggressive cleanup');
        }
        
        // More aggressive cleanup
        cleanSessionStorage(); // Run again
        cleanCachedImages(); // Run again
        
        // Force garbage collection
        if (window.gc) {
          window.gc();
        }
      }

      if (enableLogging) {
        const newMemoryInfo = getMemoryInfo();
        console.log('✅ Memory cleanup completed', newMemoryInfo);
      }
    } catch (error) {
      console.error('❌ Error during memory cleanup:', error);
    } finally {
      isCleaningRef.current = false;
    }
  }, [getMemoryInfo, cleanSessionStorage, cleanCachedImages, cleanUnusedObjects, cleanBrowserCache, enableLogging]);

  // Schedule next cleanup
  const scheduleNextCleanup = useCallback(() => {
    if (cleanupTimeoutRef.current) {
      clearTimeout(cleanupTimeoutRef.current);
    }

    cleanupTimeoutRef.current = setTimeout(() => {
      performCleanup();
      scheduleNextCleanup(); // Schedule next cleanup
    }, cleanupInterval);
  }, [performCleanup, cleanupInterval]);

  // Initialize memory manager
  useEffect(() => {
    if (enableLogging) {
      console.log('🚀 Memory Manager initialized', {
        memoryThreshold,
        cleanupInterval,
        maxSessionStorageSize,
        maxCachedImages
      });
    }

    // Start cleanup cycle
    scheduleNextCleanup();

    // Cleanup on unmount
    return () => {
      if (cleanupTimeoutRef.current) {
        clearTimeout(cleanupTimeoutRef.current);
      }
    };
  }, [scheduleNextCleanup, memoryThreshold, cleanupInterval, maxSessionStorageSize, maxCachedImages, enableLogging]);

  // Manual cleanup function
  const manualCleanup = useCallback(() => {
    performCleanup();
  }, [performCleanup]);

  // Get current memory status
  const getMemoryStatus = useCallback(() => {
    return getMemoryInfo();
  }, [getMemoryInfo]);

  return {
    manualCleanup,
    getMemoryStatus,
    isCleaning: isCleaningRef.current
  };
}
