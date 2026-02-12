// @ts-ignore
import withPWA from "next-pwa";

const nextConfig = {
  turbopack: {},
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default withPWA({
  dest: 'public',
  disable: false,
  register: true,
  skipWaiting: true,
})(nextConfig);