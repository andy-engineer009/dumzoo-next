'use client';

import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

// Types
interface Offer {
  id: string;
  type: 'single' | 'combo';
  name?: string;
  price: number;
  items: Array<{
    contentType: string;
    quantity: number;
  }>;
}

interface InfluencerProfile {
  id: string;
  name: string;
  username: string;
  platforms: any[];
  gender: string;
  categories: any[];
  languages: any[];
  verifiedProfile: boolean;
  state: string;
  city: string;
  locality: string;
  influencerAge: number;
  followerCount: number;
  instagramUrl: string;
  youtubeUrl: string;
  facebookUrl: string;
  audienceType: string;
  audienceAgeGroup: string;
  startingPrice: number;
  offers: Offer[];
  profileImage: string;
  // postImages: string[];
  // videos: string[];
  isListed: boolean;
}

interface FormValues {
  // Step 1: Basic Info
  name: string;
  username: string;
  platforms: any[];
  gender: string;
  categories: any[];
  languages: any[];
  verifiedProfile: boolean;
  state: string;
  city: string;
  locality: string;
  influencerAge: number;
  followerCount: number;
  instagramUrl: string;
  youtubeUrl: string;
  facebookUrl: string;
  audienceType: string;
  audienceAgeGroup: string;
  
  // Step 2: Pricing
  startingPrice: any;
  offers: Offer[];
  
  // Step 3: Media
  profileImage: File | null;
  // postImages: File[];
  // videos: File[];
}

// Mock data for dropdowns
const platforms = [
  { id: 1, name: 'Instagram' },
  { id: 2, name: 'YouTube' },
  { id: 3, name: 'Facebook' }
];
const categories = [
  { id: 1, name: 'Fashion & Beauty' },
  { id: 2, name: 'Technology' },
  { id: 3, name: 'Fitness & Health' },
  { id: 4, name: 'Food & Cooking' },
  { id: 5, name: 'Travel' },
  { id: 6, name: 'Lifestyle' },
  { id: 7, name: 'Gaming' },
  { id: 8, name: 'Education' },
  { id: 9, name: 'Business' },
  { id: 10, name: 'Entertainment' }
];

const languages = [
  { id: 1, name: 'English' },
  { id: 2, name: 'Hindi' },
  { id: 3, name: 'Punjabi' },
  { id: 4, name: 'Bhojpuri' },
  { id: 5, name: 'Marathi' },
  { id: 6, name: 'Gujarati' },
  { id: 7, name: 'Telugu' }
];
const genders = [
  { id: 1, name: 'Male' },
  { id: 2, name: 'Female' }, 
  { id: 3, name: 'Other' }
];

const states = [
  // Indian States
  { id: 1, name: 'Andhra Pradesh', shortName: 'AP' },
  { id: 2, name: 'Arunachal Pradesh', shortName: 'AR' },
  { id: 3, name: 'Assam', shortName: 'AS' },
  { id: 4, name: 'Bihar', shortName: 'BR' },
  { id: 5, name: 'Chhattisgarh', shortName: 'CG' },
  { id: 6, name: 'Goa', shortName: 'GA' },
  { id: 7, name: 'Gujarat', shortName: 'GJ' },
  { id: 8, name: 'Haryana', shortName: 'HR' },
  { id: 9, name: 'Himachal Pradesh', shortName: 'HP' },
  { id: 10, name: 'Jharkhand', shortName: 'JH' },
  { id: 11, name: 'Karnataka', shortName: 'KA' },
  { id: 12, name: 'Kerala', shortName: 'KL' },
  { id: 13, name: 'Madhya Pradesh', shortName: 'MP' },
  { id: 14, name: 'Maharashtra', shortName: 'MH' },
  { id: 15, name: 'Manipur', shortName: 'MN' },
  { id: 16, name: 'Meghalaya', shortName: 'ML' },
  { id: 17, name: 'Mizoram', shortName: 'MZ' },
  { id: 18, name: 'Nagaland', shortName: 'NL' },
  { id: 19, name: 'Odisha', shortName: 'OR' },
  { id: 20, name: 'Punjab', shortName: 'PB' },
  { id: 21, name: 'Rajasthan', shortName: 'RJ' },
  { id: 22, name: 'Sikkim', shortName: 'SK' },
  { id: 23, name: 'Tamil Nadu', shortName: 'TN' },
  { id: 24, name: 'Telangana', shortName: 'TG' },
  { id: 25, name: 'Tripura', shortName: 'TR' },
  { id: 26, name: 'Uttar Pradesh', shortName: 'UP' },
  { id: 27, name: 'Uttarakhand', shortName: 'UK' },
  { id: 28, name: 'West Bengal', shortName: 'WB' },

  // Union Territories (केंद्र शासित प्रदेश)
  { id: 29, name: 'Andaman and Nicobar Islands', shortName: 'AN' },
  { id: 30, name: 'Chandigarh', shortName: 'CH' },
  { id: 31, name: 'Dadra and Nagar Haveli and Daman and Diu', shortName: 'DN' },
  { id: 32, name: 'Delhi', shortName: 'DL' },
  { id: 33, name: 'Jammu and Kashmir', shortName: 'JK' },
  { id: 34, name: 'Ladakh', shortName: 'LA' },
  { id: 35, name: 'Lakshadweep', shortName: 'LD' },
  { id: 36, name: 'Puducherry', shortName: 'PY' }
];

