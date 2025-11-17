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

    
    return (
        <Provider store={store}>
            <PersistGate loading={<LoadingFallback />} persistor={persistor}>
                {children}
            </PersistGate>
        </Provider>
    )
}