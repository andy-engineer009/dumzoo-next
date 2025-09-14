import { logout, setIsInfluencerRegistered, setIsLoggedIn, setUserRole } from "@/store/userRoleSlice";
import CryptoJS from 'crypto-js';

// Encryption configuration
const ENCRYPTION_KEY = 'DumZoo2024SecureKey!@#$%^&*()'; // Strong encryption key
const ENCRYPTION_IV = 'DumZoo2024IV1234'; // Initialization Vector

// CryptoJS Encrypt function
const encrypt = (data: any): string => {
  try {
    // Convert object to string if it's not already a string
    const dataString = typeof data === 'string' ? data : JSON.stringify(data);
    
    const encrypted = CryptoJS.AES.encrypt(dataString, ENCRYPTION_KEY, {
      iv: CryptoJS.enc.Utf8.parse(ENCRYPTION_IV),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
  } catch (error) {
    console.error('Encryption error:', error);
    return typeof data === 'string' ? data : JSON.stringify(data); // Return original data if encryption fails
  }
};

// CryptoJS Decrypt function
const decrypt = (encryptedData: string): string => {
  try {
    console.log('Decrypting data with length:', encryptedData.length);
    console.log('Encrypted data preview:', encryptedData.substring(0, 50) + '...');
    
    const decrypted = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY, {
      iv: CryptoJS.enc.Utf8.parse(ENCRYPTION_IV),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    
    const result = decrypted.toString(CryptoJS.enc.Utf8);
    console.log('Decryption result length:', result.length);
    console.log('Decryption result preview:', result.substring(0, 100));
    
    return result;
  } catch (error) {
    console.error('Decryption error:', error);
    console.error('Encrypted data that failed:', encryptedData);
    return ''; // Return empty string if decryption fails
  }
};

// Helper function to decrypt and parse JSON objects
const decryptObject = (encryptedData: any): any => {
  try {
    // If encryptedData is null, undefined, or empty, return null
    if (!encryptedData) {
      return null;
    }
    
    // If it's already an object, return as is
    if (typeof encryptedData === 'object') {
      return encryptedData;
    }
    
    // If it's a string, determine if it's encrypted or plain JSON
    if (typeof encryptedData === 'string') {
      // Check if it looks like encrypted data (CryptoJS format starts with "U2FsdGVkX1")
      if (encryptedData.startsWith('U2FsdGVkX1') || (encryptedData.includes('=') && encryptedData.length > 50)) {
        // It's encrypted data, decrypt it
        try {
          console.log('Attempting to decrypt data...');
          const decryptedString = decrypt(encryptedData);
          console.log('Decrypted string:', decryptedString);
          
          if (decryptedString && decryptedString.length > 0) {
            try {
              return JSON.parse(decryptedString);
            } catch (parseError) {
              console.error('JSON parsing failed after decryption:', parseError);
              console.error('Decrypted string that failed to parse:', decryptedString);
              // Clear corrupted data
              localStorage.removeItem('browserCache');
              return null;
            }
          } else {
            console.error('Decryption returned empty string');
            // Clear corrupted data
            localStorage.removeItem('browserCache');
            return null;
          }
        } catch (decryptError) {
          console.error('Decryption failed:', decryptError);
          // Clear corrupted data
          localStorage.removeItem('browserCache');
          return null;
        }
      } else {
        // It's plain JSON, parse directly
        try {
          return JSON.parse(encryptedData);
        } catch (jsonError) {
          console.error('JSON parsing failed:', jsonError);
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error('Decrypt object error:', error);
    // Clear corrupted data
    localStorage.removeItem('browserCache');
    return null;
  }
};

const setVerfiedUserV2 = (data: any, dispatch?: any) => {  
    // console.log(data, 'data')
    // console.log(data.user.role_id, 'role_id')
    if(data?.token) {
        // Original localStorage operations (unchanged)
        // localStorage.setItem('token', data.token);
        // localStorage.setItem('activeUser', JSON.stringify(parseJwt(data.token)));
        // localStorage.setItem('isLoggedIn', 'true');
        // localStorage.setItem('userRole', data.user.role_id.toString());
        // localStorage.setItem('is_new_user', data.is_new_user);
        // localStorage.setItem('isInfluencerRegistered', data.user?.is_influencer_profile_created == 1 ? 'true' : 'false');
        localStorage.setItem('referral_code', data.user?.referral_code );
        
        // Create a single object containing all localStorage data (shallow copy)
        const allLocalStorageData = {
            token: data.token,
            activeUser: parseJwt(data.token),
            isLoggedIn: 'true',
            userRole: data.user.role_id.toString(),
            is_new_user: data.is_new_user,
            isInfluencerRegistered: data.user?.is_influencer_profile_created == 1 ? 'true' : 'false',
            referral_code: data.user?.referral_code || '',
        };
        
        // Store the single object as a copy (for reference/backup)
        localStorage.setItem('browserCache', encrypt(allLocalStorageData));
        
        if (dispatch) {
            dispatch(setIsLoggedIn(true));
            dispatch(setUserRole(data.user.role_id.toString()));
            dispatch(setIsInfluencerRegistered(data.user?.is_influencer_profile_created == 1 ? true : false));
        }
    } else{
        // Clear all data on logout
        localStorage.removeItem('token');
        localStorage.removeItem('activeUser');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userRole');
        localStorage.removeItem('is_new_user');
        localStorage.removeItem('isInfluencerRegistered');
        localStorage.removeItem('referral_code');
        localStorage.removeItem('browserCache');
        
        if (dispatch) {
            dispatch(logout());
        }
    }
}


//decode jwt
const parseJwt = (token: any) => {
    if (!token) return null;
  
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
  
    console.log(jsonPayload, 'jsonPayload')
    return JSON.parse(jsonPayload);
  }
//encryptData
// const encryptData = (data: any) => {
//     const encryptedData = atob(data);
//     return encryptedData;
// }

// //decryptData
// const decryptData = (data: any) => {
//     const decryptedData = btoa(data);
//     return decryptedData;
// }

// Helper functions to work with the single localStorage object
const getAllLocalStorageData = (): any => {
  try {
    const encryptedData = localStorage.getItem('browserCache');
    console.log('browserCache data:', encryptedData);
    
    if (!encryptedData) {
      console.log('No data found in browserCache, checking all localStorage keys...');
      // Check what keys exist in localStorage
      const allKeys = Object.keys(localStorage);
      console.log('All localStorage keys:', allKeys);
      
      // Look for any encrypted data in other keys
      for (const key of allKeys) {
        const value = localStorage.getItem(key);
        if (value && value.startsWith('U2FsdGVkX1')) {
          console.log(`Found encrypted data in key: ${key}`);
          const result = decryptObject(value);
          if (result) {
            console.log('Successfully decrypted data from key:', key);
            return result;
          }
        }
      }
      
      return null;
    }
    
    const result = decryptObject(encryptedData);
    console.log('Decrypted result:', result);
    return result;
  } catch (error) {
    console.error('Error getting all localStorage data:', error);
    // Clear corrupted data
    localStorage.removeItem('browserCache');
    return null;
  }
};

const getTokenFromObject = (): string => {
  const data = getAllLocalStorageData();
//   console.log('Token from encrypted object:', data?.token);
  
  // If no encrypted data, fallback to individual localStorage keys
  if (!data?.token) {
    // console.log('No token in encrypted object, checking individual localStorage keys...');
    const token = localStorage.getItem('token');
    // console.log('Token from localStorage:', token);
    return token || '';
  }
  
  return data.token;
};


const getActiveUserFromObject = (): any => {
  const data = getAllLocalStorageData();
  return data?.activeUser || null;
};

const getUserRoleFromObject = (): string => {
  const data = getAllLocalStorageData();
  return data?.userRole || '';
};

const getIsLoggedInFromObject = (): string => {
  const data = getAllLocalStorageData();
  console.log(data?.isLoggedIn, 'isLoggedIn dsjksdsdsd sdjsddsjsdjkdjskjksdsdjkjk')
  return data?.isLoggedIn || '';
};

// const isLoggedInFromObject = (): boolean => {
//   const data = getAllLocalStorageData();
//   return data?.isLoggedIn === 'true';
// };

const clearAllLocalStorageData = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('activeUser');
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('userRole');
  localStorage.removeItem('is_new_user');
  localStorage.removeItem('isInfluencerRegistered');
  localStorage.removeItem('referral_code');
  localStorage.removeItem('browserCache');
};

// Function to clear corrupted data and reset
const clearCorruptedData = (): void => {
  console.log('Clearing corrupted localStorage data...');
  clearAllLocalStorageData();
  console.log('Corrupted data cleared. Please login again.');
};

// Function to check localStorage state
const checkLocalStorageState = (): void => {
  console.log('=== LocalStorage State Check ===');
  const allKeys = Object.keys(localStorage);
  console.log('All localStorage keys:', allKeys);
  
  allKeys.forEach(key => {
    const value = localStorage.getItem(key);
    console.log(`${key}:`, value ? (value.length > 100 ? value.substring(0, 100) + '...' : value) : 'null');
  });
  
  console.log('=== End LocalStorage State Check ===');
};

export { 
  setVerfiedUserV2, 
  getAllLocalStorageData,
  getTokenFromObject,
  getActiveUserFromObject,
  getUserRoleFromObject,
  getIsLoggedInFromObject,
//   isLoggedInFromObject,
  clearAllLocalStorageData,
  clearCorruptedData,
  checkLocalStorageState,
  encrypt,
  decrypt,
  decryptObject
};