const cities = [
  { id: 1, name: 'Visakhapatnam', stateId: 1 },
  { id: 2, name: 'Itanagar', stateId: 2 },
  { id: 3, name: 'Guwahati', stateId: 3 },
  { id: 4, name: 'Patna', stateId: 4 },
  { id: 5, name: 'Raipur', stateId: 5 },
  { id: 6, name: 'Panaji', stateId: 6 },
  { id: 7, name: 'Ahmedabad', stateId: 7 },
  { id: 8, name: 'Gurugram', stateId: 8 },
  { id: 9, name: 'Shimla', stateId: 9 },
  { id: 10, name: 'Ranchi', stateId: 10 },
  { id: 11, name: 'Bengaluru', stateId: 11 },
  { id: 12, name: 'Kochi', stateId: 12 },
  { id: 13, name: 'Bhopal', stateId: 13 },
  { id: 14, name: 'Mumbai', stateId: 14 },
  { id: 15, name: 'Imphal', stateId: 15 },
  { id: 16, name: 'Shillong', stateId: 16 },
  { id: 17, name: 'Aizawl', stateId: 17 },
  { id: 18, name: 'Kohima', stateId: 18 },
  { id: 19, name: 'Bhubaneswar', stateId: 19 },
  { id: 20, name: 'Ludhiana', stateId: 20 },
  { id: 21, name: 'Jaipur', stateId: 21 },
  { id: 22, name: 'Gangtok', stateId: 22 },
  { id: 23, name: 'Chennai', stateId: 23 },
  { id: 24, name: 'Hyderabad', stateId: 24 },
  { id: 25, name: 'Agartala', stateId: 25 },
  { id: 26, name: 'Lucknow', stateId: 26 },
  { id: 27, name: 'Dehradun', stateId: 27 },
  { id: 28, name: 'Kolkata', stateId: 28 },
  { id: 29, name: 'Port Blair', stateId: 29 },
  { id: 30, name: 'Chandigarh', stateId: 30 },
  { id: 31, name: 'Daman', stateId: 31 },
  { id: 32, name: 'New Delhi', stateId: 32 },
  { id: 33, name: 'Srinagar', stateId: 33 },
  { id: 34, name: 'Leh', stateId: 34 },
  { id: 35, name: 'Kavaratti', stateId: 35 },
  { id: 36, name: 'Puducherry', stateId: 36 }
];

const localities = [
  { id: 1, name: 'Andheri West', cityId: 1 },   // Mumbai
  { id: 2, name: 'Kothrud', cityId: 2 },        // Pune
  { id: 3, name: 'Connaught Place', cityId: 3 },// New Delhi
  { id: 4, name: 'Sector 10', cityId: 4 },  
  { id: 5, name: 'una', cityId: 9 }     // Dwarka
];

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

// Initial values
const initialValues: FormValues = {
  name: '',
  username: '',
  platforms: [],
  gender: '',
  categories: [],
  languages: [],
  verifiedProfile: true,
  state: '',
  city: '',
  locality: '',
  influencerAge: 0,
  followerCount: 0,
  instagramUrl: '',
  youtubeUrl: '',
  facebookUrl: '',
  startingPrice: '',
  offers: [],
  profileImage: null,
  // postImages: [],
  // videos: [],
  audienceType: '',
  audienceAgeGroup: ''
};

const step1Schema = Yup.object().shape({
  name: Yup.string().required('Name is required').min(2, 'Name must be at least 2 characters'),
  username: Yup.string().required('Username is required').min(3, 'Username must be at least 3 characters'),
  platforms: Yup.array().min(1, 'At least one platform is required'),
  gender: Yup.string().required('Gender is required'),
  categories: Yup.array().min(1, 'At least one category is required'),
  languages: Yup.array().min(1, 'At least one language is required'),
  state: Yup.string().required('State is required'),
  city: Yup.string().required('City is required'),
  influencerAge: Yup.number().required('Age is required').min(13, 'Must be at least 13 years old').max(100, 'Invalid age'),
  followerCount: Yup.number().required('Follower count is required').min(100, 'Must have at least 100 followers'),
  instagramUrl: Yup.string().when('platforms', {
    is: (platforms: number[]) => platforms.includes(1),
    then: (schema) => schema.required('Instagram URL is required').url('Must be a valid URL')
  }),
  youtubeUrl: Yup.string().when('platforms', {
    is: (platforms: number[]) => platforms.includes(2),
    then: (schema) => schema.required('YouTube URL is required').url('Must be a valid URL')
  }),
  facebookUrl: Yup.string().when('platforms', {
    is: (platforms: number[]) => platforms.includes(3),
    then: (schema) => schema.required('Facebook URL is required').url('Must be a valid URL')
  }),
  // audienceType: Yup.string().required('Audience type is required'),
  // audienceAgeGroup: Yup.string().required('Audience age group is required')
});

const step2Schema = Yup.object().shape({
  startingPrice: Yup.number().required('Starting price is required').min(0, 'Price must be positive'),
  offers: Yup.array().of(
    Yup.object().shape({
      id: Yup.string().required('Offer ID is required'),
      type: Yup.string().oneOf(['single', 'combo'], 'Offer type must be single or combo').required('Offer type is required'),
      name: Yup.string().optional(),
      price: Yup.number().required('Offer price is required').min(0, 'Price must be positive'),
      items: Yup.array().of(
        Yup.object().shape({
          contentType: Yup.string().required('Content type is required'),
          quantity: Yup.number().required('Quantity is required').min(1, 'Quantity must be at least 1').max(10, 'Maximum 10 items per offer')
        })
      ).min(1, 'At least one item is required for each offer').test(
        'valid-items',
        'Please check the items configuration',
        function(value) {
          if (!Array.isArray(value)) return false;
          return value.every(item => 
            item && 
            typeof item === 'object' && 
            typeof item.contentType === 'string' && 
            typeof item.quantity === 'number'
          );
        }
      )
    })
  ).min(1, 'At least one offer is required').max(6, 'Maximum 6 offers allowed')
});

