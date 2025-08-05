'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import { logout, selectUserRole, setUserRole, selectIsLoggedIn } from '@/store/userRoleSlice';
import { useSelector, useDispatch } from 'react-redux';
import LoginPopup from './login-popup';
 
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

  const router = useRouter();

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
        <div className="flex items-center justify-between">
          <button 
            onClick={() => router.push('/')}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-gray-900 mx-auto">Profile Settings</h1>
        </div>
      </header>

      {/* Main Content */}
    {isLoggedIn && (

      <main className="pb-20">
        {/* Profile Overview Section */}
        <section className="px-4 py-4 border-b border-gray-100">
          <div className="flex items-center gap-4">
            {/* Profile Picture */}
            {/* <div className="relative">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                {image ? (
                  <img 
                    src={image} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
              </div>
           <label className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-1 rounded-full cursor-pointer hover:bg-blue-600 transition-colors">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={updating}
                />
              </label> 
            </div> */}

            {/* User Info */}
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900">{initialValues?.name || 'Andy Lexsian'}</h2>
              <div className="flex items-center gap-1 text-gray-600 text-sm mt-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{initialValues?.location || 'Uttar Pradesh, India'}</span>
              </div>
            </div>

            {/* Edit Icon */}
            {/* <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button> */}
          </div>
        </section>

        {/* Settings Sections */}
        <div className="px-4 py-2">
          {/* Personal Info Section */}
          {/* <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 mb-3">Personal Info</h3>
            <div className="space-y-1">
              <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-gray-900 font-medium">My Address</span>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  <span className="text-gray-900 font-medium">Payment Method</span>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div> */}

          {/* Security Section */}
          {/* <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 mb-3">Security</h3>
            <div className="space-y-1">
              <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span className="text-gray-900 font-medium">Change Password</span>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span className="text-gray-900 font-medium">Forgot Password</span>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="text-gray-900 font-medium">Security</span>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.19 4.19A2 2 0 004 6v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-1.81 1.19z" />
                  </svg>
                  <span className="text-gray-900 font-medium">Notifications</span>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div> */}

          {/* General Section */}
          {/* <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 mb-3">General</h3>
            <div className="space-y-1">
              <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-900 font-medium">Language</span>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div> */}


{localStorage.getItem('token') && ( <>
          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="relative">
                <span className={`px-3 py-1.5 rounded-full text-sm ${
                  currentUserRole === '2' 
                    ? 'bg-[#6f43fe]/10 text-[#6f43fe] font-medium'
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  Influencer
                  {currentUserRole === '2' && (
                    <span className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 px-2 py-0.5 text-[10px] bg-green-100 text-green-600 font-medium rounded-full">
                      Active
                    </span>
                  )}
                </span>
              </div>

              <button
                onClick={() => {
                  const newRole = currentUserRole === '2' ? '3' : '2';
                  dispatch(setUserRole(newRole));
                }}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  currentUserRole === '2' ? 'bg-[#6f43fe]' : 'bg-[#6f43fe]'
                }`}
              >
                <span
                  className={`${
                    currentUserRole === '2' ? 'translate-x-0' : 'translate-x-5'
                  } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                />
              </button>

              <div className="relative">
                <span className={`px-3 py-1.5 rounded-full text-sm ${
                  currentUserRole === '3'
                    ? 'bg-[#6f43fe]/10 text-[#6f43fe] font-medium' 
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  Promoter
                  {currentUserRole === '3' && (
                    <span className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 px-2 py-0.5 text-[10px] bg-green-100 text-green-600 font-medium rounded-full">
                      Active
                    </span>
                  )}
                </span>
              </div>
            </div>
          </div>
          </>
          )}

          {/* Influencer Profile Section */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 mb-3">Influencer Profile</h3>
            <div className="space-y-1">
              { currentUserRole == '2' && ( <>
              
              <button 
                onClick={() => router.push('/profile/edit')}
                className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-gray-900 font-medium">Edit Influencer Profile</span>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors" onClick={() => router.push('/booster')}>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="text-gray-900 font-medium">Boost Profile</span>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              </>
              )}

            </div>
          </div>

          {/* Account Actions */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 mb-3">Account</h3>
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

              {/* {localStorage.getItem('token') ? ( */}
                <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-red-50 transition-colors" onClick={() => {
                  dispatch(logout());
                  router.push('/');
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
             
            </div>
          </div>
        </div>
      </main>
      ) 
      

      // : (
      //   <div className="p-8 text-center">
      //     <h1 className="text-2xl font-semibold text-gray-900 mb-4">Please login to continue</h1>
      //     <button className="bg-[#6f43fe] text-white px-4 py-2 rounded-lg hover:bg-[#6f43fe]/80 transition-colors" onClick={() => router.push('/login')}>
      //       Login
      //     </button>
      //   </div>
      // )
      }
      <LoginPopup />
    </div>
  );
};

export default Profile;
