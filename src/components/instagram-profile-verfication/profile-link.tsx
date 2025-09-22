'use client'
import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { api } from '@/common/services/rest-api/rest-api';
import { API_ROUTES } from '@/appApi';
import { useRouter } from 'next/navigation';

interface ProfileLinkProps {
  onComplete?: (data: any) => void;
}

interface FormData {
  instagramUrl: string;
  bioCode: string;
  advertisementPrice: string;
  location: string;
  languages: string[];
}

const ProfileLink: React.FC<ProfileLinkProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState<'input' | 'code' | 'verifying' | 'form' | 'success'>('input');
  const [bioCode, setBioCode] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [instagramUrl, setInstagramUrl] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verificationSuccess, setVerificationSuccess] = useState<boolean>(false);
  const [formStep, setFormStep] = useState<number>(0);
  
  const router = useRouter()
  // Test mode - set to true to bypass API calls
  const TEST_MODE = true;

  // Form validation schemas for different steps
  const profileValidationSchema = Yup.object({
    instagramUrl: Yup.string()
      .url('Please enter a valid URL')
      .matches(/instagram\.com/, 'Please enter a valid Instagram URL')
      .required('Instagram URL is required'),
  });

  const formValidationSchema = Yup.object({
    instagramUrl: Yup.string()
      .url('Please enter a valid URL')
      .matches(/instagram\.com/, 'Please enter a valid Instagram URL')
      .required('Instagram URL is required'),
    advertisementPrice: Yup.string().required('Advertisement price is required'),
    location: Yup.string().required('Location is required'),
    languages: Yup.array().min(1, 'Please select at least one language'),
  });

  const initialValues: FormData = {
    instagramUrl: '',
    bioCode: '',
    advertisementPrice: '',
    location: '',
    languages: [],
  };

  // Language options
  const languageOptions = [
    'English', 'Hindi', 'Tamil', 'Telugu', 'Bengali', 'Gujarati', 
    'Marathi', 'Kannada', 'Malayalam', 'Punjabi', 'Urdu'
  ];

  // Handle profile URL submission
  const handleProfileSubmit = async (values: FormData) => {
    console.log('Profile submission values:', values);
    
    // Store the Instagram URL for later use
    setInstagramUrl(values.instagramUrl);
    
    if (TEST_MODE) {
      // Test mode - bypass API call
      setBioCode('DUMZOO_TEST_123');
      setUsername('testuser');
      setCurrentStep('code');
      return;
    }
    
    try {
      const response = await api.post(API_ROUTES.getBioCode, {
        instagramUrl: values.instagramUrl
      });
      
      if (response.success !== false) {
        setBioCode(response.bioCode);
        setUsername(response.username);
        setCurrentStep('code');
      } else {
        console.error('Error getting bio code:', response.error);
      }
    } catch (error) {
      console.error('Error getting bio code:', error);
    }
  };

  // Handle verification
  const handleVerification = async () => {
    setIsVerifying(true);
    setCurrentStep('verifying');
    
    if (TEST_MODE) {
      // Test mode - simulate verification
      setTimeout(() => {
        setVerificationSuccess(true);
        setCurrentStep('form');
      }, 2000);
      return;
    }
    
    try {
      const response = await api.post(API_ROUTES.verifyProfile, {
        instagramUrl: initialValues.instagramUrl,
        bioCode: bioCode
      });
      
      if (response.success !== false) {
        setVerificationSuccess(response.verified);
        
        if (response.verified) {
          setTimeout(() => {
            setCurrentStep('form');
          }, 2000);
        } else {
          setIsVerifying(false);
          setCurrentStep('code');
        }
      } else {
        console.error('Error verifying profile:', response.error);
        setIsVerifying(false);
        setCurrentStep('code');
      }
    } catch (error) {
      console.error('Error verifying profile:', error);
      setIsVerifying(false);
      setCurrentStep('code');
    }
  };

  // Handle form submission
  const handleFormSubmit = async (values: FormData) => {
    console.log('Form submission triggered!');
    console.log('Form submission values:', values);
    console.log('Current step before submission:', currentStep);
    
    if (TEST_MODE) {
      // Test mode - bypass API call and show success screen
      console.log('Test mode: Profile completed');
      setCurrentStep('success');
      if (onComplete) {
        onComplete(values);
      }
      return;
    }
    
    try {
      const response = await api.post(API_ROUTES.saveProfile, {
        instagramUrl: values.instagramUrl,
        advertisementPrice: values.advertisementPrice,
        location: values.location,
        languages: values.languages
      });
      
      if (response.success !== false) {
        setCurrentStep('success');
        if (onComplete) {
          onComplete(values);
        }
      } else {
        console.error('Error saving profile:', response.error);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  // Copy bio code to clipboard
  const copyBioCode = async () => {
    try {
      await navigator.clipboard.writeText(bioCode);
      // You could add a toast notification here
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  // Handle form field progression
  const handleNextField = () => {
    if (formStep < 2) {
      setFormStep(formStep + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center p-3">
      <div className="w-full max-w-sm">
        {/* Profile Input Screen */}
        {currentStep === 'input' && (
          <div className="bg-white rounded-xl shadow-lg p-6 text-center animate-fadeIn">
            <div className="mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.919-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </div>
              <h1 className="text-xl font-bold text-gray-900 mb-2">Verify Instagram Profile</h1>
              <p className="text-sm text-gray-600">Enter your Instagram URL to verify your account</p>
            </div>

            <Formik
              initialValues={initialValues}
              validationSchema={profileValidationSchema}
              onSubmit={handleProfileSubmit}
            >
              {({ values, errors, touched }) => (
                <Form>
                  <div className="mb-4">
                    <Field
                      type="url"
                      name="instagramUrl"
                      placeholder="https://instagram.com/yourusername"
                      className="w-full px-3 py-3 text-sm border-2 border-gray-200 rounded-lg focus:border-[#1fb036] focus:outline-none transition-colors"
                    />
                    <ErrorMessage name="instagramUrl" component="div" className="text-red-500 text-xs mt-1" />
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-[#1fb036] text-white py-3 rounded-lg font-semibold text-sm hover:bg-[#1a9a2e] transition-all duration-300"
                  >
                    Verify Profile
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        )}

        {/* Code Screen */}
        {currentStep === 'code' && (
          <div className="bg-white rounded-xl shadow-lg p-6 text-center animate-slideIn">
            <div className="mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">Add Verification Code</h2>
              <p className="text-sm text-gray-600 mb-4">Copy this code and paste it in your Instagram bio</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <div className="flex items-center justify-between">
                <code className="text-sm font-mono text-gray-800">{bioCode}</code>
                <button
                  onClick={copyBioCode}
                  className="ml-3 px-3 py-1 bg-[#000] text-white rounded text-xs hover:bg-[#1a9a2e] transition-colors"
                >
                  Copy
                </button>
              </div>
            </div>

            <button
              onClick={handleVerification}
              className="w-full bg-[#1fb036] text-white py-3 rounded-lg font-semibold text-sm hover:bg-[#1a9a2e] transition-all duration-300"
            >
              I've added it, Verify Now
            </button>
          </div>
        )}

        {/* Verification Loading */}
        {currentStep === 'verifying' && (
          <div className="bg-white rounded-xl shadow-lg p-6 text-center animate-fadeIn">
            <div className="mb-4">
              <div className="w-16 h-16 mx-auto mb-3 relative">
                <div className="w-full h-full border-4 border-purple-200 rounded-full animate-spin border-t-purple-500"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.919-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </div>
              </div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">Verifying Profile...</h2>
              <p className="text-sm text-gray-600">Checking your Instagram bio for the code</p>
            </div>
          </div>
        )}

        {/* Mini Form */}
        {currentStep === 'form' && (
          <div className="bg-white rounded-xl shadow-lg p-6 animate-slideIn">
            <div className="mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-gray-900 mb-2 text-center">Verified as @{username}</h2>
              <p className="text-sm text-gray-600 text-center">Complete your profile details</p>
            </div>

            <Formik
              initialValues={{
                ...initialValues,
                instagramUrl: instagramUrl || 'https://instagram.com/testuser' // Use the stored Instagram URL
              }}
              validationSchema={formValidationSchema}
              onSubmit={handleFormSubmit}
            >
              {({ values, errors, touched, setFieldValue }) => {
                console.log('Form values:', values);
                console.log('Form errors:', errors);
                console.log('Form touched:', touched);
                return (
                <Form>
                  {/* Advertisement Price */}
                  <div className={`mb-4 transition-all duration-500 ${formStep >= 0 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Advertisement Price
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">₹</span>
                      <Field
                        type="number"
                        name="advertisementPrice"
                        placeholder="5000"
                        className="w-full pl-7 pr-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:border-[#1fb036] focus:outline-none transition-colors"
                        onBlur={handleNextField}
                      />
                    </div>
                    <ErrorMessage name="advertisementPrice" component="div" className="text-red-500 text-xs mt-1" />
                  </div>

                  {/* Location */}
                  <div className={`mb-4 transition-all duration-500 ${formStep >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Location
                    </label>
                    <Field
                      type="text"
                      name="location"
                      placeholder="Mumbai, India"
                      className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:border-[#1fb036] focus:outline-none transition-colors"
                      onBlur={handleNextField}
                    />
                    <ErrorMessage name="location" component="div" className="text-red-500 text-xs mt-1" />
                  </div>

                  {/* Languages */}
                  <div className={`mb-4 transition-all duration-500 ${formStep >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Languages
                    </label>
                    <div className="grid grid-cols-2 gap-1">
                      {languageOptions.map((language) => (
                        <label key={language} className="flex items-center p-2 border border-gray-200 rounded cursor-pointer hover:border-[#1fb036] transition-colors">
                          <Field
                            type="checkbox"
                            name="languages"
                            value={language}
                            className="mr-2 text-[#1fb036] focus:ring-[#1fb036] w-3 h-3"
                          />
                          <span className="text-xs text-gray-700">{language}</span>
                        </label>
                      ))}
                    </div>
                    <ErrorMessage name="languages" component="div" className="text-red-500 text-xs mt-1" />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#1fb036] text-white py-3 rounded-lg font-semibold text-sm hover:bg-[#1a9a2e] transition-all duration-300"
                  >
                    Complete Profile
                  </button>
                </Form>
                );
              }}
            </Formik>
          </div>
        )}

        {/* Success Popup Screen */}
        {currentStep === 'success' && (
          <div className="bg-white rounded-xl shadow-lg p-6 text-center animate-fadeIn">
            <div className="mb-6">
              <div className="w-16 h-16 bg-[#1fb036] rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Congratulations!</h2>
              <p className="text-sm text-gray-600 mb-6">Your profile has been created successfully</p>
            </div>

            <button
              onClick={() => router.push('/')}
              className="w-full bg-[#1fb036] text-white py-3 rounded-lg font-semibold text-sm hover:bg-[#1a9a2e] transition-all duration-300"
            >
              Find Promotions
            </button>
          </div>
        )}

      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes bounceIn {
          0% { opacity: 0; transform: scale(0.3); }
          50% { opacity: 1; transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }
        
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
        
        .animate-slideIn {
          animation: slideIn 0.6s ease-out;
        }
        
        .animate-bounceIn {
          animation: bounceIn 0.8s ease-out;
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out;
        }
        
        .delay-200 {
          animation-delay: 0.2s;
        }
        
        .delay-300 {
          animation-delay: 0.3s;
        }
        
        .delay-400 {
          animation-delay: 0.4s;
        }
      `}</style>
    </div>
  );
};

export default ProfileLink;
