'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { api } from '@/common/services/rest-api/rest-api';
import { API_ROUTES } from '@/appApi';
import Link from 'next/link';
import Loader from '../../loader';
import ConfirmationPopup from '../../confirmation-popup';

interface OfferItem {
  name: string;
  quantity: number;
}

// interface Offer {
//   id?: number;
//   name: string;
//   amount: number;
//   items: OfferItem[];
// }

// Validation schema
const offerValidationSchema = Yup.object().shape({
  name: Yup.string()
    .required('Offer name is required')
    .min(3, 'Offer name must be at least 3 characters')
    .max(50, 'Offer name must be less than 50 characters'),
  amount: Yup.number()
    .required('Amount is required')
    .positive('Amount must be positive')
    .min(1, 'Amount must be at least ₹1')
    .max(100000, 'Amount cannot exceed ₹1,00,000'),
  items: Yup.array()
    .of(
      Yup.object().shape({
        name: Yup.string().required('Item type is required'),
        quantity: Yup.number()
          .required('Quantity is required')
          .positive('Quantity must be positive')
          .min(1, 'Quantity must be at least 1')
          .max(100, 'Quantity cannot exceed 100')
      })
    )
    .min(1, 'At least one item is required')
    .required('Items are required')
});

const itemOptions = [
  { value: 'ig_post', label: 'Instagram Post' },
  { value: 'ig_story', label: 'Instagram Story' },
  { value: 'ig_reel', label: 'Instagram Reel' },
  { value: 'youtube_video', label: 'YouTube Video' },
  { value: 'facebook_post', label: 'Facebook Post' },
  { value: 'tiktok_video', label: 'TikTok Video' },
];

