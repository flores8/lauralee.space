// next.config.ts
import withMDX from '@next/mdx';

const withMDXPlugin = withMDX({
  extension: /\.mdx?$/,
});

const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'mdx'],
  // You can add more config here if needed
};

export default withMDXPlugin(nextConfig);
