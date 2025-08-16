'use client';

import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Select from 'react-select';
import { api } from '@/common/services/rest-api/rest-api';
import { API_ROUTES } from '@/appApi';
import { useSelector, useDispatch } from 'react-redux';
import { influencerDropodownData, selectInfluencerDropdownData } from '@/store/apiDataSlice';
import Loader from '../loader';

// Types
interface FormValues {
  title: string;
  description: string;
  categories: any[];
  languages: any[];
  minimum_followers: number;
  platforms: any[];
  total_budget: number;
  gender_preference: string;
  age_group: string;
}

// Validation schema
const formSchema = Yup.object().shape({
  title: Yup.string().required('Campaign name is required').min(3, 'Campaign name must be at least 3 characters'),
  description: Yup.string().required('Description is required').min(10, 'Description must be at least 10 characters'),
  categories: Yup.array().min(1, 'At least one category is required'),
  languages: Yup.array().min(1, 'At least one language is required'),
  minimum_followers: Yup.number().required('Minimum followers is required').min(100, 'Must be at least 100 followers'),
  platforms: Yup.array().min(1, 'At least one platform is required'),
  total_budget: Yup.number().required('Total budget is required').min(1, 'Budget must be greater than 0'),
  gender_preference: Yup.string().required('Gender preference is required'),
  age_group: Yup.string().required('Age group is required'),
});

const platforms = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'twitter', label: 'Twitter' }
];

const genderPreferences = [
  { value: 'any', label: 'Any' },
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' }
];

const ageGroups = [
  { value: '13-18', label: '13-18 years' },
  { value: '19-25', label: '19-25 years' },
  { value: '26-35', label: '26-35 years' },
  { value: '36-45', label: '36-45 years' },
  { value: '46-55', label: '46-55 years' },
  { value: '56+', label: '56+ years' }
];

// Test categories for demonstration purposes
const categoriesList = [
  { id: 'fashion', name: 'Fashion' },
  { id: 'beauty', name: 'Beauty' },
  { id: 'fitness', name: 'Fitness' },
  { id: 'travel', name: 'Travel' },
  { id: 'food', name: 'Food' },
  { id: 'technology', name: 'Technology' },
  { id: 'gaming', name: 'Gaming' },
  { id: 'lifestyle', name: 'Lifestyle' },
  { id: 'education', name: 'Education' },
  { id: 'music', name: 'Music' }
];

// Custom Select Styles
const customSelectStyles = {
  control: (provided: any, state: any) => ({
    ...provided,
    padding: '8px 12px',
    border: state.isFocused ? '2px solid #000' : '1px solid #d1d5db',
    borderRadius: '8px',
    boxShadow: state.isFocused ? '0 0 0 2px rgba(0, 0, 0, 0.1)' : 'none',
    '&:hover': {
      border: state.isFocused ? '2px solid #000' : '1px solid #9ca3af'
    }
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isSelected ? '#000' : state.isFocused ? '#f3f4f6' : 'white',
    color: state.isSelected ? 'white' : '#000',
    padding: '12px 16px',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: state.isSelected ? '#000' : '#f3f4f6'
    }
  }),
  multiValue: (provided: any) => ({
    ...provided,
    backgroundColor: '#000',
    color: 'white',
    borderRadius: '6px',
    padding: '2px 6px'
  }),
  multiValueLabel: (provided: any) => ({
    ...provided,
    color: 'white',
    fontWeight: '500'
  }),
  multiValueRemove: (provided: any) => ({
    ...provided,
    color: 'white',
    '&:hover': {
      backgroundColor: '#374151',
      color: 'white'
    }
  }),
  placeholder: (provided: any) => ({
    ...provided,
    color: '#9ca3af'
  }),
  menu: (provided: any) => ({
    ...provided,
    borderRadius: '8px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
  })
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

