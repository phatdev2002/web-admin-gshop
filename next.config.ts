import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "res.cloudinary.com",
      "i.pinimg.com",
      "scontent.xx.fbcdn.net",
      "platform-lookaside.fbsbx.com",
    ],
  },
};

export default nextConfig;
