import { defineType, defineField, defineArrayMember } from 'sanity'
import { hiddenField } from '../fields/hiddenField'

export const logoCloudBlock = defineType({
  name: 'logoCloudBlock',
  title: 'Logo Cloud',
  type: 'object',
  fields: [
    hiddenField,
    defineField({
      name: 'logos',
      title: 'Logos',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'client' }] })],
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
    select: { logos: 'logos' },
    prepare: ({ logos }) => ({
      title: 'Logo Cloud',
      subtitle: `${logos?.length ?? 0} logos`,
    }),
  },
})
