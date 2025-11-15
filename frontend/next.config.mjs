/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    async rewrites(){
        const backendUrl = process.env.INTERNAL_BACKEND_API_URL;
        
        if(!backendUrl){
            console.warn('INTERNAL BACKEND API URL is not set');
            return [];
        }

        return [
            {
                source: '/api/proxy/:path*',
                destination: `${backendUrl}/:path*`
            }
        ]
    },
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'no-store, must-revalidate'
                    }
                ]
            },
            {
                source: '/_next/static/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
                    }
                ]
            }
        ]
    }
};

export default nextConfig;
