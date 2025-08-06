'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { api } from '@/common/services/rest-api/rest-api';
import { API_ROUTES } from '@/appApi';
import Link from 'next/link';

interface OfferItem {
  name: string;
  quantity: number;
}

interface Offer {
  id?: number;
  name: string;
  amount: number;
  items: OfferItem[];
}

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
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [editingIndex, setEditingIndex] = useState<number>(-1);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const response = await api.get(API_ROUTES.getInfluencerProfile);
      if (response.status === 1) {
        setOffers(response.data?.offers || []);
      }
    } catch (error) {
      console.error('Error fetching offers:', error);
    }
  };

  const addOffer = () => {
    const newOffer: Offer = {
      name: '',
      amount: 0,
      items: [{ name: '', quantity: 1 }],
    };
    setEditingOffer(newOffer);
    setEditingIndex(-1);
    setShowModal(true);
  };

  const editOffer = (offer: Offer, index: number) => {
    setEditingOffer({ ...offer });
    setEditingIndex(index);
    setShowModal(true);
  };

  const deleteOffer = async (index: number) => {
    try {
      const updatedOffers = offers.filter((_, i) => i !== index);
      setOffers(updatedOffers);
      
      // Auto save
      const response = await api.post(API_ROUTES.addInfulancer, { offers: updatedOffers });
      if (response.status === 1) {
        showToast('Offer deleted successfully!', 'success');
      }
    } catch (error) {
      showToast('Error deleting offer', 'error');
    }
  };

  const handleModalSave = async () => {
    if (!editingOffer || !editingOffer.name.trim()) {
      showToast('Please enter offer name', 'error');
      return;
    }

    if (editingOffer.amount <= 0) {
      showToast('Please enter offer amount', 'error');
      return;
    }

    if (editingOffer.items.length === 0 || editingOffer.items.some(item => !item.name || item.quantity <= 0)) {
      showToast('Please add at least one item with quantity', 'error');
      return;
    }

    try {
      let updatedOffers;
      if (editingIndex === -1) {
        updatedOffers = [...offers, editingOffer];
      } else {
        updatedOffers = [...offers];
        updatedOffers[editingIndex] = editingOffer;
      }

      setOffers(updatedOffers);
      
      // Auto save
      const response = await api.post(API_ROUTES.addInfulancer, { offers: updatedOffers });
      if (response.status === 1) {
        showToast(editingIndex === -1 ? 'Offer added successfully!' : 'Offer updated successfully!', 'success');
      } else {
        showToast('Failed to save offer', 'error');
      }
    } catch (error) {
      showToast('Error saving offer', 'error');
    }

    setShowModal(false);
    setEditingOffer(null);
    setEditingIndex(-1);
  };

  const addItemToOffer = () => {
    if (editingOffer) {
      setEditingOffer({
        ...editingOffer,
        items: [...editingOffer.items, { name: '', quantity: 1 }]
      });
    }
  };

  const removeItemFromOffer = (itemIndex: number) => {
    if (editingOffer && editingOffer.items.length > 1) {
      setEditingOffer({
        ...editingOffer,
        items: editingOffer.items.filter((_, i) => i !== itemIndex)
      });
    }
  };

  const updateOfferItem = (itemIndex: number, field: keyof OfferItem, value: any) => {
    if (editingOffer) {
      const updatedItems = [...editingOffer.items];
      updatedItems[itemIndex] = { ...updatedItems[itemIndex], [field]: value };
      setEditingOffer({ ...editingOffer, items: updatedItems });
    }
  };

  return (
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
            <svg className="w-6 h-6 text-gray-600 hover:text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div className="flex-1 text-center">
            <h1 className="text-xl font-bold text-gray-900">My Offers</h1>
            <p className="text-sm text-gray-500">Manage your service packages</p>
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
            {offers.length === 0 ? (
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
                      onClick={() => editOffer(offer, index)}
                      className="p-1.5 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => deleteOffer(index)}
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
                      {offer.items.map((item, itemIndex) => {
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

      {/* Edit Modal */}
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

            {/* Offer Name */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Offer Name *</label>
              <input
                type="text"
                value={editingOffer.name}
                onChange={(e) => setEditingOffer({ ...editingOffer, name: e.target.value })}
                placeholder="e.g., Instagram Package"
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
              />
            </div>

            {/* Offer Amount */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Offer Amount (₹) *</label>
              <input
                type="number"
                value={editingOffer.amount}
                onChange={(e) => setEditingOffer({ ...editingOffer, amount: parseInt(e.target.value) })}
                placeholder="1000"
                min="0"
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
              />
            </div>

            {/* Items */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-semibold text-gray-700">Items *</label>
                <button
                  onClick={addItemToOffer}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  + Add Item
                </button>
              </div>
              
              <div className="space-y-3">
                {editingOffer.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="p-3 bg-gray-50 rounded-xl">
                    <div className="grid grid-cols-2 gap-3 mb-2">
                      <div>
                        <select
                          value={item.name}
                          onChange={(e) => updateOfferItem(itemIndex, 'name', e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        >
                          <option value="">Select Item</option>
                          {itemOptions.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateOfferItem(itemIndex, 'quantity', parseInt(e.target.value))}
                          placeholder="Qty"
                          min="1"
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                      </div>
                    </div>
                    {editingOffer.items.length > 1 && (
                      <div className="flex justify-end">
                        <button
                          onClick={() => removeItemFromOffer(itemIndex)}
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
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-2xl font-semibold transition-all duration-300 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleModalSave}
                className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-semibold transition-all duration-300"
              >
                {editingIndex === -1 ? 'Add Offer' : 'Update Offer'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
