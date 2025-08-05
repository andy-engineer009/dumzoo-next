import { setIsLoggedIn } from "@/store/userRoleSlice";

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
        localStorage.removeItem('user');
        if (dispatch) {
            dispatch(setIsLoggedIn(false));
        }
    }
}

export { setVerfiedUser };