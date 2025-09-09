'use client';
import { useRouter } from 'next/navigation';

export default function TermsOfService() {
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
          <h1 className="text-lg font-medium text-gray-900"> Terms of Service</h1>
        </div>
      </header>
      <div className="min-h-screen bg-gray-50 px-6 py-8">
        <div className="max-w-3xl mx-auto">
          <p className="text-gray-700 mb-6">
            Welcome to <strong>Dumzoo</strong> ("we", "our", or "us"). By accessing or using our
            platform, you agree to these Terms of Service. Please read them carefully before using
            the site.
          </p>
  
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Overview</h2>
          <p className="text-gray-700 mb-6">
            Dumzoo is a simple platform where <strong>influencers</strong> can find paid work and
            <strong> promoters (businesses)</strong> can connect with hand-picked influencers to grow
            their business.
          </p>
  
          <h2 className="text-xl font-semibold text-gray-900 mb-3">User Roles</h2>
          <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
            <li><strong>Influencers</strong>: Can register an account on Dumzoo to showcase their profile.</li>
            <li><strong>Promoters (Businesses)</strong>: Can browse and contact influencers without registering as influencers.</li>
          </ul>
  
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Account Registration</h2>
          <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
            <li>Influencers must provide accurate details while creating an account.</li>
            <li>You are responsible for maintaining the security of your account.</li>
            <li>Any misuse of your account will be considered your responsibility.</li>
          </ul>
  
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Payments</h2>
          <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
            <li>Dumzoo may charge a <strong>platform fee</strong> for access to certain services.</li>
            <li>All payments are processed securely through third-party payment gateways (such as Instamojo).</li>
            <li>By making a payment, you agree to abide by these Terms and the policies of our payment provider.</li>
          </ul>
  
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Refunds & Cancellations</h2>
          <p className="text-gray-700 mb-6">
            <strong>No refunds</strong> are provided for platform fees once the payment is completed.
            Please review services carefully before making any payments.
          </p>
  
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Prohibited Activities</h2>
          <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
            <li>Creating fake or misleading influencer accounts.</li>
            <li>Posting or promoting illegal, abusive, or harmful content.</li>
            <li>Engaging in spam, scams, or fraudulent activity.</li>
            <li>Promoting gambling, drugs, weapons, or adult/explicit content.</li>
            <li>Attempting to hack, disrupt, or misuse the platform.</li>
            <li>Impersonating another person or brand.</li>
          </ul>
  
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Limitation of Liability</h2>
          <p className="text-gray-700 mb-6">
            Dumzoo is a <strong>connection platform only</strong>. We do not guarantee the success of
            collaborations between influencers and promoters. We are not responsible for any direct,
            indirect, or financial loss resulting from using the platform. Users must independently
            verify and communicate before entering into agreements.
          </p>
  
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Changes to These Terms</h2>
          <p className="text-gray-700 mb-6">
            We may update or modify these Terms of Service at any time. Updates will be posted on this
            page with a new "Last Updated" date. Continued use of the platform means you accept the
            updated terms.
          </p>
  
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Contact Us</h2>
          <p className="text-gray-700">
            If you have any questions about these Terms, please contact us at: <br />
            📧 <a href="mailto:support@dumzoo.com" className="text-green-600 hover:underline">
              support@dumzoo.com
            </a>
          </p>
        </div>
      </div>
      </>

    );
  }