'use client';

import React from 'react';
import Image from 'next/image';

interface LoaderProps {
  message?: string;
  show?: boolean;
}

const Loader: React.FC<LoaderProps> = ({ 
  message = "Loading...", 
  show = true 
}) => {
  if (!show) return null;

  return (
    <>
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/20 backdrop-blur-xs">
      <div className="flex flex-col items-center space-y-6">
        <Image src="/images/loader-spinner.gif" alt="loader" width={100} height={100} />
      </div>
    </div>

  
    </>
  );
};

export default Loader;