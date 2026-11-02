import { defineType, defineField } from 'sanity'
import { hiddenField } from '../fields/hiddenField'
import { headlineSizeField } from '../fields/headlineSizeField'

// Experimental Hero: a dark screen, the headline in the accent over a
// small faded image/video. Scrolling fades the text away while the
// media grows to fill the screen; then the page scrolls on as normal.
export const heroScrollZoomBlock = defineType({
  name: 'heroScrollZoomBlock',
  title: 'Hero — Scroll Zoom (experimental)',
  type: 'object',
  fields: [
    hiddenField,
    defineField({
      name: 'headline',
      // Text, not string, so Enter adds a line break (see SectionIntro).
      type: 'text',
      rows: 2,
      description: 'Press Enter for a line break.',
      validation: (Rule) => Rule.required().max(80),
    }),
    { ...headlineSizeField(), initialValue: 'display' },
    defineField({
      name: 'subhead',
      type: 'text',
      rows: 2,
      validation: (Rule) => Rule.max(350),
    }),
    defineField({ name: 'ctaLabel', title: 'Button label', type: 'string' }),
    defineField({ name: 'ctaHref', title: 'Button link', type: 'string' }),
    defineField({
      name: 'media',
      title: 'Media',
      description: 'The image or video that starts small and faded behind the text and grows to fill the screen.',
      type: 'media',
    }),
  ],
  preview: {
    select: { title: 'headline' },
    prepare: ({ title }) => ({
      title: `Hero — Scroll Zoom — ${typeof title === 'object' ? title?.en || title?.sv : title || 'Untitled'}`,
    }),
  },
})
