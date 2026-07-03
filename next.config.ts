import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cible de production : Render (Vercel = preview uniquement).
  output: "standalone",
};

export default nextConfig;
