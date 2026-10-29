import { defineType, defineField } from 'sanity'
import { hiddenField } from '../fields/hiddenField'
import { spacingField } from '../fields/spacingField'
import { headlineSizeField } from '../fields/headlineSizeField'
import { typingHeadlineField } from '../fields/typingHeadlineField'

// Experimental Hero: one screen tall on the accent gradient, with the 3D
// Ally rising from the bottom edge behind the text, following the cursor.
// Its own block so it can be tried out (Home v3) or dropped freely.
export const heroAllyBlock = defineType({
  name: 'heroAllyBlock',
  title: 'Hero — Ally 3D (experimental)',
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
    defineField({ name: 'ctaLabel', title: 'Button label', type: 'string' }),
    defineField({ name: 'ctaHref', title: 'Button link', type: 'string' }),
    defineField({
      name: 'ctaNote',
      title: 'Button note',
      description: 'Small line of microcopy under the button.',
      type: 'string',
    }),
    {
      ...spacingField,
      initialValue: 'medium',
      description: 'The gap below this hero, before the next block.',
    },
  ],
  preview: {
    select: { title: 'headline' },
    prepare: ({ title }) => ({
      title: `Hero — Ally 3D — ${typeof title === 'object' ? title?.en || title?.sv : title || 'Untitled'}`,
    }),
  },
})
