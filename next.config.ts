import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'cdn.sanity.io', pathname: '/images/**' }],
    // Every image is served at 85% quality (Next's default is 75, which
    // visibly softened screenshots and UI images with small text). Being
    // the only allowed value, it applies to every <Image> without each
    // one needing a quality prop.
    qualities: [85],
  },
};

export default nextConfig;
