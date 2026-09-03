import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { documentInternationalization } from '@sanity/document-internationalization'
import { schemaTypes } from './src/sanity/schemaTypes'

// projectId/dataset are public, non-secret identifiers (not API
// tokens), so a literal fallback is safe here. The fallback exists
// because `npx sanity dev`'s standalone Vite tooling does not read
// Next.js's NEXT_PUBLIC_* vars from .env.local the way `next dev`
// does — only `next build`/`next dev` reliably pick those up.
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'rm507cjs'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

export default defineConfig({
  name: 'default',
  title: 'Senseworks Web Block Library',
  projectId,
  dataset,
  basePath: '/studio',
  plugins: [
    structureTool(),
    visionTool(),
    // D12: en is the default/base locale; sv is the second locale.
    documentInternationalization({
      supportedLanguages: [
        { id: 'en', title: 'English' },
        { id: 'sv', title: 'Swedish' },
      ],
      schemaTypes: ['page'],
      languageField: 'language',
    }),
  ],
  schema: { types: schemaTypes },
})
