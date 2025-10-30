"use client";

import { store, persistor } from "@/lib/store/store";
import { useEffect, useState } from "react";
import { Provider } from 'react-redux';
import { PersistGate } from "redux-persist/integration/react";

const LoadingFallback = () => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <p>Loading...</p>
    </div>
)

export function ReduxProvider({ children }: { children: React.ReactNode }) {
    const [isClient, setIsClient] = useState(false);
    
    useEffect(() => {
        setIsClient(true);
        console.log("ReduxProvider: Client detected.");
    }, []);

    if (!isClient) {
        console.log("ReduxProvider: Rendering fallback (not client yet).");
        return <LoadingFallback />;
    }
    
    return (
        <Provider store={store}>
            <PersistGate loading={<LoadingFallback />} persistor={persistor}>
                {children}
            </PersistGate>
        </Provider>
    )
}