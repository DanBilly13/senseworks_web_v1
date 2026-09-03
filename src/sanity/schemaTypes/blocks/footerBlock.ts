import { defineType, defineField, defineArrayMember } from 'sanity'

export const footerBlock = defineType({
  name: 'footerBlock',
  title: 'Footer',
  type: 'object',
  fields: [
    defineField({
      name: 'linkColumns',
      title: 'Link columns',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              type: 'string',
              validation: (Rule) => Rule.required().max(40),
            }),
            defineField({
              name: 'links',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'object',
                  fields: [
                    defineField({
                      name: 'label',
                      type: 'string',
                      validation: (Rule) => Rule.required().max(40),
                    }),
                    defineField({
                      name: 'href',
                      type: 'string',
                      validation: (Rule) => Rule.required(),
                    }),
                  ],
                  preview: { select: { title: 'label' } },
                }),
              ],
            }),
          ],
          preview: { select: { title: 'title' } },
        }),
      ],
    }),
    defineField({
      name: 'newsletterHeading',
      title: 'Newsletter heading',
      type: 'string',
    }),
    defineField({
      name: 'newsletterPlaceholder',
      title: 'Newsletter input placeholder',
      type: 'string',
      initialValue: 'you@company.com',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social links',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'platform',
              type: 'string',
              options: {
                list: [
                  { title: 'X', value: 'x' },
                  { title: 'LinkedIn', value: 'linkedin' },
                  { title: 'GitHub', value: 'github' },
                  { title: 'YouTube', value: 'youtube' },
                  { title: 'Instagram', value: 'instagram' },
                ],
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'href',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: { select: { title: 'platform' } },
        }),
      ],
    }),
    defineField({
      name: 'legalLinks',
      title: 'Legal links',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'label',
              type: 'string',
              validation: (Rule) => Rule.required().max(40),
            }),
            defineField({
              name: 'href',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: { select: { title: 'label' } },
        }),
      ],
    }),
    defineField({
      name: 'copyrightText',
      type: 'string',
      validation: (Rule) => Rule.max(120),
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Footer' }),
  },
})
