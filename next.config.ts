import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  siteUrl: 'https://sitespulse.babandeep.in',
  generateRobotsTxt: true,

};

export default nextConfig;
