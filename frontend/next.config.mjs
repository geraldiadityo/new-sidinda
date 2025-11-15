/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    generateBuildId: async () => {
        if(process.env.GIT_HASH){
            return process.env.GIT_HASH
        }

        return `build-${new Date().toISOString().slice(0,13)}`
    },
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
