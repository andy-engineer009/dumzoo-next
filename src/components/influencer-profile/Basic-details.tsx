'use client';

import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { selectIsLoggedIn } from '@/store/userRoleSlice';
import { api } from '@/common/services/rest-api/rest-api';
import { API_ROUTES } from '@/appApi';

// Types
interface FormValues {
  username: string;
  is_instagram_enabled: boolean;
  is_youtube_enabled: boolean;
  is_facebook_enabled: boolean;
  platforms_required?: any;
  gender: string;
  categories: any[];
  languages: any[];
  verified_profile: boolean;
  state: string;
  city: string;
  locality: string;
  age: number;
  follower_count: number;
  instagram_url: string;
  youtube_url: string;
  facebook_url: string;
  audience_type: string;
  audience_age_group: string;
}

// Validation schema
const formSchema = Yup.object().shape({
  username: Yup.string().required('Username is required').min(3, 'Username must be at least 3 characters'),
  is_instagram_enabled: Yup.boolean().nullable(),
  is_youtube_enabled: Yup.boolean().nullable(),
  is_facebook_enabled: Yup.boolean().nullable(),
  platforms_required: Yup.mixed().test(
    'at-least-one-platform',
    'At least one platform must be selected',
    function (value, context) {
      const { is_instagram_enabled, is_youtube_enabled, is_facebook_enabled } = context.parent;
      return is_instagram_enabled || is_youtube_enabled || is_facebook_enabled;
    }
  ),
  gender: Yup.string().required('Gender is required'),
  categories: Yup.array().min(1, 'At least one category is required'),
  languages: Yup.array().min(1, 'At least one language is required'),
  state: Yup.string().required('State is required'),
  city: Yup.string().required('City is required'),
  age: Yup.number().required('Age is required').min(13, 'Must be at least 13 years old').max(100, 'Invalid age'),
  follower_count: Yup.number().required('Follower count is required').min(100, 'Must have at least 100 followers'),
  instagram_url: Yup.string().when('is_instagram_enabled', {
    is: (is_instagram_enabled: boolean) => is_instagram_enabled === true,
    then: (schema) => schema.required('Instagram URL is required').url('Must be a valid URL')
  }),
  youtube_url: Yup.string().when('is_youtube_enabled', {
    is: (is_youtube_enabled: boolean) => is_youtube_enabled === true,
    then: (schema) => schema.required('YouTube URL is required').url('Must be a valid URL')
  }),
  facebook_url: Yup.string().when('is_facebook_enabled', {
    is: (is_facebook_enabled: boolean) => is_facebook_enabled === true,
    then: (schema) => schema.required('Facebook URL is required').url('Must be a valid URL')
  }),
});

const audienceTypes = [
  { id: 0, name: 'all' },
  { id: 1, name: 'General' },
  { id: 2, name: 'Niche' },
  { id: 3, name: 'Specific' }
];

const audienceAgeGroups = [
  { id: 0, name: 'all' },
  { id: 1, name: '13-18' },
  { id: 2, name: '19-25' },
  { id: 3, name: '26-35' },
  { id: 4, name: '36-45' },
  { id: 5, name: '46-55' },
  { id: 6, name: '56+' }
];

