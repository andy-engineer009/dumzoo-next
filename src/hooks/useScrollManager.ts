import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

interface ScrollData {
  position: number;
  direction: 'up' | 'down';
  isAtTop: boolean;
  isAtBottom: boolean;
  velocity: number;
  isScrolling: boolean;
}

interface ScrollManagerOptions {
  throttleMs?: number;
  savePosition?: boolean;
  onScroll?: (data: ScrollData) => void;
  threshold?: number;
  priority?: number;
}

interface ScrollSubscriber {
  id: string;
  callback: (data: ScrollData) => void;
  priority: number;
}

class ScrollManager {
  private static instance: ScrollManager;
  private subscribers: Map<string, ScrollSubscriber> = new Map();
  private lastPosition = 0;
  private lastTime = Date.now();
  private isScrolling = false;
  private scrollTimeout: NodeJS.Timeout | null = null;
  private rafId: number | null = null;
  private throttleMs = 16; // 60fps default
  private savePosition = false;
  private threshold = 1;

  // Cached DOM measurements
  private cachedScrollHeight = 0;
  private cachedWindowHeight = 0;
  private lastCacheUpdate = 0;
  private cacheUpdateInterval = 1000; // Update cache every 1 second

  private constructor() {
    this.handleScroll = this.handleScroll.bind(this);
    this.updateCache = this.updateCache.bind(this);
  }

  static getInstance(): ScrollManager {
    if (!ScrollManager.instance) {
      ScrollManager.instance = new ScrollManager();
    }
    return ScrollManager.instance;
  }

  private updateCache() {
    const now = Date.now();
    if (now - this.lastCacheUpdate > this.cacheUpdateInterval) {
      this.cachedScrollHeight = document.body.scrollHeight;
      this.cachedWindowHeight = window.innerHeight;
      this.lastCacheUpdate = now;
    }
  }

  private calculateScrollData(): ScrollData {
    const currentTime = Date.now();
    const currentPosition = window.scrollY;
    const timeDiff = currentTime - this.lastTime;
    const positionDiff = currentPosition - this.lastPosition;

    // Update cache periodically
    this.updateCache();

    // Calculate velocity (pixels per second)
    const velocity = timeDiff > 0 ? Math.abs(positionDiff) / (timeDiff / 1000) : 0;

    // Adaptive throttling based on velocity
    this.throttleMs = this.getAdaptiveThrottle(velocity);

    return {
      position: currentPosition,
      direction: currentPosition > this.lastPosition ? 'down' : 'up',
      isAtTop: currentPosition < 100,
      isAtBottom: currentPosition + this.cachedWindowHeight >= this.cachedScrollHeight - 100,
      velocity,
      isScrolling: this.isScrolling
    };
  }

  private getAdaptiveThrottle(velocity: number): number {
    // Adaptive throttling like YouTube/Instagram
    if (velocity > 1000) return 8;   // Very fast: 120fps
    if (velocity > 500) return 16;   // Fast: 60fps
    if (velocity > 200) return 33;   // Medium: 30fps
    if (velocity > 50) return 50;    // Slow: 20fps
    return 100; // Very slow: 10fps
  }

  private handleScroll() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }

    this.rafId = requestAnimationFrame(() => {
      const scrollData = this.calculateScrollData();

      // Only update if position changed significantly
      if (Math.abs(scrollData.position - this.lastPosition) < this.threshold) {
        return;
      }


      // Save position if requested (throttled)
      if (this.savePosition && Math.abs(scrollData.position - this.lastPosition) > 10) {
        sessionStorage.setItem('scrollPosition', scrollData.position.toString());
      }

      // Update state
      this.lastPosition = scrollData.position;
      this.lastTime = Date.now();
      this.isScrolling = true;

      // Notify all subscribers
      const sortedSubscribers = Array.from(this.subscribers.values())
        .sort((a, b) => a.priority - b.priority);

      sortedSubscribers.forEach(subscriber => {
        try {
          subscriber.callback(scrollData);
        } catch (error) {
          console.error('Scroll subscriber error:', error);
        }
      });

      // Reset scrolling flag after delay
      if (this.scrollTimeout) {
        clearTimeout(this.scrollTimeout);
      }
      this.scrollTimeout = setTimeout(() => {
        this.isScrolling = false;
      }, 150);
    });
  }

  subscribe(id: string, callback: (data: ScrollData) => void, priority = 0): () => void {
    this.subscribers.set(id, { id, callback, priority });

    // Start listening if this is the first subscriber
    if (this.subscribers.size === 1) {
      window.addEventListener('scroll', this.handleScroll, { passive: true });
    }

    // Return unsubscribe function
    return () => {
      this.subscribers.delete(id);
      
      // Stop listening if no more subscribers
      if (this.subscribers.size === 0) {
        window.removeEventListener('scroll', this.handleScroll);
        if (this.rafId) {
          cancelAnimationFrame(this.rafId);
        }
        if (this.scrollTimeout) {
          clearTimeout(this.scrollTimeout);
        }
      }
    };
  }

  configure(options: ScrollManagerOptions) {
    this.throttleMs = options.throttleMs || 16;
    this.savePosition = options.savePosition || false;
    this.threshold = options.threshold || 1;
  }

  getCurrentData(): ScrollData {
    return this.calculateScrollData();
  }

  restorePosition() {
    if (this.savePosition) {
      const savedPosition = sessionStorage.getItem('scrollPosition');
      if (savedPosition && parseInt(savedPosition) > 0) {
        requestAnimationFrame(() => {
          window.scrollTo(0, parseInt(savedPosition));
        });
      }
    }
  }
}

export const useScrollManager = (options: ScrollManagerOptions = {}) => {
  const [scrollData, setScrollData] = useState<ScrollData>({
    position: 0,
    direction: 'down',
    isAtTop: true,
    isAtBottom: false,
    velocity: 0,
    isScrolling: false
  });

  const managerRef = useRef<ScrollManager | undefined>(undefined);
  const subscriberIdRef = useRef<string | undefined>(undefined);

  // Use ref to store the latest callback to avoid re-subscribing
  const onScrollRef = useRef(options.onScroll);
  onScrollRef.current = options.onScroll;

  useEffect(() => {
    managerRef.current = ScrollManager.getInstance();
    managerRef.current.configure(options);

    // Generate unique subscriber ID
    subscriberIdRef.current = `scroll_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Subscribe to scroll events
    const unsubscribe = managerRef.current.subscribe(
      subscriberIdRef.current,
      (data) => {
        setScrollData(data);
        onScrollRef.current?.(data);
      },
      options.priority || 0
    );

    // Restore position if requested
    if (options.savePosition) {
      managerRef.current.restorePosition();
    }

    return () => {
      unsubscribe();
    };
  }, [options.priority, options.savePosition, options.throttleMs, options.threshold]);

  return scrollData;
};
