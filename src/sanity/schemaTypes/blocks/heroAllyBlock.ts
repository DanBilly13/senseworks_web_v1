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
  title: 'Hero — Ally 3D',
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
      name: 'body',
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
    // The accent gradient she was designed on stays the default, so
    // existing heroes (none have a value) look as before.
    defineField({
      name: 'tone',
      title: 'Background',
      description: 'Behind the whole hero, Ally included. Dark and the dark accent gradient turn the text white and the button the accent colour.',
      type: 'string',
      options: {
        list: [
          { title: 'None', value: 'none' },
          { title: 'Light grey', value: 'light' },
          { title: 'Dark', value: 'dark' },
          { title: 'Accent', value: 'accent' },
          { title: 'Accent gradient', value: 'accentGradient' },
          { title: 'Dark accent gradient', value: 'accentDark' },
        ],
        layout: 'radio',
      },
      initialValue: 'accentGradient',
    }),
    defineField({
      name: 'align',
      title: 'Text alignment',
      description: 'Where the eyebrow, headline, body and button sit. Centred, the button sits over Ally on bigger screens.',
      type: 'string',
      options: {
        list: [
          { title: 'Left', value: 'left' },
          { title: 'Center', value: 'center' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'left',
    }),
    // Like Hero's full-bleed image layout (BlockRenderer pins it).
    defineField({
      name: 'pinned',
      title: 'Content scrolls over it',
      description: 'The hero, Ally included, stays put and the rest of the page scrolls up over it. Section spacing becomes the space at the top of what scrolls over.',
      type: 'boolean',
      initialValue: false,
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
