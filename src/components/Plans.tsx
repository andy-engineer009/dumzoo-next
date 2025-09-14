'use client';

import { useState } from 'react';
import { Formik, Form } from 'formik';
import Link from 'next/link';

interface PackagePlan {
  id: string;
  name: string;
  weeklyPrice: number;
  weeklyOriginalPrice: number;
  monthlyPrice: number;
  monthlyOriginalPrice: number;
  badge?: string;
  features: string[];
}

const featureYourAdPlans: PackagePlan[] = [
  {
    id: 'feature-weekly',
    name: 'Weekly',
    weeklyPrice: 149,
    weeklyOriginalPrice: 199,
    monthlyPrice: 149,
    monthlyOriginalPrice: 199,
    features: [
      'Highlight your profile at the top for maximum visibility',
      'Get up to 4x more promotions and 3x more replies'
    ]
  },
  {
    id: 'feature-monthly',
    name: 'Monthly',
    weeklyPrice: 199,
    weeklyOriginalPrice: 299,
    monthlyPrice: 199,
    monthlyOriginalPrice: 299,
    badge: 'Best Value',
    features: [
      'Highlight your profile at the top for maximum visibility',
      'Get up to 4x more promotions and 3x more replies'
    ]
  }
];

const boostToTopPlans: PackagePlan[] = [
  {
    id: 'boost-weekly',
    name: 'Weekly',
    weeklyPrice: 99,
    weeklyOriginalPrice: 149,
    monthlyPrice: 99,
    monthlyOriginalPrice: 149,
    badge: 'Limited Time',
    features: [
      'Stay pinned at the top until a new influencer join',
      'Gain 2x more promotions and faster visibility'
    ]
  },
  {
    id: 'boost-monthly',
    name: 'Monthly',
    weeklyPrice: 179,
    weeklyOriginalPrice: 249,
    monthlyPrice: 179,
    monthlyOriginalPrice: 249,
    badge: 'Save More',
    features: [
      'Stay pinned at the top until a new influencer join',
      'Gain 2x more promotions and faster visibility'
    ]
  }
];

