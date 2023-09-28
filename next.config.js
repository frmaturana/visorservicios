/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    webpack: (config, _) => ({
      ...config,
      watchOptions: {
        ...config.watchOptions,
        poll: 800,
        aggregateTimeout: 300,
      },
    }),
  };
  
  module.exports = nextConfig;
  
