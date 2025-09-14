'use client';
import { useEffect } from "react";
import { setIsLoggedIn, setUserRole, logout, setIsInfluencerRegistered } from "@/store/userRoleSlice";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useLogoutListener } from "@/hooks/useLogoutListener";
import { getIsLoggedInFromObject,getAllLocalStorageData } from "@/helpers/common";

export default function LocalStorageValueHandler() {
    const dispatch = useDispatch();
    const router = useRouter();
    
    // Listen for logout events from API service
    useLogoutListener();
    
    useEffect(() => {
        // const isLoggedIn = localStorage.getItem('isLoggedIn');
        const data = getAllLocalStorageData();
        const isLoggedIn = data?.isLoggedIn;
        console.log(isLoggedIn, 'isLoggedIn')
        if (isLoggedIn == null || isLoggedIn === "false" || isLoggedIn === 'undefined') {
            dispatch(setIsLoggedIn(false));
        } else {
            dispatch(setIsLoggedIn(true));
        }

        const is_new_user = data?.is_new_user;
        if(is_new_user == '1'){
            router.push('/referral');
        }

        const user_role = data?.userRole;
        console.log(user_role);
        if(user_role == '2'){
            dispatch(setUserRole('2'));
        } else if(user_role == '3'){
            dispatch(setUserRole('3'));
        }else{
            dispatch(setUserRole('3'));
        }

        const isInfluencerRegistered = data?.isInfluencerRegistered;
        if(isInfluencerRegistered == 'true'){
            dispatch(setIsInfluencerRegistered(true));
        }else{
            dispatch(setIsInfluencerRegistered(false));
        }

    }, [dispatch]);

    return <div />;
}