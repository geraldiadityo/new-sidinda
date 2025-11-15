'use client';

import { useEffect } from "react";

export const UpgradeHandler = () => {
    useEffect(() => {
        const handler = (event: ErrorEvent) => {
            if (event.message && (
                event.message.includes('ChunkLoadError') ||
                event.message.includes('Loading chunk') ||
                event.message.includes('minified React error #423')
            )) {
                console.warn('Versi aplikasi baru terdeteksi, melakukan reload ....');
                event.preventDefault();

                window.location.reload();
            }
        };

        window.addEventListener('error', handler);

        return () => {
            window.removeEventListener('error', handler);
        }
    }, []);

    return null;
}