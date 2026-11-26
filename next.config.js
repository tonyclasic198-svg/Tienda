/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'jolzbrcbrqnazorrajnz.supabase.co' },
      { protocol: 'https', hostname: 'placehold.co' },
      { protocol: 'https', hostname: 'tercercanoneditores.com.mx' },
    ],
  },
};

module.exports = nextConfig;
