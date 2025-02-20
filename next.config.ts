import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.fbcdn.net" }, // Chấp nhận tất cả subdomain của Facebook
      { protocol: "https", hostname: "i.pinimg.com" }, // Thêm Pinterest
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
};

export default nextConfig;