export default function OffersForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSkeltonLoading, setIsSkeltonLoading] = useState(false);

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [offers, setOffers] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingOffer, setEditingOffer] = useState<any | null>(null);
  const [editingIndex, setEditingIndex] = useState<number>(-1);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [deleteOfferId, setDeleteOfferId] = useState<number | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      setIsSkeltonLoading(true);
      const response = await api.get(API_ROUTES.offersList);
      setIsSkeltonLoading(false);
      if (response.status === 1) {
        console.log(response.data);
        const offers = response.data.map((offer: any) => ({
          ...offer,
          amount: offer.offer_price,
          name: offer.offer_name,
          items: JSON.parse(offer.items)
        }));

        console.log(offers);
        setOffers(offers);
      }
    } catch (error) {
      setIsSkeltonLoading(false);
      console.error('Error fetching offers:', error);
    }
  };

  const addOffer = () => {
    const newOffer: any = {
      name: '',
      amount: 0,
      items: [{ name: '', quantity: 1 }],
    };
    setEditingOffer(newOffer);
    setEditingIndex(-1);
    setShowModal(true);
  };

  const editOffer = (offer: any, index: number) => {
    console.log(offer);
    setEditingOffer({ ...offer });
    setEditingIndex(index);
    setShowModal(true);
  };

  const deleteOffer = async (id: number | null) => {
    try {
      setIsLoading(true);
      const response = await api.delete(API_ROUTES.deleteOffer, { offer_id : id });
      setIsLoading(false);
      if (response.status === 1) {
        showToast('Offer deleted successfully!', 'success');
        const updatedOffers = offers.filter((item) => item.id !== id);
        setOffers(updatedOffers);
      }
    } catch (error) {
      setIsLoading(false);
      showToast('Error deleting offer', 'error');
    }
  };

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    console.log(values);
    setIsLoading(true);
    // try {
      let payload;
      if (editingIndex === -1) {
        payload = {
          ...values,
        }
      }else {
        payload = {
          name: values.name,
          amount: values.amount,
          items: values.items,
          id: editingIndex
        }
      }

      api.post(API_ROUTES.addUpdateOffers, payload).then((res) => {
        setIsLoading(false);
        if(res.status === 1) {
          showToast(editingIndex === -1 ? 'Offer added successfully!' : 'Offer updated successfully!', 'success');
          let data = res.data[0];
            let offer: any = {
              amount: data.offer_price,
              name: data.offer_name,
              items: JSON.parse(data.items),
              id: data.id
            }
          if(editingIndex === -1) {
            setOffers([ offer,...offers,]);
          }else {
            offer.id = editingIndex
            const updatedOffers = offers.map((item) => item.id === editingIndex ? offer : item);
            setOffers(updatedOffers);
          }
          setShowModal(false);
          setEditingOffer(null);
          setEditingIndex(-1);

        } else {
          showToast('Failed to save offer', 'error');
        }
      });
      
    // } catch (error) {
    //   setIsLoading(false);
    //   showToast('Error saving offer', 'error');
    // } finally {
    //   setIsLoading(false);
    //   setSubmitting(false);
    // }
  };

  const addItemToOffer = (setFieldValue: any, values: any) => {
    const newItems = [...values.items, { name: '', quantity: 1 }];
    setFieldValue('items', newItems);
  };

  const removeItemFromOffer = (setFieldValue: any, values: any, itemIndex: number) => {
    if (values.items.length > 1) {
      const newItems = values.items.filter((_: any, i: number) => i !== itemIndex);
      setFieldValue('items', newItems);
    }
  };

  return (
    <>
      {isLoading && <Loader/>}  
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
          className={`fixed top-4 right-4 z-[101] ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white px-6 py-3 rounded-2xl shadow-2xl`}
        >
          {toast.message}
        </motion.div>
      )}

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full px-6 py-3 bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-[100]"
      >
        <div className="flex items-center">
          <Link href="/profile/edit" className="absolute left-4">
          <svg className="w-6 h-6 text-gray-600 hover:text-gray-900 " fill="none" stroke="#ccc" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div className="flex-1 text-center">
            <h1 className="text-lg font-medium text-gray-900">My Offers</h1>
            {/* <p className="text-sm text-gray-500">Manage your service packages</p> */}
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 px-4 py-6">
        <div className="max-w-6xl mx-auto">
          {/* Add Button - Mobile Friendly */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <button
              onClick={addOffer}
              className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl text-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Add New Offer</span>
            </button>
          </motion.div>

          {/* Offers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {isSkeltonLoading ? (
              // Skeleton Loading UI
              Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/50 relative animate-pulse">
                  {/* Skeleton Action Icons */}
                  <div className="absolute top-3 right-3 flex space-x-1">
                    <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                    <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                  </div>

                  {/* Skeleton Content */}
                  <div className="pr-16">
                    {/* Skeleton Offer Name */}
                    <div className="h-6 bg-gray-200 rounded mb-3 w-3/4"></div>
                    
                    {/* Skeleton Items List */}
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between items-center">
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                        <div className="h-4 bg-gray-200 rounded w-8"></div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                        <div className="h-4 bg-gray-200 rounded w-8"></div>
                      </div>
                    </div>

                    {/* Skeleton Amount */}
                    <div className="border-t pt-3 border-gray-200">
                      <div className="h-5 bg-gray-200 rounded w-16"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : offers.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="col-span-full bg-white/70 backdrop-blur-sm rounded-3xl p-12 shadow-xl border border-white/50 text-center"
              >
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Offers Yet</h3>
                <p className="text-gray-600 mb-6">Create your first service offer to start earning</p>
                <button
                  onClick={addOffer}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300 flex items-center space-x-2 mx-auto"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Create First Offer</span>
                </button>
              </motion.div>
            ) : (
              offers.map((offer, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/50 relative hover:shadow-xl transition-all duration-300"
                >
                  {/* Action Icons */}
                  <div className="absolute top-3 right-3 flex space-x-1">
                    <button
                      onClick={() => editOffer(offer, offer.id)}
                      className="p-1.5 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => {
                        setDeleteOfferId(offer.id);
                        setIsConfirmationOpen(true);
                      }}
                      className="p-1.5 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>

                  {/* Offer Content */}
                  <div className="pr-16">
                    {/* Offer Name */}
                    <h3 className="text-lg font-bold text-gray-900 mb-3 truncate">{offer.name}</h3>
                    
                    {/* Items List */}
                    <div className="space-y-2 mb-4">
                      {offer.items.map((item: any, itemIndex: number) => {
                        const itemOption = itemOptions.find(option => option.value === item.name);
                        return (
                          <div key={itemIndex} className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">{itemOption?.label || item.name}</span>
                            <span className="text-gray-400">×{item.quantity}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Offer Amount */}
                    <div className="border-t pt-3">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-900">₹{offer.amount}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal with Formik */}
      {showModal && editingOffer && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {editingIndex === -1 ? 'Add New Offer' : 'Edit Offer'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <Formik
              initialValues={editingOffer}
              validationSchema={offerValidationSchema}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({ values, setFieldValue, isValid, dirty }) => (
                <Form className="space-y-6">
                  {/* Offer Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Offer Name *</label>
                    <Field
                      name="name"
                      placeholder="e.g., Instagram Package"
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                    />
                    <ErrorMessage name="name" component="div" className="mt-1 text-sm text-red-500" />
                  </div>

                  {/* Offer Amount */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Offer Amount (₹) *</label>
                    <Field
                      name="amount"
                      type="number"
                      placeholder="1000"
                      min="0"
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                    />
                    <ErrorMessage name="amount" component="div" className="mt-1 text-sm text-red-500" />
                  </div>

                  {/* Items */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-sm font-semibold text-gray-700">Items *</label>
                      <button
                        type="button"
                        onClick={() => addItemToOffer(setFieldValue, values)}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        + Add Item
                      </button>
                    </div>
                    
                    <Field name="items">
                      {({ field }: any) => (
                        <div className="space-y-3">
                          {values.items.map((item: any, itemIndex: number) => (
                            <div key={itemIndex} className="p-3 bg-gray-50 rounded-xl">
                              <div className="grid grid-cols-2 gap-3 mb-2">
                                <div>
                                  <Field
                                    name={`items.${itemIndex}.name`}
                                    as="select"
                                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                  >
                                    <option value="">Select Item</option>
                                    {itemOptions.map(option => (
                                      <option key={option.value} value={option.value}>{option.label}</option>
                                    ))}
                                  </Field>
                                  <ErrorMessage name={`items.${itemIndex}.name`} component="div" className="mt-1 text-xs text-red-500" />
                                </div>
                                <div>
                                  <Field
                                    name={`items.${itemIndex}.quantity`}
                                    type="number"
                                    placeholder="Qty"
                                    min="1"
                                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                  />
                                  <ErrorMessage name={`items.${itemIndex}.quantity`} component="div" className="mt-1 text-xs text-red-500" />
                                </div>
                              </div>
                              {values.items.length > 1 && (
                                <div className="flex justify-end">
                                  <button
                                    type="button"
                                    onClick={() => removeItemFromOffer(setFieldValue, values, itemIndex)}
                                    className="p-1 text-red-500 hover:text-red-700"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </Field>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-2xl font-semibold transition-all duration-300 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-2xl font-semibold transition-all duration-300 disabled:cursor-not-allowed"
                    >
                      {(editingIndex === -1 ? 'Add Offer' : 'Update Offer')}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </motion.div>
        </div>
      )}
    </div>

    <ConfirmationPopup
  isOpen={isConfirmationOpen}
  onClose={() => setIsConfirmationOpen(false)}
  onConfirm={() => {
    deleteOffer(deleteOfferId);
  }}
  title="Delete"
  subtitle="Are you sure you want to Delete."
  confirmText="YES"
  cancelText="NO"
></ConfirmationPopup>
    </>

  );
}
