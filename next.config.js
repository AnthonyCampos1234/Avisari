/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    env: {
        ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
    },
}

module.exports = {
    ...nextConfig,
    // Disable the default server
    useFileSystemPublicRoutes: false,
}