import { defineType, defineField, defineArrayMember } from 'sanity'

export const logoCloudBlock = defineType({
  name: 'logoCloudBlock',
  title: 'Logo Cloud',
  type: 'object',
  fields: [
    defineField({
      name: 'logos',
      title: 'Logos',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'client' }] })],
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
