import { defineType, defineField } from 'sanity'
import { hiddenField } from '../fields/hiddenField'
import { headlineSizeField } from '../fields/headlineSizeField'

export const heroBlock = defineType({
  name: 'heroBlock',
  title: 'Hero',
  type: 'object',
  fields: [
    hiddenField,
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          { title: 'Side-by-side (headline left, subtext right)', value: 'split' },
          { title: '50/50 split (text left, image right)', value: 'splitEven' },
          { title: 'Full-bleed image, text overlay bottom-left', value: 'imageOverlay' },
          {
            title: 'Scroll reveal — yellow block over fixed image/video (experimental)',
            value: 'scrollReveal',
          },
        ],
        layout: 'radio',
      },
      initialValue: 'split',
      validation: (Rule) => Rule.required(),
    }),
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
    defineField({
      name: 'subhead',
      type: 'text',
      rows: 2,
      validation: (Rule) => Rule.max(350),
    }),
    defineField({ name: 'ctaLabel', type: 'string' }),
    defineField({ name: 'ctaHref', type: 'string' }),
    defineField({ name: 'media', title: 'Media', type: 'media' }),
    defineField({
      name: 'mediaWidth',
      title: 'Media width',
      description: '"Scroll Reveal" layout only.',
      type: 'string',
      options: {
        list: [
          { title: 'Full screen width', value: 'full' },
          { title: 'Content width (capped, centered)', value: 'content' },
        ],
        layout: 'radio',
      },
      initialValue: 'full',
      hidden: ({ parent }) => parent?.layout !== 'scrollReveal',
    }),
  ],
  preview: {
    select: { title: 'headline', layout: 'layout' },
    prepare: ({ title, layout }) => ({
      title: `Hero — ${title || 'Untitled'}`,
      subtitle:
        layout === 'imageOverlay'
          ? 'Full-bleed image overlay'
          : layout === 'scrollReveal'
            ? 'Scroll reveal, yellow over fixed media'
            : layout === 'splitEven'
              ? '50/50 split'
              : 'Side-by-side',
    }),
  },
})
