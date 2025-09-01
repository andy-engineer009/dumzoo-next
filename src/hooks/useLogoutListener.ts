'use client'

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { logout, setUserRole, setIsLoggedIn, setIsInfluencerRegistered } from '@/store/userRoleSlice';
import { useRouter } from 'next/navigation';

export const useLogoutListener = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  
  useEffect(() => {
    const handleLogout = (event: CustomEvent) => {
      // Update Redux state when logout event is received
      dispatch(logout());
      dispatch(setIsLoggedIn(false));
      dispatch(setUserRole('3'));
      dispatch(setIsInfluencerRegistered(false));
      router.push('/');

    };

    // Listen for logout events
    window.addEventListener('userLogout', handleLogout as EventListener);

    // Cleanup
    return () => {
      window.removeEventListener('userLogout', handleLogout as EventListener);
    };
  }, [dispatch]);
};
