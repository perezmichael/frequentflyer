/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'wnctowqvjmmkivptmgfr.supabase.co',
      'lh3.googleusercontent.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'wnctowqvjmmkivptmgfr.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
    ],
  }
}

module.exports = nextConfig 