/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['firebasestorage.googleapis.com'],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
      };
    }
    
    // Handle Firebase and undici compatibility issues
    config.module.rules.push({
      test: /\.m?js$/,
      resolve: {
        fullySpecified: false,
      },
    });

    // Exclude problematic modules from bundling
    config.externals = config.externals || [];
    if (isServer) {
      config.externals.push({
        'undici': 'undici',
        'node:crypto': 'crypto',
        'node:stream': 'stream',
      });
    }

    return config;
  },
  experimental: {
    esmExternals: 'loose',
  },
  transpilePackages: ['@firebase/auth', '@firebase/firestore', '@firebase/storage'],
}

module.exports = nextConfig 