'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { selectUserRole, selectIsLoggedIn } from '@/store/userRoleSlice';

const Header = () => {
  const role = useSelector(selectUserRole);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname:any = usePathname(); 

  return (
    <>
      {/* Mobile Top Header - Modern Glassmorphism Design */}


      {/* Mobile Bottom Navigation - Modern Floating Design */}
        {/* {!pathname.includes('/detail') && !pathname.includes('/chat') && !pathname.includes('/profile') && !pathname.includes('/login') && !pathname.includes('/referral') && !pathname.includes('/discover')&& !pathname.includes('/plans') && ( */}
        { pathname ==='/' && (
          <nav className="fixed bottom-0 z-50 md:hidden w-full">
          {/* Main Navigation Container */}
          <div className="bg-white/95 backdrop-blur-xl  shadow-[0_-8px_32px_rgba(0,0,0,0.12)] border border-gray-200/60 p-2">
            <div className={`grid ${role === '3' ? 'grid-cols-5' : 'grid-cols-5'} items-center gap-1`}>
              
              {/* Home */}
              <button
                onClick={() => router.push('/')}
                                  className={`flex flex-col items-center justify-center py-3 px-2 rounded-xl transition-all duration-300 ${
                    pathname === '/' 
                      ? 'bg-[#6f43fe]/10 text-[#1fb036] shadow-sm' 
                      : 'text-gray-600 hover:text-[#6f43fe] hover:bg-gray-50'
                  }`}
              >
                <div className="mb-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={pathname === '/' ? 2.5 : 2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                {/* <span className="text-xs font-medium">Home</span> */}
              </button>

              {/* Discover */}
              <button
                onClick={() => router.push((role === '2' && isLoggedIn) ? '/campaigns' : (role === '3' && isLoggedIn) ? '/discover' : '/finder')}
                                  className={`flex flex-col items-center justify-center py-3 px-2 rounded-xl transition-all duration-300 ${
                    pathname === '/discover' 
                      ? 'bg-[#6f43fe]/10 text-[#6f43fe] shadow-sm' 
                      : 'text-gray-600 hover:text-[#6f43fe] hover:bg-gray-50'
                  }`}
              >
                <div className="mb-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={pathname === '/discover' ? 2.5 : 2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                {/* <span className="text-xs font-medium">Discover</span> */}
              </button>

              {/* Center - Add Influencer Button (Floating) */}
              {/* {role === '2' && ( */}
                <div className="flex justify-center">
                  <button
                    onClick={() => router.push(role === '2' ? '/registration' : '/create-campaign')}
                    className="flex flex-col items-center justify-center w-14 h-14 bg-[#1fb036] text-white rounded-[10px] shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 border-4 border-white"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                </div>
              {/* )} */}

              {/* Chat */}
              <button
                onClick={() => router.push('/chat/1')}
                                  className={`flex flex-col items-center justify-center py-3 px-2 rounded-xl transition-all duration-300 ${
                    pathname.startsWith('/chat') 
                      ? 'bg-[#6f43fe]/10 text-[#6f43fe] shadow-sm' 
                      : 'text-gray-600 hover:text-[#6f43fe] hover:bg-gray-50'
                  }`}
              >
                <div className="mb-1 relative">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={pathname.startsWith('/chat') ? 2.5 : 2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  {/* {!pathname.startsWith('/chat') && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-3 h-3 flex items-center justify-center">
                      3
                    </span>
                  )} */}
                </div>
                {/* <span className="text-xs font-medium">Chat</span> */}
              </button>

              {/* Profile */}
              <button
                onClick={() => router.push('/profile')}
                                  className={`flex flex-col items-center justify-center py-3 px-2 rounded-xl transition-all duration-300 ${
                    pathname === '/profile' 
                      ? 'bg-[#6f43fe]/10 text-[#6f43fe] shadow-sm' 
                      : 'text-gray-600 hover:text-[#6f43fe] hover:bg-gray-50'
                  }`}
              >
                <div className="mb-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={pathname === '/profile' ? 2.5 : 2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                {/* <span className="text-xs font-medium">Profile</span> */}
              </button>
            </div>
          </div>
        </nav>
      )}

      {/* Bottom safe area for devices with home indicator */}
      {/* {!pathname.includes('/detail') && !pathname.includes('/chat') && !pathname.includes('/profile') && !pathname.includes('/login') && !pathname.includes('/referral') && (
        <div className="h-24 md:h-0"></div>
      )} */}
    </>
  );
};

export default Header;
