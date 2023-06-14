/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: false,
  output: "standalone",
  publicRuntimeConfig: {
    backend_url: process.env.BACKEND_URL,
  }
}

module.exports = nextConfig
