'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setIsLoggedIn,setUserRole } from '@/store/userRoleSlice';
import { API_ROUTES } from '@/appApi';
import { api } from '@/common/services/rest-api/rest-api';
import { useGoogleLogin } from '@react-oauth/google';
// import Loader from '../loader';
import { setVerfiedUser, setVerfiedUserV2 } from '@/helpers/common';
import Image from 'next/image';

// Toast notification component
const Toast = ({ message, type, onClose }: { message: string; type: 'success' | 'error' | 'info'; onClose: () => void }) => {
  const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
  const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';

  return (
    <div className={`fixed top-4 right-4 z-50 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg flex items-center max-w-sm animate-slide-in`}>
      <span className="mr-2 font-bold">{icon}</span>
      <span className="flex-1">{message}</span>
      <button onClick={onClose} className="ml-2 text-white hover:text-gray-200">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

// Loading spinner component
const LoadingSpinner = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <svg className={`animate-spin ${sizeClasses[size]} text-white`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );
};

const Signup = () => {
  // State management
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [userType, setUserType] = useState<any>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  // Check if user is already logged in and redirect
  useEffect(() => {
    const token = localStorage.getItem('token');
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (token && isLoggedIn) {
      const redirectUrl = searchParams.get('redirect') || '/';
      router.replace(redirectUrl);
    }
  }, [router, searchParams]);
  
  // Show toast notification
  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  // Google response code handler
  const resposneGoogleHandler = async(authresult: any) => {
   try{
    if(authresult?.code) {
      setIsLoading(true);
      const payload = {
        is_login_Type: 1,
        role_id: userType
      }
      api.post(`${API_ROUTES.google_signup}?google_code=${authresult?.code}`,payload).then((response) => {
        setIsLoading(false);
        if(response?.status == 1) {
          setVerfiedUserV2(response?.data, dispatch);
          showToast(response?.message, 'success')
          if(response?.data?.user?.is_new_user == 1) {
            router.push('/referral');
          } else {
            router.push('/');
          }
        } else {
          showToast(response?.message, 'error')
        }
      })
    }
   }catch(err){
    console.error('error google  ', authresult)
    setIsLoading(false);
   };
  }

  // Handle Google sign-in
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: resposneGoogleHandler,
    onError: resposneGoogleHandler,
    flow: 'auth-code',
  })

  // Handle skip button
  const handleSkip = () => {
    router.push('/');
  };

  return (
    <>
     {/* <button onClick={() => {
      dispatch(setUserRole('2'))
      dispatch(setIsLoggedIn(true))
     }}>infulancer</button>
     <button onClick={() => {
      dispatch(setUserRole('3'))
      dispatch(setIsLoggedIn(true))
     }}>promoter</button> */}
      {/* {isLoading && <Loader/>} */}
      <div className="min-h-screen bg-white text-black relative overflow-hidden">
        {/* Toast Notifications */}
        {toast && (
          <Toast 
            message={toast.message} 
            type={toast.type} 
            onClose={() => setToast(null)} 
          />
        )}


        {/* Main Content */}
        <div className="pt-0 pb-2 flex flex-col items-center min-h-screen">
                    {/* Influencer Image Grid with Infinite Scroll Animation */}
          <div className="relative w-full mb-8 overflow-hidden" style={{height: '55vh'}}>
            {/*
              Dynamically render the influencer image grid for infinite scroll animation.
              Gradients are removed; only images are shown.
            */}
            {(() => {
              // Array of influencer images (repeat for infinite effect)
              const influencerImages = [
                '/images/login/r1.jpg',
                '/images/login/r4.jpg',
                '/images/login/r5.jpg',
                '/images/login/r6.jpg',
                '/images/login/r3.jpg',
                '/images/login/r4.jpg',
                '/images/login/r5.jpg',
                '/images/login/r6.jpg',
                '/images/login/r1.jpg',
                '/images/login/r2.jpg',
                '/images/login/r1.jpg',
                '/images/login/r2.jpg',
                '/images/login/r3.jpg',
                '/images/login/r4.jpg',
                '/images/login/r5.jpg',
                '/images/login/r6.jpg',
                '/images/login/r2.jpg',
                '/images/login/r3.jpg',
              ];

              return (
                                 <div className="columns-3 gap-2 animate-infinite-scroll" style={{ columnGap: '8px' }}>
                   {influencerImages.map((src, idx) => {
                     // Different heights for each image to create varied layout
                     const heights = [180, 150, 200, 160, 190, 170, 140, 210, 165, 175, 145, 195, 155, 185, 170, 160, 200, 150];
                     const height = heights[idx % heights.length];
                     
                     return (
                                               <div
                          key={idx}
                          className="w-full overflow-hidden flex items-center justify-center bg-gray-100 rounded-[4px] mb-2 break-inside-avoid"
                          style={{ height: `${height}px` }}
                        >
                           <Image src={src} alt="influencer" width={100} height={100} style={{objectFit: 'cover',width: '100%', height:'100%'}}/>
                       </div>
                     );
                   })}
                 </div>
              );
            })()}
            {/* Blur effect overlay at bottom */}
            <div className="absolute bottom-[-5px] left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
          </div>

          {/* Logo and Brand */}
          <div className="text-center mb-4">
            <div className="flex items-center justify-center mb-4">
              {/* <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center mr-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg"></div>
              </div>
              <span className="text-3xl font-bold text-gray-900">DUMZOO</span> */}
                            <Image src="/images/logo.svg" alt="logo" width={150} height={100}/> 

            </div>
          </div>

          {/* Action Buttons */}
          <div className="w-full max-w-sm space-y-4 px-4">
            {/* User Type Selection - Show when no type selected */}
            {!userType && (
              <>
              <div className="space-y-3">
                <h3 className="text-lg font-medium text-gray-900 text-center mb-4">Why are you here?</h3>
                
                <button
                  onClick={() => setUserType(2)}
                  className="w-full bg-[#f43cb3] text-[#fff] font-medium py-4 px-4 rounded-[100px] transition-colors duration-200 flex items-center justify-center space-x-3 text-lg"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>I'm an Creator</span>
                </button>
                <button
                  onClick={() => setUserType(3)}
                  className="w-full bg-[#6d56ff] text-[#fff] font-medium py-4 px-4 rounded-[100px] transition-colors duration-200 flex items-center justify-center space-x-3 text-lg"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Promote Your Product/Business</span>
                </button>
              </div>
                  <div className="text-center mt-4">
                  <button
                    type="button"
                    onClick={() => router.push('/login')}
                    className="text-[#000] hover:underline bg-transparent border-none p-0 m-0 text-sm font-medium"
                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    You already have an account? <span className="font-semibold text-blue-800 ">Login now</span>
                  </button>
                </div>
                </>
            
            )}

            {/* Google Login Button - Show after user type selection */}
            {userType && (
              <div className="space-y-3">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Welcome, {userType === 2 ? 'Influencer' : 'Promoter'}!</h3>
                  <p className="text-sm text-gray-600 mt-1">Sign in to continue</p>
                </div>
                
                <button
                  onClick={() => handleGoogleLogin()}
                  disabled={isLoading}
                  className="w-full bg-[#000] text-[#fff] font-medium py-4 px-4 rounded-[100px] transition-colors duration-200 flex items-center justify-center space-x-3 text-lg"
                >
                  {isLoading ? (
                    <>
                      <LoadingSpinner size="sm" />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-6 h-6" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      <span>Continue with Google</span>
                    </>
                  )}
                </button>

                {/* Back button to change selection */}
                <button
                  onClick={() => setUserType(null)}
                  className="w-full text-gray-600 hover:text-gray-800 text-base font-medium py-2 transition-colors duration-200"
                >
                  ← Choose different option
                </button>
              </div>
            )}

          </div>

          {/* Terms and Conditions */}
          <div className="text-center mt-8 px-4">
            <p className="text-gray-600 text-sm opacity-80">
              By continuing you agree to DUMZOO's Terms and Conditions
            </p>
          </div>
        </div>

   

        {/* Custom CSS for animations */}
        <style jsx>{`
          @keyframes slide-in {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
          
          @keyframes infinite-scroll {
            0% {
              transform: translateY(0px);
            }
            100% {
              transform: translateY(-50%);
            }
          }
          
          .animate-slide-in {
            animation: slide-in 0.3s ease-out;
          }
          
          .animate-infinite-scroll {
            animation: infinite-scroll 60s linear infinite;
          }
        `}</style>
      </div>
    </>
  );
};

export default Signup;
