import { defineType, defineField } from 'sanity'
import { hiddenField } from '../fields/hiddenField'
import { spacingField } from '../fields/spacingField'

// A carousel of Customer story cards. The cards aren't typed in here:
// they come from the Customer story documents, filtered by "Which
// stories", so each story is written once and shows wherever it fits.
export const caseStudyGridBlock = defineType({
  name: 'caseStudyGridBlock',
  title: 'Case Study Carousel',
  type: 'object',
  fields: [
    hiddenField,
    defineField({
      name: 'productFilter',
      title: 'Which stories',
      description:
        'Audit shows stories ticked Audit (including ones ticked both); Analytics likewise. All shows every story. Newest first.',
      type: 'string',
      options: {
        list: [
          { title: 'All (default)', value: 'all' },
          { title: 'Audit', value: 'audit' },
          { title: 'Analytics', value: 'analytics' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'all',
    }),
    defineField({
      name: 'tone',
      title: 'Card style',
      type: 'string',
      options: {
        list: [
          { title: 'Default (light)', value: 'default' },
          { title: 'Dark (black background, white text)', value: 'dark' },
        ],
        layout: 'radio',
      },
      initialValue: 'default',
    }),
    spacingField,
  ],
  preview: {
    select: { filter: 'productFilter' },
    prepare: ({ filter }) => ({
      title: 'Case Study Carousel',
      subtitle: filter === 'audit' ? 'Audit stories' : filter === 'analytics' ? 'Analytics stories' : 'All stories',
    }),
  },
})
