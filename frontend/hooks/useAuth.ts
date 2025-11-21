"use client";

import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials, logout } from "@/lib/store/slice/authSlice";
import { persistor, RootState } from "@/lib/store/store";
import { useMutation } from "@tanstack/react-query";
import { login, logoutFn, verify2Fa } from "@/lib/actions/auth/auth";
import { toast } from "sonner";
import { parse } from 'cookie';

export const useLogin = () => {
    const dispatch = useDispatch();

    return useMutation({
        mutationFn: login,
        // onSuccess: () => {
        //     const rawCookies = document.cookie;
        //     const cookies = parse(rawCookies);
            
        //     if(cookies.user){
        //         try {
        //             const user = JSON.parse(decodeURIComponent(cookies.user));
        //             dispatch(setCredentials({ user: user }));
        //         } catch (err){
        //             console.log(`gagal parse cookies`);
        //         }
        //     }
        // }
    });
}

export const useVerifyOtp = () => {
    const dispatch = useDispatch();
    const router = useRouter();

    return useMutation({
        mutationFn: verify2Fa,
        onSuccess: () => {
            const rawCookies = document.cookie;
            const cookies = parse(rawCookies);

            if(cookies.user){
                try {
                    const user = JSON.parse(decodeURIComponent(cookies.user));
                    dispatch(setCredentials({ user: user }));
                    toast.success('success');
                    router.push('/');
                } catch (err){
                    console.log('gagal parse cookies');
                }
            }
        }
    })

}

export const useAuth = () => {
    const dispatch = useDispatch();
    const router = useRouter();

    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

    const { mutate: logoutMutate } = useMutation({
        mutationFn: logoutFn,
        onSuccess: async () => {
            dispatch(logout());
            persistor.pause();
            await persistor.flush();
            await persistor.purge();

            toast.success('logout success');
            router.push('/login');
        },
        onError: () => {
            toast.error('gagal logout');
        }
    });

    const logoutUser = () => {
        logoutMutate();
    }

    return { isAuthenticated, user, logout: logoutUser }
}