export default function CampaignsCreate() {    
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const dispatch = useDispatch();
  const influencerDropdownData = useSelector(selectInfluencerDropdownData);

  const [categories, setCategories] = useState(categoriesList);
  const [languages, setLanguages] = useState([]);

  // Initial values
  const initialValues: FormValues = {
    title: '',
    description: '',
    categories: [],
    languages: [],
    minimum_followers: 0,
    platforms: [],
    total_budget: 0,
    gender_preference: '',
    age_group: ''
  };

  // Show toast notification
  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  // Fetch dropdown data
  useEffect(() => {
    const fetchData = async () => {
      try {
        if(influencerDropdownData) {
          setCategories(influencerDropdownData.categories);
          setLanguages(influencerDropdownData.languages);
        } else {
          // Fetch dropdown data
          const dropdownResponse = await api.get(API_ROUTES.dropdownData);
          if (dropdownResponse.status === 1) {
            const data: any = dropdownResponse.data;
            // setCategories(data.categories);
            setLanguages(data.languages);
            dispatch(influencerDropodownData(data));
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        showToast('Error loading dropdown data', 'error');
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) => {
    try {
      const payload = {
        title: values.title,
        description: values.description,
        categories: values.categories.map((category: any) => parseInt(category.value.toString())),
        languages: values.languages.map((language: any) => parseInt(language.value.toString())),
        minimum_followers: values.minimum_followers,
        platforms: values.platforms.map((platform: any) => platform.value),
        total_budget: values.total_budget,
        gender_preference: values.gender_preference,
        age_group: values.age_group
      };

      setIsLoading(true);

      // Replace with your actual API endpoint for campaign creation
      const response = await api.post('/api/campaigns/create', payload);
      
      if (response.status === 1) {
        showToast('Campaign created successfully!', 'success');
        router.push('/campaigns');
      } else {
        showToast(response.message || 'Failed to create campaign', 'error');
      }
    } catch (error) {
      console.error('Error creating campaign:', error);
      showToast('Network error. Please try again.', 'error');
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <>
      {isLoading && <Loader />}
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
        <div className="w-full px-2 py-3 border-b border-gray-200 sticky top-0 z-[100] bg-white">
          <div className="relative">
            <Link
              href="/campaigns"
              className="mr-2 p-2 hover:bg-gray-100 rounded-full transition-colors absolute left-0 top-1/2 -translate-y-1/2"
            >
              <svg className="w-6 h-6 text-gray-600 hover:text-gray-900" fill="none" stroke="#ccc" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-lg font-medium text-gray-900 text-center">Create Campaign</h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-4 py-3">
          {/* Description */}
          <p className="text-gray-600 text-base mb-8 leading-relaxed text-[14px]">
            Create a new campaign to connect with influencers and reach your target audience.
          </p>

          {/* Form */}
          <Formik
            initialValues={initialValues}
            validationSchema={formSchema}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue, isValid, dirty }) => (
              <Form className="space-y-6">
                {/* Campaign Name */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-black mb-2">
                    Campaign Name
                  </label>
                  <Field
                    type="text"
                    id="title"
                    name="title"
                    placeholder="Enter campaign name"
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all duration-200 text-black placeholder-gray-400"
                  />
                  <ErrorMessage name="title" component="div" className="mt-1 text-sm text-red-500" />
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-black mb-2">
                    Description
                  </label>
                  <Field
                    as="textarea"
                    id="description"
                    name="description"
                    rows={4}
                    placeholder="Enter campaign description and instructions"
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all duration-200 text-black placeholder-gray-400 resize-none"
                  />
                  <ErrorMessage name="description" component="div" className="mt-1 text-sm text-red-500" />
                </div>

                {/* Categories */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Categories (Select all that apply)
                  </label>
                  <Select
                    isMulti
                    options={categories.map((cat: any) => ({ value: cat.id, label: cat.name }))}
                    value={values.categories}
                    onChange={(selectedOptions) => setFieldValue('categories', selectedOptions || [])}
                    placeholder="Select categories"
                    styles={customSelectStyles}
                    className="text-sm"
                  />
                  <ErrorMessage name="categories" component="div" className="mt-1 text-sm text-red-500" />
                </div>

                {/* Languages */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Languages (Select all that apply)
                  </label>
                  <Select
                    isMulti
                    options={languages.map((lang: any) => ({ value: lang.id, label: lang.name }))}
                    value={values.languages}
                    onChange={(selectedOptions) => setFieldValue('languages', selectedOptions || [])}
                    placeholder="Select languages"
                    styles={customSelectStyles}
                    className="text-sm"
                  />
                  <ErrorMessage name="languages" component="div" className="mt-1 text-sm text-red-500" />
                </div>

                {/* Minimum Followers and Platforms */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="minimum_followers" className="block text-sm font-medium text-black mb-2">
                      Minimum Followers
                    </label>
                    <Field
                      type="number"
                      id="minimum_followers"
                      name="minimum_followers"
                      placeholder="Enter minimum followers"
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all duration-200 text-black placeholder-gray-400"
                    />
                    <ErrorMessage name="minimum_followers" component="div" className="mt-1 text-sm text-red-500" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Platforms (Select all that apply)
                    </label>
                    <Select
                      isMulti
                      options={platforms}
                      value={values.platforms}
                      onChange={(selectedOptions) => setFieldValue('platforms', selectedOptions || [])}
                      placeholder="Select platforms"
                      styles={customSelectStyles}
                      className="text-sm"
                    />
                    <ErrorMessage name="platforms" component="div" className="mt-1 text-sm text-red-500" />
                  </div>
                </div>

                {/* Total Budget */}
                <div>
                  <label htmlFor="total_budget" className="block text-sm font-medium text-black mb-2">
                    Total Budget
                  </label>
                  <Field
                    type="number"
                    id="total_budget"
                    name="total_budget"
                    placeholder="Enter total budget"
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all duration-200 text-black placeholder-gray-400"
                  />
                  <ErrorMessage name="total_budget" component="div" className="mt-1 text-sm text-red-500" />
                </div>

                {/* Gender Preference and Age Group */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="gender_preference" className="block text-sm font-medium text-black mb-2">
                      Gender Preference
                    </label>
                    <Field
                      as="select"
                      id="gender_preference"
                      name="gender_preference"
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all duration-200 text-black"
                    >
                      <option value="">Select Gender</option>
                      {genderPreferences.map(gender => (
                        <option key={gender.value} value={gender.value}>{gender.label}</option>
                      ))}
                    </Field>
                    <ErrorMessage name="gender_preference" component="div" className="mt-1 text-sm text-red-500" />
                  </div>

                  <div>
                    <label htmlFor="age_group" className="block text-sm font-medium text-black mb-2">
                      Age Group
                    </label>
                    <Field
                      as="select"
                      id="age_group"
                      name="age_group"
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all duration-200 text-black"
                    >
                      <option value="">Select Age Group</option>
                      {ageGroups.map(ageGroup => (
                        <option key={ageGroup.value} value={ageGroup.value}>{ageGroup.label}</option>
                      ))}
                    </Field>
                    <ErrorMessage name="age_group" component="div" className="mt-1 text-sm text-red-500" />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6 flex justify-center">
                  <button
                    type="submit"
                    disabled={!isValid || !dirty || isLoading}
                    className="bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 disabled:cursor-not-allowed mx-auto"
                    style={{width: '90%'}}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <LoadingSpinner size="sm" />
                        <span>Creating campaign...</span>
                      </div>
                    ) : (
                      'Create Campaign'
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
