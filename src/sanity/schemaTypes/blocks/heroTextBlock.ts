import { defineType, defineField } from 'sanity'
import { hiddenField } from '../fields/hiddenField'
import { headlineSizeField } from '../fields/headlineSizeField'
import { typingHeadlineField } from '../fields/typingHeadlineField'

export const heroTextBlock = defineType({
  name: 'heroTextBlock',
  title: 'Hero — Text Only',
  type: 'object',
  fields: [
    hiddenField,
    defineField({ name: 'eyebrow', type: 'string' }),
    defineField({
      name: 'headline',
      // Text, not string, so Enter adds a line break (see SectionIntro).
      type: 'text',
      rows: 2,
      description: 'Press Enter for a line break.',
      validation: (Rule) => Rule.required().max(80),
    }),
    headlineSizeField(),
    typingHeadlineField(),
    defineField({
      name: 'subhead',
      type: 'text',
      rows: 2,
      validation: (Rule) => Rule.max(350),
    }),
    defineField({ name: 'ctaLabel', type: 'string' }),
    defineField({ name: 'ctaHref', type: 'string' }),
    defineField({
      name: 'boundary',
      title: 'Page-top hero',
      description:
        'On for the actual page-top hero (extra page-boundary padding). Turn off when this block is reused as a hero-style moment further down the page — it then uses the standard section spacing instead.',
      type: 'boolean',
      initialValue: true,
    }),
    // The same colours as CTA Banner, as a full-width background. Page
    // background (none) by default, so existing heroes are unchanged.
    defineField({
      name: 'tone',
      title: 'Background',
      description: 'On Dark, the eyebrow and button take the accent colour (the page theme\'s: yellow, Audit purple, Analytics green).',
      type: 'string',
      options: {
        list: [
          { title: 'None (the page background)', value: 'none' },
          { title: 'Light', value: 'default' },
          { title: 'Dark', value: 'inverse' },
          { title: 'Accent', value: 'accent' },
        ],
        layout: 'radio',
      },
      initialValue: 'none',
    }),
    // Optional, and empty by default, so every existing hero keeps its
    // page-boundary space. Tight when a list sits right underneath
    // (the Blog, Knowledge Bank and Customer stories pages).
    defineField({
      name: 'spaceBelow',
      title: 'Space below',
      description: 'Leave empty for the usual page-top space. Tight (60px) when the next block belongs with this intro, e.g. a list of posts.',
      type: 'string',
      options: {
        list: [
          { title: 'Medium (120px)', value: 'medium' },
          { title: 'Tight (60px)', value: 'tight' },
        ],
        layout: 'radio',
      },
    }),
  ],
  preview: {
    select: { title: 'headline' },
    prepare: ({ title }) => ({
      title: `Hero — Text Only — ${title || 'Untitled'}`,
    }),
  },
})
