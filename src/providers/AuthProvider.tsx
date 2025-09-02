'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { selectUserRole, selectIsLoggedIn, logout, setUserRole, setIsLoggedIn } from '@/store/userRoleSlice';

// Route configuration for authentication and authorization
const ROUTES = {
  // Public routes - accessible to everyone
    PUBLIC: [
      '/',
      '/login',
      '/signup',
      '/how',
      '/profile',
      '/campaigns',
      '/discover',
      '/chat'
    ],
  
  // Protected routes - require authentication (any logged-in user)
  PROTECTED: [
    '/chat',
    '/plans',
    '/referral'
  ],
  
  // Role-based routes - require specific user roles
  ROLE_BASED: {
    // Influencer routes (role: '2')
    INFLUENCER: [
      // '/campaigns',
      '/analytics',
      '/registration',
      '/view-profile',
      '/plans',
    '/profile',

    ],
    
    // Promoter routes (role: '3') 
    PROMOTER: [
      // '/discover',
      '/create-campaign',
      '/manage-campaigns',
      '/search',
      '/plans',
      '/profile',
    ]
  }
};

// Helper functions
const isPublicRoute = (pathname: string): boolean => {
  // return ROUTES.PUBLIC.some(route => pathname.includes(route));
  return ROUTES.PUBLIC.includes(pathname); // exact match

};

const isProtectedRoute = (pathname: string): boolean => {
  return ROUTES.PROTECTED.some(route => pathname.includes(route) );
};

const getRequiredRole = (pathname: string): string | null => {
  // Check influencer routes
  if (ROUTES.ROLE_BASED.INFLUENCER.some(route => pathname.includes(route) )) {
    return '2'; // Influencer role
  }
  
  // Check promoter routes
  if (ROUTES.ROLE_BASED.PROMOTER.some(route => pathname.includes(route))) {
    return '3'; // Promoter role
  }
  
  return null; // No specific role required
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  let userRole: any = useSelector(selectUserRole);
  const [isLoading, setIsLoading] = useState(true);

  // Handle logout events from API service
  useEffect(() => {
    const handleLogout = (event: CustomEvent) => {
      // Update Redux state when logout event is received
      dispatch(logout());
      dispatch(setIsLoggedIn(false));
      dispatch(setUserRole('3'));
      
      // Redirect to home page
      router.push('/');
    };

    // Listen for logout events
    window.addEventListener('userLogout', handleLogout as EventListener);

    // Cleanup
    return () => {
      window.removeEventListener('userLogout', handleLogout as EventListener);
    };
  }, [dispatch, router]);

  // Handle route protection
  useEffect(() => {
    if(userRole == null){
      userRole = localStorage.getItem('userRole') || null;
    }

    // Skip auth check for public routes
    if (isPublicRoute(pathname)) {
      setIsLoading(false);
      return;
    }

    // Check if user is logged in for protected routes
    if (isProtectedRoute(pathname) && !isLoggedIn) {
      router.push('/login');
      return;
    }

    // Check role-based access
    const requiredRole = getRequiredRole(pathname);
    if (requiredRole && userRole !== requiredRole) {
      // Redirect to home page if user doesn't have required role
      router.push('/not-found');
      return;
    }

    // If user is logged in but trying to access login/signup, redirect to home
    if (isLoggedIn && (pathname === '/login' || pathname === '/signup')) {
      router.push('/');
      return;
    }

    // All checks passed
    setIsLoading(false);
  }, [isLoggedIn, userRole, pathname, router, dispatch]);

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6f43fe]"></div>
      </div>
    );
  }

  // Render children if auth checks pass
  return <>{children}</>;
};
