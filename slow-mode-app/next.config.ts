import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // Configuration pour le build standalone optimisé en production
  output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined,
  // Optimisations pour la performance
  experimental: {
    // Optimisation du bundle
    optimizePackageImports: ['react', 'react-dom'],
  },
};

export default nextConfig;
