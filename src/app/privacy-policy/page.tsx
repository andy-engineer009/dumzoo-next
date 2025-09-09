// app/privacy-policy/page.tsx (Next.js 13+ with App Router)
'use client';
import { useRouter } from 'next/navigation';


export default function PrivacyPolicy() {
    const router = useRouter();
    return (
        <>
           <header className="sticky top-0 z-20 bg-white border-b border-gray-200 pr-4 py-3">
        <div className="flex items-center justify-center relative">
          <button 
            onClick={() => router.back()}
            className="p-2 rounded-full hover:bg-gray-100 absolute left-0 top-1/2 -translate-y-1/2"
          >
            <svg className="w-5 h-5" fill="none" stroke="#ccc" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-medium text-gray-900"> Privacy Policy</h1>
        </div>
      </header>
      <div className="min-h-screen bg-gray-50 py-10 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-gray-600 mb-4">
            Last Updated: <span className="font-medium">January 2025</span>
          </p>
  
          <section className="space-y-6 text-gray-700 leading-relaxed">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Overview
              </h2>
              <p>
                This Privacy Policy describes how <strong>Dumzoo</strong> ("we",
                "our", or "us") collects, uses, and protects your personal
                information when you use our platform. We respect your privacy and
                are committed to safeguarding your personal data.
              </p>
            </div>
  
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Information We Collect
              </h2>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  <strong>Email Address</strong> (via Google Sign-In): Used for
                  account creation, authentication, and communication.
                </li>
              </ul>
              <p className="mt-2">
                We do not collect payment details directly. All payments are
                handled securely by trusted third-party gateways.
              </p>
            </div>
  
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                How We Use Your Information
              </h2>
              <ul className="list-disc list-inside space-y-1">
                <li>To create and manage your account</li>
                <li>To authenticate login through Google</li>
                <li>To communicate about your account and services</li>
                <li>To send important platform updates</li>
                <li>To respond to inquiries and support requests</li>
              </ul>
            </div>
  
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Information Sharing
              </h2>
              <p>
                We do not sell your data. We may only share it with trusted
                providers like Google Sign-In, or if required by law.
              </p>
            </div>
  
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Data Security
              </h2>
              <p>
                We use appropriate security measures to protect your information.
                However, no system online is 100% secure, so we cannot guarantee
                absolute protection.
              </p>
            </div>
  
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Cookies
              </h2>
              <p>
                We may use cookies to improve your experience. You can disable
                cookies in your browser settings, but some features may not work
                properly.
              </p>
            </div>
  
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Your Rights
              </h2>
              <p>You may have rights such as:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Accessing the information we hold about you</li>
                <li>Requesting correction or deletion</li>
                <li>Objecting to processing of your data</li>
                <li>Withdrawing consent at any time</li>
              </ul>
            </div>
  
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Children’s Privacy
              </h2>
              <p>
                Dumzoo is not intended for children under 13. We do not knowingly
                collect personal data from children.
              </p>
            </div>
  
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Changes to This Policy
              </h2>
              <p>
                We may update this Privacy Policy from time to time. Updates will
                be posted here with a new "Last Updated" date.
              </p>
            </div>
  
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Contact Us
              </h2>
              <p>
                If you have any questions, please contact us at:{" "}
                <a
                  href="mailto:support@dumzoo.com"
                  className="text-green-600 font-medium hover:underline"
                >
                  support@dumzoo.com
                </a>
              </p>
            </div>
          </section>
        </div>
      </div>
      </>
    );
  }
  