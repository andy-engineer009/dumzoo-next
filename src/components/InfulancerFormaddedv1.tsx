'use client';

import { useState, useRef } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface InfluencerFormValues {
  username: string;
  location: string;
  state: string;
  followers: number;
  gender: string;
  categories: string[];
  instagramUrl: string;
  youtubeUrl: string;
  facebookUrl: string;
  instagramPostPrice: number;
  instagramStoryPrice: number;
  instagramReelPrice: number;
  instagramComboPrice: number;
  youtubeVideoPrice: number;
  youtubeShortsPrice: number;
  workImage: File | null;
}

interface InfluencerFormProps {
  isEditMode?: boolean;
  initialValues?: Partial<InfluencerFormValues>;
  onSubmit: (values: InfluencerFormValues) => void;
}

const categories = [
  'Fashion & Beauty',
  'Technology',
  'Fitness & Health',
  'Food & Cooking',
  'Travel',
  'Lifestyle',
  'Gaming',
  'Education',
  'Business',
  'Entertainment',
  'Sports',
  'Art & Design',
  'Parenting',
  'Pet & Animals',
  'Automotive',
  'Finance'
];

const states = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

const InfluencerForm = ({ isEditMode = false, initialValues = {}, onSubmit }: InfluencerFormProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const defaultValues: InfluencerFormValues = {
    username: '',
    location: '',
    state: '',
    followers: 0,
    gender: '',
    categories: [],
    instagramUrl: '',
    youtubeUrl: '',
    facebookUrl:'',
    instagramPostPrice: 0,
    instagramStoryPrice: 0,
    instagramReelPrice: 0,
    instagramComboPrice: 0,
    youtubeVideoPrice: 0,
    youtubeShortsPrice: 0,
    workImage: null,
    ...initialValues
  };

  const validationSchema = Yup.object({
    username: Yup.string()
      .min(3, 'Username must be at least 3 characters')
      .max(50, 'Username must be less than 50 characters')
      .required('Username is required'),
    location: Yup.string()
      .min(2, 'Location must be at least 2 characters')
      .required('Location is required'),
    state: Yup.string()
      .required('State is required'),
    followers: Yup.number()
      .min(100, 'Followers must be at least 100')
      .required('Followers count is required'),
    gender: Yup.string()
      .required('Gender is required'),
    categories: Yup.array()
      .min(1, 'Please select at least one category')
      .required('At least one category is required'),
    instagramUrl: Yup.string()
      .url('Please enter a valid Instagram URL'),
    youtubeUrl: Yup.string()
      .url('Please enter a valid YouTube URL'),
    instagramPostPrice: Yup.number()
      .when('instagramUrl', {
        is: (instagramUrl: string) => instagramUrl && instagramUrl !== '',
        then: (schema) => schema.min(100, 'Price must be at least ₹100').required('Instagram post price is required'),
        otherwise: (schema) => schema.optional(),
      }),
    instagramStoryPrice: Yup.number()
      .when('instagramUrl', {
        is: (instagramUrl: string) => instagramUrl && instagramUrl !== '',
        then: (schema) => schema.min(100, 'Price must be at least ₹100').required('Instagram story price is required'),
        otherwise: (schema) => schema.optional(),
      }),
    instagramReelPrice: Yup.number()
      .when('instagramUrl', {
        is: (instagramUrl: string) => instagramUrl && instagramUrl !== '',
        then: (schema) => schema.min(100, 'Price must be at least ₹100').required('Instagram reel price is required'),
        otherwise: (schema) => schema.optional(),
      }),
    instagramComboPrice: Yup.number()
      .when('instagramUrl', {
        is: (instagramUrl: string) => instagramUrl && instagramUrl !== '',
        then: (schema) => schema.min(100, 'Price must be at least ₹100').required('Instagram combo price is required'),
        otherwise: (schema) => schema.optional(),
      }),
    youtubeVideoPrice: Yup.number()
      .when('youtubeUrl', {
        is: (youtubeUrl: string) => youtubeUrl && youtubeUrl !== '',
        then: (schema) => schema.min(100, 'Price must be at least ₹100').required('YouTube video price is required'),
        otherwise: (schema) => schema.optional(),
      }),
    youtubeShortsPrice: Yup.number()
      .when('youtubeUrl', {
        is: (youtubeUrl: string) => youtubeUrl && youtubeUrl !== '',
        then: (schema) => schema.min(100, 'Price must be at least ₹100').required('YouTube shorts price is required'),
        otherwise: (schema) => schema.optional(),
      }),
    workImage: Yup.mixed()
      .required('Work image is required')
      .test('fileSize', 'File size must be less than 5MB', (value) => {
        if (!value || !(value instanceof File)) return true;
        const file = value as File;
        return file.size <= 5 * 1024 * 1024;
      })
      .test('fileType', 'Only image files are allowed', (value) => {
        if (!value || !(value instanceof File)) return true;
        const file = value as File;
        return ['image/jpeg', 'image/png', 'image/webp'].includes(file.type);
      }),
  }).test('social-media-required', 'At least one social media platform is required', function(value) {
    const { instagramUrl, youtubeUrl } = value;
    if (!instagramUrl && !youtubeUrl) {
      return this.createError({ message: 'Please provide at least one social media URL' });
    }
    return true;
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>, setFieldValue: (field: string, value: any) => void) => {
    const file = event.target.files?.[0];
    if (file) {
      setFieldValue('workImage', file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setImageError(false);
    }
  };

  const formatCurrency = (amount: number): string => {
    return `₹${amount.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back to Home Button */}
        <div className="absolute top-4 left-4 sm:top-8 sm:left-8">
          <button
            onClick={() => router.push('/')}
            className="flex items-center justify-center p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Back to Home"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isEditMode ? 'Edit Influencer Profile' : 'List as Influencer'}
          </h1>
          <p className="text-gray-600">
            {isEditMode 
              ? 'Update your influencer profile information'
              : 'Join our platform and start collaborating with brands'
            }
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8">
          <Formik
            initialValues={defaultValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({ values, setFieldValue, isSubmitting }) => (
              <Form className="space-y-8">
                {/* Basic Information */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                        Username *
                      </label>
                      <Field
                        type="text"
                        id="username"
                        name="username"
                        placeholder="Enter your username"
                        disabled={isEditMode}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors disabled:bg-gray-100"
                      />
                      <ErrorMessage name="username" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    <div>
                      <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                        Gender *
                      </label>
                      <Field
                        as="select"
                        id="gender"
                        name="gender"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </Field>
                      <ErrorMessage name="gender" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    <div>
                      <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                        City/Location *
                      </label>
                      <Field
                        type="text"
                        id="location"
                        name="location"
                        placeholder="Enter your city"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                      />
                      <ErrorMessage name="location" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    <div>
                      <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                        State *
                      </label>
                      <Field
                        as="select"
                        id="state"
                        name="state"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                      >
                        <option value="">Select State</option>
                        {states.map((state) => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </Field>
                      <ErrorMessage name="state" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    <div>
                      <label htmlFor="followers" className="block text-sm font-medium text-gray-700 mb-2">
                        Total Followers *
                      </label>
                      <Field
                        type="number"
                        id="followers"
                        name="followers"
                        placeholder="Enter total followers"
                        min="100"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                      />
                      <ErrorMessage name="followers" component="div" className="text-red-500 text-sm mt-1" />
                    </div>
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Categories *</h2>
                  <p className="text-sm text-gray-600 mb-4">Select at least one category that best describes your content</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {categories.map((category) => (
                      <label key={category} className="flex items-center space-x-2 cursor-pointer">
                        <Field
                          type="checkbox"
                          name="categories"
                          value={category}
                          className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700">{category}</span>
                      </label>
                    ))}
                  </div>
                  <ErrorMessage name="categories" component="div" className="text-red-500 text-sm mt-2" />
                </div>

                {/* Social Media Links */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Social Media Links *</h2>
                  <p className="text-sm text-gray-600 mb-4">Provide at least one social media platform</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="instagramUrl" className="block text-sm font-medium text-gray-700 mb-2">
                        Instagram URL
                      </label>
                      <Field
                        type="url"
                        id="instagramUrl"
                        name="instagramUrl"
                        placeholder="https://instagram.com/yourusername"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                      />
                      <ErrorMessage name="instagramUrl" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    <div>
                      <label htmlFor="youtubeUrl" className="block text-sm font-medium text-gray-700 mb-2">
                        YouTube URL
                      </label>
                      <Field
                        type="url"
                        id="youtubeUrl"
                        name="youtubeUrl"
                        placeholder="https://youtube.com/@yourchannel"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                      />
                      <ErrorMessage name="youtubeUrl" component="div" className="text-red-500 text-sm mt-1" />
                    </div>
                  </div>
                </div>

                {/* Instagram Pricing */}
                {values.instagramUrl && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Instagram Pricing *</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="instagramPostPrice" className="block text-sm font-medium text-gray-700 mb-2">
                          Post Price (₹)
                        </label>
                        <Field
                          type="number"
                          id="instagramPostPrice"
                          name="instagramPostPrice"
                          placeholder="Enter price"
                          min="100"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                        />
                        <ErrorMessage name="instagramPostPrice" component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      <div>
                        <label htmlFor="instagramStoryPrice" className="block text-sm font-medium text-gray-700 mb-2">
                          Story Price (₹)
                        </label>
                        <Field
                          type="number"
                          id="instagramStoryPrice"
                          name="instagramStoryPrice"
                          placeholder="Enter price"
                          min="100"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                        />
                        <ErrorMessage name="instagramStoryPrice" component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      <div>
                        <label htmlFor="instagramReelPrice" className="block text-sm font-medium text-gray-700 mb-2">
                          Reel Price (₹)
                        </label>
                        <Field
                          type="number"
                          id="instagramReelPrice"
                          name="instagramReelPrice"
                          placeholder="Enter price"
                          min="100"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                        />
                        <ErrorMessage name="instagramReelPrice" component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      <div>
                        <label htmlFor="instagramComboPrice" className="block text-sm font-medium text-gray-700 mb-2">
                          Combo Price (₹)
                        </label>
                        <Field
                          type="number"
                          id="instagramComboPrice"
                          name="instagramComboPrice"
                          placeholder="Enter price"
                          min="100"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                        />
                        <ErrorMessage name="instagramComboPrice" component="div" className="text-red-500 text-sm mt-1" />
                      </div>
                    </div>
                  </div>
                )}

                {/* YouTube Pricing */}
                {values.youtubeUrl && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">YouTube Pricing *</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="youtubeVideoPrice" className="block text-sm font-medium text-gray-700 mb-2">
                          Full Video Price (₹)
                        </label>
                        <Field
                          type="number"
                          id="youtubeVideoPrice"
                          name="youtubeVideoPrice"
                          placeholder="Enter price"
                          min="100"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                        />
                        <ErrorMessage name="youtubeVideoPrice" component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      <div>
                        <label htmlFor="youtubeShortsPrice" className="block text-sm font-medium text-gray-700 mb-2">
                          Shorts Price (₹)
                        </label>
                        <Field
                          type="number"
                          id="youtubeShortsPrice"
                          name="youtubeShortsPrice"
                          placeholder="Enter price"
                          min="100"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                        />
                        <ErrorMessage name="youtubeShortsPrice" component="div" className="text-red-500 text-sm mt-1" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Work Image Upload */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Work Image *</h2>
                  <p className="text-sm text-gray-600 mb-4">Upload a high-quality image that represents your work (Max 5MB)</p>
                  
                  <div className="space-y-4">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, setFieldValue)}
                      className="hidden"
                    />
                    
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-400 transition-colors cursor-pointer"
                         onClick={() => fileInputRef.current?.click()}>
                      {selectedImage ? (
                        <div className="space-y-4">
                          <div className="relative w-48 h-48 mx-auto">
                            <Image
                              src={selectedImage}
                              alt="Selected work"
                              fill
                              className="object-cover rounded-lg"
                            />
                          </div>
                          <p className="text-sm text-gray-600">Click to change image</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <p className="text-sm text-gray-600">Click to upload your work image</p>
                        </div>
                      )}
                    </div>
                    
                    <ErrorMessage name="workImage" component="div" className="text-red-500 text-sm" />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-6 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>{isEditMode ? 'Updating...' : 'Submitting...'}</span>
                      </>
                    ) : (
                      <span>{isEditMode ? 'Update Profile' : 'Submit Application'}</span>
                    )}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default InfluencerForm;
