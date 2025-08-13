'use client';
import { useEffect } from "react";
import { setIsLoggedIn, setUserRole } from "@/store/userRoleSlice";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";

export default function LocalStorageValueHandler() {
    const dispatch = useDispatch();
    const router = useRouter();
    
    useEffect(() => {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        if (isLoggedIn == null || isLoggedIn === "false") {
            dispatch(setIsLoggedIn(false));
        } else {
            dispatch(setIsLoggedIn(true));
        }

        const is_new_user = localStorage.getItem('is_new_user');
        if(is_new_user == '1'){
            router.push('/referral');
        }

        const user_role = localStorage.getItem('userRole');
        if(user_role == '2'){
            dispatch(setUserRole('2'));
        } else if(user_role == '3'){
            dispatch(setUserRole('3'));
        }else{
            dispatch(setUserRole(null));
        }

    }, [dispatch]);

    return <div />;
}