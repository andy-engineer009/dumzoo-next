'use client';

import { useState, useEffect, useRef } from 'react';
import { Formik, Form, Field } from 'formik';
import { motion, AnimatePresence } from 'framer-motion';
interface FilterValues {
  location: string;
  budgetMin: number;
  budgetMax: number;
  gender: string;
  followersMin: number;
  followersMax: number;
  categories: string[];
  language: string[];
  platforms: string[];
  audienceTypes: string,
  audienceAgeGroups: string,
}

const initialValues: FilterValues = {
  location: '',
  budgetMin: 0,
  budgetMax: 10000,
  gender: '',
  followersMin: 0,
  followersMax: 1000000,
  categories: [],
  language: [],
  platforms: [],
  audienceTypes: 'all',
  audienceAgeGroups: 'all',
};

const categories = [
  'Fashion & Beauty', 'Technology', 'Fitness & Health', 'Food & Cooking',
  'Travel', 'Lifestyle', 'Gaming', 'Education', 'Business', 'Entertainment'
];

const languages = ['English', 'Hindi', 'Punjabi', 'Bhojpuri', 'Marathi', 'Gujarati', 'Telugu'];
const platforms = ['Instagram', 'YouTube', 'Facebook'];
const audienceTypes = ['all','General', 'Niche', 'Specific'];
const audienceAgeGroups = ['all','13-18', '19-25', '26-35', '36-45', '46-55', '56+'];

