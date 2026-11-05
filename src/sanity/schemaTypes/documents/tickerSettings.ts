import { defineType, defineField, defineArrayMember } from 'sanity'

// The ticker tape: a thin strip above the top navigation, on every page,
// scrolling its parts slowly from right to left. Hovering stops it;
// clicking anywhere on it follows the link (by default, the Book a
// webinar form). English and Swedish side by side; an empty Swedish part
// falls back to English. A singleton — see the structure and the
// filters in sanity.config.ts.
export const tickerSettings = defineType({
  name: 'tickerSettings',
  title: 'Ticker tape',
  type: 'document',
  fields: [
    defineField({
      name: 'show',
      title: 'Show the ticker tape',
      description: 'Off hides it on every page.',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'parts',
      title: 'Parts',
      description: 'Shown in this order with a dot between them, repeated along the strip. Drag to reorder.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'en', title: 'English', type: 'string' }),
            defineField({ name: 'sv', title: 'Swedish', type: 'string' }),
            defineField({
              name: 'bold',
              title: 'Bold',
              description: 'Draws this part in bold, in the accent colour (e.g. the name of the event).',
              type: 'boolean',
              initialValue: false,
            }),
          ],
          options: { columns: 2 },
          preview: {
            select: { title: 'en', subtitle: 'sv', bold: 'bold' },
            prepare: ({ title, subtitle, bold }) => ({ title: `${title || 'Untitled'}${bold ? ' (bold)' : ''}`, subtitle }),
          },
        }),
      ],
    }),
    defineField({
      name: 'href',
      title: 'Link',
      description: '"#book-webinar" opens the Book a webinar form, "#book-meeting" the Book a meeting form. Or a page, e.g. "/pris".',
      type: 'string',
      initialValue: '#book-webinar',
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Ticker tape' }),
  },
})
