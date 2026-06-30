import { withPayload } from '@payloadcms/next/withPayload'
import path from 'path'

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
    ],
  },
  // Packages with Cloudflare Workers (workerd) specific code
  // Read more: https://opennext.js.org/cloudflare/howtos/workerd
  serverExternalPackages: ['jose', 'pg-cloudflare'],

  // Your Next.js config here
  webpack: (webpackConfig: any, { isServer }: { isServer: boolean }) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    if (!isServer) {
      webpackConfig.resolve.fallback = {
        ...(webpackConfig.resolve.fallback || {}),
        worker_threads: false,
      }
      webpackConfig.resolve.alias = {
        ...(webpackConfig.resolve.alias || {}),
        '@payloadcms/plugin-cloud-storage/utilities$': path.resolve(
          process.cwd(),
          'src/shims/payloadCloudStorageUtilities.ts',
        ),
        'pino-abstract-transport': false,
        'pino-pretty': false,
      }
    }

    return webpackConfig
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
