'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ProfileProgressCard from '@/components/influencer/ProfileprogressCard';
import CreateProfilePopup from '@/components/influencer/create-profile-popup';
import { selectIsInfluencerRegistered } from '@/store/userRoleSlice';
import { useSelector } from 'react-redux';

export default function EditProfile() {
  const router = useRouter();
  const isInfluencerRegistered = useSelector(selectIsInfluencerRegistered);
  const [isProfileCreatePopupOpen, setIsProfileCreatePopupOpen] = useState(false);


  useEffect(() => {
    if(isInfluencerRegistered) {
      setIsProfileCreatePopupOpen(false)
    }else{
      setIsProfileCreatePopupOpen(true)
    }
  }, []);

  const progressData = {
    completedSteps: 2,
    totalSteps: 3,
    progressPercentage: (2 / 3) * 100,
    title: "Profile Progress"
  };

  const steps = [
    {
      id: 1,
      title: 'Basic Details',
      description: 'Personal information and social media',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      status: 'completed', // completed, current, pending
      route: '/profile/edit/basic'
    },
    {
      id: 2,
      title: 'Offers',
      description: 'Pricing and service packages',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      ),
      status: 'current',
      route: '/profile/edit/offers'
    },
    {
      id: 3,
      title: 'Media',
      description: 'Profile picture and portfolio',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      status: 'pending',
      route: '/profile/edit/media'
    }
  ];

  const handleStepClick = (step: any) => {
    // Navigate to the specific edit page
    router.push(step.route);
  };

  return (
    <>
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-20 bg-white border-b border-gray-200 pr-4 py-3">
        <div className="flex items-center justify-center relative">
          <button 
            onClick={() => router.push('/profile')}
            className="p-2 rounded-full hover:bg-gray-100 absolute left-0 top-1/2 -translate-y-1/2"
          >
            <svg className="w-5 h-5" fill="none" stroke="#ccc" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-medium text-gray-900"> Profile</h1>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 px-6 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Progress Section */}
          {/* <div className="mb-4">
          <ProfileProgressCard data={progressData} /> 
          </div> */}

          {/* Steps Section */}
          <div className="space-y-3">
            {/* <h3 className="text-lg font-semibold text-gray-900 mb-4">Complete These Steps</h3> */}
            
            {steps.map((step, index) => (
              <div
                key={step.id}
                onClick={() => handleStepClick(step)}
                className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/50 cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
              >
                <div className="flex items-center space-x-4">
                  {/* Step Icon */}
                  <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
                    step.status === 'completed' ? 'bg-green-500 text-white' :
                    step.status === 'current' ? 'bg-blue-500 text-white' :
                    'bg-gray-200 text-gray-500'
                  }`}>
                    {step.status === 'completed' ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <div className="w-5 h-5">
                        {step.icon}
                      </div>
                    )}
                  </div>

                  {/* Step Content */}
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900">{step.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                  </div>

                  {/* Arrow */}
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
          <CreateProfilePopup 
          showProfilePopup={isProfileCreatePopupOpen} 
          onClose={() => setIsProfileCreatePopupOpen(false)}
        />
    </>
  );
} 