const step3Schema = Yup.object().shape({
  profileImage: Yup.mixed().required('Profile image is required'),
  // postImages: Yup.array().min(1, 'Please upload at least 1 post images').max(3, 'Maximum 3 post images allowed'),
  // videos: Yup.array().min(0, 'Please upload at least 2 videos').max(2, 'Maximum 2 videos allowed')
});

// Full validation schema
// const validationSchema = Yup.object().shape({
//   name: Yup.string().required('Name is required').min(2, 'Name must be at least 2 characters'),
//   username: Yup.string().required('Username is required').min(3, 'Username must be at least 3 characters'),
//   platforms: Yup.array().min(1, 'At least one platform is required'),
//   gender: Yup.string().required('Gender is required'),
//   categories: Yup.array().min(1, 'At least one category is required'),
//   languages: Yup.array().min(1, 'At least one language is required'),
//   state: Yup.string().required('State is required'),
//   city: Yup.string().required('City is required'),
//   influencerAge: Yup.number().required('Age is required').min(13, 'Must be at least 13 years old').max(100, 'Invalid age'),
//   followerCount: Yup.number().required('Follower count is required').min(100, 'Must have at least 100 followers'),
//   instagramUrl: Yup.string().when('platforms', {
//     is: (platforms: string[]) => platforms.includes('Instagram'),
//     then: (schema) => schema.required('Instagram URL is required').url('Must be a valid URL')
//   }),
//   youtubeUrl: Yup.string().when('platforms', {
//     is: (platforms: string[]) => platforms.includes('YouTube'),
//     then: (schema) => schema.required('YouTube URL is required').url('Must be a valid URL')
//   }),
//   audienceType: Yup.string().required('Audience type is required'),
//   audienceAgeGroup: Yup.string().required('Audience age group is required'),
//   startingPrice: Yup.number().required('Starting price is required').min(0, 'Price must be positive'),
//   offers: Yup.array().of(
//     Yup.object().shape({
//       id: Yup.string().required('Offer ID is required'),
//       type: Yup.string().oneOf(['single', 'combo'], 'Offer type must be single or combo').required('Offer type is required'),
//       name: Yup.string().optional(),
//       price: Yup.number().required('Offer price is required').min(0, 'Price must be positive'),
//       items: Yup.array().of(
//         Yup.object().shape({
//           contentType: Yup.string().required('Content type is required'),
//           quantity: Yup.number().required('Quantity is required').min(1, 'Quantity must be at least 1').max(10, 'Maximum 10 items per offer')
//         })
//       ).min(1, 'At least one item is required for each offer').test(
//         'valid-items',
//         'Please check the items configuration',
//         function(value) {
//           if (!Array.isArray(value)) return false;
//           return value.every(item => 
//             item && 
//             typeof item === 'object' && 
//             typeof item.contentType === 'string' && 
//             typeof item.quantity === 'number'
//           );
//         }
//       )
//     })
//   ).min(1, 'At least one offer is required').max(6, 'Maximum 6 offers allowed')
// });

