'use client';

import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import Select from 'react-select';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { selectIsLoggedIn } from '@/store/userRoleSlice';
import { api } from '@/common/services/rest-api/rest-api';
import { API_ROUTES } from '@/appApi';
import { useSelector,useDispatch } from 'react-redux';
import { influencerDropodownData, selectInfluencerDropdownData } from '@/store/apiDataSlice';
import Loader from '../../loader';
import citiesData from '@/data/cities.json';

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
  city_id: number | null;
  age: number;
  follower_count: number;
  instagram_url: string;
  youtube_url: string;
  facebook_url: string;
  audience_type: string;
  audience_age_group: string;
  starting_price: number;
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
  city_id: Yup.number().nullable().required('City is required'),
  // age: Yup.number().required('Age is required').min(13, 'Must be at least 13 years old').max(100, 'Invalid age'),
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
  starting_price: Yup.number().required('Starting price is required').min(1, 'Must have at least 100 followers'),
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

// Custom styles for react-select
const customSelectStyles = {
  control: (provided: any, state: any) => ({
    ...provided,
    borderColor: state.isFocused ? '#000' : '#d1d5db',
    borderWidth: '1px',
    borderRadius: '0.5rem',
    backgroundColor: '#fff',
    padding: '0.5rem',
    boxShadow: 'none',
    '&:hover': {
      borderColor: '#000'
    }
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isSelected ? '#000' : state.isFocused ? '#f3f4f6' : 'white',
    color: state.isSelected ? 'white' : '#111827',
    padding: '0.5rem 0.75rem',
    cursor: 'pointer'
  }),
  menu: (provided: any) => ({
    ...provided,
    zIndex: 1000,
    position: 'relative',
  }),
  placeholder: (provided: any) => ({
    ...provided,
    color: '#9ca3af'
  })
};

// Transform cities data for react-select
const cityOptions = citiesData.map(city => ({
  value: city.city_id,
  label: city.name,
  state_id: city.state_id,
  state_name: city.state_name
}));

export default function EditBasicDetails() {    
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const dispatch = useDispatch();
  const influencerDropdownData = useSelector(selectInfluencerDropdownData);

  const [categories, setCategories] = useState([]);
  const [languages, setLanguages] = useState([]);

  //unused
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const [isLoadingData, setIsLoadingData] = useState(true);

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
    city_id: null,
    age: 0,
    follower_count: 0,
    instagram_url: '',
    youtube_url: '',
    facebook_url: '',
    audience_type: '',
    audience_age_group: '',
    platforms_required: '',
    starting_price: 0
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

        if(influencerDropdownData) {
          setCategories(influencerDropdownData.categories);
          setLanguages(influencerDropdownData.languages);
          getBasicDetails();
        } else {
          // Fetch dropdown data
          const dropdownResponse = await api.get(API_ROUTES.dropdownData);
        if (dropdownResponse.status === 1) {
          const data: any = dropdownResponse.data;
          setCategories(data.categories);
          setLanguages(data.languages);
          dispatch(influencerDropodownData(data));
          getBasicDetails();
        }
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

  // Get basic details
  const getBasicDetails = async () => {
    setIsLoading(true);
    api.get(API_ROUTES.getInfluencerProfile).then((response) => {
      setIsLoading(false);
      console.log(response, 'response')
      if (response.status === 1) {
        console.log(response.data, 'response.data');
        const data = response.data;
        console.log(data.influencer_categories.map((item: any) => item.category_id))

        const patchData= {
          username: data.username,
          is_instagram_enabled: data.is_instagram_enabled == 1 ? true : false,
          is_youtube_enabled: data.is_youtube_enabled == 1 ? true : false,
          is_facebook_enabled: data.is_facebook_enabled == 1 ? true : false,
          gender: data.gender.toString(),
          categories: data.influencer_categories.map((item: any) => item.category_id),
          languages: data.influencer_languages.map((item: any) => item.language_id),
          verified_profile: data.verified_profile == 1 ? true : false,
          city_id: data.city ? parseInt(data.city.toString()) : null,
          age: data.age || 0,
          follower_count: data.follower_count || 0,
          instagram_url: data.instagram_url || '',
          youtube_url: data.youtube_url || '',
          facebook_url: data.facebook_url || '',
          audience_type: data.audience_type != null ? data.audience_type.toString() : '',
          audience_age_group: data.audience_age_group != null ? data.audience_age_group.toString() : '',
          platforms_required: '',
          starting_price: data.starting_price || 0
        }
        setInitialValues(patchData);
      } else {
        showToast(response.message || 'Failed to update profile', 'error'); 
      }
    });
  }
  

  const handleSubmit = async (values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) => {
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
        city_id: values.city_id,
        categories: values.categories.map((category: any) => parseInt(category.toString())),
        languages: values.languages.map((language: any) => parseInt(language.toString())),
        starting_price: values.starting_price
      }
      setIsLoading(true);

      const response = await api.post(API_ROUTES.addUpdateInfluencer, payload);
      if (response.status === 1) {
        showToast('Profile updated successfully!', 'success');
        // router.push('/profile/edit');
      setIsLoading(false);

      } else {
      setIsLoading(false);
        showToast(response.message || 'Failed to update profile', 'error');
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Error updating profile:', error);
      showToast('Network error. Please try again.', 'error');
    }
  };

  // if (isLoadingData) {
  //   return (
  //     <div className="min-h-screen bg-white flex items-center justify-center">
  //       <div className="text-center">
  //         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
  //         <p className="text-gray-600">Loading your profile...</p>
  //       </div>
  //     </div>
  //   );
  // }

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
        <header className="sticky top-0 z-20 bg-white border-b border-gray-200 pr-4 py-3">
        <div className="flex items-center justify-center relative">
          <Link 
            href="/profile/edit"
            className="p-2 rounded-full hover:bg-gray-100 absolute left-0 top-1/2 -translate-y-1/2"
          >
            <svg className="w-5 h-5" fill="none" stroke="#ccc" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-lg font-medium text-gray-900"> Edit Basic Details</h1>
        </div>
      </header>

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
                {/* Username - DISABLED */}
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-black mb-2">
                    Username
                  </label>
                  <Field
                    type="text"
                    id="username"
                    name="username"
                    placeholder="Enter your username"
                    disabled
                    className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-black placeholder-gray-400 cursor-not-allowed opacity-60"
                  />
                  <ErrorMessage name="username" component="div" className="mt-1 text-sm text-red-500" />
                </div>

                {/* Platforms - DISABLED (Only Instagram) */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Social Media Platform
                  </label>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-x-3">
                      <label className="flex items-center space-x-3 p-3 bg-gray-100 rounded-lg opacity-60 cursor-not-allowed">
                        <input
                          type="checkbox"
                          name="is_instagram_enabled"
                          checked={values.is_instagram_enabled === true}
                          disabled
                          className="h-5 w-5 text-black border-gray-300 rounded cursor-not-allowed"
                        />
                        <span className="text-sm font-medium text-black">Instagram</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Platform URLs - DISABLED */}
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
                      disabled
                      className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-black placeholder-gray-400 cursor-not-allowed opacity-60"
                    />
                    <ErrorMessage name="instagram_url" component="div" className="mt-1 text-sm text-red-500" />
                  </div>
                )}