interface FiltersProps {
  onApplyFilters?: (values: FilterValues) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const Filters = ({onClose, isOpen: isOpenProp, onApplyFilters}: FiltersProps) => {
  const [isOpen, setIsOpen] = useState(isOpenProp || false);
  const [appliedFilters, setAppliedFilters] = useState<FilterValues | null>(null);

  useEffect(() => {
    setIsOpen(isOpenProp || false);
  }, [isOpenProp]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleApplyFilters = (values: FilterValues) => {
    setAppliedFilters(values);
    setIsOpen(false);
    onApplyFilters?.(values);
  };

  const handleClearFilters = (resetForm: () => void) => {
    resetForm();
    setAppliedFilters(null);
  };

  const formatCurrency = (value: number) => {
    return `₹${value.toLocaleString()}`;
  };

  const formatFollowers = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toString();
  };

  const DualRangeSlider = ({ 
    min, 
    max, 
    step, 
    minValue, 
    maxValue, 
    onMinChange, 
    onMaxChange, 
    formatValue 
  }: {
    min: number;
    max: number;
    step: number;
    minValue: number;
    maxValue: number;
    onMinChange: (value: number) => void;
    onMaxChange: (value: number) => void;
    formatValue: (value: number) => string;
  }) => {
    const [isDragging, setIsDragging] = useState<'min' | 'max' | null>(null);
    const trackRef = useRef<HTMLDivElement>(null);

    const minPercent = ((minValue - min) / (max - min)) * 100;
    const maxPercent = ((maxValue - min) / (max - min)) * 100;

    const getValueFromPosition = (clientX: number) => {
      if (!trackRef.current) return minValue;
      
      const rect = trackRef.current.getBoundingClientRect();
      const percent = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
      const value = min + (percent / 100) * (max - min);
      return Math.round(value / step) * step;
    };

    const handlePointerDown = (e: React.PointerEvent, type: 'min' | 'max') => {
      e.preventDefault();
      setIsDragging(type);
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging) return;

      const newValue = getValueFromPosition(e.clientX);
      
      if (isDragging === 'min') {
        if (newValue < maxValue) {
          onMinChange(newValue);
        }
      } else {
        if (newValue > minValue) {
          onMaxChange(newValue);
        }
      }
    };

    const handlePointerUp = () => {
      setIsDragging(null);
    };

    useEffect(() => {
      if (isDragging) {
        document.addEventListener('pointermove', handlePointerMove);
        document.addEventListener('pointerup', handlePointerUp);
        document.body.style.userSelect = 'none';
        document.body.style.cursor = 'grabbing';
        
        return () => {
          document.removeEventListener('pointermove', handlePointerMove);
          document.removeEventListener('pointerup', handlePointerUp);
          document.body.style.userSelect = '';
          document.body.style.cursor = '';
        };
      }
    }, [isDragging]);

    const handleTrackClick = (e: React.PointerEvent) => {
      if (isDragging) return;
      
      const newValue = getValueFromPosition(e.clientX);
      const minDistance = Math.abs(newValue - minValue);
      const maxDistance = Math.abs(newValue - maxValue);
      
      if (minDistance < maxDistance) {
        if (newValue < maxValue) {
          onMinChange(newValue);
        }
      } else {
        if (newValue > minValue) {
          onMaxChange(newValue);
        }
      }
    };

    return (
      <div className="relative">
        {/* Track */}
        <div 
          ref={trackRef}
          className="relative h-2 bg-gray-200 rounded-lg cursor-pointer select-none touch-none"
          onPointerDown={handleTrackClick}
        >
          {/* Selected range */}
          <div 
            className="absolute h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg transition-all duration-150"
            style={{ 
              left: `${minPercent}%`, 
              width: `${maxPercent - minPercent}%` 
            }}
          />
          
          {/* Min thumb */}
          <div 
            className={`absolute top-0 w-5 h-5 bg-blue-500 rounded-full border-2 border-white shadow-lg transform -translate-y-1.5 cursor-grab active:cursor-grabbing transition-all duration-150 hover:scale-110 touch-none ${
              isDragging === 'min' ? 'scale-110 shadow-xl' : ''
            }`}
            style={{ 
              left: `calc(${minPercent}% - 10px)`,
              zIndex: 4
            }}
            onPointerDown={(e) => handlePointerDown(e, 'min')}
          />
          
          {/* Max thumb */}
          <div 
            className={`absolute top-0 w-5 h-5 bg-purple-500 rounded-full border-2 border-white shadow-lg transform -translate-y-1.5 cursor-grab active:cursor-grabbing transition-all duration-150 hover:scale-110 touch-none ${
              isDragging === 'max' ? 'scale-110 shadow-xl' : ''
            }`}
            style={{ 
              left: `calc(${maxPercent}% - 10px)`,
              zIndex: 4
            }}
            onPointerDown={(e) => handlePointerDown(e, 'max')}
          />
        </div>

        {/* Value labels */}
        <div className="flex justify-between text-sm font-medium text-gray-900 mt-4">
          <span className="transition-all duration-150">{formatValue(minValue)}</span>
          <span className="transition-all duration-150">{formatValue(maxValue)}</span>
        </div>
      </div>
    );
  };

