import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { documentInternationalization } from '@sanity/document-internationalization'
import { schemaTypes } from './src/sanity/schemaTypes'
import { structure } from './src/sanity/structure'

// projectId/dataset are public, non-secret identifiers (not API
// tokens), so a literal fallback is safe here. The fallback exists
// because `npx sanity dev`'s standalone Vite tooling does not read
// Next.js's NEXT_PUBLIC_* vars from .env.local the way `next dev`
// does — only `next build`/`next dev` reliably pick those up.
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'rm507cjs'
// SANITY_STUDIO_DATASET lets the standalone Studio (`npx sanity dev`,
// which only sees SANITY_STUDIO_* vars) open another dataset, e.g. a
// test copy.
const dataset = process.env.SANITY_STUDIO_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

export default defineConfig({
  name: 'default',
  title: 'Senseworks Web Block Library',
  projectId,
  dataset,
  basePath: '/studio',
  plugins: [
    structureTool({ structure }),
    visionTool(),
    // D12: en is the default/base locale; sv is the second locale.
    // Pages aren't here: they hold both languages side by side, field by
    // field (src/sanity/i18n/localizeSchema.ts). Articles and customer
    // stories are still one document per language, for now.
    documentInternationalization({
      supportedLanguages: [
        { id: 'en', title: 'English' },
        { id: 'sv', title: 'Swedish' },
      ],
      schemaTypes: ['article', 'customerStory'],
      languageField: 'language',
    }),
  ],
  schema: { types: schemaTypes },
  document: {
    // Book a meeting is a singleton: no "create new", and no way to
    // delete or duplicate the one that exists.
    newDocumentOptions: (prev) => prev.filter((option) => option.templateId !== 'bookMeetingSettings'),
    actions: (prev, { schemaType }) =>
      schemaType === 'bookMeetingSettings'
        ? prev.filter(({ action }) => action !== 'delete' && action !== 'duplicate' && action !== 'unpublish')
        : prev,
  },
})
