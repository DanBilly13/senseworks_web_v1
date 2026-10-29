import { defineType, defineField } from 'sanity'
import { hiddenField } from '../fields/hiddenField'
import { spacingField } from '../fields/spacingField'
import { bandFields } from '../fields/bandFields'

// A Statement beside a square image, 50/50 — Statement's big regular-
// weight text on one half, a 1:1 image on the other.
export const statementSplitBlock = defineType({
  name: 'statementSplitBlock',
  title: 'Statement Split',
  type: 'object',
  fields: [
    hiddenField,
    defineField({
      name: 'text',
      type: 'text',
      rows: 3,
      description: 'Press Enter for a line break.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'media',
      title: 'Media',
      description: 'Shown square (1:1) — a square image fills it without cropping.',
      type: 'media',
    }),
    defineField({
      name: 'imagePosition',
      title: 'Image position',
      type: 'string',
      options: {
        list: [
          { title: 'Left', value: 'left' },
          { title: 'Right', value: 'right' },
        ],
        layout: 'radio',
      },
      initialValue: 'left',
    }),
    ...bandFields(),
    spacingField,
  ],
  preview: {
    select: { text: 'text', position: 'imagePosition' },
    prepare: ({ text, position }) => {
      const value = typeof text === 'object' ? text?.en || text?.sv : text
      return { title: `Statement Split — ${value || 'Untitled'}`, subtitle: `Image ${position || 'left'}` }
    },
  },
})
