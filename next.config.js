/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['stream.intuitv.app', 'api.intuitv.app'],
  },
  output: 'standalone',
}

module.exports = nextConfig
