'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { api } from '@/common/services/rest-api/rest-api';
import { API_ROUTES } from '@/appApi';
import Link from 'next/link';
import Loader from '../../loader';


export default function MediaForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [mediaData, setMediaData] = useState<any>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    fetchMediaData();
  }, []);

  const fetchMediaData = async () => {
    setIsLoading(true);
    api.get(API_ROUTES.getInfluencerProfileImage).then((res)=>{
      setIsLoading(false);
        if(res.status === 1){
          setMediaData(res.data[0] || {});
          if (res.data.length > 0) {
            setPreviewUrl(res.data[0].image_url);
          }
        } else {
          showToast(res.message || 'Failed to fetch media data', 'error');
        }
      });
 
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        showToast('Please select an image file', 'error');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showToast('File size should be less than 5MB', 'error');
        return;
      }

      setSelectedFile(file);
      console.log(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      showToast('Please select an image to upload', 'error');
      return;
    }

    setIsLoading(true);
      const formData: FormData = new FormData();
      formData.append('file', selectedFile); // Changed to 'file' to match backend expectation

        api.sendFormData(API_ROUTES.uploadMedia, formData).then((thirdPartData)=>{
          console.log(thirdPartData);
        if(thirdPartData.status === 1){
          setIsLoading(true);
          const imageUrl = thirdPartData.data?.path;
          if(imageUrl){
          const payload:any = {
            image_url: imageUrl,
          }
          if(mediaData.id){
            payload.profile_image_id = mediaData.id;
          }
          api.post(API_ROUTES.influencerProfileAddUpdate, payload).then((res)=>{
            setIsLoading(false);
            if(res.status === 1){
              showToast('Profile image updated successfully!', 'success');
              setSelectedFile(null);
              // Update the media data with new image URL
              setMediaData({ ...mediaData, profile_image: thirdPartData.data?.path || previewUrl });
            } else {
              showToast(res.message || 'Failed to upload image', 'error');
            }
          });
        }
        }
       else {
        setIsLoading(false);
        showToast(thirdPartData.message || 'Failed to upload image', 'error');
      }
      });
  };

  const removeImage = () => {
    setSelectedFile(null);
    setPreviewUrl(mediaData.profile_image || '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
     {isLoading && <Loader /> }
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
      </div>

      {/* Toast */}
      {toast && (
        <motion.div 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className={`fixed top-4 right-4 z-50 ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white px-6 py-3 rounded-2xl shadow-2xl`}
        >
          {toast.message}
        </motion.div>
      )}

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full px-6 py-3 bg-white/80 backdrop-blur-md border-b border-gray-200/50"
      >
        <div className="flex items-center">
          <Link href="/profile/edit" className="absolute left-4">
          <svg className="w-6 h-6 text-gray-600 hover:text-gray-900 " fill="none" stroke="#ccc" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div className="flex-1 text-center">
            <h1 className="text-lg font-medium text-gray-900">Profile Media</h1>
            {/* <p className="text-sm text-gray-500">Upload your profile picture</p> */}
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 px-4 py-6">
        <div className="max-w-2xl mx-auto">
          {/* Upload Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50"
          >
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Picture</h2>
              <p className="text-gray-600">Upload a professional profile image to showcase your brand</p>
            </div>

            {/* Image Preview */}
            <div className="mb-6">
              {previewUrl ? (
                <div className="relative mx-auto w-48 h-48 mb-4">
                  <img
                    src={previewUrl}
                    alt="Profile Preview"
                    className="w-full h-full object-cover rounded-2xl shadow-lg border-4 border-white"
                  />
                  {selectedFile && (
                    <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                      New
                    </div>
                  )}
                </div>
              ) : (
                <div className="mx-auto w-48 h-48 bg-gray-100 rounded-2xl flex items-center justify-center mb-4 border-2 border-dashed border-gray-300">
                  <div className="text-center">
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <p className="text-sm text-gray-500">No image</p>
                  </div>
                </div>
              )}
            </div>

            {/* Upload Controls */}
            <div className="space-y-4">
              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              {/* Upload Button */}
              <button
                onClick={triggerFileSelect}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span>{previewUrl ? 'Change Image' : 'Upload Image'}</span>
              </button>

              {/* Action Buttons */}
              {selectedFile && (
                <div className="flex space-x-3">
                  <button
                    onClick={removeImage}
                    className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-2xl font-semibold transition-all duration-300 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpload}
                    disabled={isLoading}
                    className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Save Image</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Guidelines */}
            <div className="mt-6 p-4 bg-blue-50 rounded-2xl">
              <h3 className="font-semibold text-gray-900 mb-2">Upload Guidelines</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Only one profile image allowed</li>
                <li>• Maximum file size: 5MB</li>
                <li>• Supported formats: JPG, PNG, GIF</li>
                <li>• Recommended size: 400x400 pixels</li>
                <li>• New image will replace the current one</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
    </>
  );
}
