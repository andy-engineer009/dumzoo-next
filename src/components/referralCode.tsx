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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 text-gray-900 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
        </div>

        {/* Toast Notifications */}
        {toast && (
          <Toast 
            message={toast.message} 
            type={toast.type} 
            onClose={() => setToast(null)} 
          />
        )}

        {/* Main Content */}
        <div className="relative z-10 min-h-screen flex flex-col">
          {/* App Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full px-6 py-3 bg-white/80 backdrop-blur-md border-b border-gray-200/50"
          >
            <div className="flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-xl font-bold text-gray-900">Complete Profile</h1>
                <p className="text-sm text-gray-500">Let's get you started</p>
              </div>
            </div>
          </motion.div>

          {/* Form Container */}
          <div className="flex-1 px-6 py-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-md mx-auto"
            >
              {/* Welcome Section */}
              <div className="text-center mb-8">
                {/* <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg"
                >
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </motion.div> */}
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome!</h2>
                <p className="text-gray-600">Tell us a bit about yourself to get started</p>
              </div>

              {/* Form */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50"
              >
                <Formik
                  initialValues={{ name: '', referral_code: '' }}
                  validationSchema={referralValidationSchema}
                  onSubmit={handleSubmit}
                >
                  {({ isValid, dirty, values }) => (
                    <Form className="space-y-6">
                      {/* Name Field */}
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-3">
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Full Name
                            <span className="text-red-500 ml-1">*</span>
                          </span>
                        </label>
                        <div className="relative">
                          <Field
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Enter your full name"
                            className="w-full px-4 py-4 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-900 placeholder-gray-400 font-medium"
                          />
                          {values.name && (
                            <motion.div 
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2"
                            >
                              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            </motion.div>
                          )}
                        </div>
                        <ErrorMessage
                          name="name"
                          component="div"
                          className="mt-2 text-sm text-red-500 flex items-center"
                        />
                      </motion.div>

                      {/* Referral Code Field */}
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                      >
                        <label htmlFor="referral_code" className="block text-sm font-semibold text-gray-700 mb-3">
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            Referral Code
                            <span className="text-gray-400 ml-1 text-xs">(Optional)</span>
                          </span>
                        </label>
                        <Field
                          type="text"
                          id="referral_code"
                          name="referral_code"
                          placeholder="Enter referral code if you have one"
                          className="w-full px-4 py-4 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 text-gray-900 placeholder-gray-400 font-medium"
                        />
                        <ErrorMessage
                          name="referral_code"
                          component="div"
                          className="mt-2 text-sm text-red-500 flex items-center"
                        />
                      </motion.div>

                      {/* Submit Button */}
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="pt-4"
                      >
                        <button
                          type="submit"
                          disabled={isLoading || !isValid || !dirty}
                          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center space-x-3 text-lg"
                        >
                          {isLoading ? (
                            <>
                              <LoadingSpinner size="sm" />
                              <span>Setting up your profile...</span>
                            </>
                          ) : (
                            <>
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              <span>Complete Profile</span>
                            </>
                          )}
                        </button>
                      </motion.div>
                    </Form>
                  )}
                </Formik>
              </motion.div>

              {/* Bottom Info */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-center mt-6"
              >
                <p className="text-sm text-gray-500">
                  By completing your profile, you agree to our{' '}
                  <span className="text-blue-600 font-medium">Terms of Service</span>
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReferralCode;