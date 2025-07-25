import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* Performance optimizations */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Performance optimizations
  poweredByHeader: false,
  compress: true,
  
  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000, // 1 year
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.jsdelivr.net',
        port: '',
        pathname: '/**',
      },
    ],
  },
  
  // Bundle analyzer and performance
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  
  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    // Production optimizations
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
            },
          },
        },
      };
    }
    
    return config;
  },
};

export default nextConfig;
