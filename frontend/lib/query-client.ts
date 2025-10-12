import { QueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // kapan perlu refresh data
            staleTime: 5 * 60 * 1000, // 5 menit
            // lama data di cache
            gcTime: 10 * 60 * 1000, // 10 menit
            retry: (failureCount, error) => {
                if(error instanceof AxiosError && error.status && error.status >= 400 && error.status < 500){
                    return false
                }
                return failureCount < 3
            },
            refetchOnWindowFocus: false,
            refetchOnReconnect: true
        },
        mutations: {
            onError: () => {
                alert('Terjadi sebuah kesalahan')
            }
        }
    }
});
