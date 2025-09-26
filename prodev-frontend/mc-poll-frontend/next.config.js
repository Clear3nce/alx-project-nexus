/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export', // Enable static exports
    trailingSlash: true,
    images: {
      unoptimized: true // Required for static export
    },
    // If you're using dynamic routes, add this:
    // experimental: {
    //   appDir: true
    // }
  }
  
  module.exports = nextConfig