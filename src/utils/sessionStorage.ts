// Enhanced sessionStorage with access tracking for memory management

export class TrackedSessionStorage {
  private static instance: TrackedSessionStorage;
  
  static getInstance(): TrackedSessionStorage {
    if (!TrackedSessionStorage.instance) {
      TrackedSessionStorage.instance = new TrackedSessionStorage();
    }
    return TrackedSessionStorage.instance;
  }

  setItem(key: string, value: string): void {
    try {
      sessionStorage.setItem(key, value);
      // Track access time for memory cleanup
      sessionStorage.setItem(`_access_${key}`, Date.now().toString());
    } catch (error) {
      console.error('Error setting sessionStorage item:', error);
    }
  }

  getItem(key: string): string | null {
    try {
      const value = sessionStorage.getItem(key);
      if (value) {
        // Update access time
        sessionStorage.setItem(`_access_${key}`, Date.now().toString());
      }
      return value;
    } catch (error) {
      console.error('Error getting sessionStorage item:', error);
      return null;
    }
  }

  removeItem(key: string): void {
    try {
      sessionStorage.removeItem(key);
      sessionStorage.removeItem(`_access_${key}`);
    } catch (error) {
      console.error('Error removing sessionStorage item:', error);
    }
  }

  clear(): void {
    try {
      sessionStorage.clear();
    } catch (error) {
      console.error('Error clearing sessionStorage:', error);
    }
  }

  getSize(): number {
    let totalSize = 0;
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && !key.startsWith('_access_')) {
        const value = sessionStorage.getItem(key);
        if (value) {
          totalSize += key.length + value.length;
        }
      }
    }
    return totalSize;
  }

  getSizeInMB(): number {
    return this.getSize() / 1024 / 1024;
  }

  getItemCount(): number {
    let count = 0;
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && !key.startsWith('_access_')) {
        count++;
      }
    }
    return count;
  }
}

// Export singleton instance
export const trackedSessionStorage = TrackedSessionStorage.getInstance();

// Helper function to use tracked sessionStorage
export const setTrackedItem = (key: string, value: string) => {
  trackedSessionStorage.setItem(key, value);
};

export const getTrackedItem = (key: string) => {
  return trackedSessionStorage.getItem(key);
};

export const removeTrackedItem = (key: string) => {
  trackedSessionStorage.removeItem(key);
};