const BoosterPlan = () => {
  const [selectedPlan, setSelectedPlan] = useState<PackagePlan>(featureYourAdPlans[0]);
  const [activeTab, setActiveTab] = useState<'feature' | 'boost'>('feature');

  return (
    <Formik
      initialValues={{ plan: selectedPlan.id }}
      onSubmit={() => {
        alert(`Proceeding to payment for ${selectedPlan.name} plan!`);
      }}
    >
      {({ setFieldValue }) => (
        <Form className="min-h-screen flex flex-col bg-gray-50">
          {/* Header */}
          <header className="sticky top-0 z-20 bg-white border-b border-gray-200 px-4 py-3">
            <div className="flex items-center justify-center relative">
              <Link
                href="/profile"
                className="p-2 rounded-full hover:bg-gray-100 absolute left-0 top-1/2 -translate-y-1/2"
              >
                <svg className="w-5 h-5" fill="none" stroke="#ccc" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <h1 className="text-lg font-medium text-gray-900">Packages</h1>
            </div>
          </header>

          <div className="flex-1 px-4 py-6">
            {/* Tabs */}
            <div className="flex bg-gray-100 rounded-xl p-1 mb-8">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('feature');
                  setSelectedPlan(featureYourAdPlans[0]);
                  setFieldValue('plan', featureYourAdPlans[0].id);
                }}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  activeTab === 'feature'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Feature Your Ad
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('boost');
                  setSelectedPlan(boostToTopPlans[0]);
                  setFieldValue('plan', boostToTopPlans[0].id);
                }}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  activeTab === 'boost'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Boost to Top
              </button>
            </div>

            {/* Content based on active tab */}
            {activeTab === 'feature' && (
              <div className="space-y-4">
                {/* <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Feature Your Ad</h2>
                  <div className="w-20 h-1 bg-blue-500 rounded-full mx-auto"></div>
                </div> */}
                
                <div className="grid grid-cols-2 gap-3">
                  {featureYourAdPlans.map((plan) => (
                    <div
                      key={plan.id}
                      className={`relative border-2 rounded-xl p-4 transition-all duration-200 cursor-pointer ${
                        selectedPlan.id === plan.id 
                          ? 'border-blue-500 shadow-lg' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => {
                        setSelectedPlan(plan);
                        setFieldValue('plan', plan.id);
                      }}
                    >
                      {plan.badge && (
                        <div className="absolute -top-2 right-2">
                          <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                            {plan.badge}
                          </span>
                        </div>
                      )}
                      
                      <div className="text-center">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{plan.name}</h3>
                        <div className="flex items-center justify-center gap-1 mb-2">
                          <span className="text-xs text-gray-500 line-through">
                            ₹{plan.monthlyOriginalPrice}
                          </span>
                          <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-semibold">
                            {Math.round(((plan.monthlyOriginalPrice - plan.monthlyPrice) / plan.monthlyOriginalPrice) * 100)}% OFF
                          </span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900 mb-3">
                          ₹{plan.monthlyPrice}
                        </div>
                        
                        {/* Features List */}
                        <ul className="space-y-1 mb-3">
                          {plan.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start text-gray-600 text-xs">
                              <svg className="w-3 h-3 text-blue-500 mr-1 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                        
                        <button
                          type="button"
                          className={`w-full py-2 px-3 rounded-lg font-semibold transition-all duration-200 ${
                            selectedPlan.id === plan.id
                              ? 'bg-blue-500 text-white hover:bg-blue-600'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {selectedPlan.id === plan.id ? 'Selected' : 'Select'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'boost' && (
              <div className="space-y-4">
                {/* <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Boost to Top</h2>
                  <div className="w-20 h-1 bg-purple-500 rounded-full mx-auto"></div>
                </div> */}
                
                <div className="grid grid-cols-2 gap-3">
                  {boostToTopPlans.map((plan) => (
                    <div
                      key={plan.id}
                      className={`relative border-2 rounded-xl p-4 transition-all duration-200 cursor-pointer ${
                        selectedPlan.id === plan.id 
                          ? 'border-purple-500 shadow-lg' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => {
                        setSelectedPlan(plan);
                        setFieldValue('plan', plan.id);
                      }}
                    >
                      {plan.badge && (
                        <div className="absolute -top-2 right-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                            plan.badge === 'Limited Time' 
                              ? 'bg-red-500 text-white' 
                              : 'bg-green-500 text-white'
                          }`}>
                            {plan.badge}
                          </span>
                        </div>
                      )}
                      
                      <div className="text-center">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{plan.name}</h3>
                        <div className="flex items-center justify-center gap-1 mb-2">
                          <span className="text-xs text-gray-500 line-through">
                            ₹{plan.monthlyOriginalPrice}
                          </span>
                          <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-xs font-semibold">
                            {Math.round(((plan.monthlyOriginalPrice - plan.monthlyPrice) / plan.monthlyOriginalPrice) * 100)}% OFF
                          </span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900 mb-3">
                          ₹{plan.monthlyPrice}
                        </div>
                        
                        {/* Features List */}
                        <ul className="space-y-1 mb-3">
                          {plan.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start text-gray-600 text-xs">
                              <svg className="w-3 h-3 text-purple-500 mr-1 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                        
                        <button
                          type="button"
                          className={`w-full py-2 px-3 rounded-lg font-semibold transition-all duration-200 ${
                            selectedPlan.id === plan.id
                              ? 'bg-purple-500 text-white hover:bg-purple-600'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {selectedPlan.id === plan.id ? 'Selected' : 'Select'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Fixed Next Button */}
          <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 z-20">
            <button
              type="submit"
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-4 px-6 rounded-xl text-lg shadow-lg transition-all duration-200"
            >
              Continue to Payment
            </button>
          </div>

        </Form>
      )}
    </Formik>
  );
};

export default BoosterPlan;

//Apne followers se kamao, brands ke saath jud jao.
// Chhote budget mein badi promotion.
//Aapka business, influencer ke zariye har jagah.
//Sasta bhi, fast bhi
//“Local ho ya national, har influencer aapke brand ke liye yahan milega.


// “Hi 👋 Kya aap Instagram, YouTube ya Facebook chalaate ho?
// Aur kya aapke paas 1k+ followers hai?
// Toh abhi se social media se paisa banao — sirf Dumzoo par, bilkul FREE!

// 👉 Bas app kholo aur as an Influencer login karo,
// 👉 Apni profile banao, promotion ka price set karo aur phir promotions find karke apply karo,
// 👉 Deal lock karo — bina kisi commission ke,
// 👉 Aur brands ya promoters ke sath direct chat karo.”

 //"Acha sun bhai 👋
// Tere paas Insta pe 1k+ followers hai na?
// Agar hai, toh Dumzoo pe aa — apne followers se paisa kama.

// Yahan log apni promotions karvane ke liye influencers dhundhte hain,
// apna budget aur requirement ke saath.

// Bas tu app pe ja, as an Influencer login kar,
// apni profile bana, apna promotion ka price/offer set kar,
// aur directly paisa kama. 🚀

// Sabse mast baat – Dumzoo beech me koi commission nahi khata.
// Jo deal tu karega, paisa seedha tere pocket me aayega."