'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function NotFound() {
  const router = useRouter();

  const handleBackToHome = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      {/* 404 Image */}
      <div className="mb-8">
        <Image
          src="/images/404.jpg"
          alt="404 Page Not Found"
          width={300}
          height={300}
          className="rounded-lg shadow-lg"
        />
      </div>

      {/* Back to Home Button */}
      <button
        onClick={handleBackToHome}
        className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-full shadow-lg hover:bg-blue-700 hover:shadow-xl transform hover:scale-105 transition-all duration-300"
      >
        Back to Home
      </button>
    </div>
  );
}
