/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // Development optimizations
  experimental: {
    optimizePackageImports: ['thirdweb', '@thirdweb/react', 'framer-motion'],
  },
  // Exclude large files from watching to improve Fast Refresh performance
  // Note: watchOptions.ignored is not a valid Next.js config option
  // Use .gitignore or .nextignore instead for file exclusions
  images: {
    unoptimized: true,
    qualities: [75, 80, 85, 90, 95],
  },
  webpack: (config, { isServer, dev }) => {
    // Optimize for thirdweb wallet chunks
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };

      // Optimize for development performance
      if (dev) {
        config.optimization.splitChunks = {
          chunks: 'all',
          cacheGroups: {
            default: {
              minChunks: 1,
              priority: -20,
              reuseExistingChunk: true,
            },
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              priority: -10,
              chunks: 'all',
              maxSize: 500000,
            },
            thirdweb: {
              test: /[\\/]node_modules[\\/](thirdweb|@thirdweb)[\\/]/,
              name: 'thirdweb',
              priority: 10,
              chunks: 'all',
            },
          },
        };
      } else {
        // Production optimization
        config.optimization.splitChunks = {
          chunks: 'all',
          cacheGroups: {
            default: {
              minChunks: 2,
              priority: -20,
              reuseExistingChunk: true,
            },
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              priority: -10,
              chunks: 'all',
              maxSize: 244000,
            },
          },
        };
      }
    }
    return config;
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Security headers for protection
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains'
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' *.vercel.app *.vercel-scripts.com *.thirdweb.com *.walletconnect.org; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: *.ipfs.io *.thirdweb.com *.euc.li; connect-src 'self' *.thirdweb.com *.walletconnect.org *.base.org *.euc.li https://euc.li wss:; frame-src 'self' *.walletconnect.org;"
          }
        ]
      },
      {
        source: '/provenance/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      }
    ]
  }
}

export default nextConfig
