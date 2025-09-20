// Global type declarations
declare global {
  interface Window {
    __APP_CACHE__?: Record<string, { data: any; timestamp: number; size: number }>;
  }
}

export {};
