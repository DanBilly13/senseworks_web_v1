import { defineType, defineField, defineArrayMember } from 'sanity'
import { hiddenField } from '../fields/hiddenField'
import { spacingField } from '../fields/spacingField'

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
    spacingField,
  ],
  preview: {
    select: { logos: 'logos' },
    prepare: ({ logos }) => ({
      title: 'Logo Cloud',
      subtitle: `${logos?.length ?? 0} logos`,
    }),
  },
})
