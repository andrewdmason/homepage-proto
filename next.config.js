module.exports = {
  images: {
    domains: ['hebbkxlanhila5yf.public.blob.vercel-storage.com', 'images.unsplash.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hebbkxlanhila5yf.public.blob.vercel-storage.com',
        port: '',
        pathname: '/image-**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // ... rest of your config ...
} 