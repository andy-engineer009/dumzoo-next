import InfulancerProfileEdit from "@/components/InfulancerProfileEdit";

export default function EditProfile() {
  return (
    <div>
      <InfulancerProfileEdit />
    </div>
  );
} 


// 'use client';

// import { useState, useRef } from 'react';
// import { Formik, Form, Field, ErrorMessage } from 'formik';
// import * as Yup from 'yup';
// import Image from 'next/image';
// import { useRouter } from 'next/navigation';

// interface InfluencerFormValues {
//   username: string;
//   location: string;
//   state: string;
//   followers: number;
//   gender: string;
//   categories: string[];
//   instagramUrl: string;
//   youtubeUrl: string;
//   instagramPostPrice: number;
//   instagramStoryPrice: number;
//   instagramReelPrice: number;
//   instagramComboPrice: number;
//   youtubeVideoPrice: number;
//   youtubeShortsPrice: number;
//   workImage: File | null;
// }

// const categories = [
//   'Fashion & Beauty',
//   'Technology',
//   'Fitness & Health',
//   'Food & Cooking',
//   'Travel',
//   'Lifestyle',
//   'Gaming',
//   'Education',
//   'Business',
//   'Entertainment',
//   'Sports',
//   'Art & Design',
//   'Parenting',
//   'Pet & Animals',
//   'Automotive',
//   'Finance'
// ];

// const states = [
//   'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
//   'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
//   'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
//   'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
//   'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
// ];

// export default function EditProfile() {
//   const [selectedImage, setSelectedImage] = useState<string | null>(null);
//   const [imageError, setImageError] = useState(false);
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const router = useRouter();

//   // Mock initial values (replace with actual API call)
//   const initialValues: InfluencerFormValues = {
//     username: 'andy_lexsian',
//     location: 'Lucknow',
//     state: 'Uttar Pradesh',
//     followers: 15000,
//     gender: 'male',
//     categories: ['Fashion & Beauty', 'Lifestyle'],
//     instagramUrl: 'https://instagram.com/andy_lexsian',
//     youtubeUrl: 'https://youtube.com/@andylexsian',
//     instagramPostPrice: 5000,
//     instagramStoryPrice: 2000,
//     instagramReelPrice: 8000,
//     instagramComboPrice: 12000,
//     youtubeVideoPrice: 15000,
//     youtubeShortsPrice: 5000,
//     workImage: null,
//   };

//   const validationSchema = Yup.object({
//     username: Yup.string()
//       .min(3, 'Username must be at least 3 characters')
//       .max(50, 'Username must be less than 50 characters')
//       .required('Username is required'),
//     location: Yup.string()
//       .min(2, 'Location must be at least 2 characters')
//       .required('Location is required'),
//     state: Yup.string()
//       .required('State is required'),
//     followers: Yup.number()
//       .min(100, 'Followers must be at least 100')
//       .required('Followers count is required'),
//     gender: Yup.string()
//       .required('Gender is required'),
//     categories: Yup.array()
//       .min(1, 'Please select at least one category')
//       .required('At least one category is required'),
//     instagramUrl: Yup.string()
//       .url('Please enter a valid Instagram URL'),
//     youtubeUrl: Yup.string()
//       .url('Please enter a valid YouTube URL'),
//     instagramPostPrice: Yup.number()
//       .when('instagramUrl', {
//         is: (instagramUrl: string) => instagramUrl && instagramUrl !== '',
//         then: (schema) => schema.min(100, 'Price must be at least ₹100').required('Instagram post price is required'),
//         otherwise: (schema) => schema.optional(),
//       }),
//     instagramStoryPrice: Yup.number()
//       .when('instagramUrl', {
//         is: (instagramUrl: string) => instagramUrl && instagramUrl !== '',
//         then: (schema) => schema.min(100, 'Price must be at least ₹100').required('Instagram story price is required'),
//         otherwise: (schema) => schema.optional(),
//       }),
//     instagramReelPrice: Yup.number()
//       .when('instagramUrl', {
//         is: (instagramUrl: string) => instagramUrl && instagramUrl !== '',
//         then: (schema) => schema.min(100, 'Price must be at least ₹100').required('Instagram reel price is required'),
//         otherwise: (schema) => schema.optional(),
//       }),
//     instagramComboPrice: Yup.number()
//       .when('instagramUrl', {
//         is: (instagramUrl: string) => instagramUrl && instagramUrl !== '',
//         then: (schema) => schema.min(100, 'Price must be at least ₹100').required('Instagram combo price is required'),
//         otherwise: (schema) => schema.optional(),
//       }),
//     youtubeVideoPrice: Yup.number()
//       .when('youtubeUrl', {
//         is: (youtubeUrl: string) => youtubeUrl && youtubeUrl !== '',
//         then: (schema) => schema.min(100, 'Price must be at least ₹100').required('YouTube video price is required'),
//         otherwise: (schema) => schema.optional(),
//       }),
//     youtubeShortsPrice: Yup.number()
//       .when('youtubeUrl', {
//         is: (youtubeUrl: string) => youtubeUrl && youtubeUrl !== '',
//         then: (schema) => schema.min(100, 'Price must be at least ₹100').required('YouTube shorts price is required'),
//         otherwise: (schema) => schema.optional(),
//       }),
//   }).test('social-media-required', 'At least one social media platform is required', function(value) {
//     const { instagramUrl, youtubeUrl } = value;
//     if (!instagramUrl && !youtubeUrl) {
//       return this.createError({ message: 'Please provide at least one social media URL' });
//     }
//     return true;
//   });

