import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    
    // Handle MetaMask SDK dependencies
    config.resolve.fallback = {
      ...config.resolve.fallback,
      '@react-native-async-storage/async-storage': false,
      'react-native': false,
      'fs': false,
      'net': false,
      'tls': false,
    };

    // Ignore specific modules that cause warnings
    config.resolve.alias = {
      ...config.resolve.alias,
      '@react-native-async-storage/async-storage': false,
    };
    
    return config;
  },
  transpilePackages: ['@rainbow-me/rainbowkit'],
};

export default nextConfig;
