import withPWA from 'next-pwa'
import withPlugins from 'next-compose-plugins'
/** @type {import('next').NextConfig} */
const baseConfig = {
  async headers() {
    return [
      {
        source: '/build/Build/:path*.br',
        headers: [
          {
            key: 'Content-Encoding',
            value: 'br',
          },
          {
            key: 'Content-Type',
            value: 'application/wasm',
          },
          {
            key: 'Content-Disposition',
            value: 'inline',
          },
        ],
      },
    ];
  },
  compiler: {
    styledComponents: true,
  },
  webpack(config) {
    // Grab the existing rule that handles SVG imports
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.('.svg'),
    )

    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // exclude if *.svg?url
        use: ['@svgr/webpack'],
      },
    )

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i

    return config
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};

const pwaPlugin = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  // disable: process.env.NODE_ENV === 'development',
})

const nextConfig = withPlugins([pwaPlugin], baseConfig)
export default nextConfig;
