import { defineType, defineField } from 'sanity'

// The site's one header and footer, used on every page, customer story
// and article — edited here once rather than copied into each page.
// Their text is English/Swedish pairs like everything else. A page can
// switch to the landing-page variant (logo and button only, short
// footer) with its own "Navigation" setting.
// A singleton (one document, no list of them) — see the structure and
// the new-document/actions filters in sanity.config.ts.
export const siteNavigation = defineType({
  name: 'siteNavigation',
  title: 'Site navigation',
  type: 'document',
  fields: [
    defineField({ name: 'header', title: 'Header', type: 'headerBlock' }),
    defineField({ name: 'footer', title: 'Footer', type: 'footerBlock' }),
  ],
  preview: { prepare: () => ({ title: 'Site navigation' }) },
})