// Step definitions
const steps = [
  { number: 1, title: 'Basic Info', schema: step1Schema },
  { number: 2, title: 'Pricing', schema: step2Schema },
  { number: 3, title: 'Media Upload', schema: step3Schema }
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
    console.log(form.values[field.name])
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="grid grid-cols-2 gap-3">
        {options.map((option) => (
          <label key={option.id} className="flex items-center space-x-2 cursor-pointer">
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

// Media Upload Component
const MediaUpload = ({ 
  label, 
  accept, 
  multiple = false, 
  maxFiles = 1, 
  field, 
  form,
  existingFiles = []
}: {
  label: string;
  accept: string;
  multiple?: boolean;
  maxFiles?: number;
  field: any;
  form: any;
  existingFiles?: string[];
}) => {
  const [previews, setPreviews] = useState<string[]>(existingFiles);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    if (files.length > maxFiles) {
      alert(`Maximum ${maxFiles} file(s) allowed`);
      return;
    }

    const maxImageSize = 10 * 1024 * 1024; // 10MB
    const maxVideoSize = 50 * 1024 * 1024; // 50MB
    
    const invalidFiles = files.filter(file => {
      if (accept.includes('image') && file.size > maxImageSize) return true;
      if (accept.includes('video') && file.size > maxVideoSize) return true;
      return false;
    });

    if (invalidFiles.length > 0) {
      alert(`File size too large. Images must be under 10MB and videos under 50MB`);
      return;
    }

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews([...existingFiles, ...newPreviews]);

    if (multiple) {
      form.setFieldValue(field.name, files);
    } else {
      form.setFieldValue(field.name, files[0]);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
          className="hidden"
          id={field.name}
        />
        <label htmlFor={field.name} className="cursor-pointer">
          <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p className="mt-2 text-sm text-gray-600">
            Click to upload or drag and drop
          </p>
          <p className="text-xs text-gray-500">
            {accept.includes('image') ? 'PNG, JPG, GIF up to 10MB' : 'MP4, MOV up to 50MB'}
          </p>
        </label>
      </div>
      
      {previews.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {previews.map((preview, index) => (
            <div key={index} className="relative">
              {accept.includes('image') ? (
                <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-24 object-cover rounded-lg" />
              ) : (
                <video src={preview} className="w-full h-24 object-cover rounded-lg" controls />
              )}
              <button
                type="button"
                onClick={() => {
                  setPreviews(previews.filter((_, i) => i !== index));
                  if (multiple) {
                    const currentFiles = form.values[field.name] || [];
                    form.setFieldValue(field.name, currentFiles.filter((_: any, i: number) => i !== index));
                  } else {
                    form.setFieldValue(field.name, null);
                  }
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Step Components
const Step1BasicInfo = ({ values, setFieldValue }: { values: FormValues; setFieldValue: (field: string, value: any) => void }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="space-y-6"
  >

  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">Basic Information</h2>
    <p className="text-gray-600 mb-6">Tell us about yourself and your social media presence to help clients find you.</p>
    
    <div className="space-y-6">
      {/* Name and Username */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Full Name *
          </label>
          <Field
            type="text"
            id="name"
            name="name"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your full name"
          />
          <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
        </div>

        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
            Username *
          </label>
          <Field
            type="text"
            id="username"
            name="username"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your username"
          />
          <ErrorMessage name="username" component="div" className="text-red-500 text-sm mt-1" />
        </div>
      </div>

      {/* Platforms */}
      <Field name="platforms">
        {({ field, form }: any) => (
          <MultiSelectCheckbox
            label="Platforms * (Select one or both)"
            options={platforms}
            field={field}
            form={form}
          />
        )}
      </Field>

      {/* Platform URLs */}
      {values.platforms.includes(1) && (
        <div>
          <label htmlFor="instagramUrl" className="block text-sm font-medium text-gray-700 mb-2">
            Instagram Profile URL *
          </label>
          <Field
            type="url"
            id="instagramUrl"
            name="instagramUrl"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://instagram.com/yourusername"
          />
          <ErrorMessage name="instagramUrl" component="div" className="text-red-500 text-sm mt-1" />
        </div>
      )}

      {values.platforms.includes(2) && (
        <div>
          <label htmlFor="youtubeUrl" className="block text-sm font-medium text-gray-700 mb-2">
            YouTube Channel URL *
          </label>
          <Field
            type="url"
            id="youtubeUrl"
            name="youtubeUrl"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://youtube.com/@yourchannel"
          />
          <ErrorMessage name="youtubeUrl" component="div" className="text-red-500 text-sm mt-1" />
        </div>
      )}

{values.platforms.includes(3) && (
        <div>
          <label htmlFor="facebookUrl" className="block text-sm font-medium text-gray-700 mb-2">
            Facebook Profile URL *
          </label>
          <Field
            type="url"
            id="facebookUrl"
            name="facebookUrl"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://facebook.com/yourusername"
          />
          <ErrorMessage name="facebookUrl" component="div" className="text-red-500 text-sm mt-1" />
        </div>
      )}

      {/* Age and Followers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="influencerAge" className="block text-sm font-medium text-gray-700 mb-2">
            Your Age *
          </label>
          <Field
            type="number"
            id="influencerAge"
            name="influencerAge"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your age"
          />
          <ErrorMessage name="influencerAge" component="div" className="text-red-500 text-sm mt-1" />
        </div>

        <div>
          <label htmlFor="followerCount" className="block text-sm font-medium text-gray-700 mb-2">
            Total Follower Count *
          </label>
          <Field
            type="number"
            id="followerCount"
            name="followerCount"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter total follower count"
          />
          <ErrorMessage name="followerCount" component="div" className="text-red-500 text-sm mt-1" />
        </div>
      </div>

      {/* Gender */}
      <div>
        <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
          Gender *
        </label>
        <Field
          as="select"
          id="gender"
          name="gender"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select Gender</option>
          {genders.map((gender) => (
            <option key={gender.id} value={gender.id}>{gender.name}</option>
          ))}
        </Field>
        <ErrorMessage name="gender" component="div" className="text-red-500 text-sm mt-1" />
      </div>

      {/* Categories */}
      <Field name="categories">
        {({ field, form }: any) => (
          <MultiSelectCheckbox
            label="Categories * (Select all that apply)"
            options={categories}
            field={field}
            form={form}
          />
        )}
      </Field>

      {/* Languages */}
      <Field name="languages">
        {({ field, form }: any) => (
          <MultiSelectCheckbox
            label="Languages * (Select all that apply)"
            options={languages}
            field={field}
            form={form}
          />
        )}
      </Field>

      {/* Verified Profile */}
      <div className="flex items-center space-x-3">
        <Field
          type="checkbox"
          id="verifiedProfile"
          name="verifiedProfile"
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="verifiedProfile" className="text-sm font-medium text-gray-700">
          Verified Profile
        </label>
      </div>

      {/* Location Fields */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
            State *
          </label>
          <Field
            as="select"
            id="state"
            name="state"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              setFieldValue('state', e.target.value);
              setFieldValue('city', '');
              setFieldValue('locality', '');
            }}
          >
            <option value="">Select State</option>
            {states.map(state => (
              <option key={state.id} value={state.id}>{state.name}</option>
            ))}
          </Field>
          <ErrorMessage name="state" component="div" className="text-red-500 text-sm mt-1" />
        </div>

        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
            City *
          </label>
          <Field
            as="select"
            id="city"
            name="city"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={!values.state}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              setFieldValue('city', e.target.value);
              setFieldValue('locality', '');
            }}
          >
            <option value="">Select City</option>
            {values.state && cities.filter(city => city.stateId === parseInt(values.state)).map((city) => (
              <option key={city.id} value={city.id}>{city.name}</option>
            ))}
          </Field>
          <ErrorMessage name="city" component="div" className="text-red-500 text-sm mt-1" />
        </div>

        <div>
          <label htmlFor="locality" className="block text-sm font-medium text-gray-700 mb-2">
            Locality (Optional)
          </label>
          <Field
            as="select"
            id="locality"
            name="locality"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={!values.city}
          >
            <option value="">Select Locality</option>
            {values.city && localities.filter(locality => locality.cityId === parseInt(values.city)).map((locality) => (
              <option key={locality.id} value={locality.id}>{locality.name}</option>
            ))}
          </Field>
        </div>
      </div>

      {/* Audience Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="audienceType" className="block text-sm font-medium text-gray-700 mb-2">
            Audience Type *
          </label>
          <Field
            as="select"
            id="audienceType"
            name="audienceType"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Audience Type</option>
            {audienceTypes.map(type => (
              <option key={type.id} value={type.id}>{type.name}</option>
            ))}
          </Field>
          <ErrorMessage name="audienceType" component="div" className="text-red-500 text-sm mt-1" />
        </div>

        <div>
          <label htmlFor="audienceAgeGroup" className="block text-sm font-medium text-gray-700 mb-2">
            Audience Age Group *
          </label>
          <Field
            as="select"
            id="audienceAgeGroup"
            name="audienceAgeGroup"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Age Group</option>
            {audienceAgeGroups.map(ageGroup => (
              <option key={ageGroup.id} value={ageGroup.id}>{ageGroup.name}</option>
            ))}
          </Field>
          <ErrorMessage name="audienceAgeGroup" component="div" className="text-red-500 text-sm mt-1" />
        </div>
      </div>
    </div>
    </div>
  </motion.div>
);

const Step2Pricing = ({ values, setFieldValue }: { values: FormValues; setFieldValue: (field: string, value: any) => void }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="space-y-6"
  >
    <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">Pricing & Offers</h2>
    <p className="text-gray-600 mb-6">Configure your pricing structure and create attractive offers for potential clients.</p>
    
    {/* Modern Pricing Section */}
    <PricingSection values={values} setFieldValue={setFieldValue} />
  </motion.div>
);

const Step3MediaUpload = ({ form }: { form: any }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="space-y-8"
  >
    <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">Media & Content</h2>
    <p className="text-gray-600 mb-6">Upload your profile picture and showcase your best content to attract potential clients.</p>
    
    <div className="space-y-8">
      {/* Profile Image */}
      <Field name="profileImage">
        {({ field }: any) => (
          <MediaUpload
            label="Profile Image * recommended size 400x400"
            accept="image/*"
            field={field}
            form={form}
          />
        )}
      </Field>
      <ErrorMessage name="profileImage" component="div" className="text-red-500 text-sm mt-1" />

      {/* Post Images */}
      {/* <Field name="postImages">
        {({ field }: any) => (
          <MediaUpload
            label="Post Images (3 required) *"
            accept="image/*"
            multiple={true}
            maxFiles={3}
            field={field}
            form={form}
          />
        )}
      </Field>
      <ErrorMessage name="postImages" component="div" className="text-red-500 text-sm mt-1" /> */}

      {/* Videos */}
      {/* <Field name="videos">
        {({ field }: any) => (
          <MediaUpload
            label="Videos (2 required) *"
            accept="video/*"
            multiple={true}
            maxFiles={2}
            field={field}
            form={form}
          />
        )}
      </Field>
      <ErrorMessage name="videos" component="div" className="text-red-500 text-sm mt-1" /> */}
    </div>
  </motion.div>
);

// Pricing Section Component
const PricingSection = ({ values, setFieldValue }: { values: FormValues; setFieldValue: (field: string, value: any) => void }) => {
  const contentTypes = ['Post', 'Reel', 'Story', 'YouTube Shorts', 'YouTube Video', 'Facebook Post', 'Facebook Reel', 'Facebook Story'];
  
  // Ensure offers is always an array
  const safeOffers = Array.isArray(values.offers) ? values.offers : [];
  
  const addNewOffer = () => {
    const newOffer: Offer = {
      id: `offer-${Date.now()}`,
      type: 'single',
      price: 0,
      items: [{ contentType: 'Post', quantity: 1 }]
    };
    setFieldValue('offers', [...safeOffers, newOffer]);
  };

  const removeOffer = (index: number) => {
    const newOffers = safeOffers.filter((_, i) => i !== index);
    setFieldValue('offers', newOffers);
  };

  const addItemToCombo = (offerIndex: number) => {
    const newOffers = [...safeOffers];
    if (newOffers[offerIndex]) {
      if (!Array.isArray(newOffers[offerIndex].items)) {
        newOffers[offerIndex].items = [];
      }
      newOffers[offerIndex].items.push({ contentType: 'Post', quantity: 1 });
      setFieldValue('offers', newOffers);
    }
  };

  const removeItemFromCombo = (offerIndex: number, itemIndex: number) => {
    const newOffers = [...safeOffers];
    if (newOffers[offerIndex] && Array.isArray(newOffers[offerIndex].items)) {
      newOffers[offerIndex].items = newOffers[offerIndex].items.filter((_, i) => i !== itemIndex);
      setFieldValue('offers', newOffers);
    }
  };

  // Helper function to safely render offer items
  const renderOfferItems = (offer: Offer, index: number) => {
    if (!offer || !Array.isArray(offer.items)) {
      return null;
    }

    // Additional safety check for offer structure
    if (typeof offer !== 'object' || offer === null) {
      return null;
    }

    if (offer.type === 'single') {
      if (offer.items.length === 0) {
        return null;
      }
      
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Field
              as="select"
              name={`offers.${index}.items.0.contentType`}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {contentTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </Field>
          </div>
          <div>
            <Field
              type="number"
              name={`offers.${index}.items.0.quantity`}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Quantity"
              min="1"
              max="10"
            />
          </div>
        </div>
      );
    }

    if (offer.type === 'combo') {
      return (
        <div className="space-y-3">
          {offer.items.map((item, itemIndex) => {
            // Ensure item is a valid object
            if (!item || typeof item !== 'object') {
              return null;
            }
            
            return (
              <div key={itemIndex} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <Field
                    as="select"
                    name={`offers.${index}.items.${itemIndex}.contentType`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {contentTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </Field>
                </div>
                <div className="w-24">
                  <Field
                    type="number"
                    name={`offers.${index}.items.${itemIndex}.quantity`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Qty"
                    min="1"
                    max="10"
                  />
                </div>
                {offer.items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItemFromCombo(index, itemIndex)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            );
          })}
          <button
            type="button"
            onClick={() => addItemToCombo(index)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Item
          </button>
        </div>
      );
    }

    return null;
  };

  // Wrap the entire component in error boundary
  try {
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-gray-900 border-b pb-2">Offers & Pricing</h3>
        
        {/* Starting Price */}
        <div>
          <label htmlFor="startingPrice" className="block text-sm font-medium text-gray-700 mb-2">
            Starting Price (₹) *
          </label>
          <p className="text-sm text-gray-500 mb-3">This is used for public listing preview and is not linked to actual offers.</p>
          <Field
            type="number"
            id="startingPrice"
            name="startingPrice"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter starting price"
          />
          <ErrorMessage name="startingPrice" component="div" className="text-red-500 text-sm mt-1" />
        </div>

        {/* Offers Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Offers *
            </label>
            <span className="text-sm text-gray-500">
              {safeOffers.length}/6 offers
            </span>
          </div>
          
          {/* Custom error handling for offers */}
          <Field name="offers">
            {({ field, form }: any) => {
              const error = form.errors.offers;
              const touched = form.touched.offers;
              
              if (error && touched) {
                let errorMessage = '';
                if (typeof error === 'string') {
                  errorMessage = error;
                } else if (Array.isArray(error)) {
                  errorMessage = error.filter(e => typeof e === 'string').join(', ');
                } else if (error && typeof error === 'object') {
                  errorMessage = 'Please check your offers configuration';
                }
                
                return errorMessage ? (
                  <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
                ) : null;
              }
              return null;
            }}
          </Field>
          
          {safeOffers.length === 0 && (
            <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <p className="text-gray-500 mb-4">No offers added yet</p>
              <p className="text-sm text-gray-400">Add at least 1 offer to continue</p>
            </div>
          )}

          {/* Offers List */}
          <div className="space-y-4">
            {safeOffers.map((offer, index) => {
              // Ensure offer is a valid object
              if (!offer || typeof offer !== 'object') {
                return null;
              }
              
              return (
                <div key={offer.id || `offer-${index}`} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                  {/* Offer Header */}
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-semibold text-gray-800">Offer {index + 1}</h3>
                      {offer.name && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {offer.name}
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeOffer(index)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Offer Type */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Offer Type *
                      </label>
                      <Field
                        as="select"
                        name={`offers.${index}.type`}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="single">Single Item Offer</option>
                        <option value="combo">Combo Offer</option>
                      </Field>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Offer Name (Optional)
                      </label>
                      <Field
                        type="text"
                        name={`offers.${index}.name`}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., 🔥 Best Seller"
                      />
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price (₹) *
                    </label>
                    <Field
                      type="number"
                      name={`offers.${index}.price`}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter price"
                    />
                    <ErrorMessage name={`offers.${index}.price`} component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  {/* Items */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {offer.type === 'single' ? 'Content Type & Quantity' : 'Items Included'} *
                    </label>
                    
                    {renderOfferItems(offer, index)}
                    
                    <Field name={`offers.${index}.items`}>
                      {({ field, form }: any) => {
                        const error = form.errors[`offers.${index}.items`];
                        const touched = form.touched[`offers.${index}.items`];
                        
                        if (error && touched) {
                          // Handle different types of errors
                          let errorMessage = '';
                          if (typeof error === 'string') {
                            errorMessage = error;
                          } else if (Array.isArray(error)) {
                            errorMessage = error.filter(e => typeof e === 'string').join(', ');
                          } else if (error && typeof error === 'object') {
                            // If it's an object, try to extract meaningful error
                            errorMessage = 'Please check the items configuration';
                          }
                          
                          return errorMessage ? (
                            <div className="text-red-500 text-sm mt-1">{errorMessage}</div>
                          ) : null;
                        }
                        return null;
                      }}
                    </Field>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add Offer Button */}
          {safeOffers.length < 6 && (
            <button
              type="button"
              onClick={addNewOffer}
              className="mt-4 w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add New Offer
            </button>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error in PricingSection:', error);
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-gray-900 border-b pb-2">Offers & Pricing</h3>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Something went wrong. Please refresh the page and try again.</p>
        </div>
      </div>
    );
  }
};

// Loading Component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

// Not Listed Component
const NotListedComponent = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
    <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
      <div className="mb-6">
        <Link
          href="/profile"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 mr-2" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" 
              clipRule="evenodd" 
            />
          </svg>
          Back to Profile
        </Link>
      </div>

      <div className="mb-6">
        <svg className="mx-auto h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-4">Not Listed as Influencer</h2>
      <p className="text-gray-600 mb-6">
        You haven't listed yourself as an influencer yet. Start your influencer journey by creating your profile!
      </p>

      <Link
        href="/influencer-onboarding"
        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        List as Influencer
      </Link>
    </div>
  </div>
);

// Main Component
export default function InfluencerProfileEdit() {
  const [profile, setProfile] = useState<InfluencerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);

  // Fetch profile data on component mount
  useEffect(() => {
     // Use the fetched data or fallback to mock data for development
     const profileData: InfluencerProfile = {
      id: '1',
      name: 'John Doe',
      username: 'johndoe',
      platforms: [1, 2],
      gender: '1',
      categories: [1, 2], 
      languages: [1, 2],
      verifiedProfile: true,
      state: '9',
      city: '9',
      locality: '5',
      influencerAge: 25,
      followerCount: 50000,
      instagramUrl: 'https://instagram.com/johndoe',
      youtubeUrl: 'https://youtube.com/@johndoe',
      facebookUrl: 'https://facebook.com/johndoe',
      audienceType: '1',
      audienceAgeGroup: '2',
      startingPrice: 5000,
      offers: [
        {
          id: 'offer1',
          type: 'single',
          name: '🔥 Basic Post',
          price: 2000,
          items: [
            { contentType: 'Post', quantity: 1 }
          ],
        },
        {
          id: 'offer2',
          type: 'combo',
          name: '⭐ Premium Combo',
          price: 5000,
          items: [
            { contentType: 'Post', quantity: 2 },
            { contentType: 'Story', quantity: 3 },
          ],
        },
        {
          id: 'offer3',
          type: 'single',
          name: '🎬 Reel Package',
          price: 3000,
          items: [
            { contentType: 'Reel', quantity: 1 }
          ],
        },
      ],
      profileImage: '/api/profile-image.jpg',
      // postImages: ['/api/post1.jpg', '/api/post2.jpg', '/api/post3.jpg'],
      // videos: ['/api/video1.mp4', '/api/video2.mp4'],
      isListed: true // Change this to false to test not listed state
    };

    setProfile(profileData);
    setLoading(false)
    //fetchProfileData();
  }, []);

  // API function to fetch profile data
  const fetchProfileData = async () => {
    try {
      setLoading(true);
      
      // Make API call to fetch profile data
      const response = await fetch('/api/influencer/profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Use the fetched data or fallback to mock data for development
      const profileData: InfluencerProfile = data.profile || {
        id: '1',
        name: 'John Doe',
        username: 'johndoe',
        platforms: ['Instagram', 'YouTube'],
        gender: 'Male',
        categories: ['Fashion & Beauty', 'Technology'],
        languages: ['English', 'Hindi'],
        verifiedProfile: true,
        state: 'Maharashtra',
        city: 'Mumbai',
        locality: 'Bandra',
        influencerAge: 25,
        followerCount: 50000,
        instagramUrl: 'https://instagram.com/johndoe',
        youtubeUrl: 'https://youtube.com/@johndoe',
        audienceType: 'General',
        audienceAgeGroup: '19-25',
        startingPrice: 5000,
        offers: [
          {
            id: 'offer1',
            type: 'single',
            name: '🔥 Basic Post',
            price: 2000,
            items: [
              { contentType: 'Post', quantity: 1 }
            ],
          },
          {
            id: 'offer2',
            type: 'combo',
            name: '⭐ Premium Combo',
            price: 5000,
            items: [
              { contentType: 'Post', quantity: 2 },
              { contentType: 'Story', quantity: 3 },
            ],
          },
          {
            id: 'offer3',
            type: 'single',
            name: '🎬 Reel Package',
            price: 3000,
            items: [
              { contentType: 'Reel', quantity: 1 }
            ],
          },
        ],
        profileImage: '/api/profile-image.jpg',
        // postImages: ['/api/post1.jpg', '/api/post2.jpg', '/api/post3.jpg'],
        // videos: ['/api/video1.mp4', '/api/video2.mp4'],
        isListed: true // Change this to false to test not listed state
      };

      setProfile(profileData);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  // API function to save profile data
  const saveProfileData = async (values: FormValues) => {
    try {
      setSaving(true);
      
      // Prepare data for API
      const formData = new FormData();
      
      // Basic info
      formData.append('name', values.name);
      formData.append('username', values.username);
      formData.append('platforms', JSON.stringify(values.platforms));
      formData.append('gender', values.gender);
      formData.append('categories', JSON.stringify(values.categories));
      formData.append('languages', JSON.stringify(values.languages));
      formData.append('verifiedProfile', values.verifiedProfile.toString());
      formData.append('state', values.state);
      formData.append('city', values.city);
      formData.append('locality', values.locality);
      formData.append('influencerAge', values.influencerAge.toString());
      formData.append('followerCount', values.followerCount.toString());
      formData.append('instagramUrl', values.instagramUrl);
      formData.append('youtubeUrl', values.youtubeUrl);
      formData.append('facebookUrl', values.facebookUrl);
      formData.append('audienceType', values.audienceType);
      formData.append('audienceAgeGroup', values.audienceAgeGroup);
      
      // Pricing
      formData.append('startingPrice', values.startingPrice.toString());
      formData.append('offers', JSON.stringify(values.offers));
      
      // Media files
      if (values.profileImage) {
        formData.append('profileImage', values.profileImage);
      }
      
      // values.postImages.forEach((file, index) => {
      //   formData.append(`postImages[${index}]`, file);
      // });
      
      // values.videos.forEach((file, index) => {
      //   formData.append(`videos[${index}]`, file);
      // });
      
      // Make API call
      const response = await fetch('/api/influencer/profile/update', {
        method: 'PUT',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      console.log('Profile updated successfully:', result);
      
      // Update local state
      if (profile) {
        setProfile({
          ...profile,
          ...values,
          profileImage: profile.profileImage,
          // postImages: profile.postImages,
          // videos: profile.videos
        });
      }
      
      // Show success message
      setShowSuccess(true);
      setError(null);
      setTimeout(() => setShowSuccess(false), 5000);
      
    } catch (error) {
      console.error('Error saving profile:', error);
      setError('Error updating profile. Please try again.');
      setShowSuccess(false);
    } finally {
      setSaving(false);
    }
  };

  // Convert profile data to form values
  const getInitialValues = (): FormValues => {
    if (!profile)  return {
      name: '', username: '', platforms: [], gender: '', categories: [], languages: [],
      verifiedProfile: false, state: '', city: '', locality: '', influencerAge: 0,
      followerCount: 0, instagramUrl: '', youtubeUrl: '', facebookUrl: '', audienceType: '', audienceAgeGroup: '',
      startingPrice: 0, offers: [], profileImage: null, 
      // postImages: [], videos: []
    };

    return {
      name: profile.name,
      username: profile.username,
      platforms: profile.platforms,
      gender: profile.gender,
      categories: profile.categories,
      languages: profile.languages,
      verifiedProfile: profile.verifiedProfile,
      state: profile.state,
      city: profile.city,
      locality: profile.locality,
      influencerAge: profile.influencerAge,
      followerCount: profile.followerCount,
      instagramUrl: profile.instagramUrl,
      youtubeUrl: profile.youtubeUrl,
      facebookUrl: profile.facebookUrl,
      audienceType: profile.audienceType,
      audienceAgeGroup: profile.audienceAgeGroup,
      startingPrice: profile.startingPrice,
      offers: profile.offers,
      profileImage: null,

      // postImages: [],
      // videos: []
    };
  };

  // Step navigation functions
  const handleNext = async (values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) => {
    try {
      await steps[currentStep - 1].schema.validate(values);
      setCurrentStep(currentStep + 1);
    } catch (error) {
      console.error('Validation error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) => {
    try {
      await steps[currentStep - 1].schema.validate(values);
      await saveProfileData(values);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const getCurrentSchema = () => {
    return steps[currentStep - 1].schema;
  };

  // Show loading spinner while fetching data
  if (loading) {
    return <LoadingSpinner />;
  }

  // Show not listed component if user is not listed as influencer
  if (profile && !profile.isListed) {
    return <NotListedComponent />;
  }

  // Show form if user is listed as influencer
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Success/Error Notifications */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Profile updated successfully!
        </div>
      )}
      
      {error && (
        <div className="fixed top-4 right-4 z-50 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-4 text-white hover:text-gray-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
      {/* Header with back button */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/profile"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 mr-2" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path 
                  fillRule="evenodd" 
                  d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" 
                  clipRule="evenodd" 
                />
              </svg>
              Back to Profile
            </Link>
            <h1 className="text-xl font-bold text-gray-900">Edit Influencer Profile</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep > step.number 
                    ? 'bg-green-500 border-green-500 text-white' 
                    : currentStep === step.number 
                    ? 'bg-blue-500 border-blue-500 text-white' 
                    : 'bg-gray-200 border-gray-300 text-gray-500'
                }`}>
                  {currentStep > step.number ? '✓' : step.number}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-1 mx-2 ${
                    currentStep > step.number ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Step {currentStep}: {steps[currentStep - 1].title}</h1>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <Formik
            initialValues={getInitialValues()}
            validationSchema={getCurrentSchema()}
            onSubmit={currentStep === steps.length ? handleSubmit : handleNext}
            enableReinitialize
          >
            {({ values, setFieldValue, isSubmitting }) => (
              <Form>
                <AnimatePresence mode="wait">
                  {currentStep === 1 && (
                    <Step1BasicInfo key="step1" values={values} setFieldValue={setFieldValue} />
                  )}
                  {currentStep === 2 && (
                    <Step2Pricing key="step2" values={values} setFieldValue={setFieldValue} />
                  )}
                  {currentStep === 3 && (
                    <Step3MediaUpload key="step3" form={{ values, setFieldValue }} />
                  )}
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handlePrevious}
                    disabled={currentStep === 1}
                    className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                      currentStep === 1
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-gray-500 text-white hover:bg-gray-600'
                    }`}
                  >
                    Previous
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting || saving}
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving Changes...
                      </>
                    ) : isSubmitting ? (
                      'Processing...'
                    ) : currentStep === steps.length ? (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Save Changes
                      </>
                    ) : (
                      'Next'
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
}