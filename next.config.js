/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['stream.intuitv.app', 'api.intuitv.app'],
  },
  // Add this for Netlify
  output: 'standalone',
}

module.exports = nextConfig
