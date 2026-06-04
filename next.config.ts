import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin'; // ← ADD this

const withNextIntl = createNextIntlPlugin(); // ← ADD this

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'plegpnicywzqrulpqedm.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default withNextIntl(nextConfig); // ← CHANGE this line (was `export default nextConfig`)
