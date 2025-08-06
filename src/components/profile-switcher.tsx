'use client'
import { useDispatch, useSelector } from "react-redux";
import { selectUserRole, setUserRole } from "@/store/userRoleSlice";

const ProfileSwitcher = () => {
    const dispatch = useDispatch();
    const currentUserRole = useSelector(selectUserRole);

    return (
        <>
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
     </>
    )
}

export default ProfileSwitcher;