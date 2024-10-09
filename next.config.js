/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  output: "standalone",
  productionBrowserSourceMaps: true,
  images: {
    domains: ['drive.google.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'drive.google.com',
        port: '',
        pathname: '/uc',
      },
      {
        protocol: 'https',
        hostname: 'live.staticflickr.com',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
