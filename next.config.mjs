/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        // ❌ Faz com que erros de lint não quebrem a build
        ignoreDuringBuilds: true,
    },
};

export default nextConfig;