//   const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>, setFieldValue: (field: string, value: any) => void) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       setFieldValue('workImage', file);
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         setSelectedImage(e.target?.result as string);
//       };
//       reader.readAsDataURL(file);
//       setImageError(false);
//     }
//   };

//   const formatCurrency = (amount: number): string => {
//     return `₹${amount.toLocaleString()}`;
//   };

//   const handleSubmit = async (values: InfluencerFormValues) => {
//     try {
//       // Simulate API call
//       console.log('Updating profile:', values);
//       alert('Profile updated successfully!');
//       router.push('/profile');
//     } catch (error) {
//       console.error('Error updating profile:', error);
//       alert('Failed to update profile. Please try again.');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="sticky top-0 z-20 bg-white border-b border-gray-200 px-4 py-3">
//         <div className="flex items-center justify-between">
//           <button 
//             onClick={() => router.back()}
//             className="p-2 rounded-full hover:bg-gray-100"
//           >
//             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//             </svg>
//           </button>
//           <h1 className="text-lg font-semibold text-gray-900">Edit Profile</h1>
//           <div className="w-8"></div> {/* Spacer for balance */}
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="max-w-4xl mx-auto px-4 py-6">
//         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
//           <Formik
//             initialValues={initialValues}
//             validationSchema={validationSchema}
//             onSubmit={handleSubmit}
//           >
//             {({ values, setFieldValue, isSubmitting }) => (
//               <Form className="space-y-8 p-6">
//                 {/* Basic Information */}
//                 <div>
//                   <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
//                     <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                     </svg>
//                     Basic Information
//                   </h2>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div>
//                       <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
//                         Username *
//                       </label>
//                       <Field
//                         type="text"
//                         id="username"
//                         name="username"
//                         placeholder="Enter your username"
//                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                       />
//                       <ErrorMessage name="username" component="div" className="text-red-500 text-sm mt-1" />
//                     </div>

//                     <div>
//                       <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
//                         Gender *
//                       </label>
//                       <Field
//                         as="select"
//                         id="gender"
//                         name="gender"
//                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                       >
//                         <option value="">Select Gender</option>
//                         <option value="male">Male</option>
//                         <option value="female">Female</option>
//                         <option value="other">Other</option>
//                       </Field>
//                       <ErrorMessage name="gender" component="div" className="text-red-500 text-sm mt-1" />
//                     </div>

//                     <div>
//                       <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
//                         City/Location *
//                       </label>
//                       <Field
//                         type="text"
//                         id="location"
//                         name="location"
//                         placeholder="Enter your city"
//                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                       />
//                       <ErrorMessage name="location" component="div" className="text-red-500 text-sm mt-1" />
//                     </div>

