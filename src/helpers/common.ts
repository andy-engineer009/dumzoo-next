import { logout, setIsLoggedIn, setUserRole } from "@/store/userRoleSlice";

const setVerfiedUser = (data: any, dispatch?: any) => {  
    console.log(data, 'data')
    if(data?.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('is_new_user', data.is_new_user);
        // localStorage.setItem('role', data.role);
        localStorage.setItem('isLoggedIn', 'true');
        if (dispatch) {
            dispatch(setIsLoggedIn(true));
        }
    } else{
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        localStorage.removeItem('is_new_user');
        localStorage.removeItem('isLoggedIn');

        if (dispatch) {
            // dispatch(setIsLoggedIn(false));
            dispatch(logout());
        }
    }
}

const setVerfiedUserV2 = (data: any, dispatch?: any) => {  
    console.log(data, 'data')
    if(data?.token) {

        localStorage.setItem('token', data.token);
        localStorage.setItem('isLoggedIn', 'true');


        localStorage.setItem('google_cache', data.token);
        localStorage.setItem('cto_bundle',  data.role);
        localStorage.setItem('WZRK_LR', 'true');
        localStorage.setItem('is_new_user', data.is_new_user);
        if (dispatch) {
            dispatch(setIsLoggedIn(true));
            dispatch(setUserRole(data.role));
        }
    } else{
        if (dispatch) {
            dispatch(logout());
        }
    }
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

export { setVerfiedUser, setVerfiedUserV2 };