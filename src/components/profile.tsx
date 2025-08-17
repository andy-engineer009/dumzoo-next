'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import { logout, selectUserRole, setUserRole, selectIsLoggedIn, setIsLoggedIn } from '@/store/userRoleSlice';
import { useSelector, useDispatch } from 'react-redux';
import LoginPopup from './login-popup';
import ConfirmationPopup from './confirmation-popup';
import ProfileProgressCard from './influencer/ProfileprogressCard';

// Mock API functions (replace with real API calls)
const fetchUserProfile = async () => {
  // Simulate API call
  return {
    name: 'Andy Lexsian',
    email: 'andy@example.com',
    bio: 'Content Creator & Influencer',
    image: '/profile.jpg',
    location: 'Uttar Pradesh, India',
    // ...other fields as per your form
  };
};

const Profile = () => {
  const dispatch = useDispatch();
const role = useSelector(selectUserRole);
const isLoggedIn = useSelector(selectIsLoggedIn);

const [initialValues, setInitialValues] = useState<any>(null);
const [loading, setLoading] = useState(true);
const [image, setImage] = useState<string | null>(null);
// const [updating, setUpdating] = useState(false);
const currentUserRole = useAppSelector(selectUserRole);

// Confirmation Popup
const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  const router = useRouter();

    const progressData = {
    completedSteps: 2,
    totalSteps: 3,
    progressPercentage: (2 / 3) * 100,
    title: "Profile Progress"
  };

  useEffect(() => {
    fetchUserProfile().then((data) => {
      setInitialValues(data);
      setImage(data.image);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
console.log('mak') 
 }, [useSelector(selectUserRole)]);

  // const handleImageDelete = async () => {
  //   setUpdating(true);
  //   await deleteProfileImage();
  //   setImage(null);
  //   setUpdating(false);
  // };

  // const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files && e.target.files[0]) {
  //     setUpdating(true);
  //     const res = await uploadProfileImage(e.target.files[0]);
  //     setImage(res.url);
  //     setUpdating(false);
  //   }
  // };

  // const handleSubmit = async (values: any) => {
  //   setUpdating(true);
  //   await updateUserProfile({ ...values, image });
  //   setUpdating(false);
  //   alert('Profile updated!');
  // };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white border-b border-gray-200 pr-4 py-3">
        <div className="flex items-center justify-center relative">
          <button 
            onClick={() => router.push('/')}
            className="p-2 rounded-full hover:bg-gray-100 absolute left-0 top-1/2 -translate-y-1/2"
          >
            <svg className="w-5 h-5" fill="none" stroke="#ccc" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-medium text-gray-900">Profile Settings</h1>
        </div>
      </header>

      {/* Main Content */}
    {true && (

      <main className="pb-20">
        {/* {currentUserRole === '2' && (
        <div className="px-4 py-3">
          <ProfileProgressCard data={progressData} />
          </div>
        )} */}
        {/* Profile Overview Section */}
        {/* <section className="px-4 pt-4 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900">{initialValues?.name || 'Andy Lexsian'}</h2>
        
            </div>

          </div>
        </section> */}

        {/* Settings Sections */}
        <div className="px-4 py-2">
        {
            currentUserRole === '3' &&
             <div className="mb-0">
                      <button 
                onClick={() => router.push('/profile/edit')}
                className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-gray-900 font-medium">Manage Campaigns</span>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <button 
                onClick={() => router.push('/plans')}
                className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="text-gray-900 font-medium">Manage Subscription</span>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              
            </div>
        }

          {/* Influencer Profile Section */}
          {
            currentUserRole === '2' && 
          <div className="mb-0">
            {/* <h3 className="text-sm font-medium text-gray-500 mb-3">Influencer Profile</h3> */}
            <div className="space-y-1">
            {/* <h3 className="text-sm font-medium text-gray-500 mb-3">General</h3> */}

            {/* { currentUserRole == '2' && ( <> */}
              
              <button 
                onClick={() => router.push('/profile/edit')}
                className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-gray-900 font-medium">Edit Profile</span>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <button 
                onClick={() => router.push('/profile/view')}
                className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-gray-900 font-medium">View Profile</span>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors" onClick={() => router.push('/plans')}>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="text-gray-900 font-medium">Manage Subscription</span>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors" onClick={() => router.push('/analytics')}>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="text-gray-900 font-medium">Analytics</span>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
          }


          {/* Account Actions */}
          <div className="mb-6">
            {/* <h3 className="text-sm font-medium text-gray-500 mb-3">Account</h3> */}
            <div className="space-y-1">
              <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-900 font-medium">Help & Support</span>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-blue-50 transition-colors" onClick={() => router.push('/how')}>
                   <div className="flex items-center gap-3">
                     <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                     </svg>
                     <span className="text-blue-600 font-medium">How it works</span>
                   </div>
                   <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                   </svg>
                 </button>
                 
              {/* {localStorage.getItem('token') ? ( */}
                <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-red-50 transition-colors" onClick={() => {
                  setIsConfirmationOpen(true);
                }}>
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span className="text-red-600 font-medium">Logout</span>
                  </div>
                  <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              {/* )  */}
             
      
             
            </div>
          </div>
        </div>
      </main>
      
      ) 
    }

<ConfirmationPopup
  isOpen={isConfirmationOpen}
  onClose={() => setIsConfirmationOpen(false)}
  onConfirm={() => {
    dispatch(logout());
    dispatch(setIsLoggedIn(false));
    dispatch(setUserRole('3'));
    router.push('/');
  }}
  title="logout"
  subtitle="Are you sure you want to logout."
  confirmText="Logout"
  cancelText="Cancel"
></ConfirmationPopup>

      {/* <LoginPopup /> */}
    </div>
  );
};

export default Profile;
