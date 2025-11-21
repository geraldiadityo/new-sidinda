import { axiosUse } from "@/lib/axiosFucn"
export async function login(credentials: { username: string, password: string }): Promise<LoginResponse> {
    try {
        const res = await axiosUse.post(`/api/auth/login`, credentials);
        const resData = res.data;
        return resData
    } catch (err){
        throw err;
    }
}

export async function verify2Fa(data: { otp: string, tempToken: string }) {
    try {
        const res = await axiosUse.post('/api/auth/2fa/verify',
            { otp: data.otp },
            {
                headers: {
                    'Authorization': `Bearer ${data.tempToken}`
                }
            }
        );
        return res.data;
    } catch (err){
        throw err;
    }
}

export async function logoutFn() {
    try {
        const res = await axiosUse.post('/api/auth/logout',{});
        const resData = res.data;

        return resData;
    } catch (err){
        throw err;
    }
}