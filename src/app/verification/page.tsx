'use client'
import ProfileLink from '@/components/instagram-profile-verfication/profile-link';

const InstagramVerificationPage = () => {
  const handleComplete = (data: any) => {
    console.log('Profile verification completed:', data);
    // Handle completion logic here
    // e.g., redirect to dashboard, show success message, etc.
  };

  return (
    <div className="min-h-screen">
      <ProfileLink onComplete={handleComplete} />
    </div>
  );
};

export default InstagramVerificationPage;
