import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    // Ensure Next.js treats the frontend folder as the app root
    root: path.join(__dirname),
  },
};

export default nextConfig;
