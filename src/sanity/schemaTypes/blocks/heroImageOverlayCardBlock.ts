import { defineType, defineField } from 'sanity'
import { hiddenField } from '../fields/hiddenField'

// Split out of heroBlock's `layout` options (was "imageOverlayCard")
// once it grew its own scroll-driven pin/morph interaction and two
// layout-specific fields — kept as its own block, same reasoning as
// heroBackdropBlock, so it can keep evolving without touching the
// stable Hero block or its simpler layout switch.
export const heroImageOverlayCardBlock = defineType({
  name: 'heroImageOverlayCardBlock',
  title: 'Hero — Image Overlay Card (experimental)',
  type: 'object',
  fields: [
    hiddenField,
    defineField({ name: 'eyebrow', type: 'string' }),
    defineField({
      name: 'headline',
      type: 'string',
      validation: (Rule) => Rule.required().max(80),
    }),
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
      name: 'cardBackground',
      title: 'Card background',
      type: 'string',
      options: {
        list: [
          { title: 'Dark (light text)', value: 'dark' },
          { title: 'Gradient (dark text)', value: 'gradient' },
        ],
        layout: 'radio',
      },
      initialValue: 'dark',
    }),
    defineField({
      name: 'cardWidth',
      title: 'Card width',
      description:
        'A fraction of the hero\'s own content width (capped at the page width), not the full screen.',
      type: 'string',
      options: {
        list: [
          { title: '50%', value: '50' },
          { title: '100%', value: '100' },
        ],
        layout: 'radio',
      },
      initialValue: '50',
    }),
    defineField({
      name: 'spacing',
      title: 'Section spacing',
      description: 'The gap below this block, before the next one. Loose unless a page needs tighter rhythm here.',
      type: 'string',
      options: {
        list: [
          { title: 'Loose (200px)', value: 'loose' },
          { title: 'Medium (120px)', value: 'medium' },
          { title: 'Tight (60px)', value: 'tight' },
        ],
        layout: 'radio',
      },
      initialValue: 'loose',
    }),
  ],
  preview: {
    select: { title: 'headline', cardBackground: 'cardBackground' },
    prepare: ({ title, cardBackground }) => ({
      title: `Hero — Image Overlay Card — ${title || 'Untitled'}`,
      subtitle: `Card background: ${cardBackground || 'dark'}`,
    }),
  },
})
