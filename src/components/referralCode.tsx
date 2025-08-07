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
  full_name: Yup.string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must be less than 100 characters')
    .required('Full name is required'),
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
    <motion.div 
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.9 }}
      className={`fixed top-4 right-4 z-50 ${bgColor} text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center max-w-sm backdrop-blur-sm`}
    >
      <span className="mr-2 font-bold text-lg">{icon}</span>
      <span className="flex-1">{message}</span>
      <button onClick={onClose} className="ml-2 text-white hover:text-gray-200 transition-colors">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </motion.div>
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
    if(values.full_name === ''){
      showToast('Full name is required', 'error');
      return;
    }

    setIsLoading(true);
    try {
      api.post(API_ROUTES.referral, {
        name: values.full_name,
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
      <div className="min-h-screen bg-white text-gray-900">
        {/* Toast Notifications */}
        {toast && (
          <Toast 
            message={toast.message} 
            type={toast.type} 
            onClose={() => setToast(null)} 
          />
        )}

        {/* Header */}
        <div className="w-full px-2 py-1 border-b border-gray-200">
          <div className="flex items-center">
            <button
              onClick={() => router.back()}
              className="mr-2 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-xl font-medium text-black">Info</h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-4 py-3">
          {/* Description */}
          <p className="text-gray-600 text-base mb-8 leading-relaxed text-[14px]">
            This name will appear on your HashFame profile and will be visible to influencers & peer marketers.
          </p>

          {/* Form */}
          <Formik
            initialValues={{ full_name: '', referral_code: '' }}
            validationSchema={referralValidationSchema}
            onSubmit={handleSubmit}
          >
            {({ isValid, dirty, values }) => (
              <Form className="space-y-6">
                {/* Full Name Field */}
                <div>
                  <label htmlFor="full_name" className="block text-sm font-medium text-black mb-2">
                    Full Name
                  </label>
                  <Field
                    type="text"
                    id="full_name"
                    name="full_name"
                    placeholder="Full Name"
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all duration-200 text-black placeholder-gray-400"
                  />
                  <ErrorMessage
                    name="full_name"
                    component="div"
                    className="mt-1 text-sm text-red-500"
                  />
                </div>

                {/* Referral Code Field */}
                <div>
                  <label htmlFor="referral_code" className="block text-sm font-medium text-black mb-2">
                    Referral Code
                  </label>
                  <Field
                    type="text"
                    id="referral_code"
                    name="referral_code"
                    placeholder="Referral Code"
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all duration-200 text-black placeholder-gray-400"
                  />
                  <ErrorMessage
                    name="referral_code"
                    component="div"
                    className="mt-1 text-sm text-red-500"
                  />
                </div>

                {/* Save Button */}
                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={isLoading || !isValid || !dirty}
                    className="bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 disabled:cursor-not-allowed absolute bottom-4 left-0 right-0 mx-auto" style={{width: '90%'}}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <LoadingSpinner size="sm" />
                        <span>Saving...</span>
                      </div>
                    ) : (
                      'Save'
                    )}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
};

export default ReferralCode;