// Multi-Select Checkbox Component
const MultiSelectCheckbox = ({ 
  label, 
  options, 
  field, 
  form 
}: {
  label: string;
  options: Array<{id: number, name: string}>;
  field: any;
  form: any;
}) => {
  const handleChange = (optionId: number) => {
    const currentValues = form.values[field.name] || [];
    const newValues = currentValues.includes(optionId)
      ? currentValues.filter((value: number) => value !== optionId)
      : [...currentValues, optionId];
    
    form.setFieldValue(field.name, newValues);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-700 mb-3">
        <span className="flex items-center">
          <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          {label}
        </span>
      </label>
      <div className="grid grid-cols-2 gap-3">
        {options.map((option) => (
          <label key={option.id} className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors">
            <input
              type="checkbox"
              name={field.name}
              value={option.id}
              checked={(form.values[field.name] || []).includes(option.id)}
              onChange={() => handleChange(option.id)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-700">{option.name}</span>
          </label>
        ))}
      </div>
      <ErrorMessage name={field.name} component="div" className="text-red-500 text-sm mt-1" />
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

export default function EditBasicDetails() {    
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const [categories, setCategories] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [localities, setLocalities] = useState([]);

  // Initial values - will be populated from API
  const [initialValues, setInitialValues] = useState<FormValues>({
    username: '',
    is_instagram_enabled: false,
    is_youtube_enabled: false,
    is_facebook_enabled: false,
    gender: '',
    categories: [],
    languages: [],
    verified_profile: true,
    state: '',
    city: '',
    locality: '',
    age: 0,
    follower_count: 0,
    instagram_url: '',
    youtube_url: '',
    facebook_url: '',
    audience_type: '',
    audience_age_group: '',
    platforms_required: ''
  });

  // Show toast notification
  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  // Fetch dropdown data and user profile data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch dropdown data
        const dropdownResponse = await api.get(API_ROUTES.dropdownData);
        if (dropdownResponse.status === 1) {
          const data: any = dropdownResponse.data;
          setCategories(data.categories);
          setLanguages(data.languages);
          setStates(data.states);
          setCities(data.cities);
          setLocalities(data.locality);
        }

        // Fetch user profile data
        const profileResponse = await api.get(API_ROUTES.getInfluencerProfile);
        if (profileResponse.status === 1) {
          const profileData: any = profileResponse.data;
          
          // Transform API data to form values
          setInitialValues({
            username: profileData.username || '',
            is_instagram_enabled: profileData.is_instagram_enabled === 1,
            is_youtube_enabled: profileData.is_youtube_enabled === 1,
            is_facebook_enabled: profileData.is_facebook_enabled === 1,
            gender: profileData.gender?.toString() || '',
            categories: profileData.categories || [],
            languages: profileData.languages || [],
            verified_profile: profileData.verified_profile === 1,
            state: profileData.state?.toString() || '',
            city: profileData.city?.toString() || '',
            locality: profileData.locality?.toString() || '',
            age: profileData.age || 0,
            follower_count: profileData.follower_count || 0,
            instagram_url: profileData.instagram_url || '',
            youtube_url: profileData.youtube_url || '',
            facebook_url: profileData.facebook_url || '',
            audience_type: profileData.audience_type?.toString() || '',
            audience_age_group: profileData.audience_age_group?.toString() || '',
            platforms_required: ''
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        showToast('Error loading profile data', 'error');
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) => {
    setIsLoading(true);
    try {
      const payload = {
        username: values.username,
        gender: parseInt(values.gender.toString()),
        age: values.age,
        follower_count: values.follower_count,
        verified_profile: values.verified_profile ? 1 : 0,
        is_instagram_enabled: values.is_instagram_enabled ? 1 : 0,
        is_youtube_enabled: values.is_youtube_enabled ? 1 : 0,
        is_facebook_enabled: values.is_facebook_enabled ? 1 : 0,
        instagram_url: values.instagram_url,
        youtube_url: values.youtube_url,
        facebook_url: values.facebook_url,
        audience_type: parseInt(values.audience_type.toString()),
        audience_age_group: parseInt(values.audience_age_group.toString()),
        state: parseInt(values.state.toString()),
        city: parseInt(values.city.toString()),
        locality: parseInt(values.locality.toString()),
        categories: values.categories.map((category: any) => parseInt(category.toString())),
        language: values.languages.map((language: any) => parseInt(language.toString())),
      };

      const response = await api.post(API_ROUTES.getInfluencerProfile, payload);
      
      if (response.status === 1) {
        showToast('Profile updated successfully!', 'success');
        // Navigate back to profile edit page after successful update
        setTimeout(() => {
          router.push('/profile/edit');
        }, 1500);
      } else {
        showToast(response.message || 'Failed to update profile', 'error');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      showToast('Network error. Please try again.', 'error');
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 text-gray-900 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
        </div>

        {/* Toast Notifications */}
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className={`fixed top-4 right-4 z-50 ${toast.type === 'success' ? 'bg-green-500' : toast.type === 'error' ? 'bg-red-500' : 'bg-blue-500'} text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center max-w-sm backdrop-blur-sm`}
          >
            <span className="mr-2 font-bold text-lg">{toast.type === 'success' ? '✓' : toast.type === 'error' ? '✕' : 'ℹ'}</span>
            <span className="flex-1">{toast.message}</span>
            <button onClick={() => setToast(null)} className="ml-2 text-white hover:text-gray-200 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        )}

        {/* Main Content */}
        <div className="relative z-10 min-h-screen flex flex-col">
          {/* App Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full px-6 py-3 bg-white/80 backdrop-blur-md border-b border-gray-200/50"
          >
            <div className="flex items-center justify-between">
              <Link
                href="/profile/edit"
                className="inline-flex items-center justify-center w-10 h-10 transition-colors hover:bg-gray-100 rounded-full"
                aria-label="Back to Profile Edit"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-6 w-6 text-gray-600" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" 
                    clipRule="evenodd" 
                  />
                </svg>
              </Link>
              <div className="text-center">
                <h1 className="text-xl font-bold text-gray-900">Edit Basic Details</h1>
                <p className="text-sm text-gray-500">Update your personal information</p>
              </div>
              <div className="w-10"></div> {/* Spacer for centering */}
            </div>
          </motion.div>

          {/* Form Container */}
          <div className="flex-1 px-6 py-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-2xl mx-auto"
            >
              {/* Form */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white/70 backdrop-blur-sm rounded-3xl p-5 shadow-xl border border-white/50"
              >
                <Formik
                  initialValues={initialValues}
                  validationSchema={formSchema}
                  onSubmit={handleSubmit}
                  enableReinitialize
                >
                  {({ values, setFieldValue, isValid, dirty }) => (
                    <Form className="space-y-6">
                      {/* Username */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-3">
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Username
                            <span className="text-red-500 ml-1">*</span>
                          </span>
                        </label>
                        <Field
                          type="text"
                          id="username"
                          name="username"
                          placeholder="Enter your username"
                          className="w-full px-4 py-4 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-900 placeholder-gray-400 font-medium"
                        />
                        <ErrorMessage name="username" component="div" className="mt-2 text-sm text-red-500 flex items-center" />
                      </motion.div>

                      {/* Platforms */}
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                      >
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            Social Media Platforms
                            <span className="text-red-500 ml-1">*</span>
                          </span>
                        </label>
                        <div className="space-y-3">
                          <label className="flex items-center space-x-3 cursor-pointer p-3 bg-white/50 rounded-xl hover:bg-white/80 transition-colors">
                            <input
                              type="checkbox"
                              name="is_instagram_enabled"
                              checked={values.is_instagram_enabled === true}
                              onChange={() => setFieldValue('is_instagram_enabled', !values.is_instagram_enabled)}
                              className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <span className="text-sm font-medium text-gray-700">Instagram</span>
                          </label>

                          <label className="flex items-center space-x-3 cursor-pointer p-3 bg-white/50 rounded-xl hover:bg-white/80 transition-colors">
                            <input
                              type="checkbox"
                              name="is_youtube_enabled"
                              checked={values.is_youtube_enabled === true}
                              onChange={() => setFieldValue('is_youtube_enabled', !values.is_youtube_enabled)}
                              className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <span className="text-sm font-medium text-gray-700">YouTube</span>
                          </label>

                          <label className="flex items-center space-x-3 cursor-pointer p-3 bg-white/50 rounded-xl hover:bg-white/80 transition-colors">
                            <input
                              type="checkbox"
                              name="is_facebook_enabled"
                              checked={values.is_facebook_enabled === true}
                              onChange={() => setFieldValue('is_facebook_enabled', !values.is_facebook_enabled)}
                              className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <span className="text-sm font-medium text-gray-700">Facebook</span>
                          </label>
                        </div>
                        <ErrorMessage name="platforms_required" component="div" className="mt-2 text-sm text-red-500 flex items-center" />
                      </motion.div>

                      {/* Platform URLs */}
                      {values.is_instagram_enabled && (
                        <motion.div 
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.7 }}
                        >
                          <label htmlFor="instagram_url" className="block text-sm font-semibold text-gray-700 mb-3">
                            Instagram Profile URL
                            <span className="text-red-500 ml-1">*</span>
                          </label>
                          <Field
                            type="url"
                            id="instagram_url"
                            name="instagram_url"
                            placeholder="https://instagram.com/yourusername"
                            className="w-full px-4 py-4 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-900 placeholder-gray-400 font-medium"
                          />
                          <ErrorMessage name="instagram_url" component="div" className="mt-2 text-sm text-red-500 flex items-center" />
                        </motion.div>
                      )}

                      {values.is_youtube_enabled && (
                        <motion.div 
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.7 }}
                        >
                          <label htmlFor="youtube_url" className="block text-sm font-semibold text-gray-700 mb-3">
                            YouTube Channel URL
                            <span className="text-red-500 ml-1">*</span>
                          </label>
                          <Field
                            type="url"
                            id="youtube_url"
                            name="youtube_url"
                            placeholder="https://youtube.com/@yourchannel"
                            className="w-full px-4 py-4 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-900 placeholder-gray-400 font-medium"
                          />
                          <ErrorMessage name="youtube_url" component="div" className="mt-2 text-sm text-red-500 flex items-center" />
                        </motion.div>
                      )}

                      {values.is_facebook_enabled && (
                        <motion.div 
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.7 }}
                        >
                          <label htmlFor="facebook_url" className="block text-sm font-semibold text-gray-700 mb-3">
                            Facebook Profile URL
                            <span className="text-red-500 ml-1">*</span>
                          </label>
                          <Field
                            type="url"
                            id="facebook_url"
                            name="facebook_url"
                            placeholder="https://facebook.com/yourusername"
                            className="w-full px-4 py-4 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-900 placeholder-gray-400 font-medium"
                          />
                          <ErrorMessage name="facebook_url" component="div" className="mt-2 text-sm text-red-500 flex items-center" />
                        </motion.div>
                      )}

                      {/* Age and Followers */}
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                      >
                        <div>
                          <label htmlFor="age" className="block text-sm font-semibold text-gray-700 mb-3">
                            Your Age
                            <span className="text-red-500 ml-1">*</span>
                          </label>
                          <Field
                            type="number"
                            id="age"
                            name="age"
                            placeholder="Enter your age"
                            className="w-full px-4 py-4 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-900 placeholder-gray-400 font-medium"
                          />
                          <ErrorMessage name="age" component="div" className="mt-2 text-sm text-red-500 flex items-center" />
                        </div>

                        <div>
                          <label htmlFor="follower_count" className="block text-sm font-semibold text-gray-700 mb-3">
                            Total Follower Count
                            <span className="text-red-500 ml-1">*</span>
                          </label>
                          <Field
                            type="number"
                            id="follower_count"
                            name="follower_count"
                            placeholder="Enter total follower count"
                            className="w-full px-4 py-4 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-900 placeholder-gray-400 font-medium"
                          />
                          <ErrorMessage name="follower_count" component="div" className="mt-2 text-sm text-red-500 flex items-center" />
                        </div>
                      </motion.div>

                      {/* Gender */}
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.9 }}
                      >
                        <label htmlFor="gender" className="block text-sm font-semibold text-gray-700 mb-3">
                          Gender
                          <span className="text-red-500 ml-1">*</span>
                        </label>
                        <Field
                          as="select"
                          id="gender"
                          name="gender"
                          className="w-full px-4 py-4 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-900 font-medium"
                        >
                          <option value="">Select Gender</option>
                          <option value="1">Male</option>
                          <option value="2">Female</option>
                          <option value="3">Other</option>
                        </Field>
                        <ErrorMessage name="gender" component="div" className="mt-2 text-sm text-red-500 flex items-center" />
                      </motion.div>

                      {/* Categories */}
                      <Field name="categories">
                        {({ field, form }: any) => (
                          <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1.0 }}
                          >
                            <MultiSelectCheckbox
                              label="Categories * (Select all that apply)"
                              options={categories}
                              field={field}
                              form={form}
                            />
                          </motion.div>
                        )}
                      </Field>

                      {/* Languages */}
                      <Field name="languages">
                        {({ field, form }: any) => (
                          <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1.1 }}
                          >
                            <MultiSelectCheckbox
                              label="Languages * (Select all that apply)"
                              options={languages}
                              field={field}
                              form={form}
                            />
                          </motion.div>
                        )}
                      </Field>

                      {/* Verified Profile */}
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.2 }}
                      >
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Is your profile verified?
                        </label>
                        <div className="flex items-center space-x-6">
                          <div className="flex items-center space-x-2">
                            <Field
                              type="radio"
                              id="verified_profile_yes"
                              name="verified_profile" 
                              value={true}
                              onChange={() => setFieldValue('verified_profile', true)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                            />
                            <label htmlFor="verified_profile_yes" className="text-sm font-medium text-gray-700">
                              Yes
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Field
                              type="radio"
                              id="verified_profile_no"
                              name="verified_profile"
                              value={false}
                              onChange={() => setFieldValue('verified_profile', false)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                            />
                            <label htmlFor="verified_profile_no" className="text-sm font-medium text-gray-700">
                              No
                            </label>
                          </div>
                        </div>
                      </motion.div>

                      {/* Location Fields */}
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.3 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-6"
                      >
                        <div>
                          <label htmlFor="state" className="block text-sm font-semibold text-gray-700 mb-3">
                            State
                            <span className="text-red-500 ml-1">*</span>
                          </label>
                          <Field
                            as="select"
                            id="state"
                            name="state"
                            className="w-full px-4 py-4 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-900 font-medium"
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                              setFieldValue('state', e.target.value);
                              setFieldValue('city', '');
                              setFieldValue('locality', '');
                            }}
                          >
                            <option value="">Select State</option>
                            {states.map((state: any) => (
                              <option key={state.id} value={state.id}>{state.name}</option>
                            ))}
                          </Field>
                          <ErrorMessage name="state" component="div" className="mt-2 text-sm text-red-500 flex items-center" />
                        </div>

                        <div>
                          <label htmlFor="city" className="block text-sm font-semibold text-gray-700 mb-3">
                            City
                            <span className="text-red-500 ml-1">*</span>
                          </label>
                          <Field
                            as="select"
                            id="city"
                            name="city"
                            className="w-full px-4 py-4 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-900 font-medium"
                            disabled={!values.state}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                              setFieldValue('city', e.target.value);
                              setFieldValue('locality', '');
                            }}
                          >
                            <option value="">Select City</option>
                            {values.state && cities.filter((city: any) => city.state_id === parseInt(values.state)).map((city: any) => (
                              <option key={city.id} value={city.id}>{city.name}</option>
                            ))}
                          </Field>
                          <ErrorMessage name="city" component="div" className="mt-2 text-sm text-red-500 flex items-center" />
                        </div>

                        <div>
                          <label htmlFor="locality" className="block text-sm font-semibold text-gray-700 mb-3">
                            Locality (Optional)
                          </label>
                          <Field
                            as="select"
                            id="locality"
                            name="locality"
                            className="w-full px-4 py-4 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-900 font-medium"
                            disabled={!values.city}
                          >
                            <option value="">Select Locality</option>
                            {values.city && localities.filter((locality: any) => locality.city_id === parseInt(values.city)).map((locality: any) => (
                              <option key={locality.id} value={locality.id}>{locality.name}</option>
                            ))}
                          </Field>
                        </div>
                      </motion.div>

                      {/* Audience Type and Age Group */}
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.4 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                      >
                        <div>
                          <label htmlFor="audience_type" className="block text-sm font-semibold text-gray-700 mb-3">
                            Audience Type (optional)
                          </label>
                          <Field
                            as="select"
                            id="audience_type"
                            name="audience_type"
                            className="w-full px-4 py-4 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-900 font-medium"
                          >
                            <option value="">Select Audience Type</option>
                            {audienceTypes.map(type => (
                              <option key={type.id} value={type.id}>{type.name}</option>
                            ))}
                          </Field>
                        </div>

                        <div>
                          <label htmlFor="audience_age_group" className="block text-sm font-semibold text-gray-700 mb-3">
                            Audience Age Group (optional)
                          </label>
                          <Field
                            as="select"
                            id="audience_age_group"
                            name="audience_age_group"
                            className="w-full px-4 py-4 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-900 font-medium"
                          >
                            <option value="">Select Age Group</option>
                            {audienceAgeGroups.map(ageGroup => (
                              <option key={ageGroup.id} value={ageGroup.id}>{ageGroup.name}</option>
                            ))}
                          </Field>
                        </div>
                      </motion.div>

                      {/* Submit Button */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.5 }}
                        className="pt-6"
                      >
                        <button
                          type="submit"
                          disabled={isLoading || !isValid || !dirty}
                          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center space-x-3 text-lg"
                        >
                          {isLoading ? (
                            <>
                              <LoadingSpinner size="sm" />
                              <span>Updating profile...</span>
                            </>
                          ) : (
                            <>
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              <span>Update Profile</span>
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
                transition={{ delay: 1.6 }}
                className="text-center mt-6"
              >
                <p className="text-sm text-gray-500">
                  Your profile information will be updated immediately
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