//                     <div>
//                       <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
//                         State *
//                       </label>
//                       <Field
//                         as="select"
//                         id="state"
//                         name="state"
//                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                       >
//                         <option value="">Select State</option>
//                         {states.map((state) => (
//                           <option key={state} value={state}>{state}</option>
//                         ))}
//                       </Field>
//                       <ErrorMessage name="state" component="div" className="text-red-500 text-sm mt-1" />
//                     </div>

//                     <div>
//                       <label htmlFor="followers" className="block text-sm font-medium text-gray-700 mb-2">
//                         Total Followers *
//                       </label>
//                       <Field
//                         type="number"
//                         id="followers"
//                         name="followers"
//                         placeholder="Enter total followers"
//                         min="100"
//                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                       />
//                       <ErrorMessage name="followers" component="div" className="text-red-500 text-sm mt-1" />
//                     </div>
//                   </div>
//                 </div>

//                 {/* Categories */}
//                 <div>
//                   <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
//                     <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
//                     </svg>
//                     Categories *
//                   </h2>
//                   <p className="text-sm text-gray-600 mb-4">Select categories that best describe your content</p>
//                   <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
//                     {categories.map((category) => (
//                       <label key={category} className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50">
//                         <Field
//                           type="checkbox"
//                           name="categories"
//                           value={category}
//                           className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
//                         />
//                         <span className="text-sm text-gray-700">{category}</span>
//                       </label>
//                     ))}
//                   </div>
//                   <ErrorMessage name="categories" component="div" className="text-red-500 text-sm mt-2" />
//                 </div>

//                 {/* Social Media Links */}
//                 <div>
//                   <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
//                     <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
//                     </svg>
//                     Social Media Links *
//                   </h2>
//                   <p className="text-sm text-gray-600 mb-4">Provide your social media profiles</p>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div>
//                       <label htmlFor="instagramUrl" className="block text-sm font-medium text-gray-700 mb-2">
//                         Instagram URL
//                       </label>
//                       <Field
//                         type="url"
//                         id="instagramUrl"
//                         name="instagramUrl"
//                         placeholder="https://instagram.com/yourusername"
//                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                       />
//                       <ErrorMessage name="instagramUrl" component="div" className="text-red-500 text-sm mt-1" />
//                     </div>

//                     <div>
//                       <label htmlFor="youtubeUrl" className="block text-sm font-medium text-gray-700 mb-2">
//                         YouTube URL
//                       </label>
//                       <Field
//                         type="url"
//                         id="youtubeUrl"
//                         name="youtubeUrl"
//                         placeholder="https://youtube.com/@yourchannel"
//                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                       />
//                       <ErrorMessage name="youtubeUrl" component="div" className="text-red-500 text-sm mt-1" />
//                     </div>
//                   </div>
//                 </div>

//                 {/* Instagram Pricing */}
//                 {values.instagramUrl && (
//                   <div>
//                     <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
//                       <svg className="w-5 h-5 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
//                         <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
//                       </svg>
//                       Instagram Pricing *
//                     </h2>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                       <div>
//                         <label htmlFor="instagramPostPrice" className="block text-sm font-medium text-gray-700 mb-2">
//                           Post Price (₹)
//                         </label>
//                         <Field
//                           type="number"
//                           id="instagramPostPrice"
//                           name="instagramPostPrice"
//                           placeholder="Enter price"
//                           min="100"
//                           className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                         />
//                         <ErrorMessage name="instagramPostPrice" component="div" className="text-red-500 text-sm mt-1" />
//                       </div>

//                       <div>
//                         <label htmlFor="instagramStoryPrice" className="block text-sm font-medium text-gray-700 mb-2">
//                           Story Price (₹)
//                         </label>
//                         <Field
//                           type="number"
//                           id="instagramStoryPrice"
//                           name="instagramStoryPrice"
//                           placeholder="Enter price"
//                           min="100"
//                           className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                         />
//                         <ErrorMessage name="instagramStoryPrice" component="div" className="text-red-500 text-sm mt-1" />
//                       </div>

