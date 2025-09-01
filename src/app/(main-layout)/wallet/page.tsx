'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function WalletPage() {
  const router = useRouter();
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [upiId, setUpiId] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const giftCards = [
    {
      id: 1,
      name: 'Amazon',
      logo: '🛒',
      label: 'GIFT CARD',
      priceRange: 'From 900 RS to 5000 RS',
      minCoins: 900,
      maxCoins: 5000
    },
    {
      id: 2,
      name: 'H&M',
      logo: '👕',
      label: 'GIFT CARD',
      priceRange: 'From 1200 RS to 4000 RS',
      minCoins: 1200,
      maxCoins: 4000
    }
  ];

  const handleRedeem = async () => {
    if (!upiId.trim() || !withdrawAmount.trim()) {
      alert('Please fill in all fields');
      return;
    }

    const amount = parseFloat(withdrawAmount);
    if (amount < 100 || amount > 10000) {
      alert('Withdrawal amount must be between 100 RS and 10,000 RS');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      alert(`Withdrawal request submitted successfully!\nAmount: ₹${amount}\nUPI ID: ${upiId}`);
      setShowRedeemModal(false);
      setUpiId('');
      setWithdrawAmount('');
    }, 2000);
  };

  return (
    <div className="min-h-screen text-white">
      {/* Top Bar */}
      <header className="sticky top-0 z-20 bg-white border-b border-gray-200 pr-4 py-3">
        <div className="flex items-center justify-center relative">
          <button 
            onClick={() => router.push('/profile')}
            className="p-2 rounded-full hover:bg-gray-100 absolute left-0 top-1/2 -translate-y-1/2"
          >
            <svg className="w-5 h-5" fill="none" stroke="#ccc" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-medium text-gray-900">Wallet</h1>
        </div>
      </header>

      <div className="px-4 py-6">
        {/* Wallet Balance Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-black rounded-2xl p-6 mb-8"
        >
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Your Wallet</h2>
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-lg">₹</span>
              </div>
              <span className="text-4xl font-bold text-white">11,540</span>
            </div>
            <button
              onClick={() => setShowRedeemModal(true)}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-200 transform hover:scale-105"
            >
              Redeem
            </button>
          </div>
        </motion.div>




      </div>

      {/* Redeem Modal */}
      <AnimatePresence>
        {showRedeemModal && (
          <>
                         {/* Backdrop */}
             <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50"
               onClick={() => setShowRedeemModal(false)}
             />
             
             {/* Modal */}
             <motion.div
               initial={{ opacity: 0, scale: 0.9, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.9, y: 20 }}
               transition={{ type: "spring", damping: 25, stiffness: 300 }}
               className="fixed inset-4 bg-white rounded-2xl shadow-2xl z-50 max-w-md mx-auto max-h-[80vh] overflow-hidden"
             >
               <div className="p-6">
                 <div className="flex items-center justify-between mb-6">
                   <h3 className="text-xl font-bold text-black">Redeem Coins</h3>
                   <button
                     onClick={() => setShowRedeemModal(false)}
                     className="text-gray-500 hover:text-black transition-colors"
                   >
                     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                     </svg>
                   </button>
                 </div>

                 <div className="space-y-6">
                   {/* UPI ID Input */}
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">
                       UPI ID
                     </label>
                     <input
                       type="text"
                       value={upiId}
                       onChange={(e) => setUpiId(e.target.value)}
                       placeholder="Enter your UPI ID (e.g., user@upi)"
                       className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black placeholder-gray-500"
                     />
                   </div>

                   {/* Withdrawal Amount Input */}
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">
                       Withdrawal Amount (RS)
                     </label>
                     <input
                       type="number"
                       value={withdrawAmount}
                       onChange={(e) => setWithdrawAmount(e.target.value)}
                       placeholder="Enter amount (100 - 10,000)"
                       min="100"
                       max="10000"
                       className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black placeholder-gray-500"
                     />
                     <p className="text-xs text-gray-500 mt-1">
                       Available balance: ₹11,540 | Min: ₹100 | Max: ₹10,000
                     </p>
                   </div>

                   {/* Withdraw Button */}
                   <button
                     onClick={handleRedeem}
                     disabled={isLoading || !upiId.trim() || !withdrawAmount.trim()}
                     className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                       isLoading || !upiId.trim() || !withdrawAmount.trim()
                         ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                         : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transform hover:scale-105'
                     }`}
                   >
                     {isLoading ? (
                       <div className="flex items-center justify-center space-x-2">
                         <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                         <span>Processing...</span>
                       </div>
                     ) : (
                       'Withdraw'
                     )}
                   </button>

                   {/* Info */}
                   <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                     <p className="text-sm text-gray-600">
                       <span className="text-blue-600">ℹ️</span> Withdrawal will be processed within 24-48 hours to your UPI ID.
                     </p>
                   </div>
                 </div>
               </div>
             </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
