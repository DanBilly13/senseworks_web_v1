import { defineType, defineField } from 'sanity'
import { hiddenField } from '../fields/hiddenField'
import { spacingField } from '../fields/spacingField'

export const releaseCardsBlock = defineType({
  name: 'releaseCardsBlock',
  title: 'Release Cards',
  type: 'object',
  fields: [
    hiddenField,
    defineField({
      name: 'columns',
      type: 'string',
      options: {
        list: [
          { title: '2 (default)', value: '2' },
          { title: '3', value: '3' },
          { title: '4', value: '4' },
        ],
        layout: 'radio',
      },
      initialValue: '2',
    }),
    spacingField,
    // The newest shipped releases (Release documents), not cards typed
    // here — the same releases the Releases page lists in full.
    defineField({
      name: 'count',
      title: 'How many',
      description: 'The newest shipped releases (edited under "Release" in Studio), newest first.',
      type: 'number',
      options: { list: [2, 3, 4, 6, 8], layout: 'radio', direction: 'horizontal' },
      initialValue: 4,
    }),
  ],
  preview: {
    select: { count: 'count' },
    prepare: ({ count }) => ({
      title: 'Release Cards',
      subtitle: `Latest ${count ?? 4} shipped releases`,
    }),
  },
})
