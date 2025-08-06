'use client';

import { useState } from 'react';
import { Formik, Form } from 'formik';

interface BoosterPlan {
  id: string;
  name: string;
  badge?: string;
  price: number;
  originalPrice: number;
  discount: number;
  features: string[];
}

const plans: BoosterPlan[] = [
  {
    id: '1day',
    name: '1 Day',
    price: 19,
    originalPrice: 60,
    discount: 25,
    features: [
      'Featured on top for 24 hours',
      '3x more profile views',
      'Priority brand connections'
    ]
  },
  {
    id: '10days',
    name: '10 Days',
    badge: 'Most',
    price: 99,
    originalPrice: 199,
    discount: 50,
    features: [
      'Featured on top for 10 days',
      '5x more profile views',
      'Priority brand connections',
      'Analytics dashboard'
    ]
  },
  {
    id: 'monthly',
    name: 'Monthly',
    price: 199,
    originalPrice: 700,
    discount: 70,
    features: [
      'Featured on top for 30 days',
      '10x more profile views',
      'Priority brand connections',
      'Analytics dashboard',
      'Dedicated support'
    ]
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 299,
    originalPrice: 999,
    discount: 70,
    features: [
      'Featured on top for 60 days',
      '20x more profile views',
      'Exclusive brand partnerships',
      'Analytics dashboard',
      'Dedicated support',
      'Custom profile customization'
    ]
  }
];

const BoosterPlan = () => {
  const [selectedPlan, setSelectedPlan] = useState<BoosterPlan>(plans[0]);

  return (
    <Formik
      initialValues={{ plan: selectedPlan.id }}
      onSubmit={() => {
        alert(`Proceeding to payment for ${selectedPlan.name} plan!`);
      }}
    >
      {({ setFieldValue }) => (
        <Form className="min-h-screen flex flex-col bg-white">
          {/* Header */}
          <div className="py-4 px-4 border-b border-gray-200 sticky top-0 bg-white z-10">
            {/* <h1 className="text-2xl font-bold text-gray-900 text-center mb-1">Boost your profile</h1> */}
            <h2 className="text-lg font-bold text-gray-900 text-center">Choose the plan that's right for you</h2>
          </div>

          {/* Horizontal Scrollable Plans */}
          <div className="flex overflow-x-auto gap-3 px-4 py-4 snap-x snap-mandatory">
            {plans.map((plan) => (
              <button
                type="button"
                key={plan.id}
                onClick={() => {
                  setSelectedPlan(plan);
                  setFieldValue('plan', plan.id);
                }}
                className={`relative flex-shrink-0 w-36 sm:w-44 rounded-lg border-2 px-3 py-4 flex flex-col items-center text-center snap-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500
                  ${selectedPlan.id === plan.id ? 'border-orange-500 bg-orange-50 shadow-md' : 'border-gray-200 bg-white'}`}
              >
                {plan.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-semibold shadow">{plan.badge}</span>
                )}
                <span className="text-base font-bold text-gray-900 mb-1">{plan.name}</span>
                <span className="text-lg font-bold text-orange-600 mb-1">₹{plan.price}</span>
                <span className="text-xs text-gray-500 line-through">₹{plan.originalPrice}</span>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-semibold mt-1">{plan.discount}% OFF</span>
              </button>
            ))}
          </div>

          {/* Plan Details Section */}
          <div className="px-4 pb-32">
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-2">{selectedPlan.name} Plan</h2>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl font-bold text-orange-600">₹{selectedPlan.price}</span>
                <span className="text-base text-gray-500 line-through">₹{selectedPlan.originalPrice}</span>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-semibold">{selectedPlan.discount}% OFF</span>
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">What you get:</h3>
              <ul className="space-y-2 mb-2">
                {selectedPlan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-gray-700 text-sm">
                    <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="text-xs text-gray-500 mt-4">
                <p>All plans include priority listing and enhanced visibility. You can upgrade or cancel anytime. For more details, see our <a href="#" className="underline">Terms of Service</a>.</p>
              </div>
            </div>
          </div>

          {/* Fixed Next Button */}
          <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 z-20">
            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg text-lg shadow transition-colors duration-200"
            >
              Next
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default BoosterPlan;
