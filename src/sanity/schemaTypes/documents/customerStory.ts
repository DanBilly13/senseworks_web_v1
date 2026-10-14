import { defineType, defineField } from 'sanity'

// A customer story: the firm's case study card (shown on the Customer
// stories start page) plus the full story behind it, laid out like a
// Knowledge Bank article.
export const customerStory = defineType({
  name: 'customerStory',
  title: 'Customer story',
  type: 'document',
  groups: [
    { name: 'card', title: 'Card', default: true },
    { name: 'story', title: 'Story' },
  ],
  fields: [
    // Card
    defineField({
      name: 'companyName',
      title: 'Company name',
      type: 'string',
      group: 'card',
      validation: (Rule) => Rule.required().max(60),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      group: 'card',
      options: { source: 'companyName' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'logo', title: 'Logo', type: 'media', group: 'card', description: 'Shown instead of the company name when set.' }),
    defineField({ name: 'facts', type: 'string', group: 'card', description: 'e.g. "25 staff, six offices".' }),
    defineField({
      name: 'products',
      type: 'string',
      group: 'card',
      description: 'Which Senseworks products they use, e.g. "Audit" or "Audit + Analytics". Also the start page filters.',
    }),
    defineField({ name: 'quote', type: 'text', rows: 3, group: 'card', validation: (Rule) => Rule.max(220) }),
    defineField({ name: 'personName', title: 'Person name', type: 'string', group: 'card' }),
    defineField({ name: 'personRole', title: 'Person role', type: 'string', group: 'card' }),
    // Story
    defineField({
      name: 'title',
      type: 'string',
      group: 'story',
      description: "The story's headline. Leave empty to use the company name.",
    }),
    defineField({ name: 'subtitle', type: 'string', group: 'story' }),
    defineField({ name: 'coverImage', title: 'Cover image', type: 'image', group: 'story', options: { hotspot: true } }),
    defineField({
      name: 'publishedAt',
      type: 'datetime',
      group: 'story',
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),
    // Set by @sanity/document-internationalization — not hand-edited.
    defineField({ name: 'language', type: 'string', readOnly: true }),
    defineField({ name: 'body', type: 'blockContent', group: 'story' }),
  ],
  preview: {
    select: { title: 'companyName', subtitle: 'title', media: 'coverImage' },
  },
})
