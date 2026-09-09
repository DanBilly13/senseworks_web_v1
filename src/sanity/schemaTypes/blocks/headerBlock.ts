import { defineType, defineField, defineArrayMember } from 'sanity'

export const headerBlock = defineType({
  name: 'headerBlock',
  title: 'Header',
  type: 'object',
  fields: [
    defineField({
      name: 'logoText',
      type: 'string',
      initialValue: 'senseworks',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'navLinks',
      title: 'Nav links',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'navItem',
          fields: [
            defineField({ name: 'label', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({
              name: 'href',
              type: 'string',
              description: 'Leave blank for a dropdown trigger — add Sub links below instead.',
            }),
            defineField({
              name: 'links',
              title: 'Sub links',
              type: 'array',
              description:
                'When set, this item renders as a dropdown instead of a plain link. A sub-link left without a URL renders as a disabled placeholder (for a section that is planned but not built yet).',
              of: [
                defineArrayMember({
                  type: 'object',
                  name: 'navSubLink',
                  fields: [
                    defineField({
                      name: 'label',
                      type: 'string',
                      validation: (Rule) => Rule.required(),
                    }),
                    defineField({ name: 'href', type: 'string' }),
                  ],
                  preview: {
                    select: { title: 'label', href: 'href' },
                    prepare: ({ title, href }) => ({ title, subtitle: href || 'No link yet' }),
                  },
                }),
              ],
            }),
          ],
          preview: {
            select: { title: 'label', href: 'href', links: 'links' },
            prepare: ({ title, href, links }) => ({
              title,
              subtitle: links?.length ? `Dropdown (${links.length})` : href,
            }),
          },
        }),
      ],
    }),
    defineField({ name: 'ctaLabel', type: 'string' }),
    defineField({ name: 'ctaHref', type: 'string' }),
  ],
  preview: {
    select: { title: 'logoText' },
    prepare: ({ title }) => ({ title: `Header — ${title || 'Untitled'}` }),
  },
})
