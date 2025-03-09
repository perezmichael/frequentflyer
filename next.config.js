/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['wnctowqvjmmkivptmgfr.supabase.co'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'wnctowqvjmmkivptmgfr.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig 