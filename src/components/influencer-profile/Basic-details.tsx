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
      <label className="block text-sm font-medium text-black mb-3">
        {label}
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
              className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
            />
            <span className="text-sm text-black">{option.name}</span>
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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-white text-gray-900">
        {/* Toast Notifications */}
        {toast && (
          <div className={`fixed top-4 right-4 z-50 ${toast.type === 'success' ? 'bg-green-500' : toast.type === 'error' ? 'bg-red-500' : 'bg-blue-500'} text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center max-w-sm backdrop-blur-sm`}>
            <span className="mr-2 font-bold text-lg">{toast.type === 'success' ? '✓' : toast.type === 'error' ? '✕' : 'ℹ'}</span>
            <span className="flex-1">{toast.message}</span>
            <button onClick={() => setToast(null)} className="ml-2 text-white hover:text-gray-200 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Header */}
        <div className="w-full px-2 py-3 border-b border-gray-200">
          <div className="relative">
            <Link
              href="/profile/edit"
              className="mr-2 p-2 hover:bg-gray-100 rounded-full transition-colors absolute left-0 top-1/2 -translate-y-1/2"
            >
               <svg className="w-6 h-6 text-gray-600 hover:text-gray-900 " fill="none" stroke="#ccc" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            </Link>
            <h1 className="text-lg font-medium text-gray-900 text-center">Edit Basic Details</h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-4 py-3">
          {/* Description */}
          <p className="text-gray-600 text-base mb-8 leading-relaxed text-[14px]">
            Update your personal information and social media presence.
          </p>

          {/* Form */}
          <Formik
            initialValues={initialValues}
            validationSchema={formSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ values, setFieldValue, isValid, dirty }) => (
              <Form className="space-y-6">
                {/* Username */}
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-black mb-2">
                    Username
                  </label>
                  <Field
                    type="text"
                    id="username"
                    name="username"
                    placeholder="Enter your username"
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all duration-200 text-black placeholder-gray-400"
                  />
                  <ErrorMessage name="username" component="div" className="mt-1 text-sm text-red-500" />
                </div>

                {/* Platforms */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Social Media Platforms
                  </label>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-x-3">
                      <label className="flex items-center space-x-3 cursor-pointer p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <input
                          type="checkbox"
                          name="is_instagram_enabled"
                          checked={values.is_instagram_enabled === true}
                          onChange={() => setFieldValue('is_instagram_enabled', !values.is_instagram_enabled)}
                          className="h-5 w-5 text-black focus:ring-black border-gray-300 rounded"
                        />
                        <span className="text-sm font-medium text-black">Instagram</span>
                      </label>

                      <label className="flex items-center space-x-3 cursor-pointer p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <input
                          type="checkbox"
                          name="is_youtube_enabled"
                          checked={values.is_youtube_enabled === true}
                          onChange={() => setFieldValue('is_youtube_enabled', !values.is_youtube_enabled)}
                          className="h-5 w-5 text-black focus:ring-black border-gray-300 rounded"
                        />
                        <span className="text-sm font-medium text-black">YouTube</span>
                      </label>

                      <label className="flex items-center space-x-3 cursor-pointer p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <input
                          type="checkbox"
                          name="is_facebook_enabled"
                          checked={values.is_facebook_enabled === true}
                          onChange={() => setFieldValue('is_facebook_enabled', !values.is_facebook_enabled)}
                          className="h-5 w-5 text-black focus:ring-black border-gray-300 rounded"
                        />
                        <span className="text-sm font-medium text-black">Facebook</span>
                      </label>
                    </div>
                  </div>
                  <ErrorMessage name="platforms_required" component="div" className="mt-1 text-sm text-red-500" />
                </div>

                {/* Platform URLs */}
                {values.is_instagram_enabled && (
                  <div>
                    <label htmlFor="instagram_url" className="block text-sm font-medium text-black mb-2">
                      Instagram Profile URL
                    </label>
                    <Field
                      type="url"
                      id="instagram_url"
                      name="instagram_url"
                      placeholder="https://instagram.com/yourusername"
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all duration-200 text-black placeholder-gray-400"
                    />
                    <ErrorMessage name="instagram_url" component="div" className="mt-1 text-sm text-red-500" />
                  </div>
                )}

                {values.is_youtube_enabled && (
                  <div>
                    <label htmlFor="youtube_url" className="block text-sm font-medium text-black mb-2">
                      YouTube Channel URL
                    </label>
                    <Field
                      type="url"
                      id="youtube_url"
                      name="youtube_url"
                      placeholder="https://youtube.com/@yourchannel"
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all duration-200 text-black placeholder-gray-400"
                    />
                    <ErrorMessage name="youtube_url" component="div" className="mt-1 text-sm text-red-500" />
                  </div>
                )}

                {values.is_facebook_enabled && (
                  <div>
                    <label htmlFor="facebook_url" className="block text-sm font-medium text-black mb-2">
                      Facebook Profile URL
                    </label>
                    <Field
                      type="url"
                      id="facebook_url"
                      name="facebook_url"
                      placeholder="https://facebook.com/yourusername"
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all duration-200 text-black placeholder-gray-400"
                    />
                    <ErrorMessage name="facebook_url" component="div" className="mt-1 text-sm text-red-500" />
                  </div>
                )}

                {/* Age and Followers */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="age" className="block text-sm font-medium text-black mb-2">
                      Your Age
                    </label>
                    <Field
                      type="number"
                      id="age"
                      name="age"
                      placeholder="Enter your age"
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all duration-200 text-black placeholder-gray-400"
                    />
                    <ErrorMessage name="age" component="div" className="mt-1 text-sm text-red-500" />
                  </div>

                  <div>
                    <label htmlFor="follower_count" className="block text-sm font-medium text-black mb-2">
                      Total Follower Count
                    </label>
                    <Field
                      type="number"
                      id="follower_count"
                      name="follower_count"
                      placeholder="Enter total follower count"
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all duration-200 text-black placeholder-gray-400"
                    />
                    <ErrorMessage name="follower_count" component="div" className="mt-1 text-sm text-red-500" />
                  </div>
                </div>

                {/* Gender */}
                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-black mb-2">
                    Gender
                  </label>
                  <Field
                    as="select"
                    id="gender"
                    name="gender"
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all duration-200 text-black"
                  >
                    <option value="">Select Gender</option>
                    <option value="1">Male</option>
                    <option value="2">Female</option>
                    <option value="3">Other</option>
                  </Field>
                  <ErrorMessage name="gender" component="div" className="mt-1 text-sm text-red-500" />
                </div>

                {/* Categories */}
                <Field name="categories">
                  {({ field, form }: any) => (
                    <div>
                      <MultiSelectCheckbox
                        label="Categories (Select all that apply)"
                        options={categories}
                        field={field}
                        form={form}
                      />
                    </div>
                  )}
                </Field>

                {/* Languages */}
                <Field name="languages">
                  {({ field, form }: any) => (
                    <div>
                      <MultiSelectCheckbox
                        label="Languages (Select all that apply)"
                        options={languages}
                        field={field}
                        form={form}
                      />
                    </div>
                  )}
                </Field>

                {/* Verified Profile */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
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
                        className="h-4 w-4 text-black focus:ring-black border-gray-300"
                      />
                      <label htmlFor="verified_profile_yes" className="text-sm font-medium text-black">
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
                        className="h-4 w-4 text-black focus:ring-black border-gray-300"
                      />
                      <label htmlFor="verified_profile_no" className="text-sm font-medium text-black">
                        No
                      </label>
                    </div>
                  </div>
                </div>

                {/* Location Fields */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-black mb-2">
                      State
                    </label>
                    <Field
                      as="select"
                      id="state"
                      name="state"
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all duration-200 text-black"
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
                    <ErrorMessage name="state" component="div" className="mt-1 text-sm text-red-500" />
                  </div>

                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-black mb-2">
                      City
                    </label>
                    <Field
                      as="select"
                      id="city"
                      name="city"
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all duration-200 text-black"
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
                    <ErrorMessage name="city" component="div" className="mt-1 text-sm text-red-500" />
                  </div>

                  <div>
                    <label htmlFor="locality" className="block text-sm font-medium text-black mb-2">
                      Locality (Optional)
                    </label>
                    <Field
                      as="select"
                      id="locality"
                      name="locality"
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all duration-200 text-black"
                      disabled={!values.city}
                    >
                      <option value="">Select Locality</option>
                      {values.city && localities.filter((locality: any) => locality.city_id === parseInt(values.city)).map((locality: any) => (
                        <option key={locality.id} value={locality.id}>{locality.name}</option>
                      ))}
                    </Field>
                  </div>
                </div>

                {/* Audience Type and Age Group */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="audience_type" className="block text-sm font-medium text-black mb-2">
                      Audience Type (optional)
                    </label>
                    <Field
                      as="select"
                      id="audience_type"
                      name="audience_type"
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all duration-200 text-black"
                    >
                      <option value="">Select Audience Type</option>
                      {audienceTypes.map(type => (
                        <option key={type.id} value={type.id}>{type.name}</option>
                      ))}
                    </Field>
                  </div>

                  <div>
                    <label htmlFor="audience_age_group" className="block text-sm font-medium text-black mb-2">
                      Audience Age Group (optional)
                    </label>
                    <Field
                      as="select"
                      id="audience_age_group"
                      name="audience_age_group"
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all duration-200 text-black"
                    >
                      <option value="">Select Age Group</option>
                      {audienceAgeGroups.map(ageGroup => (
                        <option key={ageGroup.id} value={ageGroup.id}>{ageGroup.name}</option>
                      ))}
                    </Field>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6 flex justify-center">
                  <button
                    type="submit"
                    disabled={isLoading || !isValid || !dirty}
                    className="bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 disabled:cursor-not-allowed mx-auto" style={{width: '90%'}}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <LoadingSpinner size="sm" />
                        <span>Updating profile...</span>
                      </div>
                    ) : (
                      'Update Profile'
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
}
