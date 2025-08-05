'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface AwarePopupProps {
  isOpen: boolean;
  onClose: () => void;
  onProceed: () => void;
  influencerName?: string;
}

const AwarePopup = ({ isOpen, onClose, onProceed, influencerName }: AwarePopupProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleProceed = () => {
    onProceed();
    onClose();
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${
      isOpen ? 'opacity-100' : 'opacity-0'
    }`}>
      {/* Blurred Background Overlay */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Popup Content */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
        {/* Header with Warning Icon */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-t-2xl p-6 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Stay Safe!</h2>
          <p className="text-orange-100 text-sm">
            {influencerName ? `Before chatting with ${influencerName}` : 'Before proceeding to chat'}
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-4">
            {/* Safety Tips */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Important Safety Tips:</h3>
              
              {/* Tip 1 */}
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-orange-600 font-bold text-sm">1</span>
                </div>
                <div>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    <strong>Never pay upfront:</strong> This platform never asks for payment before services. Be cautious of influencers who demand payment before delivery.
                  </p>
                </div>
              </div>

              {/* Tip 2 */}
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-orange-600 font-bold text-sm">2</span>
                </div>
                <div>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    <strong>Visit their profile first:</strong> Always check the influencer's complete profile, reviews, and previous work before booking.
                  </p>
                </div>
              </div>

              {/* Tip 3 */}
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-orange-600 font-bold text-sm">3</span>
                </div>
                <div>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    <strong>Chat on our platform:</strong> Keep all communications within our platform for your safety and support.
                  </p>
                </div>
              </div>
            </div>

            {/* Warning Box */}
            {/* <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div>
                  <p className="text-red-800 text-sm font-medium">Red Flags to Watch For:</p>
                  <ul className="text-red-700 text-xs mt-1 space-y-1">
                    <li>• Requests for payment outside the platform</li>
                    <li>• Pressure to pay immediately</li>
                    <li>• Suspiciously low prices</li>
                    <li>• Requests for personal information</li>
                  </ul>
                </div>
              </div>
            </div> */}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-6 pb-6 space-y-3">
          <button
            onClick={handleProceed}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
          >
            I Understand, Proceed to Chat
          </button>
          
     
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default AwarePopup;