  const FilterForm = ({ resetForm }: { resetForm: () => void }) => (
    <div className=" flex-col h-full bg-white rounded-t-3xl shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">Filters</h2>
        <button
          onClick={() => {
            setIsOpen(false);
            onClose?.();
          }}
          className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 h-[calc(100vh-280px)]">
        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <Field
            as="select"
            id="location"
            name="location"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black bg-white transition-colors"
          >
            <option value="">Select Location</option>
            <option value="new-york">New York</option>
            <option value="los-angeles">Los Angeles</option>
            <option value="chicago">Chicago</option>
            <option value="mumbai">Mumbai</option>
            <option value="delhi">Delhi</option>
            <option value="bangalore">Bangalore</option>
          </Field>
        </div>

                       {/* platfrom */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Platforms
          </label>
          <div className="grid grid-cols-2 gap-2">
            {platforms.map((platform) => (
              <label key={platform} className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <Field
                  type="checkbox"
                  name="platforms"
                  value={platform}
                  className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">{platform}</span>
              </label>
            ))}
          </div>
        </div>

        {/*  Gender */}
        <div>
          <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
            Gender
          </label>
          <Field
            as="select"
            id="gender"
            name="gender"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black bg-white transition-colors"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </Field>
        </div>

        {/* Budget Amount Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Budget Amount (₹)
          </label>
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-gray-600">
              <span>{formatCurrency(0)}</span>
              <span>{formatCurrency(10000)}</span>
            </div>
            <Field name="budgetMin">
              {({ field, form }: any) => (
                <Field name="budgetMax">
                  {({ field: fieldMax }: any) => (
                    <DualRangeSlider
                      min={0}
                      max={10000}
                      step={100}
                      minValue={field.value}
                      maxValue={fieldMax.value}
                      onMinChange={(value) => form.setFieldValue('budgetMin', value)}
                      onMaxChange={(value) => form.setFieldValue('budgetMax', value)}
                      formatValue={formatCurrency}
                    />
                  )}
                </Field>
              )}
            </Field>
          </div>
        </div>



        {/* Follower Count Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Follower Count
          </label>
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-gray-600">
              <span>0</span>
              <span>1M</span>
            </div>
            <Field name="followersMin">
              {({ field, form }: any) => (
                <Field name="followersMax">
                  {({ field: fieldMax }: any) => (
                    <DualRangeSlider
                      min={0}
                      max={1000000}
                      step={1000}
                      minValue={field.value}
                      maxValue={fieldMax.value}
                      onMinChange={(value) => form.setFieldValue('followersMin', value)}
                      onMaxChange={(value) => form.setFieldValue('followersMax', value)}
                      formatValue={formatFollowers}
                    />
                  )}
                </Field>
              )}
            </Field>
          </div>
        </div>

        {/* Categories */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Categories
          </label>
          <div className="grid grid-cols-2 gap-2">
            {categories.map((category) => (
              <label key={category} className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <Field
                  type="checkbox"
                  name="categories"
                  value={category}
                  className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">{category}</span>
              </label>
            ))}
          </div>
        </div>

        {/* language */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Categories
          </label>
          <div className="grid grid-cols-2 gap-2">
            {languages.map((language) => (
              <label key={language} className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <Field
                  type="checkbox"
                  name="language"
                  value={language}
                  className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">{language}</span>
              </label>
            ))}
          </div>
        </div>

         {/*  audience types */}
         <div>
          <label htmlFor="audienceTypes" className="block text-sm font-medium text-gray-700 mb-2">
            Audience Types
          </label>
          <Field
            as="select"
            id="audienceTypes"
            name="audienceTypes"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black bg-white transition-colors"
          >
            {audienceTypes.map((audienceType) => (
              <option key={audienceType} value={audienceType}>{audienceType}</option>
            ))}
          </Field>
        </div>

     {/*  audience age groups */}
     <div>
          <label htmlFor="audienceAgeGroups" className="block text-sm font-medium text-gray-700 mb-2">
            Audience Age Groups
          </label>
          <Field
            as="select"
            id="audienceAgeGroups"
            name="audienceAgeGroups"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black bg-white transition-colors"
          >
            {audienceAgeGroups.map((audienceAgeGroup) => (
              <option key={audienceAgeGroup} value={audienceAgeGroup}>{audienceAgeGroup}</option>
            ))}
          </Field>
        </div>
      </div>

      {/* Bottom Buttons */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => handleClearFilters(resetForm)}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors"
          >
            Clear
          </button>
          <button
            type="submit"
            className="flex-1 bg-[#6f43fe] text-white py-2 px-4 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );


  return (
    <>
      {/* Filter Toggle Button */}
      {/* <button 
        className="fixed bottom-20 right-6 z-40 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110"
        onClick={() => setIsOpen(true)}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
        </svg>
      </button> */}

      {/* Filter Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm"
              
            />
            
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 h-[85vh] max-w-xl mx-auto"
            >
              <Formik
                initialValues={initialValues}
                onSubmit={handleApplyFilters}
              >
                {({ resetForm }) => (
                  <Form>
                    <FilterForm resetForm={resetForm} />
                  </Form>
                )}
              </Formik>
        
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Filters;