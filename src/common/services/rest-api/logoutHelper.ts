'use client'

// logoutHelper.ts
// This function is called from outside React components, so we can't use hooks here

export const handleUnauthorized = () => {
  if (typeof window !== "undefined") {
    // ✅ Clear localStorage directly (no hooks)
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('isLoggedIn');
    
    // ✅ Dispatch custom event to notify React components
    const logoutEvent = new CustomEvent('userLogout', {
      detail: { reason: 'unauthorized' }
    });
    window.dispatchEvent(logoutEvent);
    
  }
};
