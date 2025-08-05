import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the possible user roles
export type UserRole = '2' | '3' | null;

// Define the state interface
export interface UserRoleState {
  role: UserRole;
  hasVisitedBefore: boolean | null;
  isLoggedIn: boolean | null;
}

const initialState : UserRoleState = {
  role: null,
  hasVisitedBefore: null,
  isLoggedIn: false
}

// Get initial state from localStorage
// const getInitialState = (): UserRoleState => {
//   // Check if user has visited before
//   const hasVisitedBefore = localStorage.getItem('hasVisitedBefore') === 'true';
  
//   // Get user role from localStorage (convert '2' to 'influencer', '3' to 'business')
//   const storedRole = localStorage.getItem('userRole');
//   let role: UserRole = null;
  
//   if (storedRole === '2') {
//     role = '2';
//   } else if (storedRole === '3') {
//     role = '3';
//   }
  
//   return {
//     role,
//     hasVisitedBefore
//   };
// };

// Create the slice
const userRoleSlice = createSlice({
  name: 'userRole',
  initialState,
  reducers: {
    // Set user role and save to localStorage
    setUserRole: (state, action: PayloadAction<UserRole>) => {
      state.role = action.payload;
      
      // Save to localStorage (convert role to number format)
      if (action.payload === '2') {
        localStorage.setItem('userRole', '2');
      } else if (action.payload === '3') {
        localStorage.setItem('userRole', '3');
      } else {
        localStorage.removeItem('userRole');
      }
    },
    
    // Mark user as having visited and save to localStorage
    setHasVisitedBefore: (state, action: PayloadAction<boolean>) => {
      state.hasVisitedBefore = action.payload;
      
      // Save to localStorage
      if (action.payload) {
        localStorage.setItem('hasVisitedBefore', 'true');
      } else {
        localStorage.removeItem('hasVisitedBefore');
      }
    },

    // Set isLoggedIn and save to localStorage
    setIsLoggedIn: (state, action: PayloadAction<boolean>) => {
      state.isLoggedIn = action.payload;
      
      // Save to localStorage
      if (action.payload) {
        localStorage.setItem('isLoggedIn', 'true');
      } else {
        localStorage.removeItem('isLoggedIn');
      }
    },

    
    // Clear user role from localStorage
    clearUserRole: (state) => {
      state.role = null;
      localStorage.removeItem('userRole');
    },
    
    // Reset all user data (for logout or reset)
    resetUserData: (state) => {
      state.role = null;
      state.hasVisitedBefore = false;
      localStorage.removeItem('userRole');
      localStorage.removeItem('hasVisitedBefore');
    },

    // Logout
    logout: (state) => {
      state.role = null;
      state.isLoggedIn = false;
      localStorage.removeItem('token');
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('is_new_user');
    }
  }
});

// Export actions
export const { 
  setUserRole, 
  setHasVisitedBefore, 
  clearUserRole, 
  resetUserData,
  logout,
  setIsLoggedIn
} = userRoleSlice.actions;

// Export selectors
export const selectUserRole = (state: { userRole: UserRoleState }) => state.userRole.role;
export const selectHasVisitedBefore = (state: { userRole: UserRoleState }) => state.userRole.hasVisitedBefore;
export const selectIsLoggedIn = (state: { userRole: UserRoleState }) => state.userRole.isLoggedIn;

// Export reducer
export default userRoleSlice.reducer; 