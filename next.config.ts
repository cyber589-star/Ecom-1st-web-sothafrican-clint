import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_SUPABASE_URL: 'https://nwpcupjsynzwqwebsirj.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53cGN1cGpzeW56d3F3ZWJzaXJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3NjUwOTgsImV4cCI6MjA5NTM0MTA5OH0.Fgw6GVyal9QF1jnbbq4T-QzR5dTEMXSWNGBrJIE16IM',
    SUPABASE_SERVICE_ROLE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53cGN1cGpzeW56d3F3ZWJzaXJqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTc2NTA5OCwiZXhwIjoyMDk1MzQxMDk4fQ.RCCL-kfpkuYqtIabrtRskq7CIgrOHlrVv_dD-Hv4oN8',
    ADMIN_EMAIL: 'admin@pridepromart.com',
    ADMIN_PASSWORD: 'PrideProAdmin2025!',
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'plus.unsplash.com' },
      { protocol: 'https', hostname: 'nwpcupjsynzwqwebsirj.supabase.co' },
    ],
  },
};

export default nextConfig;
