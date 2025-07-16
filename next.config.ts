import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  allowedDevOrigins: ['local-origin.dev', '*.local-origin.dev'],
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  // compiler: {
  //   removeConsole: true,
  // },
  webpack: (config, {}) => {
    config.externals.push({
      '@supabase/realtime-js': 'commonjs @supabase/realtime-js',
    });

    config.module.rules.push({
      test: /realtime-js/,
      loader: 'ignore-loader',
    });

    return config;
  },
};

export default nextConfig;
