import { axiosUse } from "@/lib/axiosFucn"
export async function login(credentials: { username: string, password: string }) {
    try {
        const res = await axiosUse.post(`/api/auth/login`, credentials);
        const resData = res.data;
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