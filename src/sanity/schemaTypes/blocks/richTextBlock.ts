import { defineType, defineField } from 'sanity'
import { hiddenField } from '../fields/hiddenField'
import { spacingField } from '../fields/spacingField'

// Long-form text on a page: headings, paragraphs, lists, links, as in a
// Knowledge Bank article and read in the same text column. Made for the
// legal pages (terms, privacy, cookies), usable for any page of prose.
export const richTextBlock = defineType({
  name: 'richTextBlock',
  title: 'Rich Text',
  type: 'object',
  fields: [
    hiddenField,
    defineField({
      name: 'body',
      title: 'Text',
      description: 'English above, Swedish below. An empty Swedish text shows the English on /sv.',
      type: 'blockContent',
      options: { localize: true },
    }),
    spacingField,
  ],
  preview: {
    select: { body: 'body' },
    prepare: ({ body }) => {
      // The first line of the English text, so the list tells blocks apart.
      const first = (body?.en ?? body?.sv ?? []).find((b: { _type: string }) => b._type === 'block')
      const text = first?.children?.map((c: { text?: string }) => c.text ?? '').join('') ?? ''
      return { title: `Rich Text — ${text.slice(0, 60) || 'Empty'}` }
    },
  },
})
