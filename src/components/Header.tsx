'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { selectUserRole, selectIsLoggedIn, selectIsInfluencerRegistered } from '@/store/userRoleSlice';

const Header = () => {
  const role = useSelector(selectUserRole);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const isInfluencerRegistered = useSelector(selectIsInfluencerRegistered);
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname:any = usePathname();

  // Scroll behavior state
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrollTimeout, setScrollTimeout] = useState<NodeJS.Timeout | null>(null);

  // Handle scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Clear existing timeout
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      
      // Show navbar when scrolling up or at the top
      if (currentScrollY < lastScrollY || currentScrollY < 10) {
        setIsVisible(true);
      } 
      // Hide navbar when scrolling down (but not at the very top)
      else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Add a small delay to prevent flickering
        const timeout = setTimeout(() => {
          setIsVisible(false);
        }, 100);
        setScrollTimeout(timeout);
      }
      
      setLastScrollY(currentScrollY);
    };

    // Throttle scroll events for better performance
    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledHandleScroll);
    
    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, [lastScrollY, scrollTimeout]); 

  return (
    <>
      {/* Mobile Top Header - Modern Glassmorphism Design */}


      {/* Mobile Bottom Navigation - Modern Floating Design */}
        {/* {!pathname.includes('/detail') && !pathname.includes('/chat') && !pathname.includes('/profile') && !pathname.includes('/login') && !pathname.includes('/referral') && !pathname.includes('/discover')&& !pathname.includes('/plans') && ( */}
        { pathname ==='/' && (
          <nav className={`fixed bottom-0 z-50 md:hidden w-full transition-all duration-300 ease-in-out ${
            isVisible 
              ? 'translate-y-0 opacity-100' 
              : 'translate-y-full opacity-0'
          }`}>
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
              {!isLoggedIn && (
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
              </button>
              )}

 {isLoggedIn && (
<button
                onClick={() => router.push('/chat')}
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
              )}

              {/* Center - Add Influencer Button (Floating) */}
              {role === '2' && (
                <div className="flex justify-center">
                  <button
                    onClick={() => router.push(isInfluencerRegistered ? '/plans' : '/registration')}
                    className="flex flex-col items-center justify-center w-14 h-14 bg-[#1fb036] text-white rounded-[10px] shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 border-4 border-white"
                  >
                    {isInfluencerRegistered ? (
                    <svg className='w-[30px] h-[30px]' viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg" fill="none"><path stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="12" d="M92.953 57.154c22.628-22.627 57.983-35.355 76.368-33.94 1.414 18.384-11.314 53.74-33.941 76.367-22.628 22.627-48.084 39.598-62.226 45.255L47.698 119.38c5.657-14.142 22.628-39.598 45.255-62.226Zm-5.657 48.084-39.598 39.598"/><circle cx="128.309" cy="64.225" r="12" fill="#fff" transform="rotate(45 128.309 64.225)"/><path stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="12" d="m115.581 119.38 1.569 17.256c.779 8.57-3.09 16.9-10.139 21.835l-16.886 11.82-1.414-32.527M73.154 76.953l-17.256-1.569a24 24 0 0 0-21.835 10.139l-11.82 16.886 32.527 1.414"/></svg>
                    ) : (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    )}
                  </button>
                </div>
              )}

{role === '3' && (
                <div className="flex justify-center">
                  <button
                    onClick={() => router.push('/create-campaign')}
                    className="flex flex-col items-center justify-center w-14 h-14 bg-[#1fb036] text-white rounded-[10px] shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 border-4 border-white"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                </div>
              )}

{!isLoggedIn && (
<button
                onClick={() => router.push('/chat')}
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
              )}


              {/* Chat */}
              {isLoggedIn && (
              <button
                onClick={() => router.push('/notification')}
                                  className={`flex flex-col items-center justify-center py-3 px-2 rounded-xl transition-all duration-300 ${
                    pathname.startsWith('/notification') 
                      ? 'bg-[#6f43fe]/10 text-[#6f43fe] shadow-sm' 
                      : 'text-gray-600 hover:text-[#6f43fe] hover:bg-gray-50'
                  }`}
              >
                <div className="mb-1 relative">
                {/* Notification SVG Icon */}
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2zm6-6V11c0-3.07-1.63-5.64-5-6.32V4a1 1 0 1 0-2 0v.68C7.63 5.36 6 7.92 6 11v5l-1.29 1.29A1 1 0 0 0 6 19h12a1 1 0 0 0 .71-1.71L18 16zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z" fill="#4a5565"/>
                </svg>
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] rounded-full w-3 h-3 flex items-center justify-center">
                      3
                    </span>
              
                </div>
                {/* <span className="text-xs font-medium">Chat</span> */}
              </button>
              )}

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
