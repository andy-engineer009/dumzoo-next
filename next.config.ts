import withPWA from 'next-pwa';
import type { NextConfig } from 'next';

const baseConfig: NextConfig = {
  // async redirects() {
  //   return [
  //     {
  //       source: '/',
  //       destination: '/',  // redirect to your desired default page
  //       permanent: false,      // set to true for 308 permanent redirect
  //     },
  //   ]
  // },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'dumzoo.s3.ap-southeast-1.wasabisys.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.freepik.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

// Wrap with PWA plugin
const nextConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development', // disables service worker in dev
})(baseConfig);

export default nextConfig;
