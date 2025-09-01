'use client';
import { useEffect } from "react";
import { setIsLoggedIn, setUserRole, logout, setIsInfluencerRegistered } from "@/store/userRoleSlice";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useLogoutListener } from "@/hooks/useLogoutListener";

export default function LocalStorageValueHandler() {
    const dispatch = useDispatch();
    const router = useRouter();
    
    // Listen for logout events from API service
    useLogoutListener();
    
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
        console.log(user_role);
        if(user_role == '2'){
            dispatch(setUserRole('2'));
        } else if(user_role == '3'){
            dispatch(setUserRole('3'));
        }else{
            dispatch(setUserRole('3'));
        }

        const isInfluencerRegistered = localStorage.getItem('isInfluencerRegistered');
        if(isInfluencerRegistered == 'true'){
            dispatch(setIsInfluencerRegistered(true));
        }else{
            dispatch(setIsInfluencerRegistered(false));
        }

    }, [dispatch]);

    return <div />;
}