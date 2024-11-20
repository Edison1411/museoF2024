/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  output: "standalone",
  productionBrowserSourceMaps: true,
  images: {
    // Dominios permitidos para cargar imágenes
    domains: ['drive.google.com', 'live.staticflickr.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'drive.google.com',
        port: '',
        pathname: '/**', // Ajuste para permitir rutas más amplias
      },
      {
        protocol: 'https',
        hostname: 'live.staticflickr.com',
        pathname: '/**', // Permite todas las rutas bajo este dominio
      },
    ],
  },
};

module.exports = nextConfig;
