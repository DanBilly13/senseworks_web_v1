import { defineType, defineField } from 'sanity'

// English and Swedish side by side (not two separate documents via the
// internationalization plugin like pages/articles) — this is one small
// modal with a handful of strings, and seeing both languages next to
// each other in one place is easier to keep in step than two documents.
// A language left empty falls back to English, then to the copy
// hardcoded in BookMeetingModal.tsx.
function localized(
  name: string,
  title: string,
  options: { multiline?: boolean; description?: string } = {},
) {
  const type = options.multiline ? 'text' : 'string'
  return defineField({
    name,
    title,
    description: options.description,
    type: 'object',
    options: { columns: 2 },
    fields: [
      defineField({ name: 'en', title: 'English', type, ...(options.multiline ? { rows: 3 } : {}) }),
      defineField({ name: 'sv', title: 'Swedish', type, ...(options.multiline ? { rows: 3 } : {}) }),
    ],
  })
}

// A singleton (one document, no list of them) — see the structure and
// the new-document/actions filters in sanity.config.ts.
export const bookMeetingSettings = defineType({
  name: 'bookMeetingSettings',
  title: 'Book a meeting',
  type: 'document',
  fields: [
    localized('heading', 'Heading', { description: 'The big title at the top left of the modal.' }),
    localized('intro', 'Intro', { multiline: true }),
    defineField({
      name: 'contact',
      title: 'Contact person',
      description:
        'Picked from the team. Their photo and email are shown in the modal — which makes that email public, so only pick someone happy to be contacted directly. The email comes from their Team member entry.',
      type: 'reference',
      to: [{ type: 'teamMember' }],
    }),
    localized('contactTitle', 'Contact heading', {
      description: 'Written out by hand (e.g. "Kontakta Ian direkt") — it doesn’t change automatically if you pick someone else above.',
    }),
    localized('contactBody', 'Contact text', { multiline: true }),
    localized('submitLabel', 'Submit button label'),
    localized('thanksHeading', 'Thank-you heading', { description: 'Shown in place of the form after sending.' }),
    localized('thanksBody', 'Thank-you text', { multiline: true }),
  ],
  preview: {
    prepare: () => ({ title: 'Book a meeting' }),
  },
})
