'use client';

import React, { useEffect } from 'react';
import { useMemoryManager } from '@/hooks/useMemoryManager';

interface MemoryManagerProps {
  // Memory limits
  memoryThreshold?: number; // MB
  maxSessionStorageSize?: number; // MB
  maxCachedImages?: number;
  
  // Cleanup intervals
  cleanupInterval?: number; // milliseconds
  
  // Device-specific settings
  enableDeviceOptimization?: boolean;
  
  // Debugging
  enableLogging?: boolean;
  showDebugPanel?: boolean;
}

export default function MemoryManager({
  memoryThreshold = 150, // 150MB default
  maxSessionStorageSize = 10, // 10MB
  maxCachedImages = 50,
  cleanupInterval = 30000, // 30 seconds
  enableDeviceOptimization = true,
  enableLogging = true,
  showDebugPanel = false
}: MemoryManagerProps) {
  
  // Get device-specific settings
  const getDeviceSettings = () => {
    if (!enableDeviceOptimization) {
      return {
        memoryThreshold,
        maxSessionStorageSize,
        maxCachedImages,
        cleanupInterval
      };
    }

    // Detect device capabilities
    const deviceMemory = (navigator as any).deviceMemory || 4; // GB
    const hardwareConcurrency = navigator.hardwareConcurrency || 4;
    const connection = (navigator as any).connection?.effectiveType || '4g';

    // Adjust settings based on device
    let settings = {
      memoryThreshold: 150,
      maxSessionStorageSize: 10,
      maxCachedImages: 50,
      cleanupInterval: 30000
    };

    if (deviceMemory < 2) {
      // Low-end device
      settings = {
        memoryThreshold: 100,
        maxSessionStorageSize: 5,
        maxCachedImages: 25,
        cleanupInterval: 20000
      };
    } else if (deviceMemory < 4) {
      // Mid-range device
      settings = {
        memoryThreshold: 150,
        maxSessionStorageSize: 10,
        maxCachedImages: 50,
        cleanupInterval: 30000
      };
    } else {
      // High-end device
      settings = {
        memoryThreshold: 200,
        maxSessionStorageSize: 20,
        maxCachedImages: 100,
        cleanupInterval: 60000
      };
    }

    // Adjust based on network speed
    if (connection === 'slow-2g' || connection === '2g') {
      settings.cleanupInterval = Math.min(settings.cleanupInterval, 15000);
    }

    return settings;
  };

  const deviceSettings = getDeviceSettings();
  
  const { manualCleanup, getMemoryStatus, isCleaning } = useMemoryManager({
    memoryThreshold: deviceSettings.memoryThreshold,
    maxSessionStorageSize: deviceSettings.maxSessionStorageSize,
    maxCachedImages: deviceSettings.maxCachedImages,
    cleanupInterval: deviceSettings.cleanupInterval,
    enableLogging
  });

  // Log device settings on mount
  useEffect(() => {
    if (enableLogging) {
      // console.log('📱 Memory Manager - Device Settings:', 
      //   {
      //   deviceMemory: (navigator as any).deviceMemory || 'unknown',
      //   hardwareConcurrency: navigator.hardwareConcurrency || 'unknown',
      //   connection: (navigator as any).connection?.effectiveType || 'unknown',
      //   settings: deviceSettings
      // });
    }
  }, [deviceSettings, enableLogging]);

  // Debug panel removed - no frontend display needed

  // This component doesn't render anything visible
  return null;
}

// Export the hook for manual use
export { useMemoryManager } from '@/hooks/useMemoryManager';
