import type { NextConfig } from "next";

// The old Webflow site served Swedish at the root (/pris) and English
// under /en (/en/pris). The new site has both under a locale, mostly
// with the same slugs, so the English addresses already work; these
// send the old Swedish ones, and the pages that moved, to their new home.
// Every one is permanent, so search engines move the old page's ranking
// across. Pages with no new home yet aren't here (see the launch
// checklist's old-to-new page list).
const SAME_SLUG = [
  'pris',
  'om-oss',
  'kontakta-oss',
  'datasakerhet',
  'produkter/revision',
  'produkter/analys',
  // The legal pages.
  'villkor',
  'allmanna-villkor',
  'integritetspolicy',
  'kakpolicy',
  'personuppgiftsbitradesavtal',
]
// Old Knowledge Center articles renamed on the way over, or not brought across.
const RENAMED_ARTICLES: Record<string, string> = {
  'best-practice-for-revisionsanvandare': 'navigera-som-ett-proffs-revisionsanvandare',
  'hur-arbetar-vi-med-den-nya-navigeringen-som-analysanvandare': 'navigera-som-ett-proffs-analysanvandare',
}
const DROPPED_ARTICLES = ['bank-mot-huvudbok']
// Old customer pages → their customer stories.
const CLIENTS: Record<string, string> = {
  'adsum-revision': 'adsum-revision',
  hoglandet: 'hoglandets-revisionsbyra',
  warmare: 'warmare',
}
// Both languages: Swedish at the old root, English under /en.
const bothLanguages = (from: string, to: string) => [
  { source: from, destination: `/sv${to}`, permanent: true },
  { source: `/en${from}`, destination: `/en${to}`, permanent: true },
]
const WEBFLOW_REDIRECTS = [
  ...SAME_SLUG.map((slug) => ({ source: `/${slug}`, destination: `/sv/${slug}`, permanent: true })),
  // The old second terms hub → the one overview.
  ...bothLanguages('/vara-villkor', '/villkor'),
  ...bothLanguages('/kunskapscenter', '/knowledge-bank'),
  ...bothLanguages('/kunskapscenter-kategorier/:category', '/knowledge-bank'),
  ...Object.entries(RENAMED_ARTICLES).flatMap(([from, to]) => bothLanguages(`/kunskapscenter/${from}`, `/knowledge-bank/${to}`)),
  ...DROPPED_ARTICLES.flatMap((slug) => bothLanguages(`/kunskapscenter/${slug}`, '/knowledge-bank')),
  // After the specific ones above: every other article kept its slug.
  ...bothLanguages('/kunskapscenter/:slug', '/knowledge-bank/:slug'),
  ...Object.entries(CLIENTS).flatMap(([from, to]) => bothLanguages(`/clients/${from}`, `/customer-stories/${to}`)),
]

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
      ...WEBFLOW_REDIRECTS,
    ]
  },
};

export default nextConfig;
