import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The floating dev badge sits over the hero; this page gets screenshotted
  // and demoed live, so keep the viewport showing only the page.
  devIndicators: false,
};

export default nextConfig;
