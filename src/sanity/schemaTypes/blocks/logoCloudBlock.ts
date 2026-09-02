import { defineType, defineField, defineArrayMember } from 'sanity'

export const logoCloudBlock = defineType({
  name: 'logoCloudBlock',
  title: 'Logo Cloud',
  type: 'object',
  fields: [
    defineField({ name: 'heading', type: 'string' }),
    defineField({
      name: 'logos',
      title: 'Logos',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'name',
              title: 'Company name',
              type: 'string',
              validation: (Rule) => Rule.required().max(60),
            }),
          ],
          preview: { select: { title: 'name' } },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: 'heading', logos: 'logos' },
    prepare: ({ title, logos }) => ({
      title: `Logo Cloud — ${title || 'Untitled'}`,
      subtitle: `${logos?.length ?? 0} logos`,
    }),
  },
})
