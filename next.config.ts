import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (
    config,
    { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }
  ) => {
    if (config.cache && !dev) {
      config.cache = Object.freeze({
        type: 'memory',
      })
    }
    // Important: return the modified config
    return config
  },

  productionBrowserSourceMaps: false,
  experimental: {
    serverSourceMaps: false,
    preloadEntriesOnStart: false,
  }
};

export default nextConfig;
