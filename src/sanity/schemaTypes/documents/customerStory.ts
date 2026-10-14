import { defineType, defineField, defineArrayMember } from 'sanity'
import { blockContentMembers } from '../objects/blockContent'

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
    defineField({
      name: 'quote',
      title: 'Hero quote',
      type: 'text',
      rows: 3,
      group: 'card',
      description: 'Shown on the card, and as the big pull quote in the story (place it with a "Pull quote" item in the Body).',
      validation: (Rule) => Rule.max(220),
    }),
    defineField({ name: 'personName', title: 'Person name', type: 'string', group: 'card' }),
    defineField({ name: 'personRole', title: 'Person role', type: 'string', group: 'card' }),
    // Story
    defineField({
      name: 'title',
      type: 'string',
      group: 'story',
      description: "The story's headline. Leave empty to use the company name.",
    }),
    defineField({
      name: 'subtitle',
      title: 'Standfirst',
      type: 'text',
      rows: 3,
      group: 'story',
      description: 'The short summary under the headline, in larger type.',
    }),
    defineField({ name: 'location', type: 'string', group: 'story', description: 'For the "At a glance" box, e.g. "Northern Stockholm".' }),
    defineField({ name: 'companySize', title: 'Size', type: 'string', group: 'story', description: 'For the "At a glance" box, e.g. "A handful of staff".' }),
    defineField({ name: 'customerSince', title: 'Customer since', type: 'string', group: 'story', description: 'For the "At a glance" box, e.g. "Autumn 2024".' }),
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
    defineField({
      name: 'body',
      type: 'array',
      group: 'story',
      description: 'Add a "Pull quote" item where the Hero quote should appear, ideally about halfway down.',
      of: [
        ...blockContentMembers,
        defineArrayMember({
          name: 'pullQuote',
          title: 'Pull quote',
          type: 'object',
          // Sanity needs a field on an object type; the quote itself is
          // the story's Hero quote, so there's nothing to fill in here.
          fields: [
            defineField({
              name: 'note',
              type: 'string',
              readOnly: true,
              description: "Shows this story's Hero quote here, set large.",
            }),
          ],
          preview: { prepare: () => ({ title: 'Pull quote', subtitle: "The story's Hero quote, set large" }) },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: 'companyName', subtitle: 'title', media: 'coverImage' },
  },
})
