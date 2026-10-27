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
  // The old site's News section lives on as the blog, under the same
  // post slugs: /nyheter/<slug> (Swedish) and /en/nyheter/<slug>.
  async redirects() {
    // Webflow saved Adsum's post under Höglandets' slug with "-2"; it
    // has its own slug now (scripts/import-blog-posts.ts).
    const adsum = 'adsum-revision-valjer-senseworks-revision'
    return [
      // A bare locale goes to that language's home page, as the root does.
      { source: '/en', destination: '/en/home', permanent: false },
      { source: '/sv', destination: '/sv/home', permanent: false },
      { source: '/nyheter/hoglandets-revisionsbyra-valjer-senseworks-revision-2', destination: `/sv/blog/${adsum}`, permanent: true },
      { source: '/en/nyheter/hoglandets-revisionsbyra-valjer-senseworks-revision-2', destination: `/en/blog/${adsum}`, permanent: true },
      { source: '/nyheter', destination: '/sv/blog', permanent: true },
      { source: '/nyheter/:slug', destination: '/sv/blog/:slug', permanent: true },
      { source: '/en/nyheter', destination: '/en/blog', permanent: true },
      { source: '/en/nyheter/:slug', destination: '/en/blog/:slug', permanent: true },
    ]
  },
};

export default nextConfig;