//                       <div>
//                         <label htmlFor="instagramReelPrice" className="block text-sm font-medium text-gray-700 mb-2">
//                           Reel Price (₹)
//                         </label>
//                         <Field
//                           type="number"
//                           id="instagramReelPrice"
//                           name="instagramReelPrice"
//                           placeholder="Enter price"
//                           min="100"
//                           className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                         />
//                         <ErrorMessage name="instagramReelPrice" component="div" className="text-red-500 text-sm mt-1" />
//                       </div>

//                       <div>
//                         <label htmlFor="instagramComboPrice" className="block text-sm font-medium text-gray-700 mb-2">
//                           Combo Price (₹)
//                         </label>
//                         <Field
//                           type="number"
//                           id="instagramComboPrice"
//                           name="instagramComboPrice"
//                           placeholder="Enter price"
//                           min="100"
//                           className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                         />
//                         <ErrorMessage name="instagramComboPrice" component="div" className="text-red-500 text-sm mt-1" />
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {/* YouTube Pricing */}
//                 {values.youtubeUrl && (
//                   <div>
//                     <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
//                       <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
//                         <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
//                       </svg>
//                       YouTube Pricing *
//                     </h2>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                       <div>
//                         <label htmlFor="youtubeVideoPrice" className="block text-sm font-medium text-gray-700 mb-2">
//                           Full Video Price (₹)
//                         </label>
//                         <Field
//                           type="number"
//                           id="youtubeVideoPrice"
//                           name="youtubeVideoPrice"
//                           placeholder="Enter price"
//                           min="100"
//                           className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                         />
//                         <ErrorMessage name="youtubeVideoPrice" component="div" className="text-red-500 text-sm mt-1" />
//                       </div>

//                       <div>
//                         <label htmlFor="youtubeShortsPrice" className="block text-sm font-medium text-gray-700 mb-2">
//                           Shorts Price (₹)
//                         </label>
//                         <Field
//                           type="number"
//                           id="youtubeShortsPrice"
//                           name="youtubeShortsPrice"
//                           placeholder="Enter price"
//                           min="100"
//                           className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                         />
//                         <ErrorMessage name="youtubeShortsPrice" component="div" className="text-red-500 text-sm mt-1" />
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {/* Work Image Upload */}
//                 <div>
//                   <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
//                     <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                     </svg>
//                     Work Image
//                   </h2>
//                   <p className="text-sm text-gray-600 mb-4">Upload a high-quality image that represents your work (Max 5MB)</p>
                  
//                   <div className="space-y-4">
//                     <input
//                       ref={fileInputRef}
//                       type="file"
//                       accept="image/*"
//                       onChange={(e) => handleImageChange(e, setFieldValue)}
//                       className="hidden"
//                     />
                    
//                     <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer"
//                          onClick={() => fileInputRef.current?.click()}>
//                       {selectedImage ? (
//                         <div className="space-y-4">
//                           <div className="relative w-48 h-48 mx-auto">
//                             <Image
//                               src={selectedImage}
//                               alt="Selected work"
//                               fill
//                               className="object-cover rounded-lg"
//                             />
//                             <button
//                               type="button"
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 setSelectedImage(null);
//                                 setFieldValue('workImage', null);
//                               }}
//                               className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
//                             >
//                               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                               </svg>
//                             </button>
//                           </div>
//                           <p className="text-sm text-gray-600">Click to change image</p>
//                         </div>
//                       ) : (
//                         <div className="space-y-4">
//                           <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
//                             <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
//                           </svg>
//                           <p className="text-sm text-gray-600">Click to upload your work image</p>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 {/* Submit Button */}
//                 <div className="flex gap-4 pt-6 border-t border-gray-200">
//                   <button
//                     type="button"
//                     onClick={() => router.back()}
//                     className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     disabled={isSubmitting}
//                     className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                   >
//                     {isSubmitting ? 'Updating...' : 'Update Profile'}
//                   </button>
//                 </div>
//               </Form>
//             )}
//           </Formik>
//         </div>
//       </main>
//     </div>
//   );
// }   