'use client'
import { Suspense } from 'react';
import Signup from "@/components/auth/signup";
import { GoogleOAuthProvider } from '@react-oauth/google';

function LoginFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading login...</p>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <div>
      <GoogleOAuthProvider clientId='453099864669-cbn0n1t6bg76odspkr1mrqnvd930aej9.apps.googleusercontent.com'>
        <Suspense fallback={<LoginFallback />}>
          <Signup />
        </Suspense>
      </GoogleOAuthProvider>
    </div>
  );
}