<div>
                    <label htmlFor="follower_count" className="block text-sm font-medium text-black mb-2">
                      Total Follower Count
                    </label>
                    <Field
                      type="number"
                      id="follower_count"
                      name="follower_count"
                      placeholder="Enter total follower count"
                      disabled
                      className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-black placeholder-gray-400 cursor-not-allowed opacity-60"
                    />
                    <ErrorMessage name="follower_count" component="div" className="mt-1 text-sm text-red-500" />
                  </div>

                  {/* Verified Profile - DISABLED */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Is your profile verified?
                  </label>
                  <div className="flex items-center space-x-6 opacity-60">
                    <div className="flex items-center space-x-2">
                      <Field
                        type="radio"
                        id="verified_profile_yes"
                        name="verified_profile" 
                        value={true}
                        disabled
                        className="h-4 w-4 text-black border-gray-300 cursor-not-allowed"
                      />
                      <label htmlFor="verified_profile_yes" className="text-sm font-medium text-black cursor-not-allowed">
                        Yes
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Field
                        type="radio"
                        id="verified_profile_no"
                        name="verified_profile"
                        value={false}
                        disabled
                        className="h-4 w-4 text-black border-gray-300 cursor-not-allowed"
                      />
                      <label htmlFor="verified_profile_no" className="text-sm font-medium text-black cursor-not-allowed">
                        No
                      </label>
                    </div>
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

                      {/* Age and Followers */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="age" className="block text-sm font-medium text-black mb-2">
                       Age (optional)
                    </label>
                    <Field
                      type="number"
                      id="age"
                      name="age"
                      placeholder="Enter your age"
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all duration-200 text-black placeholder-gray-400"
                    />
                    {/* <ErrorMessage name="age" component="div" className="mt-1 text-sm text-red-500" /> */}
                  </div>
                 
                </div>
                                {/* Location - Single City Dropdown */}
                                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Location
                  </label>
                  <Select
                    options={cityOptions}
                    value={cityOptions.find(option => option.value === values.city_id) || null}
                    onChange={(selectedOption) => {
                      setFieldValue('city_id', selectedOption ? selectedOption.value : null);
                    }}
                    placeholder="Select city"
                    styles={customSelectStyles}
                    isClearable
                    isSearchable
                  />
                  <ErrorMessage name="city_id" component="div" className="mt-1 text-sm text-red-500" />
                </div>

                                {/* Age and Followers */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="starting_price" className="block text-sm font-medium text-black mb-2">
                      Starting Price
                    </label>
                    <Field
                      type="number"
                      id="starting_price"
                      name="starting_price"
                      placeholder="Enter starting price"
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all duration-200 text-black placeholder-gray-400"
                    />
                    <ErrorMessage name="starting_price" component="div" className="mt-1 text-sm text-red-500" />
                  </div>
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
