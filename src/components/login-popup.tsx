'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { selectIsLoggedIn } from '@/store/userRoleSlice';
import { useSelector } from 'react-redux';

export default function LoginPopup() {
    const isLoggedIn = useSelector(selectIsLoggedIn);
    const [showLoginPopup, setShowLoginPopup] = useState(false);

  // Show login popup if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      setShowLoginPopup(true);
    }else{
      setShowLoginPopup(false);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (!isLoggedIn) {
      setShowLoginPopup(true);
    }else{
      setShowLoginPopup(false);
    }
  }, []);

  const handleLoginPopupClose = () => {
    setShowLoginPopup(false);
  };

    if (!showLoginPopup) return null;
  
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-[1px] z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#6f43fe] to-[#5a32d1] p-6 text-white text-center relative">
              <Link href="/" className="absolute top-2 right-2 text-white/50 hover:text-white/75">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Link>
              <div className="w-16 h-16 mx-auto mb-4 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold mb-2">Login Required</h2>
              <p className="text-sm opacity-90">Please login to continue as an influencer</p>
            </div>
  
            {/* Content */}
            <div className="p-6 space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Influencer Registration</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    To register as an influencer and create your profile, you need to be logged in to your account first.
                  </p>
                </div>
              </div>
  
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">What You'll Get</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Create your influencer profile</li>
                    <li>• Set your pricing and offers</li>
                    <li>• Get discovered by brands</li>
                    <li>• Manage your collaborations</li>
                  </ul>
                </div>
              </div>
            </div>
  
            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row gap-3">
              <Link
                href="/login"
                className="flex-1 bg-[#6f43fe] text-white py-3 px-6 rounded-lg font-medium hover:bg-[#5a32d1] transition-all duration-200 shadow-lg hover:shadow-xl text-center"
                onClick={handleLoginPopupClose}>
                Login Now
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  };