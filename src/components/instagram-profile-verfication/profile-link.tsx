'use client'
import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Select from 'react-select';
import { api } from '@/common/services/rest-api/rest-api';
import { API_ROUTES } from '@/appApi';
import { useRouter } from 'next/navigation';
import citiesData from '@/data/cities.json';

interface ProfileLinkProps {
  onComplete?: (data: any) => void;
}

interface FormData {
  instagramUrl: string;
  bioCode: string;
  starting_price: string;
  city_id: number | null;
  languages: string[];
}

const ProfileLink: React.FC<ProfileLinkProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState<'input' | 'code' | 'verifying' | 'form' | 'success'>('input');
  const [bioCode, setBioCode] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [instagramUrl, setInstagramUrl] = useState<string>('');
  const [fullInstagramUrl, setFullInstagramUrl] = useState<string>(''); // Store the full URL for form
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verificationSuccess, setVerificationSuccess] = useState<boolean>(false);
  const [formStep, setFormStep] = useState<number>(0);
  const [isLoadingProfile, setIsLoadingProfile] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  
  const router = useRouter()
  // Test mode - set to true to bypass API calls
  const TEST_MODE = true;

  // Transform cities data for react-select
  const cityOptions = citiesData.map(city => ({
    value: city.city_id,
    label: city.name,
    state_id: city.state_id,
    state_name: city.state_name
  }));

  // Custom styles for react-select
  const customSelectStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      borderColor: state.isFocused ? '#1fb036' : '#e5e7eb',
      borderWidth: '2px',
      borderRadius: '0.5rem',
      backgroundColor: '#fff',
      padding: '0.125rem',
      boxShadow: 'none',
      '&:hover': {
        borderColor: '#1fb036'
      },
      fontSize: '0.875rem'
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#1fb036' : state.isFocused ? '#f3f4f6' : 'white',
      color: state.isSelected ? 'white' : '#111827',
      fontSize: '0.875rem',
      padding: '0.5rem 0.75rem',
      cursor: 'pointer'
    }),
    menu: (provided: any) => ({
      ...provided,
      fontSize: '0.875rem',
      zIndex: 1000,
      position: 'relative',
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: '#9ca3af',
      fontSize: '0.875rem'
    })
  };

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
    starting_price: Yup.string().required('Advertisement price is required'),
    city_id: Yup.number().nullable().required('City is required'),
    languages: Yup.array().min(1, 'Please select at least one language'),
  });

  const initialValues: FormData = {
    instagramUrl: '',
    bioCode: '',
    starting_price: '',
    city_id: null,
    languages: [],
  };

  // Language options
  const languageOptions = [
   'All', 'English', 'Hindi', 'Tamil', 'Telugu', 'Bengali', 'Gujarati', 
    'Marathi', 'Kannada', 'Malayalam', 'Punjabi', 'Urdu'
  ];

  // Handle profile URL submission
  const handleProfileSubmit = async (values: FormData) => {
    console.log('Profile submission values:', values);
    
    // Extract and store just the handler name from the Instagram URL
    const handleName = values.instagramUrl.split('/').filter(Boolean).pop() || '';
    console.log('Handle name:', handleName);
    setInstagramUrl(handleName); // Store username for API call
    setFullInstagramUrl(values.instagramUrl); // Store full URL for form validation
    
    setIsLoadingProfile(true);
    
    // if (TEST_MODE) {
    //   // Test mode - bypass API call
    //   setBioCode('DUMZOO_TEST_123');
    //   setUsername('testuser');
    //   setCurrentStep('code');
    //   return;
    // }
    
    try {
      const response = await api.get(API_ROUTES.getBioCode);
      
      if (response.status == 1) {
        setBioCode(response.data);
        // setUsername(response.username);
        setCurrentStep('code');
      } else {
        console.error('Error getting bio code:', response.error);
      }
    } catch (error) {
      console.error('Error getting bio code:', error);
    } finally {
      setIsLoadingProfile(false);
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
        handle_name: instagramUrl,
        verification_code: bioCode
      });
      
      if (response.status == 1) {
        setVerificationSuccess(response.data);
        
        if (response.data) {
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
        starting_price: values.starting_price,
        city_id: values.city_id,
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
      setIsCopied(true);
      
      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
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

  // Handle back button
  const handleBack = () => {
    if (currentStep === 'code') {
      setCurrentStep('input');
      setBioCode('');
    } else if (currentStep === 'input') {
      router.back();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center p-3">
      <div className="w-full max-w-sm">
        {/* Profile Input Screen */}
        {currentStep === 'input' && (
          <div className="bg-white rounded-xl shadow-lg p-6 text-center animate-fadeIn relative">
            {/* Back Button */}
            <button
              onClick={handleBack}
              className="absolute top-4 left-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

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
                    disabled={isLoadingProfile}
                    className="w-full bg-[#1fb036] text-white py-3 rounded-lg font-semibold text-sm hover:bg-[#1a9a2e] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isLoadingProfile ? (
                      <>
                        <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Loading...
                      </>
                    ) : (
                      'Get Bio Code'
                    )}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        )}

        {/* Code Screen */}
        {currentStep === 'code' && (
          <div className="bg-white rounded-xl shadow-lg p-6 text-center animate-slideIn relative">
            {/* Back Button */}
            <button
              onClick={handleBack}
              className="absolute top-4 left-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

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
                  className={`ml-3 px-3 py-1 rounded text-xs transition-all duration-300 flex items-center ${
                    isCopied 
                      ? 'bg-green-500 text-white' 
                      : 'bg-[#000] text-white hover:bg-[#1a9a2e]'
                  }`}
                >
                  {isCopied ? (
                    <>
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Copied!
                    </>
                  ) : (
                    'Copy'
                  )}
                </button>
              </div>
            </div>

            <button
              onClick={handleVerification}
              className="w-full bg-[#1fb036] text-white py-3 rounded-lg font-semibold text-sm hover:bg-[#1a9a2e] transition-all duration-300"
            >
              Verify Now
            </button>
            <p className="text-sm text-blue-800 mt-4">Note: This bio code is only for verification purposes. You can remove it from your profile after the verification process is complete.</p>
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
                instagramUrl: fullInstagramUrl || 'https://instagram.com/testuser' // Use the stored full Instagram URL
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
                        name="starting_price"
                        placeholder="5000"
                        className="w-full pl-7 pr-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:border-[#1fb036] focus:outline-none transition-colors"
                        onBlur={handleNextField}
                      />
                    </div>
                    <ErrorMessage name="starting_price" component="div" className="text-red-500 text-xs mt-1" />
                  </div>

                  {/* Location */}
                  <div className={`mb-4 transition-all duration-500 ${formStep >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      City
                    </label>
                    <Select
                      key="city-select"
                      options={cityOptions}
                      value={cityOptions.find(option => option.value === values.city_id) || null}
                      onChange={(selectedOption) => {
                        setFieldValue('city_id', selectedOption ? selectedOption.value : null);
                        handleNextField();
                      }}
                      placeholder="Select city"
                      styles={customSelectStyles}
                      className="text-sm"
                      isClearable
                      isSearchable
                    />
                    <ErrorMessage name="city_id" component="div" className="text-red-500 text-xs mt-1" />
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
