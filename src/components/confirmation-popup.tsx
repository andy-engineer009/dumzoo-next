'use client';

import React from 'react';

interface ConfirmationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  subtitle?: string;
  confirmText?: string;
  cancelText?: string;
  confirmButtonColor?: 'red' | 'blue' | 'green' | 'gray';
}

const ConfirmationPopup: React.FC<ConfirmationPopupProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  subtitle,
  confirmText = 'Yes',
  cancelText = 'No',
  confirmButtonColor = 'red'
}) => {
  if (!isOpen) return null;

  const getButtonColorClasses = (color: string) => {
    switch (color) {
      case 'red':
        return 'bg-red-500 hover:bg-red-600 focus:ring-red-500';
      case 'blue':
        return 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-500';
      case 'green':
        return 'bg-green-500 hover:bg-green-600 focus:ring-green-500';
      case 'gray':
        return 'bg-gray-500 hover:bg-gray-600 focus:ring-gray-500';
      default:
        return 'bg-red-500 hover:bg-red-600 focus:ring-red-500';
    }
  };

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      
      {/* Popup */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full mx-4 transform transition-all duration-200 scale-100">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 text-center">
              {title}
            </h3>
            {subtitle && (
              <p className="text-sm text-gray-600 text-center mt-1">
                {subtitle}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="px-6 py-4 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              {cancelText}
            </button>
            <button
              onClick={handleConfirm}
              className={`flex-1 px-4 py-2.5 text-white font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${getButtonColorClasses(confirmButtonColor)}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmationPopup;
