'use client';

import { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { api } from '@/common/services/rest-api/rest-api';
import { API_ROUTES } from '@/appApi';
import Loader from './loader';
import Image from 'next/image';

// Validation schema
const referralValidationSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .required('Name is required'),
  referral_code: Yup.string()
    .min(3, 'Referral code must be at least 3 characters')
    .max(20, 'Referral code must be less than 20 characters')
    .optional(),
});

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

const ReferralCode = () => {
  // State management
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const router = useRouter();

  // Show toast notification
  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  // Handle form submission
  const handleSubmit = async (values: any) => {
    router.push('/');
    if(values.name === ''){
      showToast('Name is required', 'error');
      return;
    }

    setIsLoading(true);
    try {
      api.post(API_ROUTES.referral, {
        name: values.name,
        referral_code: values.referral_code || '',
      }).then((response) => {
        setIsLoading(false);
        if(response.status == 1) {
          showToast(response.message, 'success');
          localStorage.setItem('is_new_user', '0');
          router.push('/');
        } else {
          showToast(response.message, 'error');
        }
      });
    } catch (error) {
      setIsLoading(false);
      console.error('Error submitting form:', error);
      showToast('Network error. Please try again.', 'error');
    } 
  };

  return (
    <>
      {isLoading && <Loader/>}
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
        <div className=" pb-20 flex flex-col items-center min-h-screen bg-[#ababab2e]">


          {/* App Screen Top Bar */}
          <div className="w-full px-4 py-2 fixed top-0 left-0 right-0 z-20 border-b border-gray-200 text-center bg-[#fff]">
            {/* Title */}
              <span className="text-xl font-[600] text-gray-900">Your Profile</span>
          </div>
          <div className="h-20"></div> {/* Spacer for fixed top bar */}

          {/* Form */}
          <div className="w-full max-w-sm space-y-4 px-4">
            <Formik
              initialValues={{ name: '', referral_code: '' }}
              validationSchema={referralValidationSchema}
              onSubmit={handleSubmit}
            >
              {({ isValid, dirty }) => (
                <Form className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Name *
                    </label>
                    <Field
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Enter your name"
                      className="w-full px-4 py-2 bg-transparent border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white"
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="mt-1 text-sm text-red-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="referral_code" className="block text-sm font-medium text-gray-700 mb-2">
                      Referral Code (Optional)
                    </label>
                    <Field
                      type="text"
                      id="referral_code"
                      name="referral_code"
                      placeholder="Enter referral code"
                      className="w-full px-4 py-2 bg-transparent border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white"
                    />
                    <ErrorMessage
                      name="referral_code"
                      component="div"
                      className="mt-1 text-sm text-red-500"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isLoading || !isValid || !dirty}
                      className="bg-black text-white font-medium py-2 px-4 rounded-[100px] border border-gray-900 transition-colors duration-200 flex items-center justify-center space-x-3 text-lg absolute left-0 right-0 bottom-[20px] w-[80%] mx-auto"
                    >
                      {isLoading ? (
                        <>
                          <LoadingSpinner size="sm" />
                          <span>Processing...</span>
                        </>
                      ) : (
                        'Complete Profile'
                      )}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>

        </div>

      </div>
    </>
  );
};

export default ReferralCode;