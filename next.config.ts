import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "bulnxckpavpizqaddzkf.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      // TAMBAHKAN INI UNTUK GOOGLE AVATAR
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
    ],
  },
  allowedDevOrigins: ["dash-bullion-daffodil.ngrok-free.dev"],
};

export default nextConfig;
